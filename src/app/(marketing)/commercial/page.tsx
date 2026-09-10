import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { commercialHub } from "@/content/hubs";
import { industryCards } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/services/service-hero";
import { HubServiceGrid } from "@/components/services/hub-service-grid";
import {
  ServiceApproach,
  ServiceProse,
} from "@/components/services/service-sections";
import { ServiceFaq } from "@/components/services/service-faq";
import { CommercialCta } from "@/components/services/commercial-cta";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CommercialLicenseCallout } from "@/components/shared/license-panel";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/** Commercial hub, the "commercial homepage" (PRD §4.2). */

export const metadata: Metadata = buildMetadata({
  title: commercialHub.metaTitle,
  description: commercialHub.metaDescription,
  path: "/commercial",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Commercial Roofing", path: "/commercial" },
];

export default function CommercialHubPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Commercial Roofing",
            description: commercialHub.metaDescription,
            path: "/commercial",
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema([...commercialHub.faqs]),
        ]}
      />

      <ServiceHero
        hero={commercialHub.hero}
        breadcrumbs={breadcrumbs}
        audience="commercial"
      />

      {/* Credibility strip, publishable proof only */}
      <Section tone="navy" className="!py-6" ariaLabel="Commercial credentials">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {commercialHub.trustStrip.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm font-medium text-steel-100"
            >
              <BadgeCheck
                className="size-4 text-steel-300"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/*
        The licence, high on the page, because it is the first question a
        property manager has about a roofer they have not used before and the
        one thing on this page that is checkable against a government register
        rather than against our own word.
      */}
      <Section className="!pb-0">
        <CommercialLicenseCallout />
      </Section>

      {/*
        WAS "Nine services, one accountable contractor". The grid below it
        rendered ten. Hardcoding a count in marketing copy means the copy
        silently becomes a lie the first time somebody adds a service, so the
        sentence no longer carries a number at all: nothing left to drift.
      */}
      <Section>
        <SectionHeading
          eyebrow="Commercial services"
          title="Every system a facility needs"
          description="One accountable contractor for every system on the building, from emergency repairs to full capital replacements."
        />
        <HubServiceGrid services={[...commercialHub.services]} />
      </Section>

      {/* Industries served */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Industries we serve"
          title="Roofing that speaks your industry's language"
          description="Schedules, budgets, and constraints differ by building type. Our approach follows suit."
          align="center"
        />
        <StaggerGroup
          as="ul"
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {industryCards.map((industry) => (
            <StaggerItem as="li" key={industry.slug}>
              <Link
                href={`/commercial/industries/${industry.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
              >
                <industry.icon
                  className="size-7 text-steel-500 transition-colors group-hover:text-navy-900"
                  aria-hidden="true"
                />
                <span className="font-display font-semibold">
                  {industry.label}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal className="mt-8 text-center">
          <Link
            href="/commercial/industries"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Explore all industries
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Section>

      <ServiceApproach approach={commercialHub.process} />

      <ServiceProse sections={[...commercialHub.sections]} />
      <ServiceFaq
        faqs={[...commercialHub.faqs]}
        title="Commercial roofing questions, answered"
      />
      <CommercialCta />
    </>
  );
}
