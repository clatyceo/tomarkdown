import { useTranslations } from "next-intl";
import ToolCard from "@/components/tool-card";
import { toolsByCategory } from "@/lib/tools";

const categoryKeys: Record<string, string> = {
  Documents: "documents",
  Data: "data",
  Media: "media",
};

export default function Home() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const tTools = useTranslations("tools");

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          {t.rich("title", {
            highlight: (chunks) => (
              <span className="font-serif italic text-blue-600">{chunks}</span>
            ),
          })}
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </section>

      {toolsByCategory.map((cat) => (
        <section key={cat.name} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {tNav(categoryKeys[cat.name] || cat.name.toLowerCase())}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tTools(`${tool.key}.displayName`)}
                description={tTools(`${tool.key}.subtitle`)}
                href={`/${tool.slug}`}
                icon={tool.icon}
                color={tool.color}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <h3 className="text-lg font-semibold text-gray-900">
                {t(`feature${i}Title`)}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t(`feature${i}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t("jsonLdName"),
            description: t("jsonLdDescription"),
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
