import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProposalByToken } from "@/lib/quotes/save";
import { ProposalDoc } from "@/app/pin/proposal/proposal-doc";
import { siteConfig } from "@/config/site";
import "@/app/pin/proposal/print.css";

export const dynamic = "force-dynamic";

/**
 * The homeowner's own copy, no account needed.
 *
 * The token in the URL is the credential, so this page shows exactly one
 * estimate and nothing else: no rep, no pipeline, no other customer, no way to
 * walk to a second one. It is noindex because it names a person's address and
 * the price we quoted them, and a search engine finding it would be a leak
 * even though the link is unguessable.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Your roof estimate",
};

export default async function PublicEstimate({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getProposalByToken(token);
  if (!data) notFound();

  return (
    <main className="min-h-dvh bg-slate-100 py-4 print:bg-white print:py-0">
      <div className="mx-auto max-w-[8.5in] px-3 print:p-0">
        <div className="shadow-xl print:shadow-none">
          <ProposalDoc
            data={data}
            aerialSrc={`/api/estimate/${token}/aerial`}
          />
        </div>
        <div className="no-print mt-4 flex flex-wrap justify-center gap-3 pb-10">
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="rounded-lg bg-[#123b63] px-5 py-3 text-sm font-semibold text-white"
          >
            Call {siteConfig.phone.display}
          </a>
          <a
            href={`${siteConfig.url}/free-inspection`}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Book a free inspection
          </a>
          {/* Somebody who scanned a QR code off a mailer has never seen the
              company. The estimate proves we measured their roof; the site is
              where they check we are real, which is the question they are
              actually asking at this point. */}
          <a
            href={siteConfig.url}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Check us out online
          </a>
        </div>
      </div>
    </main>
  );
}
