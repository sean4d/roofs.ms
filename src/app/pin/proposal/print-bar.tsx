"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The actions on a proposal: print or save it, and copy the homeowner's link.
 *
 * "Download PDF" is the browser's own print-to-PDF rather than a PDF built on
 * the server. That is a deliberate choice, not a shortcut. Generating real
 * PDFs on Vercel means shipping a headless Chromium into the function bundle,
 * which is tens of megabytes and a cold start measured in seconds, on a tool
 * whose whole promise is a number before the rep steps off the porch. The
 * browser already has a perfect renderer and, on iOS, print goes straight into
 * the share sheet where Mail, Messages and Save to Files are one tap away.
 *
 * Marked no-print so the bar never appears on the paper.
 */
export function PrintBar({
  token,
  address,
}: {
  token: string | null;
  address: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = token
    ? `${typeof window === "undefined" ? "" : window.location.origin}/estimate/${token}`
    : null;

  async function copy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard is blocked in some in-app browsers. The link is on screen
      // below, so there is still a way through.
      setCopied(false);
    }
  }

  return (
    <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[8.5in] flex-wrap items-center gap-2 px-3 py-2.5">
        <Link
          href="/pin/map"
          className="rounded-lg px-2 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          &larr; Map
        </Link>
        {/* Hidden on a phone. Three buttons and an address do not fit in
            390px, and squeezing it produced "154 P...", which tells nobody
            anything. The address is in full two inches down the document. */}
        <p className="mr-auto hidden min-w-0 flex-1 truncate text-sm text-slate-600 sm:block">
          {address}
        </p>
        <span className="mr-auto sm:hidden" />
        {shareUrl && (
          <button
            onClick={copy}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
