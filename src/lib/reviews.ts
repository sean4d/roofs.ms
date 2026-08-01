import { googleReviews } from "@/content/reviews";
import { getGoogleReviewData } from "@/lib/google-reviews";
import { cleanCopy, stripEmDashes } from "@/lib/no-em-dash";

/**
 * One source of truth for reviews shown on the site (reviews page + homepage
 * marquee). Live Google reviews (all of them, via the GBP API) come first and
 * freshest; the curated verbatim reviews only fill in behind them for reviewers
 * the live feed doesn't already cover, so the page is always full and always
 * current. Integrity unchanged: display only, no AggregateRating schema.
 */

export interface DisplayReview {
  name: string;
  text: string;
  when: string;
  rating: number;
  /** Owner's public reply (live GBP reviews only). */
  reply?: string;
  /** Services line (curated reviews only). */
  services?: string;
}

export interface SiteReviews {
  /** True when a live Google source answered. */
  live: boolean;
  /** Live average rating (e.g. 5.0), when available. */
  rating?: number;
  /** Live total review count, when available. */
  count?: number;
  reviews: DisplayReview[];
}

const firstName = (n: string) => n.trim().toLowerCase().split(/\s+/)[0];

/**
 * Deterministically pick `n` reviews for a given key (e.g. a city slug), so
 * each page shows a stable but varied subset, different cities surface
 * different reviews, which keeps the content unique page to page.
 */
export function pickReviews(
  reviews: DisplayReview[],
  key: string,
  n = 3,
): DisplayReview[] {
  if (reviews.length <= n) return reviews;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const start = h % reviews.length;
  return Array.from({ length: n }, (_, i) => reviews[(start + i) % reviews.length]);
}

export async function getSiteReviews(): Promise<SiteReviews> {
  const live = await getGoogleReviewData();

  const liveReviews: DisplayReview[] = (live?.reviews ?? [])
    .filter((r) => r.text.trim().length > 0)
    .map((r) => ({
      name: r.author,
      // Reviewers and the owner both type into Google, where nothing enforces
      // the site's punctuation. Fix it on the way in, once, so every surface
      // that reads from here is clean.
      text: stripEmDashes(r.text),
      when: r.when,
      rating: r.rating,
      reply: cleanCopy(r.reply),
    }));

  const seen = new Set(liveReviews.map((r) => firstName(r.name)));
  const curated: DisplayReview[] = googleReviews
    .filter((r) => !seen.has(firstName(r.name)))
    .map((r) => ({
      name: r.name,
      text: r.text,
      when: r.when,
      rating: 5,
      services: r.services,
    }));

  return {
    live: Boolean(live),
    rating: live?.rating,
    count: live?.count,
    reviews: [...liveReviews, ...curated],
  };
}
