import { NextResponse } from "next/server";

import { currentUser } from "@/lib/quotes/auth";
import { buildMailerPdf } from "@/lib/quotes/mailer-pdf";
import { getProposalForUser } from "@/lib/quotes/save";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * The printable mailer, as a PDF.
 *
 * THIS IS WHAT GETS PRINTED NOW. The HTML view at /pin/mailer/[id] is the
 * preview the office checks before committing paper; printing from it meant
 * asking a print dialog how tall a page is, and the answer differs by roughly
 * 280 CSS pixels between desktop Chrome and iOS Safari, which is why the same
 * four page document kept coming off a phone as five sheets. A PDF page is a
 * page: dialogs scale it to the paper and do not re-flow it.
 *
 * Scoped through getProposalForUser exactly like every other estimate view, so
 * a rep gets their own customers and an admin gets everybody's. Nothing here
 * is public: the customer's copy of this estimate is the /estimate/<token>
 * link, which has its own route and its own rules.
 */
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return new NextResponse("Sign in to continue.", { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new NextResponse("Which estimate?", { status: 400 });

  const data = await getProposalForUser(id, user);
  if (!data) return new NextResponse("Not found.", { status: 404 });

  try {
    const { bytes, filename } = await buildMailerPdf(data);
    return new NextResponse(bytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        // Inline, because the next thing that happens is somebody prints it.
        // A download that lands in a Files app is one more tap and one more
        // place for it to get lost.
        "Content-Disposition": `inline; filename="${filename}"`,
        // Names a specific property. Never a shared cache.
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[mailer-pdf] build failed", error);
    return new NextResponse("Could not build that PDF.", { status: 500 });
  }
}
