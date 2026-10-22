import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1ProtectedAudioPlayer from "./A1ProtectedAudioPlayer";

import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const questionBlock = {
  display: "grid",
  gap: 6,
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
};

const optionLine = {
  margin: 0,
  paddingLeft: 12,
  lineHeight: 1.7,
};

const lesenNotices = [
  {
    title: "Schild 1: Arztpraxis Dr. Weber",
    details: [
      { label: "Sprechzeiten", value: "Montag – Donnerstag: 08:00–12:00 Uhr" },
      { value: "Freitag: 08:00–11:30 Uhr" },
      { value: "Nachmittags geschlossen." },
    ],
    statement: "Sie können am Freitag um 14:00 Uhr zum Arzt gehen.",
  },
  {
    title: "Schild 2: Bäckerei Schmidt",
    details: [
      { label: "Öffnungszeiten", value: "Dienstag bis Sonntag: 06:30–18:00 Uhr" },
      { value: "Montag Ruhetag!" },
    ],
    statement: "Am Montag ist die Bäckerei geschlossen.",
  },
  {
    title: "Schild 3: Stadtmuseum",
    details: [
      { label: "Eintritt", value: "Täglich ab 10:00 Uhr." },
      { value: "Letzter Einlass: 17:30 Uhr." },
      { value: "Schließung: 18:00 Uhr." },
    ],
    statement: "Sie können das Museum um 11:00 Uhr besuchen.",
  },
  {
    title: "Schild 4: Supermarkt Express",
    details: [
      { label: "Öffnungszeiten", value: "Werktags (Montag bis Samstag): 07:00–20:00 Uhr" },
      { value: "Sonn- und Feiertage: geschlossen" },
    ],
    statement: "Am Samstag um 19:00 Uhr kann man hier einkaufen.",
  },
  {
    title: "Text 5: Busfahrplan Linie 10",
    details: [
      { label: "Abfahrt am Hauptbahnhof", value: "Montag – Freitag: alle 15 Minuten (ab 06:00 Uhr)" },
      { value: "Samstag & Sonntag: erst ab 08:00 Uhr (alle 30 Minuten)" },
    ],
    statement: "Der Bus fährt am Sonntag schon um 06:30 Uhr.",
  },
];

const teil2Questions = [
  { stem: "1. Wann fängt der Deutschkurs an?", options: ["a) Um 14:00 Uhr", "b) Um 16:00 Uhr", "c) Um 18:00 Uhr"] },
  { stem: "2. Um wie viel Uhr steht Anna morgens auf?", options: ["a) Um 6:00 Uhr", "b) Um 6:30 Uhr", "c) Um 7:00 Uhr"] },
  { stem: "3. Was macht Tom abends um 8 Uhr (20:00 Uhr)?", options: ["a) Er kauft im Supermarkt ein.", "b) Er geht zum Deutschkurs.", "c) Er sieht fern."] },
  { stem: "4. Wann schließt der Supermarkt nach dem Kurs?", options: ["a) Um 16:00 Uhr", "b) Um 18:00 Uhr", "c) Um 20:00 Uhr"] },
  { stem: "5. Wer holt wen nach dem Einkauf ab?", options: ["a) Tom holt Anna ab.", "b) Anna holt Tom ab.", "c) Niemand, sie nehmen den Bus."] },
];

// Day 11 uses the authenticated Cloudflare R2 player, not the withdrawn video.
// The uploaded object name must exactly match this key.
const hoerenAudioKey = "a1/day-11/day-11.mp3";

const A1Day11UnderstandingTimeWorkbookPage = () => {
  return (
    <A1TutorMarkedWorkbookShell
      day={11}
      chapter="7"
      fallbackAssignmentKey="A1-7"
      title="A1 · Day 11 Workbook · Understanding Time"
      subtitle="Chapter 7 · Tutor-marked assignment"
      submitTitle="Submit A1 · Day 11 · Chapter 7"
      submitDescription="Submit your completed Chapter 7 answers here when both Teile are finished."
    >
      <section style={card}>
        <h2 style={sectionTitle}>Teil 1 · Lesen: Schilder und Öffnungszeiten</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Lesen Sie die Schilder und Aushänge und die Aussagen 1–5. Ist die Aussage <strong>richtig</strong> oder <strong>falsch</strong>?
          Wählen Sie die Antworten im Antwortbereich unter den Texten.
        </p>
        {lesenNotices.map((notice, index) => (
          <article key={notice.title} style={questionBlock}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>{notice.title}</h3>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#f8fafc", display: "grid", gap: 4 }}>
              {notice.details.map((detail, rowIndex) => (
                <p key={rowIndex} style={{ margin: 0, lineHeight: 1.6 }}>
                  {detail.label ? <strong>{detail.label}: </strong> : null}
                  {detail.value}
                </p>
              ))}
            </div>
            <p style={{ margin: 0, lineHeight: 1.7 }}><strong>{index + 1}.</strong> {notice.statement}</p>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Richtig oder Falsch?</p>
          </article>
        ))}
      </section>

      <div style={card}>
        <h2 style={sectionTitle}>Teil 2 · Hören: Tagesablauf &amp; Uhrzeiten</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Hören Sie das Gespräch über den Deutschkurs, Annas Tagesablauf, den Supermarkt und Tom.
          Beantworten Sie die fünf Fragen. Wählen Sie jeweils a, b oder c.
        </p>
        <A1ProtectedAudioPlayer day={11} audioKey={hoerenAudioKey} />

        {teil2Questions.map((question) => (
          <div key={question.stem} style={questionBlock}>
            <p style={{ margin: 0 }}><strong>{question.stem}</strong></p>
            {question.options.map((option) => (
              <p key={option} style={optionLine}>{option}</p>
            ))}
          </div>
        ))}

      </div>

    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day11UnderstandingTimeWorkbookPage;
