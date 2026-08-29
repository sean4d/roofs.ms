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
 * planes, and the outline of the whole detected building. Neither is right on
 * its own and the MIDPOINT of the two is, by a wide margin. Mean absolute
 * error against the known takeoffs, excluding the stale-imagery case that no
 * estimator can help:
 *
 *   detected planes only   12.3%
 *   building outline only  12.7%
 *   midpoint                3.1%
 *
 * That makes sense. The planes miss porches and dormers the segmenter could
 * not resolve; the outline includes overhang the shingles never cover.
 *
 * A NOTE ON HOW THIS FILE GOT IT WRONG, so it does not happen again. The first
 * version treated the gap between those two readings as a tree-occlusion
 * signal and rejected anything over 10%. Sampling 72 real buildings across the
 * territory later showed the MEDIAN house has a 13% gap: it is mostly just
 * segmenter incompleteness, present on roofs in full view. In the field that
 * threshold priced 3 houses out of 30 and the owner rightly called it broken.
 * Five houses were not enough to set a threshold on, and the one bad case that
 * drove it (Green Timber) turned out to be a stale-photo problem wearing a
 * gap-shaped disguise.
 */

import { rateCard } from "@/config/quote-rates";

const SQ_M_TO_SQ_FT = 10.763910417;

/* ------------------------------------------------------------------ *
 * Thresholds, all calibrated above
 * ------------------------------------------------------------------ */

/** Floor for how far the measured building may sit from the tapped point. */
const MAX_BUILDING_OFFSET_FT = 100;
/** Added to the building's own radius: a thumb on a phone is not a survey. */
const TAP_SLACK_FT = 60;
/** Below this nothing is a house, it is a shed the detector settled for. */
const MIN_PLAUSIBLE_SQFT = 800;
/** Above this it is a commercial building and needs a real takeoff. */
const MAX_PLAUSIBLE_SQFT = 20000;
/**
 * The detection gap, and what it is actually worth.
 *
 * THIS WAS SET TO 10% AND IT WAS WRONG. The owner tapped thirty houses in the
 * field and got a price on three. That is not a threshold that is slightly
 * tight, it is a broken tool, and the cause was reasoning from five houses.
 *
 * Sampling 72 real buildings across Oak Grove, Hattiesburg, Petal, Purvis,
 * Columbia and Laurel gives the distribution:
 *
 *   p10  6.4%    p25  9.7%    p50 13.3%    p75 21.5%    p90 25.3%
 *
 * The MEDIAN house has a 13% gap. A 10% threshold therefore rejects about 89%
 * of everything, which matches the owner's 3-in-30 exactly. The gap is not
 * mainly a tree-occlusion signal at all: it is the ordinary difference between
 * the planes the segmenter resolved and the outline of the whole building, and
 * almost every house has one. Porches, dormers and attached garages produce it
 * on a roof in clear view.
 *
 * The second error was blaming the wrong failure. Green Timber came in 33%
 * light with only a 15% gap, and that was read as proof the gap band could not
 * be trusted. It was not: Green Timber is a 2013 photograph of a house that
 * has since been added to, and NO estimator fixes that, only the rep's eyes.
 * Tightening the gap punished every other house for it.
 *
 * So the gap now only rejects roofs that really are mostly hidden, which the
 * distribution puts far out in the tail.
 */
const GAP_FIRM = 0.35;
const GAP_REJECT = 0.5;
/**
 * Imagery older than this earns a warning, and nothing more.
 *
 * It used to downgrade a firm price to a range. That is unworkable here: every
 * one of the 72 sampled buildings was shot in 2013 or 2019, so the rule would
 * have turned every quote in the territory into a range and quietly deleted
 * the product's main promise.
 *
 * The risk it was guarding against is real but it is not a measurement
 * problem, it is a "look at the house" problem, and the rep is already
 * standing in front of the answer. So the aerial photo and its date go on the
 * screen and the rep confirms the shape matches before anything is sent.
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
  /**
   * The address in pieces, because a CRM wants fields and not a sentence.
   *
   * Roofr requires city, state and postal code separately, and splitting
   * "154 Peres Rd, Carriere, MS 39426, USA" on commas is the kind of code that
   * works until somebody lives on a street with a comma in it. Google returns
   * these components in the same response we were already paying for and we
   * were throwing them away.
   */
  street: string;
  city: string;
  state: string;
  postal: string;
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
      address_components?: Array<{
        long_name: string;
        short_name: string;
        types: string[];
      }>;
      geometry: {
        location: { lat: number; lng: number };
        location_type: string;
      };
    }>;
  };
  if (data.status !== "OK" || !data.results?.length) return null;
  const top = data.results[0];

  const parts = top.address_components ?? [];
  const find = (type: string, short = false) => {
    const hit = parts.find((c) => c.types.includes(type));
    return hit ? (short ? hit.short_name : hit.long_name) : "";
  };
  const number = find("street_number");
  const road = find("route");

  return {
    lat: top.geometry.location.lat,
    lon: top.geometry.location.lng,
    formatted: top.formatted_address,
    precision: top.geometry.location_type,
    street: [number, road].filter(Boolean).join(" "),
    // Rural south Mississippi is full of unincorporated places, where Google
    // returns no "locality" at all. The town on the postal address is then
    // whichever administrative level it did return, which is what a customer
    // would write on an envelope anyway.
    city:
      find("locality") ||
      find("sublocality") ||
      find("administrative_area_level_3"),
    state: find("administrative_area_level_1", true),
    postal: find("postal_code"),
  };
}

/**
 * Satellite thumbnail of the pin, for the rep's confirmation step.
 *
 * Points at our own proxy, NOT at Google. This used to return the Static Maps
 * URL directly, which meant every measurement handed the unrestricted server
 * key to the browser inside an img src. See src/app/api/pin/aerial/route.ts.
 */
export function aerialUrl(lat: number, lon: number, size = 480): string {
  return `/api/pin/aerial?lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}&size=${size}`;
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
 * The pitch a roofer would actually say, which is not the average one.
 *
 * THIS WAS AN AREA-WEIGHTED MEAN AND THE OWNER NOTICED. "Pitch seems wrong a
 * good bit, not too bad but could be better." A mean is dragged down by every
 * low-slope thing attached to a house: a porch, a carport, a patio cover, an
 * added-on garage. A 2,000 sq ft roof at 6:12 with a 400 sq ft porch at 2:12
 * averages to 5.3:12, and the man standing in the driveway looking at it would
 * tell you it is a 6:12. The error only ever runs one way, too shallow, which
 * is exactly the shape of the complaint.
 *
 * So: bin the planes by pitch, add up the area in each bin, and report the
 * biggest bin. That is the pitch most of the roof actually is, and it is the
 * number a roofer quotes, prices materials against and orders ridge cap for.
 *
 * Half-inch bins, because a roofer thinks in halves of twelve and Google's
 * per-plane figures on one continuous roof surface vary by a fraction of a
 * degree. Rounding finer would split one real roof plane across two bins and
 * hand the vote to a porch.
 */
function dominantPitch(segments: RoofSegment[]): number | null {
  const bins = new Map<number, { area: number; sum: number }>();

  for (const s of segments) {
    const area = s.stats?.areaMeters2 ?? 0;
    if (!area || s.pitchDegrees == null) continue;
    // Bin on rise-over-twelve rather than on degrees, because that is the
    // scale the answer is reported in and it is not linear in degrees.
    const over12 = Math.tan(rad(s.pitchDegrees)) * 12;
    const key = Math.round(over12 * 2) / 2;
    const bin = bins.get(key) ?? { area: 0, sum: 0 };
    bin.area += area;
    bin.sum += s.pitchDegrees * area;
    bins.set(key, bin);
  }

  if (!bins.size) return null;

  let best: { area: number; sum: number } | null = null;
  for (const bin of bins.values()) {
    if (!best || bin.area > best.area) best = bin;
  }
  // The area-weighted mean WITHIN the winning bin, so a roof whose planes read
  // 26.4 and 26.7 degrees reports what it is rather than a rounded bin label.
  return best ? best.sum / best.area : null;
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
  //
  // Measured to the building's CENTRE, so the allowance has to grow with the
  // building or tapping a big roof reads as a miss. A 2,000 sq ft footprint is
  // about 25 ft from centre to edge; an 8,000 sq ft one is 50 ft. A flat limit
  // punishes exactly the large houses worth the most.
  //
  // The slack on top is for a thumb on a phone in sunlight. What this still
  // catches is the failure that matters: 546 Slade measured a building 353 ft
  // away and 701 E Holly one 149 ft away, and quoting from either would have
  // put a $51,000 roof on the page at $8,700.
  const groundSqFt = (sp.buildingStats?.groundAreaMeters2 ?? 0) * SQ_M_TO_SQ_FT;
  const buildingRadiusFt = groundSqFt > 0 ? Math.sqrt(groundSqFt / Math.PI) : 0;
  const allowedOffsetFt = Math.max(
    MAX_BUILDING_OFFSET_FT,
    buildingRadiusFt + TAP_SLACK_FT,
  );

  if (offsetFt > allowedOffsetFt) {
    return rejected(
      common,
      `The nearest roof the imagery can measure is ${Math.round(offsetFt)} ft away, which is probably a neighbour or an outbuilding. Tap directly on the roof.`,
      warnings,
    );
  }

  // --- Reject: not a house-shaped answer ----------------------------------
  const best = Math.max(detectedSqFt, outlineSqFt);
  if (best < MIN_PLAUSIBLE_SQFT) {
    return rejected(
      common,
      `Only ${Math.round(best)} sq ft of roof here, too small to be a house. Usually a shed or a carport: tap the main roof instead.`,
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

  // --- Only reject a roof that really is mostly hidden ---------------------
  const gap = outlineSqFt > 0 ? (outlineSqFt - detectedSqFt) / outlineSqFt : 1;

  if (gap > GAP_REJECT) {
    return rejected(
      common,
      `Only ${Math.round((1 - gap) * 100)}% of this roof is visible from the air, the rest is under trees. Measure this one by hand.`,
      warnings,
    );
  }

  /**
   * The midpoint of the two readings, because that is what the evidence says.
   *
   * Against the jobs with known takeoffs and imagery that still matched the
   * house, mean absolute error runs:
   *
   *   detected planes only   12.3%
   *   building outline only  12.7%
   *   MIDPOINT                3.1%
   *
   * Individually: Biloxi +4% (18.8 against 18.11 true) and Leakesville -2%
   * (24.4 against 25.0 true). Leakesville is the one that matters, because at
   * a 36% gap the previous code rejected it outright while the midpoint had
   * it within half a square the whole time.
   *
   * It makes sense that neither edge wins. The detected planes miss porches
   * and dormers the segmenter could not resolve, and the building outline
   * includes overhang the shingles never cover.
   */
  const squaresSqFt = (detectedSqFt + outlineSqFt) / 2;
  const confidence: Confidence = gap <= GAP_FIRM ? "high" : "medium";
  if (confidence === "medium") {
    warnings.push(
      "Part of this roof is under trees, so the price is a range rather than a firm number.",
    );
  }

  // --- Stale imagery is a look-at-it warning, not a downgrade --------------
  if (imageryDate) {
    const age = (Date.now() - new Date(imageryDate).getTime()) / 31557600000;
    if (age > IMAGERY_STALE_YEARS) {
      warnings.push(
        `The aerial photo is from ${imageryDate.slice(0, 4)}. If the house has been added to since, this measurement will be short. Check the photo below against what you are looking at.`,
      );
    }
  }

  const pitchDegrees = dominantPitch(segments);

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
