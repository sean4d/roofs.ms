import type { FaqEntry } from "@/lib/schema";

/**
 * Site-wide FAQ (the /faq page).
 *
 * Google Business Profile Q&A is NOT enabled on this profile, so the
 * question-intent traffic that would land there has to be captured here
 * instead. These are written the way people actually ask them out loud, 
 * which is also how they get asked to AI assistants and voice search, and
 * every answer sticks to facts already established elsewhere on the site
 * (license, certifications, service area, pricing posture, insurance stance).
 *
 * Grouped so the page can render sections; the FAQPage schema flattens them.
 */

export interface FaqGroup {
  id: string;
  title: string;
  faqs: FaqEntry[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "getting-started",
    title: "Getting started",
    faqs: [
      {
        question: "Do you offer free roof inspections?",
        answer:
          "Yes. Inspections, measurements, and an itemized written proposal are completely free with no obligation, anywhere in South Mississippi. We document everything with photos so you can see exactly what we see, including when the honest answer is that your roof is fine and needs nothing.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We're based in Hattiesburg and serve all of South Mississippi: including Petal, Laurel, Columbia, Purvis, Sumrall, Ellisville, Wiggins, Poplarville, Picayune, Lucedale, Waynesboro, Richton, Seminary, Bay St. Louis, Diamondhead, Long Beach, Gulfport, Biloxi, D'Iberville, Ocean Springs, and the communities in between.",
      },
      {
        question: "How soon can you come out after a storm?",
        answer:
          "We prioritize active leaks and storm damage, and our emergency line is open 24/7 for tarping and urgent response. Because we're local, we're here before the storm, during the cleanup, and long after the out-of-town crews have moved on.",
      },
      {
        question: "How do I get a price without anyone coming out?",
        answer:
          "Two ways. Our free roof cost calculator gives you a ballpark range in seconds from your home's size, pitch, and material. The instant estimate tool prices your actual roof from aerial measurements using just your address. For a contract-grade number we still need to look at the decking, flashing, and ventilation: that's the free inspection.",
      },
    ],
  },
  {
    id: "credentials",
    title: "Licensing, insurance & trust",
    faqs: [
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. We're licensed by the Mississippi State Board of Contractors (MSBOC #R22245), carry general liability and workers' compensation insurance, are a GAF Certified Contractor, and hold an A+ rating with the BBB. We're glad to provide documentation for any of it before you commit to anything.",
      },
      {
        question: "Do roofers in Mississippi have to be licensed?",
        answer:
          "Commercial work and larger residential projects fall under the Mississippi State Board of Contractors. Always ask any roofer for their license number and confirm it's current, and ask for proof of liability and workers' compensation insurance too, regardless of job size. If an uninsured worker is hurt on your roof, you don't want that liability landing on you.",
      },
      {
        question: "What is a GAF Certified Contractor?",
        answer:
          "GAF certifies contractors it has vetted and trained to install its roofing systems to specification. It's a manufacturer's stamp that the roofer meets a standard, and it's something you can verify directly on GAF's website rather than taking our word for it.",
      },
      {
        question: "How do I avoid storm-chasing contractors?",
        answer:
          'Ask for a Mississippi license number and check it. Ask for a physical local address you could drive to. Be wary of anyone who knocked on your door uninvited, pressures you to sign today, wants a large payment up front, asks for the insurance check signed over to them, or offers to "waive your deductible": that last one is insurance fraud, and it tells you how they do business.',
      },
    ],
  },
  {
    id: "cost",
    title: "Cost, quotes & financing",
    faqs: [
      {
        question: "How much does a new roof cost in Hattiesburg?",
        answer:
          "It depends on size, pitch, material, and what we find under the old roof. Many full replacements in our area land in the low five figures, and metal or complex roofs run higher. Our proposals price every component on its own line: shingle, underlayment, ice and water shield, starter, ridge cap, disposal, so nothing is hidden inside a lump sum. The honest answer for your roof comes from a free, measured inspection.",
      },
      {
        question: "Why do roofing quotes vary so much between companies?",
        answer:
          "Usually because they're different scopes wearing the same units. A per-square rate tells you nothing until you know whether it includes tear-off and disposal, a decking allowance, starter and ridge cap, and code-required ventilation. Two quotes thousands apart are often the same roof with different things quietly left out. Line items make scopes comparable; lump sums make them foggy.",
      },
      {
        question: "Do you offer financing?",
        answer:
          "Yes. We offer $0-down financing options through GoodLeap so a roof replacement doesn't have to drain your savings. We'll show you the financed monthly figure alongside the total, so you can decide with the whole picture in front of you.",
      },
      {
        question: "Do you charge for the inspection or the proposal?",
        answer:
          "No. The inspection, the measurements, and the itemized proposal are all free with no obligation. You keep the proposal whether or not you hire us.",
      },
    ],
  },
  {
    id: "insurance",
    title: "Storm damage & insurance claims",
    faqs: [
      {
        question: "Do you help with storm damage insurance claims?",
        answer:
          "Yes, roughly half our work is insurance restoration. We document the damage the way a claim file needs it, meet your adjuster on the roof, and build to the approved scope. What we never do is promise your claim will be approved (that decision belongs to your insurer under your policy) or offer to cover your deductible.",
      },
      {
        question: "Should I file a claim for any roof damage?",
        answer:
          "Not automatically. If the repair costs less than your deductible, filing gains you nothing and adds a claim to your history. Our free inspection gives you the honest repair number first, so you can make that call with real information instead of guessing.",
      },
      {
        question: "The insurance estimate seems low. Is that final?",
        answer:
          "No, scopes get supplemented routinely when documented damage was missed. That's a matter of photographs and paperwork, and handling that documentation is part of the job for us.",
      },
      {
        question: "Is emergency tarping covered by insurance?",
        answer:
          "Generally yes. Policies expect you to take reasonable steps to prevent further damage after a covered loss, and professional tarping is exactly that. Keep the invoice: it goes in the claim file.",
      },
    ],
  },
  {
    id: "materials",
    title: "Materials & the work itself",
    faqs: [
      {
        question: "What roofing materials do you install?",
        answer:
          "Asphalt shingles (we're GAF certified and install Timberline HDZ most often), standing seam and exposed-fastener metal, and commercial flat systems including TPO, EPDM, modified bitumen, and roof coatings. We also install seamless gutters, leaf guard, fascia, soffit, and roof ventilation.",
      },
      {
        question: "Is a metal roof worth the extra cost?",
        answer:
          "It depends on how long you're staying. A quality metal roof can outlast two shingle roofs, so over the long haul the premium is commonly easier to justify. If you expect to move within a decade, a quality architectural shingle roof usually makes more financial sense. We install both and quote them side by side from one inspection, so you decide with real numbers for your roof.",
      },
      {
        question: "How long does a roof last in South Mississippi?",
        answer:
          "Our heat, humidity, and hurricane season age roofs faster than national averages suggest. Architectural shingles typically deliver about 15–25 years here, 3-tab roughly 15–20, quality metal often 40 or more, and commercial flat systems about 20–30 depending on the system and maintenance.",
      },
      {
        question: "Do I need a full replacement or just a repair?",
        answer:
          "Localized damage on a roof with life left in it is usually a repair, and when that's genuinely enough, that's what we'll recommend. Leaks across multiple slopes, widespread granule loss on a 20-year-old roof, or repairs that keep coming back point to replacement. Our inspection gives you the answer with photo evidence and both options priced.",
      },
      {
        question: "How long does a roof replacement take?",
        answer:
          "Most residential replacements are a single day, start to finish, including tear-off, decking repairs, installation, and cleanup. Larger, steeper, or more complex roofs can run into a second day. We'll tell you the realistic timeline before we start.",
      },
      {
        question: "What happens if you find rotten decking?",
        answer:
          "We replace it, priced per sheet, and we tell you up front that it's a possibility so it's never a surprise mid-job. You'll see photos of what was underneath. An honest contractor prices that risk before tear-off instead of springing it on you once the roof is open.",
      },
    ],
  },
];

/** Flat list for FAQPage structured data and search. */
export const allFaqs: FaqEntry[] = faqGroups.flatMap((g) => g.faqs);
