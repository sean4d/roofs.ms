import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { getProposalForUser } from "@/lib/quotes/save";
import { requestMail, resolveMail, recordPrinted } from "@/lib/quotes/delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The mail queue's three verbs, and the print receipt.
 *
 * REQUEST is a rep's, from the field. RESOLVE is the office's, once the
 * envelope is either in the post or has been refused. PRINTED is a receipt
 * fired by the browser as the print dialog opens.
 *
 * The split in permissions is the whole point of the feature. A rep can ask
 * for a mailer and can see the estimate they asked about; only an admin can
 * say that something was actually posted, or reject it. If a rep could mark
 * their own work as mailed, the board would stop being a record of what left
 * the building and go back to being a record of what somebody intended.
 */

const schema = z.object({
  quoteId: z.string().uuid(),
  action: z.enum(["request", "mailed", "rejected", "printed"]),
  /** Why the office would not post it. Shown back to the rep. */
  note: z.string().max(400).optional(),
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

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Scoped, so a rep can only act on their own customers' quotes and an admin
  // on anybody's. This is also the existence check: a quote id belonging to
  // somebody else is a 404, not a 403, so the id space cannot be probed.
  const quote = await getProposalForUser(input.quoteId, user);
  if (!quote) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    if (input.action === "printed") {
      await recordPrinted(input.quoteId);
      return NextResponse.json({ ok: true });
    }

    if (input.action === "request") {
      await requestMail(input.quoteId, user);
      return NextResponse.json({ ok: true, status: "requested" });
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Only the office can mark an estimate mailed." },
        { status: 403 },
      );
    }
    await resolveMail(
      input.quoteId,
      input.action,
      user,
      input.note?.trim() || null,
    );
    return NextResponse.json({ ok: true, status: input.action });
  } catch (error) {
    console.error("[pin] mail action failed", error);
    return NextResponse.json(
      { error: "Could not save that." },
      { status: 500 },
    );
  }
}
