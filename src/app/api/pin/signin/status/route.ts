import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  PENDING_COOKIE,
  SESSION_COOKIE,
  claimPendingSession,
  sessionCookieOptions,
} from "@/lib/quotes/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Polled by the browser sitting on "check your email".
 *
 * Answers { signedIn: false } until the link is opened somewhere, then sets
 * this browser's own session cookie and answers true. Email is read on a
 * phone; the sign-in was started on a laptop. Without this the laptop waits
 * forever while the phone works fine, which is exactly what the owner hit.
 */
export async function GET() {
  const store = await cookies();
  const pending = store.get(PENDING_COOKIE)?.value;
  if (!pending) {
    return NextResponse.json(
      { signedIn: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const session = await claimPendingSession(pending);
  if (!session) {
    return NextResponse.json(
      { signedIn: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json(
    { signedIn: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(SESSION_COOKIE, session, sessionCookieOptions());
  response.cookies.delete(PENDING_COOKIE);
  return response;
}
