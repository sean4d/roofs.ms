import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqsFor, type FaqCategory } from "@/config/faqs";
import { HOLIDAY, INCLUDED, PERMANENT } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { SERVICES, enabledServices, serviceBySlug, serviceCardImage } from "@/config/services";
import { SERVICE_AREAS } from "@/config/service-areas";
import {
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";
import { formatUsd } from "@/lib/utils";

export function generateStaticParams() {
  return enabledServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = serviceBySlug((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.title}`,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    image: service.image.src,
  });
}

/** Which FAQ groups are genuinely relevant to each division. */
const FAQ_CATEGORIES: Record<string, FaqCategory[]> = {
  holiday: ["pricing", "service", "roof", "scheduling"],
  permanent: ["permanent"],
  landscape: ["service", "coverage", "pricing"],
  event: ["coverage", "service", "scheduling"],
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = serviceBySlug((await params).slug);
  if (!service) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.label, path: `/services/${service.slug}` },
  ];

  const faqs = faqsFor(FAQ_CATEGORIES[service.division] ?? ["service"]).slice(
    0,
    8,
  );
  const related = SERVICES.filter(
    (s) =>
      s.enabled && s.division === service.division && s.slug !== service.slug,
  ).slice(0, 3);

  const isHoliday = service.division === "holiday";
  const isPermanent = service.division === "permanent";

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: service.title,
            description: service.metaDescription,
            path: `/services/${service.slug}`,
          }),
          breadcrumbSchema(trail),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow={service.label}
        title={service.title}
        intro={service.summary}
        image={service.image}
        quoteLocation={`service_${service.slug}`}
        // The estimator prices holiday C9 by the foot. Sending an event or
        // landscape visitor there offers them a number that does not apply to
        // what they came to read about, so those pages point at the work.
        secondary={
          isHoliday || isPermanent
            ? { label: "See pricing", href: "/estimator" }
            : { label: "See our work", href: "/projects" }
        }
      />
      <Breadcrumbs trail={trail} />

      {isHoliday ? (
        <Section
          tone="raised"
          eyebrow="One price. The entire season."
          title="Everything below is included."
          intro={`Roofline lighting is ${formatUsd(HOLIDAY.roofPerFt)} per linear foot with a ${formatUsd(HOLIDAY.minimum)} minimum. Nothing here is sold back to you later.`}
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="card-lit flex items-start gap-3 px-5 py-4"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-champagne-400"
                  strokeWidth={2.5}
                />
                <span className="text-bone-200 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {isPermanent ? (
        <Section
          tone="raised"
          eyebrow="Pricing"
          title="What permanent lighting costs."
          intro={`${formatUsd(PERMANENT.perFt.low)} to ${formatUsd(PERMANENT.perFt.high)} per linear foot installed, plus the controller. Owned outright, not rented.`}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[100, 150, 200, 250].map((ft) => (
              <div key={ft} className="card-lit flex flex-col gap-2 p-6">
                <span className="text-sm text-bone-500">{ft} linear feet</span>
                <span className="font-display text-xl font-semibold text-champagne-300 tabular-nums">
                  {formatUsd(
                    PERMANENT.perFt.low * ft + PERMANENT.controller.low,
                  )}
                  {" - "}
                  {formatUsd(
                    PERMANENT.perFt.high * ft + PERMANENT.controller.high,
                  )}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-bone-500">
            Ranges include the controller. Difficult rooflines, two-story
            sections, steep access and peak-season installs move toward the
            upper end. We are not an authorized dealer for any permanent
            lighting manufacturer; we install and warrant the work itself, and
            will walk you through system options during design.
          </p>
        </Section>
      ) : null}

      {/*
        The warranty. Two genuinely different promises rather than one policy
        worded twice: seasonal work has nothing left on the building to
        warrant, permanent work has the customer's own hardware on it for
        years. With no manufacturer warranty behind the permanent product,
        this term is the entire guarantee, so it gets a band rather than a
        line of small print.
      */}
      {isPermanent || isHoliday ? (
        <Section
          eyebrow="Warranty"
          title={
            isPermanent
              ? siteConfig.warranty.permanent.headline
              : siteConfig.warranty.seasonal.headline
          }
        >
          <p className="max-w-2xl text-lg leading-relaxed text-bone-300">
            {isPermanent
              ? siteConfig.warranty.permanent.body
              : siteConfig.warranty.seasonal.body}
          </p>
          {isPermanent ? (
            <p className="text-bone-400 mt-5 max-w-2xl leading-relaxed">
              We are not an authorized dealer for any permanent lighting
              manufacturer, so there is no factory warranty sitting behind ours.
              That is the reason the term is{" "}
              {siteConfig.warranty.permanent.years} years and not a footnote:
              our workmanship is what you are relying on.
            </p>
          ) : null}
        </Section>
      ) : null}

      <Section
        eyebrow="Where we do this"
        title="Serving South Mississippi and the Gulf Coast."
      >
        <ul className="flex flex-wrap gap-2">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/service-areas/${area.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-bone-300 transition-colors hover:border-champagne-400/40 hover:text-champagne-300"
              >
                {service.label} in {area.city}
                <ArrowUpRight className="size-3 opacity-50" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {faqs.length > 0 ? (
        <Section tone="raised" eyebrow="Questions" title="What people ask us">
          <FaqList items={faqs} />
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section eyebrow="Related" title="Often booked together">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="card-lit group relative isolate flex min-h-[15rem] flex-col justify-end overflow-hidden p-6"
              >
                <Image
                  src={serviceCardImage(item).src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={serviceCardImage(item).blurDataURL}
                  className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="scrim-soft absolute inset-0 -z-10" />
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm text-bone-300">{item.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title={`Get a price for ${service.label.toLowerCase()}.`}
        body="Tell us the property and what you are picturing. You get a layout and a fixed price, not an hourly guess."
        location={`service_${service.slug}_cta`}
      />
    </>
  );
}
