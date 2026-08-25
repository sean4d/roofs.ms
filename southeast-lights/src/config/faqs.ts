/**
 * FAQ content.
 *
 * Written answer-first: the first sentence of every answer is a complete,
 * quotable response. AI assistants extract the opening sentence, so burying
 * the answer after a paragraph of preamble makes the content unciteable.
 *
 * These feed both the visible FAQ sections and FAQPage JSON-LD. Schema is
 * emitted only for questions actually rendered on that page, never as
 * invisible markup.
 */

export type FaqCategory =
  | "pricing"
  | "service"
  | "roof"
  | "scheduling"
  | "permanent"
  | "commercial"
  | "coverage";

export interface Faq {
  question: string;
  answer: string;
  category: FaqCategory;
}

export const FAQS: Faq[] = [
  {
    category: "pricing",
    question: "How much does professional Christmas light installation cost?",
    answer:
      "Most professional residential displays run between $1,500 and $5,000 for the season, and we do not take residential projects under $1,000. Roofline lighting is priced at about $10 per linear foot, with two-story and steep sections adding to that. Trees, columns, windows and pathway lighting are priced separately. The price covers the entire season including design, installation, maintenance, takedown and storage.",
  },
  {
    category: "pricing",
    question: "Why do residential installations start at $1,000?",
    answer:
      "Because a professional installation is a season-long service, not an afternoon of hanging lights. That price covers commercial-grade lighting custom cut to your house, a designed layout, installation by insured crews, every service call during the season, removal in January, and labeled storage until next year. Big-box light kits cost less because you are buying a box and doing all of that yourself, at height, on your own roof.",
  },
  {
    category: "pricing",
    question: "What affects the price of a holiday lighting installation?",
    answer:
      "Linear footage is the largest factor, followed by height and roof pitch, then the number of added features like trees, columns and windows. A single-story ranch with 130 feet of roofline is straightforward. The same footage on a steep two-story with dormers takes longer, requires more equipment and carries more risk, so it costs more. Wrapped trees are priced by size and are usually the single largest line item on a large display.",
  },
  {
    category: "service",
    question: "Do I own the lights?",
    answer:
      "No. Seasonal lighting remains the property of Southeast Lights, and that is deliberately how the service works. Because the lights are ours, we are the ones responsible for maintaining them, removing them, storing them properly and bringing them back next season. You are buying a finished display and a season of service, not a box of product you have to store in your attic.",
  },
  {
    category: "service",
    question: "Do you install lights I already own?",
    answer:
      "No, we do not install customer-supplied Christmas lights. We install commercial-grade materials that we cut, assemble and maintain ourselves, because we warrant the display through the season and cannot stand behind product we did not supply. Permanent architectural lighting is different: that system is installed permanently and belongs to you.",
  },
  {
    category: "service",
    question: "What is included in the price?",
    answer:
      "Design, commercial-grade lighting custom cut to your property, all cords, connections and timers, professional installation, in-season maintenance and repairs, takedown after the season, and labeled storage until next year. One agreed price covers the whole season with no separate service-call charges for normal failures.",
  },
  {
    category: "service",
    question: "What happens if a bulb or a section fails?",
    answer:
      "Call or text us and we will come fix it, at no additional charge. Normal in-season failures like a dead bulb, a failed section, a strand issue or ordinary storm-related damage are covered as part of the service. We typically aim to be back out the next business day. Deliberate damage to equipment is handled case by case.",
  },
  {
    category: "service",
    question: "Is maintenance really included?",
    answer:
      "Yes. In-season maintenance is part of the seasonal price, not an add-on. For larger commercial and community installations we also run our own periodic night inspections roughly every couple of weeks, so we usually find and fix problems before anyone on your side notices them.",
  },
  {
    category: "roof",
    question: "Will you damage my roof or my shingles?",
    answer:
      "Our standard installation method does not put holes in your roof. We use non-penetrating clips designed for shingles, gutters and trim, plus hot glue where a clip will not work. We do not use staples, screws or nails in a standard installation. Southeast Lights is operated by a licensed roofing contractor, so the crews on your roof are the same people who understand what a roof can and cannot take.",
  },
  {
    category: "roof",
    question: "Do you use staples or nails?",
    answer:
      "No. Standard installations use non-penetrating clips and, where appropriate, hot glue. Staples, screws and nails are not part of our normal method and would only ever be used if a customer specifically requested a different installation approach and we agreed to it in writing.",
  },
  {
    category: "roof",
    question: "Do you work on steep roofs?",
    answer:
      "Yes. Steep and multi-story roofs are routine for us because we come out of roofing. Crews use professional ladders, roof-traction footwear and pitch equipment for residential work, and boom lifts, bucket trucks or articulating lifts for commercial properties. Roofs over a 9/12 pitch carry a surcharge because they genuinely take longer and require more equipment.",
  },
  {
    category: "roof",
    question: "Why hire a roofing contractor to hang Christmas lights?",
    answer:
      "Because the hazard in this job is not the lights, it is the height. Falls from ladders and roofs cause serious injuries every holiday season, and most of them happen to homeowners. Our crews work on roofs professionally year-round: they know how to read a pitch, where to set a ladder, how to move on shingles without damaging them, and where a light clip can and cannot go.",
  },
  {
    category: "scheduling",
    question: "When do you install Christmas lights?",
    answer:
      "Installations run from roughly October through December, and we book them starting in August. Earlier bookings choose their install week. By late November remaining dates are limited, and large commercial or community projects usually need to be scheduled well before that because of crew and lift availability.",
  },
  {
    category: "scheduling",
    question: "When do you take the lights down?",
    answer:
      "Takedown normally begins in mid-January and runs through the following weeks. You can request a preferred window and we will do our best to accommodate it, though specific dates are not guaranteed. If you need lights removed earlier than mid-January, tell us and we will arrange it.",
  },
  {
    category: "scheduling",
    question: "Do you store the lights?",
    answer:
      "Yes, storage is included. After takedown your display is labeled, organised and stored in our warehouse under your property's name. That is also why reinstallation the following year is faster and why the display looks identical season to season: it is the same lighting, cut to the same house.",
  },
  {
    category: "scheduling",
    question: "Do returning customers get priority?",
    answer:
      "Yes, automatically. Returning customers are scheduled before we open the calendar to new bookings, and you do not have to sign up for anything to get that. We may also take reservations for the following year during December.",
  },
  {
    category: "permanent",
    question: "What is permanent architectural lighting?",
    answer:
      "It is a track of individually controlled LEDs installed permanently into the trim and eaves of your home, controlled from an app. It produces warm white light on an ordinary evening, any colour combination for a holiday or a game day, and it is designed to be effectively invisible from the street during daylight. Unlike seasonal lighting, the system belongs to you once installed.",
  },
  {
    category: "permanent",
    question: "How does permanent lighting compare to seasonal Christmas lights?",
    answer:
      "Seasonal lighting is a service you pay for every year; permanent lighting is a one-time installation you own. For a typical 150-foot home, seasonal roofline lighting runs about $1,500 a season while permanent lighting is a single installed cost, which works out to roughly three to four seasons of renting. The difference is that permanent lighting works all 365 days instead of six weeks.",
  },
  {
    category: "permanent",
    question: "Do you install JellyFish Lighting?",
    answer:
      "We install permanent architectural lighting systems and can discuss JellyFish and comparable systems with you during design. We are not an authorised dealer for any permanent lighting manufacturer, so we position this work as permanent architectural lighting and are happy to walk you through the options and what we can source for your project.",
  },
  {
    category: "permanent",
    question: "Will permanent lighting damage my roof?",
    answer:
      "The mounting channel attaches to trim and fascia rather than penetrating the roof surface, so the water-shedding part of your roof stays intact. This is the exact question a roofing contractor is best placed to answer, and it is the main reason customers choose us for permanent installations over a general electrical or lighting contractor.",
  },
  {
    category: "commercial",
    question: "Do you light commercial properties and HOAs?",
    answer:
      "Yes, and it is the work we are built for. We light HOAs and master-planned communities, churches, municipalities, hotels and resorts, country clubs, retail centers, restaurants, apartment communities and commercial buildings. Commercial projects get a written scope, a design concept, proof of insurance and a fixed seasonal price rather than a verbal quote.",
  },
  {
    category: "commercial",
    question: "Do commercial projects include design renderings?",
    answer:
      "Yes, we can provide visual lighting concepts for commercial and community projects. Send us photographs of the property, or a site plan if you have one, and we will show you what the finished display would look like before you commit to anything. This matters most for HOA boards and committees who need to show a decision to other people.",
  },
  {
    category: "commercial",
    question: "How quickly do you respond to maintenance calls?",
    answer:
      "Our goal is next-business-day service for in-season maintenance. For larger commercial and community installations we also run scheduled night inspections roughly every couple of weeks, which means most failures are found and corrected by us before anyone reports them.",
  },
  {
    category: "commercial",
    question: "Are you licensed and insured?",
    answer:
      "Yes. Southeast Lights operates as the lighting division of Southeast Roofing LLC, a licensed Mississippi roofing contractor, and this work is covered by the same licence and the same insurance. Certificates of insurance are available on request for commercial, HOA and municipal projects.",
  },
  {
    category: "coverage",
    question: "How far do you travel?",
    answer:
      "Residential displays are normally within about an hour of Hattiesburg, and commercial work within about two hours, covering South Mississippi and the Gulf Coast. For larger commercial and community projects we travel statewide. If a project is substantial, distance is a scheduling question rather than a reason to say no.",
  },
  {
    category: "coverage",
    question: "Do you do Mardi Gras lighting?",
    answer:
      "Yes, particularly along the Gulf Coast. Purple, green and gold lighting on rooflines, balconies, columns and trees for businesses, hospitality properties, communities and homes. Many Coast properties book a Christmas display and a Mardi Gras display together, which is more efficient than treating them as separate projects.",
  },
  {
    category: "coverage",
    question: "Can I upload photos to get a quote?",
    answer:
      "Yes, and it speeds everything up. Photos of your property, along with the address, let us measure from aerial imagery and quote accurately without scheduling a site visit first. Most residential quotes never need anyone to come out before you decide.",
  },
  {
    category: "coverage",
    question: "Do you need to visit my property before quoting?",
    answer:
      "Usually not. We can quote most residential projects from the address, aerial imagery, your photographs and a short conversation. Larger commercial and community projects often do warrant a site visit to check access, power and lift positioning, and we will arrange that with enough notice to be convenient.",
  },
  {
    category: "service",
    question: "How long does installation take?",
    answer:
      "Most residential installations are completed in a single day, often in a few hours. Larger homes with extensive tree work can take two days. Commercial and community projects are scheduled across multiple days depending on scope, lift requirements and how much of the work has to happen outside business hours.",
  },
  {
    category: "service",
    question: "Can I choose the colours?",
    answer:
      "Yes. Most of our work is warm white C9, which is the classic look and the one that reads as expensive from the road, but we install pure white, red and white, red and green, and multicolour. Colour choice does not change the price. We will tell you honestly which choices suit your architecture.",
  },
  {
    category: "service",
    question: "Do you provide timers?",
    answer:
      "Yes. Timers, cords, connections and all installation hardware are included in the seasonal price. Your display comes on and goes off on a schedule without you doing anything.",
  },
];

export const faqsByCategory = (category: FaqCategory) =>
  FAQS.filter((f) => f.category === category);

export const faqsFor = (categories: FaqCategory[]) =>
  FAQS.filter((f) => categories.includes(f.category));
