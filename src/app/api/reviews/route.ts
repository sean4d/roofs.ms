import { getSiteReviews, roofingFirst } from "@/lib/reviews";

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
    // Same ordering the server-rendered wall uses, so the client upgrade does
    // not reshuffle the cards under the reader.
    reviews: roofingFirst(data.reviews.filter((r) => r.text.length > 40)).slice(
      0,
      18,
    ),
  });
}
