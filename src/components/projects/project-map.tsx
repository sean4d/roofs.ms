"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { MapPin } from "lucide-react";

import { CITY_COORDS, projectToSvg } from "@/config/city-coords";
import type { GalleryJob } from "@/lib/gallery";
import { cn } from "@/lib/utils";

import { JobCard } from "./unified-gallery";

const W = 560;
const H = 620;

interface CityGroup {
  key: string;
  name: string;
  x: number;
  y: number;
  jobs: GalleryJob[];
}

/**
 * Interactive Mississippi project map. Dependency-free: pins are projected from
 * real city coordinates onto an SVG of the service area. Filter by product,
 * tap a pin to see that city's jobs, tap a job to open the same JobCard used in
 * the gallery. Data is the unified GalleryJob list (static proof + uploads).
 */
export function ProjectMap({ jobs }: { jobs: GalleryJob[] }) {
  const [product, setProduct] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [openJob, setOpenJob] = useState<GalleryJob | null>(null);

  useEffect(() => {
    track("tool_opened", { tool: "project-map" });
  }, []);

  const completed = useMemo(() => jobs.filter((j) => j.category === "completed"), [jobs]);
  const products = useMemo(
    () => [...new Set(completed.map((j) => j.product).filter(Boolean))].sort() as string[],
    [completed],
  );
  const visible = useMemo(
    () => completed.filter((j) => !product || j.product === product),
    [completed, product],
  );

  const groups = useMemo<CityGroup[]>(() => {
    const map = new Map<string, CityGroup>();
    for (const j of visible) {
      const key = j.city?.toLowerCase();
      if (!key) continue;
      const coords = CITY_COORDS[key];
      if (!coords) continue;
      const existing = map.get(key);
      if (existing) existing.jobs.push(j);
      else {
        const { x, y } = projectToSvg(coords, W, H);
        map.set(key, { key, name: j.city!, x, y, jobs: [j] });
      }
    }
    return [...map.values()];
  }, [visible]);

  const active = groups.find((g) => g.key === selected) ?? null;
  const totalRoofs = visible.length;

  function pickCity(key: string, name: string) {
    setSelected(key);
    track("map_pin_click", { city: name });
  }

  return (
    <div>
      {/* Product filter */}
      {products.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-steel-500">
            Product
          </span>
          <Chip active={product === null} onClick={() => setProduct(null)}>
            All
          </Chip>
          {products.map((p) => (
            <Chip key={p} active={product === p} onClick={() => setProduct(product === p ? null : p)}>
              {p}
            </Chip>
          ))}
        </div>
      )}

      <p className="mb-4 text-sm text-slate-500">
        {totalRoofs} completed roof{totalRoofs === 1 ? "" : "s"} across {groups.length}{" "}
        {groups.length === 1 ? "community" : "communities"}: tap a pin.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[#eaf1f8]">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Map of Southeast Roofing project cities in South Mississippi">
            <rect width={W} height={H} fill="#eaf1f8" />
            {/* Gulf hint along the bottom */}
            <rect x={0} y={H - 70} width={W} height={70} fill="#cfe0ef" />
            <text x={W / 2} y={H - 30} textAnchor="middle" fill="#6f8ba8" fontSize="15" fontWeight="600" letterSpacing="2">
              GULF OF MEXICO
            </text>
            <text x={16} y={28} fill="#9db2c7" fontSize="13" fontWeight="700" letterSpacing="1">
              SOUTH MISSISSIPPI
            </text>

            {groups.map((g) => {
              const isActive = g.key === selected;
              const r = Math.min(13, 5 + g.jobs.length * 1.4);
              return (
                <g key={g.key} className="cursor-pointer" onClick={() => pickCity(g.key, g.name)}>
                  <title>{`${g.name}, ${g.jobs.length} roof${g.jobs.length === 1 ? "" : "s"}`}</title>
                  <circle
                    cx={g.x}
                    cy={g.y}
                    r={isActive ? r + 3 : r}
                    fill={isActive ? "#4f7ea8" : "#123b63"}
                    stroke="#fff"
                    strokeWidth={2}
                    opacity={0.92}
                  />
                  {(isActive || g.jobs.length >= 3) && (
                    <text
                      x={g.x}
                      y={g.y - r - 5}
                      textAnchor="middle"
                      fill="#0a2036"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {g.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel */}
        <div>
          {active ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="inline-flex items-center gap-1.5 text-lg font-bold text-navy-900">
                  <MapPin className="size-4 text-steel-500" /> {active.name}, MS
                </h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-sm font-medium text-steel-500 underline underline-offset-4"
                >
                  Back to all
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {active.jobs.map((job) => {
                  const cover = job.photos[0];
                  return (
                    <li key={job.id}>
                      <button
                        type="button"
                        onClick={() => setOpenJob(job)}
                        className="group block w-full overflow-hidden rounded-xl border border-border bg-white text-left"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-secondary">
                          {cover && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover.src}
                              alt={cover.alt}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <span className="block p-2 text-xs font-medium text-navy-900">
                          {job.product ?? "Roof"}
                          {job.color ? ` · ${job.color}` : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-navy-900">Communities we&apos;ve roofed</h3>
              <p className="mt-1 text-sm text-slate-600">
                Tap a pin on the map, or a city below, to see real roofs there.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...groups]
                  .sort((a, b) => b.jobs.length - a.jobs.length || a.name.localeCompare(b.name))
                  .map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => pickCity(g.key, g.name)}
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-navy-900 hover:border-steel-500"
                    >
                      {g.name}{" "}
                      <span className="text-slate-400">{g.jobs.length}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {openJob && (
        <JobCard job={openJob} onClose={() => setOpenJob(null)} />
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
        active
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-border bg-white text-slate-600 hover:border-steel-500",
      )}
    >
      {children}
    </button>
  );
}
