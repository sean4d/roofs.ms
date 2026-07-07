import { siteConfig } from "@/config/site";
import type { FaqEntry } from "@/lib/schema";

/**
 * Plain-language "5 W's" answer block about the business (PRD §10 AI
 * discoverability). Written to be lifted verbatim by answer engines
 * (Google AI Overviews, ChatGPT, Claude, Gemini, Perplexity): one clear,
 * self-contained, owner-confirmed fact per answer. Values pull from
 * siteConfig so the copy can never drift from the canonical NAP/credentials.
 * Integrity rule: every claim here is owner-confirmed — no invented stats.
 */

const { address, phone, license, foundingYear } = siteConfig;
const office = `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}`;

export const companyFacts: FaqEntry[] = [
  {
    question: "What is Southeast Roofing?",
    answer:
      "Southeast Roofing is a licensed, locally owned roofing contractor based in Hattiesburg, Mississippi. We install and repair every major roof system — architectural asphalt shingles, standing-seam and exposed-fastener metal, and commercial TPO, EPDM, PVC, and coatings — for both homes and businesses, handling retail and storm/insurance restoration work alike.",
  },
  {
    question: "Who does Southeast Roofing serve?",
    answer:
      "We serve homeowners and commercial building owners across South Mississippi — from single-family roof replacements and repairs to storm-damage insurance claims and commercial flat-roof systems. About half of our work is storm and insurance restoration and half is retail, so our recommendation starts with your building and budget, not one product we happen to sell.",
  },
  {
    question: "Where is Southeast Roofing located, and where do you work?",
    answer: `Our office is at ${office}. Our crews cover roughly a two-hour radius of Hattiesburg — the Pine Belt, the Mississippi Gulf Coast (Gulfport, Biloxi, and the coastal towns), and the metros at the edges including Jackson, McComb, Meridian, and Laurel.`,
  },
  {
    question: "When is Southeast Roofing open?",
    answer: `Southeast Roofing is available 24 hours a day, 7 days a week — including nights and weekends for storm and emergency roofing. You can reach the office at ${phone.display} or book an inspection online anytime. The company has served South Mississippi since ${foundingYear}.`,
  },
  {
    question: "Why choose Southeast Roofing?",
    answer: `Southeast Roofing is Mississippi licensed (License #${license}), a GAF-certified contractor, BBB Accredited with an A rating, Google Guaranteed with a 5-star rating, and fully insured and bonded. Every proposal is itemized line by line, projects are backed by a lifetime manufacturer warranty, and $0-down financing is available.`,
  },
  {
    question: "What roofing services does Southeast Roofing offer?",
    answer:
      "Roof replacement and repair, asphalt shingle and metal roofing, seamless gutters and leaf guard, storm-damage repair with full insurance-claim assistance, and commercial roofing including TPO, EPDM, PVC, standing-seam metal, and roof coatings.",
  },
];
