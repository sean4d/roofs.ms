import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { reviewsSection } from "@/content/homepage";
import { brandMarks } from "@/components/shared/brand-marks";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * Reviews & trust (PRD §3.11, owner refinement 2026-07-04): recognizable
 * verification badges, each linking to its official record. Integrity
 * rules hold: no fabricated quotes/ratings, no unverified star or
 * "Google Guaranteed" artwork (brandAssets.trust), no redrawn third-party
 * logos — the Google G is the one official mark we can render faithfully
 * inline; GAF/BBB seals get sourced when official assets are supplied.
 */

export function ReviewsTrust() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={reviewsSection.eyebrow}
        title={reviewsSection.title}
        description={reviewsSection.description}
        align="center"
      />

      <StaggerGroup className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reviewsSection.badges.map((badge) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                {brandMarks[badge.key as keyof typeof brandMarks]}
                {badge.href && (
                  <ExternalLink
                    className="size-4 text-slate-400 transition-colors group-hover:text-steel-500"
                    aria-hidden="true"
                  />
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">
                {badge.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                {badge.subtitle}
              </p>
              {badge.cta && (
                <span className="mt-4 text-sm font-semibold text-steel-500 underline-offset-4 transition-colors group-hover:text-navy-900 group-hover:underline">
                  {badge.cta} ↗
                </span>
              )}
            </>
          );

          const cardClass =
            "group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-premium transition-all duration-300";

          return (
            <StaggerItem key={badge.key} className="h-full">
              {badge.href ? (
                <a
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClass} hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl`}
                >
                  {inner}
                </a>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <Reveal className="mt-12 text-center">
        {/* Live Google Business Profile — external */}
        <Button
          size="xl"
          render={
            <a
              href={reviewsSection.googleCta.href}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          nativeButton={false}
        >
          {reviewsSection.googleCta.label}
          <ExternalLink className="size-4" aria-hidden="true" />
        </Button>
        <div className="mt-5">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 underline-offset-4 hover:text-steel-500 hover:underline"
          >
            Read customer reviews on our site
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
