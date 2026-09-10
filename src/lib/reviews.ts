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
 * Words that mean a review is actually about the roof.
 *
 * The company also hangs Christmas lights, and two of the warmest reviews on
 * the Google profile are about exactly that. They are real, they are five
 * stars, and they are staying on the site: nothing here filters a review out.
 * But a stranger landing on a roofing page and reading "they hung our
 * Christmas lights" first is being shown the wrong proof, so roofing reviews
 * lead and the rest follow.
 */
const ROOFING_TERMS =
  /\b(roof\w*|shingle\w*|leak\w*|gutter\w*|hail|storm\w*|siding|flashing|soffit|fascia|tarp\w*|attic|decking|adjuster|claim)\b/i;

export function isRoofingReview(review: DisplayReview): boolean {
  return (
    ROOFING_TERMS.test(review.text) ||
    (review.services ? ROOFING_TERMS.test(review.services) : false)
  );
}

/**
 * Stable partition: roofing reviews first, everything else after, original
 * order preserved inside each group. Never drops a review and never edits
 * one, so no reviewer is misquoted and no review is attributed to a city.
 */
export function roofingFirst(reviews: DisplayReview[]): DisplayReview[] {
  return [
    ...reviews.filter(isRoofingReview),
    ...reviews.filter((r) => !isRoofingReview(r)),
  ];
}

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
  return Array.from(
    { length: n },
    (_, i) => reviews[(start + i) % reviews.length],
  );
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
