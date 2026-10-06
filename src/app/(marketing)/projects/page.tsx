import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, MapPin } from "lucide-react";

import { projectPhotos, stormPhotos } from "@/content/photos";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { UnifiedGallery } from "@/components/projects/unified-gallery";
import { getLiveProjects } from "@/sanity/lib/queries";
import { buildGalleryJobs } from "@/lib/gallery";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Project gallery (PRD §13 Phase 6, the proof layer). One unified gallery for
 * both the static proof photos and new /upload jobs. Integrity rule: every
 * photo is a real Southeast Roofing job site, never stock.
 */

const completedCount = projectPhotos.filter(
  (p) => p.kind === "completed",
).length;
const cityCount = new Set(
  projectPhotos.filter((p) => p.kind === "completed").map((p) => p.citySlug),
).size;
const allCityCount = new Set(
  [...projectPhotos, ...stormPhotos].map((p) => p.citySlug),
).size;

export const metadata: Metadata = buildMetadata({
  title: "Roofing Projects in South Mississippi | Southeast Roofing",
  description: `Browse ${completedCount}+ completed Southeast Roofing roofs across ${cityCount} South Mississippi communities: filter by city, product line, and color, plus real storm-damage documentation. No stock photos.`,
  path: "/projects",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];

const proofChips = [
  // Rounded DOWN to the nearest ten so the badge reads as a clean claim
  // ("100+") instead of an oddly precise one, and stays true as photos grow.
  {
    icon: Camera,
    label: `${Math.floor((projectPhotos.length + stormPhotos.length) / 10) * 10}+ real job-site photos`,
  },
  { icon: MapPin, label: `${allCityCount} Mississippi communities` },
  { icon: BadgeCheck, label: "Zero stock photos in this gallery" },
];

export default async function ProjectsPage() {
  const liveProjects = await getLiveProjects();
  const jobs = buildGalleryJobs(liveProjects);

  // Grouped for the crawlable list below. Towns in alphabetical order, jobs
  // within a town in the order the feed returns them (newest first).
  const projectsByCity = Object.entries(
    liveProjects
      .filter((p) => p.slug && p.title)
      .reduce<Record<string, typeof liveProjects>>((acc, p) => {
        const city = p.city?.trim() || "Other";
        (acc[city] ??= []).push(p);
        return acc;
      }, {}),
  ).sort(([a], [b]) => a.localeCompare(b));

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
              in South Mississippi, completed roofs our crews installed and
              storm damage we documented during inspections. Filter by city,
              product, or damage type, and tap any photo to open the full job.
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

      {/* Unified gallery */}
      <section className="container-site py-12 sm:py-16">
        <UnifiedGallery jobs={jobs} />

        {/*
          EVERY JOB, AS A PLAIN SERVER-RENDERED LINK.

          The gallery above is a client component: its tiles and filter chips
          are built in the browser, so none of its links exist in the HTML a
          crawler reads. A live crawl on 2026-10-06 found all thirteen project
          pages with zero internal links pointing at them from anywhere on the
          site. They were in the sitemap and returning 200, and they were the
          hardest pages here to actually reach.

          This list is the fix, and it is deliberately plain markup with real
          hrefs rather than anything clever. It is also genuinely useful: it is
          the only place the whole body of work can be read at a glance,
          grouped by town.
        */}
        {projectsByCity.length > 0 && (
          <nav
            aria-label="All completed projects"
            className="mt-12 border-t border-border pt-10"
          >
            <h2 className="font-display text-xl font-bold text-navy-900">
              Every project, by city
            </h2>
            <div className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {projectsByCity.map(([city, items]) => (
                <div key={city}>
                  <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                    {city}
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {items.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-sm leading-snug text-navy-900 underline-offset-4 hover:text-steel-500 hover:underline"
                        >
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        )}

        <div className="mt-12 rounded-2xl border border-border bg-secondary p-6 sm:p-8">
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
            show completed local projects for many communities we serve, or ask
            for references from your neighborhood during your{" "}
            <Link
              href="/free-inspection"
              className="inline-flex items-center gap-1 font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500"
            >
              free inspection
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            .
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
