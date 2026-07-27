/**
 * Data for the interactive Exploded Roof System diagram (tool #4). Ordered top
 * of the roof downward, like a cross-section. Plain homeowner language: what it
 * is, why it matters, and what goes wrong when it's skipped or done badly.
 *
 * Each `photo` carries its own SEO alt + visible caption. Where we have a real
 * Southeast Roofing install shot we use it (field shingles, underlayment,
 * gutters); the rest use clear, labelled component photos so homeowners can see
 * exactly what each part is. EDIT HERE to adjust copy, photos, or components.
 */

export interface RoofPartPhoto {
  src: string;
  /** SEO/accessibility alt text — describe the component honestly. */
  alt: string;
  /** Short visible caption (also used as the image title attribute). */
  caption: string;
}

export interface RoofPart {
  key: string;
  name: string;
  /** One-line summary shown on the layer itself. */
  short: string;
  what: string;
  why: string;
  bad: string;
  photo?: RoofPartPhoto;
  /**
   * Where this component's numbered pin sits on the illustration, in the
   * SVG's own 960x600 viewBox coordinates. Produced by
   * docs/roof-house-geometry.py alongside the artwork — regenerate both
   * together or the pins drift off the parts they label.
   */
  hotspot: { x: number; y: number };
}

export const ROOF_PARTS: RoofPart[] = [
  {
    key: "ridge-cap",
    hotspot: { x: 634, y: 80 },
    name: "Ridge Cap",
    short: "Caps the peak",
    what: "Thicker, pre-bent shingles that cover the very peak where two roof slopes meet.",
    why: "It seals the most exposed line on your roof and finishes it off cleanly.",
    bad: "Cutting up regular 3-tab shingles as 'ridge cap' (a common shortcut) cracks and leaks years early.",
    photo: {
      src: "/images/anatomy/roof-ridge-cap-shingles.webp",
      alt: "Pre-formed ridge cap shingles capping the peak of a shingle roof.",
      caption: "Ridge cap shingles seal and finish the roof's peak.",
    },
  },
  {
    key: "ridge-vent",
    hotspot: { x: 345, y: 155 },
    name: "Ridge Vent",
    short: "Lets hot air escape",
    what: "A vent that runs along the peak so hot, humid attic air can escape.",
    why: "Proper venting keeps your attic cooler, lowers cooling bills, and helps shingles last their full life.",
    bad: "A sealed-up or under-vented roof bakes the shingles from below and grows moisture and mold in the attic.",
    photo: {
      src: "/images/services/ridge-vent.webp",
      alt: "Ridge vent installed along a roof peak to exhaust hot attic air.",
      caption: "A ridge vent lets hot attic air escape at the peak.",
    },
  },
  {
    key: "field-shingles",
    hotspot: { x: 595, y: 149 },
    name: "Shingles",
    short: "The surface you see",
    what: "The main field of shingles — the visible, weather-facing layer of the roof.",
    why: "This is your roof's first defense against rain, wind, hail, and sun.",
    bad: "Hand-nailing high or into the wrong zone lets wind peel shingles off in the first big storm.",
    photo: {
      src: "/images/projects/gaf-timberline-hdz-pewter-gray-hattiesburg-ms-001.webp",
      alt: "GAF Timberline HDZ shingles in Pewter Gray on a Southeast Roofing roof in Hattiesburg, Mississippi.",
      caption: "The field of shingles — a real Southeast Roofing roof in Hattiesburg, MS.",
    },
  },
  {
    key: "starter-shingles",
    hotspot: { x: 252, y: 325 },
    name: "Starter Shingles",
    short: "Seals the edges",
    what: "A special first course along the eaves and rakes with a factory sealant strip.",
    why: "It bonds the first row down so wind can't get under your shingles at the edges.",
    bad: "Skipping real starter (or flipping regular shingles backward) is a top cause of edge blow-offs.",
    photo: {
      src: "/images/anatomy/roof-starter-strip-shingles.webp",
      alt: "Starter strip shingles with a factory sealant bead along a roof eave.",
      caption: "Starter shingles bond the first course against wind uplift.",
    },
  },
  {
    key: "ice-water-shield",
    hotspot: { x: 299, y: 340 },
    name: "Ice & Water Shield",
    short: "Leak barrier at weak points",
    what: "A peel-and-stick waterproof membrane at eaves, valleys, and around penetrations.",
    why: "It self-seals around nails and stops wind-driven rain in the spots most likely to leak.",
    bad: "Leaving it out of valleys and around pipes invites slow, hidden leaks that rot the deck.",
    photo: {
      src: "/images/anatomy/roof-ice-and-water-shield.webp",
      alt: "Peel-and-stick ice and water shield membrane applied to a roof deck.",
      caption: "Ice & water shield — a self-sealing waterproof leak barrier.",
    },
  },
  {
    key: "underlayment",
    hotspot: { x: 345, y: 355 },
    name: "Synthetic Underlayment",
    short: "Second layer of defense",
    what: "A tough synthetic sheet rolled over the whole deck, under the shingles.",
    why: "It's a backup water barrier and protects the deck during and after install.",
    bad: "Old felt paper tears and wrinkles; a torn or wrinkled underlayment telegraphs through and traps water.",
    photo: {
      src: "/images/projects/roof-synthetic-felt-gulfport-ms.webp",
      alt: "Synthetic underlayment rolled over a roof deck on a Southeast Roofing job in Gulfport, Mississippi.",
      caption: "Synthetic underlayment going down — a Southeast Roofing job in Gulfport, MS.",
    },
  },
  {
    key: "decking",
    hotspot: { x: 391, y: 371 },
    name: "Roof Decking",
    short: "The wood foundation",
    what: "The plywood or OSB sheathing nailed to your rafters — the surface everything else attaches to.",
    why: "Solid decking holds nails tight and gives the roof its strength and flat surface.",
    bad: "Roofing over soft, rotted, or delaminated decking means nails don't hold — and it will fail early.",
    photo: {
      src: "/images/anatomy/roof-decking-sheathing.webp",
      alt: "OSB roof decking sheathing panels installed over the rafters.",
      caption: "Roof decking — the wood foundation everything else attaches to.",
    },
  },
  {
    key: "drip-edge",
    hotspot: { x: 497, y: 343 },
    name: "Drip Edge",
    short: "Protects the roof edges",
    what: "A metal edging along the eaves and rakes that directs water off the roof and into the gutters.",
    why: "It keeps water from wicking back under the roof and rotting the fascia and deck edges.",
    bad: "No drip edge (or the wrong overlap) lets water curl behind the gutter and rot the wood.",
    photo: {
      src: "/images/anatomy/roof-drip-edge-flashing.webp",
      alt: "Metal drip edge flashing installed along a roof eave above the gutter.",
      caption: "Drip edge directs water off the roof edge into the gutter.",
    },
  },
  {
    key: "flashing",
    hotspot: { x: 433, y: 132 },
    name: "Flashing",
    short: "Seals against walls & chimneys",
    what: "Metal pieces that seal where the roof meets walls, chimneys, and dormers.",
    why: "These transitions are the #1 leak areas — flashing bridges them watertight.",
    bad: "Caulk smeared over old flashing instead of replacing it fails fast and leaks behind the wall.",
    photo: {
      src: "/images/anatomy/roof-chimney-flashing.webp",
      alt: "Metal step and counter flashing sealing the transition where a roof meets a chimney.",
      caption: "Chimney flashing seals the roof where it meets masonry.",
    },
  },
  {
    key: "valleys",
    hotspot: { x: 592, y: 243 },
    name: "Valleys",
    short: "Where two slopes meet",
    what: "The channels where two roof planes join and funnel a lot of water.",
    why: "Done right (with membrane and proper technique) valleys move heavy water without leaking.",
    bad: "A weak or improperly woven valley is a fast path to leaks because so much water runs through it.",
    photo: {
      src: "/images/anatomy/roof-closed-valley.webp",
      alt: "A closed roof valley where two shingle slopes meet and channel rainwater.",
      caption: "A closed valley funnels heavy water off the roof without leaking.",
    },
  },
  {
    key: "pipe-boots",
    hotspot: { x: 399, y: 255 },
    name: "Pipe Boots",
    short: "Seals roof penetrations",
    what: "Rubber-and-metal collars that seal around plumbing vent pipes.",
    why: "They keep water out where pipes pass through the roof.",
    bad: "Cheap rubber boots dry-rot and crack in a few Mississippi summers — a very common leak we find.",
    photo: {
      src: "/images/anatomy/roof-pipe-boot-flashing.webp",
      alt: "A new rubber-and-metal pipe boot sealing a plumbing vent pipe penetration on a roof.",
      caption: "A fresh pipe boot seals around a plumbing vent pipe.",
    },
  },
  {
    key: "gutters",
    hotspot: { x: 569, y: 339 },
    name: "Gutters",
    short: "Carry water away",
    what: "Channels along the eaves that collect roof runoff and route it away from your foundation.",
    why: "They protect your fascia, siding, landscaping, and foundation from constant water.",
    bad: "Undersized or clogged gutters overflow and rot the fascia and soak the foundation.",
    photo: {
      src: "/images/anatomy/seamless-gutters-musket-brown-petal-ms.webp",
      alt: "Seamless 6-inch K-style gutters in Musket Brown installed by Southeast Roofing in Petal, Mississippi.",
      caption: "Seamless gutters — a real Southeast Roofing install in Petal, MS.",
    },
  },
  {
    key: "soffit-fascia",
    hotspot: { x: 627, y: 294 },
    name: "Soffit & Fascia",
    short: "The roof's trim & intake vents",
    what: "The boards under the eave (fascia) and the vented underside (soffit) that let fresh air into the attic.",
    why: "Soffit vents feed the airflow that the ridge vent exhausts — together they keep the attic healthy.",
    bad: "Rotted fascia or painted-over soffit vents choke airflow and let pests and water in.",
    photo: {
      src: "/images/services/wood-fascia.webp",
      alt: "New wood fascia board installed along a roof eave, with vented soffit beneath.",
      caption: "Fascia and vented soffit trim the eave and feed attic intake air.",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Flashing                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The flashing family, broken out on its own.
 *
 * Flashing gets one entry in ROOF_PARTS because a homeowner scanning the roof
 * only needs "the metal at the transitions" — but flashing is where most roofs
 * actually leak, and the individual pieces have names that show up on
 * proposals and adjuster reports. This list is what those names mean.
 *
 * Photos are only attached where we genuinely have a shot of that piece; the
 * rest render as a labelled panel rather than borrowing a lookalike image.
 */
export interface FlashingType {
  key: string;
  name: string;
  /** Where on the roof it lives. */
  where: string;
  what: string;
  why: string;
  bad: string;
  photo?: RoofPartPhoto;
}

export const FLASHING_TYPES: FlashingType[] = [
  {
    key: "step-flashing",
    name: "Step Flashing",
    where: "Roof meets a sidewall",
    what: "Individual L-shaped metal pieces woven in one per shingle course where a slope runs alongside a wall or chimney.",
    why: "Each piece laps the one below it, so water stepping down the wall is handed outward onto the shingles instead of behind them.",
    bad: "A single long strip of bent metal ('continuous flashing') in place of real steps is a shortcut that traps water at every course line.",
    photo: {
      src: "/images/anatomy/roof-chimney-flashing.webp",
      alt: "Step and counter flashing woven into shingle courses where a roof meets a masonry chimney.",
      caption: "Step flashing woven course by course where the roof meets masonry.",
    },
  },
  {
    key: "counter-flashing",
    name: "Counter Flashing",
    where: "Over step flashing on masonry",
    what: "The upper piece, let into a groove cut in the brick or stone, that laps down over the top of the step flashing.",
    why: "It covers the step flashing's top edge so water can never get behind it — the two pieces together make the joint watertight.",
    bad: "Sealant smeared along the brick instead of a cut reglet. It looks fine for a season, then shrinks, cracks, and leaks inside the wall.",
  },
  {
    key: "apron-flashing",
    name: "Apron / Headwall Flashing",
    where: "Roof runs into a wall face",
    what: "A single bent piece running along the top of a slope where it dead-ends into a wall — common at dormers and second-story walls.",
    why: "It carries water coming down the wall out over the shingles below.",
    bad: "Too short a leg onto the roof, or no end dam, and water runs around the edge instead of over the shingles.",
  },
  {
    key: "kickout-flashing",
    name: "Kickout Flashing",
    where: "Bottom of a roof-to-wall run",
    what: "A small flared piece at the very bottom of a step-flashing run that kicks water out into the gutter.",
    why: "Without it, everything the wall collects pours straight down behind the siding at that one corner.",
    bad: "It is the single most-skipped piece of flashing in roofing, and its absence is a classic cause of rotted sheathing and interior wall damage that shows up years later.",
  },
  {
    key: "valley-flashing",
    name: "Valley Flashing",
    where: "Where two slopes meet",
    what: "Metal, membrane, or a woven shingle treatment down the channel where two roof planes join.",
    why: "Valleys carry more water than any other part of the roof — this is what keeps that volume moving without finding a seam.",
    bad: "Nails driven through the centre of the valley, or a valley left without ice and water shield underneath, put fasteners directly in the path of the heaviest flow.",
    photo: {
      src: "/images/anatomy/roof-closed-valley.webp",
      alt: "A closed roof valley where two shingle slopes meet and channel rainwater.",
      caption: "A valley carries more water than anywhere else on the roof.",
    },
  },
  {
    key: "drip-edge-flashing",
    name: "Drip Edge",
    where: "Eaves and rakes",
    what: "Bent metal along every roof edge, running under the underlayment at the rakes and over it at the eaves.",
    why: "It throws water clear of the fascia and into the gutter instead of letting it wick back along the underside of the deck.",
    bad: "Omitted entirely on older roofs, or lapped the wrong way — either lets water curl behind the gutter and rot the edge of the deck.",
    photo: {
      src: "/images/anatomy/roof-drip-edge-flashing.webp",
      alt: "Metal drip edge flashing installed along a roof eave above the gutter.",
      caption: "Drip edge throws water clear of the fascia into the gutter.",
    },
  },
  {
    key: "pipe-flashing",
    name: "Pipe Flashing / Boot",
    where: "Plumbing vent penetrations",
    what: "A metal base with a rubber or lead collar that seals around each pipe coming through the roof.",
    why: "Every penetration is a hole in your roof; the boot is the only thing making it watertight.",
    bad: "Cheap rubber collars dry-rot and split after a handful of Mississippi summers. It is one of the most common leaks we find, and one of the cheapest to fix.",
    photo: {
      src: "/images/anatomy/roof-pipe-boot-flashing.webp",
      alt: "A new rubber-and-metal pipe boot sealing a plumbing vent pipe penetration on a roof.",
      caption: "A fresh pipe boot seals a plumbing vent penetration.",
    },
  },
  {
    key: "chimney-cricket",
    name: "Chimney Cricket / Saddle",
    where: "Uphill side of a wide chimney",
    what: "A small peaked structure built behind the chimney to split water around it.",
    why: "On a wide chimney the uphill side is a dam; a cricket sends water around both sides instead of letting it pool and sit.",
    bad: "Leaving it off a chimney wider than about 30 inches lets debris and water collect against the masonry until the flashing gives up. Code calls for one at that width.",
  },
  {
    key: "z-flashing",
    name: "Z-Flashing / Drip Cap",
    where: "Above windows, doors, and trim",
    what: "A Z-shaped profile set above an opening or where siding materials change.",
    why: "It breaks the vertical path water takes down a wall and pushes it back out to the surface.",
    bad: "Relying on caulk over the head trim instead. Caulk is a maintenance item, not a flashing, and it fails on the schedule the sun sets.",
  },
];
