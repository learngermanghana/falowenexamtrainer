import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { getA1RadioResource } from "../data/a1RadioResources";
import { styles } from "../styles";

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

const dialogueStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#f8fafc",
  display: "grid",
  gap: 5,
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

const teil1Questions = [
  {
    stem: "1. Was sagt die Person, um nach dem Bahnhof zu fragen?",
    options: [
      "a) Entschuldigung, wie komme ich zum Supermarkt?",
      "b) Entschuldigung, wo ist der Bahnhof?",
      "c) Entschuldigung, wie komme ich zur Apotheke?",
    ],
  },
  {
    stem: "2. Was muss die Person an der Ampel machen?",
    options: ["a) Rechts abbiegen", "b) Links abbiegen", "c) Die Straße überqueren"],
  },
  {
    stem: "3. Wo befindet sich der Bahnhof?",
    options: [
      "a) Auf der linken Seite",
      "b) Auf der rechten Seite, direkt neben dem großen Supermarkt",
      "c) Geradeaus",
    ],
  },
  {
    stem: "4. Wie fragt man nach dem Weg zur Apotheke?",
    options: [
      "a) Wo ist der Bahnhof?",
      "b) Wie komme ich zur nächsten Apotheke?",
      "c) Wo finde ich die nächste Straße?",
    ],
  },
  {
    stem: "5. Wie verabschieden sich die Personen in beiden Dialogen?",
    options: ["a) Auf Wiedersehen", "b) Tschüss", "c) Gute Reise und einen schönen Tag noch"],
  },
];

const teil2Questions = [
  {
    stem: "1. Was fragt Person A zuerst?",
    options: [
      "a) Wie komme ich zum Supermarkt?",
      "b) Wo ist der Bahnhof?",
      "c) Wie komme ich zur nächsten Apotheke?",
    ],
  },
  {
    stem: "2. Was soll Person A zuerst an der Kreuzung machen?",
    options: ["a) Geradeaus gehen", "b) Links abbiegen", "c) Rechts abbiegen"],
  },
  {
    stem: "3. Wo befindet sich die Apotheke?",
    options: [
      "a) Auf der rechten Seite, gegenüber der Bäckerei",
      "b) Auf der linken Seite, direkt neben der Bäckerei",
      "c) Geradeaus",
    ],
  },
  {
    stem: '4. Welche Antwort passt zu der Frage „Wie komme ich zum Bahnhof?“',
    options: [
      "a) Gehen Sie geradeaus bis zur Kreuzung, dann links.",
      "b) Die Apotheke ist auf der linken Seite.",
      "c) Überqueren Sie die Straße.",
    ],
  },
  {
    stem: "5. Wie verabschiedet sich Person B?",
    options: ["a) Auf Wiedersehen", "b) Tschüss", "c) Einen schönen Tag noch"],
  },
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
  const radio = getA1RadioResource(17, "11");

  return (
    <RadioFirstWorkbookGate level="A1" day={17} resource={radio}>
      <A1TutorMarkedWorkbookShell
        day={17}
        chapter="11"
        fallbackAssignmentKey="A1-11"
        title="A1 · Day 17 Workbook · Instructions and Directions"
        subtitle="Chapter 11 · Tutor-marked assignment"
        assignmentIntro="Complete Teil 1–3, then open Submit to send your final answers for A1-11."
        submitTitle="Submit A1 · Day 17 · Chapter 11"
      >
        <section style={sectionStyle}>
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
            alt="Street signs and roads in a city center for practising directions"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={{ margin: 0 }}>Teil 1 · Lesen Essay: Wegbeschreibungen</h2>
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            <strong>Instruction:</strong> Read the dialogue and choose the correct answer for each question.
          </p>
          <div style={dialogueStyle}>
            <strong>Wo ist der Bahnhof?</strong>
            <span>Person: Entschuldigung, wo ist der Bahnhof?</span>
            <span>Sie: Gehen Sie geradeaus bis zur Ampel.</span>
            <span>Person: Danke, und dann?</span>
            <span>Sie: Biegen Sie links ab und gehen Sie weiter geradeaus.</span>
            <span>Person: Okay, und wo ist der Bahnhof?</span>
            <span>Sie: Der Bahnhof ist auf der rechten Seite, direkt neben dem großen Supermarkt.</span>
            <span>Person: Das ist sehr hilfreich, vielen Dank!</span>
            <span>Sie: Gern geschehen. Gute Reise!</span>
          </div>
          <QuestionList questions={teil1Questions} />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 2 · Lesen Essay: Wegbeschreibungen</h2>
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            <strong>Instruction:</strong> Read the dialogue and choose the correct answer for each question.
          </p>
          <div style={dialogueStyle}>
            <strong>Wo ist die Apotheke?</strong>
            <span>Person A: Entschuldigung, wie komme ich zur nächsten Apotheke?</span>
            <span>Person B: Gehen Sie geradeaus bis zur Kreuzung.</span>
            <span>Person A: Danke, und dann?</span>
            <span>Person B: Biegen Sie rechts ab und gehen Sie weiter geradeaus.</span>
            <span>Person A: Okay, und wo ist die Apotheke?</span>
            <span>Person B: Die Apotheke ist auf der linken Seite, direkt neben der Bäckerei.</span>
            <span>Person A: Das ist sehr hilfreich, vielen Dank!</span>
            <span>Person B: Gern geschehen. Einen schönen Tag noch!</span>
          </div>
          <QuestionList questions={teil2Questions} />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Teil 3 · Schreiben Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            Write the following instructions in German. Use the polite imperative form with <strong>Sie</strong> where appropriate.
          </p>
          <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>
            <li>Ask: “How do I get to the train station?”</li>
            <li>Say: “Cross the street.”</li>
            <li>Say: “Go straight.”</li>
            <li>Say: “Turn left.”</li>
            <li>Say: “Turn right.”</li>
          </ol>
        </section>
      </A1TutorMarkedWorkbookShell>
    </RadioFirstWorkbookGate>
  );
}
