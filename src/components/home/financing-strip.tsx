import Link from "next/link";

import { financingSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

/**
 * Financing strip (PRD §3.9): navy band pointing to financing + inspection
 * CTAs. No invented rates or terms — copy comes entirely from content data.
 */
export function FinancingStrip() {
  const Icon = financingSection.icon;

  return (
    <Section tone="navy">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="flex items-start gap-5">
          <span className="flex-none rounded-2xl bg-white/10 p-4">
            <Icon className="size-7 text-steel-300" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-steel-300 uppercase">
              {financingSection.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              {financingSection.title}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-steel-100">
              {financingSection.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* External GoodLeap application — opens in a new tab */}
          <Button
            className="bg-white text-primary hover:bg-steel-100"
            render={
              <a
                href={financingSection.cta.href}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
          >
            {financingSection.cta.label}
          </Button>
          <Button
            variant="outline"
            className="border-white/40 text-white hover:border-white hover:bg-white/10"
            render={<Link href={financingSection.secondaryCta.href} />}
            nativeButton={false}
          >
            {financingSection.secondaryCta.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
