"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import type { DisplayReview } from "@/lib/reviews";
import { ReviewMarquee } from "@/components/home/review-marquee";

interface ReviewsPayload {
  live: boolean;
  rating: number | null;
  count: number | null;
  reviews: DisplayReview[];
}

/**
 * Client island for the homepage review wall. Paints instantly with the
 * server-rendered reviews (so there's never an empty space), then upgrades to
 * the full live set from /api/reviews — which reliably returns the GBP reviews
 * at request time even though the homepage is statically cached.
 */
export function ReviewsIsland({ initial }: { initial: DisplayReview[] }) {
  const [reviews, setReviews] = useState<DisplayReview[]>(initial);
  const [rating, setRating] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: ReviewsPayload) => {
        if (!alive || !data?.reviews?.length) return;
        setReviews(data.reviews);
        if (data.live && data.rating && data.count) {
          setRating(data.rating);
          setCount(data.count);
        }
      })
      .catch(() => {
        /* keep the server-rendered reviews on any failure */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      {rating && count ? (
        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy-900 shadow-sm">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            {rating.toFixed(1)} from {count} Google reviews
          </span>
        </div>
      ) : null}

      <div className="mt-10">
        <ReviewMarquee reviews={reviews} />
      </div>
    </>
  );
}
