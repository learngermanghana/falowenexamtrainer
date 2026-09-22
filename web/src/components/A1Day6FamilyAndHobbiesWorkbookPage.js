import React, { useState } from "react";
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

const familyGroups = [
  {
    title: "Immediate family",
    icon: "🏠",
    items: [
      ["👩", "die Mutter", "mother"],
      ["👨", "der Vater", "father"],
      ["👪", "die Eltern", "parents"],
      ["👧", "die Schwester", "sister"],
      ["👦", "der Bruder", "brother"],
      ["👨‍👩‍👧‍👦", "die Geschwister", "siblings"],
    ],
  },
  {
    title: "Grandparents",
    icon: "🌳",
    items: [
      ["👵", "die Großmutter (Oma)", "grandmother"],
      ["👴", "der Großvater (Opa)", "grandfather"],
      ["👵👴", "die Großeltern", "grandparents"],
    ],
  },
  {
    title: "Extended family",
    icon: "🤝",
    items: [
      ["👩", "die Tante", "aunt"],
      ["👨", "der Onkel", "uncle"],
      ["👧", "die Cousine", "female cousin"],
      ["👦", "der Cousin", "male cousin"],
    ],
  },
  {
    title: "Your own family",
    icon: "❤️",
    items: [
      ["👧", "die Tochter", "daughter"],
      ["👦", "der Sohn", "son"],
      ["🧒", "das Kind", "child"],
      ["🧒🧒", "die Kinder", "children"],
      ["👩", "die Ehefrau", "wife"],
      ["👨", "der Ehemann", "husband"],
    ],
  },
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
  ["Name", "Ich heiße … / Mein Name ist …", "My name is … / I am called …", "Ich heiße Ama.", "My name is Ama."],
  ["Country", "Ich komme aus …", "I come from …", "Ich komme aus Ghana.", "I come from Ghana."],
  ["Age", "Ich bin … Jahre alt.", "I am … years old.", "Ich bin 24 Jahre alt.", "I am 24 years old."],
  ["Family", "Ich habe … / Mein(e) … heißt …", "I have … / My … is called …", "Ich habe zwei Brüder. Meine Mutter heißt Adwoa.", "I have two brothers. My mother is called Adwoa."],
  ["Hobby", "Ich … gern. / Mein Hobby ist …", "I like to … / My hobby is …", "Ich höre gern Musik.", "I like listening to music."],
  ["Languages", "Ich spreche … / Ich spreche ein bisschen …", "I speak … / I speak a little …", "Ich spreche Englisch und ein bisschen Deutsch.", "I speak English and a little German."],
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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, flexWrap: "wrap" }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I practised this section.
  </label>
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

const A1FamilyLanguagesQuestionsWorkbookPage = () => {
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

        <div style={{ display: "grid", gap: 14 }} data-a1-family-vocabulary-grid="true">
          {familyGroups.map((group) => (
            <section
              key={group.title}
              style={{
                border: "1px solid #dbeafe",
                borderRadius: 14,
                background: "#f8fbff",
                padding: 14,
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span aria-hidden="true" style={{ fontSize: "1.35rem" }}>{group.icon}</span>
                <strong style={{ fontSize: "1rem" }}>{group.title}</strong>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 10,
                }}
              >
                {group.items.map(([emoji, german, english]) => (
                  <div
                    key={german}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      background: "#fff",
                      padding: "11px 12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        fontSize: "1.35rem",
                        lineHeight: 1.2,
                        width: 28,
                        flex: "0 0 28px",
                        textAlign: "center",
                      }}
                    >
                      {emoji}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
                        {german}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.94rem", marginTop: 2 }}>
                        {english}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
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
            {writingTemplate.map(([purpose, german, english, example, exampleEnglish]) => (
              <li key={purpose} style={{ marginBottom: 10 }}>
                <div><strong>{purpose}:</strong> {german}</div>
                <div style={{ color: "#475569" }}><strong>English:</strong> {english}</div>
                <div>
                  <em>Example:</em> {example}
                </div>
                <div style={{ color: "#475569" }}>
                  <em>English:</em> {exampleEnglish}
                </div>
              </li>
            ))}
          </ol>
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
          <strong>„Ein bisschen“ = a little / a bit</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use <strong>ein bisschen</strong> when you can speak or understand a language only to a small degree.
            Keep the two words together.
          </p>
          <div style={answerCardStyle}>
            <div style={{ lineHeight: 1.8 }}>
              <strong>Ich spreche Deutsch.</strong> = I speak German.
              <br />
              <strong>Ich spreche ein bisschen Deutsch.</strong> = I speak a little German.
              <br />
              <strong>Ich spreche ein bisschen Englisch.</strong> = I speak a little English.
              <br />
              <strong>Ich verstehe ein bisschen Deutsch.</strong> = I understand a little German.
            </div>
          </div>
        </div>
      </div>

      <div id="questions" style={cardStyle}>
        <h2 style={sectionTitle}>Forming yes/no questions</h2>

        <div style={infoBoxStyle}>
          <strong>Basic structure</strong>
          <div style={chipStyle}>Conjugated verb + subject + rest of the sentence?</div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            A <strong>Ja/Nein-Frage</strong> can normally be answered with <strong>ja</strong> or <strong>nein</strong>.
            To form it, start with the <strong>conjugated verb</strong>, then put the subject after it.
          </p>
        </div>

        <div style={questionCardStyle}>
          <strong>Turn a statement into a yes/no question</strong>
          <div style={sentenceBoxStyle}>
            <strong>Du lernst Deutsch.</strong> = You learn German.
            <br />
            <strong>Lernst du Deutsch?</strong> = Do you learn German?
            <br />
            <br />
            <strong>Du spielst Fußball.</strong> = You play football.
            <br />
            <strong>Spielst du Fußball?</strong> = Do you play football?
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The important change is simple: the conjugated verb moves to the beginning.
          </p>
        </div>
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
          <strong>From an activity to a hobby with „gern“</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The activity sentence tells us what you do. Add <strong>gern</strong> to say that you like doing it.
          </p>
          <div style={sentenceBoxStyle}>
            <strong>Ich schwimme.</strong> = I swim.
            <br />
            <strong>Ich schwimme gern.</strong> = I like swimming.
            <br />
            <br />
            <strong>Ich lese.</strong> = I read.
            <br />
            <strong>Ich lese gern.</strong> = I like reading.
          </div>
        </div>

        <div style={questionCardStyle}>
          <strong>Ask a yes/no question about a hobby</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use the same yes/no rule: start with the conjugated verb, then the subject. Keep <strong>gern</strong> in the
            sentence.
          </p>
          <div style={sentenceBoxStyle}>
            <strong>Ich schwimme gern.</strong> = I like swimming.
            <br />
            <strong>Schwimmst du gern?</strong> = Do you like swimming?
            <br />
            <br />
            <strong>Ich spiele gern Fußball.</strong> = I like playing football.
            <br />
            <strong>Spielst du gern Fußball?</strong> = Do you like playing football?
            <br />
            <br />
            <strong>Ich höre gern Musik.</strong> = I like listening to music.
            <br />
            <strong>Hörst du gern Musik?</strong> = Do you like listening to music?
          </div>
        </div>

        <QuizBlock title="Hobbies self-check" questions={hobbyQuiz} />
        <PreparedCheckbox checked={prepared.hobbies} onChange={setPreparedFor("hobbies")} />
      </div>
    </div>
  );
};

export default A1FamilyLanguagesQuestionsWorkbookPage;
