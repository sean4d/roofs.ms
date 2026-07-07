import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt — a plain-text orientation file for LLM/answer engines. Low
 * measurable effect today but cheap; mirrors the sitemap's canonical URLs via
 * absoluteUrl so it never hardcodes the domain. Update the curated link list
 * here when top-level sections change.
 */
export const dynamic = "force-static";

export function GET() {
  const body = `# Southeast Roofing

> Licensed, GAF-certified roofing contractor based in Hattiesburg, Mississippi, serving South
> Mississippi within about a two-hour radius (Pine Belt, Gulf Coast, Jackson metro). Founded 2023.
> Residential and commercial roofing: asphalt shingle, metal, TPO/EPDM/flat systems, storm damage
> and insurance claim assistance. Mississippi State Board of Contractors license #R22245.

## Company
- [About](${absoluteUrl("/about")}): Background, credentials, service area, quick facts.
- [Reviews](${absoluteUrl("/reviews")}): Verified customer reviews.
- [Contact](${absoluteUrl("/contact")}): Phone, email, address, contact form.

## Services
- [Residential Roofing](${absoluteUrl("/residential")})
- [Commercial Roofing](${absoluteUrl("/commercial")})
- [Storm Damage & Insurance Claims](${absoluteUrl("/storm-damage")})

## Service Areas
- [Service Areas](${absoluteUrl("/service-areas")}): Every South Mississippi community we cover.

## Learning Center
- [Learning Center](${absoluteUrl("/learn")}): Guides on materials, costs, insurance claims, and maintenance.

## Tools
- [Roof Cost Calculator](${absoluteUrl("/roof-cost-calculator")})
- [Roof Color Visualizer](${absoluteUrl("/roof-color-visualizer")})
- [Anatomy of a Roof](${absoluteUrl("/anatomy-of-a-roof")})
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
