import type { Metadata } from "next";

import { LEAD_REQUESTS } from "@/config/lead-requests";
import { buildMetadata } from "@/lib/seo";
import { RequestPage } from "@/components/forms/request-page";

/**
 * Storm damage inspection request, where storm/insurance CTAs land. Prefills
 * the storm flag and service so the lead reaches the office already tagged as
 * an insurance-track job.
 */

const request = LEAD_REQUESTS["storm-inspection"];

export const metadata: Metadata = buildMetadata({
  title: request.metaTitle,
  description: request.metaDescription,
  path: request.path,
  titleAbsolute: true,
});

export default function StormInspectionPage() {
  return <RequestPage request={request} />;
}
