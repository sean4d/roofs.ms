import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";

import { MapView } from "./map-view";
import { PinNav } from "../pin-nav";

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
      <PinNav user={user} active="map" />

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
