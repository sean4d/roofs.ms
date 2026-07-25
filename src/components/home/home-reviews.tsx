import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { getSiteReviews } from "@/lib/reviews";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ReviewMarquee } from "@/components/home/review-marquee";

/**
 * Homepage social proof: a live, auto-scrolling wall of real Google reviews
 * (all of them, via the GBP API — new reviews appear on their own), the live
 * star rating, and a button through to the full reviews page.
 */
export async function HomeReviews() {
  const { live, rating, count, reviews } = await getSiteReviews();
  // Cards read best with real substance; cap the wall so it stays snappy.
  const cards = reviews.filter((r) => r.text.length > 40).slice(0, 18);
  if (cards.length === 0) return null;

  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Reviews"
        title="What South Mississippi says about us"
        description="Real Google reviews from real customers — pulled straight from our profile and always up to date."
        align="center"
      />

      {live && rating && (
        <Reveal className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy-900 shadow-sm">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-amber-400 text-amber-400"
                />
              ))}
            </span>
            {rating.toFixed(1)} from {count} Google reviews
          </span>
        </Reveal>
      )}

      <Reveal className="mt-10">
        <ReviewMarquee reviews={cards} />
      </Reveal>

      <Reveal className="mt-10 flex justify-center">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-700"
        >
          Read all our reviews
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </Section>
  );
}
