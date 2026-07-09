import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { industries, industryCards } from "@/content/services";
import { serviceImageFor } from "@/content/service-images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { CommercialCta } from "@/components/services/commercial-cta";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/** Industry hub (PRD §2) — routes into the six industry pages. */

export const metadata: Metadata = buildMetadata({
  title: "Commercial Roofing by Industry in MS | Southeast Roofing",
  description:
    "Commercial roofing tuned to your industry: schools, churches, apartments, industrial, warehouses, and municipal buildings across South Mississippi.",
  path: "/commercial/industries",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Commercial Roofing", path: "/commercial" },
  { name: "Industries", path: "/commercial/industries" },
];

export default function IndustriesHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Roofing that speaks your industry&apos;s language
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              A school, a sanctuary, and a distribution center don&apos;t buy
              roofing the same way — different schedules, budgets, approvals,
              and stakes. We&apos;ve built our commercial practice around those
              differences.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Six industries"
          title="Choose your building type"
          align="center"
        />
        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industryCards.map((card) => {
            const industry = industries.find((i) => i.slug === card.slug)!;
            const image = serviceImageFor(industry.path);
            return (
              <StaggerItem as="div" key={card.slug}>
                {image ? (
                  <Link
                    href={industry.path}
                    className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-3xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/5"
                    />
                    <div className="relative p-7">
                      <h2 className="font-display text-xl font-bold text-white">
                        {industry.name.replace("Roofing for ", "")}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-steel-100">
                        {industry.hero.subhead.split(". ")[0]}.
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        How we serve {card.label.toLowerCase()}
                        <ArrowRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={industry.path}
                    className="group flex h-full flex-col rounded-3xl border border-border bg-secondary p-7 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl"
                  >
                    <card.icon
                      className="size-8 text-steel-500 transition-colors group-hover:text-navy-900"
                      aria-hidden="true"
                    />
                    <h2 className="mt-4 font-display text-xl font-bold">
                      {industry.name.replace("Roofing for ", "")}
                    </h2>
                    <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                      {industry.hero.subhead.split(". ")[0]}.
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                      How we serve {card.label.toLowerCase()}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      <CommercialCta />
    </>
  );
}
