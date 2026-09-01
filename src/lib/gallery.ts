import {
  projectPhotos,
  stormPhotos,
  STORM_CATEGORY_LABELS,
  type ProjectPhoto,
  type StormPhoto,
} from "@/content/photos";
import { urlFor } from "@/sanity/lib/image";
import type { LiveProject } from "@/sanity/lib/queries";

/**
 * Unified gallery model. Both the existing static photos (content/photos.ts)
 * and new Sanity job uploads are normalized into GalleryJobs so the projects
 * gallery, and, later, the job map, share one shape. Every photo shows in the
 * grid (gallery looks full); clicking one opens its job's card with sibling
 * photos. The same GalleryJob is what a map pin will open.
 */

export type GalleryCategory = "completed" | "storm";
export type MaterialClass = "shingle" | "metal" | "gutters" | "other";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  phase?: string;
}

export interface GalleryJob {
  id: string;
  category: GalleryCategory;
  title: string;
  city?: string;
  citySlug?: string;
  /** "GAF Timberline HDZ", "Seamless 6\" Gutters"…, the product filter chip. */
  product?: string;
  color?: string;
  material: MaterialClass;
  /** Storm damage label for the storm filter. */
  stormType?: string;
  photos: GalleryPhoto[];
  /** /projects/[slug] for Sanity jobs (static jobs have no dedicated page). */
  href?: string;
  source: "static" | "sanity";
}

/** Colors are hidden (behind a toggle) for these materials, owner rule. */
export function hidesColor(job: GalleryJob): boolean {
  return job.material === "metal" || job.material === "gutters";
}

/** Group same-roof static photos: filename base minus the trailing -### index. */
function baseKey(src: string): string {
  const file = src.split("/").pop() ?? src;
  return file.replace(/\.[a-z0-9]+$/i, "").replace(/-\d+$/, "");
}

function groupBy<T>(items: T[], key: (t: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}

function staticCompletedJobs(): GalleryJob[] {
  const completed = projectPhotos.filter((p) => p.kind === "completed");
  const jobs: GalleryJob[] = [];

  for (const [key, photos] of groupBy(completed, (p) => baseKey(p.src))) {
    const f = photos[0] as ProjectPhoto;
    const isMetal = f.material === "metal";
    jobs.push({
      id: `static-${key}`,
      category: "completed",
      title: isMetal
        ? `${f.product ?? "Metal roof"}${f.color ? ` in ${f.color}` : ""}: ${f.city}, MS`
        : `${f.manufacturer ?? ""} ${f.line ?? ""} in ${f.color ?? ""}: ${f.city}, MS`.trim(),
      city: f.city,
      citySlug: f.citySlug,
      // Metal jobs now carry their real product/profile (e.g. "29ga Gibraltar
      // Rib") so they share ONE product chip with new metal uploads instead of
      // a separate generic "Metal Roof" pill.
      product: isMetal
        ? (f.product ?? "Metal Roof")
        : f.manufacturer && f.line
          ? `${f.manufacturer} ${f.line}`
          : undefined,
      // Metal colors (e.g. Galvalume) live behind the "+ Metal & gutter colors"
      // toggle via hidesColor(), but are recorded so the color is correct there.
      color: f.color,
      material: isMetal ? "metal" : "shingle",
      photos: photos.map((p, i) => ({
        id: `${key}-${i}`,
        src: p.src,
        alt: p.alt,
      })),
      source: "static",
    });
  }

  // In-progress shots, kept in Completed (proof of work); no product/color
  // so they don't clutter those filters, still filterable by city.
  projectPhotos
    .filter((p) => p.kind === "in-progress")
    .forEach((p, i) => {
      jobs.push({
        id: `static-progress-${i}`,
        category: "completed",
        title: `${p.stage ?? "Roof work"}: ${p.city}, MS`,
        city: p.city,
        citySlug: p.citySlug,
        material: "other",
        photos: [{ id: `progress-${i}`, src: p.src, alt: p.alt }],
        source: "static",
      });
    });

  return jobs;
}

function staticStormJobs(): GalleryJob[] {
  const jobs: GalleryJob[] = [];
  for (const [key, photos] of groupBy(stormPhotos, (p) => baseKey(p.src))) {
    const f = photos[0] as StormPhoto;
    const label = STORM_CATEGORY_LABELS[f.category];
    jobs.push({
      id: `static-storm-${key}`,
      category: "storm",
      title: `${label}: ${f.city}, MS`,
      city: f.city,
      citySlug: f.citySlug,
      stormType: label,
      material: "other",
      photos: photos.map((p, i) => ({
        id: `${key}-${i}`,
        src: p.src,
        alt: p.alt,
      })),
      source: "static",
    });
  }
  return jobs;
}

export function staticGalleryJobs(): GalleryJob[] {
  return [...staticCompletedJobs(), ...staticStormJobs()];
}

/** Index of static photo src → its job, so any page can make a photo clickable
 *  (opens the job card) and show its city tag. Built once, memoized. */
let staticIndex: Map<string, GalleryJob> | null = null;
export function staticJobForSrc(src: string): GalleryJob | undefined {
  if (!staticIndex) {
    staticIndex = new Map();
    for (const job of staticGalleryJobs()) {
      for (const photo of job.photos) staticIndex.set(photo.src, job);
    }
  }
  return staticIndex.get(src);
}

const MATERIAL_BY_JOBTYPE: Record<string, MaterialClass> = {
  shingle: "shingle",
  metal: "metal",
  gutters: "gutters",
  "leaf-guard": "gutters",
  siding: "other",
  tpo: "other",
  "rolled-roofing": "other",
  epdm: "other",
  pvc: "other",
  // A coating is a restoration of whatever is already up there, so it has no
  // material class of its own. The substrate detail is what says what it went
  // over, and that is a filter chip in its own right.
  "roof-coating": "other",
};

function detailValue(p: LiveProject, key: string): string | undefined {
  return p.details?.find((d) => d.key === key)?.value || undefined;
}

/** Normalize a Sanity job into the shared GalleryJob shape. */
export function sanityGalleryJob(p: LiveProject): GalleryJob {
  const isStorm = p.jobType === "storm-damage";
  const product =
    detailValue(p, "product") ??
    detailValue(p, "productType") ??
    detailValue(p, "coatingType") ??
    undefined;
  const color = detailValue(p, "color");
  const material = (p.jobType && MATERIAL_BY_JOBTYPE[p.jobType]) || "other";

  const photos: GalleryPhoto[] = (p.media ?? [])
    .filter((m) => m.ref)
    .map((m, i) => ({
      id: `${p._id}-${i}`,
      src: urlFor({ _type: "image", asset: { _ref: m.ref! } })
        .width(1000)
        .url(),
      alt: m.alt ?? p.title,
      phase: m.phase,
    }));

  return {
    id: `sanity-${p._id}`,
    category: isStorm ? "storm" : "completed",
    title: p.title,
    city: p.city,
    product: isStorm ? undefined : product,
    color: isStorm ? undefined : color,
    material,
    stormType: isStorm ? "Storm damage" : undefined,
    photos,
    href: p.slug ? `/projects/${p.slug}` : undefined,
    source: "sanity",
  };
}

/** Full unified job list: Sanity uploads first (newest), then static proof. */
export function buildGalleryJobs(sanity: LiveProject[]): GalleryJob[] {
  return [...sanity.map(sanityGalleryJob), ...staticGalleryJobs()].filter(
    (j) => j.photos.length > 0,
  );
}
