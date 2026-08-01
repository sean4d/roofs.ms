import type { ArticleBlock } from "@/content/learn/types";
import { siteConfig } from "@/config/site";

/**
 * Blog registry (PRD §13 Phase 7): timely posts: company news, storm
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
  /**
   * Lead image. Rendered at the top of the post AND used for the social share
   * card and Article schema, so it must be a real photo of what the post is
   * about, never decoration.
   */
  image?: { src: string; alt: string };
  /**
   * Other businesses this post genuinely discusses. Emitted as schema.org
   * `mentions` so the relationship reads as an entity association rather than
   * only as a link.
   */
  mentions?: { name: string; url: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "roof-washing-now-offered-south-mississippi",
    title:
      "We now offer roof washing, and we’re doing it the roofer’s way",
    metaTitle: "Roof Washing Now Offered | Southeast Roofing Blog",
    metaDescription:
      "Southeast Roofing now offers residential and commercial roof washing across South Mississippi: with an exterior-cleaning partner alongside us, and the roof evaluated by roofers first.",
    excerpt:
      "Black streaks aren’t dirt. They’re alive, and they feed on your shingles. Here’s our new roof-washing service, how it works, and why the roof gets evaluated before anything touches it.",
    date: "2026-07-30",
    readMinutes: 4,
    image: {
      src: "/images/services/roof-washing-asphalt-shingle-roof.jpg",
      alt: "Technician rinsing algae staining from an asphalt shingle roof with a low-pressure spray",
    },
    mentions: [
      {
        name: siteConfig.partners.exteriorCleaning.name,
        url: siteConfig.partners.exteriorCleaning.url,
      },
    ],
    body: [
      {
        type: "p",
        text: "Southeast Roofing now offers roof washing for both homes and commercial buildings across South Mississippi. It is a service customers have asked us about for a long time, and we have held off until we could offer it the way a roofing company should: with the roof evaluated before anything touches it.",
      },
      { type: "h2", text: "Those black streaks are alive" },
      {
        type: "p",
        text: "The dark streaks running down roofs across the Pine Belt and the Coast are not dirt, and they are not simply age. They are algae, and our climate is close to ideal for them: heat, humidity, shade, and a long growing season. That is why the shaded slope of a roof often looks a decade older than the sunny side of the same house.",
      },
      {
        type: "p",
        text: "It matters beyond appearance. The organism feeds on filler material in asphalt shingles, holds moisture against the roof surface, and darkens the roof so it absorbs more heat. Moss and lichen take it further, moss holds water at the shingle edges like a sponge, and lichen roots into the granule surface, which is why removing it carelessly does more harm than leaving it alone.",
      },
      { type: "h2", text: "Why we would not offer this before" },
      {
        type: "p",
        text: "The honest reason is that roof washing done wrong destroys roofs. Asphalt shingles are protected by a layer of ceramic-coated granules, that surface is what blocks ultraviolet light and carries the shingle’s weather performance. Drive water at it under pressure and you strip granules, force water backward under the courses, and take years off a roof that was otherwise fine. Shingle manufacturers direct owners away from high-pressure washing for exactly this reason.",
      },
      {
        type: "p",
        text: "We have inspected the aftermath more than once: bare patches on the slopes that were cleaned hardest, granules collected in the gutters, and an owner who paid to age their own roof. So we were not willing to put our name on roof washing until the evaluation came first.",
      },
      {
        type: "list",
        title: "What we establish before any wash is scheduled",
        items: [
          "What the roof covering actually is, and how old it is",
          "Granule condition, whether the roof can afford to be cleaned at all",
          "Whether the growth is surface algae, thick moss, or rooted lichen",
          "The condition of flashings, pipe boots, and penetrations",
          "Slope, height, access, and what sits below the work area",
          "Gutter and drainage condition, since everything rinsed off ends up there",
        ],
      },
      { type: "h2", text: "A partnership, not a handoff" },
      {
        type: "p",
        // Owner directive 2026-07-31: this is the ONE place on the site where
        // our exterior-cleaning partner is named and linked, service pages
        // stay clean. Owner directive (same day): keep the customer-facing
        // wording in partnership terms; no "contract" or "subcontract".
        text: "We have teamed up with South Mississippi Power Washing to bring this service to our customers. They bring the exterior-cleaning experience; we bring the roofing judgement about what a given roof can take. Neither half is much good without the other, which is exactly why we waited to find the right people rather than guess at it ourselves.",
        link: {
          text: "South Mississippi Power Washing",
          href: siteConfig.partners.exteriorCleaning.url,
          external: true,
        },
      },
      {
        type: "p",
        text: "None of that changes who you are dealing with. Southeast Roofing is who you call, who schedules the work, and who stands behind the result. We inspect the roof, decide what it can take, plan the job, and are there from the first call through the final walkthrough, with cleaning specialists working alongside us rather than in place of us.",
      },
      { type: "h2", text: "When washing is the wrong answer" },
      {
        type: "p",
        text: "Washing does not add life to a roof that is finished. If the shingles are brittle or shedding granules widely, cleaning buys appearance and very little else, and that money is usually better held toward the replacement. We would rather say so than take the job, which is the whole point of having a roofer make that call.",
      },
      {
        type: "p",
        text: "Where a wash genuinely earns its keep is the roof with real service life left that simply looks older than it is: staining on the shaded slopes, moss starting in the valleys, sound shingles underneath. That roof is worth cleaning, and worth keeping clean, because the conditions that grew the algae the first time are still there afterward.",
      },
      { type: "h2", text: "Commercial properties too" },
      {
        type: "p",
        text: "Commercial roof washing works the same way, with one extra wrinkle: a single property often carries several roof surfaces: membrane on the main building, metal on canopies, shingles on an office wing, and they do not respond to cleaning the same way. Each roof area gets its own evaluation, and the schedule gets planned around how the building actually operates.",
      },
      {
        type: "callout",
        title: "Wondering whether your roof is a candidate?",
        text: "The evaluation is a roofing inspection, and you get an honest answer either way, including when the answer is that washing is not worth your money.",
        href: "/residential/roof-washing",
        linkLabel: "See how roof washing works",
      },
    ],
  },
  {
    slug: "new-website-real-photos-real-proposals",
    title:
      "The new southeastroofing.llc: real photos, real pricing, nothing to hide",
    metaTitle: "Our New Website | Southeast Roofing Blog",
    metaDescription:
      "Southeast Roofing's new site is live: a gallery of real completed roofs across South Mississippi, a real itemized proposal you can explore, and 31 community pages.",
    excerpt:
      "Our new site is live, built around the things most roofing websites hide: real project photos, real line-item pricing, and reviews we can't edit.",
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
        text: "The project gallery holds dozens of photos from our actual job sites: completed roofs in Hattiesburg, Petal, Biloxi, Gulfport, and across South Mississippi, plus the storm damage we document during inspections. No stock photography pretends to be our work anywhere on this site, and the gallery says so right at the top.",
      },
      { type: "h2", text: "A real proposal you can play with" },
      {
        type: "p",
        text: "On the homepage you'll find an interactive example built from our actual proposal format: every line of a roof replacement priced separately, with optional upgrades you can toggle on and off and watch the total change. That's how our real proposals work too: nothing pre-checked, no hidden fees, no surprises.",
      },
      { type: "h2", text: "Your town, specifically" },
      {
        type: "p",
        text: "We serve Mississippi within about two hours of Hattiesburg, and the site now has a dedicated page for 31 of those communities, from the Pine Belt to the Coast, with local storm history and honest answers about how we work in each one.",
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
  {
    slug: "peak-hurricane-season-roof-prep",
    title: "Peak hurricane season starts now: the 20 minutes that matter",
    metaTitle: "Peak Hurricane Season Roof Prep | Southeast Roofing Blog",
    metaDescription:
      "August through October is the busiest stretch of hurricane season in South Mississippi. Here's the short list we give homeowners before a storm is named.",
    excerpt:
      "August through October is the peak of it. Twenty minutes now is worth more than anything you can do once a storm has a name.",
    date: "2026-07-26",
    readMinutes: 4,
    body: [
      {
        type: "p",
        text: "Hurricane season officially runs June through November, but in South Mississippi the back half is what gets our attention. August, September, and October are historically the busiest stretch, and they're also when our phones start ringing with things that could have been caught in July.",
      },
      {
        type: "p",
        text: "Almost nothing on the list below requires a ladder, and none of it requires us. It's simply the stuff we wish every homeowner did before a storm rather than after.",
      },
      { type: "h2", text: "From the ground, right now" },
      {
        type: "list",
        items: [
          "Walk the perimeter and look up. Lifted or missing shingles, sagging gutter runs, exposed nail heads along the ridge. A phone camera zoom works fine.",
          "Check the gutters. Overflowing gutters push water under the roof edge exactly where wind wants to start peeling.",
          "Trim limbs over the roofline. In the Pine Belt, trees do as much roof damage as wind, and a limb you can reach in July is a claim you avoid in September.",
          'Take dated photos of your roof and each side of the house. This is the single highest-value five minutes on the list. Dated "before" photos make an after-storm claim dramatically cleaner.',
        ],
      },
      { type: "h2", text: "In the attic, after the next hard rain" },
      {
        type: "p",
        text: "Take a flashlight up and look for daylight where there shouldn't be any, water stains along nail lines and around penetrations, and matted or damp insulation. A musty smell is a finding, not just an old-house quirk. Active leaks that seem minor in an August thunderstorm behave very differently under a hurricane's rain.",
      },
      { type: "h2", text: "Know two things about your policy" },
      {
        type: "p",
        text: "Before a storm is named, find your deductible type and your coverage basis. Many Mississippi policies carry a separate wind/hail deductible calculated as a percentage of dwelling coverage rather than a flat dollar figure, and coastal policies often handle named-storm wind separately. Replacement-cost and actual-cash-value policies pay very differently. Ten minutes with your declarations page now beats finding out during a claim.",
      },
      { type: "h2", text: "When a storm does get named" },
      {
        type: "list",
        items: [
          "Secure anything in the yard that can become a projectile. More shingle punctures come from flying debris than from raw wind speed.",
          "Do not put anyone on a roof for last-minute repairs in deteriorating weather. Nothing up there is worth it.",
          "Have your documents and photos somewhere you can reach them without power.",
        ],
      },
      {
        type: "callout",
        title: "Not sure what you're looking at?",
        text: "A documented inspection is free and no-obligation, and it date-stamps your roof's condition, which helps if a claim comes later. We'll tell you honestly when the answer is that your roof is fine.",
        href: "/free-inspection",
        linkLabel: "Schedule a free inspection",
      },
      {
        type: "p",
        text: "And if a storm does hit: our emergency line is open around the clock for tarping and urgent response. We're local, so we're here before it, during it, and long after the out-of-town trucks have moved on.",
      },
    ],
  },

  {
    slug: "every-google-review-now-on-our-site",
    title: "Every one of our Google reviews now lives on our site",
    metaTitle: "All Our Google Reviews, Live on the Site | Southeast Roofing",
    metaDescription:
      "We connected our site directly to Google, so every review we have shows up automatically, including new ones, and including our replies. Here's why.",
    excerpt:
      "We connected the site straight to Google. Every review shows automatically now: new ones included: with nothing hand-picked in between.",
    date: "2026-07-26",
    readMinutes: 3,
    body: [
      {
        type: "p",
        text: "Most contractor websites show you five carefully chosen testimonials. We used to show a curated handful too, transcribed by hand from our Google profile. It was accurate, but it was still us deciding which ones you saw.",
      },
      {
        type: "p",
        text: "That's changed. Our site now connects directly to our Google Business Profile and pulls in every review we have, not a selection, not a top five. New reviews appear on their own within a day of being written, and our public replies come along with them.",
      },
      { type: "h2", text: "Why this matters more than it sounds" },
      {
        type: "p",
        text: "A hand-picked testimonial page can't be verified and everyone knows it. A live feed can: what's on our site is what's on Google, where reviews are tied to real accounts and we cannot edit, reword, or bury a single one. If we ever got a bad one, it would appear here the same as the rest. That's the point.",
      },
      { type: "h2", text: "Where you'll see it" },
      {
        type: "list",
        items: [
          "The homepage now carries a live wall of reviews alongside our current Google rating and review count.",
          "The reviews page shows all of them, with our replies where we've responded.",
          "Every one of our 31 community pages shows real reviews too, so you can read what people near you actually said.",
        ],
      },
      { type: "h2", text: "The rest of the honesty stack" },
      {
        type: "p",
        text: "This fits how the rest of the site is built. The project gallery is real photos from our own job sites, tagged with the town they were taken in, no stock photography anywhere. The example proposal on our homepage is our actual format, with every line priced separately and upgrades you can toggle. The credentials link out to records we don't control: our Mississippi license, our GAF certification, our BBB profile.",
      },
      {
        type: "callout",
        title: "Read them at the source",
        text: "Don't take our page's word for it. The Google profile is one tap away, good and bad, exactly as customers wrote it.",
        href: "/reviews",
        linkLabel: "See all our reviews",
      },
      {
        type: "p",
        text: "If we've worked on your roof and you haven't left a review yet, it genuinely helps your neighbors find a roofer they can trust, and now it shows up here automatically too.",
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
