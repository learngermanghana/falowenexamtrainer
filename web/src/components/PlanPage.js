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

const PlanPage = ({ onSelect }) => {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <HomeActions onSelect={onSelect} />

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
