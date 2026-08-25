import { NextResponse } from "next/server";

import { deliverLead } from "@/lib/leads/deliver";
import { leadSchema } from "@/lib/leads/types";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/**
 * Lead intake.
 *
 * Defence in depth without a CAPTCHA: a honeypot field the schema requires to
 * be empty, per-IP rate limiting, and strict server-side validation. Nobody
 * should have to identify a crosswalk to ask for a quote.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
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

  const result = await deliverLead(parsed.data);

  if (!result.ok) {
    // Log for the operator; never leak channel internals to the browser.
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

  return NextResponse.json({ ok: true });
}
