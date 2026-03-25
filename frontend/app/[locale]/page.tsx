import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";
import ToolCard from "@/components/tool-card";
import { toolsByCategory, tools } from "@/lib/tools";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return generatePageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
  });
}

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
              <span className="font-serif italic text-[#4281A4]">{chunks}</span>
            ),
          })}
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </section>

      {/* Definition — AI-citable content */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center">{t("definitionTitle")}</h2>
        <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          {t("definition")}
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: t("statsFormats"), label: t("statsFormatsLabel") },
            { value: t("statsLanguages"), label: t("statsLanguagesLabel") },
            { value: t("statsPrice"), label: t("statsPriceLabel") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[#4281A4]">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
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

      {/* Comparison Table */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">{t("comparisonTitle")}</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f0edea]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">{t("comparisonFeature")}</th>
                <th className="text-left px-4 py-3 font-semibold text-[#4281A4]">{t("comparisonTomdnow")}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Pandoc</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">CloudConvert</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Marker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonFormats")}</td>
                <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonFormatsTomdnow")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonFormatsPandoc")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonFormatsCloudConvert")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonFormatsMarker")}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonPrivacy")}</td>
                <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonPrivacyTomdnow")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonPrivacyPandoc")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonPrivacyCloudConvert")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonPrivacyMarker")}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonCost")}</td>
                <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonCostTomdnow")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonCostPandoc")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonCostCloudConvert")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonCostMarker")}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{t("comparisonSignup")}</td>
                <td className="px-4 py-3 text-[#48A9A6]">{t("comparisonSignupTomdnow")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonSignupPandoc")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonSignupCloudConvert")}</td>
                <td className="px-4 py-3 text-gray-500">{t("comparisonSignupMarker")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

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
        <div className="rounded-2xl bg-[#f0edea] px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* No File Storage */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#48A9A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">{tTrust("noStorage")}</h3>
              <p className="text-xs text-gray-500">{tTrust("noStorageDesc")}</p>
            </div>

            {/* TLS Encrypted */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4281A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">{tTrust("encrypted")}</h3>
              <p className="text-xs text-gray-500">{tTrust("encryptedDesc")}</p>
            </div>

            {/* Instant Deletion */}
            <div className="flex flex-col items-center gap-2">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#48A9A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4281A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
