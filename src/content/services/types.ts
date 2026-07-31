import type { LucideIcon } from "lucide-react";

import type { FaqEntry } from "@/lib/schema";
import type { ToolKey } from "@/config/tools";

/**
 * Content model for the core service-page template (PRD §4.1 — 11 sections).
 * Every service page is data: components/services/service-page.tsx renders
 * this structure, so copy lives here and stays reviewable in one place.
 *
 * Integrity rule (PRD §0.2): every claim in a ServiceContent object must be
 * owner-confirmed or general roofing fact — no invented stats, warranty
 * terms, prices, or certifications.
 */

export interface ServicePhoto {
  src: string;
  alt: string;
}

export interface SignItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface ApproachStep {
  title: string;
  text: string;
}

export interface MaterialItem {
  title: string;
  text: string;
}

export interface RelatedService {
  label: string;
  href: string;
  description: string;
}

/** Responsive data table (spec sheet, comparison, decision aid). */
export interface ServiceTable {
  title: string;
  description?: string;
  columns: string[];
  rows: string[][];
  /** Honest qualifier under the table (e.g. "representative values"). */
  note?: string;
}

/**
 * Deep-dive prose section — the page-specific technical content that
 * differentiates each service page (2026-07 content expansion). Every
 * section must be unique to its page: no paragraph reuse across pages.
 */
export interface ProseSection {
  title: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional table rendered inside this section. */
  table?: ServiceTable;
  /**
   * Crawlable in-context links with DESCRIPTIVE anchors ("Compare TPO and
   * EPDM", never "learn more"). Rendered as link chips under the section.
   */
  links?: { label: string; href: string }[];
}

export interface ServiceContent {
  /** URL path segment under the division (also the registry key). */
  slug: string;
  /** Full route path beginning with "/" — canonical URL + breadcrumbs. */
  path: string;
  /** Human name used in H1, schema serviceType, and area links. */
  name: string;
  metaTitle: string;
  metaDescription: string;

  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    /**
     * Omit when no honest imagery exists yet (e.g. metal pages are a
     * [NEEDS: metal project photos] item) — the hero renders a premium
     * photo-free treatment with the chips below instead.
     */
    photo?: ServicePhoto;
    /** Optional caption chip over the photo (honest description only). */
    photoBadge?: string;
    /** System/style chips shown in the photo-free hero treatment. */
    chips?: string[];
  };

  /** §4.1.2 — what/who/why it matters in South Mississippi. */
  intro: {
    title: string;
    paragraphs: string[];
  };

  /**
   * Deep technical sections rendered after the intro (2026-07 expansion).
   * This is where each page earns its indexing: system specifications,
   * comparisons, installation facts, and decision guidance. Never pricing —
   * dollar figures are banned site-wide on service pages (owner directive
   * 2026-07-30); use costFactors instead.
   */
  sections?: ProseSection[];

  /**
   * "What affects the cost" block (owner directive 2026-07-30: explain the
   * real pricing factors, never publish dollar amounts). Rendered with an
   * inspection/estimate CTA. Titles should vary page to page.
   */
  costFactors?: {
    title: string;
    description?: string;
    items: MaterialItem[];
  };

  /** §4.1.3 — "Signs you need this" icon list. */
  signs?: {
    title: string;
    description?: string;
    items: SignItem[];
  };

  /** §4.1.4 — what's included / our approach (numbered steps). */
  approach: {
    title: string;
    description?: string;
    steps: ApproachStep[];
  };

  /** §4.1.5 — materials & options where relevant. */
  materials?: {
    title: string;
    description?: string;
    items: MaterialItem[];
    /** Honest footnote (e.g. product availability). */
    note?: string;
  };

  /**
   * Emergency/insurance page additions (§4.1) — an actionable checklist
   * ("what to do right now" / documentation checklist).
   */
  checklist?: {
    title: string;
    description?: string;
    items: string[];
  };

  /** §4.1.6 — gallery strip (real project/storm photos only). */
  gallery?: {
    title: string;
    description?: string;
    photos: ServicePhoto[];
  };

  /**
   * Visual education: render the INTERACTIVE roof-anatomy diagram — the same
   * numbered-hotspot house built for /anatomy-of-a-roof (owner directive
   * 2026-07-30: that diagram is the only parts-of-a-roof illustration used
   * anywhere on the site; the old static exploded stack is retired).
   */
  anatomy?: boolean;

  /** Visual education: render the interactive flashing-types diagram. */
  flashingDiagram?: boolean;

  /**
   * Render the exterior-cleaning subcontractor credit (roof-washing pages).
   * States who performs the work and confirms the customer contracts,
   * schedules, and communicates through Southeast Roofing.
   */
  subcontractorCredit?: boolean;

  /** Visual education: render the attic-airflow (intake/exhaust) diagram. */
  ventDiagram?: boolean;

  /** §4.1.8 — service-specific FAQ (also emitted as FAQPage schema). */
  faqs: FaqEntry[];

  /** §4.1.9 — related services (3 cards). */
  related: RelatedService[];

  /**
   * Interactive tools to surface on this page. Omit to auto-pick relevant
   * ones from the slug (see config/tools defaultServiceTools); set to []
   * to suppress the tool strip entirely.
   */
  tools?: ToolKey[];
}
