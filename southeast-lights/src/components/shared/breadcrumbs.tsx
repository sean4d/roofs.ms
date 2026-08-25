import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Visible breadcrumbs. Paired with BreadcrumbList schema at the page level. */
export function Breadcrumbs({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-white/[0.07]">
      <ol className="container-site flex flex-wrap items-center gap-1.5 py-4 text-xs text-bone-500">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="size-3 opacity-50" strokeWidth={2} />
              ) : null}
              {last ? (
                <span className="text-bone-300" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-champagne-300">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
