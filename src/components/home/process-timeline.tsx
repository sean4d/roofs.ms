import { processSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Roofing process (PRD §3.9, Phase 4 §8): five clear steps from first call
 * to walkthrough — trust through predictability. Numbered timeline with a
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

      <StaggerGroup
        as="ul"
        className="relative mx-auto mt-14 grid max-w-md gap-8 lg:max-w-none lg:grid-cols-5 lg:gap-6"
      >
        {/* Connecting rule (desktop) */}
        <div
          aria-hidden="true"
          className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-border lg:block"
        />
        {processSection.steps.map((step, index) => (
          <StaggerItem
            as="li"
            key={step.title}
            className="relative flex gap-5 lg:flex-col lg:gap-0 lg:text-center"
          >
            <div className="relative flex flex-col items-center lg:mb-5">
              <span className="shadow-premium relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-white">
                <step.icon
                  className="size-5 text-steel-500"
                  aria-hidden="true"
                />
              </span>
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
    </Section>
  );
}
