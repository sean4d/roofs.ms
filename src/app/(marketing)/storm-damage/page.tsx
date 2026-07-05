import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { stormHub } from "@/content/hubs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceApproach } from "@/components/services/service-sections";
import { ServiceFaq } from "@/components/services/service-faq";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/** Storm hub (PRD §2): damage types, response process, routes to children. */

export const metadata: Metadata = buildMetadata({
  title: stormHub.metaTitle,
  description: stormHub.metaDescription,
  path: "/storm-damage",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Storm Damage", path: "/storm-damage" },
];

export default function StormDamagePage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Storm Damage Roof Repair",
            description: stormHub.metaDescription,
            path: "/storm-damage",
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema([...stormHub.faqs]),
        ]}
      />

      <ServiceHero hero={stormHub.hero} breadcrumbs={breadcrumbs} />

      {/* Storm Center strip (owner request 2026-07-05: make it findable) */}
      <section className="border-b border-border bg-navy-950">
        <div className="container-site flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <p className="text-sm leading-relaxed text-steel-100 sm:text-base">
            <span className="font-display font-bold text-white">
              Storm Center:
            </span>{" "}
            live Mississippi weather alerts, the first-hours checklist, and
            real damage photos — all in one place.
          </p>
          <Button
            className="shrink-0 bg-white text-primary hover:bg-steel-100"
            render={<Link href="/storm-center" />}
            nativeButton={false}
          >
            Open the Storm Center
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Two paths — emergency + insurance, the hub's primary job */}
      <Section>
        <SectionHeading
          eyebrow="Start here"
          title="Two paths, depending on your situation"
        />
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {stormHub.paths.map((path) => (
            <StaggerItem as="div" key={path.href}>
              <Link
                href={path.href}
                className="group flex h-full flex-col rounded-3xl border border-border bg-secondary p-8 transition-all hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
              >
                <h3 className="font-display text-2xl font-bold">
                  {path.label}
                </h3>
                <p className="mt-3 flex-1 text-lg leading-relaxed text-slate-600">
                  {path.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-steel-500 group-hover:text-navy-900">
                  Go
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Damage types — real documentation photos */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="What storms do here"
          title="The damage we document every season"
          description="Real inspection photos from South Mississippi roofs — this is what we look for and what your insurer needs to see."
        />
        <StaggerGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2">
          {stormHub.damageTypes.map((damage) => (
            <StaggerItem
              as="li"
              key={damage.title}
              className="overflow-hidden rounded-2xl border border-border bg-background"
            >
              <Image
                src={damage.photo.src}
                alt={damage.photo.alt}
                width={800}
                height={500}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-[8/5] w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <damage.icon
                    className="size-6 text-steel-500"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-lg font-semibold">
                    {damage.title}
                  </h3>
                </div>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {damage.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <ServiceApproach approach={stormHub.process} />

      <ServiceFaq
        faqs={[...stormHub.faqs]}
        title="Storm damage questions, answered"
      />
      <FinalCta />
    </>
  );
}
