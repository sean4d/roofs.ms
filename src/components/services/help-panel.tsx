import Link from "next/link";
import { ArrowRight, Banknote, FileCheck, Medal } from "lucide-react";

import { Section } from "@/components/shared/section";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Insurance, financing & warranty panel (PRD §4.1.7, Phase 4 §7/§10),
 * three-up trust band used across service pages. Factual language only:
 * claim decisions rest with the insurer, terms come from the lender, and
 * the warranty card names BOTH warranties with their owners attached.
 *
 * This card used to be headed "Lifetime warranty", with correct body text
 * underneath explaining it was the manufacturer's. The heading is what gets
 * read. On a Southeast Roofing trust band, an unqualified "Lifetime warranty"
 * reads as Southeast Roofing's own, and Southeast Roofing's workmanship
 * warranty is 10 years (owner, 2026-10-06). Correct small print under a
 * misleading heading is still misleading.
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
    text: "Apply through our partner GoodLeap in minutes and see the plans you qualify for, decide with real numbers in hand.",
    href: "/financing",
    cta: "Explore financing options",
  },
  {
    icon: Medal,
    title: "10-year workmanship warranty",
    /*
     * Two sentences, two companies, in that order. Ours first because it is
     * the one we can actually be held to; the manufacturer's second, with no
     * number on it, because the term depends on the system installed and
     * putting a figure there would be inventing one.
     */
    text: "We warrant our own installation for 10 years. Separately, manufacturer limited-lifetime product warranty options are available on qualifying systems: ask which applies to your roof at your free inspection.",
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
