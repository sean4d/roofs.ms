import type { Metadata } from "next";

import { LEAD_REQUESTS } from "@/config/lead-requests";
import { buildMetadata } from "@/lib/seo";
import { RequestPage } from "@/components/forms/request-page";

/**
 * Roof repair request, where "repair" CTAs land, instead of a generic
 * inspection page. Prefills the service so the lead arrives correctly tagged.
 */

const request = LEAD_REQUESTS.repair;

export const metadata: Metadata = buildMetadata({
  title: request.metaTitle,
  description: request.metaDescription,
  path: request.path,
  titleAbsolute: true,
});

export default function RepairRequestPage() {
  return <RequestPage request={request} />;
}
