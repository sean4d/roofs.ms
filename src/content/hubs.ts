import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CloudLightning,
  Droplets,
  Fan,
  Home,
  Layers,
  Leaf,
  PanelTop,
  Sparkles,
  TreePine,
  Wind,
  Wrench,
} from "lucide-react";

import type { FaqEntry } from "@/lib/schema";
import type { ProseSection } from "@/content/services/types";
import { stormPhotos } from "@/content/photos";
import { stockPhotos } from "@/content/stock-photos";

/**
 * Copy for the Phase 3 hub pages: /residential, /storm-damage,
 * /metal-roofing (cross-hub), and /financing. Same integrity rules as all
 * content: owner-confirmed claims and qualitative general knowledge only.
 */

export interface HubServiceCard {
  icon: LucideIcon;
  label: string;
  href: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Residential hub (/residential)                                      */
/* ------------------------------------------------------------------ */

export const residentialHub = {
  metaTitle: "Residential Roofing in Hattiesburg, MS | Southeast Roofing",
  metaDescription:
    "The full residential roofing lineup from Southeast Roofing: shingle and metal systems, replacement, repair, gutters, and ventilation — one local, GAF-certified team.",
  hero: {
    eyebrow: "Residential division",
    headline: "Your home's roof, handled completely",
    subhead:
      "Every system that protects a South Mississippi home lives under this roof: GAF-certified shingle work, metal systems, repairs, storm response, gutters, and ventilation. One local team, one standard of craftsmanship.",
    photo: stockPhotos.residentialHome,
    photoBadge: "Asphalt shingle roofing",
  },
  services: [
    {
      icon: Home,
      label: "Asphalt Shingle Roofing",
      href: "/residential/asphalt-shingle-roofing",
      description:
        "The region's workhorse roof — GAF and Owens Corning systems installed to spec.",
    },
    {
      icon: PanelTop,
      label: "Metal Roofing",
      href: "/residential/metal-roofing",
      description:
        "Standing seam and exposed-fastener systems in 26 and 29 gauge.",
    },
    {
      icon: Layers,
      label: "Roof Replacement",
      href: "/residential/roof-replacement",
      description:
        "Most homes done in one to two days — tear-off to walkthrough.",
    },
    {
      icon: Wrench,
      label: "Roof Repair",
      href: "/residential/roof-repair",
      description:
        "Leaks traced to the real source and fixed right, with photos to prove it.",
    },
    {
      icon: Droplets,
      label: "Seamless Gutters",
      href: "/residential/gutters",
      description: "Custom-formed on site, sized for Gulf-region rainfall.",
    },
    {
      icon: Leaf,
      label: "Leaf Guard Systems",
      href: "/residential/leaf-guard",
      description: "Stop pine straw clogs for good — and retire the ladder.",
    },
    {
      icon: PanelTop,
      label: "Fascia & Soffit",
      href: "/residential/fascia",
      description: "The roofline boards and vented eaves, repaired and capped.",
    },
    {
      icon: Fan,
      label: "Ventilation",
      href: "/residential/ventilation",
      description:
        "Balanced attic airflow that extends shingle life and cools your house.",
    },
    {
      icon: Sparkles,
      label: "Roof Washing",
      href: "/residential/roof-washing",
      description:
        "Black streaks and moss removed — with the roof evaluated by roofers first.",
    },
  ] satisfies HubServiceCard[],
  sections: [
    {
      title: "Not sure where to start? Match your situation",
      paragraphs: [
        "Most homeowners don't call us asking for a specific service — they call with a symptom: a stain on the ceiling, shingles in the yard, gutters pouring over at the corners. This table matches the situation you're seeing to the service that usually addresses it, and to what our free inspection checks before anyone recommends anything.",
      ],
      table: {
        title: "Where to start, by situation",
        columns: [
          "What you're seeing",
          "Likely starting point",
          "What the inspection checks",
        ],
        rows: [
          [
            "Active leak or ceiling stain",
            "Roof repair",
            "The actual entry point — often flashing or a pipe boot, not the shingles below the stain",
          ],
          [
            "Shingles aging, curling, or shedding granules",
            "Replacement consultation",
            "Remaining service life, decking condition, and whether repair still makes sense",
          ],
          [
            "Missing or creased shingles after wind",
            "Storm inspection",
            "Storm-related damage worth documenting before any insurance conversation",
          ],
          [
            "Comparing shingle and metal",
            "Replacement consultation",
            "Roof geometry, pitch, and budget fit for each system — we install both",
          ],
          [
            "Gutters overflowing or pulling loose",
            "Seamless gutters",
            "Sizing, slope, downspout capacity, and the fascia behind the gutter",
          ],
          [
            "Rot at the roof edge or behind gutters",
            "Fascia & soffit",
            "How far the rot runs and what's feeding it — usually a drainage or drip-edge problem",
          ],
          [
            "Hot upstairs, high summer bills",
            "Ventilation",
            "Intake and exhaust balance, blocked soffits, and attic moisture",
          ],
          [
            "Buying or selling a house",
            "Free inspection",
            "A documented condition report you can hand to the other side of the table",
          ],
        ],
        note: "Every path starts with the same free inspection — the service recommendation comes after we've seen the roof, not before.",
      },
    },
    {
      title: "One accountable team for the whole roofline",
      paragraphs: [
        "A home's roof isn't just shingles. It's decking, underlayment, flashing, ventilation, fascia, and drainage working as one system — and most of the failures we repair started where two of those meet. Because we handle all of it under one roof, nothing gets orphaned between trades: the gutter crew and the shingle crew are the same company, so the drip edge, fascia, and gutter line get detailed together instead of blamed on each other.",
        "That matters in South Mississippi more than most places. Gulf heat and humidity age shingles from below when attics can't breathe, pine straw loads gutters year-round, and every summer brings wind events that test each detail. The services above aren't a menu of unrelated products — they're the parts of one system, and the free inspection looks at all of them every time.",
      ],
      links: [
        {
          label: "See how a full replacement runs",
          href: "/residential/roof-replacement",
        },
        {
          label: "Compare shingle and metal systems",
          href: "/residential/metal-roofing",
        },
        { label: "Book the free inspection", href: "/free-inspection" },
      ],
    },
  ] satisfies ProseSection[],
  faqs: [
    {
      question: "Where do I start if I don't know what my roof needs?",
      answer:
        "With the free inspection. We look at the whole system — shingles, flashing, decking, ventilation, gutters — document what we find, and tell you plainly what needs attention now, what can wait, and what's fine.",
    },
    {
      question: "Do you only do full roofs, or smaller jobs too?",
      answer:
        "Both. Repairs, gutter work, and ventilation fixes are everyday work for us, not favors. Small jobs done well are how we earn the big ones.",
    },
    {
      question: "What brands do you install?",
      answer:
        "We're a GAF Certified Contractor — that's our primary shingle line — and we also install Owens Corning shingle products. On metal, we install standing seam and exposed-fastener steel systems in 26 and 29 gauge.",
    },
    {
      question: "How far from Hattiesburg do you work?",
      answer:
        "A full 2-hour radius: Jackson, Meridian, the Gulf Coast, and every town in between. If you're anywhere in South Mississippi, you're almost certainly in our service area.",
    },
  ] satisfies FaqEntry[],
};

/* ------------------------------------------------------------------ */
/* Storm hub (/storm-damage)                                           */
/* ------------------------------------------------------------------ */

export const stormHub = {
  metaTitle: "Storm Damage Roof Repair in Mississippi | Southeast Roofing",
  metaDescription:
    "Hail, wind, hurricane, and tree damage — Southeast Roofing documents it, tarps it, helps with the insurance claim, and restores the roof. Hattiesburg-based, region-wide.",
  hero: {
    eyebrow: "Storm damage",
    headline: "When the weather turns, we answer",
    subhead:
      "Hail cells, straight-line winds, tropical systems — South Mississippi's weather earns its reputation. When your roof takes the hit, one local team handles the whole aftermath: documentation, emergency protection, the insurance claim, and the restoration.",
    photo: {
      // Owner pick 2026-07-05: storm gallery #21
      src: stormPhotos.find((p) =>
        p.src.includes("wind-damage-missing-shingles-hattiesburg"),
      )!.src,
      alt: stormPhotos.find((p) =>
        p.src.includes("wind-damage-missing-shingles-hattiesburg"),
      )!.alt,
    },
    photoBadge: "Storm damage inspection",
  },
  damageTypes: [
    {
      icon: CloudLightning,
      title: "Hail damage",
      text: "Bruised shingles and dented metal that may not leak for months — but shorten the roof's life and are time-sensitive for claims.",
      photo: stormPhotos.find((p) =>
        p.src.includes("hail-damage-roof-purvis"),
      )!,
    },
    {
      icon: Wind,
      title: "Wind damage",
      text: "Creased, lifted, and missing shingles from straight-line winds and tropical systems — the region's most common storm claim.",
      // Owner pick: storm gallery #24
      photo: stormPhotos.find((p) =>
        p.src.includes("wind-damage-roof-columbia"),
      )!,
    },
    {
      icon: Layers,
      title: "Missing shingles",
      text: "Open spots that let the next rain straight through to the decking. Small to see, urgent to fix.",
      // Owner pick: storm gallery #3
      photo: stormPhotos.find((p) =>
        p.src.includes("wind-damage-missing-shingles-petal"),
      )!,
    },
    {
      icon: TreePine,
      title: "Tree & debris impact",
      text: "From a limb strike to a trunk through the ridge — structural checks, emergency protection, and repair in the right order.",
      // Owner pick: storm gallery #20
      photo: stormPhotos.find((p) =>
        p.src.includes("rotted-decking-tear-off-hattiesburg-ms-003"),
      )!,
    },
  ],
  process: {
    title: "Our storm response, start to finish",
    steps: [
      {
        title: "Rapid inspection & documentation",
        text: "We assess and photograph every impact point — roof level, not from the driveway.",
      },
      {
        title: "Emergency protection",
        text: "Active openings get professionally tarped so the damage stops growing while the process runs.",
      },
      {
        title: "Insurance claim support",
        text: "Our documentation goes to your insurer, and we can meet the adjuster on your roof.",
      },
      {
        title: "Full restoration",
        text: "Repair or replacement to the approved scope — one crew sees it through to the final walkthrough.",
      },
    ],
  },
  paths: [
    {
      label: "Emergency Roofing",
      href: "/storm-damage/emergency-roofing",
      description:
        "Leaking right now? Start here — what to do in the first hour, and how our tarping response works.",
    },
    {
      label: "Insurance Claims",
      href: "/storm-damage/insurance-claims",
      description:
        "The claim process step by step, what we document, and honest answers about how it really works.",
    },
  ],
  sections: [
    {
      title: "The first hour after the storm",
      paragraphs: [
        "What you do in the first hour matters more for safety than for the roof. If a tree has hit the structure or the ceiling is sagging with water weight, get everyone out and stay out until it's been looked at. Do not climb onto a wet or storm-damaged roof — that's the single most common way a bad day gets worse, and everything on the roof can be documented by people with fall protection and a reason to be up there.",
      ],
      bullets: [
        "Kill power to rooms with water coming through fixtures or hitting outlets.",
        "Catch what you can and move furniture, electronics, and documents out of the drip line.",
        "Photograph interior damage before you clean anything up — stains, wet flooring, fallen debris, standing water.",
        "Keep damaged materials (shingles in the yard, fallen limbs cut from the roof) until they've been photographed.",
        "Save every receipt for tarps, fans, or emergency work — insurers commonly reimburse reasonable emergency mitigation, and the receipts are the record.",
        "Then call us. The emergency line answers 24/7, and tarping an active opening is the first move — it stops the damage from compounding while everything else runs.",
      ],
      links: [
        {
          label: "Emergency tarping, step by step",
          href: "/storm-damage/emergency-roofing",
        },
      ],
    },
    {
      title: "Storm damage vs. wear — and why it matters",
      paragraphs: [
        "Wind damage shows up as creased, lifted, or missing shingles — a crease breaks the shingle's seal even when it lays back down, which is why a roof can look fine from the driveway and still be compromised. Hail shows up as bruising in the shingle mat and dents in the soft metals: vents, gutters, and flashing take dents at hail sizes that shingles can hide. Tree and debris impact ranges from a scuff to a structural problem, and water entry from any of them can travel along decking and rafters before it ever shows on a ceiling — damage commonly exists well before a leak announces it.",
        "Here's the honest part many storm-season visitors won't tell you: age-related deterioration is not storm damage, and the insurance company — not the contractor — decides what's covered. Blistering, granule loss from age, and old installation problems generally aren't claimable, and pretending otherwise sets homeowners up for denied claims and bad decisions. Our inspection documents what's actually there, dates it against the storm where the evidence supports that, and tells you plainly when a claim isn't worth filing.",
      ],
      links: [
        {
          label: "How the insurance claim actually works",
          href: "/storm-damage/insurance-claims",
        },
        { label: "Book a storm inspection", href: "/storm-inspection" },
      ],
    },
    {
      title: "How to spot a storm chaser",
      paragraphs: [
        "After every named storm and hail map, out-of-area crews sweep through South Mississippi. Some do fine work; many don't stay long enough for you to find out. Signals worth your attention before you sign anything:",
      ],
      bullets: [
        "They knocked on your door first, and the truck has out-of-state plates or a magnetic sign.",
        "They declare your roof “totaled” on the spot — before any insurer has evaluated the loss.",
        "They ask you to sign an assignment of benefits or contingency agreement “just to get the process started.”",
        "They offer to “take care of” your deductible — that's insurance fraud, and it's the homeowner who carries the risk.",
        "There's no local address, no Mississippi license number to verify, and no local jobs to drive past.",
      ],
    },
    {
      title: "Homes and commercial buildings after the same storm",
      paragraphs: [
        "The same weather hits both, but the response differs. On homes, the priorities are tarping openings, documenting shingle and soft-metal damage, and walking the homeowner through a claim that most people only ever file once. On commercial buildings, the first moves are protecting inventory and operations, mapping where water is entering large low-slope assemblies (rarely directly above the drip), and coordinating documentation with property managers and adjusters — commercial claims carry more scope detail and more stakeholders. We run both, from the same office, with the same rule: document first, promise nothing the evidence doesn't support.",
      ],
      links: [
        { label: "Commercial roof repair", href: "/commercial/roof-repair" },
        { label: "Residential roof repair", href: "/residential/roof-repair" },
      ],
    },
  ] satisfies ProseSection[],
  faqs: [
    {
      question: "Should I call you or my insurance company first?",
      answer:
        "Either works, but there's an advantage to having us look first: you'll know what the damage actually is before you open a claim. If it's too minor to be worth filing, we'll tell you — and if it's serious, our documentation strengthens the claim from day one.",
    },
    {
      question: "How soon after a storm should the roof be inspected?",
      answer:
        "Quickly — within days if you suspect damage. Fresh damage is easiest to tie to the storm date, mitigation obligations kick in immediately, and open spots compound with every rain.",
    },
    {
      question: "What does the storm inspection cost?",
      answer:
        "Nothing. The inspection and the documentation are free, whether or not a claim or repair follows.",
    },
    {
      question: "A door-knocker says my roof is totaled. Should I sign?",
      answer:
        "Don't sign anything on the spot — especially assignments of benefits or contingency agreements you haven't read. Storm-chasing crews follow hail maps into our region every year and are gone by the time problems show up. Get a second opinion from a local company you can find at the same address next year.",
    },
  ] satisfies FaqEntry[],
};

/* ------------------------------------------------------------------ */
/* Metal cross-hub (/metal-roofing)                                    */
/* ------------------------------------------------------------------ */

export const metalHub = {
  metaTitle: "Metal Roofing in Hattiesburg, MS | Southeast Roofing",
  metaDescription:
    "Metal roofing for homes and commercial buildings across South Mississippi — standing seam, panel systems, honest metal-vs-shingle guidance, and free estimates.",
  hero: {
    eyebrow: "Metal roofing",
    headline: "Metal roofing, for homes and businesses alike",
    subhead:
      "Metal isn't a separate trade for us — it's a roofing system we install across both of our divisions, matched to the structure it protects. Start with the path that fits your building.",
    chips: ["Standing seam", "Exposed fastener", "R-panel", "26 & 29 gauge"],
    photo: {
      src: "/images/projects/29-gauge-galvalume-metal-roof-mccomb-ms-002.webp",
      alt: "29-gauge Galvalume metal roof installed by Southeast Roofing in McComb, Mississippi",
    },
    photoBadge: "Metal roofing",
  },
  paths: {
    residential: {
      title: "Residential Metal Roofing",
      href: "/residential/metal-roofing",
      description:
        "Standing seam and exposed-fastener systems for homes — styles, gauges, colors, and honest value guidance.",
      points: [
        "Standing seam & exposed fastener",
        "26 and 29 gauge steel",
        "Insurance & energy considerations",
      ],
    },
    commercial: {
      title: "Commercial Metal Roofing",
      href: "/commercial/metal-roofing",
      description:
        "Architectural and structural metal for facilities, warehouses, and agricultural buildings.",
      points: [
        "Standing seam & R-panel systems",
        "Low-slope and structural applications",
        "Maintenance-minded specification",
      ],
    },
  },
  materials: {
    title: "Materials & specs, in plain language",
    description:
      "The vocabulary you'll hear in a metal roofing conversation — decoded honestly.",
    items: [
      {
        title: "Gauge (26 vs 29)",
        text: "Steel thickness — lower number means thicker. 26 gauge is stiffer and more dent-resistant; 29 gauge is lighter on the budget. We install both and recommend by application.",
      },
      {
        title: "Galvalume vs painted steel",
        text: "Galvalume is a bare aluminum-zinc coated steel with a silvery agricultural look; painted panels add a baked-on color finish with long fade resistance.",
      },
      {
        title: "Panel profiles",
        text: "Standing seam (concealed fasteners, raised vertical locks), and ribbed exposed-fastener profiles like R-panel — the profile drives cost, look, and maintenance.",
      },
    ],
  },
  comparison: {
    title: "Metal vs. shingle, honestly",
    description:
      "We install both systems, so we don't need to win this argument either way — here's the straight comparison.",
    metal: {
      title: "Metal",
      points: [
        "Higher up-front cost",
        "Commonly outlasts two shingle roofs",
        "Excellent wind and shed performance",
        "Reflects summer heat",
        "Standing seam hides its fasteners — less routine upkeep, though flashings still need periodic checks",
      ],
    },
    shingle: {
      title: "Architectural shingle",
      points: [
        "Most affordable up front",
        "15–25 year typical life here",
        "Strong performance when installed to spec",
        "Easiest repairs and color matching",
        "The right call for many budgets and timelines",
      ],
    },
  },
  sections: [
    {
      title: "Which metal system fits which building",
      paragraphs: [
        "“Metal roof” covers everything from a concealed-fastener architectural system on a farmhouse to a structural panel spanning open purlins on a warehouse — and picking by appearance alone is how buildings end up with the wrong panel. The forks that actually matter: concealed versus exposed fasteners, architectural panels (which need a solid deck under them) versus structural panels (engineered to span open framing), and the gauge of the steel itself — where a lower number means thicker metal, so 24 gauge is heavier than 26, and 26 heavier than 29.",
        "Two behaviors are worth knowing before any panel conversation. Minimum slope varies by profile: some mechanically seamed and structural systems are approved on very low slopes, while snap-lock and most exposed-fastener profiles commonly want around 3:12 — no single number covers all metal. And oil canning — visible waviness in flat panel areas — is a cosmetic behavior of light-gauge flat metal, more visible with wider pans, thinner steel, and dark colors; it isn't a structural failure, but it's the kind of thing to discuss before choosing a 24-inch pan in gloss black. Closer to the coast, corrosion resistance and wind-uplift engineering join the list.",
      ],
      table: {
        title: "Metal system selector",
        columns: [
          "System",
          "Typical building",
          "Fasteners",
          "Typical gauge",
          "Substrate",
          "Slope capability",
          "Maintenance note",
          "Relative cost",
        ],
        rows: [
          [
            "Residential standing seam",
            "Homes, porches, barndominiums",
            "Concealed clips",
            "24–26",
            "Solid deck",
            "Snap-lock commonly ~3:12+",
            "Flashings and penetrations checked periodically",
            "Higher initial investment",
          ],
          [
            "Residential exposed fastener",
            "Homes, shops, barns",
            "Exposed gasketed screws",
            "26–29",
            "Deck or open framing",
            "Commonly ~3:12+ per profile",
            "Fastener washers need periodic inspection",
            "Moderate initial investment",
          ],
          [
            "Commercial standing seam",
            "Churches, schools, offices",
            "Concealed clips",
            "Commonly 24",
            "Solid deck",
            "Varies — seamed profiles go lower",
            "Concealed field, detailed flashings",
            "Higher initial investment",
          ],
          [
            "Structural standing seam",
            "PEMBs, large facilities",
            "Concealed clips at purlins",
            "24–22",
            "Open purlins",
            "Certain profiles approved very low",
            "Engineered assembly, inspected seams",
            "Higher initial investment",
          ],
          [
            "R-panel",
            "Shops, storage, walls",
            "Exposed gasketed screws",
            "Commonly 26",
            "Deck or framing per version",
            "Profile- and sealant-dependent",
            "Exposed washers need periodic inspection",
            "Lower initial investment",
          ],
          [
            "PBR panel",
            "Metal buildings, warehouses",
            "Exposed, through-fastened",
            "26 (24/22 options)",
            "Open purlins",
            "Some systems approved near low slopes",
            "Laps and fasteners on the inspection list",
            "Lower initial investment",
          ],
        ],
        note: "Representative values — gauge, slope approval, and attachment come from the selected manufacturer's tested assembly, not from a chart.",
      },
      links: [
        {
          label: "Residential metal systems",
          href: "/residential/metal-roofing",
        },
        {
          label: "Residential standing seam specs",
          href: "/residential/metal-roofing/standing-seam",
        },
        {
          label: "Economical exposed-fastener metal",
          href: "/residential/metal-roofing/exposed-fastener",
        },
        {
          label: "Commercial metal systems",
          href: "/commercial/metal-roofing",
        },
        {
          label: "Commercial standing seam specs",
          href: "/commercial/metal-roofing/standing-seam",
        },
        { label: "R-panel details", href: "/commercial/metal-roofing/r-panel" },
        {
          label: "How PBR attaches to open purlins",
          href: "/commercial/metal-roofing/pbr-panel",
        },
        {
          label: "Structural metal, explained",
          href: "/commercial/metal-roofing/structural-metal",
        },
      ],
    },
  ] satisfies ProseSection[],
  faqs: [
    {
      question: "Is metal roofing worth the extra cost?",
      answer:
        "If you'll own the building long enough, usually yes — a metal system commonly outlasts two shingle roofs, and it performs better in the wind events our region takes. If you're likely to sell within a few years, shingles are often the smarter spend. We'll run both numbers with you.",
    },
    {
      question: "Do you do metal for houses, businesses, or both?",
      answer:
        "Both — that's the point of this page. Residential metal (standing seam, exposed fastener) has its own hub, and commercial metal (architectural and structural systems) has its own. The links above route you to the right one.",
    },
    {
      question: "Will a metal roof make my house look industrial?",
      answer:
        "Not unless you want it to. Standing seam reads as clean and architectural — it's a staple of modern farmhouse and coastal design — and paint systems come in dozens of colors well beyond barn silver.",
    },
    {
      question: "Does hail ruin metal roofs?",
      answer:
        "Metal resists hail penetration very well, though severe hail can cosmetically dent panels — thicker 26 gauge resists denting better. Insurers treat cosmetic denting differently by policy, which is worth asking yours about.",
    },
  ] satisfies FaqEntry[],
};

/* ------------------------------------------------------------------ */
/* Financing (/financing)                                              */
/* ------------------------------------------------------------------ */

export const financingHub = {
  metaTitle: "Roof Financing in Mississippi | Southeast Roofing",
  metaDescription:
    "Finance your roof through our partner GoodLeap — apply online in minutes and decide with real numbers in hand. Free estimates from Southeast Roofing first.",
  hero: {
    eyebrow: "Financing",
    headline: "A new roof, on a budget that works",
    subhead:
      "Roofs rarely fail at convenient times. Through our financing partner GoodLeap, you can apply online in minutes and make the decision with real numbers in hand — no guessing, no pressure.",
    photo: stockPhotos.residentialHome,
    photoBadge: "Residential roofing",
  },
  icon: Banknote,
  steps: {
    title: "How financing a roof with us works",
    steps: [
      {
        title: "Get your free estimate",
        text: "We inspect, recommend honestly, and put a real price on paper — that's the number you'd finance.",
      },
      {
        title: "Apply through GoodLeap",
        text: "The application is online and takes minutes. GoodLeap presents the plans and terms you qualify for directly.",
      },
      {
        title: "Decide with numbers in hand",
        text: "Compare the monthly payment against the cost of waiting — no obligation at any step.",
      },
      {
        title: "We build",
        text: "Once you approve, we schedule the work like any other project. Most residential roofs take one to two days on site.",
      },
    ],
  },
  honestNotes: [
    "$0 down plans are available — your GoodLeap application shows the exact options you qualify for.",
    "Rates, terms, and approval come from the lender, not from us — GoodLeap will show you exactly what you qualify for.",
    "We don't mark projects up to hide financing costs. The estimate is the estimate, financed or not.",
    "If storm damage caused this, check the insurance path first — a covered claim may change what you need to finance.",
  ],
  faqs: [
    {
      question: "What does financing a roof cost?",
      answer:
        "It depends on the plan and terms you qualify for, which GoodLeap presents when you apply — we don't set rates and won't pretend to quote them. What we provide is the fixed project price the financing applies to.",
    },
    {
      question: "Do I have to finance through GoodLeap?",
      answer:
        "Not at all. Plenty of customers pay directly or use their own bank or credit union. GoodLeap is the partner we've set up to make it easy — use whatever is best for you.",
    },
    {
      question: "Can I finance a repair, or only full replacements?",
      answer:
        "Financing generally makes sense on larger projects like replacements. For repairs, get the estimate first — many repairs cost less than people fear, and we'll tell you the number before anything else.",
    },
    {
      question: "Does applying affect my credit?",
      answer:
        "Application and credit-check specifics are GoodLeap's to explain, and their process discloses this before you commit. If you're unsure, ask us and we'll point you to the right answer rather than guess.",
    },
    {
      question: "What if insurance is covering my roof?",
      answer:
        "Then you may only need to cover your deductible and any non-covered upgrades — often a much smaller number. We'll help you understand the claim first, then figure out if financing is needed at all.",
    },
  ] satisfies FaqEntry[],
};

/* ------------------------------------------------------------------ */
/* Commercial hub (/commercial) — the "commercial homepage" (§4.2)     */
/* ------------------------------------------------------------------ */

export const commercialHub = {
  metaTitle: "Commercial Roofing Contractor in Mississippi | Southeast Roofing",
  metaDescription:
    "Commercial roofing across South Mississippi: TPO, EPDM, PVC, modified bitumen, coatings, metal systems, and planned maintenance — engineered proposals, operations-first scheduling.",
  hero: {
    eyebrow: "Commercial division",
    headline: "Protect your property, your tenants, and your budget",
    subhead:
      "Flat, metal, and everything between — engineered proposals, installation phased around your operations, and one accountable local contractor across your whole portfolio.",
    photo: stockPhotos.commercialAerial,
    photoBadge: "Commercial low-slope roofing",
  },
  /** Publishable proof only — no invented bonding limits or safety stats */
  trustStrip: [
    "MS License #R22245",
    "Fully insured & bonded",
    "GAF Certified Contractor",
    "BBB Accredited · A+ Rating",
  ],
  services: [
    {
      icon: Layers,
      label: "TPO Roofing",
      href: "/commercial/tpo",
      description: "The reflective single-ply workhorse of low-slope roofing.",
    },
    {
      icon: Layers,
      label: "EPDM Roofing",
      href: "/commercial/epdm",
      description: "Rubber membrane with a 50-year track record.",
    },
    {
      icon: Layers,
      label: "PVC Roofing",
      href: "/commercial/pvc",
      description: "Grease and chemical resistance for demanding roofs.",
    },
    {
      icon: Layers,
      label: "Modified Bitumen",
      href: "/commercial/modified-bitumen",
      description: "Multi-ply redundancy for high-traffic roofs.",
    },
    {
      icon: Droplets,
      label: "Roof Coatings",
      href: "/commercial/roof-coatings",
      description:
        "Silicone, acrylic, and urethane restoration for roofs that qualify.",
    },
    {
      icon: PanelTop,
      label: "Metal Roofing",
      href: "/commercial/metal-roofing",
      description: "Standing seam, R-panel, PBR, and structural systems.",
    },
    {
      icon: Wrench,
      label: "Roof Repair",
      href: "/commercial/roof-repair",
      description: "Leaks traced, fixed, and documented — fast.",
    },
    {
      icon: Home,
      label: "Roof Replacement",
      href: "/commercial/roof-replacement",
      description: "Capital projects run like capital projects.",
    },
    {
      icon: Fan,
      label: "Roof Maintenance",
      href: "/commercial/roof-maintenance",
      description: "Scheduled care that prevents five-figure surprises.",
    },
    {
      icon: Sparkles,
      label: "Roof Washing",
      href: "/commercial/roof-washing",
      description:
        "Staining and growth removed, scoped by roof system and scheduled around operations.",
    },
  ] satisfies HubServiceCard[],
  process: {
    title: "How commercial projects run",
    steps: [
      {
        title: "Assessment & moisture data",
        text: "Cores and condition mapping establish what's really up there before anything is proposed.",
      },
      {
        title: "Engineered, itemized proposal",
        text: "System options with specs and line-item pricing — written for boards, owners, and procurement.",
      },
      {
        title: "Scheduling around operations",
        text: "Staging, phasing, and noisy work planned with your team so the building keeps working.",
      },
      {
        title: "Execution & documentation",
        text: "Daily watertight closes, as-built records, and warranty registration at closeout.",
      },
      {
        title: "Maintenance partnership",
        text: "Scheduled inspections and reports that protect the investment for its whole life.",
      },
    ],
  },
  sections: [
    {
      title: "Choosing a commercial system: the honest selector",
      paragraphs: [
        "No single system wins every building. TPO's welded seams and reflectivity earn it the biggest share of new low-slope work; EPDM's large sheets suit big open roofs; PVC earns its premium where grease or chemicals would attack other membranes; modified bitumen brings multi-ply redundancy to high-traffic roofs; a coating can restore a roof that still qualifies; and metal spans the gap from architectural standing seam to structural panels over open purlins. The table below is how we frame the first conversation — the actual recommendation follows core samples and a moisture assessment, not a brochure.",
      ],
      table: {
        title: "Commercial roof-system selector",
        columns: [
          "System",
          "Seam method",
          "Typical spec",
          "Best fit",
          "Primary strength",
          "Main limitation",
          "Relative cost",
        ],
        rows: [
          [
            "TPO",
            "Hot-air welded",
            "45–80 mil (60 common)",
            "Offices, retail, schools, most low-slope",
            "Welded seams + reflectivity",
            "Punctures near equipment without walk pads",
            "Moderate initial investment",
          ],
          [
            "EPDM",
            "Primer + seam tape",
            "45–90 mil (60 common)",
            "Large open roofs, simple geometries",
            "Big sheets, long track record, repairable",
            "Standard black absorbs heat; grease attacks it",
            "Moderate initial investment",
          ],
          [
            "PVC",
            "Hot-air welded",
            "~50–80 mil",
            "Restaurants, kitchens, some industrial",
            "Resistance to grease and many chemicals",
            "Compatibility must be verified per exposure",
            "Higher initial investment",
          ],
          [
            "Modified bitumen",
            "Multi-ply, adhered or welded",
            "Base + cap sheet",
            "High-traffic and service-heavy roofs",
            "Redundant plies, tolerates foot traffic",
            "More seams and laps to detail",
            "Moderate initial investment",
          ],
          [
            "Roof coating",
            "Fluid-applied",
            "Silicone, acrylic, urethane",
            "Sound, dry roofs that qualify",
            "Restores without tear-off",
            "Never a fix for wet insulation or bad decks",
            "Lower initial investment",
          ],
          [
            "Standing seam metal",
            "Concealed clips",
            "Commonly 24 ga",
            "Public-facing and steep-slope buildings",
            "Concealed fasteners, long service life",
            "Higher up-front; slope rules vary by profile",
            "Higher initial investment",
          ],
          [
            "R-panel / PBR",
            "Exposed fasteners",
            "Commonly 26 ga",
            "Shops, warehouses, metal buildings",
            "Economical, spans open purlins (PBR)",
            "Exposed washers need periodic inspection",
            "Lower initial investment",
          ],
          [
            "Structural metal",
            "Profile-dependent",
            "Commonly 24–22 ga",
            "PEMBs and no-deck buildings",
            "Engineered span over open framing",
            "Assembly is engineering-driven, not catalog-driven",
            "Depends heavily on the existing assembly",
          ],
        ],
        note: "Relative cost is directional only — the existing assembly, insulation, drainage, and access move every project. Specs vary by manufacturer and tested assembly.",
      },
      links: [
        { label: "Compare TPO and EPDM in depth", href: "/commercial/tpo" },
        {
          label: "See the commercial metal lineup",
          href: "/commercial/metal-roofing",
        },
        {
          label: "Find out if your roof qualifies for a coating",
          href: "/commercial/roof-coatings",
        },
      ],
    },
    {
      title: "What a commercial roof decision actually involves",
      paragraphs: [
        "Before any system is proposed, the existing roof has to be understood: core samples establish the assembly and layer count, moisture scanning maps any wet insulation, and the deck gets identified — because a recover over a wet or failing assembly just buries the problem. Code limits on roof layers, insulation R-value, tapered drainage, cover boards, edge metal, and wind-uplift zones all get settled in the proposal stage, in writing, where a board or owner can compare options line by line.",
        "The other half of commercial roofing is operational: staging that doesn't block your docks, phasing that keeps tenants and classrooms working, daily watertight tie-ins so an afternoon storm doesn't find an open roof, and closeout documentation — as-builts, warranty registration, and the manufacturer inspection where the selected warranty requires one. Buildings keep operating; the roof project has to fit around that, not the other way around.",
      ],
      links: [
        {
          label: "How capital replacements run",
          href: "/commercial/roof-replacement",
        },
        {
          label: "Set up planned maintenance",
          href: "/commercial/roof-maintenance",
        },
        { label: "Roofing by industry", href: "/commercial/industries" },
      ],
    },
  ] satisfies ProseSection[],
  faqs: [
    {
      question: "Do you handle small commercial repairs or only big projects?",
      answer:
        "Both. Repairs and maintenance are how most commercial relationships start with us — the reroof conversation comes when the roof actually needs it, with the condition history to prove it.",
    },
    {
      question: "Which flat-roof system is best?",
      answer:
        "The one that matches your building's exposure, drainage, traffic, and horizon. We install TPO, EPDM, PVC, modified bitumen, coatings, and metal — so the recommendation follows the assessment, not our inventory.",
    },
    {
      question:
        "Can you work with our board's or municipality's approval process?",
      answer:
        "Yes — itemized, spec-grade proposals designed for committee review and comparable bidding are standard practice for us.",
    },
    {
      question: "Do you offer maintenance contracts?",
      answer:
        "Yes — scheduled programs with photo-documented visits, small fixes handled on the spot, and per-building condition tracking across portfolios.",
    },
  ] satisfies FaqEntry[],
};
