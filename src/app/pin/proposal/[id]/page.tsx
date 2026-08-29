import { redirect, notFound } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";
import { getProposalForUser } from "@/lib/quotes/save";

import { ProposalDoc } from "../proposal-doc";
import { PrintBar } from "../print-bar";
import "../print.css";

export const dynamic = "force-dynamic";

/**
 * The rep's view of a saved proposal: read it, print it, share it.
 *
 * Scoped in the query, so a rep opening a colleague's quote id gets a 404
 * rather than somebody else's customer.
 */
export default async function ProposalPage({
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
    <main className="min-h-dvh overflow-y-auto bg-slate-100 pb-20 print:min-h-0 print:pb-0">
      <PrintBar
        quoteId={data.quoteId}
        token={data.publicToken}
        address={data.address}
        customerEmail={data.email}
        mailStatus={data.mailStatus}
        mailNote={data.mailNote}
        emailedAt={data.emailedAt}
      />
      <div className="mx-auto max-w-[8.5in] px-3 py-4 print:p-0">
        <div className="shadow-xl print:shadow-none">
          <ProposalDoc
            data={data}
            aerialSrc={`/api/pin/aerial?lat=${data.lat}&lon=${data.lon}&size=400`}
          />
        </div>
      </div>
    </main>
  );
}
