import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import {
  articlePath,
  articlesByCategory,
  learnArticles,
  learnCategories,
} from "@/content/learn";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Learning Center hub (PRD §13 Phase 7): guides grouped by category.
 * Categories without published articles yet are listed as "coming soon"
 * — visible roadmap, no thin pages.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roofing Learning Center | Southeast Roofing",
  description:
    "Plain-English roofing guides from a Mississippi contractor: shingles and materials, insurance claims, storm prep, metal roofing, maintenance, and honest cost guides.",
  path: "/learn",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Learning Center", path: "/learn" },
];

export default function LearnHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Understand your roof before you spend a dollar on it
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Plain-English guides written by the people who actually build
              roofs here — including interactive tools from GAF, our shingle
              manufacturer. No jargon, no scare tactics, no teaser pricing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      {learnCategories.map((category, index) => {
        const articles = articlesByCategory(category.slug);
        if (articles.length === 0) return null;
        return (
          <Section
            key={category.slug}
            tone={index % 2 === 0 ? "white" : "surface"}
          >
            <SectionHeading
              eyebrow={category.label}
              title={category.description}
            />
            <StaggerGroup
              as="ul"
              className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {articles.map((article) => (
                <StaggerItem as="li" key={article.slug} className="h-full">
                  <Link
                    href={articlePath(article)}
                    className="group shadow-premium flex h-full flex-col rounded-2xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl"
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock
                        className="size-3.5 text-steel-500"
                        aria-hidden="true"
                      />
                      {article.readMinutes} min read
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-navy-900">
                      {article.title}
                    </h3>
                    <p className="mt-2.5 flex-1 leading-relaxed text-slate-600">
                      {article.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                      Read the guide
                      <ArrowRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Section>
        );
      })}

      {/* Growing library note */}
      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {learnArticles.length} guides and growing
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-100">
              New guides publish regularly. Have a roofing question you
              can&apos;t find answered here? Ask us directly — the questions
              homeowners actually ask are where our next guides come from.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-steel-100"
              >
                Ask us a question
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
