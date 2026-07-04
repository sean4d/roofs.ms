"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail } from "lucide-react";

import { proposalSection } from "@/content/homepage";
import { cn } from "@/lib/utils";

/**
 * Interactive example proposal (owner directive 2026-07-04): real toggles,
 * live animated total — teaching customers how Southeast Roofing estimates
 * work. All figures are owner-supplied EXAMPLE pricing and the card is
 * labeled as such; actual proposals are built from the actual roof.
 */

const currency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

/** Tween the displayed total so upgrades feel alive. */
function useAnimatedNumber(target: number, duration = 450) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (target - from) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      fromRef.current = target;
    };
  }, [target, duration]);

  return display;
}

export function InteractiveProposal() {
  const { example } = proposalSection;
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      example.upgrades.map((upgrade) => [upgrade.label, upgrade.defaultOn]),
    ),
  );

  const upgradesTotal = example.upgrades.reduce(
    (sum, upgrade) => sum + (selected[upgrade.label] ? upgrade.price : 0),
    0,
  );
  const total = example.baseTotal + upgradesTotal;
  const animatedTotal = useAnimatedNumber(total);

  return (
    <div className="shadow-premium rounded-3xl border border-border bg-white p-7 sm:p-8">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <p className="font-display text-lg font-bold text-navy-900">
            {example.heading}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{example.subheading}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-steel-100">
          <Mail className="size-4.5 text-navy-900" aria-hidden="true" />
        </span>
      </div>

      {/* Base line items — owner-supplied example figures */}
      <ul className="divide-y divide-border/70">
        {example.lineItems.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <span className="text-slate-600">{item.label}</span>
            {item.price !== null ? (
              <span className="font-medium text-navy-900 tabular-nums">
                {currency(item.price)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-success-600 uppercase">
                <Check className="size-3.5" aria-hidden="true" />
                Included
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Upgrade toggles — tap to watch the total move */}
      <p className="mt-4 text-xs font-semibold tracking-wide text-steel-500 uppercase">
        Optional upgrades — try them
      </p>
      <ul className="mt-1 divide-y divide-border/70">
        {example.upgrades.map((upgrade) => {
          const on = selected[upgrade.label];
          return (
            <li key={upgrade.label}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    [upgrade.label]: !prev[upgrade.label],
                  }))
                }
                className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary/60"
              >
                <span className="flex items-center gap-3">
                  {/* Toggle pill */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
                      on ? "bg-navy-900" : "bg-border",
                    )}
                  >
                    <span
                      className={cn(
                        "size-4 rounded-full bg-white shadow transition-transform duration-200",
                        on && "translate-x-4",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      on ? "text-navy-900" : "text-slate-600",
                    )}
                  >
                    {upgrade.label}
                  </span>
                </span>
                <span
                  className={cn(
                    "tabular-nums transition-colors",
                    on ? "font-semibold text-navy-900" : "text-slate-400",
                  )}
                >
                  +{currency(upgrade.price)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Live total */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-900 px-5 py-4">
        <span className="text-sm font-semibold text-white">
          {example.totalLabel}
        </span>
        <span
          aria-live="polite"
          className="font-display text-xl font-bold text-white tabular-nums"
        >
          {currency(animatedTotal)}
        </span>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
        {example.disclaimer}
      </p>
    </div>
  );
}
