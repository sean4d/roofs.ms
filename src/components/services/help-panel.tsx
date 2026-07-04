import Link from "next/link";
import { ArrowRight, Banknote, FileCheck } from "lucide-react";

import { Section } from "@/components/shared/section";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Insurance & financing panel (PRD §4.1.7) — contextual two-up band used
 * across service pages. Factual assistance language only: the claim decision
 * always rests with the insurer, and no rates/terms are stated (PRD §0.2).
 */
export function HelpPanel() {
  return (
    <Section tone="navy" ariaLabel="Insurance and financing help">
      <StaggerGroup className="grid gap-6 lg:grid-cols-2">
        <StaggerItem className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <FileCheck className="size-7 text-steel-300" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-bold text-white">
            Storm damage? We speak insurance.
          </h3>
          <p className="mt-3 leading-relaxed text-steel-100">
            We document the damage thoroughly, provide the reports and photos
            your insurer needs, and can meet your adjuster on site — so
            you&apos;re never navigating the claim alone.
          </p>
          <Link
            href="/storm-damage/insurance-claims"
            className="mt-5 inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline"
          >
            How claim assistance works
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </StaggerItem>

        <StaggerItem className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <Banknote className="size-7 text-steel-300" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-bold text-white">
            Financing that fits the budget
          </h3>
          <p className="mt-3 leading-relaxed text-steel-100">
            A roof rarely fails at a convenient time. Apply through our
            financing partner GoodLeap, or ask about options when you get your
            estimate.
          </p>
          <Link
            href="/financing"
            className="mt-5 inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline"
          >
            Explore financing options
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </StaggerItem>
      </StaggerGroup>
    </Section>
  );
}
