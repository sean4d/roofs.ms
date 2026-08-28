import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

import { db } from "./db";
import { baseUrl } from "./base-url";
// The sender domain is always the real one: it is what Resend has verified,
// and a preview host would fail SPF. Only the LINK follows the deployment.
import { siteConfig } from "@/config/site";

/**
 * Accounts for the /quote estimating tool.
 *
 * THE PROBLEM THIS SOLVES. A single shared passphrase, which is how /upload
 * and /production are gated, is wrong here. Reps come and go constantly, and a
 * passphrase that one of them can memorise is a passphrase they can keep using
 * from their next job, at another company, quoting off this rate card. There
 * is no way to take it back from one person without changing it for everybody.
 *
 * So: one account per person, keyed to their company email.
 *
 *   1. Anyone with an @southeastroofing.llc address can create an account
 *      themselves. No invite to send, nothing for the office to set up.
 *   2. The domain is checked on the server, so an outside address cannot get
 *      in even if somebody shares the link.
 *   3. There is no password. Sign-in is a one-time link mailed to the address,
 *      which means possession of the company mailbox IS the credential. A rep
 *      cannot pass their login to a friend without handing over their work
 *      email, and the day the office disables that mailbox they are out.
 *   4. Admins can deactivate a rep in one click, and the next request that rep
 *      makes fails, because every authenticated request re-reads the row.
 *
 * The session cookie is signed and carries the user id, but it is never
 * trusted on its own: currentUser() always loads the row and re-checks that
 * the account still exists and is still active. That extra query per request
 * is what makes "remove a rep who quit" actually take effect immediately
 * rather than whenever their cookie happens to expire.
 */

/* ------------------------------------------------------------------ *
 * Policy
 * ------------------------------------------------------------------ */

/** The only mailbox domain that can hold an account. Lowercase. */
export const ALLOWED_DOMAIN = "southeastroofing.llc";

/**
 * Seeded admins. Anyone signing in with one of these gets the admin role on
 * first sign-in and keeps it. Everyone else is a rep. Kept in code rather than
 * only in the database so a fresh deploy against an empty database still has
 * somebody who can administer it.
 */
export const ADMIN_EMAILS: readonly string[] = [
  "office@southeastroofing.llc",
  "patrick.pitts@southeastroofing.llc",
  "sean@southeastroofing.llc",
  "elizabeth@southeastroofing.llc",
];

export const SESSION_COOKIE = "ser_quote_session";
/**
 * Six months. Effectively "trust this device".
 *
 * It was thirty days and the owner found re-authenticating annoying, which is
 * fair: a rep who has to stop and find an email at a door will stop using the
 * tool. A long session is normally a bad trade because it delays revocation,
 * but not here. currentUser() re-reads the user row on EVERY request, so
 * removing a rep locks them out on their next tap no matter how long their
 * cookie had left. Expiry is a backstop for a lost phone, not the mechanism
 * for taking access away, so it can afford to be generous.
 */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
/** Sign-in links are short lived. Long enough to walk to a laptop. */
const LOGIN_TOKEN_TTL_MS = 20 * 60 * 1000;

export type Role = "admin" | "rep";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  active: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}

/* ------------------------------------------------------------------ *
 * Email address handling
 * ------------------------------------------------------------------ */

/**
 * Normalise before doing anything else. Mail is case insensitive in the part
 * that matters here, and "Sean@SoutheastRoofing.LLC" must be the same account
 * as "sean@southeastroofing.llc" or the same person ends up with two.
 */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Is this address allowed to hold an account?
 *
 * Deliberately strict. It matches the domain exactly, so a lookalike like
 * "southeastroofing.llc.attacker.com" fails, and it rejects the plus-address
 * and dotted-alias tricks that would otherwise let one mailbox mint unlimited
 * accounts. Sub-addressing is a normal thing to want, but here the whole point
 * of the check is that accounts map one to one onto real employees.
 */
export function emailAllowed(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 1) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (domain !== ALLOWED_DOMAIN) return false;
  if (!local || local.includes("+")) return false;
  // Keep it to what a real mailbox name looks like.
  return /^[a-z0-9._-]+$/.test(local);
}

export function roleFor(email: string): Role {
  return ADMIN_EMAILS.includes(email) ? "admin" : "rep";
}

/* ------------------------------------------------------------------ *
 * Session cookie
 * ------------------------------------------------------------------ */

/**
 * Signing key. Derived from a dedicated secret when one is set, falling back
 * to the same material the rest of the site's sessions use. Rotating either
 * invalidates every outstanding session, which is what you want after a leak.
 */
function sessionKey(): Buffer {
  const secret =
    process.env.QUOTE_SESSION_SECRET ||
    process.env.SANITY_WRITE_TOKEN ||
    process.env.UPLOAD_PASSWORD ||
    "roofroof";
  return createHash("sha256").update(`ser-quote-session-v1:${secret}`).digest();
}

function sign(payload: string): string {
  return createHmac("sha256", sessionKey()).update(payload).digest("base64url");
}

function issueSessionToken(userId: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the user id when the signature and expiry are both good. */
export function readSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiresAt, provided] = parts;
  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null;

  const expected = Buffer.from(sign(`${userId}.${expiresAt}`));
  const got = Buffer.from(provided);
  if (expected.length !== got.length) return null;
  if (!timingSafeEqual(expected, got)) return null;
  return userId;
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

/* ------------------------------------------------------------------ *
 * Sign-in links
 * ------------------------------------------------------------------ */

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

/**
 * Create a sign-in link and mail it.
 *
 * Returns true whether or not the address was allowed. The caller shows the
 * same "check your email" screen either way, so this endpoint cannot be used
 * to find out who works here.
 */
export const PENDING_COOKIE = "ser_quote_pending";
/** A browser waiting on a link gives up after this long. */
export const PENDING_MAX_AGE_SECONDS = 30 * 60;

export async function sendLoginLink(
  rawEmail: string,
  pendingId?: string,
): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!emailAllowed(email)) return true;

  // Deactivated accounts do not get new links. A rep who was removed should
  // find the door locked, not receive a working key by asking politely.
  const sql = db();
  const existing = (await sql`
    SELECT active FROM users WHERE email = ${email}
  `) as Array<{ active: boolean }>;
  if (existing.length && !existing[0].active) return true;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_TTL_MS);

  await sql`
    INSERT INTO login_tokens (token_hash, email, expires_at, pending_id)
    VALUES (${hashToken(token)}, ${email}, ${expiresAt.toISOString()}, ${pendingId ?? null})
  `;

  await mailLoginLink(email, token);
  return true;
}

async function mailLoginLink(email: string, token: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const link = `${baseUrl()}/pin/signin/${token}`;
  if (!key) {
    // In local development without a mail key, the link goes to the log so the
    // flow is still testable end to end.
    console.log(`[quote] sign-in link for ${email}: ${link}`);
    return;
  }

  const host = new URL(siteConfig.url).hostname;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Southeast Roofing <no-reply@${host}>`,
      to: [email],
      subject: "Your sign-in link",
      text: [
        "Here is your sign-in link for the Southeast Roofing quote tool.",
        "",
        link,
        "",
        "It works once and expires in 20 minutes.",
        "If you did not ask for this, you can ignore it.",
      ].join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

/**
 * Redeem a link. Creates the account on first use, which is what makes this
 * self-serve: there is no separate registration step to get wrong.
 *
 * Returns the signed session token, or null when the link is expired, already
 * used, or belongs to an account that has since been deactivated.
 */
export async function redeemLoginToken(token: string): Promise<string | null> {
  const sql = db();
  const rows = (await sql`
    UPDATE login_tokens
       SET used_at = now()
     WHERE token_hash = ${hashToken(token)}
       AND used_at IS NULL
       AND expires_at > now()
    RETURNING email
  `) as Array<{ email: string }>;
  if (!rows.length) return null;

  const email = rows[0].email;
  // Re-check the policy at redemption. The allowlist could have changed since
  // the link was mailed, and this is the moment that actually grants access.
  if (!emailAllowed(email)) return null;

  const users = (await sql`
    INSERT INTO users (email, role, last_seen_at)
    VALUES (${email}, ${roleFor(email)}, now())
    ON CONFLICT (email) DO UPDATE
      SET last_seen_at = now()
    RETURNING id, active
  `) as Array<{ id: string; active: boolean }>;

  const user = users[0];
  if (!user || !user.active) return null;

  // Stamp the claim so the browser that ASKED for this link, which is often a
  // different device from the one reading the email, can pick up its own
  // session while it polls. Failure here must not block the sign-in actually
  // happening on this device.
  try {
    await sql`
      UPDATE login_tokens SET claimed_by = ${user.id}::uuid
       WHERE token_hash = ${hashToken(token)}
    `;
  } catch (error) {
    console.error("[pin] could not stamp the cross-device claim", error);
  }

  return issueSessionToken(user.id);
}

/**
 * Has the link this browser asked for been opened somewhere yet?
 *
 * Returns a fresh session token once it has. This is what closes the gap the
 * owner hit: request the link on a laptop, open it on a phone, and the laptop
 * would otherwise sit on "check your email" forever.
 *
 * The pending id is a bearer credential, so it is 32 random bytes in an
 * http-only cookie, it only matches a token issued in the last 30 minutes, and
 * it is cleared the moment it is exchanged. Guessing one is not feasible and a
 * used one is worth nothing.
 */
export async function claimPendingSession(
  pendingId: string,
): Promise<string | null> {
  if (!pendingId || pendingId.length < 20) return null;
  try {
    const rows = (await db()`
      SELECT t.claimed_by, u.active
        FROM login_tokens t
        JOIN users u ON u.id = t.claimed_by
       WHERE t.pending_id = ${pendingId}
         AND t.claimed_by IS NOT NULL
         AND t.created_at > now() - interval '30 minutes'
       ORDER BY t.created_at DESC
       LIMIT 1
    `) as Array<{ claimed_by: string; active: boolean }>;
    if (!rows.length || !rows[0].active) return null;

    // One exchange only. Clearing the handle means a copied cookie cannot be
    // replayed into a second session later.
    await db()`
      UPDATE login_tokens SET pending_id = NULL WHERE pending_id = ${pendingId}
    `;
    return issueSessionToken(rows[0].claimed_by);
  } catch (error) {
    console.error("[pin] pending claim failed", error);
    return null;
  }
}

/** A fresh handle for a browser that is about to wait on a link. */
export function newPendingId(): string {
  return randomBytes(32).toString("base64url");
}

/* ------------------------------------------------------------------ *
 * Reading the current user
 * ------------------------------------------------------------------ */

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  active: boolean;
  /** timestamptz arrives from the driver as a Date, never a string. */
  created_at: string | Date;
  last_seen_at: string | Date | null;
}

/**
 * Coerce a database timestamp to an ISO string.
 *
 * Second time this exact bug has bitten: the Neon driver hydrates timestamptz
 * into a Date while the row type claims string, so `.slice()` throws. It took
 * out every proposal page once, and the team page here. A row type is an
 * assertion about the outside world that TypeScript cannot check, so anything
 * crossing that boundary gets coerced rather than trusted.
 */
function isoOrNull(v: string | Date | null): string | null {
  if (v === null) return null;
  return v instanceof Date ? v.toISOString() : String(v);
}

const toUser = (r: UserRow): User => ({
  id: r.id,
  email: r.email,
  name: r.name,
  role: r.role,
  active: r.active,
  createdAt: isoOrNull(r.created_at) ?? "",
  lastSeenAt: isoOrNull(r.last_seen_at),
});

/**
 * The signed-in user, or null.
 *
 * This re-reads the row on every call rather than trusting the cookie's claims
 * about who the bearer is. That is the whole mechanism behind removing a rep:
 * flip active to false and their very next request has no user.
 */
export async function currentUser(): Promise<User | null> {
  const store = await cookies();
  const userId = readSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;

  try {
    const rows = (await db()`
      SELECT id, email, name, role, active, created_at, last_seen_at
        FROM users
       WHERE id = ${userId}::uuid AND active = true
    `) as UserRow[];
    if (!rows.length) return null;
    return toUser(rows[0]);
  } catch {
    // A database blip must read as "not signed in", never as "signed in".
    return null;
  }
}

/** Throws when there is no session. For server actions and route handlers. */
export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new AuthError("Sign in to continue.");
  return user;
}

/** Throws unless the signed-in user is an admin. */
export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") throw new AuthError("Admins only.", 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * The owner filter for every customer query.
 *
 * An admin sees everything, a rep sees only their own rows. Returning the user
 * id (or null) from one place means no screen can accidentally decide this for
 * itself, and a new screen that forgets to call it fails closed rather than
 * leaking somebody else's pipeline.
 */
export function ownerScope(user: User): string | null {
  return user.role === "admin" ? null : user.id;
}

/* ------------------------------------------------------------------ *
 * Administration
 * ------------------------------------------------------------------ */

/** Everyone, newest first. Admin only. */
export async function listUsers(): Promise<User[]> {
  const rows = (await db()`
    SELECT id, email, name, role, active, created_at, last_seen_at
      FROM users
     ORDER BY active DESC, created_at DESC
  `) as UserRow[];
  return rows.map(toUser);
}

/**
 * Remove a rep's access.
 *
 * Deactivates rather than deletes, so their customers and their quote history
 * survive them. See the note in schema.sql. A seeded admin cannot be removed,
 * which stops the office from locking itself out of its own tool.
 */
export async function deactivateUser(id: string): Promise<boolean> {
  const rows = (await db()`
    UPDATE users
       SET active = false
     WHERE id = ${id}::uuid
       AND email <> ALL(${ADMIN_EMAILS as string[]})
    RETURNING id
  `) as Array<{ id: string }>;
  return rows.length > 0;
}

/** Put a rep back, for the ones who come back. */
export async function reactivateUser(id: string): Promise<boolean> {
  const rows = (await db()`
    UPDATE users SET active = true WHERE id = ${id}::uuid RETURNING id
  `) as Array<{ id: string }>;
  return rows.length > 0;
}
