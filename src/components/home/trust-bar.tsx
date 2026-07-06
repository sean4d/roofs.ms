import { ExternalLink } from "lucide-react";

import { reviewsSection } from "@/content/homepage";
import { brandMarks } from "@/components/shared/brand-marks";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Credential strip under the hero (owner request 2026-07-05): the same
 * four verifiable badges as the Reputation section — Google, GAF, BBB,
 * MSBOC — each linking to its official record. Lifetime/insured tiles
 * removed; these four are all externally checkable.
 */
export function TrustBar() {
  return (
    <section
      aria-label="Credentials"
      className="border-y border-border bg-secondary py-12"
    >
      <div className="container-site">
        {/* Screen-reader-only section heading — keeps the document outline
            sequential (h1 → h2 → the h3 badge titles), no visual change. */}
        <h2 className="sr-only">Our credentials</h2>
        <StaggerGroup as="ul" className="grid grid-cols-4 gap-2 sm:gap-4">
          {reviewsSection.badges.map((badge) => {
            const inner = (
              <>
                <div className="flex items-center justify-center sm:justify-between">
                  {brandMarks[badge.key as keyof typeof brandMarks]}
                  {badge.href && (
                    <ExternalLink
                      className="hidden size-4 text-slate-400 transition-colors group-hover:text-steel-500 sm:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="mt-2 font-display text-[11px] leading-tight font-bold text-navy-900 sm:mt-4 sm:text-base">
                  {badge.title}
                </h3>
                <p className="mt-1 hidden text-xs leading-relaxed text-slate-600 sm:block sm:text-sm">
                  {badge.subtitle}
                </p>
                {badge.cta && (
                  <span className="mt-3 hidden text-xs font-semibold text-steel-500 underline-offset-4 transition-colors group-hover:text-navy-900 group-hover:underline sm:inline-block">
                    {badge.cta} ↗
                  </span>
                )}
              </>
            );
            const card =
              "group flex h-full flex-col items-center text-center rounded-2xl border border-border bg-white p-2.5 shadow-premium transition-all duration-300 sm:items-start sm:p-6 sm:text-left";
            return (
              <StaggerItem as="li" key={badge.key} className="h-full">
                {badge.href ? (
                  <a
                    href={badge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${card} hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={card}>{inner}</div>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
