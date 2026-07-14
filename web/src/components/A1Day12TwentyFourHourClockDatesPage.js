import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const WORKBOOK_ROUTE = "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook";
const KNOWLEDGE_TEST_PASS_MARK = 9;

const KNOWLEDGE_TEST_QUESTIONS = Object.freeze([
  {
    id: "time-1",
    topic: "24-hour clock",
    prompt: "How do you say 18:45 formally in German?",
    options: [
      "achtzehn Uhr fünfundvierzig",
      "acht Uhr fünfundvierzig",
      "neunzehn Uhr fünfzehn",
      "Viertel nach achtzehn",
    ],
    answer: "achtzehn Uhr fünfundvierzig",
    explanation: "Formal 24-hour time follows: hour + Uhr + minutes.",
  },
  {
    id: "time-2",
    topic: "24-hour clock",
    prompt: "What time is halb neun?",
    options: ["08:30", "09:30", "08:09", "20:30"],
    answer: "08:30",
    explanation: "halb neun means halfway to nine, so it is 08:30.",
  },
  {
    id: "time-3",
    topic: "24-hour clock",
    prompt: "Which 24-hour time means 2:15 PM?",
    options: ["02:15", "12:15", "14:15", "22:15"],
    answer: "14:15",
    explanation: "For afternoon times, add 12 to the hour: 2 PM becomes 14:00.",
  },
  {
    id: "time-4",
    topic: "24-hour clock",
    prompt: "A train leaves at 21:05. Which formal German time is correct?",
    options: [
      "einundzwanzig Uhr fünf",
      "neun Uhr fünf",
      "einundzwanzig Uhr fünfzig",
      "fünf nach einundzwanzig Uhr abends",
    ],
    answer: "einundzwanzig Uhr fünf",
    explanation: "Say the hour first, then Uhr, then the minutes.",
  },
  {
    id: "time-5",
    topic: "24-hour clock",
    prompt: "What does 00:00 mean?",
    options: ["Mittag", "Mitternacht", "halb null", "zwölf Uhr nachmittags"],
    answer: "Mitternacht",
    explanation: "00:00 is midnight: Mitternacht or null Uhr.",
  },
  {
    id: "time-6",
    topic: "24-hour clock",
    prompt: "Which time is Viertel vor zehn?",
    options: ["09:15", "09:45", "10:15", "10:45"],
    answer: "09:45",
    explanation: "Viertel vor zehn means fifteen minutes before ten.",
  },
  {
    id: "date-1",
    topic: "Dates",
    prompt: "Complete: Heute ist ___ . (3 February)",
    options: [
      "der dritte Februar",
      "am dritten Februar",
      "der drei Februar",
      "den dritten Februar",
    ],
    answer: "der dritte Februar",
    explanation: "After Heute ist, use der + ordinal number + month.",
  },
  {
    id: "date-2",
    topic: "Dates",
    prompt: "Complete: Ich habe ___ Geburtstag. (5 May)",
    options: ["der fünfte Mai", "am fünften Mai", "im fünften Mai", "am fünf Mai"],
    answer: "am fünften Mai",
    explanation: "After am, the ordinal adjective takes the ending -en.",
  },
  {
    id: "date-3",
    topic: "Dates",
    prompt: "How do you say 25 December as a date?",
    options: [
      "der fünfundzwanzigste Dezember",
      "der fünfundzwanzig Dezember",
      "am fünfundzwanzigste Dezember",
      "der fünfundzwanzigsten Dezember",
    ],
    answer: "der fünfundzwanzigste Dezember",
    explanation: "Numbers from 20 to 31 normally form the date ordinal with -ste.",
  },
  {
    id: "date-4",
    topic: "Dates",
    prompt: "How is 7 August 2026 written in German numerical format?",
    options: ["08.07.2026", "07.08.2026", "2026.08.07", "07/08/26"],
    answer: "07.08.2026",
    explanation: "German numerical dates normally follow day.month.year.",
  },
  {
    id: "date-5",
    topic: "Dates",
    prompt: "Which ordinal form is correct for the number 8 in a date?",
    options: ["achte", "achtte", "achtste", "achten"],
    answer: "achte",
    explanation: "The special date form is achte: der achte August.",
  },
  {
    id: "date-6",
    topic: "Dates",
    prompt: "Complete: Der Kurs beginnt ___ . (20 June)",
    options: [
      "der zwanzigste Juni",
      "am zwanzigsten Juni",
      "im zwanzigsten Juni",
      "am zwanzigste Juni",
    ],
    answer: "am zwanzigsten Juni",
    explanation: "A date after beginnen is commonly introduced with am + ordinal ending -en.",
  },
]);

const pageStyle = {
  ...styles.container,
  display: "grid",
  gap: 16,
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  marginBottom: 0,
};

const subsectionStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 10,
  background: "#ffffff",
};

const noteStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 12,
  background: "#eff6ff",
  color: "#1e3a8a",
  lineHeight: 1.7,
};

const tipStyle = {
  border: "1px solid #fde68a",
  borderRadius: 12,
  padding: 12,
  background: "#fffbeb",
  color: "#92400e",
  lineHeight: 1.7,
};

const exampleStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#f8fbff",
  lineHeight: 1.7,
};

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const SubSection = ({ title, children }) => (
  <div style={subsectionStyle}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    {children}
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} style={{ textAlign: "left", padding: "10px 8px", borderBottom: "2px solid #dbeafe" }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`${rowIndex}-${row[0]}`}>
            {row.map((cell, cellIndex) => (
              <td key={`${cellIndex}-${cell}`} style={{ padding: "10px 8px", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const A1Day12TwentyFourHourClockDatesPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const setAnswer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setShowResults(false);
  };

  const results = useMemo(() => {
    const correct = KNOWLEDGE_TEST_QUESTIONS.filter(
      (question) => answers[question.id] === question.answer,
    ).length;
    const answered = KNOWLEDGE_TEST_QUESTIONS.filter(
      (question) => Boolean(answers[question.id]),
    ).length;

    return {
      answered,
      correct,
      total: KNOWLEDGE_TEST_QUESTIONS.length,
      passed: correct >= KNOWLEDGE_TEST_PASS_MARK,
    };
  }, [answers]);

  const resetTest = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <main style={pageStyle} data-a1-day12-grammar-notes="true">
      <header style={{ ...cardStyle, border: "1px solid #93c5fd", background: "linear-gradient(135deg, #eff6ff, #ffffff 65%)" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase" }}>
          A1 · Day 12 · Chapter 8 · Grammar Notes
        </p>
        <h1 style={{ ...styles.title, margin: 0 }}>The 24-Hour Clock and Dates</h1>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          First learn how to read the 24-hour clock. Then learn the basic German date pattern with a month and an ordinal number.
        </p>
        <div style={noteStyle}>
          <strong>Date focus for this chapter:</strong> say the date with <strong>der + ordinal number + month</strong>, for example <strong>der dritte Februar</strong>. You will practise dates again in the next chapter through more sentence-building activities.
        </div>
      </header>

      <Section title="Part 1: The 24-hour clock">
        <SubSection title="1. Why German uses 24-hour time">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Timetables, appointments, train information and official announcements often use numbers from 00:00 to 23:59. There is no AM or PM.
          </p>
          <Table
            headers={["English idea", "24-hour time", "German"]}
            rows={[
              ["midnight", "00:00", "null Uhr / Mitternacht"],
              ["8 AM", "08:00", "acht Uhr"],
              ["2 PM", "14:00", "vierzehn Uhr"],
              ["8 PM", "20:00", "zwanzig Uhr"],
            ]}
          />
        </SubSection>

        <SubSection title="2. Say the exact time">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In formal 24-hour time, say the hour first, then <strong>Uhr</strong>, then the minutes.
          </p>
          <Table
            headers={["Time", "German"]}
            rows={[
              ["07:15", "sieben Uhr fünfzehn"],
              ["14:20", "vierzehn Uhr zwanzig"],
              ["16:35", "sechzehn Uhr fünfunddreißig"],
              ["21:45", "einundzwanzig Uhr fünfundvierzig"],
            ]}
          />
          <div style={tipStyle}>
            Do not use <strong>halb</strong> for every time. For 14:20, say <strong>vierzehn Uhr zwanzig</strong>.
          </div>
        </SubSection>

        <SubSection title="3. Everyday spoken time">
          <Table
            headers={["Time", "Formal", "Everyday spoken German"]}
            rows={[
              ["07:30", "sieben Uhr dreißig", "halb acht"],
              ["09:15", "neun Uhr fünfzehn", "Viertel nach neun"],
              ["09:45", "neun Uhr fünfundvierzig", "Viertel vor zehn"],
              ["13:10", "dreizehn Uhr zehn", "zehn nach eins"],
            ]}
          />
          <div style={noteStyle}>
            <strong>halb acht</strong> means halfway to eight, so it is <strong>7:30</strong>, not 8:30.
          </div>
        </SubSection>
      </Section>

      <Section title="Part 2: How to say dates in German">
        <SubSection title="1. Learn the months">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The month comes after the ordinal number when you say a date.
          </p>
          <Table
            headers={["1–4", "5–8", "9–12"]}
            rows={[
              ["Januar", "Mai", "September"],
              ["Februar", "Juni", "Oktober"],
              ["März", "Juli", "November"],
              ["April", "August", "Dezember"],
            ]}
          />
        </SubSection>

        <SubSection title="2. Build ordinal numbers">
          <div style={noteStyle}>
            Numbers 1–19 usually take <strong>-te</strong>. Numbers 20–31 usually take <strong>-ste</strong>.
          </div>
          <Table
            headers={["Number", "Ordinal for a date", "Example"]}
            rows={[
              ["1.", "erste", "der erste Januar"],
              ["2.", "zweite", "der zweite März"],
              ["3.", "dritte", "der dritte Februar"],
              ["5.", "fünfte", "der fünfte Mai"],
              ["7.", "siebte", "der siebte Juni"],
              ["8.", "achte", "der achte August"],
              ["20.", "zwanzigste", "der zwanzigste April"],
              ["25.", "fünfundzwanzigste", "der fünfundzwanzigste Dezember"],
              ["31.", "einunddreißigste", "der einunddreißigste Oktober"],
            ]}
          />
          <div style={tipStyle}>
            Important special forms: <strong>erste, dritte, siebte, achte</strong>.
          </div>
        </SubSection>

        <SubSection title="3. The basic spoken date pattern">
          <div style={exampleStyle}>
            <strong>Welches Datum haben wir heute?</strong><br />
            Heute ist <strong>der dritte Februar</strong>.
          </div>
          <div style={exampleStyle}>
            <strong>Wann ist dein Geburtstag?</strong><br />
            Mein Geburtstag ist <strong>der fünfte Mai</strong>.
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use <strong>der + ordinal number + month</strong> after <strong>Heute ist ...</strong> or <strong>Mein Geburtstag ist ...</strong>.
          </p>
        </SubSection>

        <SubSection title="4. Dates with am">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            After <strong>am</strong>, the ending changes to <strong>-en</strong>.
          </p>
          <Table
            headers={["Without am", "With am"]}
            rows={[
              ["der dritte Februar", "am dritten Februar"],
              ["der fünfte Mai", "am fünften Mai"],
              ["der zwanzigste Juni", "am zwanzigsten Juni"],
            ]}
          />
          <div style={exampleStyle}>
            Der Kurs beginnt <strong>am dritten Februar</strong>.<br />
            Ich habe <strong>am fünften Mai</strong> Geburtstag.
          </div>
        </SubSection>

        <SubSection title="5. Writing the date">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            German normally writes the date as <strong>day.month.year</strong>.
          </p>
          <Table
            headers={["Written", "Said"]}
            rows={[
              ["03.02.2024", "der dritte Februar zweitausendvierundzwanzig"],
              ["05.05.2025", "der fünfte Mai zweitausendfünfundzwanzig"],
              ["25.12.2026", "der fünfundzwanzigste Dezember zweitausendsechsundzwanzig"],
            ]}
          />
          <div style={tipStyle}>
            The main goal now is to say the day and month correctly. You will practise full date sentences again in the next chapter.
          </div>
        </SubSection>
      </Section>

      <Section title="What to remember">
        <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.7 }}>
          <li>Formal time: hour + Uhr + minutes.</li>
          <li><strong>halb acht</strong> means 7:30.</li>
          <li>Learn the twelve German month names.</li>
          <li>Say dates with <strong>der + ordinal number + month</strong>.</li>
          <li>After <strong>am</strong>, use forms such as <strong>am dritten</strong> and <strong>am fünften</strong>.</li>
          <li>You will practise dates again in the next chapter.</li>
        </ul>
        <a href={WORKBOOK_ROUTE} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open the Day 12 workbook
        </a>
      </Section>

      <Section title="Knowledge test: 24-hour clock and dates">
        <div style={noteStyle}>
          <strong>12 questions · Pass mark: {KNOWLEDGE_TEST_PASS_MARK}/12</strong>
          <div>Answer all six clock questions and all six date questions before checking your score. Answers are not shown inside the question fields.</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
          <strong>Answered: {results.answered}/{results.total}</strong>
          <span style={{ color: "#64748b" }}>Choose one answer for every question.</span>
        </div>

        <div style={{ display: "grid", gap: 12 }} data-a1-day12-knowledge-test="true">
          {KNOWLEDGE_TEST_QUESTIONS.map((question, index) => {
            const selectedAnswer = answers[question.id] || "";
            const isCorrect = selectedAnswer === question.answer;
            const resultBorder = showResults
              ? isCorrect
                ? "#86efac"
                : "#fca5a5"
              : "#e2e8f0";

            return (
              <fieldset
                key={question.id}
                style={{
                  ...subsectionStyle,
                  margin: 0,
                  borderColor: resultBorder,
                  background: showResults ? (isCorrect ? "#f0fdf4" : "#fff7f7") : "#ffffff",
                }}
              >
                <legend style={{ padding: "0 6px", fontWeight: 800 }}>
                  {index + 1}. {question.prompt}
                </legend>
                <span style={{ color: "#475569", fontSize: 13, fontWeight: 800 }}>
                  {question.topic}
                </span>

                <div style={{ display: "grid", gap: 8 }}>
                  {question.options.map((option) => {
                    const selected = selectedAnswer === option;
                    return (
                      <label
                        key={option}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          padding: "10px 12px",
                          border: `1px solid ${selected ? "#2563eb" : "#cbd5e1"}`,
                          borderRadius: 10,
                          background: selected ? "#eff6ff" : "#ffffff",
                          cursor: "pointer",
                          lineHeight: 1.5,
                        }}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={selected}
                          onChange={(event) => setAnswer(question.id, event.target.value)}
                          style={{ marginTop: 3 }}
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                {showResults ? (
                  <div
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      background: isCorrect ? "#dcfce7" : "#fee2e2",
                      color: isCorrect ? "#166534" : "#991b1b",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>{isCorrect ? "Correct." : `Correct answer: ${question.answer}`}</strong>
                    <div>{question.explanation}</div>
                  </div>
                ) : null}
              </fieldset>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            type="button"
            style={{
              ...styles.primaryButton,
              width: "fit-content",
              opacity: results.answered === results.total ? 1 : 0.55,
              cursor: results.answered === results.total ? "pointer" : "not-allowed",
            }}
            disabled={results.answered !== results.total}
            onClick={() => setShowResults(true)}
          >
            Check my knowledge
          </button>
          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "fit-content" }}
            onClick={resetTest}
          >
            Reset test
          </button>
        </div>

        {showResults ? (
          <div
            style={{
              ...noteStyle,
              borderColor: results.passed ? "#86efac" : "#fca5a5",
              background: results.passed ? "#f0fdf4" : "#fff7f7",
              color: results.passed ? "#166534" : "#991b1b",
            }}
            role="status"
          >
            <strong>Score: {results.correct}/{results.total}</strong>
            <div>
              {results.passed
                ? "Passed. You are ready to continue to the workbook."
                : "Not passed yet. Review the clock and date rules, reset the test, and try again."}
            </div>
          </div>
        ) : null}
      </Section>
    </main>
  );
};

export default A1Day12TwentyFourHourClockDatesPage;
