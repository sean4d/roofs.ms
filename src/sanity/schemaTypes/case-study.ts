import { defineField, defineType } from "sanity";

/** Commercial case study: challenge → solution → outcome (PRD §4.2). */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study (Commercial)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "industry",
      type: "string",
      options: {
        list: [
          "schools",
          "churches",
          "apartments",
          "industrial",
          "warehouses",
          "municipal",
          "other",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      type: "string",
      description: "Only with the client's permission to name them.",
    }),
    defineField({ name: "challenge", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "solution", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "outcome", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "systemInstalled",
      type: "string",
      description: "e.g. 60-mil TPO, standing seam: real spec only.",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "service",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "location",
      type: "reference",
      to: [{ type: "location" }],
    }),
    defineField({ name: "completedAt", type: "date" }),
  ],
});
