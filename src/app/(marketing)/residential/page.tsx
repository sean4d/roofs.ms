import type { Metadata } from "next";

import { residentialHub } from "@/content/hubs";
import { trustItems } from "@/content/homepage";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/services/service-hero";
import { HubServiceGrid } from "@/components/services/hub-service-grid";
import { HelpPanel } from "@/components/services/help-panel";
import { ServiceFaq } from "@/components/services/service-faq";
import { ServiceAreaLinks } from "@/components/services/service-sections";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/** Residential division hub (PRD §2) — the Phase 3 services hub. */

export const metadata: Metadata = buildMetadata({
  title: residentialHub.metaTitle,
  description: residentialHub.metaDescription,
  path: "/residential",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Residential Roofing", path: "/residential" },
];

export default function ResidentialHubPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Residential Roofing",
            description: residentialHub.metaDescription,
            path: "/residential",
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema([...residentialHub.faqs]),
        ]}
      />

      <ServiceHero hero={residentialHub.hero} breadcrumbs={breadcrumbs} />

      <Section>
        <SectionHeading
          eyebrow="Residential services"
          title="Everything a home's roof needs"
          description="Roofing, gutters, fascia, and everything where they meet — one accountable local team."
        />
        <HubServiceGrid services={[...residentialHub.services]} />
      </Section>

      <Section tone="surface" ariaLabel="Credentials">
        <StaggerGroup
          as="ul"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trustItems.map((item) => (
            <StaggerItem as="li" key={item.label} className="flex gap-4">
              <item.icon
                className="size-7 shrink-0 text-steel-500"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <HelpPanel />
      <ServiceFaq
        faqs={[...residentialHub.faqs]}
        title="Residential roofing questions, answered"
      />
      <ServiceAreaLinks serviceName="residential roofing" />
      <FinalCta />
    </>
  );
}
