/**
 * IndexNow — instant "please crawl this" pings to Bing, Yandex, Seznam, and
 * every other IndexNow-participating engine (one submission fans out to all of
 * them). It does NOT include Google, which ignores IndexNow — Google discovery
 * still relies on the sitemap + Search Console. But it's the fastest path to
 * getting new job pages into Bing/DuckDuckGo, and it's free.
 *
 * Ownership is proved by a key file served at the site root:
 *   https://southeastroofing.llc/<key>.txt   (contents = the key)
 * The key is intentionally public (that's how verification works), so it lives
 * in the repo. Override with INDEXNOW_KEY only if the key file is rotated.
 *
 * Best-effort and never throws — a failed ping never blocks an upload.
 */

import { siteConfig } from "@/config/site";

/** Public IndexNow key. Must match the filename+contents of the key file in
 *  /public. Env override lets us rotate without a code change. */
const KEY = process.env.INDEXNOW_KEY ?? "b08b80fc908735194b124d9427ce53e8";

const ENDPOINT = "https://api.indexnow.org/indexnow";

function host(): string {
  return new URL(siteConfig.url).host;
}

export interface IndexNowResult {
  status: "submitted" | "skipped" | "error";
  count: number;
  httpStatus?: number;
  note?: string;
}

/**
 * Submit up to 10,000 absolute URLs to IndexNow in one call. All URLs must be
 * on our own host. Returns the engines' acknowledgement status (200/202 = good).
 */
export async function submitToIndexNow(
  urls: string[],
): Promise<IndexNowResult> {
  const urlList = [...new Set(urls)].filter((u) => u.startsWith(siteConfig.url));
  if (urlList.length === 0) {
    return { status: "skipped", count: 0, note: "No same-host URLs to submit" };
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: host(),
        key: KEY,
        keyLocation: `${siteConfig.url}/${KEY}.txt`,
        urlList: urlList.slice(0, 10_000),
      }),
      cache: "no-store",
    });
    // IndexNow returns 200 (accepted) or 202 (accepted, pending) on success.
    if (!res.ok) {
      return {
        status: "error",
        count: urlList.length,
        httpStatus: res.status,
        note: (await res.text()).slice(0, 200),
      };
    }
    return { status: "submitted", count: urlList.length, httpStatus: res.status };
  } catch (err) {
    return {
      status: "error",
      count: urlList.length,
      note: err instanceof Error ? err.message : "IndexNow ping failed",
    };
  }
}
