"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { AlertTriangle, ArrowRight, CheckCircle2, Info } from "lucide-react";

import { ROOF_PARTS } from "@/config/roof-anatomy";
import { cn } from "@/lib/utils";

export function RoofDiagram() {
  const [activeKey, setActiveKey] = useState(ROOF_PARTS[0].key);
  const active = ROOF_PARTS.find((p) => p.key === activeKey) ?? ROOF_PARTS[0];

  useEffect(() => {
    track("tool_opened", { tool: "roof-diagram" });
  }, []);

  function select(key: string, name: string) {
    setActiveKey(key);
    track("diagram_component_clicked", { tool: "roof-diagram", component: name });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
      {/* Exploded stack */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-steel-500">
          Tap a layer — top of the roof down
        </p>
        <ol className="flex flex-col gap-1.5">
          {ROOF_PARTS.map((part) => {
            const isActive = part.key === activeKey;
            return (
              <li key={part.key}>
                <button
                  type="button"
                  onClick={() => select(part.key, part.name)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-200",
                    isActive
                      ? "translate-x-1.5 border-navy-900 bg-navy-900 text-white shadow-md"
                      : "border-border bg-white text-navy-900 hover:translate-x-1 hover:border-steel-500",
                  )}
                >
                  <span className="font-semibold">{part.name}</span>
                  <span
                    className={cn(
                      "hidden text-sm sm:block",
                      isActive ? "text-steel-100" : "text-slate-500",
                    )}
                  >
                    {part.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Detail */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="relative aspect-[16/10] bg-secondary">
            {active.photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.photo.src}
                  alt={active.photo.alt}
                  title={active.photo.caption}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-3 pt-8 text-xs font-medium leading-snug text-white">
                  {active.photo.caption}
                </span>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 p-6 text-center">
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

            <Row icon={<Info className="size-4 text-steel-500" />} label="What it is">
              {active.what}
            </Row>
            <Row icon={<CheckCircle2 className="size-4 text-emerald-600" />} label="Why it matters">
              {active.why}
            </Row>
            <Row icon={<AlertTriangle className="size-4 text-amber-600" />} label="If it's done wrong">
              {active.bad}
            </Row>

            <Link
              href="/free-inspection"
              onClick={() => track("cta_click", { action: "free-inspection", source: "roof-diagram" })}
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
