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
 * confirmed offering: standing seam + exposed fastener in 26 & 29 gauge;
 * Gibraltar (29 ga Gibraltar Rib) is an owner-confirmed line we install.
 * No dollar figures anywhere (owner directive 2026-07-30).
 */

export const residentialMetalHub: ServiceContent = {
  slug: "metal-roofing",
  path: "/residential/metal-roofing",
  name: "Residential Metal Roofing",
  metaTitle: "Residential Metal Roofing in Hattiesburg | Southeast Roofing",
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
  sections: [
    {
      title: "Standing seam, exposed fastener, or shingles — side by side",
      paragraphs: [
        "Most homeowners narrow the decision to three systems: standing seam metal, exposed-fastener metal, and architectural shingles. All three are legitimate roofs. The real question is which set of trade-offs fits your house, your budget, and how long you intend to own it — so here is the short version, without the sales gloss.",
        "The table summarizes; the two metal pages linked below carry the actual specifications, and our shingle page makes the case for asphalt honestly. One decision — concealed fasteners or exposed — drives most of the difference in price and long-term upkeep between the two metal systems.",
      ],
      table: {
        title: "Three residential roof systems compared",
        columns: [
          "Comparison point",
          "Standing seam metal",
          "Exposed-fastener metal",
          "Architectural shingles",
        ],
        rows: [
          [
            "Attachment",
            "Concealed clips or a hidden fastening flange — no screws through the panel field",
            "Gasketed screws driven through the panel face into deck or framing",
            "Nails covered by the course above",
          ],
          [
            "Typical gauge / material",
            "Commonly 24 or 26 gauge steel (the lower number is thicker)",
            "Commonly 26 or 29 gauge steel",
            "Laminated fiberglass-asphalt mat",
          ],
          [
            "Appearance",
            "Flat pans with crisp vertical seams",
            "Ribbed profile with visible screw heads",
            "Dimensional shingle texture",
          ],
          [
            "Maintenance",
            "Flashings, sealants, and penetrations still need periodic checks",
            "Same items plus the gasketed fasteners, which weather in the sun",
            "Periodic inspection; individual shingles can be replaced",
          ],
          [
            "Slope limitations",
            "Snap-lock profiles commonly need about 3:12; mechanically seamed profiles may be approved lower",
            "Many profiles need about 3:12 without special detailing",
            "2:12 minimum with special underlayment; standard underlayment commonly from 4:12",
          ],
          [
            "Initial investment",
            "Higher initial investment",
            "Moderate initial investment",
            "Lower initial investment",
          ],
          [
            "Best-fit owner",
            "Long-term owners who want the premium, lowest-upkeep metal option",
            "Budget-minded owners; barndominiums, shops, barns, porches",
            "Owners prioritizing initial cost or a neighborhood shingle look",
          ],
        ],
        note: "Representative characteristics — the selected manufacturer's documentation governs slope, attachment, and installation requirements for any specific panel or shingle.",
      },
      links: [
        {
          label: "See standing seam specifications",
          href: "/residential/metal-roofing/standing-seam",
        },
        {
          label: "See exposed-fastener panel details",
          href: "/residential/metal-roofing/exposed-fastener",
        },
        {
          label: "Compare our asphalt shingle systems",
          href: "/residential/asphalt-shingle-roofing",
        },
        {
          label: "Try colors on your home with the visualizer",
          href: "/roof-color-visualizer",
        },
      ],
    },
    {
      title: "Gauge and finish: the two spec choices that follow",
      paragraphs: [
        "Steel gauge runs backwards from what most people expect: the lower the number, the thicker the metal, so 26 gauge is thicker than 29. Thicker panels are stiffer, resist foot traffic and hail denting better, and tend to show less waviness in the flat areas. 29 gauge is lighter and more economical, and it remains a sensible choice for many outbuildings and budget-driven projects — the 29-gauge Gibraltar Rib panel is one line we install regularly on area projects. We stock samples of both gauges so you can feel the difference rather than take our word for it.",
        "Finish is the other lasting decision. Bare Galvalume gives a classic silvery agricultural look; painted panels come in dozens of colors under two common paint families. PVDF finishes are the premium resin system, commonly holding color and gloss longer — especially in dark or vivid colors — while SMP (silicone-modified polyester) finishes are the economical standard that serves well in mid-range colors. Closer to the coast, salt exposure makes both the paint system and the metallic coating underneath worth a deliberate conversation, and we'll have it with you plainly.",
      ],
    },
    {
      title: "What sits under the panels matters as much as the panels",
      paragraphs: [
        "Houses are decked structures: metal goes down over solid sheathing with an underlayment rated for metal roofing — commonly a high-temperature synthetic, because metal panels run hotter than shingles on a July afternoon. Barns and pole structures are usually open-framed, with panels screwed straight to purlins and no deck at all. The two builds behave differently for sound, condensation, and which panels are appropriate, which is why our estimate starts with what your structure actually is.",
        "Condensation deserves a plain mention. Metal sheds nighttime heat quickly, and on humid Mississippi mornings the underside of an open-framed panel can sweat; decked, underlaid homes manage this as part of the normal roof assembly, while open outbuildings may call for vapor-management measures. And on the perennial question of installing metal over existing shingles: it can be done in some cases — a single flat layer over sound decking, with an appropriate underlayment between — but a tear-off is often still the better call, because it lets us inspect and repair the deck and avoids sealing unknowns beneath a decades-long roof.",
      ],
    },
    {
      title: "Hail, rain noise, and Mississippi heat — honest answers",
      paragraphs: [
        "Hail is where metal's story needs nuance. Steel panels resist hail puncture and water penetration very well, but large hail can leave cosmetic dents, and thinner 29-gauge panels dent more readily than 26. Some insurance policies treat cosmetic metal denting differently than functional damage, so it's worth reading yours before you buy — we'll tell you what we see on inspections either way.",
        "Two worries we can mostly retire: noise and heat. Over solid decking and underlayment, rain on a metal roof sounds about like rain on shingles — the loud tin roof of memory is an uninsulated, open-framed barn. And on heat, reflective painted finishes absorb less summer sun than dark shingles, which takes real load off the AC. Metal fits more structures than people assume: full homes, porch roofs alongside shingle main roofs, barndominiums, shops, and barns all wear it well.",
      ],
    },
  ],
  costFactors: {
    title: "What affects the cost of a residential metal roof?",
    description:
      "We never price a metal roof from a satellite photo — these are the factors your written estimate is actually built from.",
    items: [
      {
        title: "System choice",
        text: "Standing seam versus exposed fastener is the single largest driver — concealed-fastener panels cost more to manufacture and take more skilled labor to install.",
      },
      {
        title: "Gauge and finish",
        text: "26 gauge costs more than 29; PVDF paint systems cost more than SMP. Both are worth weighing against how long you'll own the home.",
      },
      {
        title: "Roof complexity",
        text: "Hips, valleys, dormers, and chimneys multiply the trim and flashing work — the most skill-intensive part of any metal installation.",
      },
      {
        title: "Tear-off and decking condition",
        text: "Removing the old roof and repairing any soft or damaged sheathing is priced from what the inspection finds, not guessed.",
      },
      {
        title: "Trim and flashing package",
        text: "Ridge, hip, eave, gable, and penetration trim formed to match the panels — a bigger share of a metal quote than most homeowners expect.",
      },
      {
        title: "Access and panel logistics",
        text: "Long panels, steep pitches, and tight lots change how material is staged and handled, and that shows up in labor.",
      },
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
        text: "We walk the finished roof with you and explain the modest maintenance a metal system actually needs.",
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
    note: "Not sure which system fits? Start with standing seam vs. exposed fastener above — that one decision drives most of the cost and look.",
  },
  faqs: [
    {
      question: "How long does a metal roof last compared to shingles?",
      answer:
        "Metal systems commonly deliver several decades of service — often outlasting two shingle roofs in our climate, depending on the system, finish, and upkeep. Shingles here typically run 15–25 years. We'll give you a realistic planning range for the specific panel and finish you're considering rather than a one-size promise.",
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
        "Budget and horizon. Standing seam costs more and rewards you with concealed fasteners and the fewest long-term maintenance points. Exposed fastener costs meaningfully less and performs well, with the understanding that its gasketed screws deserve a checkup as the roof ages. We install both and will price both for you.",
    },
    {
      question: "Do you install metal on barndominiums, shops, and barns?",
      answer:
        "Constantly — exposed-fastener panels over open purlins are the native roof for those structures, and standing seam suits barndominium living spaces where owners want the upgrade. The estimate accounts for whether the building is decked or open-framed, since the two are detailed differently.",
    },
    {
      question: "Will hail dent a metal roof?",
      answer:
        "Large hail can leave cosmetic dents, especially on thinner 29-gauge panels, though steel resists actual puncture and water penetration well. If hail resistance is a priority, 26 gauge is the stiffer choice — and it's worth checking how your insurance policy treats cosmetic denting on metal.",
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
    metaTitle: "Standing Seam Roofing for Homes | Southeast Roofing",
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
        "The result is the residential roof with the fewest maintenance points we install: clean modern lines, excellent wind performance, and no screw heads on the panel field to re-tighten or gaskets to weather. Flashings, penetrations, and sealants still deserve a periodic look — no roof is exempt from that — but the list is short.",
      ],
    },
    sections: [
      {
        title: "Residential standing seam at a glance",
        paragraphs: [
          "These are the numbers that define a residential standing seam roof. They vary by manufacturer and profile, so treat the table as a representative planning sheet — the approval documents for the specific panel we spec for your home are what govern the installation.",
        ],
        table: {
          title: "Representative residential standing seam specifications",
          columns: ["Specification", "Representative range"],
          rows: [
            [
              "Steel gauge",
              "Commonly 24 or 26 gauge (24 is the thicker of the two)",
            ],
            [
              "Pan width",
              "Typically about 12–18 inches; 16-inch panels are common on homes",
            ],
            ["Seam height", "Commonly about 1.5–2 inches"],
            [
              "Attachment",
              "Concealed clips, or a concealed fastening flange on snap-lock 'nail strip' panels",
            ],
            [
              "Minimum slope",
              "Snap-lock profiles commonly require around 3:12; mechanically seamed profiles may be approved for lower slopes",
            ],
            [
              "Substrate",
              "Continuous solid deck with an underlayment rated for metal roofing",
            ],
          ],
          note: "Representative values only — the selected manufacturer's tested-assembly documents set the actual gauge, clip, and slope requirements for your project.",
        },
      },
      {
        title: "Clips or fastening flange: two ways to hide the screws",
        paragraphs: [
          "Concealed fastening comes in two flavors. Clip-attached panels float over separate clips screwed to the deck; the clip grips the seam while letting the panel slide as it expands and contracts, which is why clips are the standard answer for longer panel runs. Fastening-flange panels — often called nail-strip profiles — screw directly through a hidden flange along one panel edge, with slotted holes providing a more limited allowance for movement.",
          "Both are legitimate residential systems, and both keep every screw out of the weather. On a typical home with moderate panel lengths, either can serve; on long, unbroken runs from eave to ridge, we lean toward clips because controlled thermal movement matters more as panels get longer. This is a spec decision we make from your roof's dimensions, not a default.",
        ],
      },
      {
        title: "Snap-lock vs. mechanically seamed",
        paragraphs: [
          "Snap-lock panels have seams that press together by hand — one panel's leg snaps over its neighbor's, quickly and cleanly. They're the common residential choice, and they commonly require a slope of around 3:12 or steeper because the snapped seam, while weathertight, isn't folded shut.",
          "Mechanically seamed panels get their seams rolled closed by a powered seaming tool after installation, folding the two panel edges into each other — often with sealant inside the fold. That tighter closure is why mechanically seamed profiles may be approved for lower slopes than snap-lock, subject to the manufacturer's requirements. If part of your roof runs shallow — a low porch tie-in, for example — this is the distinction that decides which panel goes there, and it's never safe to assume every standing seam profile handles every slope.",
        ],
      },
      {
        title: "Panel width and oil canning, explained honestly",
        paragraphs: [
          "Oil canning is the visible waviness that can appear in the flat area of a metal panel — light reflecting off slight ripples in the steel. It's a cosmetic phenomenon, not a structural failure, and some degree of it is an inherent characteristic of light-gauge flat metal that no installer can promise to eliminate.",
          "You can stack the odds in your favor, though. Narrower pans show less waviness than wide ones; thicker steel shows less than thin; light colors show less than dark; and striations or ribs pressed into the pan break up the reflection. Substrate irregularities and installation stresses play a role too, which is why deck prep matters. If a glassy dark-color roof is the dream, we'll talk you through pan width, gauge, and striation options before you commit.",
        ],
      },
      {
        title: "Deck, underlayment, and the flashing details that decide it",
        paragraphs: [
          "Residential standing seam is an architectural system: it installs over a continuous solid deck, not open framing. We inspect and repair the sheathing at tear-off, then run an underlayment rated for metal — commonly a high-temperature synthetic, since panel temperatures exceed what standard shingle underlayments are rated to live under.",
          "Then comes the part that actually separates installers: flashing. Chimneys get formed metal counterflashing let into the masonry; sidewalls get flashing tucked behind the cladding, not surface-caulked; valleys get wide open-valley metal with panel edges hemmed and held clear of the waterway; pipes get boots detailed for panel movement. On a standing seam roof, the field almost never leaks — the details are where quality lives, and it's where we spend our time.",
        ],
      },
      {
        title: "How standing seam compares to your other options",
        paragraphs: [
          "Against exposed-fastener metal, the trade is straightforward: standing seam costs more and removes the field fasteners — the component that needs attention as any screw-down roof ages. Exposed-fastener panels deliver real metal performance for meaningfully less, with periodic fastener checkups as part of the deal. Long-horizon owners tend to land on standing seam; budget-focused projects and outbuildings tend to land on exposed fastener.",
          "Against architectural shingles, standing seam is a different investment class: higher initial investment, longer expected service, better performance on low-slope sections, and a distinctly different look. Shingles remain the right answer for plenty of homes — especially where initial cost or neighborhood character leads. We install both, so the comparison you get from us is priced, not theoretical.",
        ],
        links: [
          {
            label: "Compare exposed-fastener metal panels",
            href: "/residential/metal-roofing/exposed-fastener",
          },
          {
            label: "See our asphalt shingle systems",
            href: "/residential/asphalt-shingle-roofing",
          },
          {
            label: "Standing seam for commercial buildings",
            href: "/commercial/metal-roofing/standing-seam",
          },
        ],
      },
    ],
    costFactors: {
      title: "What we evaluate before pricing a standing seam roof",
      description:
        "Standing seam quotes vary more than homeowners expect, because the system is made to order for each roof. These are the real levers.",
      items: [
        {
          title: "Profile and seam type",
          text: "Snap-lock versus mechanically seamed changes both material and labor — seaming machines and slope requirements are part of the spec.",
        },
        {
          title: "Gauge and pan width",
          text: "24 gauge costs more than 26; narrower pans mean more seams per square of roof, which adds material and installation time.",
        },
        {
          title: "Finish system",
          text: "PVDF paint finishes carry a premium over SMP, with better long-term color hold — a fair trade to weigh on a decades-long roof.",
        },
        {
          title: "Roof geometry",
          text: "Hips, valleys, dormers, chimneys, and skylights each add formed flashing work — the most labor-intensive part of standing seam.",
        },
        {
          title: "Tear-off and deck repair",
          text: "The existing roof comes off and the sheathing gets repaired where needed; the inspection sets this line, not an allowance.",
        },
        {
          title: "Underlayment specification",
          text: "High-temperature synthetic underlayment rated for metal is part of a correct assembly and part of the price.",
        },
        {
          title: "Panel length and access",
          text: "Long eave-to-ridge runs, steep pitches, and tight sites change staging, handling, and crew time.",
        },
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
          title: "You want serious storm resilience",
          text: "Interlocked seams and concealed clips give standing seam outstanding wind performance for hurricane season.",
        },
        {
          icon: Wrench,
          title: "You want the shortest maintenance list",
          text: "No exposed fasteners on the panel field — flashings and penetrations still deserve a periodic look, but the list is short.",
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
        question: "What roof pitch does standing seam need?",
        answer:
          "It depends on the profile. Snap-lock panels — the common residential choice — typically need around 3:12 or steeper, while mechanically seamed profiles may be approved for lower slopes, subject to the manufacturer's requirements. If part of your roof runs shallow, we spec the panel to the shallowest section rather than hoping.",
      },
      {
        question: "What maintenance does a standing seam roof need?",
        answer:
          "Less than most systems, but not none: keep debris out of valleys, keep gutters flowing, and have flashings, sealants, and penetrations checked periodically — especially after major storms. What you don't have is a field full of gasketed screws to service, and that's the system's core advantage.",
      },
      {
        question: "What is oil canning, and will my roof have it?",
        answer:
          "Oil canning is a visible waviness in the flat part of metal panels — a cosmetic characteristic of light-gauge flat metal, not a defect or structural problem. It shows more with wide pans, thin steel, and dark colors. We'll walk you through pan width, gauge, and striation options that minimize it.",
      },
      {
        question: "Snap-lock or mechanically seamed for my house?",
        answer:
          "For most homes at typical pitches, snap-lock is the practical answer — faster to install and fully weathertight at its approved slopes. Mechanically seamed earns its extra cost on low-slope sections and where owners want the most robust seam available. Roof geometry usually makes the call, and we'll show you where each fits on yours.",
      },
      {
        question: "Does standing seam require solid decking?",
        answer:
          "Residential architectural standing seam does, yes — it's designed to install over a continuous deck with a metal-rated underlayment, not to span open framing. If you're roofing an open-framed shop or barn, an exposed-fastener panel or a structural system is the appropriate family instead.",
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
    metaTitle: "Exposed-Fastener Metal Roofing | Southeast Roofing",
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
    sections: [
      {
        title: "The two panel families we install",
        paragraphs: [
          "Exposed-fastener panels aren't one product — the market splits into two representative families, and the difference matters. The classic ag/residential rib panel is the familiar barn-and-farmhouse profile; the commercial-style panel (the R-panel type) carries taller, wider-spaced ribs and heavier common gauges. The 29-gauge Gibraltar Rib is one ag-family line we install regularly on area projects.",
          "Which one belongs on your building depends on the structure, the look you want, and the loads involved. The table below lays out the representative differences; exact rib geometry, gauges, and fastening requirements come from the specific manufacturer's panel manual.",
        ],
        table: {
          title: "Representative exposed-fastener panel families",
          columns: [
            "Feature",
            "Ag / residential rib panel",
            "Commercial-style panel (R-panel type)",
          ],
          rows: [
            ["Coverage width", "About 36 inches", "About 36 inches"],
            [
              "Rib height",
              "Roughly 3/4-inch major ribs",
              "Roughly 1.25-inch ribs",
            ],
            [
              "Rib spacing",
              "Often about 9 inches on center",
              "About 12 inches on center",
            ],
            [
              "Common gauges",
              "Commonly 26 and 29 gauge",
              "Commonly 26 gauge, with heavier options",
            ],
            [
              "Typical use",
              "Homes, porches, barns, sheds, barndominiums",
              "Shops, larger outbuildings, light commercial",
            ],
          ],
          note: "Representative profiles — rib geometry, gauge availability, and slope approvals vary by manufacturer and are confirmed against the panel manual for your project.",
        },
      },
      {
        title: "26 or 29 gauge: what the number buys you",
        paragraphs: [
          "Gauge numbers run opposite to thickness — 26 gauge is thicker steel than 29. On an exposed-fastener roof that thickness translates to stiffer panels between supports, better resistance to hail denting and foot traffic, and a somewhat flatter, quieter appearance in the panel flats.",
          "29 gauge is the economical staple of the ag-panel world, and it's an honest fit for barns, sheds, porches, and budget-driven projects. For a house you plan to keep — especially one with long panel runs or hail worries — we usually recommend stepping up to 26 gauge where the budget allows. We install both, we'll price both, and the choice stays yours.",
        ],
      },
      {
        title: "Screws, washers, and why driving depth decides the roof",
        paragraphs: [
          "Every fastener on this system passes through the panel, and each one seals with a compressible gasketed washer under the screw head. That washer only works when the screw goes in straight and stops at the right depth: underdrive it and the washer never compresses against the panel, leaving a gap; overdrive it and the washer splits or squeezes out, and the dimpled panel can pool water at the screw. A crooked screw does both at once.",
          "Placement is not improvised either — the panel manufacturer's manual dictates where screws land relative to ribs and how the pattern runs, and side laps and end laps may require sealant depending on the panel and slope. Panel length, the eave-to-ridge dimension, temperature movement, and the manufacturer's limits all shape the layout before the first screw is driven. This is unglamorous work, and it is the entire difference between a twenty-minute callback and a roof that quietly does its job.",
        ],
      },
      {
        title: "Fastener maintenance, without the myths",
        paragraphs: [
          "You'll read online that all the screws on a metal roof must be replaced every 10 years. That's a myth — there is no calendar that applies to every roof. What's true is that gasketed washers weather in the sun and panels move with temperature, so the fasteners deserve periodic inspection over the roof's life, and screws get re-seated or replaced based on what the inspection actually finds.",
          "How fast washers age depends on the washer material, sun exposure, how much the panels move, and — more than anything — whether the screws were driven correctly on day one. A well-installed roof may go many years before any fastener needs attention; a badly installed one can leak the first spring. Our installation practices target the first outcome, and our repair crews see plenty of the second on roofs we didn't install.",
        ],
      },
      {
        title: "On a decked house vs. an open-framed outbuilding",
        paragraphs: [
          "The same panel lives two different lives depending on the structure. On a house, it installs over solid decking with a metal-rated underlayment beneath — which improves sound, adds a secondary water barrier, and helps manage the condensation that humid Mississippi nights produce. On a pole barn or shop, panels commonly screw straight to open purlins with no deck, which is economical and normal for those buildings but changes the sound, condensation, and fastener-loading picture.",
          "Slope matters in both cases: many exposed-fastener profiles want roughly 3:12 or steeper without special detailing, while certain R-panel and PBR-type assemblies are approved for lower slopes with sealed laps. No residential rib panel should be assumed fine on a shallow roof — we check the profile's approval against your actual pitch, every time.",
        ],
      },
      {
        title: "Where exposed fastener sits against your alternatives",
        paragraphs: [
          "Versus standing seam: you're trading concealed fasteners for a meaningfully lower price. The panels themselves are comparably tough steel; the difference is thousands of gasketed screws in the weather versus none, and the periodic checkups that come with them. For outbuildings and budget-led projects that trade usually favors exposed fastener; for a forever home, it's a genuine coin worth flipping carefully.",
          "Versus shingles: exposed-fastener metal commonly costs somewhat more installed but brings longer expected service and steel's wind behavior — panels screwed to the manufacturer's pattern hold on well in the thunderstorm winds that strip aging shingles, though no roof of any type is immune to severe storms. If the ribbed look suits your house, it's one of the strongest value plays in roofing.",
        ],
        links: [
          {
            label: "Compare residential standing seam",
            href: "/residential/metal-roofing/standing-seam",
          },
          {
            label: "R-panel systems for commercial buildings",
            href: "/commercial/metal-roofing/r-panel",
          },
          {
            label: "See our asphalt shingle options",
            href: "/residential/asphalt-shingle-roofing",
          },
        ],
      },
    ],
    costFactors: {
      title: "Factors that shape an exposed-fastener quote",
      description:
        "This is the most economical metal system we install, but the price still moves with real variables — here's what they are.",
      items: [
        {
          title: "Panel family and profile",
          text: "Ag rib panels and R-panel-style profiles carry different material costs, and the profile has to match the building's structure and slope.",
        },
        {
          title: "Gauge selection",
          text: "26 gauge costs more than 29 — worth it on homes and long panel runs, often unnecessary on small outbuildings.",
        },
        {
          title: "Decked or open-framed",
          text: "A house needs tear-off, deck repair, and metal-rated underlayment; a purlin-framed barn skips those lines entirely.",
        },
        {
          title: "Trim and closures",
          text: "Ridge, eave, gable trim, and foam closure strips at ribs — small parts that add up and matter for weather-tightness.",
        },
        {
          title: "Penetrations and transitions",
          text: "Pipes, flues, valleys, and porch tie-ins each add detailing time on a panel system.",
        },
        {
          title: "Roof size and cut-up",
          text: "Simple big rectangles install fast; complex, cut-up roofs spend the savings on cutting and fitting.",
        },
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
          text: "Steel panels fastened to the manufacturer's pattern hold on well in the storms that strip aging shingles.",
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
          text: "Gasketed screws driven straight to the right depth — snug, not crushed — in the manufacturer's pattern. This detail decides the roof's future.",
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
          "The fasteners seal with compression gaskets that age in the sun over many years. That's why we drive them straight to correct depth on day one and recommend a periodic checkup as the roof ages — re-seating or replacing fasteners based on inspection is quick, inexpensive maintenance that keeps the system tight.",
      },
      {
        question: "Do all the screws really need replacing every 10 years?",
        answer:
          "No — that blanket schedule is an internet myth. Fastener service is driven by inspection: washer condition, panel movement, sun exposure, and installation quality determine when screws actually need attention, and on a well-installed roof that can be a long time.",
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
      {
        question: "What roof slope do these panels need?",
        answer:
          "Many exposed-fastener profiles want roughly 3:12 or steeper without special detailing, while certain R-panel and PBR-type assemblies carry lower-slope approvals with sealed laps. It varies by panel, so we verify the specific profile's approval against your measured pitch rather than assuming.",
      },
      {
        question: "How long does an exposed-fastener metal roof last?",
        answer:
          "Commonly multiple decades, depending on the gauge, finish, exposure, and — critically — installation quality and periodic fastener upkeep. The panels themselves are long-lived steel; the fasteners and details are what determine whether the roof reaches the panel's potential.",
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
