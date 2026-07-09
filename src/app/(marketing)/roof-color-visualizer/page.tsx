import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { CTASection } from "@/components/tools/cta-section";
import { getLiveProjects } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

import { ColorVisualizer, type VisualizerRealPhoto } from "./visualizer";

/**
 * Roof Color Visualizer (tool #3). Data-driven swatches (config/roof-colors.ts)
 * that show a real Southeast Roofing photo when we have one for that product +
 * color. Educates and routes to a free inspection / local projects.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roof Color Visualizer in Mississippi | Southeast Roofing",
  description:
    "Preview shingle and metal roof colors — GAF Timberline HDZ, Owens Corning Duration, and more — and see real Southeast Roofing roofs in those colors across South Mississippi.",
  path: "/roof-color-visualizer",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Roof Color Visualizer", path: "/roof-color-visualizer" },
];

const MATERIAL_BY_JOBTYPE: Record<string, VisualizerRealPhoto["material"]> = {
  shingle: "shingle",
  metal: "metal",
};

/**
 * Real color photos from live form/Sanity uploads — so a newly-installed roof
 * (e.g. a burgundy metal roof shot on the job) auto-replaces the manufacturer
 * sample in the visualizer with zero code changes.
 */
async function sanityColorPhotos(): Promise<VisualizerRealPhoto[]> {
  const live = await getLiveProjects();
  return live.flatMap((p) => {
    const color = p.details?.find((d) => d.key === "color")?.value;
    const productName =
      p.details?.find((d) => d.key === "product")?.value ??
      p.details?.find((d) => d.key === "productType")?.value;
    const first = p.media?.find((m) => m.ref);
    if (!color || !first?.ref || !p.jobType) return [];
    const material = MATERIAL_BY_JOBTYPE[p.jobType];
    if (!material) return [];
    return [
      {
        material,
        product: productName ?? undefined,
        color,
        src: urlFor({ _type: "image", asset: { _ref: first.ref } }).width(1000).url(),
        alt: first.alt ?? p.title,
        city: p.city,
      },
    ];
  });
}

export default async function RoofColorVisualizerPage() {
  const sanityPhotos = await sanityColorPhotos();
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Roof Color Visualizer
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Explore shingle and metal roof colors, and — where we&apos;ve installed it —
            see the real roof on a South Mississippi home. Find a color you love, then
            book a free inspection to see a physical sample.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <ColorVisualizer sanityPhotos={sanityPhotos} />
      </section>

      <CTASection
        source="color-visualizer"
        heading="Found your color?"
        subtext="Book a free inspection and we'll bring physical samples and show you real roofs nearby."
      />
    </>
  );
}
