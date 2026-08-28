"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  hidesColor,
  type GalleryCategory,
  type GalleryJob,
} from "@/lib/gallery";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Unified projects gallery. Two categories (Completed / Storm Response) with
 * dynamic, never-empty filters. Every photo shows in the grid; clicking one
 * opens its job card (sibling photos + details). The job card is also what a
 * future map pin opens, see JobCard.
 */

const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  completed: "Completed Jobs",
  storm: "Storm Response",
};

function uniq(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b),
  );
}

interface GridPhoto {
  id: string;
  src: string;
  alt: string;
  phase?: string;
  job: GalleryJob;
  /** Total photos in this job's card, what the tile promises on tap. */
  photoCount: number;
}

/** Phase bubble label. Same translucent pill as the city bubble (owner rule
 *  2026-08-01: bubbles, never burned-in labels) and shown ONLY inside the job
 *  card. The grid is finished roofs, so it has nothing to label. */
const PHASE_LABEL: Record<string, string> = {
  before: "Before",
  progress: "During install",
  after: "After",
};

/** Install-timeline order, so a card reads before → during → after. */
const PHASE_ORDER: Record<string, number> = {
  before: 0,
  progress: 1,
  after: 2,
};

/**
 * GRID photos, finished work only (owner rule 2026-08-01: the projects page is
 * never a wall of plywood). Falls back down the timeline so a job that somehow
 * has no "after" still appears rather than vanishing, and static gallery jobs
 * (no phase data at all) keep showing everything.
 */
function gridPhotosOf(job: GalleryJob) {
  const after = job.photos.filter((p) => p.phase === "after");
  if (after.length > 0) return after;
  const progress = job.photos.filter((p) => p.phase === "progress");
  if (progress.length > 0) return progress;
  return job.photos;
}

/** CARD photos, the whole job, in install order. This is where during-install
 *  and before shots live: visible once someone taps in and starts swiping. */
function cardPhotosOf(job: GalleryJob) {
  return [...job.photos].sort(
    (a, b) =>
      (PHASE_ORDER[a.phase ?? ""] ?? 1) - (PHASE_ORDER[b.phase ?? ""] ?? 1),
  );
}

export function UnifiedGallery({ jobs }: { jobs: GalleryJob[] }) {
  const categories = uniq(jobs.map((j) => j.category)) as GalleryCategory[];
  const [category, setCategory] = useState<GalleryCategory>(
    categories.includes("completed")
      ? "completed"
      : (categories[0] ?? "completed"),
  );
  const [city, setCity] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [storm, setStorm] = useState<string | null>(null);
  const [showHiddenColors, setShowHiddenColors] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openJob, setOpenJob] = useState<{
    job: GalleryJob;
    photoId: string;
  } | null>(null);

  // Reset facets when the category changes.
  function switchCategory(next: GalleryCategory) {
    setCategory(next);
    setCity(null);
    setProduct(null);
    setColor(null);
    setStorm(null);
  }

  const inCategory = useMemo(
    () => jobs.filter((j) => j.category === category),
    [jobs, category],
  );

  // Available (non-empty) filter values for this category.
  const cities = useMemo(
    () => uniq(inCategory.map((j) => j.city)),
    [inCategory],
  );
  const products = useMemo(
    () => uniq(inCategory.map((j) => j.product)),
    [inCategory],
  );
  const stormTypes = useMemo(
    () => uniq(inCategory.map((j) => j.stormType)),
    [inCategory],
  );
  const shownColors = useMemo(
    () => uniq(inCategory.filter((j) => !hidesColor(j)).map((j) => j.color)),
    [inCategory],
  );
  const hiddenColors = useMemo(
    () => uniq(inCategory.filter((j) => hidesColor(j)).map((j) => j.color)),
    [inCategory],
  );

  const filtered = useMemo(
    () =>
      inCategory.filter(
        (j) =>
          (!city || j.city === city) &&
          (!product || j.product === product) &&
          (!color || j.color === color) &&
          (!storm || j.stormType === storm),
      ),
    [inCategory, city, product, color, storm],
  );

  // Grid is finished work only. Before and during-install shots surface inside
  // the job card, where the phase bubble labels them.
  const photos: GridPhoto[] = useMemo(
    () =>
      filtered.flatMap((j) =>
        gridPhotosOf(j).map((p) => ({
          ...p,
          job: j,
          photoCount: j.photos.length,
        })),
      ),
    [filtered],
  );

  const activeCount = [city, product, color, storm].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  function clearFilters() {
    setCity(null);
    setProduct(null);
    setColor(null);
    setStorm(null);
  }

  return (
    <div>
      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="mb-6 inline-flex rounded-full border border-border bg-secondary p-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => switchCategory(c)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                category === c
                  ? "bg-navy-900 text-white"
                  : "text-slate-600 hover:text-navy-900",
              )}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      )}

      {/* Filter toggle. The chip lists run to ~50 entries across city, product
          and color, which on a phone is roughly two and a half screens of
          scrolling before a single roof appears (owner report 2026-08-01).
          Collapsed by default: the gallery is the point, filters are the tool.
          Any active filter keeps the panel open so a filtered view never looks
          unexplained. */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy-900"
        >
          <SlidersHorizontal
            className="size-4 text-steel-500"
            aria-hidden="true"
          />
          {filtersOpen ? "Hide filters" : "Filter photos"}
          {activeCount > 0 && (
            <span className="rounded-full bg-navy-900 px-2 py-0.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-steel-500 underline underline-offset-4"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className={cn("mt-4 flex-col gap-4", filtersOpen ? "flex" : "hidden")}
      >
        {cities.length > 1 && (
          <FilterRow label="City">
            {cities.map((c) => (
              <Pill
                key={c}
                active={city === c}
                onClick={() => setCity(city === c ? null : c)}
              >
                {c}
              </Pill>
            ))}
          </FilterRow>
        )}

        {category === "completed" && products.length > 0 && (
          <FilterRow label="Product">
            {products.map((p) => (
              <Pill
                key={p}
                active={product === p}
                onClick={() => setProduct(product === p ? null : p)}
              >
                {p}
              </Pill>
            ))}
          </FilterRow>
        )}

        {category === "completed" &&
          (shownColors.length > 0 || hiddenColors.length > 0) && (
            <FilterRow label="Color">
              {shownColors.map((c) => (
                <Pill
                  key={c}
                  active={color === c}
                  onClick={() => setColor(color === c ? null : c)}
                >
                  {c}
                </Pill>
              ))}
              {hiddenColors.length > 0 &&
                (showHiddenColors ? (
                  hiddenColors.map((c) => (
                    <Pill
                      key={c}
                      active={color === c}
                      onClick={() => setColor(color === c ? null : c)}
                    >
                      {c}
                    </Pill>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowHiddenColors(true)}
                    className="rounded-full border border-dashed border-steel-500 px-3.5 py-1.5 text-sm font-medium text-steel-500 hover:bg-secondary"
                  >
                    + Metal &amp; gutter colors
                  </button>
                ))}
            </FilterRow>
          )}

        {category === "storm" && stormTypes.length > 1 && (
          <FilterRow label="Damage">
            {stormTypes.map((s) => (
              <Pill
                key={s}
                active={storm === s}
                onClick={() => setStorm(storm === s ? null : s)}
              >
                {s}
              </Pill>
            ))}
          </FilterRow>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start text-sm font-medium text-steel-500 underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Photo grid */}
      <p className="mt-6 text-sm text-slate-500">
        {photos.length} photo{photos.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => {
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpenJob({ job: p.job, photoId: p.id })}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {p.photoCount > 1 && (
                <span className="absolute top-2 right-2 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-semibold text-white">
                  {p.photoCount} photos
                </span>
              )}
              {p.job.city && (
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-semibold text-white">
                  <MapPin className="size-3" aria-hidden="true" />
                  {p.job.city}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {openJob && (
        <JobCard
          job={openJob.job}
          startPhotoId={openJob.photoId}
          onClose={() => setOpenJob(null)}
        />
      )}
    </div>
  );
}

/**
 * Job card modal, the sibling photos + details for one job. Reused by the
 * gallery and (later) the project map.
 */
export function JobCard({
  job,
  startPhotoId,
  onClose,
}: {
  job: GalleryJob;
  startPhotoId?: string;
  onClose: () => void;
}) {
  // The card is the whole job: before, during install, and after, in that
  // order. One carousel, no side tray: tap in and swipe the story.
  const showcase = cardPhotosOf(job);

  const startIndex = Math.max(
    0,
    showcase.findIndex((p) => p.id === startPhotoId),
  );
  const [index, setIndex] = useState(startIndex);
  const photo = showcase[index] ?? job.photos[0];

  const next = () => setIndex((i) => (i + 1) % showcase.length);
  const prev = () =>
    setIndex((i) => (i - 1 + showcase.length) % showcase.length);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcase.length, onClose]);

  // Lock the page behind the modal so mobile scroll stays inside the card
  // instead of the gallery moving underneath. Paired with overscroll-contain on
  // the card's scroll region so it also doesn't rubber-band into the page.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Swipe the main image left/right to move through the job's photos (mobile).
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Horizontal, deliberate swipe only, ignore vertical scrolls/taps.
    if (
      Math.abs(dx) > 45 &&
      Math.abs(dx) > Math.abs(dy) * 1.5 &&
      showcase.length > 1
    ) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  const chips = [job.product, job.color, job.stormType].filter(
    Boolean,
  ) as string[];
  const phaseLabel = photo.phase ? PHASE_LABEL[photo.phase] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        // dvh (not vh) so the card fits the *visible* mobile viewport with the
        // URL bar showing, vh overflowed and pushed the CTAs off-screen.
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative bg-navy-950 select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            draggable={false}
            className="max-h-[46dvh] w-full object-contain sm:max-h-[60vh]"
          />
          {phaseLabel && (
            <span className="absolute top-3 left-3 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold text-white">
              {phaseLabel}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-navy-900"
          >
            <X className="size-5" />
          </button>
          {showcase.length > 1 && (
            <>
              {/* Arrows on ≥sm; on touch the image also swipes left/right. */}
              <div className="hidden sm:block">
                <NavBtn side="left" onClick={prev} />
                <NavBtn side="right" onClick={next} />
              </div>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold text-white">
                {index + 1} / {showcase.length}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto overscroll-contain p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <h3 className="text-lg font-bold text-navy-900">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {job.city && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-navy-900">
                <MapPin className="size-3.5 text-steel-500" /> {job.city}, MS
              </span>
            )}
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border px-3 py-1 text-sm text-slate-600"
              >
                {c}
              </span>
            ))}
          </div>

          {showcase.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {showcase.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative size-16 flex-none overflow-hidden rounded-lg border-2",
                    i === index ? "border-navy-900" : "border-transparent",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="h-full w-full object-cover"
                  />
                  {/* Thumbnails are tiny, so non-finished shots get a corner
                      dot rather than text the eye can't read at 64px. */}
                  {p.phase && p.phase !== "after" && (
                    <span className="absolute top-1 left-1 block size-2 rounded-full bg-white/90 ring-1 ring-navy-950/40" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="mt-1 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get a roof like this
            </Link>
            {job.href && (
              <Link
                href={job.href}
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy-900"
              >
                Full project page
              </Link>
            )}
            {siteConfig.phone.tel && (
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-navy-900"
              >
                {siteConfig.phone.display}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy-900",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      {side === "left" ? (
        <ChevronLeft className="size-5" />
      ) : (
        <ChevronRight className="size-5" />
      )}
    </button>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold tracking-wide text-steel-500 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Pill({
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
        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
        active
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-border bg-white text-slate-600 hover:border-steel-500 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}
