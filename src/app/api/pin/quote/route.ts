import { NextResponse } from "next/server";
import { z } from "zod";

import { MATERIAL_KEYS } from "@/config/quote-rates";
import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { db } from "@/lib/quotes/db";
import { getProposalForUser } from "@/lib/quotes/save";
import { recordActual } from "@/lib/quotes/accuracy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The office's last look at a quote before it goes in an envelope.
 *
 * A rep in a driveway on a phone in the sun does not always notice that the
 * house is two storeys, or that the pitch came back shallow because there is a
 * porch on the front. Once the envelope is sealed the number inside is the
 * number the company is standing behind, so somebody gets one more look.
 *
 * ADMIN ONLY, and priced on the server from the rate card. The browser may
 * choose the squares, the pitch, the storeys and the material. It may never
 * choose what those cost. Every edit is attributed and timestamped, because an
 * unattributed change to a price is the one thing nobody will own afterwards.
 *
 * The same route records the real takeoff when a job is finally measured,
 * which is the other end of the same argument: this is where the tool finds
 * out whether it was right.
 */

const structure = z.object({
  label: z.string().max(60),
  squares: z.number().positive().max(500),
  pitchOver12: z.number().min(0).max(24).nullable(),
  planes: z.number().int().min(0).max(200),
  material: z.enum(MATERIAL_KEYS),
  stories: z.union([z.literal(1), z.literal(2)]),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

const schema = z.object({
  quoteId: z.string().uuid(),
  /** The whole property, re-stated. One entry for a single-roof job. */
  structures: z.array(structure).min(1).max(8).optional(),
  /** The real takeoff, once somebody has been on the roof. Null clears it. */
  actualSquares: z.number().positive().max(500).nullable().optional(),
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
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Only the office can change a saved estimate." },
      { status: 403 },
    );
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const existing = await getProposalForUser(input.quoteId, user);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    if (input.actualSquares !== undefined) {
      await recordActual(input.quoteId, input.actualSquares, user);
    }

    if (input.structures) {
      const { priceStructures } = await import("@/lib/quotes/structures");
      const { priceFor } = await import("@/config/quote-rates");
      const items = input.structures;
      const first = items[0];

      // Priced the same way the rep's screen prices it, so the office editing
      // a quote and a rep building one cannot disagree about arithmetic.
      const multi = items.length > 1 ? priceStructures(items) : null;
      const single = multi
        ? null
        : priceFor(first.squares, {
            material: first.material,
            stories: first.stories,
            planes: first.planes,
          });
      const total = multi ? multi.totalPrice : single!.shown;
      const squares = multi
        ? multi.totalSquares
        : Math.round(first.squares * 10) / 10;

      const { monthlyPayment } = await import("@/config/quote-rates");
      const pitchDegrees =
        first.pitchOver12 === null
          ? null
          : (Math.atan(first.pitchOver12 / 12) * 180) / Math.PI;

      await db()`
        UPDATE quotes
           SET squares       = ${squares},
               pitch_degrees = ${pitchDegrees},
               planes        = ${first.planes},
               material      = ${first.material},
               stories       = ${String(first.stories)},
               structures    = ${multi ? JSON.stringify(multi.structures) : null}::jsonb,
               price_low     = ${total},
               price_high    = ${total},
               price_shown   = ${total},
               monthly_low   = ${monthlyPayment(total)},
               monthly_high  = ${monthlyPayment(total)},
               edited_at     = now(),
               edited_by     = ${user.id}::uuid
         WHERE id = ${input.quoteId}::uuid
      `;

      return NextResponse.json({
        ok: true,
        squares,
        price: total,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[pin] quote edit failed", error);
    return NextResponse.json(
      { error: "Could not save that." },
      { status: 500 },
    );
  }
}
