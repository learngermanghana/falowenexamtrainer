import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import A1Day18Kapitel122WorkbookPage from "./A1Day18Kapitel122WorkbookPage";
import { styles } from "../styles";

const heroImageUrl =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=80";

const palette = {
  ink: "#172033",
  muted: "#5f6b7c",
  border: "#dfe6ef",
  blue: "#1d4ed8",
  blueSoft: "#eff6ff",
  indigo: "#4338ca",
  indigoSoft: "#eef2ff",
  green: "#15803d",
  greenSoft: "#f0fdf4",
  amber: "#b45309",
  amberSoft: "#fffbeb",
  rose: "#be123c",
  roseSoft: "#fff1f2",
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: `1px solid ${palette.border}`,
  borderRadius: 20,
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.07)",
};

const Section = ({ eyebrow, title, description, children }) => (
  <section style={cardStyle}>
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
      <h2 style={{ margin: 0, color: palette.ink, fontSize: "clamp(1.25rem, 3vw, 1.65rem)" }}>{title}</h2>
      {description ? <p style={{ margin: 0, color: palette.muted, lineHeight: 1.65 }}>{description}</p> : null}
    </div>
    {children}
  </section>
);

const Badge = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { background: "#dbeafe", color: "#1e3a8a" },
    indigo: { background: "#e0e7ff", color: "#3730a3" },
    green: { background: "#dcfce7", color: "#166534" },
  };
  const toneStyle = tones[tone] || tones.blue;
  return (
    <span
      style={{
        ...toneStyle,
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  );
};

const articleRows = [
  { gender: "Masculine", nominative: "der / ein", dative: "dem / einem", example: "mit dem Bus" },
  { gender: "Feminine", nominative: "die / eine", dative: "der / einer", example: "bei der Bank" },
  { gender: "Neuter", nominative: "das / ein", dative: "dem / einem", example: "mit dem Auto" },
  { gender: "Plural", nominative: "die / keine", dative: "den / keinen", example: "zu den Freunden (+n)" },
];

const prepositions = [
  {
    word: "mit",
    meaning: "with / by",
    icon: "🚆",
    question: "How? With whom?",
    rule: "Use mit for transport, tools and people who accompany you.",
    examples: [
      ["Ich fahre mit dem Zug.", "I travel by train."],
      ["Sie kommt mit der U-Bahn.", "She comes by underground."],
      ["Wir lernen mit den Freunden.", "We study with the friends."],
    ],
  },
  {
    word: "bei",
    meaning: "at / near / with",
    icon: "📍",
    question: "Where? At whose place?",
    rule: "Use bei for locations, workplaces, people and institutions.",
    examples: [
      ["Ich bin beim Arzt.", "I am at the doctor’s."],
      ["Er arbeitet bei der Bank.", "He works at the bank."],
      ["Wir sind bei den Eltern.", "We are at the parents’ place."],
    ],
  },
  {
    word: "zu",
    meaning: "to",
    icon: "➡️",
    question: "Where to? To whom?",
    rule: "Use zu when moving to a person, institution, activity or destination.",
    examples: [
      ["Ich gehe zum Bahnhof.", "I am going to the station."],
      ["Sie fährt zur Schule.", "She is going to school."],
      ["Wir gehen zu den Freunden.", "We are going to the friends."],
    ],
  },
];

const contractions = [
  { full: "bei dem", short: "beim", example: "Ich bin beim Arzt." },
  { full: "zu dem", short: "zum", example: "Ich gehe zum Bahnhof." },
  { full: "zu der", short: "zur", example: "Ich fahre zur Schule." },
];

const commonMistakes = [
  { wrong: "mit der Bus", correct: "mit dem Bus", reason: "Bus is masculine: der Bus → dem Bus." },
  { wrong: "bei die Bank", correct: "bei der Bank", reason: "bei always needs dative: die Bank → der Bank." },
  { wrong: "zu die Freunde", correct: "zu den Freunden", reason: "Plural becomes den, and Freunde already ends in -n." },
  { wrong: "mit den Kind", correct: "mit den Kindern", reason: "Dative plural usually adds -n to the noun." },
];

const quizQuestions = [
  {
    prompt: "Ich fahre mit ___ Bus.",
    options: ["der", "dem", "den"],
    answer: "dem",
    explanation: "der Bus is masculine, so dative is dem Bus.",
  },
  {
    prompt: "Sara ist bei ___ Bank.",
    options: ["die", "der", "dem"],
    answer: "der",
    explanation: "die Bank is feminine, so dative is der Bank.",
  },
  {
    prompt: "Wir gehen zu ___ Freunden.",
    options: ["die", "den", "dem"],
    answer: "den",
    explanation: "Plural dative uses den: zu den Freunden.",
  },
  {
    prompt: "Ich komme mit ___ Auto.",
    options: ["das", "dem", "der"],
    answer: "dem",
    explanation: "das Auto is neuter, so dative is dem Auto.",
  },
  {
    prompt: "Which contraction is correct?",
    options: ["zu dem → zur", "zu der → zur", "bei der → beim"],
    answer: "zu der → zur",
    explanation: "zu der contracts to zur. zu dem becomes zum; bei dem becomes beim.",
  },
  {
    prompt: "Choose the correct sentence.",
    options: ["Ich bin bei den Eltern.", "Ich bin bei die Eltern.", "Ich bin bei dem Eltern."],
    answer: "Ich bin bei den Eltern.",
    explanation: "Eltern is plural, so the dative article is den.",
  },
];

const DativeArticleTable = () => (
  <div style={{ overflowX: "auto", border: `1px solid ${palette.border}`, borderRadius: 16 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
      <thead>
        <tr style={{ background: palette.indigoSoft }}>
          {["Gender", "Nominative", "Dative", "Example"].map((heading) => (
            <th key={heading} style={{ padding: 13, textAlign: "left", color: "#312e81", fontSize: 13 }}>
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {articleRows.map((row, index) => (
          <tr key={row.gender} style={{ borderTop: `1px solid ${palette.border}`, background: index % 2 ? "#fbfdff" : "#fff" }}>
            <td style={{ padding: 13, fontWeight: 800, color: palette.ink }}>{row.gender}</td>
            <td style={{ padding: 13, color: palette.muted }}>{row.nominative}</td>
            <td style={{ padding: 13 }}><strong style={{ color: palette.indigo }}>{row.dative}</strong></td>
            <td style={{ padding: 13, color: palette.ink }}>{row.example}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DativeArticlesMitBeiZuGrammarNotes = () => {
  const location = useLocation();
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const score = useMemo(
    () => quizQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );

  const workbookHref = `${location.pathname}?view=workbook`;
  const allAnswered = Object.keys(answers).length === quizQuestions.length;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18, maxWidth: 1080 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <a href={workbookHref} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open Chapter 12.2 workbook
        </a>
      </div>

      <header
        style={{
          position: "relative",
          minHeight: 390,
          borderRadius: 26,
          overflow: "hidden",
          display: "grid",
          alignItems: "end",
          backgroundImage: `linear-gradient(100deg, rgba(15,23,42,.96), rgba(30,64,175,.78), rgba(67,56,202,.42)), url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
        }}
      >
        <div style={{ padding: "clamp(24px, 5vw, 52px)", color: "#fff", display: "grid", gap: 16, maxWidth: 780 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge>A1</Badge>
            <Badge tone="indigo">Chapter 12.2</Badge>
            <Badge tone="green">Grammar notes</Badge>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ margin: 0, color: "#bfdbfe", fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", fontSize: 13 }}>
              Dative made simple
            </p>
            <h1 style={{ margin: 0, fontSize: "clamp(2.1rem, 6vw, 4rem)", lineHeight: 1.02 }}>
              Dative articles with mit, bei and zu
            </h1>
            <p style={{ margin: 0, color: "#e2e8f0", fontSize: "clamp(1rem, 2.4vw, 1.2rem)", lineHeight: 1.65 }}>
              Learn the article changes, understand when to use each preposition, and practise the forms you need for everyday German.
            </p>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {[
          ["1", "Recognise the pattern", "der/das → dem, die → der, plural → den"],
          ["2", "Choose the preposition", "mit, bei and zu always take dative"],
          ["3", "Use natural contractions", "beim, zum and zur"],
        ].map(([number, title, text]) => (
          <div key={number} style={{ ...cardStyle, gridTemplateColumns: "42px 1fr", alignItems: "start", padding: 16 }}>
            <span style={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 14, background: palette.indigo, color: "#fff", fontWeight: 900 }}>{number}</span>
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ color: palette.ink }}>{title}</strong>
              <span style={{ color: palette.muted, lineHeight: 1.5, fontSize: 14 }}>{text}</span>
            </div>
          </div>
        ))}
      </div>

      <Section eyebrow="Start here" title="The rule you must remember">
        <div style={{ border: "1px solid #bfdbfe", borderRadius: 18, padding: "18px 20px", background: "linear-gradient(135deg, #eff6ff, #eef2ff)", display: "grid", gap: 10 }}>
          <strong style={{ color: "#1e3a8a", fontSize: "clamp(1.2rem, 3vw, 1.55rem)" }}>mit + Dative · bei + Dative · zu + Dative</strong>
          <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>
            These three prepositions always control the noun phrase after them. First identify the noun’s gender, then change the article to its dative form.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["mit wem?", "bei wem?", "zu wem?", "womit?", "wo?", "wohin?"].map((question) => (
              <span key={question} style={{ borderRadius: 999, padding: "6px 10px", background: "#fff", border: "1px solid #c7d2fe", color: "#3730a3", fontWeight: 800, fontSize: 13 }}>{question}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Core grammar" title="Dative article changes" description="The article changes, but the noun normally stays the same. The important exception is dative plural.">
        <DativeArticleTable />
        <div style={{ borderLeft: `5px solid ${palette.amber}`, background: palette.amberSoft, borderRadius: 14, padding: 14, color: "#78350f", lineHeight: 1.65 }}>
          <strong>Plural alert:</strong> Use <strong>den</strong> and usually add <strong>-n</strong> to the noun: die Kinder → mit den Kindern. Do not add another -n when the plural already ends in -n or -s.
        </div>
      </Section>

      <Section eyebrow="Meaning and use" title="Choose the right preposition" description="All three take dative, but they answer different questions and express different relationships.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
          {prepositions.map((item, index) => {
            const backgrounds = [palette.blueSoft, palette.greenSoft, palette.amberSoft];
            const borders = ["#bfdbfe", "#bbf7d0", "#fde68a"];
            return (
              <article key={item.word} style={{ border: `1px solid ${borders[index]}`, borderRadius: 18, background: backgrounds[index], padding: 16, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: palette.muted }}>{item.question}</span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 27, color: palette.ink }}>{item.word}</h3>
                  <strong style={{ color: palette.indigo }}>{item.meaning}</strong>
                </div>
                <p style={{ margin: 0, color: palette.muted, lineHeight: 1.6 }}>{item.rule}</p>
                <div style={{ display: "grid", gap: 9 }}>
                  {item.examples.map(([german, english]) => (
                    <div key={german} style={{ background: "rgba(255,255,255,.82)", borderRadius: 12, padding: 11, display: "grid", gap: 3 }}>
                      <strong style={{ color: palette.ink }}>{german}</strong>
                      <span style={{ color: palette.muted, fontSize: 13 }}>{english}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Sound natural" title="Important contractions" description="German speakers usually shorten these common combinations.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {contractions.map((item) => (
            <article key={item.short} style={{ border: `1px solid ${palette.border}`, borderRadius: 16, padding: 15, display: "grid", gap: 8, background: "#fff" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: palette.muted, textDecoration: "line-through" }}>{item.full}</span>
                <span aria-hidden="true">→</span>
                <strong style={{ color: palette.indigo, fontSize: 22 }}>{item.short}</strong>
              </div>
              <span style={{ color: palette.ink }}>{item.example}</span>
            </article>
          ))}
        </div>
        <div style={{ border: "1px solid #c7d2fe", background: palette.indigoSoft, borderRadius: 14, padding: 14, color: "#312e81", lineHeight: 1.6 }}>
          <strong>No contraction with mit:</strong> Say <strong>mit dem</strong>, <strong>mit der</strong> and <strong>mit den</strong> in full.
        </div>
      </Section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <Section eyebrow="Memory shortcut" title="The 3-step method">
          <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 12, color: palette.ink, lineHeight: 1.65 }}>
            <li><strong>Find the preposition:</strong> mit, bei or zu.</li>
            <li><strong>Identify the noun:</strong> der, die, das or plural.</li>
            <li><strong>Change the article:</strong> dem, der, dem or den.</li>
          </ol>
          <div style={{ background: palette.greenSoft, border: "1px solid #bbf7d0", borderRadius: 14, padding: 14, color: "#14532d" }}>
            <strong>Mini memory line:</strong> der and das share <em>dem</em>; die changes to <em>der</em>; plural changes to <em>den</em>.
          </div>
        </Section>

        <Section eyebrow="Avoid these" title="Common A1 mistakes">
          <div style={{ display: "grid", gap: 10 }}>
            {commonMistakes.map((item) => (
              <article key={item.wrong} style={{ border: "1px solid #fecdd3", background: palette.roseSoft, borderRadius: 14, padding: 12, display: "grid", gap: 5 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: palette.rose, fontWeight: 800 }}>✕ {item.wrong}</span>
                  <span style={{ color: palette.green, fontWeight: 900 }}>✓ {item.correct}</span>
                </div>
                <span style={{ color: palette.muted, fontSize: 13, lineHeight: 1.5 }}>{item.reason}</span>
              </article>
            ))}
          </div>
        </Section>
      </div>

      <Section eyebrow="Check your understanding" title="Quick practice" description="Choose one answer for each question. You receive feedback immediately.">
        <div style={{ display: "grid", gap: 14 }}>
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const answered = Boolean(selected);
            const correct = selected === question.answer;
            return (
              <article key={question.prompt} style={{ border: `1px solid ${answered ? (correct ? "#86efac" : "#fda4af") : palette.border}`, borderRadius: 16, padding: 15, display: "grid", gap: 11, background: answered ? (correct ? palette.greenSoft : palette.roseSoft) : "#fff" }}>
                <strong style={{ color: palette.ink }}>{index + 1}. {question.prompt}</strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {question.options.map((option) => {
                    const isSelected = selected === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((old) => ({ ...old, [index]: option }))}
                        style={{
                          ...(isSelected ? styles.primaryButton : styles.secondaryButton),
                          borderRadius: 999,
                          minHeight: 40,
                          padding: "8px 13px",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {answered ? (
                  <div style={{ color: correct ? "#166534" : "#9f1239", fontSize: 14, lineHeight: 1.55 }}>
                    <strong>{correct ? "Correct." : `Correct answer: ${question.answer}.`}</strong> {question.explanation}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" style={{ ...styles.primaryButton, opacity: allAnswered ? 1 : 0.55 }} disabled={!allAnswered} onClick={() => setShowSummary(true)}>
            Show my score
          </button>
          <button type="button" style={styles.secondaryButton} onClick={() => { setAnswers({}); setShowSummary(false); }}>
            Restart practice
          </button>
        </div>

        {showSummary ? (
          <div style={{ border: `1px solid ${score >= 5 ? "#86efac" : "#fde68a"}`, borderRadius: 16, padding: 16, background: score >= 5 ? palette.greenSoft : palette.amberSoft, display: "grid", gap: 5 }}>
            <strong style={{ color: score >= 5 ? "#166534" : "#92400e", fontSize: 20 }}>{score}/{quizQuestions.length} correct</strong>
            <span style={{ color: palette.muted }}>{score >= 5 ? "Strong work. You are ready to use the forms in the workbook." : "Review the article table, then repeat the practice once more."}</span>
          </div>
        ) : null}
      </Section>

      <section style={{ ...cardStyle, background: "linear-gradient(135deg, #172554, #312e81)", color: "#fff", border: 0 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{ color: "#bfdbfe", fontSize: 12, fontWeight: 900, letterSpacing: 0.7, textTransform: "uppercase" }}>Next step</span>
          <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>Use the grammar in complete sentences</h2>
          <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.65 }}>Open the Chapter 12.2 workbook and practise mit, bei and zu in everyday travel, place and people situations.</p>
        </div>
        <a href={workbookHref} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content", background: "#fff", color: "#1e1b4b", borderColor: "#fff" }}>
          Continue to the workbook
        </a>
      </section>
    </div>
  );
};

const DativeArticlesMitBeiZuPage = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const isWorkbook = query.get("view") === "workbook";

  if (isWorkbook) {
    return <A1Day18Kapitel122WorkbookPage />;
  }

  return <DativeArticlesMitBeiZuGrammarNotes />;
};

export default DativeArticlesMitBeiZuPage;
