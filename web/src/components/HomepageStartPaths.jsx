import React, { useState } from "react";

const CONTENT = {
  en: {
    heading: "Where should you start?", intro: "Choose the right path for your language journey.",
    placementTitle: "Already know some German or Kiswahili?", placementText: "Not sure of your level? Take a free placement test.",
    choose: "Choose test language", german: "German", swahili: "Kiswahili", placementAction: "Take placement test",
    examsTitle: "Preparing for Goethe exams?", examsText: "Try free German sample tests and practise exam questions.", examsAction: "Try a sample test",
    beginTitle: "Starting from zero?", beginText: "No experience needed. Sign up and begin learning.", beginAction: "Start learning",
  },
  de: {
    heading: "Wo möchtest du anfangen?", intro: "Wähle den passenden Einstieg.",
    placementTitle: "Du kannst schon etwas Deutsch oder Kiswahili?", placementText: "Du kennst dein Niveau nicht? Mach einen kostenlosen Einstufungstest.",
    choose: "Testsprache wählen", german: "Deutsch", swahili: "Kiswahili", placementAction: "Einstufungstest starten",
    examsTitle: "Du bereitest dich auf Goethe-Prüfungen vor?", examsText: "Übe mit kostenlosen deutschen Beispielprüfungen.", examsAction: "Beispieltest starten",
    beginTitle: "Du beginnst bei null?", beginText: "Keine Vorkenntnisse nötig. Melde dich an und lerne los.", beginAction: "Jetzt lernen",
  },
  fr: {
    heading: "Par où commencer ?", intro: "Choisissez le parcours adapté à votre niveau.",
    placementTitle: "Vous connaissez déjà l’allemand ou le swahili ?", placementText: "Votre niveau est incertain ? Faites un test de niveau gratuit.",
    choose: "Langue du test", german: "Allemand", swahili: "Kiswahili", placementAction: "Faire le test de niveau",
    examsTitle: "Vous préparez un examen Goethe ?", examsText: "Essayez des tests d’entraînement gratuits en allemand.", examsAction: "Essayer un test",
    beginTitle: "Vous débutez ?", beginText: "Aucune expérience requise. Inscrivez-vous pour commencer.", beginAction: "Commencer à apprendre",
  },
};

export default function HomepageStartPaths({ language = "en", onSignUp }) {
  const [testLanguage, setTestLanguage] = useState("german");
  const copy = CONTENT[language] || CONTENT.en;
  const placementUrl = testLanguage === "swahili" ? "/placement-test?language=swahili" : "/placement-test";
  const signUp = event => {
    if (!onSignUp || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onSignUp();
  };
  return (
    <section className="falowen-start-paths" aria-labelledby="falowen-start-paths-heading">
      <div className="falowen-start-paths-heading">
        <h2 id="falowen-start-paths-heading">{copy.heading}</h2>
        <p>{copy.intro}</p>
      </div>
      <div className="falowen-start-paths-grid">
        <article className="falowen-start-path-card">
          <span className="falowen-start-path-icon" aria-hidden="true">☷</span>
          <h3>{copy.placementTitle}</h3><p>{copy.placementText}</p>
          <label className="falowen-start-path-language">{copy.choose}
            <select value={testLanguage} onChange={event => setTestLanguage(event.target.value)} aria-label={copy.choose}>
              <option value="german">{copy.german}</option><option value="swahili">{copy.swahili}</option>
            </select>
          </label>
          <a href={placementUrl} className="falowen-start-path-action">{copy.placementAction} <span aria-hidden="true">→</span></a>
        </article>
        <article className="falowen-start-path-card">
          <span className="falowen-start-path-icon" aria-hidden="true">▤</span>
          <h3>{copy.examsTitle}</h3><p>{copy.examsText}</p>
          <a href="/exam-practice" className="falowen-start-path-action">{copy.examsAction} <span aria-hidden="true">→</span></a>
        </article>
        <article className="falowen-start-path-card">
          <span className="falowen-start-path-icon" aria-hidden="true">✦</span>
          <h3>{copy.beginTitle}</h3><p>{copy.beginText}</p>
          <a href="/signup" onClick={signUp} className="falowen-start-path-action">{copy.beginAction} <span aria-hidden="true">→</span></a>
        </article>
      </div>
    </section>
  );
}
