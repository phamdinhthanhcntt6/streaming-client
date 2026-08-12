import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen flex-1 place-items-center bg-slate-50 px-6 text-white">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#09bcae]">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl text-[#09bcae]">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-400">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/music"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#09bcae] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#08a99d] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#09bcae]/30"
        >
          Back to Music
        </Link>
      </div>
    </main>
  );
}
