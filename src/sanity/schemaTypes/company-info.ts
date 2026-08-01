import { defineField, defineType } from "sanity";

/**
 * Singleton: the CMS-side source of truth for company data (NAP).
 * Mirrors src/config/site.ts, once Sanity is connected, config values
 * migrate here so the owner can update NAP without a deploy.
 */
export const companyInfo = defineType({
  name: "companyInfo",
  title: "Company Info",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      initialValue: "Southeast Roofing",
    }),
    defineField({ name: "legalName", type: "string" }),
    defineField({
      name: "phoneDisplay",
      title: "Phone (display)",
      type: "string",
      description: "As shown on the site, e.g. (601) 555-1234",
    }),
    defineField({
      name: "phoneTel",
      title: "Phone (E.164 for tel: links)",
      type: "string",
      description: "e.g. +16015551234",
    }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "streetAddress", type: "string" }),
    defineField({ name: "city", type: "string", initialValue: "Hattiesburg" }),
    defineField({ name: "state", type: "string", initialValue: "MS" }),
    defineField({ name: "postalCode", type: "string" }),
    defineField({
      name: "hours",
      type: "string",
      description: "e.g. Mon–Fri 7am–6pm",
    }),
    defineField({
      name: "license",
      title: "MS Contractor License #",
      type: "string",
      description: "Real license number only: never a placeholder.",
    }),
    defineField({ name: "foundingYear", type: "number" }),
    defineField({
      name: "socialProfiles",
      title: "Social / GBP URLs (schema sameAs)",
      type: "array",
      of: [{ type: "url" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Company Info" }) },
});
