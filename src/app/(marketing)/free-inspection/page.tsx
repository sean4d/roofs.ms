import type { Metadata } from "next";

import { LEAD_REQUESTS } from "@/config/lead-requests";
import { buildMetadata } from "@/lib/seo";
import { RequestPage } from "@/components/forms/request-page";

/**
 * Free inspection, the on-site visit request. One of several request types
 * (see config/lead-requests); CTAs that promise something else (an itemized
 * estimate, a repair, a storm inspection) now have their own matching pages.
 */

const request = LEAD_REQUESTS["free-inspection"];

export const metadata: Metadata = buildMetadata({
  title: request.metaTitle,
  description: request.metaDescription,
  path: request.path,
  titleAbsolute: true,
});

export default function FreeInspectionPage() {
  return <RequestPage request={request} />;
}
