import { z } from "zod";

import { STATE_CODES } from "./crm-fields";

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

/**
 * The address, in the shape a CRM can actually use.
 *
 * Roofr requires street, city, state and postal code as four separate
 * required fields and rejects the job card when one is blank. Asking for
 * them separately is the only way to be sure they arrive, so the form no
 * longer tries to read a city out of one free-text line. The street box
 * still accepts a pasted full address and fills the rest in.
 */
const ADDRESS_PARTS = {
  city: z.string().trim().min(2, "City is required").max(80),
  state: z
    .string()
    .transform((value) => value.trim().toUpperCase())
    .refine((value) => STATE_CODES.has(value), "Use a two-letter state code"),
  postal: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a 5 digit ZIP code"),
};

/** Honeypot: a real user never fills this. Must be empty. */
const honeypot = z.string().max(0, "Rejected").optional();

export const residentialLeadSchema = z.object({
  kind: z.literal("residential"),
  /*
   * Two fields, both required, rather than one "Name" box.
   *
   * Roofr marks first and last name required and rejects the job card
   * when either is blank, so a single box forced us to guess: split on
   * the first space and hope. A customer who typed only "Elizabeth"
   * produced a lead with no first name, the CRM hand-off failed, and
   * the roofing site solved the same problem by copying the first name
   * into the last name field, which created a customer called
   * "Sean Sean". Asking for the two parts separately is the only
   * version where nothing is invented and nothing is missing.
   */
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(30),
  address: z.string().min(4, "Street address is required").max(240),
  ...ADDRESS_PARTS,
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
  /*
   * Two fields, both required, rather than one "Name" box.
   *
   * Roofr marks first and last name required and rejects the job card
   * when either is blank, so a single box forced us to guess: split on
   * the first space and hope. A customer who typed only "Elizabeth"
   * produced a lead with no first name, the CRM hand-off failed, and
   * the roofing site solved the same problem by copying the first name
   * into the last name field, which created a customer called
   * "Sean Sean". Asking for the two parts separately is the only
   * version where nothing is invented and nothing is missing.
   */
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").max(30),
  address: z.string().min(4, "Street address is required").max(240),
  ...ADDRESS_PARTS,
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

/** Files that came in with the submission, resolved by the storage adapter. */
export interface LeadAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
  pending?: boolean;
}

export type ResidentialLead = z.infer<typeof residentialLeadSchema>;
export type CommercialLead = z.infer<typeof commercialLeadSchema>;
export type Lead = z.infer<typeof leadSchema> & {
  attachments?: LeadAttachment[];
};
