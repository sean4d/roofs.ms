import { notFound } from "next/navigation";

/**
 * Catch-all inside the marketing group so unmatched routes render the
 * branded not-found page *within* the marketing shell (header/footer).
 * Nav and footer intentionally link the full PRD sitemap ahead of each
 * phase. Those routes land here until they ship.
 */
export default function CatchAllPage() {
  notFound();
}
