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
      "The commercial metal decision is mostly a slope-and-structure decision. Standing seam handles low slopes with concealed clips and raised locks; R-panel and PBR panels cover the workhorse middle affordably; structural panels span open purlins on metal buildings without decking. We install all of them, so the recommendation follows your building — and the four system pages linked below carry the specifications this page deliberately doesn't repeat.",
    ],
  },
  sections: [
    {
      title: "Pick the system: four metal families compared",
      paragraphs: [
        "This selector table is where most commercial metal conversations should start. Two questions eliminate most of the wrong answers immediately: does the roof have a continuous deck or open purlins, and how shallow is the slope? From there, appearance, budget, and maintenance appetite settle the rest.",
      ],
      table: {
        title: "Commercial metal system selector",
        description:
          "Representative characteristics for the four families we install — each system's page carries the full specifications.",
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
            "Mechanically seamed profiles may be approved near 1/2:12–1:12; snap-lock commonly ~3:12",
            "Premium — flat pans, crisp seams",
            "No — requires a deck",
            "Higher initial investment",
            "Churches, schools, offices, civic and public-facing buildings",
          ],
          [
            "Structural standing seam",
            "24 ga common; 22 ga for higher loads",
            "Concealed clips at each support",
            "Open purlins (~4–5 ft common in PEMBs)",
            "Certain 3-inch trapezoidal mechanically seamed systems as low as ~1/4:12",
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
        note: "Representative values — gauge availability, slope approvals, and span capability come from the selected manufacturer's tested assemblies and load tables, never from a generic chart.",
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
        "Every commercial metal roof answers to what's underneath it. A continuous deck — plywood, metal deck, or similar — supports architectural panels that carry no structural load of their own. Open purlins, the horizontal framing members of pre-engineered metal buildings, demand panels engineered to span between supports, which is a different product class with its own load tables. Putting a deck-only panel over open framing isn't a shortcut; it's a failure waiting on the first serious storm.",
        "Reroofing an existing metal building adds one more layer to the question: the purlins themselves. Rust at fastener lines, deflection, and prior modifications all affect what the structure can accept, so our assessment documents purlin condition before any system is proposed. Where the frame is sound, retrofit systems can go over the existing panels without tear-off — often with the chance to add insulation in the cavity — and where it isn't, we say so before anyone spends money on panels.",
      ],
    },
    {
      title: "Project realities: movement, moisture, coast, and logistics",
      paragraphs: [
        "A few physical facts shape every commercial metal project regardless of system. Steel moves with temperature, and long panels move the most — the attachment method either accommodates that or fights it. Conditioned buildings need the condensation question answered with insulation and vapor management, because metal cools fast on humid nights. Closer to the Gulf, salt exposure makes finish systems and metallic coatings a real specification item rather than a color choice.",
        "Then there's the practical layer: skylights, HVAC curbs, and penetrations each need engineered flashing details on a metal roof; panel length is limited by transport unless a system supports field roll-forming on site, where applicable; and gauge, coverage width, and rib or seam height interact with wind-zone attachment requirements. None of this should scare an owner off metal — it's simply why our proposals are written from a site visit, and why each system page below goes into the specifics.",
      ],
    },
  ],
  costFactors: {
    title: "Why commercial metal requires a project-specific quote",
    description:
      "No two commercial metal roofs price alike — these are the variables your proposal is actually built from.",
    items: [
      {
        title: "System family",
        text: "Concealed-fastener standing seam and exposed-fastener panels sit in different cost classes, before any other decision is made.",
      },
      {
        title: "Gauge and finish",
        text: "Heavier gauges and PVDF finish systems carry premiums that make sense on some buildings and not others.",
      },
      {
        title: "Structure and purlin condition",
        text: "Deck repairs, purlin remediation, or retrofit framing can be a significant line item that only an inspection reveals.",
      },
      {
        title: "Tear-off versus retrofit",
        text: "Going over an existing metal roof, where the structure allows it, changes labor, disposal, and downtime substantially.",
      },
      {
        title: "Insulation scope",
        text: "A reroof is the economical moment to upgrade insulation — and the scope you choose moves the number.",
      },
      {
        title: "Wind-zone attachment requirements",
        text: "Corner and perimeter zones can require denser attachment than the field, and the engineering drives fastener and clip counts.",
      },
      {
        title: "Penetrations, curbs, and skylights",
        text: "Each rooftop unit and skylight is a flashing detail with real labor behind it.",
      },
      {
        title: "Panel length and site logistics",
        text: "Transportable lengths, crane or lift needs, and staging room all show up in the installed price.",
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
        "For structural systems and wind-critical attachments, the specification comes from tested assemblies and load tables rather than rules of thumb — that's a feature, not red tape. Our proposal identifies where engineered documentation applies to your project.",
    },
    {
      question: "Are roof panels and wall panels the same product?",
      answer:
        "Sometimes the same profile serves both, but the jobs differ: roof applications carry water, slope, and uplift requirements that wall use doesn't. R-panel in particular is sold for both — which is exactly why the spec has to name the application, not just the profile.",
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
        "Standing seam earns its reputation on two design moves. First, the fasteners come off the roof surface: panels hang on concealed clips, so there are no gasketed screw heads weathering in the sun across the field. Second, the panel edges rise into seams that lock together well above the drainage plane, so the joints between panels sit out of the water rather than in it.",
        "For the owner of a church, school, office, or civic building, that translates to a roof with a short maintenance list and a long service outlook — flashings, penetrations, and sealants still warrant periodic inspection, but the acres of field screws that define exposed-fastener systems simply aren't there. It's also the metal family architects specify when the roof is part of the building's face: crisp vertical pans and premium PVDF finishes read intentional rather than industrial.",
      ],
    },
    sections: [
      {
        title: "Commercial standing seam specifications",
        paragraphs: [
          "Standing seam is a category, not a single product, and commercial projects draw from two branches of it. The table lays out representative values for both; every figure ultimately comes from the selected manufacturer's tested assembly, and the differences between the columns are the subject of the next section.",
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
              "24 ga common; some architectural systems 26 ga",
              "24 ga common; 22 ga for higher-load applications",
            ],
            [
              "Seam height",
              "Commonly ~1.5–2 inches",
              "May use ~3-inch trapezoidal seams",
            ],
            [
              "Pan / coverage width",
              "Commonly 12–18 in (16 in common); 18–24 in panels install faster but show more oil canning",
              "18- or 24-inch coverage typical",
            ],
            [
              "Attachment",
              "Concealed clips or fastening flange; clip spacing over solid deck commonly ~12–24 in o.c. per the tested assembly",
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
          note: "Representative values only. Gauge, clip schedule, and slope approvals are set by the manufacturer's tested assembly and the project's engineering — never assume one system's numbers apply to another.",
        },
      },
      {
        title: "Architectural or structural: which one is your building?",
        paragraphs: [
          "Architectural standing seam is a finish system: it installs over a continuous deck that carries the loads, and the panel's job is weather and appearance. That's the version that belongs on churches, schools, banks, medical offices, and any building where the roof shows from the street — and it requires a deck, full stop.",
          "Structural standing seam is a different machine wearing the same name. Its panels are engineered to span open purlins without any deck beneath, commonly at the 4-to-5-foot purlin spacing found in pre-engineered metal buildings, with span capability set by gauge, profile, and the tested assembly's load tables. If your building is a PEMB with a shallow roof, the structural branch — covered in depth on our structural metal page — is likely your lane, and the two shouldn't be cross-shopped as if interchangeable.",
        ],
      },
      {
        title: "Clips, thermal movement, and wind-zone attachment",
        paragraphs: [
          "A hundred-foot steel panel changes length noticeably between a January morning and an August afternoon. Standing seam absorbs that by attaching at the seams through concealed clips rather than pinning the panel through its field — many clip designs let the panel slide over the clip as it grows and shrinks, so decades of expansion cycles don't fatigue the attachment.",
          "How many clips, and where, is engineering rather than habit. Over solid deck, clip spacing commonly falls around 12–24 inches on center per the tested assembly; structural systems clip at every purlin. Building corners and perimeter edges see higher wind uplift than the field and can require denser attachment, and clip hardware itself varies — some clips take one fastener, some two. There is no universal clip schedule, which is precisely why our proposals cite the tested assembly they're built on.",
        ],
      },
      {
        title: "Snap-lock vs. mechanically seamed at commercial slopes",
        paragraphs: [
          "The seam is where the two installation methods split. Snap-lock panels engage by hand — one leg snaps over the adjacent panel's — which installs efficiently and serves well at slopes commonly around 3:12 and steeper. Mechanically seamed panels are closed by a motorized seamer that folds the panel edges together, frequently over factory-applied sealant, producing a seam that may be approved down to roughly 1/2:12–1:12 depending on the profile.",
          "Commercial roofs are frequently shallower than they look from the ground, which makes this distinction load-bearing: a snap-lock profile on a 1:12 roof is a specification error, not a style choice. We measure slope during assessment and match the seaming method to the shallowest plane on the roof — and where a roof drops toward flat, the 3-inch structural trapezoidal systems rated near 1/4:12 enter the conversation.",
        ],
      },
      {
        title: "Panel width, oil canning, and finish choices",
        paragraphs: [
          "Wider pans cover more roof per panel and install faster, which is why 18-to-24-inch architectural panels tempt every budget. The trade-off is optical: oil canning — the visible waviness light reveals in flat steel — shows more readily in wide pans, thinner gauges, dark colors, and over any substrate irregularity. It's cosmetic rather than structural, but on a prominent roof plane it's worth designing against.",
          "The countermeasures are straightforward: 16-inch pans over wider ones where appearance is critical, heavier gauge, striations or pencil ribs pressed into the pan, and disciplined deck prep. On finish, PVDF coatings are the commercial default for color retention on a building that will wear this roof for decades — a point worth weighing when the panel color carries the architecture.",
        ],
      },
      {
        title: "Standing seam against R-panel, for a commercial owner",
        paragraphs: [
          "The honest comparison: R-panel wins the initial budget, installs quickly, and suits utilitarian buildings — but it puts thousands of gasketed screws in the weather, and those fasteners become the roof's recurring maintenance item. Standing seam costs more up front, removes the field fasteners entirely, offers stronger low-slope options, and looks like architecture rather than agriculture.",
          "The building usually makes the call. Public-facing, conditioned, long-hold properties — sanctuaries, classrooms, clinics, offices — tend to justify standing seam's premium. Shops and storage buildings often shouldn't pay it. Because we install both, our proposal can price the same roof both ways and let the numbers argue.",
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
      description:
        "Standing seam is fabricated to the building, so pricing follows the specification — these are the levers that move it.",
      items: [
        {
          title: "Seaming method",
          text: "Mechanically seamed systems add seaming labor and equipment over snap-lock, in exchange for lower slope approvals.",
        },
        {
          title: "Gauge and finish system",
          text: "22 and 24 gauge carry premiums over 26, and PVDF finishes over SMP — decisions that scale across every square of roof.",
        },
        {
          title: "Deck condition or purlin structure",
          text: "Architectural systems need sound decking verified and repaired; structural systems need purlins evaluated for the new attachment.",
        },
        {
          title: "Wind-zone attachment density",
          text: "Corner and perimeter zones can require more clips and fasteners than the field, per the engineered spec for your exposure.",
        },
        {
          title: "Slope and drainage details",
          text: "Shallow planes push the spec toward mechanically seamed profiles and sealed details, which price differently.",
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
          "It depends entirely on the profile: snap-lock systems commonly need around 3:12, mechanically seamed profiles may be approved near 1/2:12–1:12, and certain 3-inch structural trapezoidal systems carry approvals as low as roughly 1/4:12. We measure your actual slopes and spec against the shallowest plane.",
      },
      {
        question: "Why choose standing seam over R-panel for our building?",
        answer:
          "No exposed field fasteners to maintain, stronger low-slope capability, and an architectural appearance. R-panel wins on initial cost; standing seam tends to win on lifetime upkeep and looks. Building type and hold period usually make the call, and we'll price both.",
      },
      {
        question: "How does standing seam perform in hurricane winds?",
        answer:
          "Well — interlocked seams and clip attachment give the system strong uplift performance, with corner and perimeter zones attached more densely where the engineering requires it. Specific ratings come from the tested assembly specified for your project, not from the category name.",
      },
      {
        question: "What gauge should a commercial standing seam roof be?",
        answer:
          "24 gauge is the common commercial standard, with some architectural systems in 26 gauge and 22 gauge appearing in higher-load applications — remembering that lower gauge numbers mean thicker steel. The right answer comes from the span, wind exposure, and the manufacturer's tested options for the profile.",
      },
      {
        question: "Can standing seam go over our existing R-panel roof?",
        answer:
          "Retrofit systems exist for exactly that, using sub-framing over the old panels where the structure checks out — often with the chance to add insulation in the cavity. Purlin condition and load capacity decide feasibility, which is what our structural assessment establishes.",
      },
      {
        question: "Will a wider panel save us money?",
        answer:
          "Somewhat — fewer panels and seams install faster. The trade is appearance: 18-to-24-inch pans show oil canning more readily than 16-inch, especially in dark colors on visible slopes. On a prominent roof we usually steer toward narrower pans or striated profiles and show you why.",
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
        "Walk any industrial park in South Mississippi and R-panel is what you're looking at: a ribbed steel sheet, roughly three feet of coverage per panel, screwed down with gasketed fasteners in whatever finish the job calls for. It's the least expensive way to put real steel on a commercial roof or wall, and on shops, storage buildings, and ag structures the profile looks exactly like it belongs.",
        "What you're accepting in exchange for that economy is a roof whose fasteners live in the weather. Driven correctly at installation and checked periodically as the gaskets age, an R-panel roof serves for decades; ignored, the screw lines are where it ages first. We install this system constantly and service plenty we didn't install — so the guidance below comes from both ends of that story.",
      ],
    },
    sections: [
      {
        title: '"R-panel" is a shape, not a standard',
        paragraphs: [
          "Here's the thing the panel brochures gloss over: manufacturers do not use the terms R-panel and PBR identically. The familiar ribbed profile is sold under both names with real differences in the lap geometry, and some manufacturers prefer — or outright require — the PBR version with its purlin-bearing leg for open-framed roofing, reserving plain R-panel for walls and decked applications.",
          'The practical consequence: replacement and extension work has to match panels by manufacturer, rib spacing, coverage width, and lap design, not by name. Two "R-panels" from different mills may refuse to lap together cleanly. When we quote work on an existing building, we identify the actual profile in hand before ordering a single sheet, because a near-miss profile is a leak seam the length of the roof.',
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
          "These values describe the common commercial R-panel family. They are representative, not promises — the manufacturer's panel manual and approval documents govern every figure for a specific product.",
        ],
        table: {
          title: "R-panel at a glance",
          columns: ["Specification", "Representative value"],
          rows: [
            ["Coverage width", "36 inches per panel"],
            ["Rib profile", "~1.25-inch ribs at ~12 inches on center"],
            [
              "Common gauges",
              "26 ga is the common commercial spec; 24 and 22 ga options vary by manufacturer; 29 ga exists for light duty but is not the default structural commercial choice",
            ],
            [
              "Minimum slope",
              "A representative system may permit 1:12 with lap sealant and ~3:12 without; some PBR assemblies approach 1/2:12 — there is no one universal minimum",
            ],
            [
              "Fastening",
              "Exposed gasketed screws through the panel to deck or framing; side-lap stitch screws commonly ~12–20 in o.c. per manufacturer, denser at perimeters and corners",
            ],
            [
              "Span capability",
              "No unsupported span over decking; structural R-panel/PBR versions span open framing, with ~4–5 ft common in suitable 24/26-ga tested assemblies",
            ],
          ],
          note: "Representative figures — never assume every profile spans 5 feet or accepts 1:12 slope. The selected manufacturer's load tables and approvals control.",
        },
      },
      {
        title: "Roof panel, wall panel — same profile, different job",
        paragraphs: [
          "Standard R-panel is sold for both roofing and siding, and it's one of the profile's genuine advantages: a metal building can wear matching skin on every face, and repairs draw from one material family. But the two applications are not interchangeable specs. A roof panel manages flowing water, slope minimums, lap sealant requirements, and wind uplift; a wall panel mostly manages wind and looks.",
          "That's why lap orientation, fastener patterns, and sealant requirements differ between roof and wall installations of the identical sheet. If you're pricing a project that includes both — reskinning walls while reroofing, say — expect the proposal to treat them as two scopes with two detail sets, because that's what correct installation requires.",
        ],
      },
      {
        title: "Owning an exposed-fastener commercial roof",
        paragraphs: [
          "Every screw on an R-panel roof compresses a gasketed washer against the steel, and that washer is a wear part living in ultraviolet light. Panels also expand and contract with temperature, working the fasteners slightly through every seasonal cycle. Neither fact is a defect — it's how the system is designed — but both mean the fastener lines deserve scheduled inspection over the roof's life.",
          "There's no honest universal interval for that service: exposure, panel movement, washer material, and the quality of the original installation all move the timeline. What we recommend for facility owners is simple — put the roof on an inspection rhythm alongside your other building systems, and address backed-out or weathered fasteners as findings, not emergencies. Caught early, fastener service is inexpensive; deferred until stains appear on the deck below, it rarely stays that way.",
        ],
      },
      {
        title: "R-panel or its siblings: two comparisons that matter",
        paragraphs: [
          "Against PBR: the profiles look nearly identical from the ground, but PBR adds a bearing leg beneath the overlapping edge that supports the side lap where panels cross a purlin. Over open framing, that leg is why many manufacturers steer roofing toward PBR; over solid decking, standard R-panel serves. The full comparison lives on our PBR page.",
          "Against standing seam: R-panel is the budget answer and a good one — but its thousands of exposed screws are exactly what standing seam eliminates. If your building is public-facing, conditioned, or a long-term hold, the concealed-fastener premium can be worth pricing before you default to the workhorse. We'll run both numbers on request; the gap is usually smaller than owners guess and larger than salesmen admit.",
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
      description:
        "The workhorse panel keeps budgets sane, but the installed price still turns on real variables.",
      items: [
        {
          title: "Gauge selection",
          text: "26 gauge is the common commercial baseline; 24 or 22 gauge upgrades add material cost that heavy-use buildings often justify.",
        },
        {
          title: "Roof, walls, or both",
          text: "Combining reroofing with wall reskinning changes scope, staging, and unit economics — usually favorably.",
        },
        {
          title: "Deck or open framing",
          text: "Decked installations and purlin installations carry different panel specs, fastener schedules, and prep work.",
        },
        {
          title: "Slope and sealant requirements",
          text: "Shallow roofs need sealed laps and sometimes different profiles — added material and careful labor.",
        },
        {
          title: "Existing roof condition",
          text: "Tear-off, going over the top where appropriate, and any purlin or deck remediation are priced from inspection findings.",
        },
        {
          title: "Stitch screws and wind detailing",
          text: "Perimeter and corner zones can require denser fastening than the field, and the counts add up on big roofs.",
        },
        {
          title: "Trim, closures, and penetrations",
          text: "Ridge and eave closures, gable trim, and every pipe or curb each carry labor beyond the panel field.",
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
          "PBR carries a purlin-bearing leg — a return beneath the overlapping edge that supports the side lap where panels cross open framing. Manufacturers don't use the two names identically, so matching existing panels means matching the actual profile, not the label. Over purlins, many manufacturers steer roofing to PBR; over decking, standard R-panel serves.",
      },
      {
        question: "How long does an R-panel roof last?",
        answer:
          "Commonly decades, with the fastener schedule as the main variable — periodic inspection and gasket service as findings warrant keep the system tight through its service life. Gauge, finish, and exposure set the rest of the range, which is why we give planning figures per project rather than one number.",
      },
      {
        question: "Can R-panel go over an existing roof?",
        answer:
          "Frequently — over existing metal, or over other roofing with proper sub-framing, it's a common and economical retrofit. Feasibility rides on the structure underneath, which our assessment confirms case by case before we propose it.",
      },
      {
        question: "Is 29-gauge R-panel okay for a commercial building?",
        answer:
          "29 gauge exists in this family for light-duty use, but it is not the default structural commercial spec — 26 gauge is the common baseline, with 24 and 22 available from some manufacturers for heavier service. We'll tell you plainly when a lighter panel is a false economy for your building.",
      },
      {
        question: "What slope does an R-panel roof require?",
        answer:
          "It varies by system: a representative panel may be permitted at 1:12 with lap sealant and around 3:12 without, while some PBR assemblies carry approvals nearer 1/2:12. There is no universal R-panel minimum, so we verify the selected manufacturer's approval against your measured slope.",
      },
      {
        question: "What are stitch screws, and why do they matter?",
        answer:
          "Stitch screws fasten the side lap where one panel overlaps the next — commonly spaced around 12–20 inches on center per the manufacturer, and denser at perimeter and corner zones where wind uplift concentrates. Missing or loose stitch screws are one of the most common findings on underperforming R-panel roofs.",
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
        "If your building came from a pre-engineered metal building manufacturer, there's a strong chance PBR panel — purlin-bearing rib — is what's over your head right now. It's the profile PEMB packages have shipped with for decades, which makes it the panel we're most often asked to repair, match, extend, and replace across the region's warehouses, shops, and ag structures.",
        "PBR's whole identity lives in one small piece of geometry at the panel edge, and understanding it explains when this panel is the right spec and when its plainer R-panel sibling will do. This page covers that geometry, the representative numbers, and what replacing the roof on an existing metal building actually involves.",
      ],
    },
    sections: [
      {
        title: "What the bearing leg actually does",
        paragraphs: [
          "At the overlapping edge of a PBR panel, the profile turns down and back into a short return — the purlin-bearing leg. When two panels lap and cross a purlin, that leg sits beneath the overlapping edge and gives the side lap solid bearing on the support instead of leaving the joint suspended between the ribs. The lap gets backing exactly where the fasteners clamp it.",
          "That's a meaningful advantage over open framing, where there's no deck to back anything up — but it's worth stating what the leg doesn't do. It doesn't make the panel immune to oil canning, the cosmetic waviness inherent to flat areas of light-gauge steel, and it doesn't by itself guarantee structural performance: gauge, purlin spacing, fastener pattern, and the tested assembly still have to line up. The leg improves the lap; the engineering carries the roof.",
        ],
      },
      {
        title: "Representative PBR specifications",
        paragraphs: [
          "The numbers below describe the common PBR family as manufacturers typically publish it. As with every panel we install, the selected manufacturer's load tables and approval documents govern — the table is orientation, not a substitute.",
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
              "Representative systems near 1/2:12 with approved sealant in side and end laps — the exact minimum comes from the selected manufacturer",
            ],
            [
              "Fastening",
              "Through-fastened into purlins or joists at every support line; tested assemblies vary — one may use 3 or 6 panel-to-purlin fasteners across a 36-inch panel per line",
            ],
            [
              "Side laps",
              "Stitch screws in some tested assemblies around 20 in o.c., with tape sealant where the assembly requires it",
            ],
          ],
          note: "Representative values — fastener counts, sealant requirements, and slope minimums are assembly-specific and change with wind uplift requirements.",
        },
      },
      {
        title: "Fastener patterns and sealant: assembly-specific by design",
        paragraphs: [
          "PBR is a through-fastened system: screws pass through the panel into the purlin at every support line, and the pattern is not a matter of installer preference. A tested assembly might call for three fasteners across a 36-inch panel at each purlin in one configuration and six in another; buildings or roof zones facing higher wind uplift get denser patterns. Treating one pattern as universal is how metal-building roofs end up underperforming their own panels.",
          "Sealant follows the same logic. Tape sealant belongs in the laps the tested assembly requires it in — end laps and low-slope side laps most commonly — and skipping it, or smearing tube caulk where engineered tape belongs, trades a designed seal for a temporary one. When we quote a PBR roof, the fastener and sealant schedule in the proposal traces to a specific assembly, which is exactly the paper trail you want if a storm claim ever gets scrutinized.",
        ],
      },
      {
        title: "Purlin spacing and what a panel can honestly span",
        paragraphs: [
          "Five-foot purlin spacing appears in many common tested assemblies with 24- and 26-gauge PBR, which is why the number gets quoted like a law of nature. It isn't one. Span capability is a function of gauge, wind and live loads, the support condition at the panel's ends versus its middle, panel length, and the manufacturer's load tables — no responsible installer promises that every 26-gauge panel spans five feet regardless of circumstances.",
          "On existing buildings, the purlins themselves are half the span question: spacing that was fine for the original assembly may pair badly with a different replacement panel, and corroded or deflected purlins shift the math further. Our assessment records actual purlin spacing and condition before we propose panels, so the span claim in your proposal is your building's, not a brochure's.",
        ],
      },
      {
        title: "Replacing the roof on an existing metal building",
        paragraphs: [
          "Metal-building reroofs come to us on three roads. Fastener and lap service — new oversized screws, fresh washers, resealed laps — extends a fundamentally sound roof. Panel-for-panel replacement swaps tired PBR for new while keeping the structure, and succeeds or fails on matching the existing profile and respecting current purlin condition. Retrofit systems build over the old roof entirely, often adding insulation in the new cavity, where the frame's capacity allows the added load.",
          "Which road fits is an inspection question, not a sales question. Rust at fastener lines, the state of the laps, purlin condition, and how the building is used all weigh in — and insulation is worth deciding deliberately, because a reroof is the most economical moment a metal building will ever have to improve its thermal envelope.",
        ],
      },
      {
        title: "PBR vs. R-panel: when the leg matters",
        paragraphs: [
          "The two profiles are close cousins with one working difference: PBR's bearing leg under the side lap. Over open purlins — the metal-building case — that leg is why some manufacturers prefer or require PBR for roofing, and why matching an existing PEMB roof almost always means PBR or its manufacturer-specific kin. Over a solid deck, the leg has nothing extra to do, and standard R-panel does the job at the same class of cost.",
          "Because the names get used loosely across the industry, don't buy by label — buy by profile. We identify the actual panel on your building before quoting matches or extensions, and when a project could go either way, we'll lay out the lap geometry difference in person with panel samples rather than asking you to take terminology on faith.",
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
      description:
        "A PBR proposal is built from the building's actual structure and exposure — these are the inputs that set the number.",
      items: [
        {
          title: "Service, replacement, or retrofit",
          text: "Fastener and lap service, panel-for-panel replacement, and over-the-top retrofit are three different projects with three different budgets.",
        },
        {
          title: "Gauge and finish",
          text: "26 gauge is the common baseline; 24 or 22 gauge and upgraded paint systems add cost that harsh exposure can justify.",
        },
        {
          title: "Purlin condition",
          text: "Rust at fastener lines, deflection, or prior modifications can add remediation scope the inspection prices honestly up front.",
        },
        {
          title: "Fastener and sealant schedule",
          text: "Higher wind-uplift requirements mean denser fastener patterns and more engineered tape sealant across the same roof area.",
        },
        {
          title: "Panel lengths and transport",
          text: "Long single-run panels reduce end laps but raise transport and handling demands — a real trade on big buildings.",
        },
        {
          title: "Insulation scope",
          text: "Adding or upgrading insulation during the reroof is economical but is its own budget line, sized to your building's use.",
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
          "Over open purlins — the metal-building case — PBR's bearing leg supports the side lap, and some manufacturers require that version for open-framed roofing. Over solid decking, standard R-panel serves. If you're matching an existing building, we identify the exact profile in hand and match it.",
      },
      {
        question:
          "Our metal building roof leaks at the screws. Is that fixable?",
        answer:
          "Yes, and it's the most common metal-building service call: aged gaskets and backed-out fasteners. Re-fastening with oversized screws and new gasketed washers is routine — and if the panels themselves are tired, panel replacement or an over-the-top retrofit are the next options up.",
      },
      {
        question: "Can you insulate while reroofing a metal building?",
        answer:
          "A reroof is the ideal moment — new insulation goes in the cavity or over the old roof under the new panels, depending on the retrofit approach. Many older PEMBs were built with minimal insulation, so the comfort and energy difference is often dramatic.",
      },
      {
        question: "How long can PBR panels be?",
        answer:
          "Manufactured lengths commonly run from about 5 feet up to around 50 feet, depending on the manufacturer and what transport can deliver. Longer panels mean fewer end laps to seal, which is a genuine durability advantage when logistics allow it.",
      },
      {
        question: "What slope does a PBR roof need?",
        answer:
          "Representative PBR systems carry approvals near 1/2:12 with the required sealant in side and end laps — one reason the profile suits the shallow roofs common on PEMBs. The exact minimum belongs to the selected manufacturer's approval documents, which we verify against your measured slope.",
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
        "Structural metal isn't a single product. It's an engineered category spanning three families: structural standing seam with mechanically closed seams, heavy-rib exposed-fastener panels, and engineered systems designed over purlins and bar joists. If your building is a PEMB, warehouse, hangar, or any no-deck industrial structure, this category is its native roofing language — and the differences inside the category are where the real decisions live.",
      ],
    },
    sections: [
      {
        title: "What makes a panel 'structural' in the first place",
        paragraphs: [
          "The word gets used loosely, so here's the working definition: a structural panel is one whose tested assembly qualifies it to span open supports and carry the roof's design loads without a continuous deck underneath. Rib geometry provides the stiffness, gauge provides the material strength, and the attachment transfers loads into the frame — all three verified together in the assembly's testing, not assumed separately.",
          "That's also what an architectural panel is not. An architectural standing seam pan over a plywood deck is an excellent roof, but the deck is doing the structural work; put that same panel over open five-foot purlin bays and you've built a failure. The category boundary isn't marketing — it's whether the panel's own documents authorize the span.",
        ],
      },
      {
        title: "Two structural families, compared",
        paragraphs: [
          "Within the category, the practical choice usually comes down to structural standing seam versus heavy-gauge exposed-fastener panels. The first buys concealed attachment and very low slope capability; the second buys simplicity and economy. The comparison below uses representative systems from each family.",
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
              "24 ga common; 22 ga for higher loads or wider support spacing",
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
              "No field screws; flashings, clips at movement points, and terminations get the attention",
              "Exposed gasketed fasteners require periodic inspection over the service life",
            ],
            [
              "Where it wins",
              "Very shallow roofs, long panel runs, owners minimizing exposed fasteners",
              "Budget-led projects, straightforward buildings, profile-matching existing roofs",
            ],
          ],
          note: "Representative systems — profiles, gauges, and slope approvals vary by manufacturer and are confirmed per tested assembly.",
        },
      },
      {
        title: "Representative structural system parameters",
        paragraphs: [
          "Some orientation numbers for the category as a whole. Every one of them is representative — on a structural system more than any other, the load tables for the specific product and the project's engineering are the only figures that count.",
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
              "~4–5 ft common in pre-engineered buildings; wider spacing only where load tables and project engineering support it",
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
              "At every support line — concealed clips or engineered through-fastening, with denser patterns in corner and perimeter wind zones",
            ],
          ],
          note: "Orientation values only. Span, gauge, and attachment for your building come from the selected system's load tables and the project engineering.",
        },
      },
      {
        title: "Span, purlin spacing, and the load-table discipline",
        paragraphs: [
          "The span question sounds simple — how far can the panel go between purlins? — and never has a simple answer. Capability moves with gauge, profile depth, wind and live loads, whether a given bay is at the panel's end or middle, and the specific tested assembly. The 4-to-5-foot purlin spacing common in PEMBs exists because it suits common panel assemblies; going wider is possible only where the load tables and project engineering say so, not because a heavier panel 'probably' handles it.",
          "This discipline pays off hardest at reroof time. An existing building's purlin spacing is a fixed fact the new system must be qualified for, and substituting a panel that isn't rated for those spans — even one that looks beefier — quietly rebuilds the roof outside its engineering. We match systems to measured spans and documented load tables, and we put the reference in the proposal.",
        ],
      },
      {
        title: "The load path: panel to purlin to frame",
        paragraphs: [
          "A structural roof works as a chain: wind uplift and live loads enter the panel, pass through clips or fasteners into the purlins, and travel down the purlins into the building's main frames. Every link is sized against the others — gauge, profile, seam type, clip or fastener choice, attachment pattern, and purlin spacing operate as one tested assembly, and swapping any single element without requalifying the chain breaks it.",
          "Wind doesn't load that chain evenly, either. Corner and edge zones of a roof see substantially higher uplift than the field, which is why attachment density commonly increases there and why a spec that treats the whole roof as 'the field' is underbuilt at exactly the points storms attack first. When we detail a structural roof, zone-by-zone attachment is in the drawings — it's the least visible part of the system and the most consequential.",
        ],
      },
      {
        title: "Retrofit over the top vs. panel-for-panel replacement",
        paragraphs: [
          "An aging structural roof has two main futures. Panel-for-panel replacement removes the old panels and installs new ones qualified for the same purlin spacing — the cleaner path when the structure is sound and the building can tolerate open-roof phases, and the moment to fix chronic detail problems for good. Profile and span matching are the whole game here.",
          "Retrofit systems instead build a new roof above the existing one on engineered sub-framing, keeping the building dried-in throughout and creating a cavity that takes new insulation economically. The frame must be verified for the added load, which is an engineering exercise, not an assumption. Occupancy, schedule, insulation goals, and structural findings decide between the two paths — we present both with real numbers when a building qualifies for both.",
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
      description:
        "Structural systems are engineered per building, and the budget follows the engineering — these are the inputs that move it.",
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
          text: "Purlin spacing and design wind and live loads set which assemblies qualify — and qualifying assemblies set the material budget.",
        },
        {
          title: "Wind-zone attachment engineering",
          text: "Corner and perimeter uplift zones demand denser clips or fasteners than the field, multiplying hardware and labor on exposed sites.",
        },
        {
          title: "Replacement path",
          text: "Panel-for-panel swap and over-the-top retrofit carry very different structures of cost, downtime, and insulation opportunity.",
        },
        {
          title: "Purlin and frame condition",
          text: "Remediating corrosion or deflection before panels go on is priced from inspection findings, never buried in an allowance.",
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
          "Pre-engineered metal buildings, warehouses, manufacturing and agricultural structures, hangars, and equipment storage — anywhere the design spans open framing without a deck. If your building's roof panels attach directly to purlins, you're in structural territory.",
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
          "By design rather than by hope: uplift resistance comes from tested assemblies and attachment schedules engineered to your wind zone, with corner and edge areas attached more densely than the field. That documentation trail is exactly what you want between a Gulf storm and your inventory.",
      },
      {
        question:
          "Structural standing seam or exposed-fastener — which should we pick?",
        answer:
          "Standing seam earns its premium on very shallow roofs — some mechanically seamed trapezoidal systems are approved near 1/4:12 — and by removing field fasteners from the maintenance picture. Heavy-gauge exposed-fastener systems win on budget and simplicity at slopes commonly around 1:12 and up. Slope, hold period, and budget usually decide.",
      },
      {
        question: "Can purlin spacing be widened when we reroof?",
        answer:
          "Only where the new system's load tables and project engineering support the wider span — panel capability depends on gauge, profile, loads, and support conditions working together. Most reroofs keep the existing spacing and qualify the new panel to it, which is the economical and safe default.",
      },
      {
        question: "What gauge does a structural roof need?",
        answer:
          "24 gauge is common across the category, with 22 gauge appearing where loads are higher or supports are wider, and some exposed-fastener systems offered in 26 — keeping in mind that lower gauge numbers mean thicker steel. The honest answer is whatever the qualifying assembly for your spans and wind zone specifies.",
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
