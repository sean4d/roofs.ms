"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { AlertTriangle, ArrowRight, CheckCircle2, Info } from "lucide-react";

import { ROOF_PARTS } from "@/config/roof-anatomy";
import { cn } from "@/lib/utils";
import { HotspotHouse } from "./hotspot-house";

/**
 * Anatomy of a Roof, interactive hotspot diagram.
 *
 * Two ways into the same selection: the numbered pins sitting on the
 * illustration, and the numbered list beneath it. Selecting from either lights
 * the component in the artwork and swaps the detail panel, so a homeowner who
 * knows *where* the problem is and one who knows *what it's called* both get
 * there. Selecting from the artwork scrolls the matching row into view (and
 * vice versa) so the two never disagree about what is selected.
 *
 * Pins are real buttons layered over the SVG rather than shapes inside it:
 * that buys focus rings, tab order, and touch targets for free.
 */

export function RoofDiagram() {
  const [activeKey, setActiveKey] = useState(ROOF_PARTS[0].key);
  const active = ROOF_PARTS.find((p) => p.key === activeKey) ?? ROOF_PARTS[0];
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    track("tool_opened", { tool: "roof-diagram" });
  }, []);

  function select(key: string, name: string, scrollList: boolean) {
    setActiveKey(key);
    track("diagram_component_clicked", {
      tool: "roof-diagram",
      component: name,
    });
    if (scrollList) {
      listRef.current
        ?.querySelector(`[data-row="${key}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  return (
    <div
      id="anatomy-diagram"
      className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
    >
      {/* ---------------- Illustration + numbered list ---------------- */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-steel-500 uppercase">
          Tap a hot spot to see what it does
        </p>

        <HotspotHouse
          items={ROOF_PARTS}
          activeKey={activeKey}
          onSelect={(key, name) => select(key, name, true)}
        />

        <ol
          ref={listRef}
          className="mt-4 max-h-96 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-secondary p-2"
        >
          {ROOF_PARTS.map((part, i) => {
            const isActive = part.key === activeKey;
            return (
              <li key={part.key} data-row={part.key}>
                <button
                  type="button"
                  onClick={() => select(part.key, part.name, false)}
                  aria-pressed={isActive}
                  className={cn(
                    "mb-1.5 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-200",
                    isActive
                      ? "border-ember-500 bg-white shadow-sm"
                      : "border-transparent bg-white/55 hover:bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 flex-none place-items-center rounded-md text-xs font-bold transition-colors",
                      isActive
                        ? "bg-navy-900 text-white"
                        : "bg-ember-500 text-navy-900",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-navy-900">
                      {part.name}
                    </span>
                    <span className="block truncate text-sm text-slate-600">
                      {part.short}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------------- Detail panel ---------------- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="relative aspect-16/10 bg-secondary">
            {active.photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.photo.src}
                  alt={active.photo.alt}
                  title={active.photo.caption}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-950/85 to-transparent p-3 pt-8 text-xs leading-snug font-medium text-white">
                  {active.photo.caption}
                </span>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-navy-800 to-navy-950 p-6 text-center">
                <span className="font-display text-2xl font-bold text-white/90">
                  {active.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-xl font-bold text-navy-900">{active.name}</h2>
              <p className="mt-1 text-sm text-steel-500">{active.short}</p>
            </div>

            <Row
              icon={<Info className="size-4 text-steel-500" />}
              label="What it is"
            >
              {active.what}
            </Row>
            <Row
              icon={<CheckCircle2 className="size-4 text-success-600" />}
              label="Why it matters"
            >
              {active.why}
            </Row>
            <Row
              icon={<AlertTriangle className="size-4 text-ember-500" />}
              label="If it's done wrong"
            >
              {active.bad}
            </Row>

            <Link
              href="/free-inspection"
              onClick={() =>
                track("cta_click", {
                  action: "free-inspection",
                  source: "roof-diagram",
                })
              }
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-3 font-semibold text-white"
            >
              Want this done right? Free inspection
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex-none">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-navy-900">{label}</p>
        <p className="text-sm leading-relaxed text-slate-600">{children}</p>
      </div>
    </div>
  );
}
