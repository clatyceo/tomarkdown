import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/config";
import { generatePageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return generatePageMetadata({ locale, path: "pricing", title: t("title"), description: t("subtitle") });
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#48A9A6] flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
    t("feature6"),
    t("feature7"),
    t("feature8"),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900">{t("h1")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Single feature card */}
      <div className="max-w-xl mx-auto mb-16">
        <div className="bg-white rounded-2xl border-2 border-[#48A9A6] p-8 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("allFeatures")}
            </h2>
            <div className="mt-3 flex items-baseline justify-center">
              <span className="text-5xl font-bold text-gray-900">$0</span>
              <span className="ml-2 text-gray-500 text-lg">/forever</span>
            </div>
          </div>
          <ul className="space-y-4 flex-1" role="list">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-8 block w-full text-center py-3 px-6 rounded-xl bg-[#4281A4] text-white font-medium hover:bg-[#36698a] transition-colors"
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>

      {/* Why free section */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t("whyFree")}
        </h2>
        <p className="text-gray-600 leading-relaxed">{t("whyFreeDesc")}</p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing - tomdnow",
            description: "tomdnow is 100% free. Convert any file to Markdown with no limits.",
            url: `${SITE_URL}/pricing`,
          }),
        }}
      />
    </div>
  );
}
