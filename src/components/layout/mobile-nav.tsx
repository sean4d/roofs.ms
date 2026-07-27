"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import { mainNav, primaryCta } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PhoneLink } from "@/components/shared/phone-link";

/** Mobile navigation drawer (below the xl breakpoint). */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  // Which parent item's sub-links are expanded (by href). Only one at a time.
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-80 border-border bg-white">
        <SheetHeader>
          <SheetTitle className="text-left font-display text-primary">
            Southeast Roofing
          </SheetTitle>
        </SheetHeader>
        {/*
          The drawer is a fixed, full-height flex column, so this scroller is
          what keeps the list reachable: expanding "Roofing Tools" adds enough
          rows to run past the bottom of the screen, and without an explicit
          overflow the items below it (Financing, Projects, About, Contact)
          were simply unreachable. `min-h-0` is required — a flex child's
          default `min-height: auto` refuses to shrink below its content and
          would defeat the overflow. `pb-10` clears the phone home indicator.
        */}
        <nav
          aria-label="Mobile navigation"
          className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-10"
        >
          <ul className="flex flex-col gap-1">
            {mainNav.map((link) => {
              if (!link.children) {
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }

              // Parent with sub-links: tapping the label still navigates to the
              // landing page; the chevron expands the sub-links inline.
              const isOpen = expanded === link.href;
              return (
                <li key={link.href}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block flex-1 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-label={`${link.label} sub-menu`}
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : link.href)}
                      className="grid size-11 flex-none place-items-center rounded-lg text-slate-500 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      <ChevronDown
                        className={cn(
                          "size-5 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  {isOpen && (
                    <ul className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                      {link.children.map((child) => {
                        const external = child.href.startsWith("http");
                        const cls =
                          "block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-secondary hover:text-primary";
                        return (
                          <li key={child.href}>
                            {external ? (
                              <a
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className={cls}
                              >
                                {child.label}
                              </a>
                            ) : (
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
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
          <div className="mt-6 flex flex-col gap-3 px-3">
            <Button
              render={
                <Link href={primaryCta.href} onClick={() => setOpen(false)} />
              }
              nativeButton={false}
              size="lg"
            >
              {primaryCta.label}
            </Button>
            <PhoneLink className="justify-center text-primary" />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
