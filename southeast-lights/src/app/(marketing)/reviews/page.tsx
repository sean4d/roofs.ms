import { Star } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { IMAGES } from "@/config/images";
import { GOOGLE_AGGREGATE, REVIEWS, hasReviewText } from "@/config/reviews";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reviews",
  description:
    "Southeast Lights holds a 5.0 rating on Google. Read what customers say about our holiday and permanent lighting work across South Mississippi.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Reviews", path: "/reviews" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Reviews"
        title={`${GOOGLE_AGGREGATE.ratingValue.toFixed(1)} stars on Google.`}
        intro={`${GOOGLE_AGGREGATE.ratingCount} reviews on the Southeast Lights Google Business Profile. Every one of them from a real customer.`}
        image={IMAGES.colonialColumns}
        quoteLocation="reviews"
      />
      <Breadcrumbs trail={trail} />

      <Section eyebrow="Rating" title="">
        <div className="card-lit flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <span className="font-display text-5xl font-semibold text-champagne-300 tabular-nums">
              {GOOGLE_AGGREGATE.ratingValue.toFixed(1)}
            </span>
            <div>
              <div
                className="flex gap-0.5"
                aria-label={`${GOOGLE_AGGREGATE.ratingValue} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-champagne-400 text-champagne-400"
                    strokeWidth={1}
                  />
                ))}
              </div>
              <p className="text-bone-400 mt-1.5 text-sm">
                {GOOGLE_AGGREGATE.ratingCount} Google reviews
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={GOOGLE_AGGREGATE.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Read on Google
            </a>
            <a
              href={GOOGLE_AGGREGATE.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Leave a review
            </a>
          </div>
        </div>
      </Section>

      {/*
        No review text is shown until genuine reviews are added to
        config/reviews.ts. Fabricating testimonials, or passing a roofing
        review off as a lighting one, is not a trade-off we will make for a
        fuller-looking page.
      */}
      {hasReviewText() ? (
        <Section tone="raised" eyebrow="What customers say" title="">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <blockquote
                key={index}
                className="card-lit flex flex-col gap-4 p-6"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, star) => (
                    <Star
                      key={star}
                      className="size-3.5 fill-champagne-400 text-champagne-400"
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <p className="leading-relaxed text-bone-300">{review.text}</p>
                <footer className="mt-auto text-sm">
                  <cite className="font-medium text-bone-100 not-italic">
                    {review.author}
                  </cite>
                  {review.city ? (
                    <span className="text-bone-500"> · {review.city}</span>
                  ) : null}
                  {review.source === "roofing" ? (
                    <span className="mt-1 block text-xs text-bone-500">
                      Review of Southeast Roofing, our parent company
                    </span>
                  ) : null}
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      ) : (
        <Section tone="raised" eyebrow="What customers say" title="">
          <div className="card-lit max-w-2xl p-8">
            <p className="leading-relaxed text-bone-300">
              We are in the process of bringing our Google reviews onto the
              site. Until then, read them directly on our Google Business
              Profile: every review there is verified by Google and left by a
              real customer.
            </p>
            <a
              href={GOOGLE_AGGREGATE.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              Read our Google reviews
            </a>
          </div>
        </Section>
      )}

      <CtaBand
        title="Ready to get a price?"
        body="Most quotes take one short conversation and an address. No site visit, no sales appointment."
        location="reviews_cta"
      />
    </>
  );
}
