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
import { FinalCta } from "@/components/home/final-cta";

/**
 * Core service-page template (PRD §4.1, 11 sections). Pages provide a
 * ServiceContent object + breadcrumbs; JSON-LD (Service, BreadcrumbList,
 * FAQPage) is emitted by the page component alongside this.
 */
export function ServicePage({
  service,
  breadcrumbs,
}: {
  service: ServiceContent;
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <>
      <ServiceHero hero={service.hero} breadcrumbs={breadcrumbs} />
      <ServiceIntro intro={service.intro} />
      {service.signs && <ServiceSigns signs={service.signs} />}
      <ServiceApproach approach={service.approach} />
      {service.materials && <ServiceMaterials materials={service.materials} />}
      {service.checklist && <ServiceChecklist checklist={service.checklist} />}
      {service.gallery && <ServiceGallery gallery={service.gallery} />}
      <HelpPanel />
      <ServiceFaq
        faqs={service.faqs}
        title={`${service.name} questions, answered`}
      />
      <RelatedServices related={service.related} />
      <ServiceAreaLinks serviceName={service.name} />
      <FinalCta />
    </>
  );
}
