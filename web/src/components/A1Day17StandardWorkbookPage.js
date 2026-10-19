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

const lesenTexts = [
  {
    title: "Text 1 · E-Mail von Anna",
    paragraphs: [
      "Hallo Markus,",
      "meine Party ist am Samstag! Ich wohne in der Hauptstraße 12. Der Weg vom Bahnhof ist einfach: Geh zuerst geradeaus bis zur Ampel. An der Ampel biegst du rechts ab. Mein Haus ist auf der linken Seite, gegenüber von der Bäckerei.",
      "Bis Samstag! Anna",
    ],
    questions: [
      "1. An der Ampel muss Markus nach rechts abbiegen.",
      "2. Annas Haus steht direkt neben der Bäckerei.",
    ],
  },
  {
    title: "Text 2 · Zettel von Ben",
    paragraphs: [
      "Liebe Sarah,",
      "ich bin schon im Café Central. Du findest das Café ganz leicht: Geh vom Supermarkt nach links in die Goethestraße. Geh etwa 100 Meter geradeaus. Das Café liegt direkt neben der Post.",
      "Ruf mich an, wenn du da bist! Ben",
    ],
    questions: [
      "3. Sarah muss vom Supermarkt nach rechts gehen.",
      "4. Das Café Central ist neben der Post.",
    ],
  },
  {
    title: "Text 3 · SMS von Lisa",
    paragraphs: [
      "Hi Tom,",
      "wir treffen uns am Stadtpark. Nimm die Bus-Linie 5 und steig an der Haltestelle „Parkstraße“ aus. Der Park ist gleich hinter der Haltestelle. Du musst gar nicht weit laufen!",
      "Bis gleich, Lisa",
    ],
    questions: [
      "5. Tom muss von der Haltestelle sehr weit zum Park laufen.",
    ],
  },
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
      assignmentIntro="Complete Sprechen Teil 1, Hören Teil 2 and the five Richtig/Falsch questions in Lesen Teil 3, then open Review & Submit."
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

      </section>
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Lesen: Wegbeschreibung</h2>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Lesen Sie die drei kurzen Nachrichten und die Aussagen 1–5. Ist die Aussage Richtig oder Falsch?
        </p>
        {lesenTexts.map((text) => (
          <div key={text.title} style={{ display: "grid", gap: 10 }}>
            <h3 style={{ margin: 0 }}>{text.title}</h3>
            <div style={textStyle}>
              {text.paragraphs.map((paragraph) => <p key={paragraph} style={{ margin: 0 }}>{paragraph}</p>)}
            </div>
            <QuestionList questions={text.questions.map((stem) => ({ stem, options: ["Richtig", "Falsch"] }))} />
          </div>
        ))}
      </section>
    </A1TutorMarkedWorkbookShell>
  );
}
