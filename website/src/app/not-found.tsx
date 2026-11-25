import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
        <p className="font-mono text-sm font-semibold text-accent">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">This topic doesn&apos;t exist, or it moved.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Back to all topics
        </Link>
      </div>
    </main>
  );
}
