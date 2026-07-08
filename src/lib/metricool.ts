/**
 * Metricool fan-out for the networks Meta's Graph API can't reach directly:
 * Google Business Profile and TikTok. (Facebook + Instagram stay on our own
 * richer Meta integration in syndicate.ts; Nextdoor has no practical posting
 * API and stays manual.)
 *
 * Gated by env credentials — with none set it's a safe no-op and the website
 * upload still fully succeeds, exactly like the Meta path. Never throws.
 *
 * ── Heads-up on the API shape ──────────────────────────────────────────────
 * Metricool's public API docs intentionally don't publish the full post-body
 * schema (their help center tells you to capture the request from the app via
 * browser dev tools). The pieces below are the documented/known-stable ones:
 *   • endpoint: POST /api/v2/scheduler/posts?userId=..&blogId=..
 *   • auth: X-Mc-Auth header (NOT a Bearer token)
 *   • providers: array of OBJECTS — [{ network: "google" }], not strings
 *   • network strings: Google Business Profile = "google", TikTok = "tiktok"
 *   • autoPublish: true  → publish (false = save as draft)
 *   • publicationDate: { dateTime: "YYYY-MM-DDTHH:mm:ss", timezone }
 * The MEDIA field is the one under-documented part. We send an array of public
 * image URLs as `media`; if a live test shows Metricool wants a pre-normalized
 * mediaId (some accounts do), that's the single spot to adjust — see MEDIA_FIELD
 * below. Every response is logged so the first real post is easy to verify.
 */

const ENDPOINT = "https://app.metricool.com/api/v2/scheduler/posts";

/** Central time — Southeast Roofing is in Mississippi. */
const TIMEZONE = "America/Chicago";

/** Body field carrying the image URLs. See media heads-up above. */
const MEDIA_FIELD = "media";

/**
 * Our internal platform key → Metricool network string. Valid Metricool
 * network names (from the API's own validation error): twitter, facebook,
 * instagram, instagram_business, linkedin, gmb, pinterest, tiktok,
 * tiktokbusiness, youtube, threads, bluesky.
 */
const NETWORK: Record<"google-business" | "tiktok", string> = {
  "google-business": "gmb",
  tiktok: "tiktok",
};

export interface MetricoolPost {
  /** Caption / post text. */
  text: string;
  /** Public JPEG URLs (from the Sanity CDN). */
  imageUrls: string[];
}

export interface MetricoolResult {
  network: "google-business" | "tiktok";
  status: "posted" | "skipped" | "error";
  note?: string;
}

export function metricoolConfigured(): boolean {
  return Boolean(
    process.env.METRICOOL_API_TOKEN &&
      process.env.METRICOOL_USER_ID &&
      process.env.METRICOOL_BLOG_ID,
  );
}

/** Local wall-clock "YYYY-MM-DDTHH:mm:ss" in TIMEZONE, `offsetMinutes` from now. */
function scheduleAt(offsetMinutes: number): string {
  const when = new Date(Date.now() + offsetMinutes * 60_000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(when);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  // en-CA gives YYYY-MM-DD ordering for the date parts.
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

/**
 * Publish one post to one network via Metricool. GBP takes a single image;
 * TikTok takes the photo set (photo-mode). Returns a per-network result and
 * never throws — the caller decides how to surface it.
 */
async function publish(
  network: "google-business" | "tiktok",
  post: MetricoolPost,
): Promise<MetricoolResult> {
  const token = process.env.METRICOOL_API_TOKEN!;
  const userId = process.env.METRICOOL_USER_ID!;
  const blogId = process.env.METRICOOL_BLOG_ID!;

  // GBP posts are single-image; TikTok takes the full set.
  const media =
    network === "google-business" ? post.imageUrls.slice(0, 1) : post.imageUrls;
  if (media.length === 0) {
    return { network, status: "skipped", note: "No photos" };
  }

  const body = {
    autoPublish: true,
    // Schedule a few minutes out — Metricool rejects past times; autoPublish
    // then releases it on schedule.
    publicationDate: { dateTime: scheduleAt(5), timezone: TIMEZONE },
    text: post.text,
    providers: [{ network: NETWORK[network] }],
    [MEDIA_FIELD]: media,
  };

  try {
    const url = `${ENDPOINT}?userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(blogId)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-Mc-Auth": token,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      // Logged AND surfaced in the note so the first live post is diagnosable.
      console.error(`[metricool:${network}] ${res.status} ${text.slice(0, 500)}`);
      return { network, status: "error", note: `HTTP ${res.status}: ${text.slice(0, 300)}` };
    }
    console.log(`[metricool:${network}] scheduled ${text.slice(0, 200)}`);
    return { network, status: "posted" };
  } catch (err) {
    return {
      network,
      status: "error",
      note: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/** YYYY-MM-DD in TIMEZONE, `dayOffset` days from today. */
function dayStamp(dayOffset: number): string {
  const when = new Date(Date.now() + dayOffset * 86_400_000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(when);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "01";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Owner-facing diagnostic: read back recent scheduled posts from Metricool so
 * we can see each post's real per-network status/errors (a schedule request
 * returning 200 doesn't guarantee the network published). Returns the raw
 * response so the exact shape is visible. Never leaks the token.
 */
export async function inspectMetricool(): Promise<unknown> {
  if (!metricoolConfigured()) return { configured: false };
  const token = process.env.METRICOOL_API_TOKEN!;
  const userId = process.env.METRICOOL_USER_ID!;
  const blogId = process.env.METRICOOL_BLOG_ID!;
  const start = `${dayStamp(-2)}T00:00:00`;
  const end = `${dayStamp(2)}T23:59:59`;
  const url = `${ENDPOINT}?userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(blogId)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
  try {
    const res = await fetch(url, {
      headers: { "X-Mc-Auth": token },
      cache: "no-store",
    });
    const text = await res.text();
    return { status: res.status, window: { start, end }, body: text.slice(0, 6000) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "fetch failed" };
  }
}

/**
 * Fan out to Google Business Profile + TikTok. No-op (skipped results) until
 * the Metricool credentials are set. Never throws. `only` optionally restricts
 * which networks to post (handy for retrying a single network).
 */
export async function postViaMetricool(
  post: MetricoolPost,
  only?: Array<"google-business" | "tiktok">,
): Promise<MetricoolResult[]> {
  const targets: Array<"google-business" | "tiktok"> = only?.length
    ? only
    : ["google-business", "tiktok"];
  if (!metricoolConfigured()) {
    return targets.map((network) => ({
      network,
      status: "skipped" as const,
      note: "Not connected yet",
    }));
  }
  const out: MetricoolResult[] = [];
  for (const network of targets) out.push(await publish(network, post));
  return out;
}
