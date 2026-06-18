import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LandingPageSimple from "./LandingPageSimple";
import {
  rememberPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const FREE_LESSON_VIDEO_ID = "CFkrrVxhdL4";

const LANGUAGE_NOTE = {
  en: {
    website: "Website language",
    websiteText: "changes the words shown on this page.",
    study: "Study programme",
    german: "German",
    french: "French",
    ending: "Changing the website language does not change your selected course.",
  },
  de: {
    website: "Website-Sprache",
    websiteText: "ändert nur die Texte auf dieser Seite.",
    study: "Lernprogramm",
    german: "Deutsch",
    french: "Französisch",
    ending: "Die Website-Sprache ändert deinen ausgewählten Kurs nicht.",
  },
  fr: {
    website: "Langue du site",
    websiteText: "change uniquement les textes affichés sur cette page.",
    study: "Programme d’étude",
    german: "Allemand",
    french: "Français",
    ending: "Changer la langue du site ne change pas le cours sélectionné.",
  },
};

export default function LandingPage(props) {
  const { i18n } = useTranslation();
  const language = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const copy = LANGUAGE_NOTE[language] || LANGUAGE_NOTE.en;
  const selectedProgramme = props.program === "french" ? copy.french : copy.german;

  useEffect(() => {
    rememberPublicFunnelContext({
      lastStage: "landing",
      source: "homepage",
      video: FREE_LESSON_VIDEO_ID,
    });
    trackPublicFunnelEvent("landing_view", { video: FREE_LESSON_VIDEO_ID });
  }, []);

  return (
    <>
      <div
        role="note"
        style={{
          width: "min(1080px, calc(100% - 28px))",
          margin: "12px auto -2px",
          padding: "10px 14px",
          border: "1px solid #bfdbfe",
          borderRadius: 12,
          background: "#eff6ff",
          color: "#1e3a8a",
          fontSize: 13,
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        <strong>{copy.website}:</strong> {copy.websiteText}{" "}
        <strong>{copy.study}:</strong> {selectedProgramme}. {copy.ending}
      </div>
      <LandingPageSimple {...props} />
    </>
  );
}
