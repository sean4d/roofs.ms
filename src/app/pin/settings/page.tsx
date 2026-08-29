import { redirect } from "next/navigation";

import { currentUser } from "@/lib/quotes/auth";
import { mailQueueSize } from "@/lib/quotes/delivery";
import { getProfile } from "@/lib/quotes/profile";

import { PinNav } from "../pin-nav";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

/** Everything on the proposal that the office should own, in one screen. */
export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/pin");
  if (user.role !== "admin") redirect("/pin/map");

  const profile = await getProfile();

  const mailQueue = user.role === "admin" ? await mailQueueSize() : 0;

  return (
    <>
      <PinNav user={user} active="settings" mailQueue={mailQueue} />
      <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          These are the details on every estimate you send. Clear a box to go
          back to the built-in value, so you can never blank something out by
          accident.
        </p>
        <SettingsForm profile={profile} />
      </main>
    </>
  );
}
