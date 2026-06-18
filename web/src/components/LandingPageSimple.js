import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { persistInterfaceLanguage } from "../i18n";
import { updatePageMeta } from "../lib/pageMeta";

const COPY = {
  en: {
    languageLabel: "Language",
    login: "Log in",
    signup: "Sign up",
    badge: "German and French learning in one place",
    title: "Learn. Practise. Get ready for your exam.",
    subtitle:
      "Falowen brings your course book, assignments, tutor feedback, attendance, and exam practice together in one simple learning hub.",
    chooseProgram: "What do you want to study?",
    german: "German",
    french: "French",
    joinProgram: "Start {{program}}",
    viewClasses: "View classes",
    benefits: [
      { icon: "📘", title: "Structured lessons", text: "Follow a clear course plan from A1 to advanced levels." },
      { icon: "✍️", title: "Tutor feedback", text: "Submit work and learn from corrections and scores." },
      { icon: "🎯", title: "Exam preparation", text: "Practise speaking, writing, listening, and reading." },
    ],
    howTitle: "Start in three simple steps",
    steps: [
      { title: "Choose your programme", text: "Select German or French and create your account." },
      { title: "Join your class", text: "Choose a live class or self-learning option." },
      { title: "Learn in Falowen", text: "Open lessons, submit assignments, and track progress." },
    ],
    exploreTitle: "Useful links",
    resources: [
      { label: "Upcoming classes", href: "/classes/" },
      { label: "Free placement test", href: "/placement-test" },
      { label: "Free lesson", href: "https://www.youtube.com/watch?v=CFkrrVxhdL4", external: true },
      { label: "Falowen blog", href: "https://blog.falowen.app", external: true },
    ],
    finalTitle: "Ready to start learning?",
    finalText: "Create your Falowen account or log in to continue your course.",
    contact: "Need help? Chat with us on WhatsApp",
    metaTitle: "Falowen Learning Hub | German and French Courses",
    metaDescription:
      "Join Falowen for structured German and French lessons, tutor feedback, assignments, progress tracking, and exam preparation.",
  },
  de: {
    languageLabel: "Sprache",
    login: "Anmelden",
    signup: "Registrieren",
    badge: "Deutsch und Französisch an einem Ort lernen",
    title: "Lernen. Üben. Sicher in die Prüfung gehen.",
    subtitle:
      "Falowen vereint Kursbuch, Aufgaben, Tutor-Feedback, Anwesenheit und Prüfungsvorbereitung in einer einfachen Lernplattform.",
    chooseProgram: "Was möchtest du lernen?",
    german: "Deutsch",
    french: "Französisch",
    joinProgram: "{{program}} starten",
    viewClasses: "Kurse ansehen",
    benefits: [
      { icon: "📘", title: "Strukturierte Lektionen", text: "Folge einem klaren Lernplan von A1 bis zu höheren Niveaus." },
      { icon: "✍️", title: "Tutor-Feedback", text: "Reiche Aufgaben ein und lerne aus Korrekturen und Ergebnissen." },
      { icon: "🎯", title: "Prüfungsvorbereitung", text: "Übe Sprechen, Schreiben, Hören und Lesen." },
    ],
    howTitle: "In drei einfachen Schritten starten",
    steps: [
      { title: "Programm wählen", text: "Wähle Deutsch oder Französisch und erstelle dein Konto." },
      { title: "Kurs beitreten", text: "Wähle einen Live-Kurs oder eine Selbstlernoption." },
      { title: "Mit Falowen lernen", text: "Öffne Lektionen, reiche Aufgaben ein und verfolge deinen Fortschritt." },
    ],
    exploreTitle: "Nützliche Links",
    resources: [
      { label: "Kommende Kurse", href: "/classes/" },
      { label: "Kostenloser Einstufungstest", href: "/placement-test" },
      { label: "Kostenlose Lektion", href: "https://www.youtube.com/watch?v=CFkrrVxhdL4", external: true },
      { label: "Falowen-Blog", href: "https://blog.falowen.app", external: true },
    ],
    finalTitle: "Bereit zum Lernen?",
    finalText: "Erstelle dein Falowen-Konto oder melde dich an, um deinen Kurs fortzusetzen.",
    contact: "Brauchst du Hilfe? Schreib uns auf WhatsApp",
    metaTitle: "Falowen Lernplattform | Deutsch- und Französischkurse",
    metaDescription:
      "Lerne Deutsch und Französisch mit strukturierten Lektionen, Tutor-Feedback, Aufgaben, Fortschrittsanzeige und Prüfungsvorbereitung.",
  },
  fr: {
    languageLabel: "Langue",
    login: "Se connecter",
    signup: "S'inscrire",
    badge: "Apprendre l'allemand et le français au même endroit",
    title: "Apprenez. Pratiquez. Préparez votre examen.",
    subtitle:
      "Falowen réunit votre manuel, vos devoirs, les commentaires du professeur, la présence et la préparation aux examens dans un espace simple.",
    chooseProgram: "Que voulez-vous étudier ?",
    german: "Allemand",
    french: "Français",
    joinProgram: "Commencer le {{program}}",
    viewClasses: "Voir les cours",
    benefits: [
      { icon: "📘", title: "Leçons structurées", text: "Suivez un programme clair du niveau A1 aux niveaux avancés." },
      { icon: "✍️", title: "Retour du professeur", text: "Envoyez vos travaux et apprenez grâce aux corrections et aux notes." },
      { icon: "🎯", title: "Préparation aux examens", text: "Pratiquez l'oral, l'écrit, l'écoute et la lecture." },
    ],
    howTitle: "Commencez en trois étapes simples",
    steps: [
      { title: "Choisissez votre programme", text: "Sélectionnez l'allemand ou le français et créez votre compte." },
      { title: "Rejoignez votre cours", text: "Choisissez un cours en direct ou une option d'auto-apprentissage." },
      { title: "Apprenez avec Falowen", text: "Ouvrez les leçons, envoyez les devoirs et suivez vos progrès." },
    ],
    exploreTitle: "Liens utiles",
    resources: [
      { label: "Prochains cours", href: "/classes/" },
      { label: "Test de niveau gratuit", href: "/placement-test" },
      { label: "Leçon gratuite", href: "https://www.youtube.com/watch?v=CFkrrVxhdL4", external: true },
      { label: "Blog Falowen", href: "https://blog.falowen.app", external: true },
    ],
    finalTitle: "Prêt à commencer ?",
    finalText: "Créez votre compte Falowen ou connectez-vous pour continuer votre cours.",
    contact: "Besoin d'aide ? Écrivez-nous sur WhatsApp",
    metaTitle: "Falowen | Cours d'allemand et de français",
    metaDescription:
      "Apprenez l'allemand et le français avec des leçons structurées, des devoirs, des commentaires, le suivi des progrès et la préparation aux examens.",
  },
};

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

const LandingPageSimple = ({ onSignUp, onLogin, program, onProgramSelect }) => {
  const { i18n } = useTranslation();
  const initialLanguage = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const [interfaceLanguage, setInterfaceLanguage] = useState(COPY[initialLanguage] ? initialLanguage : "en");
  const resolvedProgram = program === "french" ? "french" : "german";
  const copy = COPY[interfaceLanguage] || COPY.en;
  const selectedProgramLabel = resolvedProgram === "french" ? copy.french : copy.german;

  const actionStyle = useMemo(
    () => ({
      minHeight: 46,
      borderRadius: 12,
      padding: "11px 18px",
      fontSize: 15,
      fontWeight: 800,
      cursor: "pointer",
      touchAction: "manipulation",
      WebkitTapHighlightColor: "transparent",
    }),
    []
  );

  useEffect(() => {
    const nextLanguage = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
    if (COPY[nextLanguage]) setInterfaceLanguage(nextLanguage);
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    updatePageMeta({
      title: copy.metaTitle,
      description: copy.metaDescription,
      canonicalPath: "/",
      lang: interfaceLanguage,
      ogType: "website",
    });
    document.documentElement.lang = interfaceLanguage;
  }, [copy.metaDescription, copy.metaTitle, interfaceLanguage]);

  const handleLanguageChange = async (event) => {
    const nextLanguage = event.target.value;
    if (!COPY[nextLanguage]) return;

    setInterfaceLanguage(nextLanguage);
    persistInterfaceLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;

    try {
      await i18n.changeLanguage(nextLanguage);
    } catch (error) {
      console.error("Failed to change interface language", error);
    }
  };

  const handleProgramChange = (nextProgram) => onProgramSelect?.(nextProgram);
  const handleSignup = () => onSignUp?.(resolvedProgram);
  const handleLogin = () => onLogin?.();

  return (
    <main className="falowen-public-home">
      <style>{`
        .falowen-public-home {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          padding: max(14px, env(safe-area-inset-top)) 14px calc(28px + env(safe-area-inset-bottom));
        }
        .falowen-public-home * { box-sizing: border-box; }
        .falowen-home-shell { width: min(1080px, 100%); margin: 0 auto; display: grid; gap: 18px; }
        .falowen-home-nav {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 8px 2px;
        }
        .falowen-home-brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 20px; }
        .falowen-home-brand img { width: 38px; height: 38px; border-radius: 10px; }
        .falowen-home-nav-actions { display: flex; align-items: center; gap: 9px; }
        .falowen-home-language {
          min-height: 42px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff;
          padding: 0 10px; font-weight: 700; color: #0f172a;
        }
        .falowen-home-hero {
          display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(270px, .75fr); gap: 24px;
          align-items: center; padding: clamp(24px, 5vw, 54px); border-radius: 26px;
          background: linear-gradient(135deg, #1d4ed8, #172554); color: #fff;
          box-shadow: 0 22px 50px rgba(30, 64, 175, .22);
        }
        .falowen-home-copy { display: grid; gap: 15px; }
        .falowen-home-badge {
          width: fit-content; padding: 7px 11px; border-radius: 999px; background: rgba(255,255,255,.16);
          border: 1px solid rgba(255,255,255,.2); font-size: 12px; font-weight: 900;
        }
        .falowen-home-copy h1 { margin: 0; font-size: clamp(34px, 6vw, 58px); line-height: 1.02; letter-spacing: -.035em; }
        .falowen-home-copy > p { margin: 0; color: #dbeafe; font-size: 17px; line-height: 1.65; max-width: 680px; }
        .falowen-program-picker { display: grid; gap: 8px; }
        .falowen-program-label { font-size: 13px; font-weight: 800; color: #dbeafe; }
        .falowen-program-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        .falowen-program-button {
          min-height: 40px; border-radius: 999px; border: 1px solid rgba(255,255,255,.35);
          padding: 8px 14px; color: #fff; background: transparent; font-weight: 800; cursor: pointer;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        .falowen-program-button[aria-pressed="true"] { background: #fff; color: #1e3a8a; border-color: #fff; }
        .falowen-home-cta-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .falowen-home-primary { border: 1px solid #fbbf24; background: #fbbf24; color: #111827; }
        .falowen-home-secondary { border: 1px solid rgba(255,255,255,.48); background: rgba(255,255,255,.08); color: #fff; }
        .falowen-home-visual {
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); border-radius: 20px;
          padding: 14px; display: grid; gap: 10px;
        }
        .falowen-home-visual-card { background: #fff; color: #0f172a; border-radius: 15px; padding: 13px; display: grid; gap: 5px; }
        .falowen-home-visual-card span { font-size: 12px; color: #64748b; font-weight: 700; }
        .falowen-home-visual-card strong { font-size: 15px; }
        .falowen-benefits, .falowen-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .falowen-info-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px;
          display: grid; gap: 7px; box-shadow: 0 8px 24px rgba(15, 23, 42, .05);
        }
        .falowen-info-card h3 { margin: 0; font-size: 16px; }
        .falowen-info-card p { margin: 0; color: #475569; line-height: 1.55; font-size: 14px; }
        .falowen-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 22px; display: grid; gap: 15px; }
        .falowen-section h2 { margin: 0; font-size: 24px; }
        .falowen-step-number {
          width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center;
          background: #dbeafe; color: #1e40af; font-weight: 900;
        }
        .falowen-resources { display: flex; gap: 9px; flex-wrap: wrap; }
        .falowen-resource-link {
          min-height: 42px; display: inline-flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 999px;
          padding: 9px 14px; text-decoration: none; color: #1e3a8a; background: #fff; font-weight: 800;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        .falowen-final-cta {
          display: flex; justify-content: space-between; align-items: center; gap: 18px; flex-wrap: wrap;
          padding: 24px; border-radius: 22px; background: #0f172a; color: #fff;
        }
        .falowen-final-cta h2 { margin: 0 0 6px; }
        .falowen-final-cta p { margin: 0; color: #cbd5e1; }
        .falowen-contact-link { color: #1d4ed8; text-decoration: none; font-weight: 800; text-align: center; }
        .falowen-mobile-actions { display: none; }
        @media (max-width: 760px) {
          .falowen-public-home { padding-left: 10px; padding-right: 10px; padding-bottom: calc(92px + env(safe-area-inset-bottom)); }
          .falowen-home-nav { align-items: flex-start; }
          .falowen-home-brand { font-size: 18px; }
          .falowen-home-brand img { width: 34px; height: 34px; }
          .falowen-home-nav-actions > button { display: none; }
          .falowen-home-language { max-width: 118px; }
          .falowen-home-hero { grid-template-columns: 1fr; padding: 24px 18px; border-radius: 20px; }
          .falowen-home-copy h1 { font-size: 38px; }
          .falowen-home-copy > p { font-size: 15px; }
          .falowen-home-visual { display: none; }
          .falowen-benefits, .falowen-steps { grid-template-columns: 1fr; }
          .falowen-section { padding: 18px; }
          .falowen-final-cta { padding: 20px; }
          .falowen-mobile-actions {
            position: fixed; left: 0; right: 0; bottom: 0; z-index: 100;
            display: grid; grid-template-columns: 1fr 1fr; gap: 9px;
            padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
            background: rgba(255,255,255,.96); border-top: 1px solid #dbeafe;
            box-shadow: 0 -12px 28px rgba(15,23,42,.12); backdrop-filter: blur(12px);
          }
        }
      `}</style>

      <div className="falowen-home-shell">
        <nav className="falowen-home-nav" aria-label="Falowen">
          <div className="falowen-home-brand">
            <img src="/logo192.png" alt="" />
            <span>Falowen</span>
          </div>
          <div className="falowen-home-nav-actions">
            <label>
              <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                {copy.languageLabel}
              </span>
              <select
                className="falowen-home-language"
                value={interfaceLanguage}
                onChange={handleLanguageChange}
                aria-label={copy.languageLabel}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleLogin}
              style={{ ...actionStyle, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a" }}
            >
              {copy.login}
            </button>
          </div>
        </nav>

        <section className="falowen-home-hero">
          <div className="falowen-home-copy">
            <span className="falowen-home-badge">{copy.badge}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>

            <div className="falowen-program-picker">
              <span className="falowen-program-label">{copy.chooseProgram}</span>
              <div className="falowen-program-buttons" role="group" aria-label={copy.chooseProgram}>
                <button
                  type="button"
                  className="falowen-program-button"
                  aria-pressed={resolvedProgram === "german"}
                  onClick={() => handleProgramChange("german")}
                >
                  {copy.german}
                </button>
                <button
                  type="button"
                  className="falowen-program-button"
                  aria-pressed={resolvedProgram === "french"}
                  onClick={() => handleProgramChange("french")}
                >
                  {copy.french}
                </button>
              </div>
            </div>

            <div className="falowen-home-cta-row">
              <button type="button" onClick={handleSignup} className="falowen-home-primary" style={actionStyle}>
                {copy.joinProgram.replace("{{program}}", selectedProgramLabel)}
              </button>
              <button type="button" onClick={handleLogin} className="falowen-home-secondary" style={actionStyle}>
                {copy.login}
              </button>
              <a href="/classes/" className="falowen-resource-link" style={{ borderColor: "rgba(255,255,255,.38)", background: "transparent", color: "#fff" }}>
                {copy.viewClasses}
              </a>
            </div>
          </div>

          <div className="falowen-home-visual" aria-label="Falowen learning hub preview">
            {copy.benefits.map((benefit, index) => (
              <div className="falowen-home-visual-card" key={benefit.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{benefit.title}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="falowen-benefits" aria-label={copy.howTitle}>
          {copy.benefits.map((benefit) => (
            <article className="falowen-info-card" key={benefit.title}>
              <span aria-hidden style={{ fontSize: 22 }}>{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </section>

        <section className="falowen-section">
          <h2>{copy.howTitle}</h2>
          <div className="falowen-steps">
            {copy.steps.map((step, index) => (
              <article className="falowen-info-card" key={step.title}>
                <span className="falowen-step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="falowen-section">
          <h2>{copy.exploreTitle}</h2>
          <div className="falowen-resources">
            {copy.resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                className="falowen-resource-link"
                target={resource.external ? "_blank" : undefined}
                rel={resource.external ? "noopener noreferrer" : undefined}
              >
                {resource.label}
              </a>
            ))}
          </div>
        </section>

        <section className="falowen-final-cta">
          <div>
            <h2>{copy.finalTitle}</h2>
            <p>{copy.finalText}</p>
          </div>
          <div className="falowen-home-cta-row">
            <button type="button" onClick={handleSignup} className="falowen-home-primary" style={actionStyle}>
              {copy.signup}
            </button>
            <button type="button" onClick={handleLogin} className="falowen-home-secondary" style={actionStyle}>
              {copy.login}
            </button>
          </div>
        </section>

        <a className="falowen-contact-link" href="https://wa.me/233205706589" target="_blank" rel="noopener noreferrer">
          {copy.contact}
        </a>
      </div>

      <div className="falowen-mobile-actions" aria-label={`${copy.signup} / ${copy.login}`}>
        <button type="button" onClick={handleSignup} className="falowen-home-primary" style={actionStyle}>
          {copy.signup}
        </button>
        <button
          type="button"
          onClick={handleLogin}
          style={{ ...actionStyle, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a" }}
        >
          {copy.login}
        </button>
      </div>
    </main>
  );
};

export default LandingPageSimple;
