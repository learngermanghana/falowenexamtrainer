import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import A2ReadingTaskPanel from "./A2ReadingTaskPanel";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import A2GoetheWritingTaskCard from "./A2GoetheWritingTaskCard";
import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

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

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const lesenQuestions = [
  {
    stem: "Was lernt man in den ersten Tagen am neuen Arbeitsplatz kennen?",
    options: ["A) Die Feiertage und die Nachbarn", "B) Die Kollegen und die Arbeit", "C) Nur die Hausordnung", "D) Die Deutschprüfung"],
  },
  {
    stem: "Wie spricht man in Deutschland meist mit dem Chef?",
    options: ["A) Mit Vornamen und ‚du‘", "B) Mit Spitznamen", "C) Mit ‚Sie‘", "D) Man spricht nicht mit dem Chef"],
  },
  {
    stem: "Was ist der Betriebsrat?",
    options: ["A) Ein Trainingszentrum", "B) Eine Sicherheitsfirma", "C) Eine Arbeitnehmervertretung", "D) Der Chef"],
  },
  {
    stem: "Was gehört zum Arbeitnehmerschutz?",
    options: ["A) Gratis Urlaub in Spanien", "B) Neue Kleidung jeden Tag", "C) Arbeitskleidung, Pausen und feste Arbeitszeiten", "D) Kostenloses Frühstück"],
  },
  {
    stem: "Was bedeutet Gleitzeit?",
    options: ["A) Man arbeitet immer nachts", "B) Man arbeitet immer am Wochenende", "C) Man kann Arbeitsbeginn und -ende flexibel wählen", "D) Man arbeitet von zu Hause"],
  },
  {
    stem: "Wie viele Stunden arbeitet man in der Regel pro Woche in Vollzeit?",
    options: ["A) 20–25 Stunden", "B) 30–35 Stunden", "C) 38–40 Stunden", "D) Über 50 Stunden"],
  },
  {
    stem: "Was muss man machen, wenn man Urlaub möchte?",
    options: ["A) Einfach zu Hause bleiben", "B) Den Urlaub eintragen und genehmigen lassen", "C) Den Chef anrufen", "D) Eine Reise buchen"],
  },
  {
    stem: "Was bekommt man im Urlaub?",
    options: ["A) Nichts", "B) Halbes Gehalt", "C) Urlaubsgeld vom Staat", "D) Weiter das Gehalt oder den Lohn"],
  },
  {
    stem: "Was macht man bei Krankheit?",
    options: ["A) Nichts", "B) Urlaub nehmen", "C) Sofort den Arbeitgeber informieren und zum Arzt gehen", "D) Einfach zu Hause bleiben"],
  },
  {
    stem: "In welchen Berufen trägt man oft spezielle Kleidung?",
    options: ["A) Im Büro", "B) Als Lehrer", "C) Auf der Baustelle oder am Flughafen", "D) Als Koch zu Hause"],
  },
  {
    stem: "Was muss man bei einer Kündigung beachten?",
    options: ["A) Den Arbeitgeber ignorieren", "B) Die Kündigung mündlich machen", "C) Die Kündigung schriftlich und mit Frist einreichen", "D) Eine WhatsApp schreiben"],
  },
  {
    stem: "Wo kann man sich gut weiterbilden?",
    options: ["A) In der Kneipe", "B) Bei der Polizei", "C) In der Volkshochschule", "D) Im Park"],
  },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const A2Day14BerufUndKarriereWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 14 Workbook · Beruf und Karriere</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Grammar, Teil 1–3, Ref or Submit below. This 5.14 workbook has no Teil 4 Hören assignment.
        </p>

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            padding: 10,
            margin: "0 -4px",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            background: "rgba(255,255,255,0.98)",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          }}
        >
          <WorkbookTabNav
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={STANDARD_WORKBOOK_TABS}
            ariaLabel="A2 Day 14 workbook sections"
            renderLegacyGrammarPanel={false}
          />
        </div>
      </div>

      {activeTab === "grammar" && (
        <div style={card}>
          <A2B1GrammarNotesTab level="A2" day={14} />
        </div>
      )}

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
            alt="Professionals discussing career plans in an office meeting"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Prepare one clear 30–45 second career story. The mind map contains the complete task: open each branch,
            practise the sentence, and connect the five parts into one answer.
          </p>
          <SpeakingMindMap config={getA2SpeakingMindMap(14)} />
          <SpeakingPracticeTimerCard />
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Writing a formal career-related letter"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <A2GoetheWritingTaskCard day={14} />

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <A2ReadingTaskPanel day={14} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day14BerufUndKarriere", level: "A2", day: 14, workbookId: "A2Day14BerufUndKarriere" }}
          workbookId="A2Day14BerufUndKarriere"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2 and Teil 3 only."
            submissionNote="Teil 1 is group practice only. This 5.14 workbook has no Teil 4 Hören assignment."
          >
            <ul style={listSpacing}>
              <li><strong>Teil 2 · Schreiben:</strong> submit your final formal letter.</li>
              <li><strong>Teil 3 · Lesen:</strong> submit your reading answer letters.</li>
            </ul>
          </WorkbookTaskCard>
          <WorkbookSubmissionReminder />
          <div className="a2-day14-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day14-submission-page > div > section:first-child { display: none !important; }
            .a2-day14-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 14,
                assignmentKey: "A2-5.14",
                canonicalAssignmentKey: "A2-5.14",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default A2Day14BerufUndKarriereWorkbookPage;
