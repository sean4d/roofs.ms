import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { IMAGES } from "@/config/images";
import { COVERAGE, SERVICE_AREAS, areasByTier } from "@/config/service-areas";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Service Areas",
  description:
    "Southeast Lights serves Hattiesburg, the Pine Belt, the Mississippi Gulf Coast and beyond. Residential within about an hour, commercial within two, and statewide for larger projects.",
  path: "/service-areas",
});

const GROUPS = [
  {
    tier: "home" as const,
    label: "Home base",
    note: "Our office, warehouse and storage.",
  },
  {
    tier: "core" as const,
    label: "Pine Belt",
    note: "Full residential and commercial coverage.",
  },
  {
    tier: "coast" as const,
    label: "Gulf Coast",
    note: "Commercial, hospitality and Mardi Gras.",
  },
  {
    tier: "regional" as const,
    label: "Regional",
    note: "Commercial, HOA and municipal projects.",
  },
];

export default function ServiceAreasPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Coverage"
        title="Where we work."
        intro="Hattiesburg and the Pine Belt are home. We cover the Gulf Coast for commercial and hospitality work, and we travel further for projects worth traveling for."
        image={IMAGES.hoaEntrance}
        quoteLocation="areas_hub"
      />
      <Breadcrumbs trail={trail} />

      <Section
        eyebrow="How far we go"
        title="Honest coverage, not a map with the whole state shaded in."
      >
        <div className="grid max-w-4xl gap-8 sm:grid-cols-3">
          {[
            ["Residential", COVERAGE.residential],
            ["Commercial", COVERAGE.commercial],
            ["Large projects", COVERAGE.large],
          ].map(([label, body]) => (
            <div key={label}>
              <h3 className="text-sm font-semibold text-champagne-300">
                {label}
              </h3>
              <div className="rule-lit my-3" />
              <p className="text-sm leading-relaxed text-bone-500">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {GROUPS.map((group, index) => {
        const areas = areasByTier(group.tier);
        if (areas.length === 0) return null;
        return (
          <Section
            key={group.tier}
            tone={index % 2 === 0 ? "raised" : "ink"}
            eyebrow={group.label}
            title={group.note}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="card-lit group flex flex-col gap-3 p-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{area.city}, MS</h3>
                    <p className="mt-0.5 text-xs text-bone-500">
                      {area.county}
                    </p>
                  </div>
                  <p className="text-bone-400 text-sm leading-relaxed">
                    {area.intro.length > 150
                      ? `${area.intro.slice(0, 150).trimEnd()}...`
                      : area.intro}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-medium text-champagne-300">
                    Lighting in {area.city}
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        );
      })}

      <CtaBand
        title="Not sure if we cover you?"
        body={`We serve ${SERVICE_AREAS.length} named markets and travel beyond them for larger commercial work. Ask, and we will tell you straight.`}
        location="areas_hub_cta"
      />
    </>
  );
}
