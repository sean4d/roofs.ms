import { NextResponse } from "next/server";

import { clientIp, sameOrigin } from "@/lib/production/auth";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Address suggestions for the public estimator.
 *
 * WHY THIS IS A SERVER ROUTE AND NOT A SCRIPT TAG. Google's own autocomplete
 * widget wants a browser key in the page, and there is a deploy check on this
 * site whose entire job is to fail if a Google key ever appears in the
 * signed-out HTML. That check exists for a good reason: a key in public markup
 * is a key anybody can spend. Proxying costs one hop and keeps the key server
 * side, where it already is for geocoding and Solar.
 *
 * It also buys control the widget would not give us. Requests are biased to a
 * 50km circle around the office and restricted to US street addresses, so a
 * homeowner typing "123 Main" gets Hattiesburg and Petal rather than Main
 * Street in forty other states. That is the difference between a list worth
 * reading on a phone and a list worth scrolling past.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It never calls Place Details. The
 * estimator needs a complete address STRING, which the autocomplete response
 * already contains, and /api/instant-estimate geocodes that string exactly as
 * it always has. So the measurement path is untouched: this changes what the
 * customer has to type, not what the backend receives.
 *
 * COST. Autocomplete is billed per request, so this is not fired per
 * keystroke: the client debounces and will not ask below three characters,
 * and the per-IP ceiling below is the backstop for anything that gets past
 * that.
 */

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 40;

type Hits = Map<string, { count: number; resetAt: number }>;
const hits: Hits = ((globalThis as { __serPlacesHits?: Hits })
  .__serPlacesHits ??= new Map());

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

interface Suggestion {
  placePrediction?: {
    placeId?: string;
    text?: { text?: string };
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  if (!allowed(clientIp(request))) {
    return NextResponse.json({ ok: true, suggestions: [] });
  }

  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  // No key is not an error the customer should see. The estimator falls back
  // to a plain typed address, which is exactly how it worked before.
  if (!key) return NextResponse.json({ ok: true, suggestions: [] });

  let input = "";
  try {
    const body = (await request.json()) as { input?: unknown };
    input = typeof body.input === "string" ? body.input.trim() : "";
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (input.length < 3 || input.length > 200) {
    return NextResponse.json({ ok: true, suggestions: [] });
  }

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          // Only the fields actually rendered. The field mask is what keeps
          // the response small and the SKU cheap.
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat",
        },
        body: JSON.stringify({
          input,
          includedRegionCodes: ["us"],
          // Street addresses, not businesses. Somebody pricing a roof wants
          // their house, and "Main Street Diner" in the list is a wrong turn.
          includedPrimaryTypes: ["street_address", "premise", "subpremise"],
          locationBias: {
            circle: {
              center: {
                latitude: siteConfig.geo.latitude,
                longitude: siteConfig.geo.longitude,
              },
              // 50km is the API's maximum and covers the service area from
              // Hattiesburg out past Laurel, Columbia and Wiggins. Bias, not
              // restriction: an address outside it still appears, it just
              // ranks below the local ones.
              radius: 50000,
            },
          },
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      console.error("[places] autocomplete responded", res.status);
      return NextResponse.json({ ok: true, suggestions: [] });
    }
    const data = (await res.json()) as { suggestions?: Suggestion[] };
    const suggestions = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => Boolean(p?.text?.text))
      .slice(0, 5)
      .map((p) => ({
        placeId: p.placeId ?? null,
        /** The complete address, and the only thing the estimator submits. */
        description: p.text!.text!,
        /** Split for display: bold street line over a quiet city line. */
        main: p.structuredFormat?.mainText?.text ?? p.text!.text!,
        secondary: p.structuredFormat?.secondaryText?.text ?? "",
      }));

    return NextResponse.json(
      { ok: true, suggestions },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Never fatal. A homeowner who cannot get suggestions can still type the
    // address, and losing the estimator because a suggestion service blinked
    // would be a far worse trade.
    console.error("[places] autocomplete failed", error);
    return NextResponse.json({ ok: true, suggestions: [] });
  }
}
