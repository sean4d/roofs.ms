import type { CityContent } from "@/content/cities/types";
import { citiesBatch2 } from "@/content/cities/batch-2";
import { citiesBatch3 } from "@/content/cities/batch-3";
import { citiesBatch4 } from "@/content/cities/batch-4";

/**
 * Launched city pages (PRD §5). Batch 1 below (Tier 1 + hub cities);
 * batch 2 (Pine Belt + corridor towns) appends from batch-2.ts. Cities
 * not yet launched stay reserved (branded 404) until their unique copy
 * ships: anti-doorway rule, never thin content. Every claim is either
 * general local knowledge, documented storm history, or backed by the
 * real project photos in content/photos.ts (cities without photos never
 * claim completed local work).
 */

const citiesBatch1: CityContent[] = [
  /* ------------------------------------------------------------------ */
  /* Hattiesburg — home base                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "hattiesburg",
    city: "Hattiesburg",
    county: "Forrest & Lamar County",
    driveTime: "0 minutes — this is home",
    metaTitle: "Hattiesburg Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Hattiesburg's hometown roofer: GAF-certified shingle, metal, and commercial roofing from our office on US-98. Free inspections across the Hub City.",
    hero: {
      headline: "Hattiesburg roofing, from Hattiesburg roofers",
      subhead:
        "Our office sits on US-98, our crews live here, and our name rides on roofs from the Avenues to Oak Grove. When the Hub City needs a roofer, we're not driving in — we're already home.",
    },
    intro: {
      title: "The Hub City is our home base",
      paragraphs: [
        "Southeast Roofing is headquartered right here at 6668 US-98, and Hattiesburg work fills our schedule year-round: roof replacements in Oak Grove and Bellevue, repairs in the historic Avenues where mature oaks drop limbs with every storm, and commercial work along the Hardy Street and Highway 49 corridors. This is the market we're judged in daily, at the supply house and the ballpark alike.",
        "Hattiesburg roofs work hard. Pine Belt humidity ages shingles from below while long summers bake them from above, and the tree canopy that makes neighborhoods near USM and William Carey so beautiful also keeps roofs shaded, damp, and littered after every front. Our inspections here read that whole picture — shingles, ventilation, flashing, and the gutters fighting the pine straw.",
        "Being local also means being accountable after the storm. When severe weather hits the Pine Belt, out-of-town crews flood in behind it and vanish just as fast. We're the opposite bet: a MSBOC-licensed, GAF-certified contractor whose office you can drive past — and whose lifetime warranty means something because we'll still be here to honor it.",
      ],
    },
    localAreas: {
      title: "Where you'll find our crews",
      items: [
        "Oak Grove",
        "The Avenues",
        "Downtown & Midtown",
        "Bellevue",
        "Near USM",
        "William Carey area",
        "Palmer's Crossing",
        "Highway 98 corridor",
        "Lake Serene",
        "Rawls Springs",
      ],
    },
    stormContext: {
      title: "A city that knows tornadoes by date",
      text: "Hattiesburg remembers February 2013 and January 2017 — tornadoes that tore across USM, William Carey, and whole neighborhoods. Add yearly hail cells, straight-line winds, and hurricane remnants riding up from the coast, and Hub City roofs earn their inspections. We document storm damage thoroughly and walk homeowners through the insurance process we know inside and out.",
    },
    faqs: [
      {
        question: "Where is Southeast Roofing actually located?",
        answer:
          "6668 US-98, Suite F, right here in Hattiesburg. Our crews are local, our office is staffed, and you're welcome to come see us — a standing address is exactly what separates local contractors from the storm-chasing kind.",
      },
      {
        question: "How fast can you inspect a roof in Hattiesburg?",
        answer:
          "Home-turf fast — typically within a day or two of your call in normal weather, and we triage active leaks the same day whenever possible. The inspection is free and comes with photos of what we found.",
      },
      {
        question:
          "Do you work on the older homes in the Avenues and historic districts?",
        answer:
          "Constantly — steep pitches, older decking, and tree cover are everyday work for us. We repair what the oaks drop and replace roofs in a way that respects how these houses are built.",
      },
      {
        question: "Do you handle commercial roofs in Hattiesburg too?",
        answer:
          "Yes — TPO, EPDM, coatings, metal, and maintenance programs for businesses from downtown to the Highway 49 corridor. Commercial has its own consultation process, starting at our commercial page.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Petal                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "petal",
    city: "Petal",
    county: "Forrest County",
    driveTime: "about 10 minutes",
    metaTitle: "Petal Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement, repair, and storm response in Petal, MS — ten minutes from our Hattiesburg office, with completed Petal projects to show for it.",
    hero: {
      headline: "Petal's roofer from right across the river",
      subhead:
        "The Friendly City sits ten minutes from our office — close enough that Petal calls get same-day attention, and close enough that you've probably driven past our finished roofs without knowing it.",
    },
    intro: {
      title: "Ten minutes away, and it shows",
      paragraphs: [
        "Petal is about the shortest service call we make. From our US-98 office it's a quick run across the Leaf River, which means repairs get scheduled fast, inspections don't wait, and an active leak in Petal is the kind of call we can jump on the same day. The completed roofs in our gallery from Petal neighborhoods are the proof — real projects, real shingles, real cleanup.",
        "Petal's housing runs from established neighborhoods off Central Avenue to newer construction pushing out toward the Evelyn Gandy Parkway, and the roofing needs run just as wide: twenty-year-old shingle roofs due for honest assessments, growing families adding gutters and ventilation, and the tree-heavy lots that keep our repair crews busy after every windstorm.",
        "Like Hattiesburg across the river, Petal knows real storms — the January 2017 tornado is still fresh memory on both sides of the Leaf. When weather hits, our documentation-first storm process and insurance claim help are ten minutes away, not ninety.",
      ],
    },
    localAreas: {
      title: "Around Petal",
      items: [
        "Central Avenue area",
        "Evelyn Gandy Parkway",
        "Highway 42 corridor",
        "Near Petal schools",
        "Leaf River frontage",
        "Sunrise community",
      ],
    },
    stormContext: {
      title: "The Leaf River doesn't stop the weather",
      text: "Petal shared the January 2017 tornado with Hattiesburg and takes the same Pine Belt diet of hail, straight-line winds, and tropical remnants. Our storm inspections document every impact point with photos, and because we're ten minutes out, emergency tarping in Petal moves about as fast as it can anywhere.",
    },
    faqs: [
      {
        question: "Have you actually done roofs in Petal?",
        answer:
          "Yes — completed Petal projects are in our gallery, photographed at real homes here. Local proof matters, and we have it on this side of the river.",
      },
      {
        question: "How quickly can you get to a leak in Petal?",
        answer:
          "We're ten minutes away — active leaks in Petal are usually a same-day conversation. Call us before the next rain gets there first.",
      },
      {
        question: "Do you charge extra to work in Petal?",
        answer:
          "No. Petal is core service area — the same pricing, the same free inspection, and the same itemized proposal as anywhere in the Hattiesburg metro.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Laurel                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "laurel",
    city: "Laurel",
    county: "Jones County",
    driveTime: "about 30 minutes",
    metaTitle: "Laurel Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roofing for the City Beautiful: replacements, repairs, and storm response in Laurel, MS from a GAF-certified Pine Belt contractor 30 minutes away.",
    hero: {
      headline: "Roofing worthy of the City Beautiful",
      subhead:
        "Laurel's historic district didn't get famous by accident — these homes were built with pride, and their roofs deserve the same. We're thirty minutes down I-59 — close enough to treat Laurel like the neighbor it is.",
    },
    intro: {
      title: "Craftsmanship for a town that appreciates it",
      paragraphs: [
        "Laurel's oak-lined historic district holds some of the finest early-1900s homes in Mississippi — steep gables, deep eaves, architecture the whole country now watches on television. Roofing these houses is detail work: pitches that demand experienced crews, valleys and dormers that concentrate water, and streetscapes where a sloppy roofline would stand out for all the wrong reasons. It's exactly the kind of work our best crews ask for.",
        "Beyond the historic avenues, Laurel is a working Pine Belt city — newer neighborhoods, rentals, shops, and the commercial roofs along Highway 15 and I-59. We run the full lineup here: shingle replacements, metal for homes and shops, and flat systems for commercial buildings.",
        "Jones County has also paid its storm dues — the Easter 2020 outbreak that devastated communities like Soso passed close enough that nobody here takes spring skies lightly. When storms cross the county, our inspection and insurance-claim process is thirty minutes behind them.",
      ],
    },
    localAreas: {
      title: "Around Laurel",
      items: [
        "Historic District avenues",
        "Downtown Laurel",
        "West Laurel",
        "Mason Park area",
        "Highway 15 corridor",
        "Near Sandersville",
        "Sharon & Powers communities",
      ],
    },
    stormContext: {
      title: "Jones County spring skies demand respect",
      text: "The Easter 2020 tornado outbreak is recent memory in Jones County, and every spring brings more watches than anyone counts. Hail bruising and wind-lifted shingles often hide until they leak — our free storm inspections find them while the insurance window is still open.",
    },
    faqs: [
      {
        question:
          "Can you handle the steep roofs in Laurel's historic district?",
        answer:
          "That's the work we enjoy most. Steep-slope experience, proper equipment, and crews who understand older construction — including decking surprises — are what these homes require, and what we bring.",
      },
      {
        question: "Do you regularly work in Laurel?",
        answer:
          "Yes — Jones County is core territory for our crews, thirty minutes up I-59, and Laurel calls fit our schedule fast.",
      },
      {
        question: "Is Laurel too far for small repairs?",
        answer:
          "Not at all — thirty minutes down I-59 is an easy run. Repairs, gutter work, and inspections in Laurel are routine scheduling, not special trips.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Gulfport                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "gulfport",
    city: "Gulfport",
    county: "Harrison County",
    driveTime: "about 70 minutes",
    metaTitle: "Gulfport Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Coast-grade roofing in Gulfport, MS: hurricane-season expertise, salt-air-aware inspections, and completed Gulfport projects from a GAF-certified contractor.",
    hero: {
      headline: "Coast-grade roofing for Gulfport",
      subhead:
        "Mississippi's second-largest city lives with the Gulf's beauty and its bill: hurricanes, salt air, and sun that never lets up. We build roofs here that take the coast seriously — with finished Gulfport projects to show it.",
    },
    intro: {
      title: "Roofing where the coast sets the rules",
      paragraphs: [
        "Gulfport roofs live a harder life than roofs an hour north. Salt air works on fasteners and flashing year-round, coastal sun cooks southern exposures, and every June the calendar turns toward hurricane season with names nobody here needs reminding about. Roofing on the Coast means specifying for all of it — wind-rated installation, corrosion-aware metal choices, and honest talk about what different systems endure at the beach versus up in Orange Grove.",
        "We work Gulfport from Bayou View to North Gulfport and along the Highway 49 spine, and our gallery carries completed Gulfport work photographed on real job sites. The drive from Hattiesburg is a straight seventy-minute shot down 49 — close enough for responsive scheduling, far enough that we plan Coast days efficiently and communicate timing straight.",
        "Katrina rebuilt this city's relationship with roofs, and Zeta in 2020 refreshed the lesson: on the Coast, the roof is the house's first line. Our storm documentation and claim assistance were built for exactly this market — thorough, photographed, and honest about what insurers need to see.",
      ],
    },
    localAreas: {
      title: "Around Gulfport",
      items: [
        "Bayou View",
        "Orange Grove",
        "North Gulfport",
        "Downtown & Jones Park area",
        "Highway 49 corridor",
        "Lyman",
        "Near the Port",
      ],
    },
    stormContext: {
      title: "Hurricane season is a fact of life here",
      text: "From Katrina to Zeta, Gulfport measures its history in landfalls. Wind-rated installation, sealed roof edges, and post-storm documentation aren't upsells on the Coast — they're the job. When a system comes ashore, our crews and our claim-assistance process head south.",
    },
    faqs: [
      {
        question: "Do you really cover Gulfport from Hattiesburg?",
        answer:
          "Yes — Highway 49 makes it a straight seventy-minute run, and the Coast is core service area with completed Gulfport projects in our gallery. We schedule Coast work in efficient blocks and show up when we say.",
      },
      {
        question: "What should a Gulfport roof be built to withstand?",
        answer:
          "Wind first: proper fastening schedules, sealed edges, and wind-rated systems installed to spec. We'll also talk honestly about salt exposure near the water — it changes what metal and fastener choices make sense.",
      },
      {
        question: "Can you help with hurricane insurance claims on the Coast?",
        answer:
          "That's central to what we do — thorough photo documentation, reports in the format adjusters expect, and on-site adjuster meetings. Coastal wind claims have their own quirks, and we navigate them constantly.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Biloxi                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "biloxi",
    city: "Biloxi",
    county: "Harrison County",
    driveTime: "about 80 minutes",
    metaTitle: "Biloxi Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement, repair, and hurricane response in Biloxi, MS — from Back Bay to Woolmarket, with completed Biloxi projects from a GAF-certified contractor.",
    hero: {
      headline: "Biloxi roofs, built for the Back Bay and beyond",
      subhead:
        "From East Biloxi cottages to Woolmarket acreage, this city's roofs face the Gulf head-on. We bring coast-grade installation and real completed Biloxi projects — not promises from a phone bank.",
    },
    intro: {
      title: "A working coast city with working roofs",
      paragraphs: [
        "Biloxi is layers of coast life — the peninsula neighborhoods of East Biloxi, homes ringing the Back Bay, Keesler's shadow over the west side, and the newer growth north through Cedar Lake and Woolmarket. Each layer roofs a little differently: peninsula homes take the saltiest air and the most direct wind, while north-of-the-bay neighborhoods trade some salt for pine exposure. Our inspections here account for which Biloxi you live in.",
        "Our gallery includes completed Biloxi replacements photographed at real homes, and the eighty-minute run from Hattiesburg puts the whole city inside our core radius. Residential shingle and metal lead the Biloxi work, with commercial systems for the businesses that keep the city running between the water and I-10.",
        "This is also the city that taught the region what hurricanes cost. From Camille to Katrina to Zeta, Biloxi's roof history is written in storm names — which is why our storm-response process leads with documentation and why we talk wind ratings before we talk colors.",
      ],
    },
    localAreas: {
      title: "Around Biloxi",
      items: [
        "East Biloxi",
        "Back Bay",
        "Woolmarket",
        "Cedar Lake",
        "North Biloxi",
        "Near Keesler AFB",
        "West Biloxi",
      ],
    },
    stormContext: {
      title: "From Camille to Zeta, Biloxi knows",
      text: "No Mississippi city carries more hurricane memory than Biloxi. Roofs here get specified for wind and installed like the next landfall is coming — because eventually it is. After any named storm, our documentation-first inspections and claim assistance work the peninsula and the bay neighborhoods alike.",
    },
    faqs: [
      {
        question: "Do you have completed projects in Biloxi?",
        answer:
          "Yes — real Biloxi roofs, photographed on our own job sites, are in our project gallery. We're not new to the Coast.",
      },
      {
        question: "Does salt air really change roofing choices in Biloxi?",
        answer:
          "Near the water, meaningfully — fastener and flashing corrosion accelerates, and metal system finishes matter more. North of the bay it eases. We spec by where the house actually sits, not by zip code generalities.",
      },
      {
        question: "How fast can you respond after a hurricane hits the Coast?",
        answer:
          "We stage for it: after a landfall, Coast calls get triaged by severity and our crews run 49 south daily. You'll get honest timing when you call — and thorough documentation the moment we're on the roof.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Picayune                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "picayune",
    city: "Picayune",
    county: "Pearl River County",
    driveTime: "about 55 minutes",
    metaTitle: "Picayune Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Picayune, MS — Pearl River County's hurricane corridor, served by a GAF-certified contractor with completed Picayune projects.",
    hero: {
      headline: "Picayune roofing, in the storm corridor",
      subhead:
        "Pearl River County sits where hurricanes come up from the marsh still swinging. We roof Picayune with that map in mind — and with finished Picayune projects already in our gallery.",
    },
    intro: {
      title: "Where the coast weather comes inland",
      paragraphs: [
        "Picayune's geography is its roofing story: far enough from the beach to skip the salt, close enough that hurricanes arrive barely weakened — Katrina's eye passed practically overhead on its way north. Homes here, from the older neighborhoods around downtown to Hide-A-Way Lake and the country properties toward Nicholson, need wind-serious installation more than almost anywhere inland.",
        "We serve Picayune down I-59 in under an hour, and our gallery carries completed Picayune replacements photographed at real homes. Shingle systems fastened to spec lead the work here, with metal a growing favorite on the larger properties, and repairs that keep pine-country roofs ahead of the weather.",
        "Pearl River County's pines are the other half of the story — beautiful, everywhere, and rough on roofs. Straight-line winds turn limbs into projectiles and pine straw into gutter dams, which is why our Picayune inspections always look at the trees as hard as the shingles.",
      ],
    },
    localAreas: {
      title: "Around Picayune",
      items: [
        "Downtown Picayune",
        "Hide-A-Way Lake",
        "Nicholson",
        "I-59 corridor",
        "Near Stennis",
        "Carriere",
      ],
    },
    stormContext: {
      title: "Hurricanes don't stop at the beach",
      text: "Katrina proved Pearl River County takes hurricane cores, not just remnants. Between landfalls, spring squall lines and pine-country windstorms keep the repair calls coming. Our storm inspections document everything, and I-59 puts us in Picayune fast when the weather clears.",
    },
    faqs: [
      {
        question: "Have you done work in Picayune before?",
        answer:
          "Yes — completed Picayune projects are photographed in our gallery. Pearl River County is established territory for us, not a stretch.",
      },
      {
        question: "What matters most on a Picayune roof?",
        answer:
          "Wind performance without the salt compromise: proper fastening schedules, sealed edges, and systems chosen for hurricane exposure. Then tree strategy — because the pines always get a vote.",
      },
      {
        question: "Do you handle insurance claims this far south?",
        answer:
          "Absolutely — hurricane and wind claims are our daily work across the whole radius. Documentation, adjuster meetings, honest guidance, same as at home in Hattiesburg.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Brookhaven                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "brookhaven",
    city: "Brookhaven",
    county: "Lincoln County",
    driveTime: "about 80 minutes",
    metaTitle: "Brookhaven Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roofing for the Home Seeker's Paradise — replacement, repair, and storm response in Brookhaven, MS from a GAF-certified Mississippi contractor.",
    hero: {
      headline: "Roofing for the Home Seeker's Paradise",
      subhead:
        "Brookhaven's historic homes and oak-shaded streets earned the town its slogan. Keeping those roofs right takes a contractor who works to that standard — licensed, certified, and honest about every line item.",
    },
    intro: {
      title: "A town that takes its homes seriously",
      paragraphs: [
        "Brookhaven wears its nickname well: streets of well-kept historic homes, a downtown that still works, and homeowners who maintain what they own. That's our kind of market. Roofing here ranges from steep-pitched older homes near the historic district — detail work with older decking underneath — to newer construction ringing town and the farms and shops of greater Lincoln County.",
        "We cover Brookhaven from Hattiesburg via Highway 84, about eighty minutes door to door, as part of our western service arc with McComb. Replacements and storm work anchor the schedule out here, and our itemized digital proposals travel well — you'll see every line and price before we load a single truck, no matter how far from our office you live.",
        "Lincoln County sits squarely in Mississippi's spring severe-weather belt, where I-55 corridor storms drop hail and spin up tornadoes with regularity. After weather moves through, our documentation-first inspections tell you honestly whether you have a claim — or just a good story.",
      ],
    },
    localAreas: {
      title: "Around Brookhaven",
      items: [
        "Historic district",
        "Downtown Brookhaven",
        "Ole Brook neighborhoods",
        "Highway 84 corridor",
        "Bogue Chitto",
        "Greater Lincoln County",
      ],
    },
    stormContext: {
      title: "The I-55 corridor breeds spring storms",
      text: "Southwest Mississippi's stretch of the I-55 corridor sees some of the state's most regular severe weather — hail cores and tornado warnings are spring routine in Lincoln County. Wind-lifted shingles and hail bruising hide until they leak; our free storm inspections find them while the insurance clock is still friendly.",
    },
    faqs: [
      {
        question: "Is Brookhaven really within your service area?",
        answer:
          "Yes — Brookhaven anchors our western arc along with McComb. It's about eighty minutes from our Hattiesburg office, planned into regular scheduling rather than treated as a special trip.",
      },
      {
        question: "Can you work on Brookhaven's older historic homes?",
        answer:
          "That's a specialty we enjoy — steep pitches, board decking, and architectural details that deserve care. We inspect thoroughly first so the proposal reflects what's really up there.",
      },
      {
        question: "How do estimates work this far from your office?",
        answer:
          "Identically: free inspection, photos of what we find, and an itemized digital proposal to your email with every line priced. Distance changes none of it.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* McComb                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "mccomb",
    city: "McComb",
    county: "Pike County",
    driveTime: "about 90 minutes",
    metaTitle: "McComb Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement, repair, and storm response in McComb, MS — the Camellia City, served by a GAF-certified Mississippi contractor with itemized proposals.",
    hero: {
      headline: "McComb roofing, done the Camellia City way",
      subhead:
        "A railroad town that built things to last deserves roofs built the same. We serve Pike County from Hattiesburg with licensed crews, itemized proposals, and storm response that shows up when the sky clears.",
    },
    intro: {
      title: "The western edge of our radius, not the edge of our effort",
      paragraphs: [
        "McComb marks the western reach of our two-hour service arc, and we treat it like it matters — because Pike County homeowners have the same problem everyone else does: finding a roofer who's licensed, insured, and still answering the phone next year. We bring our full process west on Highway 98: free inspections, photo documentation, and digital proposals priced to the line.",
        "The housing here tells the railroad story — sturdy older homes in McComb's historic neighborhoods, mid-century streets, and rural properties spreading toward Summit and Magnolia. Steep older pitches and long-serving shingle roofs dominate the inspection requests, with metal gaining ground on country properties that want to reroof once and be done.",
        "Pike County shares the I-55 corridor's stormy springs with its Lincoln County neighbors — tornado-warned nights and hail runs are a known cost of living here. When weather crosses the county, our storm documentation and insurance-claim assistance make the ninety-minute trip worth exactly nothing to you: same process, same thoroughness, same follow-through.",
      ],
    },
    localAreas: {
      title: "Around McComb",
      items: [
        "Historic downtown",
        "North McComb",
        "Summit",
        "Magnolia",
        "Highway 98 corridor",
        "Greater Pike County",
      ],
    },
    stormContext: {
      title: "Pike County springs come in loud",
      text: "The southwest corner of Mississippi catches the I-55 storm corridor at full strength — spring hail and tornado activity are regular visitors to Pike County. Our free post-storm inspections document damage honestly, including the times the honest answer is that your roof held fine.",
    },
    faqs: [
      {
        question: "Is McComb too far for you to service properly?",
        answer:
          "No — it defines our western boundary and we schedule it deliberately. Inspections, replacements, and storm response all run on the same standards as our Hattiesburg home turf.",
      },
      {
        question: "What does a roof replacement look like this far out?",
        answer:
          "The same as everywhere: free inspection, itemized digital proposal, materials staged, most homes completed in one to two days on site, magnetic nail sweep before we leave. Distance is our logistics problem, not yours.",
      },
      {
        question: "Can you meet our insurance adjuster in McComb?",
        answer:
          "Yes — adjuster meetings are part of our claim assistance wherever we work. We schedule them alongside the inspection documentation so the visit counts.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Jackson                                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "jackson",
    city: "Jackson",
    county: "Hinds County",
    driveTime: "about 90 minutes",
    metaTitle: "Jackson Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Jackson, MS — from Fondren to Northeast Jackson, documentation-first roofing from a GAF-certified contractor.",
    hero: {
      headline: "Capital-city roofs, Pine Belt standards",
      subhead:
        "From Fondren bungalows to Northeast Jackson estates, the capital's roofs deserve better than whoever knocked last. We bring our full documentation-first process to the capital — itemized proposals, honest scheduling, no shortcuts.",
    },
    intro: {
      title: "Jackson is worth the drive",
      paragraphs: [
        "Jackson's neighborhoods hold some of Mississippi's best residential architecture — the craftsman streets of Fondren and Belhaven, stately Eastover, and the established curves of Northeast Jackson. Roofs here range from historic steep-slope work to sprawling modern hips, and we bring the same documented, itemized standard to all of it.",
        "The metro sits at our radius's northern edge, and we work it deliberately: inspections and estimates scheduled in efficient metro blocks, materials staged so build days start on time, and the same itemized digital proposals that let a Jackson homeowner scrutinize every line before committing to a contractor from out of town — exactly as they should.",
        "Metro weather earns the attention too. Jackson's hail history is the stuff of insurance legend, and spring supercells track the I-20 corridor regularly. Our storm documentation is built for those claims: thorough, photographed, and credible with every adjuster who reads it.",
      ],
    },
    localAreas: {
      title: "Around Jackson",
      items: [
        "Fondren",
        "Belhaven",
        "Eastover",
        "Northeast Jackson",
        "South Jackson",
        "Near downtown",
      ],
    },
    stormContext: {
      title: "Hail capital of the state, some years",
      text: "Jackson's metro catches supercell hail with a regularity that shapes insurance rates statewide. Bruised shingles from a spring hail run may not leak until fall — long after claim windows tighten. Our free inspections after metro hail events document everything while the timeline still works in your favor.",
    },
    faqs: [
      {
        question: "Do you actually work in Jackson, or just claim to?",
        answer:
          "We work it — the metro anchors the northern end of our service radius, and we schedule Jackson jobs in efficient blocks with honest timelines.",
      },
      {
        question: "Why hire a Hattiesburg roofer in Jackson?",
        answer:
          "Because accountability travels: MSBOC license #R22245, GAF certification, itemized proposals, and a company that's existed at the same address through every storm season. If that beats your local alternatives, the ninety minutes is our problem, not yours.",
      },
      {
        question: "Can you handle hail claims in the metro?",
        answer:
          "Hail documentation is a core competency — soft-metal evidence, bruise mapping, and reports adjusters take seriously. We can meet your adjuster on the roof anywhere in the metro.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Meridian                                                            */
  /* ------------------------------------------------------------------ */
  {
    slug: "meridian",
    city: "Meridian",
    county: "Lauderdale County",
    driveTime: "about 85 minutes",
    metaTitle: "Meridian Roofing Contractor, MS | Repair & Replacement",
    metaDescription:
      "Roof replacement and repair in Meridian, MS — the Queen City's historic homes and modern neighborhoods, served in dedicated East Mississippi scheduling blocks.",
    hero: {
      headline: "Queen City roofs, treated like royalty",
      subhead:
        "Meridian's historic districts hold architecture most of Mississippi envies — and roofs that demand real craft. We make the run up Highway 45 with our full process aboard — inspection to itemized proposal to final walkthrough.",
    },
    intro: {
      title: "East Mississippi's anchor city",
      paragraphs: [
        "Meridian built big when it was Mississippi's largest city, and the legacy shows: ornate rooflines in the historic districts, solid mid-century neighborhoods like Poplar Springs and North Hills, and a downtown whose restoration keeps gaining steam. Roofing the Queen City spans that whole range — steep historic work, straightforward family-home replacements, and the commercial systems that keep downtown's revival dry.",
        "The city marks the northeastern point of our service radius — about eighty-five minutes up Highway 45 from Hattiesburg. We schedule East Mississippi work in dedicated blocks, which keeps our crews efficient and your timeline honest.",
        "Lauderdale County weather splits the difference between Pine Belt and Alabama storm country: spring fronts that mean business, summer downpours, and enough hail history to keep adjusters familiar with the area. Our documentation-first storm process translates perfectly — evidence, photos, and straight answers about whether a claim makes sense.",
      ],
    },
    localAreas: {
      title: "Around Meridian",
      items: [
        "Historic districts",
        "Poplar Springs",
        "North Hills",
        "Downtown Meridian",
        "Highway 45 corridor",
        "Near NAS Meridian",
      ],
    },
    stormContext: {
      title: "Where Pine Belt weather meets Alabama's",
      text: "Lauderdale County catches storm systems from two directions — Pine Belt squall lines and the supercells that ride toward the Alabama line. Wind and hail claims are regular business here, and our inspections document them to the standard adjusters expect.",
    },
    faqs: [
      {
        question: "Do you really cover Meridian from Hattiesburg?",
        answer:
          "Yes — about eighty-five minutes up Highway 45, comfortably inside our two-hour radius. East Mississippi is established service area for us.",
      },
      {
        question: "Can you handle the historic homes near downtown?",
        answer:
          "Gladly — steep pitches, complex rooflines, and older decking are familiar work. We inspect carefully first so the proposal matches the roof that's actually up there.",
      },
      {
        question: "How does scheduling work for Meridian projects?",
        answer:
          "We batch East Mississippi work into dedicated blocks — your inspection, materials, and build days get planned together, so an 85-minute drive never turns into a delayed project.",
      },
    ],
  },
];

export const cities: CityContent[] = [
  ...citiesBatch1,
  ...citiesBatch2,
  ...citiesBatch3,
  ...citiesBatch4,
];

export function getCity(slug: string): CityContent | undefined {
  return cities.find((city) => city.slug === slug);
}
