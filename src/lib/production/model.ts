import { z } from "zod";

/**
 * Shared model for the production tracker at /production — checklist
 * definitions, progress/status math, and input validation. Client-safe (no
 * secrets, no server imports): the dashboard uses it to render and the API
 * uses it to validate, so the two can never disagree about what a stage is.
 */

export const PROJECT_TYPES = ["retail", "insurance"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface ChecklistItemDef {
  key: string;
  label: string;
  /** Expansion for abbreviated labels (tooltip + screen-reader text). */
  title?: string;
}

const SHARED_STAGES: ChecklistItemDef[] = [
  { key: "downPayment", label: "Down Payment" },
  { key: "materials", label: "Materials" },
  { key: "permit", label: "Permit" },
  { key: "install", label: "Install" },
];

export const RETAIL_STAGES: ChecklistItemDef[] = [
  ...SHARED_STAGES,
  { key: "finalPayment", label: "Final Payment" },
];

export const INSURANCE_STAGES: ChecklistItemDef[] = [
  ...SHARED_STAGES,
  { key: "deductible", label: "Deductible" },
  { key: "depreciationFiled", label: "Depreciation Filed" },
  { key: "depreciationCollected", label: "Depreciation Collected" },
];

/** Install-closeout items — subordinate to the main workflow stages. */
export const CLOSEOUT_ITEMS: ChecklistItemDef[] = [
  { key: "installCoc", label: "COC", title: "Certificate of Completion" },
  { key: "installPhotos", label: "Photos" },
  { key: "installLeftovers", label: "Leftovers" },
];

export function stagesFor(type: ProjectType): ChecklistItemDef[] {
  return type === "insurance" ? INSURANCE_STAGES : RETAIL_STAGES;
}

/** Every trackable item — 8 for retail, 10 for insurance. */
export function allItemsFor(type: ProjectType): ChecklistItemDef[] {
  return [...stagesFor(type), ...CLOSEOUT_ITEMS];
}

export function itemLabel(type: ProjectType, key: string): string {
  return allItemsFor(type).find((i) => i.key === key)?.label ?? key;
}

export type Checklist = Record<string, boolean>;

export interface HistoryEntry {
  at: string;
  action: string;
}

export interface ProductionProject {
  id: string;
  projectType: ProjectType;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  assignedTo: string;
  /** yyyy-mm-dd, or "" until scheduled */
  installDate: string;
  notes: string;
  checklist: Checklist;
  history: HistoryEntry[];
  sortOrder: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------- progress + status ---------- */

export function progressFor(
  type: ProjectType,
  checklist: Checklist,
): { checked: number; total: number; percent: number } {
  const items = allItemsFor(type);
  const checked = items.filter((i) => checklist[i.key]).length;
  return {
    checked,
    total: items.length,
    percent: Math.round((checked / items.length) * 100),
  };
}

export function closeoutDone(checklist: Checklist): boolean {
  return CLOSEOUT_ITEMS.every((i) => checklist[i.key]);
}

/**
 * A job is only complete when its final money stage AND all three closeout
 * items are checked — matching how the owners call a job "done".
 */
export function isComplete(type: ProjectType, checklist: Checklist): boolean {
  const finalStage =
    type === "insurance" ? "depreciationCollected" : "finalPayment";
  return Boolean(checklist[finalStage]) && closeoutDone(checklist);
}

/** Human status label derived from checked stages. Never mutates anything. */
export function statusFor(project: {
  projectType: ProjectType;
  checklist: Checklist;
  installDate: string;
}): string {
  const { projectType: type, checklist: c, installDate } = project;
  if (isComplete(type, c)) return "Complete";

  if (c.install) {
    if (type === "insurance") {
      if (!c.deductible) return "Awaiting Deductible";
      if (!c.depreciationFiled) return "Depreciation Needs Filing";
      if (!c.depreciationCollected) return "Awaiting Depreciation";
    } else if (!c.finalPayment) {
      return "Awaiting Final Payment";
    }
    return "Closeout Needed";
  }

  if (c.downPayment && c.materials && c.permit) {
    return installDate ? "Install Scheduled" : "Ready to Install";
  }
  if (c.permit) return "Permit Complete";
  if (c.materials) return "Materials Ordered";
  if (c.downPayment) return "Down Payment Received";
  return "Not Started";
}

/** Buckets the toolbar filter uses. Pure — filtering never touches records. */
export function matchesFilter(p: ProductionProject, filter: string): boolean {
  const status = statusFor(p);
  switch (filter) {
    case "archived":
      return p.archived;
    case "retail":
      return !p.archived && p.projectType === "retail";
    case "insurance":
      return !p.archived && p.projectType === "insurance";
    case "incomplete":
      return !p.archived && !isComplete(p.projectType, p.checklist);
    case "ready":
      return (
        !p.archived &&
        (status === "Ready to Install" || status === "Install Scheduled")
      );
    case "installed":
      return !p.archived && Boolean(p.checklist.install);
    case "awaitingPayment":
      return (
        !p.archived &&
        [
          "Awaiting Final Payment",
          "Awaiting Deductible",
          "Awaiting Depreciation",
          "Depreciation Needs Filing",
        ].includes(status)
      );
    case "complete":
      return !p.archived && isComplete(p.projectType, p.checklist);
    default: // "active"
      return !p.archived;
  }
}

export function matchesSearch(p: ProductionProject, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [p.customerName, p.address, p.phone, p.email, p.assignedTo, p.notes]
    .join("\n")
    .toLowerCase()
    .includes(q);
}

/* ---------- validation (shared client/server) ---------- */

const text = (max: number) => z.string().trim().max(max);

export const projectFieldsSchema = z.object({
  customerName: text(140),
  address: text(280),
  phone: text(40),
  email: text(180),
  assignedTo: text(140),
  installDate: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Use the date picker (YYYY-MM-DD)."),
  notes: text(10_000),
});

export const projectPatchSchema = projectFieldsSchema
  .partial()
  .extend({
    checklist: z.record(z.string(), z.boolean()).optional(),
    archived: z.boolean().optional(),
  })
  .strict();

export type ProjectPatch = z.infer<typeof projectPatchSchema>;

export const createProjectSchema = z.object({
  projectType: z.enum(PROJECT_TYPES),
  /** Client-minted id so a double-clicked "Add Project" can't create twice. */
  requestId: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().max(120)).min(1).max(500),
});
