/**
 * Roof Damage Analyzer — analysis layer, provider-abstracted like the Roof
 * Assistant so a real vision model can be connected later without touching the
 * UI/route. Today it maps the selected issue to an honest, preliminary read (no
 * photo is actually analyzed yet). Implement `DamageProvider` and return it from
 * `getProvider()` when a vision model is wired up.
 */

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
    urgencyNote: "Exposed areas let water reach the deck — this usually can't wait.",
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
    nextStep: "Call us for prompt help — we can tarp and inspect.",
  },
  "pipe-boot-leak": {
    damageType: "Failed pipe boot",
    urgency: "moderate",
    urgencyNote: "Dry-rotted boots are a very common, fixable leak source here.",
    nextStep: "A free inspection confirms it — usually a straightforward repair.",
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
    urgencyNote: "Hard to say from here — a free set of eyes settles it.",
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

/**
 * TODO(vision): return a provider that sends the uploaded photos + context to a
 * vision model (Claude/OpenAI/Gemini) and maps its structured output into
 * DamageResult. UI + API route stay unchanged.
 */
function getProvider(): DamageProvider {
  return mockProvider;
}

export async function analyzeDamage(input: DamageInput): Promise<DamageResult> {
  return getProvider().analyze(input);
}
