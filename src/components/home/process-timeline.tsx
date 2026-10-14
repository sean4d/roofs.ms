import { processSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import {
  ScrollRail,
  RailLine,
  RailStep,
} from "@/components/motion/scroll-rail";

/**
 * Roofing process (PRD §3.9, Phase 4 §8): five clear steps from first call
 * to walkthrough, trust through predictability. Numbered timeline with a
 * connecting rule on desktop, clean vertical stack on mobile.
 */
export function ProcessTimeline() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={processSection.eyebrow}
        title={processSection.title}
        description={processSection.description}
        align="center"
      />

      {/*
        THE RULE FILLS WITH THE SCROLL AND EACH STEP LIGHTS AS IT REACHES IT.

        ScrollRail is the outer box only, because it needs an element whose
        bounds define the scroll window, and the grid below still needs to be
        the StaggerGroup so the steps keep their entrance. The rail's progress
        reaches RailLine and RailStep through context, so nesting costs
        nothing and there is still exactly one scroll listener for all five.

        Desktop fills the horizontal rule. On a phone the steps stack and
        each carries its own short connector, which stays plain; the rings
        still light in order off the same progress value, which is the part
        that carries the meaning.
      */}
      <ScrollRail
        count={processSection.steps.length}
        className="mx-auto mt-14 max-w-md lg:max-w-none"
      >
        <StaggerGroup
          as="ul"
          className="relative grid gap-8 lg:grid-cols-5 lg:gap-6"
        >
          {/* Connecting rule (desktop) */}
          <div
            aria-hidden="true"
            className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-border lg:block"
          />
          <RailLine
            orientation="horizontal"
            className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-primary lg:block"
          />
          {processSection.steps.map((step, index) => (
            <StaggerItem
              as="li"
              key={step.title}
              className="relative flex gap-5 lg:flex-col lg:gap-0 lg:text-center"
            >
              <div className="relative flex flex-col items-center lg:mb-5">
                <RailStep
                  index={index}
                  ringClassName="rounded-full ring-2 ring-primary"
                >
                  <span className="shadow-premium relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-white">
                    <step.icon
                      className="size-5 text-steel-500"
                      aria-hidden="true"
                    />
                  </span>
                </RailStep>
                {/* Connecting rule (mobile) */}
                {index < processSection.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-12 bottom-[-2rem] w-px bg-border lg:hidden"
                  />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-steel-500 uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </ScrollRail>
    </Section>
  );
}
