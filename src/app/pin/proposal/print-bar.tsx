"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The actions on a proposal: send it, copy the link, or print it.
 *
 * "Print" goes to the mailer route, which is where the printed document lives.
 * That page previews the piece and hands over a real PDF built on the server.
 *
 * This used to be the browser's own print-to-PDF, on the reasoning that
 * generating PDFs on Vercel means shipping a headless Chromium into the
 * function bundle. That reasoning was sound and the conclusion was still
 * wrong: the piece is four pages by design and the browser would not hold it
 * there, because iOS Safari's printable area is about 280 CSS pixels shorter
 * than a desktop browser's and no stylesheet satisfies both. The PDF is drawn
 * directly instead, in lib/quotes/mailer-pdf, with no browser involved and
 * nothing added to the bundle but a small pure-JS writer.
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
  mailStatus,
  mailNote,
  emailedAt,
}: {
  quoteId: string;
  token: string | null;
  address: string;
  customerEmail: string | null;
  mailStatus: "requested" | "mailed" | "rejected" | null;
  mailNote: string | null;
  emailedAt: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState(customerEmail ?? "");
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mail, setMail] = useState(mailStatus);
  const [mailing, setMailing] = useState(false);

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

  /**
   * Ask the office to print this one and put it in an envelope.
   *
   * A rep cannot mark anything as posted, only as requested. If they could,
   * the board would stop being a record of what left the building and go back
   * to being a record of what somebody intended to do.
   */
  async function requestMail() {
    // A rep on a slow connection taps twice. The button is disabled once the
    // state lands, but the guard closes the window before it does.
    if (mailing || mail === "requested" || mail === "mailed") return;
    setMailing(true);
    setError(null);
    try {
      const res = await fetch("/api/pin/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, action: "request" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        setError(data.error ?? "Could not request that.");
      else setMail("requested");
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setMailing(false);
    }
  }

  /**
   * Print goes to the print layout, not to this screen.
   *
   * ONE PRINTED ESTIMATE, whoever prints it. A rep who runs one off and posts
   * it themselves rather than asking the office to must not hand the customer
   * a different-looking document than the office would have. This page is for
   * reading and sending on a phone; the mailer route is what paper looks like.
   *
   * The emailed copy is the one that is allowed to differ, because it goes to
   * somebody the rep has already spoken to.
   */

  const mailLabel =
    mail === "mailed"
      ? "Posted"
      : mail === "requested"
        ? "Mailer requested"
        : mail === "rejected"
          ? "Mailer rejected"
          : "Request mailer";

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
        <Link
          href={`/pin/mailer/${quoteId}`}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Print
        </Link>
        <button
          onClick={requestMail}
          disabled={mailing || mail === "requested" || mail === "mailed"}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {mailing ? "..." : mailLabel}
        </button>
        <button
          onClick={send}
          disabled={sending || !token}
          className="rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : sent ? "Sent" : "Email it"}
        </button>
      </div>

      {/* What has actually reached this customer. The rep needs it in front
          of them before they decide what to do next, not buried in an admin
          screen they will not open while standing on a driveway. */}
      {(emailedAt || mail) && (
        <div className="mx-auto flex max-w-[8.5in] flex-wrap gap-x-4 gap-y-1 px-3 pb-2 text-xs text-slate-600">
          {emailedAt && (
            <span>
              Emailed {new Date(emailedAt).toLocaleDateString()}
              {customerEmail ? ` to ${customerEmail}` : ""}
            </span>
          )}
          {mail === "requested" && (
            <span className="font-semibold text-amber-700">
              Mailer requested. The office will print it and send it.
            </span>
          )}
          {mail === "mailed" && (
            <span className="font-semibold text-green-700">Posted</span>
          )}
          {mail === "rejected" && (
            <span className="font-semibold text-red-700">
              Mailer rejected{mailNote ? `: ${mailNote}` : ""}
            </span>
          )}
        </div>
      )}

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
