"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_CHANGE_EVENT } from "@/lib/consent";

export function AdSenseScript() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem(CONSENT_KEY);
      setHasConsent(consent === "accepted");
    };

    checkConsent();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) {
        checkConsent();
      }
    };

    window.addEventListener("storage", handleStorage);

    const handleConsentChange = () => checkConsent();
    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    };
  }, []);

  if (!adsenseId || !hasConsent) return null;

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
