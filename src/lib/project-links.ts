import { slugify } from "@/lib/job-content";
import { hasCityPage } from "@/config/service-area-pages";
import type { LiveProject } from "@/sanity/lib/queries";

/**
 * The links between a real completed job, the town it is in, and the service
 * that describes the work.
 *
 * WHY THIS EXISTS. A crawl of the live site on 2026-10-06 found all thirteen
 * project pages orphaned: in the sitemap, returning 200, and with ZERO
 * internal links pointing at them from anywhere. The gallery on /projects is a
 * client component, so its tiles and filter chips are built in the browser and
 * simply are not in the HTML a crawler reads.
 *
 * Those pages are the only ones on the site carrying photographs of real
 * finished roofs in named Mississippi towns. They are the best evidence the
 * business has and they were the hardest pages on the site to reach.
 *
 * EVERYTHING HERE COMES FROM A REAL JOB. There is no template that invents a
 * project for a town, no placeholder for a city with no work in it, and no
 * made-up product, colour or scope. A town with no completed job gets no
 * section, which is the honest outcome and also the useful one: a "recent
 * work" block listing nothing is worse than its absence.
 */

/**
 * Which job types illustrate which service page.
 *
 * Only services we have genuinely done work of. A service with no entry shows
 * no projects block at all, which is the honest result for a page like soffit
 * or fascia where no job has been uploaded under that type.
 */
export const SERVICE_JOB_TYPES: Record<string, string[]> = {
  "asphalt-shingle-roofing": ["shingle"],
  "roof-replacement": ["shingle", "metal"],
  "metal-roofing": ["metal"],
  gutters: ["gutters"],
  "leaf-guard": ["leaf-guard"],
  "roof-coatings": ["roof-coating"],
  "silicone-roof-coating": ["roof-coating"],
  tpo: ["tpo"],
  epdm: ["epdm"],
  pvc: ["pvc"],
};

export interface ProjectServiceLink {
  href: string;
  label: string;
}

/**
 * The service page that describes what was actually done on a job.
 *
 * Keyed on the jobType the upload form records, split by channel where the
 * residential and commercial pages genuinely differ. Returns null rather than
 * guessing: a job type with no obvious service page gets no link instead of a
 * link to something approximate.
 */
export function serviceForJob(
  jobType: string | undefined,
  channel: string | undefined,
): ProjectServiceLink | null {
  const commercial = channel === "commercial";
  switch (jobType) {
    case "shingle":
      return commercial
        ? { href: "/commercial/roof-replacement", label: "Commercial roof replacement" }
        : { href: "/residential/asphalt-shingle-roofing", label: "Asphalt shingle roofing" };
    case "metal":
      return commercial
        ? { href: "/commercial/metal-roofing", label: "Commercial metal roofing" }
        : { href: "/residential/metal-roofing", label: "Residential metal roofing" };
    case "gutters":
      return { href: "/residential/gutters", label: "Seamless gutters" };
    case "leaf-guard":
      return { href: "/residential/leaf-guard", label: "Leaf guard" };
    case "storm-damage":
      return { href: "/storm-damage", label: "Storm damage roofing" };
    case "roof-coating":
      return { href: "/commercial/roof-coatings", label: "Commercial roof coatings" };
    case "tpo":
      return { href: "/commercial/tpo", label: "TPO roofing" };
    case "epdm":
      return { href: "/commercial/epdm", label: "EPDM roofing" };
    case "pvc":
      return { href: "/commercial/pvc", label: "PVC roofing" };
    case "rolled-roofing":
      return { href: "/commercial/modified-bitumen", label: "Modified bitumen" };
    default:
      return null;
  }
}

/** The /service-areas page for a job's town, when that town has one. */
export function cityLinkForProject(
  city: string | undefined,
): { href: string; label: string } | null {
  if (!city) return null;
  const slug = slugify(city);
  if (!hasCityPage(slug)) return null;
  return { href: `/service-areas/${slug}`, label: city };
}

/** One detail value off a job, by the key the upload form records. */
export function jobDetail(
  project: Pick<LiveProject, "details">,
  key: string,
): string | undefined {
  return project.details?.find((d) => d.key === key)?.value?.trim() || undefined;
}

/**
 * The jobs actually completed in one town.
 *
 * Matched on the slugified city so "Ocean Springs" and "ocean-springs" agree,
 * which is the same comparison the project page uses to decide whether to link
 * a city at all.
 */
export function projectsInCity(
  projects: LiveProject[],
  citySlug: string,
): LiveProject[] {
  return projects.filter(
    (p) => p.slug && p.city && slugify(p.city) === citySlug,
  );
}

/**
 * The jobs that illustrate one service page.
 *
 * Deliberately NOT "the newest three jobs" on every page: the brief asks for
 * contextual links, and a gutter page showing shingle roofs is the mechanical
 * linking it warns against. A service page with no matching job shows nothing.
 */
export function projectsForService(
  projects: LiveProject[],
  jobTypes: string[],
  channel?: "residential" | "commercial",
  limit = 3,
): LiveProject[] {
  return projects
    .filter((p) => p.slug && p.jobType && jobTypes.includes(p.jobType))
    .filter((p) => !channel || p.channel === channel)
    .slice(0, limit);
}

/**
 * A one-line description of a job, built only from what it records.
 *
 * Used as link text and as the line under a card. Parts that are missing are
 * left out rather than filled in, so a job with no colour recorded reads as a
 * shorter sentence and never as an invented one.
 */
export function jobSummaryLine(project: LiveProject): string {
  const product = jobDetail(project, "product");
  const colour = jobDetail(project, "color");
  const parts = [product, colour && `in ${colour}`].filter(Boolean);
  return parts.length ? parts.join(" ") : (project.title ?? "");
}
