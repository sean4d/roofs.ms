import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import {
  LegalPage,
  type LegalSection,
} from "@/components/shared/legal-page";

/**
 * Privacy policy, written to describe what this site actually does
 * (lead forms delivered to our CRM and office email; links out to Roofr,
 * GoodLeap, and Google tools), in plain language.
 */

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Southeast Roofing",
  description:
    "How Southeast Roofing LLC collects, uses, and protects the information you share with us through southeastroofing.llc.",
  path: "/privacy-policy",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy-policy" },
];

const sections: LegalSection[] = [
  {
    heading: "Information we collect",
    paragraphs: [
      "When you request an inspection, consultation, or contact us through a form on this site, we collect the information you provide: typically your name, phone number, email address, property address, and details about your roofing project. Commercial inquiries may also include your company name, role, property type, and project timeline.",
      "Like most websites, our hosting and infrastructure providers automatically collect basic technical information such as IP address, browser type, and pages visited, which is used for security and to keep the site running well.",
    ],
  },
  {
    heading: "How we use your information",
    paragraphs: [
      "We use the information you submit for one purpose: to respond to your request. That includes contacting you by phone, text message, or email about your inquiry, scheduling inspections and appointments, preparing proposals, and, where you engage us for insurance restoration work: assisting with your claim documentation.",
      "We do not sell your personal information, and we do not use it for third-party advertising lists.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "Form submissions are delivered to our office email and to the customer-relationship software we use to manage jobs and appointments. These providers process your information only to provide their services to us.",
      "If you hire us for an insurance claim, we share job documentation with your insurer or adjuster as part of assisting with your claim, always in connection with your project. We may also disclose information when required by law.",
    ],
  },
  {
    heading: "Third-party tools you may choose to use",
    paragraphs: [
      "Some features on this site link to tools operated by other companies, and their privacy policies apply when you use them:",
    ],
    bullets: [
      "Roofr: our instant roof estimate tool",
      "GoodLeap: our financing application",
      "Google: appointment booking, our business profile and reviews, and embedded maps",
      "Social platforms we link to (Facebook, Instagram, TikTok, Nextdoor)",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep inquiry and project records for as long as reasonably needed to serve you, honor warranties, and meet our legal and accounting obligations.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      `You can ask us at any time to access, correct, or delete the personal information we hold about you, or to stop contacting you about an inquiry. Email ${siteConfig.email} or call ${siteConfig.phone.display} and we'll take care of it.`,
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If we change how we handle your information, we'll update this page and its date. Questions are always welcome at the contact details below.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `${siteConfig.legalName}, ${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}. Phone: ${siteConfig.phone.display}. Email: ${siteConfig.email}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 5, 2026"
      intro={`This policy explains how ${siteConfig.legalName} ("Southeast Roofing," "we," "us") handles information collected through ${siteConfig.url.replace("https://", "")}. The short version: we collect what you send us so we can respond to your roofing request, we don't sell it, and you can ask us to remove it at any time.`}
      sections={sections}
      breadcrumbs={breadcrumbs}
    />
  );
}
