import { NextResponse } from "next/server";
import { z } from "zod";

import { currentUser } from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";
import { db } from "@/lib/quotes/db";
import { emailEstimate } from "@/lib/quotes/public-quote";
import { getProposalForUser } from "@/lib/quotes/save";
import { baseUrl } from "@/lib/quotes/base-url";
import { recordEmailed } from "@/lib/quotes/delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Email a rep's estimate to the customer.
 *
 * THIS DID NOT EXIST, AND THAT WAS THE BUG. The public instant estimator has
 * emailed homeowners since it shipped, but a rep saving a quote in /pin only
 * ever got a page with "Copy link" and "Print". The "Add contact" box asked
 * for an email address and then did nothing with it, so an estimate made for a
 * customer and saved with their address was never sent to them and nothing
 * said so. The owner found it the way anybody would: he made one, and the
 * customer never got it.
 *
 * The mail itself is the same one the website sends, deliberately. A homeowner
 * who gets an estimate from a rep at the door and one from the website should
 * not receive two different-looking documents from the same company.
 *
 * Scoped through getProposalForUser, so a rep can only send their own
 * customers' quotes and cannot mail a colleague's pipeline.
 */

const schema = z.object({
  quoteId: z.string().uuid(),
  /** Optional, for a quote saved before anybody asked for an address. */
  email: z.string().email().max(200).optional(),
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
    return NextResponse.json(
      { error: "That does not look like a valid email address." },
      { status: 400 },
    );
  }

  const quote = await getProposalForUser(input.quoteId, user);
  if (!quote) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const to = input.email ?? quote.email;
  if (!to) {
    return NextResponse.json(
      { error: "Add the customer's email address first." },
      { status: 400 },
    );
  }

  // The mail is a link to the estimate, so a quote with no shareable token has
  // nothing to point at. Every quote saved since public_token shipped has one.
  if (!quote.publicToken) {
    return NextResponse.json(
      { error: "This estimate is too old to email. Save it again." },
      { status: 409 },
    );
  }

  try {
    const sent = await emailEstimate({
      to,
      name: quote.name ?? "there",
      address: quote.address,
      price: quote.priceShown ?? quote.priceLow,
      squares: quote.squares,
      url: `${baseUrl()}/estimate/${quote.publicToken}`,
    });

    // emailEstimate returns false rather than throwing when there is no API
    // key, which is right for the website (the lead still lands) and wrong
    // here: the rep is standing in front of the customer being told it went.
    if (!sent) {
      console.error("[pin] send failed: RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email is not set up on the server. Tell the office." },
        { status: 503 },
      );
    }

    // Remember the address the rep typed, so the next send does not ask again
    // and the office can see who this customer is.
    if (input.email) {
      await db()`
        UPDATE customers SET email = ${input.email}, updated_at = now()
         WHERE id = (SELECT customer_id FROM quotes WHERE id = ${input.quoteId}::uuid)
      `;
    }
    // Recorded per channel, because the map warns the next rep off this house
    // on the strength of it.
    await recordEmailed(input.quoteId, to);

    return NextResponse.json(
      { ok: true, to },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[pin] send failed", error);
    return NextResponse.json(
      { error: "Could not send it. Try again, or copy the link." },
      { status: 502 },
    );
  }
}
