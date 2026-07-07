import type { ElementType } from "react";
import {
  Calculator,
  Camera,
  FileSearch,
  Layers,
  MapPin,
  Palette,
  Ruler,
  Sparkles,
} from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * Central registry of the interactive tools, referenced by key so pages can
 * surface exactly the right ones contextually (see components/tools/ToolStrip).
 * One source of truth for titles, blurbs, and hrefs.
 */

export interface ToolDef {
  key: string;
  title: string;
  blurb: string;
  href: string;
  icon: ElementType;
  external?: boolean;
}

export const TOOLS = {
  "cost-calculator": {
    key: "cost-calculator",
    title: "Roof Cost Calculator",
    blurb: "Ballpark your project in seconds — no email needed.",
    href: "/roof-cost-calculator",
    icon: Calculator,
  },
  "color-visualizer": {
    key: "color-visualizer",
    title: "Color Visualizer",
    blurb: "Preview shingle & metal colors on real roofs.",
    href: "/roof-color-visualizer",
    icon: Palette,
  },
  "instant-estimate": {
    key: "instant-estimate",
    title: "Instant Roof Estimate",
    blurb: "Enter your address for an instant price from aerial measurements.",
    href: siteConfig.links.instantEstimate,
    icon: Ruler,
    external: true,
  },
  "damage-analyzer": {
    key: "damage-analyzer",
    title: "Roof Damage Analyzer",
    blurb: "Upload photos and get a quick read on the damage.",
    href: "/roof-damage-analyzer",
    icon: Camera,
  },
  "insurance-wizard": {
    key: "insurance-wizard",
    title: "Insurance Claim Helper",
    blurb: "Answer a few questions to find your next step.",
    href: "/storm-damage/insurance-claims/wizard",
    icon: FileSearch,
  },
  "ai-assistant": {
    key: "ai-assistant",
    title: "Roof Assistant",
    blurb: "Tell us what's going on and get pointed the right way.",
    href: "/roof-assistant",
    icon: Sparkles,
  },
  "project-map": {
    key: "project-map",
    title: "Project Map",
    blurb: "See real roofs we've completed near you.",
    href: "/project-map",
    icon: MapPin,
  },
  "roof-anatomy": {
    key: "roof-anatomy",
    title: "Anatomy of a Roof",
    blurb: "Tap through every layer of a roof system.",
    href: "/anatomy-of-a-roof",
    icon: Layers,
  },
} satisfies Record<string, ToolDef>;

export type ToolKey = keyof typeof TOOLS;
