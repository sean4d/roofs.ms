import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";

export const dynamic = "force-dynamic";

/**
 * The tool itself. Placeholder while the map is built: what it proves today is
 * that the account system works end to end, which is the part everything else
 * hangs off.
 *
 * Note the gate. currentUser() re-reads the row on every request, so an admin
 * deactivating a rep takes effect here on the rep's very next tap, not
 * whenever their cookie happens to lapse.
 */
export default async function MapPage() {
  const user = await currentUser();
  if (!user) redirect("/pin");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#123b63]">
            Signed in
          </h1>
          <p className="mt-1 text-sm text-slate-600">{user.email}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
            user.role === "admin"
              ? "bg-[#123b63] text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {user.role}
        </span>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-archivo)] text-lg font-bold text-[#123b63]">
          The map goes here
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Tap a house, get it measured and priced, send the estimate. Being
          built now. Accounts, the rate card, roof measurement and storm history
          are already done and tested.
        </p>
      </div>

      <form action="/api/pin/signout" method="post" className="mt-8">
        <button
          type="submit"
          className="text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
