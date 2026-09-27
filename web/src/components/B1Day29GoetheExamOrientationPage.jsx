import React from "react";
import AppPageShell from "./layout/AppPageShell";
import { styles } from "../styles";

export const B1_GOETHE_PRACTICE_URL = "https://bfu.goethe.de/b1_mod/lesen.php";

const cardStyle = {
  ...styles.card,
  borderRadius: 18,
  display: "grid",
  gap: 12,
};

const B1Day29GoetheExamOrientationPage = () => (
  <AppPageShell
    title="B1 · Day 29 · Goethe Exam Orientation"
    subtitle="Kein neuer Lernstoff und keine neue Abgabe. Heute wechselst du direkt vom Falowen Course Book zum offiziellen Goethe-B1-Modellsatz."
    backLabel="Back to B1 Course Book"
    backTo="/campus/course"
  >
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".06em" }}>
          Übergang zur Prüfung
        </span>
        <h2 style={{ margin: 0, color: "#0f172a" }}>Jetzt mit dem echten Goethe-B1-Modellsatz üben</h2>
        <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>
          Du hast die 28 B1-Lerntage abgeschlossen. Für Day 29 gibt es keine Falowen-Abgabe.
          Öffne stattdessen direkt das offizielle Goethe-B1-Prüfungsmaterial.
        </p>
      </section>

      <section style={{ ...cardStyle, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
        <h2 style={{ margin: 0, color: "#14532d" }}>Offizielle Goethe-B1-Prüfung öffnen</h2>
        <p style={{ margin: 0, color: "#365314", lineHeight: 1.7 }}>
          Der Link startet direkt bei <strong>Lesen</strong>. Auf der Goethe-Seite kannst du anschließend auch
          zu Hören, Schreiben und Sprechen wechseln.
        </p>
        <div style={{ borderRadius: 14, padding: 12, background: "#ffffff", border: "1px solid #dcfce7", color: "#334155", lineHeight: 1.6 }}>
          <strong>Lesen:</strong> reguläre Prüfungszeit 65 Minuten und fünf Teile. Bearbeite den Modellsatz möglichst
          ohne Hilfsmittel und kontrolliere deine Antworten erst danach.
        </div>
        <a
          href={B1_GOETHE_PRACTICE_URL}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
        >
          Offizielle Goethe-B1-Prüfung öffnen
        </a>
        <small style={{ color: "#4d7c0f" }}>Quelle: Goethe-Institut · Goethe-Zertifikat B1 Modellsatz</small>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0, color: "#0f172a" }}>So arbeitest du heute</h2>
        <ol style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.8 }}>
          <li>Öffne den offiziellen Test und starte mit Lesen.</li>
          <li>Arbeite möglichst unter der offiziellen Zeitvorgabe.</li>
          <li>Wechsle danach auf der Goethe-Seite zu Hören, Schreiben und Sprechen.</li>
          <li>Notiere deine schwächsten Bereiche für die letzte gezielte Wiederholung.</li>
        </ol>
      </section>
    </div>
  </AppPageShell>
);

export default B1Day29GoetheExamOrientationPage;
