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
}

export const ROOF_PARTS: RoofPart[] = [
  {
    key: "ridge-cap",
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
