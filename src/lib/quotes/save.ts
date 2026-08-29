import "server-only";

import { randomBytes } from "node:crypto";

import { db } from "./db";
import type { User } from "./auth";
import { ownerScope } from "./auth";
import { rateCard } from "@/config/quote-rates";
import type { PricedStructure } from "./structures";

/**
 * Turning a measurement into a customer and a saved quote.
 *
 * Measuring saves nothing on purpose, so a rep can walk a street measuring
 * houses without leaving a trail of records. This is the deliberate step where
 * a pin becomes something the company owns and follows up on.
 */

export interface SaveInput {
  address: string;
  lat: number;
  lon: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  squares: number;
  pitchDegrees: number | null;
  planes: number;
  measureSource: "solar" | "manual";
  measureQuality: string | null;
  imageryDate: string | null;
  material: string;
  stories: number;
  structures?: unknown;
  priceLow: number;
  priceHigh: number;
  priceShown: number | null;
  monthlyLow: number;
  monthlyHigh: number;
}

export interface SavedQuote {
  quoteId: string;
  customerId: string;
  publicToken: string;
}

/**
 * Save a customer and their quote, and mint the shareable token.
 *
 * The rate card is snapshotted into the row rather than referenced. Rates
 * change, and without the snapshot a quote from March cannot be explained in
 * June: "why did we tell them $22,550" would have no answer.
 *
 * Re-quoting the same address by the same rep updates the existing customer
 * instead of creating a second one, so walking back past a house does not
 * produce two records and two prices.
 */
export async function saveQuote(
  user: User,
  input: SaveInput,
): Promise<SavedQuote> {
  const sql = db();

  const existing = (await sql`
    SELECT id FROM customers
     WHERE owner_id = ${user.id}::uuid
       AND round(lat::numeric, 5) = round(${input.lat}::numeric, 5)
       AND round(lon::numeric, 5) = round(${input.lon}::numeric, 5)
     LIMIT 1
  `) as Array<{ id: string }>;

  let customerId: string;
  if (existing.length) {
    customerId = existing[0].id;
    await sql`
      UPDATE customers
         SET address = ${input.address},
             name    = COALESCE(${input.name ?? null}, name),
             email   = COALESCE(${input.email ?? null}, email),
             phone   = COALESCE(${input.phone ?? null}, phone),
             status  = CASE WHEN status = 'new' THEN 'quoted' ELSE status END,
             updated_at = now()
       WHERE id = ${customerId}::uuid
    `;
  } else {
    const created = (await sql`
      INSERT INTO customers (owner_id, address, lat, lon, name, email, phone, status)
      VALUES (${user.id}::uuid, ${input.address}, ${input.lat}, ${input.lon},
              ${input.name ?? null}, ${input.email ?? null}, ${input.phone ?? null}, 'quoted')
      RETURNING id
    `) as Array<{ id: string }>;
    customerId = created[0].id;
  }

  const publicToken = randomBytes(24).toString("base64url");

  const quote = (await sql`
    INSERT INTO quotes (
      customer_id, created_by, roof_sqft, squares, pitch_degrees, planes,
      measure_source, measure_quality, imagery_date, material, stories, structures, rate_card,
      price_low, price_high, price_shown, monthly_low, monthly_high, public_token
    ) VALUES (
      ${customerId}::uuid, ${user.id}::uuid, ${Math.round(input.squares * 100)},
      ${input.squares}, ${input.pitchDegrees}, ${input.planes},
      ${input.measureSource}, ${input.measureQuality}, ${input.imageryDate},
      ${input.material}, ${String(input.stories)},
      ${input.structures ? JSON.stringify(input.structures) : null}::jsonb,
      ${JSON.stringify(rateCard)}::jsonb,
      ${input.priceLow}, ${input.priceHigh}, ${input.priceShown},
      ${input.monthlyLow}, ${input.monthlyHigh}, ${publicToken}
    )
    RETURNING id
  `) as Array<{ id: string }>;

  return { quoteId: quote[0].id, customerId, publicToken };
}

export interface ProposalData {
  quoteId: string;
  publicToken: string | null;
  address: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  lat: number;
  lon: number;
  squares: number;
  pitchDegrees: number | null;
  planes: number;
  priceLow: number;
  priceHigh: number;
  priceShown: number | null;
  monthlyLow: number;
  monthlyHigh: number;
  createdAt: string;
  imageryDate: string | null;
  material: string | null;
  stories: number | null;
  structures: PricedStructure[] | null;
  repName: string;
}

interface Row {
  id: string;
  public_token: string | null;
  address: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  lat: number;
  lon: number;
  /** Postgres numerics arrive as strings; the driver will not narrow them. */
  squares: string | number | null;
  pitch_degrees: string | number | null;
  planes: number | null;
  price_low: number | null;
  price_high: number | null;
  price_shown: number | null;
  monthly_low: number | null;
  monthly_high: number | null;
  /** timestamptz comes back as a Date, NOT a string. See toIsoDate. */
  created_at: string | Date;
  imagery_date: string | Date | null;
  material: string | null;
  stories: string | number | null;
  structures: PricedStructure[] | null;
  rep_email: string;
}

/**
 * Normalise a timestamp to an ISO date string.
 *
 * The Neon driver hydrates timestamptz into a JS Date, while the row type said
 * string, so `createdAt.slice(0, 10)` threw and every proposal page returned a
 * 500. TypeScript could not catch it: the shape of a database row is an
 * assertion about the outside world, not something the compiler can verify.
 * Anything crossing that boundary gets coerced here rather than trusted.
 */
function toIsoDate(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/**
 * A rep's name for a customer-facing document.
 *
 * The proposal used to print the raw mailbox, so a homeowner received a page
 * footed "prepared by sean@southeastroofing.llc". That reads as a system
 * output rather than a person, and it publishes an individual's work address
 * on a document that gets forwarded and left on kitchen tables.
 */
function repDisplayName(email: string): string {
  const local = (email ?? "").split("@")[0] ?? "";
  if (!local) return "Southeast Roofing";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const toProposal = (r: Row): ProposalData => ({
  quoteId: r.id,
  publicToken: r.public_token,
  address: r.address,
  name: r.name,
  email: r.email,
  phone: r.phone,
  lat: Number(r.lat),
  lon: Number(r.lon),
  squares: Number(r.squares ?? 0),
  pitchDegrees: r.pitch_degrees === null ? null : Number(r.pitch_degrees),
  planes: r.planes ?? 0,
  priceLow: r.price_low ?? 0,
  priceHigh: r.price_high ?? 0,
  priceShown: r.price_shown,
  monthlyLow: r.monthly_low ?? 0,
  monthlyHigh: r.monthly_high ?? 0,
  createdAt: toIsoDate(r.created_at),
  imageryDate: r.imagery_date ? toIsoDate(r.imagery_date) : null,
  material: r.material,
  stories: r.stories === null ? null : Number(r.stories),
  structures: r.structures ?? null,
  repName: repDisplayName(r.rep_email),
});

const SELECT = `
  SELECT q.id, q.public_token, q.squares, q.pitch_degrees, q.planes,
         q.price_low, q.price_high, q.price_shown, q.monthly_low, q.monthly_high,
         q.created_at, q.imagery_date, q.material, q.stories, q.structures,
         c.address, c.name, c.email, c.phone, c.lat, c.lon,
         u.email AS rep_email
    FROM quotes q
    JOIN customers c ON c.id = q.customer_id
    JOIN users u ON u.id = q.created_by
`;

/**
 * Load a proposal for a signed-in rep.
 *
 * Scoped through ownerScope so a rep can only open their own customers'
 * quotes, while an admin sees every one. The rule is applied in the query, not
 * in the page, so a screen that forgets it returns nothing rather than
 * somebody else's pipeline.
 */
export async function getProposalForUser(
  id: string,
  user: User,
): Promise<ProposalData | null> {
  const scope = ownerScope(user);
  const rows = (await db().query(
    `${SELECT} WHERE q.id = $1::uuid AND ($2::uuid IS NULL OR c.owner_id = $2::uuid) LIMIT 1`,
    [id, scope],
  )) as Row[];
  return rows.length ? toProposal(rows[0]) : null;
}

/** Load a proposal by its shareable token, for the homeowner's own link. */
export async function getProposalByToken(
  token: string,
): Promise<ProposalData | null> {
  if (!token || token.length < 20) return null;
  const rows = (await db().query(
    `${SELECT} WHERE q.public_token = $1 LIMIT 1`,
    [token],
  )) as Row[];
  return rows.length ? toProposal(rows[0]) : null;
}
