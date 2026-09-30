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
    "Plain-English roofing guides from a Mississippi contractor: materials, insurance claims, storm prep, metal roofing, maintenance, and honest cost guides.",
  path: "/learn",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Learning Center", path: "/learn" },
];

/**
 * Per-article card image. One distinct photo per guide, chosen to fit the
 * subject, with its own alt text.
 *
 * AUDITED IN FULL 2026-09-30, on the owner finding a residential tear-off
 * photo on the commercial flat-roof guide. Four faults were in here, and they
 * were different faults:
 *
 *   WRONG SUBJECT. "TPO, EPDM, or a coating?" carried a shot of bare
 *   residential decking. Nothing in the photo appeared anywhere in the
 *   article. The commercial replacement guide had the same problem with a
 *   second decking shot.
 *
 *   SILENT DUPLICATES. Two articles, anatomy-of-a-roof and the commercial
 *   licence guide, had no entry at all and fell through to the category
 *   fallback, which handed each of them a photo another card was already
 *   using. A missing key looked exactly like a present one on the page.
 *
 *   NEAR-DUPLICATES. Three articles ran three different tear-off decking
 *   photos. Individually defensible, as a grid they read as one photo shown
 *   three times.
 *
 *   PRESENT BUT INERT. Several were simply a nice finished roof next to a
 *   headline about something else, which is the kind of miss nobody reports
 *   and everybody feels.
 *
 * TWO SOURCES, AND THE DIFFERENCE MATTERS. /images/projects and /images/storm
 * are real Southeast Roofing job photos, so those cards carry the city tag
 * that every job photo on this site carries. /images/services and
 * /images/anatomy are the illustrative library (see service-images.ts: the
 * service assets are AI-generated, owner's Higgsfield account). Those cards
 * get no city tag, which is correct and automatic: staticJobForSrc returns
 * nothing for them, so the badge never appears and nothing illustrative is
 * ever captioned as our work.
 *
 * THE RULE THAT HOLDS THIS TOGETHER: no two entries share a src, and every
 * article has an entry. Both are asserted by npm run check:learn-images,
 * because the category fallback silently re-introduced duplicates twice.
 */
interface ArticleThumb {
  src: string;
  /** Describes the photo, not the article. Read out on its own. */
  alt: string;
}

const ARTICLE_THUMB: Record<string, ArticleThumb> = {
  "architectural-vs-3-tab-shingles": {
    src: "/images/projects/gaf-timberline-hdz-pewter-gray-hattiesburg-ms-001.webp",
    alt: "Pewter gray GAF Timberline HDZ architectural shingles on a Hattiesburg home, showing the thick layered tabs",
  },
  "parts-of-a-roof-explained": {
    src: "/images/projects/roof-felt-ice-water-shield-waynesboro-ms.webp",
    alt: "Ice and water shield and felt underlayment laid over roof decking before shingles go down",
  },
  // WAS MISSING, so it inherited the materials fallback and duplicated the
  // shingle card above. An interactive guide to the parts of a roof should
  // open on a part of a roof.
  "anatomy-of-a-roof": {
    src: "/images/anatomy/roof-closed-valley.webp",
    alt: "A closed valley where two roof planes meet, with shingles woven across the joint",
  },
  "how-roof-insurance-claims-work-mississippi": {
    src: "/images/storm/hail-damage-roof-hattiesburg-ms.webp",
    alt: "Hail bruising across an asphalt shingle roof in Hattiesburg, the damage an adjuster comes to look at",
  },
  "hurricane-season-roof-checklist": {
    src: "/images/storm/wind-damage-missing-shingles-hattiesburg-ms.webp",
    alt: "Shingles torn away by hurricane winds, leaving bare underlayment exposed on a Hattiesburg roof",
  },
  "standing-seam-vs-exposed-fastener": {
    src: "/images/projects/29-gauge-galvalume-metal-roof-mccomb-ms-001.webp",
    alt: "A 29 gauge Galvalume metal roof in McComb, Mississippi, with the panel seams running to the eave",
  },
  // WAS: synthetic underlayment mid-installation. The article is a homeowner
  // walking round their own house twice a year with their feet on the ground,
  // so the photo is one of the faults that walk is looking for. The dry-rotted
  // pipe boot was the better subject and is a portrait shot: in a 16:9 card it
  // loses two thirds of its height and crops to nothing. Nail pops say the
  // same thing in landscape.
  "ten-minute-roof-check": {
    src: "/images/storm/nail-pop-damage-shingles-magee-ms.webp",
    alt: "Nail heads backing out through shingles on a Magee roof, raising small bumps a homeowner can spot from the ground",
  },
  // WAS: bare residential decking on a tear-off, on a guide about commercial
  // single-ply membrane. This is the one the owner caught.
  "tpo-epdm-coatings-flat-roof-guide": {
    src: "/images/services/tpo-membrane.webp",
    alt: "A white TPO single-ply membrane roof on a commercial building, seams heat-welded flat",
  },
  "roof-replacement-cost-south-mississippi": {
    src: "/images/projects/owens-corning-duration-driftwood-waynesboro-ms-001.webp",
    alt: "A completed Owens Corning Duration shingle roof in Driftwood on a Waynesboro home",
  },
  "metal-vs-asphalt-shingle-roofing": {
    src: "/images/projects/gaf-timberline-hdz-weathered-wood-poplarville-ms-001.webp",
    alt: "Weathered Wood architectural shingles on a Poplarville home, the shingle half of the metal-versus-shingle choice",
  },
  "roof-repair-vs-replacement": {
    src: "/images/projects/roof-shingle-install-hattiesburg-ms.webp",
    alt: "A roofer nailing down a course of architectural shingles partway through a Hattiesburg replacement",
  },
  "how-to-choose-a-roofing-contractor": {
    src: "/images/projects/gaf-timberline-hdz-slate-hattiesburg-ms-001.webp",
    alt: "A finished Slate GAF Timberline HDZ roof in Hattiesburg with clean, straight courses and tidy detailing",
  },
  // WAS: a generic finished roof. The article's argument is that the Gulf
  // climate is what shortens a roof's life, and heat blistering is that
  // argument in a photograph.
  "how-long-does-a-roof-last": {
    src: "/images/storm/heat-blister-damage-shingles-sumrall-ms.webp",
    alt: "Heat blistering across shingles on a Sumrall roof, the Gulf climate ageing a roof ahead of its rated life",
  },
  "signs-you-need-a-new-roof": {
    src: "/images/storm/granular-loss-shingles-hattiesburg-ms.webp",
    alt: "Shingles that have shed their granules down to the black mat, one of the clearest signs a roof is finished",
  },
  "roof-financing-options-mississippi": {
    src: "/images/projects/residential-roof-replacement-ocean-springs-ms-001.webp",
    alt: "A completed residential roof replacement on an Ocean Springs home",
  },
  "what-to-do-after-storm-damage": {
    src: "/images/storm/wind-damage-exposed-decking-collins-ms.webp",
    alt: "Storm winds have stripped shingles and underlayment down to bare decking on a Collins home",
  },
  // WAS: a third residential tear-off decking photo, on a guide written for
  // building owners and property managers.
  "commercial-roof-replacement-guide": {
    src: "/images/services/commercial-roof-replacement.webp",
    alt: "A roofer torch-applying modified bitumen membrane during a commercial roof replacement",
  },
  "metal-roof-cost-mississippi": {
    src: "/images/projects/29-gauge-galvalume-metal-roof-mccomb-ms-002.webp",
    alt: "A Galvalume metal roof in McComb seen along the ridge, the panels running full length to the eave",
  },
  // No photograph of a tree on a roof exists in the library, so this is the
  // nearest honest subject: severe structural storm damage of the kind a
  // falling limb causes. The Columbia photo that was here says the same thing
  // but is portrait, and a 16:9 card cropped away most of it.
  "tree-fell-on-roof-who-pays": {
    src: "/images/storm/wind-damage-shingles-diamondhead-ms.webp",
    alt: "Severe storm damage tearing across a Diamondhead roof, the kind of structural hit a falling limb leaves",
  },
  // WAS: the third tear-off decking shot. A permits article about Hattiesburg
  // work is better served by finished Hattiesburg work.
  "roof-replacement-permits-hattiesburg": {
    src: "/images/projects/gaf-timberline-natural-shadow-slate-hattiesburg-ms-001.webp",
    alt: "A permitted, completed GAF Timberline Natural Shadow roof on a Hattiesburg home",
  },
  "best-roof-colors-mississippi-heat": {
    src: "/images/projects/gaf-timberline-hdz-charcoal-ellisville-ms-001.webp",
    alt: "A Charcoal shingle roof on an Ellisville home, the dark end of the colour question in Mississippi heat",
  },
  // WAS MISSING, so it inherited the hiring fallback and duplicated the
  // contractor card. The article is specifically about the COMMERCIAL
  // register, so the photo is a commercial building.
  "verify-mississippi-commercial-roofing-license": {
    src: "/images/services/commercial-metal-building.webp",
    alt: "A commercial metal building of the kind that needs a contractor on Mississippi's commercial register",
  },
};

/**
 * Last-resort fallback for a future article added without an entry above.
 *
 * DELIBERATELY NOT A PER-CATEGORY MAP ANY MORE. The old one handed a new
 * article a photo that an existing card was already using, so the duplicate
 * arrived silently and looked intentional. A single neutral image is honest
 * about being a placeholder, and check:learn-images fails the build's own test
 * run the moment an article has to use it.
 */
const FALLBACK_THUMB: ArticleThumb = {
  src: "/images/stock/home-asphalt-shingle-roof-golden-hour.jpg",
  alt: "An asphalt shingle roof on a family home at golden hour",
};

const categoryLabel = (slug: LearnCategorySlug) =>
  learnCategories.find((c) => c.slug === slug)?.label ?? slug;

const hubArticles = learnArticles.map((a) => {
  const thumb = ARTICLE_THUMB[a.slug] ?? FALLBACK_THUMB;
  return {
    slug: a.slug,
    category: a.category,
    categoryLabel: categoryLabel(a.category),
    title: a.title,
    excerpt: a.excerpt,
    readMinutes: a.readMinutes,
    path: articlePath(a),
    thumb: thumb.src,
    thumbAlt: thumb.alt,
    // A real job photo gets tagged with its city; an illustrative one returns
    // nothing here and shows no badge, which is the rule working rather than
    // an omission.
    thumbCity: staticJobForSrc(thumb.src)?.city,
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
              Plain-English guides written by the people who actually build
              roofs here, including interactive tools from GAF, our shingle
              manufacturer. Filter by topic or search for exactly what you need.
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
              New guides publish regularly. Have a roofing question you
              can&apos;t find answered here? Ask us directly: the questions
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
