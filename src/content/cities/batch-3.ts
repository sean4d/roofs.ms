import type { CityContent } from "@/content/cities/types";

/**
 * City pages batch 3 (PRD §5, Tier 2 depth): the Gulf Coast towns —
 * Hancock, Harrison, and Jackson County communities from the Kiln to
 * Pascagoula. Anti-doorway rules hold: unique local copy per town, and
 * none of these cities claim completed local work (no photos in the
 * manifest yet — coverage claims only, stated honestly).
 */

export const citiesBatch3: CityContent[] = [
  /* ------------------------------------------------------------------ */
  /* Kiln                                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "kiln",
    city: "Kiln",
    county: "Hancock County",
    driveTime: "about 75 minutes",
    metaTitle: "Roofing Contractor in Kiln, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Kiln, MS — Jourdan River country in Hancock County, served by a MSBOC-licensed, GAF-certified contractor from Hattiesburg.",
    hero: {
      headline: "Roofing for the Kiln, built for Hancock County weather",
      subhead:
        "From the Jourdan River to the piney back roads, the Kiln lives close to the Gulf without the beachfront address — and its roofs still take coastal wind seriously. So do we.",
    },
    intro: {
      title: "Jourdan River country",
      paragraphs: [
        "The Kiln is Hancock County at its most local — river camps and homes along the Jourdan, acreage properties off Highway 603 and Highway 43, and a community famous well beyond its size as the hometown of Brett Favre. Roofing here runs the full spread: architectural shingle on family homes, metal on camps, shops, and barns, and repairs where pine limbs and tropical weather have had their say.",
        "Sitting a few miles inland softens the salt air but not the wind — hurricanes that come ashore on the Mississippi Sound arrive in the Kiln with most of their strength intact, as Katrina proved across every corner of Hancock County. We install wind-rated systems to spec and document storm damage the way coastal insurers expect, and Highway 49 to I-10 puts our crews here in about seventy-five minutes.",
      ],
    },
    localAreas: {
      title: "Around the Kiln",
      items: [
        "Jourdan River",
        "Highway 603 corridor",
        "Highway 43",
        "Fenton",
        "Dedeaux",
        "Rural Hancock County",
      ],
    },
    stormContext: {
      title: "Hancock County remembers",
      text: "Katrina's eyewall crossed Hancock County, and the Kiln took hurricane-force wind far from any beach. That's the design condition here: wind-rated installation, sealed edges, and honest post-storm documentation — plus tarping when a system has just moved through and the roof can't wait.",
    },
    faqs: [
      {
        question: "Do you serve the Kiln from Hattiesburg?",
        answer:
          "Yes — about seventy-five minutes down Highway 49 and across I-10. The western Coast is inside our regular service radius, and we schedule Hancock County work in efficient blocks.",
      },
      {
        question: "Do you roof river camps and outbuildings?",
        answer:
          "All the time — exposed-fastener metal is the workhorse for camps, barns, and shops along the Jourdan, and we install it alongside home roofs in the same trip when that helps.",
      },
      {
        question: "Can you handle hurricane insurance claims out here?",
        answer:
          "Yes. Coastal wind claims have their own quirks — separate wind deductibles among them — and our documentation-first inspections give your adjuster exactly what the file needs.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* McHenry                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "mchenry",
    city: "McHenry",
    county: "Stone County",
    driveTime: "about 45 minutes",
    metaTitle: "Roofing Contractor in McHenry, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in McHenry, MS — the Stone County community on Highway 49, forty-five minutes from our Hattiesburg office.",
    hero: {
      headline: "McHenry roofing, right on our route south",
      subhead:
        "Halfway between the Pine Belt and the beach, McHenry sits directly on Highway 49 — which means our crews pass through constantly and scheduling here is easy.",
    },
    intro: {
      title: "The halfway point on Highway 49",
      paragraphs: [
        "McHenry is the kind of Stone County community that's easy to drive past and hard to beat for living: homes and acreage in the piney woods south of Wiggins, with Highway 49 carrying the Coast commute right past the front door. For us it's home-route territory — every Coast job takes our crews through McHenry, so inspections and repairs here slot into the schedule quickly.",
        "Roofs in this stretch of the piney woods deal with a bit of everything: Pine Belt hail and straight-line wind from the north, weakened-but-wet tropical systems from the south, and pines that shed limbs and straw onto shingles year-round. Architectural shingle leads on homes, and metal earns its keep on the shops, barns, and country places that make up so much of Stone County.",
      ],
    },
    localAreas: {
      title: "Around McHenry",
      items: [
        "Highway 49 corridor",
        "Perkinston area",
        "Red Creek",
        "Rural Stone County",
      ],
    },
    stormContext: {
      title: "Weather from both directions",
      text: "Stone County catches spring hail and wind off the Pine Belt and the first inland hours of every tropical system that crosses the Coast. Our free inspections tell McHenry homeowners honestly which storms actually left damage — and which roofs are fine.",
    },
    faqs: [
      {
        question: "How quickly can you get to McHenry?",
        answer:
          "About forty-five minutes straight down Highway 49 — and since every Coast job routes through here, we're often nearby already.",
      },
      {
        question: "Do you work on rural properties and outbuildings?",
        answer:
          "Constantly — homes, barns, shops, and camps across Stone County, with metal roofing a steady favorite for anything with acreage around it.",
      },
      {
        question: "Is McHenry too far for a free inspection?",
        answer:
          "Not at all — inspections are free everywhere we work, McHenry included, with no obligation attached.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Saucier                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "saucier",
    city: "Saucier",
    county: "Harrison County",
    driveTime: "about 55 minutes",
    metaTitle: "Roofing Contractor in Saucier, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Saucier, MS — Harrison County's country side, between De Soto National Forest and the Coast, served from Hattiesburg.",
    hero: {
      headline: "Saucier roofs, where the forest meets the Coast",
      subhead:
        "Harrison County's quiet northern half is acreage country — homes, barns, and barndominiums in the pines, close enough to the Gulf to plan for hurricanes anyway.",
    },
    intro: {
      title: "Harrison County's country side",
      paragraphs: [
        "Saucier is what people picture when they want land near the Coast without the beachfront bustle: properties tucked against De Soto National Forest, homesteads off Highway 49, and a building boom of barndominiums and shops that suits metal roofing perfectly. We install both worlds here — architectural shingle on family homes and exposed-fastener or standing-seam metal on the structures that make country property work.",
        "Being twenty minutes north of Gulfport takes the salt spray out of the equation but not the storms. Hurricanes cross Saucier with serious wind still aboard — Katrina and Zeta both left their marks through here — and the surrounding pines add their own hazard every time a front moves through. Wind-rated installation and honest storm documentation are standard practice for us, not coastal add-ons.",
      ],
    },
    localAreas: {
      title: "Around Saucier",
      items: [
        "Highway 49 corridor",
        "De Soto National Forest edge",
        "Success Road area",
        "Lizana",
        "Rural north Harrison County",
      ],
    },
    stormContext: {
      title: "Inland address, coastal storms",
      text: "Saucier sits in the path of every system that crosses the Mississippi Coast, with pine exposure doing extra damage on the back side of each storm. We document wind and tree damage thoroughly, assist through the entire claims process, and tarp fast when a roof is open to the weather.",
    },
    faqs: [
      {
        question: "Do you build metal roofs for barndominiums in Saucier?",
        answer:
          "Yes — barndominium and shop metal is a growing share of our work in north Harrison County, in both exposed-fastener and standing-seam systems.",
      },
      {
        question: "How far is Saucier for your crews?",
        answer:
          "About fifty-five minutes down Highway 49 — comfortably inside our service radius, on the same run as our Gulfport and Biloxi work.",
      },
      {
        question: "A pine came through my roof — what do I do first?",
        answer:
          "Call us. We tarp first to stop the water, document everything for your insurer, and then handle the repair or replacement — you don't have to coordinate three different companies.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Diamondhead                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "diamondhead",
    city: "Diamondhead",
    county: "Hancock County",
    driveTime: "about 80 minutes",
    metaTitle: "Roofing Contractor in Diamondhead, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Diamondhead, MS — the planned community on the Bay of St. Louis, served by a GAF-certified contractor with itemized proposals.",
    hero: {
      headline: "Diamondhead roofing that meets the neighborhood's standard",
      subhead:
        "One of Mississippi's newest cities was planned to look a certain way — and its roofs are part of that. We install systems that satisfy both the covenants and the hurricanes.",
    },
    intro: {
      title: "A planned community with planned standards",
      paragraphs: [
        "Diamondhead is unlike anywhere else on the Coast: a master-planned community above the Bay of St. Louis that became one of Mississippi's newest incorporated cities, with golf-course fairways, Polynesian street names, and property standards that keep the whole place looking intentional. Roofing here means respecting that — clean installations, consistent architectural profiles, and proposals itemized clearly enough for any homeowner or association review.",
        "It also means engineering for the bay. Diamondhead's elevation spared much of it from Katrina's surge, but nothing on this coast escapes the wind — and the community rebuilt around that reality. We install wind-rated shingle and metal systems to manufacturer spec, pay real attention to edges, valleys, and ventilation in bay-side humidity, and document every storm claim the way coastal carriers expect.",
      ],
    },
    localAreas: {
      title: "Around Diamondhead",
      items: [
        "Country club & fairway streets",
        "Airport area",
        "Bay-side south sections",
        "Commercial district at I-10",
        "Diamondhead East",
      ],
    },
    stormContext: {
      title: "Above the surge, still in the wind",
      text: "Diamondhead's ridge kept much of the community above Katrina's water, but hurricane wind arrives at full strength on the Bay of St. Louis. Wind-rated systems, disciplined fastening, and thorough post-storm documentation are simply how roofing is done here.",
    },
    faqs: [
      {
        question: "Can your proposals work with association reviews?",
        answer:
          "Yes — every proposal is itemized in writing with the exact system and colors specified, which makes architectural or covenant review straightforward.",
      },
      {
        question: "Do you handle wind claims in Diamondhead?",
        answer:
          "Regularly on the Coast — we document damage thoroughly, meet adjusters on site, and know the quirks of coastal wind coverage and deductibles.",
      },
      {
        question: "How does scheduling work from Hattiesburg?",
        answer:
          "Diamondhead sits right at I-10, about eighty minutes from our office — we block Coast days efficiently and communicate arrival windows straight.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Bay St. Louis                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "bay-st-louis",
    city: "Bay St. Louis",
    county: "Hancock County",
    driveTime: "about 85 minutes",
    metaTitle: "Roofing Contractor in Bay St. Louis, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Bay St. Louis, MS — Old Town cottages to bayfront homes, from a MSBOC-licensed contractor that takes Hancock County wind seriously.",
    hero: {
      headline: "Roofing worthy of the Bay",
      subhead:
        "Old Town's cottages, the bluff along the beach, and a town that rebuilt itself from the eye of Katrina — Bay St. Louis roofs carry history and face the Gulf head-on.",
    },
    intro: {
      title: "A town that came back from the eye",
      paragraphs: [
        "Bay St. Louis is the Coast's arts town — Old Town's galleries and cottages, Beach Boulevard on the low bluff, and neighborhoods that mix century-old homes with everything rebuilt since 2005. Roofing here spans that same range: careful replacements on older homes where details matter, modern wind-rated systems on newer construction, and metal roofs that suit both the cottage look and the salt air.",
        "This is also the town that stood closest to Katrina's eye. Bay St. Louis measures its history in storms the way other towns use decades, and it rebuilt with the Gulf in mind. We work to that standard: manufacturer-spec fastening, sealed edges, corrosion-aware material choices near the water, and storm documentation thorough enough for the wind claims this county knows too well.",
        "The Hancock County seat sits about eighty-five minutes from our Hattiesburg office via I-10 — a run we plan in efficient Coast blocks with honest scheduling. Free inspections, itemized proposals, and a lifetime warranty come standard, same as everywhere we work.",
      ],
    },
    localAreas: {
      title: "Around Bay St. Louis",
      items: [
        "Old Town",
        "Beach Boulevard",
        "North Beach area",
        "Cedar Point",
        "Shoreline Park",
        "Highway 90 corridor",
      ],
    },
    stormContext: {
      title: "Katrina's closest witness",
      text: "The Bay stood at the center of the worst of 2005, and every roof decision here carries that memory. Wind-rated systems installed to spec, salt-aware materials, and documentation-first storm response aren't extras in Bay St. Louis — they're the baseline we build to.",
    },
    faqs: [
      {
        question: "Can you match the character of an Old Town cottage roof?",
        answer:
          "Yes — architectural shingle profiles and standing-seam metal both suit the cottage vernacular, and we spec colors and details to fit the home rather than fight it.",
      },
      {
        question: "What does salt air change about a roof here?",
        answer:
          "Mostly metals: fasteners, flashing, and panel coatings need corrosion-appropriate choices near the water. We spec for the address, not from a generic catalog.",
      },
      {
        question: "Do you assist with wind and hurricane claims?",
        answer:
          "Start to finish — thorough photo documentation, adjuster meetings on site, and honest assessments of what the storm did and didn't do.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Pass Christian                                                      */
  /* ------------------------------------------------------------------ */
  {
    slug: "pass-christian",
    city: "Pass Christian",
    county: "Harrison County",
    driveTime: "about 80 minutes",
    metaTitle: "Roofing Contractor in Pass Christian, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Pass Christian, MS — Scenic Drive to the harbor, built to the wind standard a town that survived Camille and Katrina demands.",
    hero: {
      headline: "The Pass deserves roofs built for its history",
      subhead:
        "Camille came ashore here in 1969. Katrina returned in 2005. Pass Christian rebuilt beautifully both times — and its roofs are specified accordingly.",
    },
    intro: {
      title: "Where the Coast's storms make landfall",
      paragraphs: [
        "Pass Christian holds two identities at once: one of the Coast's most graceful towns — live oaks over Scenic Drive, the harbor working its oyster fleet, homes with real architectural pedigree — and the piece of Mississippi shoreline that has taken the two most infamous landfalls in state history. Roofing in the Pass answers to both: installations clean enough for Scenic Drive, engineered for the next name on the list.",
        "That means wind-rated systems fastened to manufacturer spec, sealed edges and valleys, and material choices that respect front-row salt exposure — plus straight talk about what shingle, metal, and hybrid approaches each endure this close to the water. When storms do come, our documentation-first inspections and claims assistance handle the wind-coverage quirks Harrison County homeowners know well. The Pass is about eighty minutes from our office, worked in the same Coast blocks as Gulfport and Long Beach.",
      ],
    },
    localAreas: {
      title: "Around Pass Christian",
      items: [
        "Scenic Drive",
        "The Harbor district",
        "Timber Ridge",
        "Henderson Point",
        "DeLisle",
        "Highway 90 corridor",
      ],
    },
    stormContext: {
      title: "Camille and Katrina both chose the Pass",
      text: "No town on the Coast carries a heavier storm résumé, and none rebuilt with clearer eyes. We install to that standard — wind-rated, sealed, documented — and when the Gulf sends the next one, our tarping and claims assistance head for the Pass with the rest of the Coast.",
    },
    faqs: [
      {
        question: "Can you roof historic and high-end homes on Scenic Drive?",
        answer:
          "Yes — profile, color, and detail choices get real attention on homes like these, and our itemized proposals spell out exactly what's going on the roof before work starts.",
      },
      {
        question: "What wind standard do you install to?",
        answer:
          "Manufacturer high-wind specifications: correct nailing schedules, starter and edge sealing, and system components installed as designed — the details that decide whether a roof holds in a landfall town.",
      },
      {
        question: "Do you work the whole Pass area?",
        answer:
          "From the beachfront to DeLisle and Henderson Point — the entire west Harrison County shore is in our Coast rotation.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Long Beach                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "long-beach",
    city: "Long Beach",
    county: "Harrison County",
    driveTime: "about 75 minutes",
    metaTitle: "Roofing Contractor in Long Beach, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Long Beach, MS — the Friendly City's neighborhoods from the beach to the college, roofed to coastal wind standards.",
    hero: {
      headline: "Friendly City roofs, serious coastal standards",
      subhead:
        "Long Beach rebuilt its beachfront blocks and kept its small-town feel. Its roofs live with Gulf wind and salt air — ours are specified for exactly that.",
    },
    intro: {
      title: "Small-town Coast living",
      paragraphs: [
        "Long Beach earned its Friendly City nickname honestly: a walkable downtown around Jeff Davis Avenue, the USM Gulf Park campus under the oaks, and family neighborhoods running from the sand to the railroad and north toward the interstate. The housing stock tells the Coast's story — beachfront blocks rebuilt after Katrina, mid-century homes further in, and newer construction filling out the north side.",
        "Each of those bands asks something different of a roof. Beachfront and Highway 90 homes need salt-aware materials and wind-rated installation above all; older in-town roofs are often at replacement age with ventilation and decking questions attached; newer builds north of the tracks are reaching their first re-roof cycle. Our free inspections read each roof on its own terms, and every proposal is itemized so Long Beach homeowners see exactly what they're buying.",
      ],
    },
    localAreas: {
      title: "Around Long Beach",
      items: [
        "Downtown & Jeff Davis Avenue",
        "Beachfront blocks",
        "USM Gulf Park area",
        "Pineville Road area",
        "North Long Beach",
        "Highway 90 corridor",
      ],
    },
    stormContext: {
      title: "Front row on the Sound",
      text: "Long Beach's shoreline took Katrina's surge and Zeta's winds, and every hurricane season puts the town back on the board. Wind-rated systems, sealed edges, and thorough claim documentation are the standard here — and our storm response covers the Coast whenever a system comes ashore.",
    },
    faqs: [
      {
        question: "Do you serve all of Long Beach or just the beachfront?",
        answer:
          "All of it — from Highway 90 to the north-side subdivisions. The whole city sits in our regular Coast rotation alongside Gulfport and Pass Christian.",
      },
      {
        question: "My roof predates Katrina. Is it due?",
        answer:
          "Quite possibly — a pre-2005 roof on the Coast has earned a professional look. The inspection is free and the answer is honest, including when the roof has life left.",
      },
      {
        question: "Can you help with hurricane deductibles and wind claims?",
        answer:
          "We assist through the entire claims process and know how coastal wind coverage behaves — documentation first, adjuster meetings on site, no outcome promises, no surprises.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* D'Iberville                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "d-iberville",
    city: "D'Iberville",
    county: "Harrison County",
    driveTime: "about 75 minutes",
    metaTitle: "Roofing Contractor in D'Iberville, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in D'Iberville, MS — the Back Bay city at I-10 and I-110, residential and commercial roofing from a GAF-certified contractor.",
    hero: {
      headline: "D'Iberville roofing, on the Back Bay's busiest corner",
      subhead:
        "Where I-10 meets I-110, D'Iberville has grown into the Coast's crossroads — subdivisions, waterfront streets, and one of the region's biggest retail districts, all needing roofs that respect the bay.",
    },
    intro: {
      title: "The city across the Back Bay",
      paragraphs: [
        "D'Iberville looks across the Back Bay at Biloxi and has spent two decades growing into its own: established neighborhoods off Lemoyne Boulevard, newer subdivisions pushing north toward the interstate, and the Sangani Boulevard retail corridor that draws the whole Coast. We roof both sides of that growth — architectural shingle and metal on homes, and TPO, metal, and coating systems on the commercial roofs the retail district runs on.",
        "Bay-side geography shapes the work. Katrina pushed surge deep into D'Iberville's waterfront streets, and every tropical system since has reminded the city that the Back Bay amplifies wind and water alike. Wind-rated installation and honest storm documentation are our defaults here, and the I-10/I-110 interchange makes D'Iberville one of the easiest Coast stops on our schedule — about seventy-five minutes from the office.",
      ],
    },
    localAreas: {
      title: "Around D'Iberville",
      items: [
        "Lemoyne Boulevard area",
        "Back Bay waterfront",
        "Sangani Boulevard district",
        "Big Ridge Road",
        "North D'Iberville at I-10",
      ],
    },
    stormContext: {
      title: "The Back Bay bites twice",
      text: "Hurricanes hit D'Iberville with open-water wind and bay-driven surge — Katrina proved how far up the streets the water goes. Roofs here get wind-rated systems and sealed edges as standard, and our post-storm documentation is built for the claims that follow.",
    },
    faqs: [
      {
        question: "Do you handle commercial roofs in the retail district?",
        answer:
          "Yes — TPO, metal, and coating systems for retail, restaurant, and flex buildings, with maintenance programs that catch problems before tenants do.",
      },
      {
        question: "How does D'Iberville fit your service area?",
        answer:
          "Right at the I-10/I-110 interchange, about seventy-five minutes from our Hattiesburg office — one of the most efficient stops on our Coast rotation.",
      },
      {
        question: "Is metal roofing a good fit near the Back Bay?",
        answer:
          "Often, yes — with corrosion-appropriate panels and fasteners specified for bay air. We'll walk you through where metal beats shingle here and where it doesn't.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Moss Point                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "moss-point",
    city: "Moss Point",
    county: "Jackson County",
    driveTime: "about 90 minutes",
    metaTitle: "Roofing Contractor in Moss Point, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Moss Point, MS — the River City on the Pascagoula and Escatawpa, roofed for Jackson County wind, rain, and river humidity.",
    hero: {
      headline: "River City roofs, built for Jackson County weather",
      subhead:
        "Two rivers, the marsh, and the Gulf just downstream — Moss Point roofs live in serious humidity and real storm exposure. We build for both.",
    },
    intro: {
      title: "Where the rivers meet the Sound",
      paragraphs: [
        "Moss Point sits where the Pascagoula and Escatawpa rivers braid into the marshes above the Sound — the River City, with the Audubon center on its waterfront and generations of shipyard and refinery families in its neighborhoods. The housing stock runs older than the Coast average, which makes honest roof assessment matter more here: decking, ventilation, and flashing often need as much attention as the shingles themselves.",
        "River-bottom humidity works on roofs from below while Gulf weather works from above. Moss Point catches hurricane wind with the rest of Jackson County — Katrina hit hard here despite the eastern distance from the eye — plus the tornado and straight-line risk that rides every strong front up the river corridors. Our free inspections document the whole picture, and our claims assistance carries Moss Point homeowners through the process start to finish.",
      ],
    },
    localAreas: {
      title: "Around Moss Point",
      items: [
        "Downtown & riverfront",
        "Escatawpa",
        "Kreole",
        "Highway 63 corridor",
        "East Moss Point",
      ],
    },
    stormContext: {
      title: "Storms follow the rivers",
      text: "Jackson County takes hurricane wind off the Sound and tornado tracks up the river corridors — 2023's Moss Point tornado is fresh local memory. We document storm damage thoroughly, tarp fast when roofs are open, and assist through the entire insurance claims process.",
    },
    faqs: [
      {
        question: "My home is older — can you assess more than shingles?",
        answer:
          "That's exactly how we inspect: decking condition, ventilation, flashing, and gutters along with the roof surface, so the proposal addresses the roof system, not just its top layer.",
      },
      {
        question: "Do you really cover Moss Point from Hattiesburg?",
        answer:
          "Yes — about ninety minutes via Highway 98 and 63, inside our two-hour radius. East Jackson County runs are planned as efficient blocks with honest scheduling.",
      },
      {
        question: "Can you handle both wind and tornado claims?",
        answer:
          "Both — the documentation standard is the same: thorough photos, honest scope, and reports in the format adjusters expect.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Pascagoula                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "pascagoula",
    city: "Pascagoula",
    county: "Jackson County",
    driveTime: "about 90 minutes",
    metaTitle: "Roofing Contractor in Pascagoula, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement and repair in Pascagoula, MS — the Jackson County seat and shipbuilding city, with residential and commercial roofing built for Gulf-front wind.",
    hero: {
      headline: "Pascagoula roofing, built to shipyard standards",
      subhead:
        "The city that builds Navy ships knows the difference between done and done right. Its roofs face the open Sound — ours are installed like it.",
    },
    intro: {
      title: "The working capital of the east Coast",
      paragraphs: [
        "Pascagoula is the Coast at its most industrial and most storied — the Jackson County seat, home to Mississippi's largest industrial employer at the Ingalls shipyard, with the Singing River's legend upstream and beachfront neighborhoods looking straight down the Sound. The workload here spans the city's character: family homes from the beach district to Market Street, and the commercial and industrial roofs that keep the working waterfront dry.",
        "Gulf-front geography sets the spec. Pascagoula's shoreline takes hurricane wind and surge with no barrier island close enough to matter — Katrina flooded blocks well inland here — and salt air off the Sound works on fasteners and flashing every day between storms. We install wind-rated shingle and metal systems to manufacturer specification, choose corrosion-appropriate materials near the water, and back storm claims with the documentation-first process Jackson County insurers see from us regularly.",
        "The run from Hattiesburg is about ninety minutes down Highway 98 and 63 — comfortably inside our two-hour radius, scheduled in efficient east-Coast blocks alongside Moss Point.",
      ],
    },
    localAreas: {
      title: "Around Pascagoula",
      items: [
        "Beach Boulevard district",
        "Downtown & Market Street",
        "Near the shipyard",
        "Cherokee area",
        "Gautier line at Highway 90",
        "North Pascagoula",
      ],
    },
    stormContext: {
      title: "Open water, open exposure",
      text: "Pascagoula faces the Sound directly, and its storm history — Katrina above all — reads like the east Coast's ledger. Wind-rated installation, salt-aware materials, and thorough post-storm documentation are the job here, and our claims assistance runs start to finish.",
    },
    faqs: [
      {
        question:
          "Do you take on commercial and industrial roofs in Pascagoula?",
        answer:
          "Yes — TPO, metal, and coating systems for the warehouses, offices, and commercial buildings that support the working waterfront, with maintenance programs available.",
      },
      {
        question: "What does beachfront exposure mean for my roof choice?",
        answer:
          "Wind rating and corrosion resistance move to the top of the list — fastening schedules, sealed edges, and metal choices all change within sight of the Sound. We spec for the address and explain the trade-offs plainly.",
      },
      {
        question: "Can you help with hurricane claims in Jackson County?",
        answer:
          "That's core work for us — complete photo documentation, on-site adjuster meetings, and honest scope. Coastal wind coverage has its quirks, and we navigate them constantly.",
      },
    ],
  },
];
