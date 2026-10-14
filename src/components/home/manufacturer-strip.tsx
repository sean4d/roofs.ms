import { ExternalLink } from "lucide-react";

import { manufacturerSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Manufacturer certifications and memberships (Phase 4 §8, §12):
 * factually exact wording. GAF and CertainTeed issued us certifications;
 * Owens Corning is a contractor-network membership, never a certification
 * claim. Official logos slot in when sourced.
 */
export function ManufacturerStrip() {
  return (
    <Section>
      <SectionHeading
        eyebrow={manufacturerSection.eyebrow}
        title={manufacturerSection.title}
        description={manufacturerSection.description}
        align="center"
      />

      {/* Three items since CertainTeed joined (2026-09-24), so the row is
          three wide on desktop instead of two. */}
      <StaggerGroup className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {manufacturerSection.items.map((item) => (
          <StaggerItem
            key={item.name}
            className="shadow-premium flex h-full flex-col rounded-2xl border border-border bg-white p-7"
          >
            {/* Wraps since the Owens Corning card arrived (2026-10-14): its
                name and its badge are both longer than the other two, and on
                one line the name broke across two rows while the badge broke
                across another. Wrapping drops the badge onto its own line
                instead, which keeps every name whole. GAF and CertainTeed
                still fit beside their badges, so nothing moves for them. */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="font-display text-2xl font-bold text-navy-900">
                {item.name}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-slate-600">
                {item.claim}
              </span>
            </div>
            <p className="mt-3 flex-1 leading-relaxed text-slate-600">
              {item.text}
            </p>
            {item.href && item.cta && (
              <a
                href={item.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {item.cta}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
