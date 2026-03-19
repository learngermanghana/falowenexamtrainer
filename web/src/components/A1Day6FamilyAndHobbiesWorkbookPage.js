import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
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
  fontSize: "1.1rem",
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

const successBoxStyle = {
  border: "1px solid #bbf7d0",
  borderRadius: 12,
  background: "#f0fdf4",
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
  gap: 8,
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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const familyMembers = [
  ["die Mutter", "mother"],
  ["der Vater", "father"],
  ["die Eltern", "parents"],
  ["die Schwester", "sister"],
  ["der Bruder", "brother"],
  ["die Geschwister", "siblings"],
  ["die Großmutter (Oma)", "grandmother"],
  ["der Großvater (Opa)", "grandfather"],
  ["die Tante", "aunt"],
  ["der Onkel", "uncle"],
  ["die Cousine", "female cousin"],
  ["der Cousin", "male cousin"],
  ["die Tochter", "daughter"],
  ["der Sohn", "son"],
  ["das Kind", "child"],
  ["die Kinder", "children"],
];

const hobbies = [
  ["lesen", "to read"],
  ["schwimmen", "to swim"],
  ["Fußball spielen", "to play football"],
  ["Musik hören", "to listen to music"],
  ["kochen", "to cook"],
  ["tanzen", "to dance"],
  ["malen", "to paint"],
  ["fernsehen", "to watch TV"],
];

const languageNames = [
  ["Deutsch", "German"],
  ["Englisch", "English"],
  ["Spanisch", "Spanish"],
  ["Französisch", "French"],
  ["Arabisch", "Arabic"],
];

const writingTemplate = [
  ["My name is + your name.", "Mein Name ist + dein Name.", "Mein Name ist Anna."],
  ["I come from + your country.", "Ich komme aus + dein Land.", "Ich komme aus Ghana."],
  ["I am + number + years old.", "Ich bin + Zahl + Jahre alt.", "Ich bin 20 Jahre alt."],
  ["I have + family member(s).", "Ich habe + Familienmitglied(er).", "Ich habe einen Bruder und eine Schwester."],
  ["My father is called + name.", "Mein Vater heißt + Name.", "Mein Vater heißt Peter."],
  ["My mother is called + name.", "Meine Mutter heißt + Name.", "Meine Mutter heißt Maria."],
  ["Hobby with gern", "Ich lese gern. / Ich höre gern Musik.", "Ich lese gern."],
  ["Languages", "Ich spreche + Sprache.", "Ich spreche Deutsch und Englisch."],
];

const speakingPrompts = [
  "Wie heißt du?",
  "Woher kommst du?",
  "Wie alt bist du?",
  "Hast du Geschwister?",
  "Wie heißt dein Vater?",
  "Wie heißt deine Mutter?",
  "Was machst du gern?",
  "Spielst du gern Fußball?",
  "Hörst du gern Musik?",
  "Sprichst du Deutsch?",
];

const readingQuestions = [
  {
    id: "r1",
    stem: "1. Wie heißt die Person im Text?",
    correct: "B",
    options: {
      A: "Maria",
      B: "Anna",
      C: "Peter",
      D: "Lena",
    },
  },
  {
    id: "r2",
    stem: "2. Woher kommt Anna?",
    correct: "C",
    options: {
      A: "Aus Österreich",
      B: "Aus Spanien",
      C: "Aus Deutschland",
      D: "Aus Italien",
    },
  },
  {
    id: "r3",
    stem: "3. Wer ist Peter?",
    correct: "B",
    options: {
      A: "Ihr Bruder",
      B: "Ihr Vater",
      C: "Ihr Sohn",
      D: "Ihr Cousin",
    },
  },
  {
    id: "r4",
    stem: "4. Was macht Anna gern?",
    correct: "B",
    options: {
      A: "Sie kocht gern.",
      B: "Sie liest gern.",
      C: "Sie tanzt gern.",
      D: "Sie arbeitet gern.",
    },
  },
  {
    id: "r5",
    stem: "5. Welche Sprachen spricht Anna?",
    correct: "A",
    options: {
      A: "Deutsch und Englisch",
      B: "Deutsch und Französisch",
      C: "Englisch und Spanisch",
      D: "Nur Deutsch",
    },
  },
];

const hoerenQuestions = [
  {
    id: "h1",
    stem: "1. Welche Frage ist eine Ja/Nein-Frage?",
    correct: "B",
    options: {
      A: "Du spielst Fußball.",
      B: "Spielst du Fußball?",
      C: "Ihr kommt aus Deutschland.",
      D: "Sie liest gern.",
    },
  },
  {
    id: "h2",
    stem: "2. Welche Antwort passt zu „Liest du gern?“",
    correct: "A",
    options: {
      A: "Ja, ich lese gern.",
      B: "Ja, ich bin lesen.",
      C: "Nein, ich lese gern.",
      D: "Ja, ich gern lese.",
    },
  },
  {
    id: "h3",
    stem: "3. Welche negative Antwort ist richtig?",
    correct: "A",
    options: {
      A: "Nein, ich spiele nicht gern Fußball.",
      B: "Nein, ich nicht spiele gern Fußball.",
      C: "Nein, ich gern spiele nicht.",
      D: "Nein, nicht ich spiele gern Fußball.",
    },
  },
  {
    id: "h4",
    stem: "4. Was bedeutet „gern“?",
    correct: "C",
    options: {
      A: "never",
      B: "slowly",
      C: "gladly / like to",
      D: "always",
    },
  },
  {
    id: "h5",
    stem: "5. Welche Frage ist richtig?",
    correct: "B",
    options: {
      A: "Du hast Geschwister?",
      B: "Hast du Geschwister?",
      C: "Geschwister hast du?",
      D: "Du Geschwister hast?",
    },
  },
];

const gernDrills = [
  {
    prompt: "I like to read.",
    answer: "Ich lese gern.",
  },
  {
    prompt: "I like to listen to music.",
    answer: "Ich höre gern Musik.",
  },
  {
    prompt: "He likes to play football.",
    answer: "Er spielt gern Fußball.",
  },
];

const questionTransformDrills = [
  {
    statement: "Du spielst Fußball.",
    answer: "Spielst du Fußball?",
  },
  {
    statement: "Du hast Geschwister.",
    answer: "Hast du Geschwister?",
  },
  {
    statement: "Du sprichst Deutsch.",
    answer: "Sprichst du Deutsch?",
  },
  {
    statement: "Du liest gern.",
    answer: "Liest du gern?",
  },
];

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
    I prepared this part.
  </label>
);

function QuizBlock({ title, questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, q) => {
    return answers[q.id] === q.correct ? total + 1 : total;
  }, 0);

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
              <div style={{ fontSize: "0.95rem", color: "#374151" }}>
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
        <div style={successBoxStyle}>
          <strong>
            Score: {score}/{questions.length}
          </strong>
        </div>
      ) : null}
    </div>
  );
}

const A1Day6FamilyAndHobbiesWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const [showGernAnswers, setShowGernAnswers] = useState(false);
  const [showQuestionAnswers, setShowQuestionAnswers] = useState(false);

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
          A1 · Day 6 Workbook · Family, Hobbies and Ja/Nein-Fragen
        </h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Learn how to talk about your family, use <strong>gern</strong> for hobbies, and form simple yes/no questions in
          German.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}. Study first, practise here, then submit your final answers in the
          submission area.
        </p>
      </div>

      {activeTab === "sprechen" && (
        <div style={cardStyle}>
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80"
            alt="Family talking together at home"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 1 · Sprechen</h2>

          <div style={infoBoxStyle}>
            <strong>Today’s goals</strong>
            <div>1. Talk about family</div>
            <div>2. Say what you like to do with <strong>gern</strong></div>
            <div>3. Ask and answer simple yes/no questions</div>
          </div>

          <div style={infoBoxStyle}>
            <strong>Family members</strong>
            <div style={{ display: "grid", gap: 6 }}>
              {familyMembers.map(([german, english]) => (
                <div key={german}>
                  {german} – {english}
                </div>
              ))}
            </div>
          </div>

          <div style={infoBoxStyle}>
            <strong>Hobbies</strong>
            <div style={{ display: "grid", gap: 6 }}>
              {hobbies.map(([german, english]) => (
                <div key={german}>
                  {german} – {english}
                </div>
              ))}
            </div>
          </div>

          <div style={questionCardStyle}>
            <strong>Rule 1: How to use “gern”</strong>
            <div style={chipStyle}>Subject + verb + gern</div>
            <div style={sentenceBoxStyle}>
              Ich lese gern. <br />
              Ich höre gern Musik. <br />
              Er spielt gern Fußball. <br />
              Sie kocht gern.
            </div>
            <p style={{ margin: 0 }}>
              <strong>gern</strong> shows that you like doing something.
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Mini practice: Translate with “gern”</strong>
            <ol style={listStyle}>
              {gernDrills.map((item) => (
                <li key={item.prompt}>
                  <div>{item.prompt}</div>
                  {showGernAnswers ? (
                    <div style={{ marginTop: 6 }}>
                      <strong>Answer:</strong> {item.answer}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button type="button" style={styles.secondaryButton} onClick={() => setShowGernAnswers((prev) => !prev)}>
                {showGernAnswers ? "Hide answers" : "Show answers"}
              </button>
            </div>
          </div>

          <div style={questionCardStyle}>
            <strong>Rule 2: How to form a Ja/Nein-Frage</strong>
            <div style={chipStyle}>Verb + subject + ... ?</div>
            <div style={sentenceBoxStyle}>
              Du spielst Fußball. → <strong>Spielst du Fußball?</strong> <br />
              Du hast Geschwister. → <strong>Hast du Geschwister?</strong> <br />
              Du sprichst Deutsch. → <strong>Sprichst du Deutsch?</strong> <br />
              Du liest gern. → <strong>Liest du gern?</strong>
            </div>
            <p style={{ margin: 0 }}>
              In yes/no questions, the <strong>verb comes first</strong>.
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Mini practice: Change the sentence into a question</strong>
            <ol style={listStyle}>
              {questionTransformDrills.map((item) => (
                <li key={item.statement}>
                  <div>{item.statement}</div>
                  {showQuestionAnswers ? (
                    <div style={{ marginTop: 6 }}>
                      <strong>Answer:</strong> {item.answer}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button type="button" style={styles.secondaryButton} onClick={() => setShowQuestionAnswers((prev) => !prev)}>
                {showQuestionAnswers ? "Hide answers" : "Show answers"}
              </button>
            </div>
          </div>

          <div style={answerCardStyle}>
            <strong>Model answers</strong>
            <ul style={listStyle}>
              <li>Ja, ich lese gern.</li>
              <li>Nein, ich lese nicht gern.</li>
              <li>Ja, ich habe einen Bruder.</li>
              <li>Nein, ich habe keine Schwester.</li>
              <li>Ja, ich spreche ein bisschen Deutsch.</li>
            </ul>
          </div>

          <div style={questionCardStyle}>
            <strong>Speaking prompts</strong>
            <ol style={listStyle}>
              {speakingPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ol>
          </div>

          <div style={successBoxStyle}>
            <strong>Speaking self-practice</strong>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice tool
            </a>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open Falowen speaking practice
            </a>
          </div>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={cardStyle}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Notebook for writing a family introduction"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Write a short paragraph about yourself, your family, and your hobbies.
          </p>

          <div style={warningBoxStyle}>
            <strong>Important</strong>
            <p style={{ margin: 0 }}>
              Write at least <strong>2 sentences with gern</strong>.
            </p>
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open writing practice
            </a>
          </div>

          <div style={questionCardStyle}>
            <strong>Writing template and model</strong>
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

          <div style={infoBoxStyle}>
            <strong>Useful language</strong>
            <ul style={listStyle}>
              <li>Ich habe einen Bruder.</li>
              <li>Ich habe eine Schwester.</li>
              <li>Ich lese gern.</li>
              <li>Ich höre gern Musik.</li>
              <li>Ich spiele gern Fußball.</li>
              <li>Ich spreche Deutsch und Englisch.</li>
              <li>Ich spreche ein bisschen Deutsch.</li>
            </ul>
          </div>

          <div style={questionCardStyle}>
            <strong>Language names</strong>
            <div style={{ display: "grid", gap: 6 }}>
              {languageNames.map(([german, english]) => (
                <div key={german}>
                  {german} – {english}
                </div>
              ))}
            </div>
          </div>

          <div style={answerCardStyle}>
            <strong>Model paragraph</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Mein Name ist Anna. Ich komme aus Deutschland. Ich bin 20 Jahre alt. Mein Vater heißt Peter und meine Mutter heißt
              Maria. Ich habe einen Bruder und eine Schwester. Ich lese gern und ich höre gern Musik. Ich spreche Deutsch und
              Englisch. Ich spreche auch ein bisschen Spanisch.
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Your writing checklist</strong>
            <div>☐ Name</div>
            <div>☐ Country</div>
            <div>☐ Age</div>
            <div>☐ Family sentence(s)</div>
            <div>☐ 2 hobby sentences with gern</div>
            <div>☐ Languages</div>
          </div>

          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={cardStyle}>
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80"
            alt="Student reading a beginner German workbook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>

          <div style={infoBoxStyle}>
            <strong>Reading text</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Mein Name ist Anna. Ich komme aus Deutschland und ich bin 20 Jahre alt. Mein Vater heißt Peter und meine Mutter
              heißt Maria. Ich habe einen Bruder und eine Schwester. Ich lese gern und ich höre auch gern Musik. Ich spreche
              Deutsch und Englisch. Ich spreche auch ein bisschen Spanisch.
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Find these first</strong>
            <div>Name</div>
            <div>Country</div>
            <div>Family members</div>
            <div>Hobbies</div>
            <div>Languages</div>
          </div>

          <QuizBlock title="Reading self-check" questions={readingQuestions} />

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={cardStyle}>
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
            alt="Learner watching and listening to a German lesson online"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 4 · Hören</h2>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Watch the video and listen for hobbies, family words, and yes/no questions.
          </p>

          <div style={warningBoxStyle}>
            <strong>Recommended video</strong>
            <a href="https://youtu.be/_WdlEcKXuVg" target="_blank" rel="noreferrer">
              Open the Day 6 lesson video on YouTube
            </a>
          </div>

          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/_WdlEcKXuVg"
            title="A1 Day 6 Family and Hobbies lesson video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div style={questionCardStyle}>
            <strong>Remember</strong>
            <div style={chipStyle}>Verb first = yes/no question</div>
            <div style={sentenceBoxStyle}>
              Spielst du gern Fußball? <br />
              Hast du Geschwister? <br />
              Sprichst du Deutsch? <br />
              Liest du gern?
            </div>
          </div>

          <QuizBlock title="Listening / grammar self-check" questions={hoerenQuestions} />

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, flexWrap: "wrap" }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode: show transcript and answers
          </label>

          {teacherMode ? (
            <div style={successBoxStyle}>
              <strong>Teacher mode</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                In German, yes/no questions begin with the verb:
                <br />
                <em>Spielst du gern Fußball?</em>
                <br />
                <em>Hast du Geschwister?</em>
                <br />
                <em>Sprichst du Deutsch?</em>
                <br />
                <em>Liest du gern?</em>
              </p>

              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Model answers:
                <br />
                <strong>Spielst du gern Fußball?</strong> — Ja, ich spiele gern Fußball. / Nein, ich spiele nicht gern Fußball.
                <br />
                <strong>Hast du Geschwister?</strong> — Ja, ich habe einen Bruder. / Nein, ich habe keine Geschwister.
                <br />
                <strong>Sprichst du Deutsch?</strong> — Ja, ich spreche ein bisschen Deutsch. / Nein, ich spreche kein Deutsch.
                <br />
                <strong>Liest du gern?</strong> — Ja, ich lese gern. / Nein, ich lese nicht gern.
              </p>
            </div>
          ) : null}

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A1Day6FamilyAndHobbiesWorkbookPage;
