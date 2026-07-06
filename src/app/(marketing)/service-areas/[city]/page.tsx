import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { cities, getCity } from "@/content/cities";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { CityPage } from "@/components/cities/city-page";

/**
 * City service-area pages (PRD §5, batch 1). Only cities with completed
 * unique copy generate — the rest stay reserved until their batch ships
 * (anti-doorway rule).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata(
  props: PageProps<"/service-areas/[city]">,
): Promise<Metadata> {
  const { city: slug } = await props.params;
  const cityContent = getCity(slug);
  if (!cityContent) return {};

  return buildMetadata({
    title: cityContent.metaTitle,
    description: cityContent.metaDescription,
    path: `/service-areas/${cityContent.slug}`,
    // City titles are keyword-complete already; skip the brand suffix.
    titleAbsolute: true,
  });
}

export default async function ServiceAreaCityPage(
  props: PageProps<"/service-areas/[city]">,
) {
  const { city: slug } = await props.params;
  const cityContent = getCity(slug);
  if (!cityContent) notFound();

  const path = `/service-areas/${cityContent.slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
    { name: cityContent.city, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `Roofing in ${cityContent.city}, MS`,
            description: cityContent.metaDescription,
            path,
            areaServed: [cityContent.city],
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema(cityContent.faqs),
        ]}
      />
      <CityPage cityContent={cityContent} breadcrumbs={breadcrumbs} />
    </>
  );
}
