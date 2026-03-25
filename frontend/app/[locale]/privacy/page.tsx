import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return generatePageMetadata({
    locale,
    path: "privacy",
    title: t("metaTitle"),
    description: "Learn how tomdnow handles your data. No files stored, no accounts required.",
  });
}

export default async function Privacy() {
  const t = await getTranslations("privacy");
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>{t("lastUpdated")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("dataCollectionTitle")}</h2>
        <p>{t("dataCollectionText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("fileProcessingTitle")}</h2>
        <p>{t("fileProcessingText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("analyticsTitle")}</h2>
        <p>{t("analyticsText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("contactTitle")}</h2>
        <p>{t("contactText")}</p>
      </div>
    </div>
  );
}
