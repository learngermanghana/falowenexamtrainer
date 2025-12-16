import React from "react";
import HomeActions from "./HomeActions";
import { styles } from "../styles";

const NAV_ROADMAP = [
  {
    key: "speaking",
    title: "Sprechen",
    description:
      "Exam-Mode Simulationen nach Niveau, inklusive Prüfer- oder Partnerdialogen mit Anschlussfragen.",
    highlights: [
      "Modi für A1/A2 (Vorstellen, Fragen, Bitten) und B1/B2 (Kurzvortrag, Diskussion).",
      "Transkript → Feedback mit Fokus auf Aufgabenbewältigung, Grammatik, Wortschatz, Flüssigkeit und Aussprache.",
      "Follow-up-Fragen für Interaktion plus Redemittel-Einblendungen passend zum Level.",
      "Auto-Wiederholung typischer Fehler über die Funktion 'From my mistakes'.",
    ],
  },
  {
    key: "writing",
    title: "Schreiben",
    description:
      "Zeitgesteuerte Schreibaufgaben mit Strukturhilfen und Fehlerkorrektur, optimiert für A1–B2.",
    highlights: [
      "Aufgabentypen nach Level: A1/A2 Kurzmitteilungen, B1 E-Mails/Meinung, B2 strukturierte Argumente.",
      "Checklisten pro Niveau (Aufbau, Floskeln, Konnektoren) und Wortzahl-Zähler.",
      "Korrektur mit verbesserter Version plus 'Top 5 Fehler' und Wiederhol-Übungen (Rewrite mit gleicher Bedeutung).",
    ],
  },
  {
    key: "vocab",
    title: "Vokabeln",
    description:
      "Spaced-Repetition-Decks mit Redemitteln und Kollokationen statt einzelner Wörter.",
    highlights: [
      "Themen- und Niveaudecks (A1–B2) inklusive Redemittel für typische Sprech-/Schreibaufgaben.",
      "Automatisches Hinzufügen aus Sprech-Transkripten und Schreibkorrekturen.",
      "'From my mistakes'-Deck für wiederkehrende Fehler als Top-Feature.",
    ],
  },
  {
    key: "ueben",
    title: "Üben",
    description:
      "Schnelle Drills mit geringem Copyright-Risiko – perfekt für tägliche Mikro-Einheiten.",
    highlights: [
      "KI-generierte Grammatikübungen A1–B2.",
      "Mini-Sprechimpulse (30–60 Sekunden) und Satzumformungen/Konnektor-Training für B1/B2.",
      "Flexibles 'Skill Lab' für Lesen/Hören auf Basis eigener Texte/Audio-Links.",
    ],
  },
  {
    key: "progress",
    title: "Fortschritt",
    description:
      "Transparente Auswertung, damit Lernende dranbleiben und Lehrkräfte einsteigen können.",
    highlights: [
      "Skill-Breakdown nach Sprechen/Schreiben/Vokabular.",
      "Schwachstellen-Heatmap (Fälle, Verbposition, Konnektoren, Aussprache) und Streak-Anzeige.",
      "Action-Liste mit den nächsten 3 Dingen, die zu verbessern sind, plus Export/Sharing für Lehrkräfte.",
    ],
  },
  {
    key: "resources",
    title: "Ressourcen",
    description:
      "Strategien und Links ohne Copyright-Risiko, inkl. Lesen/Hören als optionale Tools.",
    highlights: [
      "Offizielle Übungssätze verlinken (Goethe, telc, ÖSD) statt kopieren.",
      "Eigene Checklisten und Strategien (z. B. 'Teil 2 meistern', 'Konnektoren B1/B2').",
      "User-Content-Modus: eigene Texte/Audio-Links einfügen → Verständnisfragen & Feedback generieren.",
    ],
  },
];

const COPYRIGHT_RULES = [
  "Nur eigene Prompts, Beispiele und Checklisten generieren.",
  "User können eigene Texte/Audio mitbringen; die App generiert Fragen und prüft Verständnis.",
  "Statt offizieller Aufgaben zu kopieren werden Übungssätze verlinkt.",
];

const COURSE_SECTIONS = [
  {
    title: "Kurse & Materialien",
    description: "Greife auf Kursunterlagen, Worksheets und Mini-Module zu, um dich vor den Prüfungen aufzubauen.",
    highlights: [
      "Lektionen mit PDF/Video-Links und begleitenden Redemittel-Listen.",
      "Wöchentliche Übungsblätter für Grammatik, Schreiben und Aussprache.",
      "Checklisten nach Niveau (A1–B2) für Hausaufgaben und Selbstkontrolle.",
    ],
    actionLabel: "Zu den Kursmaterialien",
    actionKey: "resources",
  },
];

const EXAM_SECTIONS = [
  {
    title: "Prüfungsvorbereitung",
    description: "Simulationen, Fragebanken und Zeitlimits trainieren die echte Prüfungssituation.",
    highlights: [
      "Exam-Mode mit allen Frage-Typen (Sprechen, Schreiben, Vokabeln).",
      "Aufgaben nach Level sortiert; inklusive Follow-up-Fragen und Musterlösungen.",
      "Teilnehmer:innen sehen nur nach dem Login die vollständigen Fragen und Prompts.",
    ],
    actionLabel: "Exam-Session öffnen",
    actionKey: "exam",
  },
];

const PlanPage = ({ onSelect }) => {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <HomeActions onSelect={onSelect} />

      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={styles.sectionTitle}>Kurse &amp; Prüfungen</h2>
          <span style={styles.badge}>Login nötig für alle Fragen</span>
        </div>
        <p style={styles.helperText}>
          Teile die Seite klar in Kursmaterialien und Prüfungsübungen: Lernende holen sich erst die Unterlagen,
          danach laufen sie durch die Exam-Simulationen. Die vollständigen Fragen und Downloads erscheinen nur
          nach dem Login.
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Courses</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>
              Kurs-Pfade mit Materialien, damit alle Inhalte vor den Prüfungen griffbereit sind.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {COURSE_SECTIONS.map((section) => (
                <div key={section.title} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
                  <h4 style={{ margin: "0 0 4px 0" }}>{section.title}</h4>
                  <p style={{ ...styles.helperText, marginBottom: 6 }}>{section.description}</p>
                  <ul style={styles.checklist}>
                    {section.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.secondaryButton} onClick={() => onSelect(COURSE_SECTIONS[0].actionKey)}>
                {COURSE_SECTIONS[0].actionLabel}
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Exams</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>
              Übungssimulationen inklusive Fragekatalogen – sichtbar nach Login, damit die Prüfungsfragen geschützt bleiben.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {EXAM_SECTIONS.map((section) => (
                <div key={section.title} style={{ border: "1px solid #fbbf24", borderRadius: 10, padding: 10, background: "#fffbeb" }}>
                  <h4 style={{ margin: "0 0 4px 0" }}>{section.title}</h4>
                  <p style={{ ...styles.helperText, marginBottom: 6 }}>{section.description}</p>
                  <ul style={styles.checklist}>
                    {section.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.primaryButton} onClick={() => onSelect(EXAM_SECTIONS[0].actionKey)}>
                {EXAM_SECTIONS[0].actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={styles.sectionTitle}>A1–B2 Hauptnavigation</h2>
          <span style={styles.badge}>Fokus: Feedback + Interaktion</span>
        </div>
        <p style={styles.helperText}>
          Die Tabs priorisieren die Bereiche, die Nutzer:innen anderswo kaum bekommen: realistische
          Prüfungssimulationen, präzises Feedback und Wiederholung eigener Fehler.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {NAV_ROADMAP.map((item) => (
            <div key={item.key} style={{ ...styles.card, marginBottom: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0" }}>{item.title}</h3>
                  <p style={{ ...styles.helperText, margin: 0 }}>{item.description}</p>
                </div>
                <button
                  style={styles.secondaryButton}
                  onClick={() => onSelect(item.key)}
                  aria-label={`${item.title} öffnen`}
                >
                  Zum Tab
                </button>
              </div>
              <ul style={styles.checklist}>
                {item.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ margin: "0 0 6px 0" }}>Lesen &amp; Hören ohne Risiko</h3>
        <p style={styles.helperText}>
          Statt eigene Passagen/Audio zu hosten, lebt der Skill im Ressourcen-Tab als "Skill Lab":
          Strategie-Drills, Nutzer-Uploads und kuratierte Links (z. B. Deutsche Welle, Goethe).
        </p>
        <ul style={styles.checklist}>
          <li>Strategie-Drills: Skimming, Scanning, Keyword-Spotting, Notizen.</li>
          <li>"Bring your own"-Modus: Text einfügen oder Audio-Link hochladen → Fragen und Checks.</li>
          <li>Kuratierte externe Quellen für zusätzliches Material.</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h3 style={{ margin: "0 0 6px 0" }}>Copyright-Regeln</h3>
        <p style={styles.helperText}>Pragmatische Daumenregel für alle neuen Inhalte:</p>
        <ul style={styles.checklist}>
          {COPYRIGHT_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanPage;
