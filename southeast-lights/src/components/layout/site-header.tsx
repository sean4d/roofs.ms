"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { QuoteButton } from "@/components/shared/quote-button";
import { mainNav, type NavLink } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Sticky header that compresses on scroll.
 *
 * Desktop shows a dropdown per section; mobile gets a full-height panel with
 * large tap targets, since the mobile nav has to be usable one-handed.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  /*
   * HYSTERESIS, and it is load-bearing rather than a nicety.
   *
   * A single threshold made the header shake itself apart. The header is
   * sticky, so it occupies layout: crossing the threshold swaps h-24 for
   * h-16 and removes 32px from the document. On a page whose height is close
   * to the viewport that shortens the scrollable range, the browser clamps
   * scrollY back down, the header crosses the threshold the other way, grows
   * 32px, and the whole thing oscillates every frame. Reported as the header
   * banner and the hero text twitching a fraction below the top of the page,
   * and stopping the moment you scroll either way, which is exactly the
   * signature: it only happens inside the band where the feedback closes.
   *
   * Two thresholds with a gap between them breaks the loop. It takes 72px to
   * compress and a return to 16px to expand, so the 32px the header gives
   * back can never re-cross the line that made it shrink.
   */
  useEffect(() => {
    const COMPRESS_AT = 72;
    const EXPAND_AT = 16;
    let frame = 0;

    const onScroll = () => {
      // Coalesce to one read per frame: scroll fires far faster than paint,
      // and reading scrollY in the handler is a layout read either way.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled((was) => (was ? y > EXPAND_AT : y > COMPRESS_AT));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Stop the page scrolling behind the open panel. The panel closes itself
  // on navigation via each link's onClick, which avoids a setState-in-effect.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-ink-950/92 backdrop-blur-lg"
          : "border-transparent bg-gradient-to-b from-ink-950/85 to-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[100rem] items-center justify-between gap-6 px-5 transition-all duration-300 sm:px-8 lg:px-10",
          scrolled ? "h-16" : "h-20 lg:h-24",
        )}
      >
        <Logo />

        <nav
          aria-label="Main"
          className="hidden min-w-0 flex-1 items-center justify-center gap-0 xl:flex"
        >
          {mainNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isOpen={openGroup === item.href}
              onOpen={() => setOpenGroup(item.href)}
              onClose={() => setOpenGroup(null)}
            />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <QuoteButton
            location="header"
            className="hidden px-5 py-2.5 text-sm whitespace-nowrap sm:inline-flex"
            showArrow={false}
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 rounded-md p-2.5 text-bone-100 xl:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open ? <MobilePanel onNavigate={() => setOpen(false)} /> : null}
    </header>
  );
}

function NavItem({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavLink;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className="rounded-md px-2 py-2 text-[0.78rem] font-medium whitespace-nowrap text-bone-300 transition-colors hover:text-champagne-300 2xl:px-3 2xl:text-[0.83rem]"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        href={item.href}
        className="inline-flex items-center gap-0.5 rounded-md px-2 py-2 text-[0.78rem] font-medium whitespace-nowrap text-bone-300 transition-colors hover:text-champagne-300 2xl:px-3 2xl:text-[0.83rem]"
      >
        {item.label}
        <ChevronDown className="size-3.5 opacity-60" strokeWidth={2} />
      </Link>
      {isOpen ? (
        <div className="absolute top-full left-0 w-80 pt-2">
          <div className="rounded-card border border-white/10 bg-ink-900/97 p-2 shadow-2xl backdrop-blur-lg">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
              >
                <span className="block text-sm font-medium text-bone-100">
                  {child.label}
                </span>
                {child.description ? (
                  <span className="mt-0.5 block text-xs leading-snug text-bone-500">
                    {child.description.length > 92
                      ? `${child.description.slice(0, 92).trimEnd()}...`
                      : child.description}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobilePanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-ink-950 xl:hidden">
      <nav
        aria-label="Mobile"
        className="container-site flex flex-col py-4 pb-28"
      >
        {mainNav.map((item) => (
          <div key={item.href} className="border-b border-white/[0.07] py-1">
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block py-3.5 text-[0.95rem] font-medium text-bone-100"
            >
              {item.label}
            </Link>
            {item.children?.length ? (
              <div className="mb-3 ml-1 flex flex-col gap-0.5 border-l border-white/10 pl-4">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="py-2.5 text-sm text-bone-500"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </div>
  );
}
