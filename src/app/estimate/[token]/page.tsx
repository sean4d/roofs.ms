import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { getProposalByToken } from "@/lib/quotes/save";
import { ProposalDoc } from "@/app/pin/proposal/proposal-doc";
import { siteConfig } from "@/config/site";

import { ensureDelivered } from "@/lib/roofgo-lead";

import { TrackEstimate } from "./track";
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

/**
 * Estimates made before this moment were copied into RoofGo, token and all,
 * so their links and QR codes forward there. A day early on purpose: the
 * import ran during 2026-10-11, and anything made that day stays here, where
 * it certainly exists, rather than risk a link that lands on nothing.
 */
const MOVED_BEFORE = Date.parse("2026-10-11T00:00:00Z");

export default async function PublicEstimate({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ m?: string }>;
}) {
  const { token } = await params;
  if (!token || token.length < 20) notFound();
  const data = await getProposalByToken(token);
  if (!data) {
    /*
     * Not in /pin: since SE8 (2026-10-15) website estimates are saved in
     * RoofGo under the token minted here, so forward it. If this site has not
     * managed to hand that estimate to RoofGo yet (RoofGo was down), try once
     * more now, and if it still is not there say so instead of sending the
     * homeowner to a page that would 404.
     */
    let state: Awaited<ReturnType<typeof ensureDelivered>> = "unknown";
    try {
      state = await ensureDelivered(token);
    } catch (error) {
      console.error("[estimate] RoofGo outbox check failed", error);
    }
    if (state === "pending") return <BeingPrepared />;
    const { m } = await searchParams;
    redirect(
      `${siteConfig.roofgoEstimateOrigin}/estimate/${encodeURIComponent(token)}${m === "1" ? "?m=1" : ""}`,
    );
  }

  if (Date.parse(data.createdAt) < MOVED_BEFORE) {
    // ?m=1 rides along so RoofGo still counts it as a mailer QR scan.
    const { m } = await searchParams;
    redirect(
      `${siteConfig.roofgoEstimateOrigin}/estimate/${encodeURIComponent(token)}${m === "1" ? "?m=1" : ""}`,
    );
  }

  return (
    <main className="min-h-dvh bg-slate-100 py-4 print:bg-white print:py-0">
      <TrackEstimate token={token} />
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
          {/*
            THERE IS NO TEXT BUTTON, BECAUSE THE NUMBER IS A LANDLINE.

            This used to offer "Text us" on an sms: link, on the reasoning that
            texting converts on a mail piece where calling does not: a homeowner
            unsure what to say will send four words but will not dial. The
            reasoning is sound and the button was still broken, and broken in
            the worst way, silently. The messages app opens, they type, they
            send, and it arrives nowhere. This is the page the mailer's QR code
            lands on, so it was the exact end of the journey the piece exists to
            start.

            "Book a free inspection" now carries that need: it is the option for
            somebody who does not want to talk to anybody yet.

            IF THE NUMBER EVER TAKES TEXTS, bring the button back. The
            conversion argument was never the problem.
          */}
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

/** The estimate exists, RoofGo just does not have it yet. Rare, and brief. */
function BeingPrepared() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10">
      <div className="max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        <h1 className="text-xl font-bold text-[#123b63]">
          Your estimate is being prepared
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Your price is saved and we have your details. The full estimate will
          be ready at this same link in a few minutes. If you would rather talk
          it through now, call us.
        </p>
        <a
          href={`tel:${siteConfig.phone.tel}`}
          className="mt-5 inline-block rounded-lg bg-[#123b63] px-5 py-3 text-sm font-semibold text-white"
        >
          Call {siteConfig.phone.display}
        </a>
      </div>
    </main>
  );
}
