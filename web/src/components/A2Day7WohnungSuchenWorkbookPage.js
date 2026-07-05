import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
  { key: "submit", label: "Submit" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const phraseCardStyle = { border: "1px solid #dbeafe", background: "#f8fbff", borderRadius: 10, padding: 12, display: "grid", gap: 8 };
const imageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };

const lesenQuestions = [
  { stem: "1. Wo findet man Wohnungsanzeigen?", options: ["a) Nur in Supermärkten", "b) In Zeitungen und im Internet", "c) Nur beim Arbeitsamt", "d) Nur in Broschüren"] },
  { stem: "2. Was ist ein Immobilienmakler?", options: ["a) Eine Person, die Möbel verkauft", "b) Eine Person, die Stromanbieter vergleicht", "c) Eine Person, die bei der Wohnungssuche hilft", "d) Ein Handwerker für Wohnungen"] },
  { stem: "3. Was gehört zur Warmmiete?", options: ["a) Nur die Kaltmiete", "b) Nur die Stromkosten", "c) Kaltmiete und Nebenkosten", "d) Nur das Internet"] },
  { stem: "4. Was ist eine Kaution?", options: ["a) Eine monatliche Rechnung", "b) Ein Betrag, den man beim Auszug zurückbekommt", "c) Eine Versicherung", "d) Ein Möbelstück vom Vormieter"] },
  { stem: "5. Was ist ein Übergabeprotokoll?", options: ["a) Ein Vertrag für den Stromanbieter", "b) Eine Liste von Nachbarn", "c) Ein Formular, das Schäden in der Wohnung zeigt", "d) Eine Quittung für die Kaution"] },
  { stem: "6. Wann ist in Deutschland Ruhezeit?", options: ["a) Nur zwischen 8–10 Uhr", "b) Von 12 bis 14 Uhr", "c) Von 22–7 Uhr und 13–15 Uhr", "d) Es gibt keine Ruhezeit"] },
  { stem: "7. Was macht man mit Glas und Dosen?", options: ["a) In die schwarze Mülltonne werfen", "b) Im Garten vergraben", "c) Zum Wertstoffcontainer bringen", "d) Im Hausflur lagern"] },
];

const hoerenQuestions = [
  { stem: "1. In welchem Stockwerk befindet sich die Wohnung?", options: ["a) Im ersten Stock", "b) Im zweiten Stock", "c) Im dritten Stock", "d) Im Erdgeschoss"] },
  { stem: "2. Wie groß ist die Wohnung?", options: ["a) 70 Quadratmeter", "b) 75 Quadratmeter", "c) 80 Quadratmeter", "d) 65 Quadratmeter"] },
  { stem: "3. Wie viele Zimmer hat die Wohnung?", options: ["a) Zwei", "b) Drei", "c) Vier", "d) Fünf"] },
  { stem: "4. Was gehört zur Wohnung?", options: ["a) Ein Balkon", "b) Ein Garten", "c) Eine Garage", "d) Ein Kellerraum"] },
  { stem: "5. Wie hoch sind die Nebenkosten?", options: ["a) 100 Euro", "b) 150 Euro", "c) 200 Euro", "d) 250 Euro"] },
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
        minHeight: 44,
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

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const A2Day7WohnungSuchenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 7 Workbook · Eine Wohnung suchen (Übung) 3.7</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: group speaking, writing, reading, listening, references and direct submission.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80" alt="Students discussing apartment search ideas in class" loading="lazy" style={imageStyle} />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we practise apartment search in German.</p>
          <SpeakingMindMap config={getA2SpeakingMindMap(7)} />
          <h3 style={sectionTitle}>Important questions</h3>
          <ul style={listSpacing}>
            <li>Wie viele Zimmer hat die Wohnung?</li>
            <li>Ist die Wohnung möbliert oder unmöbliert?</li>
            <li>Wann kann ich die Wohnung besichtigen?</li>
            <li>Wie hoch ist die Miete?</li>
            <li>Gibt es öffentliche Verkehrsmittel in der Nähe?</li>
          </ul>
          <h3 style={sectionTitle}>Nützliche Ausdrücke</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>sich eine Wohnung ansehen · einen Mietvertrag unterschreiben · eine Wohnung mieten · umziehen · die Miete überweisen · die Wohnung einrichten</p>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div style={phraseCardStyle}><strong>Gute Einleitungen</strong><ul style={listSpacing}><li>Ich möchte kurz über meine Wohnungssuche sprechen.</li><li>Heute spreche ich über eine Wohnung, die ich suche.</li></ul></div>
            <div style={phraseCardStyle}><strong>Connectors</strong><ul style={listSpacing}><li>Ich suche eine Wohnung und ich brauche einen Balkon.</li><li>Ich möchte eine ruhige Wohnung, weil ich von zu Hause arbeite.</li></ul></div>
            <div style={phraseCardStyle}><strong>Eigene Meinung</strong><ul style={listSpacing}><li>Ich finde, dass die Lage sehr wichtig ist.</li><li>Für mich ist die Warmmiete wichtiger als die Wohnungsgröße.</li></ul></div>
          </div>
          <SpeakingPracticeTimerCard />
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Student writing a formal email assignment" loading="lazy" style={imageStyle} />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Formal Letter Writing Assignment: „Eine Wohnung suchen“</strong></p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter:</p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einer verfügbaren Wohnung.</li>
            <li>Geben Sie an, welche Kriterien für Sie wichtig sind, zum Beispiel Größe, Lage und Preis.</li>
            <li>Fragen Sie nach den Mietbedingungen und der Möglichkeit, die Wohnung zu besichtigen.</li>
          </ol>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing practice before submission</strong>
            <CourseInlinePracticePanel
              type="writing"
              writingContext={{
                level: "A2",
                courseLevel: "A2",
                day: 7,
                lessonId: "A2-day-7",
                workbookId: "A2Day7WohnungSuchen",
                writingTaskId: "A2Day7WohnungSuchen-teil-2-writing",
                taskTitle: "Eine Wohnung suchen",
              }}
            />
          </div>
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80" alt="Apartment interior for reading comprehension topic" loading="lazy" style={imageStyle} />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Wohnungssuche – Lesetext und Aufgaben</strong></p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Sie suchen eine Wohnung? In vielen Zeitungen sind Wohnungsanzeigen, meistens am Freitag oder Samstag. Wohnungsanzeigen findet man auch auf den Internetseiten der Zeitung. Auch das Wohnungsamt Ihrer Stadt hilft oft bei der Suche. In manchen Regionen kann ein Immobilienmakler bei der Suche helfen.</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In den Anzeigen steht meist, wie viel Miete Sie bezahlen müssen. Die Kaltmiete und die Nebenkosten zusammen heißen Warmmiete. Oft wollen Vermieter eine Kaution. Alle Informationen stehen im Mietvertrag.</p>
          <h3 style={sectionTitle}>Verstehen Sie den Text? – Beantworten Sie die Fragen</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80" alt="Person listening and reviewing apartment information" loading="lazy" style={imageStyle} />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Audio link: <a href="https://drive.google.com/file/d/1ULPeE_f3e12R4TXJaB2LE5qO7sa6vY0t/view?usp=sharing" target="_blank" rel="noreferrer">Open listening audio</a></p>
          <h3 style={sectionTitle}>Multiple-Choice-Fragen</h3>
          <QuestionList questions={hoerenQuestions} />
          <div style={questionCardStyle}>
            <strong>Vocabulary List: Wohnung suchen</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>die Wohnung, die Wohnungssuche, die Wohnungsanzeige, die Miete, die Kaltmiete, die Nebenkosten, die Warmmiete, der Vermieter, der Mieter, die Kaution, der Mietvertrag.</p>
          </div>
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Submit your required answers for A2 Day 7 here. Include your writing text and your reading/listening answer letters if required by your tutor.</p>
          <WorkbookSubmissionReminder />
          <div className="a2-day7-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day7-submission-page > div > section:first-child { display: none !important; }
            .a2-day7-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 7,
                assignmentKey: "A2-3.7",
                canonicalAssignmentKey: "A2-3.7",
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day7WohnungSuchen", level: "A2", day: 7, workbookId: "A2Day7WohnungSuchen" }} workbookId="A2Day7WohnungSuchen" />
      )}
    </div>
  );
};

export default A2Day7WohnungSuchenWorkbookPage;
