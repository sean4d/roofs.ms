import Link from "next/link";
import { Handshake } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";

/**
 * Subcontractor credit for roof washing (owner-confirmed 2026-07-30).
 *
 * States the arrangement plainly and puts the lead flow beyond doubt: the
 * customer contracts, schedules, and communicates with Southeast Roofing.
 * The partner is credited by name; it becomes a link only once
 * siteConfig.partners.exteriorCleaning.url is supplied — never a guessed URL
 * (integrity rule: honest placeholder over invented data).
 */
export function SubcontractorCredit() {
  const partner = siteConfig.partners.exteriorCleaning;

  return (
    <Section tone="surface">
      <Reveal className="mx-auto max-w-3xl rounded-2xl border border-border bg-background p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid size-11 flex-none place-items-center rounded-full bg-secondary"
          >
            <Handshake className="size-5 text-steel-500" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              Who performs the work
            </h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              Roof washing is performed by{" "}
              {partner.url ? (
                <Link
                  href={partner.url}
                  rel="noopener"
                  target="_blank"
                  className="font-semibold text-navy-900 underline underline-offset-4 hover:text-steel-500"
                >
                  {partner.name}
                </Link>
              ) : (
                <span className="font-semibold text-navy-900">
                  {partner.name}
                </span>
              )}
              , our exterior-cleaning subcontractor. You contract, schedule, and
              communicate through Southeast Roofing, and we remain responsible
              for the customer relationship, the roof evaluation, project
              coordination, and the overall scope of the work.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
