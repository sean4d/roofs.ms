import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";
import { listMail } from "@/lib/quotes/delivery";

import { PinNav } from "../pin-nav";
import { MailBoard } from "./mail-board";

export const dynamic = "force-dynamic";

/**
 * The office's mail board.
 *
 * Three lists rather than one filtered table, because they are three different
 * jobs: a queue to work through this morning, a record to search when a
 * homeowner rings, and a pile of estimates that were not good enough to post.
 *
 * Admin only. A rep can ask for a mailer and can see what happened to their
 * own, but who actually put an envelope in the post is the office's record and
 * nobody else's to write.
 */
export default async function MailPage() {
  const user = await currentUser();
  if (!user) redirect("/pin");
  if (user.role !== "admin") redirect("/pin/estimates");

  const [requested, mailed, rejected] = await Promise.all([
    listMail("requested"),
    listMail("mailed"),
    listMail("rejected"),
  ]);

  return (
    <>
      <PinNav user={user} active="mail" mailQueue={requested.length} />
      <main className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#123b63]">
            Mailers
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Estimates reps have asked the office to print and post, and
            everything that has already gone out.
          </p>
          <MailBoard
            requested={requested}
            mailed={mailed}
            rejected={rejected}
          />
        </div>
      </main>
    </>
  );
}
