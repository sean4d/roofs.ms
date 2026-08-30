import "server-only";

import { siteConfig } from "@/config/site";

import { sendToRoofr, type DeliveryResult } from "./roofr";
import type { Lead } from "./types";

/**
 * Lead delivery.
 *
 * Fan out to every configured channel and succeed if ANY of them accepts the
 * lead. A lead that reaches the office by email but not the CRM is a minor
 * annoyance; a lead that reaches nothing is lost revenue, so the caller only
 * sees a failure when every channel failed.
 *
 * Channels, in order of preference:
 *   1. Roofr CRM        needs ROOFR_WEBHOOK_URL
 *   2. Email via Resend needs RESEND_API_KEY
 *   3. Generic webhook  needs LEAD_WEBHOOK_URL (Make/Zapier catch hook)
 */

export interface DeliverySummary {
  ok: boolean;
  channels: Record<string, DeliveryResult>;
}

export async function deliverLead(lead: Lead): Promise<DeliverySummary> {
  const [roofr, email, webhook] = await Promise.all([
    sendToRoofr(lead),
    sendLeadEmail(lead),
    sendGenericWebhook(lead),
  ]);

  const channels = { roofr, email, webhook };
  const attempted = Object.values(channels).filter((c) => !c.skipped);

  return {
    // No channel configured at all is a configuration failure, not a success.
    ok: attempted.length > 0 && attempted.some((c) => c.ok),
    channels,
  };
}

async function sendGenericWebhook(lead: Lead): Promise<DeliveryResult> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url)
    return { ok: false, skipped: true, detail: "LEAD_WEBHOOK_URL not set" };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok
      ? { ok: true }
      : { ok: false, detail: `HTTP ${response.status}` };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Webhook error",
    };
  }
}

const addressList = (value: string | null | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

/**
 * Who gets told about this lead.
 *
 * LEAD_NOTIFY_EMAIL is the office. LEAD_ROOFR_EMAIL is a mailbox a machine
 * watches, typically a Zapier Email Parser inbox that turns the mail into a
 * Roofr job. Both accept a comma-separated list.
 *
 * This is the arrangement the roofing site already runs, and it exists
 * because Zapier's webhook trigger is a paid app while the Email Parser is
 * free: the CRM hand-off rides on an email the office was getting anyway.
 *
 * The parser address is SUBTRACTED from the office list, so it does not
 * matter if it is also sitting in LEAD_NOTIFY_EMAIL. Two variables that must
 * agree with each other is a trap. The office can never end up empty as a
 * result of that subtraction: a lead only a machine has read is a lead no
 * human has read.
 */
function recipientsFor(): string[] {
  const crm = addressList(process.env.LEAD_ROOFR_EMAIL);
  const crmSet = new Set(crm.map((address) => address.toLowerCase()));

  const office = addressList(
    process.env.LEAD_NOTIFY_EMAIL ?? siteConfig.email,
  ).filter((address) => !crmSet.has(address.toLowerCase()));

  const humans = office.length ? office : addressList(siteConfig.email);

  return [...humans, ...crm];
}

async function sendLeadEmail(lead: Lead): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key)
    return { ok: false, skipped: true, detail: "RESEND_API_KEY not set" };

  const to = recipientsFor();
  if (!to.length)
    return { ok: false, skipped: true, detail: "No notification address" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.LEAD_FROM_EMAIL ??
          "Southeast Lights <leads@southeastlights.llc>",
        to,
        reply_to: lead.email,
        subject: subjectFor(lead),
        text: plainTextBody(lead),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok
      ? { ok: true }
      : { ok: false, detail: `Resend ${response.status}` };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Email error",
    };
  }
}

function subjectFor(lead: Lead): string {
  if (lead.kind === "commercial") {
    return `Commercial proposal request: ${lead.organization} (${lead.propertyType})`;
  }
  const value = lead.estimate?.total
    ? ` ~$${Math.round(lead.estimate.total).toLocaleString("en-US")}`
    : "";
  return `New quote request: ${lead.firstName} ${lead.lastName}${value}`;
}

/** Plain text so it is readable on a phone at the top of the inbox. */
/**
 * Exported so scripts/test-crm-block.mjs can assert the CRM block keeps the
 * same shape for every lead. That block is parsed by position, so a test is
 * the only thing standing between an innocent-looking edit and a week of
 * job cards landing with the phone number in the postcode field.
 */
export function plainTextBody(lead: Lead): string {
  const lines: string[] = [];
  const add = (label: string, value?: string | number | null) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      lines.push(`${label}: ${value}`);
    }
  };

  if (lead.kind === "commercial") {
    lines.push("COMMERCIAL PROPOSAL REQUEST", "");
    add("Organization", lead.organization);
    add("Property type", lead.propertyType);
    add("Community", lead.communityName);
    add("Buildings", lead.buildingCount);
  } else {
    lines.push("RESIDENTIAL QUOTE REQUEST", "");
  }

  add("Name", `${lead.firstName} ${lead.lastName}`);
  add("Email", lead.email);
  add("Phone", lead.phone);
  add("Address", `${lead.address}, ${lead.city}, ${lead.state} ${lead.postal}`);
  add("Budget", lead.budget);

  if (lead.kind === "residential") {
    add("Services", lead.services.join(", "));
    if (lead.estimate?.total) {
      lines.push("", "ESTIMATOR", "");
      add(
        "Estimated total",
        `$${Math.round(lead.estimate.total).toLocaleString("en-US")}`,
      );
      add(
        "Roofline",
        lead.estimate.roofFt ? `${lead.estimate.roofFt} ft` : undefined,
      );
      add("Color", lead.estimate.colorScheme);
      for (const [key, value] of Object.entries(
        lead.estimate.selections ?? {},
      )) {
        add(`  ${key}`, String(value));
      }
    }
  } else {
    add("Categories", lead.projectCategories.join(", "));
    add("Desired completion", lead.desiredCompletion);
    add("Electrical", lead.electrical);
    add("Site access", lead.siteAccess);
  }

  /*
   * EVERY LINE, EVERY TIME, IN THE SAME ORDER.
   *
   * This block used to use `add`, which drops a line whose value is empty.
   * That reads better to a human and is exactly wrong for the machine on the
   * other end. Zapier's Email Parser learns field positions from a single
   * training email: teach it on a lead that had every field, and the next
   * lead missing one shifts every field below it up a line. Roofr then reads
   * the phone number out of the postcode box, or the step fails outright.
   *
   * That is what the owner hit on 2026-08-30. A lead submitted without a last
   * name dropped a line here, and Zapier reported the last name missing on a
   * lead that had one. The roofing site had already been bitten by the same
   * thing and fixed it the same way; this is that fix, ported.
   *
   * So a field with no value prints as an empty string after its label. The
   * block is the same height and the same order for every lead, which is the
   * only thing that makes positional parsing safe.
   *
   * CHANGING THIS LIST BREAKS THE PARSER TEMPLATE. Add a field in the middle
   * and everything below it moves. Append at the end, and retrain the
   * template in Zapier when you do.
   *
   * Placed before NOTES so free text a customer wrote can never land inside
   * it and be read as a field.
   */
  const field = (label: string, value: unknown) =>
    lines.push(
      `${label}: ${value === undefined || value === null || value === false ? "" : String(value)}`,
    );

  lines.push("", "CRM FIELDS", "");
  field("First name", lead.firstName);
  field("Last name", lead.lastName);
  field("Street", lead.address);
  field("City", lead.city);
  field("State", lead.state);
  field("ZIP", lead.postal);
  field("Country", "United States");

  if (lead.notes) lines.push("", "NOTES", lead.notes);

  if (lead.attachments?.length) {
    /*
     * Filename and link on separate lines, blank line between entries.
     *
     * Signed storage URLs are around five hundred characters and end in a
     * JWT, and mail clients auto-link plain text by scanning for something
     * URL-shaped. Put "name - url" on one line each and the linkifier runs
     * the end of one URL into the start of the next filename, producing a
     * link that 400s while the file behind it is perfectly fine. A URL
     * alone on its own line, with a blank line after it, has nothing
     * adjacent to swallow.
     */
    lines.push("", `ATTACHMENTS (${lead.attachments.length})`, "");
    for (const file of lead.attachments) {
      lines.push(file.name);
      lines.push(
        file.url ??
          "  (upload storage not configured; ask the customer to resend)",
      );
      lines.push("");
    }
  }

  const a = lead.attribution;
  if (a && Object.values(a).some(Boolean)) {
    lines.push("", "ATTRIBUTION", "");
    add("Page", a.pageUrl);
    add("Landing page", a.landingPage);
    add("Referrer", a.referrer);
    add("Source", a.utmSource);
    add("Medium", a.utmMedium);
    add("Campaign", a.utmCampaign);
    add("Content", a.utmContent);
    add("Term", a.utmTerm);
    add("gclid", a.gclid);
  }

  return lines.join("\n");
}
