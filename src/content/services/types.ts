import type { LucideIcon } from "lucide-react";

import type { FaqEntry } from "@/lib/schema";

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

  /** §4.1.8 — service-specific FAQ (also emitted as FAQPage schema). */
  faqs: FaqEntry[];

  /** §4.1.9 — related services (3 cards). */
  related: RelatedService[];
}
