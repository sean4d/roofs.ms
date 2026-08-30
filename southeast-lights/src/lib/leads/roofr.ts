import "server-only";

import type { Lead } from "./types";

/**
 * Roofr CRM adapter.
 *
 * STATUS: NOT CONNECTED. Roofr does not publish a public lead-intake API that
 * we can integrate against without credentials, and inventing an endpoint
 * would produce a pipeline that silently drops leads. So this adapter is
 * written, typed and wired into the delivery chain, and it no-ops safely
 * until it is configured.
 *
 * To connect, set both:
 *   ROOFR_WEBHOOK_URL   the intake endpoint (a Roofr-supplied webhook, or a
 *                       Zapier/Make hook that creates the Roofr lead)
 *   ROOFR_API_KEY       optional; sent as a Bearer token when present
 *
 * With neither set, delivery falls through to email and the lead is never
 * lost. That fallback is the point: email delivery is the guarantee, Roofr is
 * the convenience.
 */

export interface DeliveryResult {
  ok: boolean;
  skipped?: boolean;
  detail?: string;
}

export function roofrConfigured(): boolean {
  return Boolean(process.env.ROOFR_WEBHOOK_URL);
}

export async function sendToRoofr(lead: Lead): Promise<DeliveryResult> {
  const url = process.env.ROOFR_WEBHOOK_URL;
  if (!url)
    return { ok: false, skipped: true, detail: "ROOFR_WEBHOOK_URL not set" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.ROOFR_API_KEY
          ? { authorization: `Bearer ${process.env.ROOFR_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(toRoofrPayload(lead)),
      signal: AbortSignal.timeout(10_000),
    });

    return response.ok
      ? { ok: true }
      : { ok: false, detail: `Roofr responded ${response.status}` };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Unknown Roofr error",
    };
  }
}

/** Flatten our lead into a generic CRM shape most intakes accept. */
function toRoofrPayload(lead: Lead) {
  const base = {
    source: "southeastlights.llc",
    submittedAt: new Date().toISOString(),
    leadType: lead.kind,
    firstName: lead.firstName,
    lastName: lead.lastName,
    name: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone,
    address: lead.address,
    attribution: lead.attribution ?? {},
    attachments: lead.attachments ?? [],
  };

  return lead.kind === "residential"
    ? {
        ...base,
        services: lead.services,
        budget: lead.budget,
        notes: lead.notes,
        estimate: lead.estimate,
      }
    : {
        ...base,
        organization: lead.organization,
        propertyType: lead.propertyType,
        communityName: lead.communityName,
        buildingCount: lead.buildingCount,
        projectCategories: lead.projectCategories,
        desiredCompletion: lead.desiredCompletion,
        budget: lead.budget,
        electrical: lead.electrical,
        siteAccess: lead.siteAccess,
        notes: lead.notes,
      };
}
