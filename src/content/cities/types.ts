import type { FaqEntry } from "@/lib/schema";

/**
 * Content model for service-area city pages (PRD §5, hub-and-spoke local
 * SEO). Anti-doorway rules apply to every entry: genuinely local content
 * (county, landmarks, storm history, response time), no find-and-replace
 * body copy, and a city ships only when its unique copy is complete.
 */

export interface CityContent {
  /** URL segment under /service-areas, matches siteConfig.serviceArea slug */
  slug: string;
  city: string;
  county: string;
  /** Approximate drive from our Hattiesburg office, stated honestly */
  driveTime: string;
  metaTitle: string;
  metaDescription: string;

  hero: {
    headline: string;
    subhead: string;
  };

  /** 2–4 paragraphs of genuinely local copy, the anti-doorway core */
  intro: {
    title: string;
    paragraphs: string[];
  };

  /** Local texture: neighborhoods, landmarks, areas we work */
  localAreas?: {
    title: string;
    items: string[];
  };

  /** Weather/storm context specific to this part of the region */
  stormContext: {
    title: string;
    text: string;
  };

  /** City-specific FAQ (FAQPage schema emitted by the page) */
  faqs: FaqEntry[];
}
