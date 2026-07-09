import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  articlePath,
  articlesByCategory,
  learnArticles,
  learnCategories,
} from "@/content/learn";
import type { LearnCategorySlug } from "@/content/learn/types";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { staticJobForSrc } from "@/lib/gallery";
import { breadcrumbSchema } from "@/lib/schema";
import type { JsonLdObject } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { LearningHub } from "@/components/learn/learning-hub";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Interactive Learning Center hub (PRD §13 Phase 7, upgraded). Real articles
 * become a filterable, searchable, visual card grid. Category thumbnails use
 * real Southeast Roofing photos. Emits an ItemList of the articles so AI
 * assistants can enumerate the guides.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roofing Guides & Learning Center | Southeast Roofing",
  description:
    "Plain-English roofing guides from a Mississippi contractor: shingles and materials, insurance claims, storm prep, metal roofing, maintenance, and honest cost guides. Filter and search by topic.",
  path: "/learn",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Learning Center", path: "/learn" },
];

/** Category → representative real photo (thumbnail). Commercial has no photo
 *  yet, so its cards fall back to a branded gradient. */
const CATEGORY_THUMB: Partial<Record<LearnCategorySlug, string>> = {
  materials: "/images/projects/gaf-timberline-hdz-pewter-gray-hattiesburg-ms-001.webp",
  "insurance-claims": "/images/storm/hail-damage-roof-hattiesburg-ms.webp",
  "storm-prep": "/images/storm/wind-damage-missing-shingles-hattiesburg-ms.webp",
  "metal-roofing": "/images/projects/29-gauge-galvalume-metal-roof-mccomb-ms-001.webp",
  maintenance: "/images/projects/roof-synthetic-underlayment-lucedale-ms.webp",
  hiring: "/images/projects/gaf-timberline-hdz-slate-hattiesburg-ms-001.webp",
  "cost-guides": "/images/projects/owens-corning-duration-driftwood-waynesboro-ms-001.webp",
};

const categoryLabel = (slug: LearnCategorySlug) =>
  learnCategories.find((c) => c.slug === slug)?.label ?? slug;

const hubArticles = learnArticles.map((a) => {
  const thumb = CATEGORY_THUMB[a.category];
  return {
    slug: a.slug,
    category: a.category,
    categoryLabel: categoryLabel(a.category),
    title: a.title,
    excerpt: a.excerpt,
    readMinutes: a.readMinutes,
    path: articlePath(a),
    thumb,
    // Real job photo → tag it with its city/town (owner rule: every job photo
    // on the site shows where it was taken).
    thumbCity: thumb ? staticJobForSrc(thumb)?.city : undefined,
  };
});

const hubCategories = learnCategories
  .filter((c) => articlesByCategory(c.slug).length > 0)
  .map((c) => ({ slug: c.slug, label: c.label }));

const itemListSchema: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Southeast Roofing Learning Center guides",
  itemListElement: hubArticles.map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: absoluteUrl(a.path),
    name: a.title,
  })),
};

export default function LearnHubPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), itemListSchema]} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Understand your roof before you spend a dollar on it
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Plain-English guides written by the people who actually build roofs here —
              including interactive tools from GAF, our shingle manufacturer. Filter by
              topic or search for exactly what you need.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <LearningHub articles={hubArticles} categories={hubCategories} />
      </section>

      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {learnArticles.length} guides and growing
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-100">
              New guides publish regularly. Have a roofing question you can&apos;t find
              answered here? Ask us directly — the questions homeowners actually ask are
              where our next guides come from.
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
