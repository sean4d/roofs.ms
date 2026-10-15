import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { siteConfig } from "@/config/site";

/**
 * /pin IS RETIRED (SE8, 2026-10-15). Southeast Roofing's reps work in RoofGo
 * now, so every /pin page (sign-in links already in inboxes included)
 * forwards to the RoofGo app, and every /pin API answers 410 Gone, which
 * makes the old app read-only: nothing can write its tables any more. The
 * tables themselves are kept, untouched, for the 90-day hold (delete after
 * 2027-01-13, owner's call). Homeowner links (/estimate/TOKEN) are not
 * affected; they live outside /pin.
 */
function retiredPin(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith("/api/pin")) {
    return NextResponse.json(
      { error: "This tool has moved to RoofGo." },
      { status: 410, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.redirect(
    `${siteConfig.roofgoEstimateOrigin}/go/map`,
    308,
  );
}

/**
 * Password gate for the job-intake tool. Protects the /upload form and its
 * save API with HTTP Basic Auth so the tool is private but reachable from any
 * phone. The passphrase is `UPLOAD_PASSWORD` (default "roofroof"), entered in
 * EITHER the username or password box, so there's no "which field?" confusion.
 *
 * (Next.js 16 renamed the `middleware` convention to `proxy`.)
 */

// HTTP header values must be ASCII (Latin-1), no em-dashes / smart punctuation.
const REALM = "Southeast Roofing Job Upload";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (
    path === "/pin" ||
    path.startsWith("/pin/") ||
    path === "/api/pin" ||
    path.startsWith("/api/pin/")
  ) {
    return retiredPin(request);
  }

  const passphrase = process.env.UPLOAD_PASSWORD || "roofroof";
  const header = request.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    // "Basic base64(user:pass)", accept the passphrase in either field.
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (pass === passphrase || user === passphrase) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Enter the upload passphrase to continue.", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"` },
  });
}

export const config = {
  matcher: [
    "/upload",
    "/upload/:path*",
    "/api/upload",
    "/api/upload/:path*",
    "/pin",
    "/pin/:path*",
    "/api/pin",
    "/api/pin/:path*",
  ],
};
