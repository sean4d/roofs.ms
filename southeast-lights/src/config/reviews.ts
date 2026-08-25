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
export const REVIEWS: Review[] = [
  /*
   * These are REAL Google reviews, transcribed verbatim from the Southeast
   * Roofing profile (owner supplied screenshots and granted republishing
   * permission 2026-07-05). They are quoted exactly as written, including
   * typos, and every one is verifiable on the live profile.
   *
   * They are all `source: "roofing"`, and the UI labels them as such. None of
   * them mention lighting, so presenting them as lighting reviews would be a
   * lie. What they do evidence is the thing a lighting customer is actually
   * weighing: whether these crews turn up, behave well on your property and
   * clean up after themselves.
   *
   * Selected for that relevance. Roof-specific ones are deliberately left out.
   * Delete this block the moment genuine Southeast Lights reviews exist.
   */
  {
    author: "Melanie Rouzano",
    rating: 5,
    source: "roofing",
    date: "2025-08-01",
    text: "Southeast Roofing was a pleasure to work with. The roof looks great. Everyone I met was courteous and professional. Would highly recommend.",
  },
  {
    author: "Lynne",
    rating: 5,
    source: "roofing",
    date: "2026-04-01",
    text: "Everyone was very professional and courteous. Southeast Roofing worked with us and presented many options of materials and colors. The crew worked fast, but meticulously. The cleanup was more than I expected. I am very pleased.",
  },
  {
    author: "Matthew Martin",
    rating: 5,
    source: "roofing",
    date: "2024-08-01",
    text: "Only company I'll use. Fast, professional and friendly. Worked with the insurance company and handled everything from start to finish. Highly recommend",
  },
  {
    author: "Lashae Jones",
    rating: 5,
    source: "roofing",
    date: "2025-08-01",
    text: "Great company. As a first time home buyer I was pretty scared to get a new roof as I had never done it before. They really made the process so easy. They were really nice and had great customer service.",
  },
  {
    author: "E Rankin",
    rating: 5,
    source: "roofing",
    date: "2024-08-01",
    text: "Great experience, professional and excellent work, I strongly recommend this company",
  },
  {
    author: "Vicky",
    rating: 5,
    source: "roofing",
    date: "2026-06-01",
    text: "Very professional and did an awesome job on the roof and was helpful with financing paperwork helpful every step of the way",
  },
];

export const lightsReviews = () => REVIEWS.filter((r) => r.source === "lights");

export const reviewsForService = (slug: string) =>
  REVIEWS.filter((r) => r.serviceSlug === slug);

/** True when there is genuine review text to show. Gates the review wall. */
export const hasReviewText = () => REVIEWS.length > 0;
