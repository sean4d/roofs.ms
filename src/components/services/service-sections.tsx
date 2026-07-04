import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import type { ServiceContent } from "@/content/services/types";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Section renderers for the core service-page template (PRD §4.1).
 * Each takes its slice of ServiceContent; service-page.tsx composes them.
 */

/** §4.1.2 — intro: what/who/why it matters in South Mississippi. */
export function ServiceIntro({ intro }: { intro: ServiceContent["intro"] }) {
  return (
    <Section>
      <SectionHeading title={intro.title} />
      <Reveal className="mt-6 max-w-3xl space-y-5">
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-relaxed text-slate-600">
            {paragraph}
          </p>
        ))}
      </Reveal>
    </Section>
  );
}

/** §4.1.3 — "signs you need this" icon grid. */
export function ServiceSigns({
  signs,
}: {
  signs: NonNullable<ServiceContent["signs"]>;
}) {
  return (
    <Section tone="surface">
      <SectionHeading title={signs.title} description={signs.description} />
      <StaggerGroup
        as="ul"
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {signs.items.map((item) => (
          <StaggerItem
            as="li"
            key={item.title}
            className="rounded-2xl border border-border bg-background p-6"
          >
            <item.icon className="size-6 text-steel-500" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-semibold">
              {item.title}
            </h3>
            <p className="mt-2 leading-relaxed text-slate-600">{item.text}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

/** §4.1.4 — what's included / our approach, as numbered steps. */
export function ServiceApproach({
  approach,
}: {
  approach: ServiceContent["approach"];
}) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Our approach"
        title={approach.title}
        description={approach.description}
      />
      <StaggerGroup as="ul" className="mt-12 grid gap-8 md:grid-cols-2">
        {approach.steps.map((step, index) => (
          <StaggerItem as="li" key={step.title} className="flex gap-5">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">{step.text}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

/** §4.1.5 — materials & options. */
export function ServiceMaterials({
  materials,
}: {
  materials: NonNullable<ServiceContent["materials"]>;
}) {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Materials & options"
        title={materials.title}
        description={materials.description}
      />
      <StaggerGroup
        as="ul"
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {materials.items.map((item) => (
          <StaggerItem
            as="li"
            key={item.title}
            className="rounded-2xl border border-border bg-background p-6"
          >
            <h3 className="font-display text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-slate-600">{item.text}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
      {materials.note && (
        <Reveal className="mt-8">
          <p className="max-w-3xl text-sm text-slate-500">{materials.note}</p>
        </Reveal>
      )}
    </Section>
  );
}

/** Emergency/insurance additions (§4.1) — actionable checklist. */
export function ServiceChecklist({
  checklist,
}: {
  checklist: NonNullable<ServiceContent["checklist"]>;
}) {
  return (
    <Section tone="navy">
      <SectionHeading
        title={checklist.title}
        description={checklist.description}
        onDark
      />
      <StaggerGroup as="ul" className="mt-10 grid max-w-3xl gap-4">
        {checklist.items.map((item) => (
          <StaggerItem as="li" key={item} className="flex items-start gap-3">
            <CheckCircle2
              className="mt-1 size-5 shrink-0 text-steel-300"
              aria-hidden="true"
            />
            <span className="leading-relaxed text-steel-100">{item}</span>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

/** §4.1.6 — gallery strip of real project photography. */
export function ServiceGallery({
  gallery,
}: {
  gallery: NonNullable<ServiceContent["gallery"]>;
}) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Real projects"
        title={gallery.title}
        description={gallery.description}
      />
      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.photos.map((photo) => (
          <StaggerItem as="div" key={photo.src}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={450}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
      <Reveal className="mt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-semibold text-navy-900 underline-offset-4 hover:underline"
        >
          Browse the full project gallery
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </Section>
  );
}

/** §4.1.9 — related services (3 cards). */
export function RelatedServices({
  related,
}: {
  related: ServiceContent["related"];
}) {
  return (
    <Section tone="surface">
      <SectionHeading eyebrow="Related services" title="You may also need" />
      <StaggerGroup as="ul" className="mt-12 grid gap-6 md:grid-cols-3">
        {related.map((service) => (
          <StaggerItem as="li" key={service.href}>
            <Link
              href={service.href}
              className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
            >
              <h3 className="font-display text-lg font-semibold">
                {service.label}
              </h3>
              <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                {service.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                Learn more
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

/** §4.1.10 — service-area links ("We provide {service} in: …"). */
export function ServiceAreaLinks({ serviceName }: { serviceName: string }) {
  const hubs = siteConfig.serviceArea.filter((area) => area.hub);
  const communities = siteConfig.serviceArea.filter((area) => !area.hub);

  return (
    <Section>
      <SectionHeading
        eyebrow="Service area"
        title={`Where we provide ${serviceName.toLowerCase()}`}
        description="Based in Hattiesburg and serving Mississippi within about two hours — from the Pine Belt to the Gulf Coast."
      />
      <Reveal className="mt-10">
        <ul className="flex flex-wrap gap-3">
          {hubs.map(({ city, slug }) => (
            <li key={city}>
              <Link
                href={`/service-areas/${slug}`}
                className="inline-block rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:bg-steel-100"
              >
                {city}, MS
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-x-1 gap-y-1.5">
          {communities.map(({ city, slug }) => (
            <li key={city}>
              <Link
                href={`/service-areas/${slug}`}
                className="inline-block rounded-full px-2.5 py-1 text-sm text-slate-500 transition-colors hover:bg-secondary hover:text-primary"
              >
                {city}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-slate-500">
          Don&apos;t see your town? If you&apos;re within about two hours of
          Hattiesburg,{" "}
          <Link
            href="/contact"
            className="font-medium text-navy-900 underline-offset-4 hover:underline"
          >
            we most likely serve you
          </Link>
          .
        </p>
      </Reveal>
    </Section>
  );
}
