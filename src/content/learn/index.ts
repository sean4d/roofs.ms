import type {
  LearnArticle,
  LearnCategory,
  LearnCategorySlug,
} from "@/content/learn/types";

/**
 * Learning Center registry (PRD §13 Phase 7, first content wave).
 * Adding an article = one entry here; the hub and article routes render
 * from this file. Content rules: general roofing knowledge + established
 * site facts only, hedged honest ranges on anything cost-related, and
 * insurance language that assists without promising outcomes.
 */

export const learnCategories: LearnCategory[] = [
  {
    slug: "materials",
    label: "Materials & Shingles",
    description:
      "What goes on your roof and why it matters — shingle grades, metal panels, membranes, and the layers underneath.",
  },
  {
    slug: "insurance-claims",
    label: "Insurance Claims",
    description:
      "How storm claims actually work in Mississippi, what adjusters look for, and where a contractor helps.",
  },
  {
    slug: "storm-prep",
    label: "Storm Preparation",
    description:
      "Getting your roof ready for hurricane season — and what to do in the first hours after a storm.",
  },
  {
    slug: "metal-roofing",
    label: "Metal Roofing",
    description:
      "Standing seam, exposed fastener, gauges, and finishes — metal explained without the sales pitch.",
  },
  {
    slug: "maintenance",
    label: "Maintenance",
    description:
      "Simple habits that add years to a roof in the Pine Belt's heat, humidity, and pine straw.",
  },
  {
    slug: "commercial",
    label: "Commercial Roofing",
    description:
      "Flat-roof systems, maintenance programs, and budgeting guidance for building owners and managers.",
  },
  {
    slug: "cost-guides",
    label: "Cost Guides",
    description:
      "Honest numbers, stated as ranges with the drivers explained — no bait pricing.",
  },
];

export const learnArticles: LearnArticle[] = [
  /* ------------------------------------------------------------------ */
  /* Materials: choosing your shingle (+ GAF comparison + HDZ widgets)   */
  /* ------------------------------------------------------------------ */
  {
    slug: "architectural-vs-3-tab-shingles",
    category: "materials",
    title: "Architectural vs. 3-tab shingles: what you're really choosing",
    metaTitle: "Architectural vs 3-Tab Shingles | Southeast Roofing Learning Center",
    metaDescription:
      "The real differences between 3-tab and architectural shingles — wind ratings, lifespan, looks, and cost — explained by a GAF-certified Mississippi roofer, with GAF's own comparison tools.",
    excerpt:
      "Wind ratings, lifespan, and looks — the real differences between shingle grades, with GAF's own comparison tools built in.",
    updated: "2026-07-05",
    readMinutes: 6,
    hero: {
      headline: "Architectural vs. 3-tab: what you're really choosing",
      subhead:
        "Most homeowners pick a shingle once every 20 years. Here's the honest version of the choice, from a crew that installs both.",
    },
    body: [
      {
        type: "p",
        text: "Walk any South Mississippi neighborhood and you'll see both: flat, single-layer 3-tab shingles on older homes, and thicker, dimensional architectural shingles on almost everything roofed in the last decade. That shift happened for good reasons — but 3-tab still has a place, and knowing the difference protects you from paying for the wrong thing in either direction.",
      },
      { type: "h2", text: "The construction difference" },
      {
        type: "p",
        text: "A 3-tab shingle is a single layer of asphalt-coated fiberglass mat, cut with notches so each strip reads as three small tabs. An architectural (also called dimensional or laminate) shingle bonds two or more layers together, creating a thicker shingle with a varied, wood-shake-style shadow line. More material means more weight, more wind resistance, and more years.",
      },
      {
        type: "list",
        title: "Where the differences show up",
        items: [
          "Wind: 3-tab shingles are typically rated around 60 mph; architectural shingles commonly carry 110–130 mph ratings when installed to spec — a serious difference in hurricane country.",
          "Lifespan: 3-tab warranties usually run 20–25 years; architectural lines carry limited lifetime warranties, and the shingles themselves genuinely last longer in our heat.",
          "Looks: architectural shingles add depth and shadow that flatter most rooflines; 3-tab reads flat.",
          "Price: 3-tab costs less per square up front — but the gap has narrowed, and per year of service the architectural shingle usually wins.",
        ],
      },
      { type: "h2", text: "Compare the GAF lineup side by side" },
      {
        type: "p",
        text: "As a GAF-certified contractor, most of the shingle roofs we install are GAF systems — usually the Timberline HDZ architectural line you'll see in our own itemized proposals. GAF publishes an interactive comparison of its shingle grades; explore it right here.",
      },
      {
        type: "widget",
        widget: "shingle-comparison-chart",
        title: "GAF shingle comparison chart",
        caption:
          "Interactive comparison tool provided by GAF, the manufacturer behind most shingle roofs we install. Product availability varies by region — your proposal will name the exact shingle, line by line.",
      },
      { type: "h2", text: "A closer look at Timberline HDZ" },
      {
        type: "p",
        text: "The shingle we install most often deserves its own tour. GAF's Timberline HDZ tool below shows the colors and construction details up close — useful for picturing a color against your brick or trim before we bring physical samples.",
      },
      {
        type: "widget",
        widget: "hdz-widget",
        title: "GAF Timberline HDZ explorer",
        caption:
          "Timberline HDZ explorer provided by GAF. We confirm final color availability with the supplier before ordering, and we always recommend seeing a physical sample in your own light.",
      },
      { type: "h2", text: "When 3-tab still makes sense" },
      {
        type: "p",
        text: "Honesty cuts both ways: on a rental property you plan to sell, a detached shed, or a budget that simply won't stretch, a properly installed 3-tab roof is better than a poorly installed anything. We'll tell you when the cheaper shingle is the right call — and when the wind rating alone should settle the argument.",
      },
      {
        type: "callout",
        title: "See every line priced before you decide",
        text: "Our proposals itemize the shingle, underlayment, ice-and-water shield, starter, ridge cap, and disposal — each with its own price. You choose upgrades; nothing comes pre-checked.",
        href: "/free-inspection",
        linkLabel: "Schedule a free inspection",
      },
    ],
    faqs: [
      {
        question: "Which shingle do you install most?",
        answer:
          "GAF Timberline HDZ architectural shingles — it's the line in our published example proposal. We install other GAF grades and 3-tab where they fit the job and budget.",
      },
      {
        question: "Do architectural shingles really matter for hurricanes?",
        answer:
          "The wind rating difference is real — roughly 60 mph versus 110–130 mph when installed to manufacturer spec. Installation quality matters as much as the shingle: nailing pattern, starter strips, and edge sealing decide whether the rating holds.",
      },
      {
        question: "Can I upgrade the shingle without redoing the whole quote?",
        answer:
          "Yes — because our proposals are itemized, swapping the shingle line changes one number, not the whole document.",
      },
    ],
    related: [
      { label: "Asphalt Shingle Roofing", href: "/residential/asphalt-shingle-roofing" },
      { label: "Roof Replacement", href: "/residential/roof-replacement" },
      { label: "Financing Options", href: "/financing" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Materials: parts of a roof (+ GAF widget + our anatomy diagram)     */
  /* ------------------------------------------------------------------ */
  {
    slug: "parts-of-a-roof-explained",
    category: "materials",
    title: "Parts of a roof, explained in plain English",
    metaTitle: "Parts of a Roof Explained | Southeast Roofing Learning Center",
    metaDescription:
      "Decking, underlayment, ice and water shield, starter strip, shingles, ridge vent, flashing — every layer of a roof system explained with interactive diagrams.",
    excerpt:
      "Every layer between your family and the weather, explained with two interactive diagrams — ours and GAF's.",
    updated: "2026-07-05",
    readMinutes: 5,
    hero: {
      headline: "Parts of a roof, in plain English",
      subhead:
        "When your proposal says starter strip, ice and water shield, or ridge cap, you should know exactly what you're paying for. Here's every layer.",
    },
    body: [
      {
        type: "p",
        text: "A roof is a system, not a surface. The shingles you see from the street are the last of half a dozen layers, and the ones you can't see — decking, underlayment, flashing, ventilation — decide whether the roof actually keeps water out for twenty years. Because our proposals price each component on its own line, this page doubles as a decoder ring.",
      },
      { type: "h2", text: "The layers, from the wood up" },
      { type: "anatomy" },
      {
        type: "list",
        title: "What each layer does",
        items: [
          "Decking — the plywood or OSB skeleton everything attaches to. Rotten decking gets replaced during tear-off, priced per sheet, never hidden.",
          "Ice & water shield — self-sealing membrane at valleys, eaves, and penetrations, where water concentrates. In our climate it's leak insurance where roofs actually fail.",
          "Synthetic underlayment — the felt-replacement layer across the whole deck; a second water barrier and a safer working surface.",
          "Starter strip — purpose-made first course at the edges that seals the row above against wind lift. Skipping it is how corners peel in storms.",
          "Shingles or panels — the visible weather surface, asphalt or metal.",
          "Flashing — the metal at walls, chimneys, and penetrations. More leaks start at flashing than anywhere else on a roof.",
          "Ridge vent & ridge cap — the exhaust for your attic's heat and humidity, capped with shaped shingles that finish the peak.",
        ],
      },
      { type: "h2", text: "GAF's interactive version" },
      {
        type: "p",
        text: "GAF publishes its own interactive parts-of-a-roof tool showing how its system components fit together — explore it below and the vocabulary on your proposal will never be mysterious again.",
      },
      {
        type: "widget",
        widget: "parts-of-a-roof-widget",
        title: "GAF parts-of-a-roof interactive diagram",
        caption:
          "Interactive diagram provided by GAF, our primary shingle manufacturer. Component names on your Southeast Roofing proposal match what you see here.",
      },
      {
        type: "callout",
        title: "Ventilation is the layer everyone forgets",
        text: "In South Mississippi heat, a poorly vented attic cooks shingles from below and voids warranties. Every inspection we do includes a ventilation check.",
        href: "/residential/ventilation",
        linkLabel: "How roof ventilation works",
      },
    ],
    faqs: [
      {
        question: "Do I need every one of these layers?",
        answer:
          "A code-compliant, warranty-eligible roof needs them all doing their jobs. What varies is the grade — how much ice and water shield, which underlayment, what vent style — and that's exactly what an itemized proposal lets you see and decide.",
      },
      {
        question: "Why do leaks usually start at flashing?",
        answer:
          "Flashing lives where materials meet — chimney to shingles, wall to roof — and joints move with heat and settling. Age, bad sealant, or sloppy installation there leaks long before the field of the roof wears out.",
      },
    ],
    related: [
      { label: "Roof Repair", href: "/residential/roof-repair" },
      { label: "Roof Replacement", href: "/residential/roof-replacement" },
      { label: "Ventilation", href: "/residential/ventilation" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Insurance claims                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "how-roof-insurance-claims-work-mississippi",
    category: "insurance-claims",
    title: "How a roof insurance claim actually works in Mississippi",
    metaTitle: "How Roof Insurance Claims Work in Mississippi | Southeast Roofing",
    metaDescription:
      "From storm to settled claim: documentation, adjuster meetings, wind deductibles, and where a roofing contractor legitimately helps — explained step by step.",
    excerpt:
      "From the storm to the settled claim — documentation, the adjuster meeting, and where a contractor legitimately helps.",
    updated: "2026-07-05",
    readMinutes: 7,
    hero: {
      headline: "How a roof insurance claim actually works here",
      subhead:
        "About half our work is insurance restoration. Here's the process straight — what your policy does, what the adjuster does, and what we do.",
    },
    body: [
      {
        type: "p",
        text: "After a hail run or a tropical system, South Mississippi homeowners face two problems at once: a damaged roof and an unfamiliar process. The claim itself isn't complicated once you see the moving parts — but the order of operations matters, and a few early mistakes cost people real money.",
      },
      { type: "h2", text: "Step one: document before you touch anything" },
      {
        type: "p",
        text: "Your claim lives or dies on evidence. Before repairs, before cleanup where it's safe to wait, the damage needs to be photographed thoroughly — wide shots that establish location, close-ups that show hail bruising, creased shingles, or wind-lifted tabs, and interior shots of any water intrusion. This is the heart of our free storm inspection: we document like the file will be argued over, because sometimes it is.",
      },
      { type: "h2", text: "Step two: filing, and the deductible reality" },
      {
        type: "p",
        text: "You file the claim — it's your policy — but you don't have to interpret it alone. Two things to find in your declarations: your deductible type and your coverage basis. Many Mississippi policies carry a separate wind/hail deductible calculated as a percentage of your dwelling coverage, not a flat number, and coastal policies often place named-storm wind under separate coverage entirely. Replacement-cost policies pay to replace the roof; actual-cash-value policies subtract depreciation. Knowing which you have sets expectations before anyone climbs a ladder.",
      },
      { type: "h2", text: "Step three: the adjuster meeting" },
      {
        type: "p",
        text: "Your insurer sends an adjuster to inspect. This is the single most valuable place to have your contractor present — not to argue, but to make sure nothing gets missed: every slope walked, every soft metal checked, matching damage on gutters and vents pointed out. We meet adjusters on roofs constantly and speak the same test-square language they do. When the adjuster's scope and ours differ, the difference gets documented and resubmitted with photos, not argued on vibes.",
      },
      { type: "h2", text: "Step four: scope, build, and the paper trail" },
      {
        type: "p",
        text: "The insurer issues a scope of loss and payment (often in stages — first check up front, depreciation released on completion for replacement-cost policies). We build to the approved scope with the same itemized clarity as any retail job, and we supply the completion documentation your insurer needs to release final funds.",
      },
      {
        type: "list",
        title: "What we never do",
        items: [
          "Promise your claim will be approved — coverage decisions belong to your insurer under your policy.",
          "Offer to \"eat the deductible\" — that's insurance fraud in plain terms, and a contractor who volunteers it is telling you how they do business.",
          "Inflate scope. Our reports show what the storm did, and equally, what it didn't.",
        ],
      },
      {
        type: "callout",
        title: "Storm damage right now?",
        text: "We assist through the entire claims process, start to finish — inspection, documentation, adjuster meeting, and the build.",
        href: "/storm-damage/insurance-claims",
        linkLabel: "Our insurance claims assistance",
      },
    ],
    faqs: [
      {
        question: "Should I file a claim for any roof damage?",
        answer:
          "Not automatically. If the repair costs less than your deductible, filing gains you nothing and adds a claim to your history. Our inspection gives you the honest repair number first, so you can decide with real information.",
      },
      {
        question: "The insurer's estimate seems low. Is that final?",
        answer:
          "No — scopes get supplemented routinely when documented damage was missed. That's paperwork and photographs, and we handle that documentation as part of the job.",
      },
      {
        question: "How long do I have to file after a storm?",
        answer:
          "Policies set their own notice requirements and Mississippi law bounds the outside window — but practically, sooner is always stronger. Damage documented days after a named storm is easy to attribute; damage found two years later is a fight.",
      },
    ],
    related: [
      { label: "Insurance Claims Assistance", href: "/storm-damage/insurance-claims" },
      { label: "Storm Damage", href: "/storm-damage" },
      { label: "Free Inspection", href: "/free-inspection" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Storm prep                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "hurricane-season-roof-checklist",
    category: "storm-prep",
    title: "The hurricane-season roof checklist for South Mississippi",
    metaTitle: "Hurricane Season Roof Checklist | Southeast Roofing Learning Center",
    metaDescription:
      "What to check on your roof before June 1, what to do when a storm is named, and the first moves after it passes — a practical checklist from Mississippi roofers.",
    excerpt:
      "What to check before June 1, when a storm gets named, and in the first hours after it passes.",
    updated: "2026-07-05",
    readMinutes: 5,
    hero: {
      headline: "Hurricane season starts on your roof",
      subhead:
        "June through November is a fact of life here. The difference between a close call and a claim is usually what happened in May.",
    },
    body: [
      {
        type: "p",
        text: "Every roof in South Mississippi lives on a hurricane calendar. The good news: most catastrophic roof failures start at small, findable weaknesses — a lifted shingle edge, a corroded flashing joint, a clogged gutter dumping water where it shouldn't. Finding them in calm weather is cheap. Finding them mid-storm is not.",
      },
      { type: "h2", text: "Before the season (May)" },
      {
        type: "list",
        items: [
          "Walk your yard and look up: lifted or missing shingles, sagging gutter runs, exposed nail heads at ridge caps.",
          "Check ceilings and attic after a hard rain — staining now means an active leak that a hurricane will turn into a flood.",
          "Clear gutters and downspouts; overflowing gutters push water under the roof edge exactly where wind wants to start.",
          "Trim limbs over the roof line. In Pine Belt storms, trees cause as much roof damage as wind itself.",
          "If your roof is 15+ years old or you can't remember its last professional look, schedule an inspection — it's free and it dates-stamps your roof's condition, which also helps any later claim.",
        ],
      },
      { type: "h2", text: "When a storm is named and coming" },
      {
        type: "list",
        items: [
          "Photograph your roof and each side of your home — dated 'before' photos make an after-storm claim dramatically cleaner.",
          "Secure yard items that become projectiles; more shingle punctures come from flying debris than from wind.",
          "Know where your policy documents are and what your wind deductible is.",
          "Don't put anyone on a roof for last-minute repairs in deteriorating weather. Nothing up there is worth it.",
        ],
      },
      { type: "h2", text: "The first 48 hours after" },
      {
        type: "p",
        text: "Safety first: downed lines and weakened structures kill people after storms. From the ground, photograph everything. If water is coming in, a professional tarp job stops the damage from compounding — insurers expect reasonable mitigation and generally cover it. Then get a documented inspection before signing anything with whoever knocks on your door first: after every major storm, out-of-town crews flood the region, work fast, and leave faster. Check licenses. Ours is MSBOC #R22245, and we're still here after the trucks leave.",
      },
      {
        type: "callout",
        title: "Storm damage right now?",
        text: "Emergency tarping and documented storm inspections are the front end of our storm response.",
        href: "/storm-damage/emergency-roofing",
        linkLabel: "Emergency roof response",
      },
    ],
    faqs: [
      {
        question: "Is tarping covered by insurance?",
        answer:
          "Generally yes — policies expect reasonable steps to prevent further damage after a covered loss, and professional tarping is exactly that. Keep the invoice; it goes in the claim file.",
      },
      {
        question: "How do I vet a storm contractor?",
        answer:
          "Ask for the Mississippi license number and check it, ask for a local physical address, and ask to see completed local work. Be wary of anyone who wants to be your public adjuster and your roofer at once, or who offers to cover your deductible.",
      },
    ],
    related: [
      { label: "Storm Damage Hub", href: "/storm-damage" },
      { label: "Emergency Roofing", href: "/storm-damage/emergency-roofing" },
      { label: "Free Inspection", href: "/free-inspection" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Metal roofing                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "standing-seam-vs-exposed-fastener",
    category: "metal-roofing",
    title: "Standing seam vs. exposed fastener: picking the right metal roof",
    metaTitle: "Standing Seam vs Exposed Fastener Metal Roofing | Southeast Roofing",
    metaDescription:
      "The two families of metal roofing compared honestly — cost, lifespan, maintenance, and where each one belongs, from crews that install both across South Mississippi.",
    excerpt:
      "The two families of metal roofing, compared honestly by crews that install both — including where the cheaper one is the right call.",
    updated: "2026-07-05",
    readMinutes: 6,
    hero: {
      headline: "Standing seam vs. exposed fastener",
      subhead:
        "Metal roofing isn't one product — it's two very different families. We install both, so here's the comparison without the upsell.",
    },
    body: [
      {
        type: "p",
        text: "Ask three neighbors about metal roofs and you'll hear three prices, because 'metal roof' covers everything from a farm shop's ribbed panels to the concealed-fastener systems on high-end coastal homes. The families differ in how they attach — and that one difference drives cost, lifespan, and maintenance.",
      },
      { type: "h2", text: "Exposed fastener: the workhorse" },
      {
        type: "p",
        text: "Exposed-fastener panels (R-panel, PBR, and similar profiles) screw straight through the metal into the structure, with a gasketed washer sealing each screw head. It's fast to install, economical, and genuinely durable — the honest workhorse on barns, shops, camps, and plenty of homes. The trade-off is those hundreds of gaskets: they weather, and the roof wants a fastener check roughly every decade to stay tight and dry.",
      },
      { type: "h2", text: "Standing seam: the system" },
      {
        type: "p",
        text: "Standing-seam panels attach with hidden clips inside raised, interlocking seams — no penetrations through the weather surface at all. The panels can expand and contract with our brutal temperature swings without working screws loose, which is why standing seam carries the longest service expectations and the premium price. On homes, it also brings the crisp architectural look most people picture when they say they want a metal roof.",
      },
      {
        type: "list",
        title: "The honest comparison",
        items: [
          "Up-front cost: exposed fastener is meaningfully cheaper — often the difference between metal being in budget or not.",
          "Service life: both outlast asphalt; standing seam typically leads because there are no gaskets to age.",
          "Maintenance: exposed fastener wants periodic fastener checks; standing seam is close to maintenance-free.",
          "Wind & coast: concealed clips and interlocked seams give standing seam the edge where hurricanes and salt air do their worst.",
          "Looks: standing seam reads architectural; exposed fastener reads practical. On the right building either is correct.",
        ],
      },
      {
        type: "p",
        text: "Gauge (metal thickness) and finish matter within both families — a heavier gauge with a quality painted finish outperforms bargain panels regardless of attachment style. Near the water, panel and fastener metallurgy needs to be specified for salt exposure. Those specifics belong on an itemized proposal, not a slogan.",
      },
      {
        type: "callout",
        title: "Metal is a system we install everywhere",
        text: "Homes, shops, barns, commercial buildings — explore the full metal lineup, residential and commercial.",
        href: "/metal-roofing",
        linkLabel: "Explore metal roofing",
      },
    ],
    faqs: [
      {
        question: "Is a metal roof louder in rain?",
        answer:
          "Over an open shop frame, yes. Over a home with decking, underlayment, and attic insulation, the difference from asphalt is far smaller than people expect.",
      },
      {
        question: "Can metal go over my existing shingles?",
        answer:
          "Sometimes, with the right substructure — but we evaluate case by case. Trapping a failing roof under a new one can hide problems you'd rather fix once, properly.",
      },
      {
        question: "Which do you recommend for coastal homes?",
        answer:
          "Standing seam with salt-appropriate metallurgy is usually the right answer near the water — the no-penetration design and wind performance earn the premium there. Further inland, exposed fastener is often the smart-money choice.",
      },
    ],
    related: [
      { label: "Residential Metal Roofing", href: "/residential/metal-roofing" },
      { label: "Standing Seam", href: "/residential/metal-roofing/standing-seam" },
      { label: "Commercial Metal Roofing", href: "/commercial/metal-roofing" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Maintenance                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "ten-minute-roof-check",
    category: "maintenance",
    title: "The 10-minute roof check every homeowner should do twice a year",
    metaTitle: "The 10-Minute Roof Check | Southeast Roofing Learning Center",
    metaDescription:
      "A twice-a-year, feet-on-the-ground roof check that catches most problems early — what to look for outside, in the attic, and when to call a professional.",
    excerpt:
      "Feet stay on the ground, ten minutes on the clock — the twice-a-year habit that catches most roof problems early.",
    updated: "2026-07-05",
    readMinutes: 4,
    hero: {
      headline: "The 10-minute roof check",
      subhead:
        "No ladder required. Twice a year — spring and fall — this walk-around catches most problems while they're still small.",
    },
    body: [
      {
        type: "p",
        text: "Roofs rarely fail suddenly. They fail slowly, visibly, and politely announce it — to anyone who looks. In the Pine Belt, where heat, humidity, and pine straw age roofs faster than the national brochure numbers, a twice-a-year look is the cheapest roof insurance there is. Your feet never leave the ground.",
      },
      { type: "h2", text: "Outside: the slow lap" },
      {
        type: "list",
        items: [
          "Shingle lines: wavy courses, curling edges, or tabs that look lifted — binoculars or a phone zoom work fine.",
          "Bald spots: patches where granules have washed away read as dark blotches; check your gutter downspout splash for granule piles.",
          "Ridge and edges: the peak and the eaves fail first in wind — look for missing ridge caps or drip edge hanging loose.",
          "Flashing points: chimney, plumbing vents, and wall junctions — rust streaks or lifted metal mean water is next.",
          "Gutters: sagging runs, standing water, plants growing (it happens) — overflowing gutters rot fascia and wick under the roof edge.",
          "Green and black streaks: algae is cosmetic, moss is not — moss holds water against shingles and pries them apart.",
        ],
      },
      { type: "h2", text: "Inside: the attic minute" },
      {
        type: "p",
        text: "Take a flashlight into the attic after a hard rain. You're looking for daylight where there shouldn't be any, water stains or darkened wood along nail lines and around penetrations, and matted or damp insulation. A musty smell is a finding, not an ambience.",
      },
      { type: "h2", text: "What's not a DIY job" },
      {
        type: "p",
        text: "Walking the roof. Steep-slope falls hurt people every year, and foot traffic damages hot asphalt shingles besides. If your ground check finds anything on the list — or your roof is past 15 and hasn't had a professional look — that's what a free inspection is for. We'll tell you honestly if it's a repair, a watch-item, or nothing.",
      },
      {
        type: "callout",
        title: "Found something on the list?",
        text: "A documented professional inspection tells you what it is, what it costs, and whether it can wait. Free, no obligation.",
        href: "/free-inspection",
        linkLabel: "Schedule your free inspection",
      },
    ],
    faqs: [
      {
        question: "How often should a roof be professionally inspected?",
        answer:
          "Annually once it passes about 10 years old, after any named storm or serious hail event, and before buying or selling a home. Between those, the ground check covers you.",
      },
      {
        question: "Are the black streaks on my roof hurting it?",
        answer:
          "The streaks are algae and are mostly cosmetic. Moss is the one to act on — it holds moisture against the shingles. Either way, never pressure-wash a shingle roof; it strips the granules that protect it.",
      },
    ],
    related: [
      { label: "Roof Repair", href: "/residential/roof-repair" },
      { label: "Seamless Gutters", href: "/residential/gutters" },
      { label: "Free Inspection", href: "/free-inspection" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Commercial                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "tpo-epdm-coatings-flat-roof-guide",
    category: "commercial",
    title: "TPO, EPDM, or a coating? A building owner's flat-roof guide",
    metaTitle: "TPO vs EPDM vs Roof Coatings | Southeast Roofing Learning Center",
    metaDescription:
      "The three moves available on an aging flat roof — TPO, EPDM, or a restorative coating — compared by cost logic, building type, and roof condition.",
    excerpt:
      "The three moves on an aging flat roof, compared by cost logic and building condition — including when a coating beats a replacement.",
    updated: "2026-07-05",
    readMinutes: 6,
    hero: {
      headline: "TPO, EPDM, or a coating?",
      subhead:
        "Every aging flat roof eventually forces one of three moves. The right one depends on the deck under it and the decade ahead of it.",
    },
    body: [
      {
        type: "p",
        text: "Commercial roof decisions are budget decisions with a membrane attached. Whether you manage a strip center in Hattiesburg or a warehouse near the port, the question isn't 'what's the best roof' — it's 'what does this building, this budget, and this planning horizon justify.' Here's how the three main options actually sort.",
      },
      { type: "h2", text: "TPO: the default for a reason" },
      {
        type: "p",
        text: "The white single-ply membrane covering most new commercial roofs in the South. Heat-welded seams make it monolithic where roofs usually fail, and the reflective white surface fights our cooling loads all summer. If you're replacing a roof outright on a conditioned building, TPO is usually where the conversation starts.",
      },
      { type: "h2", text: "EPDM: the rubber veteran" },
      {
        type: "p",
        text: "Black synthetic rubber with a half-century track record. It shrugs off impacts and movement, and repairs are straightforward for decades. The black surface runs hot in Mississippi sun — which matters less over unconditioned space and can be offset with coatings. On the right building it remains a smart, economical system.",
      },
      { type: "h2", text: "Coatings: restoration, not replacement" },
      {
        type: "p",
        text: "A fluid-applied silicone or acrylic layer over an existing roof that's aging but fundamentally sound. The economics are the draw: a fraction of replacement cost, minimal business disruption, typically renewable, and often classifiable as maintenance rather than capital expense — worth asking your accountant. The discipline is the catch: coatings rescue tired roofs, not failed ones. Saturated insulation or widespread seam failure means the money belongs in a new roof, and we'll say so.",
      },
      {
        type: "list",
        title: "The quick sort",
        items: [
          "Roof sound but aging, budget tight → coating assessment first.",
          "Membrane at end of life over conditioned space → TPO replacement.",
          "Unconditioned or impact-prone building → EPDM earns a look.",
          "Not sure which — that's what a documented commercial assessment is for, with core samples where warranted.",
        ],
      },
      {
        type: "callout",
        title: "Managing a portfolio, not just a roof?",
        text: "Our maintenance programs catch small failures before tenants do, and assessments give you honest replace-vs-restore numbers per building.",
        href: "/commercial/request-consultation",
        linkLabel: "Request a commercial consultation",
      },
    ],
    faqs: [
      {
        question: "How disruptive is a commercial reroof to operations?",
        answer:
          "Less than most owners fear with real planning — staging, sections, and scheduling around your hours are part of the proposal, not an afterthought. Coatings are quieter still; most tenants never notice.",
      },
      {
        question: "Can you assess whether my roof qualifies for a coating?",
        answer:
          "Yes — that's a moisture and adhesion question, answered with an on-roof assessment and core samples where warranted. If it doesn't qualify, we'll show you why with photos.",
      },
    ],
    related: [
      { label: "TPO Roofing", href: "/commercial/tpo" },
      { label: "EPDM Roofing", href: "/commercial/epdm" },
      { label: "Roof Coatings", href: "/commercial/roof-coatings" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Cost guides                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "roof-replacement-cost-south-mississippi",
    category: "cost-guides",
    title: "What a roof replacement really costs in South Mississippi",
    metaTitle: "Roof Replacement Cost in South Mississippi | Southeast Roofing",
    metaDescription:
      "Honest roof replacement pricing for South Mississippi: what drives the number, a real itemized example, and why per-square teaser prices mislead.",
    excerpt:
      "What drives the number, a real itemized example from our own proposals, and why teaser prices mislead.",
    updated: "2026-07-05",
    readMinutes: 6,
    hero: {
      headline: "What a roof replacement really costs here",
      subhead:
        "No teaser numbers, no 'starting at.' Here's how roof pricing actually works, with a real example from our own proposals.",
    },
    body: [
      {
        type: "p",
        text: "Roof pricing has a trust problem, and the industry earned it: teaser per-square rates that triple once someone's on your roof, 'free upgrades' priced in somewhere else, vague lump sums hiding what you're buying. We price the opposite way — every component on its own line — so this guide can be unusually specific about where the money goes.",
      },
      { type: "h2", text: "The five things that set the number" },
      {
        type: "list",
        items: [
          "Size — measured in squares (100 sq ft). More roof, more everything. Note your roof's area is larger than your home's footprint because of pitch and overhangs.",
          "Pitch and complexity — steep roofs and cut-up rooflines with valleys, dormers, and hips take more time, more safety setup, and more waste.",
          "Material grade — 3-tab vs architectural vs designer shingle, or the jump to metal; this is the biggest lever you control.",
          "Decking condition — rotten decking found at tear-off gets replaced per sheet. An honest contractor prices that possibility up front instead of springing it mid-job.",
          "Accessories and code items — drip edge, ventilation, ice-and-water coverage: individually small, meaningful together, and exactly the lines that vanish inside lump-sum quotes.",
        ],
      },
      { type: "h2", text: "A real itemized example" },
      {
        type: "p",
        text: "The example proposal published on our homepage is a real format with real line pricing for a modest-size architectural shingle replacement: tear-off, GAF Timberline HDZ shingles, synthetic felt, ice and water shield, starter strip, hip and ridge cap, and dump charge — totaling $8,430 before any optional upgrades like drip edge, ridge venting, or gutters. Larger homes, steeper pitches, and premium materials scale that number up from there; many full replacements in our area land in the low five figures, and complex or metal projects run higher. The honest answer for your roof is a measured, line-by-line number — which is exactly what a free inspection produces.",
      },
      { type: "h2", text: "Why per-square teaser prices mislead" },
      {
        type: "p",
        text: "A quoted rate per square tells you nothing until you know what's in it. Does it include tear-off and disposal? Decking allowance? Starter and ridge cap, or are those 'extras'? Code-required ventilation? Two quotes $3,000 apart are usually two different scopes wearing the same units. Line items make scopes comparable; lump sums make them foggy on purpose.",
      },
      { type: "h2", text: "Ways to manage the number" },
      {
        type: "p",
        text: "Timing (replacing on your schedule beats replacing after a failure), material selection where it genuinely fits, insurance when damage is storm-related — about half our work is exactly that — and financing: $0-down options through GoodLeap spread the cost without draining savings. What we won't do is manage the number by thinning the system where you can't see it.",
      },
      {
        type: "callout",
        title: "Get your real number",
        text: "A free inspection produces a measured, itemized proposal — every line priced, upgrades your choice, nothing pre-checked.",
        href: "/free-inspection",
        linkLabel: "Schedule your free inspection",
      },
    ],
    faqs: [
      {
        question: "Can I get a price without an inspection?",
        answer:
          "You can get an instant satellite-based estimate through the Roofr tool on our site — a genuinely useful ballpark. A contract-grade number needs measurements and a decking/ventilation/flashing assessment; that's the free inspection.",
      },
      {
        question: "Is metal always more expensive than shingle?",
        answer:
          "Up front, generally yes — exposed-fastener metal narrows the gap, standing seam widens it. Per year of service life the comparison gets much friendlier to metal; the right answer depends on how long you'll own the roof.",
      },
      {
        question: "Do you charge for the inspection or the proposal?",
        answer: "No. Inspection, measurements, and the itemized proposal are free, with no obligation.",
      },
    ],
    related: [
      { label: "Roof Replacement", href: "/residential/roof-replacement" },
      { label: "Financing", href: "/financing" },
      { label: "Free Instant Estimate", href: "/free-inspection" },
    ],
  },
];

export function getArticle(
  category: string,
  slug: string,
): LearnArticle | undefined {
  return learnArticles.find(
    (article) => article.category === category && article.slug === slug,
  );
}

export function articlesByCategory(
  category: LearnCategorySlug,
): LearnArticle[] {
  return learnArticles.filter((article) => article.category === category);
}

export function articlePath(article: LearnArticle): string {
  return `/learn/${article.category}/${article.slug}`;
}
