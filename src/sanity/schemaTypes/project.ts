import { defineField, defineType } from "sanity";

import { JOB_TYPES, PHASES } from "@/config/job-taxonomy";

/** A gallery project (residential or commercial) — PRD §2 /projects.
 *  Extended 2026-07-07 to back the /upload job-intake system: job type,
 *  conditional detail fields, before/progress/after photos with per-photo
 *  SEO, derived filter tags, and social-syndication tracking. */
export const project = defineType({
  name: "project",
  title: "Project",
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
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "channel",
      type: "string",
      options: { list: ["residential", "commercial"], layout: "radio" },
      initialValue: "residential",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "jobType",
      title: "Job type",
      type: "string",
      options: { list: JOB_TYPES.map((j) => ({ title: j.label, value: j.value })) },
      description: "Set automatically by the /upload form.",
    }),
    defineField({
      name: "city",
      title: "City (label)",
      type: "string",
      description: "Plain city label shown on the gallery card.",
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
    defineField({ name: "summary", type: "text", rows: 2 }),
    defineField({
      name: "description",
      title: "Job description (owner-written)",
      type: "text",
      rows: 4,
    }),
    // Structured detail fields captured by the form (brand, color, etc.).
    defineField({
      name: "details",
      title: "Job details",
      type: "array",
      of: [
        {
          type: "object",
          name: "detail",
          fields: [
            { name: "key", type: "string" },
            { name: "label", type: "string" },
            { name: "value", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    // Photos, each carrying its own SEO. Grouped by install phase.
    defineField({
      name: "media",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "object",
          name: "jobPhoto",
          fields: [
            { name: "image", type: "image", options: { hotspot: true } },
            {
              name: "phase",
              type: "string",
              options: { list: PHASES.map((p) => ({ title: p.label, value: p.key })) },
            },
            { name: "alt", title: "Alt text", type: "string" },
            { name: "title", title: "SEO title", type: "string" },
            { name: "metaDescription", type: "text", rows: 2 },
            { name: "filename", title: "SEO filename", type: "string" },
          ],
          preview: {
            select: { title: "title", subtitle: "phase", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Gallery filter tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "completedAt", type: "date" }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
      description: "Eligible for homepage featured-projects section.",
    }),
    // Social fan-out: the shared caption + per-platform post tracking.
    defineField({ name: "socialCaption", type: "text", rows: 4 }),
    defineField({
      name: "syndication",
      title: "Social syndication",
      type: "array",
      of: [
        {
          type: "object",
          name: "syndicationTarget",
          fields: [
            { name: "platform", type: "string" },
            { name: "status", type: "string" },
            { name: "url", type: "url" },
            { name: "postedAt", type: "datetime" },
            { name: "note", type: "string" },
          ],
          preview: { select: { title: "platform", subtitle: "status" } },
        },
      ],
    }),
    // --- Legacy fields (kept for the original static-gallery shape) ---
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      hidden: true,
    }),
    defineField({ name: "beforeImage", type: "image", options: { hotspot: true }, hidden: true }),
    defineField({ name: "afterImage", type: "image", options: { hotspot: true }, hidden: true }),
  ],
  preview: {
    select: { title: "title", subtitle: "city", media: "media.0.image" },
  },
});
