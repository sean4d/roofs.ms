"use client";

import { useEffect } from "react";

/**
 * Records that this estimate was opened, and what the reader did next.
 *
 * The mailed piece is the only part of the system with no feedback: an
 * envelope goes out and nothing comes back until a phone rings, and nobody can
 * say which envelope caused it. The QR on a printed piece carries ?m=1, so an
 * open that arrived off paper is distinguishable from a link somebody was
 * emailed, and that difference is the whole question about whether posting
 * these is worth the postage.
 *
 * Clicks are caught by one listener on the document rather than by wiring a
 * handler onto every link, so a new phone number or button added to the page
 * later is counted without anybody remembering to instrument it.
 *
 * Fails silently and never blocks a link. A homeowner reading their estimate
 * must never wait on, or see, anything to do with this.
 */
export function TrackEstimate({ token }: { token: string }) {
  useEffect(() => {
    const via =
      new URLSearchParams(window.location.search).get("m") === "1"
        ? "mail"
        : "link";

    const send = (kind: string) => {
      const body = JSON.stringify({ kind, via });
      const url = `/api/estimate/${token}/event`;
      // keepalive so the request survives the page being replaced by a phone
      // call or a mail client opening.
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    send("opened");

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) send("call");
      else if (href.startsWith("sms:")) send("text");
      else if (href.startsWith("mailto:")) send("email");
      else if (href.includes("free-inspection")) send("inspection");
      else if (href.includes("financing")) send("financing");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [token]);

  return null;
}
