import Link from "next/link";

import type { User } from "@/lib/quotes/auth";

/**
 * One bar across the tool, so the map is never a dead end.
 *
 * IT HAS TO SCROLL. This started as three tabs and is now six, and six do not
 * fit across a 390px phone: Settings ran off the right edge and the bar did
 * not scroll, so on a phone there was simply no way to reach it. An admin
 * could not open the settings screen at all, which is also where the button
 * that applies database migrations lives.
 *
 * Sign out is pinned outside the scroller rather than sitting at the end of
 * it. It is the one thing somebody needs to find in a hurry on a shared phone,
 * and burying it past a horizontal scroll is how a rep hands an unlocked
 * account to the next person.
 */
export function PinNav({
  user,
  active,
  mailQueue = 0,
}: {
  user: User;
  active: "map" | "estimates" | "mail" | "accuracy" | "team" | "settings";
  /** How many mailers are waiting. Shown as a badge so the office can see
   *  work is queued without opening the page. */
  mailQueue?: number;
}) {
  const tab = (href: string, key: string, label: string, badge?: number) => (
    <Link
      key={key}
      href={href}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap ${
        active === key ? "bg-[#123b63] text-white" : "text-slate-600"
      }`}
    >
      {label}
      {badge ? (
        <span
          className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active === key ? "bg-white/25" : "bg-amber-500 text-white"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );

  return (
    <header className="flex items-center gap-1 border-b border-slate-200 bg-white py-2 pr-2 pl-1">
      {/* overscroll-x-contain so swiping the tabs on a phone does not trigger
          the browser's back gesture halfway through. */}
      <nav className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden">
        {tab("/pin/map", "map", "Map")}
        {tab("/pin/estimates", "estimates", "Estimates")}
        {user.role === "admin" &&
          tab("/pin/mail", "mail", "Mailers", mailQueue)}
        {user.role === "admin" && tab("/pin/accuracy", "accuracy", "Accuracy")}
        {user.role === "admin" && tab("/pin/team", "team", "Team")}
        {user.role === "admin" && tab("/pin/settings", "settings", "Settings")}
      </nav>
      <form action="/api/pin/signout" method="post" className="shrink-0">
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
