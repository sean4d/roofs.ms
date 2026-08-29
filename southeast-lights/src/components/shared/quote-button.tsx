"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { primaryCta } from "@/config/navigation";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The site's dominant action. Always more visually important than Call, on
 * every surface, because a quote request is a qualified lead and a phone call
 * is an interruption that may or may not be one.
 */
export function QuoteButton({
  className,
  label,
  href,
  location,
  showArrow = true,
}: {
  className?: string;
  label?: string;
  href?: string;
  /** Where the click happened, for attribution in analytics. */
  location: string;
  showArrow?: boolean;
}) {
  return (
    <Link
      href={href ?? primaryCta.href}
      onClick={() => track("quote_cta_click", { location })}
      className={cn("btn-primary", className)}
    >
      {label ?? primaryCta.label}
      {showArrow ? <ArrowRight className="size-4" strokeWidth={2} /> : null}
    </Link>
  );
}
