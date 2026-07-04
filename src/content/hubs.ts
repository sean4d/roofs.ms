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
  TreePine,
  Wind,
  Wrench,
} from "lucide-react";

import type { FaqEntry } from "@/lib/schema";
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
  metaTitle: "Residential Roofing in Hattiesburg & South Mississippi",
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
      icon: Home,
      label: "Vinyl Siding",
      href: "/residential/vinyl-siding",
      description: "The low-maintenance exterior — no painting, no rot.",
    },
    {
      icon: Layers,
      label: "Fiber Cement Siding",
      href: "/residential/fiber-cement-siding",
      description:
        "The premium, storm-tough exterior with a painted-wood look.",
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
  ] satisfies HubServiceCard[],
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
  metaTitle: "Storm Damage Roof Repair in South Mississippi",
  metaDescription:
    "Hail, wind, hurricane, and tree damage — Southeast Roofing documents it, tarps it, helps with the insurance claim, and restores the roof. Hattiesburg-based, region-wide.",
  hero: {
    eyebrow: "Storm damage",
    headline: "When the weather turns, we answer",
    subhead:
      "Hail cells, straight-line winds, tropical systems — South Mississippi's weather earns its reputation. When your roof takes the hit, one local team handles the whole aftermath: documentation, emergency protection, the insurance claim, and the restoration.",
    photo: {
      src: stormPhotos.find((p) => p.category === "storm-damage")!.src,
      alt: stormPhotos.find((p) => p.category === "storm-damage")!.alt,
    },
    photoBadge: "Storm damage inspection",
  },
  damageTypes: [
    {
      icon: CloudLightning,
      title: "Hail damage",
      text: "Bruised shingles and dented metal that may not leak for months — but shorten the roof's life and are time-sensitive for claims.",
      photo: stormPhotos.find((p) => p.category === "hail-damage")!,
    },
    {
      icon: Wind,
      title: "Wind damage",
      text: "Creased, lifted, and missing shingles from straight-line winds and tropical systems — the region's most common storm claim.",
      photo: stormPhotos.find((p) => p.category === "wind-damage")!,
    },
    {
      icon: Layers,
      title: "Missing shingles",
      text: "Open spots that let the next rain straight through to the decking. Small to see, urgent to fix.",
      photo: stormPhotos.find((p) => p.category === "missing-shingles")!,
    },
    {
      icon: TreePine,
      title: "Tree & debris impact",
      text: "From a limb strike to a trunk through the ridge — structural checks, emergency protection, and repair in the right order.",
      photo: stormPhotos.find((p) => p.category === "tree-damage")!,
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
  metaTitle: "Metal Roofing in Hattiesburg & South Mississippi",
  metaDescription:
    "Metal roofing for homes and commercial buildings across South Mississippi — standing seam, panel systems, honest metal-vs-shingle guidance, and free estimates.",
  hero: {
    eyebrow: "Metal roofing",
    headline: "Metal roofing, for homes and businesses alike",
    subhead:
      "Metal isn't a separate trade for us — it's a roofing system we install across both of our divisions, matched to the structure it protects. Start with the path that fits your building.",
    chips: ["Standing seam", "Exposed fastener", "R-panel", "26 & 29 gauge"],
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
        "Standing seam is near-zero maintenance",
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
  metaTitle: "Roof Financing in Hattiesburg & South Mississippi",
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
  metaTitle: "Commercial Roofing in Hattiesburg & South Mississippi",
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
    "BBB Accredited · A Rating",
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
      description: "Restore a sound roof for a fraction of replacement.",
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
