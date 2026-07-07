/**
 * Social fan-out ("syndication"). After a job is saved to the website gallery,
 * this pushes the same photos + generated caption to each connected platform.
 *
 * Architecture note (owner directive 2026-07-07): the website is the hub —
 * photos live in Sanity first, which gives us the PUBLIC image URLs that
 * Facebook, Instagram, Google Business, and TikTok all require. Each platform
 * is a pluggable target, gated by whether its credentials exist in the hosting
 * environment. With no credentials set, syndication is a safe no-op — the
 * website upload still fully succeeds.
 *
 * The connectors below are intentionally stubbed. Turning one on = filling in
 * its API call + adding its env credentials; no caller changes needed.
 */

export type Platform =
  | "google-business"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "nextdoor";

export interface SyndicationInput {
  caption: string;
  /** Public image URLs (from the Sanity CDN). */
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

/** Which platforms have credentials configured right now. */
function configured(platform: Platform): boolean {
  switch (platform) {
    case "facebook":
    case "instagram":
      return Boolean(process.env.META_PAGE_ACCESS_TOKEN);
    case "google-business":
      return Boolean(process.env.GOOGLE_BUSINESS_ACCESS_TOKEN);
    case "tiktok":
      return Boolean(process.env.TIKTOK_ACCESS_TOKEN);
    case "nextdoor":
      return Boolean(process.env.NEXTDOOR_ACCESS_TOKEN);
    default:
      return false;
  }
}

const ALL_PLATFORMS: Platform[] = [
  "google-business",
  "facebook",
  "instagram",
  "tiktok",
  "nextdoor",
];

/**
 * Fan out to every platform. Never throws — a platform failure is captured as
 * an "error" result so the website upload is never blocked by a social hiccup.
 * Returns one result per platform for storage on the project document.
 */
export async function syndicate(
  input: SyndicationInput,
): Promise<SyndicationResult[]> {
  const results = await Promise.all(
    ALL_PLATFORMS.map(async (platform): Promise<SyndicationResult> => {
      if (!configured(platform)) {
        return { platform, status: "skipped", note: "Not connected yet" };
      }
      try {
        // TODO(social-phase): implement per-platform posting here. Each
        // connector takes `input` and returns the live post URL.
        return {
          platform,
          status: "skipped",
          note: "Connector not implemented",
        };
      } catch (err) {
        return {
          platform,
          status: "error",
          note: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }),
  );
  return results;
}
