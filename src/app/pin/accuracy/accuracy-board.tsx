"use client";

import { useState } from "react";

import type { Accuracy } from "@/lib/quotes/accuracy";
import type { QuoteListRow } from "@/lib/quotes/list";

/**
 * The scorecard, and the box that fills it in.
 *
 * BIAS IS THE HEADLINE, not average error, and the distinction decides what
 * can be done about it. A tool that reads 8% light on every roof is fixed with
 * one multiplier and nobody ever notices again. A tool that is 8% out in
 * random directions cannot be fixed at all and has to be presented honestly as
 * a range. Those two look identical if you only track how wrong things are.
 *
 * Nothing is shown until there are enough rows to mean anything. Ten is not a
 * real threshold from statistics, it is the point below which a single odd
 * house moves every figure on the page, and a number that swings with one
 * entry teaches the wrong lesson faster than no number at all.
 */
const ENOUGH_TO_MEAN_SOMETHING = 10;

export function AccuracyBoard({
  data,
  found,
  query,
}: {
  data: Accuracy;
  found: QuoteListRow[];
  query: string;
}) {
  // Straight from the server. Every change reloads, so there is exactly one
  // place the numbers on this page are computed.
  const rows = data.rows;
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function record(quoteId: string) {
    const raw = (drafts[quoteId] ?? "").trim();
    if (!raw) {
      setError("Enter the takeoff in squares, like 27.5");
      return;
    }
    const squares = Number(raw);
    if (!Number.isFinite(squares) || squares <= 0) {
      setError("Enter the takeoff in squares, like 27.5");
      return;
    }
    await send(quoteId, squares);
  }

  /** Clear a recorded takeoff. Explicit rather than "record an empty box":
   *  that read the draft state a keystroke before React had applied it. */
  async function clear(quoteId: string) {
    await send(quoteId, null);
  }

  async function send(quoteId: string, squares: number | null) {
    setSaving(quoteId);
    setError(null);
    try {
      const res = await fetch("/api/pin/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, actualSquares: squares }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save that.");
        return;
      }
      // The page reloads so the statistics are recomputed server side. Doing
      // that arithmetic twice, once here and once there, is how two versions
      // of the truth start.
      window.location.reload();
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setSaving(null);
    }
  }

  const pct = (v: number | null, signed = false) =>
    v === null ? "--" : `${signed && v > 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

  return (
    <div className="mt-5 space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        {data.n < ENOUGH_TO_MEAN_SOMETHING ? (
          <>
            <p className="text-sm font-semibold text-slate-900">
              {data.n} of {ENOUGH_TO_MEAN_SOMETHING} recorded
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Figures appear once there are ten. Below that a single unusual
              house moves every number on this page, and a statistic that swings
              with one entry is worse than none.
            </p>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat
                label="Bias"
                value={pct(data.bias, true)}
                hint="Positive means the imagery reads high. One multiplier cancels this out."
              />
              <Stat
                label="Typical error"
                value={pct(data.meanAbsolute)}
                hint="How wrong an average roof is, either direction."
              />
              <Stat
                label="Median"
                value={pct(data.median)}
                hint="The middle house. A couple of disasters cannot drag it."
              />
              <Stat
                label="Within 10%"
                value={pct(data.within10)}
                hint="Share of roofs close enough to quote from."
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Measured against what the imagery produced, not what went on the
              paper. A rep&rsquo;s correction already applied would hide whether
              the machine was right, which is the question this answers. Across{" "}
              {data.n} roofs.
            </p>
          </>
        )}
      </section>

      <section>
        <h2 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
          Record a takeoff
        </h2>
        <form className="mt-2 flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Estimate number, address, name or phone"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#123b63] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Find
          </button>
        </form>

        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

        {query && found.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            Nothing matches &ldquo;{query}&rdquo;.
          </p>
        )}

        {found.length > 0 && (
          <ul className="mt-3 space-y-2">
            {found.map((r) => (
              <li
                key={r.quoteId}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {r.name ?? "Homeowner"}
                </p>
                <p className="truncate text-xs text-slate-600">{r.address}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {r.shortId} &middot; quoted {r.squares} squares &middot;{" "}
                  {r.createdAt.slice(0, 10)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    inputMode="decimal"
                    placeholder="Real takeoff, squares"
                    value={drafts[r.quoteId] ?? ""}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [r.quoteId]: e.target.value }))
                    }
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base outline-none focus:border-[#123b63]"
                  />
                  <button
                    onClick={() => record(r.quoteId)}
                    disabled={saving === r.quoteId}
                    className="shrink-0 rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving === r.quoteId ? "..." : "Record"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
          Recorded ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            Nothing yet. Find an estimate above and type in what the roof
            actually measured.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {rows.map((r) => (
              <li
                key={r.quoteId}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="min-w-0 truncate text-sm text-slate-800">
                    {r.address}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      r.errorFraction === null
                        ? "text-slate-400"
                        : Math.abs(r.errorFraction) <= 0.1
                          ? "text-green-700"
                          : "text-red-700"
                    }`}
                  >
                    {r.errorFraction === null
                      ? "no machine figure"
                      : pct(r.errorFraction, true)}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  imagery {r.measured ?? "--"} &middot; quoted {r.quoted}{" "}
                  &middot; actual {r.actual} squares
                </p>
                <button
                  onClick={() => void clear(r.quoteId)}
                  disabled={saving === r.quoteId}
                  className="mt-1 text-[11px] text-slate-400 underline underline-offset-2 disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="font-[family-name:var(--font-archivo)] text-xl font-extrabold text-[#123b63]">
        {value}
      </p>
      <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{hint}</p>
    </div>
  );
}
