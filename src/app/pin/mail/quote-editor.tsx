"use client";

import { useState } from "react";

import {
  MATERIALS,
  STORIES,
  complexityFor,
  rateFor,
  type MaterialKey,
  type StoriesKey,
} from "@/config/quote-rates";
import type { MailRow } from "@/lib/quotes/delivery";

/**
 * The office's last look before an envelope is sealed.
 *
 * A rep on a driveway, on a phone, in the sun, does not always notice that the
 * house is two storeys or that the pitch came back shallow because there is a
 * porch on the front. Once it is printed and posted, the number inside is the
 * number the company is standing behind, and there is no taking it back. So
 * whoever prints it gets one more look, with the same controls the rep had.
 *
 * The price on screen here is a preview computed the same way the rep's screen
 * computes it. What actually gets saved is priced again on the server from the
 * rate card, because a browser may choose the squares and the material and may
 * never choose what they cost.
 */

interface Item {
  label: string;
  squares: number;
  pitchOver12: number | null;
  planes: number;
  material: MaterialKey;
  stories: StoriesKey;
  lat: number;
  lon: number;
}

/** A single-roof quote has no structures list, so make it one of one. */
function itemsFrom(row: MailRow): Item[] {
  if (row.structures?.length) {
    return row.structures.map((s) => ({
      ...s,
      material: s.material as MaterialKey,
      stories: (s.stories === 2 ? 2 : 1) as StoriesKey,
    }));
  }
  return [
    {
      label: "Main roof",
      squares: row.squares,
      pitchOver12: row.pitchOver12,
      planes: row.planes,
      material: row.material as MaterialKey,
      stories: (row.stories === 2 ? 2 : 1) as StoriesKey,
      lat: row.lat,
      lon: row.lon,
    },
  ];
}

export function QuoteEditor({
  row,
  onClose,
  onSaved,
}: {
  row: MailRow;
  onClose: () => void;
  onSaved: (squares: number, price: number) => void;
}) {
  const [items, setItems] = useState<Item[]>(() => itemsFrom(row));
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = items[Math.min(active, items.length - 1)];
  const priced = items.map(
    (s) =>
      Math.round(
        (s.squares *
          rateFor({
            material: s.material,
            stories: s.stories,
            planes: s.planes,
          })) /
          50,
      ) * 50,
  );
  const total = priced.reduce((a, b) => a + b, 0);
  const totalSquares =
    Math.round(items.reduce((a, s) => a + s.squares, 0) * 10) / 10;

  const patch = (changes: Partial<Item>) =>
    setItems((list) =>
      list.map((s, i) => (i === active ? { ...s, ...changes } : s)),
    );

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/pin/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: row.quoteId, structures: items }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save that.");
        return;
      }
      onSaved(data.squares, data.price);
      onClose();
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg border-2 border-[#123b63] bg-slate-50 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#123b63]">
          ${total.toLocaleString()}
        </p>
        <p className="text-xs text-slate-600">
          {totalSquares} squares
          {items.length > 1 ? ` across ${items.length} structures` : ""}
        </p>
      </div>

      {items.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((s, i) => (
            <button
              key={`${s.lat}${s.lon}${i}`}
              onClick={() => setActive(i)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                i === active
                  ? "bg-[#123b63] text-white"
                  : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              {s.label} {s.squares.toFixed(1)}sq
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        <Step
          label="&minus;"
          onClick={() =>
            patch({
              squares: Math.max(
                1,
                Math.round((current.squares - 0.5) * 10) / 10,
              ),
            })
          }
        />
        <div className="flex-1 text-center">
          <p className="font-[family-name:var(--font-archivo)] text-xl font-bold text-slate-900">
            {current.squares.toFixed(1)}
          </p>
          <p className="text-[10px] tracking-wide text-slate-500 uppercase">
            squares
          </p>
        </div>
        <Step
          label="+"
          onClick={() =>
            patch({ squares: Math.round((current.squares + 0.5) * 10) / 10 })
          }
        />
      </div>

      <div className="mt-3 space-y-2.5">
        <Choice
          label="Stories"
          value={current.stories}
          options={[1, 2] as StoriesKey[]}
          render={(v) => STORIES[v].label}
          onChange={(v) => patch({ stories: v })}
        />
        <Choice
          label="Pitch"
          value={current.pitchOver12 ?? 5}
          options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12]}
          render={(v) => (v === 0 ? "Flat" : `${v}:12`)}
          onChange={(v) => patch({ pitchOver12: v })}
        />
        <Choice
          label="Material"
          value={current.material}
          options={Object.keys(MATERIALS) as MaterialKey[]}
          render={(v) =>
            MATERIALS[v].label.replace(" shingle", "").replace(" (flat)", "")
          }
          onChange={(v) => patch({ material: v })}
        />
        <p className="text-[11px] text-slate-500">
          {current.planes} planes,{" "}
          {complexityFor(current.planes).label.toLowerCase()} cut.
        </p>
      </div>

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save and reprice"}
        </button>
      </div>
    </div>
  );
}

function Step({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-10 w-10 shrink-0 rounded-full border border-slate-300 bg-white text-lg font-bold text-[#123b63]"
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}

function Choice<T extends string | number>({
  label,
  value,
  options,
  render,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  render: (v: T) => string;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o)}
            onClick={() => onChange(o)}
            className={`rounded-lg px-2.5 py-1.5 text-sm font-medium ${
              o === value
                ? "bg-[#123b63] text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
