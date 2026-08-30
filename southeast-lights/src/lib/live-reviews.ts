import "server-only";

import { unstable_cache } from "next/cache";

import {
  GOOGLE_AGGREGATE,
  LIGHTS_PROFILE,
  ROOFING_PROFILE,
} from "@/config/reviews";
import { siteConfig } from "@/config/site";

/**
 * Keeping the review count true without anyone having to remember.
 *
 * config/reviews.ts holds owner-reported figures, and the roofing one is a
 * deliberate floor, so the site understates rather than overstates. That is
 * safe but it goes stale: reviews arrive and nobody edits a config file.
 *
 * This reads both Google Business Profiles once a day and returns the real
 * combined count. Southeast Roofing LLC owns both, so adding them is honest
 * arithmetic about one company rather than two.
 *
 * FAILS SOFT, ALWAYS. No key, a rate limit, a bad place id, Google down: any
 * of those return the config figures instead of throwing. A review counter
 * is not worth a 500 on the homepage, and the fallback is already a number
 * the owner stands behind.
 *
 * To switch it on set GOOGLE_PLACES_API_KEY. The lighting place id has never
 * been round-tripped against the API (it was transcribed from a screenshot),
 * so until it verifies, that half quietly falls back and the roofing half
 * still goes live.
 */

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

/** Roofing profile. Same id the roofing site has used in production. */
const ROOFING_PLACE_ID =
  process.env.GOOGLE_ROOFING_PLACE_ID ?? "ChIJxf_jHarfnIgRnliLC-o1F40";

const LIGHTS_PLACE_ID =
  process.env.GOOGLE_LIGHTS_PLACE_ID ?? siteConfig.google.placeId;

export interface ReviewAggregate {
  /** Combined across both profiles. */
  count: number;
  rating: number;
  /** True when any half is still the owner-reported floor, not live. */
  isFloor: boolean;
  lightsCount: number;
  roofingCount: number;
  /** Which halves came back live, for the runbook and for debugging. */
  live: { lights: boolean; roofing: boolean };
}

interface PlaceCount {
  count: number;
  rating: number;
}

async function fetchPlace(placeId: string): Promise<PlaceCount | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !placeId) return null;
  try {
    const response = await fetch(`${PLACES_ENDPOINT}/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "userRatingCount,rating",
      },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      userRatingCount?: number;
      rating?: number;
    };
    if (typeof data.userRatingCount !== "number") return null;
    return {
      count: data.userRatingCount,
      rating: typeof data.rating === "number" ? data.rating : 5,
    };
  } catch {
    return null;
  }
}

async function read(): Promise<ReviewAggregate> {
  const [lights, roofing] = await Promise.all([
    fetchPlace(LIGHTS_PLACE_ID),
    fetchPlace(ROOFING_PLACE_ID),
  ]);

  const lightsCount = lights?.count ?? LIGHTS_PROFILE.ratingCount;
  const roofingCount = roofing?.count ?? ROOFING_PROFILE.ratingCount;

  /* Weighted, so one profile's average cannot drag the other's. Both sit at
     5.0 today; this is here so it stays right when one slips. */
  const total = lightsCount + roofingCount;
  const rating =
    total === 0
      ? 5
      : ((lights?.rating ?? LIGHTS_PROFILE.ratingValue) * lightsCount +
          (roofing?.rating ?? ROOFING_PROFILE.ratingValue) * roofingCount) /
        total;

  return {
    count: total,
    rating: Math.round(rating * 10) / 10,
    // Only still a floor if the half that HAS a floor did not come back live.
    isFloor: !roofing && ROOFING_PROFILE.isFloor,
    lightsCount,
    roofingCount,
    live: { lights: Boolean(lights), roofing: Boolean(roofing) },
  };
}

/** Daily. Reviews do not arrive fast enough to justify anything tighter. */
export const reviewAggregate = unstable_cache(read, ["sel-review-aggregate"], {
  revalidate: 86_400,
  tags: ["reviews"],
});

/** Synchronous fallback for anywhere that cannot await. */
export const staticAggregate = (): ReviewAggregate => ({
  count: GOOGLE_AGGREGATE.ratingCount,
  rating: GOOGLE_AGGREGATE.ratingValue,
  isFloor: GOOGLE_AGGREGATE.isFloor,
  lightsCount: GOOGLE_AGGREGATE.lightsCount,
  roofingCount: GOOGLE_AGGREGATE.roofingCount,
  live: { lights: false, roofing: false },
});

/** "over 40" while any half is a floor, otherwise the exact number. */
export const countLabel = (a: ReviewAggregate): string =>
  a.isFloor ? `over ${Math.floor(a.count / 10) * 10}` : String(a.count);
