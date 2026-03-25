import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { getLocalizedBlogPosts } from "@/lib/blog";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return generatePageMetadata({ locale, path: "blog", title: t("title"), description: t("subtitle") });
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts = getLocalizedBlogPosts(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <BreadcrumbSchema items={[{ name: "Blog" }]} locale={locale} />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        {t("h1")}
      </h1>
      <p className="mt-3 text-lg text-gray-500">{t("subtitle")}</p>

      {posts.length === 0 ? (
        <p className="mt-12 text-gray-400 text-center">{t("noPostsYet")}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <time className="text-xs text-gray-400">{post.date}</time>
              <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-[#4281A4] transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {post.description}
              </p>
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
              <span className="mt-4 inline-block text-sm font-medium text-[#4281A4] group-hover:underline">
                {t("readMore")} &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [1, 2, 3].map((i) => ({
              "@type": "Question",
              name: t(`faq${i}Q`),
              acceptedAnswer: {
                "@type": "Answer",
                text: t(`faq${i}A`),
              },
            })),
          }),
        }}
      />
    </div>
  );
}
