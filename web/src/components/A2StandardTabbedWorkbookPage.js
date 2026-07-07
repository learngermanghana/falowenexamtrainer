import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import SpeakingMindMap from "./SpeakingMindMap";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { styles } from "../styles";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const tabs = STANDARD_WORKBOOK_TABS;

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

const defaultImages = {
  sprechen: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80",
  schreiben: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
  lesen: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
  hoeren: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
};

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const HeroImage = ({ type, alt }) => (
  <img
    src={defaultImages[type] || defaultImages.sprechen}
    alt={alt}
    loading="lazy"
    style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
  />
);

const QuestionList = ({ questions = [] }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={`${question.stem}-${index}`} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {(question.options || []).map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const A2StandardTabbedWorkbookPage = ({
  day,
  title,
  chapter,
  topicPrompt,
  workbookId,
  schreibenTask,
  lesenText,
  lesenQuestions = [],
  hoerenTask,
  hoerenQuestions = [],
}) => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });
  const assignmentKey = `A2-${chapter}`;
  const resolvedWorkbookId = workbookId || `A2Day${day}Workbook`;

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day {day} Workbook · {title}</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4, Ref or Submit below. The tabs stay visible at the top of the workbook.
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
            tabs={tabs}
            ariaLabel={`A2 Day ${day} workbook sections`}
          />
        </div>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <HeroImage type="sprechen" alt="Students speaking together during German class" />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(day)} />
          <WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly>
            <p style={{ margin: 0 }}>
              Prepare a short A2 answer. Use a simple structure: Einleitung → 2–3 details → example → short ending.
            </p>
            <ul style={listSpacing}>
              <li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li>
              <li>Speak clearly for 30–60 seconds.</li>
              <li>This part is practice only; submit required final answers in the Submit tab.</li>
            </ul>
          </WorkbookTaskCard>
          <SpeakingPracticeTimerCard />
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <HeroImage type="schreiben" alt="Learner writing a German workbook answer" />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Writing task" title="Write your final text">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              {schreibenTask || "Write a short A2 email or message about the lesson topic. Include greeting, reason, two clear details and a closing."}
            </p>
            <p style={{ margin: 0, color: "#4b5563" }}>
              Submit your final writing through the Submit tab on this workbook.
            </p>
          </WorkbookTaskCard>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <HeroImage type="lesen" alt="German reading practice text on a desk" />
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Submit answers through the Submit tab.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            {lesenText || "Read a short A2 text about the lesson topic. Identify the main idea, important details and the correct answer letters."}
          </p>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <HeroImage type="hoeren" alt="Headphones ready for German listening practice" />
          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            {hoerenTask || "Listen to the lesson audio or video from the Course Book, then submit your final answer letters through the Submit tab if required by your tutor."}
          </p>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: resolvedWorkbookId, level: "A2", day, workbookId: resolvedWorkbookId }}
          workbookId={resolvedWorkbookId}
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit your required answers for A2 Day {day} here. Include your writing text and your reading/listening answer letters if required by your tutor.
          </p>
          <WorkbookSubmissionReminder />
          <div className={`a2-day${day}-submission-page`} style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day${day}-submission-page > div > section:first-child { display: none !important; }
            .a2-day${day}-submission-page select { display: none !important; }`}</style>
            <ContextualAssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day,
                assignmentKey,
                canonicalAssignmentKey: assignmentKey,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default A2StandardTabbedWorkbookPage;
