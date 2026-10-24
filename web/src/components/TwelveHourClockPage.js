import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

// Day 11 / A1-7 grammar notes. The Lesen/Hören assignment is intentionally
// kept separate and unchanged.
const pageWrap = { ...styles.container, display: "grid", gap: 16 };
const card = { ...styles.card, display: "grid", gap: 12 };
const paragraph = { margin: 0, lineHeight: 1.7 };
const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: 420 };
const cellStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "10px 9px",
  textAlign: "left",
  verticalAlign: "top",
  lineHeight: 1.6,
};
const noteStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: "12px 14px",
  background: "#eff6ff",
  lineHeight: 1.7,
};

const Section = ({ title, subtitle, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{title}</h2>
    {subtitle ? <p style={{ ...paragraph, color: "#475569" }}>{subtitle}</p> : null}
    {children}
  </section>
);

const Note = ({ children }) => <div style={noteStyle}>{children}</div>;

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto", maxWidth: "100%" }}>
    <table style={tableStyle}>
      <thead>
        <tr>{headers.map((header) => <th key={header} style={{ ...cellStyle, fontWeight: 800 }}>{header}</th>)}</tr>
      </thead>
      <tbody>{rows.map((row, index) => (
        <tr key={index}>{row.map((value, cell) => <td key={cell} style={cellStyle}>{value}</td>)}</tr>
      ))}</tbody>
    </table>
  </div>
);

const clockRows = [
  ["06:00", "Es ist sechs Uhr."],
  ["06:15", "Es ist Viertel nach sechs."],
  ["06:30", "Es ist halb sieben."],
  ["06:45", "Es ist Viertel vor sieben."],
  ["07:00", "Es ist sieben Uhr."],
  ["07:30", "Es ist halb acht."],
  ["07:45", "Es ist Viertel vor acht."],
];

const timeExpressionRows = [
  ["um", "at an exact time", "Der Unterricht beginnt um 9 Uhr."],
  ["ab", "from / starting at", "Das Museum ist ab 10 Uhr geöffnet."],
  ["von … bis", "from … to", "Ich arbeite von 8 bis 12 Uhr."],
  ["bis", "until", "Der Laden ist bis 18 Uhr geöffnet."],
  ["vor", "before", "Ich komme vor 9 Uhr."],
  ["nach", "after", "Ich komme nach 9 Uhr."],
];

const daypartRows = [
  ["morgens", "in the morning", "Ich frühstücke morgens."],
  ["vormittags", "before noon / in the late morning", "Vormittags lerne ich Deutsch."],
  ["mittags", "at midday", "Mittags esse ich."],
  ["nachmittags", "in the afternoon", "Nachmittags mache ich Hausaufgaben."],
  ["abends", "in the evening", "Abends sehe ich fern."],
  ["nachts", "at night", "Nachts schlafe ich."],
];

const separableRows = [
  ["aufstehen", "to get up", "Ich stehe um 6 Uhr auf."],
  ["anfangen", "to begin", "Der Kurs fängt um 9 Uhr an."],
  ["einkaufen", "to shop", "Ich kaufe nachmittags ein."],
  ["fernsehen", "to watch TV", "Ich sehe abends fern."],
  ["abholen", "to pick up", "Ich hole Anna um 16 Uhr ab."],
  ["anrufen", "to call", "Ich rufe meine Mutter an."],
];

// Inline A1-7 grammar checks: unscored and intentionally separate from the
// workbook's graded Lesen/Hören assignment.
const timeKnowledgeChecks = [
  {
    number: 1,
    prompt: "In German, what time does „halb zehn“ mean?",
    options: ["10:30", "9:30", "9:15"],
    answer: "9:30",
    explanation: "In German, halb refers to the next hour. Halb zehn means halfway to ten, or 9:30.",
    incorrectExplanation: "Remember: German halb refers to the next hour, not the hour before.",
  },
  {
    number: 2,
    prompt: "A German speaker says: „Ich lerne Deutsch um acht Uhr abends.“ What time is the German lesson?",
    options: ["8:00 AM", "6:00 PM", "8:00 PM"],
    answer: "8:00 PM",
    explanation: "Acht Uhr means eight o'clock. Abends means in the evening, so it is 8:00 PM (20:00).",
    incorrectExplanation: "Look carefully at abends: it tells you whether the speaker means morning or evening.",
  },
  {
    number: 3,
    prompt: "Which option correctly matches the German time expressions with their meanings?",
    options: [
      "vormittags = before noon, mittags = around noon, nachmittags = in the afternoon",
      "vormittags = in the evening, mittags = in the morning, nachmittags = at night",
      "vormittags = in the afternoon, mittags = in the evening, nachmittags = before noon",
    ],
    answer: "vormittags = before noon, mittags = around noon, nachmittags = in the afternoon",
    explanation: "Vormittags is before midday, mittags is around midday, and nachmittags is in the afternoon.",
    incorrectExplanation: "Think about the sequence of the day: before noon, midday, then afternoon.",
  },
];

const separableKnowledgeChecks = [
  {
    number: 4,
    prompt: "Which German sentence correctly means “I get up at seven o'clock”?",
    options: ["Ich stehe um sieben Uhr auf.", "Ich aufstehe um sieben Uhr.", "Ich steht um sieben Uhr auf."],
    answer: "Ich stehe um sieben Uhr auf.",
    explanation: "Aufstehen separates: stehe is the conjugated verb, and the prefix auf goes to the end.",
    incorrectExplanation: "The subject is ich. Check the verb form and where the prefix auf appears.",
  },
  {
    number: 5,
    prompt: "Which sentence correctly says “Paul goes shopping in the afternoon”?",
    options: ["Nachmittags Paul kauft ein.", "Nachmittags kauft Paul ein.", "Nachmittags kauft Paul einkaufen."],
    answer: "Nachmittags kauft Paul ein.",
    explanation: "The time phrase takes the first position, kauft is second, and the prefix ein goes to the end.",
    incorrectExplanation: "After Nachmittags at the start, the conjugated verb comes next. Check the prefix, too.",
  },
  {
    number: 6,
    prompt: "Which sentence correctly means “The mother picks up Ali at 4 PM”?",
    options: ["Die Mutter abholt Ali um 16 Uhr.", "Die Mutter holt Ali um 16 Uhr ab.", "Die Mutter holt ab Ali um 16 Uhr."],
    answer: "Die Mutter holt Ali um 16 Uhr ab.",
    explanation: "Abholen separates in a main clause: holt is the verb, and ab moves to the end.",
    incorrectExplanation: "With abholen, check where the conjugated verb and the prefix ab belong.",
  },
];

const lessonChecks = [
  {
    prompt: "What time is halb acht?",
    options: ["8:30", "7:30", "8:00"],
    answer: "7:30",
    explanation: "halb refers to the NEXT hour. Halb acht is halfway to eight.",
  },
  {
    prompt: "The museum opens ab 10 Uhr. Which visit is possible?",
    options: ["9:00", "8:30", "10:30"],
    answer: "10:30",
    explanation: "ab 10 Uhr means starting at 10 o'clock.",
  },
  {
    prompt: "Which expression fits 16:00?",
    options: ["nachmittags", "vormittags", "nachts"],
    answer: "nachmittags",
    explanation: "16:00 is in the afternoon.",
  },
  {
    prompt: "Which sentence uses the separable verb correctly?",
    options: ["Ich aufstehe um 6 Uhr.", "Ich stehe um 6 Uhr auf.", "Ich um 6 Uhr aufstehe."],
    answer: "Ich stehe um 6 Uhr auf.",
    explanation: "The conjugated verb is in position two; auf moves to the end.",
  },
];

function PracticeQuestion({
  number,
  prompt,
  options,
  answer,
  explanation,
  incorrectExplanation,
}) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = checked && selected === answer;
  const wrong = checked && selected !== answer;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
      <strong>{number ? `${number}. ${prompt}` : prompt}</strong>
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          aria-pressed={selected === option}
          style={{
            ...styles.secondaryButton,
            textAlign: "left",
            justifyContent: "flex-start",
            whiteSpace: "normal",
            height: "auto",
            borderColor: selected === option ? "#2563eb" : undefined,
            background: selected === option ? "#eff6ff" : undefined,
          }}
          onClick={() => { setSelected(option); setChecked(false); }}
        >{String.fromCharCode(65 + index)}. {option}</button>
      ))}
      <button
        type="button"
        style={{ ...styles.primaryButton, width: "fit-content" }}
        disabled={!selected || checked}
        onClick={() => setChecked(true)}
      >
        Check answer
      </button>
      {checked ? (
        <div role="status" aria-live="polite" style={{
          lineHeight: 1.7,
          borderRadius: 10,
          padding: "10px 12px",
          background: correct ? "#ecfdf5" : "#fff7ed",
          border: `1px solid ${correct ? "#a7f3d0" : "#fed7aa"}`,
        }}>
          <strong>{correct ? "Correct!" : "Not quite. Try again."}</strong>
          <p style={paragraph}>{wrong ? (incorrectExplanation || explanation) : explanation}</p>
          {wrong ? (
            <button
              type="button"
              style={{ ...styles.secondaryButton, marginTop: 8 }}
              onClick={() => { setSelected(""); setChecked(false); }}
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function KnowledgeTest({ title, questions }) {
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={paragraph}>
        Choose A, B or C, then select <strong>Check answer</strong>.
        You can try again. This is practice only; it does not affect your assignment score.
      </p>
      {questions.map((question) => (
        <PracticeQuestion key={question.number} {...question} />
      ))}
    </div>
  );
}

export const WeekTimeSeparableGrammarBook = () => (
  <main style={pageWrap}>
    <header style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Kapitel 7 — Die Uhrzeit und der Tagesablauf</h1>
      <p style={paragraph}>Understanding time and daily routines: clock times, useful time words, parts of the day and separable verbs.</p>
    </header>

    <Section title="1. Die Uhrzeit — Telling the Time" subtitle="Wie spät ist es? / Wie viel Uhr ist es? — What time is it?">
      <p style={paragraph}>Answer with <strong>Es ist …</strong> to say what time it is.</p>
      <Table headers={["Time", "German"]} rows={clockRows} />
      <Note>
        <strong>Three rules:</strong> <strong>nach</strong> means past (Viertel nach sechs = 6:15);
        <strong> halb</strong> means halfway to the next hour (halb sieben = 6:30, NOT 7:30);
        <strong> vor</strong> means before/to (Viertel vor sieben = 6:45).
        <div>For 1:00, say <strong>ein Uhr</strong>, not eins Uhr.</div>
      </Note>
      <p style={paragraph}><strong>Wann beginnt der Kurs?</strong> — When does the course begin?</p>
      <p style={paragraph}><strong>Der Kurs beginnt um sieben Uhr.</strong> — The course begins at seven. Use <strong>um</strong> for an exact clock time.</p>
    </Section>

    <Section title="2. Zeitangaben — Important Time Expressions" subtitle="These words help you understand schedules, opening hours and appointments.">
      <Table headers={["German", "Meaning", "Example"]} rows={timeExpressionRows} />
      <Note>
        <strong>Compare:</strong> um 8 Uhr = at eight; ab 8 Uhr = starting at eight;
        von 8 bis 10 Uhr = from eight to ten; bis 10 Uhr = until ten;
        vor 8 Uhr = before eight; nach 8 Uhr = after eight.
      </Note>
      <p style={paragraph}>Die Bibliothek ist <strong>von 9 bis 17 Uhr</strong> geöffnet. — The library is open from 9 a.m. to 5 p.m. You can visit at 11:00, but it is closed at 18:00.</p>
      <p style={paragraph}><strong>Important:</strong> Viertel vor acht means exactly 7:45. But vor 8 Uhr can mean any time before eight.</p>
      <p style={paragraph}>With days: <strong>am Montag</strong> = on Monday; <strong>ab Montag</strong> = starting Monday; <strong>von Montag bis Freitag</strong> = Monday to Friday; <strong>bis Freitag</strong> = until Friday.</p>
      <p style={paragraph}>Use <strong>am</strong> with weekdays and <strong>um</strong> with exact clock times.</p>
    </Section>

    <Section title="3. Tageszeiten — Parts of the Day" subtitle="Describe when something normally happens.">
      <Table headers={["German", "Meaning", "Example"]} rows={daypartRows} />
      <Note>
        <strong>Times are approximate, not fixed:</strong> 10:00 is vormittags, 12:30 is mittags and 16:00 is nachmittags.
      </Note>
      <p style={paragraph}>Both <strong>am Morgen</strong> and <strong>morgens</strong> are useful. You can also say am Vormittag / vormittags, am Mittag / mittags, am Nachmittag / nachmittags and am Abend / abends.</p>
      <p style={paragraph}>Words ending in <strong>-s</strong> often describe regular or repeated activities: <strong>Ich lerne vormittags Deutsch.</strong> — I study German in the mornings.</p>
      <p style={paragraph}><strong>Spelling:</strong> morgen = tomorrow; morgens = in the mornings; Mittag = midday (noun); mittags = at midday (adverb).</p>
      <KnowledgeTest title="Knowledge Test 1 — Time and Time Expressions" questions={timeKnowledgeChecks} />
    </Section>

    <Section title="4. Trennbare Verben — Separable Verbs in Daily Life" subtitle="The prefix moves to the end of a simple present-tense main clause.">
      <Table headers={["Verb", "Meaning", "Example"]} rows={separableRows} />
      <Note>
        <strong>Pattern:</strong> subject + conjugated verb + other information + separable prefix.
        <div><strong>Ich stehe um 6 Uhr auf.</strong> — I get up at 6 o'clock.</div>
        <div>Start with a time phrase: <strong>Am Montag stehe ich um 6 Uhr auf.</strong></div>
        <div>Yes/no question: <strong>Stehst du um 6 Uhr auf?</strong></div>
      </Note>
      <p style={paragraph}><strong>Do not confuse:</strong> ab in <strong>ab 10 Uhr</strong> means starting at ten. The <strong>ab-</strong> in <strong>abholen</strong> is a separable verb prefix.</p>
      <KnowledgeTest title="Knowledge Test 2 — Separable Verbs" questions={separableKnowledgeChecks} />
    </Section>

    <Section title="5. Mein Tagesablauf — Putting Everything Together" subtitle="Read Anna's daily routine, then check the most important lesson rules.">
      <p style={paragraph}><strong>Mein Name ist Anna. Ich lerne Deutsch.</strong></p>
      <p style={paragraph}>Morgens stehe ich um halb sieben auf. Von 8 bis 10 Uhr habe ich Deutschunterricht. Der Unterricht fängt um 8 Uhr an. Nach dem Unterricht gehe ich nach Hause. Mittags esse ich mit meiner Familie. Nachmittags kaufe ich ein. Abends sehe ich fern. Um 22 Uhr gehe ich schlafen.</p>
      <Note>
        <strong>English:</strong> My name is Anna. I study German. In the morning, I get up at 6:30.
        I have German lessons from 8 to 10. The lesson begins at 8. After class, I go home.
        At midday, I eat with my family. In the afternoon, I go shopping.
        In the evening, I watch TV. At 10 p.m., I go to sleep.
      </Note>
      <p style={paragraph}><strong>Merke dir:</strong> um = at; ab = starting at; von … bis = from … to; vor = before; nach = after. Halb acht = 7:30; Viertel vor acht = 7:45.</p>
      <p style={paragraph}>Use morgens, vormittags, mittags, nachmittags, abends and nachts for parts of the day. With separable verbs: <strong>Ich stehe morgens um 7 Uhr auf.</strong></p>
    </Section>
  </main>
);

// The separate self-practice route remains available, without duplicating the
// explanations across multiple chapters of the main grammar notes.
export const WeekTimeSeparablePracticeBook = () => (
  <main style={pageWrap}>
    <section style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Kapitel 7 — Quick Practice</h1>
      <p style={paragraph}>Choose the answer, then reveal the explanation. This is unscored practice, not the A1-7 assignment.</p>
    </section>
    {lessonChecks.map((question) => <PracticeQuestion key={question.prompt} {...question} />)}
  </main>
);

export default WeekTimeSeparableGrammarBook;
