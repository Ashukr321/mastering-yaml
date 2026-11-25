import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_DESCRIPTION, SITE_NAME, getAllDocs, getCategories } from "@/lib/content";

const SHOWN = 8;

export default function Home() {
  const categories = getCategories();
  const docs = getAllDocs();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
      <span className="inline-block rounded-full border border-line bg-card px-2.5 py-0.5 text-xs font-medium">
        {docs.length} topics · {categories.length} {categories.length === 1 ? "category" : "categories"}
      </span>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{SITE_NAME}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{SITE_DESCRIPTION}</p>
      {docs[0] && (
        <Link
          href={`/${docs[0].slug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Start reading <ArrowRight className="size-4" />
        </Link>
      )}
      <hr className="my-10 border-line" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <section key={c.slug} className="rounded-xl border border-line bg-card p-5">
            <h2 className="font-semibold">
              <Link href={`/${c.docs[0].slug}`} className="hover:text-accent">
                {c.title}
              </Link>
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {c.docs.slice(0, SHOWN).map((d) => (
                <li key={d.slug}>
                  <Link href={`/${d.slug}`} className="text-muted hover:text-foreground">
                    {d.title}
                  </Link>
                </li>
              ))}
              {c.docs.length > SHOWN && (
                <li className="pt-1 text-xs text-muted">+ {c.docs.length - SHOWN} more</li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
