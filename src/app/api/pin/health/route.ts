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
    return NextResponse.json(
      { ok: true },
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
