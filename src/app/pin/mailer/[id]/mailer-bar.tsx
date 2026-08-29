"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The office's controls above the mail piece.
 *
 * Print records that it happened and marking it posted is one tap from here,
 * because the two things happen thirty seconds apart at a printer and making
 * somebody navigate back to a list in between is how a stack of envelopes goes
 * out with nothing marked.
 */
export function MailerBar({
  quoteId,
  address,
}: {
  quoteId: string;
  address: string;
}) {
  const [busy, setBusy] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function print() {
    void fetch("/api/pin/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId, action: "printed" }),
      keepalive: true,
    }).catch(() => {});
    window.print();
  }

  async function markPosted() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/pin/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, action: "mailed", note: null }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) setError(data.error ?? "Could not save that.");
      else setPosted(true);
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[8.5in] flex-wrap items-center gap-2 px-3 py-2.5">
        <Link
          href="/pin/mail"
          className="rounded-lg px-2 py-2 text-sm font-medium text-slate-500"
        >
          &larr; Mailers
        </Link>
        <p className="mr-auto hidden min-w-0 flex-1 truncate text-sm text-slate-600 sm:block">
          {address}
        </p>
        <span className="mr-auto sm:hidden" />
        <Link
          href={`/pin/proposal/${quoteId}`}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Standard view
        </Link>
        <button
          onClick={print}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Print
        </button>
        <button
          onClick={markPosted}
          disabled={busy || posted}
          className="rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "..." : posted ? "Posted" : "Mark posted"}
        </button>
      </div>
      {(error || posted) && (
        <p
          className={`mx-auto max-w-[8.5in] px-3 pb-2 text-sm ${error ? "text-red-700" : "text-green-700"}`}
        >
          {error ?? "Marked posted. It will show under Posted on the board."}
        </p>
      )}
      <p className="mx-auto max-w-[8.5in] px-3 pb-2 text-xs text-slate-500">
        Four pages, two sheets double sided, folded once for a 6&times;9
        envelope.
      </p>
    </div>
  );
}
