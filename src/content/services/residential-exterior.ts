import {
  CalendarClock,
  Droplets,
  Layers,
  Leaf,
  TriangleAlert,
  Waves,
  Wind,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Residential exterior expansion (owner directive 2026-07-04): leaf guard,
 * vinyl siding, fiber cement siding, fascia, and soffit. Chips heroes
 * until photography is supplied. Every page has a registry slot in
 * content/service-images.ts ([NEEDS] noted there).
 */

export const exteriorServices: ServiceContent[] = [
  /* ------------------------------------------------------------------ */
  /* Leaf guard                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "leaf-guard",
    path: "/residential/leaf-guard",
    name: "Leaf Guard Systems",
    metaTitle: "Leaf Guard & Gutter Protection in MS | Southeast Roofing",
    metaDescription:
      "Leaf guard systems for South Mississippi homes, stop pine straw and leaves from clogging your gutters, and retire the ladder for good.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Leaf guards: retire the ladder",
      subhead:
        "Pine straw is the great gutter-killer of South Mississippi: it mats, clogs, and sends rain pouring over the edges. A quality leaf guard keeps the water path open year-round without the twice-a-year ladder ritual.",
      chips: [
        "Blocks pine straw & leaves",
        "Cut cleaning for good",
        "Fits new or existing gutters",
      ],
    },
    intro: {
      title: "Why gutter protection earns its keep here",
      paragraphs: [
        "Between the pines and the oaks, South Mississippi gutters fill faster than almost anywhere, and a clogged gutter isn't a cosmetic problem. Overflow rots fascia boards, stains siding, floods beds, and dumps water at the slab. The homeowner's alternative is climbing a ladder several times a year, which is exactly how a lot of ER visits start.",
        "Leaf guards close the top of the gutter to debris while keeping it open to water. Installed correctly: pitched with the gutter, sealed at the roofline, matched to your gutter profile. They turn gutters into a system you simply stop thinking about. We install them on new seamless gutters or retrofit them to sound existing ones.",
      ],
    },
    sections: [
      {
        title: "The five families of gutter protection",
        paragraphs: [
          '"Leaf guard" covers five genuinely different product families, and they don\'t perform alike: especially under pine straw:',
        ],
        table: {
          title: "Gutter guard types compared",
          columns: [
            "Guard type",
            "Debris performance",
            "Heavy-rain behavior",
            "Maintenance",
            "Visibility",
            "Best use",
            "Main drawback",
          ],
          rows: [
            [
              "Perforated metal screen",
              "Stops leaves; needles can enter or mat on top",
              "Handles high flow well",
              "Periodic brush-off and flush",
              "Low profile",
              "Oak-leaf yards on a budget",
              "Pine straw threads through or bridges the openings",
            ],
            [
              "Expanded-metal screen",
              "Stops most leaves; openings admit fine debris",
              "Good flow capacity",
              "Brush-off; occasional lift-and-clean",
              "Low profile",
              "Mixed hardwood debris",
              "Needles lodge in the mesh pattern",
            ],
            [
              "Micro-mesh",
              "Blocks needles, shingle granules, and seed pods",
              "Very good when clean; pollen film can shed water until rinsed",
              "Surface rinse or soft-brush as needed",
              "Low profile",
              "Heavy pine straw. The usual pick here",
              "Higher initial investment; quality varies widely by brand",
            ],
            [
              "Solid surface-tension cover",
              "Sheds most debris off the nose",
              "Can overshoot in intense downpours, especially on steep roofs",
              "Occasional nose cleaning",
              "Most visible from the ground",
              "Heavy leaf load on moderate pitches",
              "Overshoot in Gulf-intensity rain; fit is pitch-sensitive",
            ],
            [
              "Foam or brush inserts",
              "Debris collects on top and works in",
              "Reduces the gutter's own capacity",
              "Frequent cleaning; degrades in UV",
              "Invisible",
              "Short-term stopgap only",
              "Clogs, breaks down, hides problems. We don't recommend them",
            ],
          ],
          note: "Representative behavior by family, specific products vary, which is why we spec from your trees, pitch, and gutters.",
        },
      },
      {
        title: "Pine straw is the entrance exam",
        paragraphs: [
          "Most guards are designed around broad leaves, and broad leaves are the easy problem. They sit on top and blow off. Pine needles are the local test: thin enough to thread through screen openings, prone to matting into a thatch that bridges over a guard, and dropped for much of the year. Add shingle granules washing off in every rain and seed pods in spring, and fine-opening protection stops being a luxury.",
          "Valleys concentrate the problem: two roof planes' debris and water arrive at one short stretch of gutter, so that's where bridging starts and overflow shows first. On homes with big valleys over gutter runs, guard choice and fastening in that zone get special attention.",
        ],
      },
      {
        title: "Heavy rain: the other half of the test",
        paragraphs: [
          "A guard that stops needles but can't swallow a Gulf downpour just relocates the overflow. Fine mesh sheds water well when clean, but a film of pollen or granule dust can make water skate over it until rinsed. An honest maintenance point the brochures skip. Solid covers carry a different risk: at high rain intensity, especially on steep pitches and below valleys, water can overshoot the nose entirely.",
          "And no guard adds capacity. If the gutter is undersized or the downspouts can't drain what arrives, a guard won't fix the overflow: we evaluate the gutter system first, the guard second.",
        ],
        links: [
          {
            label: "How we size gutters and downspouts",
            href: "/residential/gutters",
          },
        ],
      },
      {
        title: "What guards don't do",
        paragraphs: [
          "No guard eliminates maintenance entirely, anyone saying otherwise is selling, not advising. The honest expectation: climbing and scooping ends, replaced by an occasional visual check and surface brush-off in heavy pine areas, plus an eye on downspouts and underground drains, which can still collect what slips past over the years.",
          "Also worth knowing: some guard designs install by sliding under the first course of shingles. Lifting the roof edge can raise concerns with the shingle manufacturer's requirements and wind performance, so we prefer designs that fasten to the gutter and fascia without disturbing the shingles: especially on newer roofs with registered warranty coverage.",
        ],
      },
      {
        title: "Healthy gutters first: always",
        paragraphs: [
          "A guard is a lid, and a lid on a failing system locks the failure in. We never install guards over gutters that are back-pitched, rusted through, or pulling loose, and never over rotten fascia. The fix starts below, or the guard money is wasted. Size matters too: a guard has to match the profile of the gutter it protects.",
          "That's the advantage of a roofing company over a guard-only franchise: we check shingle edge, drip edge, fascia, and gutters as one system, fix what's actually wrong, and only then close the top.",
        ],
        links: [
          {
            label: "Fascia repair before guards go on",
            href: "/residential/fascia",
          },
        ],
      },
    ],
    costFactors: {
      title: "Why leaf guard quotes are home-specific",
      description:
        "Guard pricing follows the house, not a per-foot sticker. Here's what we look at before quoting.",
      items: [
        {
          title: "Guard family selected",
          text: "Micro-mesh, screen, and surface-tension products sit at different price points and suit different debris loads.",
        },
        {
          title: "Linear footage and runs",
          text: "Total gutter length and how it's broken into separate runs and corners.",
        },
        {
          title: "Stories and access",
          text: "Second-story eaves and steep terrain change the ladder and staging work.",
        },
        {
          title: "Existing gutter condition",
          text: "Re-pitching, resealing, or replacing runs comes first, guards only go on gutters worth protecting.",
        },
        {
          title: "Roof pitch",
          text: "Steeper roofs deliver water faster and narrow the guard choices that behave well.",
        },
        {
          title: "Valleys and corners",
          text: "Valley discharge zones and miters need extra attention and sometimes different detailing.",
        },
      ],
    },
    signs: {
      title: "Signs leaf guards belong on your home",
      items: [
        {
          icon: Leaf,
          title: "Trees over the roofline",
          text: "Pines and oaks overhead mean gutters that clog every season, guaranteed.",
        },
        {
          icon: Waves,
          title: "Overflow after storms",
          text: "Water sheeting over the gutter edge while the downspouts run dry: that's a clog talking.",
        },
        {
          icon: TriangleAlert,
          title: "The ladder ritual",
          text: "If you're cleaning gutters more than once a year, guards remove a recurring chore, and a recurring fall risk.",
        },
        {
          icon: Droplets,
          title: "Fascia stains and rot",
          text: "Chronic overflow shows up as peeling paint and soft boards at the roof edge.",
        },
      ],
    },
    approach: {
      title: "How we install leaf guards",
      steps: [
        {
          title: "Gutter health check",
          text: "Guards on failing gutters waste money. We verify pitch, hangers, and seams first.",
        },
        {
          title: "Match the guard to the debris",
          text: "Pine straw demands finer protection than oak leaves: we spec for what your trees actually drop.",
        },
        {
          title: "Sealed, pitched installation",
          text: "Fitted to your gutter profile and roofline so water in, debris out, nothing trapped between.",
        },
        {
          title: "Water test and walkaround",
          text: "We verify flow at every downspout before we leave.",
        },
      ],
    },
    faqs: [
      {
        question: "Do leaf guards really work with pine straw?",
        answer:
          "The right ones do. Pine straw defeats cheap open-screen guards by threading through them, fine-mesh and properly engineered surface-tension systems keep it out. Tree type is the first question we ask, because it decides the product.",
      },
      {
        question: "Can you add guards to my existing gutters?",
        answer:
          "Yes, if the gutters themselves are sound: right pitch, solid hangers, sealed seams. If they're failing, we'll tell you honestly, because guards on bad gutters just protect a broken system.",
      },
      {
        question: "Do I ever have to clean them?",
        answer:
          "Dramatically less, debris sheds off rather than settling in. An occasional brush-off of the surface in heavy pine areas is the honest expectation; climbing and scooping is over.",
      },
      {
        question: "Which gutter guard type is best?",
        answer:
          "There's no universal winner. It depends on your trees, roof pitch, gutter size, and budget. Under heavy pine straw, fine micro-mesh usually earns the recommendation; under mostly oak leaves, a quality screen can do the job for less. We spec from what your roof actually sheds.",
      },
      {
        question: "Will a guard affect my shingle warranty?",
        answer:
          "It can, depending on the design. Guards that slide under the first shingle course lift the roof edge, which can raise concerns with the manufacturer's installation requirements and wind performance. We favor designs that mount to the gutter and fascia without touching the shingles.",
      },
      {
        question: "Can leaf guards handle our downpours?",
        answer:
          "Good ones, correctly matched to the roof, yes, but rain intensity is where guard families differ. Solid covers can overshoot on steep pitches, and mesh sheds best when clean. The gutter and downspouts underneath still have to be sized for the water; a guard never adds capacity.",
      },
    ],
    related: [
      {
        label: "Seamless Gutters",
        href: "/residential/gutters",
        description: "The system leaf guards protect: sized for Gulf rain.",
      },
      {
        label: "Fascia Replacement",
        href: "/residential/fascia",
        description: "Overflow damage at the roof edge, repaired right.",
      },
      {
        label: "Roof Repair",
        href: "/residential/roof-repair",
        description: "Water problems above the gutter line, traced and fixed.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Fascia                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "fascia",
    path: "/residential/fascia",
    name: "Fascia Replacement",
    metaTitle: "Fascia Repair & Replacement in MS | Southeast Roofing",
    metaDescription:
      "Fascia repair and replacement in South Mississippi, fix the rotted boards at your roof edge and cap them so the problem never comes back.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Fascia: the roof edge that takes the abuse",
      subhead:
        "The fascia is the board your gutters hang on, first to rot when gutters overflow, first to show peeling paint at the roofline. We replace it right and cap it so you stop repainting it.",
      chips: ["Rot repair", "Aluminum capping", "Gutter-ready"],
    },
    intro: {
      title: "Small boards, big consequences",
      paragraphs: [
        "Fascia boards live in the splash zone: every overflowing gutter, every ice-free Mississippi downpour, every failed drip edge sends water across them. Once they soften, the problems cascade: gutters loosen and sag, water reaches the rafter tails behind, and the roofline starts looking tired from the street.",
        "Because fascia sits where roofing, gutters, and soffit meet, it's naturally a roofer's repair. We replace rotted sections or full runs, correct the drip edge relationship that caused the rot, and, where you want the repaint cycle gone, wrap the new boards in color-matched aluminum so the roofline stays crisp for decades.",
      ],
    },
    sections: [
      {
        title: "The anatomy of a roof edge",
        paragraphs: [
          "A few terms make every fascia conversation clearer. The fascia is the finished vertical board at the roof edge. The one gutters hang on. Behind it there's often a subfascia, a rougher structural board nailed across the rafter tails (the cut ends of the rafters). The soffit closes the underside of the overhang, vented or solid. And at the top, edge metal directs water off the shingles: L-profile drip edge, or a gutter apron whose longer leg reaches down over the gutter's back.",
          "These parts fail together because they share the same water, when edge metal is missing or the gutter overflows, the fascia takes it first, then the subfascia and rafter tails, then the last course of decking. That's why our quotes start with probing behind the visible board, replacing the face while the tails rot behind it fixes the paint, not the problem.",
        ],
      },
      {
        title: "How fascia actually rots",
        paragraphs: [
          "Fascia rot almost always has an upstream cause, and finding it is the difference between a repair and a repeat visit:",
        ],
        bullets: [
          "Water running behind the gutter, missing or short drip edge lets runoff track down the gutter's back and soak the board",
          "Chronic overflow, clogged gutters or undersized downspouts wash the fascia every storm",
          "Back-pitched gutters, standing water keeps the wood behind them damp between rains",
          "Paint failure, once the coating opens, bare wood wicks moisture",
          "Animal and insect damage: squirrels, woodpeckers, and carpenter bees open water paths into sound wood",
          "Moisture sealed behind old aluminum wrap, capping over damp wood traps water and hides the rot until a gutter pulls loose",
        ],
        links: [
          {
            label: "Gutter overflow fixes that protect fascia",
            href: "/residential/gutters",
          },
        ],
      },
      {
        title: "Repair, replace, or wrap, and the wrap trap",
        paragraphs: [
          "Localized soft spots can sometimes be cut out and patched, but once rot shows in several places along a run, replacing the full board is the cleaner, longer-lasting call. We check the subfascia and rafter tails while the board is off, if they're soft, they get sistered or replaced too, because new fascia screwed to rotten framing won't hold a gutter for long.",
          "Aluminum wrap deserves an honest paragraph. Capping sound fascia in color-matched aluminum is a genuinely good upgrade. The repaint cycle ends and the edge sheds water. But wrapping rotten wood is not a repair; it's a cover-up that traps moisture and surfaces later as a sagging gutter or a hole a squirrel found first. We wrap only over wood we've verified or replaced, with the drip edge corrected above it, if a crew offers to wrap what they haven't probed, get a second opinion.",
        ],
      },
      {
        title: "What fascia work touches, and what it can't avoid",
        paragraphs: [
          "Fascia doesn't come off in isolation. Gutters have to come down and go back up, the natural moment to correct their pitch and replace tired hangers, which is part of every fascia job we do. At the top edge, the drip edge laps over the fascia from under the shingles, so a clean replacement can mean lifting the first shingle course or renewing edge metal; done carelessly, that detail is how a fascia job creates a roof leak. If the last course of decking turns out soft, you'll see photos before we touch anything beyond the quote.",
          "Where the job extends into the soffit, remember the overhang is the intake side of your attic's ventilation. Replacing soffit panels changes how much air the attic breathes, so we keep vented area at or above what the attic needs rather than sealing it shut behind fresh trim.",
        ],
        links: [
          {
            label: "Why soffit intake drives attic ventilation",
            href: "/residential/ventilation",
          },
        ],
      },
    ],
    costFactors: {
      title: "What shapes the price of fascia work",
      description:
        "Fascia is quoted by the run and the damage behind it. These are the drivers.",
      items: [
        {
          title: "Length affected",
          text: "One soft section behind a gutter bracket is a different job than full runs on multiple elevations.",
        },
        {
          title: "How deep the rot goes",
          text: "Face board only, or subfascia, rafter tails, and edge decking behind it.",
        },
        {
          title: "Stories and access",
          text: "Second-story rooflines and steep terrain change staging and time.",
        },
        {
          title: "Gutter removal and re-hang",
          text: "Gutters come down for the work and go back up on corrected pitch.",
        },
        {
          title: "Material choice",
          text: "Painted wood, rot-resistant composite or PVC trim, and optional aluminum capping each price differently.",
        },
        {
          title: "Edge metal correction",
          text: "Fixing the drip edge that caused the rot: otherwise the new board inherits the old problem.",
        },
        {
          title: "Finish work",
          text: "Caulking and painting exposed wood, or color-matching wrap to your trim.",
        },
      ],
    },
    signs: {
      title: "Signs your fascia needs attention",
      items: [
        {
          icon: Droplets,
          title: "Peeling paint at the roofline",
          text: "The first visible symptom of moisture cycling through the boards.",
        },
        {
          icon: TriangleAlert,
          title: "Soft or crumbling wood",
          text: "Press a screwdriver near gutter brackets, soft means rot is established.",
        },
        {
          icon: Waves,
          title: "Sagging gutters",
          text: "Gutters pulling loose usually mean the wood behind the hangers has failed.",
        },
        {
          icon: Layers,
          title: "Critter access",
          text: "Gaps at rotted fascia are the front door for squirrels and wasps headed for your attic.",
        },
      ],
    },
    approach: {
      title: "How we handle fascia",
      steps: [
        {
          title: "Find the water source",
          text: "Rot is a symptom: we identify the overflow, flashing, or drip-edge failure that caused it.",
        },
        {
          title: "Replace what's failed",
          text: "Sections or full runs replaced with sound material, rafter tails checked behind.",
        },
        {
          title: "Cap it in aluminum",
          text: "Optional color-matched capping ends the repaint cycle permanently.",
        },
        {
          title: "Re-hang and verify",
          text: "Gutters re-hung with proper pitch on the new boards, water-tested.",
        },
      ],
    },
    faqs: [
      {
        question: "Can you replace fascia without replacing the roof?",
        answer:
          "Yes, fascia work is routine on its own. The natural pairing is with gutter work, since gutters come off and go back on anyway. During a reroof it's the most economical of all, which is why we check fascia on every replacement.",
      },
      {
        question: "What's the difference between fascia and soffit?",
        answer:
          "Fascia is the vertical board facing outward at the roof edge; soffit is the horizontal surface underneath the overhang. They meet at the eave and usually fail together when water gets loose. We handle both.",
      },
      {
        question: "Is aluminum capping worth it?",
        answer:
          "If you're tired of painting the roofline, yes, capped fascia never needs repainting and typically stays crisp for many years. On a one-time budget fix, primed and painted wood is honest too. We quote both.",
      },
      {
        question: "Why did my fascia rot right behind the gutters?",
        answer:
          "Because that's where the water runs when edge details fail: missing or short drip edge lets runoff track down the gutter's back and soak the board, and a back-pitched gutter keeps the wood damp between rains. The gutter face hides it, so the rot is usually well established by the time paint bubbles or a hanger pulls loose.",
      },
      {
        question: "Can you just wrap the existing fascia in aluminum?",
        answer:
          "Only if the wood underneath is sound and dry. We probe before we wrap. Capping over rotten or damp fascia traps moisture and hides the damage. If a run is soft, we replace it first, then wrap it if you want the repaint cycle gone.",
      },
      {
        question: "Will fascia work disturb my roof or gutters?",
        answer:
          "The gutters come down and go back up on corrected pitch, that's routine and part of the job. At the roof edge, a clean replacement can involve lifting the first shingle course or renewing the edge metal that laps over the fascia. Done properly, your roof is undisturbed where it counts.",
      },
    ],
    related: [
      {
        label: "Soffit Replacement",
        href: "/residential/soffit",
        description: "Fascia's partner under the overhang.",
      },
      {
        label: "Seamless Gutters",
        href: "/residential/gutters",
        description: "New fascia deserves gutters hung right.",
      },
      {
        label: "Leaf Guard Systems",
        href: "/residential/leaf-guard",
        description: "Stop the overflow that rots fascia in the first place.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Soffit                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "soffit",
    path: "/residential/soffit",
    name: "Soffit Replacement",
    metaTitle: "Soffit Repair & Replacement in MS | Southeast Roofing",
    metaDescription:
      "Soffit repair and replacement in South Mississippi, vented panels that feed your attic airflow and close the overhang to pests and moisture.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Soffit: where your attic breathes",
      subhead:
        "The panels under your roof overhang aren't decoration. They're the intake side of your attic's ventilation and the barrier keeping wasps, squirrels, and moisture out of the eaves.",
      chips: ["Vented airflow", "Pest barrier", "Vinyl & aluminum"],
    },
    intro: {
      title: "The most underestimated surface on the house",
      paragraphs: [
        "Every ridge vent on a roof depends on soffit doing its quiet job below: pulling fresh air into the attic at the eaves. When soffit panels are damaged, painted shut, or missing, the whole ventilation system stalls: attic heat soars, shingles cook from beneath, and summer cooling bills climb. In our humidity, stalled attic air also means condensation and mildew.",
        "Soffit is also the eave's security door. Sagging or holed panels are how squirrels, birds, and wasp nests end up in attics every spring. We replace damaged soffit with vented vinyl or aluminum panels matched to your trim, sized to feed the ventilation your roof actually needs. A detail we calculate, not guess, because we're the ones installing the ridge vents above it.",
      ],
    },
    signs: {
      title: "Signs your soffit needs attention",
      items: [
        {
          icon: TriangleAlert,
          title: "Sagging or missing panels",
          text: "Open eaves invite pests and let wind-driven rain into the overhang.",
        },
        {
          icon: Layers,
          title: "Peeling and staining",
          text: "Moisture marks under the eaves often trace to roof-edge leaks or blocked airflow.",
        },
        {
          icon: Wind,
          title: "A stifling attic",
          text: "If the ridge vent has no intake below, the attic can't breathe, soffit is usually why.",
        },
        {
          icon: CalendarClock,
          title: "Wasps and squirrels, annually",
          text: "Recurring nests in the eaves mean the barrier has failed somewhere.",
        },
      ],
    },
    approach: {
      title: "How we handle soffit",
      steps: [
        {
          title: "Ventilation math first",
          text: "We calculate the intake your attic needs so the new soffit feeds the system properly.",
        },
        {
          title: "Repair or replace honestly",
          text: "Sections or full perimeters, in vented vinyl or aluminum matched to your trim.",
        },
        {
          title: "Clear the airway",
          text: "Insulation baffles installed where attic insulation is choking the intake.",
        },
        {
          title: "Seal the eave",
          text: "Panels fitted tight to fascia and wall: airflow in, pests out.",
        },
      ],
    },
    faqs: [
      {
        question: "Vented or solid soffit: which do I need?",
        answer:
          "Most homes need a calculated mix: enough vented panel to feed the attic's exhaust ventilation, solid where intake isn't needed. All-solid soffit suffocates an attic; we do the math rather than guessing.",
      },
      {
        question: "Can soffit be replaced without touching the roof?",
        answer:
          "Yes, soffit and fascia work happens from below and is routine on its own. If a reroof is anywhere on your horizon, though, doing them together is the most economical path.",
      },
      {
        question: "Will new soffit really lower attic temperatures?",
        answer:
          "If your current intake is blocked or undersized, noticeably, balanced intake and exhaust is what moves attic heat out. It's the same system logic as our ventilation service, applied at the eaves.",
      },
    ],
    related: [
      {
        label: "Roof & Attic Ventilation",
        href: "/residential/ventilation",
        description: "The exhaust side of the airflow soffit feeds.",
      },
      {
        label: "Fascia Replacement",
        href: "/residential/fascia",
        description: "The roofline board soffit meets at the eave.",
      },
    ],
  },
];
