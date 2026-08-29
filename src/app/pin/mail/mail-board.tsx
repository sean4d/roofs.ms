"use client";

import { useState } from "react";

import type { MailRow, MailStatus } from "@/lib/quotes/delivery";

import { QuoteEditor } from "./quote-editor";

/**
 * The three lists, and the two decisions the office makes on each one.
 *
 * REJECTION IS A FEATURE, not an error path. The office looks at an estimate
 * before it goes in an envelope, and sometimes the measurement is wrong enough
 * that posting it would cost more than not posting it. Rejecting with a reason
 * is how the rep finds out, and it is the only route by which anybody's
 * estimates get better. So the reason is required, shown back on the rep's own
 * copy of the estimate, and kept.
 */
export function MailBoard({
  requested,
  mailed,
  rejected,
}: {
  requested: MailRow[];
  mailed: MailRow[];
  rejected: MailRow[];
}) {
  const [tab, setTab] = useState<MailStatus>("requested");
  const [rows, setRows] = useState({ requested, mailed, rejected });
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resolve(row: MailRow, action: "mailed" | "rejected") {
    // A rejection without a reason is just a disappearance, and the rep whose
    // estimate it was learns nothing.
    let note: string | null = null;
    if (action === "rejected") {
      note = window.prompt(
        "Why is this one not going out? The rep sees this on their estimate.",
      );
      if (note === null) return;
      if (!note.trim()) {
        setError("A rejection needs a reason.");
        return;
      }
    }

    setBusy(row.quoteId);
    setError(null);
    try {
      const res = await fetch("/api/pin/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: row.quoteId, action, note }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save that.");
        return;
      }
      // Move it between the lists in place, so working through a morning's
      // queue is not twenty page reloads.
      const moved: MailRow = {
        ...row,
        status: action,
        note,
        handledAt: new Date().toISOString(),
        handledBy: "You",
      };
      setRows((r) => ({
        ...r,
        requested: r.requested.filter((x) => x.quoteId !== row.quoteId),
        [action]: [moved, ...r[action]],
      }));
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setBusy(null);
    }
  }

  const q = search.trim().toLowerCase();
  const list = rows[tab].filter(
    (r) =>
      !q ||
      r.address.toLowerCase().includes(q) ||
      (r.name ?? "").toLowerCase().includes(q) ||
      (r.phone ?? "").includes(q) ||
      r.requestedBy.toLowerCase().includes(q) ||
      r.quoteId.slice(0, 8).toLowerCase().includes(q),
  );

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            ["requested", "To send", rows.requested.length],
            ["mailed", "Posted", rows.mailed.length],
            ["rejected", "Rejected", rows.rejected.length],
          ] as const
        ).map(([key, label, n]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${
              tab === key
                ? "bg-[#123b63] text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-70">{n}</span>
          </button>
        ))}
      </div>

      {/* The reason the posted list exists: a homeowner rings about a price
          they were sent and somebody has to find it while they are on the
          phone. Address, name, number or the estimate number all work. */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search address, name, phone or estimate no."
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
      />

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      {list.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          {tab === "requested"
            ? "Nothing waiting. Reps request a mailer from an estimate."
            : "Nothing here yet."}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {list.map((r) => (
            <li
              key={r.quoteId}
              className="rounded-xl border border-slate-200 bg-white p-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* The thumbnail is how somebody printing forty of these spots
                    the one that measured a neighbour's roof, without opening
                    every estimate. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/pin/aerial?lat=${r.lat}&lon=${r.lon}&size=160`}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded border border-slate-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {r.name ?? "No name on file"}
                  </p>
                  <p className="text-sm text-slate-700">{r.address}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.squares} squares &middot; ${r.price.toLocaleString()}{" "}
                    &middot; no. {r.quoteId.slice(0, 8).toUpperCase()}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested by {r.requestedBy}
                    {r.requestedAt
                      ? ` on ${new Date(r.requestedAt).toLocaleDateString()}`
                      : ""}
                    {r.handledAt
                      ? ` · ${r.status === "mailed" ? "posted" : "rejected"} ${new Date(r.handledAt).toLocaleDateString()}${r.handledBy ? ` by ${r.handledBy}` : ""}`
                      : ""}
                    {r.emailedAt
                      ? ` · also emailed ${new Date(r.emailedAt).toLocaleDateString()}`
                      : ""}
                  </p>
                  {r.editedAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Corrected by {r.editedBy ?? "the office"} on{" "}
                      {new Date(r.editedAt).toLocaleDateString()}
                    </p>
                  )}
                  {r.note && (
                    <p className="mt-1.5 rounded bg-red-50 px-2 py-1 text-xs text-red-800">
                      {r.note}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <a
                    href={`/pin/proposal/${r.quoteId}`}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    Preview
                  </a>
                  {/* Straight to the four-page mail layout, so whoever is
                      standing at the printer cannot accidentally send the
                      screen version through it. */}
                  <a
                    href={`/pin/mailer/${r.quoteId}`}
                    className="rounded-lg border border-[#123b63] px-3 py-2 text-sm font-semibold text-[#123b63]"
                  >
                    Print
                  </a>
                  {tab === "requested" && (
                    <>
                      <button
                        onClick={() =>
                          setEditing(editing === r.quoteId ? null : r.quoteId)
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        {editing === r.quoteId ? "Close" : "Edit"}
                      </button>
                      <button
                        onClick={() => resolve(r, "rejected")}
                        disabled={busy === r.quoteId}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => resolve(r, "mailed")}
                        disabled={busy === r.quoteId}
                        className="rounded-lg bg-[#123b63] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {busy === r.quoteId ? "..." : "Mark posted"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Only on the queue. Once it is in the post the number is out
                  in the world, and editing it afterwards would make the
                  record disagree with the paper on the customer's table. */}
              {editing === r.quoteId && tab === "requested" && (
                <QuoteEditor
                  row={r}
                  onClose={() => setEditing(null)}
                  onSaved={(squares, price) =>
                    setRows((all) => ({
                      ...all,
                      requested: all.requested.map((x) =>
                        x.quoteId === r.quoteId
                          ? {
                              ...x,
                              squares,
                              price,
                              editedAt: new Date().toISOString(),
                              editedBy: "You",
                            }
                          : x,
                      ),
                    }))
                  }
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
