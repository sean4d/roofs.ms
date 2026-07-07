/**
 * Sanity environment. Defaults to the live Southeast Roofing project
 * (7ap5ct9c, dataset "production"). The project ID is public — it ships in
 * the browser bundle with every request — so baking it in as the default is
 * safe and lets the Studio/queries work without a build-time env var. An
 * env override still wins if one is ever set (e.g. a staging project).
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "7ap5ct9c";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-01";

export const isSanityConfigured = projectId !== "placeholder";
