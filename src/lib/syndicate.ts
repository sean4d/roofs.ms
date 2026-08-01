/**
 * Social fan-out ("syndication"). After a job is saved to the website gallery,
 * this pushes the same photos + generated caption to each connected platform.
 *
 * The website is the hub, photos live in Sanity first, which gives us the
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

/** Meta's throttle, which arrives as a message rather than a clean status. */
function isThrottled(err: unknown): boolean {
  const m = err instanceof Error ? err.message.toLowerCase() : "";
  return (
    m.includes("reduce the amount of data") ||
    m.includes("rate limit") ||
    m.includes("too many calls") ||
    m.includes("request limit")
  );
}

/** graph() with backoff on Meta's throttle, it clears in a second or two. */
async function graphRetry(
  path: string,
  params: Record<string, string>,
  attempts = 3,
): Promise<Record<string, unknown>> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await graph(path, params);
    } catch (err) {
      last = err;
      if (!isThrottled(err)) throw err;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw last instanceof Error ? last : new Error("Graph API error");
}

/**
 * Run `fn` over `items` with at most `limit` in flight, preserving order.
 *
 * Uploading all photos at once looked like the obvious fix for the timeout, but
 * Meta answered a 7-photo burst with "Please reduce the amount of data you're
 * asking for" (2026-08-01). Its throttle counts calls, not bytes. Now that
 * each platform owns its own request there is budget for a gentler pace.
 */
async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
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

  // Two at a time, with backoff. All-at-once was rejected outright by Meta's
  // throttle; one-at-a-time was what starved the rest of the fan-out back when
  // a single request carried every platform. Two is fast enough now that
  // Facebook owns its own request.
  const mediaIds = await mapPool(input.imageUrls, 2, async (url) => {
    const d = await graphRetry(`${pageId}/photos`, {
      url,
      published: "false",
      access_token: pageToken,
    });
    return String(d.id);
  });

  const params: Record<string, string> = { message: input.caption, access_token: pageToken };
  mediaIds.forEach((id, i) => {
    params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id });
  });
  const post = await graphRetry(`${pageId}/feed`, params);
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
    // Same bounded pace as Facebook. mapPool preserves order, and carousel
    // order is the whole point of a before/after post.
    const children = await mapPool(urls, 2, async (url) => {
      const d = await graphRetry(`${ig}/media`, {
        image_url: url,
        is_carousel_item: "true",
        access_token: token,
      });
      return String(d.id);
    });
    const d = await graphRetry(`${ig}/media`, {
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

export function metaConfigured(): boolean {
  return Boolean(process.env.META_PAGE_ACCESS_TOKEN && process.env.META_PAGE_ID);
}

/**
 * Read-only Meta health check for the /upload Connections panel. Presence
 * booleans plus two live GET probes (never posts anything): does the system
 * token still resolve a Page token, and does the linked Instagram account
 * answer? An expired token and an unset variable look identical otherwise.
 */
export async function diagnoseMeta(): Promise<{
  pageTokenPresent: boolean;
  pageIdPresent: boolean;
  igUserIdPresent: boolean;
  configured: boolean;
  pageTokenResolves?: boolean;
  pageName?: string;
  igAccountResolves?: boolean;
  igUsername?: string;
  note?: string;
}> {
  const base = {
    pageTokenPresent: Boolean(process.env.META_PAGE_ACCESS_TOKEN),
    pageIdPresent: Boolean(process.env.META_PAGE_ID),
    igUserIdPresent: Boolean(process.env.META_IG_USER_ID),
    configured: metaConfigured(),
  };
  if (!base.configured) return { ...base, note: "Meta credentials not set" };

  let pageToken: string;
  try {
    pageToken = await getPageToken();
  } catch (err) {
    return {
      ...base,
      pageTokenResolves: false,
      note: err instanceof Error ? err.message : "Page token error",
    };
  }

  const out = { ...base, pageTokenResolves: true } as Awaited<
    ReturnType<typeof diagnoseMeta>
  >;

  try {
    const res = await fetch(
      `${GRAPH}/${process.env.META_PAGE_ID}?fields=name&access_token=${encodeURIComponent(pageToken)}`,
    );
    const data = (await res.json()) as { name?: string };
    out.pageName = data.name;
  } catch {
    // name is a nicety, not a health signal
  }

  if (!process.env.META_IG_USER_ID) {
    out.igAccountResolves = false;
    out.note = "META_IG_USER_ID not set, Instagram is skipped every post";
    return out;
  }

  try {
    const res = await fetch(
      `${GRAPH}/${process.env.META_IG_USER_ID}?fields=username&access_token=${encodeURIComponent(pageToken)}`,
    );
    const data = (await res.json()) as {
      username?: string;
      error?: { message?: string };
    };
    out.igAccountResolves = Boolean(data.username);
    out.igUsername = data.username;
    if (!data.username) out.note = data.error?.message ?? "Instagram did not resolve";
  } catch (err) {
    out.igAccountResolves = false;
    out.note = err instanceof Error ? err.message : "Instagram probe failed";
  }

  return out;
}

/**
 * Post to ONE Meta network. The /upload flow calls this once per platform, in
 * its own request, so no single serverless invocation has to carry the whole
 * fan-out, that is what timed out on 2026-07-31 and silently swallowed
 * Instagram, Google, and TikTok after Facebook had already posted.
 *
 * Never throws: a failure comes back as an "error" result to be logged.
 */
export async function postToMeta(
  platform: "facebook" | "instagram",
  input: SyndicationInput,
): Promise<SyndicationResult> {
  if (!metaConfigured()) {
    return { platform, status: "skipped", note: "Not connected yet" };
  }
  if (platform === "instagram" && !process.env.META_IG_USER_ID) {
    return { platform, status: "skipped", note: "IG not linked" };
  }
  let pageToken: string;
  try {
    pageToken = await getPageToken();
  } catch (err) {
    return {
      platform,
      status: "error",
      note: err instanceof Error ? err.message : "Token error",
    };
  }
  return safe(platform, () =>
    platform === "facebook"
      ? postToFacebook(input, pageToken)
      : postToInstagram(input, pageToken),
  );
}

/**
 * Fan out to every platform. Never throws, a platform failure is captured as
 * an "error" result so the website upload is never blocked by a social hiccup.
 *
 * Retained for the weekly GBP cron and any caller that genuinely wants one
 * blocking call; the /upload flow uses postToMeta per platform instead.
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

  // Google Business Profile + TikTok go through Metricool, Meta's Graph API
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
    note: "Manual: no posting API",
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
