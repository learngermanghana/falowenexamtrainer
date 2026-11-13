import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import { useAuth } from "../context/AuthContext";
import A1FamilyRecording from "./A1FamilyRecording";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";
import { useA1TimedMockExam } from "./A1TimedMockExam";
import React, { useState } from "react";
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

const tasks = [
  { teil: "1", title: "Sich vorstellen", prompt: "Stellen Sie sich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie Ihren Nachnamen und sagen Sie eine Telefonnummer. Die Nummer darf erfunden sein." },
  { teil: "2", title: "Fragen und Antworten", prompt: "Thema: Einkaufen. Stichwort: Supermarkt. Stellen Sie eine Frage mit dem Stichwort. Antworten Sie dann auf die Frage: Wann kaufen Sie normalerweise ein?" },
  { teil: "3", title: "Bitten und reagieren", prompt: "Sie brauchen einen Regenschirm. Bitten Sie höflich darum. Reagieren Sie dann auf die Bitte: Können Sie mir bitte helfen?" },
];

function Day19SpeakingTask({ task }) {
  const { draft, updateRecording } = useA1TutorWorkbookDraft();
  const { attemptState, secondsLeft, startBusy } = useA1TimedMockExam();
  const sectionKey = `teil-${task.teil}`;
  return (
    <Section title={`Teil ${task.teil} · ${task.title}`} description={task.prompt}>
      <A1FamilyRecording
        task={task}
        value={draft.sections?.[sectionKey]?.recording}
        onMarked={(recording) => updateRecording(sectionKey, recording)}
        disabled={attemptState !== "active" || secondsLeft <= 0 || startBusy}
      />
    </Section>
  );
}

function SpeakingGrammar() {
  const [revealedTeil2, setRevealedTeil2] = useState({});
  const [revealedTeil3, setRevealedTeil3] = useState({});

  return (
    <div style={{ display: "grid", gap: 16 }}>
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
                <button data-a1-pdf-hide-ui="model-toggle" type="button" onClick={() => setRevealedTeil2((current) => ({ ...current, [cardKey]: !open }))} style={styles.secondaryButton}>
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
                <button data-a1-pdf-hide-ui="model-toggle" type="button" onClick={() => setRevealedTeil3((current) => ({ ...current, [keyword]: !open }))} style={styles.secondaryButton}>
                  {open ? "Hide model" : "Show model"}
                </button>
                {open ? <Callout tone="green"><strong>Bitte</strong><span>{request}</span><strong>Reaktion</strong><span>{reaction}</span></Callout> : null}
              </article>
            );
          })}
        </div>
      </Section>

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

export default function VerbotenErlaubtPage() {
  const { user } = useAuth();
  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-5.9"
      subtitle="Goethe A1 Sprechen · Tutor-marked assignment"
      assignmentIntro="Study the models in Grammar. When you are ready, start the 15-minute timer, open Assignment and save your recording for each Teil. You can submit early in Review & Submit. When time runs out, Falowen sends the work you have saved for tutor review."
      grammarContent={<SpeakingGrammar />}
      draftOwnerUid={user?.uid || ""}
      groupAssignmentSections
    >
      <Section title="The three speaking parts">
        <Callout><strong>Teil 1 · Sich vorstellen</strong><span>Introduce yourself, spell your name and say a number.</span></Callout>
        <Callout tone="green"><strong>Teil 2 · Fragen und Antworten</strong><span>Ask a question using a keyword and answer a separate question.</span></Callout>
        <Callout tone="amber"><strong>Teil 3 · Bitten und Reagieren</strong><span>Make a polite request and react to another request.</span></Callout>
      </Section>
      {tasks.map((task) => (
        <WorkbookSection key={task.teil} sectionKey={`teil-${task.teil}`}>
          <Day19SpeakingTask task={task} />
        </WorkbookSection>
      ))}
    </A1TutorMarkedWorkbookShell>
  );
}
