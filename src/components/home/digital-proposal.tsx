import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { proposalSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { InteractiveProposal } from "@/components/home/interactive-proposal";

/**
 * Digital proposal section (owner directive 2026-07-04): the retail
 * experience for a discerning buyer — itemized transparency, toggleable
 * upgrades, no hidden fees — now with a live interactive example the
 * customer can play with (figures are owner-supplied example pricing).
 */
export function DigitalProposal() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={proposalSection.eyebrow}
            title={proposalSection.title}
            description={proposalSection.description}
          />
          <StaggerGroup as="ul" className="mt-9 space-y-6">
            {proposalSection.points.map((point) => (
              <StaggerItem as="li" key={point.title} className="flex gap-4">
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-steel-100">
                  <Check
                    className="size-3.5 text-navy-900"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="font-display font-semibold">{point.title}</h3>
                  <p className="mt-1 leading-relaxed text-slate-600">
                    {point.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal className="mt-9">
            <Button
              size="xl"
              render={<Link href="/free-inspection" />}
              nativeButton={false}
            >
              Get your itemized proposal
              <ArrowRight aria-hidden="true" />
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <InteractiveProposal />
        </Reveal>
      </div>
    </Section>
  );
}
