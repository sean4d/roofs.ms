import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Postgres for the /quote tool.
 *
 * WHY A DATABASE AND NOT SANITY. The rest of the site keeps its content in
 * Sanity and that is the right home for pages, projects and photos. This is
 * not content. It is user accounts, sign-in tokens, per-rep ownership rules
 * and a customer list that has to be filtered by status, tag, owner and date
 * on every screen. A CMS answers "give me the published documents"; it does
 * not answer "every customer this rep owns, tagged storm, not yet contacted,
 * newest first" without a lot of rope. Sanity's document allowance is also a
 * real ceiling once a rep can create a record per house on a street.
 *
 * Neon's driver speaks HTTP rather than the Postgres wire protocol, so there
 * is no connection pool to exhaust when a serverless function scales out.
 *
 * Set DATABASE_URL in Vercel. Vercel's Storage tab provisions Neon and injects
 * the variable itself, which is the least fiddly route.
 */

let cached: ReturnType<typeof neon> | null = null;

/**
 * The tagged-template query function.
 *
 * Interpolated values are sent as bound parameters, never spliced into the
 * SQL, so `sql`SELECT * FROM users WHERE email = ${email}`` is safe with
 * whatever the user typed. Never build a query by string concatenation.
 */
export function db() {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres database in the Vercel Storage tab.",
    );
  }
  cached = neon(url);
  return cached;
}

/** True when a database is configured at all, for health checks and setup UI. */
export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
