import Link from "next/link";
import { Star } from "lucide-react";

import {
  GOOGLE_AGGREGATE,
  REVIEWS,
  lightsReviews,
  reviewCountLabel,
} from "@/config/reviews";

/**
 * Social proof.
 *
 * The rating and count are Southeast Lights' own, from its own Google
 * profile. The quoted reviews are currently Southeast Roofing's, so every one
 * of them is labeled as such. Passing a roofing review off as a lighting
 * review would be the easiest lie on the site to tell and the worst one to be
 * caught in, and the label costs nothing: what a lighting customer wants to
 * know is whether these crews behave well on a property, which is exactly
 * what these reviews evidence.
 *
 * When genuine lighting reviews land in config/reviews.ts they take
 * precedence automatically and the labels disappear on their own.
 */
export function ReviewsBand() {
  const lights = lightsReviews();
  const showing = lights.length > 0 ? lights.slice(0, 3) : REVIEWS.slice(0, 3);
  if (showing.length === 0) return null;

  const borrowed = lights.length === 0;

  return (
    <section className="band border-y border-white/[0.08] bg-ink-900">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-champagne-500">What people say</p>
            {/* The count spans both Google profiles because Southeast
                Roofing LLC owns both. Saying so is the difference between
                a true sentence and an implied claim of forty lighting
                reviews on a profile that has twelve. */}
            <h2 className="mt-5 text-3xl font-semibold text-balance sm:text-4xl">
              {GOOGLE_AGGREGATE.ratingValue.toFixed(1)} stars across{" "}
              {reviewCountLabel()} Google reviews.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex gap-0.5"
              aria-label={`${GOOGLE_AGGREGATE.ratingValue} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-5 fill-champagne-400 text-champagne-400"
                  strokeWidth={1}
                />
              ))}
            </div>
            <a
              href={GOOGLE_AGGREGATE.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-champagne-300 hover:text-champagne-200"
            >
              Read them on Google
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {showing.map((review) => (
            <blockquote
              key={review.author}
              className="cell rounded-card border border-white/[0.09] p-7"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-champagne-400 text-champagne-400"
                    strokeWidth={1}
                  />
                ))}
              </div>
              <p className="mt-4 leading-relaxed text-bone-300">
                {review.text}
              </p>
              <footer className="mt-auto pt-6">
                <cite className="text-sm font-medium text-bone-100 not-italic">
                  {review.author}
                </cite>
                {review.source === "roofing" ? (
                  <span className="mt-1 block text-xs text-bone-500">
                    Southeast Roofing customer
                  </span>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>

        {borrowed ? (
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-bone-500">
            These reviews are for our roofing side. Same owner, same crews, same
            insurance. Our lighting reviews live on the{" "}
            <Link
              href="/reviews"
              className="text-champagne-400 underline-offset-4 hover:underline"
            >
              Southeast Lights profile
            </Link>
            .
          </p>
        ) : null}
      </div>
    </section>
  );
}
