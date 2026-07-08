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

/** Our internal platform key → Metricool network string. */
const NETWORK: Record<"google-business" | "tiktok", string> = {
  "google-business": "google",
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
      // Logged so the first live post is easy to verify/correct.
      console.error(`[metricool:${network}] ${res.status} ${text.slice(0, 500)}`);
      return { network, status: "error", note: `HTTP ${res.status}` };
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

/**
 * Fan out to Google Business Profile + TikTok. No-op (skipped results) until
 * the Metricool credentials are set. Never throws.
 */
export async function postViaMetricool(
  post: MetricoolPost,
): Promise<MetricoolResult[]> {
  if (!metricoolConfigured()) {
    return [
      { network: "google-business", status: "skipped", note: "Not connected yet" },
      { network: "tiktok", status: "skipped", note: "Not connected yet" },
    ];
  }
  return [
    await publish("google-business", post),
    await publish("tiktok", post),
  ];
}
