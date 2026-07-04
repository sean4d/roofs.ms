import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getResidentialMetalChild,
  residentialMetalChildren,
} from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/**
 * Residential metal system pages (PRD §4.3): standing-seam and
 * exposed-fastener ship in Phase 3; gauge pages (26/29) follow in Phase 4.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return residentialMetalChildren.map((service) => ({
    system: service.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/residential/metal-roofing/[system]">,
): Promise<Metadata> {
  const { system: slug } = await props.params;
  const service = getResidentialMetalChild(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
  });
}

export default async function ResidentialMetalSystemPage(
  props: PageProps<"/residential/metal-roofing/[system]">,
) {
  const { system: slug } = await props.params;
  const service = getResidentialMetalChild(slug);
  if (!service) notFound();

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Residential Roofing", path: "/residential" },
    { name: "Metal Roofing", path: "/residential/metal-roofing" },
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
