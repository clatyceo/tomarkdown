"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;

    // Only push ad if AdSense script has loaded
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
      isLoaded.current = true;
    } catch {
      // AdSense not available (ad blocker, dev environment, etc.)
    }
  }, []);

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!adsenseId) return null;

  return (
    <div
      className={`ad-container mt-8 pt-6 border-t border-gray-200 ${className}`}
      style={{ minHeight: "90px" }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
