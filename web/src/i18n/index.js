import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";
import en from "./locales/en/translation.json";

const interfaceLanguageKey = "falowen:interface-language";
const legacyLanguageKey = "falowen:language";

const getDefaultInterfaceLanguage = () => {
  if (typeof navigator === "undefined") return null;
  const locale = (navigator.language || "").toLowerCase();
  if (locale.includes("-gh") || locale.includes("-ng")) {
    return "en";
  }
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone === "Africa/Accra" || timeZone === "Africa/Lagos") {
      return "en";
    }
  } catch {
    // ignore time zone errors
  }
  return null;
};

const storedLanguage =
  typeof window !== "undefined"
    ? window.localStorage.getItem(interfaceLanguageKey) || window.localStorage.getItem(legacyLanguageKey)
    : null;

const fallbackLanguage = "de";

const resolvedLanguage = storedLanguage || getDefaultInterfaceLanguage() || fallbackLanguage;

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: resolvedLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export const persistInterfaceLanguage = (language) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(interfaceLanguageKey, language);
  } catch {
    // ignore storage errors
  }
};

export default i18n;
