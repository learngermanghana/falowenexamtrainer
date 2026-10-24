import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12, marginBottom: 0 };
const GRAMMAR_ROUTE = "/campus/course/a1-day-12-the-24-hour-clock-and-dates";
const t1 = [
  { title: "Text 1 · SMS von Sarah", content: <>Hallo David, unser Film im Kino beginnt heute um <strong>20:15 Uhr</strong>. Wir treffen uns um <strong>19:45 Uhr</strong> vor dem Kino. Bis später, Sarah</>,
    questions: ["1. Der Film fängt um viertel nach acht abends an.", "2. David und Sarah treffen sich um viertel vor acht."] },
  { title: "Text 2 · E-Mail von der Arztpraxis", content: <>Sehr geehrte Frau Rossi, Ihr Termin bei Dr. Weber ist am Donnerstag um <strong>15:30 Uhr</strong>. Bitte kommen Sie 10 Minuten früher (um <strong>15:20 Uhr</strong>). Mit freundlichen Grüßen, Ihr Praxisteam</>,
    questions: ["3. Der Arzttermin ist um halb drei nachmittags."] },
  { title: "Text 3 · Nachricht von Marco", content: <>Hi Alex, mein Zug kommt um <strong>18:45 Uhr</strong> am Hauptbahnhof an. Ich bin ab <strong>19:15 Uhr</strong> zu Hause. Du kannst ab viertel nach sieben zu mir kommen! Gruß, Marco</>,
    questions: ["4. Marcos Zug kommt um viertel vor sieben abends an.", "5. Alex kann um 19:15 Uhr zu Marco kommen."] },
];
const t2 = [
  { title: "Schild 1 · Bahnhofs-Aushang", content: <>Gleis 3 – Zug nach München. Abfahrt geplant: <strong>14:00 Uhr</strong>. Neuer Abfahrtszeitpunkt: <strong>14:30 Uhr</strong> (30 Minuten Verspätung).</>,
    question: "6. Wann fährt der Zug nach München ab?", options: ["a) Um zwei Uhr nachmittags.", "b) Um halb drei nachmittags.", "c) Um drei Uhr nachmittags."] },
  { title: "Schild 2 · Öffnungszeiten Bäckerei", content: <>Bäckerei Becker – Öffnungszeiten. Montag bis Freitag: 06:30 Uhr – 18:30 Uhr. Samstag: 07:00 Uhr – 13:00 Uhr. Sonntag: geschlossen.</>,
    question: "7. Wann schließt die Bäckerei am Mittwochabend?", options: ["a) Um halb sechs abends.", "b) Um sechs Uhr abends.", "c) Um halb sieben abends."] },
  { title: "Schild 3 · Restaurant Mamma Mia", content: <>Küchenzeiten: Mittagstisch <strong>11:30–14:30 Uhr</strong>. Abendkarte <strong>17:30–22:00 Uhr</strong>.</>,
    question: "8. Sie möchten um 15:00 Uhr etwas Warmes essen. Geht das?", options: ["a) Ja, das Restaurant hat durchgehend geöffnet.", "b) Nein, die Küche schließt um 14:30 Uhr.", "c) Ja, aber nur von der Abendkarte."] },
];
const Question = ({ text, options }) => <div style={{ padding: 12, border: "1px solid #dbeafe", borderRadius: 10, display: "grid", gap: 7 }}>
  <strong>{text}</strong>
  {(options || ["Richtig", "Falsch"]).map(option => <div key={option}>{option}</div>)}
</div>;
export default function A1Day12TwentyFourHourClockAndDatesWorkbookPage() {
  return <A1TutorMarkedWorkbookShell fallbackAssignmentKey="A1-8"
    title="A1 · Day 12 Workbook · The 24-Hour Clock and Dates" subtitle="Chapter 8 · Tutor-marked assignment"
    assignmentIntro="Read the three messages and three signs. Complete all eight reading questions in two Teile."
    submitTitle="Submit A1 · Day 12 · Chapter 8">
    <div data-a1-day12-workbook-content="true" style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <h2>Start here</h2>
        <p>This assignment has two Lesen parts. Complete questions 1–8 and save your answers under the matching Teil before submitting.</p>
        <a href={GRAMMAR_ROUTE} style={{ ...styles.secondaryButton, width: "fit-content" }}>Review the 24-hour clock and dates</a>
      </section>
      <section style={card}>
        <h2>Teil 1: E-Mails und SMS (Lesen Teil 1)</h2>
        <p>Lesen Sie die Texte 1–3 und die Aussagen 1–5. Ist die Aussage <strong>Richtig</strong> oder <strong>Falsch</strong>?</p>
        {t1.map(text => <article key={text.title} style={{ display: "grid", gap: 10 }}>
          <h3>{text.title}</h3><p style={{ lineHeight: 1.7 }}>{text.content}</p>
          {text.questions.map(q => <Question key={q} text={q} />)}
        </article>)}
      </section>
      <section style={card}>
        <h2>Teil 2: Schilder &amp; Fahrpläne (Lesen Teil 2 &amp; 3)</h2>
        <p>Lesen Sie die Schilder und die Fragen 6–8. Wählen Sie die richtige Antwort a, b oder c.</p>
        {t2.map(item => <article key={item.title} style={{ display: "grid", gap: 10 }}>
          <h3>{item.title}</h3><p style={{ lineHeight: 1.7 }}>{item.content}</p>
          <Question text={item.question} options={item.options} />
        </article>)}
      </section>
    </div>
  </A1TutorMarkedWorkbookShell>;
}
