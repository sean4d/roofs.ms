import { NextResponse } from "next/server";

import { db, dbConfigured } from "@/lib/quotes/db";
import { checkAddress } from "@/lib/quotes/address-check";
import { siteConfig } from "@/config/site";

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
/**
 * One probe against an address USPS has certainly heard of.
 *
 * The White House is used because it is permanent, unambiguous and not a
 * customer of ours. If this comes back anything but mailable, the validator is
 * not doing its job, whatever the reason.
 */
async function addressCheckWorking(): Promise<boolean> {
  try {
    const probe = await checkAddress(
      "1600 Pennsylvania Ave NW, Washington, DC 20500",
    );
    return probe.verdict === "mailable";
  } catch {
    return false;
  }
}

/**
 * One probe at the autocomplete proxy, for the same reason.
 *
 * Places Autocomplete is a separate API from Geocoding and has to be enabled
 * separately on the project. When it is not, the proxy does what it should and
 * degrades to an empty list, which is indistinguishable on screen from an
 * address nobody has heard of. This asks it about a street that certainly
 * exists, so an empty answer means the API, not the address.
 */
async function autocompleteWorking(origin: string): Promise<boolean> {
  try {
    const res = await fetch(`${origin}/api/places/autocomplete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "100 Hardy St Hattiesburg" }),
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { suggestions?: unknown[] };
    return (data.suggestions?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  /*
   * THE EXPENSIVE CHECKS ARE OPT IN.
   *
   * Both probes below call a billed Google API. This endpoint is also the
   * thing a deploy is polled against and the obvious target for any uptime
   * monitor somebody adds later, and a probe on every poll would quietly turn
   * a liveness check into a metered spend: once a minute is over seven hundred
   * dollars a year to learn something that changes about twice.
   *
   * So a plain GET stays free and answers the question it was written for, and
   * ?probe=1 runs the paid ones. check:deploy asks for them once per deploy,
   * which is exactly as often as the answer can change.
   */
  const deep = new URL(request.url).searchParams.get("probe") === "1";

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
      ["estimate_events", "kind"],
      ["quotes", "actual_squares"],
      ["quotes", "measured_squares"],
      ["quotes", "edited_at"],
      ["quotes", "mail_status"],
      ["quotes", "mail_return_code"],
      ["quotes", "mail_check"],
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
        /**
         * Is address checking actually switched on?
         *
         * THE DANGEROUS FAILURE IS THE QUIET ONE. checkAddress degrades to
         * "unknown" and lets the mailer through when Google cannot be reached,
         * which is right: a third party having a bad afternoon must not stop
         * the office posting anything. But if the Address Validation API was
         * never enabled on the project, every single call degrades, nothing is
         * ever blocked, and the board looks exactly like one that is working.
         * Protection you believe you have and do not is worse than none.
         *
         * So the check is published as a boolean. It is a live probe against a
         * known-good address rather than a look at configuration, because the
         * key existing proves nothing about whether the API is enabled for it.
         */
        ...(deep
          ? {
              addressCheck: await addressCheckWorking(),
              autocomplete: await autocompleteWorking(
                new URL(request.url).origin,
              ),
            }
          : {}),
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
