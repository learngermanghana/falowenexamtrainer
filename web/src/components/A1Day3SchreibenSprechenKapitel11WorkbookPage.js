import React, { useState } from "react";
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
  maxHeight: 260,
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

const questions = [
  {
    stem: "1. ___ ist das?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "2. ___ ist Martin?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "3. ___ ist der Ball?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "4. ___ ist das?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "5. ___ spielt mit dem Ball?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "6. ___ heißt du?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "7. ___ wohnt deine Mutter?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "8. ___ ist dein Job?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
  {
    stem: "9. ___ heißt deine Mutter?",
    options: ["A) Was", "B) Wer", "C) Wie", "D) Wo"],
  },
];

const A1Day3SchreibenSprechenKapitel11WorkbookPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 3 Workbook · Schreiben &amp; Sprechen Kapitel 1.1</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 1.1</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all sections on this page, then submit your final answers in the submission area, not directly on this
          page.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
          alt="Student writing German workbook answers in a notebook"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Reading / Writing</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Practice greetings, asking “How are you?”, and saying goodbye in German through these scenarios.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Scenario 1: Meeting a Friend in the Morning</strong>
          <br />It&apos;s 9:00 AM, and you run into a friend at a café. You haven&apos;t seen each other in a while, and you want to
          greet them and ask how they are doing. What would you say?
          <br />
          <em>Model answer:</em> Guten Morgen! Wie geht&apos;s dir?
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Scenario 2: Greeting a Teacher in the Afternoon</strong>
          <br />It&apos;s 2:00 PM, and you meet your teacher in the hallway before class starts. You want to greet them politely and
          ask how they are. What would you say?
          <br />
          <em>Model answer:</em> Guten Tag, Herr/Frau [Name]. Wie geht es Ihnen?
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Scenario 3: Talking to a Neighbor in the Evening</strong>
          <br />It&apos;s 6:30 PM, and you see your neighbor outside while you&apos;re both taking out the trash. You want to greet them,
          ask how they are doing, and then say goodbye as you go back inside.
          <br />
          <em>Model answer:</em> Guten Abend! Wie geht es Ihnen? Auf Wiedersehen!
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Scenario 4: Greeting a Family Member in the Evening</strong>
          <br />It&apos;s 7:00 PM, and you come home from school. You see your family member and want to greet them, ask how their day
          has been, and tell them goodnight.
          <br />
          <em>Model answer:</em> Hallo! Wie war dein Tag? Gute Nacht!
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Questions</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Fill in each sentence with the correct W-word (Was, Wer, Wie, Wo). Choose one answer (A/B/C/D) for each item.
        </p>
        {questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
        <div style={{ ...questionBoxStyle, background: "#f9fafb" }}>
          <strong>Antworten zur Überprüfung</strong>
          <button
            type="button"
            onClick={() => setShowAnswers((prev) => !prev)}
            style={{ ...styles.secondaryButton, width: "fit-content" }}
          >
            {showAnswers ? "Hide answers" : "Show answers"}
          </button>
          {showAnswers ? (
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              1) Was ist das?<br />2) Wo ist Martin?<br />3) Wie ist der Ball?<br />4) Wer ist das?<br />5) Wer spielt mit dem
              Ball?<br />6) Wie heißt du?<br />7) Wo wohnt deine Mutter?<br />8) Was ist dein Job?<br />9) Wie heißt deine
              Mutter?
            </p>
          ) : null}
          <p style={{ margin: 0, color: "#4b5563" }}>
            Explanation: <strong>Was</strong> asks about things, <strong>Wo</strong> asks about place, <strong>Wie</strong>{" "}
            asks about condition or identity wording, and <strong>Wer</strong> asks about people.
          </p>
        </div>
        <div style={{ ...questionBoxStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <strong>Discussion Practice</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Go to the group discussion page, open <strong>Class Members</strong>, and write your introduction using this
            structure: “Ich heiße [Name]. Ich komme aus [Country]. Ich bin [Age] Jahre alt. Ich wohne in [City].”
          </p>
          <a
            href="https://www.falowen.app/campus/discussion"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
          >
            Open Group Discussion Page
          </a>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
        <a
          href="https://drive.google.com/file/d/1fPjvzp0V05rNSohX7juS0qqvvcMHGmLb/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören Material (Google Drive)
        </a>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Finished the workbook? Submit all final answers in the submission area.
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

export default A1Day3SchreibenSprechenKapitel11WorkbookPage;
