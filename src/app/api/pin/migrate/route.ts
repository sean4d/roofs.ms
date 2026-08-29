import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NextResponse } from "next/server";

import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { db } from "@/lib/quotes/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Apply the committed schema to the live database.
 *
 * WHY THIS EXISTS. Migrations were run by hand from a laptop with the database
 * URL in the environment. That meant a feature could ship whose columns did
 * not exist yet, and the failure only surfaced when a rep hit it in front of a
 * customer. It also meant a deploy could be blocked on whoever happened to
 * have the connection string.
 *
 * WHAT IT CAN AND CANNOT DO. It runs src/lib/quotes/schema.sql, the file in
 * the repository, and nothing else. There is no way to hand it a statement:
 * everything it executes was code-reviewed and committed, so this is a button
 * that applies the current deployment's own schema, not a SQL console. Every
 * statement in that file is idempotent (CREATE TABLE IF NOT EXISTS, ADD COLUMN
 * IF NOT EXISTS), so running it twice is a no-op and running it against an
 * up-to-date database does nothing at all.
 *
 * Admin only, same-origin only. The schema names tables and columns, so the
 * error text is deliberately not returned to the browser.
 */

/**
 * Is this chunk nothing but comments and blank lines?
 *
 * A line scan rather than the obvious regex. The obvious one is
 * /^(--[^\n]*\n?)+$/, which is a quantified group wrapping an optional match:
 * the textbook shape for catastrophic backtracking. Against this schema, whose
 * statements each carry twenty-odd lines of comment, it hangs. This bit us
 * once already in scripts/migrate.mjs.
 */
function isOnlyComments(chunk: string): boolean {
  for (const line of chunk.split("\n")) {
    const t = line.trim();
    if (t && !t.startsWith("--")) return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to continue." },
      { status: 401 },
    );
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  let text: string;
  try {
    text = readFileSync(
      join(process.cwd(), "src/lib/quotes/schema.sql"),
      "utf8",
    );
  } catch (error) {
    console.error("[pin] schema.sql is not in the deployment bundle", error);
    return NextResponse.json(
      { error: "The schema file is missing from this deployment." },
      { status: 500 },
    );
  }

  // Split on semicolons at end of line. Safe for this file because it holds no
  // functions or DO blocks with inner semicolons. If that changes, so must
  // this, and scripts/migrate.mjs alongside it.
  const statements = text
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s && !isOnlyComments(s));

  let applied = 0;
  for (const statement of statements) {
    try {
      await db().query(statement);
      applied++;
    } catch (error) {
      // Named in the server log where only we can read it. The response says
      // which statement by number, which is enough to find it in the file
      // without publishing the schema to whoever asked.
      console.error(`[pin] migration statement ${applied + 1} failed`, error);
      return NextResponse.json(
        {
          error: `Statement ${applied + 1} of ${statements.length} failed. Check the server logs.`,
          applied,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { ok: true, applied, statements: statements.length },
    { headers: { "Cache-Control": "no-store" } },
  );
}
