import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/quotes/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * What a homeowner did with the estimate we sent them.
 *
 * PUBLIC BY NECESSITY, which shapes everything about it. The people this
 * records are homeowners opening their own estimate, and they have no account.
 * So the only thing that can be trusted is the token, and the token is a
 * 24-byte secret that only reaches somebody we actually sent an estimate to.
 *
 * What that buys an attacker who guesses one is a row in a counter table. It
 * cannot read the estimate, cannot change it and cannot learn anything. The
 * damage a wrong row does is a slightly wrong conversion figure, which is why
 * this is a log and not a billing system.
 *
 * NO PERSONAL DATA. A row says an estimate was opened or a number was tapped.
 * Not by whom, not from where, no address, no fingerprint. If we ever want to
 * know more than that, it should be a decision somebody makes deliberately
 * rather than something that accumulated because the column was there.
 */

const schema = z.object({
  kind: z.enum(["opened", "call", "text", "email", "inspection", "financing"]),
  /** How they arrived. "mail" when the QR on a printed piece brought them. */
  via: z.enum(["mail", "link"]).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  // Same length guard the estimate page uses. A short token cannot be real, so
  // it is refused before it reaches the database.
  if (!token || token.length < 20) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    // Resolved through the token in the same statement that inserts, so an
    // unknown token writes nothing at all rather than a row pointing nowhere.
    await db()`
      INSERT INTO estimate_events (quote_id, kind, via)
      SELECT id, ${input.kind}, ${input.via ?? "link"}
        FROM quotes WHERE public_token = ${token}
    `;
  } catch (error) {
    // Never fatal. This is a page a customer is reading; a analytics failure
    // must not be something they can see.
    console.error("[estimate] event not recorded", error);
  }

  // Always the same answer, so a probe cannot tell a real token from a wrong
  // one by watching the response.
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
