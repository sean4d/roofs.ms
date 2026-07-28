import "server-only";

import { getWriteClient } from "@/sanity/lib/client";
import { decryptJson, encryptJson } from "./crypto";
import {
  itemLabel,
  stagesFor,
  CLOSEOUT_ITEMS,
  type Checklist,
  type HistoryEntry,
  type ProductionProject,
  type ProjectPatch,
  type ProjectType,
} from "./model";

/**
 * Storage for the production tracker. Projects live in the site's existing
 * Sanity dataset as `productionProject` documents, but — because that dataset
 * is publicly readable — everything sensitive travels inside an encrypted
 * `payload` string (see ./crypto). Only non-identifying plumbing (sort order,
 * archived flag, timestamps) is stored as plaintext fields for cheap queries.
 *
 * Set PRODUCTION_TEST_MEMORY_STORE=1 to swap in an in-process store for local
 * development and end-to-end tests without a Sanity token. Never set it in
 * production — data would vanish on every deploy.
 */

const DOC_TYPE = "productionProject";
const ID_PREFIX = "prodjob.";
const HISTORY_CAP = 60;

interface Payload {
  projectType: ProjectType;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  assignedTo: string;
  installDate: string;
  notes: string;
  checklist: Checklist;
  history: HistoryEntry[];
}

interface StoredDoc {
  _id: string;
  payload: string;
  sortOrder: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

const memoryMode = process.env.PRODUCTION_TEST_MEMORY_STORE === "1";

/** Shared across route bundles in dev via globalThis. */
const memory: Map<string, StoredDoc> = ((
  globalThis as { __serProdMemory?: Map<string, StoredDoc> }
).__serProdMemory ??= new Map());

function emptyPayload(projectType: ProjectType, now: string): Payload {
  return {
    projectType,
    customerName: "",
    address: "",
    phone: "",
    email: "",
    assignedTo: "",
    installDate: "",
    notes: "",
    checklist: {},
    history: [{ at: now, action: "Project created" }],
  };
}

function toProject(doc: StoredDoc): ProductionProject {
  const payload = memoryMode
    ? (JSON.parse(doc.payload) as Payload)
    : decryptJson<Payload>(doc.payload);
  return {
    id: doc._id,
    ...payload,
    sortOrder: doc.sortOrder,
    archived: doc.archived,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function sealPayload(payload: Payload): string {
  return memoryMode ? JSON.stringify(payload) : encryptJson(payload);
}

async function fetchDocs(): Promise<StoredDoc[]> {
  if (memoryMode) {
    return [...memory.values()].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt),
    );
  }
  const client = getWriteClient();
  return client.fetch<StoredDoc[]>(
    `*[_type == $type] | order(sortOrder asc, createdAt asc) {
      _id, payload, sortOrder, archived, createdAt, updatedAt
    }`,
    { type: DOC_TYPE },
  );
}

async function fetchDoc(id: string): Promise<StoredDoc | null> {
  if (memoryMode) return memory.get(id) ?? null;
  const client = getWriteClient();
  return client.fetch<StoredDoc | null>(
    `*[_type == $type && _id == $id][0]{ _id, payload, sortOrder, archived, createdAt, updatedAt }`,
    { type: DOC_TYPE, id },
  );
}

export async function listProjects(): Promise<ProductionProject[]> {
  const docs = await fetchDocs();
  const projects: ProductionProject[] = [];
  for (const doc of docs) {
    try {
      projects.push(toProject(doc));
    } catch {
      // A payload sealed under a rotated key is unreadable — skip rather than
      // take the whole dashboard down. (Recover by restoring the old key.)
    }
  }
  return projects;
}

export async function getProject(id: string): Promise<ProductionProject | null> {
  if (!id.startsWith(ID_PREFIX)) return null;
  const doc = await fetchDoc(id);
  if (!doc) return null;
  try {
    return toProject(doc);
  } catch {
    return null;
  }
}

/**
 * Create a project. The document id comes from the client's request id, so a
 * double-clicked "Add Project" resolves to ONE document no matter how many
 * requests race.
 */
export async function createProject(
  projectType: ProjectType,
  requestId: string,
): Promise<ProductionProject> {
  const now = new Date().toISOString();
  const docs = await fetchDocs();
  // New projects go on top of the custom order.
  const minOrder = docs.reduce((min, d) => Math.min(min, d.sortOrder), 1);
  const doc: StoredDoc = {
    _id: `${ID_PREFIX}${requestId}`,
    payload: sealPayload(emptyPayload(projectType, now)),
    sortOrder: minOrder - 1,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };

  if (memoryMode) {
    if (!memory.has(doc._id)) memory.set(doc._id, doc);
    return toProject(memory.get(doc._id)!);
  }

  const client = getWriteClient();
  await client.createIfNotExists({ _type: DOC_TYPE, ...doc });
  const created = await fetchDoc(doc._id);
  return toProject(created ?? doc);
}

const FIELD_HISTORY: Record<string, string> = {
  customerName: "Customer name updated",
  address: "Address updated",
  phone: "Phone updated",
  email: "Email updated",
  assignedTo: "Assigned person changed",
  installDate: "Install date updated",
  notes: "Notes updated",
};

export async function updateProject(
  id: string,
  patch: ProjectPatch,
): Promise<ProductionProject | null> {
  if (!id.startsWith(ID_PREFIX)) return null;
  const doc = await fetchDoc(id);
  if (!doc) return null;

  const payload = memoryMode
    ? (JSON.parse(doc.payload) as Payload)
    : decryptJson<Payload>(doc.payload);
  const now = new Date().toISOString();
  const events: string[] = [];

  // Text/date fields — only the keys actually sent change.
  for (const key of Object.keys(FIELD_HISTORY) as (keyof typeof FIELD_HISTORY)[]) {
    const next = patch[key as keyof ProjectPatch];
    if (typeof next === "string" && next !== payload[key as keyof Payload]) {
      (payload as unknown as Record<string, string>)[key] = next;
      events.push(FIELD_HISTORY[key]);
    }
  }

  // Checklist — only keys valid for this project type are accepted, and one
  // checkbox never flips another.
  if (patch.checklist) {
    const validKeys = new Set(
      [...stagesFor(payload.projectType), ...CLOSEOUT_ITEMS].map((i) => i.key),
    );
    for (const [key, value] of Object.entries(patch.checklist)) {
      if (!validKeys.has(key)) continue;
      if (Boolean(payload.checklist[key]) === value) continue;
      payload.checklist[key] = value;
      events.push(
        `${itemLabel(payload.projectType, key)} ${value ? "checked" : "unchecked"}`,
      );
    }
  }

  let archived = doc.archived;
  if (typeof patch.archived === "boolean" && patch.archived !== doc.archived) {
    archived = patch.archived;
    events.push(patch.archived ? "Project archived" : "Project restored");
  }

  if (events.length === 0) return toProject(doc);

  payload.history = [
    ...payload.history,
    ...events.map((action) => ({ at: now, action })),
  ].slice(-HISTORY_CAP);

  const updated: StoredDoc = {
    ...doc,
    payload: sealPayload(payload),
    archived,
    updatedAt: now,
  };

  if (memoryMode) {
    memory.set(id, updated);
    return toProject(updated);
  }

  const client = getWriteClient();
  await client
    .patch(id)
    .set({ payload: updated.payload, archived, updatedAt: now })
    .commit();
  return toProject(updated);
}

/** Persist a full custom order. Ids not in the list keep their place. */
export async function reorderProjects(ids: string[]): Promise<void> {
  const valid = ids.filter((id) => id.startsWith(ID_PREFIX));
  if (memoryMode) {
    valid.forEach((id, index) => {
      const doc = memory.get(id);
      if (doc) memory.set(id, { ...doc, sortOrder: index });
    });
    return;
  }
  const client = getWriteClient();
  let tx = client.transaction();
  valid.forEach((id, index) => {
    tx = tx.patch(id, (p) => p.set({ sortOrder: index }));
  });
  await tx.commit();
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!id.startsWith(ID_PREFIX)) return false;
  if (memoryMode) return memory.delete(id);
  const client = getWriteClient();
  await client.delete(id);
  return true;
}
