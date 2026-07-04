"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { mainNav, primaryCta } from "@/config/navigation";
import { brandAssets } from "@/content/brand-assets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Sticky site header (PRD §6 v3 — light, premium). White surface that gains
 * a soft border + shadow once the user scrolls; condenses slightly.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          aria-label="Southeast Roofing — home"
        >
          <Image
            src={brandAssets.logo.mark}
            alt=""
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
        <nav aria-label="Main navigation" className="hidden xl:block">
          <ul className="flex items-center gap-5">
            {mainNav.map((link) => {
              const active =
                link.href === pathname || pathname.startsWith(`${link.href}/`);
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
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/*
            Call-first conversion (Phase 4 §6): the number is always one tap
            away — full Call Now button on desktop, icon button on mobile.
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
