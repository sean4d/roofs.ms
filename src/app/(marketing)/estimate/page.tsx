import type { Metadata } from "next";

import { LEAD_REQUESTS } from "@/config/lead-requests";
import { buildMetadata } from "@/lib/seo";
import { RequestPage } from "@/components/forms/request-page";

/**
 * Free itemized estimate — where "Get your itemized proposal" / "Get the
 * estimate first" CTAs land. Distinct from /free-inspection (an on-site visit)
 * and /quote (the six-tap wizard): this is "send me a written, priced estimate."
 */

const request = LEAD_REQUESTS.estimate;

export const metadata: Metadata = buildMetadata({
  title: request.metaTitle,
  description: request.metaDescription,
  path: request.path,
  titleAbsolute: true,
});

export default function EstimatePage() {
  return <RequestPage request={request} />;
}
