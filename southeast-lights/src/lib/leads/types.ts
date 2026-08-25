import { z } from "zod";

/** Shared shape for every lead the site produces. */

export const attributionSchema = z
  .object({
    landingPage: z.string().optional(),
    pageUrl: z.string().optional(),
    referrer: z.string().optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmContent: z.string().optional(),
    utmTerm: z.string().optional(),
    gclid: z.string().optional(),
  })
  .optional();

/** Honeypot: a real user never fills this. Must be empty. */
const honeypot = z.string().max(0, "Rejected").optional();

export const residentialLeadSchema = z.object({
  kind: z.literal("residential"),
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(30),
  address: z.string().min(5, "Property address is required").max(240),
  services: z.array(z.string()).default([]),
  budget: z.string().optional(),
  notes: z.string().max(4000).optional(),
  /** Everything the estimator collected, carried into the lead verbatim. */
  estimate: z
    .object({
      total: z.number().optional(),
      roofFt: z.number().optional(),
      selections: z.record(z.string(), z.unknown()).optional(),
      colorScheme: z.string().optional(),
    })
    .optional(),
  attribution: attributionSchema,
  company: honeypot,
});

export const commercialLeadSchema = z.object({
  kind: z.literal("commercial"),
  organization: z.string().min(2, "Organization name is required").max(200),
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(30),
  address: z.string().min(5, "Property address is required").max(240),
  propertyType: z.string().min(1, "Please choose a property type"),
  communityName: z.string().max(200).optional(),
  buildingCount: z.string().max(40).optional(),
  projectCategories: z.array(z.string()).default([]),
  desiredCompletion: z.string().max(80).optional(),
  budget: z.string().optional(),
  electrical: z.string().max(400).optional(),
  siteAccess: z.string().max(400).optional(),
  notes: z.string().max(6000).optional(),
  attribution: attributionSchema,
  company: honeypot,
});

export const leadSchema = z.discriminatedUnion("kind", [
  residentialLeadSchema,
  commercialLeadSchema,
]);

export type ResidentialLead = z.infer<typeof residentialLeadSchema>;
export type CommercialLead = z.infer<typeof commercialLeadSchema>;
export type Lead = z.infer<typeof leadSchema>;
