import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { featuredProjects } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";

/**
 * Recent-work invitation (PRD §3.7). Owner directive 2026-07-04: supplied
 * project photos never render on the homepage — authenticity is the pitch
 * here, and the photos themselves live in /projects.
 */
export function FeaturedProjects() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow={featuredProjects.eyebrow}
        title={featuredProjects.title}
        description={featuredProjects.description}
        align="center"
      />

      <StaggerGroup
        as="ul"
        className="mt-12 flex flex-wrap justify-center gap-3"
        aria-label="Cities with completed projects"
      >
        {featuredProjects.cities.map((city) => (
          <StaggerItem as="li" key={city}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-slate-600">
              <MapPin className="size-3.5 text-steel-500" aria-hidden="true" />
              {city}
            </span>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal className="mt-12 flex justify-center">
        <Button
          size="lg"
          render={<Link href={featuredProjects.cta.href} />}
          nativeButton={false}
        >
          {featuredProjects.cta.label}
          <ArrowRight aria-hidden="true" />
        </Button>
      </Reveal>
    </Section>
  );
}
