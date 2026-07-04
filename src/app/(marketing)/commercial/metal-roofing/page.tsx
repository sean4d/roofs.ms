import type { Metadata } from "next";

import { commercialMetalHub as service } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/** Commercial metal hub (PRD §4.3): low-slope + architectural metal. */

export const metadata: Metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Commercial Roofing", path: "/commercial" },
  { name: "Metal Roofing", path: service.path },
];

export default function CommercialMetalRoofingPage() {
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
      <ServicePage
        service={service}
        breadcrumbs={breadcrumbs}
        audience="commercial"
      />
    </>
  );
}
