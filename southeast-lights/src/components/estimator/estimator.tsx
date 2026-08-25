"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
 *   - House and price live in ONE sticky dock, never two competing pinned
 *     things. The dock is a grid item on desktop and a block child on mobile,
 *     and in both cases its containing block is the wrapper holding the dock
 *     and the controls. That is what stops it: sticky releases at the end of
 *     the configurator instead of following anyone into the breakdown, the
 *     CTA band or the footer. No scroll maths.
 *   - On a phone the dock starts full width and turns into a short row once
 *     the controls come up, so a toggle, the lit house and the price are on
 *     screen together. An IntersectionObserver on a sentinel decides that;
 *     nothing measures scroll offsets.
 *   - The detailed breakdown sits below the configurator rather than in the
 *     dock. Customers need the running total pinned, not the line items.
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
  const [compact, setCompact] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  /*
   * The dock shrinks once the top of the configurator has passed under the
   * header. Observing a sentinel rather than reading scrollY keeps this off
   * the scroll thread and means the trigger point is wherever the sentinel
   * happens to be, at any viewport size, with no constants to keep in sync.
   */
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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

  const hasSelection = quote.total > 0;

  return (
    <div className="container-site py-10 lg:py-16">
      {/* Trips the dock into its compact state once it scrolls past. */}
      <div ref={sentinel} aria-hidden className="h-px w-full" />

      {/*
        Sticky containing block. The dock can travel through the controls and
        no further, which is the whole of the containment story.
      */}
      <div className="lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-14">
        {/* ---------- the dock: house + live price ---------- */}
        <div className="estimator-dock">
          <div
            className={cn(
              "rounded-card border border-white/[0.08] bg-ink-950/95 backdrop-blur transition-[padding] duration-300 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
              // A shadow only once it is pinned, so the boundary between the
              // dock and the cards sliding under it is legible.
              compact
                ? "p-2.5 shadow-[0_16px_28px_-18px_rgba(0,0,0,0.95)]"
                : "p-3 sm:p-4",
            )}
          >
            <div
              className={cn(
                "transition-all duration-300 lg:block",
                compact ? "flex items-center gap-3" : "block",
              )}
            >
              <div
                className={cn(
                  "min-w-0 transition-all duration-300 lg:w-full",
                  compact ? "w-[70%]" : "w-full",
                )}
              >
                <HouseSvg active={active} scheme={scheme} className="w-full" />
              </div>

              <div
                className={cn(
                  "min-w-0 lg:mt-6 lg:flex-none",
                  compact ? "flex-1" : "mt-4",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      "eyebrow text-champagne-500",
                      compact ? "text-[0.6rem]" : "",
                    )}
                  >
                    Estimated range
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs text-bone-500 hover:text-bone-300 lg:inline-flex",
                      compact ? "hidden" : "inline-flex",
                    )}
                  >
                    <RotateCcw className="size-3" strokeWidth={2} />
                    Reset
                  </button>
                </div>

                {/*
                  Remounting on value change restarts the animation, which is
                  a 180ms fade and a two pixel rise. Enough to notice, not
                  enough to be a performance.
                */}
                <p
                  key={hasSelection ? `${low}-${high}` : "none"}
                  className={cn(
                    "estimator-price mt-1 font-display leading-tight font-semibold text-champagne-300 tabular-nums",
                    compact
                      ? "text-base leading-snug sm:text-2xl"
                      : "text-[1.6rem] sm:text-3xl",
                    "lg:text-4xl",
                  )}
                >
                  {hasSelection
                    ? `${formatUsd(low)} to ${formatUsd(high)}`
                    : "Nothing selected yet"}
                </p>

                {quote.needsReview ? (
                  <p
                    className={cn(
                      "mt-2 text-xs leading-snug text-champagne-200 lg:block",
                      compact ? "hidden" : "block",
                    )}
                  >
                    Estate trees are quoted after we see them and are not in
                    this range.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- controls ---------- */}
        <div className="mt-8 flex min-w-0 flex-col gap-10 lg:mt-0">
          {OPTION_GROUPS.map((group) => (
            <fieldset
              key={group.key}
              className="flex scroll-mt-[15.5rem] flex-col gap-3 lg:scroll-mt-28"
            >
              <legend className="eyebrow mb-1 text-champagne-500">
                {group.label}
              </legend>
              {ESTIMATOR_OPTIONS.filter(
                (option) => option.group === group.key,
              ).map((option) => {
                const quantity = quantities[option.key] ?? 0;
                const isOn = quantity > 0;
                return (
                  <div
                    key={option.key}
                    className={cn(
                      // Clears the header plus the dock above and the action
                      // bar below, so focusing a control with a keyboard, or
                      // arriving from an anchor, never parks it underneath
                      // something. Sticky chrome is invisible to the browser's
                      // own scroll-into-view; scroll-margin is how you say so.
                      "scroll-mt-[15.5rem] scroll-mb-24 lg:scroll-mt-28 lg:scroll-mb-0",
                      "rounded-card border p-5 transition-colors",
                      isOn
                        ? "border-champagne-400/40 bg-champagne-400/[0.04]"
                        : "border-white/[0.09] bg-transparent",
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
                          <span className="text-champagne-300 tabular-nums">
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
              })}
            </fieldset>
          ))}

          <fieldset className="flex scroll-mt-[15.5rem] flex-col gap-3 lg:scroll-mt-28">
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
                    "scroll-mt-[15.5rem] scroll-mb-24 lg:scroll-mt-28 lg:scroll-mb-0",
                    "flex items-center justify-between gap-4 rounded-card border p-5 transition-colors",
                    count > 0
                      ? "border-champagne-400/40 bg-champagne-400/[0.04]"
                      : "border-white/[0.09] bg-transparent",
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
                      className="size-11 rounded-lg border border-white/15 text-lg text-bone-300 disabled:opacity-30"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-bone-100 tabular-nums">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTree(tree.key, count + 1)}
                      aria-label={`Add one ${tree.label} tree`}
                      className="size-11 rounded-lg border border-white/15 text-lg text-bone-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </fieldset>

          {/*
            Colour lives with the controls, not in the dock. It is a choice
            people scroll to and make once, and the dock is for the two things
            that have to stay on screen the whole time.
          */}
          {/*
            min-w-0 on the fieldset is load-bearing. A fieldset does not shrink
            below the min-content width of its contents the way a div does, so
            a row of non-shrinking chips inside one pushed the whole document
            to 770px at a 390px viewport. html has overflow-x hidden, which
            hid it from a finger but not from scrollIntoView or from tabbing
            to a chip, either of which shunted the entire page sideways.

            The chips wrap now rather than scrolling horizontally. Seven of
            them fit in three rows, all of them visible, and there is no
            second scroll axis to get wrong.
          */}
          <fieldset className="flex min-w-0 scroll-mt-[15.5rem] flex-col gap-3 lg:scroll-mt-28">
            <legend className="eyebrow mb-1 text-champagne-500">
              Color scheme
            </legend>
            <div className="flex min-w-0 flex-wrap gap-2">
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
                    "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors",
                    scheme === key
                      ? "border-champagne-400/50 bg-champagne-400/10 text-champagne-200"
                      : "text-bone-400 hover:text-bone-200 border-white/10",
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
          </fieldset>
        </div>
      </div>

      {/* ---------- breakdown, below the configurator ---------- */}
      <div className="panel mt-12 p-6 lg:mt-16 lg:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <span className="eyebrow text-champagne-500">What that covers</span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs text-bone-500 hover:text-bone-300"
          >
            <RotateCcw className="size-3" strokeWidth={2} />
            Start over
          </button>
        </div>

        <p className="mt-2 font-display text-[1.75rem] leading-tight font-semibold text-champagne-300 tabular-nums sm:text-4xl">
          {hasSelection
            ? `${formatUsd(low)} to ${formatUsd(high)}`
            : "Nothing selected yet"}
        </p>

        {quote.needsReview ? (
          <p className="mt-3 text-sm text-champagne-200">
            Estate and specimen trees are quoted after we see them. The range
            above excludes them.
          </p>
        ) : null}

        {quote.minimumApplied ? (
          <p className="text-bone-400 mt-3 text-sm">
            Professional residential installations begin at{" "}
            {formatUsd(HOLIDAY.minimum)}.
          </p>
        ) : null}

        {quote.lines.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm">
            {quote.lines.map((line) => (
              <li
                key={line.label}
                className="text-bone-400 flex justify-between gap-4"
              >
                <span>{line.label}</span>
                <span className="text-bone-200 tabular-nums">
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
            track("estimator_complete", { total: quote.total, scheme })
          }
          className="btn-primary mt-6 w-full sm:w-auto"
        >
          Get my exact quote
          <ArrowRight className="size-4" strokeWidth={2} />
        </Link>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-bone-500">
          <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          Ballpark estimate only. Final pricing is confirmed after we review the
          property and complete the design.
        </p>
      </div>
    </div>
  );
}
