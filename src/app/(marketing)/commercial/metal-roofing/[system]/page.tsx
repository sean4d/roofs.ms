import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  commercialMetalChildren,
  getCommercialMetalChild,
} from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/** Commercial metal system pages (PRD §4.3). */

export const dynamicParams = false;

export function generateStaticParams() {
  return commercialMetalChildren.map((service) => ({ system: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/commercial/metal-roofing/[system]">,
): Promise<Metadata> {
  const { system: slug } = await props.params;
  const service = getCommercialMetalChild(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
  });
}

export default async function CommercialMetalSystemPage(
  props: PageProps<"/commercial/metal-roofing/[system]">,
) {
  const { system: slug } = await props.params;
  const service = getCommercialMetalChild(slug);
  if (!service) notFound();

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Commercial Roofing", path: "/commercial" },
    { name: "Metal Roofing", path: "/commercial/metal-roofing" },
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
