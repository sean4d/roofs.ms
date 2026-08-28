import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser } from "@/lib/quotes/auth";
import { saveProfile } from "@/lib/quotes/profile";
import { sameOrigin } from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Save the company profile. Admins only.
 *
 * THE LOGO SIZE CAP IS LOAD BEARING. The logo is stored as a data URI in the
 * row, which is the right call for one small image belonging to one company:
 * no bucket to provision, no second set of credentials, nothing extra to back
 * up. It only stays the right call while the image stays small, so anything
 * over 400KB is refused rather than quietly bloating every proposal render.
 */

const MAX_LOGO_BYTES = 400_000;

const schema = z.object({
  legalName: z.string().max(120).optional(),
  displayName: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  email: z.string().max(200).optional(),
  website: z.string().max(120).optional(),
  street: z.string().max(160).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  postal: z.string().max(20).optional(),
  license: z.string().max(60).optional(),
  warranty: z.string().max(200).optional(),
  financingLine: z.string().max(200).optional(),
  credentials: z.array(z.string().max(160)).max(12).optional(),
  headline: z.string().max(200).optional(),
  closingLine: z.string().max(800).optional(),
  // Hex only. An arbitrary string here would be injected straight into a
  // style attribute on a document we send to customers.
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #123b63")
    .optional(),
  logoDataUri: z
    .string()
    .max(MAX_LOGO_BYTES)
    .regex(/^data:image\/(png|jpeg|svg\+xml|webp);base64,/, "Unsupported image")
    .nullable()
    .optional(),
  showStorms: z.boolean().optional(),
  showInsurance: z.boolean().optional(),
  showFinancing: z.boolean().optional(),
});

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

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? (error.issues[0]?.message ?? "Check those values.")
        : "Check those values.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await saveProfile(input, user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[profile] save failed", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
