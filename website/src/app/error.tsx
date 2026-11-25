"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
        <p className="font-mono text-sm font-semibold text-accent">Error</p>
        <h1 className="mt-3 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">Try again, or go back to the home page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Try again
          </button>
          <Link href="/" className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-foreground/5">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
