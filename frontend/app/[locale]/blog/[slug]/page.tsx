import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { getBlogPost } from "@/lib/blog";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  let post = getBlogPost(locale, slug);
  if (!post && locale !== "en") {
    post = getBlogPost("en", slug);
  }
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} — tomdnow`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  let post = getBlogPost(locale, slug);
  if (!post && locale !== "en") {
    post = getBlogPost("en", slug);
  }
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/blog"
        className="text-sm text-blue-600 hover:underline"
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
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            author: { "@type": "Person", name: post.author },
            description: post.description,
          }),
        }}
      />
    </div>
  );
}
