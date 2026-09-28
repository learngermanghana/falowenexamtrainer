import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import { styles } from "../styles";

const palette = {
  ink: "#172033",
  muted: "#5f6b7c",
  border: "#dfe6ef",
  indigo: "#4338ca",
  indigoSoft: "#eef2ff",
  green: "#15803d",
  greenSoft: "#f0fdf4",
  amber: "#b45309",
  amberSoft: "#fffbeb",
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: `1px solid ${palette.border}`,
  borderRadius: 20,
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.07)",
};

const Section = ({ eyebrow, title, description, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 5 }}>
      {eyebrow ? (
        <span style={{ color: palette.indigo, fontSize: 12, fontWeight: 900, letterSpacing: 0.7, textTransform: "uppercase" }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0, color: palette.ink, fontSize: "clamp(1.3rem, 3vw, 1.7rem)" }}>{title}</h2>
      {description ? <p style={{ margin: 0, color: palette.muted, lineHeight: 1.65 }}>{description}</p> : null}
    </div>
    {children}
  </section>
);

const Callout = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { background: palette.indigoSoft, border: "#c7d2fe", color: "#312e81" },
    green: { background: palette.greenSoft, border: "#bbf7d0", color: "#14532d" },
    amber: { background: palette.amberSoft, border: "#fde68a", color: "#78350f" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, borderRadius: 15, padding: 14, background: selected.background, color: selected.color, lineHeight: 1.65, display: "grid", gap: 7 }}>
      {children}
    </div>
  );
};

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 21, display: "grid", gap: 7, lineHeight: 1.6 }}>
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

const teil1Fields = [
  ["Name", "Ich heiße Ama."],
  ["Alter", "Ich bin 24 Jahre alt."],
  ["Land", "Ich komme aus Ghana."],
  ["Wohnort", "Ich wohne in Kumasi."],
  ["Sprachen", "Ich spreche Englisch, Twi und ein bisschen Deutsch."],
  ["Beruf / Studium", "Ich bin Lehrerin von Beruf. / Ich studiere ..."],
  ["Hobby", "Mein Hobby ist Musik. / Ich höre gern Musik."],
];

const teil2Cards = [
  ["Freizeit", "Wochenende", "Was machst du am Wochenende?"],
  ["Persönliche Informationen", "Familie", "Hast du Geschwister?"],
  ["Wohnen", "Wohnort", "Wo wohnst du?"],
  ["Essen und Trinken", "Getränke", "Trinkst du gern Kaffee?"],
  ["Alltag", "Freizeit", "Was machst du gern in deiner Freizeit?"],
  ["Sprachen", "Deutsch", "Warum lernst du Deutsch?"],
];

const teil3Cards = [
  ["Stift", "Können Sie mir bitte einen Stift geben?", "Ja, gern."],
  ["Fenster", "Können Sie bitte das Fenster öffnen?", "Ja, natürlich."],
  ["Tür", "Können Sie bitte die Tür schließen?", "Kein Problem."],
  ["Wasser", "Können Sie mir bitte Wasser geben?", "Ja, gern."],
];

const readinessItems = [
  "I can complete Teil 1 without a long pause.",
  "I can spell my name and say a number clearly.",
  "I can turn a topic word into a suitable question.",
  "I answer the question that was actually asked.",
  "I can make a polite request and react naturally.",
  "I can continue after a small mistake instead of stopping.",
];

export default function VerbotenErlaubtPage() {
  const [revealedTeil2, setRevealedTeil2] = useState({});
  const [revealedTeil3, setRevealedTeil3] = useState({});

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18, maxWidth: 1100 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={{ borderRadius: 26, padding: "clamp(24px, 5vw, 48px)", background: "linear-gradient(135deg, #0f172a, #1e3a8a, #4338ca)", color: "#fff", display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["A1", "Day 19", "Chapter 5.9", "Goethe Sprechen"].map((label) => (
            <span key={label} style={{ borderRadius: 999, padding: "6px 10px", background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.24)", fontSize: 12, fontWeight: 900 }}>{label}</span>
          ))}
        </div>
        <div>
          <p style={{ margin: "0 0 8px", color: "#bfdbfe", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 13 }}>Goethe A1 Sprechen · Prüfungstraining</p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.8rem)", lineHeight: 1.04 }}>Are you ready for the A1 speaking exam?</h1>
        </div>
        <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.7, fontSize: "clamp(1rem, 2.3vw, 1.16rem)", maxWidth: 820 }}>
          This lesson is an exam-readiness lab. Practise Teil 1, Teil 2 and Teil 3 in exam order, then complete a mock speaking round with as little help as possible.
        </p>
      </header>

      <Section eyebrow="Exam map" title="Know the three speaking parts" description="Keep this short. The goal is performance, not a long grammar lesson.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
          <Callout><strong>Teil 1 · Sich vorstellen</strong><span>Introduce yourself, spell a name and say a number clearly.</span></Callout>
          <Callout tone="green"><strong>Teil 2 · Fragen und Antworten</strong><span>Use a topic/keyword to ask a question, then answer your partner.</span></Callout>
          <Callout tone="amber"><strong>Teil 3 · Bitten und reagieren</strong><span>Make a polite request from a card and react naturally to your partner.</span></Callout>
        </div>
      </Section>

      <Section eyebrow="Goethe A1 · Teil 1" title="Sich vorstellen · 30–45 seconds" description="Practise a complete introduction without reading a long script.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {teil1Fields.map(([label, model]) => (
            <div key={label} style={{ border: `1px solid ${palette.border}`, borderRadius: 14, padding: 12, display: "grid", gap: 5 }}>
              <strong style={{ color: palette.indigo }}>{label}</strong>
              <span style={{ color: palette.ink }}>{model}</span>
            </div>
          ))}
        </div>
        <Callout tone="green">
          <strong>Complete model</strong>
          <span>Ich heiße Ama. Ich bin 24 Jahre alt. Ich komme aus Ghana. Ich wohne in Kumasi. Ich spreche Englisch, Twi und ein bisschen Deutsch. Ich bin Lehrerin von Beruf. Mein Hobby ist Musik.</span>
        </Callout>
        <Callout tone="amber">
          <strong>Extra exam checks</strong>
          <span>Buchstabiere deinen Nachnamen.</span>
          <span>Sage eine Telefonnummer oder eine Zahl klar auf Deutsch.</span>
        </Callout>
      </Section>

      <Section eyebrow="Goethe A1 · Teil 2" title="Use the theme and keyword to form a question" description="The THEMA gives the broad area. The STICHWORT / KEYWORD is the word you use to build your question. Say your question aloud before you reveal the model.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {teil2Cards.map(([theme, keyword, model]) => {
            const cardKey = `${theme}:${keyword}`;
            const open = Boolean(revealedTeil2[cardKey]);
            return (
              <article key={cardKey} style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, display: "grid", gap: 10, background: "#f8faff" }}>
                <div style={{ display: "grid", gap: 3 }}>
                  <span style={{ color: palette.muted, fontSize: 11, fontWeight: 900, letterSpacing: 0.6 }}>THEMA</span>
                  <strong style={{ fontSize: 16, color: palette.ink }}>{theme}</strong>
                </div>
                <div style={{ display: "grid", gap: 3, borderTop: "1px solid #dbeafe", paddingTop: 9 }}>
                  <span style={{ color: palette.indigo, fontSize: 11, fontWeight: 900, letterSpacing: 0.6 }}>STICHWORT · KEYWORD</span>
                  <strong style={{ fontSize: 24, color: palette.indigo }}>{keyword}</strong>
                </div>
                <p style={{ margin: 0, color: palette.muted }}>Stelle deinem Partner mit dem Stichwort eine passende Frage.</p>
                <button type="button" onClick={() => setRevealedTeil2((current) => ({ ...current, [cardKey]: !open }))} style={styles.secondaryButton}>
                  {open ? "Hide model" : "Show model"}
                </button>
                {open ? <Callout><strong>Model</strong><span>{model}</span></Callout> : null}
              </article>
            );
          })}
        </div>
        <Callout>
          <strong>Only use the rule when you need it</strong>
          <span>W-Frage: <strong>W-Wort + Verb + Subjekt + ...?</strong></span>
          <span>Ja/Nein-Frage: <strong>Verb + Subjekt + ...?</strong></span>
        </Callout>
      </Section>

      <Section eyebrow="Goethe A1 · Teil 3" title="Make a request and react" description="Look at the keyword, speak first, then reveal the model.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {teil3Cards.map(([keyword, request, reaction]) => {
            const open = Boolean(revealedTeil3[keyword]);
            return (
              <article key={keyword} style={{ border: "1px solid #bbf7d0", borderRadius: 16, padding: 14, display: "grid", gap: 10, background: "#f7fef9" }}>
                <span style={{ color: palette.muted, fontSize: 12, fontWeight: 900 }}>KARTE</span>
                <strong style={{ fontSize: 22, color: palette.green }}>{keyword}</strong>
                <p style={{ margin: 0, color: palette.muted }}>Formuliere eine höfliche Bitte.</p>
                <button type="button" onClick={() => setRevealedTeil3((current) => ({ ...current, [keyword]: !open }))} style={styles.secondaryButton}>
                  {open ? "Hide model" : "Show model"}
                </button>
                {open ? <Callout tone="green"><strong>Bitte</strong><span>{request}</span><strong>Reaktion</strong><span>{reaction}</span></Callout> : null}
              </article>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Mini mock exam" title="Teil 1 → Teil 2 → Teil 3 · with minimal help" description="This is the real readiness check. Do not stop after every small error. Finish the interaction first, then review.">
        <BulletList items={[
          "Teil 1: introduce yourself in 30–45 seconds, then spell your surname and say one number.",
          "Teil 2: take a fresh topic card, ask a question, listen and answer your partner.",
          "Teil 3: take a fresh request card, make the request and react to your partner.",
          "If you make a small mistake, continue with simple German instead of stopping.",
        ]} />
      </Section>

      <A1ExamSpeakingPracticePanel />

      <Section eyebrow="Readiness" title="Can I do this tomorrow in the exam?" description="Use this checklist after the mock round.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
          {readinessItems.map((item) => (
            <label key={item} style={{ border: `1px solid ${palette.border}`, borderRadius: 14, padding: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <input type="checkbox" style={{ marginTop: 3 }} />
              <span style={{ color: palette.ink, lineHeight: 1.5 }}>{item}</span>
            </label>
          ))}
        </div>
        <Callout tone="amber">
          <strong>Final challenge</strong>
          <span>Use one fresh prompt that you have not practised before. Answer without opening a model first.</span>
        </Callout>
      </Section>
    </div>
  );
}
