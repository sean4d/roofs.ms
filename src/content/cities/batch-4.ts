import type { CityContent } from "@/content/cities/types";

/**
 * City batch 4: Waynesboro and Crystal Springs (owner request 2026-07-05),
 * both listed on the legacy site's service area but not yet on the new
 * platform, plus Leakesville (owner request 2026-08-08, first Greene County
 * job booked). Anti-doorway rules hold: genuinely local copy (county, rivers,
 * highways, storm exposure), honest drive times, and, because we have no
 * project photos in any of the three, NO claims of completed local work.
 * These pages present service availability, not local proof.
 *
 * Waynesboro and Leakesville both sit on the Chickasawhay and share the
 * Highway 63 corridor, so their copy is deliberately written from different
 * angles: Waynesboro as a railroad county seat with river-bottom humidity,
 * Leakesville as national-forest country where tree cover drives the damage.
 * Neither is a find-and-replace of the other.
 */

export const citiesBatch4: CityContent[] = [
  /* ------------------------------------------------------------------ */
  /* Waynesboro: Wayne County seat, an hour east                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "waynesboro",
    city: "Waynesboro",
    county: "Wayne County",
    driveTime: "about an hour",
    metaTitle: "Roofing Contractor in Waynesboro, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement, repair, and storm response in Waynesboro, MS: GAF-certified roofing for Wayne County, an hour east of our Hattiesburg office.",
    hero: {
      headline: "Roofing for Wayne County's county seat",
      subhead:
        "Waynesboro sits an hour east of our office, on the banks of the Chickasawhay. We bring the same licensed, GAF-certified process east that we run at home: inspection to itemized proposal to final walkthrough.",
    },
    intro: {
      title: "An hour east, on the Chickasawhay",
      paragraphs: [
        "Waynesboro grew up as a railroad town, the Mobile & Ohio laid the town out in the 1850s, and it took the county seat from old Winchester in 1867. That heritage still shows in the housing: solid older homes near downtown, mid-century streets, and country properties spread along US-45 and Highway 63 toward Buckatunna and Clara. We roof all of it, from straightforward shingle replacements to metal systems built to reroof once and forget it.",
        "From our Hattiesburg office it's about an hour northeast to Wayne County, close enough that inspections and repairs schedule without drama. Waynesboro homeowners get exactly what our home-turf customers get: a free inspection, photos of what we actually find, and an itemized digital proposal with every line priced before a single truck loads, distance is our logistics problem, not your price.",
        "Wayne County living means river-bottom humidity and heavy tree cover, and both are hard on roofs. The Chickasawhay and Leaf river bottoms keep shingles shaded and damp, while the pines that fill the county turn every windstorm into a limb-and-debris cleanup. Our inspections here read the whole picture: shingles, ventilation, flashing, and the gutters fighting the pine straw.",
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
      text: "Wayne County catches spring severe weather rolling in from the west and hurricane remnants pushing up the Chickasawhay and Leaf river corridors from the Gulf. Straight-line winds and hail bruising often hide until they leak. Our free storm inspections document every impact point with photos while the insurance window is still open, and we'll tell you honestly when the roof simply held.",
    },
    faqs: [
      {
        question: "Is Waynesboro really in your service area?",
        answer:
          "Yes. It's about an hour east of our Hattiesburg office, comfortably inside our service radius. Wayne County inspections, replacements, and storm work all run on the same standards as our home turf.",
      },
      {
        question: "How do estimates work an hour from your office?",
        answer:
          "Identically to anywhere else: a free inspection, photos of what we find, and an itemized digital proposal emailed to you with every line priced. The drive is on us. It never changes your number.",
      },
      {
        question: "Can you help with a storm insurance claim in Wayne County?",
        answer:
          "Absolutely. Wind and hail claims are our daily work across the whole region: thorough photo documentation, reports in the format adjusters expect, and on-site adjuster meetings when they're needed.",
      },
      {
        question:
          "Do you install metal roofing on rural Wayne County properties?",
        answer:
          "Yes, metal is a favorite on larger country properties that want to reroof once. We install standing-seam and exposed-fastener systems and will walk you through which fits your structure and budget.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Crystal Springs: Copiah County, the I-55 corridor                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "crystal-springs",
    city: "Crystal Springs",
    county: "Copiah County",
    driveTime: "about an hour and forty-five minutes",
    metaTitle: "Roofing Contractor in Crystal Springs, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement, repair, and storm response in Crystal Springs, MS: GAF-certified roofing for Copiah County along the I-55 corridor.",
    hero: {
      headline: "Roofing for the Tomato Capital",
      subhead:
        "Crystal Springs sits on I-55 between Jackson and Brookhaven, on the western arc of our service radius. We bring our full licensed, GAF-certified process north: itemized proposals, honest scheduling, no shortcuts.",
    },
    intro: {
      title: "The Tomato Capital, on our western arc",
      paragraphs: [
        'Crystal Springs earned its name, "The Tomato Capital of the World", shipping more tomatoes by rail than anywhere in the country in the late 1930s, and the town still throws its Tomato Festival on the last Saturday of June. That civic pride shows in a well-kept historic downtown and neighborhoods of homes worth roofing right: steep older pitches near the center of town, mid-century streets, and newer construction spreading into Copiah County.',
        "The city sits right on Interstate 55 at Exit 72, twenty-four miles south of Jackson and twenty-nine north of Brookhaven, which puts it squarely on the western arc we already serve through Brookhaven and McComb. From Hattiesburg it's about an hour and forty-five minutes, the far edge of our radius, and we schedule it deliberately in blocks so the timeline we quote is the timeline you get.",
        "Distance changes our logistics, never our process. A Crystal Springs homeowner gets the same free inspection, the same photos of what we find, and the same itemized digital proposal, every line priced before we commit a crew, as a customer five minutes from our office. That transparency is exactly what lets someone scrutinize an out-of-town contractor before hiring one, which is how it should be.",
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
      text: "Copiah County shares the I-55 storm corridor with its Lincoln and Pike County neighbors to the south, where spring hail cores and tornado warnings are routine, plus spillover from the supercell hail that regularly hammers the Jackson metro just up the interstate. Bruised shingles from a spring hail run may not leak until fall, long after claim windows tighten. Our free inspections document everything while the timeline still works in your favor.",
    },
    faqs: [
      {
        question: "Do you really serve Crystal Springs from Hattiesburg?",
        answer:
          "Yes. It's on the western arc we already cover through Brookhaven and McComb, about an hour and forty-five minutes out at the edge of our radius. We batch western work into dedicated blocks so scheduling stays efficient and honest.",
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
          "Gladly: steep pitches, older decking, and architectural detail are familiar work. We inspect carefully first so the proposal reflects the roof that's actually up there, not a guess.",
      },
      {
        question: "Do you handle hail claims along the I-55 corridor?",
        answer:
          "Hail documentation is a core competency: bruise mapping, soft-metal evidence, and reports adjusters take seriously. We can meet your adjuster on the roof anywhere in Copiah County.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Leakesville: Greene County seat, deep in the national forest       */
  /* ------------------------------------------------------------------ */
  {
    slug: "leakesville",
    city: "Leakesville",
    county: "Greene County",
    driveTime: "about an hour and fifteen minutes",
    metaTitle: "Roofing Contractor in Leakesville, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement, repair, and metal roofing in Leakesville, MS: GAF-certified work for Greene County, the Highway 63 corridor, and the rural properties in between.",
    hero: {
      headline: "Roofing for Greene County, forest and all",
      subhead:
        "Leakesville is the smallest county seat we serve and the most wooded, which changes what a roof is up against. We bring a licensed, GAF-certified process down Highway 63 and price the drive into nothing.",
    },
    intro: {
      title: "The county the forest kept",
      paragraphs: [
        "Leakesville has been the seat of Greene County since the county was drawn in 1811, and it has stayed small on purpose: a courthouse square, a few hundred households, and the Chickasawhay River running past the edge of town. Almost everything around it is timber. The Chickasawhay Ranger District of the De Soto National Forest covers a large share of the county, which makes Greene one of the least populated and most heavily wooded counties in South Mississippi.",
        "That forest is the roofing story here. Homes sit under mature pine and hardwood, often well back from the road, and the canopy never really lets a roof dry out. Needles pack into valleys and gutters, limbs come down in weather that would not bother an open lot, and the shaded north slopes hold moisture long enough to grow the black streaking most people mistake for dirt. An inspection in Greene County that only looks at shingles has missed most of the job.",
        "The practical mix follows the country. Shingle roofs in and around town, and a great deal of metal everywhere else: houses, shops, barns, hunting camps, and outbuildings whose owners would rather roof once than think about it again. From our Hattiesburg office it is about an hour and fifteen minutes southeast, far enough that we schedule Greene County work rather than pretend we are around the corner, and close enough that it is a normal week for us.",
      ],
    },
    localAreas: {
      title: "Around Greene County",
      items: [
        "Downtown Leakesville",
        "Highway 63 corridor",
        "Chickasawhay River bottoms",
        "McLain",
        "State Line",
        "Neely",
        "Sand Hill",
        "Avera",
        "Rural Greene County",
      ],
    },
    stormContext: {
      title: "Inland, but not far enough inland",
      text: "Greene County sits roughly sixty miles from the Gulf, which is the awkward distance: far enough that people assume the coast takes the hit, close enough that hurricanes are still carrying real wind when they arrive. Katrina proved that here, and every season since has repeated the lesson at smaller scale. Add the densest tree cover in our service area and most of our Greene County storm work is limb strikes, punctures, and lifted shingles that will not announce themselves until the next rain. Our free storm inspections photograph every impact point while the claim window is open, and we will tell you plainly when the roof simply held.",
    },
    faqs: [
      {
        question: "Do you actually come this far for Greene County work?",
        answer:
          "Yes. Leakesville is about an hour and fifteen minutes from our Hattiesburg office, inside our service radius, and rural properties are much of the reason that radius is drawn the way it is. We schedule Greene County jobs rather than promise same-hour arrival, which is the honest version.",
      },
      {
        question: "Does the drive change my price?",
        answer:
          "No. You get the same free inspection, the same photos of what we actually find, and the same itemized digital proposal with every line priced before anything is ordered. The distance is our logistics problem, not a line on your estimate.",
      },
      {
        question: "Is metal the right call out here?",
        answer:
          "Often, yes. Under heavy timber, exposed-fastener and standing-seam metal shed needles and shrug off limb strikes far better than shingle, and they ask almost nothing in maintenance. We will price metal against a quality shingle system honestly and tell you where the extra money does and does not earn itself.",
      },
      {
        question: "My roof is dark and streaked. Is that rot?",
        answer:
          "Almost always no. It is a shade-loving algae that thrives on damp, heavily shaded roofs, which describes most of Greene County. It is a cosmetic problem, not structural, and the fix is a proper low-pressure wash rather than a new roof. We will say so rather than sell you one.",
      },
      {
        question: "A tree came down on the house. Where do I start?",
        answer:
          "Call us first. Tree-on-structure has to be sequenced so removal does not make the roof damage worse, so we help coordinate the removal and the roof protection in the right order, tarp it, and document the whole thing for the claim.",
      },
    ],
  },
];
