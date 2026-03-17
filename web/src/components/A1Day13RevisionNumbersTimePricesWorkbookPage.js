import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const heroImage =
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1400&q=80";

const discussionPageUrl = "https://www.falowen.app/campus/discussion";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.75,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.96rem",
  background: "#fff",
  borderRadius: 14,
  overflow: "hidden",
};

const thStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  background: "#f8fafc",
  fontWeight: 700,
};

const tdStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
};

const softBlueBox = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(14,165,233,0.08))",
  border: "1px solid rgba(59,130,246,0.16)",
};

const softAmberBox = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.08))",
  border: "1px solid rgba(245,158,11,0.20)",
};

const softGreenBox = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(34,197,94,0.08))",
  border: "1px solid rgba(16,185,129,0.18)",
};

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(148,163,184,0.25)",
  fontSize: "0.92rem",
  fontWeight: 600,
};

const blankStyle = {
  display: "inline-block",
  minWidth: 140,
  borderBottom: "2px solid #94a3b8",
  marginLeft: 6,
  transform: "translateY(-2px)",
};

const exerciseCardStyle = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "#fff",
  border: "1px solid #e5e7eb",
};

const sectionGapStyle = { display: "grid", gap: 10 };

const heroOverlayStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.72), rgba(29,78,216,0.58))",
  borderRadius: 24,
};

const heroContentStyle = {
  position: "relative",
  zIndex: 2,
  color: "#fff",
  display: "grid",
  gap: 14,
  padding: "28px 24px",
};

const progressWrapStyle = {
  display: "grid",
  gap: 14,
  padding: "16px 18px",
  borderRadius: 18,
  background: "#fff",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
};

const progressBarTrackStyle = {
  width: "100%",
  height: 14,
  borderRadius: 999,
  background: "#e5e7eb",
  overflow: "hidden",
};

const checklistGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 10,
};

const checklistItemStyle = (checked) => ({
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  padding: "10px 12px",
  borderRadius: 14,
  border: checked ? "1px solid rgba(16,185,129,0.30)" : "1px solid #e5e7eb",
  background: checked ? "rgba(16,185,129,0.08)" : "#fff",
});

const progressFillBaseStyle = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, #2563eb, #10b981)",
  transition: "width 0.3s ease",
};

const discussionButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 16px",
  borderRadius: 999,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  textDecoration: "none",
  border: "none",
};

const numberPractice = [56, 248, 1234, 3452, 4560, 5678, 6789, 7890, 9999];

const timePractice = [
  { digital: "2:15", spoken: "Viertel nach zwei" },
  { digital: "5:45", spoken: "Viertel vor sechs" },
  { digital: "7:30", spoken: "halb acht" },
  { digital: "10:10", spoken: "zehn nach zehn" },
  { digital: "8:20", spoken: "zwanzig nach acht" },
];

const yearsPractice = [
  { year: 1453, answer: "vierzehnhundertdreiundfünfzig" },
  { year: 1944, answer: "neunzehnhundertvierundvierzig" },
  { year: 2000, answer: "zweitausend" },
  { year: 2025, answer: "zweitausendfünfundzwanzig" },
  { year: 1999, answer: "neunzehnhundertneunundneunzig" },
];

const datePractice = [
  {
    written: "12. Mai 1995",
    answer: "Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.",
  },
  {
    written: "3. Juli 1980",
    answer: "Ich bin am dritten Juli neunzehnhundertachtzig geboren.",
  },
  {
    written: "1. Januar 2001",
    answer: "Ich bin am ersten Januar zweitausendeins geboren.",
  },
];

const priceRows = [
  {
    object: "Book",
    german: "das Buch",
    question: "Wie viel kostet das Buch?",
    answer: "Es kostet zehn Euro.",
  },
  {
    object: "Apple",
    german: "der Apfel",
    question: "Wie viel kostet der Apfel?",
    answer: "Er kostet zwei Euro.",
  },
  {
    object: "Banana",
    german: "die Banane",
    question: "Wie viel kostet die Banane?",
    answer: "Sie kostet einen Euro.",
  },
  {
    object: "Tomatoes",
    german: "die Tomaten",
    question: "Wie viel kosten die Tomaten?",
    answer: "Sie kosten vier Euro.",
  },
  {
    object: "Shoes",
    german: "die Schuhe",
    question: "Wie viel kosten die Schuhe?",
    answer: "Sie kosten fünfzig Euro.",
  },
];

const sentenceBuildPractice = [
  {
    prompt: "ich / am Montag / gehe / zur Schule",
    answer: "Ich gehe am Montag zur Schule.",
  },
  {
    prompt: "am Freitag / wir / fernsehen",
    answer: "Am Freitag sehen wir fern.",
  },
  {
    prompt: "treibt / Peter / am Samstag / Sport",
    answer: "Peter treibt am Samstag Sport.",
  },
  {
    prompt: "am Dienstag / ich / treffe / Freunde",
    answer: "Am Dienstag treffe ich Freunde.",
  },
  {
    prompt: "arbeitet / meine Mutter / am Donnerstag",
    answer: "Meine Mutter arbeitet am Donnerstag.",
  },
];

const freeWritingPrompts = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const progressItems = [
  { id: "numbers", label: "I practised the numbers." },
  { id: "time", label: "I practised asking and saying the time." },
  { id: "digital-time", label: "I revised digital and 24-hour time." },
  { id: "years", label: "I practised saying years in German." },
  { id: "dates", label: "I wrote birthday/date sentences." },
  { id: "prices", label: "I practised prices with kostet/kosten." },
  { id: "sentences", label: "I built correct German sentences from Monday to Sunday." },
  { id: "self-test", label: "I completed the mini self-test." },
  { id: "discussion", label: "I shared my Monday to Sunday contribution on the discussion page." },
];

const SectionCard = ({ title, subtitle, children }) => (
  <section style={sectionStyle}>
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ ...styles.subtitle, margin: 0 }}>{title}</h2>
      {subtitle ? (
        <p style={{ ...styles.paragraph, margin: 0, opacity: 0.9 }}>{subtitle}</p>
      ) : null}
    </div>
    {children}
  </section>
);

const NoteBox = ({ title, children, variant = "blue" }) => {
  const style =
    variant === "green"
      ? softGreenBox
      : variant === "amber"
      ? softAmberBox
      : softBlueBox;

  return (
    <div style={style}>
      <p style={{ ...styles.paragraph, margin: 0, fontWeight: 800 }}>{title}</p>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
};

const Blank = ({ width = 140 }) => (
  <span style={{ ...blankStyle, minWidth: width }} aria-hidden="true">
    &nbsp;
  </span>
);

const PracticeCard = ({ title, children }) => (
  <div style={exerciseCardStyle}>
    <p style={{ ...styles.paragraph, margin: "0 0 8px 0", fontWeight: 700 }}>{title}</p>
    {children}
  </div>
);

const ProgressTracker = ({
  items,
  checkedMap,
  onToggle,
  onReset,
  completedCount,
  totalCount,
  percent,
}) => (
  <section style={progressWrapStyle}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <h2 style={{ ...styles.subtitle, margin: 0 }}>My Progress Tracker</h2>
        <p style={{ ...styles.paragraph, margin: 0 }}>
          Tick each box after you finish the task.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        style={{
          ...styles.secondaryButton,
          borderRadius: 999,
        }}
      >
        Reset Progress
      </button>
    </div>

    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700 }}>
          {completedCount} / {totalCount} completed
        </span>
        <span style={{ color: "#475569", fontWeight: 700 }}>{percent}%</span>
      </div>

      <div style={progressBarTrackStyle} aria-hidden="true">
        <div style={{ ...progressFillBaseStyle, width: `${percent}%` }} />
      </div>
    </div>

    <div style={checklistGridStyle}>
      {items.map((item) => {
        const checked = !!checkedMap[item.id];
        return (
          <label key={item.id} style={checklistItemStyle(checked)}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(item.id)}
              style={{ marginTop: 3 }}
            />
            <span style={{ lineHeight: 1.55 }}>
              <strong>{checked ? "Done:" : "Task:"}</strong> {item.label}
            </span>
          </label>
        );
      })}
    </div>
  </section>
);

const A1Day13RevisionNumbersTimePricesWorkbookPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

  const pageTitle = useMemo(
    () => "A1 · Day 13 Workbook · Revision: Numbers, Time, Dates and Prices",
    []
  );

  const completedCount = useMemo(
    () => progressItems.filter((item) => completedTasks[item.id]).length,
    [completedTasks]
  );

  const totalCount = progressItems.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  const toggleTask = (id) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetProgress = () => {
    setCompletedTasks({});
  };

  return (
    <div style={styles.pageWrap || styles.page}>
      <div style={styles.container}>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            minHeight: 290,
            marginBottom: 20,
            boxShadow: "0 14px 40px rgba(15,23,42,0.16)",
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={heroOverlayStyle} />
          <div style={heroContentStyle}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={chipStyle}>A1 Revision</span>
              <span style={chipStyle}>Workbook Practice</span>
              <span style={chipStyle}>Numbers · Time · Dates · Prices</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                lineHeight: 1.15,
              }}
            >
              {pageTitle}
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "1.03rem",
                maxWidth: 780,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.94)",
              }}
            >
              Hello dear students! Today we revise <strong>numbers</strong>,{" "}
              <strong>asking for the time</strong>, <strong>years</strong>,{" "}
              <strong>birthdays</strong>, <strong>prices</strong>, and{" "}
              <strong>correct German sentence order</strong>. Read carefully,
              speak aloud, write your answers, and then check yourself.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                style={{
                  ...(styles.primaryButton || {}),
                  borderRadius: 999,
                  padding: "12px 18px",
                  fontWeight: 700,
                }}
                onClick={() => setShowAnswers((prev) => !prev)}
              >
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </button>

              <span
                style={{
                  ...chipStyle,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.24)",
                }}
              >
                Learn → Practice → Check
              </span>
            </div>
          </div>
        </section>

        <ProgressTracker
          items={progressItems}
          checkedMap={completedTasks}
          onToggle={toggleTask}
          onReset={resetProgress}
          completedCount={completedCount}
          totalCount={totalCount}
          percent={percent}
        />

        <SectionCard
          title="1) Number Revision (1–10,000)"
          subtitle="First say the numbers aloud. Then write some of them in words."
        >
          <div style={sectionGapStyle}>
            <PracticeCard title="Task A: Say each number in German">
              <ul style={listStyle}>
                {numberPractice.map((number) => (
                  <li key={number}>{number.toLocaleString()}</li>
                ))}
              </ul>
            </PracticeCard>

            <NoteBox title="Remember: number pattern">
              <p style={styles.paragraph}>
                In German, the <strong>ones usually come before the tens</strong>.
              </p>
              <ul style={listStyle}>
                <li>21 = einundzwanzig</li>
                <li>56 = sechsundfünfzig</li>
                <li>98 = achtundneunzig</li>
              </ul>
            </NoteBox>

            <PracticeCard title="Task B: Write these numbers in words">
              <ol style={listStyle}>
                {numberPractice.slice(0, 5).map((number) => (
                  <li key={`write-${number}`}>
                    {number.toLocaleString()} = <Blank width={230} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  <li>56 = sechsundfünfzig</li>
                  <li>248 = zweihundertachtundvierzig</li>
                  <li>1,234 = eintausendzweihundertvierunddreißig</li>
                  <li>3,452 = dreitausendvierhundertzweiundfünfzig</li>
                  <li>4,560 = viertausendfünfhundertsechzig</li>
                  <li>5,678 = fünftausendsechshundertachtundsiebzig</li>
                  <li>6,789 = sechstausendsiebenhundertneunundachtzig</li>
                  <li>7,890 = siebentausendachthundertneunzig</li>
                  <li>9,999 = neuntausendneunhundertneunundneunzig</li>
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="2) Asking for the Time"
          subtitle="Learn the main questions and practise common time expressions."
        >
          <div style={sectionGapStyle}>
            <PracticeCard title="Useful questions">
              <ul style={listStyle}>
                <li>
                  <strong>Wie spät ist es?</strong>
                </li>
                <li>
                  <strong>Wie viel Uhr ist es?</strong>
                </li>
              </ul>
            </PracticeCard>

            <PracticeCard title="Example answers">
              <ul style={listStyle}>
                <li>Es ist ein Uhr.</li>
                <li>Es ist drei Uhr.</li>
                <li>Es ist halb vier.</li>
                <li>Es ist Viertel nach zwei.</li>
                <li>Es ist Viertel vor sechs.</li>
                <li>Es ist zehn nach zehn.</li>
                <li>Es ist zwanzig vor acht.</li>
              </ul>
            </PracticeCard>

            <NoteBox title="Important">
              <p style={styles.paragraph}>
                <strong>halb vier</strong> means <strong>3:30</strong>, not 4:30.
                In German, it means <strong>half to four</strong>.
              </p>
            </NoteBox>

            <PracticeCard title="Task A: Write the German time expression">
              <ol style={listStyle}>
                {timePractice.map((item) => (
                  <li key={`digital-${item.digital}`}>
                    {item.digital} = <Blank width={190} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            <PracticeCard title="Task B: Write the digital time">
              <ol style={listStyle}>
                {timePractice.map((item) => (
                  <li key={`spoken-${item.spoken}`}>
                    {item.spoken} = <Blank width={90} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  {timePractice.map((item) => (
                    <li key={`answer-time-${item.digital}`}>
                      {item.digital} = {item.spoken}
                    </li>
                  ))}
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="3) Digital Time and 24-Hour Time"
          subtitle="A1 students should start recognising both everyday time and formal digital time."
        >
          <div style={sectionGapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Digital Time</th>
                  <th style={thStyle}>24-Hour Style</th>
                  <th style={thStyle}>Everyday Style</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>08:00</td>
                  <td style={tdStyle}>acht Uhr</td>
                  <td style={tdStyle}>acht Uhr</td>
                </tr>
                <tr>
                  <td style={tdStyle}>14:30</td>
                  <td style={tdStyle}>vierzehn Uhr dreißig</td>
                  <td style={tdStyle}>halb drei</td>
                </tr>
                <tr>
                  <td style={tdStyle}>17:15</td>
                  <td style={tdStyle}>siebzehn Uhr fünfzehn</td>
                  <td style={tdStyle}>Viertel nach fünf</td>
                </tr>
                <tr>
                  <td style={tdStyle}>19:45</td>
                  <td style={tdStyle}>neunzehn Uhr fünfundvierzig</td>
                  <td style={tdStyle}>Viertel vor acht</td>
                </tr>
              </tbody>
            </table>

            <PracticeCard title="Task: Say these in both ways">
              <ul style={listStyle}>
                <li>13:30</li>
                <li>16:15</li>
                <li>20:45</li>
              </ul>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  <li>13:30 = dreizehn Uhr dreißig / halb zwei</li>
                  <li>16:15 = sechzehn Uhr fünfzehn / Viertel nach vier</li>
                  <li>20:45 = zwanzig Uhr fünfundvierzig / Viertel vor neun</li>
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="4) Speaking About Years"
          subtitle="Notice the difference between older years and years from 2000 onward."
        >
          <div style={sectionGapStyle}>
            <PracticeCard title="Model examples">
              <ul style={listStyle}>
                <li>1453 → vierzehnhundertdreiundfünfzig</li>
                <li>1944 → neunzehnhundertvierundvierzig</li>
                <li>2000 → zweitausend</li>
                <li>2025 → zweitausendfünfundzwanzig</li>
              </ul>
            </PracticeCard>

            <NoteBox title="Remember">
              <p style={styles.paragraph}>
                Years between <strong>1000 and 1999</strong> are often spoken with{" "}
                <strong>hundert</strong>. Years from <strong>2000</strong> are usually
                read as full thousands.
              </p>
            </NoteBox>

            <PracticeCard title="Task: Read these years in German">
              <ol style={listStyle}>
                {yearsPractice.map((item) => (
                  <li key={item.year}>
                    {item.year} = <Blank width={270} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  {yearsPractice.map((item) => (
                    <li key={`year-answer-${item.year}`}>
                      {item.year} = {item.answer}
                    </li>
                  ))}
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="5) Birthdays and Dates"
          subtitle="Learn the correct date structure after “am”."
        >
          <div style={sectionGapStyle}>
            <PracticeCard title="Main structure">
              <p style={styles.paragraph}>
                Use: <strong>Ich bin am [date] geboren.</strong>
              </p>
              <ul style={listStyle}>
                <li>Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.</li>
                <li>Ich bin am dritten Juli neunzehnhundertachtzig geboren.</li>
              </ul>
            </PracticeCard>

            <NoteBox title="Remember">
              <p style={styles.paragraph}>
                After <strong>am</strong>, ordinal numbers take dative endings:
              </p>
              <ul style={listStyle}>
                <li>am ersten</li>
                <li>am dritten</li>
                <li>am zwölften</li>
                <li>am zwanzigsten</li>
              </ul>
            </NoteBox>

            <NoteBox title="Common mistake" variant="amber">
              <p style={styles.paragraph}>
                Not: <strong>Ich bin am zwölf Mai geboren.</strong>
              </p>
              <p style={styles.paragraph}>
                Correct: <strong>Ich bin am zwölften Mai geboren.</strong>
              </p>
            </NoteBox>

            <PracticeCard title="Task A: Write the full birth sentence">
              <ol style={listStyle}>
                {datePractice.map((item) => (
                  <li key={item.written}>
                    {item.written} → <Blank width={380} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            <PracticeCard title="Task B: Write your own birthday in German">
              <p style={styles.paragraph}>
                Ich bin am <Blank width={320} /> geboren.
              </p>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  {datePractice.map((item) => (
                    <li key={`date-answer-${item.written}`}>
                      {item.written} → {item.answer}
                    </li>
                  ))}
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="6) Asking and Saying Prices"
          subtitle="Practise singular and plural with kostet / kosten."
        >
          <div style={sectionGapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Object</th>
                  <th style={thStyle}>German</th>
                  <th style={thStyle}>Question</th>
                  <th style={thStyle}>Answer</th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map((row) => (
                  <tr key={row.object}>
                    <td style={tdStyle}>{row.object}</td>
                    <td style={tdStyle}>{row.german}</td>
                    <td style={tdStyle}>{row.question}</td>
                    <td style={tdStyle}>{row.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <NoteBox title="Important grammar">
              <ul style={listStyle}>
                <li>
                  <strong>kostet</strong> = singular
                </li>
                <li>
                  <strong>kosten</strong> = plural
                </li>
              </ul>
            </NoteBox>

            <PracticeCard title="Task A: Complete the questions">
              <ol style={listStyle}>
                <li>Wie viel kostet <Blank width={100} /> Buch?</li>
                <li>Wie viel kostet <Blank width={100} /> Apfel?</li>
                <li>Wie viel kostet <Blank width={100} /> Banane?</li>
                <li>Wie viel kosten <Blank width={100} /> Tomaten?</li>
                <li>Wie viel kosten <Blank width={100} /> Schuhe?</li>
              </ol>
            </PracticeCard>

            <PracticeCard title="Task B: Write full answers">
              <ol style={listStyle}>
                <li>Das Buch → 10 Euro</li>
                <li>Der Apfel → 2 Euro</li>
                <li>Die Banane → 1 Euro</li>
                <li>Die Tomaten → 4 Euro</li>
              </ol>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  <li>Wie viel kostet das Buch?</li>
                  <li>Wie viel kostet der Apfel?</li>
                  <li>Wie viel kostet die Banane?</li>
                  <li>Wie viel kosten die Tomaten?</li>
                  <li>Wie viel kosten die Schuhe?</li>
                  <li>Es kostet zehn Euro.</li>
                  <li>Er kostet zwei Euro.</li>
                  <li>Sie kostet einen Euro.</li>
                  <li>Sie kosten vier Euro.</li>
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="7) Sentence Order Practice"
          subtitle="Build correct German sentences from Monday to Sunday using only the given days and activities."
        >
          <div style={sectionGapStyle}>
            <NoteBox title="Instructions">
              <ol style={listStyle}>
                <li>Use either sentence structure 1 or 2.</li>
                <li>Arrange the sentence based on the chosen rule.</li>
                <li>Use only the given activities and add the pronoun and day.</li>
                <li>Do not add any extra words.</li>
              </ol>
            </NoteBox>

            <NoteBox title="Sentence Structures">
              <ol style={listStyle}>
                <li>
                  <strong>Subject + Verb + Time + Other Elements</strong>
                </li>
                <li>
                  <strong>Time + Verb + Subject + Other Elements</strong>
                </li>
              </ol>
            </NoteBox>

            <PracticeCard title="Days of the Week in German">
              <p style={styles.paragraph}>
                Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag
              </p>
            </PracticeCard>

            <PracticeCard title="Activities to Use in Sentences">
              <ol style={listStyle} start={4}>
                <li>kochen</li>
                <li>Freunde treffen</li>
                <li>Hausaufgaben machen</li>
                <li>fernsehen</li>
                <li>lesen</li>
                <li>im Park spazieren gehen</li>
                <li>zur Schule gehen</li>
                <li>arbeiten</li>
                <li>Sport treiben</li>
                <li>einkaufen gehen</li>
              </ol>
            </PracticeCard>

            <PracticeCard title="Examples for Practice">
              <ol style={listStyle}>
                <li>
                  <strong>Subject + Verb + Time + Other Things:</strong>
                  <br />
                  Ich gehe am Montag zur Schule.
                </li>
                <li>
                  <strong>Time + Verb + Subject + Other Things:</strong>
                  <br />
                  Am Dienstag treibe ich Sport.
                </li>
              </ol>
            </PracticeCard>

            <PracticeCard title="Task A: Arrange the given words into correct sentences">
              <ol style={listStyle}>
                {sentenceBuildPractice.map((item) => (
                  <li key={item.prompt}>
                    {item.prompt}
                    <br />
                    <Blank width={360} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            <PracticeCard title="Task B: Write one sentence for each day from Monday to Sunday">
              <p style={styles.paragraph}>
                Use only the days above and the given activities. Add a pronoun. Do not
                add extra words.
              </p>
              <ol style={listStyle}>
                {freeWritingPrompts.map((day) => (
                  <li key={day}>
                    <strong>{day}:</strong>
                    <br />
                    <Blank width={420} />
                  </li>
                ))}
              </ol>
            </PracticeCard>

            <NoteBox title="Group Discussion Task">
              <p style={styles.paragraph}>
                After writing your <strong>Monday to Sunday</strong> sentences, go to the
                group discussion page and share your contribution.
              </p>
              <p style={styles.paragraph}>
                Share your full weekly sentence practice from <strong>Montag bis Sonntag</strong>
                using only the given activities.
              </p>
              <a
                href={discussionPageUrl}
                target="_blank"
                rel="noreferrer"
                style={discussionButtonStyle}
              >
                Open Group Discussion Page
              </a>
            </NoteBox>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ul style={listStyle}>
                  {sentenceBuildPractice.map((item) => (
                    <li key={`sentence-answer-${item.prompt}`}>{item.answer}</li>
                  ))}
                  <li>Ich gehe am Montag zur Schule.</li>
                  <li>Am Dienstag treibe ich Sport.</li>
                  <li>Ich mache am Mittwoch Hausaufgaben.</li>
                  <li>Am Donnerstag treffe ich Freunde.</li>
                  <li>Ich arbeite am Freitag.</li>
                  <li>Am Samstag gehe ich einkaufen.</li>
                  <li>Ich lese am Sonntag.</li>
                </ul>
              </NoteBox>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="8) Mini Self-Test"
          subtitle="Try these without looking back at the earlier sections."
        >
          <div style={sectionGapStyle}>
            <PracticeCard title="Check yourself">
              <ol style={listStyle}>
                <li>How do you ask: “What time is it?”</li>
                <li>Write 248 in German.</li>
                <li>What does <strong>halb vier</strong> mean in digital time?</li>
                <li>Write 12. Mai 1995 as a full birth sentence.</li>
                <li>Complete: Wie viel ______ die Tomaten?</li>
                <li>Make one sentence with: <strong>Am Samstag</strong></li>
              </ol>
            </PracticeCard>

            {showAnswers && (
              <NoteBox title="Possible Answers" variant="green">
                <ol style={listStyle}>
                  <li>Wie spät ist es? / Wie viel Uhr ist es?</li>
                  <li>zweihundertachtundvierzig</li>
                  <li>3:30</li>
                  <li>
                    Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.
                  </li>
                  <li>kosten</li>
                  <li>Example: Am Samstag treffe ich Freunde.</li>
                </ol>
              </NoteBox>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default A1Day13RevisionNumbersTimePricesWorkbookPage;
