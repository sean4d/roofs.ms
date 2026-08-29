import { NextResponse } from "next/server";

import { deliverLead } from "@/lib/leads/deliver";
import { leadSchema } from "@/lib/leads/types";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { UPLOAD } from "@/lib/uploads/config";
import { storeFiles } from "@/lib/uploads/store";

/**
 * Lead intake.
 *
 * Accepts multipart/form-data so attachments arrive with the submission
 * rather than in a follow-up email, and plain JSON for anything that has no
 * files. Defence in depth without a CAPTCHA: a honeypot the schema requires to
 * be empty, per-IP rate limiting, and strict server-side validation.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  let files: File[] = [];

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      payload = JSON.parse(String(form.get("lead") ?? "{}"));
      files = form
        .getAll("files")
        .filter((f): f is File => f instanceof File && f.size > 0)
        .slice(0, UPLOAD.maxFiles);
    } else {
      payload = await request.json();
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  // Reject anything that slipped past the client-side type check.
  const bad = files.find(
    (f) =>
      f.size > UPLOAD.maxBytes ||
      !(
        (UPLOAD.accept as readonly string[]).includes(f.type) ||
        /\.(jpe?g|png|heic|heif|webp|pdf)$/i.test(f.name)
      ),
  );
  if (bad) {
    return NextResponse.json(
      { ok: false, error: `${bad.name} is not an accepted file.` },
      { status: 422 },
    );
  }

  const lead = parsed.data;
  const { stored } = files.length
    ? await storeFiles(files, `${lead.kind}/${Date.now()}`)
    : { stored: [] };

  const result = await deliverLead({ ...lead, attachments: stored });

  if (!result.ok) {
    console.error("Lead delivery failed", result.channels);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not submit that automatically. Please call or text us at (601) 795-7973 and we will take the details directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, attachments: stored.length });
}
