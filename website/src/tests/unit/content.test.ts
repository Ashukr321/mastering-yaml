// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { IGNORED_IMAGES, contentUrl, getAllDocs, getDoc, listAssets } from "@/lib/content";
import { GET } from "@/app/content/[...path]/route";

const IMAGE = /\.(svg|png|jpe?g|webp|gif)$/i;

afterEach(() => {
  delete process.env.CONTENT_DIR;
});

describe("content loader (real notes)", () => {
  it("has unique, URL-safe slugs and a title for every doc", () => {
    const docs = getAllDocs();
    expect(docs.length).toBeGreaterThan(0);
    const slugs = docs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const d of docs) {
      expect(d.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/);
      expect(d.title.trim()).not.toBe("");
      expect(d.title).not.toBe("Concept");
    }
  });

  it("maps a README to its folder URL and returns undefined for a missing doc", () => {
    expect(getDoc("project")?.file).toBe("project/README.md");
    expect(getDoc("project/portfolio-site-config")?.file).toBe("project/01-portfolio-site-config/README.md");
    expect(getDoc("project/does-not-exist")).toBeUndefined();
  });

  it("shows every repo image on at least one page", () => {
    const docs = getAllDocs();
    const missing = listAssets()
      .filter((p) => IMAGE.test(p) && !IGNORED_IMAGES.includes(p))
      .filter((p) => {
        const url = contentUrl(p);
        return !docs.some(
          (d) =>
            d.images.includes(url) ||
            [p, path.posix.relative(d.dir, p), encodeURI(path.posix.relative(d.dir, p))].some((ref) =>
              d.body.includes(ref),
            ),
        );
      });
    expect(missing).toEqual([]);
  });

  it("gives every assets/ diagram its own Visual Guides page, in README order", () => {
    const guides = getAllDocs().filter((d) => d.category === "visual-guides");
    const assets = listAssets().filter((p) => p.startsWith("assets/") && IMAGE.test(p));
    expect(guides.map((d) => d.images[0]).sort()).toEqual(assets.map(contentUrl).sort());
    expect(guides[0].slug).toBe("visual-guides/banner");
    expect(getDoc("visual-guides/yaml-anatomy")?.description).toBe("Anatomy of a YAML document");
  });

  it("never serves files from website/, .git or .claude", async () => {
    const assets = listAssets();
    expect(assets.length).toBeGreaterThan(0);
    expect(assets.filter((p) => /^(website|\.git|\.claude)\//.test(p))).toEqual([]);
    for (const bad of [["website", "package.json"], ["..", "README.md"]]) {
      const res = await GET(new Request("http://x"), { params: Promise.resolve({ path: bad }) });
      expect(res.status).toBe(404);
    }
  });
});

describe("content loader (fixture)", () => {
  it("gives an image-only folder its own page", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "notes-"));
    fs.mkdirSync(path.join(dir, "01_Intro", "diagrams"), { recursive: true });
    fs.writeFileSync(path.join(dir, "01_Intro", "README.md"), "# Intro\n\nHello.");
    fs.writeFileSync(path.join(dir, "01_Intro", "diagrams", "flow chart.svg"), "<svg/>");
    process.env.CONTENT_DIR = dir;

    const page = getDoc("intro/diagrams");
    expect(page?.title).toBe("Diagrams");
    expect(page?.images).toEqual(["/content/01_Intro/diagrams/flow%20chart.svg"]);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
