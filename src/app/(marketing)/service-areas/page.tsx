import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cities } from "@/content/cities";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ServiceAreaMap } from "@/components/cities/service-area-map";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Service-areas hub (PRD §5): the radius map + every community we serve.
 * City names link to their dedicated page once its unique copy ships;
 * communities awaiting a page render as plain chips (never thin pages).
 */

export const metadata: Metadata = buildMetadata({
  title: "Roofing Service Areas in South Mississippi | Southeast Roofing",
  description:
    "Southeast Roofing serves Mississippi within about two hours of Hattiesburg — the Pine Belt, the Gulf Coast, Jackson, and Meridian. Find your community.",
  path: "/service-areas",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Service Areas", path: "/service-areas" },
];

export default function ServiceAreasHubPage() {
  const launched = new Set(cities.map((city) => city.slug));
  const hubs = siteConfig.serviceArea.filter((area) => area.hub);
  const communities = siteConfig.serviceArea.filter((area) => !area.hub);
  // Jackson & Meridian have launched pages but sit outside the hub set
  const launchedMetros = communities.filter((area) => launched.has(area.slug));
  const rest = communities.filter((area) => !launched.has(area.slug));

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Hattiesburg-based. Region-wide reach.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              We serve Mississippi within about two hours of our Hattiesburg
              office — the Pine Belt, the Gulf Coast, and the metros at the
              edges. Same crews, same standards, same itemized proposals,
              everywhere on this map.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Reveal>
            <ServiceAreaMap />
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Find your community"
              title="Cities we serve"
            />

            <StaggerGroup as="ul" className="mt-8 space-y-2.5">
              {[...hubs, ...launchedMetros].map((area) => {
                const isLaunched = launched.has(area.slug);
                return (
                  <StaggerItem as="li" key={area.slug}>
                    {isLaunched ? (
                      <Link
                        href={`/service-areas/${area.slug}`}
                        className="group flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md"
                      >
                        <span className="flex items-center gap-2.5 font-semibold text-navy-900">
                          <MapPin
                            className="size-4 text-steel-500"
                            aria-hidden="true"
                          />
                          {area.city}, MS
                        </span>
                        <ArrowRight
                          className="size-4 text-steel-500 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary px-4 py-3 font-medium text-slate-600">
                        <MapPin
                          className="size-4 text-steel-500"
                          aria-hidden="true"
                        />
                        {area.city}, MS
                      </span>
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            <Reveal className="mt-8">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                And the communities around them
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1.5">
                {rest.map((area) => (
                  <li
                    key={area.slug}
                    className="rounded-full bg-secondary px-3 py-1.5 text-sm text-slate-600"
                  >
                    {area.city}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-slate-500">
                Don&apos;t see your town? If you&apos;re within about two hours
                of Hattiesburg, we almost certainly serve you —{" "}
                <Link
                  href="/contact"
                  className="font-medium text-navy-900 underline-offset-4 hover:underline"
                >
                  just ask
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
