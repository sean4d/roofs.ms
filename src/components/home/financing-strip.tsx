import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { financingSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * Financing (PRD §3.9, owner refinement 2026-07-04): simple, trustworthy,
 * three-step clarity with the GoodLeap application as the direct action.
 * No invented rates or terms — all copy comes from content data.
 */
export function FinancingStrip() {
  const Icon = financingSection.icon;

  return (
    <Section tone="navy" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-steel-300) 1px, transparent 1px), linear-gradient(90deg, var(--color-steel-300) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <span className="inline-flex rounded-2xl bg-white/10 p-3.5">
              <Icon className="size-7 text-steel-300" aria-hidden="true" />
            </span>
            <p className="mt-5 text-sm font-semibold tracking-wide text-steel-300 uppercase">
              {financingSection.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {financingSection.title}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-steel-100">
              {financingSection.description}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* External GoodLeap application — opens in a new tab */}
              <Button
                size="xl"
                className="w-full bg-white text-primary hover:bg-steel-100 sm:w-auto"
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
                <ExternalLink className="size-4" aria-hidden="true" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="w-full border-white/35 bg-white/5 text-white hover:border-white hover:bg-white/15 sm:w-auto"
                render={<Link href={financingSection.secondaryCta.href} />}
                nativeButton={false}
              >
                {financingSection.secondaryCta.label}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>

        <StaggerGroup as="ul" className="space-y-4">
          {financingSection.points.map((point, index) => (
            <StaggerItem
              as="li"
              key={point.title}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm font-bold text-steel-300"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-display font-semibold text-white">
                  {point.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-steel-100">
                  {point.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
