import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Markdown, { CodeFileView } from "@/components/Markdown";
import { SITE_NAME, getAllDocs, getDoc, getNeighbours, humanize } from "@/lib/content";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDoc((await params).slug.join("/"));
  if (!doc) return {};
  const title = `${doc.title} — ${doc.categoryTitle}`;
  return {
    title,
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: { type: "article", title, description: doc.description, url: `/${doc.slug}` },
  };
}

const caption = (url: string) => humanize(decodeURIComponent(url.split("/").pop()!).replace(/\.[a-z]+$/i, ""));

export default async function DocPage({ params }: Props) {
  const doc = getDoc((await params).slug.join("/"));
  if (!doc) notFound();
  const { prev, next } = getNeighbours(doc.slug);
  const practice = doc.codeFiles.filter((f) => !f.solution);
  const solution = doc.codeFiles.filter((f) => f.solution);

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          {SITE_NAME}
        </Link>
        {[doc.categoryTitle, doc.group].filter(Boolean).map((c) => (
          <span key={c} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            {c}
          </span>
        ))}
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{doc.title}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>

      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert prose-a:text-accent prose-img:rounded-lg">
        {doc.body.trim() ? (
          <Markdown doc={doc} />
        ) : (
          !doc.images.length && <p className="italic text-muted">This topic is still being written.</p>
        )}

        {doc.images.map((src) => (
          <figure key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption(src)} loading="lazy" />
            <figcaption>
              {caption(src)} ·{" "}
              <a href={src} target="_blank" rel="noopener">
                Open full screen
              </a>
            </figcaption>
          </figure>
        ))}

        {doc.visualizations.map((src) => (
          <figure key={src}>
            <iframe
              src={src}
              sandbox="allow-scripts"
              title={caption(src)}
              className="h-[70vh] w-full rounded-lg border border-line bg-white"
            />
            <figcaption>
              <a href={src} target="_blank" rel="noopener" className="inline-flex items-center gap-1">
                Open full screen <ExternalLink className="size-3.5" />
              </a>
            </figcaption>
          </figure>
        ))}

        {practice.length > 0 && <h2>Practice files</h2>}
        {practice.map((f) => (
          <CodeFileView key={f.path} name={f.name} content={f.content} />
        ))}
        {solution.length > 0 && <h2>Solution</h2>}
        {solution.map((f) => (
          <details key={f.path}>
            <summary className="cursor-pointer font-mono text-sm">{f.name}</summary>
            <CodeFileView name={f.name} content={f.content} />
          </details>
        ))}
      </div>

      <nav className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/${prev.slug}`} className="rounded-xl border border-line bg-card p-4 hover:border-muted">
            <span className="flex items-center gap-1 text-xs text-muted">
              <ChevronLeft className="size-3.5" /> Previous
            </span>
            <span className="mt-1 block font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/${next.slug}`} className="rounded-xl border border-line bg-card p-4 text-right hover:border-muted">
            <span className="flex items-center justify-end gap-1 text-xs text-muted">
              Next <ChevronRight className="size-3.5" />
            </span>
            <span className="mt-1 block font-medium">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
