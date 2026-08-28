import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_EMAILS,
  currentUser,
  deactivateUser,
  reactivateUser,
} from "@/lib/quotes/auth";
import { sameOrigin } from "@/lib/production/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Remove a rep's access, or give it back.
 *
 * Deactivates rather than deletes. A rep who leaves takes their access with
 * them immediately, but their customers and the record of what they quoted
 * have to survive them, or the first admin to remove somebody at the end of a
 * good month would lose the month.
 *
 * A seeded admin cannot be removed at all, which stops the office locking
 * itself out of its own tool, and an admin cannot remove themselves, which
 * stops the same thing happening by accident at 6pm on a Friday.
 */
const schema = z.object({
  userId: z.string().uuid(),
  action: z.enum(["remove", "restore"]),
});

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Blocked request." }, { status: 403 });
  }

  const me = await currentUser();
  if (!me) {
    return NextResponse.json(
      { error: "Sign in to continue." },
      { status: 401 },
    );
  }
  if (me.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (input.action === "remove" && input.userId === me.id) {
    return NextResponse.json(
      { error: "You cannot remove your own account." },
      { status: 400 },
    );
  }

  try {
    const ok =
      input.action === "remove"
        ? await deactivateUser(input.userId)
        : await reactivateUser(input.userId);
    if (!ok) {
      return NextResponse.json(
        {
          error:
            input.action === "remove"
              ? `That account cannot be removed. The ${ADMIN_EMAILS.length} owner accounts are permanent.`
              : "That account could not be restored.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[pin] team change failed", error);
    return NextResponse.json({ error: "Could not do that." }, { status: 500 });
  }
}
