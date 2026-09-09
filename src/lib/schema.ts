import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * JSON-LD builders (PRD §10.4). Every builder emits only fields backed by
 * real data in siteConfig, null [NEEDS] values are omitted entirely rather
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

/** Site-wide RoofingContractor (LocalBusiness) schema, rendered on every page. */
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
    image: absoluteUrl("/opengraph-image"),
    priceRange: "$$",
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
      "Commercial roof replacement",
      "Flat roofing",
      "TPO roofing",
      "EPDM roofing",
      "PVC roofing",
      "Modified bitumen roofing",
      "Roof coatings",
      "Silicone roof restoration",
      "Seamless gutters",
      "Siding",
      "Fascia and soffit",
    ],
    makesOffer: [
      { name: "Residential Roofing", path: "/residential" },
      { name: "Roof Replacement", path: "/residential/roof-replacement" },
      { name: "Roof Repair", path: "/residential/roof-repair" },
      { name: "Metal Roofing", path: "/residential/metal-roofing" },
      { name: "Storm Damage & Insurance Claims", path: "/storm-damage" },
      { name: "Seamless Gutters", path: "/residential/gutters" },
      // Commercial systems, every one a route that exists. A Service URL in
      // schema that 404s is worse than no Service entry at all.
      { name: "Commercial Roofing", path: "/commercial" },
      {
        name: "Commercial Roof Replacement",
        path: "/commercial/roof-replacement",
      },
      { name: "Commercial Roof Repair", path: "/commercial/roof-repair" },
      { name: "TPO Roofing", path: "/commercial/tpo" },
      { name: "Commercial Roof Coatings", path: "/commercial/roof-coatings" },
      { name: "Commercial Metal Roofing", path: "/commercial/metal-roofing" },
    ].map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        serviceType: service.name,
        url: absoluteUrl(service.path),
      },
    })),
    /*
     * The two licence numbers as plain identifiers.
     *
     * hasCredential below says the same thing more richly, and this says it in
     * the shape anything parsing the page can read without knowing what an
     * EducationalOccupationalCredential is. `identifier` accepts PropertyValue
     * on any Thing, and a licence number is exactly the sort of external
     * identifier the property exists for.
     */
    identifier: [
      siteConfig.license
        ? {
            "@type": "PropertyValue",
            propertyID: "MSBOC Residential License",
            name: "Mississippi State Board of Contractors Residential License",
            value: siteConfig.license,
            url: siteConfig.links.msbocLicense,
          }
        : null,
      siteConfig.licenseCommercial
        ? {
            "@type": "PropertyValue",
            propertyID: "MSBOC Commercial License",
            name: "Mississippi State Board of Contractors Commercial Certificate of Responsibility",
            value: siteConfig.licenseCommercial,
            url: siteConfig.links.msbocCommercialLicense,
          }
        : null,
    ].filter(Boolean),
    /*
     * Verifiable credentials (owner-confirmed): both MSBOC licences and the
     * GAF manufacturer certification.
     *
     * TWO LICENCES, NAMED SEPARATELY, AND THAT IS A CHANGE. There used to be
     * one entry here deliberately called "Mississippi Roofing Contractor
     * License" rather than "residential", because only the residential record
     * existed publicly and the narrower name would have taught search engines
     * this company only does houses. Mississippi issues residential licensure
     * and a commercial Certificate of Responsibility separately, Southeast
     * Roofing now holds both, and two accurately named credentials say more
     * than one vague one ever did. Neither may be dropped in favour of the
     * other: they are different numbers from different registers.
     */
    hasCredential: [
      siteConfig.license
        ? {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: "Mississippi Residential Roofing Contractor License",
            identifier: siteConfig.license,
            /** Third-party verifiable record on the licensing authority's site. */
            url: siteConfig.links.msbocLicense,
            recognizedBy: {
              "@type": "GovernmentOrganization",
              name: "Mississippi State Board of Contractors",
              url: "https://www.msboc.us/",
            },
          }
        : null,
      siteConfig.licenseCommercial
        ? {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: "Mississippi Commercial Contractor Certificate of Responsibility",
            identifier: siteConfig.licenseCommercial,
            url: siteConfig.links.msbocCommercialLicense,
            recognizedBy: {
              "@type": "GovernmentOrganization",
              name: "Mississippi State Board of Contractors",
              url: "https://www.msboc.us/",
            },
          }
        : null,
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "GAF Certified Contractor",
        recognizedBy: { "@type": "Organization", name: "GAF" },
      },
    ].filter(Boolean),
    /*
     * Both government licence records belong in sameAs. sameAs is for pages
     * that unambiguously identify the entity, and a state licensing register
     * entry for this exact company is about as unambiguous as the web gets.
     * The residential record already arrives inside socialProfiles.
     */
    sameAs: [
      ...new Set(
        [
          ...siteConfig.socialProfiles,
          siteConfig.links.msbocCommercialLicense,
        ].filter(Boolean),
      ),
    ],
    foundingDate: siteConfig.foundingYear
      ? String(siteConfig.foundingYear)
      : null,
  });
}

/** WebSite schema: homepage only. */
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
  /** Site-relative path to the image shown on the page itself. */
  image?: string;
  /** Organizations the article genuinely discusses (e.g. a named partner). */
  mentions?: { name: string; url: string }[];
}

/**
 * Article schema for Learning Center guides and blog posts (PRD §10.4,
 * Phase 7). Author/publisher is the organization, honest E-E-A-T until
 * named-author bios exist.
 */
export function articleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  image,
  mentions,
}: ArticleSchemaOptions): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    // Google lists image as recommended for Article and uses it for Discover
    // and Top Stories treatments. Only ever the image actually on the page.
    image: image ? absoluteUrl(image) : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    // Organizations this article genuinely discusses. Used to make the
    // relationship between two linked businesses legible as an entity
    // association rather than leaving search engines to infer it from a link.
    mentions: mentions?.length
      ? mentions.map((m) => ({
          "@type": "Organization",
          name: m.name,
          url: m.url,
        }))
      : undefined,
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
