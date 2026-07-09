import type { Metadata } from "next";

import { getLiveProjects } from "@/sanity/lib/queries";
import { buildGalleryJobs } from "@/lib/gallery";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ProjectMap } from "@/components/projects/project-map";
import { CTASection } from "@/components/tools/cta-section";

/**
 * Interactive Mississippi Project Map (tool #2). Local proof that Southeast
 * Roofing works across the region — pins projected from real city coordinates,
 * opening the same job cards as the gallery. Uses the unified GalleryJob list.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roofing Project Map in South Mississippi | Southeast Roofing",
  description:
    "See where Southeast Roofing has completed roofs across South Mississippi. Tap a pin on the map to view real jobs by city, product, and color — from Hattiesburg to the Gulf Coast.",
  path: "/project-map",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Project Map", path: "/project-map" },
];

export default async function ProjectMapPage() {
  const liveProjects = await getLiveProjects();
  const jobs = buildGalleryJobs(liveProjects);

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Roofs all over South Mississippi
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Every pin is a real Southeast Roofing job. Explore the map by city and
            product, then tap any roof to see the photos up close — proof we&apos;re
            working right in your community.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <ProjectMap jobs={jobs} />
      </section>

      <CTASection
        source="project-map"
        heading="Want your neighborhood on this map?"
        subtext="Book a free inspection and join the South Mississippi homeowners we've already taken care of."
      />
    </>
  );
}
