import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqsFor } from "@/config/faqs";
import { IMAGES } from "@/config/images";
import { SERVICE_AREAS, areaBySlug } from "@/config/service-areas";
import { serviceBySlug } from "@/config/services";
import {
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";

export function generateStaticParams() {
  return SERVICE_AREAS.map((area) => ({ city: area.slug }));
}

/** Hero image varies by market so coastal pages do not show a Pine Belt estate. */
const HERO_BY_TIER = {
  home: IMAGES.holidayHero,
  core: IMAGES.colonialColumns,
  coast: IMAGES.hotelResort,
  regional: IMAGES.hoaEntrance,
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const area = areaBySlug((await params).city);
  if (!area) return {};
  return pageMetadata({
    title: `Christmas Light Installation in ${area.city}, MS`,
    description: `Professional Christmas light installation and permanent exterior lighting in ${area.city}, Mississippi. All-inclusive service: design, installation, maintenance, takedown and storage.`,
    path: `/service-areas/${area.slug}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const area = areaBySlug((await params).city);
  if (!area) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
    { name: area.city, path: `/service-areas/${area.slug}` },
  ];

  const services = area.emphasis
    .map((slug) => serviceBySlug(slug))
    .filter((s) => s !== undefined);
  const nearby = area.nearby
    .map((slug) => areaBySlug(slug))
    .filter((a) => a !== undefined);
  const faqs = faqsFor(["coverage", "pricing", "scheduling"]).slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `Christmas Light Installation in ${area.city}, MS`,
            description: `Professional holiday and permanent exterior lighting in ${area.city}, Mississippi.`,
            path: `/service-areas/${area.slug}`,
            areaServed: `${area.city}, Mississippi`,
          }),
          breadcrumbSchema(trail),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow={`${area.county} · Mississippi`}
        title={`Christmas & Exterior Lighting in ${area.city}`}
        intro={area.intro}
        image={HERO_BY_TIER[area.tier]}
        quoteLocation={`city_${area.slug}`}
      />
      <Breadcrumbs trail={trail} />

      <Section
        eyebrow={`Lighting in ${area.city}`}
        title={`What we see in ${area.city}.`}
      >
        <p className="max-w-3xl text-lg leading-relaxed text-bone-300">
          {area.localContext}
        </p>
      </Section>

      <Section
        tone="raised"
        eyebrow="Services here"
        title={`What ${area.city} books most`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="card-lit group flex flex-col gap-2 p-6"
            >
              <h3 className="text-base font-semibold">{service.label}</h3>
              <p className="text-sm leading-relaxed text-bone-500">
                {service.summary}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-medium text-champagne-300">
                Learn more
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Questions" title={`Working with us in ${area.city}`}>
        <FaqList items={faqs} />
      </Section>

      {nearby.length > 0 ? (
        <Section tone="raised" eyebrow="Nearby" title="We also work in">
          <ul className="flex flex-wrap gap-2">
            {nearby.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/service-areas/${other.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-bone-300 transition-colors hover:border-champagne-400/40 hover:text-champagne-300"
                >
                  {other.city}, MS
                  <ArrowUpRight className="size-3 opacity-50" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBand
        title={`Get a price for your ${area.city} property.`}
        body={`We work in ${area.city} regularly, so scheduling is straightforward. Send the address and we will take it from there.`}
        location={`city_${area.slug}_cta`}
      />
    </>
  );
}
