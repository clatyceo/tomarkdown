"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_CHANGE_EVENT } from "@/lib/consent";

export function NaverAnalytics() {
  const naverId = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;
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

  if (!naverId || !hasConsent) return null;

  return (
    <Script
      src="https://wcs.nlines.naver.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const w = window as Record<string, any>;
          if (w.wcs) {
            if (w.wcs.inflow) w.wcs.inflow();
            w.wcs.cntr();
          }
        }
      }}
    />
  );
}
