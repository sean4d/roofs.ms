import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getResidentialService, residentialServices } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/**
 * Core residential service pages (PRD §4.1) — one dynamic route, content
 * from the service registry. /residential/metal-roofing is a static
 * sibling folder (it has children) and never reaches this route.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return residentialServices.map((service) => ({ service: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/residential/[service]">,
): Promise<Metadata> {
  const { service: slug } = await props.params;
  const service = getResidentialService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
  });
}

export default async function ResidentialServicePage(
  props: PageProps<"/residential/[service]">,
) {
  const { service: slug } = await props.params;
  const service = getResidentialService(slug);
  if (!service) notFound();

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Residential Roofing", path: "/residential" },
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
      <ServicePage service={service} breadcrumbs={breadcrumbs} />
    </>
  );
}
