import React, { memo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

// Keep A1 Day 8 short: speaking languages, then origin/location/destination
// with only the country prepositions needed for those three questions.
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
    prompt: "Welche Sprache ___ du?",
    options: ["spreche", "sprichst", "sprechen"],
    answer: 1,
    explanation: "With du, sprechen becomes sprichst (e → i).",
  },
  {
    prompt: "In Spanien ___ man Spanisch.",
    options: ["sprechen", "sprichst", "spricht"],
    answer: 2,
    explanation: "man takes the same verb form as er / sie / es: man spricht.",
  },
  {
    prompt: "___ kommst du? — Aus Ghana.",
    options: ["Wo", "Woher", "Wohin"],
    answer: 1,
    explanation: "Woher asks about origin: from where? The answer uses aus Ghana.",
  },
  {
    prompt: "___ wohnst du? — In Berlin.",
    options: ["Wo", "Woher", "Wohin"],
    answer: 0,
    explanation: "Wo asks about a location: where? The answer is in Berlin.",
  },
  {
    prompt: "Wohin fährt Lukas? — Er fährt ___ Deutschland.",
    options: ["in", "aus", "nach"],
    answer: 2,
    explanation: "Use nach for a destination with no article, such as Deutschland or Berlin.",
  },
  {
    prompt: "Wohin fährt Anna? — Sie fährt ___ Schweiz.",
    options: ["in die", "nach", "in der"],
    answer: 0,
    explanation: "Use in die Schweiz for movement to a country with the article die. Wo? in der Schweiz.",
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
        <h2 style={{ margin: "0 0 5px" }}>5. Quick practice</h2>
        <p style={muted}>Choose the correct verb form, question word or country preposition. You can try again.</p>
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
        <p style={muted}>What languages do you speak? Where are you from, where are you, and where are you going?</p>
        <div style={{ ...example, background: "#eff8f1", borderColor: "#b4dac0" }}>
          <strong>Today's goals: languages and places</strong>
          <span>Use <em>sprechen</em> and <em>man spricht</em>, then tell the difference between <em>woher</em>, <em>wo</em> and <em>wohin</em>.</span>
        </div>
        <p style={{ ...muted, fontSize: 14 }}>
          We use countries and languages you already know, so you can concentrate on the question words and short sentence patterns.
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

      <section style={sectionStyle} data-testid="a1-day8-where-questions">
        <h2 style={{ margin: 0 }}>3. Woher? Wo? Wohin? — understand the difference</h2>
        <p style={muted}>
          All three questions ask about a place, but they mean different things.
          Remember <strong>from</strong> (origin), <strong>at/in</strong> (location), and
          <strong> to</strong> (destination).
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 440 }}>
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>Question</th>
                <th scope="col" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>German answer</th>
                <th scope="col" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #cbd5e1" }}>English</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Woher? — from where?", "Woher kommst du? — Ich komme aus Ghana.", "Where are you from? — I come from Ghana."],
                ["Wo? — where?", "Wo wohnst du? — Ich wohne in Accra.", "Where do you live? — I live in Accra."],
                ["Wohin? — to where?", "Wohin fährst du? — Ich fahre nach Deutschland.", "Where are you going? — I am travelling to Germany."],
              ].map(([question, german, english]) => (
                <tr key={question}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>{question}</td>
                  <td lang="de" style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>{german}</td>
                  <td lang="en" style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...example, background: "#eff8f1", borderColor: "#b4dac0" }}>
          <strong>Think: Where FROM? Where AT? Where TO?</strong>
          <span><strong>Woher?</strong> → <em>aus</em> · <strong>Wo?</strong> → <em>in</em> · <strong>Wohin?</strong> → <em>nach</em> (for most city and country names without an article).</span>
        </div>
      </section>

      <section style={sectionStyle} data-testid="a1-day8-nach-in">
        <h2 style={{ margin: 0 }}>4. nach or in? — going to a place</h2>
        <p style={muted}>
          To answer <strong>Wohin?</strong>, use <strong>nach</strong> with cities and
          countries that normally have <strong>no article</strong>. For countries
          that have an article, use <strong>in + the destination article</strong>.
        </p>
        <GermanExample german="Ich fahre nach Berlin." english="I am travelling to Berlin. (city → nach)" />
        <GermanExample german="Wir fliegen nach Ghana." english="We are flying to Ghana. (country without an article → nach)" />
        <GermanExample german="Sie fährt in die Schweiz." english="She is travelling to Switzerland. (die Schweiz → in die)" />
        <div style={{ ...example, background: "#eff8f1", borderColor: "#b4dac0" }}>
          <strong>Do not confuse destination with location:</strong>
          <span lang="de"><strong>Wo?</strong> Ich bin <strong>in der Schweiz.</strong></span>
          <span lang="en" style={muted}>Where? I am in Switzerland.</span>
          <span lang="de"><strong>Wohin?</strong> Ich fahre <strong>in die Schweiz.</strong></span>
          <span lang="en" style={muted}>To where? I am travelling to Switzerland.</span>
          <span style={{ ...muted, fontSize: 14 }}>
            Other countries with articles work similarly: <em>in die Türkei</em>, <em>in die USA</em>.
            You only need to recognise this exception today.
          </span>
        </div>
      </section>

      <Day8QuickPractice />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>6. Speak with a partner</h2>
        <p style={muted}>Ask about language, origin, location and destination. Keep the answers short.</p>
        <div style={{ ...example, background: "#eff8f1", borderColor: "#b4dac0" }}>
          <strong lang="de">A: Welche Sprachen sprichst du?</strong>
          <span>I speak English and Twi: <strong lang="de">B: Ich spreche Englisch und Twi.</strong></span>
          <strong lang="de">A: Welche Sprache spricht man in Deutschland?</strong>
          <span>People speak German in Germany: <strong lang="de">B: In Deutschland spricht man Deutsch.</strong></span>
          <strong lang="de">A: Woher kommst du? — B: Ich komme aus Ghana.</strong>
          <strong lang="de">A: Wo wohnst du? — B: Ich wohne in Accra.</strong>
          <strong lang="de">A: Wohin fährst du? — B: Ich fahre nach Berlin.</strong>
        </div>
        <p style={{ ...muted, fontSize: 14 }}>
          Teacher tip: First ask students to point to <strong>from / at / to</strong>, then let pairs
          practise the three place questions with a new city or country. Keep it to these patterns;
          do not introduce past tenses or other irregular verbs today.
        </p>
      </section>
    </main>
  );
}

export default memo(FormingBasicStatementsPage);
