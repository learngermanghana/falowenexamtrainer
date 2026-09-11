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

const examParts = [
  ["Teil 1", "Sich vorstellen", "Introduce yourself and answer simple personal questions."],
  ["Teil 2", "Um Informationen bitten und Informationen geben", "Ask and answer a simple question using a topic card."],
  ["Teil 3", "Bitten formulieren und darauf reagieren", "Make a polite request from a picture/card and react to another person’s request."],
];

const requestExamples = [
  ["help", "Können Sie mir bitte helfen?"],
  ["repeat", "Können Sie das bitte wiederholen?"],
  ["speak slowly", "Können Sie bitte langsamer sprechen?"],
  ["give something", "Können Sie mir bitte das Formular geben?"],
  ["wait", "Können Sie bitte warten?"],
];

const SpeakingExamIntroPage = () => (
  <main style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <span style={{ borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>
        A1.2 · Day 15 · Chapter 4.7
      </span>
    </div>

    <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
      <h1 style={{ ...styles.title, margin: 0 }}>Introduction to the Goethe A1 Speaking Exam</h1>
      <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 850 }}>
        First understand the complete speaking exam. Then practise today’s main skill in detail: <strong>Teil 3</strong>, where you make a polite request and react to a request.
      </p>
    </header>

    <Section eyebrow="Big picture" title="The three speaking parts">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {['Part', 'What it is called', 'What you do'].map((heading) => (
                <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examParts.map((row) => (
              <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
        <strong>Today’s focus:</strong> Teil 3. You are not expected to master every speaking part in one lesson; this page gives you the map first, then trains one part properly.
      </div>
    </Section>

    <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
      <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
        <li>name the three parts of the Goethe A1 speaking exam;</li>
        <li>make a polite formal request using <strong>Können Sie bitte ...?</strong> or the Sie-imperative;</li>
        <li>accept or refuse a simple request politely.</li>
      </ol>
    </Section>

    <Section eyebrow="Teil 3 core" title="The safest request pattern">
      <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
        <strong style={{ fontSize: 20 }}>Können Sie bitte + Infinitiv ...?</strong>
        <span>The conjugated verb <strong>können</strong> is in position 1, <strong>Sie</strong> follows it, and the main verb goes to the end.</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {requestExamples.map(([situation, sentence]) => (
          <div key={situation} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
            <strong>{sentence}</strong> <span style={{ color: "#64748b" }}>({situation})</span>
          </div>
        ))}
      </div>
    </Section>

    <Section eyebrow="Alternative" title="Sie-Imperativ">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        You can also use the formal imperative: <strong>Verb + Sie + bitte</strong>. It is correct and useful, but <strong>Können Sie bitte ...?</strong> is often the easiest polite structure for beginners.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {['Infinitive', 'Sie-Imperativ', 'Question with können'].map((heading) => (
                <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["warten", "Warten Sie bitte.", "Können Sie bitte warten?"],
              ["helfen", "Helfen Sie mir bitte.", "Können Sie mir bitte helfen?"],
              ["wiederholen", "Wiederholen Sie das bitte.", "Können Sie das bitte wiederholen?"],
              ["sprechen", "Sprechen Sie bitte langsamer.", "Können Sie bitte langsamer sprechen?"],
            ].map((row) => (
              <tr key={row[0]}>{row.map((cell) => <td key={cell} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section eyebrow="Reacting" title="Accept or refuse politely">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
        <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
          <strong>Accept</strong>
          <span>Ja, natürlich.</span>
          <span>Ja, gern.</span>
          <span>Natürlich, hier bitte.</span>
        </div>
        <div style={{ border: "1px solid #fecdd3", background: "#fff1f2", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
          <strong>Refuse</strong>
          <span>Tut mir leid, das geht leider nicht.</span>
          <span>Leider kann ich nicht.</span>
          <span>Entschuldigung, das ist leider nicht möglich.</span>
        </div>
      </div>
    </Section>

    <Section eyebrow="Guided practice" title="Build a request from the situation">
      <div style={{ display: "grid", gap: 12 }}>
        {[
          ["You do not understand the speaker.", "Können Sie das bitte wiederholen?"],
          ["The other person is speaking too fast.", "Können Sie bitte langsamer sprechen?"],
          ["You need the form on the table.", "Können Sie mir bitte das Formular geben?"],
          ["You need help at the station.", "Können Sie mir bitte helfen?"],
        ].map(([situation, model], index) => (
          <details key={situation} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
            <summary style={{ cursor: "pointer", fontWeight: 800 }}>{index + 1}. {situation}</summary>
            <p style={{ margin: "10px 0 0" }}><strong>Model:</strong> {model}</p>
          </details>
        ))}
      </div>
    </Section>

    <Section eyebrow="Mini exam" title="Do this without looking at the models">
      <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
        <li>Make one request for <strong>Wasser</strong>.</li>
        <li>Make one request for <strong>Hilfe</strong>.</li>
        <li>Ask somebody to <strong>wait</strong>.</li>
        <li>React positively to one request.</li>
        <li>React negatively but politely to one request.</li>
      </ol>
    </Section>

    <Section eyebrow="Official practice" title="Continue with Goethe material">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        After practising the structures above, use the official Goethe A1 speaking practice and focus on Teil 3 picture prompts.
      </p>
      <a href="https://bfu.goethe.de/a1_sd1/sprechen.php" target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>
        Open official Goethe A1 speaking practice
      </a>
    </Section>

    <Section eyebrow="Self-check" title="You are ready when you can do these three things">
      <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, lineHeight: 1.65 }}>
        <li>Explain what happens in Teil 1, Teil 2 and Teil 3.</li>
        <li>Make a request with <strong>Können Sie bitte ...?</strong> without copying a model.</li>
        <li>Respond naturally with a short acceptance or refusal.</li>
      </ul>
    </Section>
  </main>
);

export default SpeakingExamIntroPage;
