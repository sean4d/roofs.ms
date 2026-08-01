import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getSiteReviews } from "@/lib/reviews";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ReviewsIsland } from "@/components/home/reviews-island";

/**
 * Homepage social proof: an auto-scrolling wall of real Google reviews with the
 * live star rating and a button to the full reviews page. The wall paints
 * instantly with server-rendered reviews and upgrades to the complete live set
 * (all reviews via the GBP API) client-side, see ReviewsIsland.
 */
export async function HomeReviews() {
  const { reviews } = await getSiteReviews();
  const initial = reviews.filter((r) => r.text.length > 40).slice(0, 18);
  if (initial.length === 0) return null;

  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Reviews"
        title="What South Mississippi says about us"
        description="Real Google reviews from real customers, pulled straight from our profile and always up to date."
        align="center"
      />

      <ReviewsIsland initial={initial} />

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
