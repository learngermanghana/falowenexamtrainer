import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const pageStyle = {
  ...styles.container,
  display: "grid",
  gap: 16,
  paddingBottom: 32,
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.15rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const infoBoxStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  background: "#eff6ff",
  padding: 14,
  display: "grid",
  gap: 8,
};

const warningBoxStyle = {
  border: "1px solid #fde68a",
  borderRadius: 12,
  background: "#fffbeb",
  padding: 14,
  display: "grid",
  gap: 8,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 10,
};

const answerCardStyle = {
  ...questionCardStyle,
  background: "#f8fafc",
};

const sentenceBoxStyle = {
  border: "1px dashed #cbd5e1",
  borderRadius: 10,
  padding: 12,
  background: "#fafafa",
  lineHeight: 1.7,
};

const chipStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontWeight: 600,
  width: "fit-content",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
};

const positionTokenStyle = (type) => {
  const colors = {
    verb: { background: "#dbeafe", border: "#60a5fa", color: "#1e3a8a" },
    subject: { background: "#dcfce7", border: "#4ade80", color: "#14532d" },
    rest: { background: "#f3f4f6", border: "#d1d5db", color: "#374151" },
    question: { background: "#f3e8ff", border: "#c084fc", color: "#581c87" },
    amount: { background: "#fef3c7", border: "#fbbf24", color: "#78350f" },
  };

  const selected = colors[type] || colors.rest;

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 10px",
    borderRadius: 9,
    border: `1px solid ${selected.border}`,
    background: selected.background,
    color: selected.color,
    fontWeight: 700,
  };
};

const optionButtonStyle = (selected, correct, submitted) => ({
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 10,
  border: submitted
    ? selected === correct
      ? "1px solid #16a34a"
      : selected
      ? "1px solid #dc2626"
      : "1px solid #d1d5db"
    : selected
    ? "1px solid #2563eb"
    : "1px solid #d1d5db",
  background: submitted
    ? selected === correct
      ? "#f0fdf4"
      : selected
      ? "#fef2f2"
      : "#fff"
    : selected
    ? "#eff6ff"
    : "#fff",
  cursor: "pointer",
});

const resultText = (ok) => ({
  color: ok ? "#166534" : "#b91c1c",
  fontWeight: 600,
});

const familyMembers = [
  ["die Mutter", "mother"],
  ["der Vater", "father"],
  ["die Eltern", "parents"],
  ["die Schwester", "sister"],
  ["der Bruder", "brother"],
  ["die Geschwister", "siblings"],
  ["die Großmutter (Oma)", "grandmother"],
  ["der Großvater (Opa)", "grandfather"],
  ["die Großeltern", "grandparents"],
  ["die Tante", "aunt"],
  ["der Onkel", "uncle"],
  ["die Cousine", "female cousin"],
  ["der Cousin", "male cousin"],
  ["die Tochter", "daughter"],
  ["der Sohn", "son"],
  ["das Kind", "child"],
  ["die Kinder", "children"],
  ["die Ehefrau", "wife"],
  ["der Ehemann", "husband"],
];

const languageNames = [
  ["Deutsch", "German"],
  ["Englisch", "English"],
  ["Spanisch", "Spanish"],
  ["Französisch", "French"],
  ["Italienisch", "Italian"],
  ["Russisch", "Russian"],
  ["Chinesisch", "Chinese"],
  ["Japanisch", "Japanese"],
  ["Portugiesisch", "Portuguese"],
  ["Arabisch", "Arabic"],
];

const hobbies = [
  ["Lesen", "Reading"],
  ["Schwimmen", "Swimming"],
  ["Fußball spielen", "Playing football"],
  ["Malen", "Painting"],
  ["Musik hören", "Listening to music"],
  ["Kochen", "Cooking"],
  ["Reisen", "Travelling"],
  ["Wandern", "Hiking"],
];

const writingTemplate = [
  ["Name", "Ich heiße … / Mein Name ist …", "Ich heiße Ama."],
  ["Country", "Ich komme aus …", "Ich komme aus Ghana."],
  ["Age", "Ich bin … Jahre alt.", "Ich bin 24 Jahre alt."],
  ["Family", "Ich habe … / Mein(e) … heißt …", "Ich habe zwei Brüder. Meine Mutter heißt Adwoa."],
  ["Hobby", "Ich … gern. / Mein Hobby ist …", "Ich höre gern Musik."],
  ["Languages", "Ich spreche … / Ich spreche ein bisschen …", "Ich spreche Englisch und ein bisschen Deutsch."],
];

const DAY6_WRITING_DRAFT_KEY = "falowen:a1:day6:family-writing-draft";

const familyQuiz = [
  {
    id: "f1",
    stem: "1. What is 'mother' in German?",
    correct: "A",
    options: { A: "die Mutter", B: "der Vater", C: "die Schwester", D: "die Tante" },
  },
  {
    id: "f2",
    stem: "2. What is 'brother' in German?",
    correct: "B",
    options: { A: "die Cousine", B: "der Bruder", C: "der Onkel", D: "der Sohn" },
  },
  {
    id: "f3",
    stem: "3. What does 'die Eltern' mean?",
    correct: "C",
    options: { A: "children", B: "siblings", C: "parents", D: "grandparents" },
  },
];

const languageQuiz = [
  {
    id: "l1",
    stem: "1. Complete the sentence: Ich spreche ___ bisschen Deutsch.",
    correct: "B",
    options: { A: "eine", B: "ein", C: "einen", D: "einem" },
  },
  {
    id: "l2",
    stem: "2. What does 'ein bisschen' mean?",
    correct: "A",
    options: { A: "a little", B: "very much", C: "never", D: "every day" },
  },
  {
    id: "l3",
    stem: "3. Which sentence is correct?",
    correct: "C",
    options: {
      A: "Ich spreche bisschen Deutsch.",
      B: "Ich ein bisschen spreche Deutsch.",
      C: "Ich spreche ein bisschen Deutsch.",
      D: "Ein Deutsch bisschen ich spreche.",
    },
  },
];

const questionQuiz = [
  {
    id: "q1",
    stem: "1. Which is the correct yes/no question?",
    correct: "B",
    options: {
      A: "Du lernst Deutsch?",
      B: "Lernst du Deutsch?",
      C: "Deutsch lernst du?",
      D: "Lernst Deutsch du?",
    },
  },
  {
    id: "q2",
    stem: "2. Which is correct?",
    correct: "A",
    options: {
      A: "Spielt er Fußball?",
      B: "Er spielt Fußball?",
      C: "Fußball spielt er?",
      D: "Spielt Fußball er?",
    },
  },
  {
    id: "q3",
    stem: "3. What is the rule for a yes/no question?",
    correct: "D",
    options: {
      A: "The noun comes first",
      B: "The subject comes first",
      C: "The object comes first",
      D: "The conjugated verb comes first",
    },
  },
];

const hobbyQuiz = [
  {
    id: "h1",
    stem: "1. What does 'Musik hören' mean?",
    correct: "B",
    options: {
      A: "to make music",
      B: "to listen to music",
      C: "to buy music",
      D: "to write music",
    },
  },
  {
    id: "h2",
    stem: "2. Complete the sentence: Ich ___ gern Fußball.",
    correct: "A",
    options: { A: "spiele", B: "spreche", C: "höre", D: "lese" },
  },
  {
    id: "h3",
    stem: "3. Which sentence means 'I like reading'?",
    correct: "A",
    options: {
      A: "Ich lese gern.",
      B: "Ich reise gern.",
      C: "Ich male gern.",
      D: "Ich koche gern.",
    },
  },
];

function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?]/g, "");
}

function isOneOf(value, accepted) {
  const clean = normalize(value);
  return accepted.some((item) => normalize(item) === clean);
}

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, flexWrap: "wrap" }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I practised this section.
  </label>
);

const PositionLegend = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    <span style={positionTokenStyle("verb")}>Verb</span>
    <span style={positionTokenStyle("subject")}>Subject</span>
    <span style={positionTokenStyle("rest")}>Rest</span>
    <span style={positionTokenStyle("question")}>W-word</span>
    <span style={positionTokenStyle("amount")}>Amount</span>
  </div>
);

const SentencePattern = ({ parts }) => (
  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7 }}>
    {parts.map((part, index) => (
      <React.Fragment key={`${part.text}-${index}`}>
        <span style={positionTokenStyle(part.type)}>{part.text}</span>
        {index < parts.length - 1 ? <span aria-hidden="true">+</span> : null}
      </React.Fragment>
    ))}
  </div>
);

function QuizBlock({ title, questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, q) => (answers[q.id] === q.correct ? total + 1 : total), 0);

  return (
    <div style={questionCardStyle}>
      <strong>{title}</strong>

      <div style={{ display: "grid", gap: 14 }}>
        {questions.map((q) => (
          <div key={q.id} style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 600 }}>{q.stem}</div>
            {Object.entries(q.options).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: key }))}
                style={optionButtonStyle(answers[q.id] === key, key === q.correct, submitted)}
              >
                {key}) {label}
              </button>
            ))}
            {submitted ? (
              <div style={{ color: "#374151", fontSize: "0.95rem" }}>
                Correct answer: <strong>{q.correct}</strong>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" style={styles.primaryButton} onClick={() => setSubmitted(true)}>
          Check answers
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
          }}
        >
          Reset
        </button>
      </div>

      {submitted ? (
        <div
          style={{
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            background: "#f0fdf4",
            padding: 14,
            display: "grid",
            gap: 8,
          }}
        >
          <strong>
            Score: {score}/{questions.length}
          </strong>
        </div>
      ) : null}
    </div>
  );
}

function TypedGapPractice({ title, items }) {
  const [values, setValues] = useState(() => Object.fromEntries(items.map((item) => [item.id, ""])));
  const [checked, setChecked] = useState(false);

  const score = items.reduce((total, item) => {
    return isOneOf(values[item.id], item.answers) ? total + 1 : total;
  }, 0);

  return (
    <div style={questionCardStyle}>
      <strong>{title}</strong>

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item) => {
          const ok = isOneOf(values[item.id], item.answers);
          return (
            <div key={item.id} style={{ display: "grid", gap: 8 }}>
              <label style={{ fontWeight: 600 }}>{item.prompt}</label>
              <input
                type="text"
                value={values[item.id]}
                onChange={(event) => setValues((prev) => ({ ...prev, [item.id]: event.target.value }))}
                style={inputStyle}
                placeholder="Type the complete question"
              />
              {checked ? (
                <div style={resultText(ok)}>
                  {ok ? "Correct" : `Try again. Example answer: ${item.answers[0]}`}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" style={styles.primaryButton} onClick={() => setChecked(true)}>
          Check typed answers
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => {
            setValues(Object.fromEntries(items.map((item) => [item.id, ""])));
            setChecked(false);
          }}
        >
          Reset
        </button>
      </div>

      {checked ? (
        <div
          style={{
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            background: "#f0fdf4",
            padding: 14,
            display: "grid",
            gap: 8,
          }}
        >
          <strong>
            Score: {score}/{items.length}
          </strong>
        </div>
      ) : null}
    </div>
  );
}

const A1FamilyLanguagesQuestionsWorkbookPage = () => {
  const [prepared, setPrepared] = useState({
    family: false,
    writing: false,
    languages: false,
    questions: false,
    hobbies: false,
  });

  const [showWritingModel, setShowWritingModel] = useState(false);
  const [writingDraft, setWritingDraft] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem(DAY6_WRITING_DRAFT_KEY) || "";
    } catch (_error) {
      return "";
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DAY6_WRITING_DRAFT_KEY, writingDraft);
    } catch (_error) {
      // Draft persistence is best-effort on restricted browsers.
    }
  }, [writingDraft]);

  const writingWordCount = writingDraft.trim() ? writingDraft.trim().split(/\s+/).length : 0;

  const setPreparedFor = (tabKey) => (event) => {
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));
  };

  return (
    <div data-a1-single-page-workbook="true" style={pageStyle}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={chipStyle}>A1 · Day 6</span>
          <span style={chipStyle}>Kapitel 2.3</span>
          <span style={chipStyle}>Self-practice</span>
        </div>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Family, Languages, Questions and Hobbies
        </h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Work straight down this page. There are no separate Teil tabs. Learn the language, practise it immediately,
          then finish with a short paragraph about yourself and your family.
        </p>

        <div style={infoBoxStyle}>
          <strong>By the end of this lesson you should be able to:</strong>
          <ul style={listStyle}>
            <li>name common family members and use <strong>mein / meine</strong> correctly in simple sentences;</li>
            <li>say which languages you speak and use <strong>ein bisschen</strong> naturally;</li>
            <li>form a yes/no question by putting the conjugated verb first;</li>
            <li>talk about hobbies with <strong>gern</strong>;</li>
            <li>write 6–8 connected sentences about yourself and your family.</li>
          </ul>
        </div>
      </div>

      <div id="family" style={cardStyle}>
        <h2 style={sectionTitle}>Family vocabulary</h2>

        <div style={infoBoxStyle}>
          <strong>Family Members</strong>
          <div style={{ display: "grid", gap: 6 }}>
            {familyMembers.map(([german, english]) => (
              <div key={german}>
                {german} – {english}
              </div>
            ))}
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Use the family word inside a sentence</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use <strong>mein</strong> with masculine and neuter family nouns and <strong>meine</strong> with feminine
            and plural nouns: <strong>mein Vater</strong>, <strong>mein Kind</strong>, <strong>meine Mutter</strong>,
            <strong>meine Eltern</strong>.
          </p>
          <div style={sentenceBoxStyle}>
            Das ist meine Mutter.
            <br />
            Das ist mein Vater.
            <br />
            Ich habe einen Bruder.
            <br />
            Ich habe eine Schwester.
            <br />
            Ich habe keine Kinder.
          </div>
        </div>

        <QuizBlock title="Family self-check" questions={familyQuiz} />
        <PreparedCheckbox checked={prepared.family} onChange={setPreparedFor("family")} />
      </div>

      <div id="writing" style={cardStyle}>
        <h2 style={sectionTitle}>Write about yourself and your family</h2>

        <div style={warningBoxStyle}>
          <strong>Build your paragraph with these sentence frames</strong>
          <ol style={listStyle}>
            {writingTemplate.map(([purpose, german, example]) => (
              <li key={purpose}>
                <strong>{purpose}:</strong> {german}
                <div>
                  <em>Example:</em> {example}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div style={questionCardStyle}>
          <strong>Your practice paragraph</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Write 6–8 sentences. Try to include your name, country, age, at least two family details, one hobby and the
            languages you speak. This is self-practice, so edit freely before you compare with the model.
          </p>
          <textarea
            data-a1-day6-writing-draft="true"
            value={writingDraft}
            onChange={(event) => setWritingDraft(event.target.value)}
            rows={9}
            placeholder="Ich heiße … Ich komme aus … Ich bin … Jahre alt. Meine Familie …"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #94a3b8",
              font: "inherit",
              lineHeight: 1.7,
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", color: "#475569" }}>
            <span>Draft saves on this device automatically.</span>
            <span>{writingWordCount} words</span>
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Need help?</strong>
          <button type="button" style={styles.secondaryButton} onClick={() => setShowWritingModel((prev) => !prev)}>
            {showWritingModel ? "Hide model paragraph" : "Show model paragraph"}
          </button>

          {showWritingModel ? (
            <div style={answerCardStyle}>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Mein Name ist Anna. Ich komme aus Deutschland. Ich bin 20 Jahre alt. Mein Vater heißt Peter. Meine Mutter
                heißt Maria. Ich habe keine Kinder. Mein Hobby ist Lesen. Ich spreche Deutsch und Englisch.
              </p>
            </div>
          ) : null}
        </div>

        <PreparedCheckbox checked={prepared.writing} onChange={setPreparedFor("writing")} />
      </div>

      <div id="languages" style={cardStyle}>
        <h2 style={sectionTitle}>Languages and „ein bisschen“</h2>

        <div style={infoBoxStyle}>
          <strong>Language Names</strong>
          <div style={{ display: "grid", gap: 6 }}>
            {languageNames.map(([german, english]) => (
              <div key={german}>
                {german} – {english}
              </div>
            ))}
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>What does „ein bisschen“ mean?</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Ein bisschen</strong> means <strong>a little</strong> or <strong>a bit</strong>. Use it when you can do
            something, but only to a small degree.
          </p>
          <div style={answerCardStyle}>
            <div style={{ lineHeight: 1.7 }}>
              <strong>Ich spreche Deutsch.</strong> = I speak German.
              <br />
              <strong>Ich spreche ein bisschen Deutsch.</strong> = I speak a little German.
            </div>
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>The sentence pattern</strong>
          <PositionLegend />
          <SentencePattern
            parts={[
              { type: "subject", text: "Ich" },
              { type: "verb", text: "spreche" },
              { type: "amount", text: "ein bisschen" },
              { type: "rest", text: "Deutsch." },
            ]}
          />
          <div style={{ color: "#374151", lineHeight: 1.7 }}>
            <strong>Subject</strong> = who speaks · <strong>Verb</strong> = the action · <strong>ein bisschen</strong> = how
            much · <strong>Deutsch</strong> = the language
          </div>
        </div>

        <div style={warningBoxStyle}>
          <strong>Important rule</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Ein bisschen</strong> is a fixed expression. Keep the word <strong>ein</strong>. Language names also
            begin with a capital letter in German.
          </p>
          <div style={sentenceBoxStyle}>
            ✅ Ich spreche <strong>ein bisschen</strong> Deutsch.
            <br />
            ❌ Ich spreche bisschen Deutsch.
            <br />
            ❌ Ich ein bisschen spreche Deutsch.
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Asking about languages</strong>
          <SentencePattern
            parts={[
              { type: "verb", text: "Sprichst" },
              { type: "subject", text: "du" },
              { type: "amount", text: "ein bisschen" },
              { type: "rest", text: "Deutsch?" },
            ]}
          />
          <div style={answerCardStyle}>
            Ja, ich spreche ein bisschen Deutsch.
            <br />
            Ja, ein bisschen.
            <br />
            Nein, noch nicht.
          </div>
        </div>

        <QuizBlock title="Languages self-check" questions={languageQuiz} />
        <PreparedCheckbox checked={prepared.languages} onChange={setPreparedFor("languages")} />
      </div>

      <div id="questions" style={cardStyle}>
        <h2 style={sectionTitle}>Forming yes/no questions</h2>

        <div style={infoBoxStyle}>
          <strong>Basic structure</strong>
          <div style={chipStyle}>Conjugated verb + subject + rest of the sentence?</div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            A <strong>Ja/Nein-Frage</strong> can normally be answered with <strong>ja</strong> or <strong>nein</strong>.
            The conjugated verb starts the question.
          </p>
        </div>

        <div style={questionCardStyle}>
          <strong>See the positions</strong>
          <PositionLegend />

          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>Statement</div>
              <SentencePattern
                parts={[
                  { type: "subject", text: "Du" },
                  { type: "verb", text: "lernst" },
                  { type: "rest", text: "Deutsch." },
                ]}
              />
            </div>

            <div>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>Yes-or-no question</div>
              <SentencePattern
                parts={[
                  { type: "verb", text: "Lernst" },
                  { type: "subject", text: "du" },
                  { type: "rest", text: "Deutsch?" },
                ]}
              />
            </div>
          </div>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The verb <strong>lernst</strong> moves from position two in the statement to position one in the question.
          </p>
        </div>

        <div style={questionCardStyle}>
          <strong>How to form a yes-or-no question</strong>
          <ol style={listStyle}>
            <li>Find the conjugated verb.</li>
            <li>Move the conjugated verb to the beginning.</li>
            <li>Put the subject directly after the verb.</li>
            <li>Keep the remaining information after the subject.</li>
            <li>Add a question mark.</li>
          </ol>
        </div>

        <div style={warningBoxStyle}>
          <strong>Use the conjugated verb</strong>
          <div style={sentenceBoxStyle}>
            ✅ <strong>Spielst</strong> du Fußball?
            <br />
            ❌ <strong>Spielen</strong> du Fußball?
            <br />
            <br />
            ✅ <strong>Sprichst</strong> du Deutsch?
            <br />
            ❌ <strong>Sprechen</strong> du Deutsch?
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Yes-or-no question versus W-question</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            A W-question starts with a question word. The conjugated verb is second.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>Yes-or-no question: verb first</div>
              <SentencePattern
                parts={[
                  { type: "verb", text: "Wohnst" },
                  { type: "subject", text: "du" },
                  { type: "rest", text: "in Accra?" },
                ]}
              />
            </div>

            <div>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>W-question: question word first, verb second</div>
              <SentencePattern
                parts={[
                  { type: "question", text: "Wo" },
                  { type: "verb", text: "wohnst" },
                  { type: "subject", text: "du?" },
                ]}
              />
            </div>
          </div>
        </div>

        <TypedGapPractice
          title="Practice · Change the statement into a question"
          items={[
            {
              id: "qa1",
              prompt: "Du schwimmst im Meer. → ______",
              answers: ["Schwimmst du im Meer?"],
            },
            {
              id: "qa2",
              prompt: "Du spielst Fußball. → ______",
              answers: ["Spielst du Fußball?"],
            },
            {
              id: "qa3",
              prompt: "Du malst ein Bild. → ______",
              answers: ["Malst du ein Bild?"],
            },
            {
              id: "qa4",
              prompt: "Du hörst Musik. → ______",
              answers: ["Hörst du Musik?"],
            },
          ]}
        />

        <QuizBlock title="Yes/No questions self-check" questions={questionQuiz} />
        <PreparedCheckbox checked={prepared.questions} onChange={setPreparedFor("questions")} />
      </div>

      <div id="hobbies" style={cardStyle}>
        <h2 style={sectionTitle}>Hobbies and „gern“</h2>

        <div style={infoBoxStyle}>
          <strong>Common Hobbies Vocabulary</strong>
          <div style={{ display: "grid", gap: 6 }}>
            {hobbies.map(([german, english]) => (
              <div key={german}>
                {german} – {english}
              </div>
            ))}
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Talking about hobbies with gern</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use <strong>gern</strong> with the activity verb: <strong>Ich lese gern.</strong> This is often more natural
            than translating “my hobby is …” word for word. You can still say <strong>Mein Hobby ist Lesen.</strong>
          </p>
          <div style={chipStyle}>Ich + conjugated verb + gern.</div>
          <div style={answerCardStyle}>
            Ich lese gern.
            <br />
            Ich schwimme gern.
            <br />
            Ich spiele gern Fußball.
            <br />
            Ich male gern.
            <br />
            Ich höre gern Musik.
            <br />
            Ich koche gern.
            <br />
            Ich reise gern.
            <br />
            Ich wandere gern.
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Asking about hobbies</strong>
          <div style={sentenceBoxStyle}>
            <strong>Was machst du gern?</strong> = What do you like doing?
            <br />
            <br />
            Ich spiele gern Fußball.
            <br />
            Ich höre gern Musik.
            <br />
            Ich schwimme gern.
          </div>
        </div>

        <QuizBlock title="Hobbies self-check" questions={hobbyQuiz} />
        <PreparedCheckbox checked={prepared.hobbies} onChange={setPreparedFor("hobbies")} />
      </div>
    </div>
  );
};

export default A1FamilyLanguagesQuestionsWorkbookPage;
