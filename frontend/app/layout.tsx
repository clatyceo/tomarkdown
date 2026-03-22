import type { Metadata } from "next";
import { Sora, Instrument_Serif } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
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

export const metadata: Metadata = {
  title: "AllToMD — Convert Any File to Markdown",
  description:
    "Free online tool to convert PDF, Word, YouTube videos and more to clean Markdown files.",
  metadataBase: new URL("https://tomarkdown.com"),
  openGraph: {
    title: "AllToMD — Convert Any File to Markdown",
    description:
      "Free online tool to convert PDF, Word, YouTube videos and more to clean Markdown files.",
    type: "website",
    url: "https://tomarkdown.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${instrumentSerif.variable} font-sans antialiased bg-[#f5f5fa] text-gray-900`}
      >
        <Header />
        <main className="pt-15">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
