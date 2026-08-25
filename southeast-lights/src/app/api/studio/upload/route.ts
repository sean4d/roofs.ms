import { NextResponse } from "next/server";

import { clientKey, rateLimit } from "@/lib/rate-limit";
import { SLOT_KEYS } from "@/lib/uploads/slots";

/**
 * Photo intake for the owner.
 *
 * Commits uploaded images straight into the repo at
 * southeast-lights/incoming/<slot>.<ext> on the working branch, so the
 * repository is the storage. That avoids standing up a paid bucket just to
 * move a handful of photos, and it means every image arrives version
 * controlled and reviewable.
 *
 * Required environment variables:
 *   STUDIO_PASSWORD      passphrase for the upload page
 *   GITHUB_UPLOAD_TOKEN  fine-grained PAT, Contents: read and write,
 *                        scoped to this repository only
 *   GITHUB_REPO          defaults to sean4d/roofs.ms
 *   GITHUB_BRANCH        defaults to the Lights working branch
 *
 * Never expose the token to the browser: everything here is server side.
 */

const MAX_BYTES = 25 * 1024 * 1024;
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

export async function POST(request: Request) {
  // One request per photo, so the ceiling is a batch size, not a form limit.
  const limit = rateLimit(`studio:${clientKey(request.headers)}`, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many uploads at once. Wait a minute and send the rest.",
      },
      { status: 429 },
    );
  }

  const expected = process.env.STUDIO_PASSWORD;
  const token = process.env.GITHUB_UPLOAD_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "sean4d/roofs.ms";
  const branch =
    process.env.GITHUB_BRANCH ?? "claude/southeast-lights-redesign-zz62op";

  if (!expected || !token) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Upload is not configured on this deployment. STUDIO_PASSWORD and GITHUB_UPLOAD_TOKEN must both be set.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (String(form.get("password") ?? "") !== expected) {
    return NextResponse.json(
      { ok: false, error: "Wrong passphrase." },
      { status: 401 },
    );
  }

  const slot = String(form.get("slot") ?? "");
  if (!SLOT_KEYS.includes(slot)) {
    return NextResponse.json(
      { ok: false, error: "Unknown slot." },
      { status: 422 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "No file received." },
      { status: 422 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "That file is over 25 MB." },
      { status: 422 },
    );
  }

  const ext =
    EXT_BY_TYPE[file.type] ??
    (file.name.match(/\.(jpe?g|png|webp|heic|heif)$/i)?.[1]?.toLowerCase() ||
      "");
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Use JPG, PNG, WEBP or HEIC." },
      { status: 422 },
    );
  }

  const path = `southeast-lights/incoming/${slot}.${ext === "jpeg" ? "jpg" : ext}`;
  const api = `https://api.github.com/repos/${repo}/contents/${path}`;
  const headers = {
    authorization: `Bearer ${token}`,
    accept: "application/vnd.github+json",
    "content-type": "application/json",
  };

  try {
    // Replacing an existing file requires its blob SHA.
    let sha: string | undefined;
    const existing = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (existing.ok) {
      sha = ((await existing.json()) as { sha?: string }).sha;
    }

    const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
    const put = await fetch(api, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Add ${slot} photo via upload studio`,
        content: bytes,
        branch,
        ...(sha ? { sha } : {}),
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!put.ok) {
      const detail = await put.text();
      console.error("GitHub upload failed", put.status, detail.slice(0, 300));
      return NextResponse.json(
        { ok: false, error: `GitHub rejected the upload (${put.status}).` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, path, slot });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 },
    );
  }
}
