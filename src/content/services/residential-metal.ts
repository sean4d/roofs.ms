import {
  CalendarClock,
  CloudRain,
  Home,
  Layers,
  ShieldCheck,
  Thermometer,
  Wind,
  Wrench,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Residential metal roofing pages (PRD §4.3, Phase 3): the residential
 * metal hub + first children (standing seam, exposed fastener). Gauge
 * education pages (26/29) follow in Phase 4 alongside Learning Center
 * deep-dives.
 *
 * Imagery: no honest metal photography exists yet ([NEEDS: metal project
 * photos]) — heroes use the photo-free treatment with system chips.
 * Copy is factual metal-roofing knowledge stated qualitatively; owner-
 * confirmed offering: standing seam + exposed fastener in 26 & 29 gauge.
 */

export const residentialMetalHub: ServiceContent = {
  slug: "metal-roofing",
  path: "/residential/metal-roofing",
  name: "Residential Metal Roofing",
  metaTitle: "Residential Metal Roofing in Hattiesburg & South Mississippi",
  metaDescription:
    "Standing seam and exposed-fastener metal roofing for South Mississippi homes, in 26 and 29 gauge. Honest guidance on styles, value, and insurance considerations.",
  hero: {
    eyebrow: "Residential roofing",
    headline: "Metal roofing for Mississippi homes",
    subhead:
      "Decades of service life, serious wind performance, and clean modern lines — metal has earned its momentum in South Mississippi. We install standing seam and exposed-fastener systems in 26 and 29 gauge, matched honestly to your home and budget.",
    chips: ["Standing seam", "Exposed fastener", "26 gauge", "29 gauge"],
  },
  intro: {
    title: "Why homeowners here are switching to metal",
    paragraphs: [
      "A metal roof costs more than shingles up front — we'll say that plainly. What you get for it is a roof that commonly outlasts two shingle roofs, sheds hurricane-season wind and rain exceptionally well, and reflects summer heat instead of absorbing it. Over the life of the home, the math often favors metal, especially if you plan to stay put.",
      "Metal isn't a side business for us. It's a system we install across both our residential and commercial divisions, which means the crews on your home work with these panels regularly — seaming, flashing, and trim included. And because we install shingle systems too, our recommendation starts with your roof and your plans, not with a product we need to move.",
      "Two system families cover nearly every home: standing seam, the premium concealed-fastener option, and exposed-fastener panels, the budget-friendly workhorse. Both come in 26 and 29 gauge steel and a wide range of colors.",
    ],
  },
  approach: {
    title: "How a residential metal project works",
    steps: [
      {
        title: "Free inspection & honest comparison",
        text: "We assess your roof and walk you through metal versus shingle for your specific home — including when shingle is genuinely the smarter buy.",
      },
      {
        title: "System, gauge & color selection",
        text: "Standing seam or exposed fastener, 26 or 29 gauge, and colors chosen from real samples — with the trade-offs of each explained plainly.",
      },
      {
        title: "Precision installation",
        text: "Panels cut to your roof's dimensions, correct underlayment for metal, and flashing details done right — metal is unforgiving of shortcuts.",
      },
      {
        title: "Walkthrough & care guidance",
        text: "We walk the finished roof with you and explain the minimal maintenance a metal system actually needs.",
      },
    ],
  },
  materials: {
    title: "Systems, gauges, and finishes",
    description:
      "The choices that matter on a residential metal roof, in plain language.",
    items: [
      {
        title: "Standing seam (concealed fastener)",
        text: "Panels lock together over hidden clips — no screw heads exposed to the weather, and room for the metal to expand and contract. The premium choice.",
      },
      {
        title: "Exposed-fastener panels",
        text: "Panels screwed directly to the structure with gasketed fasteners. Significantly more affordable, with a clean ribbed look — the practical choice for many homes, shops, and barns.",
      },
      {
        title: "26 gauge steel",
        text: "The thicker of the two gauges we install — stiffer panels with better dent resistance in hail country. Our usual recommendation where budget allows.",
      },
      {
        title: "29 gauge steel",
        text: "Lighter and more economical — a legitimate choice for many applications, and we'll tell you honestly where it fits and where it doesn't.",
      },
      {
        title: "Painted & bare finishes",
        text: "Modern paint systems carry long fade-resistance and come in dozens of colors; bare Galvalume offers a classic agricultural look.",
      },
      {
        title: "Trim & flashing package",
        text: "Ridge, hip, eave, and gable trim formed to match — the details that separate a crisp metal roof from a leaky one.",
      },
    ],
    note: "Not sure which system fits? Start with standing seam vs. exposed fastener below — that one decision drives most of the cost and look.",
  },
  faqs: [
    {
      question: "How long does a metal roof last compared to shingles?",
      answer:
        "Metal systems routinely deliver several decades of service — commonly outlasting two shingle roofs in our climate. Shingles here typically run 15–25 years; a well-installed metal roof is usually the last roof a homeowner buys for that house.",
    },
    {
      question: "Is a metal roof loud when it rains?",
      answer:
        "Not the way people imagine. Installed over solid decking and underlayment — the way we install residential metal — rain on a metal roof sounds about the same as rain on shingles. The 'loud tin roof' memory comes from open-framed barns with no decking.",
    },
    {
      question: "Does metal roofing help with insurance or energy bills?",
      answer:
        "Metal's wind and impact performance can matter to insurers — some offer credits for certain systems, so it's worth asking yours. On energy: reflective metal finishes absorb less summer heat than dark shingles, which takes real load off your AC in a Mississippi summer.",
    },
    {
      question: "Can a metal roof be installed over my existing shingles?",
      answer:
        "It's sometimes done, but we generally recommend a tear-off first: it lets us inspect and repair the decking, avoids trapping heat and moisture between layers, and gives the new system a flat, sound base.",
    },
    {
      question: "Standing seam or exposed fastener — how do I choose?",
      answer:
        "Budget and horizon. Standing seam costs more and rewards you with concealed fasteners and the longest, lowest-maintenance life. Exposed fastener costs meaningfully less and performs well, with the understanding that its gasketed screws deserve a checkup as the roof ages. We install both and will price both for you.",
    },
  ],
  related: [
    {
      label: "Standing Seam Metal Roofing",
      href: "/residential/metal-roofing/standing-seam",
      description:
        "The premium concealed-fastener system — how it works and when it's worth it.",
    },
    {
      label: "Exposed-Fastener Metal Roofing",
      href: "/residential/metal-roofing/exposed-fastener",
      description:
        "The cost-effective panel system that puts metal within reach.",
    },
    {
      label: "Asphalt Shingle Roofing",
      href: "/residential/asphalt-shingle-roofing",
      description: "Comparing honestly? Here's what our shingle systems offer.",
    },
  ],
};

export const residentialMetalChildren: ServiceContent[] = [
  /* ------------------------------------------------------------------ */
  /* Standing seam                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "standing-seam",
    path: "/residential/metal-roofing/standing-seam",
    name: "Standing Seam Metal Roofing",
    metaTitle: "Standing Seam Metal Roofing for Homes | South Mississippi",
    metaDescription:
      "Concealed-fastener standing seam metal roofing for South Mississippi homes — clean lines, decades of life, and serious storm performance. Southeast Roofing, Hattiesburg.",
    hero: {
      eyebrow: "Residential metal roofing",
      headline: "Standing seam: the concealed-fastener standard",
      subhead:
        "Vertical panels, crisp raised seams, and not a single exposed screw on the field of the roof. Standing seam is the system metal's reputation is built on — and on a South Mississippi home, it's built for the weather that's coming.",
      chips: ["Concealed fasteners", "26 & 29 gauge", "Vertical panels"],
    },
    intro: {
      title: "What makes standing seam different",
      paragraphs: [
        "Every roof system has a weak point, and on most it's the fasteners — thousands of penetrations, each sealed by a gasket that ages in the sun. Standing seam removes that weakness from the field of the roof entirely: panels attach with concealed clips, and adjacent panels lock together at raised seams that stand above the water line.",
        "The clip attachment does something else clever — it lets each panel expand and contract with temperature swings without stressing the fasteners. In a climate that goes from 95-degree afternoons to cool storm fronts, that freedom of movement is a quiet, decades-long advantage.",
        "The result is the longest-lived, lowest-maintenance roof we install for homeowners: clean modern lines, excellent wind performance, and a system that simply doesn't have screw heads to re-tighten or gaskets to weather.",
      ],
    },
    signs: {
      title: "When standing seam is the right call",
      items: [
        {
          icon: Home,
          title: "This is your long-term home",
          text: "The longer you'll own the house, the more standing seam's service life pays you back.",
        },
        {
          icon: Wind,
          title: "You want maximum storm resilience",
          text: "Interlocked seams and concealed clips give standing seam outstanding wind performance for hurricane season.",
        },
        {
          icon: Wrench,
          title: "You're done with maintenance",
          text: "No exposed fasteners means no periodic screw checkups — the roof mostly just sits there and works.",
        },
        {
          icon: Thermometer,
          title: "Cooling bills matter",
          text: "Reflective painted finishes shed summer heat that dark shingles absorb.",
        },
        {
          icon: Layers,
          title: "The architecture suits it",
          text: "Modern, farmhouse, and coastal styles all wear standing seam's vertical lines beautifully.",
        },
        {
          icon: ShieldCheck,
          title: "You value resale confidence",
          text: "A premium metal roof is a selling point buyers can see from the street.",
        },
      ],
    },
    approach: {
      title: "How we install standing seam",
      steps: [
        {
          title: "Measure and spec",
          text: "Panels are made to your roof's exact dimensions — we measure precisely and spec gauge, profile, and color with you.",
        },
        {
          title: "Tear-off and deck prep",
          text: "Old roofing comes off, decking gets inspected and repaired, and underlayment rated for metal goes down.",
        },
        {
          title: "Panel and seam installation",
          text: "Panels lock over concealed clips, seams are formed tight, and every termination is detailed for weather.",
        },
        {
          title: "Trim, flashing & walkthrough",
          text: "Matching ridge, eave, and gable trim finish the system — then we walk the completed roof with you.",
        },
      ],
    },
    faqs: [
      {
        question: "Why does standing seam cost more than other metal roofing?",
        answer:
          "The panels are more complex to manufacture and install: concealed clips, formed seams, and precision detailing take skill and time that screwed-down panels don't. You're buying the removal of the roof's most common failure point — exposed fasteners.",
      },
      {
        question: "How does standing seam handle hurricanes and high wind?",
        answer:
          "Very well — it's one of the reasons coastal builders favor it. The panels interlock along their full length and anchor with clips rather than through-fasteners, which gives the system excellent wind resistance. Exact ratings depend on the panel profile and installation spec for your project.",
      },
      {
        question: "Can standing seam go on any roof pitch?",
        answer:
          "It handles a wide range, including lower slopes that shingles struggle with — the raised seams keep the locks above the water line. Very low-slope sections may call for different systems, and we'll tell you if any part of your roof does.",
      },
      {
        question: "What maintenance does a standing seam roof need?",
        answer:
          "Very little: keep debris out of valleys, keep gutters flowing, and have flashings glanced at when you have other work done. There are no exposed gaskets or screws on the panel field to service.",
      },
    ],
    related: [
      {
        label: "Exposed-Fastener Metal Roofing",
        href: "/residential/metal-roofing/exposed-fastener",
        description:
          "The budget-friendlier alternative — see how the two systems compare.",
      },
      {
        label: "Residential Metal Roofing",
        href: "/residential/metal-roofing",
        description:
          "The full residential metal picture: systems, gauges, colors, and value.",
      },
      {
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
        description:
          "What the replacement process looks like from tear-off to walkthrough.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Exposed fastener                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "exposed-fastener",
    path: "/residential/metal-roofing/exposed-fastener",
    name: "Exposed-Fastener Metal Roofing",
    metaTitle: "Exposed-Fastener Metal Roofing for Homes | South Mississippi",
    metaDescription:
      "Cost-effective exposed-fastener metal roofing for South Mississippi homes, shops, and barns — honest guidance on where it shines and what to expect long-term.",
    hero: {
      eyebrow: "Residential metal roofing",
      headline: "Exposed-fastener metal: the practical path to a metal roof",
      subhead:
        "Ribbed panels fastened directly to the structure — simpler to install, significantly more affordable, and genuinely tough. For many homes, shops, and barns across South Mississippi, it's the system that makes metal make sense.",
      chips: ["Cost-effective", "26 & 29 gauge", "Ribbed panels"],
    },
    intro: {
      title: "Honest value, clearly explained",
      paragraphs: [
        "Exposed-fastener panels are the most economical way to put metal on a roof: wide ribbed sheets screwed straight to the framing or decking with gasketed fasteners. Less labor, less material complexity, and a price that can land surprisingly close to premium shingles — with metal's service life and wind performance in the bargain.",
        "We'll be straight about the trade-off, because there is one: those fasteners are exposed to the sun, and their sealing washers age over the years. A screw checkup as the roof ages is part of honest ownership of this system. That's the difference you're saving money on versus standing seam — and for plenty of buildings, it's a perfectly good trade.",
        "Where does it shine? Homes where budget is real, barndominiums, workshops, barns, porches, and any structure where a clean ribbed profile fits the look. It's a system we install constantly, and installed well, it earns its popularity.",
      ],
    },
    signs: {
      title: "When exposed fastener is the smart buy",
      items: [
        {
          icon: Home,
          title: "You want metal on a budget",
          text: "It's the most affordable route to metal's life span and storm performance.",
        },
        {
          icon: Layers,
          title: "Barndominiums & farm structures",
          text: "The classic system for shops, barns, and metal-building homes — and it looks right on them.",
        },
        {
          icon: Wind,
          title: "You're tired of losing shingles",
          text: "Screwed-down steel panels don't peel off in afternoon thunderstorms.",
        },
        {
          icon: CalendarClock,
          title: "You think in decades",
          text: "Even the economical metal option is a decades-long roof when installed and maintained properly.",
        },
        {
          icon: CloudRain,
          title: "Porches and additions",
          text: "A practical match for porch roofs and additions — even alongside a shingle main roof.",
        },
        {
          icon: Wrench,
          title: "You're fine with a checkup",
          text: "You understand the honest trade: periodic fastener checks in exchange for the lower price.",
        },
      ],
    },
    approach: {
      title: "How we install exposed-fastener metal",
      steps: [
        {
          title: "Spec the panel and gauge",
          text: "Profile, 26 or 29 gauge, and color — chosen for your structure and budget with the trade-offs laid out.",
        },
        {
          title: "Prep the substrate",
          text: "Sound decking and metal-rated underlayment on homes; purlin attachment on ag and shop structures.",
        },
        {
          title: "Fasten to spec",
          text: "Gasketed screws driven to the right depth — snug, not crushed — in the manufacturer's pattern. This detail decides the roof's future.",
        },
        {
          title: "Trim out and walk through",
          text: "Ridge, eave, and gable trim, sealed penetrations, and a final walkthrough with you.",
        },
      ],
    },
    faqs: [
      {
        question: "How much cheaper is exposed fastener than standing seam?",
        answer:
          "Meaningfully — it's the most affordable metal system we install, thanks to simpler panels and faster installation. Exact numbers depend on your roof, so we'll price both systems in your free estimate and let you compare directly.",
      },
      {
        question: "Will the screws leak eventually?",
        answer:
          "The fasteners seal with compression gaskets that age in the sun over many years. That's why we drive them to correct depth on day one and recommend a periodic checkup as the roof ages — re-tightening or replacing fasteners is quick, inexpensive maintenance that keeps the system tight.",
      },
      {
        question: "Is exposed-fastener metal okay for a house, or just barns?",
        answer:
          "It's genuinely fine for houses and is used on plenty of them — especially where budget matters or the style suits ribbed panels. Over solid decking and underlayment it performs and sounds like any other residential roof. We'll tell you honestly if your home is better served by standing seam.",
      },
      {
        question: "What's the difference between 26 and 29 gauge panels?",
        answer:
          "Lower gauge means thicker steel: 26 gauge is stiffer and more dent-resistant, 29 gauge is lighter and more economical. For homes we usually lean 26 gauge where the budget allows; for many outbuildings 29 gauge is a sensible choice. We install both and will show you samples.",
      },
    ],
    related: [
      {
        label: "Standing Seam Metal Roofing",
        href: "/residential/metal-roofing/standing-seam",
        description:
          "The concealed-fastener upgrade — compare what the extra cost buys.",
      },
      {
        label: "Residential Metal Roofing",
        href: "/residential/metal-roofing",
        description:
          "Start here for the full metal picture: systems, gauges, and colors.",
      },
      {
        label: "Roof Repair",
        href: "/residential/roof-repair",
        description:
          "Existing metal roof with loose fasteners or leaks? We service those too.",
      },
    ],
  },
];
