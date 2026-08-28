import type { Metadata } from "next";

/**
 * Shell for the field tool.
 *
 * Deliberately outside the (marketing) route group, so it gets none of the
 * public site's header, footer or calls to action. This is a tool a rep opens
 * on a phone between two doors, not a page to browse.
 */

export const metadata: Metadata = {
  title: "Pin",
  // Every page under here is either a login or somebody's home address and the
  // price we quoted them. None of it belongs in a search index.
  robots: { index: false, follow: false, nocache: true },
};

export default function PinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-50 font-[family-name:var(--font-inter)] text-slate-900">
      {children}
    </div>
  );
}
