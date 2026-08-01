import type { Metadata } from "next";

import { hasSession } from "@/lib/production/auth";
import { ProductionDashboard } from "./production-dashboard";
import { ProductionLogin } from "./production-login";

/**
 * Internal production-management dashboard. Reached only by typing the URL: 
 * it is deliberately absent from every menu, the footer, and the sitemap, and
 * noindexed (plus disallowed in robots.ts) so search engines never list it.
 *
 * The server decides login-vs-dashboard from the session cookie; no project
 * data is rendered, fetched, or preloaded until a valid session exists (the
 * dashboard fetches client-side through the session-guarded API).
 */
export const metadata: Metadata = {
  title: "Production Portal: Southeast Roofing",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const authed = await hasSession();
  return authed ? <ProductionDashboard /> : <ProductionLogin />;
}
