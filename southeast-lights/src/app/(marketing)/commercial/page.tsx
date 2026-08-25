import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileCheck2, HardHat, Ruler, ShieldCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqsFor } from "@/config/faqs";
import { IMAGES } from "@/config/images";
import { COMMERCIAL_BUDGETS } from "@/config/pricing";
import { COVERAGE } from "@/config/service-areas";
import { verticalsByPriority } from "@/config/verticals";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Commercial & HOA Lighting in Mississippi | Southeast Lights",
  description:
    "Commercial, HOA and institutional lighting across Mississippi. Insured crews, lift equipment, written scopes, design concepts and board-ready proposals for projects of any scale.",
  path: "/commercial",
});

const CAPABILITIES = [
  {
    icon: Ruler,
    title: "Design concepts before you commit",
    body: "Send photographs or a site plan and we will show you the finished display before anything is ordered. For boards and committees, that is the difference between a decision and a debate.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance documentation on request",
    body: "Certificates of insurance naming the ownership entity, W-9 and references, provided before we mobilise rather than chased afterwards.",
  },
  {
    icon: HardHat,
    title: "Proper lift equipment",
    body: "Boom lifts, bucket trucks and articulating lifts for parapets, steeples, monuments and mature trees. Height is planned during the survey, not improvised on install day.",
  },
  {
    icon: FileCheck2,
    title: "Written scope, fixed seasonal price",
    body: "One document that states exactly what is included and what it costs for the season, so nothing changes in November.",
  },
];

export default function CommercialPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Commercial", path: "/commercial" },
  ];
  const verticals = verticalsByPriority();
  const faqs = faqsFor(["commercial", "coverage"]).slice(0, 7);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(trail), faqSchema(faqs)]} />
      <PageHero
        eyebrow="Commercial & Institutional"
        title="Lighting for properties where it has to be right."
        intro="HOAs, communities, churches, municipalities, hotels, clubs, retail centers and corporate properties across Mississippi and the Gulf Coast."
        image={IMAGES.retailCenter}
        quoteLocation="commercial_hub"
        secondary={{ label: "Request a proposal", href: "/commercial/request-proposal" }}
      />
      <Breadcrumbs trail={trail} />

      <Section
        eyebrow="How we work"
        title="What a commercial engagement actually looks like."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-lit flex gap-4 p-7">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-champagne-400/25 bg-champagne-400/[0.08] text-champagne-400">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-bone-400">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        tone="raised"
        eyebrow="Properties we light"
        title="Pick the one that describes yours."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((vertical) => (
            <Link
              key={vertical.slug}
              href={`/commercial/${vertical.slug}`}
              className="card-lit group relative isolate flex min-h-[16rem] flex-col justify-end overflow-hidden p-6"
            >
              <Image
                src={vertical.image.src}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={vertical.image.blurDataURL}
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="scrim-soft absolute inset-0 -z-10" />
              <h3 className="text-lg font-semibold">{vertical.label}</h3>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-champagne-300">
                See details
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Scale & coverage" title="How big, and how far.">
        <div className="grid max-w-4xl gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-champagne-300">
              Project size
            </h3>
            <div className="rule-lit my-3" />
            <ul className="flex flex-wrap gap-2">
              {COMMERCIAL_BUDGETS.filter((b) => b !== "Not sure yet").map((band) => (
                <li
                  key={band}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-bone-300"
                >
                  {band}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-champagne-300">Coverage</h3>
            <div className="rule-lit my-3" />
            <p className="text-sm leading-relaxed text-bone-500">
              {COVERAGE.commercial}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-bone-500">
              {COVERAGE.large}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="raised" eyebrow="Questions" title="What organisations ask us">
        <FaqList items={faqs} />
      </Section>

      <CtaBand
        title="Request a commercial design and proposal."
        body="Property details, photos, site plans, whatever you have. We will come back with a scope, a concept and a fixed price."
        location="commercial_hub_cta"
        quoteLabel="Request a Commercial Proposal"
        quoteHref="/commercial/request-proposal"
      />
    </>
  );
}
