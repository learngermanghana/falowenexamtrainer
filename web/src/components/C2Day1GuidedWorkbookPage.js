import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import { getC2Day1To7Mastery } from "../data/c2Day1To7Mastery";

const TABS = ["learn", "speak", "write", "finish", "references"];
const LABELS = {
  learn: "1. Learn",
  speak: "2. Speak",
  write: "3. Write",
  finish: "4. Finish",
  references: "5. Ref",
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0, fontSize: "1.18rem" }}>{title}</h2>
    {children}
  </section>
);

const ThinkingStep = ({ number, title, question, example }) => (
  <div style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 13, background: "#f8fbff", display: "grid", gap: 6 }}>
    <strong style={{ color: "#1e3a8a" }}>{number}. {title}</strong>
    <span style={{ color: "#334155", lineHeight: 1.6 }}>{question}</span>
    {example ? <span style={{ color: "#64748b", fontSize: 13 }}><strong>Example:</strong> {example}</span> : null}
  </div>
);

const RegisterCard = ({ label, sentence, note }) => (
  <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 13, background: "#fff", display: "grid", gap: 6 }}>
    <strong>{label}</strong>
    <span style={{ fontSize: "1.02rem" }}>{sentence}</span>
    <span style={{ color: "#64748b", fontSize: 13 }}>{note}</span>
  </div>
);

const ProgressCard = ({ label, done, detail }) => (
  <div style={{ border: `1px solid ${done ? "#86efac" : "#cbd5e1"}`, borderRadius: 14, padding: 13, background: done ? "#f0fdf4" : "#fff", display: "grid", gap: 4 }}>
    <strong>{done ? "Complete" : "Not complete"} · {label}</strong>
    <span style={{ color: "#64748b", fontSize: 13 }}>{detail}</span>
  </div>
);

export default function C2Day1GuidedWorkbookPage({ lesson }) {
  const mastery = lesson?.c2Mastery || getC2Day1To7Mastery(1);
  const storageKey = "falowen:c2:day1:guided-workbook";
  const [active, setActive] = useState("learn");
  const [progress, setProgress] = useState(() => {
    try {
      return {
        learnDone: false,
        speakDone: false,
        writeDone: false,
        confidence: "",
        reflection: "",
        ...JSON.parse(window.localStorage.getItem(storageKey) || "{}"),
      };
    } catch {
      return { learnDone: false, speakDone: false, writeDone: false, confidence: "", reflection: "" };
    }
  });
  const [speakPlan, setSpeakPlan] = useState("");
  const [writingPlan, setWritingPlan] = useState("");
  const [writingDraft, setWritingDraft] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  const wordCount = useMemo(() => writingDraft.trim() ? writingDraft.trim().split(/\s+/).length : 0, [writingDraft]);
  const finishReady = progress.learnDone && progress.speakDone && progress.writeDone && Boolean(progress.confidence);

  if (!mastery) return null;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 18 }} data-c2-day1-guided-workbook="true">
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={{ ...card, padding: "clamp(20px,4vw,34px)", background: "linear-gradient(135deg,#0f172a,#1e3a8a 58%,#2563eb)", color: "#fff" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.14)", color: "#fff" }}>C2</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.14)", color: "#fff" }}>Day 1</span>
          <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {mastery.chapter}</span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.2rem)" }}>{mastery.title}</h1>
          <p style={{ margin: "10px 0 0", color: "#dbeafe", lineHeight: 1.65 }}>{mastery.topic}</p>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,.2)", borderRadius: 14, padding: 13, background: "rgba(255,255,255,.08)" }}>
          <strong>Today’s C2 control:</strong> {mastery.grammarFocus}
        </div>
      </header>

      <nav style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(108px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.96)" }}>
        {TABS.map((tab) => (
          <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>
            {LABELS[tab]}
          </button>
        ))}
      </nav>

      {active === "learn" ? <>
        <Section title="Think first · Meaning before sophisticated German">
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
            At C2, the goal is not to replace every simple sentence with a difficult one. First decide what social effect you need. Then choose the language that produces that effect precisely.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            <ThinkingStep number="1" title="Meaning" question="What exactly do I want to communicate? Agreement, criticism, distance, solidarity, uncertainty?" example="I disagree with the position." />
            <ThinkingStep number="2" title="Relationship" question="Who is listening or reading? Friend, colleague, examiner, academic audience, authority?" example="An academic discussion requires controlled criticism rather than emotional slang." />
            <ThinkingStep number="3" title="Register" question="Should the sentence sound informal, neutral-professional or formal-academic?" example="Das ist Quatsch. → Ich halte diese Position für wenig überzeugend. → Diese Position erscheint nur bedingt tragfähig." />
            <ThinkingStep number="4" title="Precision" question="Which verb, noun or collocation expresses the exact stance?" example="problematisch, nur bedingt überzeugend, kritisch zu beurteilen" />
            <ThinkingStep number="5" title="Naturalness check" question="Would an educated native speaker actually say this here, or have I made it complicated only to sound advanced?" />
          </div>
        </Section>

        <Section title="Register ladder">
          <RegisterCard label="Informal" sentence="Das finde ich echt nicht gut." note="Personal, direct, emotional. Appropriate in an informal conversation." />
          <RegisterCard label="Neutral / professional" sentence="Ich halte diese Entwicklung für problematisch." note="Clear and controlled. Suitable for professional discussion." />
          <RegisterCard label="Formal / academic" sentence="Diese Entwicklung ist meines Erachtens kritisch zu beurteilen." note="More distanced and evaluative. Appropriate in academic argumentation." />
        </Section>

        <Section title="Precise vocabulary and collocations">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}>
            {mastery.vocabulary.map(([word, meaning]) => <div key={word} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}><strong>{word}</strong><div style={{ color: "#64748b" }}>{meaning}</div></div>)}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {mastery.collocations.map(([phrase, meaning, example]) => <div key={phrase} style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#eff6ff" }}><strong>{phrase}</strong> — {meaning}<p style={{ margin: "6px 0 0" }}>{example}</p></div>)}
          </div>
        </Section>

        <Section title="Meaning & nuance check">
          <strong>{mastery.nuance.q}</strong>
          <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>{mastery.nuance.o.map((option) => <li key={option}>{option}</li>)}</ol>
          <details><summary>Show answer and reasoning</summary><p><strong>{mastery.nuance.o[mastery.nuance.a]}</strong></p><p>{mastery.nuance.e}</p></details>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}><input type="checkbox" checked={progress.learnDone} onChange={(e) => setProgress((old) => ({ ...old, learnDone: e.target.checked }))} />I can explain why the academic option fits better.</label>
        </Section>
      </> : null}

      {active === "speak" ? <>
        <Section title="Speak · Build the thought before the sentence">
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 13, background: "#eff6ff", lineHeight: 1.7 }}>
            <strong>Question:</strong> Passt du deine Sprache an unterschiedliche Menschen oder Situationen an? Ist das soziale Kompetenz oder Konformität?
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <ThinkingStep number="1" title="Choose your position" question="Mostly social competence, mostly conformity, or both depending on context?" />
            <ThinkingStep number="2" title="Choose two reasons" question="For example: belonging, respect, professional expectations, authenticity, pressure to fit in." />
            <ThinkingStep number="3" title="Add one contrast" question="Show where adaptation is useful and where it becomes problematic." example="Während sprachliche Anpassung Rücksicht ausdrücken kann, wird sie problematisch, wenn ..." />
            <ThinkingStep number="4" title="Upgrade selectively" question="Use two Day 1 collocations naturally. Do not force all four into the answer." />
          </div>
          <textarea value={speakPlan} onChange={(e) => setSpeakPlan(e.target.value)} placeholder="Plan: position → reason 1 → example → contrast → conclusion" style={{ minHeight: 170, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.7 }} />
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}><input type="checkbox" checked={progress.speakDone} onChange={(e) => setProgress((old) => ({ ...old, speakDone: e.target.checked }))} />I gave a 2–3 minute answer using a controlled register.</label>
        </Section>
      </> : null}

      {active === "write" ? <>
        <Section title="Write · From idea to C2 formulation">
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 13, background: "#eff6ff", lineHeight: 1.7 }}>
            <strong>Task:</strong> Schreiben Sie einen argumentativen Beitrag darüber, ob sprachliche Anpassung eher soziale Kompetenz, Konformität oder eine notwendige Form gesellschaftlicher Kommunikation darstellt.
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <ThinkingStep number="1" title="Answer the question in one simple sentence" question="Do not start with C2 vocabulary. First make your actual position clear." />
            <ThinkingStep number="2" title="Build the logic" question="Position → criterion → example → counterargument → evaluation." />
            <ThinkingStep number="3" title="Choose the register" question="This is an argumentative academic text, so emotional everyday wording should be reformulated." />
            <ThinkingStep number="4" title="Upgrade the language" question="Replace only vague words with precise expressions and natural collocations." example="Leute reden anders → Menschen passen ihren Sprachgebrauch an, um Zugehörigkeit zu signalisieren." />
            <ThinkingStep number="5" title="Check control" question="Can you defend every complex phrase? If a simpler sentence is more precise, keep the simpler sentence." />
          </div>
          <label style={{ display: "grid", gap: 7 }}><strong>Planning box</strong><textarea value={writingPlan} onChange={(e) => setWritingPlan(e.target.value)} placeholder="Position / Kriterien / Beispiel / Gegenargument / Bewertung" style={{ minHeight: 150, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.7 }} /></label>
          <label style={{ display: "grid", gap: 7 }}><strong>Final German text</strong><textarea value={writingDraft} onChange={(e) => setWritingDraft(e.target.value)} placeholder="Write your C2 argument here..." style={{ minHeight: 320, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", lineHeight: 1.7 }} /></label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "#475569" }}><span>{wordCount} words</span><span>Target: about 180–220 words</span></div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}><input type="checkbox" checked={progress.writeDone} onChange={(e) => setProgress((old) => ({ ...old, writeDone: e.target.checked }))} />I revised the text for precision, register, nuance and natural collocations.</label>
        </Section>
      </> : null}

      {active === "finish" ? <Section title="Finish C2 Day 1">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          <ProgressCard label="Learn" done={progress.learnDone} detail="Register and nuance understood" />
          <ProgressCard label="Speak" done={progress.speakDone} detail="Spoken argument completed" />
          <ProgressCard label="Write" done={progress.writeDone} detail={`${wordCount} words · revision completed`} />
        </div>
        <label style={{ display: "grid", gap: 7 }}><strong>Confidence</strong><select value={progress.confidence} onChange={(e) => setProgress((old) => ({ ...old, confidence: e.target.value }))} style={styles.select}><option value="">Select confidence</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label style={{ display: "grid", gap: 7 }}><strong>Reflection</strong><textarea value={progress.reflection} onChange={(e) => setProgress((old) => ({ ...old, reflection: e.target.value }))} placeholder="Which register decisions were difficult today?" style={{ minHeight: 110, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit" }} /></label>
        <div style={{ border: `1px solid ${finishReady ? "#86efac" : "#fde68a"}`, borderRadius: 14, padding: 13, background: finishReady ? "#f0fdf4" : "#fffbeb" }}>
          {finishReady ? "Day 1 requirements complete." : "Complete Learn, Speak, Write and choose your confidence level before treating Day 1 as complete."}
        </div>
      </Section> : null}

      {active === "references" ? <>
        <Section title="Reformulation reference">
          <p><strong>Starting version:</strong> {mastery.reformulation[0]}</p>
          <p><strong>C2 model:</strong> {mastery.reformulation[1]}</p>
          <p style={{ color: "#475569", lineHeight: 1.7 }}>The model is not better because it is longer. It is better because it names the communicative action precisely: adapting language in order to signal social belonging.</p>
        </Section>
        <Section title="C2 challenge">
          <p style={{ margin: 0, lineHeight: 1.7 }}>{mastery.challenge}</p>
          <strong>Final control: meaning · register · precision · nuance · natural collocation.</strong>
        </Section>
      </> : null}
    </main>
  );
}
