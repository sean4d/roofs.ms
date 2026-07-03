"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNav, primaryCta } from "@/config/navigation";
import { brandAssets } from "@/content/brand-assets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * Sticky site header. Transparent over the top of the page, condensing into
 * a blurred charcoal bar once the user scrolls (PRD §3 persistent elements).
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-charcoal-700 bg-charcoal-950/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-4 transition-all duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        {/* Official logo (white knockout for the dark theme) */}
        <Link
          href="/"
          className="shrink-0"
          aria-label="Southeast Roofing — home"
        >
          <Image
            src={brandAssets.logo.light}
            alt="Southeast Roofing"
            width={brandAssets.logo.aspect.width}
            height={brandAssets.logo.aspect.height}
            className="h-11 w-auto"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {mainNav.map((link) => {
              const active =
                link.href === pathname || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-white",
                      active ? "text-white" : "text-silver-400",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <PhoneLink className="hidden text-sm text-silver-200 xl:inline-flex" />
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
