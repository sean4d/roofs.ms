"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Live "Open now / Closed" pill computed from the business hours in the CST
 * timezone (Mississippi). Client-only so it reflects the visitor's current
 * moment without a server round-trip or hydration mismatch, it renders nothing
 * until mounted. Hours are the site's source of truth (config/site.ts), which
 * matches what's published on the Google profile.
 */

interface HoursBlock {
  days: readonly string[];
  opens: string; // "08:00"
  closes: string; // "17:00"
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const label12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m === 0
    ? `${hr} ${ampm}`
    : `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
};

interface Status {
  open: boolean;
  /** e.g. "Opens Mon 8 AM" when closed. */
  next?: string;
}

function computeStatus(spec: HoursBlock[]): Status {
  // Current weekday + minutes in America/Chicago.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const nowMin = hour * 60 + minute;
  const todayIdx = DAYS.indexOf(weekday);

  for (const b of spec) {
    if (
      b.days.includes(weekday) &&
      nowMin >= toMin(b.opens) &&
      nowMin < toMin(b.closes)
    ) {
      return { open: true };
    }
  }

  // Find the next opening within the next 7 days.
  for (let d = 0; d < 8; d++) {
    const idx = (todayIdx + d) % 7;
    const dayName = DAYS[idx];
    for (const b of spec) {
      if (!b.days.includes(dayName)) continue;
      if (d === 0 && nowMin >= toMin(b.opens)) continue; // already past today's open
      const prefix =
        d === 0 ? "today" : d === 1 ? "tomorrow" : dayName.slice(0, 3);
      return { open: false, next: `Opens ${prefix} ${label12(b.opens)}` };
    }
  }
  return { open: false };
}

export function OpenStatus({
  spec,
  className,
}: {
  spec: HoursBlock[];
  className?: string;
}) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeStatus(spec));
    // First paint after mount (client-only, avoids hydration mismatch), then
    // re-check each minute so the pill flips at open/close time.
    const id = setInterval(update, 60_000);
    update();
    return () => clearInterval(id);
  }, [spec]);

  if (!status) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold",
        status.open ? "text-emerald-600" : "text-slate-500",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          status.open ? "bg-emerald-500" : "bg-slate-400",
        )}
        aria-hidden="true"
      />
      {status.open ? "Open now" : (status.next ?? "Closed")}
    </span>
  );
}
