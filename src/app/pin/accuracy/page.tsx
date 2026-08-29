import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";
import { mailQueueSize } from "@/lib/quotes/delivery";
import { accuracy } from "@/lib/quotes/accuracy";
import { searchQuotes } from "@/lib/quotes/list";

import { PinNav } from "../pin-nav";
import { AccuracyBoard } from "./accuracy-board";

export const dynamic = "force-dynamic";

/**
 * How close the tool actually gets, measured against real roofs.
 *
 * The estimator was calibrated on four houses. Every job the company closes
 * produces a real takeoff and none of it was written down anywhere the tool
 * could see it, so the answer to "how accurate is this" has been an educated
 * guess since the day it shipped. This is where that stops being a guess.
 *
 * Admin only. The number a rep needs is on their estimate; this is the
 * company's own scorecard and it is nobody's performance review.
 */
export default async function AccuracyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/pin");
  if (user.role !== "admin") redirect("/pin/estimates");

  const { q = "" } = await searchParams;
  const [data, found, mailQueue] = await Promise.all([
    accuracy(),
    q ? searchQuotes(user, q) : Promise.resolve([]),
    mailQueueSize(),
  ]);

  return (
    <>
      <PinNav user={user} active="accuracy" mailQueue={mailQueue} />
      <main className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#123b63]">
            Measurement accuracy
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Type in the real takeoff once a job has been measured properly. Each
            one you record makes the next estimate better, because it is the
            only way the tool can find out whether it was right.
          </p>
          <AccuracyBoard data={data} found={found} query={q} />
        </div>
      </main>
    </>
  );
}
