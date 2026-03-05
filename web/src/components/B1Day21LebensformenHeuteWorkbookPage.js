import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
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

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Warum ging Frau Müller ins Ausland?",
    options: [
      "a) Sie wollte Urlaub machen.",
      "b) Sie wollte Auslandserfahrung sammeln.",
      "c) Sie wollte ihre Eltern besuchen.",
      "d) Sie wollte einen Mann kennenlernen.",
    ],
  },
  {
    stem: "In welchem Land sammelte Frau Müller Auslandserfahrungen?",
    options: ["a) Niederlande", "b) Hessen", "c) Nordrhein-Westfalen", "d) Österreich"],
  },
  {
    stem: "Hat Frau Müller Kinder?",
    options: [
      "a) Ja, einen Sohn und eine Tochter.",
      "b) Nein.",
      "c) Ja, einen Sohn.",
      "d) Ja, zwei Söhne.",
    ],
  },
  {
    stem: "Hat Frau Müller Geschwister?",
    options: ["a) Nein.", "b) Ja, zwei Brüder.", "c) Das steht nicht im Text.", "d) Ja, fünf Geschwister."],
  },
  {
    stem: "Warum möchte Frau Müller wieder nach Nordrhein-Westfalen umziehen?",
    options: [
      "a) Weil ihr Mann aus Nordrhein-Westfalen ist.",
      "b) Weil sie arbeitslos ist.",
      "c) Weil ihre Eltern dort wohnen.",
      "d) Weil ihre Geschwister dort wohnen.",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Frage 1 (aus dem Video): Welche Aussage passt am besten zum Hörtext?",
    options: ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
  },
  {
    stem: "Frage 2 (aus dem Video): Welche Antwort ist richtig?",
    options: ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
  },
  {
    stem: "Frage 3 (aus dem Video): Welche Information wird genannt?",
    options: ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
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

const B1Day21LebensformenHeuteWorkbookPage = () => {
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
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 21 Workbook · Lebensformen heute</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 7.21 · Lebensformen, Familie und Wohngemeinschaften beschreiben.</p>

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

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80"
            alt="Friends and family sharing a meal together"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>1. Zentrales Thema (Central Topic)</h3>
          <p style={{ margin: 0 }}>
            <strong>Lebensformen heute</strong> (Modern lifestyles)
          </p>

          <h3 style={sectionTitle}>2. Hauptäste (Main Branches)</h3>
          <ol style={listSpacing}>
            <li>Familie (Family)</li>
            <li>Wohngemeinschaft (WG) (Shared living)</li>
            <li>Singleleben (Single life)</li>
            <li>Neue Lebensformen (New lifestyles)</li>
            <li>Vor- und Nachteile (Pros and cons)</li>
          </ol>

          <h3 style={sectionTitle}>3. Unteräste (Sub-Branches)</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Familie</strong>
              <ul style={listSpacing}>
                <li>Traditionelle Familie (Traditional family)</li>
                <li>Alleinerziehende Eltern (Single parents)</li>
                <li>Patchworkfamilien (Blended families)</li>
                <li>Rollenverteilung (Division of roles)</li>
              </ul>
            </li>
            <li>
              <strong>Wohngemeinschaft (WG)</strong>
              <ul style={listSpacing}>
                <li>Studenten-WG (Student shared apartment)</li>
                <li>Vorteile: geteilte Kosten, Gemeinschaft (Shared costs, social contact)</li>
                <li>Herausforderungen: Privatsphäre, Konflikte (Privacy, conflicts)</li>
                <li>Organisation im Alltag (Everyday organization)</li>
              </ul>
            </li>
            <li>
              <strong>Singleleben</strong>
              <ul style={listSpacing}>
                <li>Unabhängigkeit (Independence)</li>
                <li>Selbstverwirklichung (Self-realization)</li>
                <li>Einsamkeit (Loneliness)</li>
                <li>Flexible Lebensgestaltung (Flexible lifestyle)</li>
              </ul>
            </li>
            <li>
              <strong>Neue Lebensformen</strong>
              <ul style={listSpacing}>
                <li>Gleichgeschlechtliche Partnerschaften (Same-sex partnerships)</li>
                <li>Fernbeziehungen (Long-distance relationships)</li>
                <li>Wohnen auf Zeit (Temporary living)</li>
                <li>Co-Parenting (Shared parenting without romantic relationship)</li>
              </ul>
            </li>
            <li>
              <strong>Vor- und Nachteile</strong>
              <ul style={listSpacing}>
                <li>Familie: Geborgenheit vs. Verantwortung (Security vs. responsibility)</li>
                <li>WG: Soziale Kontakte vs. Kompromisse (Social contact vs. compromise)</li>
                <li>Singleleben: Freiheit vs. Einsamkeit (Freedom vs. loneliness)</li>
                <li>Neue Formen: Flexibilität vs. Unsicherheit (Flexibility vs. uncertainty)</li>
              </ul>
            </li>
          </ol>

          <p style={{ margin: 0 }}>
            <strong>Hauptfrage:</strong> Welche Lebensform findest du am besten – Familie, Wohngemeinschaft oder Singleleben? Warum?
          </p>
          <p style={{ margin: 0 }}>
            <strong>Anweisung:</strong>
          </p>
          <ul style={listSpacing}>
            <li>Beschreiben Sie mehrere Lebensformen.</li>
            <li>Nennen Sie Vor- und Nachteile und bewerten Sie diese.</li>
            <li>
              Beschreiben Sie eine Lebensform genauer und erklären Sie, warum sie gut (oder nicht gut) zu Ihnen passt.
            </li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and Teil 4.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Workbook writing practice on modern lifestyles"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben)</h2>
          <p style={{ margin: 0 }}>
            <strong>
              „Welche Lebensform ist heute am besten – Familie, Wohngemeinschaft oder Singleleben? Schreiben Sie Ihre Meinung.“
            </strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Mara: Heute gibt es viele verschiedene Lebensformen, und jede hat ihre Vorteile. Ich finde, dass die beste
            Lebensform von der persönlichen Situation abhängt. In einer Familie hat man oft viel Unterstützung und Nähe. In
            einer Wohngemeinschaft lebt man mit anderen zusammen und kann Kosten teilen. Das Singleleben bietet dagegen viel
            Freiheit und Unabhängigkeit. Dennoch kann es manchmal auch einsam sein. Ich denke, dass jeder selbst entscheiden
            sollte, welche Lebensform am besten zu ihm passt. Was denken Sie darüber?
          </p>
          <p style={{ margin: 0 }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page:{" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>{" "}
            (you can use the Ideas Generator there for support).
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Person reading a German comprehension text"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Mein Name ist Andrea Müller und meine Familie lebt nicht gemeinsam an einem Ort, sondern ist über mehrere
            Bundesländer innerhalb Deutschlands verstreut. Ursprünglich komme ich aus Nordrhein-Westfalen und habe in Köln
            studiert. Nach Abschluss des Studiums fand ich jedoch nicht gleich eine Arbeit, die mir zusagte und so entschied
            ich mich, zunächst einmal ins Ausland zu gehen und Erfahrungen zu sammeln.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ich lebte zwei Jahre lang in den Niederlanden, wo es mir sehr gut gefiel und ich sowohl meine Englischkenntnisse
            verbessern, als auch die niederländische Sprache als neue Fremdsprache hinzulernen konnte. Mit dieser
            internationalen Berufserfahrung und den erweiterten Sprachkenntnissen fand ich eine Anstellung in Hessen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Dort lernte ich auch meinen Mann kennen, der ursprünglich aus Bayern stammt. Wir heirateten und bekamen zwei
            Söhne. In Hessen haben wir uns inzwischen einen größeren Kreis an Freunden und Bekannten aufgebaut, unsere
            Familien leben jedoch noch immer größtenteils in Nordrhein-Westfalen und Bayern. Hinzu kommt, dass meine fünf
            Geschwister ebenfalls nicht in Nordrhein-Westfalen sesshaft geworden sind, sondern über die gesamte Bundesrepublik
            Deutschland verstreut leben.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nur bei größeren Familienfesten und Geburtstagen sehen wir uns alle. Ich würde sehr gern in der Nähe meiner Eltern
            leben, da diese mittlerweile auch ziemlich alt sind und sicherlich bald Unterstützung benötigen. Auch unsere Kinder
            vermissen die Großeltern und Verwandten oft.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Unsere mittelfristige Perspektive ist es daher, für meinen Mann und mich in der nächsten Zeit Arbeitsstellen und
            ein Haus in Nordrhein-Westfalen zu finden.
          </p>

          <h3 style={sectionTitle}>Fragen mit Antwortmöglichkeiten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                {index + 1}. {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80"
            alt="Audio listening setup with headphones"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Please note that this is a Goethe-standard Hören test and the answers are already provided in the YouTube video.
            You are responsible for checking your own answers. The only parts that will be officially evaluated by the school
            are Lesen and Schreiben. You must mark your own Hören results.
          </p>
          <p style={{ margin: 0 }}>
            This process requires a lot of motivation and self-discipline to be effective. Submit your responses in the
            assignment area, not directly on this page.
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript guidance)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Teacher support note</strong>
              <p style={{ margin: 0 }}>
                The official answer walkthrough is included in the recommended YouTube test video. Use it after learners finish
                their first attempt so they can self-check independently.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Practice question format</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                {index + 1}. {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X" target="_blank" rel="noreferrer">
              Goethe-standard Hören test (with answer review)
            </a>
          </p>

          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/iyydRu3oY4I"
            title="Goethe-standard Hören test"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day21LebensformenHeuteWorkbookPage;
