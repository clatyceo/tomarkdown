"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_CHANGE_EVENT } from "@/lib/consent";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
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

  if (!gaId || !GA_ID_PATTERN.test(gaId) || !hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
