import fs from "node:fs";
import path from "node:path";

export type CodeFile = { path: string; name: string; content: string; solution: boolean };

export type Doc = {
  slug: string;
  title: string;
  description: string;
  body: string;
  category: string;
  categoryTitle: string;
  group?: string;
  /** repo-relative folder of the source file, used to resolve relative links */
  dir: string;
  /** repo-relative source path (`dir/` for an image-only folder page) */
  file: string;
  /** /content URLs shown as figures (images not already linked in the body) */
  images: string[];
  /** /content URLs of HTML visualizations */
  visualizations: string[];
  codeFiles: CodeFile[];
};

export type Category = { slug: string; title: string; docs: Doc[] };

import { SITE_DESCRIPTION } from "./site";

export { SITE_NAME, SITE_DESCRIPTION } from "./site";

// Unrelated images that should never be placed on a page (repo-relative paths).
export const IGNORED_IMAGES: string[] = [];

const SKIP_DIRS = new Set(["website", "node_modules", ".git", ".claude"]);
export const IMAGE_EXT = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);
export const ASSET_EXT = new Set([...IMAGE_EXT, ".html"]);
const CODE_EXT = new Set([".yml", ".yaml"]);
const ACRONYMS: Record<string, string> = {
  api: "API", apis: "APIs", xss: "XSS", csrf: "CSRF", cors: "CORS", yaml: "YAML", yml: "YML",
  ci: "CI", cd: "CD", k8s: "K8s", ghcr: "GHCR", mern: "MERN", i18n: "i18n", rest: "REST",
  json: "JSON", html: "HTML", css: "CSS", jwt: "JWT", url: "URL", http: "HTTP", sql: "SQL",
  openapi: "OpenAPI", gitlab: "GitLab", github: "GitHub", env: "Env", ui: "UI", dom: "DOM",
};

export const contentRoot = () =>
  path.resolve(/*turbopackIgnore: true*/ process.env.CONTENT_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), ".."));

const stripNum = (s: string) => s.replace(/^\d+[-_.\s]+/, "");
export const slugify = (s: string) =>
  stripNum(s).toLowerCase().replace(/\.md$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const humanize = (s: string) =>
  stripNum(s)
    .replace(/\.md$/i, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => ACRONYMS[w.toLowerCase()] ?? w[0].toUpperCase() + w.slice(1))
    .join(" ");
const words = (name: string) =>
  name.toLowerCase().replace(/\.[a-z]+$/, "").split(/[^a-z0-9]+/).filter(Boolean);
export const contentUrl = (repoPath: string) => "/content/" + repoPath.split("/").map(encodeURIComponent).join("/");
const isReadme = (f: string) => /^readme\.md$/i.test(path.posix.basename(f));
const isExternal = (href: string) => /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);

type Tree = { files: string[]; dirs: string[] };

function walk(root: string) {
  const all: string[] = [];
  const tree = new Map<string, Tree>();
  const visit = (rel: string) => {
    const node: Tree = { files: [], dirs: [] };
    tree.set(rel, node);
    const entries = fs.readdirSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ root, rel), { withFileTypes: true });
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }))) {
      const p = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        // dot-folders are skipped at the repo root only: project folders keep lesson files in .github/
        if (SKIP_DIRS.has(e.name) || (!rel && e.name.startsWith("."))) continue;
        node.dirs.push(p);
        visit(p);
      } else if (e.isFile()) {
        node.files.push(p);
        all.push(p);
      }
    }
  };
  visit("");
  return { all, tree };
}

/** Every repo asset the /content route may serve. */
export function listAssets(): string[] {
  return walk(contentRoot()).all.filter((f) => ASSET_EXT.has(path.posix.extname(f).toLowerCase()));
}

function parseTitle(raw: string, fallback: string) {
  const m = raw.match(/^\s*#\s+(.+?)\s*#*\s*$/m);
  const firstContent = raw.split("\n").find((l) => l.trim());
  if (m && firstContent?.trim().startsWith("#")) {
    const h1 = m[1].replace(/^[^\p{L}\p{N}]+/u, "").trim();
    if (h1 && h1.length <= 60) return { title: h1, body: raw.replace(m[0], "").trimStart() };
  }
  return { title: fallback, body: raw };
}

const stripCode = (md: string) => md.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, (s) => s.replace(/[[\]()<>]/g, " "));

function describe(body: string) {
  for (const block of stripCode(body).split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || /^(#|!\[|<|\||[-*+]\s|\d+\.\s|>)/.test(t)) continue;
    const text = t
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < 60) continue;
    return text.length <= 160 ? text : text.slice(0, 157).replace(/\s+\S*$/, "") + "…";
  }
  return "";
}

/** Relative image paths referenced by a markdown body (markdown and raw <img>). */
function linkedImages(body: string, dir: string, exists: (p: string) => boolean) {
  const out: string[] = [];
  const src = stripCode(body);
  const refs = [
    ...[...src.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^)]*["'])?\s*\)/g)].map((m) => m[1]),
    ...[...src.matchAll(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]),
  ];
  for (const r of refs) {
    const p = resolveRepoPath(dir, r);
    if (p && exists(p)) out.push(p);
  }
  return out;
}

/** Resolve a relative href from a doc folder to a repo-relative path, or null for external/out-of-repo. */
export function resolveRepoPath(dir: string, href: string): string | null {
  if (!href || isExternal(href) || href.startsWith("/")) return null;
  let clean = href.split("#")[0].split("?")[0];
  try {
    clean = decodeURIComponent(clean);
  } catch {}
  const p = path.posix.normalize(path.posix.join(dir || ".", clean)).replace(/\/$/, "");
  return p.startsWith("..") ? null : p === "." ? "" : p;
}

type Built = { categories: Category[]; docs: Doc[]; bySlug: Map<string, Doc>; byFile: Map<string, Doc>; files: Set<string>; root: string };

function build(): Built {
  const root = contentRoot();
  const { all, tree } = walk(root);
  const fileSet = new Set(all);
  const exists = (p: string) => fileSet.has(p);
  const read = (p: string) => fs.readFileSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ root, p), "utf8");
  const hasMd = (d: string): boolean => {
    const n = tree.get(d)!;
    return n.files.some((f) => f.toLowerCase().endsWith(".md")) || n.dirs.some(hasMd);
  };
  const mdIn = (d: string) =>
    tree.get(d)!.files.filter((f) => f.toLowerCase().endsWith(".md")).sort((a, b) => Number(isReadme(b)) - Number(isReadme(a)));
  const countMd = (d: string): number => mdIn(d).length + tree.get(d)!.dirs.reduce((n, s) => n + countMd(s), 0);

  // YAML files belonging to a README: everything under its folder down to the next folder with its own notes.
  const codeFor = (d: string): CodeFile[] => {
    const out: CodeFile[] = [];
    const go = (x: string) => {
      for (const f of tree.get(x)!.files) {
        if (!CODE_EXT.has(path.posix.extname(f).toLowerCase())) continue;
        const content = read(f).trimEnd();
        if (!content) continue;
        const rel = d ? f.slice(d.length + 1) : f;
        out.push({ path: f, name: rel, content, solution: /(^|\/)solutions?\//i.test(rel) });
      }
      for (const s of tree.get(x)!.dirs) if (!mdIn(s).length) go(s);
    };
    go(d);
    return out;
  };

  const categories: Category[] = [];
  const pendingFolders: { dir: string; cat: Category; group?: string }[] = [];

  const makeDoc = (file: string, cat: Category, group?: string): Doc => {
    const dir = path.posix.dirname(file) === "." ? "" : path.posix.dirname(file);
    const base = path.posix.basename(file);
    const folderNamed = isReadme(file) || /^concept\.md$/i.test(base);
    const slugParts = dir.split("/").filter(Boolean).map(slugify);
    if (!folderNamed) slugParts.push(slugify(base));
    const raw = read(file).replace(/\r\n/g, "\n");
    const fallback = humanize(folderNamed ? path.posix.basename(dir) || cat.slug : base);
    const { title, body } = parseTitle(raw, fallback);
    return {
      slug: slugParts.join("/"),
      title: title === "Concept" ? fallback : title,
      description: describe(body),
      body,
      category: cat.slug,
      categoryTitle: cat.title,
      group,
      dir,
      file,
      images: [],
      visualizations: [],
      codeFiles: isReadme(file) ? codeFor(dir) : [],
    };
  };

  const addDir = (d: string, cat: Category, group?: string) => {
    for (const f of mdIn(d)) cat.docs.push(makeDoc(f, cat, group));
    for (const s of tree.get(d)!.dirs) {
      if (!hasMd(s)) {
        pendingFolders.push({ dir: s, cat, group });
        continue;
      }
      // a sub-folder with a single note is a page, not a group heading
      addDir(s, cat, group ?? (countMd(s) > 1 ? humanize(path.posix.basename(s)) : undefined));
    }
  };

  for (const top of tree.get("")!.dirs) {
    const cat: Category = { slug: slugify(path.posix.basename(top)), title: humanize(path.posix.basename(top)), docs: [] };
    if (hasMd(top)) addDir(top, cat);
    else pendingFolders.push({ dir: top, cat });
    categories.push(cat);
  }

  const rootReadme = tree.get("")!.files.find(isReadme);
  const firstCat = categories.find((c) => c.docs.length);
  if (rootReadme && firstCat) {
    const overview = makeDoc(rootReadme, firstCat);
    overview.slug = `${firstCat.slug}/overview`;
    overview.title = "Overview";
    overview.description ||= SITE_DESCRIPTION;
    firstCat.docs.unshift(overview);
  }

  const images = all.filter((f) => IMAGE_EXT.has(path.posix.extname(f).toLowerCase()) && !IGNORED_IMAGES.includes(f));

  // Every diagram in assets/ also gets its own page (in README order), so each is searchable on its own.
  const guides = images.filter((f) => f.startsWith("assets/"));
  if (guides.length) {
    const readme = rootReadme ? read(rootReadme) : "";
    const order = linkedImages(readme, "", exists);
    const rank = (f: string) => (order.includes(f) ? order.indexOf(f) : order.length);
    const esc = (f: string) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const altFor = (f: string) => {
      const tag = readme.match(new RegExp(`<img\\b[^>]*src=["']${esc(f)}["'][^>]*>`, "i"));
      return tag?.[0].match(/\balt=["']([^"']+)["']/i)?.[1] ?? readme.match(new RegExp(`!\\[([^\\]]+)\\]\\(${esc(f)}\\)`))?.[1];
    };
    const cat: Category = { slug: "visual-guides", title: "Visual Guides", docs: [] };
    for (const img of [...guides].sort((a, b) => rank(a) - rank(b))) {
      const name = path.posix.basename(img, path.posix.extname(img));
      cat.docs.push({
        slug: `${cat.slug}/${slugify(name)}`,
        title: humanize(name),
        description: altFor(img) ?? `${humanize(name)} diagram.`,
        body: "",
        category: cat.slug,
        categoryTitle: cat.title,
        dir: "assets",
        // trailing "/" keeps these out of link resolution and image placement, like image-only folder pages
        file: "assets/",
        images: [contentUrl(img)],
        visualizations: [],
        codeFiles: [],
      });
    }
    categories.push(cat);
  }

  const allDocs = () => categories.flatMap((c) => c.docs);

  // 1. images linked from markdown
  const linked = new Set<string>();
  for (const doc of allDocs()) for (const p of linkedImages(doc.body, doc.dir, exists)) linked.add(p);

  // 2. image file-name words all appear in a doc's file name
  const matched = new Set<string>();
  for (const img of images) {
    const iw = words(path.posix.basename(img));
    if (!iw.length) continue;
    for (const doc of allDocs()) {
      if (isReadme(doc.file)) continue;
      const dw = new Set(words(path.posix.basename(doc.file)));
      if (iw.every((w) => dw.has(w))) {
        matched.add(img);
        if (!linkedImages(doc.body, doc.dir, exists).includes(img)) doc.images.push(contentUrl(img));
      }
    }
  }

  // 3. leftovers: nearest doc in their folder, an own page for a note-less folder, else the nearest parent
  const docsInDir = (d: string) => allDocs().filter((x) => x.dir === d && !x.file.endsWith("/"));
  const folderPages = new Map<string, Doc>();
  for (const img of images) {
    if (linked.has(img) || matched.has(img)) continue;
    let d = path.posix.dirname(img) === "." ? "" : path.posix.dirname(img);
    let target: Doc | undefined;
    const pending = pendingFolders.find((p) => d === p.dir || d.startsWith(p.dir + "/"));
    if (pending && !docsInDir(d).length) {
      target = folderPages.get(pending.dir);
      if (!target) {
        const base = path.posix.basename(pending.dir);
        const slug = pending.dir.split("/").map(slugify).join("/");
        target = {
          slug,
          title: humanize(base),
          description: `Diagrams for ${humanize(base)}.`,
          body: "",
          category: pending.cat.slug,
          categoryTitle: pending.cat.title,
          group: pending.group,
          dir: pending.dir,
          file: pending.dir + "/",
          images: [],
          visualizations: [],
          codeFiles: [],
        };
        folderPages.set(pending.dir, target);
        pending.cat.docs.push(target);
      }
    } else {
      for (;;) {
        const here = docsInDir(d);
        target = here.find((x) => isReadme(x.file)) ?? here[0];
        if (target || !d) break;
        d = d.includes("/") ? path.posix.dirname(d) : "";
      }
      target ??= allDocs()[0];
    }
    if (target) target.images.push(contentUrl(img));
  }

  // HTML visualizations next to a README
  for (const f of all.filter((x) => x.toLowerCase().endsWith(".html"))) {
    const d = path.posix.dirname(f) === "." ? "" : path.posix.dirname(f);
    const doc = docsInDir(d).find((x) => isReadme(x.file));
    if (doc) doc.visualizations.push(contentUrl(f));
  }

  const nonEmpty = categories.filter((c) => c.docs.length);
  const docsOut = nonEmpty.flatMap((c) => c.docs);
  return {
    categories: nonEmpty,
    docs: docsOut,
    bySlug: new Map(docsOut.map((x) => [x.slug, x])),
    byFile: new Map(docsOut.filter((x) => !x.file.endsWith("/")).map((x) => [x.file, x])),
    files: fileSet,
    root,
  };
}

let cache: Built | undefined;
const get = () => {
  if (!cache || cache.root !== contentRoot()) cache = build();
  return cache;
};

export const getCategories = () => get().categories;
export const getAllDocs = () => get().docs;
export const getDoc = (slug: string) => get().bySlug.get(slug);

export function getNeighbours(slug: string) {
  const docs = get().docs;
  const i = docs.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? docs[i - 1] : undefined, next: i >= 0 && i < docs.length - 1 ? docs[i + 1] : undefined };
}

/** Map a relative link in a note to a site URL; null means "render as plain text". */
export function resolveLink(doc: Doc, href: string): string | null {
  if (!href) return null;
  if (isExternal(href) || href.startsWith("/")) return href;
  const p = resolveRepoPath(doc.dir, href);
  if (p === null) return null;
  const hash = href.includes("#") ? "#" + href.split("#")[1] : "";
  const { byFile, files } = get();
  const target =
    byFile.get(p) ?? byFile.get(`${p}/README.md`) ?? byFile.get(p ? `${p}/readme.md` : "README.md");
  if (target) return `/${target.slug}${hash}`;
  if (ASSET_EXT.has(path.posix.extname(p).toLowerCase()) && files.has(p)) return contentUrl(p);
  return null;
}

/** Map an image src in a note to a /content URL (external srcs pass through). */
export function resolveImage(doc: Doc, src: string): string {
  if (!src || isExternal(src) || src.startsWith("/")) return src;
  const p = resolveRepoPath(doc.dir, src);
  return p ? contentUrl(p) : src;
}
