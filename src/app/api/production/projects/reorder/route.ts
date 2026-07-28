import { NextResponse } from "next/server";

import { hasSession, sameOrigin } from "@/lib/production/auth";
import { reorderSchema } from "@/lib/production/model";
import { reorderProjects } from "@/lib/production/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Persists the dashboard's custom project order. Session-guarded. */
export async function POST(request: Request) {
  if (!(await hasSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  let ids: string[];
  try {
    ({ ids } = reorderSchema.parse(await request.json()));
  } catch {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }
  try {
    await reorderProjects(ids);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save the new order. Try again." },
      { status: 500 },
    );
  }
}
