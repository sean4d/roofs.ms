/**
 * Social fan-out ("syndication"). After a job is saved to the website gallery,
 * this pushes the same photos + generated caption to each connected platform.
 *
 * The website is the hub — photos live in Sanity first, which gives us the
 * PUBLIC image URLs that Facebook and Instagram require. Each platform is
 * gated by its own env credentials; with none set it's a safe no-op and the
 * website upload still fully succeeds.
 */

import { postViaMetricool } from "@/lib/metricool";

const GRAPH = "https://graph.facebook.com/v21.0";

export type Platform =
  | "google-business"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "nextdoor";

export interface SyndicationInput {
  caption: string;
  /** Public JPEG URLs (from the Sanity CDN). */
  imageUrls: string[];
  title: string;
  projectUrl: string;
}

export interface SyndicationResult {
  platform: Platform;
  status: "posted" | "skipped" | "error";
  url?: string;
  note?: string;
  postedAt?: string;
}

function form(fields: Record<string, string>): URLSearchParams {
  return new URLSearchParams(fields);
}

async function graph(
  path: string,
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`${GRAPH}/${path}`, { method: "POST", body: form(params) });
  const data = (await res.json()) as Record<string, unknown>;
  if (data.error) {
    const e = data.error as { message?: string };
    throw new Error(e.message ?? "Graph API error");
  }
  return data;
}

/** Page access token derived from the never-expiring system-user token. */
async function getPageToken(): Promise<string> {
  const sys = process.env.META_PAGE_ACCESS_TOKEN!;
  const pageId = process.env.META_PAGE_ID!;
  const res = await fetch(
    `${GRAPH}/${pageId}?fields=access_token&access_token=${encodeURIComponent(sys)}`,
  );
  const data = (await res.json()) as { access_token?: string; error?: { message: string } };
  if (!data.access_token) {
    throw new Error(data.error?.message ?? "Could not resolve page token");
  }
  return data.access_token;
}

/** Facebook Page: upload photos unpublished, then one feed post with the caption. */
async function postToFacebook(
  input: SyndicationInput,
  pageToken: string,
): Promise<SyndicationResult> {
  const pageId = process.env.META_PAGE_ID!;
  const now = new Date().toISOString();
  if (input.imageUrls.length === 0) {
    return { platform: "facebook", status: "skipped", note: "No photos" };
  }

  const mediaIds: string[] = [];
  for (const url of input.imageUrls) {
    const d = await graph(`${pageId}/photos`, {
      url,
      published: "false",
      access_token: pageToken,
    });
    mediaIds.push(String(d.id));
  }

  const params: Record<string, string> = { message: input.caption, access_token: pageToken };
  mediaIds.forEach((id, i) => {
    params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id });
  });
  const post = await graph(`${pageId}/feed`, params);
  const postId = String(post.id);
  return {
    platform: "facebook",
    status: "posted",
    url: `https://facebook.com/${postId}`,
    postedAt: now,
  };
}

/** Instagram: single image or carousel container, then publish. */
async function postToInstagram(
  input: SyndicationInput,
  token: string,
): Promise<SyndicationResult> {
  const ig = process.env.META_IG_USER_ID!;
  const now = new Date().toISOString();
  const urls = input.imageUrls.slice(0, 10); // IG carousel max 10
  if (urls.length === 0) {
    return { platform: "instagram", status: "skipped", note: "No photos" };
  }

  let creationId: string;
  if (urls.length === 1) {
    const d = await graph(`${ig}/media`, {
      image_url: urls[0],
      caption: input.caption,
      access_token: token,
    });
    creationId = String(d.id);
  } else {
    const children: string[] = [];
    for (const url of urls) {
      const d = await graph(`${ig}/media`, {
        image_url: url,
        is_carousel_item: "true",
        access_token: token,
      });
      children.push(String(d.id));
    }
    const d = await graph(`${ig}/media`, {
      media_type: "CAROUSEL",
      caption: input.caption,
      children: children.join(","),
      access_token: token,
    });
    creationId = String(d.id);
  }

  // Publish, retrying briefly while the container finishes processing.
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      await graph(`${ig}/media_publish`, { creation_id: creationId, access_token: token });
      return {
        platform: "instagram",
        status: "posted",
        url: "https://instagram.com/southeastroofing.llc",
        postedAt: now,
      };
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Instagram publish failed");
}

function metaConfigured(): boolean {
  return Boolean(process.env.META_PAGE_ACCESS_TOKEN && process.env.META_PAGE_ID);
}

/**
 * Fan out to every platform. Never throws — a platform failure is captured as
 * an "error" result so the website upload is never blocked by a social hiccup.
 */
export async function syndicate(
  input: SyndicationInput,
): Promise<SyndicationResult[]> {
  const results: SyndicationResult[] = [];

  // Facebook + Instagram share the Meta credentials + page token.
  if (metaConfigured()) {
    let pageToken: string | null = null;
    try {
      pageToken = await getPageToken();
    } catch (err) {
      const note = err instanceof Error ? err.message : "Token error";
      results.push({ platform: "facebook", status: "error", note });
      results.push({ platform: "instagram", status: "error", note });
    }
    if (pageToken) {
      results.push(await safe("facebook", () => postToFacebook(input, pageToken!)));
      if (process.env.META_IG_USER_ID) {
        results.push(await safe("instagram", () => postToInstagram(input, pageToken!)));
      } else {
        results.push({ platform: "instagram", status: "skipped", note: "IG not linked" });
      }
    }
  } else {
    results.push({ platform: "facebook", status: "skipped", note: "Not connected yet" });
    results.push({ platform: "instagram", status: "skipped", note: "Not connected yet" });
  }

  // Google Business Profile + TikTok go through Metricool — Meta's Graph API
  // can't reach them. Safe no-op until the METRICOOL_* credentials are set.
  for (const r of await postViaMetricool({
    text: input.caption,
    imageUrls: input.imageUrls,
  })) {
    results.push({ platform: r.network, status: r.status, note: r.note });
  }

  // Nextdoor has no practical third-party posting API (its Publish API is gated
  // to large partners), so it stays a manual post.
  results.push({
    platform: "nextdoor",
    status: "skipped",
    note: "Manual — no posting API",
  });

  return results;
}

async function safe(
  platform: Platform,
  fn: () => Promise<SyndicationResult>,
): Promise<SyndicationResult> {
  try {
    return await fn();
  } catch (err) {
    return {
      platform,
      status: "error",
      note: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
