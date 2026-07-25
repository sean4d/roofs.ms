"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";

import {
  hidesColor,
  type GalleryCategory,
  type GalleryJob,
  type GalleryPhoto,
} from "@/lib/gallery";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Unified projects gallery. Two categories (Completed / Storm Response) with
 * dynamic, never-empty filters. Every photo shows in the grid; clicking one
 * opens its job card (sibling photos + details). The job card is also what a
 * future map pin opens — see JobCard.
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
  /** How many showcase (non-before) photos this job has. */
  showcaseCount: number;
}

/** Phase badge styling — only "before/after" jobs show these (owner rule:
 *  old "before" roofs must never read as fresh work). */
const PHASE_BADGE: Record<string, { label: string; cls: string }> = {
  before: { label: "Before", cls: "bg-amber-500 text-white" },
  progress: { label: "During", cls: "bg-steel-500 text-white" },
  after: { label: "After", cls: "bg-emerald-600 text-white" },
};

/** Photos shown in the grid + carousel — everything except "before" shots. */
function showcaseOf(job: GalleryJob) {
  const showcase = job.photos.filter((p) => p.phase !== "before");
  return showcase.length > 0 ? showcase : job.photos;
}
function beforeOf(job: GalleryJob) {
  return job.photos.filter((p) => p.phase === "before");
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

  // Grid shows only showcase (after / during) photos — "before" shots are
  // hidden here and surface only inside the job card, clearly labelled.
  const photos: GridPhoto[] = useMemo(
    () =>
      filtered.flatMap((j) => {
        const showcase = showcaseOf(j);
        return showcase.map((p) => ({
          ...p,
          job: j,
          showcaseCount: showcase.length,
        }));
      }),
    [filtered],
  );

  const hasFilters = Boolean(city || product || color || storm);

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

      {/* Filters */}
      <div className="flex flex-col gap-4">
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
            onClick={() => {
              setCity(null);
              setProduct(null);
              setColor(null);
              setStorm(null);
            }}
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
              {p.showcaseCount > 1 && (
                <span className="absolute top-2 right-2 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-semibold text-white">
                  {p.showcaseCount} photos
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
 * Job card modal — the sibling photos + details for one job. Reused by the
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
  const showcase = showcaseOf(job);
  const before = beforeOf(job);
  // Phase badges only appear on genuine before/after jobs, so an "After" tag
  // always has a "Before" to pair with.
  const showPhase = before.length > 0;

  const startIndex = Math.max(
    0,
    showcase.findIndex((p) => p.id === startPhotoId),
  );
  const [index, setIndex] = useState(startIndex);
  // Lets a "before" thumbnail take over the main viewer without joining the
  // showcase carousel.
  const [beforeView, setBeforeView] = useState<GalleryPhoto | null>(null);
  const photo = beforeView ?? showcase[index] ?? job.photos[0];

  const next = () => {
    setBeforeView(null);
    setIndex((i) => (i + 1) % showcase.length);
  };
  const prev = () => {
    setBeforeView(null);
    setIndex((i) => (i - 1 + showcase.length) % showcase.length);
  };

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
    // Horizontal, deliberate swipe only — ignore vertical scrolls/taps.
    if (
      Math.abs(dx) > 45 &&
      Math.abs(dx) > Math.abs(dy) * 1.5 &&
      showcase.length > 1 &&
      !beforeView
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
  const badge = photo.phase ? PHASE_BADGE[photo.phase] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        // dvh (not vh) so the card fits the *visible* mobile viewport with the
        // URL bar showing — vh overflowed and pushed the CTAs off-screen.
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
          {showPhase && badge && (
            <span
              className={cn(
                "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
                badge.cls,
              )}
            >
              {badge.label}
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
          {showcase.length > 1 && !beforeView && (
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
                  onClick={() => {
                    setBeforeView(null);
                    setIndex(i);
                  }}
                  className={cn(
                    "size-16 flex-none overflow-hidden rounded-lg border-2",
                    !beforeView && i === index
                      ? "border-navy-900"
                      : "border-transparent",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {before.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-amber-700 uppercase">
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-white">
                  Before
                </span>
                What this roof looked like before we started
              </p>
              <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                {before.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setBeforeView(p)}
                    className={cn(
                      "relative size-16 flex-none overflow-hidden rounded-lg border-2",
                      beforeView?.id === p.id
                        ? "border-amber-500"
                        : "border-transparent",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
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
