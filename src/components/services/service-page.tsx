import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BreadcrumbItem } from "@/lib/schema";
import type { ServiceContent } from "@/content/services/types";
import { serviceImageFor } from "@/content/service-images";
import { industryCards } from "@/content/services";
import { defaultServiceTools } from "@/config/tools";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { ToolStrip } from "@/components/tools/tool-strip";
import { ServiceHero } from "@/components/services/service-hero";
import {
  RelatedServices,
  ServiceApproach,
  ServiceAreaLinks,
  ServiceChecklist,
  ServiceGallery,
  ServiceIntro,
  ServiceMaterials,
  ServiceSigns,
} from "@/components/services/service-sections";
import { HelpPanel } from "@/components/services/help-panel";
import { RoofAnatomy } from "@/components/services/roof-anatomy";
import { VentilationAirflow } from "@/components/services/ventilation-airflow";
import { ServiceFaq } from "@/components/services/service-faq";
import { CommercialCta } from "@/components/services/commercial-cta";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Core service-page template (PRD §4.1, 11 sections). Pages provide a
 * ServiceContent object + breadcrumbs; JSON-LD (Service, BreadcrumbList,
 * FAQPage) is emitted by the page component alongside this.
 *
 * audience="commercial" (PRD §4.2): consultation CTA replaces free
 * inspection, the residential insurance/financing panel is dropped, and
 * the closing band is the commercial consultation CTA.
 */
export function ServicePage({
  service,
  breadcrumbs,
  audience = "residential",
}: {
  service: ServiceContent;
  breadcrumbs: BreadcrumbItem[];
  audience?: "residential" | "commercial";
}) {
  const commercial = audience === "commercial";

  // Contextual tools: explicit override wins; otherwise residential pages
  // auto-pick from the slug and commercial pages stay opted out.
  const tools =
    service.tools ??
    (commercial ? [] : defaultServiceTools(`${service.slug} ${service.path}`));
  const toolHeading =
    tools[0] === "insurance-wizard"
      ? "Storm damage & insurance tools"
      : tools[0] === "damage-analyzer"
        ? "Roof repair & inspection tools"
        : `Plan your ${service.name.toLowerCase()}`;

  // Commercial service pages cross-link to the industries we serve (industry
  // pages already link back to services via their own related list).
  const showIndustries = commercial && !service.path.includes("/industries/");

  // Visual-first: heroes without dedicated photography automatically pick
  // up the image registry slot for their route the moment one is filled.
  const hero = service.hero.photo
    ? service.hero
    : { ...service.hero, photo: serviceImageFor(service.path) ?? undefined };

  return (
    <>
      <ServiceHero hero={hero} breadcrumbs={breadcrumbs} audience={audience} />
      <ServiceIntro intro={service.intro} />
      {service.signs && <ServiceSigns signs={service.signs} />}
      <ServiceApproach approach={service.approach} />
      {service.anatomy && <RoofAnatomy />}
      {service.ventDiagram && <VentilationAirflow />}
      {service.materials && <ServiceMaterials materials={service.materials} />}
      {service.checklist && <ServiceChecklist checklist={service.checklist} />}
      {service.gallery && <ServiceGallery gallery={service.gallery} />}
      {!commercial && <HelpPanel />}
      <ServiceFaq
        faqs={service.faqs}
        title={`${service.name} questions, answered`}
      />
      <RelatedServices related={service.related} />
      {showIndustries && (
        <Section tone="surface">
          <SectionHeading
            eyebrow="Industries we serve"
            title="Built for your kind of building"
            description="Every facility type has its own schedule, budget, and roof. We roof them all across South Mississippi."
          />
          <StaggerGroup
            as="ul"
            className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3"
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
          <div className="mt-8 text-center">
            <Link
              href="/commercial/industries"
              className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Explore all industries
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Section>
      )}
      {tools.length > 0 && (
        <Section>
          <ToolStrip tools={tools} heading={toolHeading} />
        </Section>
      )}
      <ServiceAreaLinks serviceName={service.name} />
      {commercial ? <CommercialCta /> : <FinalCta />}
    </>
  );
}
