import { ExternalLink } from "lucide-react";

import { manufacturerSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Manufacturer partnerships (Phase 4 §8, §12): factually exact wording —
 * GAF is our certification; Owens Corning is a product line we install,
 * never a certification claim. Official logos slot in when sourced.
 */
export function ManufacturerStrip() {
  return (
    <Section>
      <SectionHeading
        eyebrow={manufacturerSection.eyebrow}
        title={manufacturerSection.title}
        align="center"
      />

      <StaggerGroup className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {manufacturerSection.items.map((item) => (
          <StaggerItem
            key={item.name}
            className="shadow-premium flex h-full flex-col rounded-2xl border border-border bg-white p-7"
          >
            <div className="flex items-baseline gap-3">
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
                target="_blank"
                rel="noopener noreferrer"
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
