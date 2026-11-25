import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { type Doc, resolveImage, resolveLink } from "@/lib/content";

// Notes are this repo's own trusted content, so raw HTML is rendered.
export default function Markdown({ doc }: { doc: Doc }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ href, children }) => {
          const url = resolveLink(doc, href ?? "");
          if (!url) return <span>{children}</span>;
          if (/^https?:/.test(url))
            return (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          return <Link href={url}>{children}</Link>;
        },
        // eslint-disable-next-line @next/next/no-img-element
        img: ({ src, alt, width }) => <img src={resolveImage(doc, String(src ?? ""))} alt={alt ?? ""} width={width} loading="lazy" />,
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {doc.body}
    </ReactMarkdown>
  );
}
