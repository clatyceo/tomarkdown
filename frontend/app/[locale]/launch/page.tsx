import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("launch");
  return {
    title: t("title"),
    description: t("heroSub"),
    alternates: {
      canonical: `${SITE_URL}/launch`,
    },
    openGraph: {
      title: t("title"),
      description: t("heroSub"),
      url: `${SITE_URL}/launch`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("heroSub"),
      images: [`${SITE_URL}/og-image.svg`],
    },
  };
}

export default async function LaunchPage() {
  const t = await getTranslations("launch");

  const stats = [
    { value: t("stat1"), color: "text-blue-600" },
    { value: t("stat2"), color: "text-indigo-600" },
    { value: t("stat3"), color: "text-emerald-600" },
    { value: t("stat4"), color: "text-amber-600" },
  ];

  const features = [
    {
      title: t("privacyTitle"),
      desc: t("privacyDesc"),
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          />
        </svg>
      ),
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      title: t("formatsTitle"),
      desc: t("formatsDesc"),
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
      accent: "bg-blue-50 text-blue-600",
    },
    {
      title: t("apiTitle"),
      desc: t("apiDesc"),
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      ),
      accent: "bg-purple-50 text-purple-600",
    },
    {
      title: t("freeTitle"),
      desc: t("freeDesc"),
      icon: (
        <svg
          aria-hidden="true"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      ),
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center py-20 sm:py-28">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8">
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Product Hunt Launch
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
          {t("hero")}
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-gray-500 font-medium">
          {t("heroSub")}
        </p>

        {/* Stats Row */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl bg-white border border-gray-200 px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className={`text-lg sm:text-xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            {t("tryNow")}
          </Link>
          <Link
            href="/docs/api"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            {t("viewApi")}
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            {t("seePricing")}
          </Link>
        </div>
      </section>

      {/* Supported Formats Ribbon */}
      <section className="pb-16">
        <div className="rounded-2xl bg-white border border-gray-200 px-6 py-6 shadow-sm">
          <p className="text-center text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
            Supported Formats
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "PDF",
              "DOCX",
              "HWP",
              "HWPX",
              "XLSX",
              "XLS",
              "CSV",
              "PPTX",
              "EPUB",
              "HTML",
              "XML",
              "JSON",
              "RTF",
              "TXT",
              "MSG",
              "ZIP",
              "IPYNB",
              "Image",
              "Image OCR",
              "YouTube",
            ].map((fmt) => (
              <span
                key={fmt}
                className="inline-block rounded-lg bg-gray-50 border border-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.accent} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Trusted by Developers & Writers
          </h2>
          <p className="mt-2 text-gray-500">
            Join thousands of users converting files to Markdown every day
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              quote:
                "The fastest way to convert my research PDFs to Markdown for Obsidian.",
              author: "Researcher",
            },
            {
              quote:
                "HWP support is a game-changer for Korean document workflows.",
              author: "Developer, Seoul",
            },
            {
              quote:
                "The API lets me automate our entire documentation pipeline.",
              author: "DevOps Engineer",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.author}
              className="rounded-2xl bg-white border border-gray-200 p-6"
            >
              <p className="text-sm text-gray-600 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-medium text-gray-900">
                &mdash; {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20">
        <div className="rounded-2xl bg-gray-900 text-center px-8 py-16">
          <h2 className="text-3xl font-bold text-white">
            {t("hero")}
          </h2>
          <p className="mt-3 text-lg text-gray-400">{t("heroSub")}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-base hover:bg-gray-100 transition-colors"
            >
              {t("tryNow")}
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-gray-600 text-gray-300 font-semibold text-base hover:bg-gray-800 transition-colors"
            >
              {t("viewApi")}
            </Link>
          </div>
          <p className="mt-10 text-sm text-gray-500">
            {t("madeIn")}
          </p>
        </div>
      </section>

      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            description:
              "Convert any file to Markdown — PDF, Word, Excel, PowerPoint, HWP and more. Free, fast, and private.",
            url: SITE_URL,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "120",
            },
          }),
        }}
      />
    </div>
  );
}
