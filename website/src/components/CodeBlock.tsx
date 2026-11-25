"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Editor-style code panel: language / file name on top, click-to-copy button. */
export default function CodeBlock({ label, children }: { label?: string; children: React.ReactNode }) {
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pre.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="code-block not-prose">
      <div className="code-head">
        <span>{label ?? "code"}</span>
        <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy code"}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={pre}>{children}</pre>
    </div>
  );
}
