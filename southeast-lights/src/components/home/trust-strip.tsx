import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { BadgeCheck, HardHat, ShieldCheck, Star } from "lucide-react";

import { GOOGLE_AGGREGATE, reviewCountLabel } from "@/config/reviews";
import { siteConfig } from "@/config/site";

/**
 * Credentials.
 *
 * Every one of these belongs to Southeast Roofing LLC, which is the SAME
 * legal entity, so they genuinely cover this work. They are always attributed
 * to that name rather than implied as Southeast Lights' own.
 *
 * NO GAF ANYWHERE ON THIS SITE. GAF certifies shingle installation; on a
 * lighting page a manufacturer badge reads as a credential for the work being
 * sold, which it is not.
 */
export function TrustStrip() {
  const facts = [
    {
      icon: Star,
      value: `${GOOGLE_AGGREGATE.ratingValue.toFixed(1)} on Google`,
      label: `${reviewCountLabel()} reviews, both profiles`,
      href: GOOGLE_AGGREGATE.profileUrl,
    },
    {
      icon: HardHat,
      value: "Licensed contractor",
      label: siteConfig.parent.license
        ? `MS #${siteConfig.parent.license} via ${siteConfig.parent.name}`
        : siteConfig.parent.name,
    },
    {
      icon: ShieldCheck,
      value: "Fully insured",
      label: "Certificates available for commercial work",
    },
    {
      icon: BadgeCheck,
      value: `BBB ${siteConfig.parent.bbb.rating}`,
      label: `Accredited as ${siteConfig.parent.bbb.attributedTo}`,
      href: siteConfig.parent.bbb.profile,
    },
  ];

  return (
    <section className="border-y border-white/10 bg-ink-900">
      <StaggerGroup className="container-site grid gap-x-8 gap-y-7 py-9 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => {
          const Icon = fact.icon;
          const inner = (
            <>
              <Icon
                className="mt-0.5 size-5 shrink-0 text-champagne-400"
                strokeWidth={1.5}
              />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-bone-100">
                  {fact.value}
                </span>
                <span className="mt-0.5 text-xs leading-snug text-bone-500">
                  {fact.label}
                </span>
              </span>
            </>
          );

          return (
            <StaggerItem key={fact.value}>
              {fact.href ? (
                <a
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-opacity hover:opacity-80"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-start gap-3">{inner}</div>
              )}
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
