"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            {t("common.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.pricing")}</Link>
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.blog")}</Link>
            <Link href="/docs/api" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.api")}</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.about")}</Link>
            <Link href="/security" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.security")}</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.privacy")}</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">{t("nav.terms")}</Link>
            <Link href="/launch" className="text-sm text-gray-600 hover:text-gray-700 hover:underline">Product Hunt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
