import type { Metadata } from "next";

import { FLASHING_TYPES, ROOF_PARTS } from "@/config/roof-anatomy";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import type { JsonLdObject } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { CTASection } from "@/components/tools/cta-section";
import { RoofDiagram } from "@/components/roof/roof-diagram";
import { FlashingDiagram } from "@/components/roof/flashing-diagram";

/**
 * Anatomy of a Roof (tool #4), interactive exploded diagram. Educational,
 * AI-discoverable: emits a BreadcrumbList + an ItemList/DefinedTerm glossary of
 * every roof component so assistants can quote the parts and definitions.
 */

export const metadata: Metadata = buildMetadata({
  title: "Anatomy of a Roof: Parts Explained | Southeast Roofing",
  description:
    "An interactive roof diagram: click each part: decking, underlayment, ice & water shield, flashing, ridge vent, to see what it does and why it matters.",
  path: "/anatomy-of-a-roof",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Anatomy of a Roof", path: "/anatomy-of-a-roof" },
];

/**
 * Glossary of every labelled component, flashing pieces included, so
 * assistants can quote the parts and their definitions. Mirrors exactly what
 * the page renders, nothing here that a reader can't also see.
 */
const glossarySchema: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Parts of a roof system",
  itemListElement: [
    ...ROOF_PARTS.map((part) => ({ name: part.name, description: part.what })),
    ...FLASHING_TYPES.map((f) => ({ name: f.name, description: f.what })),
  ].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "DefinedTerm",
      name: item.name,
      description: item.description,
    },
  })),
};

export default function AnatomyOfARoofPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), glossarySchema]} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            What actually goes into a roof
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            A roof is a system, not just shingles. Tap any layer to see what it
            is, why it matters, and the shortcuts bad roofers take. This is
            exactly what we install, and inspect, on every Southeast Roofing
            job.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <RoofDiagram />
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <h2 className="max-w-2xl font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Flashing: the part that decides whether a roof leaks
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Flashing is one pin on the diagram above and nine separate pieces on
            a real roof. More leaks start here than anywhere else: not in the
            middle of the shingles, but at the edges, walls, chimneys, and
            penetrations where materials meet. These are the names you&apos;ll
            see on a proposal or an adjuster&apos;s report, and what each one
            actually does.
          </p>
          <div className="mt-8">
            <FlashingDiagram />
          </div>
        </div>
      </section>

      <CTASection
        source="roof-diagram"
        heading="Want a roof built the right way?"
        subtext="We'll walk your roof, show you what's really going on, and explain every layer in plain English, free."
      />
    </>
  );
}
