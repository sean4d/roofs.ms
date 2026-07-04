import type { Metadata } from "next";

import { insuranceClaims as service } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/**
 * Insurance claim assistance (PRD §4.1 insurance additions): step-by-step
 * claims walkthrough, adjuster meetings, documentation checklist — factual
 * assistance language only, no outcome promises.
 */

export const metadata: Metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Storm Damage", path: "/storm-damage" },
  { name: "Insurance Claims", path: service.path },
];

export default function InsuranceClaimsPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name,
            description: service.metaDescription,
            path: service.path,
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema(service.faqs),
        ]}
      />
      <ServicePage service={service} breadcrumbs={breadcrumbs} />
    </>
  );
}
