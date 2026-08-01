import {
  CalendarClock,
  CloudRain,
  Droplets,
  Fan,
  Home,
  Layers,
  Sun,
  Thermometer,
  TriangleAlert,
  Waves,
  Wind,
} from "lucide-react";

import { projectPhotos, stormPhotos } from "@/content/photos";
import { stockPhotos } from "@/content/stock-photos";
import type { ServiceContent } from "@/content/services/types";

/**
 * Core residential service pages (PRD §4.1, Phase 3). Unique copy per
 * service, no find-and-replace bodies. Every factual claim is either
 * owner-confirmed (GAF certification, MSBOC license, BBB accreditation,
 * GoodLeap partnership, service area) or general roofing knowledge stated
 * qualitatively. No invented prices, warranty terms, or stats (PRD §0.2).
 */

// One completed roof per city, first four cities (owner-verified labels)
const replacementGallery = projectPhotos
  .filter((photo) => photo.kind === "completed")
  .filter(
    (photo, index, all) =>
      all.findIndex((p) => p.citySlug === photo.citySlug) === index,
  )
  .slice(0, 4);

const repairGallery = [
  stormPhotos.find((p) => p.category === "wind-damage"),
  stormPhotos.find((p) => p.category === "hail-damage"),
  stormPhotos.find((p) => p.category === "rotted-decking"),
  stormPhotos.find((p) => p.category === "aged-components"),
].filter((photo) => photo !== undefined);

export const residentialServices: ServiceContent[] = [
  /* ------------------------------------------------------------------ */
  /* Asphalt shingle roofing, the flagship residential system           */
  /* ------------------------------------------------------------------ */
  {
    slug: "asphalt-shingle-roofing",
    path: "/residential/asphalt-shingle-roofing",
    name: "Asphalt Shingle Roofing",
    metaTitle: "GAF Shingle Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "GAF-certified asphalt shingle roofing across South Mississippi. Architectural shingles installed to manufacturer spec: with straight answers on brands, colors, and cost.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Asphalt shingle roofing, installed to spec",
      subhead:
        "Architectural shingles are the workhorse roof of South Mississippi: affordable, storm-capable, and available in styles that fit any home. As a GAF Certified Contractor we install them the way the manufacturer intends, every time.",
      photo: stockPhotos.heroHome,
      photoBadge: "Architectural asphalt shingle roofing",
    },
    intro: {
      title: "The right shingle system for a demanding climate",
      paragraphs: [
        "A shingle roof in South Mississippi works harder than one almost anywhere else: months of high heat and humidity, some of the heaviest annual rainfall in the country, and a hurricane season that runs half the year. The difference between a roof that shrugs that off and one that fails early is rarely the shingle itself. It's the system underneath and the quality of the installation.",
        "That's why we install complete shingle systems, not just shingles: underlayment, ice-and-water protection in valleys and penetrations, drip edge, ridge ventilation, and manufacturer-matched components, fastened to spec. We're a GAF Certified Contractor and also install Owens Corning shingle products, and we'll tell you plainly which line fits your home and budget.",
      ],
    },
    sections: [
      {
        title: "Architectural vs. three-tab: what you're actually choosing",
        paragraphs: [
          "Architectural shingles, also called laminated or dimensional shingles, are the normal replacement product here: two or more layers of asphalt-coated fiberglass mat laminated together for a thicker profile, varied shadow lines, and, on most product lines, stronger wind-warranty options.",
          "Three-tab shingles are the earlier single-layer product: thinner, flatter, uniform. They still fit some rentals, outbuildings, and matching repairs, but they show up less and less on premium replacements.",
        ],
        table: {
          title: "Architectural vs. three-tab at a glance",
          columns: ["", "Architectural (laminated)", "Three-tab"],
          rows: [
            [
              "Construction",
              "Two or more laminated layers on a fiberglass mat",
              "Single flat layer with cut-out tabs",
            ],
            [
              "Appearance",
              "Dimensional, varied shadow lines",
              "Flat, uniform, repeating pattern",
            ],
            [
              "Wind-warranty options",
              "Commonly higher tiers, subject to required accessories and installation",
              "Commonly lower tiers",
            ],
            [
              "Typical use today",
              "The standard for full replacements",
              "Budget projects, outbuildings, matching repairs",
            ],
            [
              "Relative cost",
              "Moderate initial investment",
              "Lower initial investment",
            ],
          ],
          note: "Warranty tiers vary by manufacturer and product line, eligibility depends on required components and correct installation.",
        },
        links: [
          {
            label: "See what a full roof replacement involves",
            href: "/residential/roof-replacement",
          },
          {
            label: "Preview shingle colors on a home like yours",
            href: "/roof-color-visualizer",
          },
        ],
      },
      {
        title: "The layers that make shingles a system",
        paragraphs: [
          "Shingles are only the visible layer of an assembly that works, or fails, as a whole. On many product lines, wind-warranty eligibility depends on installing a required combination of components, not the field shingle alone. From the deck up:",
        ],
        bullets: [
          "Decking: a continuous, solidly supported deck; soft sections replaced before anything new goes down",
          "Underlayment: the water-shedding layer between deck and shingles",
          "Leak barrier: self-adhering membrane in valleys and around penetrations",
          "Starter strips: sealed edge courses at eaves and rakes, the first line of wind resistance",
          "Field shingles. The product you see from the street",
          "Hip and ridge shingles: purpose-made caps, not field shingles bent over the peak",
          "Flashing, metal wherever shingles alone can't seal",
          "Ventilation, balanced intake and exhaust so the attic doesn't cook the shingles from below",
        ],
        links: [
          {
            label: "How attic ventilation protects a shingle roof",
            href: "/residential/ventilation",
          },
        ],
      },
      {
        title: "Slope rules: where shingles can and can't go",
        paragraphs: [
          "Most shingle products require a slope of at least 2:12, two inches of rise per foot of run, because shingles shed water rather than sealing it out. From 2:12 up to (but not including) 4:12, manufacturers commonly require a special low-slope underlayment treatment per the selected product's instructions; standard underlayment commonly begins at 4:12.",
          "Porch roofs, additions, and dormer tie-ins often flatten below the main pitch. A common leak source when a standard shingle assembly runs across them. Below 2:12, we'll recommend a different covering entirely.",
        ],
      },
      {
        title: "Four nails or six, and why placement beats quantity",
        paragraphs: [
          "Standard fastening is commonly four nails per shingle; enhanced wind specifications and steep slopes may require six, and some wind-warranty tiers make six-nail fastening a condition of coverage. Placement beats quantity: nails belong in the marked nailing zone, driven flush: not angled, overdriven, or underdriven.",
          "One caution: some wind warranties advertise no stated maximum wind speed when required accessories are installed. That's a warranty term, not a physics claim, no shingle is immune to blow-off. We install to spec and register what qualifies.",
        ],
      },
      {
        title: "Flashing: valleys, walls, chimneys, and pipes",
        paragraphs: [
          "Ask any repair crew where shingle roofs leak and they'll rarely say \"the shingles.\" It's the transitions: valleys concentrating two planes of water, sidewalls and headwalls where roof meets siding or brick, chimney assemblies, and pipe boots that split in our heat years before the shingles wear out.",
          "On our installs, valleys get leak-barrier membrane, walls get woven step flashing, chimneys get base and counter-flashing, and every penetration gets a new boot, reusing tired flashing under new shingles is a leak waiting to resurface mid-life.",
        ],
      },
      {
        title: "GAF vs. Owens Corning, and what actually decides service life",
        paragraphs: [
          "There's no universal winner between the brands. Both make quality architectural shingles, and the pick usually comes down to color, availability, budget tier, and warranty package. We're a GAF Certified Contractor, which affects the enhanced warranty options we can register on GAF systems; we also install Owens Corning shingle products, though we're not an Owens Corning certified or preferred contractor.",
          'Either way, a "30-year" or "limited lifetime" label describes warranty terms, not a service-life prediction. Real service life here depends on heat, humidity, algae, ventilation, tree cover, storms, and, above all, installation quality. Algae-resistant lines help with black streaking, and steady granule loss in the gutters is the honest sign a roof is winding down.',
        ],
        links: [
          {
            label: "Compare metal and shingles",
            href: "/residential/metal-roofing",
          },
          {
            label: "Repair or replace? How we make the call",
            href: "/residential/roof-repair",
          },
        ],
      },
    ],
    costFactors: {
      title: "What determines your shingle roofing proposal?",
      description:
        "These are the factors we measure before putting a number in writing: never a guess from the street.",
      items: [
        {
          title: "Roof area and pitch",
          text: "Squares of actual roof surface, pitch adds area a floor plan doesn't show and slows production.",
        },
        {
          title: "Complexity of the roof",
          text: "Valleys, hips, dormers, skylights, and penetrations add cutting and flashing time.",
        },
        {
          title: "Tear-off and disposal",
          text: "Existing layers coming off drive labor and haul-off volume.",
        },
        {
          title: "Decking condition",
          text: "Soft decking found at tear-off is photographed, discussed with you, then replaced.",
        },
        {
          title: "Shingle line and warranty tier",
          text: "Enhanced warranty tiers can require specific accessory combinations.",
        },
        {
          title: "Ventilation corrections",
          text: "Intake fixes and ridge vents affect scope, and the roof's service life.",
        },
        {
          title: "Access and stories",
          text: "Multi-story homes and tight lots change staging, safety setup, and crew time.",
        },
      ],
    },
    signs: {
      title: "Signs your shingle roof is asking for attention",
      items: [
        {
          icon: CalendarClock,
          title: "Age is showing",
          text: "Most shingle roofs in our climate deliver 15–25 years of service. If yours is in that window, an inspection tells you where it really stands.",
        },
        {
          icon: Waves,
          title: "Curling or cupping shingles",
          text: "Edges that lift or curl mean the shingles have dried out and lost flexibility: wind grabs them next.",
        },
        {
          icon: Layers,
          title: "Granules in the gutters",
          text: "Heavy granule loss exposes the asphalt underneath to UV, which accelerates aging fast.",
        },
        {
          icon: Wind,
          title: "Missing tabs after storms",
          text: "Even one missing shingle is an open door for water. After a named storm or straight-line winds, get it checked.",
        },
        {
          icon: Droplets,
          title: "Stains on ceilings",
          text: "Interior water spots usually mean the leak has been active for a while. The sooner it's traced, the smaller the repair.",
        },
        {
          icon: Thermometer,
          title: "Attic heat you can feel",
          text: "A cooking attic often signals failed ventilation, which shortens shingle life from the underside.",
        },
      ],
    },
    approach: {
      title: "How we build a shingle roof that lasts here",
      steps: [
        {
          title: "Free inspection & straight assessment",
          text: "We document the condition of your current roof and tell you honestly whether it needs replacement, a repair, or nothing yet.",
        },
        {
          title: "System and color selection",
          text: "We walk you through GAF and Owens Corning lines, styles, and colors: with real samples, not just brochures.",
        },
        {
          title: "Full-system installation",
          text: "Tear-off to the deck, decking repairs where needed, underlayment, flashing, ventilation, and shingles: installed to manufacturer specification.",
        },
        {
          title: "Clean site, final walkthrough",
          text: "Magnetic nail sweep, full debris haul-off, and a walkthrough with you before we call the job done.",
        },
      ],
    },
    materials: {
      title: "Shingle lines we install",
      description:
        "We're certified on GAF systems, our primary recommendation, and also install Owens Corning shingle products.",
      items: [
        {
          title: "Architectural (dimensional) shingles",
          text: "The standard we recommend for most homes: layered profile, strong wind performance, and a deep range of colors.",
        },
        {
          title: "GAF shingle systems",
          text: "Our primary line as a GAF Certified Contractor: shingles, starter strips, ridge caps, and underlayment engineered to work together.",
        },
        {
          title: "Owens Corning products",
          text: "A proven alternative line we install when its style, color, or availability fits your project best.",
        },
      ],
      note: "We recommend based on your roof and budget, not on what we happen to have on the truck. Ask us to compare lines side by side at your estimate.",
    },
    gallery: {
      title: "Recent shingle roofs across the region",
      description:
        "Every photo is a genuine Southeast Roofing project: real homes from Hattiesburg to the Gulf Coast.",
      photos: replacementGallery.map(({ src, alt }) => ({ src, alt })),
    },
    anatomy: true,
    flashingDiagram: true,
    faqs: [
      {
        question: "How long does an asphalt shingle roof last in Mississippi?",
        answer:
          "Typically 15–25 years here, depending on the shingle line, attic ventilation, and storm exposure. Our heat and humidity age shingles faster than northern climates, which is why installation quality and ventilation matter so much.",
      },
      {
        question:
          "What's the difference between 3-tab and architectural shingles?",
        answer:
          "3-tab is a flat, single-layer product with commonly lower wind-warranty tiers; architectural shingles are thicker and laminated, and handle Gulf-region wind better. For most homes here we recommend architectural.",
      },
      {
        question: "Do you install GAF or Owens Corning?",
        answer:
          "Both. GAF is our primary, certified line. We're a GAF Certified Contractor. We also install Owens Corning shingle products when they're the right fit. We'll show you both options with real samples.",
      },
      {
        question: "Can new shingles go over my old ones?",
        answer:
          "Layering over old shingles is sometimes allowed by code, but we almost never recommend it: it hides deck damage, traps heat, voids some manufacturer coverage, and adds weight. A full tear-off lets us fix what's underneath and start clean.",
      },
      {
        question: "Will my homeowner's insurance pay for a new shingle roof?",
        answer:
          "If the damage was caused by a covered event like wind or hail, it may. We document the damage thoroughly and can meet your adjuster on site. The decision always rests with your insurer, but you won't navigate it alone.",
      },
      {
        question: "Can shingles go on my low-slope porch roof?",
        answer:
          "It depends on the pitch. Most shingle products require at least 2:12, with special low-slope underlayment commonly required from 2:12 up to 4:12. Below 2:12, shingles aren't designed to work. We'll recommend an appropriate low-slope covering for that section instead.",
      },
      {
        question: "What are the black streaks running down my shingles?",
        answer:
          "Usually algae, which thrives in our humidity. It's mostly cosmetic in the near term, but it's why we typically recommend algae-resistant lines with copper-bearing granules here. Skip the pressure washer. It strips granules and shortens the roof's life.",
      },
    ],
    related: [
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description:
          "What a full replacement involves, how long it takes, and how we keep it painless.",
      },
      {
        label: "Residential Metal Roofing",
        href: "/residential/metal-roofing",
        description:
          "Comparing shingle to metal? See what standing seam and metal panels offer.",
      },
      {
        label: "Ventilation",
        href: "/residential/ventilation",
        description:
          "The unsung system that decides how long your new shingles actually last.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Roof replacement, the process page                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-replacement",
    path: "/residential/roof-replacement",
    name: "Roof Replacement",
    metaTitle: "Roof Replacement in Hattiesburg, MS | Southeast Roofing",
    metaDescription:
      "Full residential roof replacement, done in as little as one to two days once materials arrive. Free inspection, honest recommendation, clean job site: Southeast Roofing.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Roof replacement without the runaround",
      subhead:
        "A full replacement is the biggest roofing decision a homeowner makes. We keep it simple: a free inspection, a straight recommendation, a clear price, and a crew that treats your property like their own.",
      photo: stockPhotos.roofTearOff,
      photoBadge: "Shingle tear-off in progress",
    },
    intro: {
      title: "When repair stops making sense, we say so",
      paragraphs: [
        "Not every aging roof needs replacing, and we'll tell you when yours doesn't. But when leaks keep coming back, shingles are failing across whole slopes, or storm damage runs deeper than the surface, continuing to patch becomes the expensive option. That's when a full replacement earns its place: stopped leaks, restored insurability, and a couple of decades of not thinking about your roof.",
        "Most of our residential replacements are completed in one to two days once materials arrive. We handle everything: permits where required, tear-off and haul-off, decking repairs, the full new system, and a final walkthrough with a magnetic sweep of your yard for nails.",
        "If a storm is what brought you here, we also handle the insurance side: thorough documentation, reports in the format adjusters expect, and on-site adjuster meetings when needed.",
      ],
    },
    sections: [
      {
        title: "Before the crew arrives: measurement, proposal, permits",
        paragraphs: [
          "A replacement starts on paper: a full-system inspection, measurements, and a written proposal that itemizes tear-off, decking allowance, underlayment, flashing, ventilation, the covering, and cleanup. Roofs are measured in squares, one square is 100 square feet of roof surface, and squares measure the roof, not the floor plan: pitch adds area, and hips, valleys, and dormers add cutting waste beyond the raw measurement.",
          "Once you've picked the system and color, we handle permit review where your municipality requires one, order materials, and schedule delivery. Weather gets a vote. We won't tear off ahead of a system we can't dry in, so a forecast shift can move your date. We'd rather reschedule than gamble with your interior.",
        ],
        links: [
          { label: "Request your free estimate", href: "/estimate" },
          {
            label: "See financing options through GoodLeap",
            href: "/financing",
          },
        ],
      },
      {
        title: "Getting your home ready",
        paragraphs: [
          "Tear-off day is loud, and the house shakes more than you'd think. A few minutes of preparation the evening before makes the day go smoothly:",
        ],
        bullets: [
          "Cover or move loose items in the attic: dust sifts through the deck boards during tear-off",
          "Move vehicles out of the garage and driveway before the crew arrives",
          "Satellite dishes usually need realignment by your provider after reinstallation",
          "Point out HVAC line sets, low wires, and anything fragile along the eaves",
          "Keep pets indoors or off-site, tear-off is loud, and gates get opened repeatedly",
          "Leave driveway access clear for the dump trailer and material delivery",
        ],
      },
      {
        title: "Tear-off, deck inspection, and change orders",
        paragraphs: [
          "We protect the property first, tarps over landscaping and against walls, then strip the roof to the deck. That's what separates a replacement from an overlay: with the old roofing gone, we can actually see the decking and fix what's wrong with it.",
          "It's also the honest limit of any estimate: hidden deck damage can't be fully known before tear-off. Your proposal spells out how decking is handled; if we find rot beyond the allowance, we photograph it and talk with you before proceeding: no surprise line items after the fact.",
        ],
      },
      {
        title: "Dry-in and the new system",
        paragraphs: [
          "With the deck sound, the system goes down in order: underlayment, self-adhering leak barrier in valleys and around penetrations, drip edge, new flashing at walls and chimneys, the ventilation the attic needs, then the covering, fastened to the manufacturer's specification. Most homes are done in one to two days once materials arrive; complex or multi-story roofs can run longer.",
          "We finish with debris haul-off, a magnetic nail sweep of the yard and driveway, and a final walkthrough with you. Where the selected system qualifies, we complete the manufacturer warranty registration; if insurance was involved, we supply the documentation your carrier's file needs.",
        ],
      },
      {
        title: "Choosing what goes back on",
        paragraphs: [
          "A replacement is the one moment to rethink the system itself, not just the color. Most of ours are architectural shingle, but standing seam and exposed-fastener metal both earn their place on the right house:",
        ],
        table: {
          title: "Replacement systems compared",
          columns: ["System", "Relative cost", "Strengths", "Trade-offs"],
          rows: [
            [
              "Architectural shingles",
              "Lower initial investment",
              "Widest color range, fast install, easiest to repair and match later",
              "Commonly shorter planning range than metal in our climate",
            ],
            [
              "Exposed-fastener metal",
              "Moderate initial investment",
              "Durable panels at a working-budget price",
              "Gasketed screws need periodic inspection over the roof's life",
            ],
            [
              "Standing seam metal",
              "Higher initial investment",
              "Concealed fasteners, clean lines, long planning range",
              "Fewer qualified installers; panel repairs are more involved",
            ],
          ],
          note: "Service life is project-specific. It depends on the product, the assembly, ventilation, and exposure, not the category alone.",
        },
        links: [
          {
            label: "Explore our shingle systems",
            href: "/residential/asphalt-shingle-roofing",
          },
          {
            label: "Residential standing seam details",
            href: "/residential/metal-roofing/standing-seam",
          },
          {
            label: "Exposed-fastener metal explained",
            href: "/residential/metal-roofing/exposed-fastener",
          },
        ],
      },
    ],
    costFactors: {
      title: "Factors that affect project pricing",
      description:
        "No two replacements price the same, because no two roofs are the same. Here's what moves the number on your written proposal.",
      items: [
        {
          title: "Squares and pitch",
          text: "Total roof surface, not floor area, sets material quantity; steeper pitches slow production.",
        },
        {
          title: "Stories and access",
          text: "Second stories, tight lots, and long carries add handling and staging time.",
        },
        {
          title: "Layers coming off",
          text: "Each existing layer multiplies tear-off labor and disposal weight.",
        },
        {
          title: "Decking replacement scope",
          text: "Hidden rot found at tear-off is documented, discussed, and priced transparently.",
        },
        {
          title: "The system you choose",
          text: "Shingle line, metal profile, and warranty tier each carry their own requirements.",
        },
        {
          title: "Roof features",
          text: "Chimneys, skylights, valleys, and dormers take flashing and detail time a plain gable doesn't.",
        },
        {
          title: "Ventilation and code items",
          text: "Intake corrections, ridge vents, and code-required drip edge are part of doing it right.",
        },
        {
          title: "Permits and disposal",
          text: "Permit requirements and dump fees vary across our service area.",
        },
      ],
    },
    signs: {
      title: "Signs it's replacement time, not repair time",
      items: [
        {
          icon: Droplets,
          title: "Leaks in multiple places",
          text: "One leak is a repair. Leaks in several rooms usually mean the system as a whole is done.",
        },
        {
          icon: CalendarClock,
          title: "20+ years on the clock",
          text: "At that age in our climate, individual repairs are patches on a failing system.",
        },
        {
          icon: Layers,
          title: "Widespread shingle failure",
          text: "Curling, cracking, or bald shingles across whole sections: not just isolated spots.",
        },
        {
          icon: Wind,
          title: "Major storm damage",
          text: "When wind or hail damage covers a large area, insurers and manufacturers both favor replacement.",
        },
        {
          icon: Waves,
          title: "A sagging roofline",
          text: "Visible dips can mean deck or structural moisture damage, have it inspected promptly.",
        },
        {
          icon: TriangleAlert,
          title: "Repairs that keep coming back",
          text: "If you're calling a roofer every year, the math has already flipped toward replacement.",
        },
      ],
    },
    approach: {
      title: "What a replacement with us looks like",
      description:
        "From first call to final walkthrough, you'll always know what happens next.",
      steps: [
        {
          title: "Free inspection & documentation",
          text: "We inspect the full system: shingles, flashing, decking, ventilation, and photograph everything we find.",
        },
        {
          title: "A recommendation you can trust",
          text: "Repair or replace, in writing, with a clear price. If insurance applies, we help you through the claim.",
        },
        {
          title: "Materials & scheduling",
          text: "You pick the system and color; we order materials and schedule the build. Most homes take one to two days.",
        },
        {
          title: "Tear-off and deck check",
          text: "Old roofing comes off completely so we can inspect and repair the decking before anything new goes down.",
        },
        {
          title: "Full-system installation",
          text: "Underlayment, valley and penetration protection, flashing, ventilation, and your new roof: installed to manufacturer spec.",
        },
        {
          title: "Cleanup & walkthrough",
          text: "Debris hauled off, magnetic nail sweep of your yard and drive, and a final walkthrough with you.",
        },
      ],
    },
    gallery: {
      title: "Replacements we've completed recently",
      description:
        "Real Southeast Roofing projects: from Hattiesburg and Petal to Jackson and the Coast.",
      photos: projectPhotos
        .filter((photo) => photo.kind === "completed")
        .filter(
          (photo, index, all) =>
            all.findIndex((p) => p.citySlug === photo.citySlug) === index,
        )
        .slice(4, 8)
        .map(({ src, alt }) => ({ src, alt })),
    },
    anatomy: true,
    faqs: [
      {
        question: "How long does a roof replacement take?",
        answer:
          "Most residential replacements are completed in one to two days once materials arrive, depending on the size and complexity of the roof. We give you a schedule with your estimate and keep you posted if weather shifts it.",
      },
      {
        question: "How much does a new roof cost?",
        answer:
          "It depends on the size, pitch, and complexity of your roof and the system you choose, which is why we quote from an actual inspection instead of guessing. The inspection and estimate are free, and financing through GoodLeap is available.",
      },
      {
        question: "Do I need to be home during the work?",
        answer:
          "No. Most homeowners aren't. We confirm access and details ahead of time, and we're reachable throughout the day. You'll walk the finished job with us before we consider it complete.",
      },
      {
        question: "What if it rains in the middle of the job?",
        answer:
          "We plan around it. We never tear off more roof than we can dry in the same day, and the underlayment and leak-barrier stage is designed to shed rain until the covering goes on. If a system moves in early, the roof gets tarped and secured, an in-progress roof with us is never an open roof.",
      },
      {
        question: "What happens if you find rotten decking?",
        answer:
          "We repair or replace it before installing the new system, that's the point of a full tear-off. We photograph what we find and talk to you before doing work beyond the estimate.",
      },
      {
        question: "Will you help with my insurance claim?",
        answer:
          "Yes. If storm damage is behind your replacement, we document everything, provide the reports your insurer needs, and can meet the adjuster at your home. The decision is your insurer's, but the documentation will be thorough.",
      },
      {
        question: "What happens to my landscaping and yard?",
        answer:
          "We protect it. Tarps catch tear-off debris, materials are staged carefully, and we finish with a full cleanup and magnetic nail sweep of your yard, beds, and driveway.",
      },
    ],
    related: [
      {
        label: "Asphalt Shingle Roofing",
        href: "/residential/asphalt-shingle-roofing",
        description:
          "The shingle systems we install, and how to choose between GAF and Owens Corning lines.",
      },
      {
        label: "Residential Metal Roofing",
        href: "/residential/metal-roofing",
        description:
          "Replacing anyway? It's the right moment to consider a metal system.",
      },
      {
        label: "Insurance Claims",
        href: "/storm-damage/insurance-claims",
        description:
          "How we document storm damage and support your claim from inspection to build.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Roof repair                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-repair",
    path: "/residential/roof-repair",
    name: "Roof Repair",
    metaTitle: "Roof Repair in Hattiesburg, MS | Southeast Roofing",
    metaDescription:
      "Roof leak and storm damage repair across South Mississippi. We find the real source, fix it right, and tell you honestly when a repair is all you need.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Repairs that fix the cause, not just the drip",
      subhead:
        "Water is sneaky. Where it shows up inside is rarely where it got in. We trace leaks to their true source, repair them properly, and tell you honestly when a repair is all your roof needs.",
      photo: stockPhotos.rooferInstalling,
      photoBadge: "Shingle repair work",
    },
    intro: {
      title: "A good repair starts with a real diagnosis",
      paragraphs: [
        "South Mississippi roofs take a beating in short bursts: an afternoon thunderstorm with straight-line winds, a hail cell, a branch down in a tropical system. The damage is often local: a run of missing shingles, torn flashing around a chimney, a punctured valley. Caught early, these are modest repairs. Left alone through a wet season, they become decking rot, insulation damage, and interior stains.",
        "Our repair visits start the same way as everything we do: an inspection that documents what's actually wrong. Then we fix the source, matching materials to your existing roof as closely as supply allows, and show you photos of the finished work. And if what we find genuinely calls for replacement instead, we'll show you why and let the evidence speak.",
      ],
    },
    sections: [
      {
        title: "The usual suspects: where leaks actually start",
        paragraphs: [
          "The shingle field itself is rarely the problem. It's the details where materials meet, age, or move:",
        ],
        bullets: [
          "Pipe boots: the rubber collars split in our heat, often years before the shingles fail",
          "Chimney flashing: failed base, counter, or cricket flashing",
          "Sidewall and headwall flashing: where a roof plane dies into a wall",
          "Valleys, concentrated flow finds any puncture, nail, or worn spot",
          "Missing or wind-creased shingles. A creased shingle can leak even while still on the roof",
          "Nail pops: backed-out nails that tent the shingle above",
          "Skylights and satellite-mount penetrations",
          "Ridge caps and exposed accessory fasteners",
          "Transitions to low-slope porch or addition roofs, where a shingle assembly runs out of slope",
          "Clogged gutters and rotted fascia backing water up under the roof edge",
          "Attic condensation, moisture that mimics a leak but comes from inside the house",
        ],
      },
      {
        title: "Why the ceiling stain isn't the leak",
        paragraphs: [
          "Water almost never drops straight down from its entry point: it rides the decking, follows a rafter, tracks the underlayment, and lets go at a seam or low spot, often many feet from where it got in. That's why chasing a leak from the stain alone fails, and why the same stain comes back after fixes that patched the wrong spot.",
          "Our diagnosis works from both sides: the details upslope of the stain on the roof, and the water trail on decking and framing in the attic, including telling true leaks from condensation, which needs an airflow fix, not a roofing one. We photograph before and after.",
        ],
        links: [
          {
            label: "Schedule a free roof inspection",
            href: "/free-inspection",
          },
        ],
      },
      {
        title: "Tarps, sealant, and what counts as a permanent repair",
        paragraphs: [
          "A tarp is triage, not treatment: it stops active damage and buys time, that's what our emergency line is for. But a tarp left on for months does its own damage, so it always comes with a plan for the permanent repair behind it.",
          'The same goes for sealant. A bead over a split boot or lifted flashing reads as "fixed" for a season or two, then fails, sealant alone is a temporary measure in most applications. A permanent repair replaces the failed component: a new boot, new step flashing, shingles woven into the field, decking swapped where it\'s soft.',
        ],
        links: [
          {
            label: "Storm damage? Start here",
            href: "/storm-damage",
          },
        ],
      },
      {
        title: "Repair or replace: a decision aid",
        paragraphs: [
          "Roof area alone can't answer this, a small roof with widespread failure needs replacing; a large roof with one bad boot needs a repair. What matters is the pattern of failure and how much sound life remains around it:",
        ],
        table: {
          title: "What we find, and what it usually means",
          columns: ["What we find", "Usual call", "Why"],
          rows: [
            [
              "One failed detail (boot, flashing, a few shingles)",
              "Repair",
              "The surrounding roof has life left; fix the component",
            ],
            [
              "Wind or hail damage confined to part of the roof",
              "Repair: often with an insurance claim",
              "Commonly a covered peril; we document it either way",
            ],
            [
              "Shingles too brittle to lift without cracking",
              "Replacement conversation",
              "Repairs need shingles to flex; brittle fields break faster than they mend",
            ],
            [
              "Leaks recurring in multiple rooms or slopes",
              "Replacement conversation",
              "Patching system-wide failure costs more over a few seasons",
            ],
            [
              "Second or third repair call in a couple of years",
              "Replacement conversation",
              "Recurring repairs are usually the system telling you it's done",
            ],
            [
              "Newer roof with one botched detail",
              "Repair",
              "Fix the detail, keep the roof",
            ],
          ],
          note: "A decision aid, not a diagnosis: the free inspection answers it for your actual roof, with photos.",
        },
        links: [
          {
            label: "What a full replacement involves",
            href: "/residential/roof-replacement",
          },
        ],
      },
      {
        title: "The honest limits of a repair",
        paragraphs: [
          "Two things we'd rather you hear up front. First, brittleness: repairs require lifting the surrounding shingles, and heat-aged shingles can crack when lifted: on a brittle field a small repair can grow, and we'll warn you before we start.",
          "Second, color: shingles weather and manufacturers retire colors. We match as closely as supply allows, but a fresh patch on an older field may read slightly different at first, fading toward the rest over time.",
        ],
      },
    ],
    costFactors: {
      title: "What we evaluate before quoting a repair",
      description:
        "Repairs can't be priced by roof size. A small fix on a steep two-story roof can involve more than a bigger one on a walkable ranch.",
      items: [
        {
          title: "Diagnostic time",
          text: "Tracing water to its true entry point is the part that makes the repair stick.",
        },
        {
          title: "Access and pitch",
          text: "Steep slopes, second stories, and tight access change safety setup and time.",
        },
        {
          title: "Material compatibility",
          text: "Matching your shingle line and color, or fabricating flashing to fit the detail.",
        },
        {
          title: "Size of the affected area",
          text: "A few shingles is one scope; a wind-stripped slope section is another.",
        },
        {
          title: "Flashing fabrication",
          text: "Chimneys and wall transitions often need custom-bent metal.",
        },
        {
          title: "Decking and interior damage",
          text: "Long-running leaks can rot decking below the surface repair.",
        },
        {
          title: "Emergency timing",
          text: "After-hours tarping mobilizes differently than a scheduled visit.",
        },
        {
          title: "Number of trips",
          text: "Some repairs need a stabilization visit plus a follow-up with matched materials.",
        },
      ],
    },
    signs: {
      title: "Signs you need a roof repair now",
      items: [
        {
          icon: Droplets,
          title: "Water stains or drips inside",
          text: "Ceiling spots, wet attic insulation, or drips during rain. The leak is established and growing.",
        },
        {
          icon: Wind,
          title: "Shingles in the yard",
          text: "After any wind event, shingles on the ground mean open spots on the roof.",
        },
        {
          icon: TriangleAlert,
          title: "Hail strikes",
          text: "Bruised shingles and dented vents after hail may not leak yet, but they will, and they're time-sensitive for insurance.",
        },
        {
          icon: Layers,
          title: "Damaged flashing",
          text: "Rusted, lifted, or missing flashing around chimneys, walls, and valleys is the most common leak source we find.",
        },
        {
          icon: CloudRain,
          title: "Tree contact",
          text: "A limb strike, even one that 'just brushed' the roof, can crack shingles and puncture underlayment.",
        },
        {
          icon: Sun,
          title: "Cracked seals and boots",
          text: "The rubber boots around pipes and vents dry out in our heat and split years before the shingles fail.",
        },
      ],
    },
    approach: {
      title: "How we handle repairs",
      steps: [
        {
          title: "Inspect and trace",
          text: "We find where water is actually entering, not just where it shows, and document it with photos.",
        },
        {
          title: "Stabilize if needed",
          text: "If weather is incoming or the opening is active, we tarp and protect first, then schedule the permanent fix.",
        },
        {
          title: "Repair the source",
          text: "Shingles, flashing, boots, valleys, or decking: repaired with materials matched to your roof.",
        },
        {
          title: "Show our work",
          text: "You get photos of the completed repair and a straight answer on the rest of the roof's condition.",
        },
      ],
    },
    gallery: {
      title: "The damage we repair every week",
      description:
        "Real inspection photos from South Mississippi roofs: wind, hail, tree, and storm damage.",
      photos: repairGallery.map(({ src, alt }) => ({ src, alt })),
    },
    faqs: [
      {
        question: "How do I know if I need a repair or a full replacement?",
        answer:
          "Localized damage on a roof with life left in it is a repair; widespread failure, chronic leaks, or storm damage across slopes points to replacement. Our free inspection answers it with photo evidence, and we'll recommend the less expensive path when it's genuinely enough.",
      },
      {
        question: "Can you match my existing shingles?",
        answer:
          "Usually close, sometimes exactly. It depends on the age and availability of your shingle line, colors weather over time, so even an exact product match may read slightly different at first. We'll show you the closest options before we start.",
      },
      {
        question: "My roof is leaking right now. What should I do?",
        answer:
          "Contain the water inside (buckets, move belongings, poke a small drain hole in a bulging ceiling spot), stay off the roof, and call us. If the opening is active we can tarp it to stop the damage, then complete the permanent repair.",
      },
      {
        question: "Is storm damage repair covered by insurance?",
        answer:
          "Wind, hail, and falling-tree damage are commonly covered perils under homeowner policies. We document the damage thoroughly and support your claim, and if the damage is too minor to be worth a claim, we'll tell you that too.",
      },
      {
        question: "Do you repair roofs you didn't install?",
        answer:
          "All the time. Most of our repair work is on roofs installed by someone else: including out-of-town crews that are long gone.",
      },
      {
        question: "Why does my roof only leak in certain storms?",
        answer:
          "Direction and intensity. Wind-driven rain pushes water uphill under flashing and shingle edges that shed gentle rain just fine, so a leak that only appears in wind-driven storms is a real clue about where the failure sits. Tell us the pattern: it shortens the diagnosis.",
      },
      {
        question: "My roof is only a few years old. Can it really be leaking?",
        answer:
          "Yes, age protects the shingle field, not the details. A mis-flashed chimney or a nail through the wrong spot can leak from year one on an otherwise sound roof. The fix is usually a targeted repair of that detail, not a new roof.",
      },
    ],
    related: [
      {
        label: "Emergency Roofing",
        href: "/storm-damage/emergency-roofing",
        description:
          "Active leak or storm opening? Tarping and rapid response come first.",
      },
      {
        label: "Storm Damage",
        href: "/storm-damage",
        description:
          "Hail, wind, and hurricane-season damage: how the response and claim process works.",
      },
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description:
          "When repairs stop making sense, here's what a straightforward replacement looks like.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Gutters                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "gutters",
    path: "/residential/gutters",
    name: "Seamless Gutters",
    metaTitle: "Seamless Gutters in Hattiesburg, MS | Southeast Roofing",
    metaDescription:
      "Seamless gutters custom-formed on site and sized for South Mississippi rainfall: installation, replacement, and repair from Southeast Roofing in Hattiesburg.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Seamless gutters, built for Gulf-region rain",
      subhead:
        "Custom-formed on site in continuous runs, no seams to split, no joints to drip. South Mississippi gets some of the heaviest rainfall in the country, and seamless gutters are what stand between that water and your fascia, walls, and foundation.",
      photo: {
        src: "/images/services/seamless-gutter-installation.webp",
        alt: "New white seamless metal gutter and downspout on a home",
      },
      photoBadge: "Seamless gutters",
    },
    intro: {
      title: "The system that protects everything below the roof",
      paragraphs: [
        "A roof sheds water; gutters decide where it goes. When they're undersized, clogged, or pulling away from the fascia, every heavy storm pours water against your eaves, behind your walls, and into the soil at your foundation. In a climate where multi-inch rain days are routine, that adds up to rotted fascia boards, stained brick, washed-out beds, and settlement cracks.",
        "Because we're a roofing company first, we look at gutters as part of the roof system: sized to your actual roof area and pitch, hung with the right fall toward downspouts, and integrated correctly with drip edge and flashing. Replacing your roof? That's the ideal moment to evaluate the gutters too, and we'll give you an honest read on whether yours can stay.",
      ],
    },
    sections: [
      {
        title: "Five-inch or six-inch: sizing to the roof, not habit",
        paragraphs: [
          "Most homes here carry 5-inch K-style gutters, and on modest roof planes that's fine. But South Mississippi rainfall isn't modest. On large planes, steep pitches, and runs that catch a valley's discharge, the step up to 6-inch is often the difference between a system that keeps up and one that sheets over the front edge in every summer downpour.",
        ],
        table: {
          title: "5-inch vs. 6-inch K-style at a glance",
          columns: ["", "5-inch K-style", "6-inch K-style"],
          rows: [
            [
              "Capacity",
              "Handles typical roof planes in moderate rain",
              "Meaningfully more water per foot of run",
            ],
            [
              "Common downspout pairing",
              "2x3-inch downspouts",
              "3x4-inch downspouts",
            ],
            [
              "Best fit",
              "Smaller planes, shallower pitches",
              "Large or steep planes, valley discharge points, heavy tree debris",
            ],
            [
              "Debris behavior",
              "Clogs faster under pine straw load",
              "More open channel, though guards still earn their keep",
            ],
            [
              "Relative cost",
              "Lower initial investment",
              "Moderate initial investment",
            ],
          ],
          note: "We size from your roof's measured area, pitch, and valley layout, not from what's on the truck.",
        },
      },
      {
        title: "Downspouts do the heavy lifting",
        paragraphs: [
          "The gutter only holds water, downspouts move it. A 2x3-inch and a 3x4-inch downspout are very different drains, and count and placement matter as much as size. A long run served by one undersized downspout overflows in heavy rain no matter how big the gutter is; upsizing the gutter without fixing the downspouts just builds a bigger bathtub.",
          "We place outlets where water actually concentrates, valley discharge points, the low end of each run, and finish the path to the ground with splash blocks or a clean handoff into underground drainage where the lot needs it.",
        ],
      },
      {
        title: "Roof geometry decides how much water arrives",
        paragraphs: [
          "Two houses with identical gutter footage can put wildly different demands on them. What matters is the roof area draining to each run, how fast the pitch delivers it, and where valleys concentrate it. A valley can aim the collected flow of two planes at a single point on one run, which is why we so often find overflow damage right below one.",
          'Add the local conditions: multi-inch rain days, pine straw matting in the channel and shrinking its capacity, and "standard gutters, standard spacing" stops being a plan. We walk the roof, map where the water goes, and size each run for its actual load.',
        ],
      },
      {
        title: "Slope, hangers, and the edge details that decide everything",
        paragraphs: [
          "Seamless gutters are roll-formed on site in continuous lengths, so the only joints are fabricated ones: outlets, end caps, and corner miters. Each sealed as it's assembled. Every run hangs with consistent fall toward its downspout; a back-pitched gutter holds standing water and rots the fascia behind it.",
          "Runs hang on hidden hangers screwed into solid wood, spaced per the hanger manufacturer's requirements and tightened up in higher-load areas. There's no single universal spacing number. Just as important: sound fascia to bite into, and drip edge or a gutter apron directing water into the channel instead of behind it.",
        ],
        links: [
          {
            label: "Fascia rot behind gutters, explained",
            href: "/residential/fascia",
          },
        ],
      },
      {
        title: "Repair, re-hang, or replace",
        paragraphs: [
          "Not every failing system needs replacing: sound seamless metal that's sagging or back-pitched can be re-hung with corrected fall, and leaking miters resealed. Sectional gutters, short pieces with a seam every few feet, are a different story: each seam is a future drip, and resealing them is a treadmill. Rusted-through or hail-crushed metal earns the honest recommendation: seamless replacement.",
          "Whatever we install, gutters under South Mississippi pines need channels and downspouts checked seasonally, or a leaf guard fitted so the checking mostly goes away.",
        ],
        links: [
          {
            label: "Compare leaf guard options for pine straw",
            href: "/residential/leaf-guard",
          },
        ],
      },
    ],
    costFactors: {
      title: "What drives the cost of a gutter project",
      description:
        "Gutter work is quoted by the project, not a flat rate per house.",
      items: [
        {
          title: "Total footage and layout",
          text: "Linear feet and the number of separate runs, each needing its own slope and outlet.",
        },
        {
          title: "Gutter and downspout size",
          text: "5-inch versus 6-inch profiles and 2x3 versus 3x4 downspouts, sized to your roof.",
        },
        {
          title: "Corners and terminations",
          text: "Miters, end caps, and outlets are the fabricated, sealed points that take time.",
        },
        {
          title: "Stories and access",
          text: "Second-story eaves and tight side yards change ladder work and staging.",
        },
        {
          title: "Fascia condition",
          text: "Gutters need solid wood to hang on, soft fascia gets addressed first.",
        },
        {
          title: "Old system removal",
          text: "Tear-off and haul-away of the existing gutters, and repair of what they hid.",
        },
        {
          title: "Drainage handoff",
          text: "Splash blocks are simple; tying into underground drainage is its own scope.",
        },
        {
          title: "Leaf guard add-on",
          text: "Guard protection appears as its own line on the itemized proposal.",
        },
      ],
    },
    signs: {
      title: "Signs your gutters aren't keeping up",
      items: [
        {
          icon: Waves,
          title: "Overflow in heavy rain",
          text: "Sheets of water over the gutter edge mean undersized or clogged runs.",
        },
        {
          icon: TriangleAlert,
          title: "Sagging or separation",
          text: "Gutters pulling off the fascia are usually a sign of failed hangers, or rotted wood behind them.",
        },
        {
          icon: Droplets,
          title: "Rot and stains at the eaves",
          text: "Peeling paint, dark streaks, or soft fascia boards point to chronic overflow.",
        },
        {
          icon: CloudRain,
          title: "Trenches in your beds",
          text: "Erosion lines under the roof edge mean water is bypassing the gutters entirely.",
        },
        {
          icon: Home,
          title: "Water at the foundation",
          text: "Pooling against the slab or crawlspace moisture often traces straight back to gutter failure.",
        },
        {
          icon: Layers,
          title: "Rust, holes, and split seams",
          text: "Older gutters fail at the joints first, patching buys time, but not much in our rainfall.",
        },
      ],
    },
    approach: {
      title: "How we approach gutter work",
      steps: [
        {
          title: "Assess the whole water path",
          text: "Roof area, valleys, and pitch determine how much water your gutters must move: we size from that, not habit.",
        },
        {
          title: "Repair or replace honestly",
          text: "Re-hanging, re-pitching, and resealing can rescue a decent system; we'll tell you when that's enough.",
        },
        {
          title: "Install with the roof in mind",
          text: "Correct integration with drip edge and flashing, solid hanger spacing, and downspouts placed to actually move water away.",
        },
        {
          title: "Leave it working",
          text: "We water-test the runs, check the fall, and haul off the old material.",
        },
      ],
    },
    materials: {
      title: "Options & add-ons",
      description:
        "Every gutter project is configured to your roof, and protected for good if you want it to be.",
      items: [
        {
          title: "Seamless K-style runs",
          text: "Formed on site in continuous lengths, no mid-run seams to split and drip.",
        },
        {
          title: "Oversized gutters & downspouts",
          text: "For big or steep roof planes that overwhelm standard sizing in Gulf-region rain.",
        },
        {
          title: "Leaf guard add-on",
          text: "Close the system to pine straw and leaves while it stays open to water, and retire the ladder. Ask for it on your gutter quote.",
        },
        {
          title: "Color-matched finish",
          text: "Gutter and downspout colors matched to your trim and fascia.",
        },
      ],
      note: "Leaf guard protection can be added to your new gutters in the same visit. It appears as its own line on your itemized proposal, so you decide with the real number in front of you.",
    },
    faqs: [
      {
        question: "Should I replace gutters when I replace my roof?",
        answer:
          "It's the most economical time to do it. The crews and equipment are already there, and new drip edge integrates cleanly with new gutters. But if your existing gutters are sound, we'll say so and work around them carefully.",
      },
      {
        question: "What size gutters do I need?",
        answer:
          "It depends on your roof's area and pitch. Given South Mississippi rainfall intensity, many homes benefit from larger 6-inch gutters and oversized downspouts on big or steep roof planes. We calculate it from your actual roof rather than defaulting to the minimum.",
      },
      {
        question: "Do you repair gutters or only replace them?",
        answer:
          "Both. Re-pitching runs, replacing hangers, sealing seams, and swapping damaged sections are all routine repairs, when the metal itself is sound, repair is the right call.",
      },
      {
        question: "Can gutters be damaged by storms like a roof can?",
        answer:
          "Yes: hail dents them, wind-blown debris crushes them, and falling limbs tear them off. Gutter damage is commonly included in the same insurance claims as roof damage, and we document both together.",
      },
      {
        question: "What's the difference between drip edge and a gutter apron?",
        answer:
          "Both are edge flashings that direct water into the gutter instead of behind it. Drip edge is the L-shaped profile at eaves and rakes; a gutter apron has a longer leg that reaches down over the gutter's back, useful where water has been tracking behind it. Missing or short edge metal is one of the most common causes of rotted fascia we find.",
      },
      {
        question: "If seamless gutters have no seams, where can they leak?",
        answer:
          "At the fabricated points: end caps, corner miters, and downspout outlets, plus anywhere the run loses its slope and holds standing water. That's why those joints get sealed at assembly and why we water-test the runs before we leave.",
      },
    ],
    related: [
      {
        label: "Leaf Guard Systems",
        href: "/residential/leaf-guard",
        description:
          "The add-on that keeps your new gutters clog-free for good.",
      },
      {
        label: "Fascia Replacement",
        href: "/residential/fascia",
        description:
          "New gutters deserve sound boards to hang on. We fix both.",
      },
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description:
          "Pairing gutters with a new roof gets both systems integrated correctly.",
      },
    ],
  },

  {
    slug: "ventilation",
    path: "/residential/ventilation",
    name: "Roof & Attic Ventilation",
    metaTitle: "Roof & Attic Ventilation in Hattiesburg | Southeast Roofing",
    metaDescription:
      "Attic ventilation for the South Mississippi climate, ridge vents, intake, and airflow balancing that extend shingle life and take load off your AC.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Ventilation: the quiet system that saves your roof",
      subhead:
        "In a climate this hot and humid, an unventilated attic cooks your shingles from below, strains your AC, and breeds moisture problems. Balanced intake and exhaust is one of the highest-value upgrades a South Mississippi roof can get.",
      photo: {
        src: "/images/services/ridge-vent.webp",
        alt: "Black shingle-over ridge vent installed at the peak of an architectural shingle roof",
      },
      photoBadge: "Attic ventilation",
    },
    ventDiagram: true,
    intro: {
      title: "Why ventilation matters more here than almost anywhere",
      paragraphs: [
        "A Mississippi attic in July can run dramatically hotter than the air outside. That heat radiates down into your living space, makes your air conditioner run longer, and bakes your shingles from the underside, aging them years ahead of schedule. In winter and shoulder seasons, the problem flips to moisture: warm indoor air meeting cooler roof decking condenses, feeding mildew and rot.",
        "The cure is balanced airflow: intake low at the soffits, exhaust high at the ridge, in proportions matched to your attic's size. It's simple physics, but it's routinely botched: blocked soffits, mixed exhaust types that short-circuit each other, or too little intake to feed the ridge vent. We assess what your attic actually has, and correct the system as a whole.",
      ],
    },
    sections: [
      {
        title: "Intake and exhaust: airflow is a loop, not a hole",
        paragraphs: [
          "Attic ventilation only works as a circuit: cool air enters low through intake vents at the soffits, heated air exits high through exhaust at or near the ridge. Cut the loop anywhere and the system stalls. A ridge vent over blocked soffits has nothing to pull from, so it moves little air or pulls from the wrong places, including conditioned air through gaps in the ceiling plane.",
          "That's why \"add more exhaust\" is the wrong reflex, more exhaust with inadequate intake just changes where the makeup air gets stolen from. Intake is where most local attics fail: soffit vents painted shut, screened over, or buried under insulation. It's usually the simpler side to fix, too.",
        ],
      },
      {
        title: "How much ventilation? NFA and a worked example",
        paragraphs: [
          "Vents are rated by net free ventilating area (NFA). The actual open area air can pass through, always less than the vent's physical size. A common baseline is 1 square foot of NFA per 300 square feet of attic floor when qualifying conditions are met; some assemblies and code situations call for 1:150 instead. Neither ratio is a universal code requirement, and a roughly even intake-to-exhaust split is the usual target: with intake never the smaller share.",
        ],
        table: {
          title: "Worked example (illustration only: not a design)",
          description:
            "How the arithmetic runs for a hypothetical attic, so the vent ratings on a quote mean something.",
          columns: ["Step", "Example figure"],
          rows: [
            ["Attic floor area", "1,500 sq ft"],
            ["Ratio applied", "1:300 (where qualifying conditions are met)"],
            ["Total NFA target", "5 sq ft = 720 sq in"],
            ["Intake share (soffits)", "About half: roughly 360 sq in NFA"],
            ["Exhaust share (ridge)", "About half: roughly 360 sq in NFA"],
          ],
          note: "An illustration of the method, not a specification for your home. Your attic's ratio, geometry, and vent selection are determined at inspection.",
        },
        links: [
          {
            label: "See how the whole roof system fits together",
            href: "/anatomy-of-a-roof",
          },
        ],
      },
      {
        title: "Gable vents, ridge vents, and the short-circuit problem",
        paragraphs: [
          "Exhaust types don't stack. They compete. A ridge vent added above open gable vents can start using the gables as its nearest intake, pulling a short loop across the top of the attic while the soffit-to-ridge path barely moves. A powered fan near a ridge vent does the same, drawing its makeup air backward through the ridge instead of up from the soffits.",
          "The fix is one coherent exhaust strategy with real intake behind it. When we install a ridge vent on a house with gable vents, we'll often recommend closing or baffling the gables so the airflow runs low to high, across the full attic.",
        ],
      },
      {
        title: "Powered attic fans: the fine print",
        paragraphs: [
          "Powered fans move impressive air on paper, and on an attic with generous intake they can help. But a fan is indifferent to where its air comes from: with weak intake and a leaky ceiling plane, it can depressurize the attic and pull conditioned air out through can lights and hatches. You pay to cool air twice.",
          "So powered ventilation is a case-by-case tool, not a default. Balanced passive soffit-and-ridge systems run around the clock with no motor to fail; we reach for power only where the attic needs it and the intake can feed it.",
        ],
      },
      {
        title: "Baffles, insulation, and the moisture side of the story",
        paragraphs: [
          "The most common intake failure isn't the vent. It's insulation shoved into the eaves, plugging the airway where it starts. Baffles (rigid channels between the rafters at the eaves) hold the insulation back and keep the path open. Insulation upgrades miss this constantly: beautiful new insulation, suffocated attic.",
          "Heat gets the attention, but moisture is the quieter threat here: humid air condensing on cooler decking feeds mildew, rusts nail tips, and delaminates sheathing. Ventilation carries that moisture out, but only if it isn't being fed extra. Bath fans and dryer vents must never terminate in the attic; every one we find dumping steam into the insulation gets rerouted outdoors, full stop.",
        ],
        links: [
          {
            label: "Soffit and fascia repair at the intake edge",
            href: "/residential/fascia",
          },
        ],
      },
      {
        title: "The best time to fix ventilation is during a reroof",
        paragraphs: [
          "Every replacement includes a ventilation assessment, because mid-reroof is when fixing it costs the least: the ridge is open for a ridge vent, conflicting exhaust comes off with the old shingles, and the layout can be rebuilt without disturbing a finished roof. It also protects the new shingles, manufacturers commonly require adequate ventilation as a condition of coverage.",
        ],
        links: [
          {
            label: "How ventilation fits into a shingle system",
            href: "/residential/asphalt-shingle-roofing",
          },
        ],
      },
    ],
    costFactors: {
      title: "What affects the cost of ventilation work?",
      description:
        "Ventilation corrections range from an afternoon of baffles to a full exhaust redesign.",
      items: [
        {
          title: "Attic size and layout",
          text: "The NFA target scales with floor area; complex rooflines split the attic into zones.",
        },
        {
          title: "Condition of the intake",
          text: "Open soffits needing baffles is one job; solid or painted-shut soffits needing new intake is another.",
        },
        {
          title: "Ridge length available",
          text: "Hip-heavy roofs with short ridges may need supplemental exhaust types.",
        },
        {
          title: "Removing what's fighting the system",
          text: "Closing gable vents and capping redundant exhaust so the airflow runs one way.",
        },
        {
          title: "Standalone or during a reroof",
          text: "Cutting a ridge vent into an existing roof is routine; during replacement it costs the least.",
        },
        {
          title: "Exhaust rerouting",
          text: "Bath fans or dryer ducts ending in the attic get rerouted outdoors.",
        },
        {
          title: "Access",
          text: "Low-clearance attics and deep blown-in insulation slow the interior work.",
        },
      ],
    },
    signs: {
      title: "Signs your attic isn't breathing",
      items: [
        {
          icon: Thermometer,
          title: "Second floor won't cool down",
          text: "Rooms under the roof that stay hot into the evening point to a heat-soaked attic.",
        },
        {
          icon: Waves,
          title: "Shingles aging early",
          text: "Curling and granule loss on a roof that isn't old often means it's being cooked from below.",
        },
        {
          icon: Droplets,
          title: "Moisture in the attic",
          text: "Damp insulation, rusty nail tips, or a musty smell mean condensation is winning.",
        },
        {
          icon: Fan,
          title: "Blocked or painted-shut soffits",
          text: "Exhaust vents can't work without intake, blocked soffits are the most common failure we find.",
        },
        {
          icon: TriangleAlert,
          title: "Mold or mildew spots",
          text: "Dark staining on the underside of the roof deck is a ventilation problem announcing itself.",
        },
        {
          icon: Home,
          title: "High summer power bills",
          text: "An overheated attic makes your AC fight the roof all day, every day.",
        },
      ],
    },
    approach: {
      title: "How we fix attic airflow",
      steps: [
        {
          title: "Measure what's there",
          text: "We inspect intake, exhaust, and attic conditions, and calculate what your attic size actually requires.",
        },
        {
          title: "Design a balanced system",
          text: "Intake at the soffits feeding exhaust at the ridge, without mixing vent types that short-circuit airflow.",
        },
        {
          title: "Install and correct",
          text: "Ridge vents, intake correction, and baffles where insulation is choking the soffits.",
        },
        {
          title: "Verify the whole roof benefits",
          text: "Proper ventilation supports your shingle manufacturer's requirements and helps the whole system reach its rated life.",
        },
      ],
    },
    gallery: {
      title: "The exhaust vents we install",
      description:
        "The right exhaust type depends on your roof's shape and existing intake. Ridge vents lead for balanced airflow; turbines, box vents, and powered fans each earn their place on the right home.",
      photos: [
        {
          src: "/images/services/ridge-vent.webp",
          alt: "Black shingle-over ridge vent running the peak of an architectural shingle roof",
        },
        {
          src: "/images/services/turbine-vent.webp",
          alt: "Wind-driven turbine attic vent on a shingle roof",
        },
        {
          src: "/images/services/box-vent.webp",
          alt: "Low-profile box vent (turtle vent) on a shingle roof",
        },
        {
          src: "/images/services/power-attic-vent.webp",
          alt: "Powered attic fan vent mounted on a shingle roof",
        },
      ],
    },
    faqs: [
      {
        question: "Does attic ventilation really affect shingle life?",
        answer:
          "Yes, significantly, especially in the South. Trapped attic heat accelerates asphalt aging from the underside, and shingle manufacturers require adequate ventilation as a condition of their coverage. It's one of the most economical ways to protect an expensive roof.",
      },
      {
        question: "What's the best ventilation setup for this climate?",
        answer:
          "For most homes: continuous soffit intake feeding a ridge vent exhaust. It's passive, silent, and works around the clock. The key is balance, exhaust without enough intake just pulls conditioned air out of your house.",
      },
      {
        question: "Can you add ventilation without replacing the roof?",
        answer:
          "Usually, yes. Ridge vents can be cut into an existing roof, soffit intake can be opened up, and baffles added from the attic side. During a reroof it's even easier: which is why we evaluate ventilation on every replacement.",
      },
      {
        question: "Do powered attic fans help?",
        answer:
          "Sometimes, but they can also depressurize the attic and pull cooled air out of the living space if intake is inadequate. We generally favor balanced passive systems first and recommend powered options only where the attic genuinely needs them.",
      },
      {
        question: "Is the 1-in-300 ventilation ratio a code requirement?",
        answer:
          "Not universally. It's a common baseline that applies when qualifying conditions are met; some assemblies and jurisdictions call for 1:150 instead. What applies to your home depends on the attic assembly and local requirements: exactly what our assessment sorts out.",
      },
      {
        question: "Should my gable vents stay open if I add a ridge vent?",
        answer:
          "Often not. Open gables near a new ridge vent can become its nearest air source, short-circuiting the soffit-to-ridge path that should sweep the whole attic. We evaluate the layout and recommend closing or baffling the gables when they'd undercut the new system.",
      },
      {
        question: "Is it okay for my bathroom fan to vent into the attic?",
        answer:
          "No, never. A bath fan or dryer duct ending in the attic pumps moist air into the space ventilation is trying to dry out, feeding condensation, mildew, and rot. Exhaust ducts should terminate outdoors, and rerouting them is a routine part of our ventilation work.",
      },
    ],
    related: [
      {
        label: "Asphalt Shingle Roofing",
        href: "/residential/asphalt-shingle-roofing",
        description:
          "Ventilation is what lets a quality shingle system reach its full life.",
      },
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description:
          "Every replacement we do includes a ventilation assessment. It's the most economical time to fix it.",
      },
      {
        label: "Gutters",
        href: "/residential/gutters",
        description:
          "Moisture management from the ridge to the ground: airflow and drainage together.",
      },
    ],
  },
];
