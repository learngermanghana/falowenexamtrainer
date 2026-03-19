import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "family", label: "Teil 1 · Familie" },
  { key: "writing", label: "Teil 2 · Schreiben" },
  { key: "languages", label: "Teil 3 · Sprachen" },
  { key: "questions", label: "Teil 4 · Ja/Nein-Fragen" },
  { key: "hobbies", label: "Teil 5 · Hobbys" },
];

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

const textareaStyle = {
  width: "100%",
  minHeight: 160,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  lineHeight: 1.6,
  resize: "vertical",
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
  ["Reisen", "Traveling"],
  ["Gartenarbeit", "Gardening"],
  ["Radfahren", "Cycling"],
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
      A: "Ich Deutsch spreche.",
      B: "Ich sprechen Deutsch.",
      C: "Ich spreche Deutsch.",
      D: "Deutsch ich spreche.",
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
    stem: "3. What is the rule?",
    correct: "D",
    options: {
      A: "The noun comes first",
      B: "The pronoun comes first",
      C: "The object comes first",
      D: "The verb comes first",
    },
  },
];

const hobbyQuiz = [
  {
    id: "h1",
    stem: "1. What is 'Playing football' in German?",
    correct: "B",
    options: { A: "Musik hören", B: "Fußball spielen", C: "Schwimmen", D: "Malen" },
  },
  {
    id: "h2",
    stem: "2. Which answer is correct?",
    correct: "A",
    options: {
      A: "Ja, ich spiele Fußball.",
      B: "Ja, ich spiele keinen Fußball.",
      C: "Nein, ich spiele Fußball.",
      D: "Ja, ich Fußball spiele.",
    },
  },
  {
    id: "h3",
    stem: "3. Which negative answer is correct?",
    correct: "C",
    options: {
      A: "Nein, ich höre nicht keine Musik.",
      B: "Nein, ich male keine Bild.",
      C: "Nein, ich spiele keinen Fußball.",
      D: "Nein, ich schwimme keinen Meer.",
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

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
        padding: "12px 16px",
      }}
    >
      {children}
    </button>
  );
}

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
                onChange={(e) => setValues((prev) => ({ ...prev, [item.id]: e.target.value }))}
                style={inputStyle}
                placeholder="Type your answer"
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("family");
  const [prepared, setPrepared] = useState({
    family: false,
    writing: false,
    languages: false,
    questions: false,
    hobbies: false,
  });

  const [writingText, setWritingText] = useState("");
  const [showWritingModel, setShowWritingModel] = useState(false);

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => {
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1.1 Workbook · Family, Languages, Yes/No Questions and Hobbies
        </h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Learn, practise, type your answers, and check yourself. This page helps you talk about your family, languages,
          hobbies, and simple yes/no questions in German.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Section {activeIndex + 1} of {tabs.length}. Learn a little, do the task, then check your answers.
        </p>
      </div>

      {activeTab === "family" && (
        <div style={cardStyle}>
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

          <div style={infoBoxStyle}>
            <strong>Speaking tip</strong>
            <p style={{ margin: 0 }}>
              Read your answers aloud two times. Then ask your partner the same questions.
            </p>
          </div>

          <TypedGapPractice
            title="Practice A · Fill in the gap"
            items={[
              { id: "fa1", prompt: "Meine ______ heißt Maria.", answers: ["Mutter"] },
              { id: "fa2", prompt: "Mein ______ heißt Peter.", answers: ["Vater"] },
              { id: "fa3", prompt: "Ich habe einen ______.", answers: ["Bruder", "Sohn", "Cousin"] },
              { id: "fa4", prompt: "Ich habe keine ______.", answers: ["Kinder"] },
            ]}
          />

          <div style={questionCardStyle}>
            <strong>Practice B · Write true sentences about your family</strong>
            <div style={sentenceBoxStyle}>
              1. Meine Mutter heißt ...
              <br />
              2. Mein Vater heißt ...
              <br />
              3. Ich habe einen Bruder / eine Schwester / keine Geschwister.
              <br />
              4. Ich habe Kinder / keine Kinder.
            </div>
          </div>

          <QuizBlock title="Family self-check" questions={familyQuiz} />

          <PreparedCheckbox checked={prepared.family} onChange={setPreparedFor("family")} />
        </div>
      )}

      {activeTab === "writing" && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Teil 2 · Writing About Your Family</h2>

          <div style={warningBoxStyle}>
            <strong>Writing Template and Example</strong>
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

          <TypedGapPractice
            title="Practice A · Complete the writing model"
            items={[
              { id: "wa1", prompt: "Mein Name ist ______.", answers: ["Anna", "Kojo", "Ama", "Peter", "Maria"] },
              { id: "wa2", prompt: "Ich komme aus ______.", answers: ["Deutschland", "Ghana", "Spanien", "Italien"] },
              { id: "wa3", prompt: "Ich bin ______ Jahre alt.", answers: ["20", "18", "22", "25"] },
              { id: "wa4", prompt: "Mein Vater heißt ______.", answers: ["Peter", "Kofi", "Daniel"] },
              { id: "wa5", prompt: "Meine Mutter heißt ______.", answers: ["Maria", "Ama", "Anna"] },
            ]}
          />

          <div style={warningBoxStyle}>
            <strong>Lesson plan · Write about your family</strong>
            <div>1. Start with your name.</div>
            <div>2. Write where you come from.</div>
            <div>3. Write your age.</div>
            <div>4. Write about your mother or father.</div>
            <div>5. Write about brothers, sisters, or children.</div>
            <div>6. Add one hobby.</div>
            <div>7. Add the languages you speak.</div>
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
              Write 6–8 sentences about yourself and your family. Include your name, country, age, parents, children or no
              children, one hobby, and the languages you speak.
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Your paragraph</strong>
            <textarea
              style={textareaStyle}
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              placeholder="Example: Mein Name ist ..."
            />
            <div style={{ color: "#4b5563" }}>
              Tip: use short A1 sentences. One idea per sentence is enough.
            </div>
          </div>

          <div style={questionCardStyle}>
            <strong>Writing checklist</strong>
            <div>☐ Name</div>
            <div>☐ Country</div>
            <div>☐ Age</div>
            <div>☐ Mother or father</div>
            <div>☐ Children / no children</div>
            <div>☐ Hobby</div>
            <div>☐ Languages</div>
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
                  heißt Maria. Ich bin ledig. Ich habe keine Kinder. Mein Hobby ist Lesen. Ich spreche Deutsch und Englisch.
                </p>
              </div>
            ) : null}
          </div>

          <PreparedCheckbox checked={prepared.writing} onChange={setPreparedFor("writing")} />
        </div>
      )}

      {activeTab === "languages" && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Teil 3 · Languages and “ein bisschen”</h2>

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

          <div style={infoBoxStyle}>
            <strong>How to use “ein bisschen”</strong>
            <p style={{ margin: 0 }}>
              “Ein bisschen” means “a little” or “a bit”. Use it when you do something only a little.
            </p>
            <ul style={listStyle}>
              <li>Ich spreche ein bisschen Deutsch.</li>
              <li>Ja, aber nur ein bisschen.</li>
              <li>Ich habe nur ein bisschen Zeit.</li>
              <li>Nur ein bisschen, bitte.</li>
            </ul>
          </div>

          <TypedGapPractice
            title='Practice A · Complete with "ein bisschen"'
            items={[
              { id: "la1", prompt: "Ich spreche ______ Deutsch.", answers: ["ein bisschen"] },
              { id: "la2", prompt: "Ja, aber nur ______.", answers: ["ein bisschen"] },
              { id: "la3", prompt: "Ich habe nur ______ Zeit.", answers: ["ein bisschen"] },
            ]}
          />

          <div style={questionCardStyle}>
            <strong>Practice B · Write true sentences</strong>
            <div style={sentenceBoxStyle}>
              Ich spreche ...
              <br />
              Ich spreche auch ...
              <br />
              Ich spreche ein bisschen ...
            </div>
          </div>

          <QuizBlock title="Languages self-check" questions={languageQuiz} />

          <PreparedCheckbox checked={prepared.languages} onChange={setPreparedFor("languages")} />
        </div>
      )}

      {activeTab === "questions" && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Teil 4 · Forming Yes or No Questions</h2>

          <div style={infoBoxStyle}>
            <strong>Basic Structure</strong>
            <div style={chipStyle}>Verb + Subject + Rest of sentence?</div>
            <div style={sentenceBoxStyle}>
              Du liest ein Buch. → <strong>Liest du ein Buch?</strong>
              <br />
              Du lernst Deutsch. → <strong>Lernst du Deutsch?</strong>
              <br />
              Er spielt Fußball. → <strong>Spielt er Fußball?</strong>
              <br />
              Sie liest ein Buch. → <strong>Liest sie ein Buch?</strong>
              <br />
              Ihr kommt aus Deutschland. → <strong>Kommt ihr aus Deutschland?</strong>
            </div>
          </div>

          <TypedGapPractice
            title="Practice A · Turn the statement into a question"
            items={[
              { id: "qa1", prompt: "Du lernst Deutsch. → ______", answers: ["Lernst du Deutsch?"] },
              { id: "qa2", prompt: "Er spielt Fußball. → ______", answers: ["Spielt er Fußball?"] },
              { id: "qa3", prompt: "Sie liest ein Buch. → ______", answers: ["Liest sie ein Buch?"] },
              { id: "qa4", prompt: "Ihr kommt aus Deutschland. → ______", answers: ["Kommt ihr aus Deutschland?"] },
            ]}
          />

          <div style={questionCardStyle}>
            <strong>Practice B · Answer the questions about yourself</strong>
            <ol style={listStyle}>
              <li>Sprichst du Deutsch?</li>
              <li>Hast du Geschwister?</li>
              <li>Hast du Kinder?</li>
              <li>Kommst du aus Ghana?</li>
            </ol>
          </div>

          <QuizBlock title="Yes/No questions self-check" questions={questionQuiz} />

          <PreparedCheckbox checked={prepared.questions} onChange={setPreparedFor("questions")} />
        </div>
      )}

      {activeTab === "hobbies" && (
        <div style={cardStyle}>
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
            <strong>How to talk about hobbies</strong>
            <div style={chipStyle}>Subject + verb + gern</div>
            <div style={sentenceBoxStyle}>
              Ich lese gern.
              <br />
              Er schwimmt gern.
              <br />
              Wir spielen gern Fußball.
              <br />
              Sie malt gern.
              <br />
              Wir hören gern Musik.
            </div>
          </div>

          <TypedGapPractice
            title="Practice A · Write the question"
            items={[
              { id: "ha1", prompt: "schwimmen + im Meer → ______", answers: ["Schwimmen Sie im Meer?"] },
              { id: "ha2", prompt: "spielen + Fußball → ______", answers: ["Spielen Sie Fußball?"] },
              { id: "ha3", prompt: "malen + ein Bild → ______", answers: ["Malen Sie ein Bild?"] },
              { id: "ha4", prompt: "hören + Musik → ______", answers: ["Hören Sie Musik?"] },
            ]}
          />

          <div style={questionCardStyle}>
            <strong>Now you try</strong>
            <div style={sentenceBoxStyle}>
              For each one, write:
              <br />• the question
              <br />• a yes answer
              <br />• a no answer
            </div>
            <div>1. Schwimmen Sie im Meer?</div>
            <div>2. Spielen Sie Fußball?</div>
            <div>3. Malen Sie ein Bild?</div>
            <div>4. Hören Sie Musik?</div>
          </div>

          <div style={answerCardStyle}>
            <strong>Answer support</strong>
            <div>
              <strong>1. Schwimmen Sie im Meer?</strong>
              <br />
              Ja, ich schwimme im Meer.
              <br />
              Nein, ich schwimme nicht im Meer.
            </div>
            <div>
              <strong>2. Spielen Sie Fußball?</strong>
              <br />
              Ja, ich spiele Fußball.
              <br />
              Nein, ich spiele keinen Fußball.
            </div>
            <div>
              <strong>3. Malen Sie ein Bild?</strong>
              <br />
              Ja, ich male ein Bild.
              <br />
              Nein, ich male kein Bild.
            </div>
            <div>
              <strong>4. Hören Sie Musik?</strong>
              <br />
              Ja, ich höre Musik.
              <br />
              Nein, ich höre keine Musik.
            </div>
          </div>

          <QuizBlock title="Hobbies self-check" questions={hobbyQuiz} />

          <PreparedCheckbox checked={prepared.hobbies} onChange={setPreparedFor("hobbies")} />
        </div>
      )}
    </div>
  );
};

export default A1FamilyLanguagesQuestionsWorkbookPage;
