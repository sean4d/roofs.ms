import { NextResponse } from "next/server";

import { getProposalByToken } from "@/lib/quotes/save";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The aerial photo on a homeowner's own estimate.
 *
 * Separate from /api/pin/aerial, which requires a rep's session. Here the
 * token IS the authorisation, and crucially the coordinates come from the
 * quote rather than from the query string: a caller cannot point this at an
 * arbitrary location and use it as a free image proxy on our Google bill.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const data = await getProposalByToken(token);
  if (!data) return new NextResponse("Not found.", { status: 404 });

  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return new NextResponse("Not configured.", { status: 503 });

  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("center", `${data.lat},${data.lon}`);
  url.searchParams.set("zoom", "20");
  url.searchParams.set("size", "400x400");
  url.searchParams.set("maptype", "satellite");
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return new NextResponse("Unavailable.", { status: 502 });
    return new NextResponse(await res.arrayBuffer(), {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/png",
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Unavailable.", { status: 502 });
  }
}
