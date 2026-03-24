import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/config";
import { CheckoutButton } from "@/components/checkout-button";
import { Link } from "@/i18n/navigation";

const PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro_monthly";
const TEAM_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || "price_team_monthly";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing");
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `${SITE_URL}/pricing`,
    },
  };
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-500 flex-shrink-0"
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

  const freeTierFeatures = [
    t("feature_singleFile"),
    t("feature_dailyLimit20"),
    t("feature_basicFormats"),
    t("feature_ads"),
  ];

  const proTierFeatures = [
    t("feature_batch50"),
    t("feature_api500"),
    t("feature_noAds"),
    t("feature_ocr"),
    t("feature_allFormats"),
  ];

  const teamTierFeatures = [
    t("feature_unlimitedApi"),
    t("feature_aiFeatures"),
    t("feature_prioritySupport"),
    t("feature_sla"),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900">{t("h1")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("free")}
          </h2>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">$0</span>
          </div>
          <ul className="mt-8 space-y-4 flex-1" role="list">
            {freeTierFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-8 block w-full text-center py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            {t("getStarted")}
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="bg-white rounded-2xl border-2 border-gray-900 p-8 flex flex-col relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-1 rounded-full">
            {t("mostPopular")}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("pro")}
          </h2>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">$9</span>
            <span className="ml-1 text-gray-500">{t("month")}</span>
          </div>
          <ul className="mt-8 space-y-4 flex-1" role="list">
            {proTierFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <CheckoutButton
            priceId={PRO_PRICE_ID}
            label={t("subscribePro")}
            className="mt-8 w-full py-3 px-6 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Team Tier */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("team")}
          </h2>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">$19</span>
            <span className="ml-1 text-gray-500">
              {t("month")}{t("perUser")}
            </span>
          </div>
          <ul className="mt-8 space-y-4 flex-1" role="list">
            {teamTierFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <CheckoutButton
            priceId={TEAM_PRICE_ID}
            label={t("contactUs")}
            className="mt-8 w-full py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing - tomdnow",
            description: "Simple, transparent pricing for tomdnow file conversion service",
            url: `${SITE_URL}/pricing`,
          }),
        }}
      />
    </div>
  );
}
