import { AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Live Mississippi weather alerts from the National Weather Service
 * public API (PRD Phase 8 Storm Center, "live storm resources").
 * Server-rendered with ISR (page-level revalidate); if the API is
 * unreachable the panel degrades to a link to weather.gov rather than
 * breaking the page. Counties in our service area get a badge.
 */

interface NwsAlert {
  id: string;
  event: string;
  severity: string;
  headline: string;
  areaDesc: string;
  ends: string | null;
}

/** Counties our 31-city service area sits in (see content/cities). */
const SERVICE_COUNTIES = [
  "Forrest", "Lamar", "Jones", "Perry", "Covington", "Simpson", "Marion",
  "Lincoln", "Pike", "Pearl River", "Stone", "George", "Hancock",
  "Harrison", "Jackson", "Hinds", "Lauderdale",
];

const SEVERITY_ORDER: Record<string, number> = {
  Extreme: 0,
  Severe: 1,
  Moderate: 2,
  Minor: 3,
  Unknown: 4,
};

const SEVERITY_STYLE: Record<string, string> = {
  Extreme: "bg-red-600 text-white",
  Severe: "bg-red-600 text-white",
  Moderate: "bg-amber-500 text-white",
  Minor: "bg-steel-500 text-white",
  Unknown: "bg-slate-400 text-white",
};

async function fetchAlerts(): Promise<NwsAlert[] | null> {
  try {
    const response = await fetch("https://api.weather.gov/alerts/active?area=MS", {
      headers: {
        "User-Agent": "southeastroofing.llc (office@southeastroofing.llc)",
        Accept: "application/geo+json",
      },
      next: { revalidate: 1800 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      features?: {
        properties: {
          id: string;
          event: string;
          severity: string;
          headline: string;
          areaDesc: string;
          ends: string | null;
        };
      }[];
    };
    return (data.features ?? [])
      .map((feature) => ({
        id: feature.properties.id,
        event: feature.properties.event,
        severity: feature.properties.severity ?? "Unknown",
        headline: feature.properties.headline ?? feature.properties.event,
        areaDesc: feature.properties.areaDesc ?? "",
        ends: feature.properties.ends,
      }))
      .sort(
        (a, b) =>
          (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4),
      );
  } catch {
    return null;
  }
}

function touchesServiceArea(areaDesc: string): boolean {
  return SERVICE_COUNTIES.some((county) => areaDesc.includes(county));
}

export async function StormAlerts() {
  const alerts = await fetchAlerts();

  if (alerts === null) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="leading-relaxed text-slate-600">
          Live alert data is temporarily unavailable. For current watches and
          warnings, check{" "}
          <a
            href="https://www.weather.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            weather.gov
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          .
        </p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6">
        <ShieldCheck
          className="mt-0.5 size-6 shrink-0 text-success-600"
          aria-hidden="true"
        />
        <p className="leading-relaxed text-slate-600">
          <span className="font-semibold text-navy-900">
            No active weather alerts for Mississippi right now.
          </span>{" "}
          Quiet skies are the right time for an inspection, storm season
          never waits long here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {alerts.slice(0, 8).map((alert) => {
        const local = touchesServiceArea(alert.areaDesc);
        return (
          <li
            key={alert.id}
            className="rounded-2xl border border-border bg-white p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
                  SEVERITY_STYLE[alert.severity] ?? SEVERITY_STYLE.Unknown,
                )}
              >
                <AlertTriangle className="size-3.5" aria-hidden="true" />
                {alert.event}
              </span>
              {local && (
                <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white">
                  In our service area
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed font-medium text-navy-900">
              {alert.headline}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              {alert.areaDesc}
            </p>
          </li>
        );
      })}
      {alerts.length > 8 && (
        <li className="text-sm text-slate-500">
          + {alerts.length - 8} more on{" "}
          <a
            href="https://www.weather.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-navy-900 underline-offset-4 hover:underline"
          >
            weather.gov
          </a>
        </li>
      )}
    </ul>
  );
}
