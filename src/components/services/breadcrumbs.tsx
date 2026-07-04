import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { BreadcrumbItem } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Visual breadcrumb trail for interior pages (PRD §4.1.1). The matching
 * BreadcrumbList JSON-LD is emitted by the page, not here.
 */
export function Breadcrumbs({
  items,
  onDark = false,
  className,
}: {
  items: BreadcrumbItem[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm",
          onDark ? "text-steel-300" : "text-slate-500",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 opacity-60"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn(
                    "font-medium",
                    onDark ? "text-white" : "text-navy-900",
                  )}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    "underline-offset-4 hover:underline",
                    onDark ? "hover:text-white" : "hover:text-navy-900",
                  )}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
