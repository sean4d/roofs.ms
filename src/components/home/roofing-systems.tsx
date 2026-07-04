import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { systemsSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Roofing systems (owner refinement 2026-07-04): asphalt shingle and metal
 * presented as the two systems we install — matched cards, equal
 * prominence, each spanning both divisions. Metal is never a niche.
 */
export function RoofingSystems() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={systemsSection.eyebrow}
        title={systemsSection.title}
        description={systemsSection.description}
        align="center"
      />

      <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-2">
        {systemsSection.systems.map((system) => (
          <StaggerItem
            key={system.title}
            className="group shadow-premium relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl sm:p-10"
          >
            {/* Steel accent that warms on hover */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-800 to-steel-500 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            />
            <system.icon
              className="size-9 text-steel-500 transition-colors duration-300 group-hover:text-navy-900"
              aria-hidden="true"
            />
            <h3 className="mt-5 font-display text-2xl font-bold">
              {system.title}
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600">{system.text}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {system.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-slate-600"
                >
                  {chip}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {system.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-10 text-center">
        <Link
          href={systemsSection.hubNote.href}
          className="text-sm text-slate-600 underline-offset-4 hover:text-primary hover:underline"
        >
          {systemsSection.hubNote.label}
          <ArrowRight className="ml-1 inline size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
