/**
 * What actually hit a given address, and how close it came.
 *
 * Reads the local dataset built by scripts/fetch-storms.mjs, which is NOAA's
 * NCEI Storm Events Database filtered to our service area: human-confirmed,
 * quality controlled, dated, sized and located. No API key, no network call,
 * about 200KB imported once per cold start.
 *
 * THE HONESTY RULE. A confirmed report is a report at a POINT, not a footprint.
 * The observer stood somewhere and wrote down what they saw. So everything here
 * carries a distance and the caller is expected to print it. "1 inch hail
 * confirmed 6 miles from this address on April 22" is true and checkable.
 * "Your roof was hit by hail" is neither, and the first homeowner who checks is
 * the last one who believes the rest of the page.
 *
 * WHAT THIS MEANS FOR SOUTH MISSISSIPPI. Over the three years currently loaded
 * the service area has roughly five times as many confirmed damaging wind
 * events as hail events. This is a wind and roof-age market, not a hail market
 * like Dallas or Denver, and copy that leads with hail will usually have
 * nothing to say. Lead with wind, and with how old the roof is.
 */

import data from "@/data/storms.json";

export type StormKind = "hail" | "wind" | "tornado";

/** One confirmed event, as stored. Short keys keep the JSON small. */
interface RawEvent {
  d: string;
  t: StormKind;
  /** Hail diameter in inches, or wind speed in mph. Null when NCEI had none. */
  m: number | null;
  lat: number;
  lon: number;
  c: string;
  s: string;
  p: string;
}

export interface StormEvent {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  kind: StormKind;
  magnitude: number | null;
  /** Statute miles from the address to where the report was made. */
  distanceMi: number;
  county: string;
  state: string;
  place: string;
  /** "1.75 in hail", "62 mph wind", "tornado". Ready to print. */
  label: string;
  /** True when this one is big enough to plausibly damage an asphalt roof. */
  damaging: boolean;
}

export interface StormSummary {
  events: StormEvent[];
  /** The single most useful one to lead with, or null when nothing is near. */
  headline: StormEvent | null;
  /**
   * The handful to print underneath the headline, already chosen and ordered.
   *
   * This exists because the page used to do it itself, by taking the damaging
   * events sorted by distance and slicing off items 1 to 3. That was wrong
   * twice over, and the owner spotted the symptom: "how come only wind dates
   * are shown and never hail info?"
   *
   * Wind outnumbers hail here more than five to one, so the three NEAREST
   * events are nearly always wind. At Biloxi the page led with 1.75 inch hail
   * and then listed three wind reports, burying the one fact a homeowner
   * actually wanted. And slicing from index 1 assumed the headline was the
   * nearest event, which it usually is not: at Hattiesburg it silently dropped
   * a 61 mph gust 0.2 miles away, the most relevant line on the page, while at
   * Carriere it printed the headline event a second time.
   */
  supporting: StormEvent[];
  counts: { hail: number; wind: number; tornado: number };
  /** One sentence, true as written, safe to print on a mailer. */
  sentence: string | null;
  /** Years covered by the dataset, for the fine print. */
  years: number[];
  source: string;
}

const EVENTS = data.events as RawEvent[];

/**
 * Damage thresholds. An asphalt shingle roof in good condition generally starts
 * to bruise around one inch of hail; below that the claim is hard to defend and
 * we should not be implying one. Wind is messier because age dominates, but 50
 * mph is the National Weather Service severe threshold and it is where an aged
 * three-tab starts losing tabs.
 */
const HAIL_DAMAGING_IN = 1.0;
const WIND_DAMAGING_MPH = 50;

const EARTH_MI = 3958.8;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in statute miles. */
function distanceMi(
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
  return 2 * EARTH_MI * Math.asin(Math.sqrt(h));
}

function isDamaging(e: RawEvent): boolean {
  if (e.t === "tornado") return true;
  if (e.m === null) return false;
  return e.t === "hail" ? e.m >= HAIL_DAMAGING_IN : e.m >= WIND_DAMAGING_MPH;
}

function label(e: RawEvent): string {
  if (e.t === "tornado") return "tornado";
  if (e.m === null) return e.t === "hail" ? "hail" : "damaging wind";
  // NCEI stores 1.00 and 1.50; a homeowner reads 1 inch and 1.5 inch.
  return e.t === "hail"
    ? `${parseFloat(e.m.toFixed(2))} in hail`
    : `${Math.round(e.m)} mph wind`;
}

export interface StormQuery {
  /** How far out to look. Ten miles is close enough to feel local. */
  radiusMi?: number;
  /** Cap the list. The mailer has room for three. */
  limit?: number;
  /** Only return events big enough to plausibly damage a roof. */
  damagingOnly?: boolean;
}

/** Every confirmed event near a point, nearest first. */
export function stormsNear(
  lat: number,
  lon: number,
  query: StormQuery = {},
): StormEvent[] {
  const radius = query.radiusMi ?? 10;
  const out: StormEvent[] = [];

  for (const e of EVENTS) {
    // Cheap rejection before the trig. One degree of latitude is about 69
    // miles, and longitude is never longer than that, so a box this size can
    // never exclude something the radius would have kept.
    const deg = radius / 69 + 0.01;
    if (Math.abs(e.lat - lat) > deg) continue;
    if (Math.abs(e.lon - lon) > deg / Math.max(Math.cos(rad(lat)), 0.2))
      continue;

    const d = distanceMi(lat, lon, e.lat, e.lon);
    if (d > radius) continue;
    const damaging = isDamaging(e);
    if (query.damagingOnly && !damaging) continue;

    out.push({
      date: e.d,
      kind: e.t,
      magnitude: e.m,
      distanceMi: Math.round(d * 10) / 10,
      county: e.c,
      state: e.s,
      place: e.p,
      label: label(e),
      damaging,
    });
  }

  out.sort((a, b) => a.distanceMi - b.distanceMi);
  return query.limit ? out.slice(0, query.limit) : out;
}

/**
 * Pick the one event worth leading with.
 *
 * Not simply the nearest. A tornado two towns over is a better opener than a
 * 50 mph gust down the street, and a two inch hailstone is worth more than a
 * marginal one even if it fell a little further away. So rank by how much the
 * event would matter to a homeowner, then break ties on distance.
 */
function rank(e: StormEvent): number {
  const recency = new Date(e.date).getTime() / 1e12;
  let severity: number;
  if (e.kind === "tornado") severity = 10;
  else if (e.kind === "hail") severity = 4 + (e.magnitude ?? 1) * 3;
  else severity = (e.magnitude ?? 50) / 12;
  // Distance matters, but softly. Five miles away is still "your area".
  return severity - e.distanceMi * 0.25 + recency;
}

/**
 * The lines to print under the headline.
 *
 * Every kind of storm that happened near this address gets a slot before any
 * kind gets a second one. That is the whole point: hail is rare here and it is
 * the thing a homeowner most wants to know about, so a page that ranks purely
 * by distance or severity will bury it under wind every time.
 *
 * The headline is excluded by identity rather than by position, because it is
 * picked by rank while the list is built from a different ordering, and
 * assuming they agreed is what printed one event twice.
 *
 * Ordered newest first once chosen. A homeowner reads this as a history, and a
 * history runs in time order, not in order of how close the observer stood.
 */
function supportingEvents(
  pool: StormEvent[],
  headline: StormEvent | null,
  n = 3,
): StormEvent[] {
  const rest = pool.filter((e) => e !== headline);
  const best = [...rest].sort((a, b) => rank(b) - rank(a));
  const out: StormEvent[] = [];
  const covered = new Set<StormKind>(headline ? [headline.kind] : []);

  for (const e of best) {
    if (out.length >= n) break;
    if (covered.has(e.kind)) continue;
    covered.add(e.kind);
    out.push(e);
  }
  for (const e of best) {
    if (out.length >= n) break;
    if (!out.includes(e)) out.push(e);
  }

  return out.sort((a, b) => b.date.localeCompare(a.date));
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "April 22, 2025" from "2025-04-22", without pulling in a date library. */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

/**
 * Everything the quote page and the mailer need about this address's weather.
 *
 * The sentence is deliberately built from facts that are all on the record:
 * what, how big, how far, and when. It never says the roof was damaged, and it
 * never says the storm was "at" the house, because neither is something a
 * confirmed report can support.
 */
export function summarizeStorms(
  lat: number,
  lon: number,
  query: StormQuery = {},
): StormSummary {
  const events = stormsNear(lat, lon, { radiusMi: 15, ...query });
  const counts = {
    hail: events.filter((e) => e.kind === "hail").length,
    wind: events.filter((e) => e.kind === "wind").length,
    tornado: events.filter((e) => e.kind === "tornado").length,
  };

  const damaging = events.filter((e) => e.damaging);
  const pool = damaging.length ? damaging : events;
  const headline = pool.length
    ? [...pool].sort((a, b) => rank(b) - rank(a))[0]
    : null;

  let sentence: string | null = null;
  if (headline) {
    const where =
      headline.distanceMi < 1
        ? "less than a mile from this address"
        : `${headline.distanceMi} miles from this address`;
    const what =
      headline.kind === "tornado"
        ? "A tornado was confirmed"
        : `${headline.label.replace(/^(\d)/, (c) => c.toUpperCase())} was confirmed`;
    sentence = `${what} ${where} on ${longDate(headline.date)}.`;
  }

  return {
    events,
    headline,
    supporting: supportingEvents(pool, headline),
    counts,
    sentence,
    years: data.years as number[],
    source: data.source as string,
  };
}

/** For the fine print: when the dataset was last rebuilt. */
export const stormDataBuilt = data.built as string;
