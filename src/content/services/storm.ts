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
  metaTitle: "Emergency Roof Repair in Mississippi | Southeast Roofing",
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
  metaTitle: "Insurance Roof Claims in Mississippi | Southeast Roofing",
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
  sections: [
    {
      title: "Who does what in a roof insurance claim",
      paragraphs: [
        "A storm claim has four parties, and knowing each one's job keeps the process from feeling like a maze. You, the policyholder, own the claim: you file it, you make the decisions, and the policy is a contract between you and your insurer. The insurance company decides what is and isn't covered — not us, and not any contractor. The adjuster inspects on the insurer's behalf and contributes the scope of loss, which is the insurer's written list of the work it agrees the covered damage requires. Our job as the contractor is the physical evidence and the build: we document the roof's actual condition, prepare a proposal for the repairs, and complete the approved work.",
        "One thing worth saying plainly: this page is general information about how the process typically works. It is not legal advice, and it is not an interpretation of your policy — your policy language and your insurer's decisions control. When a coverage question matters, the answers come from your policy, your agent, or your insurer.",
      ],
      links: [
        {
          label: "Start with our storm damage overview",
          href: "/storm-damage",
        },
        {
          label: "Schedule a free roof inspection",
          href: "/free-inspection",
        },
        {
          label: "Walk the claim process in our step-by-step wizard",
          href: "/storm-damage/insurance-claims/wizard",
        },
      ],
    },
    {
      title: "The terms on your claim paperwork, translated",
      paragraphs: [
        "Claim documents use a vocabulary most people meet exactly once — usually while standing in a driveway looking at a damaged roof. Here are the terms that show up on nearly every roof claim, in plain English. Your policy's own definitions govern; these are the general meanings.",
      ],
      table: {
        title: "Insurance claim vocabulary",
        columns: ["Term", "What it means"],
        rows: [
          [
            "ACV",
            "Actual Cash Value — the depreciated value of the roof at the time of loss: replacement cost minus depreciation for age and wear.",
          ],
          [
            "RCV",
            "Replacement Cost Value — what it costs to replace the damaged roof with materials of similar kind and quality today, before depreciation is subtracted.",
          ],
          [
            "Deductible",
            "The portion of a covered loss you are responsible for by contract. It is always the policyholder's to pay — no honest contractor offers to absorb it.",
          ],
          [
            "Depreciation",
            "The value the roof lost to age and wear. Under many RCV policies it is recoverable — released after the work is completed and documented; under ACV policies it typically is not.",
          ],
          [
            "Supplement",
            "A documented request to adjust the scope when covered conditions turn up that the original scope missed — rotten decking found at tear-off, for example.",
          ],
          [
            "Scope of loss",
            "The insurer's written, line-by-line list of the repair work it has agreed the covered damage requires.",
          ],
          [
            "Exclusion",
            "Policy language that removes certain causes or types of damage from coverage — wear and tear and installation defects are common examples.",
          ],
          [
            "Endorsement",
            "A written modification that adds, removes, or changes coverage on the standard policy — roof-specific endorsements are increasingly common.",
          ],
          [
            "Mortgagee",
            "Your mortgage lender. When it holds an interest in the property, it is commonly named on claim payments and may have its own endorsement and inspection steps before funds are released.",
          ],
        ],
        note: "General definitions only — your policy's own wording governs how each term applies to your claim.",
      },
    },
    {
      title: "ACV, RCV, and how depreciation actually plays out",
      paragraphs: [
        "Whether your policy pays on an ACV or an RCV basis is the single biggest variable in how a roof claim feels. Under a typical RCV policy, the insurer's first payment reflects the actual cash value of the covered damage — the replacement cost minus depreciation — less your deductible. The withheld depreciation is commonly recoverable: once the work is completed and documented, we submit the completion paperwork and final invoice, and the insurer releases it. Under an ACV policy, that second step usually doesn't exist — depreciation is non-recoverable, and the gap between the depreciated payment and the real replacement is yours to carry.",
        "Roof age drives depreciation, so the same hailstorm can produce very different claim outcomes on a five-year-old roof and a twenty-year-old one. Some policies also apply separate roof deductibles or roof-payment schedules by endorsement. We can't change any of that — but we can make sure you understand which structure you're in before you make decisions, and that the completion documentation needed to request recoverable depreciation goes in promptly and correctly.",
      ],
    },
    {
      title: "Supplements, code items, and your mortgage company",
      paragraphs: [
        "Adjusters work fast and roofs hide things, so initial scopes sometimes miss real conditions — decking that turns out to be rotten under the shingles, flashing that can't be reused, or quantities that don't match the actual roof. When that happens, the fix is a supplement: a documented request, with photos and measurements, asking the insurer to adjust the scope. Where the policy supports it, code-related items can also enter the claim — some policies carry ordinance-or-law coverage for upgrades the current building code requires, such as drip edge or underlayment changes, and some don't. The insurer decides; our job is to document the condition clearly so the request stands on evidence.",
        "If you have a mortgage, expect your lender's name on the claim check — that's the mortgagee clause at work, and it's routine. Lenders have their own endorsement procedures, and larger payments often involve the lender holding funds and releasing them against inspections or completion paperwork. It adds steps, not drama: we provide the documentation the mortgage company asks for, and the process moves.",
      ],
    },
    {
      title:
        "What claims commonly don't cover — and how commercial claims differ",
      paragraphs: [
        "Not everything wrong with a roof is storm damage, and insurers are right to draw that line. Ordinary wear and aging, installation defects, and long-standing leaks that predate the storm are commonly excluded — a claim covers sudden loss from a covered cause, not deferred maintenance. That's exactly why we tell you before you file when what we find on your roof looks like age rather than impact: filing a claim that documents wear helps nobody.",
        "Commercial claims run on the same skeleton but with more moving parts: larger scopes, membrane and insulation assemblies that require core sampling to evaluate, business-interruption considerations, and policy forms that differ meaningfully from homeowner policies. Timelines on any claim — residential or commercial — depend on your policy terms, your insurer's process, and regional storm volume, so nobody can honestly promise you a date. What we control is our part: thorough documentation, a prompt proposal, and completion paperwork the day the work wraps.",
      ],
      links: [
        {
          label: "What a residential roof replacement involves",
          href: "/residential/roof-replacement",
        },
        {
          label: "See our commercial roof replacement process",
          href: "/commercial/roof-replacement",
        },
      ],
    },
  ],
  costFactors: {
    title: "What determines the scope — and our proposal",
    description:
      "No two claims price alike because no two losses are alike. These are the real variables behind the scope of loss and the proposal we prepare against it.",
    items: [
      {
        title: "Extent and type of documented damage",
        text: "Hail bruising across full slopes reads differently than wind damage on one elevation — the documented damage drives the scope.",
      },
      {
        title: "Your policy structure",
        text: "ACV versus RCV, roof-specific endorsements, and separate wind/hail deductibles all shape what the claim pays and when.",
      },
      {
        title: "Roof size, pitch, and complexity",
        text: "Steeper pitches, multiple stories, and cut-up rooflines change labor, safety measures, and material quantities.",
      },
      {
        title: "Code-related items where applicable",
        text: "When current code requires components the old roof lacked, they enter the proposal — and coverage depends on your policy's ordinance-or-law terms.",
      },
      {
        title: "Matching and material availability",
        text: "Discontinued shingles and hard-to-match products raise real scope questions the insurer has to weigh.",
      },
      {
        title: "Accessory and collateral damage",
        text: "Gutters, vents, flashing, skylights, and soft-metal damage belong in the documentation, not as afterthoughts.",
      },
      {
        title: "Conditions found during the work",
        text: "Hidden decking damage discovered at tear-off is handled through the supplement process, with photos, where the policy supports it.",
      },
    ],
  },
  approach: {
    title: "The claim process, step by step",
    description:
      "Insurers differ in the details, but a storm claim generally moves through these ten steps.",
    steps: [
      {
        title: "Inspection and documentation",
        text: "We photograph every impact point, slope by slope — the roof-level record everything else builds on.",
      },
      {
        title: "An honest recommendation",
        text: "We tell you whether what we found looks like storm damage worth reporting — including when it doesn't and a claim isn't reasonable.",
      },
      {
        title: "You file the claim",
        text: "The policyholder opens the claim with the insurer. We supply the documentation and help you describe the loss accurately.",
      },
      {
        title: "Adjuster inspection",
        text: "Your insurer sends an adjuster. We can meet them on your roof so the walk covers everything we documented.",
      },
      {
        title: "Scope review",
        text: "The insurer issues a scope of loss. We review it against the roof's real condition and flag anything it missed.",
      },
      {
        title: "Our proposal",
        text: "You get a written proposal aligned to the approved scope, with system and material options spelled out.",
      },
      {
        title: "Supplements where supported",
        text: "If covered conditions surface that the scope missed, we document them and submit a supplement for the insurer to evaluate.",
      },
      {
        title: "Contract and material selection",
        text: "You sign, pick colors and products, and we order materials and set the schedule.",
      },
      {
        title: "The work gets done",
        text: "We complete the build to the approved scope — most homes are done in one to two days on site.",
      },
      {
        title: "Final documents and depreciation",
        text: "Completion paperwork and the final invoice go to you and the insurer — including the request for recoverable depreciation where your policy provides it.",
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
    {
      question: "What's the difference between an ACV and an RCV policy?",
      answer:
        "An RCV (replacement cost value) policy pays toward replacing the roof at today's cost, typically releasing withheld depreciation after the work is completed and documented. An ACV (actual cash value) policy pays the depreciated value only, and the gap is yours. Your policy documents or agent can tell you which structure you have — it's worth knowing before you file.",
    },
    {
      question: "Why is my mortgage company's name on the insurance check?",
      answer:
        "Because your lender holds an interest in the property, most policies name it as mortgagee on claim payments. It's routine: the lender endorses the check, and on larger claims may hold funds and release them against inspections or completion paperwork. We supply whatever documentation the mortgage company requests.",
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
