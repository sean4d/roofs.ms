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
  /** The address of the estimate that matched, which is NOT always the one the
   *  rep just tapped. Always show it. */
  address: string;
  /** Who owns the relationship. The rep about to duplicate it needs a name. */
  repName: string;
  emailedAt: string | null;
  emailedTo: string | null;
  printedAt: string | null;
  mailStatus: MailStatus | null;
  mailRequestedAt: string | null;
  mailedAt: string | null;
  /** How far the matched pin is from the tap. */
  distanceFeet: number;
  /**
   * TRUE ONLY WHEN IT IS THE SAME PROPERTY. False means a neighbour, and the
   * two must never be shown the same way: one is "you have already done this
   * house", the other is "somebody has worked this street".
   */
  sameProperty: boolean;
  /** One sentence, ready to show. Null when nothing has actually gone out. */
  sentence: string | null;
}

/**
 * How close counts as the same house, and how close counts as nearby.
 *
 * THIS WAS ONE NUMBER AND IT WAS FAR TOO BIG. The rule was a box of about 45
 * metres in each direction from the tap, on the reasoning that a warning that
 * fails to fire is worthless while one that fires on the house next door costs
 * ten seconds to dismiss. That reasoning is wrong in a subdivision, which is
 * where this tool is used.
 *
 * 45 metres each way is a box 90 by 96 metres, roughly 300 feet square. Gulf
 * Coast tract lots run 60 to 70 feet wide and 110 to 120 deep, so that box
 * holds two houses either side, the ones across the street and the ones backing
 * on to the yard: eight to twelve properties, all reported as "this address".
 * Patrick and Aaron found it the first morning they canvassed Gulfport
 * together. One of them would request a mailer, the other would tap a house
 * three doors down that nobody had ever opened, and the map told him the
 * customer had already been contacted.
 *
 * A warning that is wrong most of the time is worse than no warning, because
 * reps learn to tap through it and then it fails on the one that was real.
 *
 * So there are two distances now and they mean different things. Inside
 * SAME_PROPERTY_FT it is the same roof: two reps tapping one house land a few
 * feet apart, and even a large house is only about fifty feet across. Out to
 * NEARBY_FT it is the street, which is still worth knowing and is shown as
 * what it is. Beyond that, nothing.
 *
 * The distance is only the fallback. When both addresses are known, the
 * ADDRESS decides, because two different house numbers are two different
 * houses no matter how close the pins are.
 */
const SAME_PROPERTY_FT = 80;
const NEARBY_FT = 300;
const FT_PER_M = 3.280839895;

const EARTH_M = 6371008.8;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in feet. */
function distanceFeet(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.sqrt(h)) * FT_PER_M;
}

/**
 * Street suffixes and directions, so one spelling of an address matches another.
 *
 * Google is consistent about formatted addresses most of the time and not all
 * of the time: the same house can come back as "Loop" from a reverse geocode
 * and "Lp" from a forward one. Folding both to the same token means a rep who
 * typed the address and a rep who tapped the roof are recognised as having
 * found the same property.
 */
const STREET_WORD: Record<string, string> = {
  street: "st",
  road: "rd",
  avenue: "ave",
  av: "ave",
  drive: "dr",
  lane: "ln",
  court: "ct",
  circle: "cir",
  loop: "lp",
  boulevard: "blvd",
  place: "pl",
  terrace: "ter",
  trail: "trl",
  highway: "hwy",
  parkway: "pkwy",
  north: "n",
  south: "s",
  east: "e",
  west: "w",
  northeast: "ne",
  northwest: "nw",
  southeast: "se",
  southwest: "sw",
};

/**
 * The house number and street, normalised, or null when there is no number.
 *
 * No number means no property: "Hattiesburg, MS 39402" identifies a town. Those
 * fall back to distance rather than matching everything in the town.
 */
export function streetKey(address: string | null | undefined): string | null {
  if (!address) return null;
  const tokens = (address.split(",")[0] ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => STREET_WORD[t] ?? t);
  if (!tokens.length || !/^\d/.test(tokens[0])) return null;
  return tokens.join(" ");
}

export interface NearCandidate {
  address: string;
  lat: number | string;
  lon: number | string;
}

export interface NearMatch<T> {
  row: T;
  feet: number;
  sameProperty: boolean;
}

/**
 * Which pin near a tap is worth showing, and whether it is the same property.
 *
 * SEPARATED FROM THE QUERY SO IT CAN BE TESTED. This is the rule that was
 * wrong, and it was wrong in a way no amount of reading the code would have
 * caught: it needed real coordinates a real distance apart on a real street.
 * scripts/check-prior-contact.mts walks a Gulfport block through it.
 *
 * The address decides when both are known, because two different house numbers
 * are two different houses. Distance is the fallback, and it is only reached
 * where a reverse geocode found no street address: rural addresses, where the
 * lots are acres and eighty feet cannot reach a neighbour.
 */
export function classifyNear<T extends NearCandidate>(
  lat: number,
  lon: number,
  tappedAddress: string | null | undefined,
  rows: T[],
): NearMatch<T> | null {
  const tapped = streetKey(tappedAddress);

  const scored = rows
    .map((row) => {
      const feet = distanceFeet(lat, lon, Number(row.lat), Number(row.lon));
      const key = streetKey(row.address);
      const sameProperty =
        tapped && key ? tapped === key : feet <= SAME_PROPERTY_FT;
      return { row, feet, sameProperty };
    })
    .filter((c) => c.feet <= NEARBY_FT);

  if (!scored.length) return null;

  // The same house always outranks a neighbour, however recent the neighbour
  // is. Within a tier the nearest wins, and the rows arrive newest first so
  // ties keep that order.
  scored.sort((a, b) => {
    if (a.sameProperty !== b.sameProperty) return a.sameProperty ? -1 : 1;
    return a.feet - b.feet;
  });

  return scored[0];
}

/**
 * Run a query, or give up quietly.
 *
 * EVERY READ OF A COLUMN ADDED IN THIS FILE GOES THROUGH HERE, and the reason
 * is a mistake worth not repeating. Migrations are applied by hand, so a
 * deployment can be live for minutes or days before its columns exist. The
 * first version of this module queried them directly, which meant the moment
 * it shipped the settings page threw a 500 on the missing column, and the
 * settings page is where the button that runs the migration lives. The tool
 * had locked its own keys inside.
 *
 * So a missing column degrades to "nothing to show" rather than to a broken
 * page. The health endpoint is what reports the schema is behind; this is what
 * makes sure the site still works while it is.
 */
async function queryOrNull<T>(
  sql: string,
  params: unknown[],
): Promise<T[] | null> {
  try {
    return (await db().query(sql, params)) as T[];
  } catch (error) {
    console.error("[delivery] query failed, degrading", error);
    return null;
  }
}

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

/**
 * Just the street line, for a rep reading a phone in the sun.
 *
 * Google returns "15084 Sagewood St, Gulfport, MS 39503, USA" and printing all
 * of it turned a one line notice into four. The rep is standing on Sagewood
 * Street; they do not need telling which country it is in.
 */
export const shortAddress = (address: string): string =>
  address.split(",")[0]?.trim() || address;

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
  lat: number | string;
  lon: number | string;
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
  /** The address the rep just tapped, when the reverse geocode found one. It
   *  is the strongest signal there is and beats any distance. */
  tappedAddress?: string | null,
): Promise<PriorContact | null> {
  // A rejected address lookup returns 0,0. Asking what has been posted near
  // the Gulf of Guinea is at best a wasted query.
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat === 0 && lon === 0) return null;

  // The search box is derived from the distance rather than hard-coded, so it
  // is the right shape at any latitude. A degree of longitude is only 96,000
  // feet at Gulfport and a degree of latitude is 364,000 everywhere.
  const degLat = NEARBY_FT / 364000;
  const degLon = NEARBY_FT / (364000 * Math.max(Math.cos(rad(lat)), 0.05));

  const rows = (await queryOrNull(
    `SELECT q.id, c.address, c.lat, c.lon, u.email AS rep_email,
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
      LIMIT 40`,
    [lat, lon, degLat, degLon],
  )) as PriorRow[] | null;

  if (!rows || !rows.length) return null;

  /* The box is a candidate list, not an answer. It is square, so its corners
     reach 40% further than its sides, and it says nothing about whether the
     pin inside it is the house the rep is standing in front of. */
  const best = classifyNear(lat, lon, tappedAddress, rows);
  if (!best) return null;
  const { row: r, feet, sameProperty } = best;

  const emailedAt = iso(r.emailed_at);
  const printedAt = iso(r.printed_at);
  const mailedAt = r.mail_status === "mailed" ? iso(r.mail_handled_at) : null;
  const mailRequestedAt = iso(r.mail_requested_at);
  const who = repName(r.rep_email);

  /*
   * The most committing thing that happened is the one worth saying. A posted
   * estimate outranks an emailed one, which outranks a queued mailer.
   *
   * THE ADDRESS IS NAMED WHEN IT IS A NEIGHBOUR. These sentences used to say
   * "this address" and "this customer" whatever had matched, which is what
   * turned a loose proximity rule into the tool telling a rep something that
   * was not true. If it is not the house they tapped, the sentence has to say
   * whose house it is.
   */
  const where = sameProperty ? "this address" : shortAddress(r.address);
  const whose = sameProperty ? "this customer" : shortAddress(r.address);

  let sentence: string | null = null;
  if (mailedAt) {
    sentence = `${who} posted ${whose} an estimate on ${shortDate(mailedAt)}.`;
  } else if (emailedAt) {
    sentence = `${who} emailed ${whose} an estimate on ${shortDate(emailedAt)}.`;
  } else if (r.mail_status === "requested") {
    sentence = `${who} has a mailer waiting to go out for ${where}, requested ${shortDate(mailRequestedAt)}.`;
  } else if (r.mail_status === "rejected") {
    sentence = `A mailer for ${where} was rejected by the office. Check the estimate before sending another.`;
  } else if (printedAt) {
    sentence = `${who} printed an estimate for ${where} on ${shortDate(printedAt)}.`;
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
    distanceFeet: Math.round(feet),
    sameProperty,
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
  /** Everything the office needs to correct the quote before it is printed. */
  pitchOver12: number | null;
  planes: number;
  material: string;
  stories: number;
  structures: Array<{
    label: string;
    squares: number;
    pitchOver12: number | null;
    planes: number;
    material: string;
    stories: number;
    lat: number;
    lon: number;
  }> | null;
  lat: number;
  lon: number;
  editedAt: string | null;
  editedBy: string | null;
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
  pitch_degrees: string | number | null;
  planes: number | null;
  material: string | null;
  stories: string | number | null;
  structures: MailRow["structures"];
  lat: number;
  lon: number;
  edited_at: string | Date | null;
  edited_by: string | null;
}

/**
 * The office's mail board.
 *
 * Requested first and oldest first inside that, because a mailer that has been
 * sitting for a week is the one costing money. Everything else is history, and
 * history is read newest first.
 */
/**
 * The office's mail board.
 *
 * Requested first and oldest first inside that, because a mailer that has been
 * sitting for a week is the one costing money. Everything else is history, and
 * history is read newest first.
 *
 * TWO FORMS, AND THE SECOND ONE MATTERS. This query grew a reference to
 * edited_at when the office got an edit button, and edited_at arrives in a
 * migration that is applied by hand. Between the deploy and that button being
 * pressed the whole query failed, queryOrNull did what it is supposed to do
 * and returned nothing, and the board showed "Nothing waiting" to an owner who
 * had a mailer requested and another posted. Degrading to silence is worse
 * than degrading to slightly less: his data was there the whole time and the
 * screen told him it was not.
 *
 * So the fallback drops the columns it cannot have and keeps the rows. The
 * board loses one grey line saying who corrected the quote. It does not lose
 * the queue.
 */
export async function listMail(status: MailStatus): Promise<MailRow[]> {
  const CORE = `q.id, q.public_token, q.price_shown, q.price_low, q.squares,
            q.created_at, q.mail_requested_at, q.mail_handled_at,
            q.mail_status, q.mail_note, q.emailed_at,
            q.pitch_degrees, q.planes, q.material, q.stories, q.structures,
            c.address, c.name, c.phone, c.email, c.lat, c.lon,
            req.email AS requested_by, handler.email AS handled_by`;
  const FROM = `
       FROM quotes q
       JOIN customers c ON c.id = q.customer_id
       LEFT JOIN users req     ON req.id = q.mail_requested_by
       LEFT JOIN users handler ON handler.id = q.mail_handled_by`;
  const TAIL = `
      WHERE q.mail_status = $1
      ORDER BY CASE WHEN $1 = 'requested' THEN q.mail_requested_at END ASC,
               q.mail_handled_at DESC NULLS LAST
      LIMIT 300`;

  let rows: RawMailRow[] | null = null;
  try {
    rows = (await db().query(
      `SELECT ${CORE}, q.edited_at, editor.email AS edited_by
       ${FROM}
       LEFT JOIN users editor ON editor.id = q.edited_by
       ${TAIL}`,
      [status],
    )) as RawMailRow[];
  } catch (error) {
    console.error("[delivery] mail board without the edit columns", error);
    rows = await queryOrNull<RawMailRow>(
      `SELECT ${CORE},
              NULL::timestamptz AS edited_at, NULL::text AS edited_by
       ${FROM} ${TAIL}`,
      [status],
    );
  }

  return (rows ?? []).map((r) => ({
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
    pitchOver12:
      r.pitch_degrees === null
        ? null
        : Math.round(
            Math.tan((Number(r.pitch_degrees) * Math.PI) / 180) * 12 * 10,
          ) / 10,
    planes: r.planes ?? 0,
    material: r.material ?? "architectural",
    stories: Number(r.stories ?? 1),
    structures: r.structures ?? null,
    lat: Number(r.lat),
    lon: Number(r.lon),
    editedAt: iso(r.edited_at),
    editedBy: r.edited_by ? repName(r.edited_by) : null,
  }));
}

/** How many are waiting, for the badge on the nav. */
export async function mailQueueSize(): Promise<number> {
  const rows = await queryOrNull<{ n: number }>(
    `SELECT count(*)::int AS n FROM quotes WHERE mail_status = 'requested'`,
    [],
  );
  return rows?.[0]?.n ?? 0;
}
