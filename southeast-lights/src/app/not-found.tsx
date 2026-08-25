import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-champagne-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
        That page isn&rsquo;t here.
      </h1>
      <p className="text-bone-400 mt-4 max-w-md leading-relaxed">
        The link may be old, or the page may have moved. Everything we do is a
        click away from the home page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <Link href="/quote" className="btn-secondary">
          Get a quote
        </Link>
      </div>
    </main>
  );
}
