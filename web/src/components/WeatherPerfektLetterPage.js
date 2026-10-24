import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
};

const Section = ({ eyebrow, title, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 4 }}>
      {eyebrow ? (
        <span style={{ color: "#475569", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

const weatherWords = [
  ["Es ist sonnig.", "It is sunny."],
  ["Es ist warm.", "It is warm."],
  ["Es ist kalt.", "It is cold."],
  ["Es ist windig.", "It is windy."],
  ["Es regnet.", "It is raining."],
  ["Es schneit.", "It is snowing."],
  ["Es gibt einen Sturm.", "There is a storm."],
  ["Es sind 25 Grad.", "It is 25 degrees."],
];


const WeatherPerfektLetterPage = () => (
    <main
      data-a1-day21-three-point-grammar="true"
      style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>
          A1 · Day 21 · Chapter 13
        </span>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <h1 style={{ ...styles.title, margin: 0 }}>Weather and Letter Writing</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 850 }}>
          Learn the weather language you need for the Day 13 email. The writing task has <strong>exactly three content points</strong>:
          say you cannot come, give one concrete weather reason, and suggest another meeting.
        </p>
      </header>

      <Section eyebrow="Today's targets" title="What you should understand">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>describe common weather with <strong>Es ist + adjective</strong> and common weather verbs;</li>
          <li>recognise the difference between a weather description and a useful weather reason;</li>
          <li>answer exactly three content points in the Day 13 email;</li>
          <li>keep greeting, closing and name as letter form, not extra task points.</li>
        </ol>
      </Section>

      <Section eyebrow="Weather grammar" title="Two patterns you need">
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
            <strong>1. Es ist + adjective</strong>
            <div>Es ist kalt.</div>
            <div>Es ist warm.</div>
            <div>Es ist windig.</div>
            <div>Es ist sonnig.</div>
          </div>
          <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
            <strong>2. Es + weather verb</strong>
            <div>Es regnet.</div>
            <div>Es schneit.</div>
            <div>Die Sonne scheint.</div>
            <div>Es gibt einen Sturm.</div>
          </div>
        </div>
        <div style={{ borderLeft: "4px solid #d97706", background: "#fffbeb", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
          <strong>Important:</strong> say <strong>Es regnet</strong>, not <strong>Es ist regnet</strong>. For temperature, say <strong>Es sind 25 Grad.</strong>
        </div>
      </Section>

      <Section eyebrow="Useful vocabulary" title="Core weather phrases">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {weatherWords.map(([german, english]) => (
            <div key={german} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
              <strong>{german}</strong>
              <div style={{ color: "#64748b", marginTop: 4 }}>{english}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Time in letters" title="Seasons, months, days and clock times">
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
            <strong>im + season / month</strong>
            <div>im Sommer</div>
            <div>im Winter</div>
            <div>im Frühling</div>
            <div>im Herbst</div>
            <div>im Januar / im Juli</div>
          </div>
          <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
            <strong>am + day / date</strong>
            <div>am Montag</div>
            <div>am Samstag</div>
            <div>am 12. Juli</div>
          </div>
          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
            <strong>um + clock time</strong>
            <div>um 8 Uhr</div>
            <div>um 14:30 Uhr</div>
          </div>
        </div>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.7 }}>
          <strong>Use them in letters:</strong><br />
          Im Sommer ist es oft warm. Am Samstag kann ich nicht kommen. Können wir uns am Montag um 16 Uhr treffen?
        </div>
      </Section>

      <Section eyebrow="Understanding" title="Weather description vs. weather reason">
        <div style={{ display: "grid", gap: 10, lineHeight: 1.7 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
            <strong>Description only:</strong><br />
            Es ist sonnig.<br />
            <span style={{ color: "#64748b" }}>This tells us the weather, but it does not explain why you cannot attend.</span>
          </div>
          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14 }}>
            <strong>Concrete reason:</strong><br />
            Es regnet sehr stark, und mein Bus fährt nicht.<br />
            <span style={{ color: "#475569" }}>Now the weather is connected to the problem, so the reason is clear.</span>
          </div>
          <p style={{ margin: 0 }}>
            You do <strong>not</strong> need an advanced sentence. Two short A1 sentences are also acceptable:
            <strong> Leider kann ich nicht kommen. Es gibt einen starken Sturm.</strong>
          </p>
        </div>
      </Section>

      <Section eyebrow="Writing task" title="Exactly three content points">
        <div style={{ display: "grid", gap: 10 }}>
          {[
            ["1", "Say you cannot come to the wedding", "Leider kann ich nicht zur Hochzeit kommen."],
            ["2", "Give one concrete weather reason", "Es regnet sehr stark, und mein Bus fährt nicht."],
            ["3", "Suggest another meeting", "Können wir uns am Sonntag treffen?"],
          ].map(([number, title, example]) => (
            <div key={number} style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: 14, display: "grid", gap: 5 }}>
              <strong>Content point {number}: {title}</strong>
              <span>{example}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
          <strong>Letter form is separate:</strong> <strong>Liebe Bina,</strong> + the three content points + <strong>Liebe Grüße</strong> + your name.
          Greeting, closing and name are required, but they do not become a fourth, fifth or sixth content point.
        </div>
      </Section>
    </main>
  );

export default WeatherPerfektLetterPage;
