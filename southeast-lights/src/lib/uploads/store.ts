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
 *   SUPABASE_SERVICE_ROLE_KEY service_role key (SERVER ONLY, never NEXT_PUBLIC)
 *   SUPABASE_UPLOAD_BUCKET    optional, defaults to "lead-uploads"
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
        `${base}/storage/v1/object/${bucket}/${encodeURIComponent(path)}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${key}`,
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
              url: `${base}/storage/v1/object/${bucket}/${encodeURIComponent(path)}`,
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
