import { NextResponse } from "next/server";

import { drain } from "@/lib/roofgo-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Hands RoofGo any instant-estimate lead it has not acknowledged yet, and
 * emails the office once about any still missing after an hour
 * (src/lib/roofgo-lead.ts). Daily, because the Hobby plan allows no more;
 * each new estimate and each homeowner opening their link also retry.
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Anything else: 404.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const result = await drain(undefined, 50);
  console.log("[roofgo-lead] cron", JSON.stringify(result));
  return NextResponse.json(
    { ok: true, ...result },
    { headers: { "Cache-Control": "no-store" } },
  );
}
