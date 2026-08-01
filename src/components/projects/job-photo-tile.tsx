"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { staticJobForSrc } from "@/lib/gallery";
import { cn } from "@/lib/utils";

import { JobCard } from "./unified-gallery";

/**
 * Reusable job photo: shows the city/town tag (transparency + local proof) and,
 * when clicked, opens the job card for that roof, from ANY page. Resolves the
 * photo's job from the static gallery index, so a stray proof photo on a service
 * or city page behaves exactly like one in the main gallery.
 */
export function JobPhotoTile({
  src,
  alt,
  city,
  className,
}: {
  src: string;
  alt: string;
  city?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const job = staticJobForSrc(src);
  const startPhotoId = job?.photos.find((p) => p.src === src)?.id;
  const cityLabel = city ?? job?.city;

  return (
    <>
      <button
        type="button"
        onClick={() => job && setOpen(true)}
        aria-label={job ? `${alt}, view job` : alt}
        className={cn(
          "group relative block h-full w-full overflow-hidden",
          job ? "cursor-pointer" : "cursor-default",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {cityLabel && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-semibold text-white">
            <MapPin className="size-3" aria-hidden="true" />
            {cityLabel}
          </span>
        )}
      </button>
      {open && job && (
        <JobCard job={job} startPhotoId={startPhotoId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
