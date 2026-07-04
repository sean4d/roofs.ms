import {
  CalendarClock,
  CloudRain,
  Droplets,
  Home,
  Layers,
  Leaf,
  Paintbrush,
  TriangleAlert,
  Waves,
  Wind,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Residential exterior expansion (owner directive 2026-07-04): leaf guard,
 * vinyl siding, fiber cement siding, fascia, and soffit. Chips heroes
 * until photography is supplied — every page has a registry slot in
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
    metaTitle: "Leaf Guard & Gutter Protection | South Mississippi",
    metaDescription:
      "Leaf guard systems for South Mississippi homes — stop pine straw and leaves from clogging your gutters, and retire the ladder for good.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Leaf guards: retire the ladder",
      subhead:
        "Pine straw is the great gutter-killer of South Mississippi — it mats, clogs, and sends rain pouring over the edges. A quality leaf guard keeps the water path open year-round without the twice-a-year ladder ritual.",
      chips: [
        "Blocks pine straw & leaves",
        "Cut cleaning for good",
        "Fits new or existing gutters",
      ],
    },
    intro: {
      title: "Why gutter protection earns its keep here",
      paragraphs: [
        "Between the pines and the oaks, South Mississippi gutters fill faster than almost anywhere — and a clogged gutter isn't a cosmetic problem. Overflow rots fascia boards, stains siding, floods beds, and dumps water at the slab. The homeowner's alternative is climbing a ladder several times a year, which is exactly how a lot of ER visits start.",
        "Leaf guards close the top of the gutter to debris while keeping it open to water. Installed correctly — pitched with the gutter, sealed at the roofline, matched to your gutter profile — they turn gutters into a system you simply stop thinking about. We install them on new seamless gutters or retrofit them to sound existing ones.",
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
          text: "Water sheeting over the gutter edge while the downspouts run dry — that's a clog talking.",
        },
        {
          icon: TriangleAlert,
          title: "The ladder ritual",
          text: "If you're cleaning gutters more than once a year, guards pay for themselves in avoided risk alone.",
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
          text: "Guards on failing gutters waste money — we verify pitch, hangers, and seams first.",
        },
        {
          title: "Match the guard to the debris",
          text: "Pine straw demands finer protection than oak leaves — we spec for what your trees actually drop.",
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
          "The right ones do. Pine straw defeats cheap open-screen guards by threading through them — fine-mesh and properly engineered surface-tension systems keep it out. Tree type is the first question we ask, because it decides the product.",
      },
      {
        question: "Can you add guards to my existing gutters?",
        answer:
          "Yes, if the gutters themselves are sound — right pitch, solid hangers, sealed seams. If they're failing, we'll tell you honestly, because guards on bad gutters just protect a broken system.",
      },
      {
        question: "Do I ever have to clean them?",
        answer:
          "Dramatically less — debris sheds off rather than settling in. An occasional brush-off of the surface in heavy pine areas is the honest expectation; climbing and scooping is over.",
      },
    ],
    related: [
      {
        label: "Seamless Gutters",
        href: "/residential/gutters",
        description: "The system leaf guards protect — sized for Gulf rain.",
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
  /* Vinyl siding                                                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "vinyl-siding",
    path: "/residential/vinyl-siding",
    name: "Vinyl Siding",
    metaTitle: "Vinyl Siding Installation | South Mississippi",
    metaDescription:
      "Vinyl siding installation and replacement for South Mississippi homes — low-maintenance exteriors that stand up to heat, humidity, and storm season.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Vinyl siding: the low-maintenance exterior",
      subhead:
        "No painting, no rot, no termites' favorite meal — vinyl remains the most practical exterior in the South. Installed straight, locked, and flashed correctly, it looks sharp for decades.",
      chips: ["Never needs paint", "Storm-rated profiles", "Full color range"],
    },
    intro: {
      title: "Practical protection for a humid climate",
      paragraphs: [
        "Wood exteriors in South Mississippi fight a losing battle — humidity swells it, sun peels it, and repainting never ends. Vinyl ended that fight for most homeowners: color runs through the material, moisture can't rot it, and washing it is maintenance. Modern profiles have real depth and texture, a long way from the flimsy panels of decades past.",
        "Like roofing, siding lives or dies on installation. Vinyl expands and contracts more than any other exterior, so it must be hung — nailed loose on the flange, locked course to course, flashed at every window and corner. Siding slapped on tight buckles in the first summer. We install it the way the manufacturer engineered it to move.",
      ],
    },
    signs: {
      title: "Signs it's time for new siding",
      items: [
        {
          icon: Paintbrush,
          title: "The repaint cycle is back",
          text: "Peeling and fading every few years is money that vinyl retires permanently.",
        },
        {
          icon: Wind,
          title: "Storm-cracked panels",
          text: "Hail strikes and wind-thrown debris crack aging siding — often an insurance conversation.",
        },
        {
          icon: Droplets,
          title: "Moisture getting behind",
          text: "Warped boards, soft spots, or mildew lines mean the envelope is leaking.",
        },
        {
          icon: Home,
          title: "Curb appeal is dated",
          text: "New siding transforms a home's face faster than any other exterior project.",
        },
      ],
    },
    approach: {
      title: "How we install vinyl siding",
      steps: [
        {
          title: "Inspect what's underneath",
          text: "Sheathing and moisture barrier checked and corrected — siding is only as good as its base.",
        },
        {
          title: "Profile and color selection",
          text: "Panel style, texture, and color chosen with real samples against your home.",
        },
        {
          title: "Hung to move",
          text: "Loose-nailed, locked, and flashed so panels ride thermal swings without buckling.",
        },
        {
          title: "Trim-out and cleanup",
          text: "Corners, windows, and soffit transitions finished clean; site left spotless.",
        },
      ],
    },
    faqs: [
      {
        question: "How long does vinyl siding last?",
        answer:
          "Decades — quality vinyl routinely serves 20–40 years in our climate. Fade resistance has improved dramatically, and the material itself doesn't rot, feed insects, or need paint.",
      },
      {
        question: "Vinyl or fiber cement — how do I choose?",
        answer:
          "Vinyl wins on price and zero maintenance; fiber cement wins on impact toughness and a painted-wood look. We install both, so the honest answer comes from your budget and the look you want — see our fiber cement page for the comparison.",
      },
      {
        question: "Does hail damage vinyl siding, and does insurance cover it?",
        answer:
          "Hail can crack vinyl, especially in cold snaps, and wind-driven debris does the rest. Storm-damaged siding is commonly part of the same insurance claim as the roof — we document both together.",
      },
    ],
    related: [
      {
        label: "Fiber Cement Siding",
        href: "/residential/fiber-cement-siding",
        description: "The premium alternative — tougher, paintable, refined.",
      },
      {
        label: "Fascia Replacement",
        href: "/residential/fascia",
        description: "Finish the exterior at the roofline too.",
      },
      {
        label: "Storm Damage",
        href: "/storm-damage",
        description: "Siding damage is often part of the roof claim.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Fiber cement siding                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "fiber-cement-siding",
    path: "/residential/fiber-cement-siding",
    name: "Fiber Cement Siding",
    metaTitle: "Fiber Cement Siding Installation | South Mississippi",
    metaDescription:
      "Fiber cement siding for South Mississippi homes — the premium, storm-tough exterior with the look of painted wood and none of the rot.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Fiber cement: the premium exterior",
      subhead:
        "Cement, sand, and cellulose pressed into boards that look like painted wood and shrug off what Mississippi throws at them — hail, humidity, termites, and time.",
      chips: ["Painted-wood look", "Impact tough", "Fire & pest resistant"],
    },
    intro: {
      title: "Why discerning homeowners step up to fiber cement",
      paragraphs: [
        "Fiber cement is what you choose when you want the crisp, substantial look of wood siding without wood's appetite for maintenance. The boards are dense and dimensionally stable — they hold paint far longer than wood, stand up to hail that cracks vinyl, don't burn, and give termites nothing to eat. On a premium home, the depth and shadow lines read unmistakably higher-end.",
        "The material demands craft: it's heavy, it cuts with dust controls, and it must be gapped, flashed, and fastened to spec or moisture finds its way in. This is exactly the kind of exterior work where installation discipline — the same discipline we bring to roofing — decides how the next twenty years go.",
      ],
    },
    signs: {
      title: "When fiber cement is the right call",
      items: [
        {
          icon: Home,
          title: "A long-term home",
          text: "The premium up front pays back over decades of holding paint and shrugging off weather.",
        },
        {
          icon: TriangleAlert,
          title: "Hail country toughness",
          text: "Dense boards resist the impacts that crack vinyl and dent aluminum.",
        },
        {
          icon: Paintbrush,
          title: "You want real architecture",
          text: "Deep shadow lines, wood-grain texture, and any paint color you'll ever want.",
        },
        {
          icon: CloudRain,
          title: "Humidity without rot",
          text: "Cement-based boards don't swell, rot, or feed mold the way wood does.",
        },
      ],
    },
    approach: {
      title: "How we install fiber cement",
      steps: [
        {
          title: "Envelope inspection",
          text: "Sheathing, moisture barrier, and flashing plan verified before the first board hangs.",
        },
        {
          title: "Board, texture, and color selection",
          text: "Lap widths, trim packages, and factory-finish colors chosen with real samples.",
        },
        {
          title: "Spec-disciplined installation",
          text: "Correct gapping, clearances, flashing, and fasteners — the details that keep moisture out for decades.",
        },
        {
          title: "Sealed, painted, finished",
          text: "Joints sealed and touch-ups completed, with a walkaround before we call it done.",
        },
      ],
    },
    faqs: [
      {
        question: "How much more does fiber cement cost than vinyl?",
        answer:
          "Meaningfully more installed — the material is pricier and the labor is more demanding. What you buy is impact toughness, fire resistance, and a premium architectural look. We'll quote both side by side so the trade-off is concrete, not abstract.",
      },
      {
        question: "Does fiber cement need painting?",
        answer:
          "Factory-finished boards carry long warranties on the finish and eventually can be repainted — think 10–15+ year cycles rather than wood's constant upkeep. The boards hold paint exceptionally well because they don't swell and shrink like wood.",
      },
      {
        question: "Is it worth it in storm country?",
        answer:
          "It's one of the best exteriors for it — dense boards resist hail and wind-borne debris that total lesser sidings, which can also matter to your insurer. Ask about premium credits when you talk to your agent.",
      },
    ],
    related: [
      {
        label: "Vinyl Siding",
        href: "/residential/vinyl-siding",
        description: "The value alternative — compare honestly.",
      },
      {
        label: "Soffit Replacement",
        href: "/residential/soffit",
        description: "Complete the exterior where roof meets wall.",
      },
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description: "Roof and siding together transform the whole home.",
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
    metaTitle: "Fascia Repair & Replacement | South Mississippi",
    metaDescription:
      "Fascia repair and replacement in South Mississippi — fix the rotted boards at your roof edge and cap them so the problem never comes back.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Fascia: the roof edge that takes the abuse",
      subhead:
        "The fascia is the board your gutters hang on — first to rot when gutters overflow, first to show peeling paint at the roofline. We replace it right and cap it so you stop repainting it.",
      chips: ["Rot repair", "Aluminum capping", "Gutter-ready"],
    },
    intro: {
      title: "Small boards, big consequences",
      paragraphs: [
        "Fascia boards live in the splash zone: every overflowing gutter, every ice-free Mississippi downpour, every failed drip edge sends water across them. Once they soften, the problems cascade — gutters loosen and sag, water reaches the rafter tails behind, and the roofline starts looking tired from the street.",
        "Because fascia sits where roofing, gutters, and soffit meet, it's naturally a roofer's repair. We replace rotted sections or full runs, correct the drip edge relationship that caused the rot, and — where you want the repaint cycle gone — wrap the new boards in color-matched aluminum so the roofline stays crisp for decades.",
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
          text: "Press a screwdriver near gutter brackets — soft means rot is established.",
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
          text: "Rot is a symptom — we identify the overflow, flashing, or drip-edge failure that caused it.",
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
          "Yes — fascia work is routine on its own. The natural pairing is with gutter work, since gutters come off and go back on anyway. During a reroof it's cheapest of all, which is why we check fascia on every replacement.",
      },
      {
        question: "What's the difference between fascia and soffit?",
        answer:
          "Fascia is the vertical board facing outward at the roof edge; soffit is the horizontal surface underneath the overhang. They meet at the eave and usually fail together when water gets loose — we handle both.",
      },
      {
        question: "Is aluminum capping worth it?",
        answer:
          "If you're tired of painting the roofline, yes — capped fascia is essentially maintenance-free and looks crisp for decades. On a one-time budget fix, primed and painted wood is honest too. We quote both.",
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
    metaTitle: "Soffit Repair & Replacement | South Mississippi",
    metaDescription:
      "Soffit repair and replacement in South Mississippi — vented panels that feed your attic airflow and close the overhang to pests and moisture.",
    hero: {
      eyebrow: "Residential exterior",
      headline: "Soffit: where your attic breathes",
      subhead:
        "The panels under your roof overhang aren't decoration — they're the intake side of your attic's ventilation and the barrier keeping wasps, squirrels, and moisture out of the eaves.",
      chips: ["Vented airflow", "Pest barrier", "Vinyl & aluminum"],
    },
    intro: {
      title: "The most underestimated surface on the house",
      paragraphs: [
        "Every ridge vent on a roof depends on soffit doing its quiet job below: pulling fresh air into the attic at the eaves. When soffit panels are damaged, painted shut, or missing, the whole ventilation system stalls — attic heat soars, shingles cook from beneath, and summer cooling bills climb. In our humidity, stalled attic air also means condensation and mildew.",
        "Soffit is also the eave's security door. Sagging or holed panels are how squirrels, birds, and wasp nests end up in attics every spring. We replace damaged soffit with vented vinyl or aluminum panels matched to your trim, sized to feed the ventilation your roof actually needs — a detail we calculate, not guess, because we're the ones installing the ridge vents above it.",
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
          text: "If the ridge vent has no intake below, the attic can't breathe — soffit is usually why.",
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
          text: "Panels fitted tight to fascia and wall — airflow in, pests out.",
        },
      ],
    },
    faqs: [
      {
        question: "Vented or solid soffit — which do I need?",
        answer:
          "Most homes need a calculated mix: enough vented panel to feed the attic's exhaust ventilation, solid where intake isn't needed. All-solid soffit suffocates an attic; we do the math rather than guessing.",
      },
      {
        question: "Can soffit be replaced without touching the roof?",
        answer:
          "Yes — soffit and fascia work happens from below and is routine on its own. If a reroof is anywhere on your horizon, though, doing them together is the most economical path.",
      },
      {
        question: "Will new soffit really lower attic temperatures?",
        answer:
          "If your current intake is blocked or undersized, noticeably — balanced intake and exhaust is what moves attic heat out. It's the same system logic as our ventilation service, applied at the eaves.",
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
      {
        label: "Vinyl Siding",
        href: "/residential/vinyl-siding",
        description: "Match the whole exterior while you're at it.",
      },
    ],
  },
];
