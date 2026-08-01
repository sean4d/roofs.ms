import { defineField, defineType } from "sanity";

/** Singleton: owner-togglable feature flags (storm banner etc.), PRD §9.2. */
export const siteFlags = defineType({
  name: "siteFlags",
  title: "Site Flags",
  type: "document",
  fields: [
    defineField({
      name: "emergencyBannerEnabled",
      title: "Show emergency/storm banner",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "emergencyBannerMessage",
      type: "string",
      initialValue: "Storm damage? We're responding to emergency calls now.",
    }),
    defineField({
      name: "stormCenterEnabled",
      title: "Storm Center live (Phase 8)",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { prepare: () => ({ title: "Site Flags" }) },
});
