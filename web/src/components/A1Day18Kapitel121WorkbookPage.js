import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1ProtectedAudioPlayer from "./A1ProtectedAudioPlayer";
import { A1ReadingSourceCard, A1ReadingSourceGrid } from "./A1TutorMarkedReadingLayout";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 18;
const CHAPTER = "12.1";
const FALLBACK_ASSIGNMENT_KEY = "A1-12.1";

const card = { ...styles.card, display: "grid", gap: 12 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const readingSigns = [
  {
    title: "Schild 1: Am Bahnhof (Bahn & Reisen)",
    text: <>Hinweis für Fahrgäste: Der Zug nach Berlin fährt heute nicht von Gleis 1, sondern von Gleis 4. Fahrgäste <strong>mit</strong> Fahrkarte gehen bitte direkt <strong>zum</strong> Gleis 4. Fahrkarten kaufen Sie <strong>am</strong> Automaten <strong>im</strong> Bahnhofsgebäude.</>,
    questions: [
      [1, "Fahrgäste mit Fahrkarte müssen zum Gleis 4 gehen."],
      [2, "Man kann die Fahrkarten direkt auf dem Gleis 4 kaufen."],
    ],
  },
  {
    title: "Schild 2: Firmenparkplatz (Auto & Parken)",
    text: <>Achtung Mitarbeiter der Firma Müller! Das Parken <strong>auf dem</strong> Firmenparkplatz ist nur <strong>mit</strong> Parkausweis erlaubt. Besucher parken bitte <strong>vor dem</strong> Hauptgebäude oder <strong>bei der</strong> Tankstelle. Parkausweise bekommen Sie <strong>bei</strong> Frau Meyer <strong>an der</strong> Rezeption.</>,
    questions: [
      [3, "Mitarbeiter dürfen ohne Parkausweis auf dem Firmenparkplatz parken."],
      [4, "Parkausweise bekommt man bei Frau Meyer."],
    ],
  },
  {
    title: "Schild 3: Im Bürogebäude (Beruf & Arbeit)",
    text: <>Information für das Team: Herr Weber ist heute nicht <strong>im</strong> Büro. Er ist <strong>mit dem</strong> Auto <strong>zu</strong> einem Kunden gefahren. <strong>Bei</strong> Fragen wenden Sie sich bitte <strong>an</strong> Frau Franke <strong>im</strong> Raum 102.</>,
    questions: [[5, "Herr Weber ist heute im Büro."]],
  },
];

// A1-12.1 · Bahnhof two-speaker dialogue (script-aligned version 3).
// These statements match the text drafted for the owner-created listening exercise.
// Confirm the uploaded recording against the same transcript before publishing grading.
export const A1_12_1_LISTENING_AUDIO_KEY = "a1/day-18/day-18.mp3";
export const A1_12_1_LISTENING_QUESTIONS_V3 = Object.freeze([
  "Die Frau fährt mit ihrer Schwester nach Berlin.",
  "Die Frau kauft ihre Fahrkarten am Automaten.",
  "Die Frau geht zuerst in die Bahnhofshalle, um zum Gleis vier zu kommen.",
  "Die Sitzplätze der Frau und ihrer Schwester sind im dritten Wagen.",
  "Der Mitarbeiter sagt, dass der Koffer unter den Sitz gestellt werden soll.",
]);

const A1Day18Kapitel121WorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    fallbackAssignmentKey="A1-12.1"
    title="A1 · Day 18 Workbook · Kapitel 12.1"
    subtitle="Two Case Prepositions · Tutor-marked assignment"
    assignmentIntro="Complete Lesen and Hören. Record your answers in the draft controls, then open Review & Submit to send the complete assignment."
    submitTitle="Review & Submit A1 · Day 18 · Kapitel 12.1"
    submitDescription="Review the mapped Lesen and Hören answers for A1-12.1, make any final edits, then press Submit Assignment."
  >
    <section style={card}>
      <h2 style={{ margin: 0 }}>Teil 1 · Lesen: Bahn, Auto &amp; Beruf</h2>
      <p><strong>Aufgabe:</strong> Lesen Sie die Schilder/Aushänge 1–3 und die Aussagen 1–5. Ist die Aussage <strong>Richtig</strong> oder <strong>Falsch</strong>?</p>
      <A1ReadingSourceGrid>
        {readingSigns.map((sign, index) => (
          <A1ReadingSourceCard key={sign.title} label={`Schild ${index + 1}`} title={sign.title}>
            <p style={{ margin: 0, lineHeight: 1.75 }}>{sign.text}</p>
            {sign.questions.map(([number, statement]) => <article key={number} style={questionCard}>
              <strong>{number}. {statement}</strong>
              <span>Richtig / Falsch</span>
            </article>)}
          </A1ReadingSourceCard>
        ))}
      </A1ReadingSourceGrid>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Eine Fahrkarte am Bahnhof kaufen.</strong> Hören Sie den Dialog zwischen einer Kundin und einem Bahnhofsmitarbeiter.
        Sind die Aussagen 1–5 richtig oder falsch? Achten Sie besonders auf <strong>mit, bei, zu</strong> und <strong>in, auf, unter</strong>.
      </p>
      <A1ProtectedAudioPlayer day={18} audioKey={A1_12_1_LISTENING_AUDIO_KEY} />
      {A1_12_1_LISTENING_QUESTIONS_V3.map((question, index) => (
        <article key={question} style={questionCard}>
          <strong>{index + 1}. {question}</strong>
          <span>Richtig</span>
          <span>Falsch</span>
        </article>
      ))}
    </section>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day18Kapitel121WorkbookPage;
