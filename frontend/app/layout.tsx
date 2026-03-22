import type { Metadata } from "next";
import { Sora, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "AllToMD — Convert Any File to Markdown",
  description:
    "Free online tool to convert PDF, Word, YouTube videos and more to clean Markdown files.",
  openGraph: {
    title: "AllToMD — Convert Any File to Markdown",
    description:
      "Free online tool to convert PDF, Word, YouTube videos and more to clean Markdown files.",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
