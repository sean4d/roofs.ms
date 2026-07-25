import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { allFaqs, faqGroups } from "@/content/faq";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Section } from "@/components/shared/section";
import { PhoneLink } from "@/components/shared/phone-link";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Roofing FAQ hub. Google Business Profile Q&A isn't enabled on our profile,
 * so the question-intent traffic that would have landed there is captured here
 * instead — grouped, accordion-rendered, and emitting FAQPage structured data
 * so the answers are eligible for rich results and readable by AI assistants.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roofing FAQ — Hattiesburg & South Mississippi | Southeast Roofing",
  description:
    "Straight answers about roof costs, insurance claims, licensing, materials, and timelines in South Mississippi — from a licensed, GAF-certified Hattiesburg roofer.",
  path: "/faq",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(allFaqs)]} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Roofing questions, answered straight
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              The questions South Mississippi homeowners actually ask us — about
              cost, insurance, licensing, materials, and how the work goes. No
              sales spin, and we&apos;ll tell you when the honest answer
              is &ldquo;you don&apos;t need us yet.&rdquo;
            </p>

            {/* Jump links — helps long-page scanning and gives crawlers the
                section structure. */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-steel-500"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {faqGroups.map((group, i) => (
        <Section key={group.id} tone={i % 2 === 1 ? "surface" : "white"}>
          <div id={group.id} className="scroll-mt-24">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                {group.title}
              </h2>
            </Reveal>
            <div className="mt-8 max-w-3xl">
              <Reveal>
                <Accordion>
                  {group.faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`${group.id}-${index}`}
                    >
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
          </div>
        </Section>
      ))}

      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Still have a question?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-100">
              Ask us directly — the questions homeowners actually ask are where
              our next guides and answers come from.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-steel-100"
              >
                Ask us a question
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <PhoneLink className="text-white" />
            </div>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
