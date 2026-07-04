import "server-only";

import { siteConfig } from "@/config/site";

/**
 * Lead delivery service (PRD Phase 1 — adapter pattern, no hardcoded
 * destinations). Every submission fans out to all configured transports:
 *
 * 1. Webhook (LEAD_WEBHOOK_URL) — point at Make.com, Zapier, or a Roofr
 *    endpoint; the JSON body is flat so no-code tools map fields easily.
 * 2. Email (RESEND_API_KEY + LEAD_NOTIFY_EMAIL) — notification via the
 *    Resend REST API; falls back to siteConfig.email as the recipient.
 *
 * If NO transport is configured the submission fails loudly (the form
 * tells the visitor to call) — a lead must never silently vanish.
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
  preferredTime?: string;
  message?: string;
  /** Page path the lead came from, for attribution */
  page?: string;
  /* Commercial consultation fields (PRD §4.2 — "commercial" tagging) */
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
      // Note: keep metadata keys distinct from Lead fields — lead.company
      // is the customer's organization and must never be clobbered.
      brand: siteConfig.name,
      submittedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`);
  return true;
}

async function sendEmail(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL ?? siteConfig.email;
  if (!apiKey || !to) return false;

  const lines = [
    `Source: ${lead.source}${lead.page ? ` (${lead.page})` : ""}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email && `Email: ${lead.email}`,
    lead.company && `Company: ${lead.company}`,
    lead.role && `Role: ${lead.role}`,
    lead.propertyType && `Property type: ${lead.propertyType}`,
    lead.city && `City/ZIP: ${lead.city}`,
    lead.address && `Address: ${lead.address}`,
    lead.service && `Service: ${lead.service}`,
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
      to: [to],
      reply_to: lead.email,
      subject: `New lead: ${lead.name} — ${lead.service ?? lead.source}${lead.storm ? " (storm/insurance)" : ""}`,
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

  // Always leave a trace in server logs — the last line of defense.
  console.log(
    `[leads] ${lead.source} lead from ${lead.name} (${lead.phone}) — delivered via: ${transports.join(", ") || "NONE"}`,
  );

  return { delivered: transports.length > 0, transports };
}
