import { freshClient } from "./client";

/** Cache tag for every project read, so an /upload can purge them all at once
 *  via revalidateTag("projects"), more reliable than revalidatePath for a
 *  Sanity fetch cache. */
const PROJECTS_TAG = "projects";

/** Published projects (drafts excluded) for the live gallery section. */
const LIVE_PROJECTS_QUERY = `*[_type == "project" && !(_id in path("drafts.**"))]
  | order(_createdAt desc)[0...200]{
    _id,
    title,
    "slug": slug.current,
    city,
    channel,
    jobType,
    summary,
    tags,
    "details": details[]{ key, label, value },
    "media": media[]{ phase, alt, title, "ref": image.asset._ref }
  }`;

export interface LiveProjectMedia {
  phase?: string;
  alt?: string;
  title?: string;
  ref?: string;
}

export interface LiveProject {
  _id: string;
  title: string;
  slug?: string;
  city?: string;
  channel?: string;
  jobType?: string;
  summary?: string;
  tags?: string[];
  details?: { key?: string; label?: string; value?: string }[];
  media?: LiveProjectMedia[];
}

/** Fetch the live gallery feed. Fresh (non-CDN) reads + a "projects" cache tag
 *  so a new upload appears immediately once the page cache is revalidated. */
export async function getLiveProjects(): Promise<LiveProject[]> {
  try {
    return await freshClient.fetch(
      LIVE_PROJECTS_QUERY,
      {},
      { next: { revalidate: 600, tags: [PROJECTS_TAG] } },
    );
  } catch {
    // If Sanity is unreachable, the live section simply doesn't render, 
    // the existing static gallery below is unaffected.
    return [];
  }
}

/* ---- Single project (its own indexable page at /projects/[slug]) ---- */

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  _id, title, city, channel, jobType, summary, description, tags,
  "details": details[]{ key, label, value },
  "media": media[]{ phase, alt, title, metaDescription, "ref": image.asset._ref }
}`;

export interface ProjectDetailMedia extends LiveProjectMedia {
  metaDescription?: string;
}

export interface ProjectDetail {
  _id: string;
  title: string;
  city?: string;
  channel?: string;
  jobType?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  details?: { key?: string; label?: string; value?: string }[];
  media?: ProjectDetailMedia[];
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  try {
    return await freshClient.fetch(
      PROJECT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 600, tags: [PROJECTS_TAG] } },
    );
  } catch {
    return null;
  }
}

/** All published project slugs, for generateStaticParams. */
export async function getProjectSlugs(): Promise<string[]> {
  try {
    return await freshClient.fetch(
      `*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current`,
      {},
      { next: { revalidate: 600, tags: [PROJECTS_TAG] } },
    );
  } catch {
    return [];
  }
}

/**
 * Slug + last-edit timestamp for every published project, for the sitemap's
 * <lastmod>. Separate from getProjectSlugs because generateStaticParams wants
 * bare slugs and shouldn't pay for a field it ignores.
 */
export async function getProjectSitemapEntries(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  try {
    return await freshClient.fetch(
      `*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`,
      {},
      { next: { revalidate: 600, tags: [PROJECTS_TAG] } },
    );
  } catch {
    return [];
  }
}
