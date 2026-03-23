import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/config";
import { locales } from "@/i18n/config";
import { getAllBlogSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolSlugs = Object.values(tools).map((t) => t.slug);
  const blogSlugs = getAllBlogSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = `${SITE_URL}/${locale}`;
    entries.push({ url: prefix, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });

    for (const slug of toolSlugs) {
      entries.push({ url: `${prefix}/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 });
    }

    entries.push({ url: `${prefix}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 });

    for (const slug of blogSlugs) {
      entries.push({ url: `${prefix}/blog/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    }

    entries.push({ url: `${prefix}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${prefix}/security`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 });
    entries.push({ url: `${prefix}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 });
    entries.push({ url: `${prefix}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 });
  }

  return entries;
}
