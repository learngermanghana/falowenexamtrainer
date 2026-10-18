import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
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

const listeningTasks = [
  "Der Supermarkt hat täglich geöffnet.",
  "Die Theoriestunden in der Fahrschule sind dienstags und donnerstags.",
  "Das Büro ist am Wochenende geschlossen.",
  "Der Englischkurs findet dreimal pro Woche statt.",
  "Das Fitnessstudio ist von 6 Uhr bis 22 Uhr geöffnet.",
];

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
        Watch the video, then decide whether each statement is Richtig or Falsch.
      </p>
      <iframe
        title="Kapitel 12.1 Hören"
        src="https://www.youtube.com/embed/m07lKGJAoF8"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ width: "100%", minHeight: 315, border: 0, borderRadius: 10 }}
      />
      {listeningTasks.map((question, index) => (
        <article key={question} style={questionCard}>
          <strong>{index + 1}. {question}</strong>
          <span>a) Richtig</span>
          <span>b) Falsch</span>
        </article>
      ))}
    </section>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day18Kapitel121WorkbookPage;
