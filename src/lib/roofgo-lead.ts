import "server-only";

import { createHmac, randomBytes } from "node:crypto";

import { db } from "@/lib/quotes/db";
import { siteConfig } from "@/config/site";

/**
 * Instant-estimate leads go to RoofGo, not /pin (SE8, 2026-10-15).
 *
 * The website still measures and prices the roof itself, and still sends the
 * homeowner their email, the office its lead email and Zapier its copy,
 * exactly as before (src/lib/leads.ts, untouched). What changed is where the
 * lead is SAVED: Southeast Roofing's RoofGo account, as an unowned website
 * lead, through RoofGo's signed endpoint. The old /pin tables are no longer
 * written.
 *
 * NOTHING HERE MAY COST THE HOMEOWNER THEIR PRICE OR THE OFFICE ITS LEAD.
 * RoofGo being down or slow is handled by an outbox in this site's own
 * database (roofgo_lead_outbox): every lead is written there first, posted
 * with a short timeout, and anything not acknowledged is retried with backoff
 * after later estimates, when its homeowner opens their link, and by the daily
 * cron. A lead still not delivered an hour later is emailed to the office as
 * an alert, once. The exact body is kept until RoofGo has it, then cleared.
 *
 * The homeowner's link token is minted HERE, so the link in their email and in
 * the lead email is the same roofs.ms /estimate/TOKEN as always; that page
 * forwards it to RoofGo, which stores the lead under the same token.
 *
 * Settings: ROOFGO_LEAD_ENDPOINT (RoofGo's links.roofsMsLeadEndpoint()) and
 * ROOFGO_LEAD_SECRET (shared HMAC key, Sensitive). Without them leads wait in
 * the outbox and nothing is lost.
 */

export interface RoofgoLead {
  leadId: string;
  createdAt: string;
  publicToken: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  postal: string | null;
  lat: number;
  lon: number;
  squares: number;
  pitchDegrees: number | null;
  planes: number;
  imageryDate: string | null;
  material: string;
  stories: number;
  priceShown: number;
  monthlyLow: number;
  monthlyHigh: number;
  rateCard: unknown;
  emailedTo: string | null;
}

export const newLeadId = () => `ie_${randomBytes(12).toString("base64url")}`;
export const newPublicToken = () => randomBytes(24).toString("base64url");

/* ------------------------------------------------------------------ *
 * Sending
 * ------------------------------------------------------------------ */

export type SendOutcome =
  { ok: true; status: number } | { ok: false; retry: boolean; error: string };

export interface Transport {
  endpoint: string | undefined;
  secret: string | undefined;
  fetch: typeof fetch;
  timeoutMs: number;
}

export function defaultTransport(): Transport {
  return {
    endpoint: process.env.ROOFGO_LEAD_ENDPOINT?.trim() || undefined,
    secret: process.env.ROOFGO_LEAD_SECRET?.trim() || undefined,
    fetch: (...args) => fetch(...args),
    timeoutMs: 8000,
  };
}

/** `t=<unix>,v1=<hex HMAC-SHA256 of "t.body">`, RoofGo's webhook format. */
export function signatureHeader(
  secret: string,
  body: string,
  now = Math.floor(Date.now() / 1000),
): string {
  const v1 = createHmac("sha256", secret)
    .update(`${now}.${body}`)
    .digest("hex");
  return `t=${now},v1=${v1}`;
}

/**
 * Post one lead body. 200 (already there) and 201 count as delivered. A 400
 * or a 409 will never succeed by repeating it, so those stop retrying and
 * alert; everything else (5xx, 401 during a key change, timeouts, network)
 * is retried.
 */
export async function sendBody(
  body: string,
  t: Transport = defaultTransport(),
  method: "POST" | "DELETE" = "POST",
): Promise<SendOutcome> {
  if (!t.endpoint || !t.secret)
    return {
      ok: false,
      retry: true,
      error: "RoofGo lead endpoint not configured",
    };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), t.timeoutMs);
  try {
    const res = await t.fetch(t.endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-RoofGo-Signature": signatureHeader(t.secret, body),
      },
      body,
      signal: controller.signal,
      cache: "no-store",
    });
    if (res.status === 200 || res.status === 201)
      return { ok: true, status: res.status };
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    const permanent =
      res.status === 400 || res.status === 409 || res.status === 413;
    return {
      ok: false,
      retry: !permanent,
      error: `RoofGo responded ${res.status} ${detail}`.trim(),
    };
  } catch (error) {
    const msg =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    return { ok: false, retry: true, error: msg.slice(0, 200) };
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ *
 * The outbox
 * ------------------------------------------------------------------ */

export interface OutboxRow {
  leadId: string;
  publicToken: string;
  body: string | null;
  createdAt: Date;
  attempts: number;
  deliveredAt: Date | null;
  gaveUpAt: Date | null;
  alertedAt: Date | null;
  lastError: string | null;
}

export interface Outbox {
  insert(leadId: string, publicToken: string, body: string): Promise<void>;
  byToken(token: string): Promise<OutboxRow | null>;
  due(limit: number): Promise<OutboxRow[]>;
  delivered(leadId: string): Promise<void>;
  failed(leadId: string, error: string, retry: boolean): Promise<void>;
  /** Undelivered rows older than an hour that nobody has been told about. */
  needsAlert(): Promise<OutboxRow[]>;
  alerted(leadIds: string[]): Promise<void>;
}

/** Retry gaps after each failed attempt: 1m, 5m, 30m, 2h, 12h, then daily. */
export const BACKOFF_SECONDS = [60, 300, 1800, 7200, 43_200, 86_400];
export const backoffAfter = (attempts: number) =>
  BACKOFF_SECONDS[Math.min(Math.max(attempts, 1), BACKOFF_SECONDS.length) - 1];

type Raw = {
  lead_id: string;
  public_token: string;
  body: string | null;
  created_at: string | Date;
  attempts: number;
  delivered_at: string | Date | null;
  gave_up_at: string | Date | null;
  alerted_at: string | Date | null;
  last_error: string | null;
};
const d = (v: string | Date | null) => (v === null ? null : new Date(v));
const toRow = (r: Raw): OutboxRow => ({
  leadId: r.lead_id,
  publicToken: r.public_token,
  body: r.body,
  createdAt: new Date(r.created_at),
  attempts: Number(r.attempts),
  deliveredAt: d(r.delivered_at),
  gaveUpAt: d(r.gave_up_at),
  alertedAt: d(r.alerted_at),
  lastError: r.last_error,
});

let ready: Promise<unknown> | null = null;
/**
 * Created on first use rather than by the /pin migrate button, which is
 * retired. Idempotent, and in this site's own database, beside the /pin
 * tables it replaces (which are kept untouched for the 90-day hold).
 */
function ensureTable() {
  ready ??= (async () => {
    const sql = db();
    await sql`
      CREATE TABLE IF NOT EXISTS roofgo_lead_outbox (
        lead_id         text PRIMARY KEY,
        public_token    text NOT NULL UNIQUE,
        body            text,
        created_at      timestamptz NOT NULL DEFAULT now(),
        attempts        integer NOT NULL DEFAULT 0,
        next_attempt_at timestamptz NOT NULL DEFAULT now(),
        last_error      text,
        delivered_at    timestamptz,
        gave_up_at      timestamptz,
        alerted_at      timestamptz
      )`;
    await sql`
      CREATE INDEX IF NOT EXISTS roofgo_lead_outbox_due_idx
        ON roofgo_lead_outbox (next_attempt_at)
        WHERE delivered_at IS NULL AND gave_up_at IS NULL`;
  })().catch((error) => {
    ready = null;
    throw error;
  });
  return ready;
}

const COLS = `lead_id, public_token, body, created_at, attempts, delivered_at,
              gave_up_at, alerted_at, last_error`;

export const dbOutbox: Outbox = {
  async insert(leadId, publicToken, body) {
    await ensureTable();
    await db()`
      INSERT INTO roofgo_lead_outbox (lead_id, public_token, body)
      VALUES (${leadId}, ${publicToken}, ${body})
      ON CONFLICT (lead_id) DO NOTHING`;
  },
  async byToken(token) {
    await ensureTable();
    const rows = (await db().query(
      `SELECT ${COLS} FROM roofgo_lead_outbox WHERE public_token = $1`,
      [token],
    )) as Raw[];
    return rows[0] ? toRow(rows[0]) : null;
  },
  async due(limit) {
    await ensureTable();
    // Claimed by pushing next_attempt_at forward in the same statement, so
    // two instances draining at once do not post the same lead together.
    const rows = (await db().query(
      `UPDATE roofgo_lead_outbox SET next_attempt_at = now() + interval '2 minutes'
        WHERE lead_id IN (
          SELECT lead_id FROM roofgo_lead_outbox
           WHERE delivered_at IS NULL AND gave_up_at IS NULL AND next_attempt_at <= now()
           ORDER BY created_at LIMIT $1
           FOR UPDATE SKIP LOCKED)
        RETURNING ${COLS}`,
      [limit],
    )) as Raw[];
    return rows.map(toRow);
  },
  async delivered(leadId) {
    await ensureTable();
    // The homeowner's details are RoofGo's to keep now, not this table's.
    await db()`
      UPDATE roofgo_lead_outbox
         SET delivered_at = now(), body = NULL, last_error = NULL,
             attempts = attempts + 1
       WHERE lead_id = ${leadId}`;
  },
  async failed(leadId, error, retry) {
    await ensureTable();
    await db()`
      UPDATE roofgo_lead_outbox
         SET attempts = attempts + 1, last_error = ${error.slice(0, 500)},
             gave_up_at = CASE WHEN ${retry}::boolean THEN NULL ELSE now() END,
             next_attempt_at = now() + make_interval(secs => (
               CASE LEAST(attempts + 1, 6)
                 WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800
                 WHEN 4 THEN 7200 WHEN 5 THEN 43200 ELSE 86400 END))
       WHERE lead_id = ${leadId} AND delivered_at IS NULL`;
  },
  async needsAlert() {
    await ensureTable();
    const rows = (await db().query(
      `SELECT ${COLS} FROM roofgo_lead_outbox
        WHERE delivered_at IS NULL AND alerted_at IS NULL
          AND (gave_up_at IS NOT NULL OR created_at < now() - interval '1 hour')
        ORDER BY created_at LIMIT 50`,
    )) as Raw[];
    return rows.map(toRow);
  },
  async alerted(leadIds) {
    if (!leadIds.length) return;
    await ensureTable();
    await db()`
      UPDATE roofgo_lead_outbox SET alerted_at = now()
       WHERE lead_id = ANY(${leadIds}::text[])`;
  },
};

/* ------------------------------------------------------------------ *
 * The flow
 * ------------------------------------------------------------------ */

export interface Sync {
  outbox: Outbox;
  transport: Transport;
  alert: (rows: OutboxRow[]) => Promise<void>;
}

export const defaultSync = (): Sync => ({
  outbox: dbOutbox,
  transport: defaultTransport(),
  alert: emailAlert,
});

async function attempt(
  s: Sync,
  leadId: string,
  body: string,
): Promise<SendOutcome> {
  const outcome = await sendBody(body, s.transport);
  try {
    if (outcome.ok) await s.outbox.delivered(leadId);
    else await s.outbox.failed(leadId, outcome.error, outcome.retry);
  } catch (error) {
    console.error("[roofgo-lead] could not record the outcome", leadId, error);
  }
  if (!outcome.ok)
    console.error(
      `[roofgo-lead] ${leadId} not delivered (${outcome.retry ? "will retry" : "gave up"}): ${outcome.error}`,
    );
  return outcome;
}

/**
 * Save one new lead: outbox first, then one bounded attempt. Never throws.
 * If the outbox itself cannot be written, the attempt still happens, and a
 * failure then is logged loudly with the whole lead, since it is the only
 * remaining copy outside the lead email.
 */
export async function saveLead(
  lead: RoofgoLead,
  s: Sync = defaultSync(),
): Promise<SendOutcome> {
  const body = JSON.stringify(lead);
  let queued = true;
  try {
    await s.outbox.insert(lead.leadId, lead.publicToken, body);
  } catch (error) {
    queued = false;
    console.error("[roofgo-lead] outbox write failed", lead.leadId, error);
  }
  if (queued) return attempt(s, lead.leadId, body);

  const outcome = await sendBody(body, s.transport);
  if (!outcome.ok)
    console.error(
      `[roofgo-lead] LOST unless re-sent by hand: ${outcome.error}`,
      body,
    );
  return outcome;
}

/** Post whatever is due. Then alert, once per lead, about any still stuck. */
export async function drain(
  s: Sync = defaultSync(),
  limit = 10,
): Promise<{ attempted: number; delivered: number; alerted: number }> {
  let attempted = 0;
  let delivered = 0;
  for (const row of await s.outbox.due(limit)) {
    if (!row.body) continue;
    attempted += 1;
    if ((await attempt(s, row.leadId, row.body)).ok) delivered += 1;
  }
  const stuck = await s.outbox.needsAlert();
  if (stuck.length) {
    try {
      await s.alert(stuck);
      await s.outbox.alerted(stuck.map((r) => r.leadId));
    } catch (error) {
      console.error("[roofgo-lead] alert failed", error);
    }
  }
  return { attempted, delivered, alerted: stuck.length };
}

/**
 * For the homeowner's link: is the lead behind this token at RoofGo? Tries
 * once more right now if it is still waiting. "unknown" means this outbox
 * never saw the token (not a website lead from here).
 */
export async function ensureDelivered(
  token: string,
  s: Sync = defaultSync(),
): Promise<"delivered" | "pending" | "unknown"> {
  const row = await s.outbox.byToken(token);
  if (!row) return "unknown";
  if (row.deliveredAt) return "delivered";
  if (!row.body || row.gaveUpAt) return "pending";
  return (await attempt(s, row.leadId, row.body)).ok ? "delivered" : "pending";
}

/** Remove one lead from RoofGo (a test lead). Signed like a lead. */
export async function withdrawLead(
  leadId: string,
  t: Transport = defaultTransport(),
): Promise<SendOutcome> {
  return sendBody(JSON.stringify({ leadId }), t, "DELETE");
}

/**
 * One email to the office about leads RoofGo has not received. The leads
 * themselves already reached the office and Zapier; this only says the
 * RoofGo copy is missing, so nobody wonders why a lead is not in the app.
 */
async function emailAlert(rows: OutboxRow[]): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ROOFGO_LEAD_ALERT_EMAIL || siteConfig.email;
  const lines = rows.map((r) => {
    let who = "";
    try {
      const l = JSON.parse(r.body ?? "{}") as Partial<RoofgoLead>;
      who = `${l.name ?? ""}, ${l.address ?? ""}`;
    } catch {
      /* body already cleared */
    }
    return `${r.createdAt.toISOString()}  ${r.leadId}  ${who}  (${r.lastError ?? "waiting"})`;
  });
  console.error(
    `[roofgo-lead] ALERT ${rows.length} lead(s) not in RoofGo:\n${lines.join("\n")}`,
  );
  if (!key || !to) return;
  const host = new URL(siteConfig.url).hostname;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Website Leads <leads@${host}>`,
      to: [to],
      subject: `RoofGo has not received ${rows.length} website estimate${rows.length === 1 ? "" : "s"}`,
      text: [
        `These instant estimates reached you by email and Zapier as usual, but`,
        `the copy for RoofGo has not gone through yet. The website keeps retrying`,
        `every day. If it keeps failing, check the RoofGo lead settings.`,
        ``,
        ...lines,
      ].join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}
