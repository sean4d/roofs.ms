"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { brandAssets } from "@/content/brand-assets";

/**
 * Password screen for the production portal. No username — the crew shares
 * one passphrase, which is only ever checked on the server. Wrong guesses get
 * a clear message; repeated ones get throttled server-side.
 */
export function ProductionLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/production/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Login failed. Try again.");
      }
      router.refresh(); // server re-renders /production with the new session
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src={brandAssets.logo.navyTrimmed}
            alt="Southeast Roofing logo"
            width={brandAssets.logo.aspect.width}
            height={brandAssets.logo.aspect.height}
            className="h-16 w-auto"
            priority
          />
          <h1 className="text-xl font-bold text-navy-900">Production Portal</h1>
          <p className="text-sm text-slate-600">
            Enter the team password to open the production board.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-navy-900">Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-navy-900 outline-none focus:border-steel-500"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500 hover:text-navy-900"
              >
                {show ? (
                  <EyeOff className="size-5" aria-hidden="true" />
                ) : (
                  <Eye className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                <span aria-live="polite">Logging in…</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
