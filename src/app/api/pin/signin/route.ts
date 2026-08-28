import { NextResponse } from "next/server";
import { z } from "zod";

import {
  PENDING_COOKIE,
  PENDING_MAX_AGE_SECONDS,
  newPendingId,
  sendLoginLink,
} from "@/lib/quotes/auth";
import {
  clientIp,
  loginAllowed,
  recordLoginFailure,
  sameOrigin,
} from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Request a sign-in link.
 *
 * ALWAYS answers { ok: true }, whatever address was submitted and whether or
 * not anything was sent. An endpoint that distinguished "link sent" from "no
 * such account" would be a way for anyone to test whether a given person works
 * here, and to enumerate the company's staff a name at a time. The form shows
 * the same "check your email" screen either way, so the two agree.
 *
 * The throttle is shared with the /production login on purpose: both are doors
 * into the same building, and an attacker who is rate limited on one should
 * not simply move to the other.
 */

const schema = z.object({ email: z.string().min(3).max(320) });

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!loginAllowed(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Wait 15 minutes and try again." },
      { status: 429 },
    );
  }

  let email: string;
  try {
    ({ email } = schema.parse(await request.json()));
  } catch {
    return NextResponse.json({ error: "Enter your email." }, { status: 400 });
  }

  // Every request costs an attempt, not just the failures. Sending a link is
  // the expensive side effect here, so the limit has to cover the successes.
  recordLoginFailure(ip);

  // A handle for THIS browser, so it can pick up its own session when the
  // link is opened on a phone. See the status route.
  const pendingId = newPendingId();

  try {
    await sendLoginLink(email, pendingId);
  } catch (error) {
    // A mail or database failure is ours, not the caller's, and it is the one
    // case worth reporting honestly: the form can offer to try again.
    console.error("[pin] sign-in link failed", error);
    return NextResponse.json({ error: "Could not send." }, { status: 500 });
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(PENDING_COOKIE, pendingId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_MAX_AGE_SECONDS,
  });
  return response;
}
