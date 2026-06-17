import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "Teil 5 · Reference Answers" },
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
    stem: "Warum ist Wasser eine kostbare Ressource?",
    options: ["A) Weil es unbegrenzt verfügbar ist.", "B) Weil es in vielen Teilen der Welt knapp ist.", "C) Weil es nicht verschmutzt werden kann."],
  },
  {
    stem: "Wofür wird in den Industrieländern besonders viel Wasser verwendet?",
    options: ["A) Nur zum Trinken und Kochen.", "B) Für die Landwirtschaft und die Industrie.", "C) Nur für die Industrie."],
  },
  {
    stem: "Welche Maßnahmen können Einzelne ergreifen, um Wasser zu sparen?",
    options: ["A) Wasser beim Zähneputzen laufen lassen.", "B) Wassersparende Geräte benutzen.", "C) Wasser nur zum Trinken verwenden."],
  },
  {
    stem: "Warum ist die Verschmutzung der Wasserressourcen ein Problem?",
    options: ["A) Weil es die Landwirtschaft unterstützt.", "B) Weil es das Trinkwasser verschmutzt.", "C) Weil es die Industrie stärkt."],
  },
  {
    stem: "Was können Regierungen tun, um den Wasserverbrauch zu regulieren?",
    options: ["A) Gesetze und Verordnungen erlassen.", "B) Mehr Wasser verbrauchen.", "C) Wasserquellen verschmutzen."],
  },
  {
    stem: "Warum ist die Aufklärung der Bevölkerung wichtig?",
    options: ["A) Damit die Industrie mehr Wasser verbraucht.", "B) Um die Bedeutung des Wassersparens zu verstehen.", "C) Um den Wasserverbrauch zu erhöhen."],
  },
  {
    stem: "Was ist die Hauptaussage des Essays?",
    options: [
      "A) Wasser ist unbegrenzt verfügbar.",
      "B) Wasser ist eine kostbare Ressource, die geschützt werden muss.",
      "C) Der Wasserverbrauch sollte nicht reguliert werden.",
    ],
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

const B1Day28KlimafreundlichLebenWorkbookPage = () => {
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
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 28 Workbook · Klimafreundlich leben</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: group speaking, writing, reading and listening practice.</p>
        <img
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80"
          alt="Wind turbines in a green field for climate-friendly living"
          loading="lazy"
          style={tabImageStyle}
        />

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
            src="https://images.unsplash.com/photo-1497436072909-f5e4be5584d2?auto=format&fit=crop&w=1600&q=80"
            alt="Friends discussing climate-friendly daily habits"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Zentrales Thema: Klimafreundlich leben – Was kann jeder Einzelne tun?</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Energie sparen:</strong>
              <ul style={listSpacing}>
                <li>Licht ausschalten</li>
                <li>Energiesparlampen benutzen</li>
                <li>Geräte nicht im Standby lassen</li>
                <li>Weniger heizen / richtig lüften</li>
              </ul>
            </li>
            <li>
              <strong>Verkehr:</strong>
              <ul style={listSpacing}>
                <li>Fahrrad statt Auto</li>
                <li>Öffentliche Verkehrsmittel</li>
                <li>Fahrgemeinschaften</li>
                <li>Weniger fliegen</li>
              </ul>
            </li>
            <li>
              <strong>Konsum:</strong>
              <ul style={listSpacing}>
                <li>Regionale Produkte kaufen</li>
                <li>Weniger Plastik</li>
                <li>Auf Verpackung achten</li>
                <li>Second-Hand-Kleidung</li>
              </ul>
            </li>
            <li>
              <strong>Ernährung:</strong>
              <ul style={listSpacing}>
                <li>Weniger Fleisch essen</li>
                <li>Bio-Produkte kaufen</li>
                <li>Keine Lebensmittel verschwenden</li>
              </ul>
            </li>
            <li>
              <strong>Recycling und Müll:</strong>
              <ul style={listSpacing}>
                <li>Müll trennen</li>
                <li>Wiederverwendbare Produkte nutzen</li>
                <li>Stofftaschen statt Plastiktüten</li>
              </ul>
            </li>
            <li>
              <strong>Bewusstsein und Bildung:</strong>
              <ul style={listSpacing}>
                <li>Andere informieren</li>
                <li>Kinder umweltbewusst erziehen</li>
                <li>Umweltprojekte unterstützen</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Thema</h3>
          <p style={{ margin: 0 }}><strong>Klimafreundlich leben – Was kann jeder Einzelne tun?</strong></p>
          <p style={{ margin: 0 }}>
            Frage: „Wie kann man in deinem Land klimafreundlich leben? Sprich über Vorteile und Nachteile und beschreibe die Situation in deinem Land.“
          </p>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and Teil 4.
          </p>

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
            alt="Student writing an opinion text about climate-friendly living"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) (Assignment)</h2>
          <p style={{ margin: 0 }}>
            Thema: <strong>Klimafreundlich leben</strong>
          </p>
          <p style={{ margin: 0 }}>
            Frage: <strong>„Kann jeder Mensch klimafreundlich leben? Schreiben Sie kurz Ihre Meinung.“</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Kurze Meinung (Beispiel):</strong> Meiner Meinung nach kann jeder Mensch klimafreundlicher leben. Man kann zum Beispiel weniger
            Plastik benutzen, Strom sparen oder öfter mit dem Fahrrad fahren. Kleine Schritte im Alltag können der Umwelt helfen.
          </p>
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
            src="https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=1600&q=80"
            alt="Glass of water and book for reading exercise"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at the bottom of
            the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Essay: Bewusst Leben: Wasser als kostbare Ressource</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Wasser ist eine der wertvollsten Ressourcen auf unserem Planeten. Ohne Wasser wäre Leben, wie wir es kennen, nicht möglich. Doch in
            vielen Teilen der Welt ist Wasser knapp, und der bewusste Umgang mit dieser Ressource wird immer wichtiger. In den letzten Jahrzehnten
            hat der Wasserverbrauch weltweit stark zugenommen. Besonders in den Industrieländern ist der Wasserverbrauch pro Kopf sehr hoch. Hier
            wird Wasser nicht nur zum Trinken und Kochen verwendet, sondern auch in großen Mengen für die Landwirtschaft und die Industrie benötigt.
            Um Wasser zu sparen, gibt es viele Maßnahmen, die jeder Einzelne ergreifen kann. Zum Beispiel sollte man darauf achten, Wasser nicht
            unnötig laufen zu lassen, etwa beim Zähneputzen oder Geschirrspülen. Auch der Einsatz von wassersparenden Geräten, wie effizienten
            Duschköpfen und Toilettenspülungen, kann den Wasserverbrauch erheblich reduzieren. Ein weiteres Problem ist die Verschmutzung der
            Wasserressourcen. Industrieabfälle, chemische Düngemittel und Plastikmüll gelangen in Flüsse und Meere und verschmutzen das
            Trinkwasser. Daher ist es wichtig, umweltfreundliche Produkte zu verwenden und Abfälle korrekt zu entsorgen. Neben den individuellen
            Maßnahmen ist auch die Politik gefragt. Regierungen können durch Gesetze und Verordnungen den Wasserverbrauch regulieren und Anreize für
            wassersparende Technologien schaffen. Auch die Aufklärung der Bevölkerung über die Bedeutung des Wassersparens spielt eine wichtige
            Rolle. Zusammenfassend lässt sich sagen, dass der bewusste Umgang mit Wasser unerlässlich ist, um diese wertvolle Ressource zu
            schützen. Jeder Einzelne kann durch kleine Maßnahmen einen Beitrag leisten, und auch die Politik muss ihren Teil dazu beitragen. Nur so
            können wir sicherstellen, dass auch zukünftige Generationen ausreichend Wasser zur Verfügung haben.
          </p>

          <h3 style={sectionTitle}>Fragen</h3>
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
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones and laptop for listening comprehension"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Audio Link – {" "}
            <a href="https://youtu.be/IGIxBJA222o?list=PLos_fDJ_B3W0jhPa-8s_100ALd-HdTcmt" target="_blank" rel="noreferrer">
              https://youtu.be/IGIxBJA222o?list=PLos_fDJ_B3W0jhPa-8s_100ALd-HdTcmt
            </a>
          </p>

          <iframe
            title="Klimafreundlich leben listening exercise"
            src="https://www.youtube.com/embed/IGIxBJA222o"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={videoPreviewStyle}
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day28KlimafreundlichLeben", level: "B1", workbookId: "B1Day28KlimafreundlichLeben" }} workbookId="B1Day28KlimafreundlichLeben" />
      )}

    </div>
  );
};

export default B1Day28KlimafreundlichLebenWorkbookPage;
