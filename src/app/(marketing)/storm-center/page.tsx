import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ClipboardCheck,
  CloudLightning,
  ExternalLink,
  PhoneCall,
  ShieldAlert,
  Umbrella,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  stormPhotos,
  STORM_CATEGORY_LABELS,
} from "@/content/photos";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { StormAlerts } from "@/components/storm/storm-alerts";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PhoneLink } from "@/components/shared/phone-link";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Storm Center (PRD §13 Phase 8): live NWS alerts, the first-hours
 * checklist, real damage identification photos, and the claims path.
 * Revalidates every 30 minutes so the alerts panel stays current.
 */

export const revalidate = 1800;

export const metadata: Metadata = buildMetadata({
  title: "Storm Center | Live Alerts & Storm Damage Help | Southeast Roofing",
  description:
    "Live Mississippi weather alerts, the first-hours storm damage checklist, real damage identification photos, and how insurance claims work — from South Mississippi's storm roofers.",
  path: "/storm-center",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Storm Center", path: "/storm-center" },
];

const CHECKLIST = [
  {
    icon: ShieldAlert,
    title: "1. People first",
    text: "Stay away from downed lines, sagging ceilings, and standing water near electrical. No photo or tarp is worth anyone's safety.",
  },
  {
    icon: Camera,
    title: "2. Document everything",
    text: "From the ground, photograph every side of the house, visible roof damage, and any interior water — dated photos are the backbone of your claim.",
  },
  {
    icon: Umbrella,
    title: "3. Stop the bleeding",
    text: "If water is coming in, professional tarping prevents compounding damage — and insurers expect reasonable mitigation. Keep the invoice for the claim.",
  },
  {
    icon: PhoneCall,
    title: "4. Call someone accountable",
    text: "After big storms, out-of-town crews knock fast and leave faster. Check the license (ours: MSBOC #R22245), the local address, and never sign on the doorstep.",
  },
];

// One real photo per damage category (owner-corrected labels 2026-07-05)
const damageCards = Object.entries(STORM_CATEGORY_LABELS).map(
  ([category, label]) => ({
    category,
    label,
    photo: stormPhotos.find((photo) => photo.category === category)!,
  }),
);

const RESOURCES = [
  {
    label: "National Hurricane Center",
    detail: "Track active tropical systems in the Gulf",
    href: "https://www.nhc.noaa.gov",
  },
  {
    label: "NWS Jackson (Pine Belt forecasts)",
    detail: "Watches and warnings for the Hattiesburg area",
    href: "https://www.weather.gov/jan/",
  },
  {
    label: "NWS New Orleans/Slidell (Coast forecasts)",
    detail: "Covers Hancock, Harrison, and Pearl River counties",
    href: "https://www.weather.gov/lix/",
  },
  {
    label: "MEMA — Mississippi Emergency Management",
    detail: "State emergency declarations and recovery resources",
    href: "https://www.msema.org",
  },
  {
    label: "Ready.gov hurricane guide",
    detail: "Federal preparedness checklists for your whole home",
    href: "https://www.ready.gov/hurricanes",
  },
];

export default function StormCenterPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      {/* Hero */}
      <section className="bg-navy-950 text-white">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} onDark />
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-steel-300">
              <CloudLightning className="size-4" aria-hidden="true" />
              Storm Center
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold text-white sm:text-5xl">
              When the weather turns, start here
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-steel-100">
              Live Mississippi alerts, what to do in the first hours after
              damage, what storm damage actually looks like, and how the
              insurance process works — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {siteConfig.phone.tel && (
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-steel-100"
                  render={<a href={`tel:${siteConfig.phone.tel}`} />}
                  nativeButton={false}
                >
                  <PhoneCall aria-hidden="true" />
                  Storm line: {siteConfig.phone.display}
                </Button>
              )}
              <Button
                size="xl"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/10"
                render={<Link href="/free-inspection" />}
                nativeButton={false}
              >
                Request a storm inspection
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Live alerts */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Live from the National Weather Service"
          title="Active Mississippi weather alerts"
          description="Pulled directly from the National Weather Service and refreshed throughout the day. Alerts covering the counties we serve are flagged."
        />
        <div className="mt-10 max-w-3xl">
          <StormAlerts />
        </div>
      </Section>

      {/* First-hours checklist */}
      <Section>
        <SectionHeading
          eyebrow="Just took damage?"
          title="The first hours, in order"
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2">
          {CHECKLIST.map((step) => (
            <StaggerItem
              key={step.title}
              className="shadow-premium h-full rounded-2xl border border-border bg-white p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900">
                <step.icon className="size-6 text-white" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
                {step.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-slate-600">
                {step.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal className="mt-8">
          <p className="text-slate-600">
            Want the full walkthrough?{" "}
            <Link
              href="/learn/storm-prep/hurricane-season-roof-checklist"
              className="font-semibold text-navy-900 underline-offset-4 hover:underline"
            >
              Read the hurricane-season roof checklist
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      {/* Damage identification — real photos */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Know what you're looking at"
          title="What storm damage actually looks like"
          description="Every photo below is real damage we documented on South Mississippi roofs — not stock imagery. If your roof looks like any of these, it's worth a free, documented inspection."
        />
        <StaggerGroup className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {damageCards.map((card) => (
            <StaggerItem as="div" key={card.category} className="relative">
              <Image
                src={card.photo.src}
                alt={card.photo.alt}
                width={600}
                height={450}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
              />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs">
                {card.label}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal className="mt-10">
          <Button
            size="xl"
            variant="outline"
            render={<Link href="/projects" />}
            nativeButton={false}
          >
            See more in the project gallery
            <ArrowRight aria-hidden="true" />
          </Button>
        </Reveal>
      </Section>

      {/* Claims path */}
      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-steel-300 uppercase">
              The insurance path
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Documented damage → assisted claim → rebuilt roof
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-100">
              About half our work is insurance restoration. We document like
              the file will be argued over, meet your adjuster on the roof,
              and assist through the entire claims process — start to finish,
              with no outcome promises and no deductible games.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-steel-100"
                render={<Link href="/storm-damage/insurance-claims" />}
                nativeButton={false}
              >
                <ClipboardCheck aria-hidden="true" />
                How our claims assistance works
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/10"
                render={
                  <Link href="/learn/insurance-claims/how-roof-insurance-claims-work-mississippi" />
                }
                nativeButton={false}
              >
                Read the claims guide
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Official resources */}
      <Section>
        <SectionHeading
          eyebrow="Official resources"
          title="The links worth bookmarking before you need them"
        />
        <StaggerGroup as="ul" className="mt-10 grid gap-4 md:grid-cols-2">
          {RESOURCES.map((resource) => (
            <StaggerItem as="li" key={resource.href}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md"
              >
                <span>
                  <span className="block font-semibold text-navy-900">
                    {resource.label}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {resource.detail}
                  </span>
                </span>
                <ExternalLink
                  className="mt-1 size-4 shrink-0 text-steel-500 transition-colors group-hover:text-navy-900"
                  aria-hidden="true"
                />
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal className="mt-8">
          <p className="text-sm leading-relaxed text-slate-500">
            And one number that isn&apos;t a website:{" "}
            <PhoneLink className="font-semibold text-navy-900" /> — when a
            storm has just moved through, our crews and claims assistance are
            already rolling.
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
