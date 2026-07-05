import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  HardHat,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { projectPhotos } from "@/content/photos";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/home/final-cta";

/**
 * About page (PRD §13 Phase 6). Integrity rule: only owner-confirmed facts —
 * no founding year, team bios, or job counts until supplied (siteConfig
 * [NEEDS] items). The story leans on what is verifiable: credentials,
 * real projects, and how we actually work.
 */

export const metadata: Metadata = buildMetadata({
  title: "About Southeast Roofing | Hattiesburg, MS Roofing Contractor",
  description:
    "Southeast Roofing is a Hattiesburg-based, Mississippi-licensed roofing contractor serving South Mississippi — every roof system, residential and commercial, insurance and retail, done right.",
  path: "/about",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const commitments = [
  {
    icon: FileText,
    title: "Itemized, honest proposals",
    text: "Every proposal lists each line of work with its own price — tear-off, materials, accessories, disposal. No hidden fees, no surprises, and upgrades are always your call, never pre-checked.",
  },
  {
    icon: HardHat,
    title: "Craftsmanship across every system",
    text: "Architectural shingle, standing-seam metal, TPO, EPDM, coatings — we install and stand behind all of them. We recommend the right system for your building, not the one we happen to sell.",
  },
  {
    icon: MessageSquare,
    title: "Communication start to finish",
    text: "You'll know when we're coming, what happens next, and who to call — from the first inspection through the final walkthrough. On insurance work, we assist through the entire claims process.",
  },
  {
    icon: Sparkles,
    title: "Clean sites, respected property",
    text: "Magnetic nail sweeps, protected landscaping, and full debris haul-off are part of the job, not an add-on. We leave your property the way we found it — minus the old roof.",
  },
];

const credentials = [
  {
    title: "Mississippi licensed",
    detail: `MS State Board of Contractors — License #${siteConfig.license}`,
    href: null,
  },
  {
    title: "GAF Certified Contractor",
    detail: "Our primary manufacturer certification — verify it on gaf.com",
    href: siteConfig.links.gafProfile,
  },
  {
    title: "BBB Accredited — A rating",
    detail: "Check our record with the Better Business Bureau",
    href: siteConfig.links.bbbProfile,
  },
  {
    title: "Google Guaranteed",
    detail: "5-star rated — read every review on our live profile",
    href: siteConfig.links.googleBusiness,
  },
  {
    title: "Fully insured & bonded",
    detail: "Certificates of insurance available on request",
    href: null,
  },
  {
    title: "$0 down financing",
    detail: "Flexible payment options through GoodLeap",
    href: siteConfig.links.financing,
  },
];

const heroPhoto = projectPhotos.find(
  (photo) => photo.kind === "completed" && photo.citySlug === "hattiesburg",
);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              A Hattiesburg roofing company built on doing it right
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Southeast Roofing is a locally owned, Mississippi-licensed
              contractor based on Highway 98 in Hattiesburg. We install and
              repair every major roof system — residential and commercial,
              insurance and retail — across South Mississippi.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="xl"
                render={<Link href="/free-inspection" />}
                nativeButton={false}
              >
                Schedule Free Inspection
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                render={<Link href="/projects" />}
                nativeButton={false}
              >
                See our work
              </Button>
            </div>
          </Reveal>

          {heroPhoto && (
            <Reveal delay={0.1} className="relative">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                width={1000}
                height={750}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="shadow-premium aspect-[4/3] w-full rounded-3xl border border-border object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-navy-950/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
                A real Southeast Roofing project in Hattiesburg
              </span>
            </Reveal>
          )}
        </div>
      </section>

      {/* Story */}
      <Section>
        <SectionHeading eyebrow="Who we are" title="Roofing done right — literally" />
        <Reveal className="mt-6 max-w-3xl space-y-5">
          <p className="text-lg leading-relaxed text-slate-600">
            South Mississippi is hard on roofs. Gulf humidity, brutal summer
            heat, and a hurricane season that runs half the year mean a roof
            here doesn&apos;t just need to look good on day one — it has to be
            built for the next storm. That reality shapes everything about how
            we work: the systems we install, the way we flash and ventilate,
            and the way we document our jobs.
          </p>
          <p className="text-lg leading-relaxed text-slate-600">
            We&apos;re deliberately not a one-trick shop. About half our work
            is storm and insurance restoration, and half is retail — families
            and building owners who simply want the best roof for their money.
            We install architectural shingle, standing-seam and panel metal,
            TPO, EPDM, and coating systems, which means our recommendation
            starts with your building and your budget, not with the one
            product we know how to sell.
          </p>
          <p className="text-lg leading-relaxed text-slate-600">
            And because trust is earned with proof, not promises, we keep the
            receipts:{" "}
            <Link
              href="/projects"
              className="font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500"
            >
              a gallery of real completed roofs
            </Link>{" "}
            across the region, itemized proposals with every line priced, and
            credentials you can verify at the source.
          </p>
        </Reveal>
      </Section>

      {/* Commitments */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="How we work"
          title="Four commitments on every job"
          description="No invented awards, no inflated numbers — just the standards we hold ourselves to on every roof we touch."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2">
          {commitments.map((item) => (
            <StaggerItem
              key={item.title}
              className="shadow-premium h-full rounded-2xl border border-border bg-white p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900">
                <item.icon className="size-6 text-white" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
                {item.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-slate-600">
                {item.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Credentials */}
      <Section tone="navy">
        <SectionHeading
          eyebrow="Credentials"
          title="Verify everything we claim"
          description="Every credential below is real, current, and checkable — most link straight to the official record."
          onDark
        />
        <StaggerGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-white">
                    {credential.title}
                  </h3>
                  {credential.href && (
                    <ExternalLink
                      className="mt-1 size-4 shrink-0 text-steel-300 transition-colors group-hover:text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">
                  {credential.detail}
                </p>
              </>
            );
            const cardClass =
              "group block h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-200";
            return (
              <StaggerItem as="li" key={credential.title} className="h-full">
                {credential.href ? (
                  <a
                    href={credential.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClass} hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      {/* Where we work */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-steel-500 uppercase">
              Where we work
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              Based in Hattiesburg, serving South Mississippi
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Our office is at {siteConfig.address.streetAddress},{" "}
              {siteConfig.address.addressLocality},{" "}
              {siteConfig.address.addressRegion} {siteConfig.address.postalCode}
              . From there our crews cover roughly a two-hour radius — the Pine
              Belt, the Gulf Coast, and the metros at the edges.
            </p>
            <div className="mt-8">
              <Button
                size="xl"
                variant="outline"
                render={<Link href="/service-areas" />}
                nativeButton={false}
              >
                <MapPin aria-hidden="true" />
                Explore our service area
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
