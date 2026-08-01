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
 * Industry pages (PRD §4.2, Phase 4), the differentiator vs. local
 * competitors. Each speaks to that industry's actual concerns (schedules,
 * budgets, disruption, compliance). Reuses the service template: signs →
 * industry concerns, materials → recommended systems. No invented project
 * history or unconfirmed claims (municipal bid experience stays generic, 
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
    metaTitle: "School Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "School roofing across South Mississippi: summer-window scheduling, campus safety protocols, and documentation built for board approval.",
    hero: {
      eyebrow: "Industries · Education",
      headline: "Roofing for schools & educational facilities",
      subhead:
        "Summer windows, safety protocols, board approvals, and buildings full of kids the other nine months. School roofing is a scheduling and documentation discipline, and we treat it that way.",
      chips: ["Summer scheduling", "Campus safety", "Board-ready proposals"],
    },
    intro: {
      title: "Built around the school calendar",
      paragraphs: [
        "A school roof project has one great gift and one hard constraint: the summer window. Everything we do aims at it: assessments and board approvals across the school year, materials staged before the last bell, and crews sequenced so the heavy work lands while campuses are empty. When occupied-term work is unavoidable, containment, access control, and quiet-hours planning protect the learning environment.",
        "The paperwork matters as much as the schedule. Districts answer to boards and taxpayers, so our proposals are itemized to the line, our documentation photographs everything, and our communication gives facilities directors what they need to defend every decision.",
      ],
    },
    sections: [
      {
        title: "One campus, several construction eras",
        paragraphs: [
          "Walk the roofline of a typical South Mississippi campus and you're looking at a construction timeline: an original classroom wing from one bond issue, a gymnasium added two decades later, a cafeteria expansion, portable classrooms that quietly became permanent, and covered walkways stitching it all together. Each era used the deck, slope, and roofing system of its day, which means one campus rarely has one roof problem. It has four or five different roofs at four or five different points in their service lives.",
          "That's why we start with a campus-wide roof inventory rather than a quote on whichever section is leaking today. Every building gets its own condition record: deck type, slope, drainage, penetration count, and honest remaining-life notes, so the district can see the whole picture and put its budget where it does the most good.",
        ],
        table: {
          title: "Common campus roof sections and what we evaluate",
          columns: [
            "Building section",
            "Construction commonly found",
            "Systems commonly evaluated",
          ],
          rows: [
            [
              "Classroom wings",
              "Low-slope over steel or wood deck",
              "TPO, modified bitumen, coating restoration on sound roofs",
            ],
            [
              "Gymnasium",
              "Long-span steel structure, low-slope or gently sloped",
              "TPO, modified bitumen, standing seam where slope allows",
            ],
            [
              "Cafeteria & kitchen",
              "Low-slope with heavy exhaust penetrations",
              "Modified bitumen or membrane with protection at grease exhaust",
            ],
            [
              "Administration & entries",
              "Steep-slope sections or architectural accents",
              "Architectural shingles, standing seam",
            ],
            [
              "Portable classrooms",
              "Wood-framed, shingle or metal panel",
              "Shingle replacement, exposed-fastener metal",
            ],
            [
              "Walkway canopies",
              "Light steel framing",
              "Exposed-fastener or standing seam metal",
            ],
          ],
          note: "Representative only, the right system for each section depends on the deck, slope, and condition we document on site.",
        },
        links: [
          {
            label: "Compare TPO for large low-slope sections",
            href: "/commercial/tpo",
          },
          {
            label: "See modified bitumen for high-traffic roofs",
            href: "/commercial/modified-bitumen",
          },
          {
            label: "Standing seam metal specifications",
            href: "/commercial/metal-roofing/standing-seam",
          },
        ],
      },
      {
        title: "Working on an occupied campus",
        paragraphs: [
          "When any part of a project overlaps the school year, separation is the whole game. Staging areas get fenced and secured, crew access routes never cross student paths, and the daily schedule is coordinated with the front office: no material deliveries during morning drop-off, no crane picks over the bus loop, no work above occupied classrooms without interior protection below.",
          "The quieter constraints matter too. Tear-off noise over a classroom during testing week is a real problem, and adhesive or torch odors can pull into rooftop HVAC intakes if nobody plans for it. We schedule loud phases and odor-producing work around the academic calendar, isolate or protect air intakes near active work, and keep playgrounds, drop-off lanes, and bus routes protected with barricades and monitored overhead clearances.",
        ],
        bullets: [
          "Fenced, locked staging: no materials or equipment accessible to students",
          "Crew and vehicle routes separated from student and staff circulation",
          "Playground, drop-off, and bus-route protection planned before work begins",
          "Loud and odor-producing phases scheduled around the academic calendar",
          "Interior protection over ceilings in any occupied area under active work",
        ],
      },
      {
        title: "The summer window, and what happens when it isn't enough",
        paragraphs: [
          "A summer reroof succeeds or fails months before it starts. Assessments belong in the fall, proposals in front of the board by winter, and materials ordered early enough that supply delays don't eat June. When the approval lands in May, the window is already half gone, so we push districts to run the paperwork during the school year and save the summer for the work itself.",
          "Multi-building campuses often can't be done in one summer, and phased funding often wouldn't allow it anyway. The inventory ranks buildings by condition so the worst sections go first, targeted repairs and maintenance protect the buildings that wait, and each summer's phase gets planned against the next budget cycle. A campus roofing plan that spans three summers is normal, pretending it can all happen in one is how projects run into August.",
        ],
      },
      {
        title: "Rooftop HVAC, drainage, and older materials",
        paragraphs: [
          "School roofs carry a lot of mechanical equipment: package units over classroom wings, kitchen exhaust over the cafeteria, and decades of abandoned curbs and penetrations from equipment swaps past. We coordinate with the district's mechanical contractor on units that need lifting or temporary disconnection, flash every active penetration to the new system's requirements, and recommend properly closing abandoned curbs rather than roofing around them again. Drainage gets equal attention: clogged interior drains and undersized gutters are behind a surprising share of 'roof leaks' on campuses.",
          "One honest caution on older buildings: some roofing and building materials from earlier eras may contain regulated substances, including asbestos. Where the age or type of an existing assembly raises that possibility, testing by a qualified consultant comes before any disturbance, and any required abatement is performed by licensed specialists. We never declare a material asbestos-free without testing, and no contractor should.",
        ],
      },
      {
        title: "Documentation a district can stand behind",
        paragraphs: [
          "Public school money comes with public accountability, so every deliverable is written to be forwarded: itemized scopes a board can compare line by line, condition reports with photographs, manufacturer submittals, and closeout packages with warranty registrations the district office can file and find again in ten years. If your procurement process has specific formats or requirements, tell us up front and we work within them.",
          "Between projects, the same discipline applies to upkeep. A campus maintenance program: documented semi-annual inspections, drain cleaning, and post-storm damage reports, keeps small problems out of classrooms and gives the district a running condition history that makes every future budget request easier to justify.",
        ],
        links: [
          {
            label: "How our commercial maintenance program works",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
    ],
    costFactors: {
      title: "What shapes a school roofing proposal",
      description:
        "Campus projects are priced section by section against real conditions. These are the variables that move the number.",
      items: [
        {
          title: "Number and age of roof sections",
          text: "Each construction era on campus is essentially its own project, with its own deck, system, and condition.",
        },
        {
          title: "Deck type and condition",
          text: "Steel, wood, and lightweight concrete decks each dictate different attachment methods, and hidden deck damage changes scope.",
        },
        {
          title: "Schedule window",
          text: "A clear summer window prices differently than occupied-term work requiring containment, separation, and off-hours phases.",
        },
        {
          title: "Rooftop HVAC and penetrations",
          text: "Unit counts, kitchen exhaust, and abandoned curbs all add flashing detail work: the part of a roof most likely to leak.",
        },
        {
          title: "Drainage corrections",
          text: "Undersized gutters, clogged interior drains, and ponding areas may need correction, not just replacement in kind.",
        },
        {
          title: "Testing of older materials",
          text: "Where existing assemblies may contain regulated materials, testing, and licensed abatement if needed: precedes disturbance.",
        },
        {
          title: "Phasing across budget years",
          text: "Multi-summer plans add mobilizations and interim maintenance for the buildings that wait.",
        },
      ],
    },
    signs: {
      title: "What school facilities teams deal with",
      items: [
        {
          icon: CalendarClock,
          title: "The summer window",
          text: "Major work must land in weeks, not months: planning across the school year makes it possible.",
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
          text: "Gyms, classrooms, walkways, one campus can carry four roof systems, all aging differently.",
        },
      ],
    },
    approach: {
      title: "How we serve schools",
      steps: [
        {
          title: "Portfolio assessment",
          text: "Every building documented with photos and honest remaining-life estimates. A plan, not a pitch.",
        },
        {
          title: "Board-ready proposals",
          text: "Itemized, engineered, and delivered in time for approval cycles before the summer window.",
        },
        {
          title: "Summer execution",
          text: "Staged materials, sequenced crews, and daily watertight closes: done before the buses roll.",
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
          text: "Extend a sound roof past the next budget cycle without the disruption of a full replacement.",
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
          "With winter planning, yes, that's the whole point of starting assessments and approvals during the school year. Multi-building campuses are phased across summers by priority, with maintenance protecting the buildings that wait.",
      },
      {
        question: "What happens if a roof fails during the school year?",
        answer:
          "We respond like it's an operations emergency, because it is: containment first, repairs scheduled around the school day, and full documentation for the district's records and any insurance claim.",
      },
      {
        question: "Do you work within public bid processes?",
        answer:
          "Our proposals are written to spec-and-bid standards with itemized scopes districts can evaluate and compare properly. Tell us your procurement requirements and we'll work within them.",
      },
      {
        question: "Do you test for asbestos before removing an older roof?",
        answer:
          "When a building's age or the existing assembly type suggests regulated materials could be present, testing by a qualified consultant happens before anything is disturbed, and any required abatement is handled by licensed specialists. We never declare a material asbestos-free without testing.",
      },
      {
        question: "Can any roofing work happen while students are on campus?",
        answer:
          "Limited scopes can, with full separation: fenced staging, crew routes that never cross student paths, interior protection under work areas, and loud phases scheduled around the school day. Tear-offs and other heavy work belong in breaks and summers, and we'll tell you honestly which category your project falls in.",
      },
      {
        question:
          "How do you protect playgrounds, drop-off lanes, and bus routes?",
        answer:
          "They're mapped into the logistics plan before mobilization: barricaded clearance zones under any overhead work, deliveries scheduled outside drop-off and dismissal windows, and daily debris sweeps of every area students use.",
      },
      {
        question: "What documentation does the district receive?",
        answer:
          "Condition reports with photos for every section, itemized proposals, manufacturer submittals, and a closeout package with warranty registrations and as-completed photos, organized so the facilities office can produce any of it years later.",
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
    metaTitle: "Church Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "Church roofing across South Mississippi: steep sanctuary slopes, steeple flashing, congregation budgets, and Sunday-safe scheduling.",
    hero: {
      eyebrow: "Industries · Worship",
      headline: "Roofing for churches & places of worship",
      subhead:
        "Steep sanctuary slopes, steeples, architectural details, and a budget a congregation raised gift by gift. Church roofs deserve craftsmanship and stewardship in equal measure.",
      chips: [
        "Steep-slope expertise",
        "Architectural detail",
        "Sunday-safe scheduling",
      ],
    },
    intro: {
      title: "Craftsmanship worthy of the building",
      paragraphs: [
        "Church roofs are some of the most demanding work in the region: sanctuary pitches far steeper than any house, steeples and cross gables that concentrate water, and architectural details that a careless crew can ruin from the street view. This is the roofing we bring our best crews to: the buildings a whole community looks at.",
        "We also understand who's paying: a congregation, often through years of fundraising and building-fund discipline. Our itemized proposals let a building committee see and question every line, phased options spread work across budget years when that helps, and insurance assistance after storms makes sure covered damage doesn't consume the building fund.",
      ],
    },
    sections: [
      {
        title: "One campus, many roof systems",
        paragraphs: [
          "Most church campuses grew the way congregations grow: a sanctuary first, then a fellowship hall, then classrooms, offices, and a storage building, each added in a different decade with the roofing of its era. The result is one property carrying five or six distinct roof systems: steep architectural shingles on the sanctuary, standing seam on the entry and steeple, TPO or modified bitumen on the fellowship hall, a low-slope membrane on the classroom addition, and exposed-fastener metal on the storage barn out back.",
          "Each of those systems ages on its own clock and fails in its own way, which is why church projects are commonly proposed by roof section rather than as one number for the whole campus. A section-by-section proposal lets the committee replace what's failing now, plan for what's aging, and leave alone what's sound, and it makes every line of the proposal something the committee can actually evaluate.",
        ],
        table: {
          title: "Typical church roof sections at a glance",
          columns: ["Roof section", "Typical system", "Main concern"],
          rows: [
            [
              "Sanctuary",
              "Architectural shingles or standing seam on steep pitches",
              "Valley water volume and wind exposure at height",
            ],
            [
              "Steeple & spire",
              "Standing seam or specialty sheet metal",
              "Base flashing and ornament penetrations",
            ],
            [
              "Entries & porte-cochère",
              "Standing seam accents",
              "Transitions where metal meets sanctuary walls",
            ],
            [
              "Fellowship hall",
              "TPO or modified bitumen",
              "Drainage and rooftop HVAC penetrations",
            ],
            [
              "Classroom & office additions",
              "Low-slope membrane",
              "Dead valleys where additions meet the sanctuary",
            ],
            [
              "Storage & outbuildings",
              "Exposed-fastener metal",
              "Fastener washers and panel condition",
            ],
          ],
          note: "Representative combinations. Your campus's actual systems and priorities come from the on-site assessment.",
        },
        links: [
          {
            label: "Standing seam options for sanctuaries and steeples",
            href: "/commercial/metal-roofing/standing-seam",
          },
          {
            label: "Modified bitumen for fellowship halls",
            href: "/commercial/modified-bitumen",
          },
          {
            label: "TPO for low-slope additions",
            href: "/commercial/tpo",
          },
        ],
      },
      {
        title: "Steeples, dead valleys, and the flashing nobody else sees",
        paragraphs: [
          "The hardest water problems on a church campus hide at the architecture's most beautiful moments. A steeple concentrates everything: its base flashing takes water from every direction, crosses and ornaments penetrate the very peak of the structure, and the tower itself creates a drainage shadow where wind-driven rain loads one small roof area. Where a later addition meets the original sanctuary wall, you often get a dead valley, a spot with little or no slope where water lingers instead of draining, and those junctions fail more roofs than open field ever does.",
          "This is sheet-metal work as much as roofing: custom-fabricated flashing at steeple bases and tower transitions, properly lined internal gutters and parapet caps, and crickets built to move water out of dead valleys. Steeple and tower work also takes real access planning, lifts or crane time, scheduled and priced honestly, because ladder-and-hope is not a method for working at sanctuary height.",
        ],
      },
      {
        title: "Scheduling around the life of a congregation",
        paragraphs: [
          "A church calendar is fuller than most offices': Sunday services, midweek gatherings, weddings booked months out, funerals scheduled on days' notice, and often a daycare or church school running weekday hours. We build the work schedule around all of it: sites cleaned and secured before every service, loud phases kept away from worship and school hours, and a standing agreement that a funeral pauses work, no questions asked.",
          "Parking and access get the same respect. Congregations need their accessible entrances open and their parking usable on service days, so staging areas, dumpster placement, and crew parking are planned to leave the campus functioning like a church, not a jobsite.",
        ],
      },
      {
        title: "Section-by-section proposals and committee decisions",
        paragraphs: [
          "Church roofing decisions run through building committees, trustees, and congregational votes, which means proposals have to work for readers who aren't roofers. Ours break the campus into named sections with photos, plain-language condition notes, and separate scopes, so a committee can approve the sanctuary this year and plan the fellowship hall for next, with every step traceable back to documented conditions.",
          "Phasing across budget years often serves a congregation well, but not always, and we'll say so when it doesn't: sections that share valleys or drainage, widespread deck deterioration, or storm damage spread across the campus can make piecemeal work a false economy. Honest sequencing advice is part of the proposal, not an upsell.",
        ],
      },
      {
        title: "Storm documentation for church policies",
        paragraphs: [
          "When hail or wind hits a church campus, the claim is more involved than a house claim simply because there's more roof: multiple systems, multiple slopes, and damage that varies section by section. We document each roof section separately: photos tied to locations, soft-metal evidence on vents and flashing, and interior damage in classrooms or sanctuaries, so the adjuster can evaluate the whole campus cleanly, and we'll meet them on the roof to walk it together.",
          "Church policies vary widely in deductibles, endorsements, and how buildings are scheduled on the policy, so we work from your actual policy and your insurer's process. The insurer decides coverage; our job is making sure the documented condition of every section is in front of them.",
        ],
        links: [
          {
            label: "How our storm damage response works",
            href: "/storm-damage",
          },
        ],
      },
    ],
    costFactors: {
      title: "What determines each roof section's proposal",
      description:
        "Because church campuses are proposed section by section, each section carries its own variables.",
      items: [
        {
          title: "Pitch and height",
          text: "Steep sanctuary slopes at height change safety equipment, crew requirements, and pace compared with a low fellowship-hall roof.",
        },
        {
          title: "Steeple and tower access",
          text: "Lift or crane time for steeple work is real scope, planned and shown as its own line.",
        },
        {
          title: "Valley and dead-valley complexity",
          text: "Large valleys and low-slope junctions where additions meet the sanctuary need crickets and custom flashing, not just shingles.",
        },
        {
          title: "Internal gutters and parapets",
          text: "Built-in gutters and parapet caps are sheet-metal restoration work in their own right.",
        },
        {
          title: "Number of systems and transitions",
          text: "Every junction between two different roof systems is a detail that must be engineered and flashed.",
        },
        {
          title: "Deck condition under older sections",
          text: "Decades-old decking may need repair once opened. We scope the likely range from attic and edge inspection first.",
        },
        {
          title: "Specialty sheet-metal fabrication",
          text: "Custom flashing, finials, and ornament details are fabricated to fit. They aren't shelf items.",
        },
        {
          title: "Calendar constraints",
          text: "Working around services, weddings, funerals, and school hours shapes phasing and duration.",
        },
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
          text: "Sites cleaned and secured before every service. The congregation's experience is part of the spec.",
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
          text: "The steep-slope standard: dimensional profiles that suit traditional sanctuaries.",
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
          "Always. It's the first thing we plan. Sites are secured and cleaned ahead of every service, and the loudest phases land on weekdays.",
      },
      {
        question:
          "Our congregation is budgeting a big roof project. Can it be phased?",
        answer:
          "Often, yes: steep sanctuary sections, flat additions, and outbuildings can be sequenced across budget years by priority, with maintenance protecting what waits. But not every campus phases well: shared valleys, connected drainage, or widespread deck problems can make piecemeal work a false economy, and we'll tell you honestly which situation yours is.",
      },
      {
        question:
          "Hail hit our sanctuary roof. Does insurance handle church roofs like homes?",
        answer:
          "The claims process is similar and we assist the same way: thorough documentation, adjuster meetings, and honest guidance. Church policies vary in deductibles and coverage, so we work from your specific policy.",
      },
      {
        question: "Why is your proposal broken out by roof section?",
        answer:
          "Because a church campus is really five or six roofs of different ages and systems, and one lump number hides where the money actually goes. Section-by-section scopes let your committee prioritize, compare, and phase with real information.",
      },
      {
        question: "How do you handle work on the steeple itself?",
        answer:
          "With proper access, typically a lift, or crane time for taller spires, plus custom-fabricated base flashing and careful handling of crosses and ornaments that penetrate the peak. Some ornaments can be flashed in place; others come down temporarily and are reset. The assessment tells us which.",
      },
      {
        question:
          "Our classroom addition leaks where it meets the sanctuary wall. Why there?",
        answer:
          "That junction is usually a dead valley, a spot with little or no slope where two buildings meet and water lingers instead of draining. Fixing it properly means building a cricket to redirect the water and flashing the wall transition, not just patching the membrane again.",
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
    metaTitle: "Apartment & Multifamily Roofing in MS | Southeast Roofing",
    metaDescription:
      "Multifamily roofing across South Mississippi: tenant-aware scheduling, phased buildings, and documentation property managers can forward upstairs.",
    hero: {
      eyebrow: "Industries · Multifamily",
      headline: "Roofing for apartments & multifamily",
      subhead:
        "Occupied units, parking to protect, tenants to notify, and owners who want it handled. Multifamily roofing is as much logistics as craftsmanship. We run both.",
      chips: ["Tenant-aware logistics", "Phased buildings", "Portfolio-ready"],
    },
    intro: {
      title: "Roofing with tenants underneath",
      paragraphs: [
        "Every multifamily project happens over people's homes. That means notice letters before we start, parking and walkway protection plans, debris control that keeps kids and pets safe, and crews who understand they're working over someone's nursery at nap time. Property managers judge a roofer by how few tenant calls a project generates: that's the metric we work to.",
        "For owners and management companies, the paperwork is the product: itemized proposals that survive an asset manager's review, per-building condition reports across a portfolio, and storm documentation that supports claims across multiple structures at once.",
      ],
    },
    sections: [
      {
        title: "Assessing a property building by building",
        paragraphs: [
          "Most apartment communities were built from a handful of repeated designs, so the roofs repeat too: the same hips, the same valleys, the same breezeway transitions on every building. That repetition is useful: once we've documented one building type thoroughly, we know exactly where to look on its siblings. But identical designs don't mean identical condition. Tree cover, sun exposure, storm paths, and past repair quality vary across a property, so every building still gets its own inspection and its own condition record.",
          "A typical community also mixes systems: architectural shingles on residential buildings, a low-slope membrane on the clubhouse or office, metal accents over entries and mail kiosks, and the assessment covers all of it, ranked by condition so ownership can act on the whole property or start where it matters most.",
        ],
        table: {
          title: "Where to start, based on what the assessment finds",
          columns: ["What the assessment finds", "Recommended starting action"],
          rows: [
            [
              "Isolated leaks on otherwise sound roofs",
              "Targeted repairs now, plus a maintenance program to catch the next ones early",
            ],
            [
              "Early, even wear across identical buildings",
              "Maintenance and reserve planning toward a phased replacement in coming budget years",
            ],
            [
              "One or two buildings clearly worse than the rest",
              "Worst-first replacement, with the remaining buildings documented and monitored",
            ],
            [
              "Storm damage across multiple buildings",
              "Per-building documentation and an insurance claim evaluation before any spending decisions",
            ],
            [
              "Roofs at end of service life property-wide",
              "A phased full-replacement plan sequenced across budget cycles",
            ],
          ],
          note: "Starting points, not verdicts. The written assessment covers your property's actual mix.",
        },
        links: [
          {
            label: "Shingle systems for garden-style buildings",
            href: "/residential/asphalt-shingle-roofing",
          },
          {
            label: "Commercial roof repair for clubhouse and office roofs",
            href: "/commercial/roof-repair",
          },
        ],
      },
      {
        title: "Tenant notice, unit entry, and leak reports",
        paragraphs: [
          "Residents deserve to know what's coming, so notice goes out before mobilization: which buildings, which dates, what to expect for noise, and who to call. We supply notice templates and building-by-building schedules your office can distribute, and we keep the schedule honest. A resident told Tuesday should hear hammers Tuesday. Balcony items, patio furniture, and anything fragile on top-floor shelves get flagged in the notice, because tear-off vibration overhead is real.",
          "During the project, interior leak reports route through a single point of contact so nothing gets lost between the property office and our crew. Unit entry is rare on roofing work, and when it's genuinely needed: checking a reported ceiling stain, for instance. It's coordinated through management under the lease's notice rules, never ad hoc. We won't promise a disruption-free project, because that promise can't be kept honestly; we promise disruption that's scheduled, communicated, and short.",
        ],
      },
      {
        title: "Parking, staging, dumpsters, and daily cleanup",
        paragraphs: [
          "Parking is the scarcest resource on most properties, so the logistics plan treats it that way: only the spaces beside the active building are blocked, only for that building's work days, with notices and signage in advance so residents can move vehicles the night before. Dumpster and material staging locations are agreed with management up front, visible enough to work from, out of the way of traffic flow, and never blocking dumpster access residents need.",
          "Cleanup is daily, not end-of-project. Debris netting and catch systems protect entries and walkways during tear-off, landscaping near the building gets covered, and every evening ends with a ground sweep and magnetic nail rollers over parking areas, sidewalks, and pet areas. Kids and pets live on this site. The ground crew's job is making sure the only evidence of roofing is the new roof.",
        ],
      },
      {
        title: "Repeated designs, phasing, and color consistency",
        paragraphs: [
          "Repetition is the efficiency engine of multifamily roofing: after the first building of a given design, crews know every detail cut, every flashing length, and every sequence, so following buildings move faster and cleaner. Phasing building by building keeps each resident's disruption to a few days and lets the property spread the investment across one season or several budget years.",
          "Phasing has one trap worth planning for: consistency. A shingle color installed this year may be discontinued or lot-shifted three years from now, so a phased plan names the manufacturer, product line, and color up front, and we document it in the property's records for every future phase. Where an exact match is no longer available down the road, we say so plainly and show options. A mismatched half-property is the outcome nobody wants.",
        ],
      },
      {
        title: "Insurance claims, reserves, and records that outlast managers",
        paragraphs: [
          "One hailstorm can touch a dozen buildings, and the claim only works if the documentation keeps them straight. We photograph and report each structure separately: damage tied to building numbers, elevations, and the storm date, so the carrier, the adjuster, and ownership all see a clean per-building picture, and we can walk the adjuster across the whole property in one coordinated visit.",
          "Outside of storms, the same records serve capital planning. Per-building condition reports give owners and HOA boards a defensible basis for reserve contributions, and warranty registrations, product records, and closeout photos live in a package the property keeps, so when the manager changes in four years, the roof history doesn't leave with them.",
        ],
        links: [
          {
            label: "Set up a portfolio maintenance program",
            href: "/commercial/roof-maintenance",
          },
          {
            label: "TPO options for clubhouse and flat-roof buildings",
            href: "/commercial/tpo",
          },
        ],
      },
    ],
    costFactors: {
      title: "What we evaluate before quoting a multifamily property",
      description:
        "Community-wide numbers come from building-level facts. These are the variables that shape a multifamily proposal.",
      items: [
        {
          title: "Building count and phasing plan",
          text: "One mobilization differs from five spread across budget years, sequencing is part of the price.",
        },
        {
          title: "Mix of roof systems",
          text: "Steep shingle buildings, low-slope clubhouse sections, and metal accents each carry their own scope.",
        },
        {
          title: "Existing layers and tear-off",
          text: "A second shingle layer or saturated low-slope assembly changes disposal volume and labor.",
        },
        {
          title: "Access and parking logistics",
          text: "Tight drives, carports, limited staging room, and occupied parking all shape crew productivity.",
        },
        {
          title: "Occupied-building protections",
          text: "Debris catch systems, walkway protection, and daily magnetic sweeps are scope, not extras.",
        },
        {
          title: "Storm damage versus wear",
          text: "Documented storm damage may route through insurance; aging roofs are a capital decision, often a property has both.",
        },
        {
          title: "Color and product continuity",
          text: "Matching earlier phases, or planning products that future phases can still buy, affects selection.",
        },
      ],
    },
    signs: {
      title: "What multifamily projects demand",
      items: [
        {
          icon: Users,
          title: "Tenant communication",
          text: "Notices, schedules, and a clean site: fewer resident complaints, happier ownership.",
        },
        {
          icon: Building2,
          title: "Building-by-building phasing",
          text: "Communities reroof in sequence, prioritized by condition, spread across budgets.",
        },
        {
          icon: TriangleAlert,
          title: "Storm claims at scale",
          text: "One hail event can touch a dozen buildings, documentation has to keep them straight.",
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
          text: "Every building documented and ranked. A capital plan, not a one-off quote.",
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
          text: "The pitched-roof standard for garden-style communities: economical at scale.",
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
          "Either. The community assessment ranks every roof so you can do worst-first within this year's budget, or scope the full portfolio, with a clear written scope for both paths.",
      },
      {
        question:
          "A storm hit several of our buildings. How do claims work at that scale?",
        answer:
          "Each building gets its own documentation package tied to the storm date, organized so the carrier and your ownership see a clean per-structure picture. We can meet the adjuster across the whole property in one visit.",
      },
      {
        question: "What happens to tenants' satellite dishes?",
        answer:
          "Dishes mounted to the roof or fascia are carefully detached and set aside so the new roof goes in correctly. We don't roof around them. Reaiming and reconnecting is the tenant's service provider's job, and the advance notice tells residents so nobody is surprised.",
      },
      {
        question: "Do residents have to move their cars?",
        answer:
          "Only the spaces beside the building being worked that day, and only for that building's work days. Notices and signage go out in advance so vehicles move the night before, and everything reopens once that building is done.",
      },
      {
        question:
          "If we phase over several years, will the buildings still match?",
        answer:
          "That's planned from phase one: the manufacturer, product line, and color are named in the plan and kept in your property records. If a product is ever discontinued mid-plan, we tell you before work starts and show you the closest current options.",
      },
      {
        question: "Who handles resident leak calls during the project?",
        answer:
          "One named contact on our side, connected to your office's process. Reports get logged, inspected, and answered in writing: during an active project, no leak report should ever go into a voicemail void.",
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
    metaTitle: "Industrial Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "Industrial roofing across South Mississippi: large spans, production continuity, safety compliance, and systems that stand up to process environments.",
    hero: {
      eyebrow: "Industries · Industrial",
      headline: "Roofing for industrial & manufacturing",
      subhead:
        "Production lines that can't stop, spans measured in acres, and downtime that costs by the hour. Industrial roofing is planned around throughput: ours and yours.",
      chips: ["Production continuity", "Large spans", "Safety compliance"],
    },
    intro: {
      title: "Zero-surprise roofing for facilities that can't pause",
      paragraphs: [
        "On an industrial roof, the roofing is the easy part. The discipline is everything around it: coordinating with plant safety officers, working over (or around) live production, protecting rooftop process equipment, and phasing sections so weather exposure never threatens what's below. Downtime costs more than roofing does, so the schedule is engineered backward from your operations.",
        "Industrial roofs also punish materials: vibration, exhaust, chemical exposure, and constant equipment traffic. System selection starts with what your roof actually endures: which is why our assessment maps exposures, not just leaks.",
      ],
    },
    sections: [
      {
        title: "Exposure assessment comes before system selection",
        paragraphs: [
          "An industrial roof lives in whatever the plant breathes out. Grease and oil from process exhaust settle on the membrane around every stack. Steam and high-temperature discharge cook the material near vents. Chemical fallout, washdown overspray, and dust each attack in their own way, and equipment vibration works at seams and fasteners around the clock. Add the service technicians walking to rooftop units every week, and you have a roof enduring loads a warehouse never sees.",
          "So the assessment maps exposures zone by zone: what discharges where, which paths carry foot traffic, where heat concentrates, and what's already degrading. That exposure map, not a catalog: drives the system recommendation, because the membrane that thrives over the office wing can fail early thirty feet away at the fryer exhaust.",
        ],
      },
      {
        title: "Matching systems to what the roof actually endures",
        paragraphs: [
          "There is no universal industrial membrane, and any contractor claiming one system resists every chemical is guessing with your roof. Manufacturers publish chemical-resistance guidance for a reason, and where your process involves specific compounds, compatibility gets verified against them: by the published data and, where warranted, by testing, before a system is proposed.",
        ],
        table: {
          title: "Systems commonly considered by exposure",
          columns: [
            "Rooftop exposure",
            "Systems commonly considered",
            "The caveat",
          ],
          rows: [
            [
              "Grease and oil discharge",
              "PVC single-ply",
              "Compatibility is verified against your specific compounds: no membrane resists every chemical",
            ],
            [
              "Frequent service traffic",
              "Modified bitumen; membranes with walkway pads",
              "Protected walkway paths to serviced equipment belong in the spec",
            ],
            [
              "High-heat or steam discharge",
              "Metal panels; high-temperature-rated assemblies",
              "Membrane temperature limits vary by product: checked, not assumed",
            ],
            [
              "Chemical fallout or washdown",
              "PVC or coatings, after compatibility review",
              "Manufacturer chemical-resistance data and testing govern the choice",
            ],
            [
              "Corrosive atmosphere over metal panels",
              "Coating restoration or panel replacement",
              "Corrosion treatment and adhesion testing come before any coating",
            ],
            [
              "General manufacturing, limited exposure",
              "TPO; structural metal",
              "Deck type and economics usually decide",
            ],
          ],
          note: "Directional guidance only, the recommendation for your facility follows the exposure assessment and manufacturer compatibility data.",
        },
        links: [
          {
            label: "PVC's chemistry for grease and chemical zones",
            href: "/commercial/pvc",
          },
          {
            label: "Coating restoration for sound industrial roofs",
            href: "/commercial/roof-coatings",
          },
        ],
      },
      {
        title: "Working over live production",
        paragraphs: [
          "Most plants can't hand us an empty building, so the plan starts from your production schedule and works backward. Phasing isolates one roof zone at a time, with each day's section closed watertight before the crew leaves. Air intakes near active work get protected or temporarily filtered so tear-off dust and adhesive odors stay out of the plant, and interior protection goes up over lines and inventory wherever work runs overhead. Where a section genuinely requires a production pause: directly over sensitive equipment, for instance. You'll know weeks ahead, not that morning.",
          "Contamination control cuts both ways: some facilities need protection from our work, and food-grade or clean environments need our containment practices to match their own protocols. Crane picks, material staging, and dumpster locations are coordinated with shipping and receiving so the roofing project never blocks a truck that matters.",
        ],
      },
      {
        title: "Hot work, fire watch, and your safety program",
        paragraphs: [
          "Some roofing methods involve torches, hot asphalt, or welding, hot work, in plant-safety language, and on an industrial site that means permits, designated fire extinguishers at the work area, and a fire watch that continues after the flame stops, per your facility's program and the applicable standards. Where hot work is a poor fit for the environment, cold-applied and mechanically attached systems usually offer a path that avoids the flame entirely.",
          "Our crews work inside your safety program, not alongside it: site orientation, PPE requirements, fall protection planning around skylights and roof edges, lockout coordination near rooftop equipment, and access control all get established before mobilization. Send your contractor safety requirements with the consultation request and the plan is built to them from day one.",
        ],
      },
      {
        title: "Metal deck, open purlins, and the metal-vs-membrane decision",
        paragraphs: [
          "What your roof structure is decides what can go on it. Many industrial buildings are pre-engineered metal structures whose panels span open purlins, commonly four to five feet apart, per the building's load tables, with no deck beneath. Membranes can't be installed over open framing; they need a continuous substrate. So on a purlin-framed building the realistic paths are structural metal panel replacement, a metal-over-metal retrofit, or adding a substrate to carry a membrane: each with different implications for weight, insulation, and cost drivers.",
          "Buildings with a solid metal deck have the full menu: single-ply membranes, modified bitumen, or coatings over sound existing roofs. Either way, penetrations and expansion joints get engineered rather than improvised, and because plants change, we detail with the future in mind, so next year's new exhaust stack lands in a roof designed to accept it.",
        ],
        links: [
          {
            label: "Structural metal systems for purlin-framed buildings",
            href: "/commercial/metal-roofing/structural-metal",
          },
          {
            label: "Maintenance planning for hard-working roofs",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
    ],
    costFactors: {
      title: "Why industrial roofs require a project-specific quote",
      description:
        "No two plants expose a roof to the same conditions, so no two industrial projects price alike.",
      items: [
        {
          title: "Exposure map and compatibility work",
          text: "Grease, chemicals, heat, and steam zones drive system selection, and sometimes require compatibility verification first.",
        },
        {
          title: "Structure type",
          text: "A solid metal deck and open purlins lead to entirely different system options and scopes.",
        },
        {
          title: "Shutdown windows and phasing",
          text: "Working around production adds sequencing, protection, and sometimes night or weekend phases.",
        },
        {
          title: "Safety program requirements",
          text: "Orientations, permits, fire watch, escorts, and access controls are real hours built into the plan.",
        },
        {
          title: "Rooftop equipment density",
          text: "Every unit, stack, and pipe penetration is detail work. The flashing is where industrial roofs live or die.",
        },
        {
          title: "Contamination and intake protection",
          text: "Protecting air intakes, product, and clean environments during work adds containment scope.",
        },
        {
          title: "Height and crane access",
          text: "Material handling to high or congested roofs shapes logistics and schedule.",
        },
      ],
    },
    signs: {
      title: "What industrial roofs contend with",
      items: [
        {
          icon: Wrench,
          title: "Equipment traffic",
          text: "Service techs on the roof weekly: systems and walkways specced for it.",
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
          text: "Your protocols, our compliance: orientation, PPE, and controlled access throughout.",
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
          "Usually: with phasing that isolates work zones, protection for intake air and rooftop equipment, and daily watertight closes. Where a section genuinely requires a pause, you'll know weeks ahead, not that morning.",
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
          "Yes: orientations, PPE requirements, hot-work permits, and access control are standard practice for us on industrial sites. Send your requirements with the consultation request and we plan to them.",
      },
      {
        question: "Is there one membrane that handles all chemical exposure?",
        answer:
          "No, and be wary of anyone who says otherwise. PVC is commonly considered where grease and certain chemicals are present, but every membrane has compounds it tolerates poorly. We verify compatibility against your actual process exposures using manufacturer data before recommending a system.",
      },
      {
        question:
          "Our building has open purlins with no deck. Can you install TPO over that?",
        answer:
          "Not directly, membranes need a continuous substrate and can never span open framing. On purlin-framed buildings the options are structural metal panel replacement, a metal-over-metal retrofit, or adding a substrate so a membrane can be installed. The assessment shows which fits your building and budget priorities.",
      },
      {
        question: "What happens to our rooftop equipment during the project?",
        answer:
          "Each unit gets a plan: most are flashed in place with protection during work around them, some need temporary lifting or disconnection coordinated with your mechanical contractor, and abandoned curbs from old equipment get properly closed instead of roofed around again.",
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
    metaTitle: "Warehouse Roofing in Mississippi | Southeast Roofing",
    metaDescription:
      "Warehouse roofing across South Mississippi: huge low-slope and metal spans, inventory protection, and recover-vs-tear-off decisions made with core data.",
    hero: {
      eyebrow: "Industries · Warehousing",
      headline: "Roofing for warehouses & distribution",
      subhead:
        "The biggest roofs in the region protecting the most concentrated value, inventory. Warehouse roofing is about sound big-area decisions, watertight phasing, and never interrupting what moves below.",
      chips: [
        "Acre-scale spans",
        "Inventory protection",
        "Data-driven decisions",
      ],
    },
    intro: {
      title: "Big-roof decisions, made with data",
      paragraphs: [
        "Warehouse roofs are where the recover-versus-tear-off question matters most. Across tens of thousands of square feet, keeping a dry existing assembly in place and recovering it saves an enormous share of the project, while recovering a wet one traps the moisture and wastes everything you spend. We make that call with core samples and moisture data, not assumptions, and we show you what comes out of the roof.",
        "The other economics are what's underneath. One leak line over racked inventory can damage more value than the roof section above it protects, which is why warehouse work emphasizes watertight phasing, daily closes, and interior protection planning over anything cosmetic.",
      ],
    },
    sections: [
      {
        title: "What's holding the roof up decides what can go on it",
        paragraphs: [
          "Warehouse roofs split into two structural families, and the difference controls every option that follows. Buildings with a continuous deck: steel, wood, or concrete, can carry membranes, insulation, and recover systems. Pre-engineered metal buildings whose panels span open purlins have no deck at all: the panel is the structure and the weather surface at once, so membrane systems can't go on until a substrate exists. Getting this wrong is expensive, which is why the structural assessment comes first, every time.",
          "Wind matters more on big boxes than owners expect. Uplift forces concentrate at roof edges and corners, so those zones carry enhanced attachment requirements: more fasteners, tighter spacing, or additional securement per the system's tested assembly. On a large rectangle, the perimeter zones alone can represent a meaningful share of the attachment scope.",
        ],
        table: {
          title: "Warehouse construction types and roofing paths",
          columns: [
            "Warehouse type",
            "Roof construction commonly found",
            "Systems commonly considered",
            "Main concern",
          ],
          rows: [
            [
              "Pre-engineered metal building",
              "Exposed-fastener panels over open purlins",
              "Structural standing seam, panel replacement, metal-over-metal retrofit",
              "Panel span and fastener condition",
            ],
            [
              "Steel-frame with metal deck",
              "Single-ply or built-up over insulation",
              "TPO, EPDM, recover where the assembly tests dry",
              "Wind uplift at edge and corner zones",
            ],
            [
              "Older masonry or wood-deck warehouse",
              "Built-up or modified layers, often several",
              "Tear-off and new membrane after deck evaluation",
              "Deck condition and moisture trapped in old layers",
            ],
            [
              "Tilt-wall distribution center",
              "Steel deck with large single-ply fields",
              "TPO or EPDM in large sheets",
              "Drainage across long, flat runs",
            ],
          ],
          note: "Representative pairings. Your building's structure, condition, and moisture survey drive the actual recommendation.",
        },
        links: [
          {
            label: "PBR panel systems for purlin-framed buildings",
            href: "/commercial/metal-roofing/pbr-panel",
          },
          {
            label: "Structural metal replacement options",
            href: "/commercial/metal-roofing/structural-metal",
          },
        ],
      },
      {
        title: "Membrane options across acres",
        paragraphs: [
          "On decked warehouses, single-ply membranes dominate for a reason: they cover large simple fields efficiently and their seams are their strength when installed right. TPO seams are hot-air welded into a monolithic bond, and its white reflective surface cuts rooftop temperatures, worth something even over unconditioned space. EPDM comes in very large sheets that minimize total seam length on big rectangles, with seams joined by primer and seam tape rather than welding. Both are proven at warehouse scale; the building's details, insulation plan, and budget priorities pick between them.",
          "The recover question runs through every membrane conversation. Where core samples and a moisture survey show the existing assembly is dry and the deck sound, a recover board and new membrane over the old roof avoids tear-off, disposal, and days of open-roof exposure over your inventory. Where the survey finds saturation, tear-off is the honest answer, burying wet insulation under a new membrane locks the problem in and shortens the new roof's life.",
        ],
        links: [
          {
            label: "TPO membrane specifications",
            href: "/commercial/tpo",
          },
          {
            label: "Compare EPDM for large simple roofs",
            href: "/commercial/epdm",
          },
        ],
      },
      {
        title: "Skylights, smoke vents, hatches, and future solar",
        paragraphs: [
          "A warehouse roof is punctured in more places than it looks: rows of skylights, smoke vents over storage areas, roof hatches, exhaust fans, and pipe penetrations. Every one is a detail to flash and a decision to make, aging skylight domes and deteriorated curbs are better replaced during a reroof than flashed around and inherited, and skylights are also fall hazards that get guarded or protected whenever crews work near them.",
          "If solar is anywhere in your future, the reroof is the time to say so. Panel layouts, attachment methods, and added loads all interact with the roof system and the structure: planning clear zones and walkway paths now, and verifying structural questions with the appropriate engineer, is far cheaper than rework later.",
        ],
      },
      {
        title: "Protecting inventory and keeping docks moving",
        paragraphs: [
          "Inventory protection starts with a map: which racking rows and staging zones sit under which roof areas, so work overhead is sequenced against what's below and high-value zones get covered or temporarily cleared before their section opens. Daily watertight closes are non-negotiable on occupied warehouses, no section opens that can't be sealed before the crew leaves, and tear-off methods are chosen to control dust that would otherwise settle on everything a forklift touches.",
          "Outside, the logistics plan keeps commerce moving: staging and cranes positioned away from dock doors, truck routes kept clear at all hours, and deliveries of roofing material scheduled around your receiving schedule rather than on top of it. A well-run warehouse reroof is one your dock crews barely notice.",
        ],
      },
      {
        title: "Drainage, insulation, and condensation",
        paragraphs: [
          "Big flat roofs live and die by drainage. Long runs to interior drains or scuppers mean small errors accumulate into standing water, and ponding is never harmless. It loads the structure, ages the membrane beneath it, and finds every weak seam. Reroofing at warehouse scale is the opportunity to correct drainage with tapered insulation toward the commonly targeted quarter-inch-per-foot positive slope where practical, and to clean and evaluate every drain while the roof is open.",
          "Insulation and condensation deserve equal thought. Added insulation during a reroof improves the energy picture wherever any part of the building is conditioned, and in metal buildings, warm humid air meeting cold panels produces condensation that drips like a leak without being one, an air-sealing and insulation problem the reroof can address. Interior 'leaks' in metal warehouses turn out to be condensation often enough that we check before we quote a repair.",
        ],
        links: [
          {
            label: "Keep drains and seams serviced with a maintenance program",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
    ],
    costFactors: {
      title: "What affects the cost of a warehouse roof",
      description:
        "Warehouse projects price off area, structure, and the moisture survey. These are the levers.",
      items: [
        {
          title: "Total area and uplift zones",
          text: "Field area sets the base scope; edge and corner zones carry enhanced attachment requirements on top of it.",
        },
        {
          title: "Recover versus tear-off",
          text: "The moisture survey decides. A dry assembly may accept a recover; a wet one must come off, with disposal to match.",
        },
        {
          title: "Deck or purlin condition",
          text: "Rusted deck sections and purlin repairs discovered during assessment change the structural scope.",
        },
        {
          title: "Insulation and energy targets",
          text: "Thickness, tapered drainage packages, and any code-required insulation levels drive material volume.",
        },
        {
          title: "Skylights, vents, and hatches",
          text: "Counts and condition, replacing aging units during the project versus flashing around them.",
        },
        {
          title: "Drainage corrections",
          text: "Tapered systems, added drains or scuppers, and ponding fixes are scope beyond the membrane itself.",
        },
        {
          title: "Operations and phasing",
          text: "Working around dock schedules, occupied zones, and inventory protection shapes crew logistics.",
        },
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
          text: "Scale rewards efficient systems, and punishes mistakes at the same multiple.",
        },
        {
          icon: Banknote,
          title: "Recover vs. tear-off stakes",
          text: "At warehouse scale, the moisture survey is the single biggest decision on the project.",
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
          text: "The recover decision made with data. The single biggest cost lever on a big roof.",
        },
        {
          title: "Scaled, itemized proposal",
          text: "System options itemized at warehouse scale so ownership can weigh each path clearly.",
        },
        {
          title: "Operations-clear phasing",
          text: "Docks, doors, and routes stay open; each day's section closes watertight.",
        },
        {
          title: "Long-span maintenance",
          text: "Scheduled drain and seam care: cheap insurance across acres of membrane.",
        },
      ],
    },
    materials: {
      title: "Systems we recommend for warehouses",
      items: [
        {
          title: "TPO membrane",
          text: "The warehouse default: economical at scale, reflective over unconditioned space too.",
        },
        {
          title: "EPDM membrane",
          text: "Huge sheets, few seams: a natural fit for big rectangles.",
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
          "No, interior protection planning and watertight phasing let operations continue. High-value zones get scheduled around and covered; docks and routes stay open.",
      },
      {
        question: "Recover or tear off. What's honest at our scale?",
        answer:
          "Whatever the cores say. Dry assembly: recover, and skip the tear-off entirely. Wet assembly: tear off, because a recover would trap the moisture and fail early. We show you the samples either way.",
      },
      {
        question: "Does a reflective roof matter over unconditioned space?",
        answer:
          "Less than over conditioned space, but it still cuts interior temperatures meaningfully: which matters for workers, goods, and any future conditioning plans. We'll be straight about how much it's worth in your case.",
      },
      {
        question: "Should skylights be replaced during the reroof?",
        answer:
          "Usually, yes, domes yellow and grow brittle, and curbs deteriorate on the old roof's schedule, not the new one's. Replacing them while the roof is open costs a fraction of the disruption of doing it later, and new units close a common fall hazard and leak source at once.",
      },
      {
        question:
          "We get drips inside our metal warehouse but can't find a leak. What is it?",
        answer:
          "Quite possibly condensation: warm, humid interior air meeting cold metal panels condenses and drips exactly like a leak. It's an insulation and air-sealing problem rather than a hole in the roof, and it's one of the first things we distinguish during assessment, because the fixes are completely different.",
      },
      {
        question:
          "We're considering rooftop solar eventually. Does that change the roof now?",
        answer:
          "It should. Panel layout, attachment method, and added load all interact with the roof system, so we plan clear zones, walkway paths, and compatible details now, and structural questions get verified by the appropriate engineer before anything is mounted.",
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
        description: "Restoring sound membranes across large areas.",
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
    metaTitle: "Municipal & Government Roofing in MS | Southeast Roofing",
    metaDescription:
      "Municipal roofing across South Mississippi: public-accountability documentation, procurement-ready proposals, and continuity for essential services.",
    hero: {
      eyebrow: "Industries · Municipal",
      headline: "Roofing for municipal & public buildings",
      subhead:
        "City halls, fire stations, libraries, public works, buildings the public owns and essential services depend on. Public projects demand public-grade documentation, and that's how we build ours.",
      chips: [
        "Procurement-ready",
        "Essential-service continuity",
        "Licensed & insured",
      ],
    },
    intro: {
      title: "Accountability is the specification",
      paragraphs: [
        "Public projects answer to taxpayers, which changes how everything must be written: scopes itemized so committees can compare bids line by line, our Mississippi State Board of Contractors license #R22245 and current insurance certificates attached, with bond requirements addressed project by project when the bid documents call for them, and records thorough enough to stand review years later. We build proposals for that standard because it's the standard public work deserves.",
        "The buildings themselves serve missions that can't pause, a fire station roofs over trucks that must roll, a water office serves residents daily. Continuity planning for essential services sits at the center of how municipal projects get phased and scheduled.",
      ],
    },
    sections: [
      {
        title: "Proposals built for public procurement",
        paragraphs: [
          "Public purchasing runs on written documents, and a roofing proposal that can't slot into that process wastes everyone's time. Ours are structured for it: a defined written scope tied to documented conditions, alternates broken out separately so a board can weigh options without re-bidding, unit-based line items where bid documents request them, and the exhibits reviewers expect: license verification, insurance certificates, and manufacturer system information. Where a project's bid documents require payment or performance bonds, we address those requirements project by project, up front, before anyone spends evaluation time.",
          "We also respect the clock that public approval runs on. Agenda deadlines, board and council meeting cycles, and public-notice requirements all take calendar days, so proposals arrive complete and early enough to make the meeting that matters, and questions from board members or purchasing staff get answered in writing, so the record is whole.",
        ],
      },
      {
        title: "Continuity for services that can't pause",
        paragraphs: [
          "A fire station reroof happens over apparatus bays that must open in seconds, day and night, so bay doors, response routes, and rooftop communications equipment are mapped and protected, and no phase ever blocks a truck. Police facilities run around the clock with security requirements a jobsite has to respect. Libraries stay open to the public, city halls keep serving residents at the counter, and utility structures protect equipment that keeps water flowing. Each facility's mission defines its constraints, and the phasing plan is written against them.",
          "The common thread is that the public keeps using the building while we work above it. That means sequencing loud work away from council meetings and court dates, coordinating with dispatch or shift supervisors where operations are sensitive, and keeping every emergency function reachable at every hour of the project.",
        ],
      },
      {
        title: "Matching systems to public facilities",
        paragraphs: [
          "A municipality's building stock is as varied as its services, and the roof systems should match the building, its use, and the taxpayer's long-term interest, not a contractor's favorite product. These are the pairings we commonly evaluate across public portfolios.",
        ],
        table: {
          title: "Systems commonly considered by facility type",
          columns: [
            "Facility type",
            "Roof commonly found",
            "Systems commonly considered",
          ],
          rows: [
            [
              "City hall & administration",
              "Low-slope sections, sometimes steep-slope or architectural accents",
              "TPO, modified bitumen, standing seam accents",
            ],
            [
              "Fire & police stations",
              "Low-slope over apparatus bays and 24/7 operations",
              "TPO or modified bitumen, phased to keep bays and dispatch running",
            ],
            [
              "Libraries",
              "Mixed roof areas, often with skylights",
              "Membrane systems with heavy emphasis on interior protection",
            ],
            [
              "Public works & maintenance buildings",
              "Pre-engineered metal",
              "Structural metal, panel replacement, retrofit options",
            ],
            [
              "Utility & pump structures",
              "Varies widely by structure",
              "Evaluated individually: small roofs protecting critical equipment",
            ],
          ],
          note: "Commonly considered options. Each building's assessment, budget, and service requirements drive the recommendation.",
        },
        links: [
          {
            label: "TPO for flat municipal sections",
            href: "/commercial/tpo",
          },
          {
            label: "Standing seam for civic buildings",
            href: "/commercial/metal-roofing/standing-seam",
          },
          {
            label: "Our commercial replacement process",
            href: "/commercial/roof-replacement",
          },
        ],
      },
      {
        title: "Public access and site safety",
        paragraphs: [
          "Public buildings have one obligation private ones don't: the public is entitled to come in. So the site plan preserves that, main and accessible entrances stay open or get protected covered alternatives, barricaded exclusion zones keep pedestrians out from under overhead work, and drive-up functions like book drops, utility payment windows, and records counters keep operating. Public parking is only restricted where work genuinely requires it, with signage in advance.",
          "Housekeeping is part of public safety too: daily debris sweeps of walkways and parking areas, magnetic rollers where fasteners could reach tires and shoes, and staging kept compact and secured after hours. A public building under reroof should still feel like a building that's open for business, because it is.",
        ],
      },
      {
        title: "Submittals, change orders, and closeout",
        paragraphs: [
          "Public projects live on their paper trail, and we keep ours complete from first day to last: product submittals and manufacturer system information before work begins, permits pulled and inspections scheduled per the local code process, and any change handled as a written, documented change order tied to a specific condition, never a verbal adjustment someone has to reconstruct at audit time. Where the selected system carries a manufacturer warranty requiring the manufacturer's own inspection, that inspection is scheduled and its report joins the record.",
          "Closeout hands the municipality a complete asset file: as-completed photos, warranty registrations, maintenance requirements that keep the warranty valid, and the full submittal and change-order record. Whoever manages this building in fifteen years should be able to open one file and know exactly what's on the roof and who stands behind it.",
        ],
      },
      {
        title: "Budget cycles and capital planning",
        paragraphs: [
          "Municipal money moves by fiscal year, so roofing plans should too. A portfolio-wide condition assessment gives the board a ranked list: which roofs need capital replacement this cycle, which can be maintained or restored to reach the next one, and what each path defers or prevents. Phasing large projects across fiscal years is routine when the scope supports it, and interim maintenance protects whatever waits its turn. Where a project's funding source carries additional requirements: prevailing-wage provisions or grant conditions, for example. Those apply only when they actually attach to the funding, and the documentation follows accordingly.",
          "Between capital projects, a documented maintenance program is the cheapest line in the roofing budget: scheduled inspections, drain cleaning, and post-storm reports that keep small problems small and give every future budget request a written basis.",
        ],
        links: [
          {
            label: "Maintenance programs for public buildings",
            href: "/commercial/roof-maintenance",
          },
        ],
      },
    ],
    costFactors: {
      title: "Factors that affect public-project pricing",
      description:
        "Public roofing projects price off documented scope and real constraints. These are the usual drivers.",
      items: [
        {
          title: "Bid format and documentation requirements",
          text: "Detailed submittal, reporting, and closeout requirements are legitimate scope, priced transparently.",
        },
        {
          title: "Bonds and certificates when required",
          text: "Where bid documents require bonds or specific insurance certificates, those requirements are addressed per project.",
        },
        {
          title: "Facility continuity constraints",
          text: "Keeping fire bays, dispatch, and public counters operating shapes phasing, hours, and protection scope.",
        },
        {
          title: "System selection and alternates",
          text: "Membrane, metal, and restoration paths carry different scopes, alternates let the board compare them cleanly.",
        },
        {
          title: "Code-required upgrades",
          text: "Current code may require components or insulation levels the original roof lacked; permits and inspections follow the local process.",
        },
        {
          title: "Manufacturer warranty requirements",
          text: "Extended warranties commonly require specific components and manufacturer inspections, real items in the scope.",
        },
        {
          title: "Phasing across fiscal years",
          text: "Multi-year plans add mobilizations and interim maintenance for sections that wait.",
        },
        {
          title: "Public-access protection",
          text: "Covered walkways, barricades, and after-hours phases near public entrances add planned scope.",
        },
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
          text: "Current licensing and insurance documentation attached: bond requirements addressed when a project requires them.",
        },
        {
          icon: Building2,
          title: "Essential-service continuity",
          text: "Fire, police, water, records: services that operate through the project.",
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
          text: "Assessment reports written for public record: findings, photos, and honest priorities.",
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
          text: "Generational life for civic buildings: often the best taxpayer value long-term.",
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
          "We hold Mississippi State Board of Contractors license #R22245 and provide current insurance certificates as part of any proposal package. Where a project requires bonds, we address those requirements project by project against the bid documents.",
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
      {
        question:
          "What if our bid documents require performance or payment bonds?",
        answer:
          "Bond and certificate requirements vary by project, so we address them case by case: send the requirements with the bid documents and we'll confirm exactly what we can provide for that project before you spend time evaluating our proposal.",
      },
      {
        question: "What closeout documentation does the municipality receive?",
        answer:
          "A complete asset file: as-completed photos, warranty registrations and their maintenance requirements, product submittals, permits and inspection records, and every change order in writing, organized so it stands up to review years later.",
      },
      {
        question: "Can a roofing project span more than one fiscal year?",
        answer:
          "Often, yes. Where the scope supports phasing, sections can be sequenced across budget cycles with interim maintenance protecting what waits. The condition assessment shows which sections can safely wait and which can't, so the board phases with real information.",
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
