import { NextResponse } from "next/server";

import { hasSession, sameOrigin } from "@/lib/production/auth";
import { projectPatchSchema } from "@/lib/production/model";
import { deleteProject, getProject, updateProject } from "@/lib/production/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Single-project updates and deletion. Session-guarded, origin-checked. */

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const notFound = () =>
  NextResponse.json({ error: "Project not found." }, { status: 404 });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasSession())) return unauthorized();
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  const { id } = await params;
  let patch;
  try {
    patch = projectPatchSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "That change didn't validate. Refresh and try again." },
      { status: 400 },
    );
  }
  try {
    const project = await updateProject(id, patch);
    if (!project) return notFound();
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json(
      { error: "Save failed. Your change is still on screen — retry." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasSession())) return unauthorized();
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  const { id } = await params;
  try {
    const existing = await getProject(id);
    if (!existing) return notFound();
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Delete failed. Try again." },
      { status: 500 },
    );
  }
}
