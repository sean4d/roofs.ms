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
 * service — no find-and-replace bodies. Every factual claim is either
 * owner-confirmed (GAF certification, MSBOC license, BBB accreditation,
 * GoodLeap partnership, service area) or general roofing knowledge stated
 * qualitatively. No invented prices, warranty terms, or stats (PRD §0.2).
 */

const replacementGallery = projectPhotos
  .filter((photo) =>
    ["hattiesburg", "petal", "gulfport", "jackson"].includes(photo.citySlug),
  )
  .filter(
    (photo, index, all) =>
      all.findIndex((p) => p.citySlug === photo.citySlug) === index,
  );

const repairGallery = [
  stormPhotos.find((p) => p.category === "missing-shingles"),
  stormPhotos.find((p) => p.category === "wind-damage"),
  stormPhotos.find((p) => p.category === "tree-damage"),
  stormPhotos.find((p) => p.category === "emergency-tarp"),
].filter((photo) => photo !== undefined);

export const residentialServices: ServiceContent[] = [
  /* ------------------------------------------------------------------ */
  /* Asphalt shingle roofing — the flagship residential system           */
  /* ------------------------------------------------------------------ */
  {
    slug: "asphalt-shingle-roofing",
    path: "/residential/asphalt-shingle-roofing",
    name: "Asphalt Shingle Roofing",
    metaTitle: "Asphalt Shingle Roofing in Hattiesburg & South Mississippi",
    metaDescription:
      "GAF-certified asphalt shingle roofing across South Mississippi. Architectural shingles installed to manufacturer spec — with straight answers on brands, colors, and cost.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Asphalt shingle roofing, installed to spec",
      subhead:
        "Architectural shingles are the workhorse roof of South Mississippi — affordable, storm-capable, and available in styles that fit any home. As a GAF Certified Contractor we install them the way the manufacturer intends, every time.",
      photo: stockPhotos.heroHome,
      photoBadge: "Architectural asphalt shingle roofing",
    },
    intro: {
      title: "The right shingle system for a demanding climate",
      paragraphs: [
        "A shingle roof in South Mississippi works harder than one almost anywhere else: months of high heat and humidity, some of the heaviest annual rainfall in the country, and a hurricane season that runs half the year. The difference between a roof that shrugs that off and one that fails early is rarely the shingle itself — it's the system underneath and the quality of the installation.",
        "That's why we install complete shingle systems, not just shingles: underlayment, ice-and-water protection in valleys and penetrations, drip edge, ridge ventilation, and manufacturer-matched components, fastened to spec. We're a GAF Certified Contractor and also install Owens Corning shingle products — and we'll tell you plainly which line fits your home and budget.",
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
          text: "Edges that lift or curl mean the shingles have dried out and lost flexibility — wind grabs them next.",
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
          text: "Interior water spots usually mean the leak has been active for a while — the sooner it's traced, the smaller the repair.",
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
          text: "We walk you through GAF and Owens Corning lines, styles, and colors — with real samples, not just brochures.",
        },
        {
          title: "Full-system installation",
          text: "Tear-off to the deck, decking repairs where needed, underlayment, flashing, ventilation, and shingles — installed to manufacturer specification.",
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
        "We're certified on GAF systems — our primary recommendation — and also install Owens Corning shingle products.",
      items: [
        {
          title: "Architectural (dimensional) shingles",
          text: "The standard we recommend for most homes: layered profile, strong wind performance, and a deep range of colors.",
        },
        {
          title: "GAF shingle systems",
          text: "Our primary line as a GAF Certified Contractor — shingles, starter strips, ridge caps, and underlayment engineered to work together.",
        },
        {
          title: "Owens Corning products",
          text: "A proven alternative line we install when its style, color, or availability fits your project best.",
        },
      ],
      note: "We recommend based on your roof and budget — not on what we happen to have on the truck. Ask us to compare lines side by side at your estimate.",
    },
    gallery: {
      title: "Recent shingle roofs across the region",
      description:
        "Every photo is a genuine Southeast Roofing project — real homes from Hattiesburg to the Gulf Coast.",
      photos: replacementGallery.map(({ src, alt }) => ({ src, alt })),
    },
    anatomy: true,
    faqs: [
      {
        question: "How long does an asphalt shingle roof last in Mississippi?",
        answer:
          "Typically 15–25 years here, depending on the shingle line, attic ventilation, and storm exposure. Our heat and humidity age shingles faster than northern climates — which is why installation quality and ventilation matter so much.",
      },
      {
        question:
          "What's the difference between 3-tab and architectural shingles?",
        answer:
          "3-tab shingles are a flat, single-layer product that's cheaper up front but has lower wind ratings and a shorter life. Architectural (dimensional) shingles are thicker, layered, and handle Gulf-region wind far better. For most South Mississippi homes we recommend architectural.",
      },
      {
        question: "Do you install GAF or Owens Corning?",
        answer:
          "Both. GAF is our primary, certified line — we're a GAF Certified Contractor. We also install Owens Corning shingle products when they're the right fit. We'll show you both options with real samples.",
      },
      {
        question: "Can new shingles go over my old ones?",
        answer:
          "Layering over old shingles is sometimes allowed by code, but we almost never recommend it: it hides deck damage, traps heat, voids some manufacturer coverage, and adds weight. A full tear-off lets us fix what's underneath and start clean.",
      },
      {
        question: "Will my homeowner's insurance pay for a new shingle roof?",
        answer:
          "If the damage was caused by a covered event like wind or hail, it may. We document the damage thoroughly and can meet your adjuster on site — the decision always rests with your insurer, but you won't navigate it alone.",
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
  /* Roof replacement — the process page                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-replacement",
    path: "/residential/roof-replacement",
    name: "Roof Replacement",
    metaTitle: "Roof Replacement in Hattiesburg & South Mississippi",
    metaDescription:
      "Full residential roof replacement, done in as little as one to two days once materials arrive. Free inspection, honest recommendation, clean job site — Southeast Roofing.",
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
        "Not every aging roof needs replacing — and we'll tell you when yours doesn't. But when leaks keep coming back, shingles are failing across whole slopes, or storm damage runs deeper than the surface, continuing to patch becomes the expensive option. That's when a full replacement pays for itself in stopped leaks, restored insurability, and a couple of decades of not thinking about your roof.",
        "Most of our residential replacements are completed in one to two days once materials arrive. We handle everything: permits where required, tear-off and haul-off, decking repairs, the full new system, and a final walkthrough with a magnetic sweep of your yard for nails.",
        "If a storm is what brought you here, we also handle the insurance side — thorough documentation, reports in the format adjusters expect, and on-site adjuster meetings when needed.",
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
          text: "Curling, cracking, or bald shingles across whole sections — not just isolated spots.",
        },
        {
          icon: Wind,
          title: "Major storm damage",
          text: "When wind or hail damage covers a large area, insurers and manufacturers both favor replacement.",
        },
        {
          icon: Waves,
          title: "A sagging roofline",
          text: "Visible dips can mean deck or structural moisture damage — have it inspected promptly.",
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
          text: "We inspect the full system — shingles, flashing, decking, ventilation — and photograph everything we find.",
        },
        {
          title: "A recommendation you can trust",
          text: "Repair or replace, in writing, with a clear price. If insurance applies, we help you through the claim.",
        },
        {
          title: "Materials & scheduling",
          text: "You pick the system and color; we order materials and schedule the build — most homes take one to two days.",
        },
        {
          title: "Tear-off and deck check",
          text: "Old roofing comes off completely so we can inspect and repair the decking before anything new goes down.",
        },
        {
          title: "Full-system installation",
          text: "Underlayment, valley and penetration protection, flashing, ventilation, and your new roof — installed to manufacturer spec.",
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
        "Real Southeast Roofing projects — from Hattiesburg and Petal to Jackson and the Coast.",
      photos: projectPhotos
        .filter((photo) =>
          ["biloxi", "laurel", "meridian", "columbia"].includes(photo.citySlug),
        )
        .filter(
          (photo, index, all) =>
            all.findIndex((p) => p.citySlug === photo.citySlug) === index,
        )
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
          "It depends on the size, pitch, and complexity of your roof and the system you choose — which is why we quote from an actual inspection instead of guessing. The inspection and estimate are free, and financing through GoodLeap is available.",
      },
      {
        question: "Do I need to be home during the work?",
        answer:
          "No. Most homeowners aren't. We confirm access and details ahead of time, and we're reachable throughout the day. You'll walk the finished job with us before we consider it complete.",
      },
      {
        question: "What happens if you find rotten decking?",
        answer:
          "We repair or replace it before installing the new system — that's the point of a full tear-off. We photograph what we find and talk to you before doing work beyond the estimate.",
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
    metaTitle: "Roof Repair in Hattiesburg & South Mississippi",
    metaDescription:
      "Roof leak and storm damage repair across South Mississippi. We find the real source, fix it right, and tell you honestly when a repair is all you need.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Repairs that fix the cause, not just the drip",
      subhead:
        "Water is sneaky — where it shows up inside is rarely where it got in. We trace leaks to their true source, repair them properly, and tell you honestly when a repair is all your roof needs.",
      photo: stockPhotos.rooferInstalling,
      photoBadge: "Shingle repair work",
    },
    intro: {
      title: "A good repair starts with a real diagnosis",
      paragraphs: [
        "South Mississippi roofs take a beating in short bursts — an afternoon thunderstorm with straight-line winds, a hail cell, a branch down in a tropical system. The damage is often local: a run of missing shingles, torn flashing around a chimney, a punctured valley. Caught early, these are modest repairs. Left alone through a wet season, they become decking rot, insulation damage, and interior stains.",
        "Our repair visits start the same way as everything we do: an inspection that documents what's actually wrong. Then we fix the source — matching materials to your existing roof as closely as supply allows — and show you photos of the finished work. And if what we find genuinely calls for replacement instead, we'll show you why and let the evidence speak.",
      ],
    },
    signs: {
      title: "Signs you need a roof repair now",
      items: [
        {
          icon: Droplets,
          title: "Water stains or drips inside",
          text: "Ceiling spots, wet attic insulation, or drips during rain — the leak is established and growing.",
        },
        {
          icon: Wind,
          title: "Shingles in the yard",
          text: "After any wind event, shingles on the ground mean open spots on the roof.",
        },
        {
          icon: TriangleAlert,
          title: "Hail strikes",
          text: "Bruised shingles and dented vents after hail may not leak yet — but they will, and they're time-sensitive for insurance.",
        },
        {
          icon: Layers,
          title: "Damaged flashing",
          text: "Rusted, lifted, or missing flashing around chimneys, walls, and valleys is the most common leak source we find.",
        },
        {
          icon: CloudRain,
          title: "Tree contact",
          text: "A limb strike — even one that 'just brushed' the roof — can crack shingles and puncture underlayment.",
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
          text: "We find where water is actually entering — not just where it shows — and document it with photos.",
        },
        {
          title: "Stabilize if needed",
          text: "If weather is incoming or the opening is active, we tarp and protect first, then schedule the permanent fix.",
        },
        {
          title: "Repair the source",
          text: "Shingles, flashing, boots, valleys, or decking — repaired with materials matched to your roof.",
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
        "Real inspection photos from South Mississippi roofs — wind, hail, tree, and storm damage.",
      photos: repairGallery.map(({ src, alt }) => ({ src, alt })),
    },
    faqs: [
      {
        question: "How do I know if I need a repair or a full replacement?",
        answer:
          "Localized damage on a roof with life left in it — a leak, a wind-torn section, failed flashing — is a repair. Widespread failure, chronic leaks, or major storm damage across slopes points to replacement. Our free inspection gives you the answer with photo evidence, and we'll recommend the cheaper path when it's genuinely enough.",
      },
      {
        question: "Can you match my existing shingles?",
        answer:
          "Usually close, sometimes exactly. It depends on the age and availability of your shingle line — colors weather over time, so even an exact product match may read slightly different at first. We'll show you the closest options before we start.",
      },
      {
        question: "My roof is leaking right now. What should I do?",
        answer:
          "Contain the water inside (buckets, move belongings, poke a small drain hole in a bulging ceiling spot), stay off the roof, and call us. If the opening is active we can tarp it to stop the damage, then complete the permanent repair.",
      },
      {
        question: "Is storm damage repair covered by insurance?",
        answer:
          "Wind, hail, and falling-tree damage are commonly covered perils under homeowner policies. We document the damage thoroughly and support your claim — and if the damage is too minor to be worth a claim, we'll tell you that too.",
      },
      {
        question: "Do you repair roofs you didn't install?",
        answer:
          "All the time. Most of our repair work is on roofs installed by someone else — including out-of-town crews that are long gone.",
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
          "Hail, wind, and hurricane-season damage — how the response and claim process works.",
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
    metaTitle: "Seamless Gutter Installation & Repair in Hattiesburg, MS",
    metaDescription:
      "Seamless gutters custom-formed on site and sized for South Mississippi rainfall — installation, replacement, and repair from Southeast Roofing in Hattiesburg.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Seamless gutters, built for Gulf-region rain",
      subhead:
        "Custom-formed on site in continuous runs — no seams to split, no joints to drip. South Mississippi gets some of the heaviest rainfall in the country, and seamless gutters are what stand between that water and your fascia, siding, and foundation.",
      photo: stockPhotos.residentialHome,
      photoBadge: "Residential exterior",
    },
    intro: {
      title: "The system that protects everything below the roof",
      paragraphs: [
        "A roof sheds water; gutters decide where it goes. When they're undersized, clogged, or pulling away from the fascia, every heavy storm pours water against your eaves, behind your siding, and into the soil at your foundation. In a climate where multi-inch rain days are routine, that adds up to rotted fascia boards, stained brick, washed-out beds, and settlement cracks.",
        "Because we're a roofing company first, we look at gutters as part of the roof system — sized to your actual roof area and pitch, hung with the right fall toward downspouts, and integrated correctly with drip edge and flashing. Replacing your roof? That's the ideal moment to evaluate the gutters too, and we'll give you an honest read on whether yours can stay.",
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
          text: "Gutters pulling off the fascia are usually a sign of failed hangers — or rotted wood behind them.",
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
          text: "Older gutters fail at the joints first — patching buys time, but not much in our rainfall.",
        },
      ],
    },
    approach: {
      title: "How we approach gutter work",
      steps: [
        {
          title: "Assess the whole water path",
          text: "Roof area, valleys, and pitch determine how much water your gutters must move — we size from that, not habit.",
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
    faqs: [
      {
        question: "Should I replace gutters when I replace my roof?",
        answer:
          "It's the most economical time to do it — the crews and equipment are already there, and new drip edge integrates cleanly with new gutters. But if your existing gutters are sound, we'll say so and work around them carefully.",
      },
      {
        question: "What size gutters do I need?",
        answer:
          "It depends on your roof's area and pitch. Given South Mississippi rainfall intensity, many homes benefit from larger 6-inch gutters and oversized downspouts on big or steep roof planes — we calculate it from your actual roof rather than defaulting to the minimum.",
      },
      {
        question: "Do you repair gutters or only replace them?",
        answer:
          "Both. Re-pitching runs, replacing hangers, sealing seams, and swapping damaged sections are all routine repairs — when the metal itself is sound, repair is the right call.",
      },
      {
        question: "Can gutters be damaged by storms like a roof can?",
        answer:
          "Yes — hail dents them, wind-blown debris crushes them, and falling limbs tear them off. Gutter damage is commonly included in the same insurance claims as roof damage, and we document both together.",
      },
    ],
    related: [
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description:
          "Pairing gutters with a new roof gets both systems integrated correctly.",
      },
      {
        label: "Roof Repair",
        href: "/residential/roof-repair",
        description:
          "Fascia rot from overflowing gutters often comes with roof-edge damage — we fix both.",
      },
      {
        label: "Ventilation",
        href: "/residential/ventilation",
        description:
          "Moisture management doesn't stop at the eaves — attic airflow matters too.",
      },
    ],
  },

  {
    slug: "ventilation",
    path: "/residential/ventilation",
    name: "Roof & Attic Ventilation",
    metaTitle: "Roof & Attic Ventilation in Hattiesburg, MS",
    metaDescription:
      "Attic ventilation for the South Mississippi climate — ridge vents, intake, and airflow balancing that extend shingle life and take load off your AC.",
    hero: {
      eyebrow: "Residential roofing",
      headline: "Ventilation: the quiet system that saves your roof",
      subhead:
        "In a climate this hot and humid, an unventilated attic cooks your shingles from below, strains your AC, and breeds moisture problems. Balanced intake and exhaust is one of the highest-value upgrades a South Mississippi roof can get.",
      photo: stockPhotos.residentialHome,
      photoBadge: "Residential roofing",
    },
    intro: {
      title: "Why ventilation matters more here than almost anywhere",
      paragraphs: [
        "A Mississippi attic in July can run dramatically hotter than the air outside. That heat radiates down into your living space, makes your air conditioner run longer, and bakes your shingles from the underside — aging them years ahead of schedule. In winter and shoulder seasons, the problem flips to moisture: warm indoor air meeting cooler roof decking condenses, feeding mildew and rot.",
        "The cure is balanced airflow: intake low at the soffits, exhaust high at the ridge, in proportions matched to your attic's size. It's simple physics, but it's routinely botched — blocked soffits, mixed exhaust types that short-circuit each other, or too little intake to feed the ridge vent. We assess what your attic actually has, and correct the system as a whole.",
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
          text: "Exhaust vents can't work without intake — blocked soffits are the most common failure we find.",
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
          text: "We inspect intake, exhaust, and attic conditions — and calculate what your attic size actually requires.",
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
    faqs: [
      {
        question: "Does attic ventilation really affect shingle life?",
        answer:
          "Yes — significantly, especially in the South. Trapped attic heat accelerates asphalt aging from the underside, and shingle manufacturers require adequate ventilation as a condition of their coverage. It's one of the cheapest ways to protect an expensive roof.",
      },
      {
        question: "What's the best ventilation setup for this climate?",
        answer:
          "For most homes: continuous soffit intake feeding a ridge vent exhaust. It's passive, silent, and works around the clock. The key is balance — exhaust without enough intake just pulls conditioned air out of your house.",
      },
      {
        question: "Can you add ventilation without replacing the roof?",
        answer:
          "Usually, yes. Ridge vents can be cut into an existing roof, soffit intake can be opened up, and baffles added from the attic side. During a reroof it's even easier — which is why we evaluate ventilation on every replacement.",
      },
      {
        question: "Do powered attic fans help?",
        answer:
          "Sometimes — but they can also depressurize the attic and pull cooled air out of the living space if intake is inadequate. We generally favor balanced passive systems first and recommend powered options only where the attic genuinely needs them.",
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
          "Every replacement we do includes a ventilation assessment — it's the cheapest time to fix it.",
      },
      {
        label: "Gutters",
        href: "/residential/gutters",
        description:
          "Moisture management from the ridge to the ground — airflow and drainage together.",
      },
    ],
  },
];
