import type { BreadcrumbItem } from "@/lib/schema";
import type { ServiceContent } from "@/content/services/types";
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

  return (
    <>
      <ServiceHero
        hero={service.hero}
        breadcrumbs={breadcrumbs}
        audience={audience}
      />
      <ServiceIntro intro={service.intro} />
      {service.signs && <ServiceSigns signs={service.signs} />}
      <ServiceApproach approach={service.approach} />
      {service.materials && <ServiceMaterials materials={service.materials} />}
      {service.checklist && <ServiceChecklist checklist={service.checklist} />}
      {service.gallery && <ServiceGallery gallery={service.gallery} />}
      {!commercial && <HelpPanel />}
      <ServiceFaq
        faqs={service.faqs}
        title={`${service.name} questions, answered`}
      />
      <RelatedServices related={service.related} />
      <ServiceAreaLinks serviceName={service.name} />
      {commercial ? <CommercialCta /> : <FinalCta />}
    </>
  );
}
