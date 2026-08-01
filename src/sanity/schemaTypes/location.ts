import { defineField, defineType } from "sanity";

/**
 * A service-area city page (PRD §5). Tier controls required content depth: 
 * the anti-doorway rule: every city gets genuinely local, unique copy.
 */
export const location = defineType({
  name: "location",
  title: "Service Area (City)",
  type: "document",
  fields: [
    defineField({
      name: "city",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "city" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tier",
      type: "number",
      options: { list: [1, 2] },
      initialValue: 2,
      description:
        "Tier 1 = 800–1,200 words unique copy; Tier 2 = 500–700 words.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "county", type: "string" }),
    defineField({ name: "state", type: "string", initialValue: "MS" }),
    defineField({
      name: "intro",
      title: "Local intro (unique copy: never templated)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "geo", type: "geopoint" }),
    defineField({
      name: "faqs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
    defineField({
      name: "nearbyAreas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "location" }] }],
    }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", type: "string" }),
        defineField({ name: "metaDescription", type: "text", rows: 2 }),
      ],
    }),
  ],
  preview: {
    select: { title: "city", subtitle: "county" },
  },
});
