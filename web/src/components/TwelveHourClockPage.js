import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/* =========================================================
   A1 LESSON SET
   - Grammar Book
   - Light Practice Book
   Topics:
   1) Days of the week
   2) 12-hour clock + halb / Viertel
   3) Separable verbs

   Default export at bottom is Grammar Book.
   Change default export if you want Practice first.
========================================================= */

const splashImage =
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=80";

const topicImageDays =
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80";

const topicImageTime =
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80";

const topicImageRoutine =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

/* =========================
   Shared UI
========================= */

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

const softCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#f8fafc",
  display: "grid",
  gap: 10,
};

const whiteCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 10,
};

const calloutStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 12,
  background: "#f9fafb",
  display: "grid",
  gap: 8,
};

const warningStyle = {
  border: "1px solid #fed7aa",
  borderRadius: 12,
  padding: 12,
  background: "#fff7ed",
  display: "grid",
  gap: 8,
};

const successStyle = {
  border: "1px solid #bbf7d0",
  borderRadius: 12,
  padding: 12,
  background: "#f0fdf4",
  display: "grid",
  gap: 8,
};

const chipStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 13,
  background: "#fff",
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.15rem",
};

const paragraph = {
  margin: 0,
  lineHeight: 1.65,
};

const Section = ({ title, subtitle, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={sectionTitle}>{title}</h2>
      {subtitle ? <p style={{ ...paragraph, opacity: 0.9 }}>{subtitle}</p> : null}
    </div>
    {children}
  </section>
);

const Callout = ({ title, children, variant = "default" }) => {
  const style =
    variant === "warning"
      ? warningStyle
      : variant === "success"
      ? successStyle
      : calloutStyle;

  return (
    <div style={style}>
      {title ? <strong>{title}</strong> : null}
      <div style={{ lineHeight: 1.65 }}>{children}</div>
    </div>
  );
};

const ChipRow = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map((item) => (
      <span key={item} style={chipStyle}>
        {item}
      </span>
    ))}
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                textAlign: "left",
                padding: 8,
                borderBottom: "1px solid #e5e7eb",
                fontWeight: 700,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={`${i}-${j}`}
                style={{
                  padding: 8,
                  borderBottom: "1px solid #f1f5f9",
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

const Hero = ({ title, subtitle, chips = [] }) => (
  <section
    style={{
      ...styles.card,
      padding: 0,
      overflow: "hidden",
      display: "grid",
      gap: 0,
    }}
  >
    <div
      style={{
        minHeight: 270,
        backgroundImage: `linear-gradient(rgba(15,23,42,0.48), rgba(15,23,42,0.58)), url(${splashImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "end",
      }}
    >
      <div
        style={{
          color: "#fff",
          padding: 20,
          display: "grid",
          gap: 8,
          width: "100%",
        }}
      >
        <div
          style={{
            width: "fit-content",
            borderRadius: 999,
            padding: "6px 10px",
            background: "rgba(255,255,255,0.16)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          A1 German
        </div>
        <h1 style={{ ...styles.title, marginBottom: 0, color: "#fff" }}>{title}</h1>
        <p style={{ margin: 0, lineHeight: 1.65, maxWidth: 840 }}>{subtitle}</p>
      </div>
    </div>

    {chips.length ? (
      <div
        style={{
          padding: 14,
          background: "#f8fafc",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <ChipRow items={chips} />
      </div>
    ) : null}
  </section>
);

const TopicBanner = ({ image, eyebrow, title, text }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      overflow: "hidden",
      background: "#fff",
      display: "grid",
    }}
  >
    <div
      style={{
        minHeight: 180,
        backgroundImage: `linear-gradient(rgba(15,23,42,0.28), rgba(15,23,42,0.38)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div style={{ padding: 14, display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>{eyebrow}</div>
      <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
      <p style={{ ...paragraph, opacity: 0.9 }}>{text}</p>
    </div>
  </div>
);

const MiniRecap = ({ items }) => (
  <Callout title="Mini recap" variant="success">
    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </Callout>
);

const QuickBack = ({ navigate, to = "/campus/course" }) => (
  <div style={card}>
    <button
      style={{ ...styles.secondaryButton, width: "fit-content" }}
      onClick={() => navigate(to)}
    >
      Back to Course
    </button>
  </div>
);

const Checklist = ({ items }) => (
  <div style={whiteCard}>
    <strong>I can now...</strong>
    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

/* =========================
   Grammar Book
========================= */

export const WeekTimeSeparableGrammarBook = () => {
  const navigate = useNavigate();

  return (
    <main style={pageWrap}>
      <QuickBack navigate={navigate} />

      <Hero
        title="A1 Grammar Book: Meine Woche, die Uhrzeit und trennbare Verben"
        subtitle="In this lesson, you will learn the days of the week, how to tell time in German with halb and Viertel, and how separable verbs work in simple daily routine sentences. The lesson is built around one theme: Meine Woche und mein Tagesablauf."
        chips={[
          "Wochentage",
          "12-hour clock",
          "halb",
          "Viertel",
          "trennbare Verben",
          "daily routine",
        ]}
      />

      <Section
        title="1) Lesson goals"
        subtitle="Before you begin, know what this lesson will help you do."
      >
        <Callout title="Today you will learn how to..." variant="success">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>say the days of the week in German</li>
            <li>tell time with full hours, halb, and Viertel</li>
            <li>use simple separable verbs in present-tense sentences</li>
            <li>build short sentences about your week and daily routine</li>
          </ul>
        </Callout>

        <Callout title="Model sentence">
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>Am Montag</strong> stehe ich <strong>um halb sieben</strong>{" "}
              <strong>auf</strong>.
            </div>
            <div style={{ opacity: 0.9 }}>
              This one sentence already shows the 3 main lesson topics.
            </div>
          </div>
        </Callout>
      </Section>

      <Section
        title="2) Main theme: Meine Woche und mein Tagesablauf"
        subtitle="These grammar topics are easier to remember when they are connected to real life."
      >
        <TopicBanner
          image={topicImageRoutine}
          eyebrow="THEME"
          title="One story, not three separate grammar topics"
          text="We will keep coming back to a student's week: what day it is, what time something happens, and what action the student does."
        />

        <Table
          headers={["German", "English"]}
          rows={[
            ["Am Montag stehe ich um sechs Uhr auf.", "On Monday I get up at six o’clock."],
            [
              "Am Dienstag rufe ich meine Freundin um Viertel nach acht an.",
              "On Tuesday I call my friend at quarter past eight.",
            ],
            ["Am Freitag kaufen wir um vier Uhr ein.", "On Friday we shop at four o’clock."],
          ]}
        />
      </Section>

      <Section
        title="3) Days of the week"
        subtitle="Days of the week are nouns in German, so they begin with a capital letter."
      >
        <TopicBanner
          image={topicImageDays}
          eyebrow="TOPIC 1"
          title="Wochentage"
          text='Learn the names of the days and remember the useful pattern: "am + day".'
        />

        <Table
          headers={["German", "English", "Useful phrase"]}
          rows={[
            ["Montag", "Monday", "am Montag"],
            ["Dienstag", "Tuesday", "am Dienstag"],
            ["Mittwoch", "Wednesday", "am Mittwoch"],
            ["Donnerstag", "Thursday", "am Donnerstag"],
            ["Freitag", "Friday", "am Freitag"],
            ["Samstag", "Saturday", "am Samstag"],
            ["Sonntag", "Sunday", "am Sonntag"],
          ]}
        />

        <Callout title='Important note: use "am" with days'>
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>am Montag</strong> = on Monday
            </div>
            <div>
              <strong>am Freitag</strong> = on Friday
            </div>
            <div style={{ opacity: 0.9 }}>
              Tipp: Days of the week begin with a capital letter.
            </div>
          </div>
        </Callout>

        <Callout title="Examples">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              <strong>Am Montag</strong> lerne ich Deutsch. — On Monday I learn German.
            </li>
            <li>
              <strong>Am Mittwoch</strong> arbeite ich zu Hause. — On Wednesday I work at home.
            </li>
            <li>
              <strong>Am Sonntag</strong> sehe ich fern. — On Sunday I watch TV.
            </li>
          </ul>
        </Callout>

        <MiniRecap
          items={[
            'Days of the week begin with a capital letter.',
            'Use "am" with days: am Montag, am Dienstag...',
            "Days are often used to talk about routines.",
          ]}
        />
      </Section>

      <Section
        title="4) The 12-hour clock in German"
        subtitle="In everyday spoken German, people often use the 12-hour system."
      >
        <TopicBanner
          image={topicImageTime}
          eyebrow="TOPIC 2"
          title="Die Uhrzeit"
          text='Start with full hours, then learn "Viertel nach", "halb", and "Viertel vor".'
        />

        <Callout title='Start with full hours: "Es ist ... Uhr"'>
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>Es ist ein Uhr.</strong> — It is one o’clock.
            </div>
            <div>
              <strong>Es ist zwei Uhr.</strong> — It is two o’clock.
            </div>
            <div>
              <strong>Es ist drei Uhr.</strong> — It is three o’clock.
            </div>
          </div>
        </Callout>

        <Table
          headers={["Time", "German", "Meaning"]}
          rows={[
            ["1:00", "ein Uhr", "one o’clock"],
            ["2:00", "zwei Uhr", "two o’clock"],
            ["3:00", "drei Uhr", "three o’clock"],
            ["4:00", "vier Uhr", "four o’clock"],
          ]}
        />

        <Callout title="A1 note" variant="warning">
          <div>
            For <strong>1:00</strong>, say <strong>ein Uhr</strong>, not{" "}
            <strong>eins Uhr</strong>.
          </div>
        </Callout>

        <MiniRecap
          items={[
            'Use "Uhr" for full hours.',
            "Say ein Uhr, zwei Uhr, drei Uhr...",
            "This is the easiest starting point before learning minute patterns.",
          ]}
        />
      </Section>

      <Section
        title="5) Viertel and halb"
        subtitle="These patterns are very important in spoken German."
      >
        <ChipRow
          items={[
            "Viertel nach = quarter past",
            "Viertel vor = quarter to",
            "halb = half to the next hour",
          ]}
        />

        <Table
          headers={["Time", "German", "Meaning"]}
          rows={[
            ["1:15", "Viertel nach eins", "quarter past one"],
            ["1:30", "halb zwei", "half to two"],
            ["1:45", "Viertel vor zwei", "quarter to two"],
            ["7:15", "Viertel nach sieben", "quarter past seven"],
            ["7:30", "halb acht", "half to eight"],
            ["7:45", "Viertel vor acht", "quarter to eight"],
          ]}
        />

        <Callout title='Most important rule: "halb" uses the next hour'>
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>halb zwei</strong> = 1:30
            </div>
            <div>
              <strong>halb acht</strong> = 7:30
            </div>
            <div style={{ opacity: 0.9 }}>
              German thinks of it as <strong>half to</strong> the next hour.
            </div>
          </div>
        </Callout>

        <Callout title="Examples in full sentences">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>
              Der Kurs beginnt <strong>um Viertel nach acht</strong>. — The course begins at 8:15.
            </li>
            <li>
              Ich esse <strong>um halb sieben</strong> Frühstück. — I eat breakfast at 6:30.
            </li>
            <li>
              Wir treffen uns <strong>um Viertel vor neun</strong>. — We meet at 8:45.
            </li>
          </ul>
        </Callout>

        <Callout title="Pronunciation tip">
          <div style={{ display: "grid", gap: 6 }}>
            <div>
              Say these as one smooth phrase:
            </div>
            <ChipRow
              items={[
                "Viertel nach acht",
                "halb sieben",
                "Viertel vor neun",
              ]}
            />
          </div>
        </Callout>

        <MiniRecap
          items={[
            'Viertel nach = 15 minutes after.',
            'Viertel vor = 15 minutes before.',
            '"halb" points to the next hour.',
          ]}
        />
      </Section>

      <Section
        title="6) Separable verbs"
        subtitle="Some German verbs split in normal present-tense sentences."
      >
        <TopicBanner
          image={topicImageRoutine}
          eyebrow="TOPIC 3"
          title="Trennbare Verben"
          text="Many daily routine verbs are separable. Students need to see how the verb changes from the infinitive form to the sentence form."
        />

        <Callout title="What is a separable verb?">
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              A separable verb has two parts:
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>prefix</li>
              <li>main verb</li>
            </ul>
            <div>
              Example: <strong>aufstehen</strong> = to get up
            </div>
          </div>
        </Callout>

        <Table
          headers={["Infinitive", "Meaning", "Sentence"]}
          rows={[
            ["aufstehen", "to get up", "Ich stehe um sechs Uhr auf."],
            ["einkaufen", "to shop", "Wir kaufen am Samstag ein."],
            ["anrufen", "to call", "Ich rufe meine Mutter an."],
            ["fernsehen", "to watch TV", "Er sieht am Abend fern."],
          ]}
        />

        <Callout title="Rule">
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              In a simple present sentence, the verb splits:
            </div>
            <div>
              <strong>Ich stehe um sechs Uhr auf.</strong>
            </div>
            <div>
              <strong>Wir kaufen am Freitag ein.</strong>
            </div>
          </div>
        </Callout>

        <Callout title="Compare">
          <Table
            headers={["Infinitive", "Simple sentence"]}
            rows={[
              ["aufstehen", "Ich stehe früh auf."],
              ["anrufen", "Du rufst deine Freundin an."],
              ["einkaufen", "Wir kaufen heute ein."],
              ["fernsehen", "Sie sehen am Abend fern."],
            ]}
          />
        </Callout>

        <MiniRecap
          items={[
            "The verb is together in the infinitive: aufstehen.",
            "The verb splits in a simple sentence: Ich stehe ... auf.",
            "Many daily routine verbs are separable.",
          ]}
        />
      </Section>

      <Section
        title="7) Put everything together"
        subtitle="This is where the lesson becomes practical and memorable."
      >
        <Table
          headers={["Sentence", "What it shows"]}
          rows={[
            [
              "Am Montag stehe ich um halb sieben auf.",
              "day + time + separable verb",
            ],
            [
              "Am Dienstag rufe ich meinen Freund um Viertel nach acht an.",
              "day + Viertel + separable verb",
            ],
            [
              "Am Freitag kaufen wir um vier Uhr ein.",
              "day + full hour + separable verb",
            ],
            [
              "Am Sonntag sieht er um Viertel vor neun fern.",
              "day + quarter to + separable verb",
            ],
          ]}
        />

        <Callout title="Mini dialogue">
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>A:</strong> Wann stehst du am Montag auf?
            </div>
            <div>
              <strong>B:</strong> Ich stehe am Montag um halb sieben auf.
            </div>
            <div>
              <strong>A:</strong> Wann rufst du deine Mutter an?
            </div>
            <div>
              <strong>B:</strong> Ich rufe sie um Viertel nach acht an.
            </div>
          </div>
        </Callout>

        <Callout title="Mini speaking prompt">
          <div style={{ display: "grid", gap: 8 }}>
            <div>Answer these aloud:</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>Wann stehst du am Montag auf?</li>
              <li>Wann kaufst du am Samstag ein?</li>
              <li>Wann rufst du deine Freundin an?</li>
            </ul>
          </div>
        </Callout>
      </Section>

      <Section
        title="8) Common mistakes"
        subtitle="These are the mistakes A1 students often make."
      >
        <Callout title="Watch out" variant="warning">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              <strong>ein Uhr</strong>, not <strong>eins Uhr</strong>
            </li>
            <li>
              <strong>halb acht = 7:30</strong>, not 8:30
            </li>
            <li>
              <strong>Viertel vor acht = 7:45</strong>, not 8:15
            </li>
            <li>
              <strong>Am Montag</strong>, not <strong>am montag</strong>
            </li>
            <li>
              <strong>Ich stehe auf</strong>, not <strong>Ich aufstehe</strong>
            </li>
            <li>
              <strong>Ich rufe meine Mutter an</strong>, not{" "}
              <strong>Ich anrufe meine Mutter</strong>
            </li>
          </ul>
        </Callout>
      </Section>

      <Section
        title="9) Final summary"
        subtitle="Finish the lesson with a simple checklist."
      >
        <Checklist
          items={[
            "say the days of the week",
            'use "am" with days',
            "tell time with Uhr, halb, and Viertel",
            "understand that halb uses the next hour",
            "use basic separable verbs in a sentence",
            "build a short sentence about my week and daily routine",
          ]}
        />

        <Callout title="One final model sentence" variant="success">
          <div style={{ fontSize: 17, lineHeight: 1.7 }}>
            <strong>Am Mittwoch stehe ich um Viertel vor sieben auf.</strong>
          </div>
        </Callout>
      </Section>
    </main>
  );
};

/* =========================
   Practice Book
   Lighter and more mobile-friendly
========================= */

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”"]/g, '"')
    .replace(/[’]/g, "'");

const mcButtonStyle = (selected, correct, checked) => ({
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 12,
  border: checked
    ? selected
      ? correct
        ? "1px solid #16a34a"
        : "1px solid #dc2626"
      : "1px solid #e5e7eb"
    : selected
    ? "1px solid #111827"
    : "1px solid #d1d5db",
  background: checked
    ? selected
      ? correct
        ? "#f0fdf4"
        : "#fef2f2"
      : "#fff"
    : selected
    ? "#f8fafc"
    : "#fff",
  cursor: "pointer",
  fontSize: 15,
});

const PracticeQuestion = ({
  number,
  type,
  prompt,
  options = [],
  answer,
  explanation,
  placeholder = "Write your answer here",
}) => {
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);

  const isText = type === "text";
  const userValue = isText ? normalize(text) : normalize(selected);
  const correctValues = Array.isArray(answer)
    ? answer.map((a) => normalize(a))
    : [normalize(answer)];
  const isCorrect = checked ? correctValues.includes(userValue) : false;

  const handleCheck = () => setChecked(true);
  const handleReset = () => {
    setSelected("");
    setText("");
    setChecked(false);
  };

  return (
    <div style={softCard}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 13, opacity: 0.75 }}>Question {number}</div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{prompt}</div>
      </div>

      {isText ? (
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: "11px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 15,
          }}
        />
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => !checked && setSelected(opt)}
              style={mcButtonStyle(
                normalize(selected) === normalize(opt),
                correctValues.includes(normalize(opt)),
                checked
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          style={{ ...styles.primaryButton, width: "fit-content" }}
          onClick={handleCheck}
        >
          Check
        </button>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {checked ? (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 10,
            background: "#fff",
            lineHeight: 1.6,
          }}
        >
          {isCorrect ? (
            <div>
              ✅ <strong>Correct.</strong>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 6 }}>
              <div>
                ❌ <strong>Not quite.</strong>
              </div>
              <div>
                <strong>Correct answer:</strong>{" "}
                {Array.isArray(answer) ? answer.join(" / ") : answer}
              </div>
            </div>
          )}
          {explanation ? <div style={{ marginTop: 6, opacity: 0.92 }}>{explanation}</div> : null}
        </div>
      ) : null}
    </div>
  );
};

export const WeekTimeSeparablePracticeBook = () => {
  const navigate = useNavigate();

  const questions = useMemo(
    () => [
      {
        number: 1,
        type: "multiple",
        prompt: 'Which one means "on Monday"?',
        options: ["in Montag", "am Montag", "um Montag"],
        answer: "am Montag",
        explanation: 'Use "am" with days of the week.',
      },
      {
        number: 2,
        type: "multiple",
        prompt: "What comes after Mittwoch?",
        options: ["Dienstag", "Donnerstag", "Freitag"],
        answer: "Donnerstag",
      },
      {
        number: 3,
        type: "multiple",
        prompt: "What is 7:30 in common German?",
        options: ["halb sieben", "halb acht", "Viertel nach sieben"],
        answer: "halb acht",
        explanation: '"halb" uses the next hour.',
      },
      {
        number: 4,
        type: "multiple",
        prompt: 'What is "Viertel vor acht"?',
        options: ["7:15", "7:30", "7:45"],
        answer: "7:45",
      },
      {
        number: 5,
        type: "text",
        prompt: "Write 8:15 in German.",
        answer: ["Viertel nach acht", "viertel nach acht"],
        placeholder: 'Example: "Viertel nach ..."',
      },
      {
        number: 6,
        type: "multiple",
        prompt: "Which sentence is correct?",
        options: [
          "Ich aufstehe um sechs Uhr.",
          "Ich stehe um sechs Uhr auf.",
          "Ich stehe auf um sechs Uhr.",
        ],
        answer: "Ich stehe um sechs Uhr auf.",
        explanation: "In a simple sentence, the separable prefix goes to the end.",
      },
      {
        number: 7,
        type: "multiple",
        prompt: 'Choose the correct sentence with "anrufen".',
        options: [
          "Ich anrufe meine Mutter am Abend.",
          "Ich rufe meine Mutter am Abend an.",
          "Ich rufe an meine Mutter am Abend.",
        ],
        answer: "Ich rufe meine Mutter am Abend an.",
      },
      {
        number: 8,
        type: "multiple",
        prompt: 'What does this sentence mean? "Am Dienstag stehe ich um Viertel nach sechs auf."',
        options: [
          "On Tuesday I get up at 6:15.",
          "On Tuesday I get up at 6:30.",
          "On Tuesday I get up at 5:45.",
        ],
        answer: "On Tuesday I get up at 6:15.",
      },
      {
        number: 9,
        type: "text",
        prompt:
          'Write one short sentence with a day + time + separable verb. Use this idea: Montag / halb sieben / aufstehen',
        answer: [
          "Am Montag stehe ich um halb sieben auf.",
          "am montag stehe ich um halb sieben auf.",
        ],
        explanation: "This is only a light mini-check. One correct model sentence is enough.",
        placeholder: 'Example: "Am Montag ..."',
      },
    ],
    []
  );

  return (
    <main style={pageWrap}>
      <QuickBack navigate={navigate} />

      <Hero
        title="A1 Practice Check: Meine Woche, Uhrzeit und trennbare Verben"
        subtitle="This is a light mini-check to test your understanding. It is not the main assignment. Most questions are multiple choice, with only a little writing."
        chips={[
          "Mini-check",
          "light practice",
          "days",
          "time",
          "halb / Viertel",
          "separable verbs",
        ]}
      />

      <Section
        title="1) Before you begin"
        subtitle="This page is only for a quick check of understanding."
      >
        <Callout title="How to use this page">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            <li>Answer the questions one by one.</li>
            <li>Click Check to see if your answer is correct.</li>
            <li>Use this page to test yourself before the real assignment.</li>
          </ul>
        </Callout>

        <Checklist
          items={[
            'I can use "am" with days.',
            "I can read halb and Viertel correctly.",
            "I can recognize a separable verb sentence.",
          ]}
        />
      </Section>

      <Section
        title="2) Quick knowledge check"
        subtitle="Short and simple questions only."
      >
        <div style={{ display: "grid", gap: 14 }}>
          {questions.map((q) => (
            <PracticeQuestion key={q.number} {...q} />
          ))}
        </div>
      </Section>

      <Section
        title="3) Final reminder"
        subtitle="Keep these 3 key ideas in your head."
      >
        <Callout title="Remember" variant="success">
          <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              Use <strong>am</strong> with days: <strong>am Montag</strong>.
            </li>
            <li>
              <strong>halb</strong> uses the next hour: <strong>halb acht = 7:30</strong>.
            </li>
            <li>
              Separable verbs split: <strong>Ich stehe ... auf.</strong>
            </li>
          </ol>
        </Callout>
      </Section>
    </main>
  );
};

/* =========================
   Default export
========================= */

export default WeekTimeSeparableGrammarBook;
