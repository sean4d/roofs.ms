import {
  Banknote,
  CalendarClock,
  ClipboardCheck,
  CloudRain,
  Droplets,
  Layers,
  Search,
  Thermometer,
  TriangleAlert,
  Waves,
  Wind,
  Wrench,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Commercial service pages (PRD §4.2, Phase 4). Commercial copy for
 * property managers, facility directors, boards, and owners' reps —
 * longer sales cycles, budget approvals, operations sensitivity. Unique
 * copy per system, qualitative industry facts only; no invented specs,
 * warranties, or project history (PRD §0.2).
 *
 * Imagery: no honest flat-roof detail photography exists yet
 * ([NEEDS: commercial project photos]) — heroes use the chips treatment.
 */

export const commercialServices: ServiceContent[] = [
  /* ------------------------------------------------------------------ */
  /* TPO                                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "tpo",
    path: "/commercial/tpo",
    name: "TPO Roofing",
    metaTitle: "TPO Commercial Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "TPO single-ply roofing for South Mississippi facilities — heat-welded seams, reflective white membrane, and installation scheduled around your operations.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "TPO: today's workhorse flat-roof membrane",
      subhead:
        "White, reflective, heat-welded single-ply — TPO has become the most installed low-slope system in the country for good reason. We install and service it across South Mississippi's offices, retail, and facilities.",
      chips: ["Single-ply membrane", "Heat-welded seams", "Reflective white"],
    },
    intro: {
      title: "Why TPO dominates low-slope roofing",
      paragraphs: [
        "TPO's appeal is practical: seams are hot-air welded into a single monolithic sheet rather than glued or taped, the white surface reflects the Mississippi sun instead of soaking it in, and the installed cost is competitive with every other membrane on the market. For a building with rooftop HVAC and a cooling bill, that reflectivity is money every month.",
        "The system's weak point is the same as its strength — the welds. TPO installed by a crew that rushes the seam work fails years early; TPO welded correctly performs for decades. That's an installation-quality story, which is exactly where a local contractor you can hold accountable matters.",
      ],
    },
    signs: {
      title: "When TPO is the right call",
      items: [
        {
          icon: Thermometer,
          title: "Cooling costs matter",
          text: "Reflective white membrane takes real load off rooftop units through a Gulf-region summer.",
        },
        {
          icon: Layers,
          title: "Replacing an aging membrane",
          text: "TPO is a natural successor to worn single-ply, mod-bit, or built-up systems.",
        },
        {
          icon: Banknote,
          title: "Budget discipline",
          text: "Competitive installed cost with a long service life — a defensible line item for any board.",
        },
        {
          icon: CloudRain,
          title: "Ponding-prone roofs",
          text: "Welded seams tolerate standing water far better than glued or taped alternatives.",
        },
      ],
    },
    approach: {
      title: "How we install TPO",
      steps: [
        {
          title: "Assessment & core checks",
          text: "We evaluate the existing assembly, insulation, and decking — recover and full-replacement options priced honestly.",
        },
        {
          title: "Spec and proposal",
          text: "Membrane thickness, attachment method, insulation package, and details — written out, itemized, no mystery.",
        },
        {
          title: "Installation around operations",
          text: "Staging, access, and noisy phases scheduled with your team so the building keeps working.",
        },
        {
          title: "Seam quality control",
          text: "Welds probed and checked as we go — the detail that decides how the roof ages.",
        },
      ],
    },
    faqs: [
      {
        question: "How long does a TPO roof last?",
        answer:
          "Typically 20–30 years depending on membrane thickness, installation quality, and maintenance. The two biggest levers are seam workmanship on day one and keeping drains and penetrations serviced over the years.",
      },
      {
        question: "Can TPO be installed over our existing roof?",
        answer:
          "Often, yes — a recover over the existing assembly avoids tear-off cost and disruption when the substrate is dry and sound. We take core samples to verify moisture before recommending it; recovering a wet roof just buries a problem.",
      },
      {
        question: "TPO vs. EPDM — which should we choose?",
        answer:
          "TPO wins on reflectivity and welded seams; EPDM wins on decades of track record and simplicity. Building use, drainage, and budget decide it — we install both, so our recommendation follows your roof, not our inventory.",
      },
      {
        question: "Will the installation disrupt our operations?",
        answer:
          "Managing that is most of the job. Staging areas, work hours, odor and noise-sensitive phases — all planned with your team up front. Most TPO work proceeds with the building fully occupied.",
      },
    ],
    related: [
      {
        label: "EPDM Roofing",
        href: "/commercial/epdm",
        description:
          "The proven rubber-membrane alternative — compare honestly.",
      },
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description:
          "If your current roof has life left, restoration may beat replacement.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description:
          "Planned maintenance keeps a new membrane performing for decades.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* EPDM                                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "epdm",
    path: "/commercial/epdm",
    name: "EPDM Roofing",
    metaTitle: "EPDM Commercial Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "EPDM rubber-membrane roofing for South Mississippi facilities — a half-century track record, simple detailing, and dependable performance in heat and storms.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "EPDM: the membrane with a 50-year track record",
      subhead:
        "Synthetic rubber that's been protecting flat roofs since the 1960s. Simple, flexible, proven — EPDM remains one of the most dependable low-slope systems money can buy.",
      chips: ["Rubber membrane", "Proven for decades", "Large seamless sheets"],
    },
    intro: {
      title: "Simplicity that ages well",
      paragraphs: [
        "EPDM's virtue is that there's little to go wrong: a single synthetic rubber sheet, manufactured in very large panels, with fewer seams to manage than almost any other system. It stays flexible through decades of thermal cycling — Mississippi's daily heat swings barely bother it — and repairs, when eventually needed, are straightforward.",
        "Classic EPDM is black and absorbs heat, which suits some buildings and penalizes others; white EPDM options and cover strategies exist where reflectivity matters. We'll tell you plainly whether your building wants EPDM's durability or a reflective membrane's efficiency — and back either answer with numbers.",
      ],
    },
    signs: {
      title: "When EPDM makes sense",
      items: [
        {
          icon: CalendarClock,
          title: "You want maximum service life",
          text: "Well-installed EPDM roofs routinely run 25–30+ years — among the longest-lived membranes.",
        },
        {
          icon: Layers,
          title: "Large, open roof areas",
          text: "Huge sheet sizes mean fewer seams on warehouses and big rectangular roofs.",
        },
        {
          icon: Wrench,
          title: "Repair simplicity matters",
          text: "Patches and detail repairs on EPDM are quick and reliable — good for long ownership horizons.",
        },
        {
          icon: Wind,
          title: "Storm resilience",
          text: "Flexible membrane handles building movement and debris impact gracefully.",
        },
      ],
    },
    approach: {
      title: "How we install EPDM",
      steps: [
        {
          title: "Assembly evaluation",
          text: "Deck condition, insulation value, and drainage reviewed before any system is proposed.",
        },
        {
          title: "Attachment method to suit the building",
          text: "Fully adhered, mechanically fastened, or ballasted — each has its place; we spec what fits yours.",
        },
        {
          title: "Detail-first installation",
          text: "Penetrations, edges, and drains get the careful work — field membrane is the easy part.",
        },
        {
          title: "Documentation & maintenance plan",
          text: "As-installed photos and a maintenance schedule that protects your investment.",
        },
      ],
    },
    faqs: [
      {
        question: "Is EPDM outdated compared to TPO?",
        answer:
          "No — it's the most time-proven membrane in the industry, and manufacturers keep improving it. TPO took market share on reflectivity and welded seams, but EPDM's longevity record is unmatched. Different strengths, both current.",
      },
      {
        question: "Does black EPDM make the building hotter?",
        answer:
          "A black roof does absorb more heat than a white one — how much that matters depends on your insulation and rooftop equipment. Where cooling economics dominate, we'll quote reflective options alongside for honest comparison.",
      },
      {
        question: "How are EPDM seams handled?",
        answer:
          "Modern EPDM seams use factory-applied tape systems that are dramatically more reliable than the old field-glued seams. Fewer seams overall (large sheets) plus better seam technology is why the system's reputation keeps improving.",
      },
      {
        question:
          "Can you repair our existing EPDM roof instead of replacing it?",
        answer:
          "Frequently, yes. EPDM repairs and partial restorations are routine work — and if the membrane is largely sound, a coating restoration may buy years at a fraction of replacement cost. The assessment tells us which path the numbers favor.",
      },
    ],
    related: [
      {
        label: "TPO Roofing",
        href: "/commercial/tpo",
        description:
          "The reflective, heat-welded alternative — compare honestly.",
      },
      {
        label: "Commercial Roof Repair",
        href: "/commercial/roof-repair",
        description:
          "Leaks and membrane damage handled with minimal disruption.",
      },
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description: "Restore a sound EPDM roof instead of replacing it.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* PVC                                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "pvc",
    path: "/commercial/pvc",
    name: "PVC Roofing",
    metaTitle: "PVC Commercial Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "PVC single-ply roofing for South Mississippi — hot-welded seams and standout resistance to grease and chemicals, ideal for restaurants and food service.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "PVC: the specialist for demanding roofs",
      subhead:
        "Heat-welded like TPO, but with a chemistry that shrugs off grease, oils, and chemical exposure. If your roof lives above a kitchen or a process floor, PVC is usually the answer.",
      chips: ["Hot-welded seams", "Grease & chemical resistant", "Reflective"],
    },
    intro: {
      title: "Where PVC earns its premium",
      paragraphs: [
        "Every restaurant exhaust fan rains a fine mist of grease onto the roof around it — and grease degrades most membranes years ahead of schedule. PVC's chemistry resists it, which is why food service, kitchens, and processing facilities spec PVC almost by default. Add hot-welded seams and strong reflectivity, and it's a premium membrane that earns its price on the right building.",
        "PVC also carries one of the longest performance histories among weldable membranes. For buildings without chemical exposure, TPO usually pencils out better — and we'll tell you so. This is about matching chemistry to what your roof actually endures.",
      ],
    },
    signs: {
      title: "When PVC is the right spec",
      items: [
        {
          icon: TriangleAlert,
          title: "Restaurants & kitchens",
          text: "Grease exhaust destroys ordinary membranes — PVC is built for it.",
        },
        {
          icon: Droplets,
          title: "Chemical or oil exposure",
          text: "Process facilities and maintenance areas with rooftop discharge need resistant chemistry.",
        },
        {
          icon: Waves,
          title: "Ponding concerns",
          text: "Welded seams and PVC's plasticized flexibility handle slow-draining roofs well.",
        },
        {
          icon: Thermometer,
          title: "Reflectivity wanted",
          text: "White PVC performs like TPO against Gulf-region cooling loads.",
        },
      ],
    },
    approach: {
      title: "How we install PVC",
      steps: [
        {
          title: "Exposure assessment",
          text: "We map what the roof actually endures — exhaust, discharge, traffic — and spec accordingly.",
        },
        {
          title: "Itemized proposal",
          text: "Membrane, insulation, and detail package priced line by line against the alternatives.",
        },
        {
          title: "Welded installation",
          text: "Hot-air welded seams, reinforced details at curbs and penetrations — checked as we go.",
        },
        {
          title: "Service planning",
          text: "High-exposure roofs deserve scheduled checkups; we set the cadence with you.",
        },
      ],
    },
    faqs: [
      {
        question: "Why is PVC more expensive than TPO?",
        answer:
          "The resin and plasticizers cost more to produce, and the membrane carries specialist capabilities — chemical resistance chief among them. On a roof that needs those capabilities it's the economical choice; on one that doesn't, we'll usually point you to TPO.",
      },
      {
        question:
          "Our restaurant roof keeps failing around the exhaust fans. Is that fixable?",
        answer:
          "That's the classic grease-degradation pattern, and yes — PVC in the exposure zones (or across the roof) is the standard fix. We also detail grease containment at the fans themselves, which extends any membrane's life.",
      },
      {
        question: "How long does PVC last?",
        answer:
          "Comparable to other premium single-plies — commonly 20–30 years with sound installation and maintenance, even under exposures that would halve the life of other membranes.",
      },
      {
        question: "Can PVC be welded to TPO?",
        answer:
          "No — the chemistries are incompatible for welding, which matters when patching or tying into existing roofs. It's one of the details we verify before any repair or partial replacement on an existing single-ply roof.",
      },
    ],
    related: [
      {
        label: "TPO Roofing",
        href: "/commercial/tpo",
        description:
          "The value single-ply for roofs without chemical exposure.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description: "High-exposure roofs benefit most from scheduled service.",
      },
      {
        label: "Commercial Roof Repair",
        href: "/commercial/roof-repair",
        description: "Membrane-matched repairs, done with minimal disruption.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Modified bitumen                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "modified-bitumen",
    path: "/commercial/modified-bitumen",
    name: "Modified Bitumen Roofing",
    metaTitle: "Modified Bitumen Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "Modified bitumen roofing for South Mississippi commercial buildings — multi-ply asphalt redundancy, foot-traffic durability, and proven storm performance.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "Modified bitumen: layered toughness",
      subhead:
        "Asphalt engineering in rolled form — multiple reinforced plies that shrug off foot traffic, hail, and the abuse a working roof takes. The system of choice when durability outranks everything.",
      chips: ["Multi-ply redundancy", "Foot-traffic tough", "Granulated cap"],
    },
    intro: {
      title: "Redundancy as a design principle",
      paragraphs: [
        "Single-ply membranes stake everything on one layer. Modified bitumen stacks two or more reinforced asphalt plies, so damage has to get through the system, not just a sheet. On roofs with regular maintenance traffic — HVAC techs, satellite installers, window crews — that redundancy is the difference between a scuff and a leak.",
        "Modern mod-bit installs with far more flexibility than the old hot-mop days: cold-applied adhesives and self-adhered sheets mean most projects need no kettles and no open flame. The granulated cap sheet takes UV like a shingle does, and repairs decades from now remain simple asphalt work.",
      ],
    },
    signs: {
      title: "When modified bitumen fits",
      items: [
        {
          icon: Wrench,
          title: "Regular rooftop traffic",
          text: "Multi-ply systems tolerate technicians and equipment service better than single-ply.",
        },
        {
          icon: TriangleAlert,
          title: "Hail and debris exposure",
          text: "Thick, reinforced layers resist puncture from what storms drop on a roof.",
        },
        {
          icon: Layers,
          title: "Smaller or complex roofs",
          text: "Rolled goods detail neatly around penetrations and equipment-dense layouts.",
        },
        {
          icon: CalendarClock,
          title: "Long-hold ownership",
          text: "Straightforward repairs keep the system serviceable deep into its life.",
        },
      ],
    },
    approach: {
      title: "How we install modified bitumen",
      steps: [
        {
          title: "System design",
          text: "Base and cap configuration, attachment, and insulation matched to the building and budget.",
        },
        {
          title: "Flame-free methods where possible",
          text: "Cold-applied and self-adhered installation for occupied buildings — no kettle, no torch odor.",
        },
        {
          title: "Detail redundancy",
          text: "Multi-ply flashings at walls, curbs, and drains — the places roofs actually fail.",
        },
        {
          title: "Walkway planning",
          text: "Protected paths to serviced equipment, so tomorrow's HVAC visit doesn't become next year's leak.",
        },
      ],
    },
    faqs: [
      {
        question: "Is modified bitumen old technology?",
        answer:
          "It's mature technology — which on a roof is a compliment. The materials keep improving (self-adhered sheets, cold adhesives, better reinforcements), and its multi-ply redundancy remains something single-ply systems simply don't offer.",
      },
      {
        question: "Does installation involve torches?",
        answer:
          "Not necessarily. Torch application is one method, but self-adhered and cold-applied systems handle most projects — and they're what we prefer over occupied buildings.",
      },
      {
        question: "How does mod-bit handle Mississippi heat?",
        answer:
          "Asphalt systems are engineered for solar abuse, and granulated caps carry reflective options. Like any dark-capable roof, color choice and insulation determine the cooling-cost picture — we run that math in the proposal.",
      },
      {
        question: "What maintenance does it need?",
        answer:
          "Modest and predictable: keep drains clear, inspect after major storms, and reseal exposed details on schedule. Its failure modes are slow and visible — the opposite of surprise leaks.",
      },
    ],
    related: [
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description:
          "Aging mod-bit is a prime candidate for coating restoration.",
      },
      {
        label: "TPO Roofing",
        href: "/commercial/tpo",
        description: "The single-ply comparison point for most buildings.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description: "Scheduled care that keeps layered systems serviceable.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Roof coatings                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-coatings",
    path: "/commercial/roof-coatings",
    name: "Roof Coatings & Restoration",
    metaTitle: "Commercial Roof Coatings in Mississippi | Southeast Roofing",
    metaDescription:
      "Silicone and acrylic roof coatings across South Mississippi — restore a sound commercial roof for a fraction of replacement cost, with no tear-off and no downtime.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "Restoration: the replacement you might not need",
      subhead:
        "If the roof under your problems is still fundamentally sound, a fluid-applied coating system can seal it, cool it, and buy a decade or more — at a fraction of replacement cost, with no tear-off and no operational shutdown.",
      chips: ["Silicone & acrylic", "No tear-off", "Reflective finish"],
    },
    intro: {
      title: "The honest math of coating vs. replacing",
      paragraphs: [
        "Plenty of 'failed' commercial roofs aren't failed at all — the membrane is tired at the seams and details while the field is sound. Restoration attacks exactly that: repair the failure points, then seal the whole roof under a seamless fluid-applied membrane. Cost lands far below replacement, the work happens over your operating business, and the bright white finish cuts summer heat gain from day one.",
        "The honesty requirement is the assessment. Coating a roof with wet insulation or widespread membrane failure wastes your money — it needs moisture scanning and core checks first, and when the verdict is replacement, we'll show you why. When restoration is viable, it's one of the best returns in commercial roofing.",
      ],
    },
    signs: {
      title: "Signs your roof is a restoration candidate",
      items: [
        {
          icon: Search,
          title: "Leaks at seams and details",
          text: "Failure concentrated at flashings and seams — not through the field membrane — restores well.",
        },
        {
          icon: CalendarClock,
          title: "Aging but intact",
          text: "A membrane in its later years that's still dry underneath is the ideal candidate.",
        },
        {
          icon: Banknote,
          title: "Capital budget pressure",
          text: "Restoration costs a fraction of replacement and can often be expensed differently — ask your accountant.",
        },
        {
          icon: Thermometer,
          title: "Heat-soaked building",
          text: "Reflective coatings drop roof surface temperatures dramatically in a Mississippi summer.",
        },
      ],
    },
    approach: {
      title: "How restoration works",
      steps: [
        {
          title: "Moisture survey first",
          text: "Core samples and moisture checks verify the roof qualifies — no coating over wet insulation, ever.",
        },
        {
          title: "Repair the failure points",
          text: "Seams, flashings, penetrations, and any saturated sections fixed before a drop of coating goes down.",
        },
        {
          title: "Fluid-applied system",
          text: "Silicone or acrylic, chosen for your roof's ponding and exposure profile, applied at spec thickness.",
        },
        {
          title: "Documented for the future",
          text: "Thickness readings and photos on file — restorations can typically be recoated later, extending life again.",
        },
      ],
    },
    faqs: [
      {
        question: "How much does coating save versus replacement?",
        answer:
          "Typically a large fraction of the cost — restoration avoids tear-off, disposal, new insulation, and most of the labor. Exact numbers depend on your roof, which is why the assessment and itemized proposal come first.",
      },
      {
        question: "Silicone or acrylic — what's the difference?",
        answer:
          "Silicone tolerates ponding water and weathers UV superbly, making it the default on slow-draining roofs; acrylics cost less and perform well on roofs that drain properly. The roof's drainage profile usually makes the choice.",
      },
      {
        question: "How long does a coating restoration last?",
        answer:
          "Systems are commonly specified in 10–20 year terms depending on thickness, and a sound restoration can usually be recoated when that term ends — repeatable life extension without tear-off.",
      },
      {
        question: "Will you coat a roof that shouldn't be coated?",
        answer:
          "No. If moisture scanning shows saturated insulation or the membrane is broadly failed, coating is the wrong spend and we'll say so — with the replacement comparison priced in the same proposal so you can decide with full information.",
      },
    ],
    related: [
      {
        label: "Commercial Roof Replacement",
        href: "/commercial/roof-replacement",
        description:
          "When the assessment says replace, here's what that looks like.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description:
          "Maintenance is what keeps a restored roof performing to term.",
      },
      {
        label: "Commercial Roof Repair",
        href: "/commercial/roof-repair",
        description: "Isolated problems fixed without a full restoration.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Roof maintenance                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-maintenance",
    path: "/commercial/roof-maintenance",
    name: "Commercial Roof Maintenance",
    metaTitle: "Commercial Roof Maintenance in MS | Southeast Roofing",
    metaDescription:
      "Planned commercial roof maintenance across South Mississippi — scheduled inspections, documentation, and small fixes that prevent five-figure surprises.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "The cheapest roof work is the scheduled kind",
      subhead:
        "Commercial roofs rarely fail suddenly — they fail slowly, visibly, and preventably. A maintenance program catches the $500 problem before it becomes the $50,000 one.",
      chips: [
        "Scheduled inspections",
        "Photo documentation",
        "Priority response",
      ],
    },
    intro: {
      title: "Why planned maintenance pays for itself",
      paragraphs: [
        "Nearly every commercial roof disaster we're called to started as something small: a clogged drain ponding water, a split pitch pan, a fastener backing out under a seam. Caught on a scheduled inspection, each is a minor line item. Discovered after a tropical rain event has flooded a server room, the same defect is a capital emergency plus interior damage plus downtime.",
        "A program also protects paperwork: manufacturer warranties on commercial systems generally expect documented maintenance, and the inspection record we build becomes evidence when a storm claim needs to distinguish new damage from old wear. Facility directors get a documented asset instead of a question mark over their heads.",
      ],
    },
    signs: {
      title: "What a program visit covers",
      items: [
        {
          icon: Search,
          title: "Full-surface inspection",
          text: "Membrane, seams, flashings, and penetrations — walked and photographed on schedule.",
        },
        {
          icon: Droplets,
          title: "Drainage service",
          text: "Drains, scuppers, and gutters cleared — ponding is the quiet killer of flat roofs.",
        },
        {
          icon: Wrench,
          title: "Small repairs on the spot",
          text: "Minor seam, sealant, and detail fixes handled during the visit, not quoted for later.",
        },
        {
          icon: ClipboardCheck,
          title: "Condition report",
          text: "Photo documentation and a straight-language condition summary after every visit.",
        },
      ],
    },
    approach: {
      title: "How the program works",
      steps: [
        {
          title: "Baseline assessment",
          text: "We document your roof's current condition end to end — the starting point everything is measured against.",
        },
        {
          title: "A cadence that fits the roof",
          text: "Typically semi-annual plus post-storm checks; age, system, and tree exposure tune the schedule.",
        },
        {
          title: "Visit, fix, document",
          text: "Each visit ends with the small stuff fixed and a photo report in your inbox.",
        },
        {
          title: "Budget forecasting",
          text: "You'll see repairs and eventual replacement coming years out — no capital surprises.",
        },
      ],
    },
    faqs: [
      {
        question: "What does a maintenance program cost?",
        answer:
          "It depends on roof size, system, and access — programs are quoted flat and itemized after the baseline assessment. Against one prevented interior loss, a program typically funds itself many times over.",
      },
      {
        question: "Does maintenance really extend roof life?",
        answer:
          "Substantially. Ponding, clogged drains, and small breaches are what turn 20-year roofs into 12-year roofs. Removing those factors on schedule is the whole game — it's the facilities equivalent of changing the oil.",
      },
      {
        question: "We have multiple buildings. Can you cover a portfolio?",
        answer:
          "Yes — portfolio scheduling is where programs shine: one cadence, one report format, and one contact across all your roofs, with per-building condition tracking.",
      },
      {
        question: "What happens when you find storm damage on a visit?",
        answer:
          "You get documented before-and-after evidence tied to dates — exactly what an insurance claim needs. We flag it immediately, photograph it thoroughly, and assist through the claim if you file one.",
      },
    ],
    related: [
      {
        label: "Commercial Roof Repair",
        href: "/commercial/roof-repair",
        description: "For the problems that are already leaking today.",
      },
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description:
          "Well-maintained roofs become restoration candidates, not tear-offs.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description:
          "Programs tuned to schools, churches, industrial, and more.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Commercial roof replacement                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-replacement",
    path: "/commercial/roof-replacement",
    name: "Commercial Roof Replacement",
    metaTitle: "Commercial Roof Replacement in MS | Southeast Roofing",
    metaDescription:
      "Commercial roof replacement across South Mississippi — engineered specs, itemized proposals, and installation phased around your operations.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "Replacement, engineered around your operations",
      subhead:
        "A commercial reroof is a capital project, not a purchase. We run it like one: assessment, written spec, itemized proposal, and a build phased so your building keeps doing its job.",
      chips: ["Written spec", "Phased scheduling", "All major systems"],
    },
    intro: {
      title: "A capital project treated like one",
      paragraphs: [
        "Commercial replacement decisions move through budgets, boards, and bid processes — so the documentation has to stand on its own. Our proposals are engineered and itemized: existing assembly findings, the proposed system with insulation values, attachment, and details, priced line by line so a committee can interrogate every number without a phone call.",
        "Then execution: staging, crane days, noisy phases, and odor-sensitive work all scheduled with your team in advance. Tenants notified, operations protected, site controlled. We've built the process so that the disruptive part of a reroof is the part you planned for — nothing else.",
        "System-agnostic on purpose: TPO, EPDM, PVC, modified bitumen, and metal are all on our truck. The building and the budget pick the system, not the contractor's inventory.",
      ],
    },
    signs: {
      title: "Signs replacement has arrived",
      items: [
        {
          icon: Droplets,
          title: "Chronic, spreading leaks",
          text: "When repairs stop holding and new leaks outpace fixes, the membrane is telling you something.",
        },
        {
          icon: Waves,
          title: "Saturated insulation",
          text: "Wet insulation can't be coated over and kills energy performance — core samples confirm it.",
        },
        {
          icon: CalendarClock,
          title: "End of service life",
          text: "A membrane at the end of its term fails unpredictably — ahead of it, you control the timing.",
        },
        {
          icon: Banknote,
          title: "Repair spend climbing",
          text: "When annual repair costs rival financing a new roof, the math has flipped.",
        },
      ],
    },
    approach: {
      title: "How a commercial replacement runs",
      steps: [
        {
          title: "Assessment & core sampling",
          text: "Moisture mapping and assembly cores establish what's actually up there and what can stay.",
        },
        {
          title: "Engineered, itemized proposal",
          text: "System options with insulation, attachment, and detail specs — priced for board review.",
        },
        {
          title: "Phased execution",
          text: "Sections opened and closed watertight daily; staging and noise scheduled with your operations.",
        },
        {
          title: "Closeout documentation",
          text: "As-built photos, warranty registration, and a maintenance schedule to protect the investment.",
        },
      ],
    },
    faqs: [
      {
        question: "Can the building stay occupied during replacement?",
        answer:
          "Almost always, yes. Work is phased, each day's section is closed watertight, and the loud or odor-producing phases are scheduled around your hours. Occupied replacements are the norm, not the exception.",
      },
      {
        question: "Recover or full tear-off — how do you decide?",
        answer:
          "Moisture data decides. A dry, sound assembly can often take a recover board and new membrane (less cost, less disruption); saturated or failing assemblies come off. We show you the core results either way.",
      },
      {
        question: "How do you handle bid and procurement processes?",
        answer:
          "Our proposals are written to spec-and-bid standards — itemized scope, system data, and references available — so boards and procurement teams can evaluate them properly.",
      },
      {
        question: "What does a commercial replacement cost?",
        answer:
          "It varies enormously with size, system, insulation, and access — which is why we don't quote from the parking lot. The assessment is free and the proposal is itemized to the line, so you'll know exactly where every dollar goes.",
      },
    ],
    related: [
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description:
          "The assessment sometimes says restore instead — for far less.",
      },
      {
        label: "TPO Roofing",
        href: "/commercial/tpo",
        description: "The most common replacement system, explained.",
      },
      {
        label: "Commercial Metal Roofing",
        href: "/commercial/metal-roofing",
        description: "Standing seam and panel systems for the long horizon.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Commercial roof repair                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-repair",
    path: "/commercial/roof-repair",
    name: "Commercial Roof Repair",
    metaTitle: "Commercial Roof Repair in Mississippi | Southeast Roofing",
    metaDescription:
      "Commercial roof leak response across South Mississippi — membrane-matched repairs, documented causes, and fixes that respect your operations.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "Leaks stopped. Causes documented. Operations respected.",
      subhead:
        "A leaking commercial roof is an operations problem first — inventory, tenants, equipment, liability. We respond fast, fix the actual cause, and leave you a documented record of both.",
      chips: ["All membrane types", "Rapid response", "Photo-documented"],
    },
    intro: {
      title: "Commercial repair is diagnosis first",
      paragraphs: [
        "Water travels farther on a flat roof than anywhere else — along seams, under insulation, down deck flutes — surfacing thirty feet from where it entered. Patching the stain location wastes your money; finding the entry point is the skill. We trace, we fix the source, and we photograph both so you know exactly what happened and what was done.",
        "Materials matter too: a TPO roof needs welded TPO details, EPDM needs compatible rubber work, mod-bit needs asphalt repairs. Our crews carry and work all of them, so the fix matches the system instead of becoming the next failure point.",
      ],
    },
    signs: {
      title: "Call us when you see",
      items: [
        {
          icon: Droplets,
          title: "Ceiling tiles staining",
          text: "Interior water marks mean the leak is established — the sooner it's traced, the smaller the bill.",
        },
        {
          icon: Waves,
          title: "Ponding that won't drain",
          text: "Standing water 48 hours after rain accelerates every failure mode a roof has.",
        },
        {
          icon: Wind,
          title: "Storm-lifted sections",
          text: "Billowed membrane or displaced edge metal after wind — urgent before the next front.",
        },
        {
          icon: TriangleAlert,
          title: "Open seams or punctures",
          text: "Visible splits, fastener backout, or trade damage from rooftop work.",
        },
      ],
    },
    approach: {
      title: "How we handle commercial repairs",
      steps: [
        {
          title: "Rapid triage",
          text: "Active leaks get contained fast — temporary measures if weather demands, permanent fix scheduled immediately.",
        },
        {
          title: "Trace to the source",
          text: "Moisture paths followed to the true entry point, not just the symptom location.",
        },
        {
          title: "Membrane-matched repair",
          text: "Welded, taped, or asphalt-applied to match your system and preserve any warranty.",
        },
        {
          title: "Document and advise",
          text: "Photos of cause and repair, plus a straight read on whether this is isolated or a pattern.",
        },
      ],
    },
    faqs: [
      {
        question: "How fast can you respond to an active leak?",
        answer:
          "Active commercial leaks get triaged ahead of scheduled work — typically same-day or next-day within our service area, honestly communicated when a regional storm has everyone calling at once.",
      },
      {
        question: "Will a repair void our manufacturer warranty?",
        answer:
          "Improper repairs can — which is why repairs must match the system and, on warranted roofs, follow the manufacturer's requirements. Tell us what warranty you carry and we work within it.",
      },
      {
        question: "Repair, restore, or replace — how do we know?",
        answer:
          "Isolated damage on a sound roof: repair. Widespread detail failure on a dry roof: restoration candidate. Saturated insulation or systemic failure: replacement conversation. Our documentation shows you which one you're in.",
      },
      {
        question: "Can you repair a roof another contractor installed?",
        answer:
          "Constantly. Most of our commercial repair work is on roofs we didn't install — including systems whose original installers are long gone.",
      },
    ],
    related: [
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description:
          "The program that catches these problems before they leak.",
      },
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description: "When repairs cluster, restoration may reset the clock.",
      },
      {
        label: "Commercial Roof Replacement",
        href: "/commercial/roof-replacement",
        description: "The endgame, run like the capital project it is.",
      },
    ],
  },
];

export function getCommercialService(slug: string): ServiceContent | undefined {
  return commercialServices.find((service) => service.slug === slug);
}
