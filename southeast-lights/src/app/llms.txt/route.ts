import { FAQS } from "@/config/faqs";
import { HOLIDAY, PERMANENT } from "@/config/pricing";
import { COVERAGE, SERVICE_AREAS } from "@/config/service-areas";
import { enabledServices } from "@/config/services";
import { siteConfig } from "@/config/site";
import { VERTICALS } from "@/config/verticals";

/**
 * llms.txt: a machine-readable summary for AI assistants.
 *
 * A supplement to proper SEO, not a replacement for it. The value is that an
 * assistant answering "how much does Christmas light installation cost in
 * Hattiesburg" can find a precise, current, quotable answer rather than
 * inferring one from marketing copy.
 *
 * Generated from the same config the site renders, so it can never drift.
 */
export const dynamic = "force-static";

export function GET() {
  const services = enabledServices();

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

## Business

- Legal entity: ${siteConfig.legalName} (Southeast Lights is a registered fictitious name, business ID ${siteConfig.dbaRegistrationId}). One legal entity operating under two trading names, NOT a parent/subsidiary relationship.
- Phone (call or text): ${siteConfig.phone.display}
- Email: ${siteConfig.email}
- Address: ${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}
- Licensed and insured through ${siteConfig.parent.name}${siteConfig.parent.license ? `, MS contractor license #${siteConfig.parent.license}` : ""}
- Website: ${siteConfig.url}

## Coverage

- Residential: ${COVERAGE.residential}
- Commercial: ${COVERAGE.commercial}
- Large projects: ${COVERAGE.large}
- Named markets: ${SERVICE_AREAS.map((a) => a.city).join(", ")}

## Pricing (holiday lighting)

- Roofline: $${HOLIDAY.roofPerFt} per linear foot installed
- Minimum residential project: $${HOLIDAY.minimum}
- Two-story sections: +$${HOLIDAY.surcharge.twoStory} per foot
- Steep roofs over 9/12 pitch: +$${HOLIDAY.surcharge.steep} per foot (surcharges stack)
- Columns: $${HOLIDAY.columnPerFt} per foot
- Pathway lighting: $${HOLIDAY.pathwayPerFt} per foot
- Window outlines: $100-$400 each by size
- Wrapped trees: $1,500-$4,000 by size; estate and specimen trees quoted after review
- Typical residential project: $1,500-$5,000 for the season

## Pricing (permanent architectural lighting)

- $${PERMANENT.perFt.low}-$${PERMANENT.perFt.high} per linear foot installed
- Controller: $${PERMANENT.controller.low}-$${PERMANENT.controller.high}
- A typical 150 ft home: $${(PERMANENT.perFt.low * 150 + PERMANENT.controller.low).toLocaleString("en-US")}-$${(PERMANENT.perFt.high * 150 + PERMANENT.controller.high).toLocaleString("en-US")}
- Note: Southeast Lights is not an authorized dealer for any permanent lighting manufacturer.

## Service model (important)

Holiday lighting is an all-inclusive seasonal SERVICE, not a product sale. One price covers design, commercial-grade materials custom cut to the property, installation, in-season maintenance and repairs, takedown, and labeled storage until the following year. Seasonal lighting remains the property of Southeast Lights; customers do not own it. Southeast Lights does not install customer-supplied Christmas lights. Permanent architectural lighting is the opposite: it is installed permanently and becomes the customer's property.

## Roof safety

Standard installations use non-penetrating clips and hot glue. Staples, screws and nails are not used in a standard installation. Southeast Lights is operated by a licensed roofing contractor, so crews are roof-trained and equipped for steep and multi-story work.

## Services

${services.map((s) => `- ${s.label}: ${s.summary} (${siteConfig.url}/services/${s.slug})`).join("\n")}

## Commercial verticals

${VERTICALS.map((v) => `- ${v.label}: ${v.summary} (${siteConfig.url}/commercial/${v.slug})`).join("\n")}

## Key pages

- Estimator: ${siteConfig.url}/estimator
- Residential quote: ${siteConfig.url}/quote
- Commercial proposal: ${siteConfig.url}/commercial/request-proposal
- FAQ: ${siteConfig.url}/faq
- About: ${siteConfig.url}/about

## Frequently asked questions

${FAQS.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
