import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";

import { siteConfig } from "@/config/site";
import { financingHub } from "@/content/hubs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceApproach } from "@/components/services/service-sections";
import { ServiceFaq } from "@/components/services/service-faq";
import { Section } from "@/components/shared/section";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Financing page (PRD §2 conversion; Phase 3). Info + GoodLeap application
 * only — no rates or terms stated (they're the lender's, PRD §0.2). The
 * financing calculator is Phase 8 and ships only with real terms.
 */

export const metadata: Metadata = buildMetadata({
  title: financingHub.metaTitle,
  description: financingHub.metaDescription,
  path: "/financing",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Financing", path: "/financing" },
];

export default function FinancingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          faqSchema([...financingHub.faqs]),
        ]}
      />

      <ServiceHero hero={financingHub.hero} breadcrumbs={breadcrumbs} />

      <ServiceApproach approach={financingHub.steps} />

      {/* Apply band + honest notes */}
      <Section tone="navy">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <financingHub.icon
              className="size-8 text-steel-300"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-display text-3xl font-bold text-white">
              Ready to see your options?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-steel-100">
              The application runs through GoodLeap, our financing partner —
              online, in minutes, with your plans and terms shown to you
              directly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {/* External GoodLeap application — opens in a new tab */}
              <Button
                size="lg"
                className="bg-white text-base text-primary hover:bg-steel-100"
                render={
                  <a
                    href={siteConfig.links.financing}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                Apply with GoodLeap
                <ExternalLink className="size-4" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-base text-white hover:border-white hover:bg-white/10"
                render={<Link href="/free-inspection" />}
                nativeButton={false}
              >
                Get the estimate first
              </Button>
            </div>
          </Reveal>

          <StaggerGroup as="ul" className="space-y-4">
            {financingHub.honestNotes.map((note) => (
              <StaggerItem
                as="li"
                key={note}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <Info
                  className="mt-0.5 size-5 shrink-0 text-steel-300"
                  aria-hidden="true"
                />
                <span className="leading-relaxed text-steel-100">{note}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      <ServiceFaq
        faqs={[...financingHub.faqs]}
        title="Financing questions, answered"
      />
      <FinalCta />
    </>
  );
}
