import Link from "next/link";
import { MapPin } from "lucide-react";

import { siteConfig } from "@/config/site";
import { serviceAreaSection } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";

/**
 * Service area (PRD §3.10, owner refinement 2026-07-04): Mississippi only.
 * Regional hubs lead with prominent chips in the owner-specified order;
 * smaller communities follow in geographic order at quieter weight.
 */
export function ServiceArea() {
  const hubs = siteConfig.serviceArea.filter((area) => area.hub);
  const communities = siteConfig.serviceArea.filter((area) => !area.hub);

  return (
    <Section>
      <SectionHeading
        eyebrow={serviceAreaSection.eyebrow}
        title={serviceAreaSection.title}
        description={serviceAreaSection.description}
        align="center"
      />

      <StaggerGroup
        as="ul"
        className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3"
        aria-label={serviceAreaSection.hubsLabel}
      >
        {hubs.map(({ city, slug }) => (
          <StaggerItem as="li" key={city}>
            <Link
              href={`/service-areas/${slug}`}
              className="shadow-premium inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-base font-semibold text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
            >
              <MapPin className="size-4 text-steel-500" aria-hidden="true" />
              {city}
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal className="mx-auto mt-8 max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {serviceAreaSection.communitiesLabel}
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-2">
          {communities.map(({ city, slug }) => (
            <li key={city}>
              <Link
                href={`/service-areas/${slug}`}
                className="inline-block rounded-full px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-secondary hover:text-primary"
              >
                {city}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          render={<Link href={serviceAreaSection.hubCta.href} />}
          nativeButton={false}
        >
          {serviceAreaSection.hubCta.label}
        </Button>
      </div>
    </Section>
  );
}
