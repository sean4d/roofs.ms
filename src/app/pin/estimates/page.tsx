import { redirect } from "next/navigation";
import Link from "next/link";

import { currentUser } from "@/lib/quotes/auth";
import { searchQuotes, quoteStats } from "@/lib/quotes/list";

import { PinNav } from "../pin-nav";

export const dynamic = "force-dynamic";

/**
 * Every estimate, searchable.
 *
 * The scenario this exists for: a customer rings holding a printed piece and
 * reads out the estimate number, or just says their street. One search box
 * covers the number, the address, the name, the email and the phone, because
 * whoever answers the phone does not get to choose which one they are given.
 *
 * Reps see their own; admins see everybody's. That is enforced in the query.
 */
export default async function EstimatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/pin");

  const { q = "" } = await searchParams;
  const [rows, stats] = await Promise.all([
    searchQuotes(user, q),
    quoteStats(user),
  ]);

  return (
    <>
      <PinNav user={user} active="estimates" />
      <main className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-4 flex gap-4 text-sm text-slate-600">
          <span>
            <strong className="text-slate-900">{stats.total}</strong> estimates
          </span>
          <span>
            <strong className="text-slate-900">{stats.withEmail}</strong> with
            an email
          </span>
          <span>
            <strong className="text-slate-900">{stats.sold}</strong> sold
          </span>
        </div>

        <form className="mb-4 flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Estimate number, address, name, email or phone"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#123b63]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#123b63] px-5 py-3 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>

        {rows.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            {q
              ? `Nothing matches "${q}".`
              : "No estimates yet. Measure a roof and save it."}
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.quoteId}>
                <Link
                  href={`/pin/proposal/${r.quoteId}`}
                  className="block rounded-lg border border-slate-200 bg-white p-3.5 active:bg-slate-50"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-[#123b63]">
                      {r.shortId}
                    </span>
                    <span className="font-[family-name:var(--font-archivo)] text-lg font-extrabold text-[#123b63]">
                      {r.priceShown
                        ? `$${r.priceShown.toLocaleString()}`
                        : "--"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-slate-900">
                    {r.name ?? "Homeowner"}
                  </p>
                  <p className="truncate text-xs text-slate-600">{r.address}</p>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {r.squares} sq &middot; {r.createdAt.slice(0, 10)} &middot;{" "}
                    {r.repName}
                    {r.email ? ` · ${r.email}` : ""}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
