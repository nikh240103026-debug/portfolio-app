import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
        404
      </p>
      <h1 className="text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 text-lg text-slate-300">
        The page you requested is unavailable, or the project details may not exist yet.
      </p>
      <Link href="/" className="mt-6 rounded-full bg-sky-500 px-5 py-3 font-medium text-slate-950 hover:bg-sky-400">
        Return home
      </Link>
    </main>
  );
}
