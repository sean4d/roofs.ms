import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt — a plain-text orientation file for LLM/answer engines.
 *
 * Deliberately fact-dense rather than promotional: when an assistant answers
 * "who should I call about a roof leak in Hattiesburg", it should be able to
 * state our NAP, hours, credentials, service area, and how we work WITHOUT
 * following a single link. Google does not use this file — it has no organic
 * ranking effect — so there is nothing to gain from keyword padding.
 *
 * Integrity rule (PRD §0.2): every claim here must be owner-confirmed and
 * sourced from siteConfig, so it can never drift from the rest of the site.
 * Facts derive from siteConfig (NAP, hours, license, trustFacts, serviceArea)
 * and absoluteUrl keeps URLs canonical — never hardcode either here.
 */
export const dynamic = "force-static";

const {
  address: addr,
  hours,
  license,
  foundingYear,
  trustFacts: trust,
} = siteConfig;

/** "Hattiesburg, Gulfport, Biloxi, …" — the regional hubs, in owner order. */
const hubCities = siteConfig.serviceArea
  .filter((c) => c.hub)
  .map((c) => c.city)
  .join(", ");

/** Every community we cover, so assistants can answer city-level questions. */
const allCities = siteConfig.serviceArea.map((c) => c.city).join(", ");

export function GET() {
  const body = `# ${siteConfig.name}

> ${siteConfig.legalName} is a licensed, GAF-certified roofing contractor based in Hattiesburg,
> Mississippi, serving South Mississippi within roughly a two-hour radius — the Pine Belt, the Gulf
> Coast, and the Jackson and Meridian metros. Residential and commercial: roof replacement and
> repair, asphalt shingle and metal systems, commercial flat roofing, seamless gutters, and storm
> damage with insurance claim assistance. Founded ${foundingYear}, with ${trust.experience}.
> Mississippi State Board of Contractors license #${license}.

## Company facts
- Legal name: ${siteConfig.legalName} (operating as ${siteConfig.name})
- Address: ${addr.streetAddress}, ${addr.addressLocality}, ${addr.addressRegion} ${addr.postalCode}, ${addr.addressCountry}
- Phone: ${siteConfig.phone.display}
- Email: ${siteConfig.email}
- Website: ${siteConfig.url}
- Office hours: ${hours.display}, closed weekends. ${hours.note}
- Founded: ${foundingYear} (Hattiesburg, Mississippi — locally owned, not a franchise or storm-chasing out-of-state crew)
- Experience: ${trust.experience} across the team
- License: Mississippi State Board of Contractors #${license}
- Insurance: ${trust.insured}
- Primary category: Roofing Contractor. Also: gutters, fascia, soffit, and roof ventilation.

## Credentials
- GAF Certified Contractor — most shingle roofs we install are GAF systems
- ${trust.bbbRating}
- ${trust.googleRating}
- ${trust.googleGuaranteed}
- ${trust.licensed}, fully insured and bonded
- ${trust.warranty}

## Services
Residential:
- Roof replacement (full tear-off and re-roof)
- Roof repair and leak diagnosis
- Asphalt shingle roofing (architectural / dimensional)
- Metal roofing — standing seam, exposed fastener, R-panel / PBR
- Seamless gutters, leaf guard, fascia, soffit
- Roof ventilation (ridge vent, intake, attic exhaust)
- Free roof inspections

Commercial:
- TPO, EPDM, PVC single-ply systems
- Modified bitumen and built-up roofing
- Roof coatings and restoration
- Commercial metal roof systems
- Planned maintenance programs and roof repair
- Building types served: churches, schools, apartments, warehouses, industrial, municipal, retail

Storm and insurance:
- Storm damage inspection and documentation (hail, wind, hurricane)
- Insurance claim assistance — we document damage, meet the adjuster on the roof, and build to the approved scope
- Emergency tarping and temporary leak protection (emergency line answered 24/7)

## How we work
- Every roof inspection is free, with no obligation and no high-pressure close.
- Proposals are itemized line by line — shingle, underlayment, ice and water shield, starter, ridge cap, flashing, and disposal each priced separately. Upgrades are optional and clearly marked, never pre-checked.
- About half our work is storm and insurance restoration, half is retail, so recommendations start with the building and the budget rather than one product.
- On insurance work we never promise that a claim will be approved, and we never offer to cover or absorb a homeowner's deductible.
- $0-down financing is available through GoodLeap.
- Every completed job is photographed and published to our public project gallery with the city, product line, and color, so claims about our work are verifiable.

## Service area
Mississippi only, within roughly a two-hour drive of Hattiesburg.
- Regional hubs: ${hubCities}
- All communities served: ${allCities}

## Products we install
- GAF — Timberline HDZ and Timberline Natural Shadow shingles, WeatherWatch and StormGuard leak barriers, FeltBuster synthetic underlayment, Pro-Start starter strip, Cobra ridge vent, Seal-A-Ridge ridge cap
- Owens Corning shingles — Duration, Oakridge, Supreme (we install these products; we are not an Owens Corning certified contractor)
- Gibraltar metal roofing systems, including 29ga exposed-fastener panel and Galvalume
- Spectra seamless gutter systems

## Company pages
- [About](${absoluteUrl("/about")}): Company background, credentials, service area, and quick facts.
- [Reviews](${absoluteUrl("/reviews")}): Every verified Google review, shown live.
- [Projects](${absoluteUrl("/projects")}): Real completed jobs with photos, city, product, and color.
- [FAQ](${absoluteUrl("/faq")}): 22 common questions on cost, financing, insurance claims, materials, and process.
- [Contact](${absoluteUrl("/contact")}): Phone, email, address, hours, and contact form.
- [Careers](${absoluteUrl("/careers")}): Open roles.
- [Blog](${absoluteUrl("/blog")}): Company news and local roofing coverage.

## Service pages
- [Residential Roofing](${absoluteUrl("/residential")})
- [Roof Replacement](${absoluteUrl("/residential/roof-replacement")})
- [Roof Repair](${absoluteUrl("/residential/roof-repair")})
- [Metal Roofing](${absoluteUrl("/metal-roofing")})
- [Seamless Gutters](${absoluteUrl("/residential/gutters")})
- [Commercial Roofing](${absoluteUrl("/commercial")})
- [Storm Damage](${absoluteUrl("/storm-damage")})
- [Insurance Claims](${absoluteUrl("/storm-damage/insurance-claims")})
- [Emergency Roofing](${absoluteUrl("/storm-damage/emergency-roofing")})
- [Financing](${absoluteUrl("/financing")})

## Get a price or an inspection
- [Free Inspection](${absoluteUrl("/free-inspection")}): No-obligation on-site roof inspection.
- [Estimate](${absoluteUrl("/estimate")}): Choose an emailed ballpark price with no site visit, or an exact on-site measure.
- [Instant Quote](${absoluteUrl("/quote")}): Ballpark price in about six taps.

## Service areas
- [Service Areas](${absoluteUrl("/service-areas")}): Index of every South Mississippi community we cover, each with its own page.

## Learning Center
- [Learning Center](${absoluteUrl("/learn")}): Guides on materials, cost, insurance claims, hiring a contractor, and maintenance.
- [Anatomy of a Roof](${absoluteUrl("/anatomy-of-a-roof")}): Interactive diagram of every roof component and each type of flashing.

## Tools
- [Roof Cost Calculator](${absoluteUrl("/roof-cost-calculator")})
- [Roof Color Visualizer](${absoluteUrl("/roof-color-visualizer")}): Shingle and metal colors shown on real completed local roofs.
- [Storm Center](${absoluteUrl("/storm-center")})

## Verified profiles
- [Google Business Profile](${siteConfig.links.googleBusiness})
- [BBB](${siteConfig.links.bbbProfile})
- [GAF contractor profile](${siteConfig.links.gafProfile})
- [Facebook](${siteConfig.socials.facebook})
- [Instagram](${siteConfig.socials.instagram})
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
