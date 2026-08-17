import { cities } from "@/content/cities";
import type { CityContent } from "@/content/cities/types";

/**
 * "Nearby communities" internal linking for the city pages (PRD §5 local
 * SEO). County alone clusters poorly here: most served counties hold a
 * single city, so cities are grouped into real South Mississippi regions.
 * Every served slug belongs to exactly one region; within a region we order
 * by drive-time closeness so the geographically nearest towns surface first.
 * This weaves the service-area hub together (no orphan city pages) and builds
 * genuine local topical authority without doorway-style boilerplate.
 */

const REGIONS: string[][] = [
  // Pine Belt / Hattiesburg core
  [
    "hattiesburg",
    "petal",
    "purvis",
    "sumrall",
    "seminary",
    "collins",
    "ellisville",
    "laurel",
    "richton",
  ],
  // Gulf Coast
  [
    "gulfport",
    "biloxi",
    "ocean-springs",
    "d-iberville",
    "long-beach",
    "pass-christian",
    "saucier",
    "kiln",
    "diamondhead",
    "bay-st-louis",
    "moss-point",
    "pascagoula",
  ],
  // Stone / Pearl River corridor (between the Pine Belt and the Coast)
  ["wiggins", "mchenry", "poplarville", "picayune"],
  // I-55 southwest corridor
  ["columbia", "mccomb", "brookhaven", "crystal-springs", "jackson"],
  // East Mississippi
  ["lucedale", "leakesville", "waynesboro", "meridian"],
];

/** Approximate the drive-time strings to minutes for proximity ordering. */
function driveMinutes(driveTime: string): number {
  const t = driveTime.toLowerCase();
  if (t.includes("home")) return 0;
  let mins = 0;
  const hourNum = t.match(/(\d+)\s*hour/);
  if (hourNum) mins += parseInt(hourNum[1], 10) * 60;
  else if (t.includes("hour")) mins += 60; // "an hour"
  if (t.includes("forty-five")) mins += 45;
  else if (t.includes("thirty")) mins += 30;
  else if (t.includes("fifteen")) mins += 15;
  const minNum = t.match(/(\d+)\s*minute/);
  if (minNum) mins += parseInt(minNum[1], 10);
  return mins || 45;
}

/**
 * Other served cities nearest to `slug`, ordered by drive-time closeness.
 * Pads from the wider service area if a region is thin, so the section is
 * never sparse. Returns published cities only.
 */
export function nearbyCities(slug: string, limit = 6): CityContent[] {
  const bySlug = new Map(cities.map((c) => [c.slug, c]));
  const self = bySlug.get(slug);
  const base = self ? driveMinutes(self.driveTime) : 0;
  const closeness = (c: CityContent) =>
    Math.abs(driveMinutes(c.driveTime) - base);

  const region = REGIONS.find((r) => r.includes(slug)) ?? [];
  const inRegion = region
    .filter((s) => s !== slug)
    .map((s) => bySlug.get(s))
    .filter((c): c is CityContent => Boolean(c))
    .sort((a, b) => closeness(a) - closeness(b));

  if (inRegion.length >= limit) return inRegion.slice(0, limit);

  const have = new Set(inRegion.map((c) => c.slug));
  const filler = cities
    .filter((c) => c.slug !== slug && !have.has(c.slug))
    .sort((a, b) => closeness(a) - closeness(b));

  return [...inRegion, ...filler].slice(0, limit);
}
