import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getIndustry, industries } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicePage } from "@/components/services/service-page";

/** Industry pages (PRD §4.2) — schools, churches, apartments, industrial, warehouses, municipal. */

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.slug }));
}

export async function generateMetadata(
  props: PageProps<"/commercial/industries/[industry]">,
): Promise<Metadata> {
  const { industry: slug } = await props.params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  return buildMetadata({
    title: industry.metaTitle,
    description: industry.metaDescription,
    path: industry.path,
  });
}

export default async function IndustryPage(
  props: PageProps<"/commercial/industries/[industry]">,
) {
  const { industry: slug } = await props.params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Commercial Roofing", path: "/commercial" },
    { name: "Industries", path: "/commercial/industries" },
    { name: industry.name.replace("Roofing for ", ""), path: industry.path },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: industry.name,
            description: industry.metaDescription,
            path: industry.path,
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema(industry.faqs),
        ]}
      />
      <ServicePage
        service={industry}
        breadcrumbs={breadcrumbs}
        audience="commercial"
      />
    </>
  );
}
