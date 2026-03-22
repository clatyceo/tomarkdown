import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...Object.values(tools).map((tool) => ({
      url: `${base}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
  ];
}
