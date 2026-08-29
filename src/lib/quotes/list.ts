import "server-only";

import { db } from "./db";
import type { User } from "./auth";
import { ownerScope } from "./auth";

/**
 * Finding an estimate again.
 *
 * The question this answers is the owner's, verbatim: a customer rings up
 * holding a piece of paper, and somebody in the office has to find what was
 * quoted, by whom, and when. Without this the tool could produce estimates and
 * never retrieve one, which makes it a leaflet printer rather than a system.
 *
 * Scoping runs through ownerScope, so a rep sees only their own work and an
 * admin sees everyone's. The rule is applied in SQL rather than in the page,
 * so a screen that forgets it returns nothing instead of somebody else's
 * pipeline.
 */

export interface QuoteListRow {
  quoteId: string;
  shortId: string;
  publicToken: string | null;
  address: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  squares: number;
  priceShown: number | null;
  createdAt: string;
  repName: string;
  repEmail: string;
  /** What has reached this customer. Drives the small chips on the card. */
  emailedAt: string | null;
  mailStatus: "requested" | "mailed" | "rejected" | null;
  hasContact: boolean;
}

interface Raw {
  id: string;
  public_token: string | null;
  address: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  squares: string | number | null;
  price_shown: number | null;
  created_at: string | Date;
  rep_email: string;
  emailed_at?: string | Date | null;
  mail_status?: "requested" | "mailed" | "rejected" | null;
}

const iso = (v: string | Date) =>
  v instanceof Date ? v.toISOString() : String(v);

const repName = (email: string) =>
  (email ?? "")
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ") || "Southeast Roofing";

const toRow = (r: Raw): QuoteListRow => ({
  quoteId: r.id,
  shortId: r.id.slice(0, 8).toUpperCase(),
  publicToken: r.public_token,
  address: r.address,
  name: r.name,
  email: r.email,
  phone: r.phone,
  status: r.status,
  squares: Number(r.squares ?? 0),
  priceShown: r.price_shown,
  createdAt: iso(r.created_at),
  repName: repName(r.rep_email),
  repEmail: r.rep_email,
  emailedAt: r.emailed_at ? iso(r.emailed_at) : null,
  mailStatus: r.mail_status ?? null,
  hasContact: Boolean(r.name || r.email || r.phone),
});

/**
 * Search estimates.
 *
 * One box, because the office does not know in advance whether the caller will
 * read out an estimate number, say their street, or give a name. The query
 * tries all of them at once: the first eight characters of the id (which is
 * what is printed on the document), the address, the homeowner's name, their
 * email and their phone.
 *
 * Phone matching strips punctuation on both sides, since nobody types a number
 * back the way it was stored.
 */
export async function searchQuotes(
  user: User,
  query: string,
  limit = 50,
): Promise<QuoteListRow[]> {
  const scope = ownerScope(user);
  const q = query.trim();
  const digits = q.replace(/\D/g, "");

  const CORE = `q.id, q.public_token, q.squares, q.price_shown, q.created_at,
            c.address, c.name, c.email, c.phone, c.status,
            u.email AS rep_email`;
  const BODY = `
       FROM quotes q
       JOIN customers c ON c.id = q.customer_id
       JOIN users u ON u.id = q.created_by
      WHERE ($2::uuid IS NULL OR c.owner_id = $2::uuid)
        AND (
          $1 = ''
          OR upper(left(q.id::text, 8)) LIKE upper($3)
          OR c.address ILIKE $4
          OR c.name ILIKE $4
          OR c.email ILIKE $4
          OR ($5 <> '' AND regexp_replace(coalesce(c.phone,''), '\\D', '', 'g') LIKE $6)
        )
      ORDER BY q.created_at DESC
      LIMIT $7`;
  const params = [
    q,
    scope,
    `${q.replace(/[^A-Za-z0-9]/g, "")}%`,
    `%${q}%`,
    digits,
    `%${digits}%`,
    limit,
  ];

  /**
   * The delivery columns are optional here, not required.
   *
   * They arrive in a hand-applied migration, and this is the screen somebody
   * opens with a customer on the phone. Losing two small chips is a fair price
   * for never losing the search, which is the lesson the mail board taught the
   * expensive way: degrading to nothing looks exactly like having nothing.
   */
  let rows: Raw[];
  try {
    rows = (await db().query(
      `SELECT ${CORE}, q.emailed_at, q.mail_status ${BODY}`,
      params,
    )) as Raw[];
  } catch (error) {
    console.error("[quotes] estimate list without delivery columns", error);
    rows = (await db().query(`SELECT ${CORE} ${BODY}`, params)) as Raw[];
  }

  return rows.map(toRow);
}

/** Headline counts for the admin screen. */
export async function quoteStats(
  user: User,
): Promise<{ total: number; withEmail: number; sold: number }> {
  const scope = ownerScope(user);
  const rows = (await db().query(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE c.email IS NOT NULL)::int AS with_email,
            count(*) FILTER (WHERE c.status = 'sold')::int AS sold
       FROM quotes q
       JOIN customers c ON c.id = q.customer_id
      WHERE ($1::uuid IS NULL OR c.owner_id = $1::uuid)`,
    [scope],
  )) as Array<{ total: number; with_email: number; sold: number }>;
  const r = rows[0];
  return {
    total: r?.total ?? 0,
    withEmail: r?.with_email ?? 0,
    sold: r?.sold ?? 0,
  };
}

/** How much each rep has quoted, for the team screen. */
export async function repActivity(): Promise<
  Record<string, { quotes: number; lastAt: string | null }>
> {
  const rows = (await db()`
    SELECT u.id, count(q.id)::int AS quotes, max(q.created_at) AS last_at
      FROM users u
      LEFT JOIN quotes q ON q.created_by = u.id
     GROUP BY u.id
  `) as Array<{ id: string; quotes: number; last_at: string | Date | null }>;
  const out: Record<string, { quotes: number; lastAt: string | null }> = {};
  for (const r of rows) {
    out[r.id] = { quotes: r.quotes, lastAt: r.last_at ? iso(r.last_at) : null };
  }
  return out;
}
