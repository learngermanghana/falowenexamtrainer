import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import AssignmentForm from "./AssignmentForm";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const QUESTIONS = [
  {
    id: "q1",
    prompt: "Wie begrüßt man jemanden um 7:00 Uhr morgens?",
    options: ["Guten Abend", "Gute Nacht", "Guten Morgen", "Guten Tag"],
  },
  {
    id: "q2",
    prompt: "Wie begrüßt man jemanden um 14:00 Uhr?",
    options: ["Guten Morgen", "Gute Nacht", "Guten Abend", "Guten Tag"],
  },
  {
    id: "q3",
    prompt: "Wie begrüßt man jemanden um 20:00 Uhr?",
    options: ["Guten Morgen", "Guten Abend", "Guten Tag", "Gute Nacht"],
  },
  {
    id: "q4",
    prompt: "Wie verabschiedet man sich um 22:30 Uhr?",
    options: ["Guten Abend", "Gute Nacht", "Guten Morgen", "Guten Tag"],
  },
  {
    id: "q5",
    prompt: "Welche formelle Begrüßung verwendet man um 11:00 Uhr?",
    options: ["Hallo", "Guten Abend", "Guten Morgen", "Gute Nacht"],
  },
  {
    id: "q6",
    prompt: "Wie fragt man höflich \"Wie geht es Ihnen?\" auf Deutsch?",
    options: ["Wie geht es dir?", "Wie geht's?", "Wie geht es Ihnen?", "Alles klar?"],
  },
  {
    id: "q7",
    prompt: "Was sagt man auf Deutsch, wenn man sich tagsüber verabschiedet?",
    options: ["Guten Morgen", "Auf Wiedersehen", "Gute Nacht", "Hallo"],
  },
  {
    id: "q8",
    prompt: "Was sagt man auf Deutsch, wenn man sich informell verabschiedet?",
    options: ["Tschüss", "Guten Tag", "Guten Abend", "Auf Wiedersehen"],
  },
  {
    id: "q9",
    prompt: "Welche Begrüßung ist für den Abend geeignet?",
    options: ["Guten Morgen", "Guten Tag", "Guten Abend", "Gute Nacht"],
  },
  {
    id: "q10",
    prompt: "Welche Begrüßung benutzt man am Ende des Tages?",
    options: ["Guten Tag", "Guten Morgen", "Guten Abend", "Gute Nacht"],
  },
];

const GreetingsAssignmentPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 1 Assignment: Greetings</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 0.1 — Greetings, Goodbyes, and Asking “How are you?”
        </p>
      </div>

      <Section title="Workbook text (read first)">
        <p style={{ margin: 0 }}>
          Guten Morgen! Wie geht es dir? Mir geht es gut, danke. Guten Tag! Wie geht es Ihnen? Ich bin ein bisschen müde.
          Guten Abend! Ich bin glücklich, dich zu sehen. Gute Nacht! Schlaf gut! Auf Wiedersehen! Tschüss!
        </p>
        <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
          Translation: Good morning! How are you? I am good, thank you. Good day! How are you? I am a bit tired. Good
          evening! I am happy to see you. Good night! Sleep well! Goodbye! Bye!
        </p>
      </Section>

      <AssignmentForm
        title="Assignment Form"
        intro="Read the text, answer in German, then copy your answers and paste them into the assignment submission page."
        questions={QUESTIONS}
        onOpenSubmission={() => navigate("/campus/submit")}
      />

      <Section title="Vocabulary list">
        <BulletList
          items={[
            "Guten Morgen! — Good morning!",
            "Guten Tag! — Good day!",
            "Guten Abend! — Good evening!",
            "Gute Nacht! — Good night!",
            "Hallo! — Hello!",
            "Hi! — Hi!",
            "Auf Wiedersehen! — Goodbye! (formal)",
            "Tschüss! — Bye! (informal)",
            "Bis später! — See you later!",
            "Bis morgen! — See you tomorrow!",
            "Bis bald! — See you soon!",
            "Mach’s gut! — Take care!",
            "Wie geht es dir? — How are you? (informal)",
            "Wie geht es Ihnen? — How are you? (formal)",
            "Wie geht's? — How’s it going? (informal)",
            "Alles klar? — Everything okay?",
            "Wie läuft’s? — How’s it going?",
            "Mir geht es gut. — I am good.",
            "Mir geht es schlecht. — I am bad.",
            "Ich bin müde. — I am tired.",
            "Ich bin glücklich. — I am happy.",
            "Ich bin ein bisschen müde. — I am a bit tired.",
            "Es geht. — It’s going.",
            "Nicht so gut. — Not so well.",
            "der Morgen — the morning",
            "der Tag — the day",
            "der Abend — the evening",
            "die Nacht — the night",
            "der Nachmittag — the afternoon",
            "die Uhrzeit — the time of day",
            "die Stunde — the hour",
            "die Minute — the minute",
          ]}
        />
      </Section>
    </div>
  );
};

export default GreetingsAssignmentPage;
