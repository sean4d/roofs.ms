import { siteConfig } from "@/config/site";
import { structuredClaude, type InlineImage } from "@/lib/ai/anthropic";

/**
 * Roof Assistant analysis layer, provider-abstracted. When ANTHROPIC_API_KEY
 * is set, a Claude vision provider reads any uploaded photos + the visitor's
 * note and returns a tailored preliminary read; otherwise (or on any error) it
 * falls back to the honest, topic-based template below. The UI and API route
 * never change.
 *
 * Nothing here claims to have inspected the roof. The result is preliminary
 * guidance that routes the visitor to the right next step. The Claude provider
 * is held to the same rule by its system prompt: hedge, never diagnose with
 * authority, never invent facts, always route to a free inspection.
 */

export type RoofTopic =
  | "roof-leak"
  | "storm-damage"
  | "roof-replacement"
  | "metal-roof"
  | "commercial-roof"
  | "insurance-claim"
  | "maintenance"
  | "gutters"
  | "not-sure";

export type Urgency = "low" | "moderate" | "high";

export type CtaKind = "inspection" | "estimate" | "call" | "insurance" | "photos";

export interface AssistantCta {
  kind: CtaKind;
  label: string;
  href?: string;
}

export interface AssistantInput {
  topic: RoofTopic;
  description?: string;
  photoCount?: number;
  /** Resized JPEG photos (base64, no prefix), analyzed when Claude is on. */
  images?: InlineImage[];
}

export interface AssistantResult {
  headline: string;
  /** Hedged, honest, not a claim of inspection. */
  read: string;
  urgency: Urgency;
  urgencyNote: string;
  steps: string[];
  ctas: AssistantCta[];
}

interface TopicSpec {
  headline: string;
  read: string;
  urgency: Urgency;
  urgencyNote: string;
  steps: string[];
  ctaKinds: CtaKind[];
}

const TOPICS: Record<RoofTopic, TopicSpec> = {
  "roof-leak": {
    headline: "Let's track down that leak",
    read: "Active leaks in our area usually trace back to failed flashing, a dry-rotted pipe boot, or worn shingles: not always where the water shows up inside.",
    urgency: "high",
    urgencyNote: "Leaks spread fast into decking and drywall. The sooner it's found, the smaller the repair.",
    steps: [
      "Contain the water inside if you safely can (a bucket + move valuables).",
      "Book a free inspection so we can find the actual source, not just the stain.",
      "Save any photos. They help if a claim is involved.",
    ],
    ctaKinds: ["inspection", "call", "photos"],
  },
  "storm-damage": {
    headline: "Storm damage, let's protect you",
    read: "Wind and hail often cause damage that isn't obvious from the ground: lifted shingles, bruised mats, and cracked seals that leak later.",
    urgency: "high",
    urgencyNote: "Insurance has timelines. Documenting damage early protects both your roof and your claim.",
    steps: [
      "Photograph everything you can see, safely from the ground.",
      "Use our Insurance Claim Helper to plan your next step.",
      "Get a free inspection so the real damage is documented properly.",
    ],
    ctaKinds: ["insurance", "inspection", "call"],
  },
  "roof-replacement": {
    headline: "Planning a new roof",
    read: "A full replacement is the right call when repairs stop making sense, widespread wear, multiple leaks, or an aging roof past its years.",
    urgency: "moderate",
    urgencyNote: "No rush to decide today, but a free inspection tells you exactly where you stand.",
    steps: [
      "Get a free inspection and honest assessment of what you actually need.",
      "Try our instant estimate for a quick ballpark.",
      "We'll walk you through materials, colors, and financing options.",
    ],
    ctaKinds: ["inspection", "estimate"],
  },
  "metal-roof": {
    headline: "Metal roofing questions",
    read: "Metal is a great long-term option in Mississippi's heat and storms: standing seam or exposed-fastener, in a range of gauges and finishes.",
    urgency: "low",
    urgencyNote: "This is a considered purchase, take your time and get the facts.",
    steps: [
      "Get a free inspection and metal-roof consultation.",
      "Try our instant estimate for a ballpark.",
      "Compare panel types and colors with our team.",
    ],
    ctaKinds: ["inspection", "estimate"],
  },
  "commercial-roof": {
    headline: "Commercial roofing",
    read: "Flat and low-slope systems (TPO and more) need the right system and maintenance plan for the building and budget.",
    urgency: "moderate",
    urgencyNote: "Small commercial issues get expensive fast when water ponds or seams open.",
    steps: [
      "Request a commercial consultation and roof assessment.",
      "We'll scope the system, condition, and a maintenance plan.",
    ],
    ctaKinds: ["inspection", "call"],
  },
  "insurance-claim": {
    headline: "Insurance claim help",
    read: "Claims are confusing when you're dealing with a damaged roof. The key is accurate documentation and knowing your next step.",
    urgency: "moderate",
    urgencyNote: "Where you are in the process changes what you should do next.",
    steps: [
      "Use our Insurance Claim Helper to map your situation.",
      "Get a free inspection so the damage is fully documented.",
    ],
    ctaKinds: ["insurance", "inspection"],
  },
  maintenance: {
    headline: "Keeping your roof healthy",
    read: "A little upkeep adds years in the Pine Belt's heat, humidity, and pine straw: clearing debris, checking boots and flashing, keeping gutters flowing.",
    urgency: "low",
    urgencyNote: "Preventive care is the cheapest roofing you'll ever buy.",
    steps: [
      "Book a free inspection / tune-up so small issues stay small.",
      "Ask us about a simple maintenance routine for your roof.",
    ],
    ctaKinds: ["inspection", "estimate"],
  },
  gutters: {
    headline: "Gutters & drainage",
    read: "Good gutters protect your fascia, siding, and foundation: sizing, seamless runs, and guards all matter for how well water moves away.",
    urgency: "low",
    urgencyNote: "Overflowing or undersized gutters quietly rot wood and soak foundations.",
    steps: [
      "Get a free inspection and gutter assessment.",
      "Try our instant estimate for a ballpark.",
    ],
    ctaKinds: ["inspection", "estimate"],
  },
  "not-sure": {
    headline: "Let's figure it out together",
    read: "No problem. Most folks aren't sure what's going on up there. The fastest way to real answers is a free set of eyes on it.",
    urgency: "moderate",
    urgencyNote: "A free inspection costs you nothing and gives you a straight answer.",
    steps: [
      "Book a free inspection. We'll tell you honestly what (if anything) needs doing.",
      "Or call and describe what you're seeing; we'll point you the right way.",
    ],
    ctaKinds: ["inspection", "call"],
  },
};

function buildCta(kind: CtaKind): AssistantCta {
  switch (kind) {
    case "inspection":
      return { kind, label: "Schedule free inspection", href: "/free-inspection" };
    case "estimate":
      return { kind, label: "Get instant estimate", href: siteConfig.links.instantEstimate };
    case "call":
      return { kind, label: `Call ${siteConfig.phone.display}`, href: `tel:${siteConfig.phone.tel}` };
    case "insurance":
      return { kind, label: "Insurance claim help", href: "/storm-damage/insurance-claims/wizard" };
    case "photos":
      return { kind, label: "Add more photos" };
  }
}

/* -------- provider abstraction (swap for a real vision model later) -------- */

interface RoofAnalysisProvider {
  analyze(input: AssistantInput): Promise<AssistantResult>;
}

const mockProvider: RoofAnalysisProvider = {
  async analyze(input) {
    const spec = TOPICS[input.topic] ?? TOPICS["not-sure"];
    return {
      headline: spec.headline,
      read: spec.read,
      urgency: spec.urgency,
      urgencyNote: spec.urgencyNote,
      steps: spec.steps,
      ctas: spec.ctaKinds.map(buildCta),
    };
  },
};

const TOPIC_LABELS: Record<RoofTopic, string> = {
  "roof-leak": "roof leak",
  "storm-damage": "storm damage",
  "roof-replacement": "roof replacement",
  "metal-roof": "metal roofing",
  "commercial-roof": "commercial roofing",
  "insurance-claim": "insurance claim",
  maintenance: "roof maintenance",
  gutters: "gutters / drainage",
  "not-sure": "not sure yet",
};

/**
 * Valid CTA kinds Claude may choose from. Claude only picks the *kinds*; the
 * actual links/labels are built server-side by buildCta so URLs and the phone
 * number are never model-controlled.
 */
const CTA_KINDS: CtaKind[] = ["inspection", "estimate", "call", "insurance", "photos"];

const ROOF_SYSTEM = [
  `You are the Roof Assistant for ${siteConfig.name}, a licensed, insured roofing`,
  `contractor in Hattiesburg, Mississippi serving the Pine Belt and Gulf Coast.`,
  `You give a warm, plain-English PRELIMINARY read that routes the homeowner to`,
  `the right next step. You are NOT performing an inspection.`,
  ``,
  `Hard rules:`,
  `- If photos are provided, comment only on what is genuinely visible. Hedge`,
  `  ("looks like", "may be"). Never claim certainty about hidden damage,`,
  `  structure, or safety.`,
  `- Never invent measurements, prices, warranty terms, timelines, or insurance`,
  `  outcomes. Never promise a claim will be approved.`,
  `- Pick urgency conservatively. Active leaks, missing shingles, and fresh storm`,
  `  damage are "high"; considered purchases (metal, replacement planning) are`,
  `  "low"/"moderate".`,
  `- Always steer toward a free professional inspection.`,
  `- Keep "read" to 2-3 sentences and each step short. Local, honest, no hype.`,
  `- Return your answer ONLY through the "report" tool.`,
].join("\n");

const ROOF_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    headline: { type: "string", description: "Short, friendly title (max ~6 words)." },
    read: {
      type: "string",
      description: "2-3 sentence hedged preliminary read of the situation.",
    },
    urgency: { type: "string", enum: ["low", "moderate", "high"] },
    urgencyNote: { type: "string", description: "One sentence on why it does/doesn't need quick action." },
    steps: {
      type: "array",
      items: { type: "string" },
      description: "2-3 short, concrete next steps for the homeowner.",
    },
    ctaKinds: {
      type: "array",
      items: { type: "string", enum: CTA_KINDS },
      description: "1-3 relevant CTA kinds, most useful first.",
    },
  },
  required: ["headline", "read", "urgency", "urgencyNote", "steps", "ctaKinds"],
};

interface RoofModelOutput {
  headline: string;
  read: string;
  urgency: Urgency;
  urgencyNote: string;
  steps: string[];
  ctaKinds: CtaKind[];
}

const claudeProvider: RoofAnalysisProvider = {
  async analyze(input) {
    const fallback = TOPICS[input.topic] ?? TOPICS["not-sure"];
    const user = [
      `Topic the homeowner picked: ${TOPIC_LABELS[input.topic] ?? input.topic}.`,
      input.description ? `Their note: "${input.description}"` : "They left no note.",
      input.images?.length
        ? `${input.images.length} photo(s) attached: analyze them.`
        : "No photos attached, base your read on the topic and note only.",
    ].join("\n");

    const out = await structuredClaude<RoofModelOutput>({
      system: ROOF_SYSTEM,
      user,
      images: input.images,
      schema: ROOF_SCHEMA,
    });

    if (!out) {
      // Fail soft to the deterministic template.
      return {
        headline: fallback.headline,
        read: fallback.read,
        urgency: fallback.urgency,
        urgencyNote: fallback.urgencyNote,
        steps: fallback.steps,
        ctas: fallback.ctaKinds.map(buildCta),
      };
    }

    const kinds = (out.ctaKinds ?? []).filter((k) => CTA_KINDS.includes(k));
    const ctaKinds = kinds.length ? kinds : fallback.ctaKinds;
    return {
      headline: out.headline || fallback.headline,
      read: out.read || fallback.read,
      urgency: out.urgency ?? fallback.urgency,
      urgencyNote: out.urgencyNote || fallback.urgencyNote,
      steps: out.steps?.length ? out.steps : fallback.steps,
      ctas: ctaKinds.map(buildCta),
    };
  },
};

/**
 * Returns the active analysis provider: the Claude vision provider when
 * ANTHROPIC_API_KEY is set, otherwise the deterministic mock. The Claude
 * provider itself fails soft to the same templates on any error.
 */
function getProvider(): RoofAnalysisProvider {
  return process.env.ANTHROPIC_API_KEY ? claudeProvider : mockProvider;
}

export async function analyzeRoof(input: AssistantInput): Promise<AssistantResult> {
  return getProvider().analyze(input);
}
