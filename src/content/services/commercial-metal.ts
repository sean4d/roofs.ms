import type { ServiceContent } from "@/content/services/types";

/**
 * Commercial metal pages (PRD §4.3, Phase 4): commercial metal hub +
 * standing-seam, r-panel, pbr-panel, structural-metal children. Chips
 * heroes until metal photography exists ([NEEDS: metal project photos]).
 *
 * 2026-07 expansion: the four children were crawled and rejected as thin
 * (539–570 words, 24–30% shared sentences). Each child now carries unique
 * intros, spec tables, and deep sections with near-zero sentence overlap.
 * All technical values are representative/hedged per the vetted fact packs;
 * no dollar figures anywhere (owner directive 2026-07-30).
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
      "For an owner thinking in decades, metal's arithmetic is compelling: service life that commonly outlasts membrane systems, modest maintenance, excellent wind performance for hurricane season, and reflective finishes that cut cooling loads. On pre-engineered metal buildings it's the native system; on conventional structures, architectural standing seam brings the same longevity with a refined profile.",
      "The commercial metal decision is mostly a slope-and-structure decision, and we install all four system families — so the recommendation follows your building. The four system pages linked below carry the specifications this page deliberately doesn't repeat.",
    ],
  },
  sections: [
    {
      title: "Pick the system: four metal families compared",
      paragraphs: [
        "Two questions eliminate most wrong answers immediately: does the roof have a continuous deck or open purlins, and how shallow is the slope? From there, appearance, budget, and maintenance appetite settle the rest.",
      ],
      table: {
        title: "Commercial metal system selector",
        description:
          "Representative characteristics — each system's page carries the full specifications.",
        columns: [
          "System",
          "Typical gauge",
          "Fastener type",
          "Typical support",
          "Low-slope capability",
          "Architectural appearance",
          "Open-framing capability",
          "Relative cost",
          "Best-fit buildings",
        ],
        rows: [
          [
            "Architectural standing seam",
            "24 ga common; some systems 26 ga",
            "Concealed clips",
            "Continuous solid deck",
            "Mechanically seamed may be approved ~1/2:12–1:12; snap-lock commonly ~3:12",
            "Premium — flat pans, crisp seams",
            "No — requires a deck",
            "Higher initial investment",
            "Churches, schools, offices, public-facing buildings",
          ],
          [
            "Structural standing seam",
            "24 ga common; 22 ga for higher loads",
            "Concealed clips at each support",
            "Open purlins (~4–5 ft common in PEMBs)",
            "Certain 3-inch trapezoidal seamed systems as low as ~1/4:12",
            "Utilitarian trapezoidal rib",
            "Yes — engineered to span",
            "Higher initial investment",
            "Warehouses, manufacturing, low-slope metal buildings",
          ],
          [
            "R-panel",
            "26 ga common; 24/22 by manufacturer",
            "Exposed gasketed screws",
            "Solid deck, or open framing in structural versions",
            "A representative system may permit ~1:12 with lap sealant, ~3:12 without",
            "Familiar ribbed profile",
            "Structural versions, per load tables",
            "Lower initial investment",
            "Shops, storage, ag, retail back-of-house; also walls",
          ],
          [
            "PBR panel",
            "26 ga common; 24/22 heavier options",
            "Exposed screws at every support line",
            "Open purlins — bearing leg supports the side lap",
            "Representative systems near ~1/2:12 with approved lap sealant",
            "Utilitarian ribbed profile",
            "Yes — designed for it",
            "Lower initial investment",
            "PEMBs, warehouses, fleet and equipment buildings",
          ],
        ],
        note: "Representative values — gauge availability, slope approvals, and span capability come from the selected manufacturer's tested assemblies and load tables.",
      },
      links: [
        {
          label: "Commercial standing seam specifications",
          href: "/commercial/metal-roofing/standing-seam",
        },
        {
          label: "R-panel details and terminology",
          href: "/commercial/metal-roofing/r-panel",
        },
        {
          label: "PBR panel specifications",
          href: "/commercial/metal-roofing/pbr-panel",
        },
        {
          label: "Structural metal systems explained",
          href: "/commercial/metal-roofing/structural-metal",
        },
      ],
    },
    {
      title: "Deck or purlins: why the structure decides first",
      paragraphs: [
        "A continuous deck supports architectural panels that carry no structural load of their own. Open purlins — the horizontal framing of pre-engineered metal buildings — demand panels engineered to span between supports, a different product class with its own load tables.",
        "Reroofing an existing metal building adds the purlins themselves to the question: rust at fastener lines, deflection, and prior modifications all affect what the structure can accept, so our assessment documents purlin condition before any system is proposed. Where the frame is sound, retrofit systems can go over the existing panels without tear-off.",
      ],
    },
    {
      title: "Project realities: movement, moisture, coast, and logistics",
      paragraphs: [
        "A few physical facts shape every commercial metal project. Steel moves with temperature, and long panels move the most — the attachment either accommodates that or fights it. Conditioned buildings need the condensation question answered with insulation and vapor management. Closer to the Gulf, salt exposure makes finish systems and metallic coatings a genuine specification item.",
        "Then the practical layer: skylights, HVAC curbs, and penetrations each need engineered flashing details; panel length is limited by transport unless a system supports field roll-forming where applicable; and gauge, coverage width, and seam or rib height interact with wind-zone attachment requirements.",
      ],
    },
  ],
  costFactors: {
    title: "Why commercial metal requires a project-specific quote",
    items: [
      {
        title: "System family",
        text: "Concealed-fastener standing seam and exposed-fastener panels sit in different cost classes before any other decision is made.",
      },
      {
        title: "Gauge and finish",
        text: "Heavier gauges and PVDF finish systems carry premiums that make sense on some buildings and not others.",
      },
      {
        title: "Structure and purlin condition",
        text: "Deck repairs or purlin remediation can be a significant line item that only an inspection reveals.",
      },
      {
        title: "Tear-off versus retrofit",
        text: "Going over an existing metal roof, where the structure allows, changes labor, disposal, and downtime substantially.",
      },
      {
        title: "Wind-zone attachment and details",
        text: "Corner and perimeter zones can require denser attachment than the field, and every curb, skylight, and penetration adds flashing labor.",
      },
      {
        title: "Insulation scope and logistics",
        text: "Insulation upgrades, transportable panel lengths, crane needs, and staging room all show up in the installed price.",
      },
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
        text: "As-built records and a maintenance plan matched to metal's modest upkeep.",
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
        text: "The purlin-bearing rib profile — a bearing leg under the side lap for open-framing service. The metal-building standard.",
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
        "Several decades is a common planning range — well-installed commercial metal frequently outlasts membrane alternatives, depending on the system, finish, exposure, and upkeep. Fastener and finish choices tune the maintenance picture, and we'll walk you through both.",
    },
    {
      question: "Can you install metal over our existing metal roof?",
      answer:
        "Often, yes — retrofit systems go over existing panels without tear-off, adding insulation opportunity in the cavity. It depends on the condition of the structure underneath, which the assessment establishes.",
    },
    {
      question: "Is metal noisy for building occupants?",
      answer:
        "Over insulated assemblies — which is how conditioned commercial buildings are roofed — rain noise is comparable to any other roof. The tin-roof racket people remember comes from uninsulated sheds.",
    },
    {
      question: "Metal versus TPO for our building — how do we choose?",
      answer:
        "Horizon and structure. Metal costs more up front and owns the long game; TPO wins the initial budget on conventional flat roofs. On metal buildings and sloped roofs, metal is usually the native answer. We install both and will price both.",
    },
    {
      question: "Do we need engineering for a commercial metal reroof?",
      answer:
        "For structural systems and wind-critical attachments, the specification comes from tested assemblies and load tables rather than rules of thumb. Our proposal identifies where engineered documentation applies to your project.",
    },
    {
      question: "Are roof panels and wall panels the same product?",
      answer:
        "Sometimes the same profile serves both, but roof applications carry water, slope, and uplift requirements that wall use doesn't. R-panel in particular is sold for both — which is why the spec has to name the application, not just the profile.",
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
        "Standing seam earns its reputation on two design moves. First, the fasteners come off the roof surface: panels hang on concealed clips, so no gasketed screw heads weather in the sun across the field. Second, the panel edges rise into seams that lock together well above the drainage plane, so the joints sit out of the water rather than in it.",
        "For the owner of a church, school, office, or civic building, that means a short maintenance list and a long service outlook — flashings, penetrations, and sealants still warrant periodic inspection, but the acres of field screws that define exposed-fastener systems simply aren't there.",
      ],
    },
    sections: [
      {
        title: "Commercial standing seam specifications",
        paragraphs: [
          "Commercial standing seam splits into two branches; the table gives representative values for both. Every figure ultimately comes from the selected manufacturer's tested assembly.",
        ],
        table: {
          title: "Representative commercial standing seam values",
          columns: [
            "Specification",
            "Architectural standing seam",
            "Structural standing seam",
          ],
          rows: [
            [
              "Steel gauge",
              "24 ga common; some systems 26 ga",
              "24 ga common; 22 ga for higher loads",
            ],
            [
              "Seam height",
              "Commonly ~1.5–2 inches",
              "May use ~3-inch trapezoidal seams",
            ],
            [
              "Pan / coverage width",
              "Commonly 12–18 in (16 in common); 18–24 in installs faster but shows more oil canning",
              "18- or 24-inch coverage typical",
            ],
            [
              "Attachment",
              "Concealed clips or fastening flange; clip spacing over solid deck commonly ~12–24 in o.c. per tested assembly",
              "Concealed clips at every purlin",
            ],
            [
              "Minimum slope",
              "Snap-lock commonly ~3:12; mechanically seamed may be approved ~1/2:12–1:12",
              "Certain 3-inch mechanically seamed trapezoidal systems as low as ~1/4:12",
            ],
            [
              "Substrate",
              "Continuous deck — not an unsupported spanning panel",
              "Open purlins, ~4–5 ft spacing common in PEMBs, per load tables",
            ],
          ],
          note: "Representative values only — gauge, clip schedule, and slope approvals are set by the manufacturer's tested assembly and the project's engineering.",
        },
      },
      {
        title: "Architectural or structural: which one is your building?",
        paragraphs: [
          "Architectural standing seam is a finish system: it installs over a continuous deck that carries the loads, and the panel's job is weather and appearance. It's the version for churches, schools, banks, medical offices, and public-facing buildings — and it requires a deck, full stop.",
          "Structural standing seam is a different machine wearing the same name: panels engineered to span open purlins without a deck, commonly at the 4-to-5-foot spacing found in pre-engineered metal buildings, with span capability set by gauge, profile, and the tested assembly's load tables. If your building is a PEMB with a shallow roof, the structural branch is likely your lane.",
        ],
      },
      {
        title: "Clips, thermal movement, and wind-zone attachment",
        paragraphs: [
          "Long steel panels change length noticeably with temperature. Standing seam absorbs that by attaching at the seams through concealed clips rather than pinning the panel through its field — many clip designs let the panel slide as it grows and shrinks, so expansion cycles don't fatigue the attachment.",
          "How many clips, and where, is engineering rather than habit: spacing over solid deck commonly falls around 12–24 inches on center per the tested assembly, structural systems clip at every purlin, corners and perimeters can require denser attachment, and some clips take one fastener while others take two. There is no universal clip schedule.",
        ],
      },
      {
        title: "Snap-lock vs. mechanically seamed at commercial slopes",
        paragraphs: [
          "Snap-lock panels engage by hand and commonly serve at slopes around 3:12 and steeper. Mechanically seamed panels are closed by a motorized seamer that folds the edges together, frequently over factory-applied sealant, and may be approved down to roughly 1/2:12–1:12 depending on the profile.",
          "Commercial roofs are frequently shallower than they look from the ground, so we measure slope during assessment and match the seaming method to the shallowest plane — a snap-lock profile on a 1:12 roof is a specification error, not a style choice. Where a roof drops toward flat, the 3-inch structural trapezoidal systems rated near 1/4:12 enter the conversation.",
        ],
      },
      {
        title: "Panel width, oil canning, and finish",
        paragraphs: [
          "Wider 18-to-24-inch pans cover more roof per panel and install faster. The trade-off is optical: oil canning — the visible waviness light reveals in flat steel — shows more readily in wide pans, thinner gauges, dark colors, and over substrate irregularities. It's cosmetic, not structural, and worth designing against with narrower pans, heavier gauge, striations, and disciplined deck prep. On finish, PVDF coatings are the commercial default for long color retention.",
        ],
      },
      {
        title: "Standing seam against R-panel, for a commercial owner",
        paragraphs: [
          "The honest comparison: R-panel wins the initial budget and suits utilitarian buildings, but it puts thousands of gasketed screws in the weather, and those fasteners become the roof's recurring maintenance item. Standing seam costs more up front, removes the field fasteners entirely, offers stronger low-slope options, and looks like architecture rather than agriculture. Public-facing, conditioned, long-hold properties tend to justify the premium; shops and storage buildings often shouldn't pay it. We install both, so your proposal can price the same roof both ways.",
        ],
        links: [
          {
            label: "Compare R-panel systems",
            href: "/commercial/metal-roofing/r-panel",
          },
          {
            label: "Structural metal for open-framed buildings",
            href: "/commercial/metal-roofing/structural-metal",
          },
          {
            label: "Roofing for churches and sanctuaries",
            href: "/commercial/industries/churches",
          },
        ],
      },
    ],
    costFactors: {
      title: "What determines a standing seam proposal",
      items: [
        {
          title: "Seaming method",
          text: "Mechanically seamed systems add seaming labor and equipment over snap-lock, in exchange for lower slope approvals.",
        },
        {
          title: "Gauge and finish system",
          text: "22 and 24 gauge carry premiums over 26, and PVDF over SMP — decisions that scale across every square of roof.",
        },
        {
          title: "Deck condition or purlin structure",
          text: "Architectural systems need sound decking verified and repaired; structural systems need purlins evaluated.",
        },
        {
          title: "Wind-zone attachment density",
          text: "Corner and perimeter zones can require more clips and fasteners than the field, per the engineered spec.",
        },
        {
          title: "Curbs, penetrations, and transitions",
          text: "Every rooftop unit, flue, and roof-to-wall transition is a formed-metal detail with real labor in it.",
        },
        {
          title: "Panel length and logistics",
          text: "Long panels may require special transport or field roll-forming where applicable, plus crane time and staging room.",
        },
      ],
    },
    approach: {
      title: "How we install commercial standing seam",
      steps: [
        {
          title: "Slope and substrate review",
          text: "We measure the actual slopes, verify deck or purlin condition, and identify which seam systems your roof can carry.",
        },
        {
          title: "Panel and finish selection",
          text: "Profile, gauge, and finish chosen against the building's architecture, exposure, and budget horizon.",
        },
        {
          title: "Clip-attached installation",
          text: "Concealed clips set to the tested assembly's schedule, seams formed tight, and terminations detailed for weather.",
        },
        {
          title: "Verification and closeout",
          text: "Seam checks, detail review, and documentation for the decades ahead.",
        },
      ],
    },
    faqs: [
      {
        question: "What slope does commercial standing seam need?",
        answer:
          "It depends on the profile: snap-lock systems commonly need around 3:12, mechanically seamed profiles may be approved near 1/2:12–1:12, and certain 3-inch structural trapezoidal systems carry approvals as low as roughly 1/4:12. We measure your actual slopes and spec against the shallowest plane.",
      },
      {
        question: "Why choose standing seam over R-panel for our building?",
        answer:
          "No exposed field fasteners to maintain, stronger low-slope capability, and an architectural appearance. R-panel wins on initial cost; standing seam tends to win on lifetime upkeep and looks — building type and hold period usually make the call.",
      },
      {
        question: "How does standing seam perform in hurricane winds?",
        answer:
          "Well — interlocked seams and clip attachment give the system strong uplift performance, with corner and perimeter zones attached more densely where the engineering requires it. Specific ratings come from the tested assembly specified for your project.",
      },
      {
        question: "What gauge should a commercial standing seam roof be?",
        answer:
          "24 gauge is the common commercial standard, with some architectural systems in 26 gauge and 22 gauge for higher-load applications. The right answer comes from span, wind exposure, and the manufacturer's tested options.",
      },
      {
        question: "Can standing seam go over our existing R-panel roof?",
        answer:
          "Retrofit systems exist for exactly that, using sub-framing over the old panels where the structure checks out — often with the chance to add insulation in the cavity. Purlin condition and load capacity decide feasibility.",
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
      title: "The panel that gets the job done",
      paragraphs: [
        "Walk any industrial park in South Mississippi and R-panel is what you're looking at: a ribbed steel sheet, roughly three feet of coverage per panel, screwed down with gasketed fasteners. It's the least expensive way to put real steel on a commercial roof or wall, and on shops, storage buildings, and ag structures the profile looks exactly like it belongs.",
        "What you accept in exchange for that economy is a roof whose fasteners live in the weather. Driven correctly at installation and checked periodically as the gaskets age, an R-panel roof serves for decades; ignored, the screw lines are where it ages first. We install this system constantly and service plenty we didn't install.",
      ],
    },
    sections: [
      {
        title: "“R-panel” is a shape, not a standard",
        paragraphs: [
          "Manufacturers do not use the terms R-panel and PBR identically: the familiar ribbed profile is sold under both names with real differences in lap geometry, and some manufacturers prefer — or require — the PBR version with its purlin-bearing leg for open-framed roofing, reserving plain R-panel for walls and decked applications.",
          "The practical consequence: replacement and extension work has to match panels by manufacturer, rib spacing, coverage width, and lap design, not by name. Two “R-panels” from different mills may refuse to lap together cleanly. When we quote work on an existing building, we identify the actual profile in hand before ordering a sheet.",
        ],
        links: [
          {
            label: "How the PBR bearing leg differs",
            href: "/commercial/metal-roofing/pbr-panel",
          },
        ],
      },
      {
        title: "Representative R-panel specifications",
        paragraphs: [
          "These values describe the common commercial R-panel family — representative figures, not promises. The manufacturer's panel manual and approval documents govern every number for a specific product.",
        ],
        table: {
          title: "R-panel at a glance",
          columns: ["Specification", "Representative value"],
          rows: [
            ["Coverage width", "36 inches per panel"],
            ["Rib profile", "~1.25-inch ribs at ~12 inches on center"],
            [
              "Common gauges",
              "26 ga is the common commercial spec; 24/22 ga vary by manufacturer; 29 ga exists for light duty — not the default structural commercial choice",
            ],
            [
              "Minimum slope",
              "A representative system may permit 1:12 with lap sealant and ~3:12 without; some PBR assemblies approach 1/2:12 — no one universal minimum",
            ],
            [
              "Fastening",
              "Exposed gasketed screws to deck or framing; side-lap stitch screws commonly ~12–20 in o.c. per manufacturer, denser at perimeters and corners",
            ],
            [
              "Span capability",
              "No unsupported span over decking; structural versions span open framing, ~4–5 ft common in suitable 24/26-ga tested assemblies",
            ],
          ],
          note: "Never assume every profile spans 5 feet or accepts 1:12 slope — the selected manufacturer's load tables and approvals control.",
        },
      },
      {
        title: "Roof panel, wall panel — same profile, different job",
        paragraphs: [
          "Standard R-panel is sold for both roofing and siding, one of the profile's genuine advantages: a metal building can wear matching skin on every face. But the applications are not interchangeable specs — a roof panel manages flowing water, slope minimums, lap sealant, and wind uplift; a wall panel mostly manages wind and looks. Lap orientation, fastener patterns, and sealant requirements differ between the two installations of the identical sheet, so a project covering both gets two detail sets in the proposal.",
        ],
      },
      {
        title: "Owning an exposed-fastener commercial roof",
        paragraphs: [
          "Every screw compresses a gasketed washer against the steel, and that washer is a wear part living in ultraviolet light. Panels also expand and contract with temperature, working the fasteners slightly through every seasonal cycle. Neither is a defect — it's how the system is designed — but both mean the fastener lines deserve scheduled inspection over the roof's life.",
          "There's no honest universal interval for that service: exposure, panel movement, washer material, and installation quality all move the timeline. Put the roof on an inspection rhythm alongside your other building systems and address backed-out or weathered fasteners as findings, not emergencies.",
        ],
      },
      {
        title: "R-panel or its siblings: two comparisons that matter",
        paragraphs: [
          "Against PBR: the profiles look nearly identical from the ground, but PBR adds a bearing leg beneath the overlapping edge that supports the side lap where panels cross a purlin — over open framing, that leg is why many manufacturers steer roofing toward PBR, while standard R-panel serves over solid decking.",
          "Against standing seam: R-panel is the budget answer and a good one, but its thousands of exposed screws are exactly what standing seam eliminates. If your building is public-facing, conditioned, or a long-term hold, the concealed-fastener premium is worth pricing before you default to the workhorse — the gap is usually smaller than owners guess.",
        ],
        links: [
          {
            label: "PBR panel specifications",
            href: "/commercial/metal-roofing/pbr-panel",
          },
          {
            label: "Commercial standing seam comparison",
            href: "/commercial/metal-roofing/standing-seam",
          },
          {
            label: "Structural metal systems",
            href: "/commercial/metal-roofing/structural-metal",
          },
        ],
      },
    ],
    costFactors: {
      title: "What goes into an R-panel project price",
      items: [
        {
          title: "Gauge selection",
          text: "26 gauge is the common commercial baseline; 24 or 22 gauge upgrades add material cost heavy-use buildings often justify.",
        },
        {
          title: "Roof, walls, or both",
          text: "Combining reroofing with wall reskinning changes scope, staging, and unit economics — usually favorably.",
        },
        {
          title: "Deck or open framing",
          text: "Decked and purlin installations carry different panel specs, fastener schedules, and prep work.",
        },
        {
          title: "Slope and sealant requirements",
          text: "Shallow roofs need sealed laps and sometimes different profiles — added material and careful labor.",
        },
        {
          title: "Existing roof condition",
          text: "Tear-off, over-the-top installation where appropriate, and purlin or deck remediation are priced from inspection findings.",
        },
        {
          title: "Wind detailing and trim",
          text: "Denser perimeter fastening, ridge and eave closures, and every pipe or curb each carry labor beyond the panel field.",
        },
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
          text: "Gasketed screws at the manufacturer's pattern and depth — the detail that decides the roof's future.",
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
          "PBR carries a purlin-bearing leg — a return beneath the overlapping edge that supports the side lap over open framing. Manufacturers don't use the two names identically, so matching existing panels means matching the actual profile, not the label.",
      },
      {
        question: "How long does an R-panel roof last?",
        answer:
          "Commonly decades, with the fastener schedule as the main variable — periodic inspection and gasket service as findings warrant keep the system tight. Gauge, finish, and exposure set the rest of the range, so we give planning figures per project rather than one number.",
      },
      {
        question: "Can R-panel go over an existing roof?",
        answer:
          "Frequently — over existing metal, or over other roofing with proper sub-framing, it's a common and economical retrofit. Feasibility rides on the structure underneath, which our assessment confirms case by case.",
      },
      {
        question: "Is 29-gauge R-panel okay for a commercial building?",
        answer:
          "29 gauge exists in this family for light-duty use, but it is not the default structural commercial spec — 26 gauge is the common baseline, with 24 and 22 available from some manufacturers for heavier service. We'll tell you plainly when a lighter panel is a false economy.",
      },
      {
        question: "What slope does an R-panel roof require?",
        answer:
          "It varies by system: a representative panel may be permitted at 1:12 with lap sealant and around 3:12 without, while some PBR assemblies carry approvals nearer 1/2:12. There is no universal R-panel minimum, so we verify the selected manufacturer's approval against your measured slope.",
      },
      {
        question: "What are stitch screws, and why do they matter?",
        answer:
          "Stitch screws fasten the side lap where one panel overlaps the next — commonly spaced around 12–20 inches on center per the manufacturer, and denser at perimeter and corner zones where wind uplift concentrates. Missing or loose stitch screws are among the most common findings on underperforming R-panel roofs.",
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
        "The purlin-bearing rib panel is the standard skin of America's metal buildings — a profile designed so the side lap bears on the framing it crosses, not on hope.",
      chips: ["Purlin bearing", "Metal-building standard", "High coverage"],
    },
    intro: {
      title: "The metal-building default, explained properly",
      paragraphs: [
        "If your building came from a pre-engineered metal building manufacturer, there's a strong chance PBR panel — purlin-bearing rib — is what's over your head right now. It's the profile PEMB packages have shipped with for decades — the panel we're most often asked to repair, match, extend, and replace across the region.",
        "PBR's identity lives in one small piece of geometry at the panel edge — understanding it explains when this panel is the right spec and when its plainer R-panel sibling will do.",
      ],
    },
    sections: [
      {
        title: "What the bearing leg actually does",
        paragraphs: [
          "At the overlapping edge of a PBR panel, the profile turns down and back into a short return — the purlin-bearing leg. When two panels lap and cross a purlin, that leg sits beneath the overlapping edge and gives the side lap solid bearing on the support instead of leaving the joint suspended between ribs.",
          "Worth stating what the leg doesn't do: it doesn't make the panel immune to oil canning — the cosmetic waviness inherent to flat areas of light-gauge steel — and it doesn't by itself guarantee structural performance. Gauge, purlin spacing, fastener pattern, and the tested assembly still have to line up. The leg improves the lap; the engineering carries the roof.",
        ],
      },
      {
        title: "Representative PBR specifications",
        paragraphs: [
          "Representative numbers for the common PBR family — the selected manufacturer's load tables and approval documents govern.",
        ],
        table: {
          title: "PBR panel at a glance",
          columns: ["Specification", "Representative value"],
          rows: [
            ["Coverage width", "36 inches"],
            ["Rib profile", "1.25-inch ribs at 12 inches on center"],
            ["Common gauges", "26 ga common; 24 and 22 ga for heavier service"],
            [
              "Manufactured lengths",
              "Commonly ~5–50 feet, depending on manufacturer and transport limits",
            ],
            [
              "Minimum slope",
              "Representative systems near 1/2:12 with approved sealant in side and end laps — exact minimum from the selected manufacturer",
            ],
            [
              "Fastening",
              "Through-fastened into purlins or joists at every support line; one tested assembly may use 3 or 6 panel-to-purlin fasteners across a 36-inch panel per line",
            ],
            [
              "Side laps",
              "Stitch screws in some tested assemblies ~20 in o.c., with tape sealant where the assembly requires it",
            ],
          ],
          note: "Fastener counts, sealant requirements, and slope minimums are assembly-specific and change with wind uplift requirements.",
        },
      },
      {
        title: "Fastener patterns and sealant: assembly-specific by design",
        paragraphs: [
          "PBR is a through-fastened system: screws pass through the panel into the purlin at every support line, and the pattern is not installer preference. A tested assembly might call for three fasteners across a 36-inch panel at each purlin in one configuration and six in another, with roof zones facing higher wind uplift getting denser patterns — treating one pattern as universal is how metal-building roofs end up underperforming their own panels.",
          "Sealant follows the same logic: tape sealant belongs in the laps the tested assembly requires — end laps and low-slope side laps most commonly. When we quote a PBR roof, the fastener and sealant schedule traces to a specific assembly — exactly the paper trail you want if a storm claim is ever scrutinized.",
        ],
      },
      {
        title: "Purlin spacing and what a panel can honestly span",
        paragraphs: [
          "Five-foot purlin spacing appears in many common tested assemblies with 24- and 26-gauge PBR, but it isn't a law of nature: span capability is a function of gauge, wind and live loads, the support condition at the panel's ends versus its middle, panel length, and the manufacturer's load tables. No responsible installer promises that every 26-gauge panel spans five feet regardless of circumstances.",
          "On existing buildings the purlins are half the span question — corroded or deflected members shift the math further. Our assessment records actual spacing and condition before we propose panels, so the span claim in your proposal is your building's, not a brochure's.",
        ],
      },
      {
        title: "Replacing the roof on an existing metal building",
        paragraphs: [
          "Metal-building reroofs come to us on three roads: fastener and lap service — new oversized screws, fresh washers, resealed laps — extends a fundamentally sound roof; panel-for-panel replacement swaps tired PBR for new, succeeding or failing on profile match and purlin condition; and retrofit systems build a new roof over the old one entirely, often adding insulation in the new cavity, where the frame's capacity allows the added load.",
          "Which road fits is an inspection question, not a sales question — rust at fastener lines, lap condition, purlin health, and how the building is used all weigh in. Decide insulation deliberately: a reroof is the most economical moment a metal building will ever have to improve its thermal envelope.",
        ],
      },
      {
        title: "PBR vs. R-panel: when the leg matters",
        paragraphs: [
          "The two profiles are close cousins with one working difference: the bearing leg under the side lap. Over open purlins that leg is why some manufacturers prefer or require PBR for roofing, and why matching an existing PEMB roof almost always means PBR or its manufacturer-specific kin; over a solid deck it has nothing extra to do, and standard R-panel does the job. Because the names get used loosely, don't buy by label — we identify the actual panel on your building before quoting.",
        ],
        links: [
          {
            label: "Standard R-panel details",
            href: "/commercial/metal-roofing/r-panel",
          },
          {
            label: "Structural metal systems for PEMBs",
            href: "/commercial/metal-roofing/structural-metal",
          },
        ],
      },
    ],
    costFactors: {
      title: "What we evaluate before providing a PBR estimate",
      items: [
        {
          title: "Service, replacement, or retrofit",
          text: "Fastener service, panel-for-panel replacement, and over-the-top retrofit are three different projects with three different budgets.",
        },
        {
          title: "Gauge and finish",
          text: "26 gauge is the common baseline; 24 or 22 gauge and upgraded paint systems add cost that harsh exposure can justify.",
        },
        {
          title: "Purlin condition",
          text: "Rust at fastener lines, deflection, or prior modifications can add remediation scope the inspection prices up front.",
        },
        {
          title: "Fastener and sealant schedule",
          text: "Higher wind-uplift requirements mean denser fastener patterns and more engineered tape sealant across the same roof area.",
        },
        {
          title: "Panel lengths and insulation scope",
          text: "Long single-run panels reduce end laps but raise transport demands, and insulation upgrades are their own budget line.",
        },
        {
          title: "Downtime and phasing",
          text: "Working over an operating shop or warehouse takes sequencing that a vacant building doesn't — and sequencing is labor.",
        },
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
          text: "Correct laps, bearing orientation, and the tested assembly's fastener schedule — the details metal buildings depend on.",
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
          "Over open purlins — the metal-building case — PBR's bearing leg supports the side lap, and some manufacturers require that version for open-framed roofing. Over solid decking, standard R-panel serves.",
      },
      {
        question:
          "Our metal building roof leaks at the screws. Is that fixable?",
        answer:
          "Yes — it's the most common metal-building service call: aged gaskets and backed-out fasteners. Re-fastening with oversized screws and new gasketed washers is routine; if the panels themselves are tired, panel replacement or an over-the-top retrofit are the next options up.",
      },
      {
        question: "Can you insulate while reroofing a metal building?",
        answer:
          "A reroof is the ideal moment — new insulation goes in the cavity or over the old roof under the new panels, depending on the retrofit approach. Many older PEMBs were built with minimal insulation, so the comfort and energy difference is often dramatic.",
      },
      {
        question: "What slope does a PBR roof need?",
        answer:
          "Representative PBR systems carry approvals near 1/2:12 with the required sealant in side and end laps — one reason the profile suits the shallow roofs common on PEMBs. The exact minimum belongs to the selected manufacturer's approval documents.",
      },
      {
        question: "How many screws does a PBR roof take?",
        answer:
          "It's set by the tested assembly, not a rule of thumb — one assembly may place 3 panel-to-purlin fasteners across a 36-inch panel at each support line and another 6, with stitch screws in some assemblies around 20 inches on center and denser patterns where uplift demands. Our proposals cite the assembly the counts come from.",
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
        "Most roofing sits on top of a structure; structural metal is part of one. These panels span from purlin to purlin with no deck beneath them, carrying live loads and wind uplift as working members of the building — which is why every meaningful number on this page traces back to load tables and tested assemblies rather than habit.",
        "Structural metal isn't a single product. It's an engineered category spanning three families: structural standing seam with mechanically closed seams, heavy-rib exposed-fastener panels, and engineered systems designed over purlins and bar joists.",
      ],
    },
    sections: [
      {
        title: "What makes a panel “structural” in the first place",
        paragraphs: [
          "A structural panel is one whose tested assembly qualifies it to span open supports and carry the roof's design loads without a continuous deck underneath. Rib geometry provides stiffness, gauge provides material strength, and the attachment transfers loads into the frame — all three verified together in the assembly's testing. An architectural pan over a plywood deck is an excellent roof — but the deck is doing the structural work, and the same panel over open purlin bays is a failure. The category boundary is whether the panel's own documents authorize the span.",
        ],
      },
      {
        title: "Two structural families, compared",
        paragraphs: [
          "The practical choice usually comes down to structural standing seam versus heavy-gauge exposed-fastener panels: the first buys concealed attachment and very low slope capability, the second simplicity and economy.",
        ],
        table: {
          title: "Structural standing seam vs. structural exposed-fastener",
          columns: [
            "Attribute",
            "Structural standing seam",
            "Structural exposed-fastener",
          ],
          rows: [
            [
              "Common gauges",
              "24 ga common; 22 ga for higher loads or wider supports",
              "Commonly 24 or 22 ga; some systems in 26 ga",
            ],
            [
              "Profile",
              "~3-inch trapezoidal rib; 18- or 24-inch coverage",
              "Heavy ribs ~1.5 in on some systems; coverage ~28.8–36 in by profile",
            ],
            [
              "Attachment",
              "Concealed clips at each support; mechanically closed seams",
              "Through-fastened at every support with a wind-uplift-engineered pattern",
            ],
            [
              "Low-slope capability",
              "Some mechanically seamed systems approved near ~1/4:12",
              "Commonly around ~1:12 with lap sealant, per the assembly",
            ],
            [
              "Maintenance profile",
              "No field screws; flashings and terminations get the attention",
              "Exposed gasketed fasteners require periodic inspection",
            ],
            [
              "Where it wins",
              "Very shallow roofs, long runs, minimizing exposed fasteners",
              "Budget-led projects, straightforward buildings, profile matching",
            ],
          ],
          note: "Representative systems — profiles, gauges, and slope approvals vary by manufacturer and are confirmed per tested assembly.",
        },
      },
      {
        title: "Representative structural system parameters",
        paragraphs: [
          "Orientation numbers for the category — the specific product's load tables and the project engineering are the only figures that count.",
        ],
        table: {
          title: "Structural metal at a glance",
          columns: ["Parameter", "Representative range"],
          rows: [
            [
              "Support condition",
              "Open purlins or bar joists — no continuous deck",
            ],
            [
              "Purlin spacing",
              "~4–5 ft common in pre-engineered buildings; wider only where load tables and project engineering support it",
            ],
            [
              "Steel gauges",
              "24 ga common across the category; 22 ga for higher loads; some exposed-fastener systems in 26 ga",
            ],
            [
              "Seams and laps",
              "Mechanically closed seams on standing seam systems; sealed, through-fastened laps on exposed-fastener systems",
            ],
            [
              "Slope range",
              "From ~1/4:12 on certain mechanically seamed trapezoidal systems to ~1:12 and up for exposed-fastener assemblies with lap sealant",
            ],
            [
              "Attachment",
              "At every support line, with denser patterns in corner and perimeter wind zones",
            ],
          ],
          note: "Orientation values only — span, gauge, and attachment for your building come from the selected system's load tables and project engineering.",
        },
      },
      {
        title: "Span, purlin spacing, and the load-table discipline",
        paragraphs: [
          "How far can the panel go between purlins? Never a simple answer: capability moves with gauge, profile depth, wind and live loads, whether a bay is at the panel's end or middle, and the specific tested assembly. The 4-to-5-foot purlin spacing common in PEMBs exists because it suits common panel assemblies; going wider is possible only where load tables and project engineering say so. At reroof time, an existing building's purlin spacing is a fixed fact the new system must be qualified for.",
        ],
      },
      {
        title: "The load path: panel to purlin to frame",
        paragraphs: [
          "A structural roof works as a chain: loads enter the panel, pass through clips or fasteners into the purlins, and travel down into the main frames. Gauge, profile, seam type, clip or fastener choice, attachment pattern, and purlin spacing operate as one tested assembly — swapping any single element without requalifying the chain breaks it.",
          "Wind doesn't load that chain evenly, either: corner and edge zones see substantially higher uplift than the field, which is why attachment density commonly increases there — a spec that treats the whole roof as “the field” is underbuilt at exactly the points storms attack first. When we detail a structural roof, zone-by-zone attachment is in the drawings.",
        ],
      },
      {
        title: "Retrofit over the top vs. panel-for-panel replacement",
        paragraphs: [
          "An aging structural roof has two main futures. Panel-for-panel replacement installs new panels qualified for the same purlin spacing — the cleaner path when the structure is sound and the building can tolerate open-roof phases. Retrofit systems instead build a new roof above the existing one on engineered sub-framing, keeping the building dried-in throughout and creating a cavity that takes new insulation economically — provided the frame is verified for the added load.",
          "Occupancy, schedule, insulation goals, and structural findings decide between the paths; when a building qualifies for both, we present both.",
        ],
        links: [
          {
            label: "PBR panel replacement details",
            href: "/commercial/metal-roofing/pbr-panel",
          },
          {
            label: "Commercial standing seam systems",
            href: "/commercial/metal-roofing/standing-seam",
          },
          {
            label: "Warehouse and distribution roofing",
            href: "/commercial/industries/warehouses",
          },
        ],
      },
    ],
    costFactors: {
      title: "Factors that drive structural metal project pricing",
      items: [
        {
          title: "System family",
          text: "Structural standing seam and heavy-rib exposed-fastener panels sit at different price points with different maintenance futures.",
        },
        {
          title: "Gauge and profile",
          text: "22 gauge over 24, and deeper ribs, add material cost that spans, loads, and exposure may require.",
        },
        {
          title: "Measured spans and load requirements",
          text: "Purlin spacing and design loads set which assemblies qualify — and qualifying assemblies set the material budget.",
        },
        {
          title: "Wind-zone attachment engineering",
          text: "Corner and perimeter uplift zones demand denser clips or fasteners than the field, multiplying hardware and labor.",
        },
        {
          title: "Replacement path and frame condition",
          text: "Panel-for-panel swap and over-the-top retrofit carry very different costs, and purlin remediation is priced from inspection findings.",
        },
        {
          title: "Building operations during work",
          text: "Keeping a plant or warehouse running under an open-roof sequence takes phasing, protection, and coordination — all real labor.",
        },
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
          "Pre-engineered metal buildings, warehouses, manufacturing and ag structures, hangars, and equipment storage — anywhere the design spans open framing without a deck. If your roof panels attach directly to purlins, you're in structural territory.",
      },
      {
        question:
          "Can an old structural metal roof be replaced without rebuilding?",
        answer:
          "Usually — panel-for-panel replacement or an engineered retrofit over the existing roof both preserve the frame. The structural review confirms the purlins are up to it and which path fits your building and operations.",
      },
      {
        question: "How does structural metal handle hurricane winds?",
        answer:
          "By design rather than by hope: uplift resistance comes from tested assemblies and attachment schedules engineered to your wind zone, with corner and edge areas attached more densely than the field.",
      },
      {
        question:
          "Structural standing seam or exposed-fastener — which should we pick?",
        answer:
          "Standing seam earns its premium on very shallow roofs — some mechanically seamed trapezoidal systems are approved near 1/4:12 — and by removing field fasteners from the maintenance picture. Heavy-gauge exposed-fastener systems win on budget and simplicity at slopes commonly around 1:12 and up.",
      },
      {
        question: "Can purlin spacing be widened when we reroof?",
        answer:
          "Only where the new system's load tables and project engineering support the wider span — panel capability depends on gauge, profile, loads, and support conditions working together. Most reroofs keep the existing spacing and qualify the new panel to it.",
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
