import { NextResponse } from "next/server";

import { db, dbConfigured } from "@/lib/quotes/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Can this deployment actually reach its database?
 *
 * WHY THIS EXISTS. On 2026-08-28 the database password was rotated. The
 * rotation itself worked, but Vercel bakes environment variables into a
 * deployment at build time, so the running production build kept using the old
 * password and every sign-in started failing. The post-deploy check reported
 * 19 of 19 passing throughout, because the only thing it asked of this API was
 * that a cross-site POST be refused, and that refusal happens before anything
 * touches the database. A gate that fails closed looks identical to a gate
 * that works when you only test it from the outside.
 *
 * So this endpoint gives the check something that cannot be faked: one real
 * query. Any credential rotation, connection limit or region outage that would
 * break a rep at a door now breaks this first, in a place we look.
 *
 * It answers ok or not ok and nothing else. No error text, no host, no schema:
 * an unauthenticated endpoint should never be a free reconnaissance tool.
 */
export async function GET() {
  if (!dbConfigured()) {
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await db()`SELECT 1`;

    /**
     * Is the schema as new as the code?
     *
     * Migrations are run by hand, and a deploy does not wait for one. So a
     * build can ship a feature whose column does not exist yet, everything
     * looks healthy, and the failure surfaces as a 500 in front of a customer
     * the first time a rep uses it. That is exactly the shape of the password
     * rotation this endpoint was written for: broken in production, invisible
     * from outside.
     *
     * A boolean, deliberately. Which columns are missing is useful to us and
     * to nobody else, so the list stays in the code and only the verdict is
     * published. Add a column here when a migration ships with a feature.
     */
    const required = [
      ["quotes", "mail_status"],
      ["quotes", "emailed_at"],
      ["quotes", "printed_at"],
      ["quotes", "structures"],
      ["quotes", "public_token"],
      ["quotes", "imagery_date"],
      ["company_profile", "logo_data_uri"],
      ["users", "active"],
    ];
    const found = (await db()`
      SELECT table_name, column_name
        FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = ANY(${required.map((r) => r[0])})
    `) as Array<{ table_name: string; column_name: string }>;
    const have = new Set(found.map((r) => `${r.table_name}.${r.column_name}`));
    const schemaCurrent = required.every((r) => have.has(`${r[0]}.${r[1]}`));

    return NextResponse.json(
      {
        ok: true,
        schema: schemaCurrent,
        /**
         * Can this deployment send mail at all?
         *
         * Without a Resend key every send is a silent no-op: the website's
         * estimate email logs a line and returns false, and the caller carries
         * on. A rep would tap "Email it", see nothing wrong, and the customer
         * would get nothing. A boolean about our own configuration, not about
         * the key.
         */
        email: Boolean(process.env.RESEND_API_KEY),
        // Which commit is actually serving this. Vercel does not expose a
        // build id in the HTML, so without this there is no way to tell from
        // outside whether a push has finished deploying or the old build is
        // still answering. Several times this session that turned a thirty
        // second question into a guessing game. It is a public commit hash on
        // a repository, not a secret.
        commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Logged server side, where only we can read it.
    console.error("[pin] database health check failed", error);
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
