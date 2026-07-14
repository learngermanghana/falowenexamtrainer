import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const WORKBOOK_ROUTE = "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook";

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

const inputStyle = {
  width: "100%",
  maxWidth: 420,
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 16,
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

const normalize = (value = "") => String(value).trim().toLowerCase().replace(/\s+/g, " ");

const A1Day12TwentyFourHourClockDatesPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const setAnswer = (key, value) => setAnswers((current) => ({ ...current, [key]: value }));

  const results = useMemo(() => {
    const checks = {
      time1: normalize(answers.time1) === "vierzehn uhr zwanzig",
      time2: ["7:30", "07:30"].includes(normalize(answers.time2)),
      date1: normalize(answers.date1) === "der dritte februar",
      date2: normalize(answers.date2) === "der fünfundzwanzigste dezember",
      date3: normalize(answers.date3) === "am fünften mai",
      date4: normalize(answers.date4) === "03.02.2024",
    };

    return {
      checks,
      correct: Object.values(checks).filter(Boolean).length,
      total: Object.keys(checks).length,
    };
  }, [answers]);

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

      <Section title="Quick practice">
        <SubSection title="Write the answers">
          {[
            ["time1", "1. Say 14:20 formally in German.", "vierzehn Uhr zwanzig"],
            ["time2", "2. What time is halb acht?", "7:30"],
            ["date1", "3. Say 3 February in German.", "der dritte Februar"],
            ["date2", "4. Say 25 December in German.", "der fünfundzwanzigste Dezember"],
            ["date3", "5. Complete: Ich habe ___ Geburtstag. (5 May)", "am fünften Mai"],
            ["date4", "6. Write 3 February 2024 in German numerical format.", "03.02.2024"],
          ].map(([key, label, placeholder]) => (
            <label key={key} style={{ display: "grid", gap: 6 }}>
              <strong>{label}</strong>
              <input
                value={answers[key] || ""}
                onChange={(event) => setAnswer(key, event.target.value)}
                placeholder={placeholder}
                style={inputStyle}
              />
            </label>
          ))}
        </SubSection>

        <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => setShowResults(true)}>
          Check answers
        </button>

        {showResults ? (
          <div style={noteStyle} role="status">
            <strong>Score: {results.correct}/{results.total}</strong>
            <div>1. {results.checks.time1 ? "✅" : "❌"} vierzehn Uhr zwanzig</div>
            <div>2. {results.checks.time2 ? "✅" : "❌"} 7:30</div>
            <div>3. {results.checks.date1 ? "✅" : "❌"} der dritte Februar</div>
            <div>4. {results.checks.date2 ? "✅" : "❌"} der fünfundzwanzigste Dezember</div>
            <div>5. {results.checks.date3 ? "✅" : "❌"} am fünften Mai</div>
            <div>6. {results.checks.date4 ? "✅" : "❌"} 03.02.2024</div>
          </div>
        ) : null}
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
    </main>
  );
};

export default A1Day12TwentyFourHourClockDatesPage;
