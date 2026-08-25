import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/**
 * Metadata and JSON-LD helpers.
 *
 * Two principles run through this file:
 *   - Schema describes only what is actually on the page. Emitting
 *     AggregateRating where no rating is visible, or FAQPage where no FAQ is
 *     rendered, is rich-result abuse and gets sites penalised.
 *   - Business identity is expressed once, from siteConfig, so the entity
 *     Google and AI assistants build is consistent everywhere.
 */

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? "/img/holiday-hero-estate.webp";

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * The business entity.
 *
 * legalName is Southeast Roofing LLC because Southeast Lights is a registered
 * fictitious name of it, not a separate company. That is the accurate way to
 * declare a d/b/a, and it is deliberately NOT parentOrganization, which would
 * assert two organizations that do not exist.
 */
export function localBusinessSchema() {
  const { address, phone, google } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: `${siteConfig.legalName} d/b/a ${siteConfig.name}`,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: phone.tel ?? undefined,
    email: siteConfig.email ?? undefined,
    image: `${siteConfig.url}/img/holiday-hero-estate.webp`,
    logo: `${siteConfig.url}/brand/southeast-lights-logo.png`,
    priceRange: "$$-$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress ?? undefined,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode ?? undefined,
      addressCountry: address.addressCountry,
    },
    sameAs: [
      siteConfig.socials.facebook,
      siteConfig.socials.instagram,
      siteConfig.socials.tiktok,
      google.profileUrl,
    ].filter(Boolean),
    areaServed: [
      "Hattiesburg MS",
      "Petal MS",
      "Purvis MS",
      "Laurel MS",
      "Columbia MS",
      "Gulfport MS",
      "Biloxi MS",
      "Ocean Springs MS",
      "South Mississippi",
    ].map((name) => ({ "@type": "Place", name })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
  areaServed = "South Mississippi",
}: {
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${siteConfig.url}${path}`,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "Place", name: areaServed },
  };
}

/** Emit ONLY for questions actually rendered on the page. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
