"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CONSENT_KEY, CONSENT_CHANGE_EVENT } from "@/lib/consent";

export function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 p-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("message")}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleDecline}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("decline")}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-md bg-gray-900 px-4 py-1.5 text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
