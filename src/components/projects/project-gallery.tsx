"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";

import {
  projectPhotos,
  stormPhotos,
  STORM_CATEGORY_LABELS,
  type StormCategory,
} from "@/content/photos";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Filterable project gallery. Owner-corrected metadata (2026-07-05)
 * drives the filters: completed roofs filter by city, shingle line, and
 * color; in-progress photos get their own collection; storm response
 * filters by damage type. Deep-linkable via ?c=storm | ?c=progress.
 */

interface GalleryItem {
  src: string;
  alt: string;
  badge: string;
  /** Extra line in the lightbox (shingle line + color) */
  detail?: string;
}

type Collection = "roofs" | "progress" | "storm";

const completedPhotos = projectPhotos.filter((p) => p.kind === "completed");
const progressPhotos = projectPhotos.filter((p) => p.kind === "in-progress");

function countFilters<T>(
  items: T[],
  key: (item: T) => string | undefined,
): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const value = key(item);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

const CITY_FILTERS = countFilters(completedPhotos, (p) => p.city);
const LINE_FILTERS = countFilters(completedPhotos, (p) =>
  p.manufacturer ? `${p.manufacturer} ${p.line}` : undefined,
);
const COLOR_FILTERS = countFilters(completedPhotos, (p) => p.color);
const STORM_FILTERS = countFilters(stormPhotos, (p) => p.category).map(
  (entry) => ({
    ...entry,
    label: STORM_CATEGORY_LABELS[entry.value as StormCategory],
  }),
);

function FilterPill({
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
        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200",
        active
          ? "border-navy-900 bg-navy-900 text-white shadow-md"
          : "border-border bg-white text-slate-600 hover:border-steel-500 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: string; count: number; label?: string }[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <FilterPill active={selected === null} onClick={() => onSelect(null)}>
          All
        </FilterPill>
        {options.map((option) => (
          <FilterPill
            key={option.value}
            active={selected === option.value}
            onClick={() =>
              onSelect(selected === option.value ? null : option.value)
            }
          >
            {option.label ?? option.value}{" "}
            <span className="font-normal opacity-60">{option.count}</span>
          </FilterPill>
        ))}
      </div>
    </div>
  );
}

function GalleryInner() {
  const searchParams = useSearchParams();
  const initial: Collection =
    searchParams.get("c") === "storm"
      ? "storm"
      : searchParams.get("c") === "progress"
        ? "progress"
        : "roofs";

  const [collection, setCollection] = useState<Collection>(initial);
  const [city, setCity] = useState<string | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [stormCategory, setStormCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo<GalleryItem[]>(() => {
    if (collection === "roofs") {
      return completedPhotos
        .filter((p) => !city || p.city === city)
        .filter((p) => !line || `${p.manufacturer} ${p.line}` === line)
        .filter((p) => !color || p.color === color)
        .map((p) => ({
          src: p.src,
          alt: p.alt,
          badge: `${p.city}, MS`,
          detail: p.manufacturer
            ? `${p.manufacturer} ${p.line} · ${p.color}`
            : p.material === "metal"
              ? "29-gauge Galvalume metal"
              : undefined,
        }));
    }
    if (collection === "progress") {
      return progressPhotos.map((p) => ({
        src: p.src,
        alt: p.alt,
        badge: `${p.city}, MS`,
        detail: p.stage,
      }));
    }
    return stormPhotos
      .filter((p) => !stormCategory || p.category === stormCategory)
      .map((p) => ({
        src: p.src,
        alt: p.alt,
        badge: `${STORM_CATEGORY_LABELS[p.category]} · ${p.city}`,
      }));
  }, [collection, city, line, color, stormCategory]);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) => {
      setLightbox((current) =>
        current === null
          ? null
          : (current + delta + items.length) % items.length,
      );
    },
    [items.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, close, step]);

  const active = lightbox === null ? null : items[lightbox];

  return (
    <div>
      {/* Collection tabs */}
      <div
        role="group"
        aria-label="Gallery collection"
        className="inline-flex max-w-full flex-wrap rounded-2xl border border-border bg-white p-1 shadow-sm sm:rounded-full"
      >
        {(
          [
            { key: "roofs", label: `Completed roofs (${completedPhotos.length})` },
            { key: "progress", label: `During install (${progressPhotos.length})` },
            { key: "storm", label: `Storm response (${stormPhotos.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setCollection(tab.key);
              setLightbox(null);
            }}
            aria-pressed={collection === tab.key}
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 sm:px-5",
              collection === tab.key
                ? "bg-navy-900 text-white"
                : "text-slate-600 hover:text-navy-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {collection === "roofs" && (
        <>
          <FilterRow
            label="City"
            options={CITY_FILTERS}
            selected={city}
            onSelect={setCity}
          />
          <FilterRow
            label="Shingle line"
            options={LINE_FILTERS}
            selected={line}
            onSelect={setLine}
          />
          <FilterRow
            label="Color"
            options={COLOR_FILTERS}
            selected={color}
            onSelect={setColor}
          />
        </>
      )}
      {collection === "storm" && (
        <FilterRow
          label="Damage type"
          options={STORM_FILTERS}
          selected={stormCategory}
          onSelect={setStormCategory}
        />
      )}

      {/* FLIP grid */}
      {items.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-border bg-white p-6 text-slate-600">
          No photos match that combination — clear a filter to see more.
        </p>
      ) : (
        <motion.ul
          layout
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.li
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(index)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                  aria-label={`View larger: ${item.alt}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={450}
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur sm:bottom-3 sm:left-3 sm:gap-1.5 sm:px-3 sm:text-xs">
                    {collection !== "storm" && (
                      <MapPin className="size-3" aria-hidden="true" />
                    )}
                    {item.badge}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm font-medium text-steel-300">
                {(lightbox ?? 0) + 1} / {items.length}
                <span className="ml-3 hidden text-white sm:inline">
                  {active.badge}
                </span>
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="rounded-full p-2.5 text-white transition-colors hover:bg-white/10"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative flex-1 px-4 pb-4 sm:px-16"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                key={active.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="relative h-full w-full"
              >
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 sm:left-4"
                  >
                    <ChevronLeft className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-4"
                  >
                    <ChevronRight className="size-6" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="px-4 pb-4 text-center sm:px-6">
              {active.detail && (
                <p className="text-sm font-semibold text-white">
                  {active.detail}
                </p>
              )}
              <p className="mt-1 text-sm text-steel-300">{active.alt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProjectGallery() {
  return (
    <Suspense fallback={null}>
      <GalleryInner />
    </Suspense>
  );
}
