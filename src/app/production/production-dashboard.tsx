"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { brandAssets } from "@/content/brand-assets";
import {
  matchesFilter,
  matchesSearch,
  progressFor,
  type ProductionProject,
  type ProjectPatch,
  type ProjectType,
} from "@/lib/production/model";
import { ProjectCard, type SaveInfo } from "./project-card";

/**
 * The production board: stacked project cards over a spreadsheet-style
 * toolbar. All data flows through the session-guarded /api/production
 * endpoints, checkbox changes save immediately, text autosaves shortly after
 * typing stops, and a failed save keeps the typed value on screen with a
 * retry. Data refreshes when the tab regains focus (unless edits are still
 * in flight) and via the manual Refresh button.
 */

const FILTERS: { key: string; label: string }[] = [
  { key: "active", label: "All Active" },
  { key: "retail", label: "Retail" },
  { key: "insurance", label: "Insurance" },
  { key: "incomplete", label: "Incomplete" },
  { key: "ready", label: "Ready to Install" },
  { key: "installed", label: "Installed" },
  { key: "awaitingPayment", label: "Awaiting Payment" },
  { key: "complete", label: "Complete" },
  { key: "archived", label: "Archived" },
];

const SORTS: { key: string; label: string }[] = [
  { key: "custom", label: "Custom order" },
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "name", label: "Customer name" },
  { key: "installDate", label: "Install date" },
  { key: "progress", label: "Progress" },
  { key: "updated", label: "Last updated" },
];

function sortProjects(list: ProductionProject[], sort: string) {
  const copy = [...list];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "oldest":
      return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "name":
      return copy.sort((a, b) =>
        (a.customerName || "￿").localeCompare(b.customerName || "￿"),
      );
    case "installDate":
      return copy.sort((a, b) =>
        (a.installDate || "9999").localeCompare(b.installDate || "9999"),
      );
    case "progress":
      return copy.sort(
        (a, b) =>
          progressFor(b.projectType, b.checklist).percent -
          progressFor(a.projectType, a.checklist).percent,
      );
    case "updated":
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    default:
      return copy.sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt),
      );
  }
}

export function ProductionDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProductionProject[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [sort, setSort] = useState("custom");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [addOpen, setAddOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductionProject | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [saveInfo, setSaveInfo] = useState<Record<string, SaveInfo>>({});

  const projectsRef = useRef<ProductionProject[]>([]);
  useEffect(() => {
    projectsRef.current = projects ?? [];
  }, [projects]);
  /** field-debounce timers keyed by `${id}:${field}` */
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  /** pending debounces + in-flight saves, blocks focus-refetch clobbering */
  const dirtyRef = useRef(0);
  /** last failed patch per project, for the Retry button */
  const failedRef = useRef(new Map<string, ProjectPatch>());
  const savedTimerRef = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  );

  /** Load fresh data. First setState only ever happens after the await. */
  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/production/projects", {
        cache: "no-store",
      });
      if (res.status === 401) {
        router.refresh(); // session expired → server shows the login screen
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { projects: ProductionProject[] };
      setProjects(data.projects);
      setLoadError("");
    } catch {
      setLoadError("Couldn't load projects. Check your signal and refresh.");
      setProjects((prev) => prev ?? []);
    }
  }, [router]);

  const fetchProjects = useCallback(
    async (manual = false) => {
      if (manual) setRefreshing(true);
      try {
        await loadProjects();
      } finally {
        if (manual) setRefreshing(false);
      }
    },
    [loadProjects],
  );

  useEffect(() => {
    // Initial data load, setState only fires after the network await, so
    // this can't cascade renders; the rule can't see through the async hop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProjects();
  }, [loadProjects]);

  // Re-pull fresh data when the tab regains focus, but never over live edits.
  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible" && dirtyRef.current === 0) {
        void loadProjects();
      }
    };
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadProjects]);

  function setInfo(id: string, info: SaveInfo | null) {
    setSaveInfo((prev) => {
      const next = { ...prev };
      if (info) next[id] = info;
      else delete next[id];
      return next;
    });
  }

  /** Merge a server-fresh project, but keep any field mid-edit locally. */
  const applyServer = useCallback((server: ProductionProject) => {
    setProjects((prev) =>
      (prev ?? []).map((p) => {
        if (p.id !== server.id) return p;
        const merged = { ...server };
        for (const key of timersRef.current.keys()) {
          const [id, field] = [
            key.slice(0, key.lastIndexOf(":")),
            key.slice(key.lastIndexOf(":") + 1),
          ];
          if (id === p.id && field in merged) {
            (merged as unknown as Record<string, unknown>)[field] = (
              p as unknown as Record<string, unknown>
            )[field];
          }
        }
        return merged;
      }),
    );
  }, []);

  const savePatch = useCallback(
    async (id: string, patch: ProjectPatch) => {
      setInfo(id, { state: "saving" });
      dirtyRef.current += 1;
      try {
        const res = await fetch(`/api/production/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.status === 401) {
          router.refresh();
          throw new Error("Session expired, log back in.");
        }
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Save failed. Try again.");
        }
        const data = (await res.json()) as { project: ProductionProject };
        applyServer(data.project);
        failedRef.current.delete(id);
        setInfo(id, { state: "saved" });
        clearTimeout(savedTimerRef.current.get(id));
        savedTimerRef.current.set(
          id,
          setTimeout(() => setInfo(id, null), 2500),
        );
      } catch (err) {
        // Merge with any earlier failed patch so a retry replays everything.
        const prior = failedRef.current.get(id) ?? {};
        failedRef.current.set(id, {
          ...prior,
          ...patch,
          checklist: { ...prior.checklist, ...patch.checklist },
        });
        setInfo(id, {
          state: "error",
          message:
            err instanceof Error ? err.message : "Save failed. Try again.",
        });
      } finally {
        dirtyRef.current -= 1;
      }
    },
    [applyServer, router],
  );

  const retrySave = useCallback(
    (id: string) => {
      const patch = failedRef.current.get(id);
      if (patch) savePatch(id, patch);
    },
    [savePatch],
  );

  /** Optimistic text/date-field edit with an 800 ms autosave debounce. */
  const updateField = useCallback(
    (id: string, field: string, value: string) => {
      setProjects((prev) =>
        (prev ?? []).map((p) => (p.id === id ? { ...p, [field]: value } : p)),
      );
      const key = `${id}:${field}`;
      const existing = timersRef.current.get(key);
      if (existing) clearTimeout(existing);
      else dirtyRef.current += 1;
      timersRef.current.set(
        key,
        setTimeout(() => {
          timersRef.current.delete(key);
          dirtyRef.current -= 1;
          const current = projectsRef.current.find((p) => p.id === id);
          if (!current) return;
          savePatch(id, {
            [field]: (current as unknown as Record<string, string>)[field],
          } as ProjectPatch);
        }, 800),
      );
    },
    [savePatch],
  );

  /** Checkbox changes save immediately. One box never flips another. */
  const toggleCheck = useCallback(
    (id: string, itemKey: string, value: boolean) => {
      setProjects((prev) =>
        (prev ?? []).map((p) =>
          p.id === id
            ? { ...p, checklist: { ...p.checklist, [itemKey]: value } }
            : p,
        ),
      );
      savePatch(id, { checklist: { [itemKey]: value } });
    },
    [savePatch],
  );

  const setArchived = useCallback(
    (id: string, archived: boolean) => {
      setProjects((prev) =>
        (prev ?? []).map((p) => (p.id === id ? { ...p, archived } : p)),
      );
      savePatch(id, { archived });
    },
    [savePatch],
  );

  async function createProject(projectType: ProjectType) {
    if (creating) return; // double-click guard (plus idempotent id server-side)
    setCreating(true);
    try {
      const res = await fetch("/api/production/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType, requestId: crypto.randomUUID() }),
      });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not create the project.");
      }
      const data = (await res.json()) as { project: ProductionProject };
      setProjects((prev) => [data.project, ...(prev ?? [])]);
      setExpanded((prev) => new Set(prev).add(data.project.id));
      setAddOpen(false);
      setFilter((f) => (f === "archived" ? "active" : f));
      setSort("custom");
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Could not create the project.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    const id = deleteTarget.id;
    try {
      const res = await fetch(`/api/production/projects/${id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok && res.status !== 404) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Delete failed. Try again.");
      }
      setProjects((prev) => (prev ?? []).filter((p) => p.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  /** Move a card up/down within the custom order and persist the new order. */
  const moveProject = useCallback(
    (id: string, direction: -1 | 1) => {
      const all = sortProjects(projectsRef.current, "custom");
      const active = all.filter((p) => !p.archived);
      const index = active.findIndex((p) => p.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= active.length) return;
      [active[index], active[target]] = [active[target], active[index]];
      const orderedIds = [
        ...active.map((p) => p.id),
        ...all.filter((p) => p.archived).map((p) => p.id),
      ];
      setProjects((prev) =>
        (prev ?? []).map((p) => ({
          ...p,
          sortOrder: orderedIds.indexOf(p.id),
        })),
      );
      setInfo(id, { state: "saving" });
      fetch("/api/production/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: orderedIds }),
      })
        .then(async (res) => {
          if (res.status === 401) {
            router.refresh();
            return;
          }
          if (!res.ok) throw new Error();
          setInfo(id, { state: "saved" });
          clearTimeout(savedTimerRef.current.get(id));
          savedTimerRef.current.set(
            id,
            setTimeout(() => setInfo(id, null), 2000),
          );
        })
        .catch(() => {
          setInfo(id, {
            state: "error",
            message: "Couldn't save the new order. Refresh and try again.",
          });
        });
    },
    [router],
  );

  async function logout() {
    await fetch("/api/production/session", { method: "DELETE" }).catch(
      () => null,
    );
    router.refresh();
  }

  const activeProjects = useMemo(
    () => (projects ?? []).filter((p) => !p.archived),
    [projects],
  );
  const archivedCount = (projects ?? []).length - activeProjects.length;
  const retailCount = activeProjects.filter(
    (p) => p.projectType === "retail",
  ).length;

  const visible = useMemo(() => {
    const list = (projects ?? []).filter(
      (p) => matchesFilter(p, filter) && matchesSearch(p, query),
    );
    return sortProjects(list, sort);
  }, [projects, filter, query, sort]);

  const reorderEnabled = sort === "custom" && filter !== "archived" && !query;
  const activeOrder = sortProjects(activeProjects, "custom").map((p) => p.id);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pt-6 pb-24 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={brandAssets.logo.mark}
            alt="Southeast Roofing logo"
            width={brandAssets.logo.markAspect.width}
            height={brandAssets.logo.markAspect.height}
            className="h-9 w-auto flex-none"
            priority
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-navy-900">
              Production Portal
            </h1>
            <p className="text-xs text-slate-500">
              {activeProjects.length} active · {retailCount} retail ·{" "}
              {activeProjects.length - retailCount} insurance
              {archivedCount > 0 ? ` · ${archivedCount} archived` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => fetchProjects(true)}
            aria-label="Refresh projects"
            title="Refresh"
            className="grid size-11 place-items-center rounded-full border border-border bg-white text-navy-900 hover:bg-secondary"
          >
            <RefreshCw
              className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-navy-900 hover:bg-secondary"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-base font-semibold text-white hover:bg-navy-700 sm:flex-none"
          >
            <Plus className="size-5" aria-hidden="true" />
            Add Project
          </button>
          <button
            type="button"
            onClick={() =>
              setFilter((f) => (f === "archived" ? "active" : "archived"))
            }
            aria-pressed={filter === "archived"}
            className={`inline-flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${
              filter === "archived"
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-border bg-white text-navy-900 hover:bg-secondary"
            }`}
          >
            <Archive className="size-4" aria-hidden="true" />
            Archived{archivedCount > 0 ? ` (${archivedCount})` : ""}
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search projects</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, address, phone, notes…"
              className="h-11 w-full rounded-xl border border-border bg-white pr-4 pl-10 text-sm text-navy-900 outline-none focus:border-steel-500"
            />
          </label>
          <div className="flex gap-2">
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Filter projects</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium text-navy-900 outline-none focus:border-steel-500"
              >
                {FILTERS.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Sort projects</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium text-navy-900 outline-none focus:border-steel-500"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    Sort: {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {loadError && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <AlertTriangle
            className="mt-0.5 size-4 flex-none"
            aria-hidden="true"
          />
          {loadError}
        </p>
      )}

      {/* Project stack */}
      <div className="mt-5 flex flex-col gap-3" aria-live="polite">
        {projects === null ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white py-16 text-slate-500">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Loading projects…
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <p className="font-semibold text-navy-900">
              {(projects ?? []).length === 0
                ? "No projects yet"
                : "Nothing matches"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {(projects ?? []).length === 0
                ? "Tap “Add Project” to start your first job card."
                : "Try a different search, filter, or sort."}
            </p>
          </div>
        ) : (
          visible.map((project) => {
            const orderIndex = activeOrder.indexOf(project.id);
            return (
              <ProjectCard
                key={project.id}
                project={project}
                expanded={expanded.has(project.id)}
                onToggleExpand={() => toggleExpand(project.id)}
                saveInfo={saveInfo[project.id]}
                onField={(field, value) =>
                  updateField(project.id, field, value)
                }
                onCheck={(key, value) => toggleCheck(project.id, key, value)}
                onArchive={(archived) => setArchived(project.id, archived)}
                onRequestDelete={() => setDeleteTarget(project)}
                onRetry={() => retrySave(project.id)}
                reorder={
                  reorderEnabled && !project.archived
                    ? {
                        canMoveUp: orderIndex > 0,
                        canMoveDown:
                          orderIndex >= 0 &&
                          orderIndex < activeOrder.length - 1,
                        onMove: (dir) => moveProject(project.id, dir),
                      }
                    : undefined
                }
              />
            );
          })
        )}
      </div>

      {/* Add Project dialog */}
      {addOpen && (
        <Modal
          onClose={() => !creating && setAddOpen(false)}
          titleId="add-title"
        >
          <h2 id="add-title" className="text-lg font-bold text-navy-900">
            What type of project is this?
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              autoFocus
              disabled={creating}
              onClick={() => createProject("retail")}
              className="rounded-xl border-2 border-navy-900 bg-navy-900 px-5 py-4 text-left text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              <span className="block text-base font-bold">Retail</span>
              <span className="block text-sm text-white/75">
                Down Payment → Materials → Permit → Install → Final Payment
              </span>
            </button>
            <button
              type="button"
              disabled={creating}
              onClick={() => createProject("insurance")}
              className="rounded-xl border-2 border-border bg-white px-5 py-4 text-left text-navy-900 transition hover:border-navy-900 disabled:opacity-60"
            >
              <span className="block text-base font-bold">Insurance</span>
              <span className="block text-sm text-slate-500">
                Adds Deductible + Depreciation Filed / Collected
              </span>
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {creating ? (
              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creating…
              </span>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              disabled={creating}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-secondary disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <Modal
          onClose={() => !deleting && setDeleteTarget(null)}
          titleId="delete-title"
        >
          <h2 id="delete-title" className="text-lg font-bold text-navy-900">
            Permanently delete this project?
          </h2>
          <div className="mt-3 rounded-xl bg-secondary/60 px-4 py-3 text-sm">
            <p className="font-semibold text-navy-900">
              {deleteTarget.customerName || "Unnamed customer"}
            </p>
            <p className="text-slate-600">
              {deleteTarget.address || "No address entered"}
            </p>
          </div>
          <p className="mt-3 text-sm text-red-700">
            This removes the job and its history for everyone.{" "}
            <strong>It cannot be undone.</strong> Use Archive instead if you
            just want it off the board.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-secondary disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              Delete permanently
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

/** Minimal accessible modal: overlay, Escape/backdrop close, scroll lock. */
function Modal({
  children,
  onClose,
  titleId,
}: {
  children: React.ReactNode;
  onClose: () => void;
  titleId: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mt-2 -mr-2 grid size-9 place-items-center rounded-full text-slate-400 hover:bg-secondary hover:text-navy-900"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="-mt-4">{children}</div>
      </div>
    </div>
  );
}
