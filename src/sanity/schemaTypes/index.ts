import type { SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./case-study";
import { companyInfo } from "./company-info";
import { faq } from "./faq";
import { gbpAuto } from "./gbp-auto";
import { guide } from "./guide";
import { location } from "./location";
import { post } from "./post";
import { project } from "./project";
import { service } from "./service";
import { siteFlags } from "./site-flags";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  companyInfo,
  siteFlags,
  gbpAuto,
  // Core content
  service,
  location,
  project,
  caseStudy,
  faq,
  // Content engine
  guide,
  post,
];
