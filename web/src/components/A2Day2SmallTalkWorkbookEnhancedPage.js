import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Wo arbeitet Lisa?",
    options: ["A) In einem Büro", "B) In einem Café", "C) In einer Schule", "D) In einem Krankenhaus"],
  },
  {
    stem: "Warum liebt Lisa ihren Beruf?",
    options: [
      "A) Weil sie gerne reist",
      "B) Weil sie gerne mit Kindern arbeitet",
      "C) Weil sie Tennis mag",
      "D) Weil sie gerne im Büro arbeitet",
    ],
  },
  {
    stem: "Wo arbeitet die erzählende Person?",
    options: ["A) In einem Büro", "B) In einer Schule", "C) In einem Café", "D) In einem Krankenhaus"],
  },
  {
    stem: "Welchen Sport mag Lisa?",
    options: ["A) Fußball", "B) Tennis", "C) Schwimmen", "D) Volleyball"],
  },
  {
    stem: "Wie war das Wetter gestern?",
    options: ["A) Regnerisch", "B) Sonnig und warm", "C) Kalt", "D) Windig"],
  },
  {
    stem: "In welchen Ländern war Lisa schon?",
    options: ["A) Frankreich/Deutschland", "B) Italien/Spanien", "C) Österreich/Schweiz", "D) Griechenland/Kroatien"],
  },
  {
    stem: "Warum mag die erzählende Person den Herbst?",
    options: ["A) Weil es sonnig ist", "B) Weil es warm ist", "C) Weil die Bäume bunt sind", "D) Weil sie gern Tennis spielt"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was hat Lena am Samstag vor?",
    options: ["A) Spazieren mit Freundin", "B) Ins Kino gehen", "C) Tennis spielen", "D) Spaziergang im Park"],
  },
  {
    stem: "Warum freut sich Lena auf den Actionfilm?",
    options: ["A) Sie liebt spannende Geschichten", "B) Sie mag Comedy", "C) Sie hat ihn schon gesehen", "D) Sie liebt Horror"],
  },
  {
    stem: "Welche Sportart betreibt Lena regelmäßig?",
    options: ["A) Tennis", "B) Schwimmen", "C) Laufen", "D) Yoga"],
  },
  {
    stem: "Wie war das Wetter am letzten Wochenende?",
    options: ["A) Regnerisch/kühl", "B) Sonnig/warm", "C) Bewölkt/windig", "D) Kalt/frostig"],
  },
  {
    stem: "Was schlägt Lena für das nächste Treffen vor?",
    options: ["A) Ins Kino", "B) Tennis", "C) Spaziergang", "D) Kaffee trinken"],
  },
];

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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const A2Day2SmallTalkWorkbookEnhancedPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 2 Workbook · Small Talk</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading and listening practice.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80"
            alt="Students practicing conversation in a classroom"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we engage in group exercises about <strong>Small Talk</strong>. First, prepare by reading ideas and
            key phrases on your own. In class, use the discussion questions, mini presentation and keywords.
          </p>

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
                <li>
                  <strong>Arbeit (Work)</strong>: Wo arbeitest du? • Ich arbeite in einem Büro. • Was machst du beruflich? • Ich
                  bin Lehrer.
                </li>
                <li>
                  <strong>Sport und Hobbys</strong>: Machst du gerne Sport? • Ja, ich spiele gern Fußball. • Hast du ein Hobby? •
                  Ich lese gern Bücher.
                </li>
                <li>
                  <strong>Familie</strong>: Hast du Geschwister? • Ja, ich habe eine Schwester. • Wie heißt dein Bruder? • Er
                  heißt Max.
                </li>
                <li>
                  <strong>Wetter</strong>: Wie ist das Wetter heute? • Es ist sonnig und warm. • Magst du den Sommer? • Ja, ich
                  liebe den Sommer.
                </li>
              </ol>
            </li>
          </ul>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese Struktur für starke Sprechpunkte:{" "}
            <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#374151" }}>
            <strong>Wichtig für Day 2:</strong> Heute bleiben wir bewusst bei einfachen Verbindungswörtern. Nutze zuerst{" "}
            <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>. Das reicht für eine starke
            A2-Leistung.
          </p>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>1) Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über das Thema Small Talk.“</li>
                <li>„In meiner kurzen Präsentation geht es um Gespräche im Alltag.“</li>
                <li>„Ich finde Small Talk wichtig, weil man schnell Kontakt machen kann.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>2) Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li>
                  <strong>Zuerst</strong>, <strong>dann</strong>, <strong>danach</strong>, <strong>am Ende</strong>
                </li>
                <li>
                  <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>
                </li>
                <li>
                  <strong>aber</strong>, <strong>zum Beispiel</strong>
                </li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>3) Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich denke: …“</li>
                <li>„Ich finde … gut/wichtig.“</li>
                <li>„Für mich ist … wichtig, weil …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>4) Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zusammenfassend kann man sagen, dass …“</li>
                <li>„Zum Schluss möchte ich betonen, dass …“</li>
                <li>„Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>

          <h3 style={sectionTitle}>Diskussionsfragen (A2)</h3>
          <p style={{ margin: 0 }}>Kannst du dich vorstellen? Erzähl uns etwas über dich:</p>
          <ul style={listSpacing}>
            <li>Familie</li>
            <li>Sprachen</li>
            <li>Beruf/Studium</li>
            <li>Hobbys</li>
          </ul>

          <SpeakingPracticeTimerCard />

          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über Small Talk im Alltag. <strong>Zuerst</strong> begrüße ich die Person und frage: ‚Wie geht es
              dir?‘ <strong>Dann</strong> spreche ich über einfache Themen wie Arbeit, Hobbys oder das Wetter.{" "}
              <strong>Zum Beispiel</strong> sage ich: ‚Ich spiele gern Fußball, <strong>und</strong> du?‘ <strong>Ich finde</strong> Small
              Talk wichtig, <strong>weil</strong> man neue Leute besser kennenlernen kann. <strong>Deshalb</strong> ist Small Talk
              einfach, freundlich und sehr nützlich.“
            </p>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <CourseInlinePracticePanel
            type="speaking"
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing notes in a workbook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Anleitung:</strong> Schreibe einen Brief an deinen Freund Felix.
          </p>
          <p style={{ margin: 0 }}>In deinem Brief möchtest du über deine Arbeit und Familie sprechen.</p>
          <p style={{ margin: 0 }}>Dein Brief soll folgende Punkte enthalten:</p>
          <ol style={listSpacing}>
            <li>Warum schreibst du?</li>
            <li>Erzähle Felix etwas über deine Arbeit und deine Familie.</li>
            <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
            alt="Open book and reading glasses on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
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

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones and audio setup for listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a
              href="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open Teil 4 audio
            </a>
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/r-DuOo0vrqc" target="_blank" rel="noreferrer">
              How do you make SMALL TALK in German?
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/r-DuOo0vrqc"
            title="How do you make SMALL TALK in German?"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day2SmallTalkWorkbookEnhancedPage;
