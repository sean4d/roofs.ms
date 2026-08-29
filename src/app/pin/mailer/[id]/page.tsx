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
 * A SEPARATE ROUTE RATHER THAN A FLAG ON THE PROPOSAL, because it is a
 * different layout for the same estimate: nothing here changes what the quote
 * is or how it was made, only how it is set for paper.
 *
 * REPS REACH IT TOO, and that is the point. A rep who prints and posts an
 * estimate themselves rather than asking the office to must not produce a
 * different document for the customer than the office would have. There is one
 * printed estimate. Where it was printed is our business and not something a
 * homeowner should be able to see in the layout.
 *
 * Scoped through getProposalForUser, so a rep gets their own customers and an
 * admin gets everybody's, exactly as everywhere else.
 */
export default async function MailerPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/pin");

  const { id } = await params;
  const data = await getProposalForUser(id, user);
  if (!data) notFound();

  return (
    <main className="min-h-dvh overflow-y-auto bg-slate-100 pb-20 print:min-h-0 print:bg-white print:pb-0">
      <MailerBar
        quoteId={data.quoteId}
        address={data.address}
        isAdmin={user.role === "admin"}
      />
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
