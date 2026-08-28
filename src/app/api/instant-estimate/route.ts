import { NextResponse } from "next/server";
import { z } from "zod";

import { geocode, measureAt } from "@/lib/quotes/measure";
import { summarizeStorms } from "@/lib/quotes/storms";
import {
  DEFAULT_OPTIONS,
  FINANCING,
  MATERIALS,
  STORIES,
  monthlyPayment,
  paymentFor,
  priceFor,
} from "@/config/quote-rates";
import { clientIp, sameOrigin } from "@/lib/production/auth";
import { deliverLead } from "@/lib/leads";
import {
  emailEstimate,
  emailLooksReal,
  savePublicQuote,
} from "@/lib/quotes/public-quote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 45;

/**
 * The public instant estimator: a lead tool, not a calculator.
 *
 * THE CONTACT DETAILS COME FIRST, AND THE PRICE IS THE REWARD. The first
 * version showed the number before asking for anything, on the argument that
 * it makes for better leads. The owner overruled it, and his reasoning is
 * sound: every measurement costs real money at Google, and a tool anybody can
 * run anonymously is a free service for competitors and the merely curious. So
 * the name, email and phone arrive with the request, and nothing is measured
 * until they do.
 *
 * That collapses what used to be two round trips into one, which is also
 * better on a phone: the homeowner submits once and gets an answer, rather
 * than submitting, waiting, and being asked for more.
 *
 * A lead is created even when the roof CANNOT be measured. Roughly one address
 * in five is under tree cover, and that person has just typed their phone
 * number into a roofing company's website. They are not a failure case, they
 * are a lead who needs a human, and the old version quietly dropped them.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;

type Hits = Map<string, { count: number; resetAt: number }>;
const hits: Hits = ((
  globalThis as { __serEstimateHits?: Hits }
).__serEstimateHits ??= new Map());

function allowed(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().min(5).max(300),
  material: z
    .enum(["architectural", "premium", "metal-29", "metal-26"])
    .optional(),
  stories: z.union([z.literal(1), z.literal(2)]).optional(),
});

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  if (!allowed(clientIp(request))) {
    return NextResponse.json(
      {
        error: `That is a lot of addresses. Call us at ${"(601) 549-3783"} and we will help directly.`,
      },
      { status: 429 },
    );
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Please fill in your name, email, phone and address." },
      { status: 400 },
    );
  }

  if (!emailLooksReal(input.email)) {
    return NextResponse.json(
      { error: "Please use an email address you actually check." },
      { status: 400 },
    );
  }

  try {
    const point = await geocode(input.address);
    if (!point) {
      return NextResponse.json(
        { error: "We could not find that address. Check the spelling?" },
        { status: 404 },
      );
    }

    const m = await measureAt(point.lat, point.lon, {
      formattedAddress: point.formatted,
      precision: point.precision,
    });
    const options = {
      material: input.material ?? DEFAULT_OPTIONS.material,
      stories: input.stories ?? DEFAULT_OPTIONS.stories,
    };
    const measured = m.confidence !== "reject" && Boolean(m.squares);
    const price = measured ? priceFor(m.squares!, options).shown : null;

    // Save first, because the estimate link has to exist before it is mailed
    // and before the lead that references it goes out.
    let url: string | null = null;
    if (measured && price) {
      try {
        const saved = await savePublicQuote({
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: point.formatted,
          lat: point.lat,
          lon: point.lon,
          squares: m.squares!,
          pitchDegrees: m.pitchDegrees,
          planes: m.planes,
          imageryDate: m.imageryDate,
          material: options.material,
          stories: options.stories,
          priceShown: price,
          monthlyLow: monthlyPayment(price),
          monthlyHigh: monthlyPayment(price),
        });
        url = saved.url;
        await emailEstimate({
          to: input.email,
          name: input.name,
          address: point.formatted,
          price,
          squares: m.squares!,
          url: saved.url,
        });
      } catch (error) {
        // A failed save or send must not cost us the lead or the answer on
        // screen. The office still hears about it below.
        console.error("[instant-estimate] save/send failed", error);
      }
    }

    // The lead goes out either way. Somebody whose roof we could not see has
    // still handed us their phone number.
    try {
      await deliverLead({
        source: "instant-estimate",
        name: input.name,
        email: input.email,
        phone: input.phone,
        address: point.formatted,
        service: measured
          ? `Website Instant Estimate $${price!.toLocaleString()}`
          : "Website Instant Estimate (could not measure, needs a visit)",
        squareFootage: measured ? `${m.squares} squares` : undefined,
        roofType: options.material,
        preference: `${options.stories} story`,
        page: "/instant-estimate",
        message: [
          measured
            ? `Instant estimate: $${price!.toLocaleString()} for ${m.squares} squares.`
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

    if (!measured) {
      return NextResponse.json({
        ok: true,
        measured: false,
        address: point.formatted,
      });
    }

    const storms = summarizeStorms(point.lat, point.lon);
    return NextResponse.json(
      {
        ok: true,
        measured: true,
        address: point.formatted,
        squares: m.squares,
        pitchOver12: m.pitchOver12,
        imageryDate: m.imageryDate,
        price,
        url,
        payments: FINANCING.termsMonths.map((months) => ({
          months,
          years: months / 12,
          amount: paymentFor(price!, months),
        })),
        apr: FINANCING.apr,
        partner: FINANCING.partner,
        materialLabel: MATERIALS[options.material].label,
        storiesLabel: STORIES[options.stories].label,
        storm: storms.sentence,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[instant-estimate] failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please call (601) 549-3783." },
      { status: 500 },
    );
  }
}
