"use client";

import { cn } from "@/lib/utils";
import { RoofHouseSvg, ROOF_SVG_VIEWBOX } from "./roof-house-svg";

/**
 * The illustration plus its numbered pins.
 *
 * Shared by the anatomy diagram and the flashing diagram, which draw the same
 * house from the same generated artwork and differ only in which components
 * they pin. Pins are real buttons layered over the SVG rather than shapes
 * inside it — that buys focus rings, tab order, and touch targets for free.
 */

export interface HotspotItem {
  key: string;
  name: string;
  short: string;
  hotspot: { x: number; y: number };
}

export function HotspotHouse({
  items,
  activeKey,
  onSelect,
  label,
  className,
}: {
  items: HotspotItem[];
  activeKey: string;
  onSelect: (key: string, name: string) => void;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-white",
        className,
      )}
    >
      <RoofHouseSvg activeKey={activeKey} label={label} />

      {items.map((item, i) => {
        const isActive = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key, item.name)}
            aria-pressed={isActive}
            aria-label={`${item.name} — ${item.short}`}
            title={item.name}
            style={{
              left: `${(item.hotspot.x / ROOF_SVG_VIEWBOX.width) * 100}%`,
              top: `${(item.hotspot.y / ROOF_SVG_VIEWBOX.height) * 100}%`,
            }}
            className="group absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none sm:size-8"
          >
            {/* Pulsing halo — the "this is clickable" cue. Stops once chosen. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-full bg-ember-500 motion-safe:animate-roof-hotspot",
                isActive && "motion-safe:animate-none",
              )}
              style={{ animationDelay: `${i * 90}ms` }}
            />
            <span
              className={cn(
                "relative grid size-full place-items-center rounded-full border-2 text-xs font-bold shadow-sm transition-colors duration-200 group-focus-visible:ring-3 group-focus-visible:ring-ring/60",
                isActive
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900 bg-white text-navy-900 group-hover:bg-ember-500",
              )}
            >
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
