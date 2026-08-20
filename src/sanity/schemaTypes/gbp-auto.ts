import { defineField, defineType } from "sanity";

/**
 * Rotation state for the weekly Google Business Profile Update cron.
 *
 * Google rehosts every image we post on its own CDN, so a live post cannot be
 * traced back to the Sanity asset it came from. Without this document there is
 * no way to know which photos have already been used, which is how three
 * consecutive Updates ended up showing the same picture.
 *
 * Machine-written. Nothing here should be edited by hand.
 */
export const gbpAuto = defineType({
  name: "gbpAuto",
  title: "GBP auto-post state",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "usedPhotoIds",
      title: "Photos already posted",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "usedTopics",
      title: "Messages and topics already used",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "postCount", title: "Posts sent", type: "number" }),
  ],
  preview: {
    select: { count: "postCount" },
    prepare: ({ count }) => ({
      title: "GBP auto-post state",
      subtitle: `${count ?? 0} posts sent`,
    }),
  },
});
