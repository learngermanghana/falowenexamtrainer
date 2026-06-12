import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  maxHeight: 320,
  objectFit: "cover",
};

const introBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#f9fafb",
  display: "grid",
  gap: 8,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 10,
};

const optionListStyle = {
  display: "grid",
  gap: 8,
  paddingLeft: 4,
};

const optionStyle = {
  display: "block",
  lineHeight: 1.7,
};

const writingItemStyle = {
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
  lineHeight: 1.7,
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
    options: [
      "a) Rechts abbiegen",
      "b) Links abbiegen",
      "c) Die Straße überqueren",
    ],
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
    options: [
      "a) Auf Wiedersehen",
      "b) Tschüss",
      "c) Gute Reise und einen schönen Tag noch",
    ],
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
    options: [
      "a) Geradeaus gehen",
      "b) Links abbiegen",
      "c) Rechts abbiegen",
    ],
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
    stem: '4. Welche Antwort passt zu der Frage "Wie komme ich zum Bahnhof?"',
    options: [
      "a) Gehen Sie geradeaus bis zur Kreuzung, dann links.",
      "b) Die Apotheke ist auf der linken Seite.",
      "c) Überqueren Sie die Straße.",
    ],
  },
  {
    stem: "5. Wie verabschiedet sich Person B?",
    options: [
      "a) Auf Wiedersehen",
      "b) Tschüss",
      "c) Einen schönen Tag noch",
    ],
  },
];

const A1Day17InstructionsDirectionsKapitel11WorkbookPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, margin: 0 }}>
          A1 · Day 17 Workbook · Instructions and Directions
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 11</p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete all workbook parts, then submit your final answers in the submission area only.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
          alt="Street signs and roads in a city center for practicing directions"
          loading="lazy"
          style={imageStyle}
        />

        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Teil 1 · Lesen Essay: Wegbeschreibungen</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Instruction:</strong> Read the dialogue below and choose the correct answer for each question.
          </p>
        </div>

        <div style={introBoxStyle}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Wo ist der Bahnhof?</strong> (Where is the Train Station?)
          </p>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Stellen Sie sich vor, Sie sind in einer neuen Stadt und möchten zum Bahnhof gehen. Sie wissen
            nicht, wo der Bahnhof ist, also müssen Sie jemanden fragen. Hier ist ein Beispiel.
          </p>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <em>
              Imagine you are in a new city and want to go to the train station. You do not know where
              the train station is, so you need to ask someone. Here is an example.
            </em>
          </p>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Situation:</strong> Eine Person fragt nach dem Weg zum Bahnhof.
          </p>

          <div style={{ margin: 0, lineHeight: 1.8 }}>
            <div>Person: Entschuldigung, wo ist der Bahnhof?</div>
            <div>Sie: Gehen Sie geradeaus bis zur Ampel.</div>
            <div>Person: Danke, und dann?</div>
            <div>Sie: Biegen Sie links ab und gehen Sie weiter geradeaus.</div>
            <div>Person: Okay, und wo ist der Bahnhof?</div>
            <div>Sie: Der Bahnhof ist auf der rechten Seite, direkt neben dem großen Supermarkt.</div>
            <div>Person: Das ist sehr hilfreich, vielen Dank!</div>
            <div>Sie: Gern geschehen. Gute Reise!</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Fragen zum Text</h3>

          {teil1Questions.map((question) => (
            <div key={question.stem} style={questionBoxStyle}>
              <strong style={{ lineHeight: 1.6 }}>{question.stem}</strong>
              <div style={optionListStyle}>
                {question.options.map((option) => (
                  <span key={option} style={optionStyle}>
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Teil 2 · Lesen Essay: Wegbeschreibungen</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Instruction:</strong> Read the dialogue below and choose the correct answer for each question.
          </p>
        </div>

        <div style={introBoxStyle}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Wo ist die Apotheke?</strong> (Where is the Pharmacy?)
          </p>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Stellen Sie sich vor, Sie sind in einer neuen Stadt und möchten zur Apotheke gehen. Sie wissen
            nicht, wo die Apotheke ist, also müssen Sie jemanden fragen. Hier ist ein Beispiel.
          </p>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <em>
              Imagine you are in a new city and want to go to the pharmacy. You do not know where the
              pharmacy is, so you need to ask someone. Here is an example.
            </em>
          </p>

          <div style={{ margin: 0, lineHeight: 1.8 }}>
            <div>Person A: Entschuldigung, wie komme ich zur nächsten Apotheke?</div>
            <div>Person B: Gehen Sie geradeaus bis zur Kreuzung.</div>
            <div>Person A: Danke, und dann?</div>
            <div>Person B: Biegen Sie rechts ab und gehen Sie weiter geradeaus.</div>
            <div>Person A: Okay, und wo ist die Apotheke?</div>
            <div>Person B: Die Apotheke ist auf der linken Seite, direkt neben der Bäckerei.</div>
            <div>Person A: Das ist sehr hilfreich, vielen Dank!</div>
            <div>Person B: Gern geschehen. Einen schönen Tag noch!</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Fragen zum Text</h3>

          {teil2Questions.map((question) => (
            <div key={question.stem} style={questionBoxStyle}>
              <strong style={{ lineHeight: 1.6 }}>{question.stem}</strong>
              <div style={optionListStyle}>
                {question.options.map((option) => (
                  <span key={option} style={optionStyle}>
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Schreiben Assignment</h2>

        <div style={introBoxStyle}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Asking for Directions in German</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Question: How would you ask someone how to get to a place in Germany? For example:
            <strong> “How do I get to the train station?”</strong>
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={writingItemStyle}>
            <strong>1. Asking for Directions:</strong> Write how you would ask someone in German:
            {" "}
            “How do I get to the train station?”
          </div>

          <div style={writingItemStyle}>
            <strong>2. Cross the Street:</strong> Write how you would tell someone in German:
            {" "}
            “Cross the street.”
          </div>

          <div style={writingItemStyle}>
            <strong>3. Go Straight:</strong> Write how you would tell someone in German:
            {" "}
            “Go straight.”
          </div>

          <div style={writingItemStyle}>
            <strong>4. Turn Left:</strong> Write how you would tell someone in German:
            {" "}
            “Turn left.”
          </div>

          <div style={writingItemStyle}>
            <strong>5. Turn Right:</strong> Write how you would tell someone in German:
            {" "}
            “Turn right.”
          </div>
        </div>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>The End.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After completing all parts, submit your answers in the submission area.
        </p>

        <a
          href="https://www.falowen.app/campus/submit"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Submit Workbook Answers
        </a>
      </div>
    </div>
  );
};

export default A1Day17InstructionsDirectionsKapitel11WorkbookPage;
