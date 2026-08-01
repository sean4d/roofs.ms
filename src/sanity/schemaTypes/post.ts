import { defineField, defineType } from "sanity";

/** Blog post: timely content: news, storm updates, project stories (PRD §2). */
export const post = defineType({
  name: "post",
  title: "Blog Post",
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
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["news", "storm-updates", "projects", "tips"] },
      initialValue: "news",
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
