import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck, Star } from "lucide-react";

import { siteConfig } from "@/config/site";
import { projectPhotos } from "@/content/photos";
import { googleReviews } from "@/content/reviews";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ReviewsTrust } from "@/components/home/reviews-trust";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Reviews page (PRD §2, §13 Phase 6). Real reviews only: quotes are
 * transcribed verbatim from the owner's Google profile (permission
 * granted 2026-07-05, see content/reviews.ts) and every claim links to
 * a record we cannot edit (Google, BBB, GAF). No AggregateRating
 * schema — self-collected review markup is against Google guidelines.
 */

export const metadata: Metadata = buildMetadata({
  title: "Reviews | Southeast Roofing | Verify Us Yourself",
  description:
    "Real 5-star Google reviews from Southeast Roofing customers, quoted verbatim and verifiable at the source — plus our GAF certification and BBB A rating.",
  path: "/reviews",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Reviews", path: "/reviews" },
];

// A quick cross-section of real completed work — one photo per city
const recentWork = Object.values(
  Object.fromEntries(
    projectPhotos
      .filter((photo) => photo.kind === "completed")
      .map((photo) => [photo.citySlug, photo]),
  ),
).slice(0, 4);

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <Star
                  className="size-3.5 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {siteConfig.trustFacts.googleRating}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <ShieldCheck
                  className="size-3.5 text-steel-500"
                  aria-hidden="true"
                />
                {siteConfig.trustFacts.googleGuaranteed}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <ShieldCheck
                  className="size-3.5 text-steel-500"
                  aria-hidden="true"
                />
                {siteConfig.trustFacts.bbbRating}
              </span>
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Our reputation lives where we can&apos;t edit it
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Every quote below is copied word-for-word from our live Google
              profile — where reviews are written by real customers and we
              can&apos;t touch a word of them. Don&apos;t take our page&apos;s
              word for it either: the source is one tap away.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="xl"
                render={
                  <a
                    href={siteConfig.links.googleBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                Read our Google reviews
                <ExternalLink className="size-4" aria-hidden="true" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                render={
                  <a
                    href={siteConfig.links.googleReview}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                <Star
                  className="size-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                Leave a Google Review
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Verification badges (shared with homepage) */}
      <ReviewsTrust />

      {/* Real Google reviews — republished verbatim with owner permission */}
      <Section>
        <SectionHeading
          eyebrow="In their words"
          title="What customers wrote on Google"
          description="Quoted word-for-word from our public Google reviews — typos and all, because editing reviews is where trust dies. Every one is verifiable on our live profile."
        />
        <StaggerGroup className="mt-12 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {googleReviews.map((review) => (
            <StaggerItem
              key={review.name + review.when}
              className="shadow-premium rounded-2xl border border-border bg-white p-6"
            >
              <div
                className="flex gap-0.5"
                role="img"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-3 leading-relaxed text-slate-600">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <p className="font-semibold text-navy-900">{review.name}</p>
                <p className="text-xs text-slate-400">{review.when}</p>
              </div>
              {review.services && (
                <p className="mt-1.5 text-xs text-slate-500">
                  {review.services}
                </p>
              )}
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal className="mt-12 flex flex-col items-center gap-5">
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold text-navy-900">
              Had a great experience with our crew?
            </h3>
            <p className="mt-2 text-slate-600">
              A quick Google review helps neighbors find a roofer they can
              trust.
            </p>
          </div>
          <Button
            size="xl"
            render={
              <a
                href={siteConfig.links.googleReview}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
          >
            <Star
              className="size-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            Leave a Google Review
          </Button>
          <a
            href={siteConfig.links.googleBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            Verify every word on our Google profile
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </Section>

      {/* Our review policy */}
      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-steel-300 uppercase">
              Our policy
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Quoted exactly, verifiable always
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-100">
              Every quote above appears word-for-word as the customer wrote it
              on Google, where reviews are tied to real accounts and we
              can&apos;t edit, reword, or bury a single one. Read them at the
              source, good and bad — that&apos;s the standard we think you
              should hold every roofer to.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* The work behind the reviews */}
      <Section>
        <SectionHeading
          eyebrow="The work behind the words"
          title="Real roofs. Real Southeast Roofing projects."
          description="Reviews tell you how the job went. The gallery shows you what we left behind — every photo from a genuine Southeast Roofing job site."
        />
        <StaggerGroup className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {recentWork.map((photo) => (
            <StaggerItem as="div" key={photo.src} className="relative">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={600}
                height={450}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
              />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs">
                {photo.city}, MS
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
            Browse the full project gallery
            <ArrowRight aria-hidden="true" />
          </Button>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
