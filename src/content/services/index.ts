import { residentialServices } from "@/content/services/residential";
import {
  residentialMetalChildren,
  residentialMetalHub,
} from "@/content/services/residential-metal";
import { commercialServices } from "@/content/services/commercial";
import {
  commercialMetalChildren,
  commercialMetalHub,
} from "@/content/services/commercial-metal";
import { industries } from "@/content/services/industries";
import { emergencyRoofing, insuranceClaims } from "@/content/services/storm";
import type { ServiceContent } from "@/content/services/types";

/**
 * Service-content registry. Route files resolve their ServiceContent here
 * and call generateStaticParams from the exported lists, so adding a
 * service = one content entry, no new route code.
 */

export const allServices: ServiceContent[] = [
  ...residentialServices,
  residentialMetalHub,
  ...residentialMetalChildren,
  ...commercialServices,
  commercialMetalHub,
  ...commercialMetalChildren,
  ...industries,
  emergencyRoofing,
  insuranceClaims,
];

/** Core residential services rendered by /residential/[service]. */
export function getResidentialService(
  slug: string,
): ServiceContent | undefined {
  return residentialServices.find((service) => service.slug === slug);
}

/** Metal children rendered by /residential/metal-roofing/[system]. */
export function getResidentialMetalChild(
  slug: string,
): ServiceContent | undefined {
  return residentialMetalChildren.find((service) => service.slug === slug);
}

export {
  emergencyRoofing,
  insuranceClaims,
  residentialMetalChildren,
  residentialMetalHub,
  residentialServices,
};
export {
  commercialServices,
  getCommercialService,
} from "@/content/services/commercial";
export {
  commercialMetalChildren,
  commercialMetalHub,
  getCommercialMetalChild,
} from "@/content/services/commercial-metal";
export {
  getIndustry,
  industries,
  industryCards,
} from "@/content/services/industries";
