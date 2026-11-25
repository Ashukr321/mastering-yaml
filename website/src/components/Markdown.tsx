import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { isValidElement } from "react";
import { type Doc, resolveImage, resolveLink } from "@/lib/content";
import CodeBlock from "./CodeBlock";

const langOf = (children: React.ReactNode) =>
  isValidElement<{ className?: string }>(children)
    ? /language-([\w-]+)/.exec(children.props.className ?? "")?.[1]
    : undefined;

const codeComponents = (label?: string): Components => ({
  pre: ({ children }) => <CodeBlock label={label ?? langOf(children)}>{children}</CodeBlock>,
});

// Notes are this repo's own trusted content, so raw HTML is rendered.
export default function Markdown({ doc }: { doc: Doc }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        ...codeComponents(),
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

/** A practice/solution YAML file, highlighted, with its file name as the label. */
export function CodeFileView({ name, content }: { name: string; content: string }) {
  // a 4-backtick fence so a ``` inside the file can't end the block
  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={codeComponents(name)}>
      {"````yaml\n" + content + "\n````"}
    </ReactMarkdown>
  );
}
