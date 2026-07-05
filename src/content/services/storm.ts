import { stormPhotos } from "@/content/photos";
import type { ServiceContent } from "@/content/services/types";

/**
 * Storm-damage child pages (PRD §4.1 additions, Phase 3): emergency
 * roofing and insurance claims. Language rules: factual assistance only —
 * no outcome promises on claims, and no "24/7" claim until availability is
 * owner-confirmed ([NEEDS: real 24/7 emergency availability]).
 */

// Owner relabel 2026-07-05: no tarping photos remain in the manifest —
// the emergency page shows the wind damage that drives emergency calls.
const tarpPhotos = stormPhotos
  .filter((photo) => photo.category === "wind-damage")
  .slice(0, 4);

export const emergencyRoofing: ServiceContent = {
  slug: "emergency-roofing",
  path: "/storm-damage/emergency-roofing",
  name: "Emergency Roofing",
  metaTitle: "Emergency Roof Tarping & Repair | South Mississippi",
  metaDescription:
    "Roof leaking now? Southeast Roofing responds fast across South Mississippi with emergency tarping and mitigation — then a documented path to the permanent fix.",
  hero: {
    eyebrow: "Storm damage",
    headline: "Roof open right now? Start here.",
    subhead:
      "When a storm puts a hole in your roof, the clock is running on everything under it. We respond fast across the Hattiesburg region with professional tarping and mitigation — then get you on the documented path to a permanent repair.",
    photo: {
      src: tarpPhotos[0].src,
      alt: tarpPhotos[0].alt,
    },
    photoBadge: "Emergency tarping — South Mississippi",
  },
  intro: {
    title: "First we stop the damage. Then we fix the roof.",
    paragraphs: [
      "Emergency roofing is triage: the goal in the first hours is to stop water from multiplying the damage. A professionally installed tarp or temporary patch protects your decking, insulation, wiring, and ceilings until weather and materials allow the permanent repair — and it's exactly the kind of 'reasonable mitigation' your insurance policy expects you to arrange after a loss.",
      "We photograph everything before and during the emergency work. That documentation matters twice: it gets the mitigation itself into your claim, and it preserves evidence of the storm damage before tarps cover it.",
      "One honest note: during a major regional storm event, every roofer in South Mississippi is triaging calls at once. We work in order of severity and stay reachable — call us early, tell us what you see, and we'll be straight with you about timing.",
    ],
  },
  checklist: {
    title: "What to do right now",
    description:
      "Before any roofer arrives — yours to run through, in this order.",
    items: [
      "Keep people out of rooms with sagging or waterlogged ceilings — safety first, always.",
      "Contain the water: buckets under drips, towels at spread edges, furniture and electronics moved clear.",
      "If a ceiling is bulging with trapped water, poke a small drain hole with a screwdriver over a bucket — controlled draining beats a collapse.",
      "Photograph everything as you find it: interior damage, the yard debris, the roof from the ground. Don't climb up.",
      "Kill power to circuits where water is reaching fixtures or outlets.",
      "Call us — we'll talk through what you're seeing and get emergency tarping scheduled.",
      "Report the loss to your insurance company; mitigation costs like tarping are typically part of the claim, so keep every receipt.",
    ],
  },
  approach: {
    title: "How our emergency response works",
    steps: [
      {
        title: "Call and describe what you see",
        text: "Active drips, visible holes, missing shingles, tree contact — what you tell us sets the urgency and what we bring.",
      },
      {
        title: "Rapid assessment on site",
        text: "We find every opening — including ones you can't see from the ground — and photograph the damage before covering it.",
      },
      {
        title: "Professional tarping & mitigation",
        text: "Reinforced tarps anchored correctly, temporary patches where they're smarter, and water paths stopped.",
      },
      {
        title: "The permanent plan",
        text: "You get our damage documentation, a clear repair or replacement recommendation, and claim support if insurance applies.",
      },
    ],
  },
  gallery: {
    title: "Emergency mitigation in the field",
    description:
      "Real Southeast Roofing emergency calls across South Mississippi.",
    photos: tarpPhotos.map(({ src, alt }) => ({ src, alt })),
  },
  faqs: [
    {
      question: "How fast can you get to my house?",
      answer:
        "It depends on where you are in our service area and what the storm did region-wide. Isolated damage usually gets same-day or next-day response; after a major event we triage by severity. Either way, you'll get an honest timeline when you call — not a promise we can't keep.",
    },
    {
      question: "Will insurance pay for emergency tarping?",
      answer:
        "Mitigation costs are typically covered as part of a storm-damage claim — policies generally require you to take reasonable steps to prevent further damage. We document the emergency work and give you the paperwork; keep every receipt.",
    },
    {
      question: "Can't I just tarp it myself?",
      answer:
        "We'd rather you didn't: wet roofs are genuinely dangerous, and a poorly anchored tarp can blow off or channel water into new places. If you must act before we arrive, work from inside the attic if possible and leave the roof surface to us.",
    },
    {
      question: "How long can a tarp stay on?",
      answer:
        "A professionally installed tarp protects for weeks if needed — long enough to get the claim moving and materials ordered. It's a bridge, not a roof: the permanent repair should follow as soon as the process allows.",
    },
    {
      question: "What if the damage is from a tree still on the roof?",
      answer:
        "Stay out of the rooms underneath and call us — tree-on-structure situations need careful sequencing between removal and roof protection, and we'll help coordinate the order of operations safely.",
    },
  ],
  related: [
    {
      label: "Storm Damage",
      href: "/storm-damage",
      description:
        "The full picture: damage types, our response process, and what comes after the tarp.",
    },
    {
      label: "Insurance Claims",
      href: "/storm-damage/insurance-claims",
      description:
        "How we document damage and support your claim from first photo to final invoice.",
    },
    {
      label: "Roof Repair",
      href: "/residential/roof-repair",
      description:
        "The permanent fix that follows the emergency — traced to the source and done right.",
    },
  ],
};

export const insuranceClaims: ServiceContent = {
  slug: "insurance-claims",
  path: "/storm-damage/insurance-claims",
  name: "Insurance Claim Assistance",
  metaTitle: "Roof Insurance Claim Help | Hattiesburg & South Mississippi",
  metaDescription:
    "Storm-damage insurance claims without the confusion: thorough documentation, adjuster meetings, and factual guidance from a local Hattiesburg roofing contractor.",
  hero: {
    eyebrow: "Storm damage",
    headline: "We speak insurance, so you don't have to learn it",
    subhead:
      "A storm claim is paperwork stapled to a roof. We handle the roof and the documentation — thorough inspection reports, photos in the format adjusters expect, and someone on your side of the table at the adjuster meeting.",
    photo: {
      src: stormPhotos.find((p) => p.category === "hail-damage")!.src,
      alt: stormPhotos.find((p) => p.category === "hail-damage")!.alt,
    },
    photoBadge: "Hail damage documentation",
  },
  intro: {
    title: "What we do — and what we honestly can't",
    paragraphs: [
      "Here's the truth about roof claims: the decision belongs to your insurance company, and any roofer who guarantees your claim will be approved is selling something. What a good contractor actually does is make sure the damage is found, documented, and presented so the insurer can evaluate it fairly — and that nothing gets missed because nobody competent climbed the roof.",
      "That's the job we do constantly across South Mississippi. Hail bruising that's invisible from the ground, wind creasing that hasn't started leaking yet, soft metal damage on vents and flashing that corroborates the storm — we photograph and report all of it, and we'll meet your adjuster on your roof to walk the evidence together.",
      "From first inspection to final invoice, you'll know what step you're on and who owes what to whom. No mystery, no pressure, and no outcome promises — just the process done right.",
    ],
  },
  approach: {
    title: "The claim process, step by step",
    description:
      "Insurers differ in the details, but a storm claim generally moves like this.",
    steps: [
      {
        title: "Free damage inspection",
        text: "We document every impact point with photos and give you a straight answer — including when the damage isn't worth a claim.",
      },
      {
        title: "You file the claim",
        text: "The policyholder opens the claim with the insurer. We supply the documentation and help you describe the loss accurately.",
      },
      {
        title: "Adjuster inspection",
        text: "Your insurer sends an adjuster. We can meet them on site so the walk covers everything we found — roof-to-roof, professional-to-professional.",
      },
      {
        title: "Scope and approval",
        text: "The insurer issues a scope of loss. We review it against the real damage and flag anything the scope missed.",
      },
      {
        title: "The build",
        text: "Once approved, we schedule and complete the work to the approved scope — most residential replacements take one to two days on site.",
      },
      {
        title: "Final documentation",
        text: "Completion paperwork and the final invoice go to you and the insurer, closing out the claim cleanly, including any recoverable depreciation.",
      },
    ],
  },
  checklist: {
    title: "Your claim documentation checklist",
    description: "Gather these early and the whole process moves faster.",
    items: [
      "The date (and roughly the time) of the storm you believe caused the damage.",
      "Photos of everything visible: interior stains, yard debris, downed limbs, dented gutters or AC fins.",
      "Your policy number and your insurer's claims phone line or portal login.",
      "Notes on when you first noticed each problem — leaks, missing shingles, granules in gutters.",
      "Receipts for any emergency work already done, like tarping or water cleanup.",
      "Records of past roof work, if you have them — age of the roof matters to the claim.",
      "Our inspection report — we'll add the roof-level photos and damage documentation.",
    ],
  },
  gallery: {
    title: "The damage adjusters need to see",
    description:
      "Real documentation photos from South Mississippi inspections — hail, wind, and storm damage.",
    photos: [
      stormPhotos.find((p) => p.category === "hail-damage")!,
      stormPhotos.find((p) => p.category === "wind-damage")!,
      stormPhotos.find((p) => p.category === "rotted-decking")!,
      stormPhotos.find((p) => p.category === "granular-loss")!,
    ].map(({ src, alt }) => ({ src, alt })),
  },
  faqs: [
    {
      question: "Will filing a claim raise my insurance rates?",
      answer:
        "That's a question only your insurer or agent can answer — rate decisions involve your policy, your history, and regional factors. What we can do is give you an honest damage assessment first, so you can decide whether the damage justifies a claim before you file one.",
    },
    {
      question: "The adjuster says the damage isn't enough. Now what?",
      answer:
        "You're generally entitled to ask for a re-inspection, and policies include dispute options. If we've documented damage the scope missed, we'll provide that evidence and meet the re-inspection. What we won't do is manufacture damage that isn't there — our documentation only helps you because it's credible.",
    },
    {
      question: "What's a deductible, and do I have to pay it?",
      answer:
        "Yes. Your deductible is the portion of the loss you're responsible for by contract, and paying it is required — a contractor offering to 'eat the deductible' is describing insurance fraud, and it's a red flag about everything else they do.",
    },
    {
      question: "How long do I have to file after a storm?",
      answer:
        "Policies set time limits for reporting losses, and they vary — check yours and don't sit on visible damage. Practically, sooner is always stronger: fresh damage is easier to tie to a specific storm date.",
    },
    {
      question: "Do you work with all insurance companies?",
      answer:
        "We work with the claims process of any insurer our customers have. We're hired by you, not the insurance company — our documentation serves your claim.",
    },
  ],
  related: [
    {
      label: "Storm Damage",
      href: "/storm-damage",
      description:
        "Damage types, our response process, and how the pieces fit together.",
    },
    {
      label: "Emergency Roofing",
      href: "/storm-damage/emergency-roofing",
      description:
        "Active leak? Mitigation comes first — and it's part of the claim.",
    },
    {
      label: "Roof Replacement",
      href: "/residential/roof-replacement",
      description:
        "What the approved build looks like, from tear-off to walkthrough.",
    },
  ],
};
