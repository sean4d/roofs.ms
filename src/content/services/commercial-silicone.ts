import {
  CloudRain,
  Droplets,
  Ruler,
  Sun,
  TriangleAlert,
  Waves,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Silicone roof coating, its own page (SEO audit, 2026-09-10).
 *
 * WHY THIS IS NOT A DUPLICATE OF /commercial/roof-coatings.
 *
 * The coatings hub answers "should this roof be restored at all", which is a
 * moisture-and-qualification question, and it compares the three chemistries
 * in a paragraph. That is the right page for a facility manager who has not
 * decided anything yet.
 *
 * This page answers a different question from a different searcher: somebody
 * who has already been quoted silicone, or has been told silicone is the
 * answer to their ponding water, and wants to know what the material actually
 * does, what it costs them in trade-offs, and when it is the wrong call. None
 * of that fits on the hub without burying it, and none of the copy below is
 * reused from the hub.
 *
 * Integrity note: silicone's performance claims are product-specific. Every
 * performance sentence here is either a property of the chemistry or is
 * qualified against the manufacturer's data sheet. There are no invented
 * warranty terms, no mil counts presented as ours, and no dollar figures
 * (owner directive 2026-07-30).
 */
export const siliconeRoofCoating: ServiceContent = {
  slug: "silicone-roof-coating",
  path: "/commercial/silicone-roof-coating",
  name: "Silicone Roof Coating",
  metaTitle: "Silicone Roof Coating in Hattiesburg, MS | Southeast Roofing",
  metaDescription:
    "Silicone roof coating on commercial roofs across South Mississippi: how moisture-cure silicone handles ponding water, what it costs you in trade-offs, and when we tell you to use something else.",
  hero: {
    eyebrow: "Commercial roof coatings",
    heading: "Silicone Roof Coating in Hattiesburg, MS",
    headline: "The coating built for water that sits",
    subhead:
      "Silicone is the chemistry people reach for when a low-slope roof drains slowly and the summer sun is doing the rest. It earns that reputation honestly, and it comes with three real drawbacks that any contractor recommending it should tell you about first.",
    chips: [
      "Moisture-cure silicone",
      "Ponding-tolerant",
      "Metal, mod-bit & single-ply",
      "Recoatable in place",
    ],
  },
  intro: {
    title: "What silicone actually is, before anyone quotes you one",
    paragraphs: [
      "A silicone roof coating is a fluid-applied membrane, sprayed or rolled over a roof that is already there, that cures into one seamless sheet with no laps and no fasteners. What separates silicone from the acrylics and urethanes it competes with is how it cures: it reacts with moisture in the air rather than drying by evaporating water out of itself. On the Gulf Coast, where the air is rarely dry, that is a genuinely useful property, and it is the reason silicone shows up in so many South Mississippi proposals.",
      "It is also why silicone is oversold. A material that tolerates standing water gets pitched as a material that fixes drainage, and it does not. A silicone coating over ponding water is still a roof with ponding water, just one whose surface is no longer degrading as quickly. If the ponding is caused by a crushed insulation low spot, a sagging deck, or a drain that sits above the field, the coating buys time on the membrane while the underlying problem keeps going. Worth doing, sometimes exactly the right call, but it should be described accurately when you are asked to sign for it.",
    ],
  },
  sections: [
    {
      title: "Ponding water: what silicone does and does not solve",
      paragraphs: [
        "Most single-ply and modified bitumen membranes are warranted on the assumption that water leaves the roof. Ponding water, water still standing well after the rain stops, is what many manufacturers write exclusions around, because prolonged saturation attacks seams, adhesives and the surfacing. Silicone's advantage is that prolonged water contact is not the thing that degrades it: it does not re-emulsify, and it does not soften the way a water-based coating can when it never gets a chance to fully cure.",
        "What that buys you is a surface that survives the ponding, not a roof that stops ponding. We say this in every coatings walk: if the low spot is fixable, fix the low spot. Adding tapered insulation crickets at a problem area, correcting a drain, or replacing a saturated section costs something now and changes the roof's behaviour permanently. Coating over the low spot costs less and changes the surface. Both are legitimate; they are just not the same purchase, and the proposal should say which one you are getting.",
      ],
      links: [
        {
          label: "How we decide restore vs. replace",
          href: "/commercial/roof-coatings",
        },
        {
          label: "Drainage and detail repairs",
          href: "/commercial/roof-repair",
        },
      ],
    },
    {
      title: "Moisture cure, dew point, and why the schedule is different",
      paragraphs: [
        "Acrylic coatings dry. Water leaves the film, and if rain or heavy dew arrives before that finishes, the film can wash off the roof. Silicone cures instead: humidity in the air is part of the reaction that turns it into a membrane. That inverts a lot of the usual scheduling anxiety, and it is a real advantage in a Mississippi September, when the afternoon storm is on the calendar and the overnight dew is guaranteed.",
        "It does not mean silicone is weatherproof the moment it leaves the sprayer. There is still a window before the surface has skinned over where rain will mar it, humidity and temperature both move how long that window is, and the manufacturer's data sheet is the authority on the number for the product being installed. What it does mean is that the window is usually shorter than the equivalent for a water-based coating, which is why silicone tends to be the one that survives our weather patterns with fewer weather delays and fewer redo days.",
      ],
    },
    {
      title: "The three drawbacks you should hear before you sign",
      paragraphs: [
        "Silicone attracts and holds dirt. The same surface chemistry that sheds water holds onto airborne dust, pollen and the general fallout of a Mississippi summer, and a bright white silicone roof will not stay as bright as it was on day one. The reflectivity that was part of the original pitch declines with that soiling. Washing recovers some of it, and the structural performance of the membrane is unaffected, but a proposal that sells you a cooling number should be honest that the number moves.",
        "Silicone is slick when wet. On a roof with regular service traffic, HVAC units, exhaust fans, anything a technician visits, walk pads are not an optional upgrade. We spec them where traffic exists and we would rather argue about the cost of walk pads now than about a fall later.",
        "Silicone commits the roof to silicone. Very little sticks to cured silicone except more silicone. That is fine while you are recoating, and recoating in place at the end of a term without tearing anything off is one of the genuine long-run advantages of this system. It is not fine if somebody later wants to adhere a single-ply membrane to that roof, because the adhesive will not bond and the silicone has to come off or be covered mechanically. Whoever owns the building in ten years inherits that constraint, so it belongs in the decision now.",
      ],
      bullets: [
        "Dirt pickup reduces reflectivity over time; washing recovers part of it.",
        "Slippery when wet: walk pads on every service route, not just the main path.",
        "Future adhered systems will not bond to cured silicone. Recoating with silicone is the easy path afterwards.",
      ],
    },
    {
      title: "Substrate by substrate: what changes before the spray",
      paragraphs: [
        "Silicone goes over most commercial roof surfaces, and the coating is rarely the hard part. Preparation is, and it is different on every substrate. On metal, the work is rust treatment, backed-out and failed fastener replacement, and detailing every seam and penetration before anything is sprayed over the panel. On modified bitumen and built-up roofs, the granule surface has to be cleaned to the manufacturer's standard, and heavy or loose granules can change the primer requirement. On aged TPO and other single-plies, the field usually needs cleaning and a primer, and manufacturers commonly ask for an adhesion test on the actual roof rather than a promise that the combination works.",
        "The one substrate people forget is silicone itself. A previously coated silicone roof is often the easiest recoat on the list, cleaned, detailed and given a fresh lift, which is exactly the outcome the first coating was supposed to make possible. It only works if the original coating was installed to thickness and the roof underneath stayed dry, which is why the thickness records from the first application matter years later.",
      ],
      table: {
        title: "Preparation by existing roof surface",
        columns: ["Existing roof", "What preparation focuses on"],
        rows: [
          [
            "Metal (R-panel, standing seam)",
            "Rust treatment, fastener replacement, seam and penetration detailing",
          ],
          [
            "Modified bitumen / BUR",
            "Cleaning to spec, granule condition, primer selection for the surfacing",
          ],
          [
            "Aged TPO / PVC / EPDM",
            "Cleaning, primer, and an adhesion test on the actual membrane",
          ],
          [
            "Existing silicone",
            "Wash, re-detail, recoat: usually the simplest of the four",
          ],
        ],
        note: "General practice. The manufacturer's data sheet and any required adhesion test govern the actual scope on your roof.",
      },
      links: [
        {
          label: "Coating options for a metal roof",
          href: "/commercial/metal-roofing",
        },
        { label: "How a TPO system compares", href: "/commercial/tpo" },
      ],
    },
    {
      title: "Solids content, mil thickness, and what the warranty measures",
      paragraphs: [
        "Two silicone products can carry the same price per gallon and put down very different amounts of membrane, because coatings are sold wet and measured dry. A high-solids silicone leaves more cured material behind per gallon than a lower-solids product; the difference is the part that evaporates. Comparing bids on gallons, or on price per gallon, hides that completely. Comparing them on specified dry-film thickness does not.",
        "That number is also what the warranty is keyed to. Manufacturers commonly tie the available term to the product, the substrate, the preparation and the installed dry-film thickness, with the written warranty governing in every case. We measure film thickness during application and put the readings in the closeout file, because in year eight that record is the only thing that proves what was installed, and it is what a recoat gets specified from.",
      ],
      links: [
        {
          label: "What drives a restoration's cost",
          href: "/commercial/roof-coatings",
        },
      ],
    },
    {
      title: "When we tell you to use something else",
      paragraphs: [
        "Silicone is not the default and we do not treat it as one. If the roof drains properly and the goal is reflectivity at the best value, an acrylic often does the same job for less material cost. If the roof takes real foot traffic or abrasion, a urethane's toughness may matter more than water tolerance, and urethane is frequently used as a base layer with a silicone topcoat rather than as a competitor to it. And if the moisture survey finds saturated insulation, or the deck has problems, or the membrane is failing across the field, then no coating is the answer, silicone included, and we will show you the replacement comparison in the same proposal.",
        "The choice is made from the roof, not from a catalogue: how it drains, what walks on it, what is under it, and how long the building needs to keep working. That is a walk and a moisture survey, not a phone quote.",
      ],
      table: {
        title: "Choosing between the three coating chemistries",
        columns: ["", "Silicone", "Acrylic", "Urethane"],
        rows: [
          [
            "Water that sits",
            "Its strongest case",
            "Wants positive drainage",
            "Better than acrylic, usually paired",
          ],
          [
            "Foot traffic and abrasion",
            "Slick when wet; needs walk pads",
            "Moderate",
            "Its strongest case",
          ],
          [
            "Staying clean and reflective",
            "Picks up dirt over time",
            "Holds reflectivity better",
            "Varies by product",
          ],
          [
            "Recoating later",
            "Easy, with silicone",
            "Straightforward",
            "Straightforward",
          ],
          [
            "Adhered work later",
            "Adhesives will not bond to it",
            "Fewer constraints",
            "Fewer constraints",
          ],
        ],
        note: "Generalized traits to frame the first conversation. Performance claims are product-specific and the data sheet governs.",
      },
      links: [
        {
          label: "Compare all three coating chemistries",
          href: "/commercial/roof-coatings",
        },
        {
          label: "When replacement is the honest answer",
          href: "/commercial/roof-replacement",
        },
      ],
    },
  ],
  costFactors: {
    title: "What moves the price of a silicone restoration",
    description:
      "Two roofs of the same square footage rarely price the same. What actually drives it:",
    items: [
      {
        title: "Specified dry-film thickness",
        text: "The warranty term you want sets how much cured material has to go down, which sets the material quantity.",
      },
      {
        title: "Solids content of the product",
        text: "High-solids silicone leaves more membrane per gallon. Gallons are the wrong unit to compare bids in.",
      },
      {
        title: "Existing surface and its condition",
        text: "Rust on metal, granule condition on mod-bit, primer and adhesion testing on single-ply: prep varies enormously.",
      },
      {
        title: "Detail density",
        text: "Curbs, penetrations, drains and walls are brush-and-fabric work, priced by count rather than by area.",
      },
      {
        title: "Moisture findings",
        text: "Wet insulation found by scanning or cores must come out first, or it takes the roof out of the coating conversation.",
      },
      {
        title: "Reinforcement",
        text: "Fabric at seams and transitions, or a fully reinforced field where the spec calls for it, adds material and labour.",
      },
      {
        title: "Walk pads and traffic protection",
        text: "Service routes on a silicone roof need them. Where the units are decides how much.",
      },
      {
        title: "Access and staging",
        text: "Roof height, equipment placement and working around an operating building shape the labour plan.",
      },
    ],
  },
  signs: {
    title: "Signs silicone is worth pricing on your roof",
    items: [
      {
        icon: Waves,
        title: "Water still standing after the rain",
        text: "Slow-draining low spots are the situation silicone handles better than the alternatives.",
      },
      {
        icon: Sun,
        title: "A roof that bakes",
        text: "A reflective finish drops surface temperature on a dark membrane through a Mississippi summer.",
      },
      {
        icon: Droplets,
        title: "Seams and details tired, field still sound",
        text: "Failure concentrated at the details, over a dry assembly, is what restoration is for.",
      },
      {
        icon: CloudRain,
        title: "Weather windows keep killing schedules",
        text: "Moisture-cure chemistry copes with humidity and dew that would stop a water-based coating.",
      },
      {
        icon: Ruler,
        title: "A previous coating that is due",
        text: "A silicone roof installed to thickness and kept dry is usually the easiest recoat on the building.",
      },
      {
        icon: TriangleAlert,
        title: "Capital budget will not carry a tear-off",
        text: "On a roof that qualifies, restoration is the smaller number. On one that does not, it is wasted money.",
      },
    ],
  },
  approach: {
    title: "How a silicone restoration runs",
    steps: [
      {
        title: "Survey and moisture check first",
        text: "Cores and moisture scanning decide whether the roof qualifies at all. Nothing gets coated over wet insulation.",
      },
      {
        title: "Adhesion test where required",
        text: "On single-ply and some coated surfaces the manufacturer wants proof on your roof, not a general assurance.",
      },
      {
        title: "Repair and prepare",
        text: "Wash to spec, treat rust, replace failed fasteners, reinforce seams and detail every penetration and curb.",
      },
      {
        title: "Apply to the specified thickness",
        text: "Sprayed or rolled to the dry-film thickness the warranty requires, with readings taken as the work proceeds.",
      },
      {
        title: "Protect the traffic routes",
        text: "Walk pads on the paths to equipment, because a wet silicone roof is genuinely slippery.",
      },
      {
        title: "Document and register",
        text: "Thickness readings, photos and warranty registration in the closeout file, which is what a future recoat is specified from.",
      },
    ],
  },
  faqs: [
    {
      question: "Does silicone stop ponding water?",
      answer:
        "No. It tolerates it. Silicone does not break down under prolonged water contact the way some other surfaces do, so the membrane survives the standing water, but the water still stands. If the low spot can be corrected with tapered insulation, a drain change or a section replacement, that is a better permanent fix and we will price it alongside.",
    },
    {
      question: "How long does a silicone roof coating last?",
      answer:
        "Warranty terms commonly scale with the product, the preparation and the installed dry-film thickness, and the written warranty governs. What is more useful to plan around is that a silicone system installed to thickness over a dry roof can generally be washed and recoated with silicone at the end of its term, extending the cycle without a tear-off.",
    },
    {
      question: "Will the roof stay bright white?",
      answer:
        "It will not. Silicone holds onto dirt, and reflectivity declines as the surface soils. Washing recovers part of it. The waterproofing performance is not affected, but if the reason you are buying the coating is a cooling number, that number should be discussed as something that moves rather than a fixed figure.",
    },
    {
      question: "Can you coat a metal roof with silicone?",
      answer:
        "Yes, and metal is one of the most common substrates for it. The difference is all in the preparation: rust treatment, replacing backed-out or failed fasteners, and detailing the seams and penetrations before any coating goes down. Skipping that is the usual reason a coated metal roof fails early.",
    },
    {
      question: "Can a silicone roof be covered with a new membrane later?",
      answer:
        "Not with an adhered system, and this is the trade-off worth understanding before you commit. Adhesives will not bond to cured silicone, so a future single-ply would have to be mechanically attached, or the silicone removed. Recoating with silicone stays straightforward, which is why the long-run plan for these roofs is usually recoat rather than cover.",
    },
    {
      question: "Is silicone better than acrylic?",
      answer:
        "For a roof that drains slowly, generally yes. For a roof that drains well and is being coated for reflectivity and value, acrylic often does the job for less material cost and holds its reflectivity better. Neither is a default. The roof's drainage, its traffic and what is under the membrane decide it.",
    },
    {
      question: "How do I compare two silicone bids fairly?",
      answer:
        "Compare specified dry-film thickness, product and preparation scope, not gallons or price per gallon. Coatings are sold wet and measured dry, and a lower-solids product puts less membrane on your roof for the same gallon count. Ask both bidders what dry-film thickness they are quoting and what warranty term that supports.",
    },
    {
      question: "Do you ever recommend against coating?",
      answer:
        "Regularly. If moisture scanning finds saturated insulation, the deck has problems, or the membrane is failing across the field, a coating seals the problem in and wastes the budget. In that case we say so and put the replacement comparison in the same proposal so the decision gets made with the whole picture.",
    },
  ],
  related: [
    {
      label: "Roof Coatings & Restoration",
      href: "/commercial/roof-coatings",
      description:
        "The wider restoration question: does this roof qualify, and which chemistry fits it.",
    },
    {
      label: "Commercial Metal Roofing",
      href: "/commercial/metal-roofing",
      description:
        "Metal is the most common substrate we coat. What the panel itself needs first.",
    },
    {
      label: "Commercial Roof Maintenance",
      href: "/commercial/roof-maintenance",
      description:
        "Washing and inspection are what keep a coated roof performing to its term.",
    },
  ],
};
