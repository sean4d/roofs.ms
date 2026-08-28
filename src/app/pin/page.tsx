import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";
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
