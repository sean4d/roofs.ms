import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { commercialServices, getCommercialService } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/**
 * Commercial service pages (PRD §4.2) — one dynamic route, content from
 * the registry. Static siblings (metal-roofing, industries,
 * request-consultation) never reach this route.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return commercialServices.map((service) => ({ service: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/commercial/[service]">,
): Promise<Metadata> {
  const { service: slug } = await props.params;
  const service = getCommercialService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
  });
}

export default async function CommercialServicePage(
  props: PageProps<"/commercial/[service]">,
) {
  const { service: slug } = await props.params;
  const service = getCommercialService(slug);
  if (!service) notFound();

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Commercial Roofing", path: "/commercial" },
    { name: service.name, path: service.path },
  ];

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
