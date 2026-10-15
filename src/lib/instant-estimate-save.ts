import "server-only";

import type { Lead } from "@/lib/leads";
import {
  newLeadId,
  newPublicToken,
  type RoofgoLead,
  type SendOutcome,
} from "@/lib/roofgo-lead";

/**
 * What happens to an instant estimate after the roof is measured: the
 * homeowner's email, the lead email and Zapier, and the RoofGo copy.
 *
 * Pulled out of the route so it can be tested with every outside call
 * replaced. The order and the content of the first two are exactly what the
 * route did when it saved to /pin:
 *
 *   1. the homeowner's link is minted (now here, not by a /pin insert),
 *   2. the homeowner is emailed it (only when there is a price),
 *   3. the lead goes to the office and Zapier, measured or not, with the same
 *      fields and the same "Estimate link:" line,
 *   4. and, new, the RoofGo copy is saved at the same time as step 3, through
 *      its outbox. Step 3 never waits on RoofGo and never fails because of it.
 */

export interface MeasuredFigures {
  squares: number;
  pitchDegrees: number | null;
  planes: number;
  imageryDate: string | null;
}

export interface EstimateRecordInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  point: {
    formatted: string;
    lat: number;
    lon: number;
    city?: string | null;
    state?: string | null;
    postal?: string | null;
  };
  options: { material: string; stories: number };
  /** Null when the roof could not be measured. */
  measured: MeasuredFigures | null;
  price: number | null;
  monthly: number | null;
  rateCard: unknown;
}

export interface EstimateRecordDeps {
  baseUrl: () => string;
  emailEstimate: (args: {
    to: string;
    name: string;
    address: string;
    price: number;
    squares: number;
    url: string;
  }) => Promise<boolean>;
  deliverLead: (lead: Lead) => Promise<unknown>;
  saveLead: (lead: RoofgoLead) => Promise<SendOutcome>;
  now?: () => Date;
}

export async function recordInstantEstimate(
  input: EstimateRecordInput,
  deps: EstimateRecordDeps,
): Promise<{ url: string | null; roofgo: SendOutcome | null }> {
  const { point, options, measured, price } = input;
  const fullName = `${input.firstName} ${input.lastName}`;
  const createdAt = (deps.now?.() ?? new Date()).toISOString();

  let url: string | null = null;
  let roofgoLead: RoofgoLead | null = null;
  if (measured && price) {
    try {
      const publicToken = newPublicToken();
      url = `${deps.baseUrl()}/estimate/${publicToken}`;
      let emailedTo: string | null = null;
      try {
        if (
          await deps.emailEstimate({
            to: input.email,
            name: fullName,
            address: point.formatted,
            price,
            squares: measured.squares,
            url,
          })
        )
          emailedTo = input.email;
      } catch (error) {
        // A failed send must not cost us the lead or the answer on screen.
        console.error("[instant-estimate] save/send failed", error);
      }
      roofgoLead = {
        leadId: newLeadId(),
        createdAt,
        publicToken,
        name: fullName,
        email: input.email,
        phone: input.phone,
        address: point.formatted,
        city: point.city || null,
        state: point.state || null,
        postal: point.postal || null,
        lat: point.lat,
        lon: point.lon,
        squares: measured.squares,
        pitchDegrees: measured.pitchDegrees,
        planes: measured.planes,
        imageryDate: measured.imageryDate,
        material: options.material,
        stories: options.stories,
        priceShown: price,
        monthlyLow: input.monthly ?? 0,
        monthlyHigh: input.monthly ?? 0,
        rateCard: input.rateCard,
        emailedTo,
      };
    } catch (error) {
      console.error("[instant-estimate] save/send failed", error);
    }
  }

  // RoofGo, in parallel with the lead below, and never allowed to throw.
  const roofgo: Promise<SendOutcome | null> = roofgoLead
    ? deps.saveLead(roofgoLead).catch((error: unknown) => {
        console.error("[instant-estimate] RoofGo save failed", error);
        return {
          ok: false as const,
          retry: true,
          error: String(error),
        };
      })
    : Promise.resolve(null);

  // The lead goes out either way. Somebody whose roof we could not see has
  // still handed us their phone number.
  const lead = (async () => {
    try {
      await deps.deliverLead({
        source: "instant-estimate",
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        address: point.formatted,
        // Roofr requires these three separately and will not split an address
        // string. They come straight out of the geocode we already ran, so the
        // CRM gets the components Google resolved rather than a guess made by
        // cutting the formatted address on commas.
        city: point.city || undefined,
        state: point.state || undefined,
        postal: point.postal || undefined,
        service: measured
          ? `Website Instant Estimate $${price!.toLocaleString()}`
          : "Website Instant Estimate (could not measure, needs a visit)",
        squareFootage: measured ? `${measured.squares} squares` : undefined,
        roofType: options.material,
        preference: `${options.stories} story`,
        page: "/instant-estimate",
        message: [
          measured
            ? `Instant estimate: $${price!.toLocaleString()} for ${measured.squares} squares.`
            : `Could not measure from imagery (usually tree cover). Needs a site visit.`,
          `Address: ${point.formatted}`,
          url ? `Estimate link: ${url}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (error) {
      console.error("[instant-estimate] lead delivery failed", error);
    }
  })();

  const [, outcome] = await Promise.all([lead, roofgo]);
  return { url, roofgo: outcome };
}
