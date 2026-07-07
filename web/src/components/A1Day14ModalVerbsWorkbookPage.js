import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import A2Day17InDieApothekeModalverbenFragenGrammarPage from "./A2Day17InDieApothekeModalverbenFragenGrammarPage";

import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const primaryBtn = styles.primaryButton || styles.secondaryButton;
const secondaryBtn = styles.secondaryButton || styles.primaryButton;

const modalVerbs = [
  { verb: "können", meaning: "can / to be able to", example: "Ich kann morgen kommen." },
  { verb: "müssen", meaning: "must / to have to", example: "Wir müssen heute lernen." },
  { verb: "dürfen", meaning: "may / to be allowed to", example: "Du darfst hier sitzen." },
  { verb: "wollen", meaning: "to want to", example: "Ich will Deutsch lernen." },
  { verb: "sollen", meaning: "should / to be supposed to", example: "Sie soll den Arzt anrufen." },
  { verb: "mögen", meaning: "to like", example: "Er mag Musik." },
  { verb: "möchten", meaning: "would like", example: "Ich möchte Wasser trinken." },
];

const exercises = [
  { prompt: "Ich ___ morgen kommen.", answer: "kann" },
  { prompt: "Wir ___ heute lernen.", answer: "müssen" },
  { prompt: "Du ___ hier nicht rauchen.", answer: "darfst" },
  { prompt: "Ich ___ nach Deutschland reisen.", answer: "möchte" },
];

const SectionCard = ({ title, children }) => (
  <div style={card}>
    <h2 style={sectionTitle}>{title}</h2>
    {children}
  </div>
);

const A1Day14ModalVerbsWorkbookPage = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedLevel = String(query.get("level") || "").toUpperCase();
  const requestedDay = Number(query.get("day") || 0);
  const isA2Day17Context = requestedLevel === "A2" && requestedDay === 17;
  const [answersVisible, setAnswersVisible] = useState(false);

  if (isA2Day17Context) {
    return <A2Day17InDieApothekeModalverbenFragenGrammarPage />;
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...card, gap: 14, overflow: "hidden", padding: 0 }}>
        <div style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1600&q=80"
            alt="Germany travel theme"
            loading="lazy"
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.12))" }} />
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, color: "white" }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>A1 · Day 14 · Modal Verbs</div>
            <div style={{ opacity: 0.92, fontSize: 13 }}>können · müssen · dürfen · wollen · sollen · mögen · möchten</div>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          <div style={{ display: "grid", gap: 6 }}>
            <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 14 In-App Workbook · Modal Verbs</h1>
            <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 3.6 · Schreiben &amp; Sprechen · Self-practice</p>
            <p style={{ margin: 0, color: "#4b5563" }}>
              Objective: use modal verbs with an infinitive at the end of the sentence.
            </p>
          </div>
        </div>
      </div>

      <SectionCard title="1) Modal verb pattern">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          A modal verb supports another verb. The modal verb is conjugated in position 2, and the main verb goes to the end in infinitive form.
        </p>
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
          <strong>Pattern:</strong> Subject + modal verb + time/details + infinitive.
          <br />
          <strong>Example:</strong> Ich möchte morgen Deutsch lernen.
        </div>
      </SectionCard>

      <SectionCard title="2) Modal verbs and meanings">
        <ul style={listStyle}>
          {modalVerbs.map((item) => (
            <li key={item.verb}>
              <strong>{item.verb}</strong> — {item.meaning}
              <br />
              <span style={{ color: "#4b5563" }}>{item.example}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="3) Mini practice">
        <p style={{ margin: 0 }}>Choose the correct modal verb.</p>
        <ol style={listStyle}>
          {exercises.map((exercise, index) => (
            <li key={exercise.prompt}>
              {exercise.prompt}
              {answersVisible ? <strong> → {exercise.answer}</strong> : null}
            </li>
          ))}
        </ol>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={primaryBtn} onClick={() => setAnswersVisible((current) => !current)}>
            {answersVisible ? "Hide answers" : "Show answers"}
          </button>
          <button type="button" style={secondaryBtn} onClick={() => setAnswersVisible(false)}>
            Reset
          </button>
        </div>
      </SectionCard>

      <SectionCard title="4) Self-check">
        <ul style={listStyle}>
          <li>I can name common modal verbs.</li>
          <li>I can place the infinitive at the end.</li>
          <li>I can build simple sentences with modal verbs.</li>
        </ul>
      </SectionCard>
    </div>
  );
};

export default A1Day14ModalVerbsWorkbookPage;
