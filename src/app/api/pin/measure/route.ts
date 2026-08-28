import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { geocode, measureAt, measureAddress } from "@/lib/quotes/measure";
import { summarizeStorms } from "@/lib/quotes/storms";
import { priceFor, monthlyPayment } from "@/config/quote-rates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Everything the rep sees about one house, in a single round trip.
 *
 * A rep is standing on a driveway on LTE. Three sequential requests to measure,
 * price and look up storms would be three chances for a dead signal to leave
 * a half-finished screen, and the fan-out on /upload already taught us what
 * happens when a phone drops out mid-sequence: it stops silently, wherever it
 * was. So this does the whole thing server side and answers once.
 *
 * It deliberately does NOT save anything. Measuring costs a Solar API call and
 * a homeowner has not agreed to anything yet, so a pin only becomes a customer
 * when the rep says so, on the next screen. That also means a rep can measure
 * the same house twice while walking a street without leaving two records.
 */

const schema = z.union([
  z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
  z.object({ address: z.string().min(4).max(300) }),
]);

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
    // A map tap gives coordinates but no address, and the rep needs to see one
    // to know they hit the right house, so tapping resolves the address too.
    const measurement =
      "address" in input
        ? await measureAddress(input.address)
        : await measureAt(input.lat, input.lon, {
            formattedAddress:
              (await reverseGeocode(input.lat, input.lon)) ?? undefined,
          });

    const lat = measurement.lat || ("lat" in input ? input.lat : 0);
    const lon = measurement.lon || ("lon" in input ? input.lon : 0);
    const storms = lat && lon ? summarizeStorms(lat, lon) : null;

    // A starting number on the default options. The rep adjusts squares,
    // storeys and material on the sheet and it reprices there, so this is an
    // opening figure rather than the final word.
    const price =
      measurement.confidence !== "reject" && measurement.squares
        ? priceFor(measurement.squares)
        : null;

    return NextResponse.json(
      {
        ok: true,
        measurement,
        price: price
          ? {
              ...price,
              monthlyLow: monthlyPayment(price.low),
              monthlyHigh: monthlyPayment(price.high),
            }
          : null,
        storms: storms
          ? {
              sentence: storms.sentence,
              headline: storms.headline,
              counts: storms.counts,
              recent: storms.events.filter((e) => e.damaging).slice(0, 3),
              years: storms.years,
            }
          : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[pin] measure failed", error);
    return NextResponse.json(
      { error: "Could not measure that one." },
      { status: 500 },
    );
  }
}

/**
 * Coordinates back to a street address.
 *
 * Best effort on purpose. If Google cannot name the spot the rep tapped, that
 * is not a reason to refuse to measure the roof: they are standing in front of
 * the house and can type the address themselves.
 */
async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return null;
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("latlng", `${lat},${lon}`);
    url.searchParams.set("result_type", "street_address");
    url.searchParams.set("key", key);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status: string;
      results?: Array<{ formatted_address: string }>;
    };
    if (data.status !== "OK" || !data.results?.length) return null;
    return data.results[0].formatted_address;
  } catch {
    return null;
  }
}

/** Address search from the map's search box, without measuring yet. */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to continue." },
      { status: 401 },
    );
  }
  const q = new URL(request.url).searchParams.get("q");
  if (!q || q.length < 4) {
    return NextResponse.json({ error: "Type an address." }, { status: 400 });
  }
  const point = await geocode(q);
  if (!point) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(
    { ok: true, ...point },
    { headers: { "Cache-Control": "no-store" } },
  );
}
