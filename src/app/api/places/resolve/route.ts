import { NextResponse } from "next/server";

import { clientIp, sameOrigin } from "@/lib/production/auth";
import { geocode } from "@/lib/quotes/measure";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Turn a chosen suggestion into its city, state and ZIP.
 *
 * WHY THIS EXISTS. Autocomplete does not return a postal code. Its secondary
 * line reads "Petal, MS, USA", with no ZIP anywhere in the response, so the
 * ZIP box on the lead forms stayed empty however good the suggestion was.
 *
 * That was not obvious from testing, and the way it hid is worth recording: a
 * browser test drove the whole flow against a stubbed response that DID carry
 * a ZIP, because the fixture was written from what the payload was assumed to
 * look like rather than from what Google actually sends. It passed on every
 * form. The real API had never once returned that field. Fixtures invented
 * from an assumption test the assumption.
 *
 * Place Details would answer this, at the price of another Places SKU. The
 * Geocoding API already answers it, is already enabled, already holds the
 * server key, and is already what /api/instant-estimate uses on the same
 * address a moment later. So this reuses geocode() rather than buying a second
 * opinion.
 *
 * ONE CALL PER SELECTION, not per keystroke: it runs when somebody taps a
 * suggestion, which is at most a handful of times per visitor.
 */

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 20;

type Hits = Map<string, { count: number; resetAt: number }>;
const hits: Hits = ((globalThis as { __serResolveHits?: Hits })
  .__serResolveHits ??= new Map());

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

/** Empty parts, never an error: a form that cannot be completed for the
 *  customer is still a form they can complete themselves. */
const NOTHING = NextResponse.json({
  ok: true,
  city: "",
  state: "",
  postal: "",
});

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  if (!allowed(clientIp(request))) return NOTHING;

  let address = "";
  try {
    const body = (await request.json()) as { address?: unknown };
    address = typeof body.address === "string" ? body.address.trim() : "";
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (address.length < 5 || address.length > 300) return NOTHING;

  try {
    const point = await geocode(address);
    if (!point) return NOTHING;
    return NextResponse.json(
      {
        ok: true,
        city: point.city ?? "",
        state: point.state ?? "",
        postal: point.postal ?? "",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[places] resolve failed", error);
    return NOTHING;
  }
}
