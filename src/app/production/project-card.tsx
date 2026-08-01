"use client";

import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  History,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from "lucide-react";

import {
  CLOSEOUT_ITEMS,
  isComplete,
  progressFor,
  stagesFor,
  statusFor,
  type ChecklistItemDef,
  type ProductionProject,
} from "@/lib/production/model";
import { cn } from "@/lib/utils";

export interface SaveInfo {
  state: "saving" | "saved" | "error";
  message?: string;
}

interface ReorderControls {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
}

/**
 * One job on the production board. Collapsed it reads like a row in the old
 * handwritten tracker (who, where, how far along); expanded it is the full
 * job sheet: contact fields, the stage workflow, closeout items, notes, and
 * history. Checkboxes stay strictly independent of each other.
 */
export function ProjectCard({
  project,
  expanded,
  onToggleExpand,
  saveInfo,
  onField,
  onCheck,
  onArchive,
  onRequestDelete,
  onRetry,
  reorder,
}: {
  project: ProductionProject;
  expanded: boolean;
  onToggleExpand: () => void;
  saveInfo?: SaveInfo;
  onField: (field: string, value: string) => void;
  onCheck: (key: string, value: boolean) => void;
  onArchive: (archived: boolean) => void;
  onRequestDelete: () => void;
  onRetry: () => void;
  reorder?: ReorderControls;
}) {
  const stages = stagesFor(project.projectType);
  const progress = progressFor(project.projectType, project.checklist);
  const status = statusFor(project);
  const complete = isComplete(project.projectType, project.checklist);
  const displayName = project.customerName || "New project, add a name";

  return (
    <section
      aria-label={`${displayName} (${project.projectType})`}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white",
        expanded ? "border-navy-900/40 shadow-sm" : "border-border",
        project.archived && "opacity-80",
      )}
    >
      {/* Collapsed header row */}
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 text-left hover:bg-secondary/40"
        >
          <span className="mt-1 flex-none text-slate-400" aria-hidden="true">
            {expanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-navy-900">{displayName}</span>
              <TypeBadge type={project.projectType} />
              {project.archived && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Archived
                </span>
              )}
            </span>
            {project.address && (
              <span className="mt-0.5 flex items-center gap-1 text-sm text-slate-600">
                <MapPin className="size-3.5 flex-none" aria-hidden="true" />
                <span className="truncate">{project.address}</span>
              </span>
            )}
            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                  complete
                    ? "bg-success-600/10 text-success-600"
                    : "bg-secondary text-navy-900",
                )}
              >
                {complete && <Check className="size-3" aria-hidden="true" />}
                {status}
              </span>
              <span className="font-medium">{progress.percent}%</span>
              {project.assignedTo && (
                <span className="inline-flex items-center gap-1">
                  <User className="size-3" aria-hidden="true" />
                  {project.assignedTo}
                </span>
              )}
              {project.installDate && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3" aria-hidden="true" />
                  Install {formatDay(project.installDate)}
                </span>
              )}
              <span>Updated {formatStamp(project.updatedAt)}</span>
            </span>
            <span
              className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progress.checked} of ${progress.total} items done`}
            >
              <span
                className={cn(
                  "block h-full rounded-full transition-all",
                  complete ? "bg-success-600" : "bg-ember-500",
                )}
                style={{ width: `${progress.percent}%` }}
              />
            </span>
          </span>
        </button>

        {reorder && (
          <div className="flex flex-none flex-col border-l border-border">
            <button
              type="button"
              onClick={() => reorder.onMove(-1)}
              disabled={!reorder.canMoveUp}
              aria-label={`Move ${displayName} up`}
              className="grid flex-1 min-h-11 w-11 place-items-center text-slate-500 hover:bg-secondary hover:text-navy-900 disabled:opacity-30"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => reorder.onMove(1)}
              disabled={!reorder.canMoveDown}
              aria-label={`Move ${displayName} down`}
              className="grid flex-1 min-h-11 w-11 place-items-center border-t border-border text-slate-500 hover:bg-secondary hover:text-navy-900 disabled:opacity-30"
            >
              <ArrowDown className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Tappable contact links stay available while collapsed */}
      {!expanded && (project.phone || project.email) && (
        <div className="flex flex-wrap gap-2 border-t border-border/70 px-4 py-2.5">
          {project.phone && (
            <a
              href={`tel:${project.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-sm font-semibold text-navy-900 hover:bg-secondary/70"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {project.phone}
            </a>
          )}
          {project.email && (
            <a
              href={`mailto:${project.email}`}
              className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full bg-secondary px-3 text-sm font-semibold text-navy-900 hover:bg-secondary/70"
            >
              <Mail className="size-3.5 flex-none" aria-hidden="true" />
              <span className="truncate">{project.email}</span>
            </a>
          )}
        </div>
      )}

      {/* Expanded job sheet */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-4 sm:px-5">
          {/* Customer + job fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Customer name"
              value={project.customerName}
              onChange={(v) => onField("customerName", v)}
              autoComplete="off"
            />
            <TextField
              label="Assigned to (salesperson / crew)"
              value={project.assignedTo}
              onChange={(v) => onField("assignedTo", v)}
              autoComplete="off"
            />
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-navy-900">
                Job address
              </span>
              <textarea
                value={project.address}
                onChange={(e) => onField("address", e.target.value)}
                rows={2}
                className={inputClass}
              />
            </label>
            <TextField
              label="Phone"
              type="tel"
              value={project.phone}
              onChange={(v) => onField("phone", v)}
              autoComplete="off"
            />
            <TextField
              label="Email"
              type="email"
              value={project.email}
              onChange={(v) => onField("email", v)}
              autoComplete="off"
            />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-navy-900">
                Install date
              </span>
              <input
                type="date"
                value={project.installDate}
                onChange={(e) => onField("installDate", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          {/* Workflow stages */}
          <fieldset className="mt-5">
            <legend className="text-xs font-semibold uppercase tracking-wide text-steel-500">
              Production stages
            </legend>
            <ol className="mt-2 flex flex-wrap items-center gap-y-1.5">
              {stages.map((stage, i) => (
                <li key={stage.key} className="flex items-center">
                  {i > 0 && (
                    <span
                      className="mx-0.5 text-slate-300 sm:mx-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                  <StageCheck
                    index={i + 1}
                    def={stage}
                    checked={Boolean(project.checklist[stage.key])}
                    onChange={(v) => onCheck(stage.key, v)}
                  />
                </li>
              ))}
            </ol>
          </fieldset>

          {/* Install closeout, subordinate to the main workflow */}
          <fieldset className="mt-4 rounded-xl bg-secondary/50 px-3 py-2.5">
            <legend className="sr-only">Install closeout</legend>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-steel-500">
                Closeout
              </span>
              {CLOSEOUT_ITEMS.map((item) => (
                <label
                  key={item.key}
                  title={item.title}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-1.5 text-sm font-medium text-navy-900"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(project.checklist[item.key])}
                    onChange={(e) => onCheck(item.key, e.target.checked)}
                    aria-label={
                      item.title ? `${item.label} (${item.title})` : item.label
                    }
                    className="size-5 accent-[#0f2743]"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">
              COC = Certificate of Completion
            </p>
          </fieldset>

          {/* Notes */}
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy-900">
              Project notes
            </span>
            <textarea
              value={project.notes}
              onChange={(e) => onField("notes", e.target.value)}
              rows={4}
              placeholder="OSB needed, gutters, mortgage company, material notes, crew instructions, payment details…"
              className={inputClass}
            />
          </label>

          {/* Save state */}
          <div className="mt-3 min-h-6" role="status" aria-live="polite">
            {saveInfo?.state === "saving" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Saving…
              </span>
            )}
            {saveInfo?.state === "saved" && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-600">
                <Check className="size-3.5" aria-hidden="true" />
                Saved
              </span>
            )}
            {saveInfo?.state === "error" && (
              <span className="inline-flex flex-wrap items-center gap-2 text-sm font-medium text-red-700">
                <AlertTriangle className="size-3.5" aria-hidden="true" />
                {saveInfo.message ?? "Save failed."}
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </span>
            )}
          </div>

          {/* History */}
          {project.history.length > 0 && (
            <details className="mt-2 rounded-xl border border-border/70">
              <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm font-semibold text-navy-900">
                <History className="size-4 text-slate-400" aria-hidden="true" />
                History ({project.history.length})
              </summary>
              <ol className="max-h-56 overflow-y-auto border-t border-border/70 px-4 py-2 text-sm">
                {[...project.history].reverse().map((entry, i) => (
                  <li
                    key={`${entry.at}-${i}`}
                    className="flex justify-between gap-3 py-1"
                  >
                    <span className="text-slate-700">{entry.action}</span>
                    <span className="flex-none text-xs text-slate-400">
                      {formatStamp(entry.at)}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
          )}

          {/* Card actions, Delete deliberately far from the checkboxes */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => onArchive(!project.archived)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold",
                project.archived
                  ? "border border-border text-navy-900 hover:bg-secondary"
                  : complete
                    ? "bg-success-600 text-white hover:bg-success-600/90"
                    : "border border-border text-navy-900 hover:bg-secondary",
              )}
            >
              {project.archived ? (
                <>
                  <ArchiveRestore className="size-4" aria-hidden="true" />
                  Restore to board
                </>
              ) : (
                <>
                  <Archive className="size-4" aria-hidden="true" />
                  {complete ? "Archive completed job" : "Archive"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete…
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Created {formatStamp(project.createdAt)}
          </p>
        </div>
      )}
    </section>
  );
}

/* ---------- pieces ---------- */

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-navy-900 outline-none focus:border-steel-500";

function TypeBadge({ type }: { type: "retail" | "insurance" }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        type === "insurance"
          ? "bg-steel-100 text-navy-900"
          : "bg-ember-500/25 text-navy-900",
      )}
    >
      {type}
    </span>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-navy-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </label>
  );
}

function StageCheck({
  index,
  def,
  checked,
  onChange,
}: {
  index: number;
  def: ChecklistItemDef;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors",
        checked
          ? "border-success-600/40 bg-success-600/10 text-navy-900"
          : "border-border bg-white text-slate-700 hover:border-steel-500/50",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={`Stage ${index}: ${def.label}`}
        className="size-5 accent-[#0f2743]"
      />
      <span>
        <span className="mr-1 text-xs font-bold text-slate-400">{index}.</span>
        {def.label}
      </span>
    </label>
  );
}

function formatDay(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
