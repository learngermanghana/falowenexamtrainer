import React, { useEffect, useState } from "react";
import AppPageShell from "./layout/AppPageShell";
import { styles } from "../styles";

export const A2_GOETHE_PRACTICE_URL =
  "https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html";

const STORAGE_KEY = "falowen:a2:day29:goethe-exam-orientation";

const examSections = [
  {
    name: "Lesen",
    duration: "30 Min.",
    description:
      "Kurze Zeitungstexte, E-Mails, Anzeigen und öffentliche Hinweise lesen und passende Aufgaben lösen.",
  },
  {
    name: "Hören",
    duration: "30 Min.",
    description:
      "Alltagsgespräche, Ansagen, Telefon- oder Radiobeiträge hören und die wichtigsten Informationen erkennen.",
  },
  {
    name: "Schreiben",
    duration: "30 Min.",
    description:
      "Kurze Mitteilungen zu vertrauten Alltagssituationen schreiben und alle Inhaltspunkte bearbeiten.",
  },
  {
    name: "Sprechen",
    duration: "ca. 15 Min.",
    description:
      "Fragen stellen und beantworten, über das eigene Leben sprechen und gemeinsam etwas planen oder vereinbaren.",
  },
];

const checklistItems = [
  "Ich kenne die vier Prüfungsteile: Lesen, Hören, Schreiben und Sprechen.",
  "Ich kenne die Zeit für jeden Prüfungsteil.",
  "Ich habe den offiziellen Goethe-Modellsatz geöffnet.",
  "Ich weiß, wie ich meine Antworten mit den Lösungen kontrolliere.",
  "Ich weiß, welchen Prüfungsteil ich vor der echten Prüfung noch einmal üben möchte.",
];

const cardStyle = {
  ...styles.card,
  borderRadius: 18,
  display: "grid",
  gap: 12,
};

const A2Day29GoetheExamOrientationPage = () => {
  const [checked, setChecked] = useState(() => checklistItems.map(() => false));

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.length === checklistItems.length) {
        setChecked(saved.map(Boolean));
      }
    } catch {
      // Keep the orientation usable when storage is unavailable or malformed.
    }
  }, []);

  const updateChecked = (index, value) => {
    const next = checked.map((item, itemIndex) => (itemIndex === index ? value : item));
    setChecked(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The checklist is optional and should never block the page.
    }
  };

  const completed = checked.filter(Boolean).length;

  return (
    <AppPageShell
      title="A2 · Day 29 · Goethe Exam Orientation"
      subtitle="Kein neuer Lernstoff und keine neue Abgabe. Heute überträgst du das, was du in 28 Tagen gelernt hast, auf die echte Goethe-A2-Prüfung."
      backLabel="Back to A2 Course Book"
      backTo="/campus/course"
    >
      <div style={{ display: "grid", gap: 16 }}>
        <section style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
          <div style={{ display: "grid", gap: 7 }}>
            <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".06em" }}>
              Übergang zur Prüfung
            </span>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Du lernst heute keinen neuen Stoff.</h2>
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>
              Du hast Teil 1 im Unterricht sowie Schreiben, Lesen und Hören in deinen täglichen Aufgaben trainiert.
              Jetzt musst du vor allem verstehen, wie die offizielle Prüfung aufgebaut ist, und einmal mit dem
              echten Goethe-Material arbeiten.
            </p>
          </div>
          <div style={{ borderRadius: 14, padding: 12, background: "#ffffff", border: "1px solid #dbeafe", color: "#334155", lineHeight: 1.6 }}>
            <strong>Wichtig:</strong> Für Day 29 gibt es keine Falowen-Abgabe. Nutze die offizielle Prüfungsvorbereitung,
            um die Aufgabenformate kennenzulernen und deine Bereitschaft selbst zu überprüfen.
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "grid", gap: 5 }}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>So ist die Goethe-A2-Prüfung aufgebaut</h2>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.65 }}>
              Die Prüfung besteht aus vier Bereichen. Lies zuerst nur die Struktur; du musst heute nicht noch einmal
              einen langen Falowen-Test machen.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
            {examSections.map((section) => (
              <article
                key={section.name}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 13,
                  display: "grid",
                  gap: 7,
                  background: "#ffffff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <strong style={{ color: "#0f172a", fontSize: 17 }}>{section.name}</strong>
                  <span style={{ color: "#1d4ed8", fontWeight: 900, fontSize: 13 }}>{section.duration}</span>
                </div>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: 14 }}>{section.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
          <h2 style={{ margin: 0, color: "#14532d" }}>Öffne jetzt das offizielle Goethe-A2-Prüfungsmaterial</h2>
          <p style={{ margin: 0, color: "#365314", lineHeight: 1.7 }}>
            Auf der offiziellen Goethe-Seite findest du Online-Übungen, Modellsätze, Übungssätze, Hörmaterial und ein
            Beispiel für die Sprechprüfung. Arbeite mit diesem Material, weil es dir die echte Prüfungsstruktur zeigt.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={A2_GOETHE_PRACTICE_URL}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
            >
              Offizielle Goethe-A2-Übungen öffnen
            </a>
            <a
              href="/exams/question"
              style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
            >
              Falowen Exams Room öffnen
            </a>
          </div>
          <small style={{ color: "#4d7c0f" }}>Quelle: Goethe-Institut Ghana · Goethe-Zertifikat A2 Übungsmaterialien</small>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Wie du den offiziellen Modellsatz benutzen solltest</h2>
          <ol style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.8 }}>
            <li>Öffne zuerst den Modellsatz und sieh dir die Aufgabenformen in allen vier Prüfungsteilen an.</li>
            <li>Wenn du eine echte Simulation möchtest, stelle dir für Lesen, Hören und Schreiben jeweils die offizielle Zeit.</li>
            <li>Beim Hören: Lies die Aufgabe zuerst, dann höre das offizielle Audio und trage deine Antworten ein.</li>
            <li>Kontrolliere deine Antworten erst nach dem Versuch mit den offiziellen Lösungen.</li>
            <li>Notiere nur die Bereiche, bei denen du noch unsicher bist. Diese wiederholst du gezielt vor deiner Prüfung.</li>
          </ol>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Meine Prüfungsbereitschaft</h2>
            <strong style={{ color: completed === checklistItems.length ? "#047857" : "#1d4ed8" }}>
              {completed}/{checklistItems.length}
            </strong>
          </div>
          <div style={{ display: "grid", gap: 9 }}>
            {checklistItems.map((item, index) => (
              <label
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  background: checked[index] ? "#f0fdf4" : "#ffffff",
                  color: "#334155",
                  lineHeight: 1.5,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked[index]}
                  onChange={(event) => updateChecked(index, event.target.checked)}
                  style={{ marginTop: 3 }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          {completed === checklistItems.length ? (
            <div style={{ borderRadius: 12, padding: 12, background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", lineHeight: 1.6 }}>
              <strong>Day 29 abgeschlossen.</strong> Jetzt kennst du die Prüfungsstruktur. Nutze die verbleibende Zeit
              vor deiner Prüfung gezielt für die Bereiche, in denen du noch unsicher bist.
            </div>
          ) : null}
        </section>
      </div>
    </AppPageShell>
  );
};

export default A2Day29GoetheExamOrientationPage;
