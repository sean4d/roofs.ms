/**
 * Review data.
 *
 * TWO HARD RULES, both non-negotiable:
 *
 *   1. Never invent a testimonial. Every entry here must correspond to a real
 *      review that a real person left. This file currently ships with NO
 *      review text because none has been supplied yet, and empty is correct
 *      until it is.
 *
 *   2. Never present a Southeast Roofing review as a Southeast Lights review.
 *      Roofing reviews may appear where they are useful, but only with
 *      `source: "roofing"` so the UI can label them honestly.
 *
 * The aggregate below IS real: Southeast Lights has its own Google Business
 * Profile with the count and rating recorded here. Update `ratingCount` and
 * `lastVerified` when it changes, or wire GOOGLE_PLACES_API_KEY and the
 * count becomes live (see lib/reviews.ts).
 */

import { siteConfig } from "./site";

export type ReviewSource = "lights" | "roofing";

export interface Review {
  author: string;
  rating: number;
  text: string;
  source: ReviewSource;
  /** ISO date the review was left. */
  date?: string;
  /** Service it relates to, when known. Lets us surface relevant reviews. */
  serviceSlug?: string;
  city?: string;
}

/**
 * Aggregate for the Southeast Lights Google Business Profile.
 * Owner-reported 2026-08-24. This is the only rating figure the site
 * displays, and AggregateRating schema is emitted ONLY from this.
 */
export const GOOGLE_AGGREGATE = {
  ratingValue: 5.0,
  ratingCount: 12,
  lastVerified: "2026-08-24",
  profileUrl: siteConfig.google.profileUrl,
  reviewUrl: `https://search.google.com/local/writereview?placeid=${siteConfig.google.placeId}`,
} as const;

/**
 * Real review text. EMPTY BY DESIGN.
 *
 * Paste genuine reviews here as they come in. Anything with
 * source: "roofing" renders with a visible "Southeast Roofing" label so a
 * reader is never misled about which company earned it.
 */
export const REVIEWS: Review[] = [];

export const lightsReviews = () => REVIEWS.filter((r) => r.source === "lights");

export const reviewsForService = (slug: string) =>
  REVIEWS.filter((r) => r.serviceSlug === slug);

/** True when there is genuine review text to show. Gates the review wall. */
export const hasReviewText = () => REVIEWS.length > 0;
