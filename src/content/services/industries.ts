import {
  Banknote,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Landmark,
  Layers,
  School,
  ShieldCheck,
  TriangleAlert,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Industry pages (PRD §4.2, Phase 4) — the differentiator vs. local
 * competitors. Each speaks to that industry's actual concerns (schedules,
 * budgets, disruption, compliance). Reuses the service template: signs →
 * industry concerns, materials → recommended systems. No invented project
 * history or unconfirmed claims (municipal bid experience stays generic —
 * [NEEDS: confirm municipal bid experience]).
 */

export const industries: ServiceContent[] = [
  /* ------------------------------------------------------------------ */
  /* Schools                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "schools",
    path: "/commercial/industries/schools",
    name: "Roofing for Schools",
    metaTitle: "Roofing for Schools & Educational Facilities | South MS",
    metaDescription:
      "School roofing across South Mississippi — summer-window scheduling, campus safety protocols, and documentation built for board approval.",
    hero: {
      eyebrow: "Industries · Education",
      headline: "Roofing for schools & educational facilities",
      subhead:
        "Summer windows, safety protocols, board approvals, and buildings full of kids the other nine months. School roofing is a scheduling and documentation discipline — and we treat it that way.",
      chips: ["Summer scheduling", "Campus safety", "Board-ready proposals"],
    },
    intro: {
      title: "Built around the school calendar",
      paragraphs: [
        "A school roof project has one great gift and one hard constraint: the summer window. Everything we do aims at it — assessments and board approvals across the school year, materials staged before the last bell, and crews sequenced so the heavy work lands while campuses are empty. When occupied-term work is unavoidable, containment, access control, and quiet-hours planning protect the learning environment.",
        "The paperwork matters as much as the schedule. Districts answer to boards and taxpayers, so our proposals are itemized to the line, our documentation photographs everything, and our communication gives facilities directors what they need to defend every decision.",
      ],
    },
    signs: {
      title: "What school facilities teams deal with",
      items: [
        {
          icon: CalendarClock,
          title: "The summer window",
          text: "Major work must land in weeks, not months — planning across the school year makes it possible.",
        },
        {
          icon: ShieldCheck,
          title: "Campus safety",
          text: "Background-checked crews, controlled access, and sites secured whenever students are near.",
        },
        {
          icon: Banknote,
          title: "Budget cycles",
          text: "Proposals timed and documented for board approval and public accountability.",
        },
        {
          icon: Layers,
          title: "Mixed roof portfolios",
          text: "Gyms, classrooms, walkways — one campus can carry four roof systems, all aging differently.",
        },
      ],
    },
    approach: {
      title: "How we serve schools",
      steps: [
        {
          title: "Portfolio assessment",
          text: "Every building documented with photos and honest remaining-life estimates — a plan, not a pitch.",
        },
        {
          title: "Board-ready proposals",
          text: "Itemized, engineered, and delivered in time for approval cycles before the summer window.",
        },
        {
          title: "Summer execution",
          text: "Staged materials, sequenced crews, and daily watertight closes — done before the buses roll.",
        },
        {
          title: "Maintenance through the years",
          text: "Semi-annual checks and post-storm documentation keep small problems out of the classroom.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for schools",
      items: [
        {
          title: "TPO membrane",
          text: "Reflective and economical for the big flat sections over classrooms and cafeterias.",
        },
        {
          title: "Coating restorations",
          text: "Stretch a sound roof past the next bond cycle at a fraction of replacement cost.",
        },
        {
          title: "Architectural standing seam",
          text: "For sloped entries and gyms where longevity and looks both matter.",
        },
      ],
    },
    faqs: [
      {
        question: "Can a full reroof really fit in one summer?",
        answer:
          "With winter planning, yes — that's the whole point of starting assessments and approvals during the school year. Multi-building campuses are phased across summers by priority, with maintenance protecting the buildings that wait.",
      },
      {
        question: "What happens if a roof fails during the school year?",
        answer:
          "We respond like it's an operations emergency, because it is — containment first, repairs scheduled around the school day, and full documentation for the district's records and any insurance claim.",
      },
      {
        question: "Do you work within public bid processes?",
        answer:
          "Our proposals are written to spec-and-bid standards with itemized scopes districts can evaluate and compare properly. Tell us your procurement requirements and we'll work within them.",
      },
    ],
    related: [
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description: "The program that keeps campus roofs off the crisis list.",
      },
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description: "Budget-stretching restoration for aging sections.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description: "All six industries we specialize in.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Churches                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "churches",
    path: "/commercial/industries/churches",
    name: "Roofing for Churches",
    metaTitle:
      "Church Roofing | Steep-Slope & Sanctuary Specialists | South MS",
    metaDescription:
      "Church roofing across South Mississippi — steep sanctuary slopes, architectural features, congregation budgets, and Sunday-safe scheduling.",
    hero: {
      eyebrow: "Industries · Worship",
      headline: "Roofing for churches & places of worship",
      subhead:
        "Steep sanctuary slopes, steeples, architectural details, and a budget a congregation raised dollar by dollar. Church roofs deserve craftsmanship and stewardship in equal measure.",
      chips: [
        "Steep-slope expertise",
        "Architectural detail",
        "Sunday-safe scheduling",
      ],
    },
    intro: {
      title: "Craftsmanship worthy of the building",
      paragraphs: [
        "Church roofs are some of the most demanding work in the region: sanctuary pitches far steeper than any house, steeples and cross gables that concentrate water, and architectural details that a careless crew can ruin from the street view. This is the roofing we bring our best crews to — the buildings a whole community looks at.",
        "We also understand who's paying: a congregation, often through years of fundraising and building-fund discipline. Our itemized proposals let a building committee see and question every line, phased options spread work across budget years when that helps, and insurance assistance after storms makes sure covered damage doesn't consume donated dollars.",
      ],
    },
    signs: {
      title: "What church buildings demand",
      items: [
        {
          icon: TriangleAlert,
          title: "Steep, complex slopes",
          text: "Sanctuary pitches and steeples need equipment and crews rated for the work.",
        },
        {
          icon: Landmark,
          title: "Architectural preservation",
          text: "Details and sight lines the congregation cares about, protected through the project.",
        },
        {
          icon: Users,
          title: "Committee decisions",
          text: "Proposals clear enough for a building committee to evaluate and vote on with confidence.",
        },
        {
          icon: CalendarClock,
          title: "Worship-week scheduling",
          text: "Work sequenced so Sunday services, weddings, and funerals proceed undisturbed.",
        },
      ],
    },
    approach: {
      title: "How we serve congregations",
      steps: [
        {
          title: "Assessment with the committee",
          text: "We walk the findings with your building team, photos in hand, plain language throughout.",
        },
        {
          title: "Options and phasing",
          text: "Good-better-best system options and phased plans that respect the building fund.",
        },
        {
          title: "Sunday-safe execution",
          text: "Sites cleaned and secured before every service — the congregation's experience is part of the spec.",
        },
        {
          title: "Storm stewardship",
          text: "After hail or wind, we document and assist the claim so insurance carries what it should.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for churches",
      items: [
        {
          title: "Architectural shingles",
          text: "The steep-slope standard — dimensional profiles that suit traditional sanctuaries.",
        },
        {
          title: "Standing seam metal",
          text: "Generational service life for congregations investing in the next fifty years.",
        },
        {
          title: "Membrane systems",
          text: "For flat fellowship halls, classrooms, and additions attached to the sanctuary.",
        },
      ],
    },
    faqs: [
      {
        question: "Can you work around our service schedule?",
        answer:
          "Always — it's the first thing we plan. Sites are secured and cleaned ahead of every service, and the loudest phases land on weekdays.",
      },
      {
        question:
          "Our congregation is budgeting a big roof project. Can it be phased?",
        answer:
          "Often, yes — steep sanctuary sections, flat additions, and outbuildings can be sequenced across budget years by priority, with maintenance protecting what waits. The assessment shows what order makes sense.",
      },
      {
        question:
          "Hail hit our sanctuary roof. Does insurance handle church roofs like homes?",
        answer:
          "The claims process is similar and we assist the same way — thorough documentation, adjuster meetings, and honest guidance. Church policies vary in deductibles and coverage, so we work from your specific policy.",
      },
    ],
    related: [
      {
        label: "Insurance Claims",
        href: "/storm-damage/insurance-claims",
        description: "How we support storm claims start to finish.",
      },
      {
        label: "Standing Seam (Commercial)",
        href: "/commercial/metal-roofing/standing-seam",
        description: "The generational option for sanctuaries.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description: "All six industries we specialize in.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Apartments                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "apartments",
    path: "/commercial/industries/apartments",
    name: "Roofing for Apartments & Multifamily",
    metaTitle: "Apartment & Multifamily Roofing | South Mississippi",
    metaDescription:
      "Multifamily roofing across South Mississippi — tenant-aware scheduling, phased buildings, and documentation property managers can forward upstairs.",
    hero: {
      eyebrow: "Industries · Multifamily",
      headline: "Roofing for apartments & multifamily",
      subhead:
        "Occupied units, parking to protect, tenants to notify, and owners who want it handled. Multifamily roofing is as much logistics as craftsmanship — we run both.",
      chips: ["Tenant-aware logistics", "Phased buildings", "Portfolio-ready"],
    },
    intro: {
      title: "Roofing with tenants underneath",
      paragraphs: [
        "Every multifamily project happens over people's homes. That means notice letters before we start, parking and walkway protection plans, debris control that keeps kids and pets safe, and crews who understand they're working over someone's nursery at nap time. Property managers judge a roofer by how few tenant calls a project generates — that's the metric we work to.",
        "For owners and management companies, the paperwork is the product: itemized proposals that survive an asset manager's review, per-building condition reports across a portfolio, and storm documentation that supports claims across multiple structures at once.",
      ],
    },
    signs: {
      title: "What multifamily projects demand",
      items: [
        {
          icon: Users,
          title: "Tenant communication",
          text: "Notices, schedules, and a clean site — fewer resident complaints, happier ownership.",
        },
        {
          icon: Building2,
          title: "Building-by-building phasing",
          text: "Communities reroof in sequence, prioritized by condition, spread across budgets.",
        },
        {
          icon: TriangleAlert,
          title: "Storm claims at scale",
          text: "One hail event can touch a dozen buildings — documentation has to keep them straight.",
        },
        {
          icon: ClipboardCheck,
          title: "Owner-grade reporting",
          text: "Condition reports and proposals formatted to forward straight up the chain.",
        },
      ],
    },
    approach: {
      title: "How we serve multifamily properties",
      steps: [
        {
          title: "Community-wide assessment",
          text: "Every building documented and ranked — a capital plan, not a one-off quote.",
        },
        {
          title: "Logistics plan first",
          text: "Parking, access, debris, and tenant notices mapped before the first shingle moves.",
        },
        {
          title: "Phased, rapid execution",
          text: "Building-at-a-time sequencing keeps disruption short and predictable for residents.",
        },
        {
          title: "Portfolio documentation",
          text: "Per-building closeout reports and warranty records your asset files can hold onto.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for multifamily",
      items: [
        {
          title: "Architectural shingles",
          text: "The pitched-roof standard for garden-style communities — economical at scale.",
        },
        {
          title: "TPO membrane",
          text: "Flat-roof buildings and clubhouses, with reflectivity that helps tenant utility bills.",
        },
        {
          title: "Coating restorations",
          text: "Extend flat sections between capital cycles without disturbing residents.",
        },
      ],
    },
    faqs: [
      {
        question: "How do you handle tenant notifications?",
        answer:
          "We provide notice templates and schedules for your team, sequence buildings so each resident's disruption lasts days not weeks, and keep sites clean enough that complaints stay rare.",
      },
      {
        question:
          "Can you reroof our whole community or just problem buildings?",
        answer:
          "Either. The community assessment ranks every roof so you can do worst-first within this year's budget, or scope the full portfolio — with real numbers for both paths.",
      },
      {
        question:
          "A storm hit several of our buildings. How do claims work at that scale?",
        answer:
          "Each building gets its own documentation package tied to the storm date, organized so the carrier and your ownership see a clean per-structure picture. We can meet the adjuster across the whole property in one visit.",
      },
    ],
    related: [
      {
        label: "Insurance Claims",
        href: "/storm-damage/insurance-claims",
        description: "Claims support, building by building.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description: "Portfolio programs with per-building tracking.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description: "All six industries we specialize in.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Industrial                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "industrial",
    path: "/commercial/industries/industrial",
    name: "Roofing for Industrial Facilities",
    metaTitle: "Industrial Roofing | Manufacturing & Process Facilities | MS",
    metaDescription:
      "Industrial roofing across South Mississippi — large spans, production continuity, safety compliance, and systems that stand up to process environments.",
    hero: {
      eyebrow: "Industries · Industrial",
      headline: "Roofing for industrial & manufacturing",
      subhead:
        "Production lines that can't stop, spans measured in acres, and downtime that costs by the hour. Industrial roofing is planned around throughput — ours and yours.",
      chips: ["Production continuity", "Large spans", "Safety compliance"],
    },
    intro: {
      title: "Zero-surprise roofing for facilities that can't pause",
      paragraphs: [
        "On an industrial roof, the roofing is the easy part — the discipline is everything around it: coordinating with plant safety officers, working over (or around) live production, protecting rooftop process equipment, and phasing sections so weather exposure never threatens what's below. Downtime costs more than roofing does, so the schedule is engineered backward from your operations.",
        "Industrial roofs also punish materials: vibration, exhaust, chemical exposure, and constant equipment traffic. System selection starts with what your roof actually endures — which is why our assessment maps exposures, not just leaks.",
      ],
    },
    signs: {
      title: "What industrial roofs contend with",
      items: [
        {
          icon: Wrench,
          title: "Equipment traffic",
          text: "Service techs on the roof weekly — systems and walkways specced for it.",
        },
        {
          icon: TriangleAlert,
          title: "Process exposure",
          text: "Exhaust, chemicals, and heat that degrade the wrong membrane years early.",
        },
        {
          icon: Layers,
          title: "Acres of span",
          text: "Large roofs where phasing, drainage, and logistics decide the project.",
        },
        {
          icon: ShieldCheck,
          title: "Site safety programs",
          text: "Crews that integrate with your safety protocols, not around them.",
        },
      ],
    },
    approach: {
      title: "How we serve industrial facilities",
      steps: [
        {
          title: "Exposure-mapped assessment",
          text: "Leaks, traffic patterns, process discharge, and drainage documented across the full span.",
        },
        {
          title: "Continuity-first planning",
          text: "Phasing, staging, and daily watertight closes engineered around production schedules.",
        },
        {
          title: "Safety-integrated execution",
          text: "Your protocols, our compliance — orientation, PPE, and controlled access throughout.",
        },
        {
          title: "Asset documentation",
          text: "Condition mapping and maintenance planning that plugs into your facility management program.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for industrial",
      items: [
        {
          title: "Modified bitumen",
          text: "Multi-ply redundancy where rooftop traffic and abuse are constant.",
        },
        {
          title: "PVC membrane",
          text: "The chemistry for chemical and grease exposure zones.",
        },
        {
          title: "Structural & R-panel metal",
          text: "The native systems of pre-engineered production and warehouse structures.",
        },
      ],
    },
    faqs: [
      {
        question: "Can you reroof over live production?",
        answer:
          "Usually — with phasing that isolates work zones, protection for intake air and rooftop equipment, and daily watertight closes. Where a section genuinely requires a pause, you'll know weeks ahead, not that morning.",
      },
      {
        question:
          "Our roof gets constant HVAC service traffic. What survives that?",
        answer:
          "Multi-ply systems like modified bitumen tolerate traffic best, and designated protected walkways to serviced equipment prevent most damage regardless of membrane. Both go in the spec.",
      },
      {
        question: "Do your crews follow site safety programs?",
        answer:
          "Yes — orientations, PPE requirements, hot-work permits, and access control are standard practice for us on industrial sites. Send your requirements with the consultation request and we plan to them.",
      },
    ],
    related: [
      {
        label: "Modified Bitumen",
        href: "/commercial/modified-bitumen",
        description: "The traffic-tolerant multi-ply system.",
      },
      {
        label: "PVC Roofing",
        href: "/commercial/pvc",
        description: "Chemical-resistant chemistry for process roofs.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description: "Scheduled care for hard-working roofs.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Warehouses                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "warehouses",
    path: "/commercial/industries/warehouses",
    name: "Roofing for Warehouses",
    metaTitle: "Warehouse & Distribution Roofing | South Mississippi",
    metaDescription:
      "Warehouse roofing across South Mississippi — huge flat spans, inventory protection, and economics engineered for cost per square foot.",
    hero: {
      eyebrow: "Industries · Warehousing",
      headline: "Roofing for warehouses & distribution",
      subhead:
        "The biggest roofs in the region protecting the most concentrated value — inventory. Warehouse roofing is about cost per square foot, leak-free reliability, and never interrupting what moves below.",
      chips: ["Acre-scale spans", "Inventory protection", "Cost per sq ft"],
    },
    intro: {
      title: "Big-roof economics, done honestly",
      paragraphs: [
        "Warehouse roofs are where system economics show their true colors: at 50,000+ square feet, a dollar per square foot is real money, and the recover-vs-tear-off question can swing six figures. We bring core data and straight math — when the existing assembly is dry, a recover saves enormously; when it's wet, burying it wastes everything you spend.",
        "The other economics are what's underneath. One leak line over racked inventory can cost more than the roof section above it, which is why warehouse work emphasizes leak-free phasing, daily watertight closes, and interior protection planning over anything cosmetic.",
      ],
    },
    signs: {
      title: "What warehouse roofs demand",
      items: [
        {
          icon: Warehouse,
          title: "Inventory below",
          text: "Racking and goods concentrate value under every square foot of membrane.",
        },
        {
          icon: Layers,
          title: "Massive simple spans",
          text: "Scale rewards efficient systems — and punishes mistakes at the same multiple.",
        },
        {
          icon: Banknote,
          title: "Recover vs. tear-off stakes",
          text: "At warehouse scale, the moisture survey is a six-figure decision tool.",
        },
        {
          icon: Wrench,
          title: "Dock-hour operations",
          text: "Staging and phasing that never block doors, docks, or truck routes.",
        },
      ],
    },
    approach: {
      title: "How we serve warehouses",
      steps: [
        {
          title: "Moisture survey & cores",
          text: "The recover decision made with data — the single biggest cost lever on a big roof.",
        },
        {
          title: "Per-square-foot proposal",
          text: "System options itemized at scale so ownership sees exactly what each path costs.",
        },
        {
          title: "Operations-clear phasing",
          text: "Docks, doors, and routes stay open; each day's section closes watertight.",
        },
        {
          title: "Long-span maintenance",
          text: "Scheduled drain and seam care — cheap insurance across acres of membrane.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for warehouses",
      items: [
        {
          title: "TPO membrane",
          text: "The warehouse default — economical at scale, reflective over unconditioned space too.",
        },
        {
          title: "EPDM membrane",
          text: "Huge sheets, few seams — a natural fit for big rectangles.",
        },
        {
          title: "Coating restorations",
          text: "At warehouse scale, restoring a sound roof saves the most of anywhere.",
        },
      ],
    },
    faqs: [
      {
        question: "Do we have to empty the warehouse during a reroof?",
        answer:
          "No — interior protection planning and watertight phasing let operations continue. High-value zones get scheduled around and covered; docks and routes stay open.",
      },
      {
        question: "Recover or tear off — what's honest at our scale?",
        answer:
          "Whatever the cores say. Dry assembly: recover and bank the difference. Wet assembly: tear off, because a recover would trap the moisture and fail early. We show you the samples either way.",
      },
      {
        question: "Does a reflective roof matter over unconditioned space?",
        answer:
          "Less than over conditioned space, but it still cuts interior temperatures meaningfully — which matters for workers, goods, and any future conditioning plans. We'll be straight about how much it's worth in your case.",
      },
    ],
    related: [
      {
        label: "TPO Roofing",
        href: "/commercial/tpo",
        description: "The warehouse workhorse membrane.",
      },
      {
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
        description: "Maximum savings at maximum square footage.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description: "All six industries we specialize in.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Municipal                                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "municipal",
    path: "/commercial/industries/municipal",
    name: "Roofing for Municipal Buildings",
    metaTitle: "Municipal & Government Building Roofing | South Mississippi",
    metaDescription:
      "Municipal roofing across South Mississippi — public-accountability documentation, procurement-ready proposals, and continuity for essential services.",
    hero: {
      eyebrow: "Industries · Municipal",
      headline: "Roofing for municipal & public buildings",
      subhead:
        "City halls, fire stations, libraries, public works — buildings the public owns and essential services depend on. Public projects demand public-grade documentation, and that's how we build ours.",
      chips: [
        "Procurement-ready",
        "Essential-service continuity",
        "Licensed & insured",
      ],
    },
    intro: {
      title: "Accountability is the specification",
      paragraphs: [
        "Public projects answer to taxpayers, which changes how everything must be written: scopes itemized so committees can compare bids line by line, licensing and insurance documentation current and attached (MS License #R22245, fully insured and bonded), and records thorough enough to stand review years later. We build proposals for that standard because it's the standard public work deserves.",
        "The buildings themselves serve missions that can't pause — a fire station roofs over trucks that must roll, a water office serves residents daily. Continuity planning for essential services sits at the center of how municipal projects get phased and scheduled.",
      ],
    },
    signs: {
      title: "What public projects require",
      items: [
        {
          icon: ClipboardCheck,
          title: "Procurement discipline",
          text: "Line-item scopes, comparable bids, and documentation that survives an audit.",
        },
        {
          icon: ShieldCheck,
          title: "Verified credentials",
          text: "Current licensing, insurance, and bonding — attached, not promised.",
        },
        {
          icon: Building2,
          title: "Essential-service continuity",
          text: "Fire, police, water, records — services that operate through the project.",
        },
        {
          icon: Banknote,
          title: "Budget-year reality",
          text: "Fiscal calendars and approval cycles built into the project timeline.",
        },
      ],
    },
    approach: {
      title: "How we serve municipalities",
      steps: [
        {
          title: "Condition documentation",
          text: "Assessment reports written for public record — findings, photos, and honest priorities.",
        },
        {
          title: "Procurement-ready proposals",
          text: "Itemized scopes and system specs formatted for committee and bid evaluation.",
        },
        {
          title: "Continuity-planned execution",
          text: "Essential operations mapped and protected; disruptive phases scheduled to service calendars.",
        },
        {
          title: "Public-grade closeout",
          text: "As-built documentation, warranties, and maintenance planning for the asset file.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for public buildings",
      items: [
        {
          title: "TPO membrane",
          text: "Defensible economics for flat sections over offices and service floors.",
        },
        {
          title: "Standing seam metal",
          text: "Generational life for civic buildings — often the best taxpayer value long-term.",
        },
        {
          title: "Coating restorations",
          text: "Stretch sound roofs across budget cycles without capital-scale spend.",
        },
      ],
    },
    faqs: [
      {
        question: "Are you licensed and insured for public work?",
        answer:
          "Yes — Mississippi State Board of Contractors License #R22245, fully insured and bonded, with documentation provided as part of any proposal package.",
      },
      {
        question: "Can you work within our procurement and bid requirements?",
        answer:
          "Our proposals are built to itemized, comparable-bid standards. Send your procurement requirements with the consultation request and we'll format to them.",
      },
      {
        question:
          "How do you handle roofing over an active fire or police station?",
        answer:
          "Continuity planning first: bay doors, response routes, and communications equipment mapped and protected, with phasing that keeps the mission operational every hour of the project.",
      },
    ],
    related: [
      {
        label: "Commercial Roof Replacement",
        href: "/commercial/roof-replacement",
        description: "Capital-project process, documented end to end.",
      },
      {
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
        description:
          "Asset-file-ready condition tracking for public buildings.",
      },
      {
        label: "Industries We Serve",
        href: "/commercial/industries",
        description: "All six industries we specialize in.",
      },
    ],
  },
];

export function getIndustry(slug: string): ServiceContent | undefined {
  return industries.find((industry) => industry.slug === slug);
}

/** Card data for the industries hub grid. */
export const industryCards = [
  { icon: School, slug: "schools", label: "Schools" },
  { icon: Landmark, slug: "churches", label: "Churches" },
  { icon: Building2, slug: "apartments", label: "Apartments" },
  { icon: Wrench, slug: "industrial", label: "Industrial" },
  { icon: Warehouse, slug: "warehouses", label: "Warehouses" },
  { icon: ShieldCheck, slug: "municipal", label: "Municipal" },
] as const;
