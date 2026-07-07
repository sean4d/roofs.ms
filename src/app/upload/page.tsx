import type { Metadata } from "next";

import { UploadForm } from "./upload-form";

/**
 * Private job-intake tool at /upload (password-gated in proxy.ts). Noindexed
 * so it never shows in search or the sitemap — it's an internal tool.
 */
export const metadata: Metadata = {
  title: "Upload a Job — Southeast Roofing",
  robots: { index: false, follow: false },
};

export default function UploadPage() {
  return <UploadForm />;
}
