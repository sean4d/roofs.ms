import { siteConfig } from "@/config/site";

/**
 * Credentials. Every one of these belongs to Southeast Roofing LLC — which
 * is the SAME legal entity, so they genuinely cover this work — but they are
 * always attributed to that name rather than implied as Southeast Lights'
 * own.
 *
 * Two hard rules, enforced here and inherited by every other trust surface:
 *   1. No GAF anywhere on this site. It certifies shingle installation and
 *      would read as a lighting credential it is not.
 *   2. The BBB accreditation is filed under the roofing name and does not
 *      list the d/b/a, so it renders with attribution or not at all.
 */
export function TrustBar() {
  const { google, parent } = siteConfig;

  const facts = [
    google.reviewCount > 0
      ? {
          value: `${google.rating.toFixed(1)} stars`,
          label: `${google.reviewCount} Google reviews`,
        }
      : null,
    parent.license
      ? {
          value: `MS #${parent.license}`,
          label: `Licensed & insured under ${parent.name}`,
        }
      : null,
    {
      value: `BBB ${parent.bbb.rating}`,
      label: `Accredited as ${parent.bbb.attributedTo}`,
    },
    {
      value: "Same crews",
      label: "The roofers who work your roofline year-round",
    },
  ].filter((fact) => fact !== null);

  return (
    <section className="border-y border-[#d8dee6] bg-[#f5f7fa]">
      <div className="container-site grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.value} className="flex flex-col gap-1">
            <span className="font-display text-lg font-semibold text-navy-800">
              {fact.value}
            </span>
            <span className="text-sm text-slate-600">{fact.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
