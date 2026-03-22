import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://alltomd.com";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pdf-to-markdown`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/docx-to-markdown`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/youtube-to-markdown`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
  ];
}
