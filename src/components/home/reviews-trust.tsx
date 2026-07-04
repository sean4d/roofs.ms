import { ExternalLink, Landmark, ShieldCheck } from "lucide-react";

import { reviewsSection } from "@/content/homepage";
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

/** Official Google "G" in brand colors (standard vector, unmodified). */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const badgeMarks: Record<string, React.ReactNode> = {
  google: <GoogleG className="size-9" />,
  gaf: (
    <span className="flex size-10 items-center justify-center rounded-lg bg-navy-900">
      <ShieldCheck className="size-6 text-white" aria-hidden="true" />
    </span>
  ),
  bbb: (
    <span className="flex size-10 items-center justify-center rounded-lg bg-navy-900">
      <ShieldCheck className="size-6 text-white" aria-hidden="true" />
    </span>
  ),
  msboc: (
    <span className="flex size-10 items-center justify-center rounded-lg bg-navy-900">
      <Landmark className="size-6 text-white" aria-hidden="true" />
    </span>
  ),
};

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
                {badgeMarks[badge.key]}
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
      </Reveal>
    </Section>
  );
}
