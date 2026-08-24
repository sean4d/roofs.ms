"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

import { BrandLockup } from "@/components/shared/brand-lockup";
import { PhoneLink } from "@/components/shared/phone-link";
import { mainNav, primaryCta, visibleNav } from "@/config/navigation";

/**
 * Night-surface header. Divisions that are flagged off (Landscape, Event)
 * never render, because visibleNav strips them — so an unbuilt division can
 * never leak into the nav by accident.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const nav = visibleNav(mainNav);

  return (
    <header className="surface-night sticky top-0 z-50 border-b border-night-700/70 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <BrandLockup />

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {nav.map((item) =>
            item.children?.length ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.href)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-steel-100 transition-colors hover:text-glow-400"
                >
                  {item.label}
                  <ChevronDown className="size-3.5" strokeWidth={1.5} />
                </Link>
                {openGroup === item.href ? (
                  <div className="absolute left-0 top-full w-64 rounded-card border border-night-700 bg-night-800 p-2 shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-steel-100 transition-colors hover:bg-night-700 hover:text-glow-400"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-steel-100 transition-colors hover:text-glow-400"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <PhoneLink className="hidden text-sm text-steel-100 transition-colors hover:text-glow-400 lg:inline-flex" />
          <Link
            href={primaryCta.href}
            className="hidden rounded-lg bg-glow-500 px-4 py-2.5 text-sm font-semibold text-night-950 transition-colors hover:bg-glow-400 sm:inline-block"
          >
            {primaryCta.label}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-steel-100 xl:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-night-700 xl:hidden">
          <nav aria-label="Mobile" className="container-site flex flex-col py-4">
            {nav.map((item) => (
              <div key={item.href} className="border-b border-night-800 py-1">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-medium text-steel-100"
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="mb-2 ml-3 flex flex-col border-l border-night-700 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 text-sm text-steel-300"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link
              href={primaryCta.href}
              onClick={() => setMobileOpen(false)}
              className="mt-4 rounded-lg bg-glow-500 px-4 py-3 text-center text-sm font-semibold text-night-950"
            >
              {primaryCta.label}
            </Link>
            <PhoneLink className="mt-3 justify-center py-2 text-sm text-steel-100" />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
