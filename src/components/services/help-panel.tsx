import Link from "next/link";
import { ArrowRight, Banknote, FileCheck, Medal } from "lucide-react";

import { Section } from "@/components/shared/section";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Insurance, financing & warranty panel (PRD §4.1.7, Phase 4 §7/§10) —
 * three-up trust band used across service pages. Factual language only:
 * claim decisions rest with the insurer, terms come from the lender, and
 * the lifetime workmanship warranty is owner-confirmed (2026-07-04).
 */

const panels = [
  {
    icon: FileCheck,
    title: "Storm damage? We speak insurance.",
    text: "Thorough documentation, reports in the format adjusters expect, and someone on your side at the adjuster meeting.",
    href: "/storm-damage/insurance-claims",
    cta: "How claim assistance works",
  },
  {
    icon: Banknote,
    title: "$0 down financing available",
    text: "Apply through our partner GoodLeap in minutes and see the plans you qualify for — decide with real numbers in hand.",
    href: "/financing",
    cta: "Explore financing options",
  },
  {
    icon: Medal,
    title: "Lifetime workmanship warranty",
    text: "We stand behind our installation for the life of your roof. If our workmanship fails, we make it right.",
    href: "/free-inspection",
    cta: "Start with a free inspection",
  },
];

export function HelpPanel() {
  return (
    <Section tone="navy" ariaLabel="Insurance, financing, and warranty">
      <StaggerGroup className="grid gap-6 md:grid-cols-3">
        {panels.map((panel) => (
          <StaggerItem
            key={panel.title}
            className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
          >
            <panel.icon className="size-7 text-steel-300" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {panel.title}
            </h3>
            <p className="mt-3 flex-1 leading-relaxed text-steel-100">
              {panel.text}
            </p>
            <Link
              href={panel.href}
              className="mt-5 inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline"
            >
              {panel.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
