import { siteConfig } from "@/config/site";
import { reviewsSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

/**
 * Reviews & trust (PRD §3.11): links out to real Google reviews and shows
 * confirmed credential marks only. No fabricated quotes, ratings, or counts.
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

      {/*
        Google star/Guaranteed badges intentionally omitted until the owner
        verifies rating + program status (see brandAssets.trust) — the
        review CTA carries the section instead.
      */}
      <div className="mt-12 flex flex-col items-center gap-8">
        {/* Live Google Business Profile — external */}
        <Button
          size="lg"
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
        </Button>

        {/*
          Verifiable credentials — GAF and BBB chips link to the official
          contractor records (owner-supplied 2026-07-04). GAF leads per the
          brand directive; no OC certification claims anywhere.
        */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a
            href={siteConfig.links.gafProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-steel-500"
          >
            GAF Certified Contractor ↗
          </a>
          <a
            href={siteConfig.links.bbbProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-steel-500 hover:text-primary"
          >
            BBB Accredited ↗
          </a>
          <span className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-slate-600">
            MSBOC Licensed
          </span>
        </div>
      </div>
    </Section>
  );
}
