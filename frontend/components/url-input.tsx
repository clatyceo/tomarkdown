"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface UrlInputProps {
  placeholder: string;
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ placeholder, onSubmit, isLoading }: UrlInputProps) {
  const t = useTranslations("common");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <label htmlFor="url-input" className="sr-only">{t("urlInputLabel")}</label>
      <input
        id="url-input"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        aria-label={t("urlInputLabel")}
        required
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        aria-busy={isLoading}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? t("converting") : t("convert")}
      </button>
    </form>
  );
}
