import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/** Read-only client for public content (cached via CDN). */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Read-only client that bypasses Sanity's CDN (`useCdn: false`) so reads are
 * immediately consistent with writes. Used for the project gallery, whose page
 * cache is revalidated right after an /upload. The CDN can lag a freshly
 * created doc, so a CDN read on regeneration would re-cache the old list. Reads
 * are still infrequent (the page is cached), so the extra API hit is negligible.
 */
export const freshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/**
 * Server-only write client for the /upload job-intake API. The token
 * (`SANITY_WRITE_TOKEN`) is a secret. It lives only in the hosting
 * environment variables, never in the client bundle (no NEXT_PUBLIC prefix)
 * and never in source. `useCdn: false` so writes and reads are always fresh.
 */
export function getWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "SANITY_WRITE_TOKEN is not set. Add it in the hosting environment " +
        "variables (Sanity → API → Tokens → Editor) to enable job uploads.",
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
