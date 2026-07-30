import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80";

const palette = {
  ink: "#172033",
  muted: "#5f6b7c",
  border: "#dfe6ef",
  indigo: "#4338ca",
  indigoSoft: "#eef2ff",
  blueSoft: "#eff6ff",
  green: "#15803d",
  greenSoft: "#f0fdf4",
  rose: "#be123c",
  roseSoft: "#fff1f2",
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
        <span
          style={{
            color: palette.indigo,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 0.7,
            textTransform: "uppercase",
          }}
        >
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
    blue: { background: palette.blueSoft, border: "#bfdbfe", color: "#1e3a8a" },
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

const RuleStatusBadge = ({ status }) => {
  const allowed = status === "erlaubt";
  return (
    <span
      aria-label={allowed ? "Erlaubt" : "Verboten"}
      style={{
        alignItems: "center",
        background: allowed ? palette.greenSoft : palette.roseSoft,
        border: `1px solid ${allowed ? "#86efac" : "#fda4af"}`,
        borderRadius: 999,
        color: allowed ? "#166534" : "#9f1239",
        display: "inline-flex",
        fontSize: 13,
        fontWeight: 900,
        gap: 6,
        padding: "6px 10px",
        width: "fit-content",
      }}
    >
      <span aria-hidden="true">{allowed ? "✓" : "✕"}</span>
      {allowed ? "Erlaubt" : "Verboten"}
    </span>
  );
};

const ExamExampleCard = ({ number, keyword, tone = "blue", children }) => {
  const tones = {
    blue: { background: "#f8fbff", border: "#bfdbfe", number: "#2563eb" },
    green: { background: "#f7fef9", border: "#bbf7d0", number: palette.green },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <article
      style={{
        background: selected.background,
        border: `1px solid ${selected.border}`,
        borderRadius: 17,
        display: "grid",
        gap: 10,
        padding: 14,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
        <span style={{ background: selected.number, borderRadius: 10, color: "#fff", display: "grid", fontWeight: 900, height: 32, placeItems: "center", width: 32 }}>{number}</span>
        <div style={{ display: "grid", gap: 2 }}>
          <span style={{ color: palette.muted, fontSize: 11, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase" }}>Karte</span>
          <strong style={{ color: palette.ink, fontSize: 17 }}>{keyword}</strong>
        </div>
      </div>
      {children}
    </article>
  );
};

const conjugationRows = [
  ["ich darf", "I may / I am allowed to"],
  ["du darfst", "you may / you are allowed to (informal singular)"],
  ["er / sie / es darf", "he / she / it may or is allowed to"],
  ["wir dürfen", "we may / we are allowed to"],
  ["ihr dürft", "you all may / you are allowed to (informal plural)"],
  ["sie / Sie dürfen", "they may / you may (formal)"],
];

const speakingKeywords = [
  ["Name?", "Name"],
  ["Alter?", "Age"],
  ["Land?", "Country"],
  ["Wohnort?", "Place of residence"],
  ["Sprachen?", "Languages"],
  ["Beruf?", "Occupation"],
  ["Hobby?", "Hobby"],
];

const introTemplates = [
  ["Name?", "Ich heiße …", "My name is …"],
  ["Alter?", "Ich bin … Jahre alt.", "I am … years old."],
  ["Land?", "Ich komme aus …", "I come from …"],
  ["Wohnort?", "Ich wohne in …", "I live in …"],
  ["Sprachen?", "Ich spreche …", "I speak …"],
  ["Beruf?", "Ich bin … von Beruf.", "I am a … by profession."],
  ["Hobby?", "Mein Hobby ist …", "My hobby is …"],
];

const knowledgeRules = [
  { status: "erlaubt", german: "Im Unterricht darfst du Wasser trinken.", english: "You may drink water in class." },
  { status: "verboten", german: "Im Kursraum darfst du nicht essen.", english: "You may not eat in the classroom." },
  { status: "erlaubt", german: "In der Pause darfst du dein Handy benutzen.", english: "You may use your phone during the break." },
  { status: "verboten", german: "Im Unterricht darfst du nicht telefonieren.", english: "You may not make phone calls in class." },
  { status: "erlaubt", german: "Im Computerraum darfst du Deutsch üben.", english: "You may practise German in the computer room." },
  { status: "verboten", german: "Im Computerraum darfst du keine Computerspiele spielen.", english: "You may not play computer games in the computer room." },
  { status: "verboten", german: "Im Gebäude darfst du nicht rauchen.", english: "You may not smoke in the building." },
  { status: "erlaubt", german: "Vor dem Gebäude darfst du dein Fahrrad abstellen.", english: "You may park your bicycle in front of the building." },
];

const knowledgeQuestions = [
  { prompt: "Darf Ama im Unterricht Wasser trinken?", answer: "erlaubt", explanation: "Ja. Ama darf im Unterricht Wasser trinken." },
  { prompt: "Darf Kojo im Kursraum essen?", answer: "verboten", explanation: "Nein. Kojo darf im Kursraum nicht essen." },
  { prompt: "Darf Esi ihr Handy in der Pause benutzen?", answer: "erlaubt", explanation: "Ja. Esi darf ihr Handy in der Pause benutzen." },
  { prompt: "Darf Yaw im Unterricht telefonieren?", answer: "verboten", explanation: "Nein. Yaw darf im Unterricht nicht telefonieren." },
  { prompt: "Darf Abena im Computerraum Deutsch üben?", answer: "erlaubt", explanation: "Ja. Abena darf im Computerraum Deutsch üben." },
  { prompt: "Darf Kofi im Computerraum Computerspiele spielen?", answer: "verboten", explanation: "Nein. Kofi darf im Computerraum keine Computerspiele spielen." },
  { prompt: "Darf man im Gebäude rauchen?", answer: "verboten", explanation: "Nein. Man darf im Gebäude nicht rauchen." },
  { prompt: "Darf man vor dem Gebäude ein Fahrrad abstellen?", answer: "erlaubt", explanation: "Ja. Man darf dort ein Fahrrad abstellen." },
];

const teil2Examples = [
  { keyword: "Wasser", pattern: "Was + Verb + Sie + …?", question: "Was trinken Sie im Unterricht?", answer: "Ich trinke im Unterricht Wasser." },
  { keyword: "Pause", pattern: "Wann + Verb + Sie + …?", question: "Wann benutzen Sie Ihr Handy?", answer: "Ich benutze mein Handy in der Pause." },
  { keyword: "Computerraum", pattern: "Wo + Verb + Sie + …?", question: "Wo lernen Sie Deutsch?", answer: "Ich lerne Deutsch im Computerraum." },
  { keyword: "Fahrrad", pattern: "Haben Sie + …?", question: "Haben Sie ein Fahrrad?", answer: "Ja, ich habe ein Fahrrad." },
];

const teil3Examples = [
  { keyword: "Wasser", request: "Können Sie mir bitte Wasser geben?", reaction: "Ja, gern." },
  { keyword: "Handy", request: "Können Sie bitte Ihr Handy ausmachen?", reaction: "Ja, natürlich." },
  { keyword: "Fenster", request: "Können Sie bitte das Fenster öffnen?", reaction: "Kein Problem." },
  { keyword: "Rauchen", request: "Bitte rauchen Sie hier nicht.", reaction: "Entschuldigung." },
];

const choiceStyle = (choice, selected) => {
  const allowed = choice === "erlaubt";
  const active = selected === choice;
  return {
    alignItems: "center",
    background: active ? (allowed ? palette.green : palette.rose) : (allowed ? palette.greenSoft : palette.roseSoft),
    border: `2px solid ${allowed ? "#16a34a" : "#e11d48"}`,
    borderRadius: 14,
    color: active ? "#fff" : (allowed ? "#166534" : "#9f1239"),
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: 900,
    gap: 7,
    justifyContent: "center",
    minHeight: 46,
    padding: "9px 16px",
  };
};

const KnowledgeCheck = () => {
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const score = useMemo(
    () => knowledgeQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const complete = Object.keys(answers).length === knowledgeQuestions.length;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gap: 10 }}>
        {knowledgeQuestions.map((question, index) => {
          const selected = answers[index];
          const correct = selected === question.answer;
          return (
            <article
              key={question.prompt}
              style={{
                border: `1px solid ${selected ? (correct ? "#86efac" : "#fda4af") : palette.border}`,
                borderRadius: 16,
                padding: 14,
                display: "grid",
                gap: 10,
                background: selected ? (correct ? palette.greenSoft : palette.roseSoft) : "#fff",
              }}
            >
              <strong style={{ color: palette.ink }}>{index + 1}. {question.prompt}</strong>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
                {["erlaubt", "verboten"].map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={selected === choice}
                    onClick={() => {
                      setAnswers((old) => ({ ...old, [index]: choice }));
                      setShowScore(false);
                    }}
                    style={choiceStyle(choice, selected)}
                  >
                    <span aria-hidden="true">{choice === "erlaubt" ? "✓" : "✕"}</span>
                    {choice === "erlaubt" ? "Erlaubt" : "Verboten"}
                  </button>
                ))}
              </div>
              {selected ? (
                <p style={{ margin: 0, color: correct ? "#166534" : "#9f1239", lineHeight: 1.55 }}>
                  <strong>{correct ? "Richtig." : `Nicht ganz. Die richtige Antwort ist ${question.answer}.`}</strong> {question.explanation}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" disabled={!complete} onClick={() => setShowScore(true)} style={{ ...styles.primaryButton, opacity: complete ? 1 : 0.55 }}>
          Show my score
        </button>
        <button type="button" onClick={() => { setAnswers({}); setShowScore(false); }} style={styles.secondaryButton}>
          Restart knowledge check
        </button>
      </div>

      {showScore ? (
        <Callout tone={score >= 7 ? "green" : "amber"}>
          <strong>{score}/{knowledgeQuestions.length} correct</strong>
          <span>{score >= 7 ? "Excellent. You understand what is erlaubt and verboten." : "Read the short rules again and repeat the questions."}</span>
        </Callout>
      ) : null}
    </div>
  );
};

const VerbotenErlaubtPage = () => (
  <div style={{ ...styles.container, display: "grid", gap: 18, maxWidth: 1100 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

    <header
      style={{
        minHeight: 390,
        borderRadius: 26,
        overflow: "hidden",
        display: "grid",
        alignItems: "end",
        backgroundImage: `linear-gradient(100deg, rgba(15,23,42,.96), rgba(30,64,175,.78), rgba(67,56,202,.42)), url(${HERO_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
      }}
    >
      <div style={{ padding: "clamp(24px, 5vw, 52px)", color: "#fff", display: "grid", gap: 15, maxWidth: 800 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["A1", "Day 19", "Chapter 5.9", "Goethe Sprechen"].map((label) => (
            <span key={label} style={{ borderRadius: 999, padding: "6px 10px", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", fontSize: 12, fontWeight: 900 }}>{label}</span>
          ))}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0, color: "#bfdbfe", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 13 }}>Dürfen · erlaubt · verboten</p>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "clamp(2.1rem, 6vw, 4rem)", lineHeight: 1.02 }}>Understand rules and practise the A1 speaking exam</h1>
          <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.7, fontSize: "clamp(1rem, 2.3vw, 1.18rem)" }}>
            Learn short A1 sentences with darf and darf nicht. Then practise the green ✓ and red ✕ exam signs, Teil 2 questions and Teil 3 requests.
          </p>
        </div>
      </div>
    </header>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
      {[
        ["1", "Learn dürfen", "Use darf and darf nicht"],
        ["2", "Read short rules", "See green ✓ and red ✕ signs"],
        ["3", "Check the rules", "Choose Erlaubt or Verboten"],
        ["4", "Practise Teil 1", "Introduce yourself"],
        ["5", "Practise Teil 2–3", "Ask, answer, request and react"],
      ].map(([number, title, text]) => (
        <div key={number} style={{ ...card, gridTemplateColumns: "42px 1fr", alignItems: "start", padding: 16 }}>
          <span style={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 14, background: palette.indigo, color: "#fff", fontWeight: 900 }}>{number}</span>
          <div style={{ display: "grid", gap: 4 }}><strong style={{ color: palette.ink }}>{title}</strong><span style={{ color: palette.muted, fontSize: 14, lineHeight: 1.5 }}>{text}</span></div>
        </div>
      ))}
    </div>

    <Section eyebrow="Grammar meaning" title="What does dürfen mean?" description="dürfen means may or to be allowed to. It is a modal verb, so the second verb goes to the end in the infinitive form.">
      <Callout>
        <strong>Sentence formula</strong>
        <span><strong>Subject + dürfen + other information + infinitive.</strong></span>
        <span>Ich <strong>darf</strong> hier sitzen. — I <strong>may</strong> sit here.</span>
        <span>Ich <strong>darf</strong> hier <strong>nicht rauchen</strong>. — I may not smoke here.</span>
      </Callout>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <Callout tone="green"><strong>✓ erlaubt = allowed</strong><span>Das ist erlaubt.</span><span>Du darfst das machen.</span></Callout>
        <Callout tone="amber"><strong>✕ verboten = not allowed</strong><span>Das ist verboten.</span><span>Du darfst das nicht machen.</span></Callout>
      </div>
    </Section>

    <Section eyebrow="Full conjugation" title="dürfen in the present tense (Präsens)" description="Read the German form and its English meaning together.">
      <div style={{ overflowX: "auto", border: `1px solid ${palette.border}`, borderRadius: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead><tr style={{ background: palette.indigoSoft }}><th style={{ padding: 13, textAlign: "left", color: "#312e81" }}>German</th><th style={{ padding: 13, textAlign: "left", color: "#312e81" }}>English meaning</th></tr></thead>
          <tbody>
            {conjugationRows.map(([german, english], index) => (
              <tr key={german} style={{ borderTop: `1px solid ${palette.border}`, background: index % 2 ? "#fbfdff" : "#fff" }}><td style={{ padding: 13 }}><strong style={{ color: palette.indigo }}>{german}</strong></td><td style={{ padding: 13, color: palette.muted }}>{english}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout tone="amber"><strong>Important stem change</strong><span>The singular forms use <strong>darf-</strong>: ich darf, du darfst, er/sie/es darf. The plural forms return to <strong>dürf-</strong>: wir dürfen, ihr dürft, sie/Sie dürfen.</span></Callout>
    </Section>

    <Section eyebrow="Reading and knowledge check" title="Was ist erlaubt? Was ist verboten?" description="Read the short rules. Green ✓ means allowed. Red ✕ means forbidden. Then answer the questions below.">
      <div style={{ border: "1px solid #c7d2fe", borderRadius: 18, background: "linear-gradient(135deg,#eef2ff,#f8fafc)", padding: 16, display: "grid", gap: 12 }}>
        <div><strong style={{ color: "#312e81", fontSize: 18 }}>Hausordnung im Falowen Lernzentrum</strong><p style={{ margin: "5px 0 0", color: palette.muted }}>Simple rules at the Falowen Learning Centre</p></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {knowledgeRules.map((rule, index) => {
            const allowed = rule.status === "erlaubt";
            return (
              <article
                key={rule.german}
                style={{
                  background: "rgba(255,255,255,.94)",
                  border: `1px solid ${allowed ? "#bbf7d0" : "#fecdd3"}`,
                  borderRadius: 15,
                  display: "grid",
                  gap: 10,
                  padding: 13,
                }}
              >
                <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center", background: "#4338ca", color: "#fff", fontWeight: 900 }}>{index + 1}</span>
                  <RuleStatusBadge status={rule.status} />
                </div>
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ color: palette.ink, lineHeight: 1.5 }}>{rule.german}</strong>
                  <span style={{ color: palette.muted, fontSize: 13, lineHeight: 1.45 }}>{rule.english}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <Callout>
        <strong>Exam pattern</strong>
        <span><strong>Darf …?</strong> → <strong>Ja, … darf …</strong> / <strong>Nein, … darf nicht …</strong></span>
        <span>Darf Ama Wasser trinken? — Ja, Ama darf Wasser trinken.</span>
        <span>Darf Kojo essen? — Nein, Kojo darf nicht essen.</span>
      </Callout>
      <KnowledgeCheck />
    </Section>

    <Section eyebrow="Goethe A1 · Teil 1" title="First learn the speaking keywords" description="The examiner may show these keywords. Use them as your speaking order before you introduce yourself.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 10 }}>
        {speakingKeywords.map(([german, english], index) => (
          <div key={german} style={{ border: "1px solid #c7d2fe", background: index % 2 ? "#f8fafc" : palette.indigoSoft, borderRadius: 15, padding: 13, display: "grid", gap: 4 }}><strong style={{ color: palette.indigo, fontSize: 17 }}>{german}</strong><span style={{ color: palette.muted, fontSize: 13 }}>{english}</span></div>
        ))}
      </div>

      <div style={{ marginTop: 4, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0, color: palette.ink }}>Teil 1 — Introduce yourself</h3>
        {introTemplates.map(([keyword, german, english]) => (
          <div key={keyword} style={{ border: `1px solid ${palette.border}`, borderRadius: 14, padding: 12, display: "grid", gridTemplateColumns: "minmax(90px, .7fr) minmax(180px, 1.3fr) minmax(180px, 1fr)", gap: 10, alignItems: "center", overflowX: "auto" }}>
            <strong style={{ color: palette.indigo }}>{keyword}</strong><span style={{ color: palette.ink, fontWeight: 700 }}>{german}</span><span style={{ color: palette.muted, fontSize: 14 }}>{english}</span>
          </div>
        ))}
      </div>
      <Callout tone="green"><strong>Complete model</strong><span>Ich heiße Ama. Ich bin 24 Jahre alt. Ich komme aus Ghana. Ich wohne in Accra. Ich spreche Englisch, Twi und ein bisschen Deutsch. Ich bin Lehrerin von Beruf. Mein Hobby ist Musik.</span></Callout>
    </Section>

    <Section eyebrow="Goethe A1 · Teil 2" title="Ask one question and give one complete answer" description="Look at the word on the card. Ask a simple question. Your partner answers with a complete sentence.">
      <Callout>
        <strong>Easy question patterns</strong>
        <span><strong>Wo …? · Wann …? · Was …? · Wie …?</strong></span>
        <span><strong>Haben Sie …? · Essen Sie …? · Kaufen Sie …?</strong></span>
      </Callout>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
        {teil2Examples.map((example, index) => (
          <ExamExampleCard key={example.keyword} number={index + 1} keyword={example.keyword}>
            <div style={{ background: "#fff", border: `1px solid ${palette.border}`, borderRadius: 12, display: "grid", gap: 5, padding: 11 }}>
              <span style={{ color: palette.indigo, fontSize: 12, fontWeight: 900 }}>PATTERN</span>
              <strong style={{ color: palette.ink }}>{example.pattern}</strong>
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              <span style={{ color: palette.muted, fontSize: 12, fontWeight: 900 }}>FRAGE</span>
              <strong style={{ color: palette.ink }}>{example.question}</strong>
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              <span style={{ color: palette.muted, fontSize: 12, fontWeight: 900 }}>ANTWORT</span>
              <span style={{ color: palette.indigo, fontWeight: 800 }}>{example.answer}</span>
            </div>
          </ExamExampleCard>
        ))}
      </div>
      <Callout tone="green"><strong>Exam rule</strong><span>Do not answer with only one word. Say one complete sentence: <strong>Ich trinke Wasser.</strong></span></Callout>
    </Section>

    <Section eyebrow="Goethe A1 · Teil 3" title="Make a request and react politely" description="Look at the card, make one clear request and give a short polite reaction.">
      <Callout tone="green">
        <strong>Easy request patterns</strong>
        <span><strong>Können Sie bitte …?</strong></span>
        <span><strong>Bitte … Sie …</strong></span>
        <span>React: <strong>Ja, gern. · Ja, natürlich. · Kein Problem. · Entschuldigung.</strong></span>
      </Callout>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
        {teil3Examples.map((example, index) => (
          <ExamExampleCard key={example.keyword} number={index + 1} keyword={example.keyword} tone="green">
            <div style={{ display: "grid", gap: 5 }}>
              <span style={{ color: palette.muted, fontSize: 12, fontWeight: 900 }}>BITTE</span>
              <strong style={{ color: palette.ink }}>{example.request}</strong>
            </div>
            <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 12, display: "grid", gap: 5, padding: 11 }}>
              <span style={{ color: palette.green, fontSize: 12, fontWeight: 900 }}>REAKTION</span>
              <strong style={{ color: "#166534" }}>{example.reaction}</strong>
            </div>
          </ExamExampleCard>
        ))}
      </div>
    </Section>

    <A1ExamSpeakingPracticePanel />

    <Section eyebrow="Pass strategy" title="Simple A1 speaking rules that work">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <Callout tone="green"><strong>What examiners want</strong><BulletList items={["Short, correct sentences", "Clear pronunciation", "A complete answer, not one word", "A polite reaction in Teil 3", "Active participation without long silence"]} /></Callout>
        <Callout tone="amber"><strong>Final checklist</strong><BulletList items={["I can introduce myself using all seven keywords.", "I can ask and answer a simple question.", "I can make a request and react politely.", "I understand green ✓ erlaubt and red ✕ verboten.", "I can use darf and darf nicht."]} /></Callout>
      </div>
    </Section>
  </div>
);

export default VerbotenErlaubtPage;
