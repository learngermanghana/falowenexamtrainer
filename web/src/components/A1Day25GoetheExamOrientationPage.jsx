import React from "react";
import AppPageShell from "./layout/AppPageShell";
import { styles } from "../styles";

export const A1_GOETHE_PRACTICE_URL = "https://bfu.goethe.de/a1_sd1/hoeren.php";

const cardStyle = {
  ...styles.card,
  borderRadius: 18,
  display: "grid",
  gap: 12,
};

const A1Day25GoetheExamOrientationPage = () => (
  <AppPageShell
    title="A1 · Day 25 · Goethe Exam Orientation"
    subtitle="Kein neuer Lernstoff und keine neue Abgabe. Heute wechselst du direkt vom Falowen Course Book zum offiziellen Goethe-A1-Modellsatz."
    backLabel="Back to A1 Course Book"
    backTo="/campus/course"
  >
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".06em" }}>
          Übergang zur Prüfung
        </span>
        <h2 style={{ margin: 0, color: "#0f172a" }}>Jetzt mit dem echten Goethe-Modellsatz üben</h2>
        <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>
          Du hast deine A1-Lernphase abgeschlossen. Für Day 25 gibt es keine Falowen-Abgabe.
          Öffne stattdessen den offiziellen Goethe-Zertifikat-A1-Modellsatz und arbeite unter Prüfungsbedingungen.
        </p>
      </section>

      <section style={{ ...cardStyle, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
        <h2 style={{ margin: 0, color: "#14532d" }}>Offizielle Goethe-A1-Prüfung öffnen</h2>
        <p style={{ margin: 0, color: "#365314", lineHeight: 1.7 }}>
          Der Link startet direkt bei <strong>Hören</strong>. Auf der Goethe-Seite kannst du anschließend auch
          zu Lesen, Schreiben und Sprechen wechseln.
        </p>
        <div style={{ borderRadius: 14, padding: 12, background: "#ffffff", border: "1px solid #dcfce7", color: "#334155", lineHeight: 1.6 }}>
          <strong>Hören:</strong> reguläre Prüfungszeit ca. 20 Minuten. Nutze Kopfhörer, lies die Aufgaben zuerst
          und kontrolliere die Lösungen erst nach deinem Versuch.
        </div>
        <a
          href={A1_GOETHE_PRACTICE_URL}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
        >
          Offizielle Goethe-A1-Prüfung öffnen
        </a>
        <small style={{ color: "#4d7c0f" }}>Quelle: Goethe-Institut · Goethe-Zertifikat A1 Start Deutsch 1 Modellsatz</small>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0, color: "#0f172a" }}>So arbeitest du heute</h2>
        <ol style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.8 }}>
          <li>Öffne den offiziellen Test und starte mit Hören.</li>
          <li>Bearbeite die Aufgaben ohne Wörterbuch oder Handy-Hilfe.</li>
          <li>Wechsle danach auf der Goethe-Seite zu Lesen, Schreiben und Sprechen.</li>
          <li>Notiere nur die Bereiche, die du vor der echten Prüfung noch wiederholen musst.</li>
        </ol>
      </section>
    </div>
  </AppPageShell>
);

export default A1Day25GoetheExamOrientationPage;
