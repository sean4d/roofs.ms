import { redirect } from "next/navigation";

import { cookies } from "next/headers";

import {
  PENDING_COOKIE,
  SESSION_COOKIE,
  claimPendingSession,
  currentUser,
  sessionCookieOptions,
} from "@/lib/quotes/auth";
import { dbConfigured } from "@/lib/quotes/db";

import { SignInForm } from "./sign-in-form";

export const dynamic = "force-dynamic";

/**
 * The front door. Signed in, you never see this: it forwards to the map.
 */
export default async function PinPage() {
  if (dbConfigured()) {
    const user = await currentUser();
    if (user) redirect("/pin/map");

    /**
     * Pick up a link that was opened on another device.
     *
     * The client already polls for this, but only while the form is showing
     * "check your email". Refresh the page, or close the tab and come back,
     * and the component remounts in its initial state and the poll never
     * starts. Which is exactly what a person does when a link does not seem
     * to have worked. So the check also runs here, on every load of the sign
     * in page, and a laptop that has been sitting open simply lets you in on
     * the next refresh.
     */
    const store = await cookies();
    const pending = store.get(PENDING_COOKIE)?.value;
    if (pending) {
      const session = await claimPendingSession(pending);
      if (session) {
        store.set(SESSION_COOKIE, session, sessionCookieOptions());
        store.delete(PENDING_COOKIE);
        redirect("/pin/map");
      }
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-archivo)] text-3xl font-extrabold tracking-tight text-[#123b63]">
          Pin
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Southeast Roofing field estimates
        </p>
      </div>

      <SignInForm />

      {!dbConfigured() && (
        <p className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Setup is not finished: no database is connected yet.
        </p>
      )}
    </main>
  );
}
