"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface DownloadButtonProps {
  markdown: string;
  filename: string;
}

export default function DownloadButton({ markdown, filename }: DownloadButtonProps) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
      setCopied(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleDownload}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
      >
        {t("download")}
      </button>
      <button
        onClick={handleCopy}
        aria-live="polite"
        className="px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-300 transition-colors"
      >
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}
