"use client";

/**
 * Analytics events.
 *
 * One typed vocabulary, one dispatch function. Events push to dataLayer (GA4
 * via Google Tag Manager or gtag) and are deliberately pixel-agnostic: adding
 * Meta, TikTok or Google Ads later means adding a listener here, not editing
 * fifty components.
 *
 * No pixels are installed. This only emits.
 */

export type AnalyticsEvent =
  | "quote_cta_click"
  | "estimator_start"
  | "estimator_step_complete"
  | "estimator_complete"
  | "budget_selected"
  | "residential_lead_submit"
  | "commercial_lead_submit"
  | "hoa_lead_submit"
  | "permanent_lead_submit"
  | "call_click"
  | "text_click"
  | "email_click"
  | "gallery_interaction"
  | "service_page_cta"
  | "city_page_cta"
  | "upload_started"
  | "upload_completed";

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });
    window.gtag?.("event", event, payload);
  } catch {
    // Analytics must never break a conversion path.
  }
}
