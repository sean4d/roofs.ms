import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Cookie-session auth for the /production dashboard.
 *
 * Same shared-passphrase model as the /upload tool (see src/proxy.ts), but as
 * a signed HTTP-only session cookie instead of Basic Auth so the dashboard
 * gets a real login screen, a logout button, and a seven-day session. The
 * passphrase is validated ONLY on the server; the cookie carries an HMAC over
 * an expiry timestamp, never the passphrase itself.
 */

export const SESSION_COOKIE = "ser_production_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // seven days

function passphrase(): string {
  return (
    process.env.PRODUCTION_PASSWORD || process.env.UPLOAD_PASSWORD || "roofroof"
  );
}

/**
 * Signing key derived from the passphrase plus the server-only write token —
 * changing either invalidates all outstanding sessions, which is exactly what
 * you want after rotating a password.
 */
function sessionKey(): Buffer {
  return createHash("sha256")
    .update(
      `ser-production-session-v1:${passphrase()}:${process.env.SANITY_WRITE_TOKEN ?? ""}`,
    )
    .digest();
}

function signature(expiresAtMs: number): Buffer {
  return createHmac("sha256", sessionKey())
    .update(String(expiresAtMs))
    .digest();
}

/** Constant-time comparison so the check leaks nothing via timing. */
export function checkPassword(attempt: string): boolean {
  const expected = createHash("sha256").update(passphrase()).digest();
  const provided = createHash("sha256").update(attempt).digest();
  return timingSafeEqual(expected, provided);
}

export function createSessionToken(): string {
  const expiresAtMs = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  return `${expiresAtMs}.${signature(expiresAtMs).toString("base64url")}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expiresAtMs = Number(token.slice(0, dot));
  if (!Number.isFinite(expiresAtMs) || expiresAtMs < Date.now()) return false;
  let provided: Buffer;
  try {
    provided = Buffer.from(token.slice(dot + 1), "base64url");
  } catch {
    return false;
  }
  const expected = signature(expiresAtMs);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

/** Whether the current request carries a valid production session. */
export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/* ---------- login attempt throttling ---------- */

/**
 * Best-effort in-memory throttle: 10 failed attempts per IP per 15 minutes.
 * Serverless instances each keep their own map, so this is a speed bump, not
 * a fortress — fine for a shared-passphrase internal tool.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

type AttemptLog = Map<string, { failures: number; resetAt: number }>;

const attempts: AttemptLog = ((
  globalThis as { __serProdLoginAttempts?: AttemptLog }
).__serProdLoginAttempts ??= new Map());

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export function loginAllowed(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < Date.now()) return true;
  return entry.failures < MAX_FAILURES;
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { failures: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.failures += 1;
  }
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}

/* ---------- CSRF guard for mutating routes ---------- */

/**
 * Browsers always send Origin on cross-site POST/PATCH/DELETE; requiring it to
 * match the request host (when present) blocks cross-site forgery while still
 * allowing non-browser clients like the smoke tests.
 */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (origin === "null") return false;
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
