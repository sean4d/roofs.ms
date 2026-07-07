import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * JSON-LD builders (PRD §10.4). Every builder emits only fields backed by
 * real data in siteConfig — null [NEEDS] values are omitted entirely rather
 * than filled with invented placeholders (integrity rule, PRD §0.2).
 */

export type JsonLdObject = Record<string, unknown>;

/** Strip null/undefined/empty-array values so schema never emits blanks. */
function compact(obj: JsonLdObject): JsonLdObject {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

/** Site-wide RoofingContractor (LocalBusiness) schema — rendered on every page. */
export function roofingContractorSchema(): JsonLdObject {
  const { address, geo } = siteConfig;
  const logoUrl = absoluteUrl(
    "/images/brand/southeast-roofing-logo-navy-trimmed.png",
  );

  return compact({
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    logo: logoUrl,
    image: logoUrl,
    telephone: siteConfig.phone.tel, // omitted until the real number is supplied
    email: siteConfig.email,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    }),
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHoursSpecification: siteConfig.hours.spec.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...slot.days],
      opens: slot.opens,
      closes: slot.closes,
    })),
    // Phone-based contact point (omitted entirely if no real number exists).
    contactPoint: siteConfig.phone.tel
      ? {
          "@type": "ContactPoint",
          telephone: siteConfig.phone.tel,
          contactType: "customer service",
          areaServed: "US-MS",
          availableLanguage: "English",
        }
      : null,
    areaServed: siteConfig.serviceArea.map(({ city }) => ({
      "@type": "City",
      name: `${city}, MS`,
    })),
    // Topical signals + explicit service catalog strengthen entity
    // recognition for search and answer engines (PRD §10 AI discoverability).
    knowsAbout: [
      "Roof replacement",
      "Roof repair",
      "Asphalt shingle roofing",
      "Metal roofing",
      "Standing seam metal roofing",
      "Storm damage roof repair",
      "Roof insurance claims",
      "Commercial roofing",
      "TPO roofing",
      "EPDM roofing",
      "Seamless gutters",
    ],
    makesOffer: [
      { name: "Residential Roofing", path: "/residential" },
      { name: "Roof Replacement", path: "/residential/roof-replacement" },
      { name: "Roof Repair", path: "/residential/roof-repair" },
      { name: "Metal Roofing", path: "/residential/metal-roofing" },
      { name: "Storm Damage & Insurance Claims", path: "/storm-damage" },
      { name: "Seamless Gutters", path: "/residential/gutters" },
      { name: "Commercial Roofing", path: "/commercial" },
    ].map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        serviceType: service.name,
        url: absoluteUrl(service.path),
      },
    })),
    // MS contractor license as a verifiable credential (owner-confirmed).
    hasCredential: siteConfig.license
      ? {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "license",
          name: "Mississippi Roofing Contractor License",
          identifier: siteConfig.license,
          recognizedBy: {
            "@type": "GovernmentOrganization",
            name: "Mississippi State Board of Contractors",
          },
        }
      : null,
    sameAs: [...siteConfig.socialProfiles],
    foundingDate: siteConfig.foundingYear
      ? String(siteConfig.foundingYear)
      : null,
  });
}

/** WebSite schema — homepage only. */
export function webSiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FaqEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

interface ArticleSchemaOptions {
  headline: string;
  description: string;
  path: string;
  /** ISO date string */
  datePublished: string;
  dateModified?: string;
}

/**
 * Article schema for Learning Center guides and blog posts (PRD §10.4,
 * Phase 7). Author/publisher is the organization — honest E-E-A-T until
 * named-author bios exist.
 */
export function articleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleSchemaOptions): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
  });
}

interface ServiceSchemaOptions {
  name: string;
  description: string;
  path: string;
  /** Restrict areaServed (e.g. a single city on city pages); defaults to full service area. */
  areaServed?: string[];
}

export function serviceSchema({
  name,
  description,
  path,
  areaServed,
}: ServiceSchemaOptions): JsonLdObject {
  const cities = areaServed ?? siteConfig.serviceArea.map(({ city }) => city);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: `${city}, MS`,
    })),
  };
}
