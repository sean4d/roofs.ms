import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";

import { MapView } from "./map-view";

export const dynamic = "force-dynamic";

/**
 * The tool.
 *
 * The gate lives here rather than in proxy.ts because currentUser() re-reads
 * the user row, so an admin deactivating a rep locks them out on their very
 * next tap instead of whenever their cookie happens to lapse.
 *
 * The browser key is passed in from the server because it is public by nature:
 * it ends up in the page source either way, which is exactly why it must be
 * restricted by HTTP referrer in the Google console. It is not the server key
 * and must never be.
 */
export default async function MapPage() {
  const user = await currentUser();
  if (!user) redirect("/pin");

  const browserKey = process.env.GOOGLE_MAPS_BROWSER_KEY;

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
        <span className="font-[family-name:var(--font-archivo)] text-lg font-extrabold text-[#123b63]">
          Pin
        </span>
        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <span className="rounded-full bg-[#123b63] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
              Admin
            </span>
          )}
          <form action="/api/pin/signout" method="post">
            <button
              type="submit"
              className="text-xs font-medium text-slate-500 underline underline-offset-4"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {browserKey ? (
        <MapView apiKey={browserKey} />
      ) : (
        <main className="flex-1 p-5">
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">
              Map not configured
            </p>
            <p className="mt-1 text-sm text-amber-900">
              GOOGLE_MAPS_BROWSER_KEY is not set on this deployment.
            </p>
          </div>
        </main>
      )}
    </>
  );
}
