import { NextResponse } from "next/server";

import { hasSession, sameOrigin } from "@/lib/production/auth";
import { createProjectSchema } from "@/lib/production/model";
import { createProject, listProjects } from "@/lib/production/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Project collection for the /production dashboard. Every verb requires a
 * valid production session — an unauthenticated caller gets a bare 401 and
 * never a byte of project data.
 */

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await hasSession())) return unauthorized();
  try {
    const projects = await listProjects();
    return NextResponse.json(
      { projects },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not load projects. Refresh to try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await hasSession())) return unauthorized();
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }
  let input;
  try {
    input = createProjectSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Pick Retail or Insurance." },
      { status: 400 },
    );
  }
  try {
    const project = await createProject(input.projectType, input.requestId);
    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create the project. Try again." },
      { status: 500 },
    );
  }
}
