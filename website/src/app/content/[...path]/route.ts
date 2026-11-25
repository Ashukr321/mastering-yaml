import fs from "node:fs";
import path from "node:path";
import { contentRoot, listAssets } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

const TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
};

export function generateStaticParams() {
  return listAssets().map((p) => ({ path: p.split("/") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = (await params).path.map((s) => decodeURIComponent(s)).join("/");
  // only files from the allow-list; blocks ../ and anything under website/, .git, …
  if (!listAssets().includes(rel)) return new Response("Not found", { status: 404 });
  const body = fs.readFileSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ contentRoot(), rel));
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": TYPES[path.extname(rel).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
