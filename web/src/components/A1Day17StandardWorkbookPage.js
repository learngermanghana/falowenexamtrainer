import React, { useState } from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1ProtectedAudioPlayer from "./A1ProtectedAudioPlayer";
import { styles } from "../styles";
import A1TutorSpeakingCheckpoint from "./A1TutorSpeakingCheckpoint";

const DAY17_AUDIO_KEY = "a1/day-17/day-17.mp3";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  padding: 14,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  maxHeight: 260,
  objectFit: "cover",
};

const textStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#f8fafc",
  display: "grid",
  gap: 8,
  lineHeight: 1.65,
};

const questionStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 11,
  background: "#fff",
  display: "grid",
  gap: 5,
};

const lesenQuestions = [
  { stem: "1. Wo startet der Weg?", options: ["a) An den Landungsbrücken", "b) An der Touristeninformation", "c) Im Stadtpark"] },
  { stem: "2. Wohin geht Thomas an der ersten Kreuzung?", options: ["a) Nach links", "b) Nach rechts", "c) Geradeaus"] },
  { stem: "3. Was sieht Thomas nach 5 Minuten?", options: ["a) Das Hafenmuseum", "b) Die Elbphilharmonie", "c) Den Hafen und das Restaurant Seeblick"] },
  { stem: "4. Wie lange dauert der Weg zu Fuß zu den Landungsbrücken?", options: ["a) 5 Minuten", "b) 10 Minuten", "c) Eine Stunde"] },
  { stem: "5. Wo ist der Weg markiert?", options: ["a) Auf dem Stadtplan", "b) Auf der Fahrkarte", "c) Im Museum"] },
];

const hoerenQuestions = [
  { stem: "1. Anna sucht den Bahnhof.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "2. An der Ampel geht man nach rechts.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "3. Der Weg dauert nur fünf Minuten.", options: ["a) Richtig", "b) Falsch"] },
  { stem: "4. Welche Straße nimmt Anna am Ende?", options: ["a) Die erste Straße links.", "b) Die zweite Straße rechts.", "c) Die zweite Straße links."] },
  { stem: "5. Wo ist der Bahnhof?", options: ["a) Neben der Post, gegenüber vom Supermarkt.", "b) Neben der Ampel, gegenüber von der Post.", "c) Neben dem Supermarkt, gegenüber vom Bahnhof."] },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 9 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionStyle}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

export default function A1Day17StandardWorkbookPage() {
  const [showScript, setShowScript] = useState(false);


  return (
    <A1TutorMarkedWorkbookShell
      day={17}
      chapter="11"
      fallbackAssignmentKey="A1-11"
      title="A1 · Day 17 Workbook · Instructions and Directions"
      subtitle="Chapter 11 · Tutor-marked assignment"
      assignmentIntro="Complete Sprechen Teil 1 and the five Hören questions in Teil 2, then open Review & Submit."
      submitTitle="Submit A1 · Day 17 · Chapter 11"
    >
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 1 · Sprechen: Bitten und Reagieren</h2>
        <A1TutorSpeakingCheckpoint assignmentKey="A1-11" sectionKey="teil-1" />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Hören: Wegbeschreibung zum Bahnhof</h2>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Aufgaben 1–3: Richtig oder falsch? Aufgaben 4–5: Wähle die richtige Antwort.
        </p>

        <div style={{ ...questionStyle, background: "#f8fafc" }}>
          <A1ProtectedAudioPlayer day={17} audioKey={DAY17_AUDIO_KEY} />
        </div>

        <button
          type="button"
          onClick={() => setShowScript((current) => !current)}
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          aria-expanded={showScript}
        >
          {showScript ? "Script ausblenden" : "Script optional anzeigen"}
        </button>

        {showScript ? (
          <div style={textStyle}>
            <p style={{ margin: 0 }}><strong>Anna:</strong> Entschuldigung, wie komme ich zum Bahnhof?</p>
            <p style={{ margin: 0 }}><strong>Tom:</strong> Guten Tag! Gehen Sie hier geradeaus bis zur Ampel.</p>
            <p style={{ margin: 0 }}><strong>Anna:</strong> Und dann?</p>
            <p style={{ margin: 0 }}><strong>Tom:</strong> An der Ampel biegen Sie links ab. Dann gehen Sie die Hauptstraße entlang.</p>
            <p style={{ margin: 0 }}><strong>Anna:</strong> Ist es weit?</p>
            <p style={{ margin: 0 }}><strong>Tom:</strong> Nein, nur fünf Minuten. Nehmen Sie die zweite Straße rechts. Der Bahnhof ist neben der Post, gegenüber vom Supermarkt.</p>
            <p style={{ margin: 0 }}><strong>Anna:</strong> Also: geradeaus, an der Ampel links, dann die zweite Straße rechts. Richtig?</p>
            <p style={{ margin: 0 }}><strong>Tom:</strong> Ja, genau!</p>
            <p style={{ margin: 0 }}><strong>Anna:</strong> Vielen Dank! Tschüss!</p>
            <p style={{ margin: 0 }}><strong>Tom:</strong> Gern geschehen. Tschüss!</p>
          </div>
        ) : null}

        <QuestionList questions={hoerenQuestions} />

        <div style={{ ...questionStyle, background: "#f8fafc" }}>
          <strong>Zusatzaufgabe · nicht benotet</strong>
          <span>Ergänze: „An der Ampel ___ Sie links ___ (abbiegen).“</span>
          <span>Lösung: <strong>biegen … ab</strong></span>
        </div>
      </section>
    </A1TutorMarkedWorkbookShell>
  );
}
