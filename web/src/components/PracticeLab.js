import React from "react";
import { styles } from "../styles";

const PRACTICE_BLOCKS = [
  {
    title: "Mini Sprechen (30–60 Sekunden)",
    level: "A1–B2",
    bullets: [
      "Spontane Impulse zu Alltagsthemen (Hobbys, Reisen, Studium, Arbeit).",
      "Gezielte Follow-ups pro Niveau: A1/A2 einfache W-Fragen, B1/B2 Meinungs-/Begründungsfragen.",
      "Timer + Punkteliste, damit es wie eine echte Prüfung wirkt.",
    ],
  },
  {
    title: "Grammatik-Drills",
    level: "A1–B2",
    bullets: [
      "Kurzformat mit 6–8 Items: Kasus, Verbzweit, Perfekt/Präteritum, Trennbare Verben.",
      "Sofort-Feedback mit kurzen Erklärungen und Beispielsätzen.",
      "Fehler fließen automatisch in das 'From my mistakes'-Deck.",
    ],
  },
  {
    title: "Satzumbau & Konnektoren",
    level: "B1–B2",
    bullets: [
      "Umformungen (weil/denn/obwohl, Relativsätze, Konjunktiv II) und verbindende Phrasen.",
      "Vorher-Nachher-Anzeige, damit Lernende Muster erkennen.",
      "Mix aus schriftlichen und gesprochenen Antworten für Flexibilität.",
    ],
  },
  {
    title: "Skill Lab Lesen/Hören",
    level: "Alle Niveaus",
    bullets: [
      "Strategie-Only Drills: Skimming, Scanning, Keywords, Notizen.",
      "User-Content-Modus: Text einfügen oder Audio-Link hochladen → automatische Fragen/Checks.",
      "Verlinkte Ressourcen (DW, Goethe, ÖSD/telc Beispiele) statt eigene Passagen.",
    ],
  },
];

const PracticeLab = () => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={styles.sectionTitle}>Üben</h2>
          <p style={styles.helperText}>Schnelle Drills, die ohne viel Setup funktionieren.</p>
        </div>
        <span style={styles.badge}>Tägliche Mikro-Einheiten</span>
      </div>
      <div style={styles.vocabGrid}>
        {PRACTICE_BLOCKS.map((block) => (
          <div key={block.title} style={{ ...styles.vocabCard, background: "#fff", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h3 style={{ ...styles.vocabTitle, margin: 0 }}>{block.title}</h3>
              <span style={styles.levelPill}>{block.level}</span>
            </div>
            <ul style={styles.checklist}>
              {block.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeLab;
