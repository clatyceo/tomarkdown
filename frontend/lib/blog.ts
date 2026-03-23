import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { defaultLocale } from "@/i18n/config";
import { SITE_NAME } from "@/lib/config";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(locale: string): BlogPost[] {
  const dir = path.join(CONTENT_DIR, locale);
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author || SITE_NAME,
        tags: data.tags || [],
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(
  locale: string,
  slug: string
): BlogPost | null {
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  const filePath = path.join(CONTENT_DIR, locale, `${safeSlug}.mdx`);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  return {
    slug: safeSlug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author || SITE_NAME,
    tags: data.tags || [],
    content,
  };
}

export function getLocalizedBlogPost(locale: string, slug: string): BlogPost | null {
  const post = getBlogPost(locale, slug);
  if (post) return post;
  if (locale !== defaultLocale) return getBlogPost(defaultLocale, slug);
  return null;
}

export function getLocalizedBlogPosts(locale: string): BlogPost[] {
  const posts = getBlogPosts(locale);
  if (posts.length > 0) return posts;
  if (locale !== defaultLocale) return getBlogPosts(defaultLocale);
  return [];
}

export function getAllBlogSlugs(): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const allSlugs = new Set<string>();
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(CONTENT_DIR, entry.name);
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".mdx")) allSlugs.add(f.replace(/\.mdx$/, ""));
    }
  }
  return Array.from(allSlugs);
}
