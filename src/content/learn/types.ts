import type { FaqEntry } from "@/lib/schema";

/**
 * Learning Center content model (PRD §13 Phase 7). Articles are composed
 * from typed blocks so guides stay visual and structured — prose, lists,
 * callouts, embedded GAF partner tools, and our own roof-anatomy diagram.
 * Integrity rules apply to every block: no invented stats, prices stated
 * as honest hedged ranges, manufacturer claims limited to what we hold
 * (GAF Certified Contractor).
 */

export type LearnCategorySlug =
  | "metal-roofing"
  | "insurance-claims"
  | "storm-prep"
  | "materials"
  | "maintenance"
  | "commercial"
  | "cost-guides";

export interface LearnCategory {
  slug: LearnCategorySlug;
  label: string;
  description: string;
}

/** GAF partner-portal widgets we embed (see components/learn/gaf-widget). */
export type GafWidgetKey =
  | "hdz-widget"
  | "parts-of-a-roof-widget"
  | "shingle-comparison-chart";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; title?: string; items: string[] }
  | {
      type: "callout";
      title: string;
      text: string;
      href?: string;
      linkLabel?: string;
    }
  | { type: "widget"; widget: GafWidgetKey; title: string; caption: string }
  /** Renders our interactive exploded roof-anatomy diagram */
  | { type: "anatomy" };

export interface LearnArticle {
  slug: string;
  category: LearnCategorySlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Short teaser shown on hub cards */
  excerpt: string;
  /** ISO date the article was published/last substantively updated */
  updated: string;
  readMinutes: number;
  hero: {
    headline: string;
    subhead: string;
  };
  body: ArticleBlock[];
  faqs?: FaqEntry[];
  /** Internal links to service pages this guide should funnel to */
  related: { label: string; href: string }[];
}
