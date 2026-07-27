"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { AlertTriangle, CheckCircle2, Info, MapPin } from "lucide-react";

import { FLASHING_TYPES } from "@/config/roof-anatomy";
import { cn } from "@/lib/utils";

/**
 * Flashing, broken out from the main diagram.
 *
 * Flashing is one pin on the house illustration but nine different pieces in
 * practice, and it is where most roofs actually leak — so it gets its own
 * selector rather than being buried in a single paragraph. Same interaction as
 * the main diagram (pick a name, read what it does and how it fails) minus the
 * artwork, because these pieces live in places a whole-house view can't show.
 */

export function FlashingDiagram() {
  const [activeKey, setActiveKey] = useState(FLASHING_TYPES[0].key);
  const active =
    FLASHING_TYPES.find((f) => f.key === activeKey) ?? FLASHING_TYPES[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <ol className="flex flex-col gap-1.5">
        {FLASHING_TYPES.map((f, i) => {
          const isActive = f.key === activeKey;
          return (
            <li key={f.key}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveKey(f.key);
                  track("diagram_component_clicked", {
                    tool: "flashing-diagram",
                    component: f.name,
                  });
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-200",
                  isActive
                    ? "border-ember-500 bg-white shadow-sm"
                    : "border-border bg-white/60 hover:border-steel-300 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 flex-none place-items-center rounded-md text-xs font-bold transition-colors",
                    isActive ? "bg-navy-900 text-white" : "bg-ember-500 text-navy-900",
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-navy-900">{f.name}</span>
                  <span className="block truncate text-sm text-slate-600">
                    {f.where}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="overflow-hidden rounded-2xl border border-border bg-white lg:sticky lg:top-24 lg:self-start">
        {active.photo ? (
          <div className="relative aspect-16/9 bg-secondary">
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
          </div>
        ) : null}

        <div className="flex flex-col gap-5 p-6">
          <div>
            <h3 className="text-xl font-bold text-navy-900">{active.name}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-steel-500">
              <MapPin className="size-3.5" aria-hidden="true" />
              {active.where}
            </p>
          </div>

          <Row icon={<Info className="size-4 text-steel-500" />} label="What it is">
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
            label="How it gets done wrong"
          >
            {active.bad}
          </Row>
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
