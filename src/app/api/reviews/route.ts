import { getSiteReviews } from "@/lib/reviews";

/**
 * Reviews as JSON for client-side use (the homepage review wall). Rendered
 * dynamically at request time so it reliably returns the live Google reviews
 * (via the GBP API) even though the homepage itself is a fast static page.
 * Cached an hour at the edge; the underlying data is cached a day + tag-purged
 * on revalidate.
 */
export const revalidate = 3600;

export async function GET() {
  const data = await getSiteReviews();
  return Response.json({
    live: data.live,
    rating: data.rating ?? null,
    count: data.count ?? null,
    reviews: data.reviews.filter((r) => r.text.length > 40).slice(0, 18),
  });
}
