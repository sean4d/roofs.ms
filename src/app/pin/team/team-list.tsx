"use client";

import { useState } from "react";

interface Row {
  id: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  lastSeenAt: string | null;
  permanent: boolean;
  isMe: boolean;
  quotes: number;
}

/**
 * The team, with the remove button the owner could not find because it did not
 * exist. The backend rule was written first and had no screen attached to it.
 */
export function TeamList({ users }: { users: Row[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState(users);

  async function change(id: string, action: "remove" | "restore") {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch("/api/pin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not do that.");
      } else {
        setRows((rs) =>
          rs.map((r) =>
            r.id === id ? { ...r, active: action === "restore" } : r,
          ),
        );
      }
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <ul className="space-y-2">
        {rows.map((u) => (
          <li
            key={u.id}
            className={`flex items-center gap-3 rounded-lg border p-3.5 ${
              u.active
                ? "border-slate-200 bg-white"
                : "border-slate-200 bg-slate-100 opacity-70"
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {u.email}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {u.role === "admin" ? "Admin" : "Rep"} &middot; {u.quotes}{" "}
                estimate{u.quotes === 1 ? "" : "s"} &middot;{" "}
                {u.lastSeenAt
                  ? `last seen ${u.lastSeenAt.slice(0, 10)}`
                  : "never signed in"}
                {!u.active && " · REMOVED"}
              </p>
            </div>
            {u.permanent ? (
              <span className="shrink-0 text-[11px] text-slate-400">
                Permanent
              </span>
            ) : u.active ? (
              <button
                onClick={() => change(u.id, "remove")}
                disabled={busy === u.id || u.isMe}
                className="shrink-0 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
              >
                {busy === u.id ? "..." : "Remove"}
              </button>
            ) : (
              <button
                onClick={() => change(u.id, "restore")}
                disabled={busy === u.id}
                className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
              >
                {busy === u.id ? "..." : "Restore"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
