import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  checkPassword,
  clearLoginFailures,
  clientIp,
  createSessionToken,
  hasSession,
  loginAllowed,
  recordLoginFailure,
  sameOrigin,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Session endpoint for the /production dashboard.
 * POST {password} → sets the HTTP-only session cookie.
 * DELETE → logs out. GET → { authenticated } (never any project data).
 */

const loginSchema = z.object({ password: z.string().min(1).max(200) });

export async function GET() {
  return NextResponse.json(
    { authenticated: await hasSession() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

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

  let password: string;
  try {
    ({ password } = loginSchema.parse(await request.json()));
  } catch {
    return NextResponse.json({ error: "Enter the password." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    recordLoginFailure(ip);
    return NextResponse.json(
      { error: "Incorrect password. Check it and try again." },
      { status: 401 },
    );
  }

  clearLoginFailures(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return NextResponse.json({ ok: true });
}
