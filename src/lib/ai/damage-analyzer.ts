/**
 * Roof Damage Analyzer: analysis layer, provider-abstracted like the Roof
 * Assistant. When ANTHROPIC_API_KEY is set, a Claude vision provider reads the
 * uploaded photos + context and returns a tailored preliminary read; otherwise
 * (or on any error) it falls back to the honest, issue-based template below.
 * The UI/route never change. The Claude provider is held to the same integrity
 * rules by its system prompt: hedge, never diagnose with authority, never
 * invent facts, always route to a free inspection.
 */

import { siteConfig } from "@/config/site";
import { structuredClaude, type InlineImage } from "@/lib/ai/anthropic";

export type DamageIssue =
  | "missing-shingles"
  | "leak"
  | "hail"
  | "wind"
  | "tree-damage"
  | "pipe-boot-leak"
  | "rusted-metal"
  | "commercial-ponding"
  | "not-sure";

export type Urgency = "low" | "moderate" | "high";

export interface DamageInput {
  issue: DamageIssue;
  when?: string;
  insurance?: string;
  photoCount?: number;
  /** Resized JPEG photos (base64, no prefix), analyzed when Claude is on. */
  images?: InlineImage[];
}

export interface DamageResult {
  damageType: string;
  urgency: Urgency;
  urgencyNote: string;
  nextStep: string;
}

const ISSUES: Record<DamageIssue, Omit<DamageResult, never>> = {
  "missing-shingles": {
    damageType: "Missing or lifted shingles",
    urgency: "high",
    urgencyNote: "Exposed areas let water reach the deck. This usually can't wait.",
    nextStep: "Get a free inspection right away; if it's storm-related, a claim may apply.",
  },
  leak: {
    damageType: "Active leak / water intrusion",
    urgency: "high",
    urgencyNote: "Water spreads fast into decking and drywall.",
    nextStep: "Book a free inspection now to find and stop the source.",
  },
  hail: {
    damageType: "Possible hail damage",
    urgency: "high",
    urgencyNote: "Hail bruising isn't always visible from the ground and has claim deadlines.",
    nextStep: "Document it and start with our insurance claim helper, then a free inspection.",
  },
  wind: {
    damageType: "Possible wind damage",
    urgency: "high",
    urgencyNote: "Wind lifts and creases shingles so they fail in the next storm.",
    nextStep: "Get a free inspection to document it; a claim may apply.",
  },
  "tree-damage": {
    damageType: "Tree / impact damage",
    urgency: "high",
    urgencyNote: "Impact can crack decking and structure, not just shingles.",
    nextStep: "Call us for prompt help. We can tarp and inspect.",
  },
  "pipe-boot-leak": {
    damageType: "Failed pipe boot",
    urgency: "moderate",
    urgencyNote: "Dry-rotted boots are a very common, fixable leak source here.",
    nextStep: "A free inspection confirms it, usually a straightforward repair.",
  },
  "rusted-metal": {
    damageType: "Rust / aging metal roof",
    urgency: "moderate",
    urgencyNote: "Surface rust can be manageable; through-rust and failed fasteners aren't.",
    nextStep: "Get a free inspection to see whether it's repair or replace.",
  },
  "commercial-ponding": {
    damageType: "Ponding water (flat roof)",
    urgency: "moderate",
    urgencyNote: "Standing water accelerates membrane failure and leaks.",
    nextStep: "Request a commercial assessment of drainage and the membrane.",
  },
  "not-sure": {
    damageType: "Needs a closer look",
    urgency: "moderate",
    urgencyNote: "Hard to say from here. A free set of eyes settles it.",
    nextStep: "Book a free inspection and we'll tell you honestly what's going on.",
  },
};

interface DamageProvider {
  analyze(input: DamageInput): Promise<DamageResult>;
}

const mockProvider: DamageProvider = {
  async analyze(input) {
    return ISSUES[input.issue] ?? ISSUES["not-sure"];
  },
};

const ISSUE_LABELS: Record<DamageIssue, string> = {
  "missing-shingles": "missing or lifted shingles",
  leak: "an active leak / water intrusion",
  hail: "possible hail damage",
  wind: "possible wind damage",
  "tree-damage": "tree or impact damage",
  "pipe-boot-leak": "a failed pipe boot",
  "rusted-metal": "rust / aging metal roof",
  "commercial-ponding": "ponding water on a flat roof",
  "not-sure": "not sure",
};

const DAMAGE_SYSTEM = [
  `You are the Roof Damage Analyzer for ${siteConfig.name}, a licensed, insured`,
  `roofing contractor in Hattiesburg, Mississippi. You give a homeowner a warm,`,
  `plain-English PRELIMINARY read of roof damage and their next step. You are NOT`,
  `performing an inspection.`,
  ``,
  `Hard rules:`,
  `- If photos are provided, comment only on what is genuinely visible and hedge`,
  `  ("looks like", "may be"). Never claim certainty about hidden damage,`,
  `  structure, or safety, and never say a roof is fine/safe with authority.`,
  `- Never invent measurements, prices, warranty terms, or insurance outcomes.`,
  `  Never promise a claim will be approved.`,
  `- Pick urgency conservatively: active leaks, missing shingles, fresh storm or`,
  `  impact damage are "high".`,
  `- The next step should almost always include a free professional inspection.`,
  `- "damageType" is a short label (max ~5 words). "urgencyNote" and "nextStep"`,
  `  are one sentence each. Local, honest, no hype.`,
  `- Return your answer ONLY through the "report" tool.`,
].join("\n");

const DAMAGE_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    damageType: { type: "string", description: "Short label for the likely issue." },
    urgency: { type: "string", enum: ["low", "moderate", "high"] },
    urgencyNote: { type: "string", description: "One sentence on why it does/doesn't need quick action." },
    nextStep: { type: "string", description: "One sentence, concrete recommended next step." },
  },
  required: ["damageType", "urgency", "urgencyNote", "nextStep"],
};

const claudeProvider: DamageProvider = {
  async analyze(input) {
    const fallback = ISSUES[input.issue] ?? ISSUES["not-sure"];
    const user = [
      `What the homeowner reported: ${ISSUE_LABELS[input.issue] ?? input.issue}.`,
      input.when ? `When it happened: ${input.when}.` : "",
      input.insurance ? `Insurance involved: ${input.insurance}.` : "",
      input.images?.length
        ? `${input.images.length} photo(s) attached: analyze them.`
        : "No photos attached, base your read on the reported issue only.",
    ]
      .filter(Boolean)
      .join("\n");

    const out = await structuredClaude<DamageResult>({
      system: DAMAGE_SYSTEM,
      user,
      images: input.images,
      schema: DAMAGE_SCHEMA,
      maxTokens: 400,
    });

    if (!out) return fallback;
    return {
      damageType: out.damageType || fallback.damageType,
      urgency: out.urgency ?? fallback.urgency,
      urgencyNote: out.urgencyNote || fallback.urgencyNote,
      nextStep: out.nextStep || fallback.nextStep,
    };
  },
};

/**
 * Returns the active provider: the Claude vision provider when
 * ANTHROPIC_API_KEY is set, otherwise the deterministic mock. The Claude
 * provider itself fails soft to the same templates on any error.
 */
function getProvider(): DamageProvider {
  return process.env.ANTHROPIC_API_KEY ? claudeProvider : mockProvider;
}

export async function analyzeDamage(input: DamageInput): Promise<DamageResult> {
  return getProvider().analyze(input);
}
