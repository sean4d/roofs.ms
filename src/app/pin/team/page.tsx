import { redirect } from "next/navigation";

import { currentUser, listUsers, ADMIN_EMAILS } from "@/lib/quotes/auth";
import { repActivity } from "@/lib/quotes/list";
import { mailQueueSize } from "@/lib/quotes/delivery";

import { PinNav } from "../pin-nav";
import { TeamList } from "./team-list";

export const dynamic = "force-dynamic";

/** Who has access, what they have produced, and the button to take it away. */
export default async function TeamPage() {
  const user = await currentUser();
  if (!user) redirect("/pin");
  if (user.role !== "admin") redirect("/pin/map");

  const [users, activity] = await Promise.all([listUsers(), repActivity()]);

  const mailQueue = user.role === "admin" ? await mailQueueSize() : 0;

  return (
    <>
      <PinNav user={user} active="team" mailQueue={mailQueue} />
      <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Anyone with an @southeastroofing.llc address can create their own
          account. Removing someone takes effect on their very next tap, and
          keeps their customers and estimates.
        </p>
        <TeamList
          users={users.map((u) => ({
            id: u.id,
            email: u.email,
            role: u.role,
            active: u.active,
            createdAt: u.createdAt,
            lastSeenAt: u.lastSeenAt,
            permanent: ADMIN_EMAILS.includes(u.email),
            isMe: u.id === user.id,
            quotes: activity[u.id]?.quotes ?? 0,
          }))}
        />
      </main>
    </>
  );
}
