import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { persistInterfaceLanguage } from "../i18n";
import { updatePageMeta } from "../lib/pageMeta";
import academyProfile from "../data/publicAcademyProfile.json";
import { PUBLIC_MARKETING_FEATURES } from "../data/publicMarketingFeatures";
import "./LandingPageMarketing.css";

const COPY = {
  en: {
    language: "Language", login: "Log in", signup: "Sign up",
    navClasses: "Live classes", navExams: "Exam practice", navHelp: "How Falowen works",
    eyebrow: "GERMAN LEARNING THAT FITS YOUR LIFE",
    title: "Learn German your way.",
    titleAccent: "Grow with Falowen.",
    subtitle: "From A1 to C2, learn with live classes or at your own pace. Get recorded lectures, interactive workbooks, AI-powered practice and real tutor support — all in one place.",
    start: "Start learning", placement: "Take free placement test",
    smallNote: "Not sure where to begin? Discover your level first.",
    heroPhoto: "Real German classes. Real support.",
    levels: "A1–C2", flexible: "Live or self-paced", supported: "AI + tutor support",
    featuresEyebrow: "WHY LEARN WITH FALOWEN",
    featuresTitle: "Four ways to move forward in German.",
    featuresIntro: "Whether you're beginning, improving your skills or preparing for an exam, Falowen helps you take the next step.",
    supportEyebrow: "YOUR SUPPORT SYSTEM",
    supportTitle: "Practise with AI. Improve with a tutor.",
    supportText: "Replay lectures, practise as often as you need and receive practical learning feedback — with teacher guidance when you need it.",
    supportLink: "See how Falowen works",
    reviewsIntro: "Hear it from our students",
    finalEyebrow: "YOUR NEXT STEP",
    finalTitle: "Your German journey starts here.",
    finalText: "Choose a class or learn at your own pace. We bring your lessons, practice and support together.",
    footerCourses: "German courses A1–C2", footerExam: "Goethe-style practice", footerReviews: "Student reviews", footerHelp: "Help",
    contact: "Questions? Chat with us on WhatsApp",
    featureCopy: {},
    metaTitle: "Falowen | German A1–C2, Live Classes, AI & Goethe-Style Mocks",
    metaDescription: "Learn German from A1 to C2 with live classes or self-learning, recorded teacher lectures, AI-supported practice, tutor support and Goethe-style sample and mock exams on Falowen.",
  },
  de: {
    language: "Sprache", login: "Anmelden", signup: "Registrieren",
    navClasses: "Live-Kurse", navExams: "Prüfungsvorbereitung", navHelp: "So funktioniert Falowen",
    eyebrow: "DEUTSCH LERNEN, WIE ES ZU DIR PASST",
    title: "Lerne Deutsch auf deine Weise.",
    titleAccent: "Mit Falowen kommst du weiter.",
    subtitle: "Von A1 bis C2: Live-Kurse oder selbstständiges Lernen, mit Unterrichtsaufzeichnungen, interaktiven Arbeitsheften, KI-Übungen und Unterstützung von Lehrkräften.",
    start: "Jetzt lernen", placement: "Kostenlosen Einstufungstest machen",
    smallNote: "Noch unsicher beim Niveau? Finde deinen passenden Einstieg.",
    heroPhoto: "Echter Deutschunterricht. Persönliche Unterstützung.",
    levels: "A1–C2", flexible: "Live oder im eigenen Tempo", supported: "KI + Lehrkräfte",
    featuresEyebrow: "WARUM FALOWEN",
    featuresTitle: "Vier Wege, um mit Deutsch weiterzukommen.",
    featuresIntro: "Ganz gleich, ob du beginnst, dein Deutsch verbesserst oder eine Prüfung vorbereitest.",
    supportEyebrow: "DEINE LERNUNTERSTÜTZUNG",
    supportTitle: "Mit KI üben. Mit Lehrkräften besser werden.",
    supportText: "Schau dir Lektionen erneut an, übe so oft du möchtest und erhalte hilfreiches Feedback und Unterstützung.",
    supportLink: "Falowen kennenlernen",
    reviewsIntro: "Das sagen unsere Lernenden",
    finalEyebrow: "DEIN NÄCHSTER SCHRITT",
    finalTitle: "Dein Deutschweg beginnt hier.",
    finalText: "Wähle einen Live-Kurs oder lerne selbstständig. Falowen verbindet Unterricht, Übungen und Unterstützung.",
    footerCourses: "Deutschkurse A1–C2", footerExam: "Goethe-Prüfungsübungen", footerReviews: "Bewertungen", footerHelp: "Hilfe",
    contact: "Fragen? Schreib uns auf WhatsApp",
    featureCopy: {
      placement: ["Finde dein Deutschniveau", "Mache einen kostenlosen Einstufungstest und finde deinen Einstieg.", "Einstufungstest machen"],
      exams: ["Bereite dich auf Goethe-Prüfungen vor", "Übe mit Beispieltests und vollständigen Probeprüfungen für Lesen, Hören, Schreiben und Sprechen, mit KI-Feedback.", "Prüfungen üben"],
      class: ["Lerne im Live-Kurs", "Lerne mit Lehrkräften, erhalte Feedback und sieh dir aufgezeichnete Lektionen erneut an.", "Live-Kurse ansehen"],
      self: ["Lerne in deinem Tempo", "Lerne selbstständig mit Arbeitsheften, Unterrichtsaufzeichnungen, KI-Übungen und Unterstützung.", "Selbstständig starten"],
    },
    metaTitle: "Falowen | Deutsch A1–C2 mit Live-Kursen und KI",
    metaDescription: "Deutsch A1–C2 mit Falowen: Live-Kurse, Selbstlernen, aufgezeichnete Lektionen, KI-Übungen, Tutor-Feedback und Goethe-orientierte Probeprüfungen.",
  },
  fr: {
    language: "Langue", login: "Se connecter", signup: "S'inscrire",
    navClasses: "Cours en direct", navExams: "Examens blancs", navHelp: "Comment fonctionne Falowen",
    eyebrow: "APPRENDRE L'ALLEMAND À VOTRE RYTHME",
    title: "Apprenez l'allemand à votre façon.",
    titleAccent: "Progressez avec Falowen.",
    subtitle: "Du niveau A1 au C2 : cours en direct ou à votre rythme, vidéos enregistrées, cahiers interactifs, exercices avec IA et aide d'enseignants.",
    start: "Commencer", placement: "Faire le test de niveau gratuit",
    smallNote: "Vous ne connaissez pas votre niveau ? Commencez par le test gratuit.",
    heroPhoto: "De vrais cours d'allemand. Un soutien humain.",
    levels: "A1–C2", flexible: "En direct ou à son rythme", supported: "IA + enseignants",
    featuresEyebrow: "POURQUOI FALOWEN",
    featuresTitle: "Quatre façons de progresser en allemand.",
    featuresIntro: "Débutez, perfectionnez vos compétences ou préparez votre examen à votre rythme.",
    supportEyebrow: "VOTRE ACCOMPAGNEMENT",
    supportTitle: "Pratiquez avec l'IA. Progressez avec un enseignant.",
    supportText: "Revoyez les cours, exercez-vous autant que nécessaire et profitez de conseils d'enseignants.",
    supportLink: "Découvrir Falowen",
    reviewsIntro: "L'avis de nos élèves",
    finalEyebrow: "VOTRE PROCHAINE ÉTAPE",
    finalTitle: "Votre apprentissage commence ici.",
    finalText: "Choisissez un cours en direct ou apprenez à votre rythme. Falowen réunit les cours, exercices et aides.",
    footerCourses: "Cours A1–C2", footerExam: "Examens de type Goethe", footerReviews: "Avis des élèves", footerHelp: "Aide",
    contact: "Des questions ? Contactez-nous sur WhatsApp",
    featureCopy: {
      placement: ["Trouvez votre niveau d'allemand", "Faites un test de niveau gratuit pour savoir par où commencer.", "Faire le test"],
      exams: ["Préparez les examens de type Goethe", "Entraînez-vous avec des examens blancs complets et des exemples en lecture, écoute, écrit et oral, avec l'aide de l'IA.", "Préparer l'examen"],
      class: ["Apprenez en classe", "Suivez des cours avec un enseignant, obtenez des corrections et revoyez les leçons enregistrées.", "Voir les cours"],
      self: ["Apprenez à votre rythme", "Étudiez en autonomie avec des cahiers, cours enregistrés, exercices avec IA et aide humaine.", "Étudier en autonomie"],
    },
    metaTitle: "Falowen | Allemand A1–C2, cours en direct, IA et examens blancs",
    metaDescription: "Apprenez l'allemand A1–C2 avec Falowen : cours en direct ou autonomes, vidéos enregistrées, exercices assistés par IA et préparation aux examens de type Goethe.",
  },
};

const FOOTER_LINKS = [
  { href: "/courses/", labelKey: "footerCourses" },
  { href: "/exam-practice", labelKey: "footerExam" },
  { href: "/reviews/", labelKey: "footerReviews" },
  { href: "/help", labelKey: "footerHelp" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

export default function LandingPageSimple({ onSignUp, onLogin }) {
  const { i18n } = useTranslation();
  const detected = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const [language, setLanguage] = useState(COPY[detected] ? detected : "en");
  const copy = COPY[language] || COPY.en;

  useEffect(() => {
    const next = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
    if (COPY[next]) setLanguage(next);
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    updatePageMeta({
      title: copy.metaTitle, description: copy.metaDescription,
      canonicalPath: "/", lang: language, ogType: "website",
    });
    document.documentElement.lang = language;
  }, [copy.metaTitle, copy.metaDescription, language]);

  const changeLanguage = async (event) => {
    const next = event.target.value;
    if (!COPY[next]) return;
    setLanguage(next);
    persistInterfaceLanguage(next);
    document.documentElement.lang = next;
    try {
      await i18n.changeLanguage(next);
    } catch (error) {
      console.error("Failed to change interface language", error);
    }
  };

  const signup = () => onSignUp?.("german");
  const login = () => onLogin?.();

  return (
    <main className="falowen-public-home">
      <div className="falowen-home-shell">
        <nav className="falowen-home-nav" aria-label="Falowen">
          <a href="/" className="falowen-home-brand" aria-label="Falowen home">
            <img src="/logo192.png" alt="" width="38" height="38" />
            <span>falowen<span className="falowen-home-brand-dot">.</span></span>
          </a>
          <div className="falowen-home-nav-links">
            <a href="/classes/">{copy.navClasses}</a>
            <a href="/exam-practice">{copy.navExams}</a>
            <a href="/help">{copy.navHelp}</a>
          </div>
          <div className="falowen-home-nav-actions">
            <label className="falowen-home-language-wrap">
              <span className="falowen-home-visually-hidden">{copy.language}</span>
              <select value={language} onChange={changeLanguage} aria-label={copy.language} className="falowen-home-language">
                {LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <button className="falowen-home-login" type="button" onClick={login}>{copy.login}</button>
            <button className="falowen-home-nav-signup" type="button" onClick={signup}>{copy.signup} ↗</button>
          </div>
        </nav>

        <section className="falowen-home-hero" aria-labelledby="falowen-home-title">
          <div className="falowen-home-copy">
            <span className="falowen-home-eyebrow">{copy.eyebrow}</span>
            <h1 id="falowen-home-title">{copy.title} <span>{copy.titleAccent}</span></h1>
            <p className="falowen-home-intro">{copy.subtitle}</p>
            <div className="falowen-home-cta-row">
              <button type="button" className="falowen-home-button falowen-home-button-primary" onClick={signup}>{copy.start} <span aria-hidden="true">↗</span></button>
              <a className="falowen-home-button falowen-home-button-outline" href="/placement-test">{copy.placement} <span aria-hidden="true">→</span></a>
            </div>
            <p className="falowen-home-helper">{copy.smallNote}</p>
            <div className="falowen-home-proof" aria-label="Falowen A1 to C2 learning options">
              {[copy.levels, copy.flexible, copy.supported].map((label) => <span key={label}>✓ {label}</span>)}
            </div>
          </div>
          <div className="falowen-home-hero-art">
            <img src={academyProfile.classroomImage} alt="German classroom at Learn Language Education Academy" className="falowen-home-classroom" width="560" height="520" />
            <div className="falowen-home-image-overlay"><span>{copy.heroPhoto}</span><strong>Learn Language Education Academy · Accra & online</strong></div>
            <div className="falowen-home-image-sticker" aria-hidden="true">A1 → C2</div>
          </div>
        </section>

        <section className="falowen-home-features" aria-labelledby="falowen-features-title">
          <div className="falowen-home-section-heading">
            <span className="falowen-home-section-kicker">{copy.featuresEyebrow}</span>
            <h2 id="falowen-features-title">{copy.featuresTitle}</h2>
            <p>{copy.featuresIntro}</p>
          </div>
          <div className="falowen-home-feature-grid">
            {PUBLIC_MARKETING_FEATURES.map((feature, index) => {
              const localized = copy.featureCopy[feature.key];
              return (
                <article className="falowen-home-feature" key={feature.key}>
                  <div className="falowen-home-feature-top">
                    <span className="falowen-home-feature-icon" aria-hidden="true">{feature.icon}</span>
                    <span className="falowen-home-feature-index" aria-hidden="true">0{index + 1}</span>
                  </div>
                  <h3>{localized?.[0] || feature.title}</h3>
                  <p>{localized?.[1] || feature.description}</p>
                  {feature.key === "self" ? (
                    <button type="button" className="falowen-home-feature-link" onClick={signup}>{localized?.[2] || feature.action} ↗</button>
                  ) : (
                    <a className="falowen-home-feature-link" href={feature.href}>{localized?.[2] || feature.action} ↗</a>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="falowen-home-support" aria-labelledby="falowen-support-heading">
          <div className="falowen-home-support-copy">
            <span className="falowen-home-section-kicker">{copy.supportEyebrow}</span>
            <h2 id="falowen-support-heading">{copy.supportTitle}</h2>
            <p>{copy.supportText}</p>
          </div>
          <a className="falowen-home-support-link" href="/help">{copy.supportLink} →</a>
        </section>

        <div className="falowen-home-reviews-intro"><span>★★★★★</span><p>{copy.reviewsIntro}</p></div>
        {/* /homepage-reviews.js injects genuine Google reviews before the final CTA. */}

        <section className="falowen-final-cta">
          <div>
            <span className="falowen-home-section-kicker">{copy.finalEyebrow}</span>
            <h2>{copy.finalTitle}</h2>
            <p>{copy.finalText}</p>
          </div>
          <div className="falowen-home-final-actions">
            <button type="button" className="falowen-home-button falowen-home-button-primary" onClick={signup}>{copy.signup} ↗</button>
            <a href="/classes/" className="falowen-home-button falowen-home-button-light">{copy.navClasses} →</a>
          </div>
        </section>

        <footer className="falowen-home-footer">
          <div className="falowen-home-footer-links">
            {FOOTER_LINKS.map((item) => <a href={item.href} key={item.href}>{copy[item.labelKey]}</a>)}
          </div>
          <a className="falowen-home-contact-link" href="https://wa.me/233205706589" target="_blank" rel="noopener noreferrer">{copy.contact} ↗</a>
        </footer>
      </div>
      <div className="falowen-mobile-actions">
        <button type="button" className="falowen-home-button falowen-home-button-primary" onClick={signup}>{copy.start}</button>
        <a className="falowen-home-button falowen-home-button-outline" href="/placement-test">{copy.placement}</a>
      </div>
    </main>
  );
}
