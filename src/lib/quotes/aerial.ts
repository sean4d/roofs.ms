import "server-only";

/**
 * The satellite tile for a property, fetched with the server key.
 *
 * PULLED OUT OF THE API ROUTE SO THE PDF CAN USE IT TOO. The browser gets this
 * picture through /api/pin/aerial, which exists so the unrestricted Google key
 * never reaches a phone. The printed piece is built on the server and cannot go
 * through that route: it would mean the function calling itself over HTTP,
 * carrying a session cookie it does not have, to reach code already sitting in
 * the same process. So the fetch lives here and both callers share it.
 *
 * Returns null rather than throwing. A mailed estimate with no photograph is a
 * worse document; a mailed estimate that failed to build is no document at all.
 */

export interface AerialImage {
  bytes: Uint8Array;
  /** "image/png" or "image/jpeg", as Google actually returned it. */
  contentType: string;
}

export interface AerialOptions {
  /** Pixels square. Clamped, because a caller that could name any size could
   *  bill us for 2048px tiles all day. */
  size?: number;
  /**
   * JPEG for the printed piece, PNG for the screen.
   *
   * A 640px satellite tile as PNG is around 700KB and every byte of it is
   * embedded in the PDF uncompressed further. The same tile as JPEG is under
   * 100KB and photographic detail is exactly what JPEG is good at, so the
   * envelope version is smaller with no visible loss.
   */
  format?: "png" | "jpg";
}

export async function fetchAerial(
  lat: number,
  lon: number,
  options: AerialOptions = {},
): Promise<AerialImage | null> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;

  const size = Math.min(Math.max(options.size ?? 480, 160), 640);
  const format = options.format ?? "png";

  const upstream = new URL("https://maps.googleapis.com/maps/api/staticmap");
  upstream.searchParams.set("center", `${lat},${lon}`);
  upstream.searchParams.set("zoom", "20");
  upstream.searchParams.set("size", `${size}x${size}`);
  upstream.searchParams.set("maptype", "satellite");
  upstream.searchParams.set("format", format);
  upstream.searchParams.set("key", key);

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    const contentType =
      res.headers.get("content-type")?.split(";")[0]?.trim() ||
      (format === "jpg" ? "image/jpeg" : "image/png");
    return { bytes, contentType };
  } catch {
    return null;
  }
}
