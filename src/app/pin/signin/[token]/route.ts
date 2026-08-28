import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  redeemLoginToken,
  sessionCookieOptions,
} from "@/lib/quotes/auth";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Redeem the emailed link and start the session.
 *
 * A GET that changes state, which is normally a mistake, but a link in an
 * email can only ever be a GET and this is the one place that rule bends. The
 * token is single use and short lived, which is what keeps it safe: the same
 * link cannot be replayed, so a mail client that prefetches it costs the user
 * one round trip to ask for another, not their account.
 *
 * On success it REDIRECTS rather than rendering. That drops the token out of
 * the address bar immediately, so it does not sit in browser history, get
 * screenshotted into a group chat, or leak through a Referer header on the
 * next request.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  let session: string | null = null;
  try {
    session = await redeemLoginToken(token);
  } catch (error) {
    console.error("[pin] token redemption failed", error);
  }

  if (!session) {
    return NextResponse.redirect(new URL("/pin?expired=1", siteConfig.url));
  }

  const response = NextResponse.redirect(new URL("/pin/map", siteConfig.url));
  response.cookies.set(SESSION_COOKIE, session, sessionCookieOptions());
  return response;
}
