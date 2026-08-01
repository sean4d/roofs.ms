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
import { ServiceProse } from "@/components/services/service-sections";
import type { ProseSection } from "@/content/services/types";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/** Industry hub (PRD §2), routes into the six industry pages. */

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

/**
 * Hub prose (2026-07 expansion): why roof decisions differ by industry, plus
 * the routing table. Detail lives on the six industry pages. This page's job
 * is to get each owner to the right one.
 */
const industriesSections: ProseSection[] = [
  {
    title: "Why the building type changes the roofing answer",
    paragraphs: [
      "Two buildings with identical roof areas can need entirely different roofs, because the roof decision is never just about square footage. Occupancy drives scheduling: a school can concentrate work into summer, a church has to protect Sunday no matter what, and a manufacturer may not be able to stop the line at all. Operations drive the system: grease exhaust points toward PVC, heavy rooftop service traffic argues for multi-ply or walk-pad planning, and an open-purlin metal building narrows the field to structural systems engineered for it.",
      "Money moves differently too. A school board, a church committee, an apartment owner, and a city procurement office approve projects on different calendars, with different documentation, and different tolerance for phasing. The six pages below get specific about each: the buildings involved, the systems commonly considered, the scheduling realities, and what each decision-maker needs from a roofing proposal. This table is the short version.",
    ],
    table: {
      title: "Industry routing table",
      columns: [
        "Industry",
        "Typical roofs on site",
        "Main operational concern",
        "Common failure point",
        "Systems often considered",
      ],
      rows: [
        [
          "Schools",
          "Low-slope wings, gyms, canopies, portables",
          "Working around the school calendar",
          "Aged sections from different building eras",
          "TPO, modified bitumen, standing seam",
        ],
        [
          "Churches",
          "Steep sanctuary + low-slope halls on one campus",
          "Protecting services, weddings, funerals",
          "Steeple flashing, dead valleys, transitions",
          "Shingles, standing seam, TPO, modified bitumen",
        ],
        [
          "Apartments",
          "Repeated shingle or low-slope buildings",
          "Occupied units, parking, tenant notice",
          "The same detail failing on every building",
          "Architectural shingles, TPO, phased programs",
        ],
        [
          "Industrial",
          "Metal decks, open purlins, process rooftops",
          "Production schedules and hot-work control",
          "Chemical exposure, traffic, vibration",
          "PVC, TPO, structural metal, coatings",
        ],
        [
          "Warehouses",
          "Very large low-slope or metal panel roofs",
          "Inventory protection at scale",
          "Skylights, edge zones, drainage capacity",
          "TPO, EPDM, PBR, structural metal",
        ],
        [
          "Municipal",
          "Mixed portfolio, public-facing facilities",
          "Procurement, continuity of public services",
          "Deferred maintenance across budget cycles",
          "TPO, standing seam, maintenance programs",
        ],
      ],
      note: "Every recommendation still starts with a building-specific assessment: this table routes the conversation, it doesn't replace it.",
    },
    links: [
      { label: "Roofing for schools", href: "/commercial/industries/schools" },
      {
        label: "Roofing for churches",
        href: "/commercial/industries/churches",
      },
      {
        label: "Roofing for apartments",
        href: "/commercial/industries/apartments",
      },
      {
        label: "Industrial roofing",
        href: "/commercial/industries/industrial",
      },
      { label: "Warehouse roofing", href: "/commercial/industries/warehouses" },
      { label: "Municipal roofing", href: "/commercial/industries/municipal" },
    ],
  },
  {
    title: "What every industry has in common",
    paragraphs: [
      "However different these buildings are, the sequence we follow doesn't change. We establish what's actually on the roof before recommending anything: core samples to identify the assembly and layer count, moisture scanning to find wet insulation, and a deck check, because a recover installed over a saturated assembly only hides the problem until it gets expensive. Then the proposal gets written in the language the decision-maker actually uses: line-itemized for an owner, spec-graded for a bid table, phased for a board that funds work across budget cycles.",
      "The other constant is that the building keeps operating. Nobody closes a school, empties a warehouse, or cancels a Sunday service for a roof, so staging, access routes, noise windows, and daily watertight tie-ins get planned with your people before a crew shows up. And when the work is done, the closeout paperwork: as-builts, warranty registration, photo documentation, and the manufacturer inspection if the selected warranty requires one: goes into your records, not just ours.",
    ],
    bullets: [
      "Assessment first: cores, moisture mapping, and deck identification before any system is named.",
      "Written scope that survives review: by an owner, a committee, a board, or a procurement office.",
      "Recover versus tear-off decided by evidence and code, not by whichever is cheaper to sell.",
      "Scheduling built around your operating calendar, with daily dry-in so weather can't punish an open roof.",
      "Documented closeout: as-builts, warranty registration, and photo records you keep.",
      "Ongoing inspections available afterward, because the cheapest roof problem is the one caught early.",
    ],
    links: [
      {
        label: "How commercial replacements run",
        href: "/commercial/roof-replacement",
      },
      {
        label: "Set up planned maintenance",
        href: "/commercial/roof-maintenance",
      },
      {
        label: "Request a commercial roof assessment",
        href: "/commercial/request-consultation",
      },
    ],
  },
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
              roofing the same way: different schedules, budgets, approvals,
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

      <ServiceProse sections={industriesSections} />

      <CommercialCta />
    </>
  );
}
