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

async function sendLeadEmail(lead: Lead): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key)
    return { ok: false, skipped: true, detail: "RESEND_API_KEY not set" };

  const to = process.env.LEAD_NOTIFY_EMAIL ?? siteConfig.email;
  if (!to)
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
        to: [to],
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
  return `New quote request: ${lead.name}${value}`;
}

/** Plain text so it is readable on a phone at the top of the inbox. */
function plainTextBody(lead: Lead): string {
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

  add("Name", lead.name);
  add("Email", lead.email);
  add("Phone", lead.phone);
  add("Address", lead.address);
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

  if (lead.notes) lines.push("", "NOTES", lead.notes);

  if (lead.attachments?.length) {
    lines.push("", `ATTACHMENTS (${lead.attachments.length})`, "");
    for (const file of lead.attachments) {
      lines.push(
        file.url
          ? `${file.name} - ${file.url}`
          : `${file.name} (upload storage not configured; ask the customer to resend)`,
      );
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
