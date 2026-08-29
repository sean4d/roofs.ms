import type { Metadata } from "next";

import { UploadStudio } from "./upload-studio";

/** Internal tool. Never indexed, never linked from the site. */
export const metadata: Metadata = {
  title: "Upload Studio",
  robots: { index: false, follow: false, nocache: true },
};

export default function UploadStudioPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
      <p className="eyebrow text-champagne-500">Internal</p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Upload Studio</h1>
      <p className="text-bone-400 mt-4 max-w-2xl leading-relaxed">
        Add real photography to the site. Pick your photos, tell each one where
        it belongs, and send. Everything commits into the repository, so nothing
        is stored on a third-party service and every image is reviewable.
      </p>
      <div className="mt-10">
        <UploadStudio />
      </div>
    </main>
  );
}
