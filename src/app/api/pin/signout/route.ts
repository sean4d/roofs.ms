import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/quotes/auth";
import { siteConfig } from "@/config/site";
import { sameOrigin } from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Drop the session cookie and go back to the front door. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  const response = NextResponse.redirect(new URL("/pin", siteConfig.url), {
    // 303 so the browser follows with GET after this POST, rather than
    // re-posting to the destination.
    status: 303,
  });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
