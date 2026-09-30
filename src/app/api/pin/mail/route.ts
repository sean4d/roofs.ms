import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { getProposalForUser } from "@/lib/quotes/save";
import {
  markReturned,
  recordAddressCheck,
  recordPrinted,
  requestMail,
  resolveMail,
} from "@/lib/quotes/delivery";
import { checkAddress } from "@/lib/quotes/address-check";
import { RETURN_CODES } from "@/lib/quotes/return-codes";

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
  action: z.enum(["request", "mailed", "rejected", "printed", "returned"]),
  /** Which yellow label came back. Required on "returned", ignored elsewhere. */
  returnCode: z
    .enum(Object.keys(RETURN_CODES) as [string, ...string[]])
    .optional(),
  /**
   * Why the office would not post it. Shown back to the rep.
   *
   * NULLABLE, not merely optional. Zod's .optional() admits undefined and
   * rejects null, and the board sends `note: null` on every "mark posted"
   * because there is no reason to give for posting something. So the one
   * button the whole queue exists for answered "Bad request" and did nothing.
   */
  note: z.string().max(400).nullable().optional(),
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
      /**
       * THE ADDRESS IS CHECKED HERE AND NOWHERE ELSE.
       *
       * This is the single door into the print queue, so it is the only place
       * that has to hold. Checking on the board instead would mean the rep
       * hears about a bad address days later, from somebody else, about a
       * house they are no longer standing in front of.
       *
       * A block is a 422 rather than a 400: the request was well formed, the
       * world just will not accept it. The reason goes back verbatim because
       * the rep can usually fix it from the driveway by reading the mailbox.
       */
      const check = await checkAddress(quote.address);
      if (check.verdict === "blocked") {
        await recordAddressCheck(input.quoteId, "blocked", check.reason);
        return NextResponse.json(
          {
            error: check.reason,
            blocked: true,
            standardized: check.standardized,
          },
          { status: 422 },
        );
      }

      await requestMail(input.quoteId, user);
      // "unknown" is recorded too, and deliberately. In three months the only
      // way to tell a mailer that went out verified from one that went out
      // while Google was unreachable is if the row said so at the time.
      await recordAddressCheck(input.quoteId, check.verdict, check.reason);
      return NextResponse.json({
        ok: true,
        status: "requested",
        checked: check.verdict,
        note: check.reason,
      });
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Only the office can mark an estimate mailed." },
        { status: 403 },
      );
    }

    if (input.action === "returned") {
      if (!input.returnCode) {
        return NextResponse.json(
          { error: "Pick what the label said." },
          { status: 400 },
        );
      }
      const saved = await markReturned(
        input.quoteId,
        input.returnCode as keyof typeof RETURN_CODES,
        user,
        input.note?.trim() || null,
      );
      if (!saved) {
        return NextResponse.json(
          {
            error:
              "Returned mail needs the latest database migration. Run it from Settings and try again.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ ok: true, status: "returned" });
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
