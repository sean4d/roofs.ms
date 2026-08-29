"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The actions on a proposal: send it, copy the link, or print it.
 *
 * "Print" is the browser's own print-to-PDF rather than a PDF built on the
 * server. That is a deliberate choice, not a shortcut. Generating real PDFs on
 * Vercel means shipping a headless Chromium into the function bundle, which is
 * tens of megabytes and a cold start measured in seconds, on a tool whose
 * whole promise is a number before the rep steps off the porch. The browser
 * already has a perfect renderer and, on iOS, print goes straight into the
 * share sheet where Mail, Messages and Save to Files are one tap away.
 *
 * SEND CAME LAST AND SHOULD HAVE COME FIRST. There was no way to email a
 * customer their estimate from here. The rep typed an address into "add
 * contact", it was saved, and nothing was ever sent to it. An estimate the
 * customer never receives is not an estimate, and nothing on screen said so.
 *
 * Marked no-print so the bar never appears on the paper.
 */
export function PrintBar({
  quoteId,
  token,
  address,
  customerEmail,
}: {
  quoteId: string;
  token: string | null;
  address: string;
  customerEmail: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState(customerEmail ?? "");
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function send() {
    // No address on file means ask for one here rather than failing at the
    // server, which is a round trip and a shrug in front of a customer.
    if (!email.trim()) {
      setAsking(true);
      setError(null);
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/pin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not send it.");
        setAsking(true);
      } else {
        setSent(data.to);
        setAsking(false);
      }
    } catch {
      setError("Lost the connection. Try again.");
      setAsking(true);
    } finally {
      setSending(false);
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
        {/* Hidden on a phone. Buttons and an address do not fit in 390px, and
            squeezing it produced "154 P...", which tells nobody anything. The
            address is in full two inches down the document. */}
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
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Print
        </button>
        <button
          onClick={send}
          disabled={sending || !token}
          className="rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : sent ? "Sent" : "Email it"}
        </button>
      </div>

      {(asking || error || sent) && (
        <div className="mx-auto max-w-[8.5in] px-3 pb-3">
          {sent ? (
            <p className="text-sm text-green-700">
              Sent to {sent}. It comes from estimates@southeastroofing.llc, so
              have them check spam if it is not there in a minute.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Customer's email address"
                type="email"
                inputMode="email"
                autoCapitalize="off"
                autoCorrect="off"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
              />
              <button
                onClick={send}
                disabled={sending}
                className="rounded-lg bg-[#123b63] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          )}
          {error && <p className="mt-1.5 text-sm text-red-700">{error}</p>}
        </div>
      )}
    </div>
  );
}
