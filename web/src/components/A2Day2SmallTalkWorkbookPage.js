import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const lesenQuestions = [
  {
    prompt: "Wo arbeitet Lisa?",
    options: ["In einem Büro", "In einem Café", "In einer Schule", "In einem Krankenhaus"],
  },
  {
    prompt: "Warum liebt Lisa ihren Beruf?",
    options: [
      "Weil sie gerne reist",
      "Weil sie gerne mit Kindern arbeitet",
      "Weil sie Tennis mag",
      "Weil sie gerne im Büro arbeitet",
    ],
  },
  {
    prompt: "Wo arbeitet die erzählende Person?",
    options: ["In einem Büro", "In einer Schule", "In einem Café", "In einem Krankenhaus"],
  },
  {
    prompt: "Welchen Sport mag Lisa?",
    options: ["Fußball", "Tennis", "Schwimmen", "Volleyball"],
  },
  {
    prompt: "Wie war das Wetter gestern?",
    options: ["Es war regnerisch", "Es war sonnig und warm", "Es war kalt", "Es war windig"],
  },
  {
    prompt: "In welchen Ländern war Lisa schon?",
    options: ["Frankreich und Deutschland", "Italien und Spanien", "Österreich und Schweiz", "Griechenland und Kroatien"],
  },
  {
    prompt: "Warum mag die erzählende Person den Herbst?",
    options: [
      "Weil es sonnig ist",
      "Weil es warm ist",
      "Weil die Bäume so schön bunt sind",
      "Weil sie gerne Tennis spielt",
    ],
  },
];

const hoerenQuestions = [
  {
    prompt: "Was hat Lena am Samstag vor?",
    options: ["Mit ihrer Freundin spazieren gehen", "Ins Kino gehen", "Tennis spielen", "Einen Spaziergang im Park machen"],
  },
  {
    prompt: "Warum freut sich Lena auf den Actionfilm?",
    options: [
      "Weil sie spannende Geschichten liebt",
      "Weil sie Comedy-Filme mag",
      "Weil sie den Film schon gesehen hat",
      "Weil sie Horrorfilme liebt",
    ],
  },
  {
    prompt: "Welche Sportart betreibt Lena regelmäßig?",
    options: ["Tennis", "Schwimmen", "Laufen", "Yoga"],
  },
  {
    prompt: "Wie war das Wetter am letzten Wochenende?",
    options: ["Es war regnerisch und kühl", "Es war sonnig und warm", "Es war bewölkt und windig", "Es war kalt und frostig"],
  },
  {
    prompt: "Was schlägt Lena für das nächste Treffen vor?",
    options: ["Ins Kino gehen", "Gemeinsam Tennis spielen", "Einen Spaziergang machen", "Kaffee trinken gehen"],
  },
];

const tabImages = {
  sprechen:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
  schreiben:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
  lesen:
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80",
  hoeren:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
};

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const quizCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#f9fafb",
  padding: 12,
  display: "grid",
  gap: 8,
};
const infoBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  background: "#eff6ff",
  padding: 12,
};
const tabImageStyle = {
  width: "100%",
  maxHeight: 240,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

function TabButton({ active, onClick, children }) {
  return (
    <button
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

function QuestionCard({ index, question }) {
  return (
    <div style={quizCard}>
      <p style={{ margin: 0, fontWeight: 700 }}>{index}. {question.prompt}</p>
      <ul style={{ ...listSpacing, marginTop: 0 }}>
        {question.options.map((option, optionIndex) => (
          <li key={`${question.prompt}-${option}`}>
            <strong>{String.fromCharCode(65 + optionIndex)}.</strong> {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

const A2Day2SmallTalkWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
  const [preparedTabs, setPreparedTabs] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 2 Workbook · Small Talk</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook for class preparation: Sprechen, Schreiben, Lesen und Hören.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input type="checkbox" checked={teacherMode} onChange={(e) => setTeacherMode(e.target.checked)} />
          Teacher mode (show optional transcript support in Teil 4)
        </label>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <img src={tabImages.sprechen} alt="People having a small talk conversation" style={tabImageStyle} loading="lazy" />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, you prepare before class by reading key ideas and language support. In class, you will discuss the
            topics in groups and do a short presentation with keywords.
          </p>
          <div style={infoBox}>
            <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Speaking Confidence Practice</h3>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Use this self-practice speaking tool before class to build confidence:
            </p>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.primaryButton, width: "fit-content", marginTop: 8 }}
            >
              Open speaking self-practice
            </a>
          </div>

          <h3 style={sectionTitle}>Zentrales Thema: Small Talk</h3>
          <ul style={listSpacing}>
            <li>
              <strong>Begrüßung und Einstieg</strong>
              <ul style={listSpacing}>
                <li>Hallo, wie geht es dir? (Hello, how are you?)</li>
                <li>Woher kommst du? (Where are you from?)</li>
                <li>Schön, dich kennenzulernen. (Nice to meet you.)</li>
              </ul>
            </li>
            <li>
              <strong>Themen für Small Talk</strong>
              <ol style={listSpacing}>
                <li><strong>Arbeit:</strong> Wo arbeitest du? · Was machst du beruflich?</li>
                <li><strong>Sport und Hobbys:</strong> Machst du gerne Sport? · Hast du ein Hobby?</li>
                <li><strong>Familie:</strong> Hast du Geschwister? · Wie heißt dein Bruder?</li>
                <li><strong>Wetter:</strong> Wie ist das Wetter heute? · Magst du den Sommer?</li>
                <li><strong>Reisen:</strong> Warst du schon mal im Ausland? · Wohin möchtest du reisen?</li>
              </ol>
            </li>
            <li>
              <strong>Höfliche Ausdrücke:</strong> Könntest du das bitte wiederholen? · Das klingt interessant! · Entschuldigung,
              ich habe dich nicht verstanden.
            </li>
            <li>
              <strong>Gespräch beenden:</strong> Es war schön, mit dir zu sprechen. · Ich wünsche dir einen schönen Tag! · Bis
              bald!
            </li>
          </ul>

          <div style={infoBox}>
            <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Presentation Keywords (Schnellhilfe)</h3>
            <p style={{ margin: 0 }}>
              Begrüßung · Arbeit · Freizeit · Familie · Wetter · Reisen · höflich reagieren · Gespräch freundlich beenden
            </p>
          </div>

          <h3 style={sectionTitle}>Sprachliche Hilfen</h3>
          <ul style={listSpacing}>
            <li><strong>Einleitung:</strong> „Small Talk ist eine gute Möglichkeit, um neue Leute kennenzulernen.“</li>
            <li><strong>Einleitung:</strong> „Ich finde, dass Small Talk wichtig im Alltag ist.“</li>
            <li><strong>Hauptteil:</strong> „Ein gutes Thema für Small Talk ist die Arbeit, weil ...“</li>
            <li><strong>Hauptteil:</strong> „Man kann auch über das Wetter oder Hobbys sprechen, zum Beispiel ...“</li>
            <li><strong>Hauptteil:</strong> „Ein Vorteil von Small Talk ist, dass ...“</li>
            <li><strong>Schluss:</strong> „Zusammenfassend kann man sagen, dass Small Talk einfach und nützlich ist.“</li>
          </ul>

          <h3 style={sectionTitle}>Diskussionsfragen (A2)</h3>
          <p style={{ margin: 0 }}>Kannst du dich vorstellen? Erzähl uns etwas über dich:</p>
          <ul style={listSpacing}>
            <li>Familie</li>
            <li>Sprachen</li>
            <li>Beruf/Studium</li>
            <li>Hobbys</li>
          </ul>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={preparedTabs.sprechen}
              onChange={(e) => setPreparedTabs((prev) => ({ ...prev, sprechen: e.target.checked }))}
            />
            I prepared this part.
          </label>
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img src={tabImages.schreiben} alt="Person writing notes in a notebook" style={tabImageStyle} loading="lazy" />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Anleitung:</strong> Schreibe einen Brief an deinen Freund Felix.</p>
          <p style={{ margin: 0 }}>In deinem Brief möchtest du über deine Arbeit und Familie sprechen.</p>
          <p style={{ margin: 0 }}>Dein Brief soll folgende Punkte enthalten:</p>
          <ol style={listSpacing}>
            <li>Warum schreibst du?</li>
            <li>Erzähle Felix etwas über deine Arbeit und deine Familie.</li>
            <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Schreibe zuerst deinen Entwurf. Sende dann deine finale Antwort im Submission-Bereich wie gewohnt.
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={preparedTabs.schreiben}
              onChange={(e) => setPreparedTabs((prev) => ({ ...prev, schreiben: e.target.checked }))}
            />
            I prepared this part.
          </label>
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img src={tabImages.lesen} alt="Books and reading workspace" style={tabImageStyle} loading="lazy" />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Lies den Text und bearbeite die Fragen. <strong>Bitte beantworte die Fragen nicht direkt auf dieser Seite.</strong>
            Nutze unten den Submit-Bereich für deine endgültigen Antworten.
          </p>

          <h3 style={sectionTitle}>Mein Gespräch mit Lisa</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Gestern habe ich Lisa im Café getroffen. Sie arbeitet in einer Schule und unterrichtet Kinder. Wir haben über
            unsere Arbeit gesprochen. Lisa sagt, dass sie ihren Beruf liebt, weil sie gerne mit Kindern arbeitet. Ich habe ihr
            erzählt, dass ich in einem Büro arbeite. Dann haben wir über Sport gesprochen. Lisa spielt gern Tennis, aber ich
            mag Fußball mehr. Wir haben auch über das Wetter geredet. Es war gestern sonnig und warm, und Lisa liebt den
            Sommer. Ich habe ihr erzählt, dass ich lieber den Herbst mag, weil die Bäume so schön bunt sind. Zum Schluss haben
            wir über Reisen gesprochen. Lisa war schon in Italien und Spanien. Sie möchte nächstes Jahr nach Frankreich reisen.
            Ich war noch nie in Spanien, aber ich würde gerne dorthin reisen. Es war ein sehr nettes Gespräch, und wir haben
            viel gelacht!
          </p>

          <h3 style={sectionTitle}>Fragen (Multiple Choice)</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {lesenQuestions.map((question, index) => (
              <QuestionCard key={question.prompt} index={index + 1} question={question} />
            ))}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={preparedTabs.lesen}
              onChange={(e) => setPreparedTabs((prev) => ({ ...prev, lesen: e.target.checked }))}
            />
            I prepared this part.
          </label>
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img src={tabImages.hoeren} alt="Person listening to audio with headphones" style={tabImageStyle} loading="lazy" />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Höre die Audio-Datei an und beantworte anschließend die Fragen im Submission-Bereich.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <a
              href="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style={styles.primaryButton}
            >
              Open audio
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Replay reminder: Höre die Datei mindestens zweimal (1x für Überblick, 1x für Details).
          </p>

          {teacherMode ? (
            <details>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Optional transcript support (Teacher mode)</summary>
              <p style={{ marginTop: 8, lineHeight: 1.7 }}>
                Lena erzählt von ihrem Samstag. Sie möchte mit einer Freundin ins Kino gehen und freut sich auf einen
                Actionfilm. Außerdem macht sie regelmäßig Sport. Letztes Wochenende war das Wetter sonnig und warm. Für das
                nächste Treffen schlägt sie eine gemeinsame Aktivität vor.
              </p>
            </details>
          ) : null}

          <h3 style={sectionTitle}>Fragen (Multiple Choice)</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {hoerenQuestions.map((question, index) => (
              <QuestionCard key={question.prompt} index={index + 1} question={question} />
            ))}
          </div>

          <p style={{ margin: 0 }}>
            Recommended video: <a href="https://youtu.be/r-DuOo0vrqc" target="_blank" rel="noreferrer">How do you make SMALL TALK in German?</a>
          </p>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={preparedTabs.hoeren}
              onChange={(e) => setPreparedTabs((prev) => ({ ...prev, hoeren: e.target.checked }))}
            />
            I prepared this part.
          </label>
        </div>
      )}
    </div>
  );
};

export default A2Day2SmallTalkWorkbookPage;
