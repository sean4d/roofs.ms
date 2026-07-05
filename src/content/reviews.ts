/**
 * Real Google reviews, transcribed verbatim from the owner's Google
 * Business Profile (screenshots supplied + republishing permission
 * granted 2026-07-05). Integrity rules:
 * - Text is quoted as written (typos included) — never edited or embellished
 * - Every entry is verifiable on the live Google profile
 * - No schema.org Review/AggregateRating markup: Google treats
 *   self-collected testimonial markup as self-serving; display only
 * - EXCLUDED: one 5-star review that praises a different company name
 *   ("Roofing Society") — flagged to owner 2026-07-05
 */

export interface GoogleReview {
  name: string;
  /** Relative age as shown on Google at transcription time */
  when: string;
  text: string;
  /** Services line shown on Google, when present */
  services?: string;
}

/** All are 5-star reviews. */
export const googleReviews: GoogleReview[] = [
  {
    name: "Lynne",
    when: "4 months ago",
    text: "Everyone was very professional and courteous. Southeast Roofing worked with us and presented many options of materials and colors. The crew worked fast, but meticulously. The cleanup was more than I expected. I am very pleased. I love the new roof! I do highly recommend Southeast Roofing.",
    services: "Roof inspection, Roof repair, Roof installation",
  },
  {
    name: "Dan",
    when: "3 months ago",
    text: "The production manager Thomas came out and inspected my roof and gave a very detailed explanation of everything that needed to be done. The quote was ready right away and the work was fast and great. Only took one full day to do a full roof replacement with fascia and soffit replacement. I recommend southeast roofing.",
    services: "Roof inspection, Roof installation",
  },
  {
    name: "Jim Blake",
    when: "11 months ago",
    text: "The crew that worked on my roof arrived at like 8 in the morning on July 21st. By 7 pm I had 2 roof tile layers that were completely removed. 6 sheets of roof decking replaced, some fascia replaced and a gutter reattached and a brand new roof. The men who run the business are professional and fair and very easy to work with. We appreciate the hard work of their crew. I was highly impressed.",
  },
  {
    name: "Lashae Jones",
    when: "a year ago",
    text: "Great company. As a first time home buyer I was pretty scared to get a new roof as I had never done it before. They really made the process so easy. They were really nice and had great customer service. They worked around my schedule and was able to give me the roof that I wanted. They helped me throughout the entire process providing information, options, and suggestions. Once i was approved by my insurance, I had a roof almost immediately. Definitely would recommend!!!",
  },
  {
    name: "Raqual Brewer",
    when: "4 months ago",
    text: "We will highly recommend Southeast Roofing to all that need a new roof. Our sales representative Patrick Pitt was instrumental in helping file our insurance claim, and stood by our side from start to finish.",
  },
  {
    name: "Barbara Watts",
    when: "2 months ago",
    text: "Southeast Roofing Co is the best I've seen i've never seen a roof like this before. It is so unique and detailed as if they took many pieces of assorted colors took their time and place them to look as if weaving them in a basket formation. I gladly give them a five star rating",
  },
  {
    name: "Barbara Blount",
    when: "3 months ago",
    text: "Free roof inspection and free roof sweeping! Jalen was a sweetheart, he let me know my roof was in great condition. I asked if he would sweep the large branches off and he immediately asked for a broom!",
  },
  {
    name: "Melanie Rouzano",
    when: "a year ago",
    text: "Southeast Roofing was a pleasure to work with. The roof looks great. Everyone I met was courteous and professional. Would highly recommend.",
  },
  {
    name: "Vicky",
    when: "2 months ago",
    text: "Very professional and did an awesome job on the roof and was helpful with financing paperwork helpful every step of the way",
    services: "Roof inspection, Roof installation",
  },
  {
    name: "JC Grines",
    when: "a year ago",
    text: "Wonderful people and great experience. Roof looks killer!",
  },
  {
    name: "Matthew Martin",
    when: "2 years ago",
    text: "Only company I'll use. Fast, professional and friendly. Worked with the insurance company and handled everything from start to finish. Highly recommend",
  },
  {
    name: "E Rankin",
    when: "2 years ago",
    text: "Great experience, professional and excellent work, I strongly recommend this company",
  },
];
