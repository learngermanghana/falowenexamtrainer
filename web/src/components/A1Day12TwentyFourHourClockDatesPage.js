import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

/* =========================
   Reusable UI
========================= */

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const SubSection = ({ title, children }) => (
  <div
    style={{
      display: "grid",
      gap: 10,
      padding: 14,
      borderRadius: 14,
      background: "rgba(0,0,0,0.03)",
    }}
  >
    <h3 style={{ margin: 0 }}>{title}</h3>
    {children}
  </div>
);

const NoteBox = ({ children }) => (
  <div
    style={{
      padding: 12,
      borderRadius: 12,
      background: "rgba(0,0,0,0.05)",
      lineHeight: 1.7,
    }}
  >
    {children}
  </div>
);

const MistakeBox = ({ children }) => (
  <div
    style={{
      padding: 12,
      borderRadius: 12,
      background: "rgba(255, 193, 7, 0.12)",
      border: "1px solid rgba(255, 193, 7, 0.35)",
      lineHeight: 1.7,
    }}
  >
    <strong>Common mistake:</strong>
    <div>{children}</div>
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                textAlign: "left",
                padding: "10px 8px",
                borderBottom: "1px solid rgba(0,0,0,0.15)",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, i) => (
              <td
                key={i}
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  verticalAlign: "top",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FillInput = ({ value, onChange, placeholder = "Type answer" }) => (
  <input
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%",
      maxWidth: 320,
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.2)",
      fontSize: 15,
    }}
  />
);

const SelectInput = ({ value, onChange, options }) => (
  <select
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      maxWidth: 320,
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.2)",
      fontSize: 15,
      background: "#fff",
    }}
  >
    <option value="">Select</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const HeaderImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    style={{
      width: "100%",
      maxHeight: 220,
      objectFit: "cover",
      borderRadius: 14,
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    }}
  />
);

const normalize = (text) =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const isOneOf = (value, accepted) => accepted.includes(normalize(value));

const TimeTimeline = () => {
  const marks = [
    { label: "7:00", left: "0%" },
    { label: "7:15", left: "25%" },
    { label: "7:30", left: "50%" },
    { label: "7:45", left: "75%" },
    { label: "8:00", left: "100%" },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      <div
        style={{
          position: "relative",
          height: 52,
          borderRadius: 999,
          background: "rgba(0,0,0,0.08)",
          margin: "10px 0 8px",
        }}
      >
        {marks.map((mark) => (
          <div
            key={mark.label}
            style={{
              position: "absolute",
              left: mark.left,
              top: 0,
              bottom: 0,
              transform: "translateX(-50%)",
              display: "grid",
              justifyItems: "center",
              alignContent: "center",
              gap: 4,
            }}
          >
            <div style={{ width: 2, height: 18, background: "#222" }} />
            <span style={{ fontSize: 12, whiteSpace: "nowrap" }}>{mark.label}</span>
          </div>
        ))}
      </div>

      <NoteBox>
        <b>halb acht</b> means you are <b>halfway to 8:00</b>, so the time is <b>7:30</b>.
      </NoteBox>
    </div>
  );
};

/* =========================
   Main Page
========================= */

const A1TimeAndDatesGrammarPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const setAnswer = (key, value) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const results = useMemo(() => {
    const checks = {
      t1: answers.t1 === "8:30",
      t2: answers.t2 === "halb drei",
      t3: answers.t3 === "09:45",
      t4: isOneOf(answers.t4, ["fünf nach eins", "5 nach eins"]),
      t5: isOneOf(answers.t5, ["1:25", "01:25"]),
      t6: isOneOf(answers.t6, ["eins uhr achtzehn", "ein uhr achtzehn", "achtzehn nach eins"]),
      t7: isOneOf(answers.t7, ["fünf nach halb drei", "zwei uhr fünfunddreißig"]),
      t8: isOneOf(answers.t8, ["sechs uhr achtundvierzig", "zwölf vor sieben"]),
      d1: answers.d1 === "5 May",
      d2: answers.d2 === "der fünfundzwanzigste Dezember",
      d3: isOneOf(answers.d3, ["dritte", "der dritte"]),
      d4: isOneOf(answers.d4, ["05.03.2023"]),
      d5: isOneOf(answers.d5, ["montag"]),
    };

    const total = Object.keys(checks).length;
    const correct = Object.values(checks).filter(Boolean).length;

    return { checks, total, correct };
  }, [answers]);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <h1 style={{ marginBottom: 6 }}>German Time and Dates</h1>
        <HeaderImage
          src="https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1600&q=80"
          alt="Classic clock face and calendar pages"
        />
        <p style={{ marginTop: 0, lineHeight: 1.7 }}>
          You already learned the <b>12-hour clock</b>. In this lesson, you will now connect that
          knowledge to the <b>24-hour clock</b> and also learn how to say and write{" "}
          <b>dates in German</b>.
        </p>

        <Section title="Part 1: Time in German">
          <SubSection title="1. From 12-hour time to 24-hour time">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              You already know expressions like:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>
                <b>7:30 = halb acht</b>
              </li>
              <li>
                <b>9:15 = viertel nach neun</b>
              </li>
              <li>
                <b>9:45 = viertel vor zehn</b>
              </li>
            </ul>

            <p style={{ margin: 0, lineHeight: 1.7 }}>
              German also uses the <b>24-hour clock</b>, especially in timetables, appointments,
              schedules, and official communication.
            </p>

            <NoteBox>
              In the 24-hour system, there is <b>no AM / PM</b>. The number itself shows the time.
            </NoteBox>

            <Table
              headers={["English idea", "German 24-hour time"]}
              rows={[
                ["1 PM", "13:00"],
                ["2 PM", "14:00"],
                ["8 PM", "20:00"],
              ]}
            />
          </SubSection>

          <SubSection title="2. Basic structure">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              The 24-hour clock runs from <b>00:00</b> to <b>23:59</b>.
            </p>

            <Table
              headers={["Time", "German"]}
              rows={[
                ["00:00", "Mitternacht / null Uhr"],
                ["01:00", "ein Uhr"],
                ["08:00", "acht Uhr"],
                ["12:00", "Mittag / zwölf Uhr"],
                ["13:00", "dreizehn Uhr"],
                ["20:00", "zwanzig Uhr"],
                ["22:00", "zweiundzwanzig Uhr"],
              ]}
            />

            <NoteBox>
              Use <b>Uhr</b> after the hour:
              <br />
              <b>08:00</b> → <b>acht Uhr</b>
              <br />
              <b>14:00</b> → <b>vierzehn Uhr</b>
            </NoteBox>
          </SubSection>

          <SubSection title="3. Reading minutes">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              In formal German, say the <b>hour first</b>, then the <b>minutes</b>.
            </p>

            <Table
              headers={["Time", "German"]}
              rows={[
                ["07:15", "sieben Uhr fünfzehn"],
                ["14:20", "vierzehn Uhr zwanzig"],
                ["15:30", "fünfzehn Uhr dreißig"],
                ["19:45", "neunzehn Uhr fünfundvierzig"],
              ]}
            />

            <NoteBox>
              Important: a time is <b>not always :30</b>.<br />
              Say the exact minute number, e.g. <b>ein Uhr achtzehn</b> (1:18).
            </NoteBox>
          </SubSection>

          <SubSection title="3b. Real-life minute examples (not only :30)">
            <Table
              headers={["Time", "Formal", "Natural spoken option"]}
              rows={[
                ["01:18", "ein Uhr achtzehn", "achtzehn nach eins"],
                ["02:35", "zwei Uhr fünfunddreißig", "fünf nach halb drei"],
                ["06:48", "sechs Uhr achtundvierzig", "zwölf vor sieben"],
              ]}
            />

            <MistakeBox>
              Do not force every time into <b>halb</b>. For <b>1:18</b>, do not say <b>halb zwei</b>.
              Say <b>ein Uhr achtzehn</b> or <b>achtzehn nach eins</b>.
            </MistakeBox>
          </SubSection>

          <SubSection title="4. Natural spoken time">
            <Table
              headers={["Time", "Formal", "Natural spoken German"]}
              rows={[
                ["07:30", "sieben Uhr dreißig", "halb acht"],
                ["09:15", "neun Uhr fünfzehn", "viertel nach neun"],
                ["09:45", "neun Uhr fünfundvierzig", "viertel vor zehn"],
                ["13:10", "dreizehn Uhr zehn", "zehn nach eins"],
                ["16:45", "sechzehn Uhr fünfundvierzig", "viertel vor fünf"],
              ]}
            />
          </SubSection>

          <SubSection title="5. The important rule about halb">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              This is one of the biggest student problems.
            </p>

            <MistakeBox>
              <b>halb acht</b> does <b>not</b> mean 8:30.
            </MistakeBox>

            <NoteBox>
              <b>halb acht</b> means <b>halfway to 8 o’clock</b>, so it is <b>7:30</b>.
            </NoteBox>

            <TimeTimeline />

            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Think forward:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>
                <b>halb drei</b> = 2:30
              </li>
              <li>
                <b>halb neun</b> = 8:30
              </li>
            </ul>
          </SubSection>

          <SubSection title="6. vor and nach">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              German also uses <b>vor</b> (before) and <b>nach</b> (after).
            </p>

            <Table
              headers={["Time", "German", "Meaning"]}
              rows={[
                ["01:05", "fünf nach eins", "five minutes after 1"],
                ["01:20", "zwanzig nach eins", "twenty minutes after 1"],
                ["01:25", "fünf vor halb zwei", "five minutes before 1:30"],
                ["01:35", "fünf nach halb zwei", "five minutes after 1:30"],
                ["01:50", "zehn vor zwei", "ten minutes before 2"],
              ]}
            />

            <NoteBox>
              <b>halb zwei</b> = 1:30
              <br />
              So:
              <br />
              <b>fünf vor halb zwei</b> = 1:25
              <br />
              <b>fünf nach halb zwei</b> = 1:35
            </NoteBox>
          </SubSection>

          <SubSection title="7. Common mistakes with time">
            <MistakeBox>
              <b>halb acht</b> = 7:30, not 8:30
            </MistakeBox>
            <MistakeBox>
              <b>viertel vor zehn</b> = 9:45, not 10:15
            </MistakeBox>
            <MistakeBox>
              In formal 24-hour time, say the full number:
              <br />
              <b>14:20</b> = <b>vierzehn Uhr zwanzig</b>
            </MistakeBox>
          </SubSection>
        </Section>

        <Section title="Part 2: Dates in German">
          <HeaderImage
            src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1600&q=80"
            alt="Desk calendar with pen and study materials"
          />
          <SubSection title="1. Introduction">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Knowing how to say and write dates in German is important for everyday communication.
              You need to know:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>days of the week</li>
              <li>months of the year</li>
              <li>ordinal numbers</li>
              <li>how to form dates correctly</li>
            </ul>
          </SubSection>

          <SubSection title="2. Days of the week (Wochentage)">
            <Table
              headers={["German", "English"]}
              rows={[
                ["Montag", "Monday"],
                ["Dienstag", "Tuesday"],
                ["Mittwoch", "Wednesday"],
                ["Donnerstag", "Thursday"],
                ["Freitag", "Friday"],
                ["Samstag", "Saturday"],
                ["Sonntag", "Sunday"],
              ]}
            />
          </SubSection>

          <SubSection title="3. Months of the year (Monate des Jahres)">
            <Table
              headers={["German", "English"]}
              rows={[
                ["Januar", "January"],
                ["Februar", "February"],
                ["März", "March"],
                ["April", "April"],
                ["Mai", "May"],
                ["Juni", "June"],
                ["Juli", "July"],
                ["August", "August"],
                ["September", "September"],
                ["Oktober", "October"],
                ["November", "November"],
                ["Dezember", "December"],
              ]}
            />
          </SubSection>

          <SubSection title="4. Ordinal numbers (Ordinalzahlen)">
            <NoteBox>
              From <b>1 to 19</b>, add <b>-te</b>.
              <br />
              From <b>20 onwards</b>, add <b>-ste</b>.
            </NoteBox>

            <Table
              headers={["Number", "German"]}
              rows={[
                ["1st", "erste"],
                ["2nd", "zweite"],
                ["3rd", "dritte"],
                ["4th", "vierte"],
                ["5th", "fünfte"],
                ["10th", "zehnte"],
                ["15th", "fünfzehnte"],
                ["20th", "zwanzigste"],
                ["21st", "einundzwanzigste"],
                ["25th", "fünfundzwanzigste"],
                ["30th", "dreißigste"],
                ["31st", "einunddreißigste"],
              ]}
            />
          </SubSection>

          <SubSection title="5. Forming dates">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              German dates are usually written like this:
            </p>

            <NoteBox>
              <b>day.month.year</b>
              <br />
              Example: <b>05.03.2023</b>
            </NoteBox>

            <p style={{ margin: 0, lineHeight: 1.7 }}>
              When saying the date, the common structure is:
            </p>

            <NoteBox>
              <b>der + ordinal number + month</b>
            </NoteBox>

            <Table
              headers={["Written", "Spoken / written out"]}
              rows={[
                ["01.01.2023", "der erste Januar zweitausenddreiundzwanzig"],
                ["15.07.2022", "der fünfzehnte Juli zweitausendzweiundzwanzig"],
                ["31.12.2021", "der einunddreißigste Dezember zweitausendeinundzwanzig"],
              ]}
            />
          </SubSection>

          <SubSection title="6. Saying the date in sentences">
            <Table
              headers={["German", "English"]}
              rows={[
                ["Heute ist der dritte April.", "Today is the 3rd of April."],
                ["Mein Geburtstag ist der fünfte Mai.", "My birthday is the 5th of May."],
                ["Weihnachten ist der fünfundzwanzigste Dezember.", "Christmas is the 25th of December."],
                ["Der Nationalfeiertag ist der dritte Oktober.", "The national holiday is the 3rd of October."],
              ]}
            />
          </SubSection>

          <SubSection title="7. Common mistakes with dates">
            <MistakeBox>
              For dates, do not say only <b>fünf Mai</b>. Say <b>der fünfte Mai</b>.
            </MistakeBox>
            <MistakeBox>
              <b>dritte</b> is an ordinal number, but in a full sentence you often say:
              <br />
              <b>der dritte April</b>
            </MistakeBox>
            <MistakeBox>
              Written date:
              <br />
              <b>05.03.2023</b>, not 5/3/2023 in this lesson format
            </MistakeBox>
          </SubSection>
        </Section>

        <Section title="Practice: Check your understanding">
          <HeaderImage
            src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1600&q=80"
            alt="Notebook with checklist and study setup"
          />
          <SubSection title="A. Multiple choice">
            <p style={{ margin: 0 }}>
              <b>1. halb neun = ?</b>
            </p>
            <SelectInput
              value={answers.t1}
              onChange={(v) => setAnswer("t1", v)}
              options={["8:30", "9:30"]}
            />

            <p style={{ margin: 0 }}>
              <b>2. 14:30 = ?</b>
            </p>
            <SelectInput
              value={answers.t2}
              onChange={(v) => setAnswer("t2", v)}
              options={["halb drei", "halb vier"]}
            />

            <p style={{ margin: 0 }}>
              <b>3. viertel vor zehn = ?</b>
            </p>
            <SelectInput
              value={answers.t3}
              onChange={(v) => setAnswer("t3", v)}
              options={["09:45", "10:45"]}
            />

            <p style={{ margin: 0 }}>
              <b>4. “der fünfte Mai” means?</b>
            </p>
            <SelectInput
              value={answers.d1}
              onChange={(v) => setAnswer("d1", v)}
              options={["5 May", "15 May"]}
            />

            <p style={{ margin: 0 }}>
              <b>5. What is the German for 25th December?</b>
            </p>
            <SelectInput
              value={answers.d2}
              onChange={(v) => setAnswer("d2", v)}
              options={["der fünfundzwanzigste Dezember", "der fünfundzwanzig Dezember"]}
            />
          </SubSection>

          <SubSection title="B. Fill in the gap">
            <p style={{ margin: 0 }}>
              <b>6. 01:05 = </b>
            </p>
            <FillInput
              value={answers.t4}
              onChange={(v) => setAnswer("t4", v)}
              placeholder="Type your answer"
            />

            <p style={{ margin: 0 }}>
              <b>7. fünf vor halb zwei = </b>
            </p>
            <FillInput
              value={answers.t5}
              onChange={(v) => setAnswer("t5", v)}
              placeholder="Type your answer"
            />

            <p style={{ margin: 0 }}>
              <b>8. Heute ist der ______ April. (3rd)</b>
            </p>
            <FillInput
              value={answers.d3}
              onChange={(v) => setAnswer("d3", v)}
              placeholder="Type your answer"
            />

            <p style={{ margin: 0 }}>
              <b>9. Say 01:18 in German (formal or natural):</b>
            </p>
            <FillInput
              value={answers.t6}
              onChange={(v) => setAnswer("t6", v)}
              placeholder="Example: ein Uhr achtzehn"
            />

            <p style={{ margin: 0 }}>
              <b>10. Say 02:35 in German (formal or natural):</b>
            </p>
            <FillInput
              value={answers.t7}
              onChange={(v) => setAnswer("t7", v)}
              placeholder="Example: zwei Uhr fünfunddreißig"
            />

            <p style={{ margin: 0 }}>
              <b>11. Say 06:48 in German (formal or natural):</b>
            </p>
            <FillInput
              value={answers.t8}
              onChange={(v) => setAnswer("t8", v)}
              placeholder="Example: sechs Uhr achtundvierzig"
            />

            <p style={{ margin: 0 }}>
              <b>12. Write 5th March 2023 in German format:</b>
            </p>
            <FillInput
              value={answers.d4}
              onChange={(v) => setAnswer("d4", v)}
              placeholder="Type your answer"
            />

            <p style={{ margin: 0 }}>
              <b>13. Monday in German = </b>
            </p>
            <FillInput
              value={answers.d5}
              onChange={(v) => setAnswer("d5", v)}
              placeholder="Type your answer"
            />
          </SubSection>

          <button
            type="button"
            onClick={() => {
              setShowResults(true);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Check answers
          </button>

          {showResults && (
            <NoteBox>
              <div>
                <b>Score:</b> {results.correct}/{results.total}
              </div>
              <div>1. {results.checks.t1 ? "✅" : "❌"} halb neun = 8:30</div>
              <div>2. {results.checks.t2 ? "✅" : "❌"} 14:30 = halb drei</div>
              <div>3. {results.checks.t3 ? "✅" : "❌"} viertel vor zehn = 09:45</div>
              <div>4. {results.checks.t4 ? "✅" : "❌"} 01:05 = fünf nach eins</div>
              <div>5. {results.checks.t5 ? "✅" : "❌"} fünf vor halb zwei = 1:25</div>
              <div>6. {results.checks.d1 ? "✅" : "❌"} der fünfte Mai = 5 May</div>
              <div>7. {results.checks.d2 ? "✅" : "❌"} 25th December = der fünfundzwanzigste Dezember</div>
              <div>8. {results.checks.d3 ? "✅" : "❌"} 3rd = dritte / der dritte</div>
              <div>9. {results.checks.t6 ? "✅" : "❌"} 01:18 = ein Uhr achtzehn / achtzehn nach eins</div>
              <div>10. {results.checks.t7 ? "✅" : "❌"} 02:35 = zwei Uhr fünfunddreißig / fünf nach halb drei</div>
              <div>11. {results.checks.t8 ? "✅" : "❌"} 06:48 = sechs Uhr achtundvierzig / zwölf vor sieben</div>
              <div>12. {results.checks.d4 ? "✅" : "❌"} 5th March 2023 = 05.03.2023</div>
              <div>13. {results.checks.d5 ? "✅" : "❌"} Monday = Montag</div>
            </NoteBox>
          )}
        </Section>

        <Section title="Summary">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>German often uses the 24-hour clock in formal situations.</li>
            <li>Use <b>Uhr</b> after the hour.</li>
            <li>In everyday speech, you also hear <b>halb</b>, <b>vor</b>, and <b>nach</b>.</li>
            <li>
              <b>halb acht</b> means halfway to 8 o’clock, so it is <b>7:30</b>.
            </li>
            <li>Learn the days of the week and months of the year.</li>
            <li>Use ordinal numbers for dates.</li>
            <li>From 1–19, use <b>-te</b>. From 20 onwards, use <b>-ste</b>.</li>
            <li>Dates are written as <b>day.month.year</b>.</li>
            <li>Practice saying dates in full sentences.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default A1TimeAndDatesGrammarPage;
