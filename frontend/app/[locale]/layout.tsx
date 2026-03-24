import type { Metadata, Viewport } from "next";
import { Sora, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/config";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { NaverAnalytics } from "@/components/naver-analytics";
import { AdSenseScript } from "@/components/adsense-script";
import { CookieConsent } from "@/components/cookie-consent";
import { ServiceWorkerRegister } from "@/components/sw-register";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4281A4",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(SITE_URL),
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: SITE_NAME,
    },
    icons: {
      apple: "/icon.svg",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: SITE_URL,
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
      description: t("description"),
      images: [`${SITE_URL}/og-image.svg`],
    },
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "cAFel1q5yzf4Knl40SDWzJpyi2HdqSHFwPSGT41vHSk",
      other: {
        "naver-site-verification":
          process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "af8e8f101e535050dc50619a9b6216dec0a8d5e6",
        "google-adsense-account": "ca-pub-9136783850079430",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang={locale}>
      <head>
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${sora.variable} ${instrumentSerif.variable} font-sans antialiased bg-[#E4DFDA] text-gray-900`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "Free online tool to convert any file to Markdown",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-15">{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
        <Analytics />
        <NaverAnalytics />
        <AdSenseScript />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
