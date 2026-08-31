import { NextResponse } from "next/server";

import { currentUser } from "@/lib/quotes/auth";
import { fetchAerial } from "@/lib/quotes/aerial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve the aerial thumbnail without handing out the server key.
 *
 * WHY THIS EXISTS. The measurement used to return a Google Static Maps URL
 * with GOOGLE_MAPS_SERVER_KEY in the query string, and that URL went straight
 * into an <img src> in the field tool. So every measurement shipped the server
 * key to the browser, where it is readable by anyone with a session, anyone
 * looking at the network tab, and any extension installed on a rep's phone.
 *
 * That key is the unrestricted one. Unlike the browser key it has no HTTP
 * referrer limit, because server calls do not send one, so a copy of it works
 * from anywhere in the world against Solar, Geocoding, Static Maps and Street
 * View. It was found by a check that asked whether the key appeared in the
 * page HTML, which it did not: it arrived later, in an API response. The check
 * has been widened to look there too.
 *
 * Now the browser asks us for the picture and the key never leaves the server.
 *
 * The fetch itself lives in lib/quotes/aerial so the printed piece, which is
 * built on the server and cannot call this route, uses the same code path.
 */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Sign in to continue.", { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return new NextResponse("Bad coordinates.", { status: 400 });
  }

  if (!process.env.GOOGLE_MAPS_SERVER_KEY) {
    return new NextResponse("Not configured.", { status: 503 });
  }

  const image = await fetchAerial(lat, lon, {
    size: Number(params.get("size")) || 480,
  });
  if (!image) return new NextResponse("Unavailable.", { status: 502 });

  return new NextResponse(image.bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": image.contentType,
      // Private: this names a specific house. It may sit in the rep's own
      // browser cache, never in a shared one.
      "Cache-Control": "private, max-age=86400",
    },
  });
}
