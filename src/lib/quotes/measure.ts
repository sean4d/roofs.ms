import "server-only";

/**
 * Measure a roof from aerial imagery, and know when not to trust the answer.
 *
 * Google's Solar API will return a measurement for almost any address in this
 * territory (20 of 20 tested, Leakesville included). The hard part is not
 * getting a number, it is knowing which numbers are safe to put in front of a
 * homeowner. Five completed jobs with known takeoffs were used to calibrate
 * that, and they produced four distinct ways for this to go wrong:
 *
 *   546 Slade Rd, Purvis        measured a building 353 ft away   -82%
 *   701 E Holly, Ellisville     measured a building 149 ft away   -90%
 *   2112 Lackey, Leakesville    tree canopy broke up detection    -24% / +19%
 *   109 Green Timber, Purvis    2013 imagery, house has grown     -33%
 *   14580 Indian Trails, Biloxi clean, recent enough, on target    +0.8%
 *
 * The first three are detectable from the response and are handled here. The
 * fourth is not, and that is the important one to understand: nothing in the
 * data can tell you a room was added after the photograph was taken. Green
 * Timber sat 0 ft off target with only a 15% detection gap, passed every
 * automatic check, and was still a third light on the main house.
 *
 * So the last check is a human one. Every measurement carries its imagery date
 * and an aerial thumbnail, the rep glances at it, and a house that has visibly
 * changed gets traced by hand instead. That is five seconds at a door and it
 * closes the one hole the data cannot.
 *
 * WHICH AREA TO USE. The API gives two: the sum of individually detected roof
 * planes, and the outline of the whole detected building. On a clean roof the
 * planes are startlingly good (Biloxi, 18.25 measured against 18.11 actual).
 * Under canopy the planes go low while the outline goes high and the truth
 * sits between them (Leakesville: 19.1 and 29.7 around a true 25.0). So the
 * gap between the two IS the confidence signal, and it picks the estimator.
 */

import { rateCard } from "@/config/quote-rates";

const SQ_M_TO_SQ_FT = 10.763910417;

/* ------------------------------------------------------------------ *
 * Thresholds, all calibrated above
 * ------------------------------------------------------------------ */

/** Further than this from the address and it is somebody else's roof. */
const MAX_BUILDING_OFFSET_FT = 100;
/** Below this nothing is a house, it is a shed the detector settled for. */
const MIN_PLAUSIBLE_SQFT = 800;
/** Above this it is a commercial building and needs a real takeoff. */
const MAX_PLAUSIBLE_SQFT = 20000;
/**
 * The detection gap that decides everything.
 *
 * Set to 10% because that is the only band the calibration set actually
 * supports. Biloxi had a 6% gap and measured to +0.5%. Every reading with a
 * wider gap was materially wrong: Green Timber at a 15% gap came in 38% light,
 * and Leakesville at 36% straddled the truth by -24% and +19%. An earlier
 * version of this file allowed a "partly obscured, quote a range" band up to
 * 20%, and Green Timber sailed through it and would have quoted $16,400 to
 * $19,900 on a roof worth about $28,700. There is no evidence for that middle
 * ground, so there is no middle ground: over 10% and a human traces it.
 */
const GAP_REJECT = 0.1;
/**
 * Imagery older than this drops a passing read from a firm price to a range.
 *
 * Not a rejection, because Biloxi ran on ten year old imagery and still landed
 * within a percent. But that was luck rather than method: nothing in the data
 * can reveal a room added after the photograph. Four of the five calibration
 * addresses were shot in 2013 or 2016, so this is the common case here, and a
 * range we can stand behind beats a firm number we cannot.
 */
const IMAGERY_STALE_YEARS = 5;

export type Confidence = "high" | "medium" | "reject";

export interface Measurement {
  confidence: Confidence;
  /** Roofing squares on a takeoff basis. Null when confidence is reject. */
  squares: number | null;
  /** Area-weighted pitch, as the rise over twelve a roofer would say. */
  pitchOver12: number | null;
  pitchDegrees: number | null;
  planes: number;
  /** Both candidate readings, kept so a human can see the spread. */
  detectedSquares: number;
  outlineSquares: number;
  /** How far the measured building sat from the address, in feet. */
  offsetFt: number;
  imageryDate: string | null;
  imageryQuality: string | null;
  /** Aerial thumbnail for the rep to eyeball before anything is sent. */
  aerialUrl: string | null;
  lat: number;
  lon: number;
  formattedAddress: string | null;
  /** Plain sentences. These are shown to the rep, so no jargon. */
  warnings: string[];
  /** Why it was rejected, when it was. */
  reason: string | null;
}

interface RoofSegment {
  pitchDegrees?: number;
  azimuthDegrees?: number;
  stats?: { areaMeters2?: number; groundAreaMeters2?: number };
}

interface SolarResponse {
  center?: { latitude: number; longitude: number };
  imageryDate?: { year: number; month: number; day: number };
  imageryQuality?: string;
  solarPotential?: {
    wholeRoofStats?: { areaMeters2?: number; groundAreaMeters2?: number };
    buildingStats?: { areaMeters2?: number; groundAreaMeters2?: number };
    roofSegmentStats?: RoofSegment[];
  };
}

interface GeocodeResult {
  lat: number;
  lon: number;
  formatted: string;
  /** ROOFTOP is the only one precise enough to pin a single house. */
  precision: string;
}

const EARTH_FT = 20902231;
const rad = (d: number) => (d * Math.PI) / 180;

function distanceFt(aLat: number, aLon: number, bLat: number, bLon: number) {
  const h =
    Math.sin(rad(bLat - aLat) / 2) ** 2 +
    Math.cos(rad(aLat)) *
      Math.cos(rad(bLat)) *
      Math.sin(rad(bLon - aLon) / 2) ** 2;
  return 2 * EARTH_FT * Math.asin(Math.sqrt(h));
}

function serverKey(): string {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) throw new Error("GOOGLE_MAPS_SERVER_KEY is not set.");
  return key;
}

/* ------------------------------------------------------------------ *
 * Geocoding
 * ------------------------------------------------------------------ */

/**
 * Turn an address into a point.
 *
 * The precision matters as much as the coordinates. Google reports how it
 * resolved the address, and anything short of ROOFTOP means it interpolated
 * along the street or fell back to the postcode. Both of those put the pin in
 * the road, and a pin in the road is how you end up measuring a neighbour.
 */
export async function geocode(address: string): Promise<GeocodeResult | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", serverKey());

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    status: string;
    results?: Array<{
      formatted_address: string;
      geometry: {
        location: { lat: number; lng: number };
        location_type: string;
      };
    }>;
  };
  if (data.status !== "OK" || !data.results?.length) return null;
  const top = data.results[0];
  return {
    lat: top.geometry.location.lat,
    lon: top.geometry.location.lng,
    formatted: top.formatted_address,
    precision: top.geometry.location_type,
  };
}

/** Satellite thumbnail of the pin, for the rep's confirmation step. */
export function aerialUrl(lat: number, lon: number, size = 480): string {
  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("center", `${lat},${lon}`);
  url.searchParams.set("zoom", "20");
  url.searchParams.set("size", `${size}x${size}`);
  url.searchParams.set("maptype", "satellite");
  url.searchParams.set("key", serverKey());
  return url.toString();
}

/* ------------------------------------------------------------------ *
 * Measuring
 * ------------------------------------------------------------------ */

async function fetchSolar(
  lat: number,
  lon: number,
): Promise<SolarResponse | null> {
  // Ask for the best imagery first and settle for less. Rural Mississippi is
  // mostly MEDIUM, and MEDIUM measured Biloxi to within a percent.
  for (const quality of ["HIGH", "MEDIUM", "LOW"] as const) {
    const url = new URL(
      "https://solar.googleapis.com/v1/buildingInsights:findClosest",
    );
    url.searchParams.set("location.latitude", String(lat));
    url.searchParams.set("location.longitude", String(lon));
    url.searchParams.set("requiredQuality", quality);
    url.searchParams.set("key", serverKey());

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) continue;
    const data = (await res.json()) as SolarResponse;
    if (data.solarPotential) return data;
  }
  return null;
}

function rejected(
  partial: Partial<Measurement>,
  reason: string,
  warnings: string[] = [],
): Measurement {
  return {
    confidence: "reject",
    squares: null,
    pitchOver12: null,
    pitchDegrees: null,
    planes: 0,
    detectedSquares: 0,
    outlineSquares: 0,
    offsetFt: 0,
    imageryDate: null,
    imageryQuality: null,
    aerialUrl: null,
    lat: 0,
    lon: 0,
    formattedAddress: null,
    warnings,
    reason,
    ...partial,
  };
}

/**
 * Measure the roof at a point.
 *
 * Returns a rejection rather than a bad number whenever the checks fail. The
 * caller's job is then to put the rep on a manual trace, never to fall back to
 * the number anyway: the two worst misses in the calibration set, at -82% and
 * -90%, both looked like perfectly ordinary responses.
 */
export async function measureAt(
  lat: number,
  lon: number,
  context: { formattedAddress?: string; precision?: string } = {},
): Promise<Measurement> {
  const warnings: string[] = [];
  const base = {
    lat,
    lon,
    formattedAddress: context.formattedAddress ?? null,
    aerialUrl: aerialUrl(lat, lon),
  };

  if (context.precision && context.precision !== "ROOFTOP") {
    warnings.push(
      "The address could not be pinned to a specific house, so the pin may be in the road. Check the photo.",
    );
  }

  const solar = await fetchSolar(lat, lon);
  if (!solar?.solarPotential) {
    return rejected(base, "No aerial roof data is available here.", warnings);
  }

  const sp = solar.solarPotential;
  const segments = sp.roofSegmentStats ?? [];
  const detectedSqFt = (sp.wholeRoofStats?.areaMeters2 ?? 0) * SQ_M_TO_SQ_FT;
  const outlineSqFt = (sp.buildingStats?.areaMeters2 ?? 0) * SQ_M_TO_SQ_FT;

  const offsetFt = solar.center
    ? distanceFt(lat, lon, solar.center.latitude, solar.center.longitude)
    : 0;

  const imageryDate = solar.imageryDate
    ? `${solar.imageryDate.year}-${String(solar.imageryDate.month).padStart(2, "0")}-${String(solar.imageryDate.day).padStart(2, "0")}`
    : null;

  const common = {
    ...base,
    planes: segments.length,
    detectedSquares: Math.round((detectedSqFt / 100) * 10) / 10,
    outlineSquares: Math.round((outlineSqFt / 100) * 10) / 10,
    offsetFt: Math.round(offsetFt),
    imageryDate,
    imageryQuality: solar.imageryQuality ?? null,
  };

  // --- Reject: wrong building. The single most dangerous failure. ----------
  if (offsetFt > MAX_BUILDING_OFFSET_FT) {
    return rejected(
      common,
      `The nearest roof the imagery could measure is ${Math.round(offsetFt)} ft from this address, which is probably a neighbour or an outbuilding.`,
      warnings,
    );
  }

  // --- Reject: not a house-shaped answer ----------------------------------
  const best = Math.max(detectedSqFt, outlineSqFt);
  if (best < MIN_PLAUSIBLE_SQFT) {
    return rejected(
      common,
      `Only ${Math.round(best)} sq ft of roof could be seen, which is too small to be the house. It is usually tree cover.`,
      warnings,
    );
  }
  if (best > MAX_PLAUSIBLE_SQFT) {
    return rejected(
      common,
      "This is too large to price from the air. It needs a real takeoff.",
      warnings,
    );
  }

  // --- The detection gap picks the estimator and the confidence ------------
  const gap = outlineSqFt > 0 ? (outlineSqFt - detectedSqFt) / outlineSqFt : 1;

  if (gap > GAP_REJECT) {
    return rejected(
      common,
      `Only ${Math.round((1 - gap) * 100)}% of the roof is clearly visible, the rest is under trees. Trace this one by hand.`,
      warnings,
    );
  }

  // A clean look at the roof: the detected planes are the better number, and
  // on Biloxi they were better than the outline by an order of magnitude.
  const squaresSqFt = detectedSqFt;
  let confidence: Confidence = "high";

  // --- Stale imagery drops a firm price to a range -------------------------
  if (imageryDate) {
    const age = (Date.now() - new Date(imageryDate).getTime()) / 31557600000;
    if (age > IMAGERY_STALE_YEARS) {
      confidence = "medium";
      warnings.push(
        `The aerial photo is from ${imageryDate.slice(0, 4)}. Anything built since then is not in this measurement, so this is a range rather than a firm price. Check the photo against the house.`,
      );
    }
  }

  // Pitch, weighted by the area of each plane so a big main roof outvotes a
  // porch. Reported the way a roofer says it.
  let pitchDegrees: number | null = null;
  const weighted = segments.reduce(
    (acc, s) => {
      const area = s.stats?.areaMeters2 ?? 0;
      if (!area || s.pitchDegrees == null) return acc;
      return { sum: acc.sum + s.pitchDegrees * area, area: acc.area + area };
    },
    { sum: 0, area: 0 },
  );
  if (weighted.area > 0) pitchDegrees = weighted.sum / weighted.area;

  return {
    ...common,
    confidence,
    squares: Math.round((squaresSqFt / 100) * 10) / 10,
    pitchDegrees:
      pitchDegrees === null ? null : Math.round(pitchDegrees * 10) / 10,
    pitchOver12:
      pitchDegrees === null
        ? null
        : Math.round(Math.tan(rad(pitchDegrees)) * 12 * 10) / 10,
    warnings,
    reason: null,
  };
}

/** Measure from a typed address rather than a map tap. */
export async function measureAddress(address: string): Promise<Measurement> {
  const point = await geocode(address);
  if (!point) {
    return rejected({}, "That address could not be found.");
  }
  return measureAt(point.lat, point.lon, {
    formattedAddress: point.formatted,
    precision: point.precision,
  });
}

/**
 * Area of a hand-traced roof outline, for when the automatic read is rejected.
 *
 * The rep traces the roof's footprint on the map and picks the pitch off the
 * elevation they can see from the street, and this turns that into a takeoff.
 * Spherical excess is irrelevant over a house, so the polygon is projected
 * flat first and then the shoelace formula does the rest.
 */
export function measureTracedPolygon(
  points: Array<{ lat: number; lon: number }>,
  pitchOver12: number,
): { squares: number; pitchDegrees: number } | null {
  if (points.length < 3) return null;

  const latRef = points.reduce((a, p) => a + p.lat, 0) / points.length;
  const mPerDegLat = 111132.92;
  const mPerDegLon = 111412.84 * Math.cos(rad(latRef));

  const xy = points.map((p) => ({
    x: p.lon * mPerDegLon,
    y: p.lat * mPerDegLat,
  }));

  let twiceArea = 0;
  for (let i = 0; i < xy.length; i++) {
    const a = xy[i];
    const b = xy[(i + 1) % xy.length];
    twiceArea += a.x * b.y - b.x * a.y;
  }
  const groundM2 = Math.abs(twiceArea) / 2;
  if (groundM2 <= 0) return null;

  // A traced outline is the FOOTPRINT. The roof surface over it is longer by
  // the slope, which is where the pitch multiplier comes from.
  const pitchDegrees = (Math.atan(pitchOver12 / 12) * 180) / Math.PI;
  const slopeFactor = Math.sqrt(1 + (pitchOver12 / 12) ** 2);
  const roofSqFt = groundM2 * SQ_M_TO_SQ_FT * slopeFactor;

  return {
    squares: Math.round((roofSqFt / 100) * 10) / 10,
    pitchDegrees: Math.round(pitchDegrees * 10) / 10,
  };
}

/** Re-exported so callers price and measure from one import. */
export { rateCard };
