export function useTranslations() {
  return (key: string) => key;
}

export function useLocale() {
  return "en";
}

export function useMessages() {
  return {};
}

export function useFormatter() {
  return {};
}

export function useNow() {
  return new Date();
}

export function useTimeZone() {
  return "UTC";
}
