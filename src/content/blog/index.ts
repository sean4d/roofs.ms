import type { ArticleBlock } from "@/content/learn/types";

/**
 * Blog registry (PRD §13 Phase 7): timely posts — company news, storm
 * updates, project stories. Same block system as the Learning Center.
 * Integrity rule: posts describe real events only.
 */

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  /** ISO publish date */
  date: string;
  readMinutes: number;
  body: ArticleBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "new-website-real-photos-real-proposals",
    title:
      "The new southeastroofing.llc: real photos, real pricing, nothing to hide",
    metaTitle: "Our New Website | Southeast Roofing Blog",
    metaDescription:
      "Southeast Roofing's new site is live: a gallery of real completed roofs across South Mississippi, a real itemized proposal you can explore, and 31 community pages.",
    excerpt:
      "Our new site is live — built around the things most roofing websites hide: real project photos, real line-item pricing, and reviews we can't edit.",
    date: "2026-07-05",
    readMinutes: 3,
    body: [
      {
        type: "p",
        text: "We rebuilt southeastroofing.llc from the ground up this summer, and we built it around a simple idea: show homeowners the things most roofing websites hide.",
      },
      { type: "h2", text: "Real roofs, on real streets" },
      {
        type: "p",
        text: "The project gallery holds dozens of photos from our actual job sites — completed roofs in Hattiesburg, Petal, Biloxi, Gulfport, and across South Mississippi, plus the storm damage we document during inspections. No stock photography pretends to be our work anywhere on this site, and the gallery says so right at the top.",
      },
      { type: "h2", text: "A real proposal you can play with" },
      {
        type: "p",
        text: "On the homepage you'll find an interactive example built from our actual proposal format: every line of a roof replacement priced separately, with optional upgrades you can toggle on and off and watch the total change. That's how our real proposals work too — nothing pre-checked, no hidden fees, no surprises.",
      },
      { type: "h2", text: "Your town, specifically" },
      {
        type: "p",
        text: "We serve Mississippi within about two hours of Hattiesburg, and the site now has a dedicated page for 31 of those communities — from the Pine Belt to the Coast — with local storm history and honest answers about how we work in each one.",
      },
      {
        type: "callout",
        title: "Take a look around",
        text: "Start with the gallery, poke at the proposal, and check whether your town has its page yet.",
        href: "/projects",
        linkLabel: "Browse the project gallery",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Human-readable date for display (avoids client/server locale drift). */
export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}
