/**
 * Live Google reviews for the site, rendered natively (no third-party script).
 *
 * Source priority:
 *   1. Featurable, free, needs only a published widget id (baked in below or
 *      FEATURABLE_WIDGET_ID). This is the owner's connected source.
 *   2. Google Places API (New), used only if GOOGLE_PLACES_API_KEY is set;
 *      place id is baked in / GOOGLE_PLACE_ID.
 *   3. null → the site falls back to the curated reviews in content/reviews.ts.
 *
 * Everything is cached daily and fails soft (any error → null), so the page
 * never breaks and simply shows the curated reviews until a live source
 * responds. Integrity: we display live reviews but emit NO schema.org
 * AggregateRating/Review markup (Google treats self-published third-party
 * review markup as self-serving).
 */

import { unstable_cache } from "next/cache";

import { getGbpReviews } from "@/lib/gbp";

/** Owner-supplied identifiers (2026-07-07). Public values, safe to inline. */
const FEATURABLE_WIDGET_ID =
  process.env.FEATURABLE_WIDGET_ID ?? "dd7a34c6-f6cb-4661-8edb-e9e0ab6fddfd";
const GOOGLE_PLACE_ID =
  process.env.GOOGLE_PLACE_ID ?? "ChIJxf_jHarfnIgRnliLC-o1F40";

export interface LiveReview {
  author: string;
  rating: number;
  text: string;
  when: string;
  photo?: string;
  /** The owner's public reply to this review, if any (GBP source only). */
  reply?: string;
}

export interface GoogleReviewData {
  rating: number;
  count: number;
  reviews: LiveReview[];
}

/** ISO timestamp → coarse "N months/years ago" (best-effort). */
function relativeWhen(iso?: string): string {
  if (!iso) return "recently";
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "recently";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days < 21) return "recently";
  if (days < 45) return "a month ago";
  if (days < 335) return `${Math.round(days / 30)} months ago`;
  const years = Math.round(days / 365);
  return years <= 1 ? "a year ago" : `${years} years ago`;
}

/** Coerce a star rating that may be a number or Google's word enum. */
function toStars(v: unknown): number {
  if (typeof v === "number") return v;
  const words: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  return words[String(v).toUpperCase()] ?? 5;
}

/** Featurable widget → normalized reviews. Public API, widget must be published. */
async function fromFeaturable(): Promise<GoogleReviewData | null> {
  if (!FEATURABLE_WIDGET_ID) return null;
  try {
    const res = await fetch(
      `https://api.featurable.com/v1/widgets/${FEATURABLE_WIDGET_ID}`,
      { next: { revalidate: 86400, tags: ["google-reviews"] } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      success?: boolean;
      averageRating?: number;
      totalReviewCount?: number;
      reviews?: Array<{
        reviewer?: { displayName?: string; profilePhotoUrl?: string };
        starRating?: number | string;
        comment?: string;
        createTime?: string;
      }>;
    };
    if (data.success === false || typeof data.averageRating !== "number") return null;

    const reviews: LiveReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.reviewer?.displayName ?? "Google customer",
        rating: toStars(r.starRating),
        text: (r.comment ?? "").trim(),
        when: relativeWhen(r.createTime),
        photo: r.reviewer?.profilePhotoUrl,
      }))
      .filter((r) => r.text.length > 0);

    return {
      rating: data.averageRating,
      count: data.totalReviewCount ?? reviews.length,
      reviews,
    };
  } catch {
    return null;
  }
}

/** Google Places API (New) → normalized reviews. Only if an API key is set. */
async function fromPlacesApi(): Promise<GoogleReviewData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !GOOGLE_PLACE_ID) return null;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
      next: { revalidate: 86400, tags: ["google-reviews"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        originalText?: { text?: string };
        relativePublishTimeDescription?: string;
        authorAttribution?: { displayName?: string; photoUri?: string };
      }>;
    };
    if (typeof data.rating !== "number") return null;
    const reviews: LiveReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google customer",
        rating: r.rating ?? 5,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        when: r.relativePublishTimeDescription ?? "recently",
        photo: r.authorAttribution?.photoUri,
      }))
      .filter((r) => r.text.length > 0);
    return { rating: data.rating, count: data.userRatingCount ?? 0, reviews };
  } catch {
    return null;
  }
}

/**
 * Official GBP API → ALL reviews (not the Places cap of 5), with owner replies.
 * Cached a day and tagged so a manual revalidate or a new review refreshes it.
 * The heavy lifting (OAuth, pagination) lives in lib/gbp; here we just cache it
 * and normalize the timestamps to the same "N months ago" the other sources use.
 */
const cachedGbpReviews = unstable_cache(
  async (): Promise<GoogleReviewData | null> => {
    const raw = await getGbpReviews();
    if (!raw) return null;
    const reviews: LiveReview[] = raw.reviews
      .map((r) => ({
        author: r.author,
        rating: r.stars,
        text: r.text.trim(),
        when: relativeWhen(r.createTime),
        photo: r.photo,
        reply: r.reply,
      }))
      .filter((r) => r.text.length > 0);
    return { rating: raw.rating, count: raw.count, reviews };
  },
  ["gbp-reviews-v1"],
  { revalidate: 86400, tags: ["google-reviews"] },
);

/**
 * Live rating, review count, and reviews, or null to use curated fallback.
 * Source priority: the official GBP API (all reviews) → Featurable → Places.
 * GBP wins because it returns every review, freshest, with the owner's replies.
 */
export async function getGoogleReviewData(): Promise<GoogleReviewData | null> {
  const gbp = await cachedGbpReviews();
  // Prefer GBP only when it actually returned displayable reviews.
  if (gbp && gbp.reviews.length > 0) return gbp;
  return (await fromFeaturable()) ?? (await fromPlacesApi());
}

/**
 * Owner-facing diagnostic (password-gated endpoint). Surfaces WHY live reviews
 * are or aren't showing, without ever echoing the API key. Google's error body
 * carries the actionable message (referrer restriction, billing, API disabled,
 * bad place id), exactly what's needed to fix a misconfigured key.
 */
export interface ReviewsDiag {
  live: boolean;
  featurable: { widgetId: string; ok: boolean; status?: number; note?: string };
  places: {
    keyPresent: boolean;
    placeId: string;
    ok: boolean;
    status?: number;
    rating?: number;
    count?: number;
    note?: string;
  };
}

export async function diagnoseReviews(): Promise<ReviewsDiag> {
  const diag: ReviewsDiag = {
    live: false,
    featurable: { widgetId: FEATURABLE_WIDGET_ID, ok: false },
    places: {
      keyPresent: Boolean(process.env.GOOGLE_PLACES_API_KEY),
      placeId: GOOGLE_PLACE_ID,
      ok: false,
    },
  };

  // Featurable
  try {
    const res = await fetch(`https://api.featurable.com/v1/widgets/${FEATURABLE_WIDGET_ID}`, {
      cache: "no-store",
    });
    diag.featurable.status = res.status;
    const data = (await res.json()) as {
      success?: boolean;
      averageRating?: number;
      error?: { key?: string };
    };
    diag.featurable.ok =
      res.ok && data.success !== false && typeof data.averageRating === "number";
    if (!diag.featurable.ok) diag.featurable.note = data.error?.key ?? "not published / no data";
  } catch (e) {
    diag.featurable.note = e instanceof Error ? e.message : "fetch failed";
  }

  // Places
  if (diag.places.keyPresent) {
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`, {
        headers: {
          "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
        cache: "no-store",
      });
      diag.places.status = res.status;
      const data = (await res.json()) as {
        rating?: number;
        userRatingCount?: number;
        error?: { message?: string; status?: string };
      };
      diag.places.ok = res.ok && typeof data.rating === "number";
      diag.places.rating = data.rating;
      diag.places.count = data.userRatingCount;
      if (!diag.places.ok)
        diag.places.note = data.error?.message ?? data.error?.status ?? "no rating in response";
    } catch (e) {
      diag.places.note = e instanceof Error ? e.message : "fetch failed";
    }
  } else {
    diag.places.note = "GOOGLE_PLACES_API_KEY not set in this environment";
  }

  diag.live = diag.featurable.ok || diag.places.ok;
  return diag;
}
