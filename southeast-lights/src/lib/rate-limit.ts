import "server-only";

/**
 * In-memory rate limiter for form endpoints.
 *
 * Deliberately simple: a Map in module scope. On Vercel each instance keeps
 * its own counter, so this is a speed bump for casual abuse rather than a
 * distributed guarantee. That is the right trade here, because the
 * alternative is adding a paid KV service to stop spam on a contact form.
 *
 * Combined with the honeypot and server-side validation it removes the need
 * for a CAPTCHA, which is the point: no user should have to identify a
 * crosswalk to ask for a quote.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/**
 * @param max requests allowed per minute. Five suits a lead form, where a
 *   sixth submission in a minute is abuse. Endpoints that legitimately fire
 *   in bursts pass their own ceiling: the upload studio sends one request per
 *   photo, so a normal batch would trip the form limit on the sixth file.
 */
export function rateLimit(
  key: string,
  max: number = MAX_PER_WINDOW,
): {
  allowed: boolean;
  retryAfter: number;
} {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= max) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the Map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfter: 0 };
}

/** Best-effort client identity from proxy headers. */
export function clientKey(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
