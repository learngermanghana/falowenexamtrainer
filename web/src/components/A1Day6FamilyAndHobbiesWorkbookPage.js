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
  ["die Großmutter (Oma)", "grandmother (grandma)"],
  ["der Großvater (Opa)", "grandfather (grandpa)"],
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
  ["I come from + your country.", "Ich komme aus + dein Land.", "Ich komme aus Deutschland."],
  ["I am + number + years old.", "Ich bin + Zahl + Jahre alt.", "Ich bin 20 Jahre alt."],
  ["My father is called + name.", "Mein Vater heißt + Name.", "Mein Vater heißt Peter."],
  ["My mother is called + name.", "Meine Mutter heißt + Name.", "Meine Mutter heißt Maria."],
  ["Marital status", "Ich bin ledig / verheiratet / geschieden / verwitwet.", "Ich bin ledig."],
  ["Children", "Ich habe keine Kinder. / Ich habe + number + Kind(er).", "Ich habe ein Kind."],
  ["Hobby", "Mein Hobby ist + Hobby.", "Mein Hobby ist Lesen."],
  ["Languages", "Ich spreche + Sprache.", "Ich spreche Deutsch und Englisch."],
];

const speakingPrompts = [
  "Wie heißt du?",
  "Woher kommst du?",
  "Wie alt bist du?",
  "Hast du Geschwister?",
  "Wie heißt deine Mutter oder dein Vater?",
  "Bist du ledig oder verheiratet?",
  "Hast du Kinder?",
  "Was ist dein Hobby?",
  "Welche Sprachen sprichst du?",
  "Sprichst du ein bisschen Deutsch?",
];

const readingQuestions = [
  {
    stem: "1. Wie heißt die Person im Text?",
    options: ["A) Maria", "B) Anna", "C) Peter", "D) Lena"],
  },
  {
    stem: "2. Woher kommt Anna?",
    options: ["A) Aus Österreich", "B) Aus Deutschland", "C) Aus Spanien", "D) Aus Italien"],
  },
  {
    stem: "3. Wie alt ist Anna?",
    options: ["A) 18", "B) 19", "C) 20", "D) 21"],
  },
  {
    stem: "4. Wie heißt Annas Vater?",
    options: ["A) Peter", "B) Daniel", "C) Opa Karl", "D) Jonas"],
  },
  {
    stem: "5. Was ist Annas Hobby?",
    options: ["A) Kochen", "B) Schwimmen", "C) Lesen", "D) Wandern"],
  },
  {
    stem: "6. Welche Sprachen spricht Anna?",
    options: ["A) Deutsch und Englisch", "B) Deutsch und Spanisch", "C) Englisch und Französisch", "D) Nur Deutsch"],
  },
  {
    stem: "7. Wie gut spricht Anna Spanisch?",
    options: ["A) Sehr gut", "B) Gar nicht", "C) Ein bisschen", "D) Nur im Kurs"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Welche Frage ist eine Ja/Nein-Frage?",
    options: ["A) Du spielst Fußball.", "B) Spielen Sie Fußball?", "C) Ihr kommt aus Deutschland.", "D) Sie liest ein Buch."],
  },
  {
    stem: "2. Welche Antwort passt zu „Schwimmen Sie im Meer?“",
    options: ["A) Ja, ich schwimme im Meer.", "B) Ja, ich male ein Bild.", "C) Nein, ich höre Musik.", "D) Ja, ich spiele keinen Fußball."],
  },
  {
    stem: "3. Welche negative Antwort ist richtig?",
    options: ["A) Nein, ich schwimme keinen Meer.", "B) Nein, ich male keine Bild.", "C) Nein, ich spiele keinen Fußball.", "D) Nein, ich höre nicht keine Musik."],
  },
  {
    stem: "4. Was bedeutet „ein bisschen“?",
    options: ["A) a lot", "B) a little", "C) never", "D) every day"],
  },
  {
    stem: "5. Welche Antwort ist korrekt?",
    options: ["A) Ja, aber nur ein bisschen.", "B) Ja, aber nur keine.", "C) Ja, ich sprechen Deutsch.", "D) Ja, ich bin bisschen."],
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
      }}
    >
      {children}
    </button>
  );
}

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

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

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => {
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 6 Workbook · Family and Hobbies</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Interactive self-practice workbook for family vocabulary, simple personal writing, hobbies, languages, and Ja/Nein-
          Fragen.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}. Complete the workbook here, then submit final answers in the submission area,
          not directly on this page.
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

          <h2 style={sectionTitle}>Teil 1 · Sprechen · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Practice introducing yourself and talking about your family, your hobby, and the languages you speak. Use the
            vocabulary lists first, then answer the speaking prompts with a partner or in class.
          </p>

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

          <div style={infoBoxStyle}>
            <strong>Common Hobbies</strong>
            <div style={{ display: "grid", gap: 6 }}>
              {hobbies.map(([german, english]) => (
                <div key={german}>
                  {german} – {english}
                </div>
              ))}
            </div>
          </div>

          <div style={questionCardStyle}>
            <strong>Useful example sentences</strong>
            <ul style={listStyle}>
              <li>Ich lese gern. – I like to read.</li>
              <li>Er schwimmt gern. – He likes to swim.</li>
              <li>Wir spielen gern Fußball. – We like to play football.</li>
              <li>Sie malt gern. – She likes to paint.</li>
              <li>Sie hören gern Musik. – They like to listen to music.</li>
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
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use one of these tools before class to practise your answers aloud:</p>
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

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is for guided speaking practice only. Your written assignment work starts in Teil 2, Teil 3, and Teil 4.
          </p>

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
            Use the template below to write a short paragraph about yourself and your family. Write in complete sentences.
          </p>

          <div style={warningBoxStyle}>
            <strong>Writing practice support</strong>
            <p style={{ margin: 0 }}>
              Before you submit, you can draft and improve your text in the writing area. The Ideas Generator can help you build
              simple A1 sentences.
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
            <strong>How to use “ein bisschen” in German</strong>
            <p style={{ margin: 0 }}>
              “Ein bisschen” means “a little” or “a bit”. Use it when you want to say that you do something or have something,
              but only a little.
            </p>
            <ul style={listStyle}>
              <li>Ich spreche ein bisschen Deutsch.</li>
              <li>Kannst du Englisch? — Ja, aber nur ein bisschen.</li>
              <li>Ich habe nur ein bisschen Zeit.</li>
              <li>Möchtest du mehr Wasser? — Nur ein bisschen, bitte.</li>
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
            <strong>Write this model paragraph in your notebook, then write your own version:</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Mein Name ist Anna. Ich komme aus Deutschland. Ich bin 20 Jahre alt. Mein Vater heißt Peter. Meine Mutter heißt
              Maria. Ich bin ledig. Ich habe keine Kinder. Mein Hobby ist Lesen. Ich spreche Deutsch und Englisch. Ich spreche
              auch ein bisschen Spanisch.
            </p>
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
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Read the text carefully. Then choose the correct answer for each question.
          </p>

          <div style={infoBoxStyle}>
            <strong>Reading text</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Mein Name ist Anna. Ich komme aus Deutschland und ich bin 20 Jahre alt. Mein Vater heißt Peter und meine Mutter
              heißt Maria. Ich habe einen Bruder und eine Schwester. Ich bin ledig und ich habe keine Kinder. Mein Hobby ist
              Lesen, aber ich höre auch gern Musik. Ich spreche Deutsch und Englisch. Ich spreche auch ein bisschen Spanisch.
            </p>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {readingQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <div key={option}>{option}</div>
                ))}
              </div>
            ))}
          </div>

          <div style={answerCardStyle}>
            <strong>Answer key for self-check</strong>
            <div>1. B</div>
            <div>2. B</div>
            <div>3. C</div>
            <div>4. A</div>
            <div>5. C</div>
            <div>6. A</div>
            <div>7. C</div>
          </div>

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
            Watch the recommended lesson video and listen for yes/no questions, hobbies, and simple answers. Then complete the
            listening task below.
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

          <div style={{ display: "grid", gap: 12 }}>
            {hoerenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <div key={option}>{option}</div>
                ))}
              </div>
            ))}
          </div>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode: show transcript and answers
          </label>

          {teacherMode ? (
            <div style={successBoxStyle}>
              <strong>Transcript and model answers</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                In German, yes or no questions begin with the verb: <em>Lernst du Deutsch?</em>, <em>Spielt er Fußball?</em>,
                <em> Liest sie ein Buch?</em>, <em>Kommt ihr aus Deutschland?</em>
              </p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Model answers: <strong>Schwimmen Sie im Meer?</strong> — Ja, ich schwimme im Meer. / Nein, ich schwimme nicht im
                Meer. <strong>Spielen Sie Fußball?</strong> — Ja, ich spiele Fußball. / Nein, ich spiele keinen Fußball.
                <strong> Malen Sie ein Bild?</strong> — Ja, ich male ein Bild. / Nein, ich male kein Bild. <strong>Hören Sie Musik?</strong>
                — Ja, ich höre Musik. / Nein, ich höre keine Musik.
              </p>
              <div>Answer key: 1. B · 2. A · 3. C · 4. B · 5. A</div>
            </div>
          ) : null}

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A1Day6FamilyAndHobbiesWorkbookPage;
