import {
  Droplets,
  Layers,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";

import type { ServiceContent } from "@/content/services/types";

/**
 * Roof washing, residential (/residential/roof-washing) and commercial
 * (/commercial/roof-washing).
 *
 * Owner-confirmed 2026-07-30: Southeast Roofing now offers roof washing.
 *
 * SUBCONTRACTOR RULE (owner directive 2026-07-31): our exterior-cleaning
 * subcontractor is named and linked in the roof-washing BLOG POST ONLY.
 * These service pages carry services, FAQs, and knowledge. They do not
 * name, credit, or promote that company, and they carry no "who does the
 * work" section. Do not reintroduce one here.
 *
 * INTEGRITY LIMITS for this service (owner directive): do NOT state specific
 * chemicals, mixes or ratios, equipment, warranties, certifications,
 * manufacturer approvals, safety credentials, or proprietary process names.
 * Nothing here does. What IS said is either owner-confirmed or general,
 * well-established roofing knowledge stated with hedges, notably that
 * shingle manufacturers direct owners AWAY from high-pressure washing,
 * which is why a roof gets evaluated before anything is cleaned.
 *
 * Pricing rule (owner directive 2026-07-30): no dollar figures anywhere.
 */

export const residentialRoofWashing: ServiceContent = {
  slug: "roof-washing",
  path: "/residential/roof-washing",
  name: "Roof Washing",
  metaTitle: "Roof Washing in Hattiesburg, MS | Southeast Roofing",
  metaDescription:
    "Black streaks and moss on your roof? Southeast Roofing now offers residential roof washing across South Mississippi: evaluated by roofers first, cleaned without damaging shingles.",

  hero: {
    eyebrow: "New service",
    headline: "Roof washing, handled by roofers first",
    subhead:
      "Those black streaks aren't dirt. They're a living organism feeding on your shingles. We now offer residential roof washing across South Mississippi, and because we're a roofing company, the roof gets evaluated before anything touches it.",
    // Owner-supplied 2026-07-31. Sourced photography, not a Southeast Roofing
    // project: the badge describes the service, never claims the job.
    photo: {
      src: "/images/services/roof-washing-asphalt-shingle-roof.jpg",
      alt: "Technician rinsing algae staining from an asphalt shingle roof with a low-pressure spray",
    },
    photoBadge: "Residential roof washing",
  },

  intro: {
    title: "What those black streaks actually are",
    paragraphs: [
      "The dark streaks running down South Mississippi roofs are almost always algae, commonly Gloeocapsa magma, and it thrives in exactly what we have here: heat, humidity, shade, and long summers. It takes hold on the north- and shaded-facing slopes first, which is why one side of a roof can look years older than the other.",
      "It matters beyond appearance. The organism feeds on limestone filler in asphalt shingles, holds moisture against the roof surface, and darkens the roof so it absorbs more heat. Moss and lichen are a further step: moss holds water like a sponge at the shingle edges, and lichen roots into the granule surface, so removing it badly does more damage than leaving it alone.",
      "That's the whole reason we now offer this as a roofing service. A clean roof is a cosmetic result; a roof that's still intact afterward is a roofing outcome, and those two things are not automatic.",
    ],
  },

  signs: {
    title: "When a roof wash is worth doing",
    description:
      "If you recognize two or more of these, it's worth having the roof looked at.",
    items: [
      {
        icon: Droplets,
        title: "Black streaks running downslope",
        text: "The classic algae signature, dark vertical staining that starts at the ridge and runs toward the eaves, usually worst on shaded slopes.",
      },
      {
        icon: Layers,
        title: "Green moss at the edges",
        text: "Moss clumps along shingle edges and in valleys hold moisture against the roof and lift shingle edges over time.",
      },
      {
        icon: Sun,
        title: "One slope much darker than another",
        text: "Uneven staining between a shaded north slope and a sunny south slope is a strong sign of biological growth rather than age.",
      },
      {
        icon: Sparkles,
        title: "You're selling or listing the house",
        text: "Roof staining reads as a worn-out roof in listing photos and inspections, even when the shingles have years of service left.",
      },
      {
        icon: Wind,
        title: "Tree cover and constant shade",
        text: "Overhanging limbs, pine straw accumulation, and shade keep the roof damp for longer, which is exactly the condition the organism wants.",
      },
      {
        icon: ShieldCheck,
        title: "Someone offered to pressure wash it",
        text: "If a cleaning quote mentions high pressure on an asphalt roof, get a roofer's opinion before anyone starts. This is the one that costs people a roof.",
      },
    ],
  },

  sections: [
    {
      title: "Why pressure is the wrong tool on a shingle roof",
      paragraphs: [
        "Asphalt shingles protect themselves with a layer of ceramic-coated granules. Those granules are what block ultraviolet light and give the shingle its fire and weather performance, and they're held in an asphalt surface that softens in the heat. Force water at that surface under pressure and you strip granules off, drive water backward under the courses, and shorten the life of a roof that may have had a decade left.",
        "This isn't a fringe opinion. Shingle manufacturers direct owners away from high-pressure washing in their care guidance, and roofs cleaned with pressure commonly show it afterward: bare patches, granules in the gutters, and accelerated aging on the slopes that were cleaned hardest. On metal, aggressive pressure and the wrong approach can drive water past laps and fasteners rather than over them.",
        "So the questions we answer before scheduling any wash are roofing questions, not cleaning questions: what the roof covering actually is, what condition it's in, whether it's sound enough to be cleaned at all, and what method suits it. Some roofs shouldn't be washed, and if yours is one of them, we'll tell you that instead of selling you a wash.",
      ],
      table: {
        title: "What we establish before scheduling a wash",
        columns: ["What we check", "Why it decides the approach"],
        rows: [
          [
            "Roof covering and age",
            "Asphalt shingle, metal, and tile each behave differently, and an aging shingle roof may not be a candidate at all.",
          ],
          [
            "Granule condition",
            "A roof already shedding granules has less to lose before it starts leaking, cleaning may not be the right spend.",
          ],
          [
            "Growth type and extent",
            "Surface algae staining, thick moss, and rooted lichen are not the same problem and don't respond the same way.",
          ],
          [
            "Flashing, boots, and penetrations",
            "Existing gaps are where water can be driven inside during any wash, so they get inspected first.",
          ],
          [
            "Slope, access, and surroundings",
            "Pitch, height, and what sits below: landscaping, HVAC, walkways, shape how the work is staged.",
          ],
          [
            "Gutters and drainage",
            "Everything rinsed off the roof ends up in the gutters, so their condition is part of the plan.",
          ],
        ],
        note: "This evaluation is a roofing inspection, and it happens whether or not you end up booking a wash.",
      },
      links: [
        {
          label: "See what a roof inspection covers",
          href: "/free-inspection",
        },
        {
          label: "Learn how shingle systems are built",
          href: "/residential/asphalt-shingle-roofing",
        },
      ],
    },
    {
      title: "Metal and tile roofs are a different job",
      paragraphs: [
        "Not every home in South Mississippi wears asphalt. Standing seam and exposed-fastener metal, and the tile roofs found on some coastal and Mediterranean-style homes, collect the same staining in the same climate, but none of them react to cleaning the way a shingle roof does. Treating all three the same way is how finishes get ruined and water ends up somewhere it was never meant to go.",
        "On metal, the concern is direction and detail rather than granules. Panels are built to shed water one way, and laps, seams, and fastener penetrations are designed around water running that direction; forcing water uphill across a lap, or straight into an exposed fastener and its washer, works against the way the roof was assembled. The factory finish is its own consideration. It's the layer carrying the corrosion and color performance, and it isn't something to scour.",
        "Tile brings a third set of problems. The tiles themselves are durable, but the underlayment beneath them is what actually keeps water out, and a tile roof walked carelessly cracks pieces that then have to be matched and replaced. Growth in the channels and along the laps is common and it is removable, but the roof has to be accessed and staged by someone who knows what tile will and won't take.",
      ],
      bullets: [
        "Metal: water is kept moving with the panel, not driven back against laps, seams, or fasteners.",
        "Metal: the factory finish is treated as the protective layer it is, not as a surface to scrub down.",
        "Tile: the working assumption is that the underlayment below, not the tile, is the waterproofing.",
        "Tile: breakage is a real cost, so access and staging get settled before anyone steps on the roof.",
        "Any covering, if the evaluation says the roof shouldn't be washed, that's the answer you get.",
      ],
      links: [
        {
          label: "Residential metal roofing systems",
          href: "/residential/metal-roofing",
        },
        {
          label: "How exposed-fastener panels are built",
          href: "/residential/metal-roofing/exposed-fastener",
        },
      ],
    },
    {
      title: "Washing versus replacing: an honest answer",
      paragraphs: [
        "Washing does not add life to a roof that's finished. If the shingles are brittle, the granule loss is widespread, or the roof is near the end of its service life, cleaning buys appearance and not much else, and the money is usually better held for the replacement. We would rather say that out loud than take the job.",
        "Where a wash genuinely earns its keep is a roof with real service life left that simply looks a decade older than it is: staining on the shaded slopes, moss starting in the valleys, sound shingles underneath. That roof is worth cleaning, and it's worth keeping clean, because the conditions that grew the algae the first time are still there afterward.",
        "Between the two extremes, the honest answer depends on what the evaluation finds, which is why we look before quoting rather than pricing a wash off a photo.",
      ],
      links: [
        {
          label: "Compare repair and replacement",
          href: "/residential/roof-repair",
        },
        {
          label: "How a full replacement runs",
          href: "/residential/roof-replacement",
        },
      ],
    },
    {
      title: "Keeping it from coming back so fast",
      paragraphs: [
        "Regrowth is normal, and how fast it returns depends on the things around your roof more than on the roof itself. Shade is the biggest driver in our climate, followed by anything that keeps the surface damp: overhanging limbs, heavy pine straw, blocked gutters that back water onto the roof edge.",
      ],
      bullets: [
        "Trim back limbs that shade or drop debris onto the roof, where it's safe to do so.",
        "Keep pine straw and leaf litter off the roof surface and out of the valleys.",
        "Keep gutters flowing so water leaves the roof edge instead of sitting at it.",
        "Address any attic ventilation problem: a hot, damp roof deck doesn't help.",
        "Have the roof looked at after major storms, when debris and damage arrive together.",
      ],
      links: [
        { label: "Gutter and drainage work", href: "/residential/gutters" },
        { label: "Attic ventilation", href: "/residential/ventilation" },
      ],
    },
  ],

  approach: {
    title: "How a roof wash runs with us",
    steps: [
      {
        title: "Roof evaluation first",
        text: "We inspect the roof covering, its condition, and the growth involved, and tell you plainly whether washing is the right call.",
      },
      {
        title: "Scope in writing",
        text: "You get the scope of what will be cleaned and how it will be staged: from Southeast Roofing, on our paperwork.",
      },
      {
        title: "Scheduling through us",
        text: "We coordinate the date with you and handle the communication in between, so there's one schedule and one number to call.",
      },
      {
        title: "Property protection",
        text: "Landscaping, walkways, and what sits below the work area are planned for before anyone starts.",
      },
      {
        title: "The wash itself",
        text: "Carried out with an approach matched to your roof covering and its condition, rather than one setting used on every roof.",
      },
      {
        title: "Walkthrough and findings",
        text: "We review the result with you and pass along anything the roof itself needs, repair or otherwise.",
      },
    ],
  },

  costFactors: {
    title: "What we evaluate before quoting a roof wash",
    description:
      "Roof washing isn't priced off square footage alone. These are the things that actually move a quote.",
    items: [
      {
        title: "Roof size and pitch",
        text: "Area sets the baseline; pitch changes how the work has to be staged and how long it takes.",
      },
      {
        title: "Number of stories and access",
        text: "Height, tight side yards, fences, and where equipment can sit all affect the approach.",
      },
      {
        title: "Roof covering",
        text: "Asphalt shingle, metal, and tile each call for a different approach, which changes the work involved.",
      },
      {
        title: "Type and extent of growth",
        text: "Light surface staining and heavy rooted moss are different jobs on the same size roof.",
      },
      {
        title: "Roof condition",
        text: "A roof with existing damage may need repairs handled first, or may not be a candidate for washing at all.",
      },
      {
        title: "What sits below",
        text: "Landscaping, decks, pools, HVAC units, and walkways all need protecting, which is part of the work.",
      },
      {
        title: "Gutter condition",
        text: "Everything rinsed off the roof reaches the gutters, so their state can add to the scope.",
      },
    ],
  },

  faqs: [
    {
      question: "Will washing my roof damage the shingles?",
      answer:
        "It can, if it's done with high pressure, that strips the protective granules that shingles depend on, and manufacturers direct owners away from pressure washing for exactly that reason. That's why we evaluate the roof covering and its condition first and match the approach to the roof, and why we'll tell you when a roof shouldn't be washed at all.",
    },
    {
      question: "What happens to my landscaping and everything below the roof?",
      answer:
        "Protecting what sits under the work area is part of the scope, not an afterthought. Landscaping, walkways, decks, patios, and anything else below the roofline are planned for before the work starts, and where the rinse water leaves the roof is part of that plan. If something below the roof needs particular care, tell us at the evaluation so it's built into the scope rather than handled on the fly.",
    },
    {
      question: "Are those black streaks actually hurting my roof?",
      answer:
        "They're a living organism, not dirt. It feeds on filler material in asphalt shingles, holds moisture against the roof surface, and darkens the roof so it absorbs more heat. Moss and lichen go further by holding water at shingle edges and rooting into the granule surface.",
    },
    {
      question: "How long before the streaks come back?",
      answer:
        "It varies with your roof's exposure: shade, tree cover, and how damp the surface stays are the biggest drivers, so a heavily shaded roof regrows faster than one in full sun. We'll give you a realistic expectation for your specific roof rather than a number that sounds good.",
    },
    {
      question: "My roof is old. Should I wash it or replace it?",
      answer:
        "If the shingles are brittle or shedding granules widely, cleaning buys appearance and little else, and the money is usually better saved toward replacement. We'd rather say so than take the job. If the roof has real service life left and simply looks aged from staining, washing is worth doing. The evaluation is what tells us which one you have.",
    },
    {
      question: "Do you wash commercial roofs too?",
      answer:
        "Yes, commercial roof washing runs through the same process, with the evaluation matched to the roof system involved and the work scheduled around how your building operates. There's a dedicated commercial page with those details.",
    },
  ],

  related: [
    {
      label: "Roof Repair",
      href: "/residential/roof-repair",
      description:
        "If the evaluation turns up a leak source, this is where it gets fixed properly.",
    },
    {
      label: "Seamless Gutters",
      href: "/residential/gutters",
      description:
        "Everything rinsed off a roof ends up here, worth checking while we're on site.",
    },
    {
      label: "Asphalt Shingle Roofing",
      href: "/residential/asphalt-shingle-roofing",
      description:
        "How shingle systems are built, and why the granule surface matters so much.",
    },
  ],
};

export const commercialRoofWashing: ServiceContent = {
  slug: "roof-washing",
  path: "/commercial/roof-washing",
  name: "Commercial Roof Washing",
  metaTitle: "Commercial Roof Washing in South Mississippi | Southeast Roofing",
  metaDescription:
    "Roof washing for South Mississippi commercial properties: evaluated by roofers, scheduled around your operations, and coordinated end to end by Southeast Roofing.",

  hero: {
    eyebrow: "New service",
    headline: "Commercial roof washing, coordinated by your roofer",
    subhead:
      "Staining and growth on a commercial roof is a curb-appeal problem and a roofing question at the same time. We evaluate the system first, scope the work, and schedule it around how your building actually operates.",
    // Owner-supplied 2026-07-31. Sourced photography, not a Southeast Roofing
    // project: the badge describes the service, never claims the job.
    photo: {
      src: "/images/services/commercial-roof-washing-tile-roof.jpg",
      alt: "Washing a terracotta tile roof section on a commercial building",
    },
    photoBadge: "Commercial roof washing",
  },

  intro: {
    title: "Why a stained commercial roof gets attention",
    paragraphs: [
      "On a commercial property, roof staining tends to surface for one of three reasons: a tenant or owner is unhappy with how the building shows, a property is being marketed or appraised, or someone noticed growth spreading and asked whether it's doing damage. All three are reasonable questions, and all three deserve a roofing answer rather than a cleaning pitch.",
      "The complication is that commercial buildings rarely carry one roof. A single property can have low-slope membrane over the main structure, metal on canopies or a mansard, and shingles on an office wing, and those surfaces do not respond to cleaning the same way. What's safe on one can be the wrong call on the one beside it.",
      "So the first step is establishing what's actually up there and what condition it's in. That's a roofing assessment, and it's the part a cleaning contractor working alone isn't positioned to make.",
    ],
  },

  sections: [
    {
      title: "One property, several roof surfaces",
      paragraphs: [
        "Before any wash is scheduled, we identify each roof area on the property and treat them as separate decisions. A membrane roof raises questions about seams, terminations, drainage, and foot traffic. Metal raises questions about laps, fasteners, and finish. Shingled sections raise the granule question that drives every residential wash. Deciding all of that in one sweep is how buildings get damaged.",
        "Two constants apply across all of them. First, anything rinsed off the roof has to go somewhere, so drains, scuppers, gutters, and what sits below the building line are part of the plan, not an afterthought. Second, existing openings are where water gets driven inside during any wash, so flashings, penetrations, and terminations get looked at before work starts rather than explained afterward.",
      ],
      table: {
        title: "How the roof surface shapes the decision",
        columns: [
          "Roof surface",
          "What we evaluate first",
          "Why it changes the approach",
        ],
        rows: [
          [
            "Low-slope membrane",
            "Seams, terminations, penetrations, drainage, traffic history",
            "Cleaning is planned around watertight details and where water will actually run off.",
          ],
          [
            "Metal panels",
            "Laps, fastener condition, finish, and slope",
            "The wrong approach can drive water past laps and fasteners instead of over them.",
          ],
          [
            "Shingled sections",
            "Granule condition, age, remaining service life",
            "Same rule as a house: pressure strips the surface that protects the shingle.",
          ],
          [
            "Canopies and entries",
            "Public access below and what's parked or planted underneath",
            "These sit over doors and walkways, so staging and protection drive the schedule.",
          ],
        ],
        note: "Each roof area on a property gets its own evaluation, one property can easily need more than one answer.",
      },
      links: [
        {
          label: "Commercial roof assessment",
          href: "/commercial/roof-repair",
        },
        {
          label: "Planned maintenance programs",
          href: "/commercial/roof-maintenance",
        },
      ],
    },
    {
      title: "Working around a building that stays open",
      paragraphs: [
        "Nobody closes a property for a roof wash, so the scheduling questions get settled before the date does: which entrances stay in use, where crews and equipment can stage, what sits under the work area, and whether the work needs to happen outside business hours. On tenant-occupied buildings, notice matters as much as the work itself, tenants who know what's happening don't call the office about it.",
        "The same applies to what's below the roofline. Parking, landscaping, storefronts, patios, HVAC equipment, and pedestrian routes all need planning for, and on multi-building properties the work is commonly phased building by building rather than done all at once.",
      ],
      bullets: [
        "Entrances, walkways, and parking areas planned around before scheduling.",
        "Tenant and staff notice coordinated ahead of the work.",
        "Landscaping, storefronts, and rooftop equipment protected as part of the scope.",
        "Multi-building properties phased rather than done in a single sweep.",
        "After-hours or weekend scheduling where the building's operation calls for it.",
      ],
    },
    {
      title: "What a wash won't fix on a commercial roof",
      paragraphs: [
        "Cleaning changes how a roof looks. It does not change how a roof performs, and on commercial buildings those two things get confused often enough to be worth stating plainly. A membrane that has pulled at its terminations, seams that have opened, insulation that has taken on water under the deck, drains that have never carried the roof properly. A wash leaves every one of those exactly where it found them, just cleaner.",
        "The distinction matters most when a property is being cleaned for a reason: a sale, an appraisal, a lender's inspection, a tenant complaint that finally reached the office. A roof that photographs well and still leaks hasn't solved the problem it was cleaned for. The assessment that comes with the wash is the part that tells you which of the two you actually have.",
        "Where the assessment finds a roof that's sound but weathered, cleaning is a reasonable thing to spend money on and we'll do it. Where it finds a system near the end of its service life, restoration or replacement planning is the honest answer, and coating an aged roof is a different project with different economics from washing one, which is a conversation worth having before the budget cycle closes rather than after.",
      ],
      bullets: [
        "Open seams, failed terminations, and lap problems are repair items, not cleaning items.",
        "Wet or saturated insulation is a system condition no surface wash can reach.",
        "Ponding and poor drainage return the moment the roof dries out.",
        "Staining on an otherwise sound roof is cosmetic, and wanting it gone is perfectly reasonable.",
        "A system near the end of its life is better served by a restoration or replacement plan.",
      ],
      links: [
        {
          label: "Roof coatings and restoration",
          href: "/commercial/roof-coatings",
        },
        {
          label: "Commercial roof replacement",
          href: "/commercial/roof-replacement",
        },
      ],
    },
  ],

  approach: {
    title: "How a commercial wash is coordinated",
    steps: [
      {
        title: "Property walk and roof assessment",
        text: "We identify each roof area, its system, and its condition, and flag anything that needs attention before cleaning is considered.",
      },
      {
        title: "Scope by roof area",
        text: "You get a written scope that treats each surface on its own terms rather than one blanket line item.",
      },
      {
        title: "Operations planning",
        text: "Access, staging, tenant notice, entrances, and hours are settled with your team before a date is set.",
      },
      {
        title: "Protection and staging",
        text: "Landscaping, storefronts, walkways, and rooftop equipment are planned for as part of the work.",
      },
      {
        title: "The wash",
        text: "Carried out surface by surface, matched to each roof area on the property rather than one method run across the whole building.",
      },
      {
        title: "Documentation and findings",
        text: "We report the result and any roofing issues the assessment surfaced, so they can be planned and budgeted.",
      },
    ],
  },

  costFactors: {
    title: "What determines a commercial roof-washing proposal",
    description:
      "Commercial washing is scoped by property, not by a rate card. Here's what actually shapes it.",
    items: [
      {
        title: "Roof areas and systems involved",
        text: "A property with membrane, metal, and shingled sections is several jobs, not one.",
      },
      {
        title: "Building height and access",
        text: "How crews and equipment reach each roof area drives much of the labor.",
      },
      {
        title: "Extent and type of growth",
        text: "Light staining and heavy established growth are different amounts of work on identical square footage.",
      },
      {
        title: "Roof condition",
        text: "Existing seam, flashing, or drainage problems may need addressing before any cleaning is appropriate.",
      },
      {
        title: "Operating restrictions",
        text: "After-hours work, phased buildings, and tenant coordination all affect how the project is staged.",
      },
      {
        title: "Protection requirements",
        text: "Storefronts, landscaping, parking, and rooftop equipment below the work area are part of the scope.",
      },
      {
        title: "Drainage and runoff handling",
        text: "Where rinse water goes, and the condition of the drains and gutters carrying it, factors into planning.",
      },
    ],
  },

  faqs: [
    {
      question: "How often does a commercial roof need washing?",
      answer:
        "It depends far more on the building's exposure than on a calendar. Shade, tree cover, nearby vegetation, and how long the roof surface stays damp are what drive regrowth, so a shaded rear elevation can look stained again long before a fully exposed roof does. We'd rather give you a realistic expectation for your property than a fixed interval, and on buildings under a maintenance program, the roof is being looked at on schedule anyway.",
    },
    {
      question:
        "Our property has several different roof types. Is that a problem?",
      answer:
        "It's normal, and it's exactly why we assess each roof area separately. Membrane, metal, and shingled sections don't respond to cleaning the same way, so each surface gets its own evaluation and its own line in the scope rather than one blanket approach.",
    },
    {
      question: "Can the work happen without disrupting our tenants?",
      answer:
        "We plan around your operation: entrances, parking, staging, tenant notice, and after-hours scheduling where the building calls for it. We won't promise zero disruption, because that isn't realistic on an occupied property, but the plan is agreed with your team before a date is set.",
    },
    {
      question: "What if the assessment finds something wrong with the roof?",
      answer:
        "You get told, in writing, with options. Because a roofing contractor is doing the evaluation, open seams, failing terminations, and drainage problems come back to you as roofing findings you can plan and budget for: not as a surprise added to a cleaning invoice.",
    },
    {
      question: "Is washing ever the wrong call on a commercial roof?",
      answer:
        "Yes. A roof at the end of its service life, or one with problems that cleaning would aggravate, is better served by repair or replacement planning. If that's what the assessment shows, we'll say so rather than sell a wash that doesn't help the building.",
    },
  ],

  related: [
    {
      label: "Commercial Roof Maintenance",
      href: "/commercial/roof-maintenance",
      description:
        "Scheduled inspections that catch the problems a wash can only reveal.",
    },
    {
      label: "Commercial Roof Repair",
      href: "/commercial/roof-repair",
      description:
        "Where seam, flashing, and drainage findings get resolved properly.",
    },
    {
      label: "Roof Coatings",
      href: "/commercial/roof-coatings",
      description:
        "For roofs where restoration, not cleaning, is the real answer.",
    },
  ],
};
