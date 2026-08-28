import { NextResponse } from "next/server";
import { z } from "zod";

import { deliverLead } from "@/lib/leads";
import { clientIp, sameOrigin } from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The homeowner asks for their estimate, and it becomes a job in Roofr.
 *
 * HOW IT REACHES ROOFR. Roofr has no public "create lead" API. Its Zapier
 * integration exposes exactly one write action, Create Job and Customer, which
 * takes first name, last name, address, city, state, postal and country as
 * required fields, plus an optional job name, phone and email. So the lead
 * goes out through the existing deliverLead() pipeline, which already posts to
 * LEAD_WEBHOOK_URL and copies a Zapier email parser mailbox, and the Zap turns
 * it into the job.
 *
 * The address is split into its parts here rather than in the Zap, because
 * Zapier's text parsing is fragile and those parts are REQUIRED by the Roofr
 * action: a Zap that cannot find the postcode fails silently and the lead is
 * simply gone. Better to do it where it can be tested.
 *
 * ONE THING THE ZAP CANNOT DO. The Roofr action has no field for the workflow
 * stage, so jobs land in whichever stage that Zap's account defaults to. The
 * job NAME carries the marker instead ("Website Instant Estimate"), which is
 * filterable in Roofr and is what a stage automation can key off.
 */

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(40),
  address: z.string().min(5).max(300),
  squares: z.number().positive().max(500).optional(),
  price: z.number().positive().max(2_000_000).optional(),
  material: z.string().max(60).optional(),
  stories: z.union([z.literal(1), z.literal(2)]).optional(),
  storm: z.string().max(300).nullable().optional(),
});

/**
 * Split a Google formatted address into the parts Roofr insists on.
 *
 * Google returns "118 Manchester Rd, Hattiesburg, MS 39402, USA" with reliable
 * comma structure, so this reads from the END, where the country and the
 * state-plus-postcode always sit, rather than counting from the front where
 * unit numbers and building names vary.
 */
function splitAddress(formatted: string): {
  street: string;
  city: string;
  state: string;
  postal: string;
  country: string;
} {
  const parts = formatted
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const country = parts.length > 1 ? parts[parts.length - 1] : "USA";
  const statePostal = parts.length > 2 ? parts[parts.length - 2] : "";
  const m = /^([A-Za-z ]+?)\s*(\d{5}(?:-\d{4})?)?$/.exec(statePostal);
  return {
    street: parts[0] ?? formatted,
    city: parts.length > 3 ? parts[parts.length - 3] : (parts[1] ?? ""),
    state: (m?.[1] ?? statePostal).trim(),
    postal: m?.[2] ?? "",
    country: country === "USA" ? "United States" : country,
  };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Check your name, email and phone." },
      { status: 400 },
    );
  }

  const a = splitAddress(input.address);
  const price = input.price
    ? `$${input.price.toLocaleString()}`
    : "not measured";

  try {
    const result = await deliverLead({
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: [a.city, a.state, a.postal].filter(Boolean).join(" "),
      // source is the field a Zap filters on, so it is load bearing: it is
      // what separates these from free-inspection requests in Roofr.
      source: "instant-estimate",
      service: `Website Instant Estimate ${price}`,
      squareFootage: input.squares ? `${input.squares} squares` : undefined,
      roofType: input.material,
      preference: input.stories ? `${input.stories} story` : undefined,
      // The Lead type carries storm as a boolean flag; the detail goes in the
      // message where a human and a Zap can both read it.
      storm: Boolean(input.storm),
      message: [
        `Instant estimate from the website.`,
        `Address: ${input.address}`,
        `Street: ${a.street}`,
        `City: ${a.city}`,
        `State: ${a.state}`,
        `Postal: ${a.postal}`,
        `Country: ${a.country}`,
        input.squares ? `Roof: ${input.squares} squares` : null,
        input.material ? `Material: ${input.material}` : null,
        input.stories ? `Stories: ${input.stories}` : null,
        `Price shown: ${price}`,
        input.storm ? `Storm on record: ${input.storm}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      page: "/instant-estimate",
    });

    if (!result.delivered) {
      console.error("[instant-estimate] lead not delivered", {
        ip: clientIp(request),
      });
      return NextResponse.json(
        { error: "We could not send that. Please call (601) 549-3783." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[instant-estimate] lead failed", error);
    return NextResponse.json(
      { error: "We could not send that. Please call (601) 549-3783." },
      { status: 500 },
    );
  }
}
