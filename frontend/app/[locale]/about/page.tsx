import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <BreadcrumbSchema items={[{ name: "About" }]} locale={locale} />

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("heroSubtitle")}</p>
      </div>

      <div className="space-y-12">
        {/* Our Story */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t("storyTitle")}</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("storyP1")}</p>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("storyP2")}</p>
        </section>

        {/* How It Works */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t("techTitle")}</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("techP1")}</p>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("techP2")}</p>
        </section>

        {/* Privacy by Design */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t("privacyTitle")}</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("privacyP1")}</p>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("privacyP2")}</p>
        </section>

        {/* Our Mission */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t("missionTitle")}</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("missionP1")}</p>
          <p className="mt-3 text-gray-600 leading-relaxed">{t("missionP2")}</p>
        </section>

        {/* About the Founder */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t("founderTitle")}</h2>
          <p className="mt-2 text-lg font-medium text-gray-900">{t("founderName")}</p>
          <p className="mt-2 text-gray-600 leading-relaxed">{t("founderBio")}</p>
        </section>
      </div>
    </div>
  );
}
