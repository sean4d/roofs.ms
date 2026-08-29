import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ComponentsFlatlay } from "@/components/shared/components-flatlay";
import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqsFor } from "@/config/faqs";
import { IMAGES } from "@/config/images";
import { HOLIDAY, INCLUDED, PACKAGES } from "@/config/pricing";
import { servicesByDivision } from "@/config/services";
import {
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";
import { cn, formatUsd } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Professional Christmas Light Installation | South Mississippi",
  description:
    "All-inclusive Christmas light installation across South Mississippi. Design, commercial-grade lighting, installation, maintenance, takedown and storage for one seasonal price.",
  path: "/holiday-lighting",
});

export default function HolidayLightingPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Holiday Lighting", path: "/holiday-lighting" },
  ];
  const services = servicesByDivision("holiday");
  const faqs = faqsFor(["pricing", "service", "roof", "scheduling"]).slice(
    0,
    10,
  );

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Christmas Light Installation",
            description:
              "All-inclusive Christmas light installation, maintenance, takedown and storage across South Mississippi.",
            path: "/holiday-lighting",
          }),
          breadcrumbSchema(trail),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow="Holiday Lighting"
        title="Christmas lighting, handled from start to finish."
        intro="Commercial-grade lighting custom cut to your property, installed by roof-trained crews, maintained all season, then removed and stored until next year."
        image={IMAGES.projectHattiesburgCanopy}
        quoteLocation="holiday_hub"
        secondary={{ label: "Build your display", href: "/estimator" }}
      />
      <Breadcrumbs trail={trail} />

      <Section
        tone="raised"
        eyebrow="One price. The entire season."
        title="What is included."
        intro={`Roofline lighting is ${formatUsd(HOLIDAY.roofPerFt)} per linear foot with a ${formatUsd(HOLIDAY.minimum)} minimum. Everything below is part of that, not sold back to you later.`}
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
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-bone-500">
          Seasonal lighting remains our property. That is exactly why the
          maintenance, the takedown and the storage are included: they are our
          lights, so they are our responsibility. We do not install
          customer-supplied Christmas lights.
        </p>
      </Section>

      <ComponentsFlatlay tone="ink" />

      <Section
        eyebrow="Packages"
        title="Three starting points. Every project still custom."
        intro="These exist to show what different budgets actually buy. Most of our residential work lands in the middle."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.key}
              className={cn(
                "card-lit flex flex-col p-7",
                "featured" in pkg && pkg.featured
                  ? "border-champagne-400/40 bg-champagne-400/[0.05]"
                  : "",
              )}
            >
              {"featured" in pkg && pkg.featured ? (
                <span className="eyebrow mb-3 text-champagne-400">
                  Most chosen
                </span>
              ) : null}
              <h3 className="font-display text-2xl font-semibold">
                {pkg.name}
              </h3>
              <p className="mt-2 font-display text-lg text-champagne-300">
                From {formatUsd(pkg.from)}
              </p>
              <p className="text-bone-400 mt-3 text-sm leading-relaxed">
                {pkg.positioning}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
                {pkg.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-bone-300"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-champagne-400"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-bone-500">
          Want something entirely your own?{" "}
          <Link
            href="/estimator"
            className="text-champagne-300 hover:text-champagne-200"
          >
            Build it in the estimator
          </Link>
          .
        </p>
      </Section>

      <Section
        tone="raised"
        eyebrow="Who we light"
        title="Homes, communities and commercial property."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="card-lit group relative isolate flex min-h-[16rem] flex-col justify-end overflow-hidden p-6"
            >
              <Image
                src={service.image.src}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={service.image.blurDataURL}
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="scrim-soft absolute inset-0 -z-10" />
              <h3 className="text-lg font-semibold">{service.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-300">
                {service.summary}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-champagne-300">
                Learn more
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Questions" title="What people ask us">
        <FaqList items={faqs} />
      </Section>

      <CtaBand
        title="Get on this season's schedule."
        body="Install weeks go in the order they are booked. The earlier you are on the calendar, the more say you have in your date."
        location="holiday_hub_cta"
      />
    </>
  );
}
