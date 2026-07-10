import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const pageWrap = {
  ...styles.container,
  display: "grid",
  gap: 16,
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const paragraph = {
  margin: 0,
  lineHeight: 1.7,
};

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.8,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 560,
};

const cellStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "10px 8px",
  textAlign: "left",
  verticalAlign: "top",
  lineHeight: 1.6,
};

const chipStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 999,
  padding: "6px 10px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontWeight: 700,
  fontSize: 13,
};

const miniBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 8,
};

const calloutStyles = {
  default: {
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#111827",
  },
  warning: {
    border: "1px solid #fed7aa",
    background: "#fff7ed",
    color: "#7c2d12",
  },
  success: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#14532d",
  },
  accent: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1e3a8a",
  },
};

const Section = ({ title, subtitle, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{title}</h2>
      {subtitle ? <p style={{ ...paragraph, color: "#475569" }}>{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const Callout = ({ title, children, variant = "default" }) => {
  const tone = calloutStyles[variant] || calloutStyles.default;
  return (
    <div
      style={{
        ...tone,
        borderRadius: 14,
        padding: 14,
        display: "grid",
        gap: 8,
        lineHeight: 1.7,
      }}
    >
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
};

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} style={{ ...cellStyle, fontWeight: 900, color: "#0f172a" }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={`${rowIndex}-${cellIndex}`} style={cellStyle}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ChipRow = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map((item) => (
      <span key={item} style={chipStyle}>{item}</span>
    ))}
  </div>
);

const PracticeQuestion = ({ prompt, options, answer, explanation }) => {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const correct = selected === answer;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, display: "grid", gap: 10, background: "#fff" }}>
      <strong>{prompt}</strong>
      <div style={{ display: "grid", gap: 8 }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelected(option);
              setChecked(false);
            }}
            style={{
              ...styles.secondaryButton,
              justifyContent: "flex-start",
              textAlign: "left",
              borderColor: selected === option ? "#2563eb" : undefined,
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => setChecked(true)}>
        Check
      </button>
      {checked ? (
        <Callout variant={correct ? "success" : "warning"} title={correct ? "Correct" : "Not quite"}>
          <div><strong>Answer:</strong> {answer}</div>
          {explanation ? <div>{explanation}</div> : null}
        </Callout>
      ) : null}
    </div>
  );
};

const daysRows = [
  ["Montag", "Monday", "am Montag"],
  ["Dienstag", "Tuesday", "am Dienstag"],
  ["Mittwoch", "Wednesday", "am Mittwoch"],
  ["Donnerstag", "Thursday", "am Donnerstag"],
  ["Freitag", "Friday", "am Freitag"],
  ["Samstag", "Saturday", "am Samstag"],
  ["Sonntag", "Sunday", "am Sonntag"],
];

const timeRows = [
  ["1:00", "ein Uhr", "one o'clock"],
  ["2:00", "zwei Uhr", "two o'clock"],
  ["1:15", "Viertel nach eins", "quarter past one"],
  ["1:30", "halb zwei", "30 minutes before two = 1:30"],
  ["1:45", "Viertel vor zwei", "quarter to two"],
  ["6:30", "halb sieben", "30 minutes before seven = 6:30"],
  ["7:30", "halb acht", "30 minutes before eight = 7:30"],
  ["8:45", "Viertel vor neun", "quarter before nine = 8:45"],
];

const separableRows = [
  ["aufstehen", "to get up", "Ich stehe um sechs Uhr auf."],
  ["einkaufen", "to shop", "Wir kaufen am Samstag ein."],
  ["anrufen", "to call", "Ich rufe meine Mutter am Abend an."],
  ["fernsehen", "to watch TV", "Er sieht am Abend fern."],
  ["aufmachen", "to open", "Ich mache das Fenster auf."],
  ["zumachen", "to close", "Sie macht die Tür zu."],
  ["aufräumen", "to tidy up", "Wir räumen am Sonntag auf."],
  ["mitkommen", "to come along", "Kommst du am Freitag mit?"],
  ["anfangen", "to begin", "Der Kurs fängt um acht Uhr an."],
  ["mitbringen", "to bring along", "Ich bringe mein Buch mit."],
];

const timePractice = [
  {
    prompt: "What is 7:30 in spoken German?",
    options: ["halb sieben", "halb acht", "Viertel nach sieben"],
    answer: "halb acht",
    explanation: "7:30 is 30 minutes before 8:00, so German says halb acht.",
  },
  {
    prompt: "What does halb sieben mean?",
    options: ["7:30", "6:30", "7:00"],
    answer: "6:30",
    explanation: "halb sieben means 30 minutes before seven, so it is 6:30.",
  },
  {
    prompt: "What is Viertel vor neun?",
    options: ["8:15", "8:45", "9:15"],
    answer: "8:45",
    explanation: "Viertel vor neun means quarter before nine, so it is 8:45.",
  },
];

const knowledgeTest = [
  {
    prompt: "1) Which phrase means 'on Monday'?",
    options: ["in Montag", "am Montag", "um Montag"],
    answer: "am Montag",
    explanation: "Use am with days of the week: am Montag, am Dienstag, am Freitag.",
  },
  {
    prompt: "2) How do you say 1:00 in German?",
    options: ["eins Uhr", "ein Uhr", "eine Uhr"],
    answer: "ein Uhr",
    explanation: "For 1:00, German says ein Uhr.",
  },
  {
    prompt: "3) What does halb acht mean?",
    options: ["8:30", "7:30", "8:00"],
    answer: "7:30",
    explanation: "halb acht means 30 minutes before eight.",
  },
  {
    prompt: "4) What is 6:30 in spoken German?",
    options: ["halb sechs", "halb sieben", "Viertel nach sechs"],
    answer: "halb sieben",
    explanation: "6:30 is 30 minutes before seven, so it is halb sieben.",
  },
  {
    prompt: "5) What is Viertel nach acht?",
    options: ["8:15", "7:45", "8:45"],
    answer: "8:15",
    explanation: "Viertel nach acht means quarter after eight.",
  },
  {
    prompt: "6) What is Viertel vor acht?",
    options: ["8:15", "7:45", "8:45"],
    answer: "7:45",
    explanation: "Viertel vor acht means quarter before eight.",
  },
  {
    prompt: "7) Choose the correct sentence with aufstehen.",
    options: ["Ich aufstehe um sechs Uhr.", "Ich stehe um sechs Uhr auf.", "Ich stehe auf um sechs Uhr."],
    answer: "Ich stehe um sechs Uhr auf.",
    explanation: "In a simple present-tense sentence, the prefix goes to the end.",
  },
  {
    prompt: "8) Choose the correct sentence with anrufen.",
    options: ["Ich anrufe meine Mutter.", "Ich rufe meine Mutter an.", "Ich rufe an meine Mutter."],
    answer: "Ich rufe meine Mutter an.",
    explanation: "anrufen splits: Ich rufe ... an.",
  },
  {
    prompt: "9) Which sentence combines day, time and separable verb correctly?",
    options: ["Am Montag ich stehe halb sieben auf.", "Am Montag stehe ich um halb sieben auf.", "Montag stehe ich halb sieben auf."],
    answer: "Am Montag stehe ich um halb sieben auf.",
    explanation: "Use am + day, um + time, and put the separable prefix at the end.",
  },
  {
    prompt: "10) What is the correct order in a simple separable-verb sentence?",
    options: ["Subject + conjugated verb + information + prefix", "Subject + prefix + conjugated verb", "Prefix + subject + infinitive"],
    answer: "Subject + conjugated verb + information + prefix",
    explanation: "Example: Ich stehe um sechs Uhr auf.",
  },
];

export const WeekTimeSeparableGrammarBook = () => (
  <main style={pageWrap}>
    <div style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Grammar Book: Meine Woche, die Uhrzeit und trennbare Verben</h1>
      <p style={paragraph}>
        Learn days of the week, the 12-hour clock in German, <strong>halb</strong>, <strong>Viertel</strong>, and simple separable verbs for daily routines.
      </p>
      <ChipRow items={["Wochentage", "12-hour clock", "halb", "Viertel", "trennbare Verben", "knowledge test"]} />
    </div>

    <Section title="1) Days of the week" subtitle="Days of the week are nouns in German, so they begin with a capital letter.">
      <Table headers={["German", "English", "Useful phrase"]} rows={daysRows} />
      <Callout title='Important note: use "am" with days'>
        <ul style={listStyle}>
          <li><strong>am Montag</strong> = on Monday</li>
          <li><strong>am Freitag</strong> = on Friday</li>
          <li>Example: <strong>Am Montag lerne ich Deutsch.</strong></li>
        </ul>
      </Callout>
    </Section>

    <Section title="2) The 12-hour clock in German" subtitle="In everyday spoken German, people often use the 12-hour system.">
      <Table headers={["Time", "German", "Meaning"]} rows={timeRows} />
      <Callout title='A1 note: say "ein Uhr"' variant="warning">
        For <strong>1:00</strong>, say <strong>ein Uhr</strong>, not <strong>eins Uhr</strong>.
      </Callout>
      <Callout title="Useful speaking pattern" variant="accent">
        Use <strong>um</strong> before the time: <strong>um sieben Uhr</strong>, <strong>um halb acht</strong>, <strong>um Viertel nach acht</strong>.
      </Callout>
    </Section>

    <Section title="3) The clear halb rule" subtitle="This is the most important time rule in this lesson.">
      <Callout title='Rule: "halb + hour" means 30 minutes before the named hour' variant="accent">
        <div style={{ display: "grid", gap: 8 }}>
          <div>The hour after <strong>halb</strong> is the target hour. You are moving toward that hour.</div>
          <div><strong>halb sieben</strong> = 30 minutes before seven = <strong>6:30</strong></div>
          <div><strong>halb acht</strong> = 30 minutes before eight = <strong>7:30</strong></div>
          <div><strong>halb zwei</strong> = 30 minutes before two = <strong>1:30</strong></div>
        </div>
      </Callout>

      <Callout title="Simple memory formula" variant="success">
        <strong>halb + 7 = 6:30</strong>. The number after <strong>halb</strong> is the hour you are moving toward, not the hour you are already in.
      </Callout>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div style={miniBox}>
          <strong>Think in English</strong>
          <span>halb sieben = halfway to seven = 6:30</span>
        </div>
        <div style={miniBox}>
          <strong>Think in German</strong>
          <span>Es ist halb sieben. = It is 6:30.</span>
        </div>
        <div style={miniBox}>
          <strong>Daily routine example</strong>
          <span>Ich stehe um halb sieben auf. = I get up at 6:30.</span>
        </div>
      </div>
    </Section>

    <Section title="4) Viertel nach and Viertel vor" subtitle="These two are easier because they work like quarter past and quarter to.">
      <Table
        headers={["German", "Meaning", "Time"]}
        rows={[
          ["Viertel nach acht", "quarter after eight", "8:15"],
          ["Viertel vor acht", "quarter before eight", "7:45"],
          ["Viertel nach sechs", "quarter after six", "6:15"],
          ["Viertel vor neun", "quarter before nine", "8:45"],
        ]}
      />
      <Callout title="Small difference" variant="accent">
        <strong>nach</strong> means after/past. <strong>vor</strong> means before/to. Example: <strong>Viertel nach acht</strong> = 8:15, but <strong>Viertel vor acht</strong> = 7:45.
      </Callout>
    </Section>

    <Section title="5) Separable verbs" subtitle="Some German daily routine verbs split in simple present-tense sentences.">
      <Table headers={["Infinitive", "Meaning", "Example sentence"]} rows={separableRows} />
      <Callout title="Main rule" variant="accent">
        In a simple present-tense sentence, the main verb is conjugated in position 2, and the separable prefix goes to the end.
      </Callout>
      <Table
        headers={["Step", "Example"]}
        rows={[
          ["Infinitive", "aufstehen = to get up"],
          ["Conjugated verb", "ich stehe"],
          ["Extra information", "um sechs Uhr"],
          ["Prefix at the end", "auf"],
          ["Full sentence", "Ich stehe um sechs Uhr auf."],
        ]}
      />
      <Callout title="Questions with separable verbs" variant="success">
        In a yes/no question, the conjugated verb comes first and the prefix still goes to the end: <strong>Stehst du um sechs Uhr auf?</strong> / <strong>Kommst du am Freitag mit?</strong>
      </Callout>
    </Section>

    <Section title="6) Put everything together" subtitle="Use day + time + separable verb.">
      <Table
        headers={["Sentence", "Meaning"]}
        rows={[
          ["Am Montag stehe ich um halb sieben auf.", "On Monday I get up at 6:30."],
          ["Am Dienstag rufe ich meine Mutter um Viertel nach acht an.", "On Tuesday I call my mother at 8:15."],
          ["Am Samstag kaufen wir um vier Uhr ein.", "On Saturday we shop at 4:00."],
          ["Am Sonntag räume ich mein Zimmer auf.", "On Sunday I tidy my room."],
          ["Der Deutschkurs fängt um halb neun an.", "The German course starts at 8:30."],
        ]}
      />
      <Callout title="Sentence pattern" variant="accent">
        <strong>Am + day</strong> + conjugated verb + subject + <strong>um + time</strong> + other words + separable prefix.
        <br />Example: <strong>Am Montag stehe ich um halb sieben auf.</strong>
      </Callout>
    </Section>

    <Section title="7) Mini practice" subtitle="Check if the halb rule is clear now.">
      <div style={{ display: "grid", gap: 14 }}>
        {timePractice.map((question) => <PracticeQuestion key={question.prompt} {...question} />)}
      </div>
    </Section>

    <Section title="8) Knowledge test" subtitle="Answer these questions after studying the lesson.">
      <div style={{ display: "grid", gap: 14 }}>
        {knowledgeTest.map((question) => <PracticeQuestion key={question.prompt} {...question} />)}
      </div>
    </Section>

    <Section title="9) Final summary">
      <Callout title="Remember" variant="success">
        <ul style={listStyle}>
          <li>Use <strong>am</strong> with days: <strong>am Montag</strong>.</li>
          <li>Use <strong>um</strong> with time: <strong>um sieben Uhr</strong>, <strong>um halb acht</strong>.</li>
          <li><strong>halb sieben = 6:30</strong>, not 7:30.</li>
          <li><strong>halb acht = 7:30</strong>, not 8:30.</li>
          <li><strong>Viertel vor acht = 7:45</strong>.</li>
          <li>Separable verbs split: <strong>Ich stehe ... auf.</strong></li>
          <li>Full pattern: <strong>Am Montag stehe ich um halb sieben auf.</strong></li>
        </ul>
      </Callout>
    </Section>
  </main>
);

export const WeekTimeSeparablePracticeBook = () => (
  <main style={pageWrap}>
    <div style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Practice Check: Meine Woche, Uhrzeit und trennbare Verben</h1>
      <p style={paragraph}>Use this short practice to check the important A1 rules.</p>
    </div>

    <Section title="Quick practice">
      <div style={{ display: "grid", gap: 14 }}>
        <PracticeQuestion
          prompt='Which one means "on Monday"?'
          options={["in Montag", "am Montag", "um Montag"]}
          answer="am Montag"
          explanation='Use "am" with days of the week.'
        />
        <PracticeQuestion
          prompt="What is 7:30 in common spoken German?"
          options={["halb sieben", "halb acht", "Viertel nach sieben"]}
          answer="halb acht"
          explanation="German says 30 minutes before eight. That is halb acht."
        />
        <PracticeQuestion
          prompt="What does halb sieben mean?"
          options={["7:30", "6:30", "7:00"]}
          answer="6:30"
          explanation="halb sieben means 30 minutes before seven."
        />
        <PracticeQuestion
          prompt='Choose the correct sentence with "aufstehen".'
          options={["Ich aufstehe um sechs Uhr.", "Ich stehe um sechs Uhr auf.", "Ich stehe auf um sechs Uhr."]}
          answer="Ich stehe um sechs Uhr auf."
          explanation="In a simple sentence, the separable prefix goes to the end."
        />
      </div>
    </Section>

    <Section title="Knowledge test">
      <div style={{ display: "grid", gap: 14 }}>
        {knowledgeTest.map((question) => <PracticeQuestion key={question.prompt} {...question} />)}
      </div>
    </Section>
  </main>
);

export default WeekTimeSeparableGrammarBook;
