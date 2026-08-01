"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowRight, BadgeCheck, Image as ImageIcon } from "lucide-react";

import { ROOF_PRODUCTS } from "@/config/roof-colors";
import { projectPhotos } from "@/content/photos";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** A real color photo sourced from a live Sanity job upload (passed by the page). */
export interface VisualizerRealPhoto {
  material: string;
  product?: string;
  color?: string;
  src: string;
  alt: string;
  city?: string;
}

export function ColorVisualizer({
  sanityPhotos = [],
}: {
  sanityPhotos?: VisualizerRealPhoto[];
}) {
  const [productKey, setProductKey] = useState(ROOF_PRODUCTS[0].key);
  const product = useMemo(
    () => ROOF_PRODUCTS.find((p) => p.key === productKey) ?? ROOF_PRODUCTS[0],
    [productKey],
  );
  const [colorName, setColorName] = useState(product.colors[0].name);

  useEffect(() => {
    track("tool_opened", { tool: "color-visualizer" });
  }, []);

  // Keep the color valid when switching products.
  const activeColor =
    product.colors.find((c) => c.name === colorName) ?? product.colors[0];

  // Photo priority: real static job photo → real Sanity upload → product
  // sample placeholder → flat swatch. Real photos always win, so placeholders
  // self-retire the moment we log a roof in that color.
  const preview = useMemo(() => {
    const isMetal = product.material === "metal";
    const name = activeColor.name.toLowerCase();

    const staticReal = projectPhotos.find(
      (p) =>
        p.kind === "completed" &&
        p.manufacturer === product.manufacturer &&
        p.line === product.line &&
        p.color?.toLowerCase() === name,
    );
    if (staticReal)
      return { src: staticReal.src, alt: staticReal.alt, city: staticReal.city, real: true as const };

    const sanityReal = sanityPhotos.find((s) => {
      if (s.color?.toLowerCase() !== name) return false;
      if (isMetal) return s.material === "metal";
      return (
        s.material === "shingle" &&
        !!s.product &&
        !!product.line &&
        s.product.toLowerCase().includes(product.line.toLowerCase())
      );
    });
    if (sanityReal)
      return { src: sanityReal.src, alt: sanityReal.alt, city: sanityReal.city, real: true as const };

    if (activeColor.sample)
      return {
        src: activeColor.sample.src,
        alt: activeColor.sample.alt,
        city: undefined,
        real: false as const,
      };

    return null;
  }, [product, activeColor, sanityPhotos]);

  function pickColor(name: string) {
    setColorName(name);
    track("color_selected", { tool: "color-visualizer", product: product.label, color: name });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      {/* Preview */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="relative aspect-[4/3] bg-secondary">
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.src}
                alt={preview.alt}
                className="h-full w-full object-cover"
              />
              {preview.real ? (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/75 px-3 py-1 text-xs font-semibold text-white">
                  <BadgeCheck className="size-3.5" /> Real job: {preview.city}, MS
                </span>
              ) : (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/75 px-3 py-1 text-xs font-semibold text-white">
                  <ImageIcon className="size-3.5" /> Product sample
                </span>
              )}
            </>
          ) : (
            <div
              className="flex h-full w-full items-end p-5"
              style={{ backgroundColor: activeColor.hex }}
            >
              <span className="rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-navy-900">
                Color sample
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-bold text-navy-900">{product.label}</p>
            <p className="text-sm text-slate-600">{activeColor.name}</p>
          </div>
          <span
            className="size-9 rounded-full border border-border"
            style={{ backgroundColor: activeColor.hex }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy-900">Roof product</span>
          <div className="flex flex-wrap gap-2">
            {ROOF_PRODUCTS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setProductKey(p.key);
                  setColorName(p.colors[0].name);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                  p.key === productKey
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-border bg-white text-slate-600 hover:border-steel-500",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy-900">Color</span>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => pickColor(c.name)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition",
                  c.name === activeColor.name ? "border-navy-900" : "border-border hover:border-steel-500",
                )}
              >
                <span
                  className="h-12 w-full rounded-lg border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-medium text-navy-900">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/free-inspection"
            onClick={() =>
              track("cta_click", { action: "request-color", source: "color-visualizer", color: activeColor.name })
            }
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3 font-semibold text-white"
          >
            Request this color
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/projects"
            onClick={() => track("cta_click", { action: "see-local-projects", source: "color-visualizer" })}
            className="inline-flex items-center rounded-full border border-border px-5 py-3 font-semibold text-navy-900"
          >
            See local projects
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          Photos marked &ldquo;Real job&rdquo; are actual {siteConfig.name} roofs near you;
          &ldquo;Product sample&rdquo; images are manufacturer swatches shown until we log
          that color locally. Actual color varies with light and pitch: ask us for a
          physical sample.
        </p>
      </div>
    </div>
  );
}
