import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, MapPin } from "lucide-react";

import { projectPhotos, stormPhotos } from "@/content/photos";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Project gallery (PRD §13 Phase 6 — the proof layer). Integrity rule:
 * every photo on this page comes from the owner-supplied manifests in
 * content/photos.ts — real Southeast Roofing job sites only, never stock.
 */

const completedCount = projectPhotos.filter(
  (photo) => photo.kind === "completed",
).length;
const cityCount = new Set(
  projectPhotos
    .filter((photo) => photo.kind === "completed")
    .map((photo) => photo.citySlug),
).size;

export const metadata: Metadata = buildMetadata({
  title: "Project Gallery | Real Roofs by Southeast Roofing",
  description: `Browse ${completedCount} completed Southeast Roofing roofs across ${cityCount} South Mississippi communities — filter by shingle line and color — plus real storm-damage documentation. No stock photos.`,
  path: "/projects",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];

const proofChips = [
  {
    icon: Camera,
    label: `${projectPhotos.length + stormPhotos.length} real job-site photos`,
  },
  { icon: MapPin, label: `${cityCount} Mississippi communities` },
  { icon: BadgeCheck, label: "Zero stock photos in this gallery" },
];

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Our work, unfiltered
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Every photo below was taken on a real Southeast Roofing job site
              in South Mississippi — completed roofs our crews installed and
              storm damage we documented during inspections. Filter by
              community or damage type, tap any photo to view it full-screen.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {proofChips.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-900"
                >
                  <chip.icon
                    className="size-4 text-steel-500"
                    aria-hidden="true"
                  />
                  {chip.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <Section>
        <ProjectGallery />
        <Reveal className="mt-12 rounded-2xl border border-border bg-secondary p-6 sm:p-8">
          <p className="text-base leading-relaxed text-slate-600">
            <span className="font-semibold text-navy-900">
              Want to see roofs near you?
            </span>{" "}
            Our{" "}
            <Link
              href="/service-areas"
              className="font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500"
            >
              city pages
            </Link>{" "}
            show completed local projects for many of the communities we
            serve — or ask us for references from your neighborhood during
            your{" "}
            <Link
              href="/free-inspection"
              className="inline-flex items-center gap-1 font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500"
            >
              free inspection
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <FinalCta />
    </>
  );
}
