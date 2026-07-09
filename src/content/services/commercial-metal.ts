import type { ServiceContent } from "@/content/services/types";

/**
 * Commercial metal pages (PRD §4.3, Phase 4): commercial metal hub +
 * standing-seam, r-panel, pbr-panel, structural-metal children. Chips
 * heroes until metal photography exists ([NEEDS: metal project photos]).
 */

export const commercialMetalHub: ServiceContent = {
  slug: "metal-roofing",
  path: "/commercial/metal-roofing",
  name: "Commercial Metal Roofing",
  metaTitle: "Commercial Metal Roofing in Mississippi | Southeast Roofing",
  metaDescription:
    "Commercial metal roofing across South Mississippi — architectural standing seam, R-panel and PBR systems, and structural metal for facilities, warehouses, and ag buildings.",
  hero: {
    eyebrow: "Commercial roofing",
    headline: "Metal for buildings that work for a living",
    subhead:
      "Warehouses, shops, ag structures, offices with a long horizon — metal delivers decades of low-maintenance service where other systems need replacing twice. We install architectural and structural systems across the region.",
    chips: ["Standing seam", "R-panel & PBR", "Structural metal"],
  },
  intro: {
    title: "Why commercial owners keep choosing metal",
    paragraphs: [
      "For an owner thinking in decades, metal's arithmetic is compelling: service life that commonly doubles membrane systems, minimal maintenance, excellent wind performance for hurricane season, and reflective finishes that cut cooling loads. On pre-engineered metal buildings it's the native system; on conventional structures, architectural standing seam brings the same longevity with a refined profile.",
      "The commercial metal decision is mostly a slope-and-structure decision. Standing seam handles low slopes with concealed clips and raised locks; R-panel and PBR panels cover the workhorse middle affordably; structural panels span open purlins on metal buildings without decking. We install all of them, so the recommendation follows your building.",
    ],
  },
  approach: {
    title: "How a commercial metal project runs",
    steps: [
      {
        title: "Structure and slope assessment",
        text: "Purlin spacing, deck condition, slope, and existing system determine which metal families fit.",
      },
      {
        title: "System spec and proposal",
        text: "Panel profile, gauge, finish, and details — itemized and written for budget review.",
      },
      {
        title: "Installation or retrofit",
        text: "New construction, tear-off, or retrofit over existing metal — phased around your operations.",
      },
      {
        title: "Long-horizon documentation",
        text: "As-built records and a minimal maintenance plan matched to metal's low upkeep.",
      },
    ],
  },
  materials: {
    title: "The commercial metal families",
    description: "Four system types cover nearly every commercial application.",
    items: [
      {
        title: "Architectural standing seam",
        text: "Concealed-fastener panels for offices, schools, churches, and any building where looks and longevity both matter.",
      },
      {
        title: "R-panel",
        text: "The exposed-fastener workhorse for shops, warehouses, and light commercial — economical and fast to install.",
      },
      {
        title: "PBR panel",
        text: "R-panel's purlin-bearing variant — extra bearing leg for strength over open framing. The metal-building standard.",
      },
      {
        title: "Structural metal systems",
        text: "Panels engineered to span purlins without decking — roof and structure working as one on pre-engineered buildings.",
      },
    ],
  },
  faqs: [
    {
      question: "How long does a commercial metal roof last?",
      answer:
        "Several decades is the norm — well-installed commercial metal commonly outlasts two membrane roofs. Fastener and finish choices tune the maintenance picture, and we'll walk you through both.",
    },
    {
      question: "Can you install metal over our existing metal roof?",
      answer:
        "Often, yes — retrofit systems go over existing panels without tear-off, adding insulation opportunity in the cavity. It depends on the condition of the structure underneath, which the assessment establishes.",
    },
    {
      question: "Is metal noisy for building occupants?",
      answer:
        "Over insulated assemblies — which is how commercial metal is installed — rain noise is comparable to any other roof. The tin-roof racket people remember comes from uninsulated sheds.",
    },
    {
      question: "Metal versus TPO for our building — how do we choose?",
      answer:
        "Horizon and structure. Metal costs more up front and owns the long game; TPO wins the initial budget on conventional flat roofs. On metal buildings and slopes, metal is usually the native answer. We install both and will price both.",
    },
  ],
  related: [
    {
      label: "Standing Seam (Commercial)",
      href: "/commercial/metal-roofing/standing-seam",
      description: "The architectural concealed-fastener system.",
    },
    {
      label: "R-Panel & PBR",
      href: "/commercial/metal-roofing/r-panel",
      description: "The exposed-fastener workhorses, compared.",
    },
    {
      label: "Structural Metal",
      href: "/commercial/metal-roofing/structural-metal",
      description: "Spanning systems for pre-engineered buildings.",
    },
  ],
};

export const commercialMetalChildren: ServiceContent[] = [
  {
    slug: "standing-seam",
    path: "/commercial/metal-roofing/standing-seam",
    name: "Commercial Standing Seam",
    metaTitle: "Standing Seam Metal Roofing in MS | Southeast Roofing",
    metaDescription:
      "Architectural standing seam metal roofing for South Mississippi commercial buildings — concealed fasteners, low-slope capability, and decades of service.",
    hero: {
      eyebrow: "Commercial metal roofing",
      headline: "Architectural standing seam",
      subhead:
        "Concealed fasteners, raised mechanical locks, and thermal movement engineered in — the premium metal system for offices, schools, churches, and civic buildings that plan to be here in forty years.",
      chips: [
        "Concealed fasteners",
        "Low-slope capable",
        "Architectural finish",
      ],
    },
    intro: {
      title: "The long-horizon commercial roof",
      paragraphs: [
        "Standing seam removes the exposed fastener — the maintenance item of every screw-down system — from the field of the roof entirely. Panels attach with concealed clips that let the metal expand and contract freely, and seams lock above the waterline. The result is the lowest-maintenance roof in commercial construction, with wind performance that suits hurricane-season Mississippi.",
        "It's also the metal system that architects reach for: crisp vertical lines, premium finishes, and profiles that flatter schools, churches, and office buildings rather than reading industrial.",
      ],
    },
    approach: {
      title: "How we install commercial standing seam",
      steps: [
        {
          title: "Slope and substrate review",
          text: "Standing seam handles remarkably low slopes — we verify yours and spec the right profile.",
        },
        {
          title: "Panel and finish selection",
          text: "Profile, gauge, and finish chosen against the building's architecture and exposure.",
        },
        {
          title: "Clip-attached installation",
          text: "Concealed clips, formed seams, and detailed terminations — weathertight without a single exposed screw in the field.",
        },
        {
          title: "Verification and closeout",
          text: "Seam checks, detail review, and documentation for the decades ahead.",
        },
      ],
    },
    faqs: [
      {
        question: "What slope does standing seam need?",
        answer:
          "Mechanically seamed profiles handle very low slopes that other metal can't — one reason the system suits so many commercial buildings. We confirm the specific profile's rating against your roof during assessment.",
      },
      {
        question: "Why choose it over R-panel for a commercial building?",
        answer:
          "No exposed fasteners to maintain, better low-slope capability, and an architectural appearance. R-panel wins on initial cost; standing seam wins on lifetime cost and looks. Building type usually makes the call.",
      },
      {
        question: "How does it perform in hurricanes?",
        answer:
          "Very well — interlocked seams and clip attachment give standing seam excellent uplift performance, with specific ratings depending on the engineered spec for your project.",
      },
    ],
    related: [
      {
        label: "Commercial Metal Roofing",
        href: "/commercial/metal-roofing",
        description: "The full commercial metal picture.",
      },
      {
        label: "R-Panel",
        href: "/commercial/metal-roofing/r-panel",
        description: "The economical exposed-fastener alternative.",
      },
      {
        label: "Commercial Roof Replacement",
        href: "/commercial/roof-replacement",
        description: "How the capital project side of a reroof runs.",
      },
    ],
  },
  {
    slug: "r-panel",
    path: "/commercial/metal-roofing/r-panel",
    name: "R-Panel Metal Roofing",
    metaTitle: "R-Panel Metal Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "R-panel metal roofing for South Mississippi shops, warehouses, and ag buildings — economical exposed-fastener panels installed to spec.",
    hero: {
      eyebrow: "Commercial metal roofing",
      headline: "R-panel: the commercial workhorse",
      subhead:
        "The ribbed exposed-fastener panel that covers half the shops, barns, and warehouses in the South — economical, fast to install, and tough enough for buildings that earn their keep.",
      chips: ["Exposed fastener", "Economical", "Fast installation"],
    },
    intro: {
      title: "Honest value at commercial scale",
      paragraphs: [
        "R-panel is metal roofing at its most practical: 36-inch coverage ribbed panels, screwed down with gasketed fasteners, in whatever finish the job calls for. Installed cost lands well below standing seam, and on shops, warehouses, and ag structures the ribbed profile looks exactly right.",
        "The trade-off is the exposed fasteners — thousands of gasketed screws that weather in the sun and deserve a checkup as the roof ages. Driven to correct depth on day one and serviced on schedule, an R-panel roof delivers decades; neglected, the fasteners are where it ages first. We're straightforward about that math because it's the whole system decision.",
      ],
    },
    approach: {
      title: "How we install R-panel",
      steps: [
        {
          title: "Substrate and purlin check",
          text: "Over decking or open framing — attachment spec follows the structure.",
        },
        {
          title: "Gauge and finish selection",
          text: "Panel gauge and finish matched to exposure and budget, priced side by side.",
        },
        {
          title: "Fastening to spec",
          text: "Gasketed screws at the manufacturer's pattern and torque — the detail that decides the roof's future.",
        },
        {
          title: "Trim-out and review",
          text: "Ridge, eave, and gable details finished and walked with you.",
        },
      ],
    },
    faqs: [
      {
        question: "What's the difference between R-panel and PBR panel?",
        answer:
          "PBR is R-panel with a purlin-bearing leg — a small extra flange at the overlap that adds bearing strength over open framing. Over purlins, PBR is the better spec; the profiles are otherwise siblings.",
      },
      {
        question: "How long does an R-panel roof last?",
        answer:
          "Decades, with the fastener schedule as the main variable — periodic checks and eventual gasket service keep the system tight through its long life.",
      },
      {
        question: "Can R-panel go over an existing roof?",
        answer:
          "Frequently — over existing metal or, with proper purlin systems, over other roofing. It's a common, economical retrofit that the structural check confirms case by case.",
      },
    ],
    related: [
      {
        label: "PBR Panel",
        href: "/commercial/metal-roofing/pbr-panel",
        description: "The purlin-bearing variant for open framing.",
      },
      {
        label: "Standing Seam (Commercial)",
        href: "/commercial/metal-roofing/standing-seam",
        description: "The concealed-fastener upgrade path.",
      },
      {
        label: "Commercial Metal Roofing",
        href: "/commercial/metal-roofing",
        description: "All four commercial metal families, compared.",
      },
    ],
  },
  {
    slug: "pbr-panel",
    path: "/commercial/metal-roofing/pbr-panel",
    name: "PBR Panel Metal Roofing",
    metaTitle: "PBR Panel Metal Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "PBR panel roofing for South Mississippi metal buildings — purlin-bearing strength for pre-engineered structures, shops, and warehouses.",
    hero: {
      eyebrow: "Commercial metal roofing",
      headline: "PBR panel: built for the frame",
      subhead:
        "The purlin-bearing rib panel is the standard skin of America's metal buildings — engineered to bear directly on open framing with strength R-panel can't match there.",
      chips: ["Purlin bearing", "Metal-building standard", "High coverage"],
    },
    intro: {
      title: "Why metal buildings spec PBR",
      paragraphs: [
        "PBR's defining feature is a small leg at the panel overlap that bears on the purlin below, letting the lap carry load instead of floating. On pre-engineered metal buildings — where panels span open purlins with no deck beneath — that bearing strength is the difference between a panel that performs and one that oil-cans and works loose.",
        "If your building came from a metal-building manufacturer, PBR (or its close kin) is almost certainly what's on it now, and matching it for repairs, extensions, or reroofs keeps everything compatible. We install, retrofit, and service PBR across the region's shops, warehouses, and ag structures.",
      ],
    },
    approach: {
      title: "How we handle PBR projects",
      steps: [
        {
          title: "Frame and purlin assessment",
          text: "Spacing, condition, and any rust or deflection issues documented before panels are specced.",
        },
        {
          title: "Match or upgrade",
          text: "Repairs match the existing profile; reroofs weigh PBR against retrofit standing-seam options honestly.",
        },
        {
          title: "Spec installation",
          text: "Correct laps, bearing orientation, and fastener schedule — the details metal buildings depend on.",
        },
        {
          title: "Weatherproofing details",
          text: "Ridge, eave, and penetration closures done right — where metal-building leaks actually start.",
        },
      ],
    },
    faqs: [
      {
        question: "Do I need PBR or regular R-panel?",
        answer:
          "Over open purlins — the metal-building case — PBR. Over solid decking, standard R-panel serves. If you're matching an existing metal building, we identify the exact profile and match it.",
      },
      {
        question:
          "Our metal building roof leaks at the screws. Is that fixable?",
        answer:
          "Yes, and it's the most common metal-building service call: aged gaskets and backed-out fasteners. Re-fastening with oversized screws and new gaskets is routine — and if the panels themselves are tired, retrofit options go right over the top.",
      },
      {
        question: "Can you insulate while reroofing a metal building?",
        answer:
          "Retrofit reroofs are the perfect moment — new insulation goes in the cavity or over the old roof under the new panels, transforming buildings that were built with minimal insulation.",
      },
    ],
    related: [
      {
        label: "R-Panel",
        href: "/commercial/metal-roofing/r-panel",
        description: "The decked-substrate sibling profile.",
      },
      {
        label: "Structural Metal",
        href: "/commercial/metal-roofing/structural-metal",
        description: "Spanning systems for pre-engineered structures.",
      },
      {
        label: "Commercial Roof Repair",
        href: "/commercial/roof-repair",
        description: "Fastener and leak service for metal buildings.",
      },
    ],
  },
  {
    slug: "structural-metal",
    path: "/commercial/metal-roofing/structural-metal",
    name: "Structural Metal Roofing",
    metaTitle: "Structural Metal Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "Structural metal roof systems for South Mississippi — panels engineered to span open framing on pre-engineered buildings, warehouses, and industrial structures.",
    hero: {
      eyebrow: "Commercial metal roofing",
      headline: "Structural metal: roof and structure in one",
      subhead:
        "Panels engineered to span open purlins without decking — carrying load, resisting uplift, and closing the building in a single system. The backbone approach for pre-engineered and industrial structures.",
      chips: ["Spans open framing", "Engineered uplift", "Industrial-grade"],
    },
    intro: {
      title: "When the panel is the structure",
      paragraphs: [
        "Conventional roofs sit on a deck; structural metal panels ARE the deck — engineered profiles that span purlin to purlin, carrying live loads and wind uplift as part of the building's structure. It's the system language of warehouses, manufacturing plants, and pre-engineered buildings across the South.",
        "Because these panels do structural work, the engineering matters more than anywhere else in roofing: spans, gauges, attachment schedules, and uplift ratings are calculated, not guessed. That's the discipline we bring — along with honest guidance on when a structural standing-seam retrofit can renew an aging metal building without touching the frame.",
      ],
    },
    approach: {
      title: "How structural metal projects run",
      steps: [
        {
          title: "Structural review",
          text: "Purlin condition, spans, and load requirements establish the engineering envelope.",
        },
        {
          title: "System engineering",
          text: "Panel profile, gauge, and attachment schedule specified to the calculated loads.",
        },
        {
          title: "Sequenced installation",
          text: "Panels placed and secured in structural sequence — the building stays sound at every stage.",
        },
        {
          title: "Uplift-critical detailing",
          text: "Edges, ridges, and terminations detailed for the wind zones that fail first in storms.",
        },
      ],
    },
    faqs: [
      {
        question: "What buildings use structural metal roofing?",
        answer:
          "Pre-engineered metal buildings, warehouses, manufacturing and agricultural structures — anywhere the design spans open framing without a deck. If your building's roof panels screw directly to purlins, you're in structural territory.",
      },
      {
        question:
          "Can an old structural metal roof be replaced without rebuilding?",
        answer:
          "Usually — panel-for-panel replacement or a retrofit system over the existing roof both preserve the frame. The structural review confirms the purlins are up to it.",
      },
      {
        question: "How does structural metal handle hurricane winds?",
        answer:
          "It's engineered to numbers: uplift ratings come from the calculated attachment schedule for your wind zone. That engineering-first approach is exactly what you want between a Gulf storm and your inventory.",
      },
    ],
    related: [
      {
        label: "PBR Panel",
        href: "/commercial/metal-roofing/pbr-panel",
        description: "The standard purlin-bearing panel profile.",
      },
      {
        label: "Commercial Metal Roofing",
        href: "/commercial/metal-roofing",
        description: "All four commercial metal families, compared.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description: "Industrial and warehouse roofing, in depth.",
      },
    ],
  },
];

export function getCommercialMetalChild(
  slug: string,
): ServiceContent | undefined {
  return commercialMetalChildren.find((service) => service.slug === slug);
}
