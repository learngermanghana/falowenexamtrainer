import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useNavigate } from "react-router-dom";
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
  ["My name is + your name.", "Mein Name ist + dein Name.", "Mein Name ist Anna."],
  ["I come from + your country.", "Ich komme aus + Land.", "Ich komme aus Deutschland."],
  ["I am + number + years old.", "Ich bin + Zahl + Jahre alt.", "Ich bin 20 Jahre alt."],
  ["My father is called + name.", "Mein Vater heißt + Name.", "Mein Vater heißt Peter."],
  ["My mother is called + name.", "Meine Mutter heißt + Name.", "Meine Mutter heißt Maria."],
  ["Marital status", "Ich bin ledig / verheiratet / geschieden / verwitwet.", "Ich bin ledig."],
  ["Children", "Ich habe keine Kinder. / Ich habe + Zahl + Kind(er).", "Ich habe ein Kind."],
  ["Hobby", "Mein Hobby ist + Hobby.", "Mein Hobby ist Lesen."],
  ["Languages", "Ich spreche + Sprache.", "Ich spreche Deutsch und Englisch."],
];

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

const heroImageUrl =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

const A1FamilyLanguagesQuestionsWorkbookPage = () => {
  const navigate = useNavigate();
  const [prepared, setPrepared] = useState({
    family: false,
    writing: false,
    languages: false,
    questions: false,
    hobbies: false,
  });

  const [showWritingModel, setShowWritingModel] = useState(false);

  const setPreparedFor = (tabKey) => (event) => {
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <img
          src={heroImageUrl}
          alt="Students learning together"
          style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 14 }}
        />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1.1 Workbook · Family, Languages, Yes/No Questions and Hobbies
        </h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Everything is on one page. Move section by section and mark each part when you finish it.
        </p>
      </div>

      <div id="family" style={cardStyle}>
        <h2 style={sectionTitle}>Teil 1 · Family Vocabulary</h2>

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
          <strong>Sentence models</strong>
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
        <h2 style={sectionTitle}>Teil 2 · Writing About Your Family</h2>

        <div style={warningBoxStyle}>
          <strong>Writing template</strong>
          <ol style={listStyle}>
            {writingTemplate.map(([english, german, example]) => (
              <li key={english}>
                <div>{english}</div>
                <div>{german}</div>
                <div>
                  <em>Example:</em> {example}
                </div>
              </li>
            ))}
          </ol>
        </div>

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
          <strong>Final writing task</strong>
          <p style={{ margin: 0 }}>
            Write 6–8 sentences about yourself and your family. Include your name, country, age, family, one hobby, and
            languages.
          </p>
        </div>

        <div style={questionCardStyle}>
          <strong>Where to write and submit</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            After reading the template, go to the group discussion page and write your 6–8 sentence paragraph there.
          </p>
          <div>
            <button type="button" style={styles.primaryButton} onClick={() => navigate("/campus/discussion")}>
              Open Group Discussion
            </button>
          </div>
          <div style={{ color: "#374151", fontSize: "0.95rem" }}>
            Page link: https://www.falowen.app/campus/discussion
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
        <h2 style={sectionTitle}>Teil 3 · Languages and „ein bisschen“</h2>

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
          <strong>More examples</strong>
          <div style={{ lineHeight: 1.8 }}>
            Ich spreche ein bisschen Englisch.
            <br />
            Ama spricht ein bisschen Französisch.
            <br />
            Wir sprechen ein bisschen Deutsch.
            <br />
            Er versteht ein bisschen Spanisch.
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
        <h2 style={sectionTitle}>Teil 4 · Forming Yes-or-No Questions</h2>

        <div style={infoBoxStyle}>
          <strong>Rule for a yes-or-no question</strong>
          <div style={chipStyle}>Verb + Subject + other information?</div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Put the <strong>conjugated verb first</strong>, the <strong>subject second</strong>, and any other information
            after the subject.
          </p>
          <SentencePattern
            parts={[
              { type: "verb", text: "Lernst" },
              { type: "subject", text: "du" },
              { type: "rest", text: "Deutsch?" },
            ]}
          />
          <div style={{ color: "#374151", lineHeight: 1.7 }}>
            <strong>Lernst</strong> = verb · <strong>du</strong> = subject · <strong>Deutsch</strong> = other information
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            So: <strong>Verb + Subject + other information</strong> → <strong>Lernst du Deutsch?</strong>
          </p>
        </div>

        <div style={questionCardStyle}>
          <strong>More verb-first examples</strong>
          <div style={{ display: "grid", gap: 12 }}>
            <SentencePattern
              parts={[
                { type: "verb", text: "Spielt" },
                { type: "subject", text: "er" },
                { type: "rest", text: "Fußball?" },
              ]}
            />
            <SentencePattern
              parts={[
                { type: "verb", text: "Hört" },
                { type: "subject", text: "sie" },
                { type: "rest", text: "Musik?" },
              ]}
            />
            <SentencePattern
              parts={[
                { type: "verb", text: "Kochst" },
                { type: "subject", text: "du" },
                { type: "rest", text: "gern?" },
              ]}
            />
            <SentencePattern
              parts={[
                { type: "verb", text: "Sprichst" },
                { type: "subject", text: "du" },
                { type: "rest", text: "Deutsch?" },
              ]}
            />
          </div>
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
        <h2 style={sectionTitle}>Teil 5 · Hobbies</h2>

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
            Use <strong>verb + gern</strong> to say what you enjoy doing.
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
