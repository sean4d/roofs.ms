import "server-only";

import { db } from "./db";
import type { User } from "./auth";

/**
 * What has reached a customer, and what is queued to.
 *
 * THE PROBLEM THIS SOLVES is two reps working the same street a fortnight
 * apart and both posting the same homeowner an estimate. To that homeowner it
 * reads as a company that does not know what its own people are doing, which
 * is the opposite of the impression the document is there to make. Nothing in
 * the tool could tell you: a quote recorded that it existed and nothing about
 * whether anybody had ever been sent it.
 *
 * So every channel is recorded separately, and the map warns BEFORE the rep
 * does anything, at the moment they tap the house.
 *
 * The mail flow has a person in the middle of it, so it is a queue rather than
 * a flag. A rep requests a mailer from the field; the office prints it, puts
 * it in an envelope and marks it mailed; or the office looks at the estimate,
 * decides the measurement is not good enough to post, and rejects it with a
 * reason. That last state is the one worth having. A rejection tells the rep
 * their estimate was not good enough to send, and that is the only route by
 * which anybody's estimates ever get better.
 */

export type MailStatus = "requested" | "mailed" | "rejected";

/** What the map says when a rep taps a house we have already contacted. */
export interface PriorContact {
  quoteId: string;
  address: string;
  /** Who owns the relationship. The rep about to duplicate it needs a name. */
  repName: string;
  emailedAt: string | null;
  emailedTo: string | null;
  printedAt: string | null;
  mailStatus: MailStatus | null;
  mailRequestedAt: string | null;
  mailedAt: string | null;
  /** One sentence, ready to show. Null when nothing has actually gone out. */
  sentence: string | null;
}

/**
 * How close two taps have to be to mean the same house.
 *
 * About 45 metres. Deliberately generous: two reps tapping the same roof will
 * land tens of feet apart, and a warning that fails to fire is worthless while
 * one that fires on the house next door costs a rep ten seconds to dismiss.
 * When in doubt, warn.
 */
const SAME_HOUSE_LAT = 0.0004;
const SAME_HOUSE_LON = 0.0005;

const iso = (v: string | Date | null): string | null =>
  v == null ? null : v instanceof Date ? v.toISOString() : String(v);

/** Turn an email local part into something printable. See repDisplayName. */
function repName(email: string | null): string {
  const local = (email ?? "").split("@")[0] ?? "";
  if (!local) return "another rep";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

const shortDate = (v: string | null): string => {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

interface PriorRow {
  id: string;
  address: string;
  rep_email: string | null;
  emailed_at: string | Date | null;
  emailed_to: string | null;
  printed_at: string | Date | null;
  mail_status: MailStatus | null;
  mail_requested_at: string | Date | null;
  mail_handled_at: string | Date | null;
}

/**
 * Has anybody here already sent this homeowner an estimate?
 *
 * COMPANY-WIDE ON PURPOSE, not scoped to the rep asking. Every other query in
 * this app is scoped so a rep cannot see a colleague's pipeline, and this one
 * has to be the exception, because the entire point is to catch the case where
 * the other rep is somebody else. What comes back is deliberately thin: an
 * address the rep is already standing in front of, a colleague's first name,
 * and what was sent when. Not the price, not the customer's phone number.
 */
export async function priorContactNear(
  lat: number,
  lon: number,
): Promise<PriorContact | null> {
  const rows = (await db().query(
    `SELECT q.id, c.address, u.email AS rep_email,
            q.emailed_at, q.emailed_to, q.printed_at,
            q.mail_status, q.mail_requested_at, q.mail_handled_at
       FROM quotes q
       JOIN customers c ON c.id = q.customer_id
       LEFT JOIN users u ON u.id = q.created_by
      WHERE c.lat BETWEEN $1::float8 - $3::float8 AND $1::float8 + $3::float8
        AND c.lon BETWEEN $2::float8 - $4::float8 AND $2::float8 + $4::float8
        AND (q.emailed_at IS NOT NULL
             OR q.printed_at IS NOT NULL
             OR q.mail_status IS NOT NULL)
      ORDER BY GREATEST(
                 COALESCE(q.emailed_at, 'epoch'::timestamptz),
                 COALESCE(q.printed_at, 'epoch'::timestamptz),
                 COALESCE(q.mail_handled_at, 'epoch'::timestamptz),
                 COALESCE(q.mail_requested_at, 'epoch'::timestamptz)
               ) DESC
      LIMIT 1`,
    [lat, lon, SAME_HOUSE_LAT, SAME_HOUSE_LON],
  )) as PriorRow[];

  if (!rows.length) return null;
  const r = rows[0];

  const emailedAt = iso(r.emailed_at);
  const printedAt = iso(r.printed_at);
  const mailedAt = r.mail_status === "mailed" ? iso(r.mail_handled_at) : null;
  const mailRequestedAt = iso(r.mail_requested_at);
  const who = repName(r.rep_email);

  // The most committing thing that happened is the one worth saying. A posted
  // estimate outranks an emailed one, which outranks a queued mailer.
  let sentence: string | null = null;
  if (mailedAt) {
    sentence = `${who} posted this customer an estimate on ${shortDate(mailedAt)}.`;
  } else if (emailedAt) {
    sentence = `${who} emailed this customer an estimate on ${shortDate(emailedAt)}.`;
  } else if (r.mail_status === "requested") {
    sentence = `${who} has a mailer waiting to go out for this address, requested ${shortDate(mailRequestedAt)}.`;
  } else if (r.mail_status === "rejected") {
    sentence = `A mailer for this address was rejected by the office. Check the estimate before sending another.`;
  } else if (printedAt) {
    sentence = `${who} printed an estimate for this address on ${shortDate(printedAt)}.`;
  }

  return {
    quoteId: r.id,
    address: r.address,
    repName: who,
    emailedAt,
    emailedTo: r.emailed_to,
    printedAt,
    mailStatus: r.mail_status,
    mailRequestedAt,
    mailedAt,
    sentence,
  };
}

/** Record that an estimate was emailed. Called by the send route. */
export async function recordEmailed(quoteId: string, to: string) {
  await db()`
    UPDATE quotes
       SET emailed_at = now(), emailed_to = ${to},
           sent_via = 'email', sent_at = now()
     WHERE id = ${quoteId}::uuid
  `;
}

/**
 * Record that an estimate was printed.
 *
 * Best effort by design. This fires from the browser as the print dialog
 * opens, and there is no way to know whether paper actually came out, so it
 * means "somebody opened the print dialog on this estimate" and the wording
 * everywhere says printed rather than posted. Posting is the mail flow below,
 * where a human confirms it.
 */
export async function recordPrinted(quoteId: string) {
  await db()`
    UPDATE quotes SET printed_at = now() WHERE id = ${quoteId}::uuid
  `;
}

/** A rep asks the office to print and post this one. */
export async function requestMail(quoteId: string, user: User) {
  await db()`
    UPDATE quotes
       SET mail_status = 'requested',
           mail_requested_at = now(),
           mail_requested_by = ${user.id}::uuid,
           mail_handled_at = NULL,
           mail_handled_by = NULL,
           mail_note = NULL
     WHERE id = ${quoteId}::uuid
  `;
}

/** The office posts it, or refuses to. */
export async function resolveMail(
  quoteId: string,
  status: "mailed" | "rejected",
  user: User,
  note: string | null,
) {
  await db()`
    UPDATE quotes
       SET mail_status = ${status},
           mail_handled_at = now(),
           mail_handled_by = ${user.id}::uuid,
           mail_note = ${note},
           sent_via = CASE WHEN ${status} = 'mailed' THEN 'mail' ELSE sent_via END,
           sent_at   = CASE WHEN ${status} = 'mailed' THEN now() ELSE sent_at END
     WHERE id = ${quoteId}::uuid
  `;
}

export interface MailRow {
  quoteId: string;
  publicToken: string | null;
  address: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  price: number;
  squares: number;
  createdAt: string;
  requestedBy: string;
  requestedAt: string | null;
  handledBy: string | null;
  handledAt: string | null;
  status: MailStatus;
  note: string | null;
  emailedAt: string | null;
}

interface RawMailRow {
  id: string;
  public_token: string | null;
  address: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  price_shown: number | null;
  price_low: number | null;
  squares: string | number | null;
  created_at: string | Date;
  requested_by: string | null;
  mail_requested_at: string | Date | null;
  handled_by: string | null;
  mail_handled_at: string | Date | null;
  mail_status: MailStatus;
  mail_note: string | null;
  emailed_at: string | Date | null;
}

/**
 * The office's mail board.
 *
 * Requested first and oldest first inside that, because a mailer that has been
 * sitting for a week is the one costing money. Everything else is history, and
 * history is read newest first.
 */
export async function listMail(status: MailStatus): Promise<MailRow[]> {
  const rows = (await db().query(
    `SELECT q.id, q.public_token, q.price_shown, q.price_low, q.squares,
            q.created_at, q.mail_requested_at, q.mail_handled_at,
            q.mail_status, q.mail_note, q.emailed_at,
            c.address, c.name, c.phone, c.email,
            req.email AS requested_by, handler.email AS handled_by
       FROM quotes q
       JOIN customers c ON c.id = q.customer_id
       LEFT JOIN users req     ON req.id = q.mail_requested_by
       LEFT JOIN users handler ON handler.id = q.mail_handled_by
      WHERE q.mail_status = $1
      ORDER BY CASE WHEN $1 = 'requested' THEN q.mail_requested_at END ASC,
               q.mail_handled_at DESC NULLS LAST
      LIMIT 300`,
    [status],
  )) as RawMailRow[];

  return rows.map((r) => ({
    quoteId: r.id,
    publicToken: r.public_token,
    address: r.address,
    name: r.name,
    phone: r.phone,
    email: r.email,
    price: r.price_shown ?? r.price_low ?? 0,
    squares: Number(r.squares ?? 0),
    createdAt: iso(r.created_at)!,
    requestedBy: repName(r.requested_by),
    requestedAt: iso(r.mail_requested_at),
    handledBy: r.handled_by ? repName(r.handled_by) : null,
    handledAt: iso(r.mail_handled_at),
    status: r.mail_status,
    note: r.mail_note,
    emailedAt: iso(r.emailed_at),
  }));
}

/** How many are waiting, for the badge on the nav. */
export async function mailQueueSize(): Promise<number> {
  const rows = (await db()`
    SELECT count(*)::int AS n FROM quotes WHERE mail_status = 'requested'
  `) as Array<{ n: number }>;
  return rows[0]?.n ?? 0;
}
