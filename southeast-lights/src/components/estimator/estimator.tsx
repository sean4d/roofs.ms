"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw } from "lucide-react";

import {
  COLOR_SCHEMES,
  HouseSvg,
  type ElementKey,
  type SchemeKey,
} from "@/components/estimator/house-svg";
import {
  ESTIMATOR_OPTIONS,
  OPTION_GROUPS,
  TREE_OPTIONS,
} from "@/config/estimator";
import { HOLIDAY } from "@/config/pricing";
import { track } from "@/lib/analytics";
import { cn, formatUsd } from "@/lib/utils";

/**
 * The interactive estimator.
 *
 * Design decisions worth stating:
 *   - The illustration is sticky on desktop so the house stays visible while
 *     the controls scroll. On mobile it sits above the controls and the total
 *     is pinned, because on a phone the number is what people are chasing.
 *   - Selections drive BOTH the price and the illumination, from one state
 *     object, so the drawing can never disagree with the total.
 *   - The $1,000 minimum is applied silently and explained in a line of copy
 *     rather than a modal. Nobody needs a pop-up to be told a floor exists.
 *   - Estate trees carry no price. They produce a "quoted after review" state
 *     instead of a number that could be badly wrong in either direction.
 */

type Quantities = Record<string, number>;

const initialQuantities = (): Quantities =>
  Object.fromEntries(
    ESTIMATOR_OPTIONS.map((option) => [
      option.key,
      // Start with the primary roofline on: an empty house looks broken.
      option.key === "mainRoof" ? option.defaultQuantity : 0,
    ]),
  );

export function Estimator() {
  const [quantities, setQuantities] = useState<Quantities>(initialQuantities);
  const [treeCounts, setTreeCounts] = useState<Record<string, number>>({});
  const [scheme, setScheme] = useState<SchemeKey>("warm-white");
  const [started, setStarted] = useState(false);

  const begin = () => {
    if (!started) {
      setStarted(true);
      track("estimator_start");
    }
  };

  const setQuantity = (key: string, value: number) => {
    begin();
    setQuantities((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (key: string) => {
    begin();
    const option = ESTIMATOR_OPTIONS.find((o) => o.key === key);
    if (!option) return;
    setQuantities((prev) => ({
      ...prev,
      [key]: prev[key] > 0 ? 0 : option.defaultQuantity,
    }));
  };

  const setTree = (key: string, count: number) => {
    begin();
    setTreeCounts((prev) => ({ ...prev, [key]: Math.max(0, count) }));
  };

  const reset = () => {
    setQuantities(initialQuantities());
    setTreeCounts({});
    setScheme("warm-white");
  };

  const active = useMemo(() => {
    const set = new Set<ElementKey>();
    for (const option of ESTIMATOR_OPTIONS) {
      if ((quantities[option.key] ?? 0) > 0) set.add(option.element);
    }
    if (Object.values(treeCounts).some((n) => n > 0)) set.add("trees");
    return set;
  }, [quantities, treeCounts]);

  const quote = useMemo(() => {
    const lines: { label: string; amount: number | null }[] = [];
    let subtotal = 0;

    for (const option of ESTIMATOR_OPTIONS) {
      const quantity = quantities[option.key] ?? 0;
      if (quantity <= 0) continue;

      if (option.price === null) {
        lines.push({ label: option.label, amount: null });
        continue;
      }

      const amount =
        option.mode === "fixed" ? option.price : option.price * quantity;
      subtotal += amount;
      lines.push({
        label:
          option.mode === "perFoot"
            ? `${option.label} · ${quantity} ${option.unit}`
            : option.mode === "perUnit"
              ? `${option.label} · ${quantity}`
              : option.label,
        amount,
      });
    }

    let needsReview = false;
    for (const tree of TREE_OPTIONS) {
      const count = treeCounts[tree.key] ?? 0;
      if (count <= 0) continue;
      if (tree.price === null) {
        needsReview = true;
        lines.push({ label: `${tree.label} trees · ${count}`, amount: null });
        continue;
      }
      const amount = tree.price * count;
      subtotal += amount;
      lines.push({ label: `${tree.label} trees · ${count}`, amount });
    }

    const total = subtotal > 0 ? Math.max(subtotal, HOLIDAY.minimum) : 0;
    return {
      lines,
      subtotal,
      total,
      minimumApplied: subtotal > 0 && subtotal < HOLIDAY.minimum,
      needsReview,
    };
  }, [quantities, treeCounts]);

  const low = Math.round((quote.total * 0.9) / 50) * 50;
  const high = Math.round((quote.total * 1.15) / 50) * 50;

  return (
    <div className="container-site grid gap-8 py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:py-16">
      {/* ---------- illustration + total ---------- */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="card-lit overflow-hidden p-3 sm:p-5">
          <HouseSvg active={active} scheme={scheme} className="w-full" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(COLOR_SCHEMES) as SchemeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                begin();
                setScheme(key);
              }}
              aria-pressed={scheme === key}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors",
                scheme === key
                  ? "border-champagne-400/50 bg-champagne-400/10 text-champagne-200"
                  : "border-white/10 text-bone-400 hover:text-bone-200",
              )}
            >
              <span className="flex gap-0.5">
                {COLOR_SCHEMES[key].colors.slice(0, 3).map((color) => (
                  <span
                    key={color}
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              {COLOR_SCHEMES[key].label}
            </button>
          ))}
        </div>

        <div className="mt-5 card-lit p-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="eyebrow text-champagne-500">Estimated range</span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-bone-500 hover:text-bone-300"
            >
              <RotateCcw className="size-3" strokeWidth={2} />
              Reset
            </button>
          </div>

          <p className="mt-2 font-display text-3xl font-semibold text-champagne-300 tabular-nums sm:text-4xl">
            {quote.total > 0 ? `${formatUsd(low)} - ${formatUsd(high)}` : "—"}
          </p>

          {quote.needsReview ? (
            <p className="mt-3 text-sm text-champagne-200">
              Estate and specimen trees are quoted after we see them. The range
              above excludes them.
            </p>
          ) : null}

          {quote.minimumApplied ? (
            <p className="mt-3 text-sm text-bone-400">
              Professional residential installations begin at{" "}
              {formatUsd(HOLIDAY.minimum)}.
            </p>
          ) : null}

          {quote.lines.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm">
              {quote.lines.map((line) => (
                <li
                  key={line.label}
                  className="flex justify-between gap-4 text-bone-400"
                >
                  <span>{line.label}</span>
                  <span className="tabular-nums text-bone-200">
                    {line.amount === null ? "Quoted" : formatUsd(line.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-bone-500">
              Choose what you would like lit and the house will show you.
            </p>
          )}

          <Link
            href="/quote"
            onClick={() =>
              track("estimator_complete", {
                total: quote.total,
                scheme,
              })
            }
            className="btn-primary mt-6 w-full"
          >
            Get my exact quote
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-bone-500">
            <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
            Ballpark estimate only. Final pricing is confirmed after we review
            the property and complete the design.
          </p>
        </div>
      </div>

      {/* ---------- controls ---------- */}
      <div className="flex flex-col gap-8">
        {OPTION_GROUPS.map((group) => (
          <fieldset key={group.key} className="flex flex-col gap-3">
            <legend className="eyebrow mb-1 text-champagne-500">
              {group.label}
            </legend>
            {ESTIMATOR_OPTIONS.filter((option) => option.group === group.key).map(
              (option) => {
                const quantity = quantities[option.key] ?? 0;
                const isOn = quantity > 0;
                return (
                  <div
                    key={option.key}
                    className={cn(
                      "rounded-card border p-5 transition-colors",
                      isOn
                        ? "border-champagne-400/35 bg-champagne-400/[0.05]"
                        : "border-white/10 bg-white/[0.02]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <label
                          htmlFor={`opt-${option.key}`}
                          className="font-medium text-bone-100"
                        >
                          {option.label}
                        </label>
                        <p className="mt-1 text-sm text-bone-500">
                          {option.detail}
                        </p>
                      </div>
                      <button
                        id={`opt-${option.key}`}
                        type="button"
                        role="switch"
                        aria-checked={isOn}
                        aria-label={`${isOn ? "Remove" : "Add"} ${option.label}`}
                        onClick={() => toggle(option.key)}
                        className={cn(
                          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                          isOn ? "bg-champagne-500" : "bg-white/15",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                            isOn ? "translate-x-[1.4rem]" : "translate-x-0.5",
                          )}
                        />
                      </button>
                    </div>

                    {isOn && option.mode !== "fixed" ? (
                      <div className="mt-4">
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-bone-500">
                            {option.mode === "perFoot" ? "Length" : "How many"}
                          </span>
                          <span className="tabular-nums text-champagne-300">
                            {quantity} {option.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={option.min ?? 0}
                          max={option.max ?? 100}
                          step={option.step ?? 1}
                          value={quantity}
                          aria-label={`${option.label} ${option.unit ?? "amount"}`}
                          onChange={(event) =>
                            setQuantity(option.key, Number(event.target.value))
                          }
                          className="mt-2 h-6 w-full accent-champagne-400"
                        />
                      </div>
                    ) : null}
                  </div>
                );
              },
            )}
          </fieldset>
        ))}

        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow mb-1 text-champagne-500">
            Wrapped trees
          </legend>
          <p className="-mt-1 mb-1 text-sm text-bone-500">
            Trees are priced by size and are usually the largest line on a big
            display.
          </p>
          {TREE_OPTIONS.map((tree) => {
            const count = treeCounts[tree.key] ?? 0;
            return (
              <div
                key={tree.key}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-card border p-5 transition-colors",
                  count > 0
                    ? "border-champagne-400/35 bg-champagne-400/[0.05]"
                    : "border-white/10 bg-white/[0.02]",
                )}
              >
                <div>
                  <p className="font-medium text-bone-100">{tree.label}</p>
                  <p className="mt-1 text-sm text-bone-500">
                    {tree.detail} ·{" "}
                    {tree.price === null
                      ? "quoted after review"
                      : formatUsd(tree.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTree(tree.key, count - 1)}
                    disabled={count === 0}
                    aria-label={`Remove one ${tree.label} tree`}
                    className="size-9 rounded-lg border border-white/15 text-bone-300 disabled:opacity-30"
                  >
                    –
                  </button>
                  <span className="w-8 text-center tabular-nums text-bone-100">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTree(tree.key, count + 1)}
                    aria-label={`Add one ${tree.label} tree`}
                    className="size-9 rounded-lg border border-white/15 text-bone-300"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </fieldset>
      </div>
    </div>
  );
}
