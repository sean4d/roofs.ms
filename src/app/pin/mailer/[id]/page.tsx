import { redirect, notFound } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";
import { getProposalForUser } from "@/lib/quotes/save";

import { MailerDoc } from "../../proposal/mailer-doc";
import { MailerBar } from "./mailer-bar";
import "../../proposal/print.css";

export const dynamic = "force-dynamic";

/**
 * The print view for a piece going in an envelope.
 *
 * A SEPARATE ROUTE RATHER THAN A FLAG ON THE PROPOSAL, because the office
 * reaches it from the mailer queue and reps never need it. The estimate is the
 * same estimate: nothing here changes what it is or how it was made, only how
 * it is laid out for a reader who has not met anybody from the company.
 *
 * Admin only. Reps request mailers; the office prints them.
 */
export default async function MailerPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/pin");
  if (user.role !== "admin") redirect("/pin/estimates");

  const { id } = await params;
  const data = await getProposalForUser(id, user);
  if (!data) notFound();

  return (
    <main className="min-h-dvh overflow-y-auto bg-slate-100 pb-20 print:min-h-0 print:bg-white print:pb-0">
      <MailerBar quoteId={data.quoteId} address={data.address} />
      <div className="mx-auto max-w-[8.5in] px-3 py-4 print:p-0">
        <div className="bg-white shadow-xl print:shadow-none">
          <MailerDoc
            data={data}
            aerialSrc={`/api/pin/aerial?lat=${data.lat}&lon=${data.lon}&size=640`}
          />
        </div>
      </div>
    </main>
  );
}
