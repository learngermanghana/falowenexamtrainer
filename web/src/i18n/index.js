import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";
import en from "./locales/en/translation.json";
import sw from "./locales/sw/translation.json";

const interfaceLanguageKey = "falowen:interface-language";
const legacyLanguageKey = "falowen:language";

const SUPPORTED_INTERFACE_LANGUAGES = new Set(["en", "de", "fr", "sw"]);

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
    sw: { translation: sw },
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

// A single interface language preference is shared by public pages, login, signup
// and the signed-in application. It never changes the enrolled course.
export const changeInterfaceLanguage = async (language) => {
  const normalized = normalizeStoredLanguage(language) || "en";
  persistInterfaceLanguage(normalized);
  return i18n.changeLanguage(normalized);
};

if (typeof document !== "undefined") {
  document.documentElement.lang = normalizeStoredLanguage(i18n.language) || fallbackLanguage;
  i18n.on("languageChanged", (language) => {
    const normalized = normalizeStoredLanguage(language) || fallbackLanguage;
    document.documentElement.lang = normalized;
    persistInterfaceLanguage(normalized);
  });
}

export default i18n;
