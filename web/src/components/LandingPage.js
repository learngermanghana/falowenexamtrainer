import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LandingPageSimple from "./LandingPageSimple";
import {
  rememberPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const FREE_LESSON_VIDEO_ID = "CFkrrVxhdL4";
const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@LLEAGhana?sub_confirmation=1";

const LANGUAGE_NOTE = {
  en: {
    website: "Website language",
    websiteText: "changes the words shown on this page.",
    study: "Study programme",
    german: "German",
    french: "French",
    ending: "Changing the website language does not change your selected course.",
    radioTitle: "Falowen Radio",
    radioText: "German listening practice built into the Falowen course book to help learners understand natural, real-world German before lesson tasks.",
    radioLearn: "What is Falowen Radio?",
    radioSubscribe: "Subscribe on YouTube",
  },
  de: {
    website: "Website-Sprache",
    websiteText: "ändert nur die Texte auf dieser Seite.",
    study: "Lernprogramm",
    german: "Deutsch",
    french: "Französisch",
    ending: "Die Website-Sprache ändert deinen ausgewählten Kurs nicht.",
    radioTitle: "Falowen Radio",
    radioText: "Deutsch-Hörtraining im Falowen-Kursbuch, das Lernenden hilft, natürliches gesprochenes Deutsch vor den Aufgaben zu verstehen.",
    radioLearn: "Was ist Falowen Radio?",
    radioSubscribe: "Auf YouTube abonnieren",
  },
  fr: {
    website: "Langue du site",
    websiteText: "change uniquement les textes affichés sur cette page.",
    study: "Programme d’étude",
    german: "Allemand",
    french: "Français",
    ending: "Changer la langue du site ne change pas le cours sélectionné.",
    radioTitle: "Falowen Radio",
    radioText: "Une activité d’écoute allemande intégrée au manuel Falowen pour comprendre l’allemand naturel avant les exercices.",
    radioLearn: "Qu’est-ce que Falowen Radio ?",
    radioSubscribe: "S’abonner sur YouTube",
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

      <section
        aria-label="Falowen Radio German listening practice"
        style={{
          width: "min(1080px, calc(100% - 28px))",
          margin: "12px auto 0",
          padding: "14px 16px",
          border: "1px solid #c4b5fd",
          borderRadius: 14,
          background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
          color: "#312e81",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "grid", gap: 4, maxWidth: 720 }}>
          <strong style={{ fontSize: 16 }}>🎙️ {copy.radioTitle}</strong>
          <span style={{ fontSize: 13, lineHeight: 1.55 }}>{copy.radioText}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a
            href="/falowen-radio"
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              background: "#4338ca",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {copy.radioLearn}
          </a>
          <a
            href={YOUTUBE_SUBSCRIBE_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid #a5b4fc",
              background: "#ffffff",
              color: "#3730a3",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            ▶ {copy.radioSubscribe}
          </a>
        </div>
      </section>

      <LandingPageSimple {...props} />
    </>
  );
}
