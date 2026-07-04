import type { Metadata } from "next";

import { emergencyRoofing as service } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/**
 * Emergency roofing (PRD §4.1 emergency additions): mitigation-first
 * messaging with the "what to do right now" checklist. The storm-event
 * banner (siteConfig.flags.emergencyBanner) links here when enabled.
 */

export const metadata: Metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Storm Damage", path: "/storm-damage" },
  { name: "Emergency Roofing", path: service.path },
];

export default function EmergencyRoofingPage() {
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
