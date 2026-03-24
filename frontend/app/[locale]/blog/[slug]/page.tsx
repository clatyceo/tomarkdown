import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { getLocalizedBlogPost, getAllBlogSlugs } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { AdUnit } from "@/components/ad-unit";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { locales } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const getCachedPost = cache((locale: string, slug: string) => getLocalizedBlogPost(locale, slug));

export function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getCachedPost(locale, slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = getCachedPost(locale, slug);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <BreadcrumbSchema items={[{ name: "Blog", href: "/blog" }, { name: post.title }]} locale={locale} />
      <Link
        href="/blog"
        className="text-sm text-[#4281A4] hover:underline"
      >
        &larr; {t("backToBlog")}
      </Link>

      <article className="mt-6">
        <header>
          <time className="text-sm text-gray-400">{post.date}</time>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            {post.title}
          </h1>
          <p className="mt-3 text-lg text-gray-500">{post.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-[#f5efe6] text-[#9a7d52]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10 prose prose-gray max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <AdUnit slot="blog-bottom" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Person",
              name: post.author,
              url: `${SITE_URL}/en/about`,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/icon.svg`,
              },
            },
            image: `${SITE_URL}/og-image.png`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/${locale}/blog/${slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
