import type { CityContent } from "@/content/cities/types";

/**
 * City batch 4 (owner request 2026-07-05): Waynesboro and Crystal Springs —
 * both listed on the legacy site's service area but not yet on the new
 * platform. Anti-doorway rules hold: genuinely local copy (county, rivers,
 * highways, storm exposure), honest drive times, and — because we have no
 * project photos in either town — NO claims of completed local work. These
 * pages present service availability, not local proof.
 */

export const citiesBatch4: CityContent[] = [
  /* ------------------------------------------------------------------ */
  /* Waynesboro — Wayne County seat, an hour east                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "waynesboro",
    city: "Waynesboro",
    county: "Wayne County",
    driveTime: "about an hour",
    metaTitle: "Roofing Contractor in Waynesboro, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement, repair, and storm response in Waynesboro, MS — GAF-certified roofing for Wayne County, an hour east of our Hattiesburg office.",
    hero: {
      headline: "Roofing for Wayne County's county seat",
      subhead:
        "Waynesboro sits an hour east of our office, on the banks of the Chickasawhay. We bring the same licensed, GAF-certified process east that we run at home — inspection to itemized proposal to final walkthrough.",
    },
    intro: {
      title: "An hour east, on the Chickasawhay",
      paragraphs: [
        "Waynesboro grew up as a railroad town — the Mobile & Ohio laid the town out in the 1850s, and it took the county seat from old Winchester in 1867. That heritage still shows in the housing: solid older homes near downtown, mid-century streets, and country properties spread along US-45 and Highway 63 toward Buckatunna and Clara. We roof all of it, from straightforward shingle replacements to metal systems built to reroof once and forget it.",
        "From our Hattiesburg office it's about an hour northeast to Wayne County, close enough that inspections and repairs schedule without drama. Waynesboro homeowners get exactly what our home-turf customers get: a free inspection, photos of what we actually find, and an itemized digital proposal with every line priced before a single truck loads — distance is our logistics problem, not your price.",
        "Wayne County living means river-bottom humidity and heavy tree cover, and both are hard on roofs. The Chickasawhay and Leaf river bottoms keep shingles shaded and damp, while the pines that fill the county turn every windstorm into a limb-and-debris cleanup. Our inspections here read the whole picture — shingles, ventilation, flashing, and the gutters fighting the pine straw.",
      ],
    },
    localAreas: {
      title: "Around Waynesboro",
      items: [
        "Downtown Waynesboro",
        "US-45 corridor",
        "Highway 63",
        "Chickasawhay River area",
        "Buckatunna",
        "Clara",
        "Chicora",
        "Greater Wayne County",
      ],
    },
    stormContext: {
      title: "East Mississippi weather, from two directions",
      text: "Wayne County catches spring severe weather rolling in from the west and hurricane remnants pushing up the Chickasawhay and Leaf river corridors from the Gulf. Straight-line winds and hail bruising often hide until they leak — our free storm inspections document every impact point with photos while the insurance window is still open, and we'll tell you honestly when the roof simply held.",
    },
    faqs: [
      {
        question: "Is Waynesboro really in your service area?",
        answer:
          "Yes — it's about an hour east of our Hattiesburg office, comfortably inside our service radius. Wayne County inspections, replacements, and storm work all run on the same standards as our home turf.",
      },
      {
        question: "How do estimates work an hour from your office?",
        answer:
          "Identically to anywhere else: a free inspection, photos of what we find, and an itemized digital proposal emailed to you with every line priced. The drive is on us — it never changes your number.",
      },
      {
        question: "Can you help with a storm insurance claim in Wayne County?",
        answer:
          "Absolutely. Wind and hail claims are our daily work across the whole region — thorough photo documentation, reports in the format adjusters expect, and on-site adjuster meetings when they're needed.",
      },
      {
        question:
          "Do you install metal roofing on rural Wayne County properties?",
        answer:
          "Yes — metal is a favorite on larger country properties that want to reroof once. We install standing-seam and exposed-fastener systems and will walk you through which fits your structure and budget.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Crystal Springs — Copiah County, the I-55 corridor                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "crystal-springs",
    city: "Crystal Springs",
    county: "Copiah County",
    driveTime: "about an hour and forty-five minutes",
    metaTitle: "Roofing Contractor in Crystal Springs, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement, repair, and storm response in Crystal Springs, MS — GAF-certified roofing for Copiah County along the I-55 corridor.",
    hero: {
      headline: "Roofing for the Tomato Capital",
      subhead:
        "Crystal Springs sits on I-55 between Jackson and Brookhaven, on the western arc of our service radius. We bring our full licensed, GAF-certified process north — itemized proposals, honest scheduling, no shortcuts.",
    },
    intro: {
      title: "The Tomato Capital, on our western arc",
      paragraphs: [
        'Crystal Springs earned its name — "The Tomato Capital of the World" — shipping more tomatoes by rail than anywhere in the country in the late 1930s, and the town still throws its Tomato Festival on the last Saturday of June. That civic pride shows in a well-kept historic downtown and neighborhoods of homes worth roofing right: steep older pitches near the center of town, mid-century streets, and newer construction spreading into Copiah County.',
        "The city sits right on Interstate 55 at Exit 72, twenty-four miles south of Jackson and twenty-nine north of Brookhaven — which puts it squarely on the western arc we already serve through Brookhaven and McComb. From Hattiesburg it's about an hour and forty-five minutes, the far edge of our radius, and we schedule it deliberately in blocks so the timeline we quote is the timeline you get.",
        "Distance changes our logistics, never our process. A Crystal Springs homeowner gets the same free inspection, the same photos of what we find, and the same itemized digital proposal — every line priced before we commit a crew — as a customer five minutes from our office. That transparency is exactly what lets someone scrutinize an out-of-town contractor before hiring one, which is how it should be.",
      ],
    },
    localAreas: {
      title: "Around Crystal Springs",
      items: [
        "Historic downtown",
        "US-51 corridor",
        "I-55 Exit 72",
        "Near Hazlehurst",
        "Wesson",
        "Gallman",
        "Greater Copiah County",
      ],
    },
    stormContext: {
      title: "The I-55 corridor breeds spring storms",
      text: "Copiah County shares the I-55 storm corridor with its Lincoln and Pike County neighbors to the south, where spring hail cores and tornado warnings are routine, plus spillover from the supercell hail that regularly hammers the Jackson metro just up the interstate. Bruised shingles from a spring hail run may not leak until fall — long after claim windows tighten. Our free inspections document everything while the timeline still works in your favor.",
    },
    faqs: [
      {
        question: "Do you really serve Crystal Springs from Hattiesburg?",
        answer:
          "Yes — it's on the western arc we already cover through Brookhaven and McComb, about an hour and forty-five minutes out at the edge of our radius. We batch western work into dedicated blocks so scheduling stays efficient and honest.",
      },
      {
        question: "Why hire a Hattiesburg roofer up in Copiah County?",
        answer:
          "Because accountability travels: MSBOC license #R22245, GAF certification, itemized proposals, and a company with a standing office you can drive past. If that beats the storm-chasing alternatives, the drive is our problem, not yours.",
      },
      {
        question:
          "Can you work on the older homes near downtown Crystal Springs?",
        answer:
          "Gladly — steep pitches, older decking, and architectural detail are familiar work. We inspect carefully first so the proposal reflects the roof that's actually up there, not a guess.",
      },
      {
        question: "Do you handle hail claims along the I-55 corridor?",
        answer:
          "Hail documentation is a core competency — bruise mapping, soft-metal evidence, and reports adjusters take seriously. We can meet your adjuster on the roof anywhere in Copiah County.",
      },
    ],
  },
];
