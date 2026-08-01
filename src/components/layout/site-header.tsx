"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown, Phone } from "lucide-react";

import type { NavLink } from "@/config/navigation";

import { siteConfig } from "@/config/site";
import { mainNav, primaryCta } from "@/config/navigation";
import { brandAssets } from "@/content/brand-assets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Sticky site header (PRD §6 v3, light, premium). White surface that gains
 * a soft border + shadow once the user scrolls; condenses slightly.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  // Which nav dropdown (by href) is open; only one at a time.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close when the user clicks away or presses Escape. (Navigating via a nav
  // link closes it through the links' own onClick, since this client component
  // doesn't unmount on route change.)
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const isActive = (link: NavLink) =>
    link.href === pathname ||
    pathname.startsWith(`${link.href}/`) ||
    (link.children?.some(
      (c) => c.href === pathname || pathname.startsWith(`${c.href}/`),
    ) ??
      false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "shadow-premium border-b border-border"
          : "border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-6 transition-all duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        {/*
          Brand lockup (owner refinement 2026-07-04): roof mark + readable
          HTML wordmark so "Southeast Roofing" is prominent even on phones.
        */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Southeast Roofing, home"
        >
          <Image
            src={brandAssets.logo.mark}
            /* Descriptive alt for crawlers/image search. The anchor's
               aria-label supplies the accessible name, so screen readers
               announce the link once, no duplicate announcement. */
            alt="Southeast Roofing logo"
            width={brandAssets.logo.markAspect.width}
            height={brandAssets.logo.markAspect.height}
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-9 sm:h-10" : "h-10 sm:h-12",
            )}
            priority
          />
          <span className="font-display text-lg leading-none font-bold tracking-tight text-navy-900 sm:text-xl">
            Southeast
            <br className="sm:hidden" />
            <span className="sm:before:content-['_']">Roofing</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="hidden xl:block"
        >
          <ul className="flex items-center gap-4">
            {mainNav.map((link) => {
              const active = isActive(link);

              if (!link.children) {
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        active ? "text-primary" : "text-slate-600",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }

              // Item with a dropdown: the label links to its landing page; the
              // chevron button toggles the sub-menu (owner request).
              const open = openMenu === link.href;
              return (
                <li key={link.href} className="relative flex items-center">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenMenu(null)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      active ? "text-primary" : "text-slate-600",
                    )}
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    aria-label={`${link.label} menu`}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    onClick={() => setOpenMenu(open ? null : link.href)}
                    className="ml-0.5 grid size-6 place-items-center rounded text-slate-500 transition-colors hover:text-primary"
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        open && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {open && (
                    <ul
                      role="menu"
                      className="shadow-premium absolute left-0 top-full z-50 mt-2 w-60 rounded-2xl border border-border bg-white p-2"
                    >
                      {link.children.map((child) => {
                        const external = child.href.startsWith("http");
                        const cls =
                          "block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-secondary hover:text-primary";
                        return (
                          <li key={child.href} role="none">
                            {external ? (
                              <a
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                role="menuitem"
                                onClick={() => setOpenMenu(null)}
                                className={cls}
                              >
                                {child.label}
                              </a>
                            ) : (
                              <Link
                                href={child.href}
                                role="menuitem"
                                onClick={() => setOpenMenu(null)}
                                className={cls}
                              >
                                {child.label}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/*
            Call-first conversion (Phase 4 §6): the number is always one tap
            away, full Call Now button on desktop, icon button on mobile.
          */}
          {siteConfig.phone.tel && (
            <>
              <Button
                variant="outline"
                render={<a href={`tel:${siteConfig.phone.tel}`} />}
                nativeButton={false}
                className="hidden lg:inline-flex"
              >
                <Phone className="size-4" aria-hidden="true" />
                {siteConfig.phone.display}
              </Button>
              <a
                href={`tel:${siteConfig.phone.tel}`}
                aria-label={`Call Southeast Roofing at ${siteConfig.phone.display}`}
                className="flex size-10 items-center justify-center rounded-full bg-navy-900 text-white transition-colors hover:bg-navy-700 lg:hidden"
              >
                <Phone className="size-4.5" aria-hidden="true" />
              </a>
            </>
          )}
          <Button
            render={<Link href={primaryCta.href} />}
            nativeButton={false}
            className="hidden sm:inline-flex"
          >
            {primaryCta.label}
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
