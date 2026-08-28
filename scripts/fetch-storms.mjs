/**
 * Build the local storm history dataset from NOAA.
 *
 * WHY A BUILD STEP AND NOT A LIVE API. The obvious source for "what hit this
 * house" is NOAA's SWDI radar hail feed (nx3hail), and it is a trap. It is the
 * NEXRAD hail DETECTION ALGORITHM's output, one row per storm cell per volume
 * scan, from every radar that can see the cell. One month inside 15 miles of
 * Hattiesburg returns 42,109 rows spread over 30 of the month's 31 days, with a
 * reported max size of 4.00 inches on ten separate days. Hattiesburg did not
 * get four inch hail ten times in March 2024. That feed says "the radar saw a
 * reflectivity core aloft," not "hail landed here," and a mailer built on it
 * would tell every homeowner in the Pine Belt they were hit constantly. The
 * first person who checked would stop believing anything else on the page.
 *
 * So we use NCEI's Storm Events Database instead: human-confirmed, quality
 * controlled, dated, sized, and located. Sparse, and real. The tradeoff is that
 * it ships as one large annual CSV for the whole country, which is far too big
 * to touch per request, so this script pulls those files once, keeps only the
 * roof-damaging event types inside our service area, and writes a small JSON
 * the app can load with no network call and no API key.
 *
 * Re-run it a few times a year. NCEI revises recent months as reports are
 * confirmed, so the current year's numbers move for a while and then settle.
 *
 *   node scripts/fetch-storms.mjs
 */

import { gunzipSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const INDEX = "https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/";
const OUT = resolve(process.cwd(), "src/data/storms.json");

/** Years to carry. Three is what a homeowner will recognize as "recently." */
const YEARS = (() => {
  const now = new Date().getUTCFullYear();
  return [now - 2, now - 1, now];
})();

/**
 * Service area, from src/config/city-coords.ts plus a margin. Storms are
 * reported at the point they were observed, which is rarely the house, so the
 * box has to run well past the furthest town we serve for a 30 mile radius
 * search around its edges to still find anything.
 */
const BOX = { minLat: 29.5, maxLat: 33.2, minLon: -91.3, maxLon: -87.7 };

/** The four that take roofs off. Flood and lightning are somebody else's job. */
const KEEP = new Set(["Hail", "Thunderstorm Wind", "Tornado", "High Wind"]);

/** Minimal RFC 4180 reader. NCEI quotes its narrative fields and they contain
 *  both commas and doubled quotes, so a split(",") loses rows silently. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** "16-FEB-25 07:20:00" is the only date NCEI gives us. Turn it into ISO. */
const MONTHS = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};
function isoDate(raw) {
  const m = /^(\d{2})-([A-Z]{3})-(\d{2})/.exec(raw ?? "");
  if (!m) return null;
  const mo = MONTHS[m[2]];
  if (!mo) return null;
  return `20${m[3]}-${mo}-${m[1]}`;
}

async function fileForYear(year) {
  const res = await fetch(INDEX);
  if (!res.ok) throw new Error(`NCEI index ${res.status}`);
  const html = await res.text();
  const re = new RegExp(
    `StormEvents_details-ftp_v1\\.0_d${year}_c\\d+\\.csv\\.gz`,
    "g",
  );
  const found = [...new Set(html.match(re) ?? [])].sort();
  // Several compile dates can be listed for one year. The last is the newest.
  return found.length ? found[found.length - 1] : null;
}

async function loadYear(year) {
  const name = await fileForYear(year);
  if (!name) {
    console.log(`  ${year}: not published yet, skipping`);
    return [];
  }
  const res = await fetch(INDEX + name);
  if (!res.ok) throw new Error(`${name} ${res.status}`);
  const csv = gunzipSync(Buffer.from(await res.arrayBuffer())).toString("utf8");
  const rows = parseCsv(csv);
  const head = rows[0];
  const col = (n) => head.indexOf(n);
  const iType = col("EVENT_TYPE");
  const iLat = col("BEGIN_LAT");
  const iLon = col("BEGIN_LON");
  const iMag = col("MAGNITUDE");
  const iDate = col("BEGIN_DATE_TIME");
  const iCounty = col("CZ_NAME");
  const iState = col("STATE");
  const iPlace = col("BEGIN_LOCATION");

  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < head.length) continue;
    const type = row[iType];
    if (!KEEP.has(type)) continue;
    const lat = Number(row[iLat]);
    const lon = Number(row[iLon]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat < BOX.minLat || lat > BOX.maxLat) continue;
    if (lon < BOX.minLon || lon > BOX.maxLon) continue;
    const date = isoDate(row[iDate]);
    if (!date) continue;
    const mag = Number(row[iMag]);
    out.push({
      d: date,
      t: type === "Hail" ? "hail" : type === "Tornado" ? "tornado" : "wind",
      m: Number.isFinite(mag) && mag > 0 ? mag : null,
      lat: Math.round(lat * 1e4) / 1e4,
      lon: Math.round(lon * 1e4) / 1e4,
      c: toTitle(row[iCounty]),
      s: row[iState] ? toTitle(row[iState]) : "",
      p: toTitle(row[iPlace]),
    });
  }
  console.log(`  ${year}: ${out.length} events in the service area (${name})`);
  return out;
}

/** NCEI shouts every place name. "HATTIESBURG" on a homeowner's mailer looks
 *  like a data dump; "Hattiesburg" looks like somebody wrote it. */
function toTitle(s) {
  if (!s) return "";
  return (
    s
      .toLowerCase()
      // NCEI prefixes airport observations with the station code, so a report
      // lands as "(LUL)HESLER FLD LAUR". The code means nothing to a homeowner.
      .replace(/^\([a-z0-9]{3,4}\)\s*/, "")
      .replace(/\b[a-z]/g, (c) => c.toUpperCase())
      .replace(/\bArpt?\b/g, "Airport")
      .replace(/\bFld\b/g, "Field")
      .trim()
  );
}

const all = [];
console.log("Fetching NCEI Storm Events...");
for (const y of YEARS) all.push(...(await loadYear(y)));
all.sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: "NOAA NCEI Storm Events Database",
      built: new Date().toISOString().slice(0, 10),
      years: YEARS,
      box: BOX,
      events: all,
    },
    null,
    0,
  ),
);

const hail = all.filter((e) => e.t === "hail").length;
const wind = all.filter((e) => e.t === "wind").length;
const tor = all.filter((e) => e.t === "tornado").length;
console.log(`\nWrote ${all.length} events to src/data/storms.json`);
console.log(`  hail ${hail} · wind ${wind} · tornado ${tor}`);
