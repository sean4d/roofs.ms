import "server-only";

import { siteConfig } from "@/config/site";

/**
 * Lead delivery service (PRD Phase 1, adapter pattern, no hardcoded
 * destinations). Every submission fans out to all configured transports:
 *
 * 1. Webhook (LEAD_WEBHOOK_URL), point at Make.com, Zapier, or a Roofr
 *    endpoint; the JSON body is flat so no-code tools map fields easily.
 * 2. Email (RESEND_API_KEY + LEAD_NOTIFY_EMAIL): notification via the
 *    Resend REST API; falls back to siteConfig.email as the recipient.
 *
 * If NO transport is configured the submission fails loudly (the form
 * tells the visitor to call). A lead must never silently vanish.
 *
 * ONE LEAD, TWO DESTINATIONS. LEAD_NOTIFY_EMAIL is the office inbox and
 * LEAD_ROOFR_EMAIL is the Zapier Email Parser mailbox that creates the Roofr
 * job. Both receive every lead: every form on the site is somebody worth a job
 * card. Rep estimates from /pin are the ones that stay out of the CRM, and
 * they do so by never calling deliverLead at all.
 */

export interface Lead {
  /** "free-inspection", "contact", or "commercial-consultation" */
  source: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  /**
   * Two-letter state and postcode, kept apart from `city` because Roofr
   * requires all three as separate fields and will not split a string for us.
   * Forms that only ask for "city or ZIP" still fill `city` alone.
   */
  state?: string;
  postal?: string;
  address?: string;
  service?: string;
  /** Customer indicated storm damage / insurance claim involvement */
  storm?: boolean;
  /** How they want the estimate handled, e.g. emailed ballpark vs on-site
   *  measure. Set by request pages that offer the choice. */
  preference?: string;
  preferredTime?: string;
  message?: string;
  /** Page path the lead came from, for attribution */
  page?: string;
  /* Commercial consultation fields (PRD §4.2, "commercial" tagging) */
  company?: string;
  role?: string;
  propertyType?: string;
  roofType?: string;
  squareFootage?: string;
  timeline?: string;
}

interface DeliveryResult {
  delivered: boolean;
  transports: string[];
}

async function sendWebhook(lead: Lead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...lead,
      // Note: keep metadata keys distinct from Lead fields, lead.company
      // is the customer's organization and must never be clobbered.
      brand: siteConfig.name,
      submittedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`);
  return true;
}

const addressList = (value: string | null | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

/**
 * Who gets told about this lead.
 *
 * LEAD_NOTIFY_EMAIL is the office. LEAD_ROOFR_EMAIL is the Zapier Email Parser
 * mailbox that creates the Roofr job. BOTH GET EVERY LEAD, because every form
 * on the site is somebody worth a job card and always has been.
 *
 * THIS BRIEFLY FILTERED BY SOURCE AND THAT WAS A MISREADING. The owner asked
 * that rep estimates from /pin stay out of Roofr while website leads go in. I
 * read it as "instant estimates only" and gated this on the source, which
 * stopped free inspections creating job cards, a thing they had always done.
 * The requirement he actually stated needs no code at all: /pin saves through
 * saveQuote and never calls deliverLead, so a rep estimate cannot reach Roofr
 * by any route. The only way in is a website form, and every website form
 * belongs there.
 *
 * Two addresses rather than one comma-separated list because the destinations
 * mean different things: one is a person's inbox, the other is a machine that
 * parses. Keeping them apart means a change to one cannot silently reroute the
 * other, and the parser address is SUBTRACTED from the office list, so it does
 * not matter if it is still sitting in LEAD_NOTIFY_EMAIL from before. Two
 * variables that must agree with each other is a trap.
 */
function recipientsFor(): string[] {
  const crm = addressList(process.env.LEAD_ROOFR_EMAIL);
  const crmSet = new Set(crm.map((a) => a.toLowerCase()));

  const office = addressList(
    process.env.LEAD_NOTIFY_EMAIL ?? siteConfig.email,
  ).filter((a) => !crmSet.has(a.toLowerCase()));

  // The office must never end up with nobody on it because of the subtraction
  // above. A lead that reaches only the CRM is a lead no human has read.
  const fallback = office.length ? office : addressList(siteConfig.email);

  return [...fallback, ...crm];
}

async function sendEmail(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const recipients = recipientsFor();
  if (!recipients.length) return false;

  // Split the full name so an email parser can map Roofr's required
  // First Name / Last Name fields directly (last name falls back to first
  // when only one word is given, so Roofr's required field is never blank).
  const [firstName, ...restName] = lead.name.trim().split(/\s+/);
  const lastName = restName.join(" ") || firstName;

  // Single-line summary for the CRM's "Details/notes" field: bundles the
  // context (service, storm flag, message) so a parser can map it in one shot.
  const details = [
    `Website ${lead.source} lead`,
    lead.service,
    lead.storm ? "(storm/insurance)" : null,
    lead.message?.replace(/\s+/g, " ").trim(),
  ]
    .filter(Boolean)
    // Joined here rather than by pasting a comma onto the front of each piece,
    // which produced "Website instant-estimate lead , Website Instant Estimate"
    // with the space on the wrong side of the comma.
    .join(", ");

  /**
   * EVERY LINE, EVERY TIME, IN THE SAME ORDER.
   *
   * This body used to drop any line whose value was empty, which reads better
   * to a human and is exactly wrong for the machine on the other end. Zapier's
   * Email Parser learns positions from one training email: teach it on a lead
   * that had an email address and a city, and the next lead without one shifts
   * every field below it up a line. Roofr then gets the phone number in the
   * postcode box, or the step fails outright.
   *
   * That is precisely what the owner hit on 2026-08-29. An instant estimate
   * carried no City/ZIP line and Zapier warned that city and postcode were
   * missing. A free inspection submitted without an email address dropped the
   * Email line and Zapier warned the email was missing. Adding the email back
   * changed the shape a third time and no Roofr job was created at all. Three
   * different symptoms, one cause: the shape of this block was not stable.
   *
   * So a field with no value prints as an empty string after its label. The
   * block is the same height and the same order for every lead on the site,
   * which is the only thing that makes positional parsing safe.
   *
   * A consequence worth knowing: CHANGING THIS LIST BREAKS THE PARSER
   * TEMPLATE. Add a field in the middle and every field below it moves. Add
   * new ones at the end, and retrain the template when you do.
   */
  const field = (label: string, value: unknown) =>
    `${label}: ${value === undefined || value === null || value === false ? "" : String(value)}`;

  const lines = [
    field("Source", `${lead.source}${lead.page ? ` (${lead.page})` : ""}`),
    field("Details", details),
    field("Name", lead.name),
    field("First name", firstName),
    field("Last name", lastName),
    field("Phone", lead.phone),
    field("Email", lead.email),
    field("Company", lead.company),
    field("Role", lead.role),
    field("Property type", lead.propertyType),
    field("City", lead.city),
    field("State", lead.state),
    field("ZIP", lead.postal),
    field("Address", lead.address),
    field("Service", lead.service),
    field("Estimate preference", lead.preference),
    field("Roof type", lead.roofType),
    field("Approx. square footage", lead.squareFootage),
    field("Timeline", lead.timeline),
    field(
      "Storm damage / insurance",
      lead.storm === undefined ? "" : lead.storm ? "YES" : "no",
    ),
    field("Preferred time", lead.preferredTime),
    field("Country", "US"),
    // Last on purpose. A message is the only free-text field and the only one
    // that can run to several lines, so anything after it would be unfindable.
    field("Message", (lead.message ?? "").replace(/\s+/g, " ").trim()),
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Website Leads <leads@${new URL(siteConfig.url).hostname}>`,
      to: recipients,
      reply_to: lead.email,
      subject: `New lead: ${lead.name}, ${lead.service ?? lead.source}${lead.storm ? " (storm/insurance)" : ""}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}

export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const attempts: Array<[string, Promise<boolean>]> = [
    ["webhook", sendWebhook(lead)],
    ["email", sendEmail(lead)],
  ];

  const transports: string[] = [];
  for (const [name, attempt] of attempts) {
    try {
      if (await attempt) transports.push(name);
    } catch (error) {
      console.error(`[leads] ${name} transport failed:`, error);
    }
  }

  // Always leave a trace in server logs. The last line of defense.
  console.log(
    `[leads] ${lead.source} lead from ${lead.name} (${lead.phone}), delivered via: ${transports.join(", ") || "NONE"}`,
  );

  return { delivered: transports.length > 0, transports };
}
