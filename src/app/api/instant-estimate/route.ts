import { NextResponse } from "next/server";
import { z } from "zod";

import { geocode, measureAt } from "@/lib/quotes/measure";
import { summarizeStorms } from "@/lib/quotes/storms";
import {
  DEFAULT_OPTIONS,
  FINANCING,
  MATERIALS,
  STORIES,
  paymentFor,
  priceFor,
} from "@/config/quote-rates";
import { clientIp, sameOrigin } from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * The public instant estimator, replacing the Roofr link.
 *
 * This is the same measurement engine the field tool uses, but exposed to
 * anyone on the internet, which changes exactly one thing and it is the
 * important one: every call spends real money on Google's Solar and Geocoding
 * APIs. The rep-facing version is safe because it sits behind a login. This
 * one needs its own brakes.
 *
 * THROTTLE. Twelve addresses per IP per hour. A homeowner comparing their own
 * house, their mother's and a place they are thinking of buying will never
 * notice it; a script trying to enumerate a neighbourhood hits it in under a
 * minute. It is deliberately per-IP and in-memory: each serverless instance
 * keeps its own counter, which makes this a speed bump rather than a wall, but
 * a speed bump is enough when the daily API quota is the real backstop.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 12;

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
  address: z.string().min(5).max(300),
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
        error:
          "That is a lot of addresses. Give us a call at " +
          "(601) 549-3783 and we will help directly.",
      },
      { status: 429 },
    );
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Enter an address." }, { status: 400 });
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

    // A homeowner gets no jargon about detection gaps and offsets. Either we
    // can price their roof or we hand them straight to a person.
    if (m.confidence === "reject" || !m.squares) {
      return NextResponse.json({
        ok: true,
        measured: false,
        address: point.formatted,
        lat: point.lat,
        lon: point.lon,
      });
    }

    const options = {
      material: input.material ?? DEFAULT_OPTIONS.material,
      stories: input.stories ?? DEFAULT_OPTIONS.stories,
    };
    const price = priceFor(m.squares, options);
    const storms = summarizeStorms(point.lat, point.lon);

    return NextResponse.json(
      {
        ok: true,
        measured: true,
        address: point.formatted,
        lat: point.lat,
        lon: point.lon,
        squares: m.squares,
        pitchOver12: m.pitchOver12,
        planes: m.planes,
        imageryDate: m.imageryDate,
        price: price.shown,
        payments: FINANCING.termsMonths.map((months) => ({
          months,
          years: months / 12,
          amount: paymentFor(price.shown, months),
        })),
        apr: FINANCING.apr,
        partner: FINANCING.partner,
        material: options.material,
        materialLabel: MATERIALS[options.material].label,
        stories: options.stories,
        storiesLabel: STORIES[options.stories].label,
        storm: storms.sentence,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[instant-estimate] failed", error);
    return NextResponse.json(
      { error: "Something went wrong measuring that roof." },
      { status: 500 },
    );
  }
}
