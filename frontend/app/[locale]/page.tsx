import { useTranslations } from "next-intl";
import ToolCard from "@/components/tool-card";
import { toolsByCategory, tools } from "@/lib/tools";

const categoryKeys: Record<string, string> = {
  Documents: "documents",
  Data: "data",
  Media: "media",
};

export default function Home() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const tTools = useTranslations("tools");
  const tTrust = useTranslations("trust");

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

      {/* Trust Badges */}
      <section className="pb-20">
        <div className="rounded-2xl bg-gray-50 px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* No File Storage */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">{tTrust("noStorage")}</h3>
              <p className="text-xs text-gray-500">{tTrust("noStorageDesc")}</p>
            </div>

            {/* TLS Encrypted */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">{tTrust("encrypted")}</h3>
              <p className="text-xs text-gray-500">{tTrust("encryptedDesc")}</p>
            </div>

            {/* Instant Deletion */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">{tTrust("instantDelete")}</h3>
              <p className="text-xs text-gray-500">{tTrust("instantDeleteDesc")}</p>
            </div>

            {/* No Sign-up */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="18" y1="8" x2="23" y2="13"/>
                <line x1="23" y1="8" x2="18" y2="13"/>
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">{tTrust("noSignup")}</h3>
              <p className="text-xs text-gray-500">{tTrust("noSignupDesc")}</p>
            </div>
          </div>
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
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: Object.values(tools).map((tool) => tool.displayName),
          }),
        }}
      />
    </div>
  );
}
