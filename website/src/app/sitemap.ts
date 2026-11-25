import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...getAllDocs().map((d) => ({ url: `${baseUrl}/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
