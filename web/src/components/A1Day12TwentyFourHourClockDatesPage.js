import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const WORKBOOK_ROUTE = "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook";
const KNOWLEDGE_TEST_PASS_MARK = 4;

const KNOWLEDGE_TEST_QUESTIONS = Object.freeze([
  {
    id: "time-1",
    topic: "24-hour clock",
    prompt: "What is 7:00 PM in the German 24-hour clock?",
    options: ["17:00", "07:00", "19:00"],
    answer: "19:00",
    explanation: "Seven in the evening is 19:00. Add 12 to the hour after noon.",
  },
  {
    id: "time-2",
    topic: "Exact minutes",
    prompt: "How do you say 14:21 in German?",
    options: ["vierzehn Uhr zwölf", "vierzehn Uhr einundzwanzig", "vier Uhr einundzwanzig"],
    answer: "vierzehn Uhr einundzwanzig",
    explanation: "Say the hour + Uhr + minutes: vierzehn Uhr einundzwanzig.",
  },
  {
    id: "time-3",
    topic: "12-hour clock",
    prompt: "What does „acht Uhr abends“ mean?",
    options: ["20:00", "08:00", "18:00"],
    answer: "20:00",
    explanation: "Acht Uhr abends is eight in the evening: 20:00.",
  },
  {
    id: "month-1",
    topic: "Months",
    prompt: "Which month comes after März?",
    options: ["Mai", "Januar", "April"],
    answer: "April",
    explanation: "März is March, and April comes next.",
  },
  {
    id: "date-1",
    topic: "Dates",
    prompt: "How do you say 5. Juli in German when giving today's date?",
    options: ["der fünf Juli", "der fünfte Juli", "der fünfzehnte Juli"],
    answer: "der fünfte Juli",
    explanation: "The fifth takes the ordinal form fünfte.",
  },
  {
    id: "date-2",
    topic: "Dates",
    prompt: "How do you say 23. Oktober in German when giving today's date?",
    options: ["der dreiundzwanzigste Oktober", "der dreiundzwanzig Oktober", "der dreizehnte Oktober"],
    answer: "der dreiundzwanzigste Oktober",
    explanation: "From the 20th onward, ordinal day numbers normally take -ste.",
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
        <h1 style={{ ...styles.title, margin: 0 }}>Uhrzeit und Datum · The 24-Hour Clock and Dates</h1>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Learn to change AM and PM into German time, read exact minutes, name the twelve months and say the day and month of a date.
        </p>
        <div style={noteStyle}>
          <strong>Today:</strong> clock times, months and dates with the day and month only. We will learn years and revise time prepositions in the next chapter.
        </div>
      </header>

      <Section title="1. From AM / PM to 24-hour time">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          English often uses AM and PM. German timetables and appointments usually use the 24-hour clock.
          In everyday spoken German, you can say <strong>morgens</strong> (in the morning) or <strong>abends</strong> (in the evening) to make a 12-hour time clear.
        </p>
        <Table
          headers={["English", "24-hour clock", "Spoken German"]}
          rows={[
            ["6:00 AM", "06:00", "sechs Uhr morgens"],
            ["6:00 PM", "18:00", "sechs Uhr abends"],
            ["9:00 AM", "09:00", "neun Uhr morgens"],
            ["9:00 PM", "21:00", "neun Uhr abends"],
            ["12:00 PM (noon)", "12:00", "zwölf Uhr mittags"],
            ["12:00 AM (midnight)", "00:00", "null Uhr / Mitternacht"],
          ]}
        />
        <div style={tipStyle}>
          <strong>Rule:</strong> For 1 PM to 11 PM, add 12 to the hour: 3 PM → 15:00.
          For example, 18:00 can be read as <strong>achtzehn Uhr</strong> or <strong>sechs Uhr abends</strong>.
        </div>
      </Section>

      <Section title="2. Read exact minutes">
        <div style={noteStyle}>
          <strong>Hour + Uhr + minutes.</strong> Say the minutes as one number, not digit by digit:
          43 = <strong>dreiundvierzig</strong>, 21 = <strong>einundzwanzig</strong>.
        </div>
        <Table
          headers={["Time", "German"]}
          rows={[
            ["13:43", "dreizehn Uhr dreiundvierzig"],
            ["02:21", "zwei Uhr einundzwanzig"],
            ["14:21", "vierzehn Uhr einundzwanzig"],
            ["07:05", "sieben Uhr fünf"],
            ["16:30", "sechzehn Uhr dreißig"],
            ["19:47", "neunzehn Uhr siebenundvierzig"],
            ["23:58", "dreiundzwanzig Uhr achtundfünfzig"],
          ]}
        />
        <div style={exampleStyle}>
          <strong>A:</strong> Wie spät ist es? (What time is it?)<br />
          <strong>B:</strong> Es ist dreizehn Uhr dreiundvierzig. (It is 1:43 PM.)
        </div>
      </Section>

      <Section title="3. Die Monate · The 12 months">
        <p style={{ margin: 0 }}>German month names always begin with a capital letter.</p>
        <Table
          headers={["English", "Deutsch"]}
          rows={[
            ["January", "Januar"], ["February", "Februar"], ["March", "März"],
            ["April", "April"], ["May", "Mai"], ["June", "Juni"],
            ["July", "Juli"], ["August", "August"], ["September", "September"],
            ["October", "Oktober"], ["November", "November"], ["December", "Dezember"],
          ]}
        />
      </Section>

      <Section title="4. Das Datum · Day and month">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Write the <strong>day first, then the month</strong>: 3. Mai, 12. August, 25. Dezember.
          When saying the date, use an <strong>ordinal number</strong> (first, second, third).
        </p>
        <div style={noteStyle}>
          Most day numbers from <strong>4 to 19</strong> use <strong>-te</strong>.
          From <strong>20 to 31</strong>, use <strong>-ste</strong>.
          Remember special forms: <strong>erste, dritte, siebte, achte</strong>.
        </div>
        <Table
          headers={["Day", "Spoken date form"]}
          rows={[
            ["1.", "der erste"], ["2.", "der zweite"], ["3.", "der dritte"],
            ["4.", "der vierte"], ["5.", "der fünfte"], ["7.", "der siebte"],
            ["8.", "der achte"], ["10.", "der zehnte"], ["15.", "der fünfzehnte"],
            ["20.", "der zwanzigste"], ["21.", "der einundzwanzigste"],
            ["30.", "der dreißigste"], ["31.", "der einunddreißigste"],
          ]}
        />
        <Table
          headers={["Written date", "Spoken German"]}
          rows={[
            ["01.01.", "der erste Januar"], ["03.05.", "der dritte Mai"],
            ["12.08.", "der zwölfte August"],
            ["21.09.", "der einundzwanzigste September"],
            ["31.12.", "der einunddreißigste Dezember"],
          ]}
        />
        <div style={exampleStyle}>
          <strong>A:</strong> Welches Datum ist heute? (What is today's date?)<br />
          <strong>B:</strong> Heute ist der dritte Mai. (Today is 3 May.)
        </div>
      </Section>

      <Section title="What to remember">
        <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.7 }}>
          <li>6 AM = sechs Uhr morgens; 6 PM = sechs Uhr abends / 18:00.</li>
          <li>Exact minutes: hour + Uhr + minute number (13:43 → dreizehn Uhr dreiundvierzig).</li>
          <li>Learn all twelve German month names.</li>
          <li>Say the day with an ordinal: Heute ist der dritte Mai.</li>
          <li>Years and time-preposition revision come in the next chapter.</li>
        </ul>
        <a href={WORKBOOK_ROUTE} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open the Day 12 workbook
        </a>
      </Section>

      <Section title="Knowledge test: 24-hour clock and dates">
        <div style={noteStyle}>
          <strong>6 questions · Pass mark: {KNOWLEDGE_TEST_PASS_MARK}/6</strong>
          <div>Answer all six multiple-choice questions before checking your score. Answers are not shown inside the question fields.</div>
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
