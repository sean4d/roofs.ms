import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Home } from "lucide-react";

import { metalHub } from "@/content/hubs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceMaterials } from "@/components/services/service-sections";
import { ServiceFaq } from "@/components/services/service-faq";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Metal cross-hub (PRD §4.3): an SEO landing page whose primary job is the
 * two-path router into /residential/metal-roofing and
 * /commercial/metal-roofing. Metal is a system within the two divisions —
 * never presented as a third division.
 */

export const metadata: Metadata = buildMetadata({
  title: metalHub.metaTitle,
  description: metalHub.metaDescription,
  path: "/metal-roofing",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Metal Roofing", path: "/metal-roofing" },
];

const pathIcons = { residential: Home, commercial: Building2 } as const;

export default function MetalRoofingHubPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Metal Roofing",
            description: metalHub.metaDescription,
            path: "/metal-roofing",
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema([...metalHub.faqs]),
        ]}
      />

      <ServiceHero hero={metalHub.hero} breadcrumbs={breadcrumbs} />

      {/* Two-path router — the page's primary job (PRD §4.3) */}
      <Section>
        <SectionHeading
          eyebrow="Choose your path"
          title="Which building are we roofing?"
          align="center"
        />
        <StaggerGroup className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {(["residential", "commercial"] as const).map((key) => {
            const path = metalHub.paths[key];
            const Icon = pathIcons[key];
            return (
              <StaggerItem as="div" key={path.href}>
                <Link
                  href={path.href}
                  className="group flex h-full flex-col rounded-3xl border border-border bg-secondary p-8 transition-all hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
                >
                  <Icon
                    className="size-8 text-steel-500 transition-colors group-hover:text-navy-900"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-display text-2xl font-bold">
                    {path.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    {path.description}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2">
                    {path.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-steel-500"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-steel-500 group-hover:text-navy-900">
                    Explore {key} metal
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      <ServiceMaterials materials={metalHub.materials} />

      {/* Honest metal vs shingle comparison */}
      <Section>
        <SectionHeading
          eyebrow="Straight comparison"
          title={metalHub.comparison.title}
          description={metalHub.comparison.description}
        />
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {[metalHub.comparison.metal, metalHub.comparison.shingle].map(
            (column) => (
              <StaggerItem
                as="div"
                key={column.title}
                className="rounded-3xl border border-border bg-secondary p-8"
              >
                <h3 className="font-display text-xl font-bold">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-slate-600"
                    >
                      <CheckCircle2
                        className="mt-1 size-4 shrink-0 text-steel-500"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ),
          )}
        </StaggerGroup>
      </Section>

      <ServiceFaq
        faqs={[...metalHub.faqs]}
        title="Metal roofing questions, answered"
      />
      <FinalCta />
    </>
  );
}
