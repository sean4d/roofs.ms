import { client } from "./client";

/** Published projects (drafts excluded) for the live gallery section. */
const LIVE_PROJECTS_QUERY = `*[_type == "project" && !(_id in path("drafts.**"))]
  | order(completedAt desc, _createdAt desc)[0...60]{
    _id,
    title,
    city,
    channel,
    summary,
    tags,
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
  city?: string;
  channel?: string;
  summary?: string;
  tags?: string[];
  media?: LiveProjectMedia[];
}

/** Fetch the live gallery feed. Revalidates hourly; ISR picks up new jobs. */
export async function getLiveProjects(): Promise<LiveProject[]> {
  try {
    return await client.fetch(
      LIVE_PROJECTS_QUERY,
      {},
      { next: { revalidate: 3600 } },
    );
  } catch {
    // If Sanity is unreachable, the live section simply doesn't render —
    // the existing static gallery below is unaffected.
    return [];
  }
}
