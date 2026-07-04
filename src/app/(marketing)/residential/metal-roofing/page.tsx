import type { Metadata } from "next";

import { residentialMetalHub as service } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/** Residential metal hub (PRD §4.3): styles, gauges, value, honest trade-offs. */

export const metadata: Metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Residential Roofing", path: "/residential" },
  { name: "Metal Roofing", path: service.path },
];

export default function ResidentialMetalRoofingPage() {
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
