import { trustItems } from "@/content/homepage";
import { brandMarks, type BrandMarkKey } from "@/components/shared/brand-marks";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Credential strip (PRD §3.2): confirmed certifications only, directly
 * under the hero. Owner request 2026-07-05: same brand-mark tiles and
 * card style as the Reputation section, for a consistent trust language.
 */

/** Map trust items to their brand marks by label keyword. */
function markFor(label: string): React.ReactNode {
  const key: BrandMarkKey = label.includes("GAF")
    ? "gaf"
    : label.includes("BBB")
      ? "bbb"
      : label.includes("Warranty") || label.includes("warranty")
        ? "warranty"
        : label.includes("Insured") || label.includes("insured")
          ? "insured"
          : label.includes("Google")
            ? "google"
            : "msboc";
  return brandMarks[key];
}

export function TrustBar() {
  return (
    <section
      aria-label="Credentials"
      className="border-y border-border bg-secondary py-12"
    >
      <div className="container-site">
        <StaggerGroup as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trustItems.map(({ label, detail }) => (
            <StaggerItem
              as="li"
              key={label}
              className="shadow-premium h-full rounded-2xl border border-border bg-white p-5 sm:p-6"
            >
              {markFor(label)}
              <h3 className="mt-4 font-display text-sm font-bold text-navy-900 sm:text-base">
                {label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {detail}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
