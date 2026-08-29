import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqsFor } from "@/config/faqs";
import { COMMERCIAL_BUDGETS } from "@/config/pricing";
import {
  VERTICALS,
  verticalBySlug,
  verticalsByPriority,
} from "@/config/verticals";
import {
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const vertical = verticalBySlug((await params).vertical);
  if (!vertical) return {};
  return pageMetadata({
    title: `${vertical.title}`,
    description: vertical.metaDescription,
    path: `/commercial/${vertical.slug}`,
    image: vertical.image.src,
  });
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const vertical = verticalBySlug((await params).vertical);
  if (!vertical) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Commercial", path: "/commercial" },
    { name: vertical.label, path: `/commercial/${vertical.slug}` },
  ];

  const faqs = faqsFor(["commercial", "coverage"]).slice(0, 6);
  const others = verticalsByPriority()
    .filter((v) => v.slug !== vertical.slug)
    .slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: vertical.title,
            description: vertical.metaDescription,
            path: `/commercial/${vertical.slug}`,
          }),
          breadcrumbSchema(trail),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow="Commercial"
        title={vertical.title}
        intro={vertical.summary}
        image={vertical.image}
        quoteLocation={`vertical_${vertical.slug}`}
        secondary={{
          label: "Request a proposal",
          href: "/commercial/request-proposal",
        }}
      />
      <Breadcrumbs trail={trail} />

      <Section
        eyebrow="What matters here"
        title={`What ${vertical.label.toLowerCase()} actually need from a lighting contractor.`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {vertical.concerns.map((concern) => (
            <div
              key={concern.heading}
              className="card-lit flex flex-col gap-3 p-7"
            >
              <h3 className="text-lg font-semibold">{concern.heading}</h3>
              <p className="text-bone-400 leading-relaxed">{concern.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        tone="raised"
        eyebrow="Budget"
        title="Commercial projects are priced to scope, not to a rate card."
        intro="Tell us the range you are working within and we will design to it. Most commercial and community projects fall somewhere in these bands."
      >
        <ul className="flex flex-wrap gap-2">
          {COMMERCIAL_BUDGETS.filter((b) => b !== "Not sure yet").map(
            (band) => (
              <li
                key={band}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm text-bone-300"
              >
                {band}
              </li>
            ),
          )}
        </ul>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-bone-500">
          We take work across the state when the project justifies the trip.
          Crews mobilize and stay rather than commuting, so a two-hour drive
          changes the schedule far less than people expect.
        </p>
      </Section>

      <Section eyebrow="Questions" title="What organizations ask us">
        <FaqList items={faqs} />
      </Section>

      <Section
        tone="raised"
        eyebrow="Also for"
        title="Other properties we light"
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/commercial/${other.slug}`}
                className="card-lit group flex h-full items-center justify-between gap-3 px-5 py-4"
              >
                <span className="text-sm font-medium text-bone-100">
                  {other.label}
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-bone-500 transition-all group-hover:translate-x-0.5 group-hover:text-champagne-400"
                  strokeWidth={2}
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Let's put a proposal in front of your board."
        body="Send us the property details and we will come back with a written scope, a design concept, proof of insurance and a fixed price."
        location={`vertical_${vertical.slug}_cta`}
        quoteLabel="Request a Commercial Proposal"
        quoteHref="/commercial/request-proposal"
      />
    </>
  );
}
