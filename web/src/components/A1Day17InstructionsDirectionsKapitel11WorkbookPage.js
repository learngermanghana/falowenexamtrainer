import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 320,
  objectFit: "cover",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const teil1Questions = [
  {
    stem: "1. Was sagt die Person, um nach dem Bahnhof zu fragen?",
    options: [
      "A) Entschuldigung, wie komme ich zum Supermarkt?",
      "B) Entschuldigung, wo ist der Bahnhof?",
      "C) Entschuldigung, wie komme ich zur Apotheke?",
      "D) Keine der Antworten",
    ],
  },
  {
    stem: "2. Was muss die Person an der Ampel machen?",
    options: ["A) Rechts abbiegen", "B) Links abbiegen", "C) Die Straße überqueren", "D) Nach Hause gehen"],
  },
  {
    stem: "3. Wo befindet sich der Bahnhof?",
    options: [
      "A) Auf der linken Seite",
      "B) Auf der rechten Seite, direkt neben dem großen Supermarkt",
      "C) Geradeaus",
      "D) Hinter der Apotheke",
    ],
  },
  {
    stem: "4. Wie fragt man nach dem Weg zur Apotheke?",
    options: [
      "A) Wo ist der Bahnhof?",
      "B) Wie komme ich zur nächsten Apotheke?",
      "C) Wo finde ich die nächste Straße?",
      "D) Wie komme ich zur Bäckerei?",
    ],
  },
  {
    stem: "5. Wie verabschieden sich die Personen in beiden Dialogen?",
    options: [
      "A) Auf Wiedersehen",
      "B) Tschüss",
      "C) Gute Reise und einen schönen Tag noch",
      "D) Bis morgen",
    ],
  },
];

const teil2Questions = [
  {
    stem: "1. Was fragt Person A zuerst?",
    options: [
      "A) Wie komme ich zum Supermarkt?",
      "B) Wo ist der Bahnhof?",
      "C) Wie komme ich zur nächsten Apotheke?",
      "D) Wo ist das Restaurant?",
    ],
  },
  {
    stem: "2. Was soll Person A zuerst an der Kreuzung machen?",
    options: ["A) Geradeaus gehen", "B) Links abbiegen", "C) Rechts abbiegen", "D) Warten"],
  },
  {
    stem: "3. Wo befindet sich die Apotheke?",
    options: [
      "A) Auf der rechten Seite, gegenüber der Bäckerei",
      "B) Auf der linken Seite, direkt neben der Bäckerei",
      "C) Geradeaus",
      "D) Neben dem Bahnhof",
    ],
  },
  {
    stem: '4. Welche Antwort passt zu der Frage "Wie komme ich zum Bahnhof?"',
    options: [
      "A) Gehen Sie geradeaus bis zur Kreuzung, dann links.",
      "B) Die Apotheke ist auf der linken Seite.",
      "C) Überqueren Sie die Straße.",
      "D) Guten Tag.",
    ],
  },
  {
    stem: "5. Wie verabschiedet sich Person B?",
    options: ["A) Auf Wiedersehen", "B) Tschüss", "C) Einen schönen Tag noch", "D) Bis dann"],
  },
];

const vocabItems = [
  "Entschuldigung – Excuse me",
  "Wie komme ich zu...? – How do I get to...?",
  "Wo ist...? – Where is...?",
  "die Apotheke – the pharmacy",
  "der Bahnhof – the train station",
  "der Supermarkt – the supermarket",
  "die Straße – the street",
  "die Kreuzung – the intersection",
  "die Ampel – the traffic light",
  "die Bäckerei – the bakery",
  "geradeaus – straight ahead",
  "rechts abbiegen – to turn right",
  "links abbiegen – to turn left",
  "überqueren – to cross",
  "auf der rechten Seite – on the right side",
  "auf der linken Seite – on the left side",
];

const A1Day17InstructionsDirectionsKapitel11WorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 17 Workbook · Instructions and Directions</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 11</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all workbook parts, then submit your final answers in the submission area only (not directly on this
          page).
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
          alt="Street signs and roads in a city center used for practicing directions"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen / Schreiben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Lesen Essay: Wegbeschreibungen (Giving Directions)</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Read the dialogue below and choose the correct answer for each question.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Wo ist der Bahnhof? (Where is the Train Station?)</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Stellen Sie sich vor, Sie sind in einer neuen Stadt und möchten zum Bahnhof gehen. Sie wissen nicht, wo der
          Bahnhof ist, also müssen Sie jemanden fragen. Hier ist ein Beispiel:
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Situation: Eine Person fragt nach dem Weg zum Bahnhof.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Person: Entschuldigung, wo ist der Bahnhof?<br />
          Sie: Gehen Sie geradeaus bis zur Ampel.<br />
          Person: Danke, und dann?<br />
          Sie: Biegen Sie links ab und gehen Sie weiter geradeaus.<br />
          Person: Okay, und wo ist der Bahnhof?<br />
          Sie: Der Bahnhof ist auf der rechten Seite, direkt neben dem großen Supermarkt.<br />
          Person: Das ist sehr hilfreich, vielen Dank!<br />
          Sie: Gern geschehen. Gute Reise!
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Fragen</h2>
        <p style={{ margin: 0, lineHeight: 1.7, fontWeight: 600 }}>Fragen zum Text 1</p>
        {teil1Questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}

        <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}>
          <strong>Lesen Essay: Wegbeschreibungen (Giving Directions)</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Wo ist die Apotheke? (Where is the Pharmacy?)</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Stellen Sie sich vor, Sie sind in einer neuen Stadt und möchten zur Apotheke gehen. Sie wissen nicht, wo die
          Apotheke ist, also müssen Sie jemanden fragen. Hier ist ein Beispiel:
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Person A: Entschuldigung, wie komme ich zur nächsten Apotheke?<br />
          Person B: Gehen Sie geradeaus bis zur Kreuzung.<br />
          Person A: Danke, und dann?<br />
          Person B: Biegen Sie rechts ab und gehen Sie weiter geradeaus.<br />
          Person A: Okay, und wo ist die Apotheke?<br />
          Person B: Die Apotheke ist auf der linken Seite, direkt neben der Bäckerei.<br />
          Person A: Das ist sehr hilfreich, vielen Dank!<br />
          Person B: Gern geschehen. Einen schönen Tag noch!
        </p>
        <p style={{ margin: 0, lineHeight: 1.7, fontWeight: 600 }}>Fragen zum Text 2</p>
        {teil2Questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}

        <div style={{ ...questionBoxStyle, background: "#f9fafb" }}>
          <strong>Teil 3 · Schreiben Assignment (for submission)</strong>
          <span>1. Wie würdest du auf Deutsch fragen: „Wie komme ich zum Bahnhof?“</span>
          <span>2. Schreibe auf Deutsch: „Überqueren Sie die Straße.“</span>
          <span>3. Schreibe auf Deutsch: „Gehen Sie geradeaus.“</span>
          <span>4. Schreibe auf Deutsch: „Biegen Sie links ab.“</span>
          <span>5. Schreibe auf Deutsch: „Biegen Sie rechts ab.“</span>
        </div>

        <div style={{ ...questionBoxStyle, background: "#f9fafb" }}>
          <strong>Vokabelliste: Wegbeschreibungen (Directions)</strong>
          {vocabItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Complete Hören from Google Drive, then return to submit answers.</p>
        <a
          href="https://drive.google.com/file/d/17FNSfHBxyga9sKxzicT_qkP7PA4vB5-A/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören Material (Google Drive)
        </a>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
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
