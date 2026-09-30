import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const paragraph = { margin: 0, lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

const phraseGroups = [
  {
    title: "Termin absagen · Cancel an appointment",
    phrases: [
      "Es tut mir leid, ich kann am Dienstag nicht kommen.",
      "Leider muss ich den Termin absagen.",
      "Ich kann nicht kommen, weil ich krank bin.",
    ],
  },
  {
    title: "Sich für einen Kurs anmelden · Register for a course",
    phrases: [
      "Ich möchte mich für den Deutschkurs anmelden.",
      "Wie kann ich mich für den Kurs anmelden?",
      "Wann beginnt der Kurs?",
    ],
  },
  {
    title: "Jemandem gratulieren · Congratulate someone",
    phrases: [
      "Herzlichen Glückwunsch zum Geburtstag!",
      "Ich gratuliere dir zum Geburtstag.",
      "Ich gratuliere Ihnen zum Geburtstag.",
    ],
  },
  {
    title: "Nach dem Preis fragen · Ask for the price",
    phrases: [
      "Wie viel kostet der Kurs?",
      "Was kostet der Deutschkurs?",
      "Wie hoch ist die Kursgebühr?",
    ],
  },
  {
    title: "Einen neuen Termin vereinbaren · Request another appointment",
    phrases: [
      "Können wir einen anderen Termin vereinbaren?",
      "Können wir einen neuen Termin vereinbaren?",
      "Passt Ihnen Mittwoch um 15 Uhr?",
    ],
  },
  {
    title: "Mehr Informationen anfragen · Request more information",
    phrases: [
      "Können Sie mir bitte mehr Informationen über den Kurs geben?",
      "Können Sie mir Informationen über die Anmeldung geben?",
      "Ich möchte gern mehr über den Kurs wissen.",
    ],
  },
];

const recognitionChecks = [
  {
    question: "Which word normally connects two additional ideas?",
    answer: "und",
  },
  {
    question: "Which word shows a contrast?",
    answer: "aber",
  },
  {
    question: "Which word shows a choice or alternative?",
    answer: "oder",
  },
  {
    question: "Which word can give a reason while keeping normal main-clause word order?",
    answer: "denn",
  },
  {
    question: "What happens to the conjugated verb after weil?",
    answer: "It goes to the end of the weil-clause.",
  },
];

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

export default function ConjunctionNotesPage() {
  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>A1 · Kapitel 5.10</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Gründe geben mit weil + nützliche A1-Redemittel</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Your main A1 production target is simple: give a reason with <strong>weil</strong> and put the conjugated verb at the end.
        </p>
      </header>

      <Section title="1. Your main A1 connector: weil">
        <p style={paragraph}>
          At A1, it is better to use one reason structure confidently than to mix several connector patterns. Use
          <strong> weil</strong> when you want to explain <strong>why</strong>.
        </p>
        <div style={{ border: "2px solid #60a5fa", borderRadius: 14, padding: 14, background: "#eff6ff", display: "grid", gap: 8 }}>
          <strong>Pattern</strong>
          <span>Main clause + , weil + subject + information + <strong>conjugated verb at the end</strong>.</span>
          <span>Ich kann nicht kommen, <strong>weil ich krank bin</strong>.</span>
          <span>Ich lerne Deutsch, <strong>weil ich in Deutschland arbeiten möchte</strong>.</span>
          <span>Ich komme später, <strong>weil ich noch arbeiten muss</strong>.</span>
        </div>
      </Section>

      <Section title="2. One rule to remember">
        <p style={paragraph}>
          After <strong>weil</strong>, move the conjugated verb to the end of that clause.
        </p>
        <ul style={list}>
          <li><strong>Wrong:</strong> weil ich bin krank.</li>
          <li><strong>Correct:</strong> weil ich krank <strong>bin</strong>.</li>
          <li><strong>Wrong:</strong> weil ich muss arbeiten.</li>
          <li><strong>Correct:</strong> weil ich arbeiten <strong>muss</strong>.</li>
        </ul>
        <p style={paragraph}>
          Do not force a long sentence. A short correct A1 sentence is better than a complicated sentence with the wrong word order.
        </p>
      </Section>

      <Section title="3. Use weil in real A1 messages">
        <p style={paragraph}>These are the situations students should be able to handle confidently in short letters, emails and messages.</p>
        <ul style={list}>
          <li>Ich kann heute nicht kommen, <strong>weil ich krank bin</strong>.</li>
          <li>Ich möchte den Termin ändern, <strong>weil ich am Montag arbeiten muss</strong>.</li>
          <li>Ich lerne Deutsch, <strong>weil ich in Deutschland studieren möchte</strong>.</li>
          <li>Ich schreibe Ihnen, <strong>weil ich mehr Informationen über den Kurs brauche</strong>.</li>
        </ul>
      </Section>

      <Section title="4. Nützliche Redemittel, die du auf A1 kennen solltest">
        <p style={paragraph}>
          Learn these as practical sentence frames. Change the day, time, course, person or reason to fit the task.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {phraseGroups.map((group) => (
            <article
              key={group.title}
              style={{
                border: "1px solid #dbeafe",
                borderRadius: 14,
                padding: 13,
                background: "#f8fafc",
                display: "grid",
                gap: 7,
              }}
            >
              <strong style={{ color: "#1e3a8a" }}>{group.title}</strong>
              <ul style={list}>
                {group.phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div style={{ borderLeft: "4px solid #2563eb", padding: "10px 12px", background: "#eff6ff", borderRadius: 10 }}>
          <strong>Small grammar note:</strong> <em>gratulieren</em> uses the dative: <strong>Ich gratuliere dir / Ihnen.</strong>
        </div>
      </Section>

      <Section title="5. Formal and informal phrases">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 6 }}>
            <strong>Informal · du</strong>
            <span>Hallo / Liebe Anna,</span>
            <span>Kannst du mir bitte helfen?</span>
            <span>Können wir einen anderen Termin vereinbaren?</span>
            <span>Viele Grüße / Liebe Grüße</span>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 6 }}>
            <strong>Formal · Sie</strong>
            <span>Sehr geehrte Damen und Herren,</span>
            <span>Können Sie mir bitte mehr Informationen geben?</span>
            <span>Können wir einen anderen Termin vereinbaren?</span>
            <span>Mit freundlichen Grüßen</span>
          </div>
        </div>
      </Section>

      <Section title="6. Exam knowledge check: recognise the other connectors">
        <p style={paragraph}>
          You should recognise <strong>und, aber, oder</strong> and <strong>denn</strong> in A1 tasks, but you do not need to force them into your writing.
          Your productive reason structure for this lesson is <strong>weil</strong>.
        </p>
        <div style={{ display: "grid", gap: 9 }}>
          {recognitionChecks.map((item, index) => (
            <details key={item.question} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 11, background: "#fff" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>{index + 1}. {item.question}</summary>
              <p style={{ margin: "8px 0 0" }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section title="7. Deshalb starts in A2">
        <p style={paragraph}>
          <strong>Deshalb</strong> introduces a different word-order pattern: <strong>deshalb + verb + subject</strong>.
          Falowen teaches and practises this properly in <strong>A2 Day 1</strong>, where students compare reasons and results.
        </p>
        <p style={{ ...paragraph, color: "#475569" }}>
          For now, concentrate on writing correct A1 sentences with <strong>weil</strong>.
        </p>
      </Section>

      <Section title="Final A1 challenge">
        <p style={paragraph}>Complete these without copying the examples:</p>
        <ol style={list}>
          <li>Cancel an appointment and give a reason with <strong>weil</strong>.</li>
          <li>Ask for the price of a German course.</li>
          <li>Ask for more information about a course.</li>
          <li>Congratulate a friend on their birthday.</li>
          <li>Ask to arrange another appointment.</li>
          <li>Say that you want to register for a German course.</li>
        </ol>
      </Section>
    </main>
  );
}
