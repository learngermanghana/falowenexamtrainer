import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
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

const imageStyle = {
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
    stem: "Warum ging die Person in die Apotheke?",
    options: ["A) Um neue Medikamente zu kaufen.", "B) Weil sie sich krank fühlte.", "C) Um eine Broschüre abzuholen.", "D) Weil es kalt war."],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Husten?",
    options: ["A) Nasenspray", "B) Hustensaft", "C) Tabletten", "D) Hausmittel"],
  },
  {
    stem: "Wie war der Service in der Apotheke?",
    options: ["A) Unfreundlich", "B) Neutral", "C) Hilfsbereit", "D) Langsam"],
  },
  {
    stem: "Was gab die Apothekerin zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Broschüren mit Tipps", "C) Eine Rechnung", "D) Ein neues Medikament"],
  },
  {
    stem: "Wie fühlte sich die Person auf dem Heimweg?",
    options: ["A) Schlechter", "B) Unverändert", "C) Besser", "D) Sehr krank"],
  },
  {
    stem: "Wann fühlte sich die Person besser?",
    options: ["A) Sofort nach Einnahme der Medikamente", "B) Nach einigen Stunden", "C) Am nächsten Tag", "D) Eine Woche später"],
  },
  {
    stem: "Was lernt die Person aus dem Besuch in der Apotheke?",
    options: [
      "A) Sie kann sich auf den Rat der Apotheker verlassen.",
      "B) Medikamente sind nicht hilfreich.",
      "C) Apotheker sind unfreundlich.",
      "D) Hausmittel sind die beste Lösung.",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum ging Anna in die Apotheke?",
    options: ["A) Um Medikamente gegen Husten zu kaufen", "B) Wegen Kopfschmerzen", "C) Um eine Creme zu kaufen", "D) Um Proben zu holen"],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Kopfschmerzen?",
    options: ["A) Aspirin", "B) Paracetamol", "C) Ibuprofen", "D) Nasenspray"],
  },
  {
    stem: "Welches Problem hatte Anna noch?",
    options: ["A) Halsschmerzen", "B) Trockene Haut", "C) Schnupfen", "D) Fieber"],
  },
  {
    stem: "Wie reagierte Anna auf die Empfehlungen der Apothekerin?",
    options: ["A) Sie war skeptisch", "B) Sie war erleichtert", "C) Sie war verwirrt", "D) Sie war unzufrieden"],
  },
  {
    stem: "Was bekam Anna zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Proben von Produkten", "C) Eine Broschüre", "D) Ein neues Medikament"],
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

const A2Day17InDieApothekeGehenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 17 Workbook · In die Apotheke gehen</h1>
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
            ariaLabel="A2 Day 17 workbook sections"
          />
        </div>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1600&q=80"
            alt="Pharmacist speaking with a customer in a pharmacy"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Prepare one short pharmacy dialogue. The mind map contains the complete task: open each branch, practise the
            sentence, and connect the five parts from your health problem to a polite ending.
          </p>
          <SpeakingMindMap config={getA2SpeakingMindMap(17)} />
          <SpeakingPracticeTimerCard />
          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email assignment in a notebook"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabenstellung (A2-Niveau):</strong> Sie möchten ein bestimmtes Medikament kaufen und schreiben deswegen einen Brief oder eine E-Mail an eine Apotheke.
          </p>

          <p style={{ margin: 0 }}><strong>Write about these three points:</strong></p>
          <ol style={listSpacing}>
            <li>Beschreiben Sie kurz, warum Sie das Medikament benötigen.</li>
            <li>Fragen Sie nach den Kosten und ob die Versicherung das Medikament übernimmt.</li>
            <li>Fragen Sie nach der richtigen Dosierung oder möglichen Nebenwirkungen.</li>
          </ol>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing through the Submit tab on this workbook.
          </p>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80"
            alt="Reading exercise text on a desk with glasses"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Submit answers through the Submit tab.
          </p>

          <h3 style={sectionTitle}>Essay</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Es war ein kalter Wintermorgen, als ich entschied, in die Apotheke zu gehen. Ich fühlte mich seit Tagen krank und wusste, dass ich etwas gegen meine Erkältung tun musste. Als ich in die Apotheke kam, begrüßte mich die Apothekerin freundlich. Ich erklärte ihr meine Symptome: Husten, Halsschmerzen und eine laufende Nase. Sie empfahl mir sofort einen Hustensaft und Tabletten gegen die Halsschmerzen. Außerdem gab sie mir Nasenspray.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Während sie die Medikamente holte, erzählte sie mir von verschiedenen Hausmitteln. Nachdem ich bezahlt hatte, gab sie mir noch einige Broschüren mit Tipps zur Gesundheit im Winter. Zu Hause nahm ich die empfohlenen Medikamente ein und nach einigen Stunden spürte ich eine Verbesserung.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice with headphones and laptop"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Watch and listen to the video, then submit your final answer letters through the Submit tab if required by your tutor.
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/jgl__L4L9kE"
            title="Teil 4 Hören · In die Apotheke gehen"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day17InDieApothekeGehen", level: "A2", day: 17, workbookId: "A2Day17InDieApothekeGehen" }}
          workbookId="A2Day17InDieApothekeGehen"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit your required answers for A2 Day 17 here. Include your writing text and your reading/listening answer letters if required by your tutor.
          </p>
          <WorkbookSubmissionReminder />
          <div className="a2-day17-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day17-submission-page > div > section:first-child { display: none !important; }
            .a2-day17-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 17,
                assignmentKey: "A2-6.17",
                canonicalAssignmentKey: "A2-6.17",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default A2Day17InDieApothekeGehenWorkbookPage;
