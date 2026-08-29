import "server-only";

import { UPLOAD } from "./config";

/**
 * Upload storage.
 *
 * STATUS: adapter complete, storage not activated. Supabase Storage is the
 * intended backend (generous free tier, no card required to start), but
 * standing up a bucket is a decision with a cost attached, so it is wired and
 * documented rather than switched on.
 *
 * Set to activate:
 *   SUPABASE_URL              https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY a secret key (SERVER ONLY, never NEXT_PUBLIC).
 *                             Either an sb_secret_... key or a legacy
 *                             service_role JWT; both are accepted.
 *   SUPABASE_UPLOAD_BUCKET    optional, defaults to "lead-uploads"
 *
 * The bucket should be PRIVATE. Links in the lead email are signed for a
 * year rather than pointing at a public object, because the storage paths
 * are timestamps rather than random ids and these are photographs of
 * customers' houses.
 *
 * Until then storeFiles reports files as pending rather than throwing, so a
 * submission always succeeds and the lead email lists what was attached.
 * Losing a $50,000 proposal request because a bucket is not configured would
 * be a far worse failure than a missing photo.
 */

export interface StoredFile {
  name: string;
  size: number;
  type: string;
  /** Present once storage is live. */
  url?: string;
  /** True when the file was accepted but could not be persisted. */
  pending?: boolean;
}

/**
 * Credentials for the Storage API.
 *
 * Supabase has two key systems in play. The legacy `service_role` key is a
 * JWT and the gateway accepts it as a bearer token alone. The current
 * `sb_secret_...` keys are not JWTs and are presented in the `apikey`
 * header. New projects are issued the second kind and shown the first under
 * a "Legacy" tab, so which one lands in the environment depends on which tab
 * the person was looking at.
 *
 * Sending both costs nothing and means either works. Guessing wrong would
 * fail as a 401 on upload, which reads like a broken integration rather than
 * a key in the wrong format.
 */
function authHeaders(key: string): Record<string, string> {
  return { authorization: `Bearer ${key}`, apikey: key };
}

/** A year. The office opens these links weeks after the season, not minutes. */
const LINK_LIFETIME_SECONDS = 31_536_000;

/**
 * A link the office can actually open.
 *
 * The obvious URL, /storage/v1/object/<bucket>/<path>, is the AUTHENTICATED
 * endpoint: it needs the service key as a bearer token, so pasted into an
 * email it returns 400 and looks like the upload failed. It did not; the file
 * is there and the link was simply unopenable.
 *
 * So the bucket stays private and this signs a long-lived URL instead.
 * Private matters here: the paths contain timestamps, not random ids, so a
 * public bucket would be worth guessing at, and these are photographs of
 * customers' houses.
 *
 * The path goes in unencoded. encodeURIComponent turns the slashes into %2F,
 * and Supabase then mints a token for one reading of that string while the
 * URL it hands back carries another, so the link comes back InvalidSignature
 * even though the file uploaded perfectly. Filenames are already stripped to
 * [A-Za-z0-9_.-] before they get here, so there is nothing left to escape.
 *
 * If signing fails the file is still stored, so rather than lose the link
 * entirely this falls back to the public URL form. That works if the bucket
 * was made public, and fails with a clear Supabase error if not, which beats
 * silently dropping an attachment the office was told to expect.
 */
async function linkFor(
  base: string,
  key: string,
  bucket: string,
  path: string,
): Promise<string> {
  try {
    const response = await fetch(
      `${base}/storage/v1/object/sign/${bucket}/${path}`,
      {
        method: "POST",
        headers: {
          ...authHeaders(key),
          "content-type": "application/json",
        },
        body: JSON.stringify({ expiresIn: LINK_LIFETIME_SECONDS }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (response.ok) {
      const signed = (await response.json()) as { signedURL?: string };
      if (signed.signedURL) return `${base}/storage/v1${signed.signedURL}`;
    }
  } catch {
    // Fall through to the public form.
  }
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function uploadsConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function storeFiles(
  files: File[],
  prefix: string,
): Promise<{ stored: StoredFile[] }> {
  const accepted = files.slice(0, UPLOAD.maxFiles);

  if (!uploadsConfigured()) {
    return {
      stored: accepted.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        pending: true,
      })),
    };
  }

  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const bucket = process.env.SUPABASE_UPLOAD_BUCKET ?? "lead-uploads";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const stored: StoredFile[] = [];

  for (const file of accepted) {
    // Strip anything that could escape the prefix or confuse the storage path.
    const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-120);
    const path = `${prefix}/${Date.now()}-${safe}`;

    try {
      const response = await fetch(
        `${base}/storage/v1/object/${bucket}/${path}`,
        {
          method: "POST",
          headers: {
            ...authHeaders(key),
            "content-type": file.type || "application/octet-stream",
            "x-upsert": "false",
          },
          body: await file.arrayBuffer(),
          signal: AbortSignal.timeout(30_000),
        },
      );

      stored.push(
        response.ok
          ? {
              name: file.name,
              size: file.size,
              type: file.type,
              url: await linkFor(base, key, bucket, path),
            }
          : {
              name: file.name,
              size: file.size,
              type: file.type,
              pending: true,
            },
      );
    } catch {
      stored.push({
        name: file.name,
        size: file.size,
        type: file.type,
        pending: true,
      });
    }
  }

  return { stored };
}
