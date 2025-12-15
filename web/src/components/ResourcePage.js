import React from "react";
import { styles } from "../styles";

const RESOURCE_SECTIONS = [
  {
    title: "Lesen & Hören als Skill Lab",
    points: [
      "Strategie-Only Drills (Skimming, Scanning, Keyword-Spotting, Notizen).",
      "User-Provided Content: Text einkopieren oder Audio-Link einfügen → Verständnisfragen & Feedback.",
      "Keine gehosteten Prüfungsaufgaben; stattdessen Links zu verlässlichen Quellen (DW, Goethe, telc/ÖSD Beispiele).",
    ],
  },
  {
    title: "Checklisten & Strategien",
    points: [
      "'Teil 2 meistern' – Schritt-für-Schritt-Checklisten für Sprechen/Schreiben.",
      "Konnektoren- und Redemittel-Layer pro Niveau (A1–B2).",
      "Aussprache-Kurzlisten: häufige Stolpersteine + Beispielaudio (eigene Assets).",
    ],
  },
  {
    title: "Offizielle Materialien verlinken",
    points: [
      "Direkte Links zu Übungssätzen von Goethe, telc, ÖSD und Deutsche Welle.",
      "Hinweis, dass Originalaufgaben nicht kopiert werden – Nutzer:innen üben direkt auf den offiziellen Seiten.",
      "Kurze Begleittexte: Worauf achten? Welche Teile sind relevant für A1/A2/B1/B2?",
    ],
  },
];

const ResourcePage = () => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={styles.sectionTitle}>Ressourcen</h2>
          <p style={styles.helperText}>
            Sichere Materialsammlung mit klaren Strategien und Links statt kopierter Prüfungsaufgaben.
          </p>
        </div>
        <span style={styles.badge}>Lesen/Hören inklusive</span>
      </div>
      <div style={styles.gridTwo}>
        {RESOURCE_SECTIONS.map((section) => (
          <div key={section.title} style={{ ...styles.card, marginBottom: 0 }}>
            <h3 style={{ margin: "0 0 6px 0" }}>{section.title}</h3>
            <ul style={styles.checklist}>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcePage;
