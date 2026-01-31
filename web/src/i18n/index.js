import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";

const storedLanguage = typeof window !== "undefined" ? window.localStorage.getItem("falowen:language") : null;

const fallbackLanguage = "de";

const resolvedLanguage = storedLanguage || fallbackLanguage;

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    fr: { translation: fr },
  },
  lng: resolvedLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export const persistLanguage = (language) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("falowen:language", language);
  } catch {
    // ignore storage errors
  }
};

export default i18n;
