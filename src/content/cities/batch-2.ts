import type { CityContent } from "@/content/cities/types";

/**
 * City pages batch 2 (PRD §5, Tier 2 depth): the Pine Belt communities and
 * the Highway 49/59/98 corridors. Same anti-doorway rules as batch 1 —
 * unique local copy, and only cities with real project photos (per the
 * owner's 2026-07-05 relabel: Purvis, Ellisville, Richton, Poplarville,
 * Wiggins, Lucedale) reference completed local work.
 */

export const citiesBatch2: CityContent[] = [
  /* ------------------------------------------------------------------ */
  /* Purvis                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "purvis",
    city: "Purvis",
    county: "Lamar County",
    driveTime: "about 20 minutes",
    metaTitle: "Purvis Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Purvis, MS — the Lamar County seat, twenty minutes from our Hattiesburg office, with completed Purvis projects in our gallery.",
    hero: {
      headline: "Purvis roofing, twenty minutes from home",
      subhead:
        "The Lamar County seat sits just down Highway 11 from our office — close enough for fast scheduling, and close enough that our completed Purvis roofs are part of the neighborhood already.",
    },
    intro: {
      title: "Lamar County's courthouse town",
      paragraphs: [
        "Purvis mixes courthouse-square history with the growth spilling south from Hattiesburg — established in-town streets, newer subdivisions, and country properties out toward Little Black Creek. We've completed roofs here, photographed at real Purvis homes, and the twenty-minute run from our office makes inspections and repairs quick to schedule.",
        "Purvis also carries one of Mississippi's oldest storm memories: the 1908 tornado that leveled the town remains among the deadliest in state history. Modern Purvis takes the same Pine Belt weather as the rest of Lamar County — spring hail runs, straight-line winds, and tropical remnants — which keeps roof inspections here a matter of when, not if.",
      ],
    },
    localAreas: {
      title: "Around Purvis",
      items: [
        "Courthouse square area",
        "Highway 11 corridor",
        "Little Black Creek",
        "Baxterville road",
        "Rural Lamar County",
      ],
    },
    stormContext: {
      title: "A town that rebuilt once already",
      text: "Purvis has known catastrophic weather since 1908, and today's storms still favor Lamar County with hail and hard wind every spring. Our free inspections document damage honestly — and being twenty minutes away means tarps and repairs don't wait.",
    },
    faqs: [
      {
        question: "Do you have completed work in Purvis?",
        answer:
          "Yes — real Purvis projects are photographed in our gallery. Lamar County is home-turf territory for our crews.",
      },
      {
        question: "How fast can you get to Purvis?",
        answer:
          "About twenty minutes down Highway 11 — inspections schedule quickly and active leaks get triaged like the local calls they are.",
      },
      {
        question: "Do you handle country properties outside town?",
        answer:
          "All the time — homes, shops, and barns across rural Lamar County, including metal roofing for outbuildings.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Sumrall                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "sumrall",
    city: "Sumrall",
    county: "Lamar County",
    driveTime: "about 25 minutes",
    metaTitle: "Sumrall Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Sumrall, MS — Longleaf Trace country, twenty-five minutes from Hattiesburg, with fast Lamar County scheduling.",
    hero: {
      headline: "Sumrall roofs, along the Longleaf Trace",
      subhead:
        "One of the Pine Belt's fastest-growing small towns deserves roofing that keeps up — from new-construction neighborhoods to the farmhouses that were here first.",
    },
    intro: {
      title: "Small town, serious growth",
      paragraphs: [
        "Sumrall has become one of Lamar County's favorite places to build — good schools, the Longleaf Trace running through town, and country quiet inside a half-hour of Hattiesburg. That growth shows up on rooflines: newer subdivisions with builder-grade shingles reaching their first replacement cycle, alongside established homes and working farm buildings that have seen decades of Pine Belt weather.",
        "Highway 42 makes Sumrall an easy twenty-five minute run from our office. Shingle replacements and repairs lead the schedule, with metal roofing a steady favorite for the shops, barns, and country homes on acreage.",
      ],
    },
    localAreas: {
      title: "Around Sumrall",
      items: [
        "In-town neighborhoods",
        "Longleaf Trace corridor",
        "Highway 42",
        "Oloh community",
        "Rural west Lamar County",
      ],
    },
    stormContext: {
      title: "Open country, open exposure",
      text: "West Lamar County's open stretches give straight-line winds a running start, and spring cells drop hail along Highway 42 with regularity. After weather moves through, our documentation-first inspections tell Sumrall homeowners honestly what the storm did — and didn't do.",
    },
    faqs: [
      {
        question: "Have you worked in Sumrall before?",
        answer:
          "Yes — west Lamar County is regular territory for our crews, twenty-five minutes out Highway 42, with scheduling to match.",
      },
      {
        question: "My builder-grade roof is 15 years old. Should I worry?",
        answer:
          "Worth a look — builder-grade shingles in our climate often age faster than their rating suggests. The inspection is free and the answer is honest, including when the roof is fine.",
      },
      {
        question: "Do you roof barns and shops out here?",
        answer:
          "Constantly — exposed-fastener metal is the workhorse for Sumrall-area outbuildings, and we install it alongside home roofs in the same trip when that helps.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Seminary                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "seminary",
    city: "Seminary",
    county: "Covington County",
    driveTime: "about 25 minutes",
    metaTitle: "Seminary Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Seminary, MS — Okatoma country on the Highway 49 corridor, served from Hattiesburg with itemized proposals and honest inspections.",
    hero: {
      headline: "Seminary roofing, Okatoma country",
      subhead:
        "The little town on the Okatoma sits an easy run up Highway 49 — close enough for responsive service, far enough into the pines that roofs here earn their keep.",
    },
    intro: {
      title: "On the creek, in the pines",
      paragraphs: [
        "Seminary is best known for the Okatoma — the creek that draws paddlers from across the state — and for the working pine country around it. The homes follow that character: in-town streets near Highway 49, camps and homes along the creek corridor, and rural properties where a roof takes tree exposure as a fact of life.",
        "We serve Seminary straight up 49 in about twenty-five minutes, with the same process we run at home: free inspections with photos, itemized digital proposals, and honest recommendations that respect a rural budget. Shingle work leads; metal earns converts every year out here.",
      ],
    },
    localAreas: {
      title: "Around Seminary",
      items: [
        "In-town Seminary",
        "Okatoma Creek corridor",
        "Highway 49",
        "Rural Covington County",
      ],
    },
    stormContext: {
      title: "The pines always get a vote",
      text: "Between spring squall lines on the 49 corridor and the loblollies leaning over every roofline, Seminary roofs collect limb strikes and wind damage steadily. Our inspections read the trees as carefully as the shingles — and our repairs fix the cause, not just the hole.",
    },
    faqs: [
      {
        question: "Do you really come out to Seminary for small repairs?",
        answer:
          "Yes — twenty-five minutes up 49 is routine scheduling. Repairs, inspections, and full replacements all run on the same standards as our Hattiesburg work.",
      },
      {
        question: "A limb went through my roof. What do I do first?",
        answer:
          "Stay out of the room below, photograph what you can from the ground, and call us — we'll tarp it fast and document everything for the insurance claim that usually follows tree damage.",
      },
      {
        question: "What roof handles tree cover best?",
        answer:
          "No roof loves trees, but architectural shingles installed to spec handle shade and debris well, and metal takes limb abuse better than most. Honest answer: trimming the overhang matters more than the material.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Collins                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "collins",
    city: "Collins",
    county: "Covington County",
    driveTime: "about 35 minutes",
    metaTitle: "Collins Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Collins, MS — the Covington County seat on Highway 49, served from Hattiesburg with free inspections and itemized proposals.",
    hero: {
      headline: "Collins roofing, done the county-seat way",
      subhead:
        "Covington County's seat is working-town Mississippi — courthouse, poultry country, and homes that expect value for every dollar. That's exactly how we quote.",
    },
    intro: {
      title: "The heart of Covington County",
      paragraphs: [
        "Collins anchors Covington County — the courthouse downtown, established neighborhoods around it, and the farms and poultry operations that drive the local economy. Roofing here runs practical: family homes due honest replacements, rentals kept tight, and the barns and ag buildings where metal roofing earns its reputation.",
        "The thirty-five minute run up Highway 49 puts Collins comfortably inside our core radius, and our process travels whole: free photo-documented inspections, digital proposals itemized to the line, and crews that leave a site clean enough to satisfy a county-seat neighbor's watchful eye.",
      ],
    },
    localAreas: {
      title: "Around Collins",
      items: [
        "Downtown & courthouse area",
        "Highway 49 corridor",
        "Highway 84 east & west",
        "Mount Olive road",
        "Rural Covington County",
      ],
    },
    stormContext: {
      title: "The 49 corridor's stormy middle",
      text: "Collins sits where Pine Belt spring storms run the Highway 49 corridor — hail, hard wind, and tornado-warned nights are seasonal certainties. Our free post-storm inspections document damage while insurance timelines are friendly, and we'll tell you plainly when the roof held.",
    },
    faqs: [
      {
        question: "Is Collins inside your normal service area?",
        answer:
          "Comfortably — thirty-five minutes up 49. Inspections, repairs, replacements, and storm response all schedule as regular work, not special trips.",
      },
      {
        question: "Do you roof poultry houses and ag buildings?",
        answer:
          "We handle metal roofing for barns, shops, and ag structures across Covington County — exposed-fastener and structural systems sized to the building.",
      },
      {
        question: "How does your pricing work this far from Hattiesburg?",
        answer:
          "Identically to home: the inspection is free and the proposal is itemized line by line. Distance is our logistics, not your line item.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Ellisville                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "ellisville",
    city: "Ellisville",
    county: "Jones County",
    driveTime: "about 25 minutes",
    metaTitle: "Ellisville Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Ellisville, MS — Jones College's hometown, twenty-five minutes up I-59 from our Hattiesburg office.",
    hero: {
      headline: "Ellisville roofing, up the interstate",
      subhead:
        "Jones College's hometown blends historic streets with college-town energy — and sits an easy twenty-five minutes up I-59 from our office.",
    },
    intro: {
      title: "Jones County's other county seat",
      paragraphs: [
        "Ellisville holds its own identity beside Laurel — Jones College at its center, a historic downtown with real architecture, and neighborhoods that range from century-old homes to newer streets serving families and college staff. Roof work here means comfortable range: steep older pitches downtown, straightforward family replacements, and rentals kept watertight on landlord budgets.",
        "I-59 makes Ellisville one of our easiest northern runs — twenty-five minutes door to door — and Jones County's storm seasons keep the relationship active. The same Easter 2020 outbreak that scarred communities nearby reminded everyone here what spring can do.",
      ],
    },
    localAreas: {
      title: "Around Ellisville",
      items: [
        "Downtown & historic streets",
        "Jones College area",
        "Highway 11 corridor",
        "I-59 exits",
        "Rural south Jones County",
      ],
    },
    stormContext: {
      title: "Jones County springs mean business",
      text: "Ellisville shares Jones County's serious severe-weather record — the Easter 2020 outbreak passed close enough to make the point permanently. When storms track the I-59 corridor, our inspections and claim documentation are twenty-five minutes behind them.",
    },
    faqs: [
      {
        question: "Do you serve Ellisville or just Laurel?",
        answer:
          "Both, separately and properly — Ellisville is its own stop on our Jones County runs, twenty-five minutes up I-59.",
      },
      {
        question: "Can you handle older homes near downtown?",
        answer:
          "Yes — steep pitches and older decking are familiar work. We inspect carefully first so the proposal matches what's actually up there.",
      },
      {
        question: "Do you work with rental properties?",
        answer:
          "Regularly — honest repair-first recommendations, tight scheduling around tenants, and documentation landlords can file.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Richton                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "richton",
    city: "Richton",
    county: "Perry County",
    driveTime: "about 35 minutes",
    metaTitle: "Richton Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Richton, MS — Perry County timber country, thirty-five minutes east of Hattiesburg with honest inspections and metal expertise.",
    hero: {
      headline: "Richton roofing, timber-country tough",
      subhead:
        "Perry County lives among the pines it harvests — and its roofs live under them. We bring tree-smart inspections and metal-roofing expertise thirty-five minutes east on Highway 42.",
    },
    intro: {
      title: "Where the pines are the economy",
      paragraphs: [
        "Richton sits deep in Mississippi timber country — the courthouse town of Perry County, surrounded by working forest in every direction. Homes here live with trees the way coast homes live with salt: limb strikes, needle-choked gutters and valleys, and shade that keeps roofs damp long after the rain quits. Our inspections out here always read the canopy as carefully as the shingles.",
        "The practical roofing mix follows the country: shingle homes in town and along the county roads, and plenty of metal — homes, hunting camps, barns, and shops that want a roof installed once and left alone. Highway 42 puts Richton about thirty-five minutes from our office, an easy scheduled run.",
      ],
    },
    localAreas: {
      title: "Around Richton",
      items: [
        "In-town Richton",
        "Highway 42 corridor",
        "New Augusta road",
        "Rural Perry County",
        "Camp country",
      ],
    },
    stormContext: {
      title: "Every storm shakes the timber",
      text: "In Perry County, wind never arrives alone — it brings the forest with it. Limb and tree damage drives most of our Richton calls, and our process handles the whole chain: tarping fast, documenting for insurance, and repairing the roof once the tree's gone.",
    },
    faqs: [
      {
        question: "Do you cover Richton and rural Perry County?",
        answer:
          "Yes — Highway 42 makes it a thirty-five minute run, and rural properties are half the point of our radius. Camps and outbuildings included.",
      },
      {
        question: "Is metal the right call for a camp or rural home here?",
        answer:
          "Often, yes — exposed-fastener metal shrugs off limbs and needles better than most systems and asks almost nothing in maintenance. We'll price it against shingle honestly.",
      },
      {
        question: "A tree is on my roof right now. Do you handle that?",
        answer:
          "Call us first — tree-on-structure needs the removal and the roof protection sequenced safely, and we help coordinate both, then document everything for the claim.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Columbia                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "columbia",
    city: "Columbia",
    county: "Marion County",
    driveTime: "about 40 minutes",
    metaTitle: "Columbia Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Columbia, MS — the historic Marion County seat on the Pearl River, an easy Highway 98 run from our Hattiesburg office.",
    hero: {
      headline: "Columbia roofing, on the Pearl",
      subhead:
        "Marion County's historic seat — once Mississippi's capital for a season — keeps a downtown worth preserving and neighborhoods worth roofing right. Highway 98 makes the run from our office an easy one.",
    },
    intro: {
      title: "A river town with history to protect",
      paragraphs: [
        "Columbia wears more history than most towns its size — a stint as Mississippi's temporary capital, a downtown of genuine old storefronts, and neighborhoods where homes have stood through a century of Pearl River weather. Highway 98 West makes the forty-minute run straightforward to schedule, and our storm documentation from Marion County is part of the gallery.",
        "The work spans the town's range: careful replacements on older homes near downtown, family roofs in the established neighborhoods, and country properties spreading toward the river and the Marion County line. Storm response rounds it out — this stretch of 98 catches its share of spring cells and tropical leftovers riding up the Pearl.",
      ],
    },
    localAreas: {
      title: "Around Columbia",
      items: [
        "Historic downtown",
        "Broad Street area",
        "Highway 98 corridor",
        "Pearl River frontage",
        "Rural Marion County",
      ],
    },
    stormContext: {
      title: "The Pearl River corridor takes weather both ways",
      text: "Columbia catches Pine Belt spring storms from the north and tropical remnants riding the Pearl from the south. Wind-lifted shingles and hail bruising hide until they leak — our free inspections find them early, with the photo documentation insurance claims are built on.",
    },
    faqs: [
      {
        question: "Do you regularly work in Columbia?",
        answer:
          "Yes — Marion County is established territory for us, an easy run west on Highway 98, and Columbia calls schedule quickly.",
      },
      {
        question: "Can you work on the older homes near downtown?",
        answer:
          "Gladly — older decking, steeper pitches, and preservation-minded owners are exactly our kind of project. The inspection tells us both what the roof needs and what the house deserves.",
      },
      {
        question:
          "How quickly can you respond after a storm hits Marion County?",
        answer:
          "Normally within a day or two, triaged by severity — and our documentation-first process means the visit builds your insurance file, not just a quote.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Poplarville                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "poplarville",
    city: "Poplarville",
    county: "Pearl River County",
    driveTime: "about 40 minutes",
    metaTitle: "Poplarville Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Poplarville, MS — the Blueberry Capital and Pearl River County seat, with completed Poplarville projects in our gallery.",
    hero: {
      headline: "Poplarville roofing, Blueberry Capital standards",
      subhead:
        "The Pearl River County seat and home of PRCC sits forty minutes down I-59 — inside the hurricane corridor, and inside our gallery of completed projects.",
    },
    intro: {
      title: "College town, county seat, storm corridor",
      paragraphs: [
        "Poplarville stacks identities: Pearl River Community College's hometown, the county seat, and the self-declared Blueberry Capital of the World. The housing follows suit — established streets around downtown and the college, newer family neighborhoods, and farm properties in every direction. We've completed roofs here, photographed at real Poplarville homes.",
        "Geography sets the roofing agenda: Pearl River County catches hurricanes still organized from the Gulf — Katrina's core crossed almost directly overhead — and the pine country adds its usual tax of limbs and straw. Wind-serious installation and tree-aware inspections are simply how roofing gets done here.",
      ],
    },
    localAreas: {
      title: "Around Poplarville",
      items: [
        "Downtown & courthouse area",
        "PRCC campus area",
        "I-59 corridor",
        "Highway 26",
        "Rural Pearl River County",
      ],
    },
    stormContext: {
      title: "Hurricane country, forty miles inland",
      text: "Pearl River County takes hurricane cores, not leftovers — Katrina wrote that lesson permanently. Between landfalls, pine-country wind keeps the repair calls steady. Our inspections document everything, and I-59 gets us here fast when weather clears.",
    },
    faqs: [
      {
        question: "Do you have completed work in Poplarville?",
        answer:
          "Yes — real Poplarville projects are photographed in our gallery. Pearl River County is established ground for our crews.",
      },
      {
        question: "What should a roof here be built to handle?",
        answer:
          "Hurricane wind first — proper fastening schedules and sealed edges — then the daily grind of pine exposure. We spec for both because both are certainties.",
      },
      {
        question: "Can you help with hurricane claims in Pearl River County?",
        answer:
          "It's core work for us — thorough documentation, adjuster meetings on your roof, and straight answers about what the storm did and didn't do.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Wiggins                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "wiggins",
    city: "Wiggins",
    county: "Stone County",
    driveTime: "about 40 minutes",
    metaTitle: "Wiggins Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Wiggins, MS — the Stone County seat between the Pine Belt and the Coast, served from Hattiesburg down Highway 49.",
    hero: {
      headline: "Wiggins roofing, halfway to the Coast",
      subhead:
        "Stone County's seat sits where the Pine Belt starts feeling the Gulf — national-forest pines on one side, hurricane paths on the other, and Highway 49 running straight to our door.",
    },
    intro: {
      title: "Between the forest and the water",
      paragraphs: [
        "Wiggins holds the middle ground of our service area — forty minutes south of Hattiesburg, thirty north of Gulfport, with the DeSoto National Forest wrapping the county in working pine. Roofs here answer to both geographies: hurricane systems arrive from the coast with real strength left, and the forest keeps up its steady pressure of limbs, straw, and shade.",
        "The town itself is classic county-seat Mississippi — courthouse, schools, Flint Creek drawing summer crowds — with housing from established in-town streets to homesteads down long gravel drives. Our full process makes the 49 run intact: free inspections, itemized proposals, and crews that treat the distance as our problem.",
      ],
    },
    localAreas: {
      title: "Around Wiggins",
      items: [
        "Downtown & courthouse area",
        "Flint Creek area",
        "Highway 49 corridor",
        "Highway 26",
        "Rural Stone County",
      ],
    },
    stormContext: {
      title: "Hurricanes arrive here still swinging",
      text: "Thirty miles from the beach, Stone County catches storm systems before they've spent their wind. Add DeSoto's pines leaning over rooflines and Wiggins roofs live an honest, hard life. Our storm inspections and claim documentation run the 49 corridor after every event.",
    },
    faqs: [
      {
        question: "Is Wiggins in your regular coverage?",
        answer:
          "Right in the middle of it — Highway 49 makes Wiggins a forty-minute run we schedule constantly on the way between the Pine Belt and Coast work.",
      },
      {
        question: "What does hurricane exposure mean this far inland?",
        answer:
          "Real wind, not remnants — fastening schedules and edge sealing matter here nearly as much as on the beach. We install to that reality.",
      },
      {
        question: "Do you handle rural and forest-adjacent properties?",
        answer:
          "Yes — long drives and tree cover are normal for our Stone County work, and metal roofing earns a lot of fans out here.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Lucedale                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "lucedale",
    city: "Lucedale",
    county: "George County",
    driveTime: "about 60 minutes",
    metaTitle: "Lucedale Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Lucedale, MS — the George County seat in Mississippi's agricultural southeast, served from Hattiesburg on Highway 98.",
    hero: {
      headline: "Lucedale roofing, George County grown",
      subhead:
        "The agricultural heart of southeast Mississippi runs on practical value and straight dealing — which is exactly how our proposals read, an hour down Highway 98.",
    },
    intro: {
      title: "Southeast Mississippi's farm-country seat",
      paragraphs: [
        "Lucedale anchors George County the old way — a courthouse town serving farm country in every direction, close enough to the coast to feel its weather and far enough to keep its own pace. Homes range from in-town streets to farmsteads and camps down county roads, and outbuildings matter here as much as houses.",
        "We make Lucedale on Highway 98 east in about an hour, scheduled with the same discipline as everything at the radius edge: inspections and estimates batched efficiently, materials confirmed before build days, and itemized digital proposals so a George County family sees every line before committing to a contractor from two counties over — as they should.",
      ],
    },
    localAreas: {
      title: "Around Lucedale",
      items: [
        "Downtown & courthouse area",
        "Highway 98 corridor",
        "Highway 63",
        "Agricola & Rocky Creek",
        "Rural George County",
      ],
    },
    stormContext: {
      title: "Coastal weather with a country address",
      text: "George County sits in the path of anything that comes ashore between Mobile and Biloxi — hurricane wind arrives with authority, and the pines add their usual toll between storms. Our documentation-first storm process makes the hour's distance irrelevant to how thoroughly your damage gets recorded.",
    },
    faqs: [
      {
        question: "Do you really serve as far east as Lucedale?",
        answer:
          "Yes — George County marks our southeastern reach, and we schedule it deliberately. Same free inspection, same itemized proposal, same crews.",
      },
      {
        question: "Can you do metal roofing for barns and farm buildings?",
        answer:
          "That's bread-and-butter work here — exposed-fastener and structural metal sized to the building, often scheduled alongside the house roof.",
      },
      {
        question:
          "How do you handle storm response at the edge of your radius?",
        answer:
          "Honestly and in order of severity — after a landfall we run dedicated eastern routes, and every inspection builds the insurance file with full photo documentation.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Ocean Springs                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "ocean-springs",
    city: "Ocean Springs",
    county: "Jackson County",
    driveTime: "about 85 minutes",
    metaTitle: "Ocean Springs Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Ocean Springs, MS — the Coast's arts town of live oaks and historic cottages, roofed to coastal wind standards.",
    hero: {
      headline: "Ocean Springs roofs, under the live oaks",
      subhead:
        "The Coast's arts town guards its character — historic cottages, oak canopies, and a downtown people drive hours to walk. We roof to that standard — coastal wind specs and all.",
    },
    intro: {
      title: "A town that cares how things look",
      paragraphs: [
        "Ocean Springs is the Coast at its most personal — Walter Anderson's town, a walkable downtown of galleries and porches, and neighborhoods where century-old cottages sit under live oaks older still. Roofing here is character work: steep little gables, tree canopy that never quits, and streetscapes where a clumsy roofline would be noticed by everyone at the farmers market.",
        "We treat the eighty-five minute run as the cost of working somewhere worth it. The oak canopy sets the maintenance rhythm — limbs, leaves, and shade-fed algae — while the Gulf sets the stakes: this is Katrina country, where wind-rated installation is simply the standard.",
      ],
    },
    localAreas: {
      title: "Around Ocean Springs",
      items: [
        "Historic downtown",
        "Front Beach area",
        "Gulf Hills",
        "East Beach",
        "St. Martin",
        "Near Davis Bayou",
      ],
    },
    stormContext: {
      title: "Beauty on the front line",
      text: "Ocean Springs' oaks survived Katrina; plenty of roofs didn't. Every named storm since has re-taught the lesson: on this shoreline, fastening schedules, sealed edges, and honest documentation afterward are what protect the town's character. That's the standard we install to.",
    },
    faqs: [
      {
        question: "Do you regularly work in Ocean Springs?",
        answer:
          "Yes — the east Coast towns are established territory for us, scheduled in efficient Coast blocks alongside Biloxi and Gulfport.",
      },
      {
        question: "Can you roof the historic cottages downtown?",
        answer:
          "Carefully, yes — older framing, steep small pitches, and preservation sensibilities are familiar work. We inspect thoroughly first and propose to what the house actually needs.",
      },
      {
        question: "How do the live oaks affect a roof here?",
        answer:
          "Constant shade, leaf load, and limb exposure — beautiful and relentless. We factor the canopy into system choice, ventilation, and maintenance advice, because pretending it isn't there is how roofs fail early in this town.",
      },
    ],
  },
];
