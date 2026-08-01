import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import {
  LegalPage,
  type LegalSection,
} from "@/components/shared/legal-page";

/** Terms of service for use of the website itself (not roofing contracts). */

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Southeast Roofing",
  description:
    "The terms that govern your use of southeastroofing.llc, the website of Southeast Roofing LLC in Hattiesburg, Mississippi.",
  path: "/terms-of-service",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Terms of Service", path: "/terms-of-service" },
];

const sections: LegalSection[] = [
  {
    heading: "Using this site",
    paragraphs: [
      "This website exists to tell you about our services and make it easy to reach us. You may browse it, share links to it, and use its forms and tools for their intended purpose, requesting information about roofing work. Please don't misuse the site: no scraping our content or photos for reuse, no submitting false or automated form entries, and no attempting to interfere with its operation.",
    ],
  },
  {
    heading: "Estimates, proposals, and contracts",
    paragraphs: [
      "Information on this site: including example proposals, pricing illustrations, and results from the instant estimate tool, is provided for education and is not a binding quote. Every roof is different; actual pricing and scope are set only in a written, itemized proposal we prepare for your specific property, and roofing work is governed by the signed contract for that job, not by these website terms.",
    ],
  },
  {
    heading: "Insurance and financing information",
    paragraphs: [
      "Descriptions of insurance claim assistance describe how we help with documentation and process; coverage decisions are made solely by your insurer under your policy, and we never guarantee claim outcomes. Financing is offered through third-party lenders such as GoodLeap; approval, rates, and terms are determined by the lender, not by us.",
    ],
  },
  {
    heading: "Our content",
    paragraphs: [
      "The text, photographs, graphics, and design of this site belong to Southeast Roofing LLC or are used under license. Project photos show real jobs we completed. You may not republish or use our content commercially without written permission.",
    ],
  },
  {
    heading: "Third-party links and tools",
    paragraphs: [
      "The site links to services operated by others: Roofr, GoodLeap, Google, the BBB, GAF, and social platforms. We don't control those services and aren't responsible for their content, availability, or terms; your use of them is between you and their operators.",
    ],
  },
  {
    heading: "Disclaimer and limitation of liability",
    paragraphs: [
      'This website is provided "as is." We work to keep its information accurate and current, but we make no warranties about the site itself and, to the fullest extent permitted by law, we are not liable for damages arising from your use of the site. Nothing in these terms limits the warranties or obligations set out in a signed roofing contract.',
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the State of Mississippi. If we update the terms, we'll post the revised version here with a new date; continued use of the site means you accept the update.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `Questions about these terms? Reach ${siteConfig.legalName} at ${siteConfig.email} or ${siteConfig.phone.display}.`,
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 5, 2026"
      intro={`These terms cover your use of ${siteConfig.url.replace("https://", "")}, operated by ${siteConfig.legalName} of ${siteConfig.address.addressLocality}, Mississippi. They apply to the website only, any roofing work we perform for you is governed by its own written contract.`}
      sections={sections}
      breadcrumbs={breadcrumbs}
    />
  );
}
