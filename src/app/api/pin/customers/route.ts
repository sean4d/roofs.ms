import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { saveQuote } from "@/lib/quotes/save";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Turn a measurement into a saved customer and a shareable proposal.
 *
 * The deliberate moment a pin becomes a record. Measuring saves nothing, so a
 * rep can work a street without leaving a trail; this is where they decide the
 * house is worth following up.
 *
 * Everything priced is recomputed from the request's own numbers rather than
 * trusted from the client, because the client is a browser and a browser can
 * be told to send anything. What it may choose is which house and who lives
 * there, never what the roof costs.
 */

const schema = z.object({
  address: z.string().min(3).max(300),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  squares: z.number().positive().max(500),
  pitchDegrees: z.number().min(0).max(89).nullable(),
  planes: z.number().int().min(0).max(200),
  measureSource: z.enum(["solar", "manual"]),
  measureQuality: z.string().max(40).nullable(),
  imageryDate: z.string().max(20).nullable().optional(),
  material: z
    .enum(["architectural", "premium", "metal-29", "metal-26"])
    .optional(),
  stories: z.union([z.literal(1), z.literal(2)]).optional(),
  name: z.string().max(120).nullable().optional(),
  email: z.string().max(200).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
});

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to continue." },
      { status: 401 },
    );
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    // Price on the server from the rate card, never from what the browser
    // claims the price was.
    const { priceFor, monthlyPayment, DEFAULT_OPTIONS } =
      await import("@/config/quote-rates");
    const options = {
      material: input.material ?? DEFAULT_OPTIONS.material,
      stories: input.stories ?? DEFAULT_OPTIONS.stories,
    };
    const price = priceFor(input.squares, options);

    const saved = await saveQuote(user, {
      address: input.address,
      lat: input.lat,
      lon: input.lon,
      name: input.name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      squares: input.squares,
      pitchDegrees: input.pitchDegrees,
      planes: input.planes,
      measureSource: input.measureSource,
      measureQuality: input.measureQuality,
      imageryDate: input.imageryDate ?? null,
      material: options.material,
      stories: options.stories,
      priceLow: price.low,
      priceHigh: price.high,
      priceShown: price.shown,
      monthlyLow: monthlyPayment(price.low),
      monthlyHigh: monthlyPayment(price.high),
    });

    return NextResponse.json(
      { ok: true, ...saved },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[pin] save failed", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
