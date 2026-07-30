import {
  Banknote,
  CalendarClock,
  ClipboardCheck,
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
 * warranties, or project history (PRD §0.2). Dollar figures are banned
 * site-wide (owner directive 2026-07-30) — every page carries a
 * costFactors block instead.
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
        "TPO's appeal is practical: seams are hot-air welded into a single monolithic sheet rather than glued or taped, the white surface reflects the Mississippi sun instead of soaking it in, and the installed cost is competitive with every other membrane on the market. On a building with rooftop HVAC, that reflectivity can take real load off the cooling equipment — though the actual energy effect depends on your insulation, the building, and how it runs.",
        "The system's weak point is the same as its strength — the welds. TPO installed by a crew that rushes the seam work fails years early; TPO welded correctly performs for decades. That's an installation-quality story, which is exactly where a local contractor you can hold accountable matters.",
      ],
    },
    sections: [
      {
        title: "45, 60, or 80 mil — picking a thickness",
        paragraphs: [
          "TPO membrane is sold in nominal thicknesses, most commonly 45, 60, and 80 mil (a mil is one thousandth of an inch, so 60 mil is a little over a sixteenth of an inch). Thicker sheet means more material over the internal reinforcement — more weathering allowance and more resistance to scuffs and punctures — at a higher material price. Nominal values and exact constructions vary by manufacturer, which is why the proposal names the specific product.",
          "For most South Mississippi commercial buildings, 60 mil has become a common specification: enough thickness margin for a realistic service life without paying for capability the roof will never use. 45 mil suits budget-driven projects with low rooftop traffic; 80 mil earns its premium on roofs with heavy equipment service or where the owner wants the longest available warranty terms.",
        ],
        table: {
          title: "TPO thickness and attachment at a glance",
          columns: [
            "Nominal thickness",
            "Where it's commonly specified",
            "Typical attachment options",
            "Considerations",
          ],
          rows: [
            [
              "45 mil",
              "Budget-conscious projects, low rooftop traffic",
              "Mechanically attached; fully adhered",
              "Thinnest weathering allowance; shortest warranty terms commonly offered",
            ],
            [
              "60 mil",
              "The common commercial spec for offices, retail, warehouses",
              "Mechanically attached; fully adhered; induction-welded",
              "Balanced thickness, availability, and warranty options",
            ],
            [
              "80 mil",
              "High-traffic roofs, long warranty terms, demanding owners",
              "Fully adhered; mechanically attached; induction-welded",
              "Highest material cost; greatest puncture and weathering margin",
            ],
          ],
          note: "Representative pairings — nominal thicknesses, available attachment systems, and warranty terms vary by manufacturer and by the specific assembly.",
        },
      },
      {
        title: "What's actually inside the sheet",
        paragraphs: [
          "TPO is a reinforced thermoplastic: two layers of polymer sandwiching a fabric reinforcement (a scrim) that gives the sheet its tear strength and dimensional stability. The top layer carries the weathering package — the UV stabilizers and pigments that determine how the membrane ages under a Gulf-region sun.",
          "Like every membrane, TPO needs a continuous substrate underneath — insulation boards and, on better assemblies, a cover board between insulation and membrane that stiffens the surface against hail, dropped tools, and foot traffic. No membrane spans open framing; the boards below the sheet are separate assembly components, and they matter as much as the membrane itself.",
        ],
        links: [
          {
            label: "Plan maintenance for a new membrane",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
      {
        title: "Hot-air welding — where TPO roofs are won or lost",
        paragraphs: [
          "TPO seams are fused with hot air: a machine or hand welder heats both sheets until the thermoplastic surfaces melt together under pressure, creating a bond that becomes part of the membrane rather than a glued joint on top of it. Done right, the seam is as strong as the sheet.",
          "Weld quality depends on temperature, machine speed, pressure, the condition of the membrane surfaces, the weather during welding, and the technician running the equipment — which is why we probe and check completed seams following the manufacturer's procedures as the work progresses, not after the crew has left. A weld that looked fine from ten feet away is exactly the kind of defect that surfaces as a leak three years later.",
        ],
      },
      {
        title: "Mechanically attached, fully adhered, or induction-welded",
        paragraphs: [
          "Mechanically attached TPO is fastened through the membrane into the deck along seam rows — fast, economical, and the most common method on wide-open roofs. Fully adhered TPO is glued continuously to the substrate, which eliminates fastener rows in the field, lays flatter, and can suit buildings where membrane flutter or interior air pressure is a concern. Induction-welded systems bond the membrane to specially coated fastener plates with an electromagnetic tool — fasteners hold the sheet without penetrating it.",
          "Which method fits depends on the deck type, wind-uplift requirements for the building's zone, the insulation package, and the manufacturer's approved assemblies. There is no universally better answer; there is a right answer for your building, and the proposal explains the reasoning.",
        ],
      },
      {
        title: "Recover or tear-off for an existing roof",
        paragraphs: [
          "Where the existing assembly is dry and sound, a recover — new insulation or cover board and new TPO over the old roof — avoids tear-off cost, disposal, and days of open-roof exposure. Where moisture testing finds saturated insulation, or code limits on the number of roof layers have been reached, tear-off is the honest answer. We take core samples before recommending either path, because recovering a wet roof just buries a problem you will pay to dig up later.",
          "One more honest note: drainage rules don't change with a new membrane. Low-slope roofs need positive drainage — roughly a quarter inch per foot is commonly targeted where practical — and ponding water is never harmless to any membrane, TPO included. If your roof holds water, the replacement design should address why.",
        ],
        links: [
          {
            label: "Compare recover and full replacement",
            href: "/commercial/roof-replacement",
          },
          {
            label: "Restore a sound roof with a coating instead",
            href: "/commercial/roof-coatings",
          },
        ],
      },
      {
        title: "TPO against EPDM and PVC",
        paragraphs: [
          "Against EPDM, TPO trades a rubber sheet's long track record and large-panel simplicity for welded seams and a reflective white surface. Against PVC, TPO gives up some chemical resistance — kitchens and grease exposure favor PVC — in exchange for a lower material cost. Note that TPO and PVC cannot be welded to each other; the chemistries are incompatible, which matters for repairs and tie-ins.",
          "And a caution on rooftop traffic: TPO is not puncture-immune. Dropped tools, HVAC panel screws, and trades walking the same path to a unit will eventually find a thin spot. Walk pads around serviced equipment are cheap insurance we spec on nearly every TPO roof.",
        ],
        links: [
          { label: "Compare TPO and EPDM", href: "/commercial/epdm" },
          {
            label: "See when PVC beats TPO",
            href: "/commercial/pvc",
          },
        ],
      },
    ],
    costFactors: {
      title: "What determines your TPO proposal?",
      description:
        "No two TPO projects price the same, because the membrane is only one line item. These are the factors that actually move the number:",
      items: [
        {
          title: "Membrane thickness and product line",
          text: "45, 60, or 80 mil — and the specific manufacturer's product, which sets warranty options.",
        },
        {
          title: "Recover vs. tear-off",
          text: "Whether the existing assembly can stay (verified by core samples) or must come off and be disposed of.",
        },
        {
          title: "Insulation and cover board package",
          text: "Target R-value, tapered insulation for drainage, and whether a cover board is specified.",
        },
        {
          title: "Attachment method",
          text: "Mechanically attached, fully adhered, or induction-welded — driven by deck type and wind-uplift requirements.",
        },
        {
          title: "Detail density",
          text: "Every curb, penetration, drain, and wall termination is hand work — equipment-crowded roofs take far more labor than wide-open ones.",
        },
        {
          title: "Edge metal and terminations",
          text: "Perimeter metal, coping, and gutter work are their own scope, often custom-fabricated.",
        },
        {
          title: "Access and staging",
          text: "Crane or lift needs, material loading paths, and how much protection your operations require.",
        },
        {
          title: "Warranty term",
          text: "Longer manufacturer terms typically require specific assemblies, thicknesses, and inspections.",
        },
      ],
    },
    signs: {
      title: "When TPO is the right call",
      items: [
        {
          icon: Thermometer,
          title: "Cooling costs matter",
          text: "Reflective white membrane can take real load off rooftop units through a Gulf-region summer — the effect depends on insulation and building use.",
        },
        {
          icon: Layers,
          title: "Replacing an aging membrane",
          text: "TPO is a natural successor to worn single-ply, mod-bit, or built-up systems.",
        },
        {
          icon: Banknote,
          title: "Budget discipline",
          text: "Competitive installed cost with a long expected service life — a defensible line item for any board.",
        },
        {
          icon: Wrench,
          title: "Serviceable for decades",
          text: "Welded repairs and tie-ins keep a TPO roof maintainable deep into its life.",
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
          text: "Welds probed and checked per the manufacturer's procedures as we go — the detail that decides how the roof ages.",
        },
      ],
    },
    faqs: [
      {
        question: "How long does a TPO roof last?",
        answer:
          "A common planning range is 20–30 years, depending on membrane thickness, the assembly, installation quality, and maintenance — no one can promise a precise number. The two biggest levers are seam workmanship on day one and keeping drains and penetrations serviced over the years.",
      },
      {
        question: "Can TPO be installed over our existing roof?",
        answer:
          "Often, yes — a recover over the existing assembly avoids tear-off cost and disruption when the substrate is dry and sound and code layer limits allow it. We take core samples to verify moisture before recommending it; recovering a wet roof just buries a problem.",
      },
      {
        question: "Is 60 mil really worth it over 45 mil?",
        answer:
          "Usually. The thicker sheet carries more weathering allowance over its reinforcement and typically unlocks longer manufacturer warranty terms, and the membrane is a modest share of total project cost once labor, insulation, and details are counted. On a low-traffic roof with a short ownership horizon, 45 mil can still be the rational pick.",
      },
      {
        question: "Does white TPO actually lower our cooling bills?",
        answer:
          "It reflects solar heat that a dark roof would absorb, which reduces load on rooftop units — but the size of the effect depends on your insulation, the building, the climate, and how the HVAC runs. Reflectivity doesn't fix inadequate insulation, so we look at the whole assembly, not just the membrane color.",
      },
      {
        question: "TPO vs. EPDM — which should we choose?",
        answer:
          "TPO wins on reflectivity and welded seams; EPDM wins on decades of track record and large-sheet simplicity. Building use, drainage, and budget decide it — we install both, so our recommendation follows your roof, not our inventory.",
      },
      {
        question: "How do you verify the seams are good?",
        answer:
          "Completed welds are checked following the manufacturer's procedures — probing the seam edges and inspecting the weld as work progresses. Weld quality depends on temperature, speed, pressure, membrane condition, and weather, so verification happens during installation, not after.",
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
        "EPDM is a thermoset — a synthetic rubber that's cured into its final state at the factory, unlike thermoplastics such as TPO that soften with heat. It comes off the truck in very large panels, stays flexible through decades of thermal cycling (Mississippi's daily heat swings barely bother it), and repairs, when eventually needed, are straightforward with compatible materials.",
        "That said, no membrane runs itself. An EPDM roof still lives or dies on its seams, flashings, terminations, penetrations, drainage, and the substrate underneath — the field rubber is rarely what fails. Classic EPDM is black and absorbs heat, which suits some buildings and penalizes others; white-faced options exist where reflectivity matters, and we'll tell you plainly which your building wants.",
      ],
    },
    sections: [
      {
        title: "Rubber comes in thicknesses too",
        paragraphs: [
          "EPDM is manufactured in nominal thicknesses that commonly include 45, 60, 75, and 90 mil — a mil being a thousandth of an inch — with 60 mil a frequent commercial choice. Because the sheet is unreinforced rubber in its standard form, extra thickness buys weathering allowance and puncture margin directly; reinforced versions exist for specific applications. Exact offerings vary by manufacturer, and the proposal names the product.",
          "Thicker sheet costs more but is a small fraction of the total project once labor and insulation are counted, so on long-hold buildings we often find the step up from 45 to 60 mil an easy case to make. Beyond that, roof traffic and warranty goals drive the decision.",
        ],
      },
      {
        title: "The big-sheet advantage",
        paragraphs: [
          "EPDM's signature trait is panel size: sheets far larger than anything a thermoplastic roll can offer, which means dramatically fewer field seams on open roof areas. On a big rectangular warehouse, most of the roof can be covered with a handful of panels — and every seam that doesn't exist is a seam that can never fail.",
          "The advantage shrinks on cut-up roofs. A roof crowded with curbs, penetrations, and elevation changes forces the big sheets to be cut and detailed anyway, at which point other systems compete more closely. Roof geometry, not brand preference, should pick the membrane.",
        ],
      },
      {
        title: "Seams by primer and tape — not by welder",
        paragraphs: [
          "Because EPDM is a cured rubber, its seams can't be hot-air welded the way TPO or PVC seams are. Instead, seam areas are cleaned, primed, and joined with pressure-sensitive seam tape — a system that modern practice has made far more reliable than the field-glued seams of decades past. Preparation is everything: a seam taped over a dusty or unprimed surface is a seam waiting to open.",
          "This distinction matters most at repair time. Anyone showing up to 'weld' an EPDM roof doesn't understand the system, and patches need EPDM-compatible primers and materials — one reason we identify the membrane before any repair, on any roof.",
        ],
        links: [
          {
            label: "How we repair EPDM and other membranes",
            href: "/commercial/roof-repair",
          },
        ],
      },
      {
        title: "Three ways to hold the rubber down",
        paragraphs: [
          "EPDM can be fully adhered to the substrate, mechanically attached with fasteners and plates, or ballasted — laid loose and weighed down with rounded stone or pavers. Each has a legitimate place, and the table below is the honest overview.",
          "A caution on ballast: it isn't for every building. The structure must carry the added weight, and the perimeter and corner zones need analysis against wind — decisions that involve structural review, not rules of thumb. Where ballast fits, it's economical and protects the membrane from sun and traffic; where it doesn't, forcing it is a mistake.",
        ],
        table: {
          title: "EPDM attachment methods compared",
          columns: ["Method", "How it works", "Strengths", "Watch-outs"],
          rows: [
            [
              "Fully adhered",
              "Membrane glued continuously to the substrate",
              "Lays flat, no fastener rows, suits visible or irregular roofs",
              "Substrate must be clean, dry, and adhesive-compatible",
            ],
            [
              "Mechanically attached",
              "Fasteners and plates secure the sheet along rows",
              "Fast, economical, works over many deck types",
              "Fastener pattern must match the building's wind-uplift requirements",
            ],
            [
              "Ballasted",
              "Loose-laid membrane held down by stone or pavers",
              "Economical on qualifying buildings; ballast shields the rubber",
              "Requires structural capacity and perimeter wind analysis — not universal",
            ],
          ],
          note: "Method selection depends on deck type, structure, wind-uplift requirements, and the manufacturer's approved assemblies.",
        },
      },
      {
        title: "Black rubber, white rubber, and the heat question",
        paragraphs: [
          "Standard EPDM is black, and a black roof absorbs more solar heat than a white one — how much that costs you depends on your insulation, the building's use, and how the HVAC runs. On a heavily insulated warehouse, the color of the membrane may barely register in the utility bill; on a marginally insulated office with rooftop units, it can matter.",
          "White-faced EPDM exists for buildings where reflectivity is the priority, and sometimes the honest answer is that a reflective thermoplastic fits better. We'll put the options side by side rather than defending a favorite. Whatever the color, low-slope drainage rules hold: water should leave the roof — roughly a quarter inch of fall per foot is a common design target where practical — because ponding degrades every membrane ever made.",
        ],
        links: [
          {
            label: "Compare EPDM with reflective TPO",
            href: "/commercial/tpo",
          },
        ],
      },
      {
        title: "What EPDM doesn't tolerate",
        paragraphs: [
          "Standard EPDM has a real chemical blind spot: oils, grease, and certain solvents attack the rubber. A kitchen exhaust fan discharging onto an EPDM roof will damage it — that exposure belongs on a different membrane. If your building has restaurant tenants or rooftop chemical discharge, say so during the assessment; it changes the recommendation.",
          "Inside its lane, EPDM is one of the most repairable systems in the industry: flexible into old age and patchable with compatible primers and materials, which is why well-detailed EPDM roofs remain serviceable long after their installers have retired. Pair the membrane with scheduled inspections and it's a genuinely low-drama asset.",
        ],
        links: [
          {
            label: "Membranes built for grease exposure",
            href: "/commercial/pvc",
          },
          {
            label: "Extend an aging EPDM roof with a coating",
            href: "/commercial/roof-coatings",
          },
          {
            label: "Set up scheduled roof inspections",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
    ],
    costFactors: {
      title: "Factors that shape an EPDM project's price",
      description:
        "EPDM proposals are built from the roof up, and these are the variables that actually move the total:",
      items: [
        {
          title: "Sheet thickness",
          text: "45, 60, 75, or 90 mil — thicker rubber carries more weathering and puncture margin at higher material cost.",
        },
        {
          title: "Panel layout and seam count",
          text: "Open roofs use EPDM's big sheets efficiently; cut-up roofs need more cutting, seaming, and detail labor.",
        },
        {
          title: "Attachment method",
          text: "Adhered, mechanically attached, or ballasted — ballast adds structural review to the scope where it's considered.",
        },
        {
          title: "Existing roof disposition",
          text: "Recover over a dry, sound assembly versus tear-off and disposal — cores decide, not guesses.",
        },
        {
          title: "Insulation package",
          text: "Target R-value, tapered drainage design, and cover board selection.",
        },
        {
          title: "Flashing and termination details",
          text: "Walls, curbs, drains, and penetrations are the labor-intensive part of any rubber roof.",
        },
        {
          title: "Access and logistics",
          text: "Roof height, staging space, and how carefully work must move around your operations.",
        },
      ],
    },
    signs: {
      title: "When EPDM makes sense",
      items: [
        {
          icon: CalendarClock,
          title: "You want a long service horizon",
          text: "Well-installed EPDM commonly delivers among the longest planning ranges of any membrane — with maintenance.",
        },
        {
          icon: Layers,
          title: "Large, open roof areas",
          text: "Huge sheet sizes mean fewer seams on warehouses and big rectangular roofs.",
        },
        {
          icon: Wrench,
          title: "Repair simplicity matters",
          text: "Patches and detail repairs with compatible materials are quick and reliable — good for long ownership horizons.",
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
          "No — it's among the most time-proven membranes in the industry, and manufacturers keep improving it. TPO took market share on reflectivity and welded seams, but EPDM's long field history and big-sheet simplicity are current advantages, not nostalgia.",
      },
      {
        question: "Does black EPDM make the building hotter?",
        answer:
          "A black roof does absorb more heat than a white one — how much that matters depends on your insulation and how the building is used and cooled. Where cooling economics dominate, we'll quote white-faced EPDM or a reflective membrane alongside for honest comparison.",
      },
      {
        question: "How are EPDM seams made if they can't be welded?",
        answer:
          "Seam areas are cleaned, primed, and joined with pressure-sensitive seam tape — EPDM is a cured rubber, so hot-air welding isn't an option. Modern tape systems are far more reliable than the old field-glued seams, and large sheets mean there are fewer seams to make in the first place.",
      },
      {
        question: "Can a ballasted EPDM roof go on any building?",
        answer:
          "No. Ballast adds significant weight, so the structure has to be verified to carry it, and perimeter and corner zones need wind analysis. Where a building qualifies, ballasted EPDM is economical and the stone protects the rubber; where it doesn't, we spec adhered or mechanically attached instead.",
      },
      {
        question: "Will grease from our kitchen exhaust hurt an EPDM roof?",
        answer:
          "Yes — oils, grease, and certain chemicals attack standard EPDM, so rooftop grease exposure is a real disqualifier. Buildings with kitchen exhaust are usually better served by PVC in the exposure zones, and we'll say so during the assessment.",
      },
      {
        question:
          "Can you repair our existing EPDM roof instead of replacing it?",
        answer:
          "Frequently, yes. EPDM stays repairable deep into its life with compatible primers, tapes, and patches — and if the field membrane is sound and the insulation is dry, a coating restoration may extend it further. The assessment tells us which path the condition supports.",
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
      "PVC single-ply roofing for South Mississippi — hot-welded seams and strong resistance to grease and many chemicals, a fit for restaurants and food service.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "PVC: the specialist for demanding roofs",
      subhead:
        "Heat-welded like TPO, but with a chemistry commonly selected where grease, oils, and certain chemical exposures would degrade other membranes. If your roof lives above a kitchen or a process floor, PVC is usually the conversation to have.",
      chips: ["Hot-welded seams", "Grease & chemical resistance", "Reflective"],
    },
    intro: {
      title: "Where PVC earns its premium",
      paragraphs: [
        "Every restaurant exhaust fan rains a fine mist of grease onto the roof around it — and grease degrades most membranes years ahead of schedule. PVC's chemistry resists that exposure far better than standard single-plies, which is why food service, kitchens, and processing facilities commonly spec PVC. Add hot-welded seams and strong reflectivity, and it's a premium membrane that earns its price on the right building.",
        "PVC also carries one of the longest performance histories among weldable membranes. For buildings without chemical exposure, TPO usually pencils out better — and we'll tell you so. This is about matching chemistry to what your roof actually endures.",
      ],
    },
    sections: [
      {
        title: "The chemistry, without the chemistry degree",
        paragraphs: [
          "PVC roofing is a reinforced thermoplastic: polyvinyl chloride compounded with plasticizers that keep the sheet flexible, built around a fabric scrim for strength. The vinyl formulation is what gives PVC its resistance to grease, oils, and a range of chemicals that soften or swell other single-ply membranes.",
          "One important honesty note: 'chemical resistance' is not a blank check. Resistance varies by chemical, concentration, temperature, and the specific product — every major manufacturer publishes chemical-resistance documentation, and for a processing facility or unusual exposure we check the actual exposure against the actual documentation before recommending anything.",
        ],
      },
      {
        title: "Common thicknesses: roughly 50, 60, and 80 mil",
        paragraphs: [
          "PVC is commonly offered in nominal thicknesses around 50, 60, and 80 mil (a mil is a thousandth of an inch), with exact figures varying by manufacturer and product line. As with any single-ply, the thickness above the reinforcing scrim is the membrane's weathering allowance — thicker sheets weather longer and typically qualify for longer warranty terms.",
          "On high-exposure roofs — the very buildings that choose PVC — we lean toward the heavier end. A kitchen roof works harder than an office roof, and the increment for thicker membrane is small against the cost of replacing a degraded one early.",
        ],
      },
      {
        title: "Seams fused by heat, checked by hand",
        paragraphs: [
          "Like other thermoplastics, PVC seams are hot-air welded — the sheet surfaces are melted together under heat and pressure so the joint cures into a continuous membrane rather than a glued lap. Completed seams get probed and verified following the manufacturer's procedures while the crew is still on the roof.",
          "The welding requirement cuts both ways at repair time: PVC repairs must be made with PVC-compatible material, and PVC cannot be welded to TPO — the two chemistries look similar from a ladder but will not fuse. Knowing exactly which membrane is on your roof before anyone opens a repair kit is not optional.",
        ],
        links: [
          {
            label: "How membrane identification drives repairs",
            href: "/commercial/roof-repair",
          },
        ],
      },
      {
        title: "Kitchens, exhaust fans, and the grease problem",
        paragraphs: [
          "Rooftop grease doesn't stay near the fan — it spreads with wind and rain across a wide zone, and on most membranes it slowly softens the surface until seams and details fail. PVC's resistance buys time, but membrane chemistry should be the second line of defense, not the first: exhaust-fan discharge should be managed with containment systems and regular service so the roof isn't the grease trap.",
          "For restaurants, groceries, and food processing across South Mississippi, our usual pattern is PVC where exposure is real, honest containment detailing at the fans, and a maintenance cadence that keeps the exposure zones inspected. That combination is what actually gets these roofs to a full service life.",
        ],
        links: [
          {
            label: "Roofing for industrial and processing facilities",
            href: "/commercial/industries/industrial",
          },
        ],
      },
      {
        title: "PVC or TPO — the decision most buildings face",
        paragraphs: [
          "For a building with no chemical or grease exposure, TPO usually wins on economics and does the reflective, welded-seam job well. Once exposure enters the picture, PVC's premium starts paying rent. The comparison below is the honest version.",
        ],
        table: {
          title: "PVC vs. TPO for commercial low-slope roofs",
          columns: ["Attribute", "PVC", "TPO"],
          rows: [
            [
              "Membrane type",
              "Reinforced thermoplastic (vinyl-based)",
              "Reinforced thermoplastic (polyolefin-based)",
            ],
            ["Seams", "Hot-air welded", "Hot-air welded"],
            [
              "Grease & chemical exposure",
              "Commonly selected — verify against manufacturer documentation",
              "Generally not recommended for grease zones",
            ],
            [
              "Relative initial investment",
              "Higher initial investment",
              "Moderate initial investment",
            ],
            [
              "Field history",
              "Long history among weldable membranes",
              "Newer, now the most-installed low-slope system",
            ],
            [
              "Repair cross-compatibility",
              "Not weld-compatible with TPO",
              "Not weld-compatible with PVC",
            ],
          ],
          note: "Generalized comparison — specific products vary by manufacturer, and the roof's actual exposure decides the recommendation.",
        },
        links: [
          {
            label: "Read the full TPO specification page",
            href: "/commercial/tpo",
          },
        ],
      },
      {
        title: "Installing PVC over what's already there",
        paragraphs: [
          "PVC installs mechanically attached or fully adhered over a continuous substrate — like every membrane, it never spans open framing, and the insulation and cover board below it are specified as their own components. Over certain existing materials, PVC needs a separation layer: some substrates (including asphalt products and polystyrene insulations) can interact badly with the membrane, so compatibility drives the assembly design.",
          "Drainage rules don't bend for premium membranes either. Ponding water is never harmless, and the design targets positive drainage — commonly around a quarter inch per foot where practical — with walk pads at serviced equipment so kitchen and HVAC techs aren't grinding grit into the sheet.",
        ],
      },
    ],
    costFactors: {
      title: "Why PVC pricing is always building-specific",
      description:
        "PVC projects vary more than most because exposure drives the spec. Here's what we evaluate before the proposal:",
      items: [
        {
          title: "The exposure profile",
          text: "Grease, oils, or chemicals on the roof — checked against manufacturer chemical-resistance documentation — set the membrane and detailing requirements.",
        },
        {
          title: "Membrane thickness",
          text: "Roughly 50, 60, or 80 mil nominal; high-exposure roofs usually justify the heavier sheet.",
        },
        {
          title: "Separation layers",
          text: "Some existing substrates require an isolation layer under PVC, which adds a component to the assembly.",
        },
        {
          title: "Exhaust and grease management",
          text: "Containment detailing at fans and discharge points is part of the scope on food-service roofs.",
        },
        {
          title: "Tear-off vs. recover",
          text: "Whether the existing roof can stay depends on moisture findings, compatibility, and code layer limits.",
        },
        {
          title: "Curb and penetration count",
          text: "Kitchen and process roofs are typically equipment-dense — every curb is detailed by hand.",
        },
        {
          title: "Attachment and wind requirements",
          text: "Mechanically attached or fully adhered, matched to deck type and the building's uplift zone.",
        },
      ],
    },
    signs: {
      title: "When PVC is the right spec",
      items: [
        {
          icon: TriangleAlert,
          title: "Restaurants & kitchens",
          text: "Grease exhaust degrades ordinary membranes early — PVC is the standard answer.",
        },
        {
          icon: Droplets,
          title: "Chemical or oil exposure",
          text: "Process facilities with rooftop discharge need chemistry verified against the actual exposure.",
        },
        {
          icon: Waves,
          title: "Demanding service conditions",
          text: "Welded seams and a flexible sheet handle hardworking, equipment-dense roofs well.",
        },
        {
          icon: Thermometer,
          title: "Reflectivity wanted",
          text: "White PVC performs like other reflective membranes against Gulf-region cooling loads.",
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
          text: "Membrane, insulation, and detail package specified line by line against the alternatives.",
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
        question: "Why does PVC cost more than TPO?",
        answer:
          "The vinyl resin and plasticizers cost more to produce, and the membrane carries specialist capabilities — resistance to grease and many chemicals chief among them. On a roof that needs those capabilities it's the economical choice over time; on one that doesn't, we'll usually point you to TPO.",
      },
      {
        question:
          "Our restaurant roof keeps failing around the exhaust fans. Is that fixable?",
        answer:
          "That's the classic grease-degradation pattern, and yes — PVC in the exposure zones (or across the roof) is the standard fix. We also detail grease containment at the fans themselves, because managing the discharge extends any membrane's life.",
      },
      {
        question: "Does PVC resist every chemical?",
        answer:
          "No membrane does. PVC resists grease, oils, and a broad range of chemicals better than most single-plies, but resistance depends on the specific chemical, its concentration, temperature, and the product — manufacturers publish chemical-resistance documentation, and for unusual exposures we check it before specifying anything.",
      },
      {
        question: "How long does PVC last?",
        answer:
          "Planning ranges are commonly comparable to other premium single-plies — often cited around 20–30 years depending on thickness, assembly, exposure, and maintenance — and PVC frequently maintains that range under exposures that would shorten other membranes' lives. No precise number can be promised for any roof.",
      },
      {
        question: "Can PVC be welded to TPO?",
        answer:
          "No — the chemistries are incompatible for welding, which matters when patching or tying into existing roofs. Identifying exactly which membrane is up there is one of the first things we verify before any repair or partial replacement on a single-ply roof.",
      },
      {
        question: "Can PVC go directly over our old roof?",
        answer:
          "Sometimes, but compatibility matters more with PVC than most membranes: certain substrates require a separation layer between the old roof and the new sheet. Core samples and moisture testing determine whether a recover is viable at all, and the assembly design handles the compatibility from there.",
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
        "Asphalt engineering in rolled form — reinforced plies stacked into a system that stands up to foot traffic, hail, and the abuse a working roof takes. The choice when durability outranks everything.",
      chips: ["Multi-ply redundancy", "Foot-traffic tough", "Granulated cap"],
    },
    intro: {
      title: "Redundancy as a design principle",
      paragraphs: [
        "Single-ply membranes stake everything on one layer. Modified bitumen stacks reinforced asphalt plies — commonly a base sheet plus a cap sheet, with some assemblies adding more — so damage has to get through the system, not just a sheet. On roofs with regular maintenance traffic — HVAC techs, satellite installers, window crews — that redundancy is the difference between a scuff and a leak.",
        "Modern mod-bit installs with far more flexibility than the old hot-mop days: self-adhered sheets and cold-applied adhesives mean many projects need no kettles and no open flame. The granulated cap sheet takes UV the way a shingle does, and repairs decades from now remain familiar asphalt work.",
      ],
    },
    sections: [
      {
        title: "SBS and APP — two modifiers, two personalities",
        paragraphs: [
          "'Modified' bitumen means asphalt blended with a polymer that changes how it behaves. SBS is a rubber-like modifier that makes the sheet flexible and forgiving — it handles building movement and cold-weather brittleness well, and it can be installed by several methods. APP is a plastic-like modifier that produces a stiffer, very UV-stable sheet, commonly heat-applied.",
          "Neither is universally better. SBS's flexibility suits most of the buildings we roof in South Mississippi, while APP has loyal specifiers for its weathering character. The manufacturer's product line, the installation method the building allows, and the details on your roof decide the pick — and the proposal states which and why.",
        ],
      },
      {
        title: "What the plies are made of",
        paragraphs: [
          "Each mod-bit sheet is built around a reinforcement — polyester, fiberglass, or a composite of the two. Polyester brings elongation and puncture resistance; fiberglass brings dimensional stability; composites aim for both. The reinforcement is why a mod-bit ply resists tearing and foot traffic in a way unreinforced asphalt never could.",
          "Cap sheets come surfaced with mineral granules — the same idea as shingle granules, shielding the asphalt from UV — or smooth, which is common where a reflective coating will be applied over the finished roof. Granule color options give mod-bit a reflectivity range, though as with any roof, actual energy impact depends on the insulation and how the building runs.",
        ],
      },
      {
        title: "Five ways to put it down",
        paragraphs: [
          "Few systems offer as many installation routes as modified bitumen, and the method is chosen per membrane and manufacturer — not every sheet installs every way. The realistic menu:",
        ],
        table: {
          title: "Modified bitumen installation methods",
          columns: ["Method", "How it's applied", "Occupied-building notes"],
          rows: [
            [
              "Self-adhered",
              "Release film peeled, sheet rolled into place",
              "No flame, no kettle, minimal odor — a strong fit over occupied space",
            ],
            [
              "Cold-applied adhesive",
              "Sheet set into trowel- or squeegee-applied adhesive",
              "Flame-free; some adhesive odor during application",
            ],
            [
              "Hot asphalt",
              "Sheet set into mopped hot asphalt",
              "Kettle on site; odor and logistics require planning",
            ],
            [
              "Torch / heat-weld",
              "Sheet's underside melted and rolled in",
              "Open flame — strict fire-safety procedures and fire watch required",
            ],
            [
              "Mechanically attached base + adhered cap",
              "Base sheet fastened to the deck, cap bonded over it",
              "Reduces adhesive/flame work; common hybrid approach",
            ],
          ],
          note: "Available methods depend on the specific membrane and the manufacturer's approved assemblies.",
        },
      },
      {
        title: "Torches, odors, and buildings full of people",
        paragraphs: [
          "Torch application earns its reputation for durable laps, but open flame on a roof is serious business: manufacturers and industry fire-safety programs prescribe strict procedures, including how details near combustibles are handled and a fire watch after torch work ends. Where we torch, those procedures are the job — not an option on it.",
          "Over occupied buildings, we usually steer toward self-adhered or cold-applied methods first: no flame, less odor, and fewer logistics. Part of the mod-bit conversation is simply matching the installation method to what your building and its occupants can accommodate.",
        ],
      },
      {
        title: "Traffic tolerance — real, but not unlimited",
        paragraphs: [
          "A granulated multi-ply surface generally handles service traffic better than many thin single-ply installations — one reason mod-bit persists on equipment-heavy roofs. It is not, however, a sidewalk. Walk pads still belong on the routes to serviced equipment, and rooftop trades still need to know the roof is a membrane, not a work floor.",
          "Like every membrane system, mod-bit needs a continuous substrate — it never spans open framing — and the insulation and cover boards beneath it are specified as their own assembly components. Positive drainage rules apply here too: asphalt plies are tough, but ponding water is never harmless to any roof, and the design should move water off — roughly a quarter inch per foot of fall is a common target where practical.",
        ],
        links: [
          {
            label: "Set up a maintenance program for a working roof",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
      {
        title: "Mod-bit next to TPO, and what happens in year 20",
        paragraphs: [
          "Against TPO, modified bitumen trades reflective economy for physical redundancy: TPO typically costs less installed and reflects more sun, while mod-bit brings multiple plies, a granule-armored surface, and better tolerance of rooftop abuse. Buildings with constant trade traffic or hail worry lean mod-bit; wide-open roofs chasing cooling economics lean TPO.",
          "Mod-bit also ages gracefully into its options: an aging but sound mod-bit roof is one of the classic candidates for a reflective coating restoration, and repairs remain straightforward asphalt-compatible work throughout its life. That long tail of serviceability is a real part of the system's value.",
        ],
        links: [
          {
            label: "Compare with TPO single-ply",
            href: "/commercial/tpo",
          },
          {
            label: "Coating restoration over aging mod-bit",
            href: "/commercial/roof-coatings",
          },
        ],
      },
    ],
    costFactors: {
      title: "What we evaluate before pricing a mod-bit roof",
      description:
        "Modified bitumen spans a wide range of assemblies, so the estimate follows the evaluation — these are the levers:",
      items: [
        {
          title: "Ply configuration",
          text: "Base plus cap is common; additional plies add redundancy and cost.",
        },
        {
          title: "SBS or APP, and the specific product",
          text: "Modifier type and manufacturer line set material cost and available installation methods.",
        },
        {
          title: "Installation method",
          text: "Self-adhered, cold-applied, hot asphalt, torch, or hybrid — each carries different labor, equipment, and safety scope.",
        },
        {
          title: "Fire-safety requirements",
          text: "Torch projects add mandated procedures and fire-watch time to the schedule.",
        },
        {
          title: "Existing roof disposition",
          text: "Recover versus tear-off, decided by core samples, moisture findings, and code layer limits.",
        },
        {
          title: "Insulation and drainage design",
          text: "R-value targets, tapered insulation, and cover boards are specified per building.",
        },
        {
          title: "Detail and flashing scope",
          text: "Multi-ply flashings at walls, curbs, and drains are hand-built — detail-dense roofs take longer.",
        },
      ],
    },
    signs: {
      title: "When modified bitumen fits",
      items: [
        {
          icon: Wrench,
          title: "Regular rooftop traffic",
          text: "Multi-ply systems tolerate technicians and equipment service better than many thin single-ply installs.",
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
        question: "What's the difference between SBS and APP?",
        answer:
          "They're the two polymer modifiers. SBS behaves rubber-like — flexible, forgiving of movement, installable by several methods. APP behaves plastic-like — stiffer, very UV-stable, and commonly heat-applied. The building, the installation constraints, and the manufacturer's line determine which we spec.",
      },
      {
        question: "Does installation involve torches?",
        answer:
          "Not necessarily. Torch application is one method, but self-adhered and cold-applied systems handle many projects — and they're what we prefer over occupied buildings. Where torch work is the right method, strict fire-safety procedures and a fire watch are part of the scope, no exceptions.",
      },
      {
        question: "How many plies does a mod-bit roof have?",
        answer:
          "Commonly a base sheet plus a cap sheet, and some assemblies add more plies for extra redundancy — there's no single universal count. Each ply is reinforced with polyester, fiberglass, or a composite, which is where the system's tear and puncture resistance comes from.",
      },
      {
        question: "How does mod-bit handle Mississippi heat?",
        answer:
          "Asphalt systems are engineered for solar exposure, and granulated caps come in reflective options — or a smooth cap can take a reflective coating. As with any roof, the cooling-cost picture depends on cap color and, just as much, on the insulation under the membrane; we look at both in the proposal.",
      },
      {
        question: "What maintenance does it need?",
        answer:
          "Modest and predictable: keep drains clear, inspect seams and flashings on a schedule, check after major storms, and reseal exposed details as they age. Its failure modes tend to be slow and visible — the opposite of surprise leaks.",
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
      "Silicone, acrylic, and urethane roof coatings across South Mississippi — restore a sound commercial roof with no tear-off, after honest moisture testing.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "Restoration: the replacement you might not need",
      subhead:
        "If the roof under your problems is still fundamentally sound, a fluid-applied coating system can seal it, cool it, and extend its life — with no tear-off and no operational shutdown. The key word is 'if,' and testing answers it.",
      chips: [
        "Silicone, acrylic & urethane",
        "No tear-off",
        "Reflective finish",
      ],
    },
    intro: {
      title: "The honest math of coating vs. replacing",
      paragraphs: [
        "Plenty of 'failed' commercial roofs aren't failed at all — the membrane is tired at the seams and details while the field is sound. Restoration attacks exactly that: repair the failure points, then seal the whole roof under a seamless fluid-applied membrane. When the roof qualifies, the investment lands well below replacement, the work happens over your operating business, and the bright white finish cuts roof surface temperatures from day one.",
        "The honesty requirement is the assessment. A coating is not an automatic substitute for replacement — coating a roof with wet insulation or widespread membrane failure wastes your money. It takes moisture scanning and core checks first, and when the verdict is replacement, we'll show you why. When restoration is viable, it's one of the best values in commercial roofing.",
      ],
    },
    sections: [
      {
        title: "First question: does this roof qualify?",
        paragraphs: [
          "Coatings restore roofs; they don't resurrect them. The existing membrane must be structurally sound, adequately attached, and chemically compatible with the coating going over it. A coating cannot fix a deteriorated deck, correct inadequate slope, or bridge a membrane that's failing across its field — those are replacement conversations, and pretending otherwise just delays them at your expense.",
          "Qualification is a physical process, not a sales judgment: we evaluate the substrate, test adhesion where the manufacturer requires it, and investigate moisture before a gallon is ordered. Roofs that pass get a restoration proposal; roofs that don't get a straight explanation and the replacement comparison in the same conversation.",
        ],
        links: [
          {
            label: "What full replacement involves",
            href: "/commercial/roof-replacement",
          },
        ],
      },
      {
        title: "Why moisture testing comes before everything",
        paragraphs: [
          "Water trapped in the insulation is restoration's disqualifier-in-chief. Coating over saturated insulation repairs nothing — it seals wet material into the assembly, where it keeps degrading the roof from below while the surface looks new. Finding it first is non-negotiable.",
          "We look for trapped moisture with the standard tools: core samples that physically reveal the assembly's condition, and moisture scanning — infrared surveys that spot the thermal signature of wet insulation, or electrical capacitance scanning that reads moisture through the membrane. Isolated wet areas can be cut out and replaced before coating; widespread saturation ends the restoration conversation honestly.",
        ],
      },
      {
        title:
          "Silicone, acrylic, or urethane — matching chemistry to the roof",
        paragraphs: [
          "The three major coating families solve different problems, and fabric-reinforced restoration systems add strength at seams and details where applicable. Silicone commonly performs where intermittent ponding is a concern (a product-specific claim — we verify it against the actual product), but it collects dirt and is difficult to recoat with anything but more silicone. Acrylics are reflective, water-based, and economical, but they need proper drying conditions and a roof with positive drainage. Urethanes bring strong abrasion and traffic resistance, often used where wear is the enemy.",
        ],
        table: {
          title: "Coating chemistries compared",
          columns: ["", "Silicone", "Acrylic", "Urethane"],
          rows: [
            [
              "Standout strength",
              "Commonly performs where intermittent ponding is a concern (product-specific)",
              "Reflectivity and value; water-based application",
              "Abrasion and traffic resistance",
            ],
            [
              "Main limitations",
              "Attracts dirt; hard to recoat with non-silicone products",
              "Needs drying conditions and positive drainage",
              "Often paired with other coatings; costlier as a full system",
            ],
            [
              "Common role",
              "Slow-draining roofs and weathered membranes",
              "Well-draining roofs chasing reflectivity",
              "High-wear zones and base layers under other coatings",
            ],
          ],
          note: "Generalized traits — performance claims are product-specific, and the manufacturer's data sheet governs.",
        },
      },
      {
        title: "Preparation is most of the system",
        paragraphs: [
          "A coating is only as good as what it sticks to, so the prep list is long and unglamorous: cleaning the roof to the manufacturer's standard, treating rust on metal roofs, replacing backed-out or failed fasteners, reinforcing seams, detailing every penetration, and running adhesion tests where the spec requires them. On many projects, preparation consumes more labor than the coating application itself.",
          "That's also where corners get cut by low bidders. A coating sprayed over a dirty or unrepaired roof will peel, blister, or leak on the same schedule as if nothing had been done — the product takes the blame, but the prep was the failure. Our proposals itemize the preparation scope so you can compare bids on what actually matters.",
        ],
        links: [
          {
            label: "Repairs that precede a restoration",
            href: "/commercial/roof-repair",
          },
        ],
      },
      {
        title: "Wet-film, dry-film, and why the warranty cares",
        paragraphs: [
          "Coatings are applied wet and cure to a thinner dry layer — wet-film thickness and dry-film thickness are different numbers, and the warranty keys on the dry result. Manufacturers commonly tie warranty terms to the product, the substrate, the preparation, and the installed dry-film thickness: more cured material generally supports longer coverage, subject to the written warranty terms.",
          "This is also why there is no universal gallons-per-square answer — coverage depends on the product, the roof's texture and porosity, and the thickness the specified warranty requires. We measure film thickness during application and document it, because that record is what stands behind the system years later.",
        ],
      },
      {
        title: "Where restoration fits between repair and replacement",
        paragraphs: [
          "Think of it as a spectrum. Isolated problems on a healthy roof call for repairs. Widespread detail-and-seam fatigue on a dry, sound roof is restoration's sweet spot — the whole surface gets renewed without tear-off, and many systems can be recoated later to extend the cycle. Saturated insulation, deck problems, or field-wide membrane failure mean replacement, and no coating changes that.",
          "One operational note: a restored roof is still a membrane roof. Walk pads may still be required on service routes, drainage still needs to work, and a maintenance cadence still protects the investment — the coating renews the surface, it doesn't repeal the physics.",
        ],
        links: [
          {
            label: "Compare against TPO replacement",
            href: "/commercial/tpo",
          },
          {
            label: "Coating options for metal roofs",
            href: "/commercial/metal-roofing",
          },
        ],
      },
    ],
    costFactors: {
      title: "What affects the cost of a coating restoration?",
      description:
        "Restoration pricing follows the roof's condition more than its size. The real variables:",
      items: [
        {
          title: "Existing roof type and condition",
          text: "Metal, mod-bit, single-ply, and smooth BUR each need different prep and primers — and condition sets the repair scope.",
        },
        {
          title: "Moisture findings",
          text: "Wet insulation discovered by scanning or cores must be cut out and replaced before coating — or may disqualify the roof.",
        },
        {
          title: "Preparation scope",
          text: "Cleaning, rust treatment, fastener replacement, and seam reinforcement often outweigh the coating itself in labor.",
        },
        {
          title: "Coating chemistry and product",
          text: "Silicone, acrylic, or urethane — selected for the roof's drainage and exposure, at different material costs.",
        },
        {
          title: "Specified dry-film thickness",
          text: "The warranty term drives how much cured material must be installed, which drives material quantity.",
        },
        {
          title: "Fabric reinforcement",
          text: "Reinforced systems at seams, transitions, or across the field add material and labor where specified.",
        },
        {
          title: "Detail density and access",
          text: "Penetrations, curbs, and walls are brush-and-fabric work; roof height and staging shape the labor plan.",
        },
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
          text: "On a qualifying roof, restoration typically requires far less capital than replacement — and no tear-off.",
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
          text: "Core samples and moisture scanning verify the roof qualifies — no coating over wet insulation, ever.",
        },
        {
          title: "Repair the failure points",
          text: "Seams, flashings, penetrations, and any saturated sections fixed before a drop of coating goes down.",
        },
        {
          title: "Fluid-applied system",
          text: "Silicone, acrylic, or urethane, chosen for your roof's ponding and exposure profile, applied to the specified thickness.",
        },
        {
          title: "Documented for the future",
          text: "Thickness readings and photos on file — many restorations can be recoated later, extending life again.",
        },
      ],
    },
    faqs: [
      {
        question: "Is coating really cheaper than replacement?",
        answer:
          "On a roof that qualifies, yes — restoration avoids tear-off, disposal, new insulation, and most of the labor of a reroof. The qualifier is the whole story: the roof must be sound and dry, which is what the moisture survey establishes before we propose anything.",
      },
      {
        question: "Silicone or acrylic — what's the difference?",
        answer:
          "Silicone commonly performs where intermittent ponding is a concern (a product-specific claim we verify), but it collects dirt and is hard to recoat with anything but silicone. Acrylics are reflective and economical but need drying conditions and a roof that actually drains. The roof's drainage profile usually makes the choice.",
      },
      {
        question: "How long does a coating restoration last?",
        answer:
          "Warranty terms commonly scale with the installed dry-film thickness, the product, and the preparation — thicker specified systems typically carry longer terms, subject to the written warranty. Many restorations can then be recoated at the end of the term, extending the cycle without tear-off.",
      },
      {
        question: "How much coating does our roof need?",
        answer:
          "There's no universal gallons-per-square figure, and be wary of anyone quoting one. Coverage depends on the product, the roof's texture and porosity, and the dry-film thickness your specified warranty requires — coatings cure thinner than they're applied, and the dry number is what counts.",
      },
      {
        question: "Can you coat a metal roof?",
        answer:
          "Frequently — metal is one of the most common restoration substrates. The prep differs: rust treatment, fastener replacement, and seam detailing come before the coating. The same qualification rules apply, including adhesion testing where the manufacturer requires it.",
      },
      {
        question: "Will you coat a roof that shouldn't be coated?",
        answer:
          "No. If moisture scanning shows saturated insulation, the deck has problems, or the membrane is broadly failed, coating is the wrong spend and we'll say so — with the replacement comparison in the same proposal so you can decide with full information.",
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
      "Planned commercial roof maintenance across South Mississippi — scheduled inspections, documentation, and small fixes that prevent expensive surprises.",
    hero: {
      eyebrow: "Commercial roofing",
      headline: "The least expensive roof work is the scheduled kind",
      subhead:
        "Commercial roofs rarely fail suddenly — they fail slowly, visibly, and preventably. A maintenance program catches the minor defect before it becomes the capital emergency.",
      chips: [
        "Scheduled inspections",
        "Photo documentation",
        "Priority response",
      ],
    },
    intro: {
      title: "Why planned maintenance is the best roofing spend",
      paragraphs: [
        "Nearly every commercial roof disaster we're called to started as something small: a clogged drain ponding water, a split pitch pan, a fastener backing out under a seam. Caught on a scheduled inspection, each is a minor line item. Discovered after a tropical rain event has flooded a server room, the same defect is a capital emergency plus interior damage plus downtime.",
        "A program also protects paperwork: manufacturer warranties on commercial systems generally expect documented maintenance, and the inspection record we build becomes the evidence that distinguishes new storm damage from old wear when a claim is filed. One honest limit up front — maintenance doesn't stop a roof from aging; it removes the avoidable damage that ages roofs early, and it converts surprises into scheduled decisions.",
      ],
    },
    sections: [
      {
        title: "What a program visit actually inspects",
        paragraphs: [
          "A maintenance visit isn't a walk with a clipboard — it's a systematic pass over every component that fails on commercial roofs, with photos and small fixes as we go. The matrix below is the realistic scope on a typical low-slope building; metal roofs swap in fastener and seam checks appropriate to their system.",
        ],
        table: {
          title: "Commercial roof maintenance matrix",
          columns: [
            "Item",
            "What is checked",
            "Typical failure",
            "Recommended response",
            "Responsible party",
          ],
          rows: [
            [
              "Drains & scuppers",
              "Blockage, strainer condition, ponding evidence",
              "Debris clogs causing standing water",
              "Clear on the spot; flag chronic ponding for drainage review",
              "Roofing contractor",
            ],
            [
              "Field membrane & seams",
              "Splits, punctures, seam edges, blisters",
              "Trade damage, seam fatigue, weathering",
              "Small membrane-matched repairs; monitor marginal areas",
              "Roofing contractor",
            ],
            [
              "Flashings & terminations",
              "Wall, curb, and edge-metal attachment and sealant",
              "Sealant aging out; flashing pulling away",
              "Reseal or re-secure; schedule rework if recurring",
              "Roofing contractor",
            ],
            [
              "Pitch pockets & penetrations",
              "Filler level and cracking at sealed penetrations",
              "Dried, shrunken filler opening a leak path",
              "Top off or rebuild the pocket",
              "Roofing contractor",
            ],
            [
              "RTU curbs & equipment",
              "Curb flashing, panel screws, condensate routing",
              "HVAC service damage; condensate dumping on membrane",
              "Repair flashing; coordinate with HVAC vendor",
              "Contractor + HVAC vendor",
            ],
            [
              "Walk pads & traffic routes",
              "Pad condition and coverage of actual service paths",
              "Traffic wearing membrane off-pad",
              "Add or relocate pads to match real routes",
              "Roofing contractor",
            ],
            [
              "Roof access & housekeeping",
              "Debris, stored materials, unauthorized penetrations",
              "Trades leaving screws, panels, or new penetrations",
              "Remove hazards; log and flash any new penetrations",
              "Owner + contractor",
            ],
          ],
          note: "Representative scope — the checklist is tuned to your roof system, warranty requirements, and equipment load.",
        },
      },
      {
        title: "How often should a commercial roof be inspected?",
        paragraphs: [
          "There is no single correct frequency, and we won't pretend otherwise. Spring and fall visits plus post-storm checks are a common baseline in our region — ahead of summer heat and after leaf-fall — but the right cadence depends on the warranty's requirements, the roof's age, tree and debris exposure, how much rooftop traffic the building sees, and what the building does. A roof over a data room justifies more eyes than a roof over dead storage.",
          "The cadence also isn't fixed forever. A young roof in year three needs less attention than the same roof in year eighteen, and a building that adds rooftop equipment adds inspection scope with it. We set the schedule at the baseline assessment and adjust it as the roof's condition record develops.",
        ],
      },
      {
        title: "The rooftop-trades problem nobody budgets for",
        paragraphs: [
          "A surprising share of commercial roof leaks trace back not to weather but to other trades: HVAC techs, sign installers, and cabling crews who can unintentionally damage a membrane with dropped tools, dragged panels, or a screw through the sheet — and who understandably never report what they didn't notice. The roof takes the blame months later when the stain appears.",
          "The countermeasures are boring and effective: walk pads on the routes trades actually use, a roof-access log so you know who was up there and when, and a standing rule that rooftop work gets reported. Our inspection reports photograph trade damage when we find it, which has settled more than one question about whose vendor owes the repair.",
        ],
      },
      {
        title: "Documentation that earns its keep",
        paragraphs: [
          "Every visit produces a photo report in plain language: what was found, what was fixed on the spot, what should be repaired soon, and what can wait — a prioritized list, not a scare sheet. Over years, those reports become the roof's medical record: the trend line that tells you when repair spending is signaling a bigger conversation, and the baseline that proves which damage a storm actually caused.",
          "The record matters to third parties too. Manufacturer warranties commonly require documented maintenance, and when severe weather leads to an insurance claim, we document the damage thoroughly and provide the information the insurer needs to evaluate it — dated before-and-after evidence is exactly what that process wants. Budgeting gets easier as well: replacement stops being a surprise and becomes a fiscal-year line item you saw coming.",
        ],
        links: [
          {
            label: "Repairs prioritized from inspection findings",
            href: "/commercial/roof-repair",
          },
          {
            label: "When the trend line says restore or replace",
            href: "/commercial/roof-coatings",
          },
        ],
      },
    ],
    costFactors: {
      title: "How maintenance programs are priced",
      description:
        "Programs are quoted after the baseline assessment, structured one of a few ways — per visit, per building, by roof area, or as an annual agreement — with repairs beyond the small on-the-spot fixes separately authorized before any work. What moves the number:",
      items: [
        {
          title: "Roof area and complexity",
          text: "Square footage matters less than detail density — equipment-crowded roofs take longer to inspect properly.",
        },
        {
          title: "Number of buildings",
          text: "Portfolio agreements cover multiple roofs on one cadence, one report format, and one contact.",
        },
        {
          title: "Visit frequency",
          text: "Set by warranty requirements, roof age, exposure, and traffic — not a one-size schedule.",
        },
        {
          title: "Roof system type",
          text: "Single-ply, mod-bit, coated, and metal roofs each carry different checklists and service items.",
        },
        {
          title: "Access and safety setup",
          text: "Roof height, hatch versus ladder access, and fall-protection needs shape visit time.",
        },
        {
          title: "Included small repairs",
          text: "Programs define what's fixed on the spot versus what's documented and separately authorized.",
        },
        {
          title: "Reporting depth",
          text: "Standard photo reports versus asset-management documentation for portfolios and boards.",
        },
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
          text: "Commonly semi-annual plus post-storm checks; warranty terms, age, system, and exposure tune the schedule.",
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
        question: "How are maintenance programs priced?",
        answer:
          "By one of a few structures — per visit, per building, by roof area, or as an annual agreement — quoted after the baseline assessment, since detail density and access matter more than raw square footage. Repairs beyond the small on-the-spot fixes are documented and separately authorized before any work happens.",
      },
      {
        question: "Does maintenance really extend roof life?",
        answer:
          "It removes the biggest sources of early failure. Ponding from clogged drains, unnoticed trade damage, and aged-out sealants are what cut roofs' lives short — catching them on schedule is the whole game. Maintenance doesn't stop a roof from aging, but it keeps avoidable damage from doing the aging.",
      },
      {
        question: "How often should our roof be inspected?",
        answer:
          "There's no universal frequency. Spring and fall plus post-storm checks are a common regional baseline, but warranty requirements, roof age, tree exposure, rooftop traffic, and what the building houses all tune the cadence — we set it at the baseline assessment and adjust as the roof's record develops.",
      },
      {
        question: "Can other contractors' rooftop work void our roof warranty?",
        answer:
          "Unreported trade damage and unauthorized penetrations are a real warranty and leak risk — a screw through the membrane doesn't care whose truck it came from. A roof-access log, walk pads on service routes, and photographed inspections are the practical protections, and our reports document trade damage when we find it.",
      },
      {
        question: "We have multiple buildings. Can you cover a portfolio?",
        answer:
          "Yes — portfolio scheduling is where programs shine: one cadence, one report format, and one contact across all your roofs, with per-building condition tracking so each roof's budget picture stays distinct.",
      },
      {
        question: "What happens when you find storm damage on a visit?",
        answer:
          "You get dated before-and-after documentation — exactly what an insurance evaluation needs. We flag it immediately, photograph it thoroughly, and provide the information the insurer needs to evaluate the covered damage. The insurer makes the coverage decision; our job is making sure the evidence is complete.",
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
        "Commercial replacement decisions move through budgets, boards, and bid processes — so the documentation has to stand on its own. Our proposals are engineered and itemized: existing assembly findings, the proposed system with insulation values, attachment, and details, broken out line by line so a committee can interrogate every item without a phone call.",
        "Then execution: staging, crane days, noisy phases, and odor-sensitive work all scheduled with your team in advance. Tenants notified, operations protected, site controlled. We've built the process so that the disruptive part of a reroof is the part you planned for — nothing else.",
        "System-agnostic on purpose: TPO, EPDM, PVC, modified bitumen, coatings, and metal are all on our truck. The building and the budget pick the system, not the contractor's inventory.",
      ],
    },
    sections: [
      {
        title: "What the pre-replacement assessment establishes",
        paragraphs: [
          "Before anyone talks systems, we establish what's actually up there. Core samples physically open the assembly to identify each layer and its condition; moisture mapping locates saturated insulation; the deck gets identified and evaluated, because steel, wood, concrete, and gypsum decks each dictate different attachment options. Where applicable, fastener pull testing verifies what the deck will actually hold, and buildings adding weight or changing systems get a structural review where needed.",
          "This isn't ceremony — it's what makes the proposal real. A replacement bid written from the parking lot is a guess with a signature line, and guesses become change orders. The assessment findings ride along in the proposal so your board sees the evidence behind the spec.",
        ],
      },
      {
        title: "Recover or tear off — and what the code allows",
        paragraphs: [
          "A recover leaves the existing roof in place and builds the new system over it: less cost, less disposal, less time with the building open to weather. It's only honest when the existing assembly is dry and sound — which the cores and moisture map establish — and when code permits it: building codes limit how many roof layers a building may carry, and the local code's limit is verified, not assumed.",
          "Tear-off resets everything: wet material leaves, the deck gets inspected and repaired in daylight, and the new assembly starts clean. It costs more and demands tighter weather management, but on a saturated or layered-out roof it's the only answer that isn't a deferral. We show you the core results either way and price both paths when both are legitimate.",
        ],
      },
      {
        title: "The parts of the roof you don't see from the ladder",
        paragraphs: [
          "A replacement is the once-in-decades chance to fix the assembly, not just the surface. Insulation gets specified to a target R-value, and tapered insulation can build drainage slope into a roof that never had enough — positive drainage, commonly targeted around a quarter inch per foot where practical, is designed in rather than hoped for. A cover board between insulation and membrane stiffens the surface against hail and traffic.",
          "The perimeter and penetrations get engineered too: edge metal and copings sized for the building's wind-uplift zones (corners and edges see far higher wind loads than the field), drains and scuppers rebuilt rather than reused by default, and curbs brought up to the new system's flashing heights. These line items are where good replacements quietly earn their keep.",
        ],
      },
      {
        title: "Choosing the system: the honest menu",
        paragraphs: [
          "No single system wins every building. The table below is the menu we actually quote from, with relative investment language instead of numbers — because until the assessment is done, numbers are fiction.",
        ],
        table: {
          title: "Commercial replacement systems compared",
          columns: [
            "System",
            "Relative initial investment",
            "Best fit",
            "Where to read more",
          ],
          rows: [
            [
              "TPO single-ply",
              "Moderate initial investment",
              "Reflectivity and value on most low-slope buildings",
              "/commercial/tpo",
            ],
            [
              "EPDM single-ply",
              "Moderate initial investment",
              "Large open roofs, long service horizons",
              "/commercial/epdm",
            ],
            [
              "PVC single-ply",
              "Higher initial investment",
              "Kitchens, grease, and chemical exposure",
              "/commercial/pvc",
            ],
            [
              "Modified bitumen",
              "Moderate initial investment",
              "High rooftop traffic, redundancy-minded owners",
              "/commercial/modified-bitumen",
            ],
            [
              "Coating restoration",
              "Depends heavily on the existing assembly",
              "Sound, dry roofs with detail-level fatigue",
              "/commercial/roof-coatings",
            ],
            [
              "Standing seam metal",
              "Higher initial investment",
              "Sloped applications and long-horizon owners",
              "/commercial/metal-roofing",
            ],
            [
              "PBR / R-panel metal",
              "Lower initial investment",
              "Pre-engineered buildings, warehouses, ag/industrial",
              "/commercial/metal-roofing",
            ],
            [
              "Structural metal retrofit",
              "Depends heavily on the existing assembly",
              "Re-covering existing metal buildings",
              "/commercial/metal-roofing",
            ],
          ],
          note: "Relative comparisons only — actual investment depends on the assessment findings, assembly design, and access. No system is priced without one.",
        },
        links: [
          {
            label: "Metal systems for commercial buildings",
            href: "/commercial/metal-roofing",
          },
          {
            label: "When restoration beats replacement",
            href: "/commercial/roof-coatings",
          },
        ],
      },
      {
        title: "Running the project over a working building",
        paragraphs: [
          "Occupied-building replacement is a logistics discipline. Phasing divides the roof into sections that are opened and closed watertight the same day — daily dry-in is the rule that protects your interior when an afternoon storm builds over the Gulf. Material loading and crane days get scheduled around your operations; staging areas, tenant notifications, and building-access plans are set before mobilization, and odor- or noise-heavy phases land outside your sensitive hours where possible.",
          "Weather planning is continuous, not aspirational: sections don't open ahead of weather that can't be beaten, and the schedule builds in the season's realities. Discoveries — a soft deck section under old wet insulation, for example — are handled through written change orders with photos, unit pricing where established, and your authorization before the work proceeds. No verbal surprises invoiced later.",
        ],
      },
      {
        title: "Closeout: what you hold when we leave",
        paragraphs: [
          "The project ends with a package, not a handshake: as-built documentation and photos of the completed assembly and its details, executed warranty paperwork, and the maintenance requirements the warranty expects, translated into a schedule. Where the manufacturer's warranty program requires it, the manufacturer's own inspection of the completed roof happens before the warranty issues — a second set of eyes we welcome.",
          "Manufacturer limited warranty options vary with the system, its components, installation, and registration, and coverage follows the written warranty terms — we'll walk your team through exactly what the document does and doesn't cover. Then the closeout package becomes the first entry in the roof's maintenance record.",
        ],
        links: [
          {
            label: "Maintenance that protects the new roof",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
    ],
    costFactors: {
      title: "What drives commercial replacement pricing",
      description:
        "Replacement pricing varies enormously between buildings that look similar from the street. These are the levers the assessment quantifies:",
      items: [
        {
          title: "Roof area and geometry",
          text: "Total square footage plus the detail load — parapets, penetrations, curbs, and elevation changes.",
        },
        {
          title: "Recover vs. tear-off",
          text: "Moisture findings and code layer limits decide it; tear-off adds labor, disposal, and weather management.",
        },
        {
          title: "Deck condition",
          text: "Repairs discovered under the old roof are the most common change-order source — the assessment narrows the unknown.",
        },
        {
          title: "System and membrane selection",
          text: "Membrane type and thickness, attachment method, and the manufacturer program behind the warranty.",
        },
        {
          title: "Insulation and drainage design",
          text: "Target R-value, tapered insulation to build slope, and cover boards all carry real material cost.",
        },
        {
          title: "Edge metal and detail scope",
          text: "Perimeter metal engineered for wind-uplift zones, plus drains, scuppers, and curb rework.",
        },
        {
          title: "Logistics and phasing",
          text: "Crane days, staging space, access constraints, and how tightly work must schedule around operations.",
        },
        {
          title: "Warranty term and inspections",
          text: "Longer manufacturer terms typically require specific assemblies and manufacturer inspection at completion.",
        },
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
          text: "A membrane at the end of its planning range fails unpredictably — ahead of it, you control the timing.",
        },
        {
          icon: Banknote,
          title: "Repair spend climbing",
          text: "When the annual repair trend keeps rising, the assessment tells you whether the math has flipped.",
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
          text: "System options with insulation, attachment, and detail specs — written for board review.",
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
          "Moisture data and code decide. A dry, sound assembly within the local code's roof-layer limit can often take a recover (less cost, less disruption); saturated or layered-out assemblies come off. We show you the core results either way.",
      },
      {
        question: "How long does a commercial replacement take?",
        answer:
          "It depends on roof size, tear-off versus recover, weather, and how tightly the work must phase around your operations — commonly measured in weeks for mid-size buildings, but no honest schedule is quoted before the assessment. What we do commit to everywhere: each opened section is closed watertight the same day.",
      },
      {
        question: "What happens when you find problems mid-project?",
        answer:
          "Hidden deck damage under old wet insulation is the classic discovery. It's handled through a written change order — photos of the condition, defined scope, and your authorization before the work proceeds. The assessment's core sampling exists precisely to shrink this category before the contract is signed.",
      },
      {
        question: "How do you handle bid and procurement processes?",
        answer:
          "Our proposals are written to spec-and-bid standards — itemized scope, system data, and references available — so boards and procurement teams can evaluate them properly. When a project requires it, we provide certificates of insurance and the documentation your procurement process calls for.",
      },
      {
        question: "What warranty comes with a new commercial roof?",
        answer:
          "Manufacturer warranty options depend on the system, its required components, installation, registration, and the written warranty terms — longer terms typically require specific assemblies and, in some programs, a manufacturer inspection at completion. We put the actual warranty document in front of you before you sign, not after.",
      },
    ],
    related: [
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description:
          "The assessment sometimes says restore instead — when the roof qualifies.",
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
        "Materials matter just as much: repairs must match the system, and the wrong material on the wrong membrane becomes the next failure point. Our crews identify the roof before opening a repair kit, and carry the compatible materials for all the systems South Mississippi actually has overhead.",
      ],
    },
    sections: [
      {
        title: "Step one on any repair: identify what's up there",
        paragraphs: [
          "Single-ply membranes look alike from a ladder, and they are not interchangeable at repair time. TPO and PVC are both hot-air weldable — but not to each other; the chemistries won't fuse. EPDM is a cured rubber that can't be welded at all — its repairs use compatible primers and pressure-sensitive materials. Modified bitumen takes asphalt-compatible repair work, and metal roofs are a fastener-and-seam discipline of their own. Repairing a membrane with the wrong material creates a patch that fails on its own schedule.",
          "We also look for the sins of the past: previous incompatible repairs — the mystery caulk, the wrong-membrane patch, the roof cement smeared over a single-ply — are among the most common leak sources we find on commercial roofs. Part of a proper repair is removing those, not adding a layer on top.",
        ],
        links: [
          { label: "TPO repair specifics", href: "/commercial/tpo" },
          { label: "EPDM repair specifics", href: "/commercial/epdm" },
          { label: "PVC repair specifics", href: "/commercial/pvc" },
          {
            label: "Modified bitumen repair specifics",
            href: "/commercial/modified-bitumen",
          },
        ],
      },
      {
        title: "From symptom to source: how we diagnose",
        paragraphs: [
          "Most commercial leaks present the same few ways, but each symptom has multiple possible sources — which is why diagnosis precedes repair. The table below is the honest map of how we work a leak call:",
        ],
        table: {
          title: "Commercial leak diagnosis guide",
          columns: [
            "Symptom",
            "Possible source",
            "Diagnostic method",
            "Likely repair category",
          ],
          rows: [
            [
              "Ceiling stain after every rain",
              "Membrane breach, flashing failure, or open seam upslope of the stain",
              "Surface inspection tracing water paths from the stain outward",
              "Membrane-matched patch or flashing repair",
            ],
            [
              "Stain only in wind-driven rain",
              "Wall flashing, parapet transition, or coping joint",
              "Wall and termination inspection; water test if needed",
              "Flashing or termination rework",
            ],
            [
              "Standing water days after rain",
              "Clogged drain or scupper, or inadequate slope",
              "Drainage inspection; slope evaluation",
              "Drain service — or a drainage-design conversation",
            ],
            [
              "Leak near rooftop unit",
              "Curb flashing, panel damage from service traffic, or condensate discharge",
              "Curb and equipment inspection; HVAC coordination",
              "Curb reflash; trade-damage repair",
            ],
            [
              "Recurring leak at an old patch",
              "Previous incompatible repair failing",
              "Material identification; patch removal and inspection",
              "Remove and redo with compatible materials",
            ],
            [
              "Damp interior, no visible breach",
              "Saturated insulation spreading old moisture, or condensation",
              "Core samples; infrared or capacitance moisture scan",
              "Wet-area replacement — or an assembly-level conversation",
            ],
          ],
          note: "Representative patterns — actual diagnosis follows the evidence on your roof, and some leaks have more than one contributing source.",
        },
      },
      {
        title: "When the water is hiding: moisture investigation",
        paragraphs: [
          "Not every leak announces its path. When the surface looks intact but the interior says otherwise, the investigation goes into the assembly: core samples physically confirm which layers are wet, infrared scanning reads the thermal signature of saturated insulation after sunset, and electrical capacitance meters detect moisture through the membrane without cutting it.",
          "The distinction matters because wet insulation doesn't dry in place — it degrades R-value, corrodes fasteners and deck from below, and keeps feeding interior moisture long after the entry point is sealed. A repair that fixes the breach but leaves a saturated zone behind is half a repair; we scope the wet-area replacement alongside the patch so you can authorize the whole fix.",
        ],
      },
      {
        title: "The usual suspects: details that fail first",
        paragraphs: [
          "Field membrane rarely fails on its own — the details do. Pitch pockets (sealant-filled pans around irregular penetrations) dry out and crack on a schedule all their own. Curb flashings take trade traffic. Expansion joints and parapet transitions move with the building until something opens. Drains and scuppers clog and back water up over their own flashings. And nearly every commercial roof carries abandoned penetrations — the disused vent, the removed antenna mount — that were 'temporarily' sealed years ago.",
          "Repairs at these details are where experience pays: each one has a manufacturer-compatible rebuild method, and each has a shortcut version that leaks again in eighteen months. Our repair reports photograph what we found and what we rebuilt, so the record shows the difference.",
        ],
        links: [
          {
            label: "Catch detail failures before they leak",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
      {
        title: "Emergency stabilization vs. the permanent fix",
        paragraphs: [
          "In active weather, the first visit is about stopping the water: temporary measures that protect the interior until conditions allow permanent work. Interior protection and tenant coordination are part of that visit, not an afterthought — we'd rather move the pallet than document the loss. The permanent repair follows as manufacturer-compatible work, which matters on warranted roofs where an improper repair can jeopardize coverage.",
          "Everything is documented and authorized: photos of cause and repair, written scope before work proceeds, and an honest read on what the repair means. Repair warranties cover the repair — not the rest of an aging roof — and we say so plainly. When repairs start clustering, that pattern is data: repeated failures across a roof often indicate an assembly-level problem that no individual patch will solve, and the documentation trail is what lets you make that call on evidence instead of frustration.",
        ],
        links: [
          {
            label: "When repair clusters point to restoration",
            href: "/commercial/roof-coatings",
          },
          {
            label: "When the answer is replacement",
            href: "/commercial/roof-replacement",
          },
        ],
      },
    ],
    costFactors: {
      title: "What goes into commercial repair pricing",
      description:
        "Repair invoices are mostly about what it takes to do the work correctly on your specific building — these are the real components:",
      items: [
        {
          title: "Mobilization and access",
          text: "Roof height, hatch or ladder access, and whether a lift or crane is needed to reach the work.",
        },
        {
          title: "Diagnostics",
          text: "Leak tracing, membrane identification, and moisture investigation (cores, infrared, or capacitance scanning) where the symptom demands it.",
        },
        {
          title: "Emergency timing",
          text: "After-hours and active-weather response carries different logistics than scheduled work.",
        },
        {
          title: "Material compatibility",
          text: "Membrane-matched materials — and removal of previous incompatible repairs where they're the problem.",
        },
        {
          title: "Wet-material replacement",
          text: "Saturated insulation found during the repair is scoped and authorized as its own line.",
        },
        {
          title: "Custom metal work",
          text: "Edge metal, copings, and curb caps often need fabrication rather than off-the-shelf parts.",
        },
        {
          title: "Interior protection and coordination",
          text: "Tenant scheduling, interior containment, and working around your operations take real time.",
        },
        {
          title: "Operational restrictions",
          text: "Facilities that limit work hours, require escorts, or restrict equipment change how repairs are staged.",
        },
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
          text: "Standing water days after rain accelerates every failure mode a roof has — it's never harmless.",
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
        question: "Can any roofer patch our single-ply roof?",
        answer:
          "Only with the right materials and methods. TPO and PVC each need their own weld-compatible material — they won't fuse to each other — and EPDM can't be welded at all; it takes compatible primers and tape-based repairs. A patch made with the wrong system is a future leak with a fresh invoice.",
      },
      {
        question: "Why does the same spot keep leaking after repairs?",
        answer:
          "Usually one of three things: the patch treated the symptom location instead of the true entry point, a previous repair used incompatible materials that keep failing, or the assembly around the spot — wet insulation, a failing detail, ponding — is the real problem. Diagnosis answers which, and repeated failures across a roof are a sign to evaluate the assembly, not just re-patch.",
      },
      {
        question: "Will a repair void our manufacturer warranty?",
        answer:
          "Improper repairs can — which is why repairs must match the system and, on warranted roofs, follow the manufacturer's requirements. Tell us what warranty you carry and we work within it, with the documentation to show it.",
      },
      {
        question: "Repair, restore, or replace — how do we know?",
        answer:
          "Isolated damage on a sound roof: repair. Widespread detail failure on a dry roof: restoration candidate. Saturated insulation or systemic failure: replacement conversation. Our documentation shows you which one you're in.",
      },
      {
        question: "Can you repair a roof another contractor installed?",
        answer:
          "Constantly. Most of our commercial repair work is on roofs we didn't install — including systems whose original installers are long gone. The membrane gets identified, the materials get matched, and the repair record starts fresh with us.",
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
