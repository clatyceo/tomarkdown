import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return generatePageMetadata({
    locale,
    path: "terms",
    title: t("metaTitle"),
    description: "Terms of service for using the tomdnow file conversion tool.",
  });
}

export default async function Terms() {
  const t = await getTranslations("terms");
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>{t("lastUpdated")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("serviceTitle")}</h2>
        <p>{t("serviceText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("usageTitle")}</h2>
        <p>{t("usageText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("limitationsTitle")}</h2>
        <p>{t("limitationsText")}</p>
      </div>
    </div>
  );
}
