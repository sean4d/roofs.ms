/**
 * Lead attribution.
 *
 * Captured on first landing and carried through to submission, so we can tell
 * which marketing produces $20,000 HOA projects rather than only which
 * produces form fills.
 */

export interface Attribution {
  landingPage?: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
}

const KEY = "sel_attribution";

/** Read (and persist on first visit) the attribution for this session. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Attribution;
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => params.get(key) ?? undefined;

  const current: Attribution = {
    // Landing page and campaign values stick to the FIRST page of the session.
    landingPage: stored.landingPage ?? window.location.pathname,
    referrer: stored.referrer ?? document.referrer ?? undefined,
    utmSource: stored.utmSource ?? pick("utm_source"),
    utmMedium: stored.utmMedium ?? pick("utm_medium"),
    utmCampaign: stored.utmCampaign ?? pick("utm_campaign"),
    utmContent: stored.utmContent ?? pick("utm_content"),
    utmTerm: stored.utmTerm ?? pick("utm_term"),
    gclid: stored.gclid ?? pick("gclid"),
    // pageUrl is always the page the form was actually submitted from.
    pageUrl: window.location.href,
  };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Private browsing. Attribution is best-effort, never a blocker.
  }

  return current;
}
