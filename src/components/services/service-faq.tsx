import type { FaqEntry } from "@/lib/schema";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Reusable FAQ block (PRD §4.1.8) — the page emits the matching FAQPage
 * JSON-LD via faqSchema(); this renders the visible accordion.
 */
export function ServiceFaq({
  faqs,
  title = "Common questions",
  eyebrow = "FAQ",
}: {
  faqs: FaqEntry[];
  title?: string;
  eyebrow?: string;
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} align="center" />
      <div className="mx-auto mt-12 max-w-3xl">
        <Reveal>
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
