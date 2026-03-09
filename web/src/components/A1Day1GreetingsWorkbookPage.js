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
    stem: "1. Wie begrüßt man jemanden um 7:00 Uhr morgens?",
    translation: "How do you greet someone at 7:00 AM?",
    options: ["A) Guten Abend", "B) Gute Nacht", "C) Guten Morgen", "D) Guten Tag"],
  },
  {
    stem: "2. Wie begrüßt man jemanden um 14:00 Uhr?",
    translation: "How do you greet someone at 2:00 PM?",
    options: ["A) Guten Morgen", "B) Gute Nacht", "C) Guten Abend", "D) Guten Tag"],
  },
  {
    stem: "3. Wie begrüßt man jemanden um 20:00 Uhr?",
    translation: "How do you greet someone at 8:00 PM?",
    options: ["A) Guten Morgen", "B) Guten Abend", "C) Guten Tag", "D) Gute Nacht"],
  },
  {
    stem: "4. Wie verabschiedet man sich um 22:30 Uhr?",
    translation: "How do you say goodbye at 10:30 PM?",
    options: ["A) Guten Abend", "B) Gute Nacht", "C) Guten Morgen", "D) Guten Tag"],
  },
  {
    stem: "5. Welche formelle Begrüßung verwendet man um 11:00 Uhr?",
    translation: "What formal greeting is used at 11:00 AM?",
    options: ["A) Hallo", "B) Guten Abend", "C) Guten Morgen", "D) Gute Nacht"],
  },
  {
    stem: "6. Wie fragt man höflich \"Wie geht es Ihnen?\" auf Deutsch?",
    translation: "How do you politely ask \"How are you?\" in German?",
    options: ["A) Wie geht es dir?", "B) Wie geht's?", "C) Wie geht es Ihnen?", "D) Alles klar?"],
  },
  {
    stem: "7. Was sagt man auf Deutsch, wenn man sich tagsüber verabschiedet?",
    translation: "What do you say in German when saying goodbye during the day?",
    options: ["A) Guten Morgen", "B) Auf Wiedersehen", "C) Gute Nacht", "D) Hallo"],
  },
  {
    stem: "8. Was sagt man auf Deutsch, wenn man sich informell verabschiedet?",
    translation: "What do you say in German when saying goodbye informally?",
    options: ["A) Tschüss", "B) Guten Tag", "C) Guten Abend", "D) Auf Wiedersehen"],
  },
  {
    stem: "9. Welche Begrüßung ist für den Abend geeignet?",
    translation: "Which greeting is appropriate for the evening?",
    options: ["A) Guten Morgen", "B) Guten Tag", "C) Guten Abend", "D) Gute Nacht"],
  },
  {
    stem: "10. Welche Begrüßung benutzt man am Ende des Tages?",
    translation: "Which greeting is used at the end of the day?",
    options: ["A) Guten Tag", "B) Guten Morgen", "C) Guten Abend", "D) Gute Nacht"],
  },
];

const A1Day1GreetingsWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 1 Workbook · Greetings and Asking About Well-being</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 0.1</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete Teil 1 and submit only Teil 2 answers in the submission area (not directly on this page).
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1600&q=80"
          alt="Students greeting each other in a classroom"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Reading Text</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Read the text and answer the questions below. Each has one correct answer.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> Guten Morgen! Wie geht es dir? Mir geht es gut, danke. Guten Tag! Wie geht es Ihnen? Ich bin ein
          bisschen müde. Guten Abend! Ich bin glücklich, dich zu sehen. Gute Nacht! Schlaf gut! Auf Wiedersehen! Tschüss!
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Translation:</strong> Good morning! How are you? I am good, thank you. Good day! How are you? I am a bit tired.
          Good evening! I am happy to see you. Good night! Sleep well! Goodbye! Bye!
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Multiple-Choice Questions</h2>
        {questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Assignment submission ends at Teil 2. When you finish, submit your Teil 2 answers in the submission area.
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

export default A1Day1GreetingsWorkbookPage;
