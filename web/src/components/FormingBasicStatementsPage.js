import React, { memo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

// A1 Day 8 grammar has one core focus: the vowel change in sprechen.
// "man spricht" is introduced as a useful, connected expression — not a second grammar unit.
const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 13,
};

const muted = { color: "#475569", margin: 0, lineHeight: 1.65 };
const example = {
  border: "1px solid #dbe5df",
  background: "#f7faf7",
  borderRadius: 12,
  padding: "12px 14px",
  display: "grid",
  gap: 4,
};

const examples = [
  ["Ich spreche Englisch.", "I speak English."],
  ["Sprichst du Deutsch?", "Do you speak German?"],
  ["Ama spricht Twi.", "Ama speaks Twi."],
];
const verbForms = [
  ["ich", "spreche"],
  ["du", "sprichst"],
  ["er / sie / es", "spricht"],
  ["wir", "sprechen"],
  ["ihr", "sprecht"],
  ["sie / Sie", "sprechen"],
];
const questions = [
  {
    prompt: "Ich ___ Englisch und Twi.",
    options: ["spreche", "sprichst", "spricht"],
    answer: 0,
    explanation: "Use ich spreche — there is no vowel change with ich.",
  },
  {
    prompt: "Welche Sprache ___ du?",
    options: ["spreche", "sprichst", "sprechen"],
    answer: 1,
    explanation: "With du, sprechen becomes sprichst (e → i).",
  },
  {
    prompt: "Lukas ___ Deutsch.",
    options: ["sprechen", "spricht", "sprichst"],
    answer: 1,
    explanation: "With er or a singular name, use spricht (e → i).",
  },
  {
    prompt: "In Spanien ___ man Spanisch.",
    options: ["sprechen", "sprichst", "spricht"],
    answer: 2,
    explanation: "man uses the same verb form as er / sie / es: man spricht.",
  },
];

function GermanExample({ german, english }) {
  return (
    <div style={example}>
      <strong lang="de">{german}</strong>
      <span lang="en" style={{ fontSize: 14, color: "#475569" }}>{english}</span>
    </div>
  );
}

function Day8QuickPractice() {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const correct = questions.filter((q, index) => answers[index] === q.answer).length;

  return (
    <section style={sectionStyle} data-testid="a1-day8-quick-practice">
      <div>
        <h2 style={{ margin: "0 0 5px" }}>3. Quick practice</h2>
        <p style={muted}>Choose the correct form of <strong>sprechen</strong>. You can try again.</p>
      </div>
      <p style={{ ...muted, fontWeight: 700 }} role="status">
        {answered} of {questions.length} answered · {correct} correct
      </p>
      {questions.map((q, index) => {
        const choice = answers[index];
        const checked = Number.isInteger(choice);
        const isCorrect = choice === q.answer;
        return (
          <div key={q.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, display: "grid", gap: 11 }}>
            <strong lang="de">{index + 1}. {q.prompt}</strong>
            <div role="group" aria-label={"Question " + (index + 1)}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))", gap: 7 }}>
              {q.options.map((option, optionIndex) => {
                const selected = choice === optionIndex;
                const showCorrect = checked && optionIndex === q.answer;
                const showWrong = checked && selected && !isCorrect;
                return (
                  <button key={option} type="button" aria-pressed={selected}
                    onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                    style={{
                      padding: "11px 12px",
                      background: showCorrect ? "#ecfdf5" : showWrong ? "#fff1f2" : selected ? "#edf2ff" : "#fff",
                      color: "#0f172a",
                      border: showCorrect ? "2px solid #16a34a" : showWrong ? "2px solid #dc2626" : "1px solid #cbd5e1",
                      borderRadius: 9,
                      font: "inherit",
                      fontWeight: selected ? 750 : 500,
                      cursor: "pointer",
                    }}
                  >{option}</button>
                );
              })}
            </div>
            {checked && <p style={{ margin: 0, lineHeight: 1.6, color: isCorrect ? "#166534" : "#991b1b" }}>
              <strong>{isCorrect ? "Correct!" : "Try again."}</strong> {q.explanation}
            </p>}
          </div>
        );
      })}
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }}
        onClick={() => setAnswers({})} disabled={!answered}>Reset practice</button>
    </section>
  );
}

function FormingBasicStatementsPage() {
  return (
    <main data-testid="a1-day8-focused-grammar" style={{ ...styles.container, display: "grid", gap: 15 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ color: "#276749", fontWeight: 800, fontSize: 13 }}>A1 · Day 8 · Countries and Languages</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Welche Sprachen sprichst du?</h1>
        <p style={muted}>What languages do you speak?</p>
        <div style={{ ...example, background: "#eff8f1", borderColor: "#b4dac0" }}>
          <strong>Today's one grammar focus: <em>sprechen</em> (to speak)</strong>
          <span>Learn how to say which languages you and other people speak.</span>
        </div>
        <p style={{ ...muted, fontSize: 14 }}>
          Quick review, not a new grammar rule: <strong lang="de">Ich komme aus Ghana.</strong> — I come from Ghana.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1. sprechen — an irregular verb</h2>
        <p style={muted}>
          <strong>sprechen</strong> means <em>to speak</em>. It is irregular: the vowel changes
          from <strong>e → i</strong> with <strong>du</strong> and <strong>er / sie / es</strong>.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 560 }}>
            <thead><tr>
              <th scope="col" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>Pronoun</th>
              <th scope="col" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>sprechen</th>
            </tr></thead>
            <tbody>
              {verbForms.map(([pronoun, form]) => (
                <tr key={pronoun}>
                  <td style={{ padding: "9px 12px", borderBottom: "1px solid #e2e8f0" }}>{pronoun}</td>
                  <td lang="de" style={{ padding: "9px 12px", borderBottom: "1px solid #e2e8f0", fontWeight: pronoun === "du" || pronoun === "er / sie / es" ? 800 : 500, color: pronoun === "du" || pronoun === "er / sie / es" ? "#166534" : "inherit" }}>
                    {form}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {examples.map(([german, english]) => <GermanExample key={german} german={german} english={english} />)}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2. One useful expression: man spricht</h2>
        <p style={muted}>
          <strong>man</strong> means <strong>people in general</strong> (or <em>one / you in general</em>).
          Use <strong>man spricht</strong> to describe what language people speak in a country.
        </p>
        <GermanExample german="In Deutschland spricht man Deutsch."
          english="People speak German in Germany." />
        <GermanExample german="In Ghana spricht man Englisch und viele andere Sprachen."
          english="People speak English and many other languages in Ghana." />
        <GermanExample german="In Spanien spricht man Spanisch."
          english="People speak Spanish in Spain." />
        <p style={{ ...muted, fontSize: 14 }}>
          Remember: <strong>man spricht</strong>, not <s>man sprechen</s>.
          <strong> man</strong> (people generally) is different from <strong>der Mann</strong> (the man).
        </p>
      </section>

      <Day8QuickPractice />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4. Speak with a partner</h2>
        <p style={muted}>Ask and answer. Then change the language or country and speak again.</p>
        <div style={{ ...example, background: "#eff8f1", borderColor: "#b4dac0" }}>
          <strong lang="de">A: Welche Sprachen sprichst du?</strong>
          <span>I speak English and Twi: <strong lang="de">B: Ich spreche Englisch und Twi.</strong></span>
          <strong lang="de">A: Welche Sprache spricht man in Deutschland?</strong>
          <span>People speak German in Germany: <strong lang="de">B: In Deutschland spricht man Deutsch.</strong></span>
        </div>
        <p style={{ ...muted, fontSize: 14 }}>
          Teacher tip: Practise the same two questions with three partners. There is no need
          to introduce other irregular verbs, past tenses or destination grammar today.
        </p>
      </section>
    </main>
  );
}

export default memo(FormingBasicStatementsPage);
