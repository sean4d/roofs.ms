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
 * ONE LEAD, TWO AUDIENCES. The office wants to hear about every enquiry. The
 * CRM should only ever see instant estimates, so it stays a pipeline of people
 * who asked for a price. LEAD_ROOFR_EMAIL carries that second audience and
 * recipientsFor() decides who is on a given lead.
 */

export interface Lead {
  /** "free-inspection", "contact", or "commercial-consultation" */
  source: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
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

/**
 * The only lead source that should reach the CRM.
 *
 * The owner wants Roofr to hold instant-estimate leads and nothing else, so
 * that it stays a pipeline of people who asked for a price rather than a dump
 * of every form on the site.
 */
const CRM_SOURCE = "instant-estimate";

const addressList = (value: string | null | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

/**
 * Who gets told about this lead.
 *
 * LEAD_NOTIFY_EMAIL is the office, and hears about everything.
 * LEAD_ROOFR_EMAIL is the Zapier Email Parser mailbox that creates the Roofr
 * job, and hears only about instant estimates.
 *
 * THE SPLIT IS DONE HERE BECAUSE ZAPIER WILL NOT DO IT. The obvious place for
 * this rule is a Filter step in the Zap, and that is where it was put. Filter
 * is a paid Zapier feature, so adding it disabled the whole Zap the moment the
 * trial ended and leads stopped reaching Roofr altogether. A rule this simple
 * is not worth a subscription, and it is more reliable here anyway: it cannot
 * be switched off by a billing event.
 *
 * The parser address is also SUBTRACTED from the office list, so it makes no
 * difference whether it is still sitting in LEAD_NOTIFY_EMAIL from before. Two
 * environment variables that have to agree with each other is a trap, and the
 * failure mode is silent: every lead would keep going to Roofr and nobody
 * would notice until the pipeline was full of them.
 */
function recipientsFor(lead: Lead): string[] {
  const crm = addressList(process.env.LEAD_ROOFR_EMAIL);
  const crmSet = new Set(crm.map((a) => a.toLowerCase()));

  const office = addressList(
    process.env.LEAD_NOTIFY_EMAIL ?? siteConfig.email,
  ).filter((a) => !crmSet.has(a.toLowerCase()));

  // The office must never end up with nobody on it because of the filtering
  // above. A lead that reaches only the CRM is a lead no human has read.
  const fallback = office.length ? office : addressList(siteConfig.email);

  return lead.source === CRM_SOURCE ? [...fallback, ...crm] : fallback;
}

async function sendEmail(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const recipients = recipientsFor(lead);
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
    lead.service ? `, ${lead.service}` : null,
    lead.storm ? "(storm/insurance)" : null,
    lead.message ? `, ${lead.message.replace(/\s+/g, " ").trim()}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const lines = [
    `Source: ${lead.source}${lead.page ? ` (${lead.page})` : ""}`,
    `Details: ${details}`,
    `Name: ${lead.name}`,
    `First name: ${firstName}`,
    `Last name: ${lastName}`,
    `Phone: ${lead.phone}`,
    lead.email && `Email: ${lead.email}`,
    lead.company && `Company: ${lead.company}`,
    lead.role && `Role: ${lead.role}`,
    lead.propertyType && `Property type: ${lead.propertyType}`,
    lead.city && `City/ZIP: ${lead.city}`,
    lead.address && `Address: ${lead.address}`,
    lead.service && `Service: ${lead.service}`,
    lead.preference && `Estimate preference: ${lead.preference}`,
    lead.roofType && `Roof type: ${lead.roofType}`,
    lead.squareFootage && `Approx. square footage: ${lead.squareFootage}`,
    lead.timeline && `Timeline: ${lead.timeline}`,
    lead.storm !== undefined &&
      `Storm damage / insurance: ${lead.storm ? "YES" : "no"}`,
    lead.preferredTime && `Preferred time: ${lead.preferredTime}`,
    lead.message && `\nMessage:\n${lead.message}`,
  ].filter(Boolean);

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
