export const locales = ["en", "ko", "ja", "zh", "es", "pt", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
