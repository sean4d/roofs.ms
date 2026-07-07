import { companyFacts } from "@/content/company";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * "Quick answers" entity block (PRD §10 AI discoverability). Renders the
 * company 5 W's as always-visible question/answer text — not an accordion —
 * so answer engines and crawlers can lift each self-contained fact directly.
 * The matching FAQPage JSON-LD is emitted by the page via faqSchema().
 */
export function CompanyAtAGlance({
  tone,
}: {
  tone?: "white" | "surface";
}) {
  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow="At a glance"
        title="Quick answers about Southeast Roofing"
        description="The essentials, straight — for you and for the search and AI tools people ask about local roofers."
      />
      <StaggerGroup
        as="div"
        className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2"
      >
        {companyFacts.map((fact) => (
          <StaggerItem as="div" key={fact.question}>
            <h3 className="font-display text-lg font-bold text-navy-900">
              {fact.question}
            </h3>
            <p className="mt-2 leading-relaxed text-slate-600">
              {fact.answer}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
