import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const paragraph = { margin: 0, lineHeight: 1.75 };
const optionGrid = { display: "grid", gap: 8 };

const quickChecks = [
  {
    prompt: "Choose the correct reason clause.",
    options: ["weil ich krank bin", "weil ich bin krank"],
    answer: "weil ich krank bin",
  },
  {
    prompt: "Choose the correct sentence with a modal verb.",
    options: ["weil ich arbeiten muss", "weil ich muss arbeiten"],
    answer: "weil ich arbeiten muss",
  },
  {
    prompt: "You cannot come because you are tired.",
    options: ["Ich kann nicht kommen, weil ich müde bin.", "Ich kann nicht kommen, weil ich bin müde."],
    answer: "Ich kann nicht kommen, weil ich müde bin.",
  },
  {
    prompt: "You need more information.",
    options: ["weil ich mehr Informationen brauche", "weil ich brauche mehr Informationen"],
    answer: "weil ich mehr Informationen brauche",
  },
  {
    prompt: "What happens to the conjugated verb after weil?",
    options: ["It goes to the end of the weil-clause.", "It stays directly after weil."],
    answer: "It goes to the end of the weil-clause.",
  },
];

const sentenceBuilders = [
  {
    prompt: "Build: because I am sick",
    tokens: ["weil", "ich", "krank", "bin"],
    answer: "weil ich krank bin",
  },
  {
    prompt: "Build: because I have to work on Monday",
    tokens: ["weil", "ich", "am Montag", "arbeiten", "muss"],
    answer: "weil ich am Montag arbeiten muss",
  },
  {
    prompt: "Build: because I need more information",
    tokens: ["weil", "ich", "mehr Informationen", "brauche"],
    answer: "weil ich mehr Informationen brauche",
  },
];

const reasonMatching = [
  {
    situation: "Ich kann heute nicht kommen, ...",
    options: ["weil ich krank bin.", "weil der Kurs 300 Euro kostet.", "weil ich Geburtstag habe."],
    answer: "weil ich krank bin.",
  },
  {
    situation: "Ich möchte den Termin ändern, ...",
    options: ["weil ich am Montag arbeiten muss.", "weil ich Deutsch spreche.", "weil ich einen Kurs kaufe."],
    answer: "weil ich am Montag arbeiten muss.",
  },
  {
    situation: "Ich schreibe Ihnen, ...",
    options: ["weil ich mehr Informationen über den Kurs brauche.", "weil ich Kaffee trinke.", "weil ich Anna heiße."],
    answer: "weil ich mehr Informationen über den Kurs brauche.",
  },
];

const registerChecks = [
  {
    prompt: "You are writing to a friend.",
    options: ["Liebe Anna,", "Sehr geehrte Damen und Herren,"],
    answer: "Liebe Anna,",
  },
  {
    prompt: "You are writing to a language school.",
    options: ["Kannst du mir bitte mehr Informationen geben?", "Können Sie mir bitte mehr Informationen geben?"],
    answer: "Können Sie mir bitte mehr Informationen geben?",
  },
  {
    prompt: "You are ending a formal email.",
    options: ["Liebe Grüße", "Mit freundlichen Grüßen"],
    answer: "Mit freundlichen Grüßen",
  },
  {
    prompt: "You are asking a friend for help.",
    options: ["Kannst du mir bitte helfen?", "Können Sie mir bitte helfen?"],
    answer: "Kannst du mir bitte helfen?",
  },
];

const connectorChecks = [
  { prompt: "Which connector adds another idea?", options: ["und", "aber", "oder", "denn"], answer: "und" },
  { prompt: "Which connector shows contrast?", options: ["und", "aber", "oder", "denn"], answer: "aber" },
  { prompt: "Which connector shows a choice?", options: ["und", "aber", "oder", "denn"], answer: "oder" },
  { prompt: "Which connector can give a reason with normal main-clause word order?", options: ["und", "aber", "oder", "denn"], answer: "denn" },
];

const Section = ({ title, children, testId }) => (
  <section style={card} data-testid={testId}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

function ChoiceExercise({ items, value, setValue, prefix }) {
  return (
    <div style={optionGrid}>
      {items.map((item, index) => {
        const chosen = value[index] || "";
        const answered = Boolean(chosen);
        const correct = answered && chosen === item.answer;
        return (
          <article key={item.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
            <strong>{index + 1}. {item.prompt}</strong>
            <div style={{ display: "grid", gap: 6 }}>
              {item.options.map((option) => (
                <label key={option} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <input
                    type="radio"
                    name={`${prefix}-${index}`}
                    value={option}
                    checked={chosen === option}
                    onChange={() => setValue((current) => ({ ...current, [index]: option }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {answered ? (
              <small style={{ fontWeight: 700, color: correct ? "#166534" : "#b91c1c" }}>
                {correct ? "Correct." : `Try again. Correct answer: ${item.answer}`}
              </small>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function SentenceBuilder({ item, index }) {
  const [selected, setSelected] = useState([]);
  const answer = selected.join(" ");
  const isComplete = selected.length === item.tokens.length;
  const correct = isComplete && answer === item.answer;

  const addToken = (tokenIndex) => {
    if (selected.some((entry) => entry.index === tokenIndex)) return;
    setSelected((current) => [...current, { index: tokenIndex, text: item.tokens[tokenIndex] }]);
  };

  const removeLast = () => setSelected((current) => current.slice(0, -1));

  return (
    <article style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 13, display: "grid", gap: 10 }}>
      <strong>{index + 1}. {item.prompt}</strong>
      <div style={{ minHeight: 44, border: "1px dashed #94a3b8", borderRadius: 10, padding: 10, background: "#f8fafc" }}>
        {selected.length ? selected.map((entry) => entry.text).join(" ") : "Build your sentence here"}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {item.tokens.map((token, tokenIndex) => {
          const used = selected.some((entry) => entry.index === tokenIndex);
          return (
            <button
              key={`${token}-${tokenIndex}`}
              type="button"
              disabled={used}
              onClick={() => addToken(tokenIndex)}
              style={{ minHeight: 40 }}
            >
              {token}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={removeLast} disabled={!selected.length}>Undo</button>
        <button type="button" onClick={() => setSelected([])} disabled={!selected.length}>Reset</button>
      </div>
      {isComplete ? (
        <small style={{ fontWeight: 700, color: correct ? "#166534" : "#b91c1c" }}>
          {correct ? "Correct sentence." : "Not yet. Check the position of the verb after weil."}
        </small>
      ) : null}
    </article>
  );
}

export default function ConjunctionNotesPage() {
  const [quickAnswers, setQuickAnswers] = useState({});
  const [matchAnswers, setMatchAnswers] = useState({});
  const [registerAnswers, setRegisterAnswers] = useState({});
  const [connectorAnswers, setConnectorAnswers] = useState({});
  const [repairOne, setRepairOne] = useState("");
  const [repairTwo, setRepairTwo] = useState("");
  const [applicationOne, setApplicationOne] = useState("");
  const [applicationTwo, setApplicationTwo] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  const finalChecks = useMemo(() => {
    const text = finalMessage.trim();
    const lower = text.toLocaleLowerCase("de-DE");
    const hasWeil = /\bweil\b/.test(lower);
    const hasVerbEnd = /weil[^.!?]*(bin|ist|sind|habe|hast|hat|muss|musst|müssen|brauche|brauchst|braucht|möchte|möchtest|möchten)\s*[.!?]?$/im.test(text)
      || /weil[^.!?]*(bin|ist|sind|habe|hat|muss|müssen|brauche|braucht|möchte|möchten)[,.!?]/im.test(text);
    const hasGreeting = /^(hallo|liebe\b|lieber\b|sehr geehrte)/im.test(text);
    const hasRequest = /(kannst du|können sie|können wir|wann beginnt|wie viel kostet|mehr informationen|anmelden|termin)/i.test(text);
    const hasClosing = /(liebe grüße|viele grüße|mit freundlichen grüßen)/i.test(text);
    return [
      ["Greeting", hasGreeting],
      ["One practical request/question", hasRequest],
      ["Reason with weil", hasWeil],
      ["Verb appears at the end of the weil-clause", hasWeil && hasVerbEnd],
      ["Closing", hasClosing],
    ];
  }, [finalMessage]);

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }} data-a1-5-10-interactive-workbook="true">
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>A1 · Kapitel 5.10 · Interactive Workbook</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Weil & nützliche A1-Redemittel</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Learn one rule, then use it. Your main target is <strong>weil + verb at the end</strong>.
        </p>
      </header>

      <Section title="1. Learn the rule" testId="learn-rule">
        <div style={{ border: "2px solid #60a5fa", borderRadius: 14, padding: 14, background: "#eff6ff", display: "grid", gap: 8 }}>
          <strong>Pattern</strong>
          <span>Main clause + , weil + subject + information + <strong>conjugated verb at the end</strong>.</span>
          <span>Ich kann nicht kommen, <strong>weil ich krank bin</strong>.</span>
          <span>Ich komme später, <strong>weil ich noch arbeiten muss</strong>.</span>
        </div>
      </Section>

      <Section title="2. Choose · Which sentence is correct?" testId="quick-check">
        <ChoiceExercise items={quickChecks} value={quickAnswers} setValue={setQuickAnswers} prefix="quick" />
      </Section>

      <Section title="3. Build · Put the words in order" testId="sentence-builder">
        <p style={paragraph}>Tap the words in the correct order. Use Undo or Reset if needed.</p>
        <div style={optionGrid}>
          {sentenceBuilders.map((item, index) => <SentenceBuilder key={item.answer} item={item} index={index} />)}
        </div>
      </Section>

      <Section title="4. Match · Choose the reason that fits" testId="reason-matching">
        <ChoiceExercise items={reasonMatching} value={matchAnswers} setValue={setMatchAnswers} prefix="reason" />
      </Section>

      <Section title="5. Formal or informal?" testId="register-check">
        <ChoiceExercise items={registerChecks} value={registerAnswers} setValue={setRegisterAnswers} prefix="register" />
      </Section>

      <Section title="6. Repair the message" testId="repair-message">
        <p style={paragraph}>Correct only the broken sentence. Keep it short and A1-friendly.</p>
        <article style={{ border: "1px solid #fecaca", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
          <strong>Broken sentence 1</strong>
          <span>Ich kann nicht kommen, weil ich bin krank.</span>
          <input
            aria-label="Repair weil word order"
            value={repairOne}
            onChange={(event) => setRepairOne(event.target.value)}
            placeholder="Write the corrected sentence"
          />
          {repairOne.trim() ? (
            <small style={{ fontWeight: 700, color: /weil ich krank bin[.!]?$/i.test(repairOne.trim()) ? "#166534" : "#b91c1c" }}>
              {/weil ich krank bin[.!]?$/i.test(repairOne.trim()) ? "Correct." : "Check the verb position after weil."}
            </small>
          ) : null}
        </article>
        <article style={{ border: "1px solid #fecaca", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
          <strong>Broken sentence 2</strong>
          <span>Können wir Mittwoch treffen?</span>
          <input
            aria-label="Repair appointment sentence"
            value={repairTwo}
            onChange={(event) => setRepairTwo(event.target.value)}
            placeholder="Write the corrected sentence"
          />
          {repairTwo.trim() ? (
            <small style={{ fontWeight: 700, color: /können wir uns am mittwoch treffen[?]?$/i.test(repairTwo.trim()) ? "#166534" : "#b91c1c" }}>
              {/können wir uns am mittwoch treffen[?]?$/i.test(repairTwo.trim()) ? "Correct." : "Remember uns + am Mittwoch."}
            </small>
          ) : null}
        </article>
      </Section>

      <Section title="7. Apply · Build your own useful sentence" testId="apply">
        <label style={{ display: "grid", gap: 6 }}>
          <strong>You cannot come on Tuesday because you must work.</strong>
          <input
            aria-label="Application sentence one"
            value={applicationOne}
            onChange={(event) => setApplicationOne(event.target.value)}
            placeholder="Ich kann am Dienstag nicht kommen, weil ..."
          />
        </label>
        {applicationOne.trim() ? (
          <small style={{ color: /weil.*arbeiten.*muss/i.test(applicationOne) ? "#166534" : "#475569", fontWeight: 700 }}>
            {/weil.*arbeiten.*muss/i.test(applicationOne)
              ? "Good: your reason uses weil and places muss after arbeiten."
              : "Try to include: weil ich arbeiten muss."}
          </small>
        ) : null}

        <label style={{ display: "grid", gap: 6 }}>
          <strong>You are writing formally because you need more information about the course.</strong>
          <input
            aria-label="Application sentence two"
            value={applicationTwo}
            onChange={(event) => setApplicationTwo(event.target.value)}
            placeholder="Ich schreibe Ihnen, weil ..."
          />
        </label>
        {applicationTwo.trim() ? (
          <small style={{ color: /ich schreibe ihnen.*weil.*informationen.*brauche/i.test(applicationTwo) ? "#166534" : "#475569", fontWeight: 700 }}>
            {/ich schreibe ihnen.*weil.*informationen.*brauche/i.test(applicationTwo)
              ? "Good formal A1 sentence."
              : "Use Ihnen and finish the weil-clause with brauche."}
          </small>
        ) : null}
      </Section>

      <Section title="8. Recognise the other connectors" testId="connector-recognition">
        <p style={paragraph}>
          Recognise <strong>und, aber, oder</strong> and <strong>denn</strong>. Do not force them into your writing.
          Your productive connector for this lesson is <strong>weil</strong>.
        </p>
        <ChoiceExercise items={connectorChecks} value={connectorAnswers} setValue={setConnectorAnswers} prefix="connector" />
        <div style={{ borderLeft: "4px solid #2563eb", padding: "10px 12px", background: "#eff6ff", borderRadius: 10 }}>
          <strong>Next level:</strong> <em>deshalb</em> starts properly in A2 because it uses a different word-order pattern.
        </div>
      </Section>

      <Section title="9. Final transfer challenge" testId="final-transfer">
        <p style={paragraph}>
          Write one short A1 message. Include a greeting, one practical question/request, one reason with <strong>weil</strong>,
          and a closing. Choose either a friend or a language school.
        </p>
        <textarea
          aria-label="Final A1 transfer message"
          rows={8}
          value={finalMessage}
          onChange={(event) => setFinalMessage(event.target.value)}
          placeholder={"Liebe Anna,\n\nich kann ... weil ...\nKönnen wir ...?\n\nLiebe Grüße\n..."}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cbd5e1", font: "inherit", lineHeight: 1.6 }}
        />
        <div style={{ display: "grid", gap: 6 }}>
          {finalChecks.map(([label, ok]) => (
            <span key={label} style={{ fontWeight: 700, color: ok ? "#166534" : "#64748b" }}>
              {ok ? "✓" : "○"} {label}
            </span>
          ))}
        </div>
      </Section>
    </main>
  );
}
