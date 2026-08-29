import Link from "next/link";

import type { User } from "@/lib/quotes/auth";

/** One bar across the tool, so the map is never a dead end. */
export function PinNav({
  user,
  active,
  mailQueue = 0,
}: {
  user: User;
  active: "map" | "estimates" | "mail" | "team" | "settings";
  /** How many mailers are waiting. Shown as a badge so the office can see
   *  work is queued without opening the page. */
  mailQueue?: number;
}) {
  const tab = (href: string, key: string, label: string) => (
    <Link
      key={key}
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
        active === key ? "bg-[#123b63] text-white" : "text-slate-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-2">
      {tab("/pin/map", "map", "Map")}
      {tab("/pin/estimates", "estimates", "Estimates")}
      {user.role === "admin" &&
        tab(
          "/pin/mail",
          "mail",
          mailQueue > 0 ? `Mailers ${mailQueue}` : "Mailers",
        )}
      {user.role === "admin" && tab("/pin/team", "team", "Team")}
      {user.role === "admin" && tab("/pin/settings", "settings", "Settings")}
      <form action="/api/pin/signout" method="post" className="ml-auto">
        <button
          type="submit"
          className="px-2 text-xs font-medium text-slate-400 underline underline-offset-4"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
