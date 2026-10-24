import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";
import en from "./locales/en/translation.json";

const interfaceLanguageKey = "falowen:interface-language";
const legacyLanguageKey = "falowen:language";

const SUPPORTED_INTERFACE_LANGUAGES = new Set(["en", "de", "fr"]);

const normalizeStoredLanguage = (value) => {
  const normalized = String(value || "").trim().toLowerCase().slice(0, 2);
  return SUPPORTED_INTERFACE_LANGUAGES.has(normalized) ? normalized : "";
};

const getStoredInterfaceLanguage = () => {
  if (typeof window === "undefined") return "";
  try {
    return normalizeStoredLanguage(window.localStorage.getItem(interfaceLanguageKey));
  } catch {
    return "";
  }
};

const getLegacyInterfaceLanguage = () => {
  if (typeof window === "undefined") return "";
  try {
    const legacy = normalizeStoredLanguage(window.localStorage.getItem(legacyLanguageKey));
    // Older Falowen builds could store German as the default just because the course was German.
    // Do not keep that old value as the public interface default; students should start in English.
    return legacy === "de" ? "" : legacy;
  } catch {
    return "";
  }
};

const getDefaultInterfaceLanguage = () => "en";

const fallbackLanguage = "en";

const resolvedLanguage = getStoredInterfaceLanguage() || getLegacyInterfaceLanguage() || getDefaultInterfaceLanguage() || fallbackLanguage;

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
    const normalized = normalizeStoredLanguage(language) || "en";
    window.localStorage.setItem(interfaceLanguageKey, normalized);
  } catch {
    // ignore storage errors
  }
};

export default i18n;
