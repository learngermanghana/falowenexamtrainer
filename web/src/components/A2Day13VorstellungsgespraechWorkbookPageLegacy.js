import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import {
  A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
  WorkbookTabNav,
} from "./StandardWorkbookComponents";

const tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR;

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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Was ist eine Kinderkrippe?",
    options: [
      "A) Eine Schule für Kinder ab 6 Jahren",
      "B) Ein Spielplatz für Kinder",
      "C) Ein Ort für kleine Kinder bis 3 Jahre",
      "D) Ein Krankenhaus für Kinder",
    ],
  },
  {
    stem: "Ab wann kann ein Kind in den Kindergarten gehen?",
    options: ["A) Ab 6 Jahren", "B) Ab 2 Jahren", "C) Ab 3 Jahren", "D) Ab 5 Jahren"],
  },
  {
    stem: "Was machen Kinder im Kindergarten?",
    options: [
      "A) Sie arbeiten am Computer",
      "B) Sie machen Hausaufgaben",
      "C) Sie schlafen den ganzen Tag",
      "D) Sie spielen, singen und basteln",
    ],
  },
  {
    stem: "Wie nennt man einen Kindergarten, der den ganzen Tag offen ist?",
    options: ["A) Supermarkt", "B) Kita", "C) Schule", "D) Wohnung"],
  },
  {
    stem: "Was bekommt ein Kind in der Kita zu essen?",
    options: ["A) Frühstück", "B) Eis", "C) Mittagessen", "D) Kuchen"],
  },
  {
    stem: "Wer zahlt mehr für den Kindergarten?",
    options: ["A) Reiche Familien", "B) Alle Familien zahlen gleich", "C) Arme Familien", "D) Die Kinder selbst"],
  },
  {
    stem: "Was passiert, wenn ein Kind schlecht Deutsch spricht?",
    options: [
      "A) Es darf nicht mehr in den Kindergarten",
      "B) Es bekommt Hilfe beim Deutschlernen",
      "C) Es muss eine andere Sprache lernen",
      "D) Es bekommt keinen Platz mehr",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum ist es wichtig, sich über das Unternehmen zu informieren?",
    options: ["A) Um Produkte zu kaufen", "B) Um Interesse zu zeigen", "C) Um Fragen zu vermeiden", "D) Um Kleidung auszuwählen"],
  },
  {
    stem: "Was ist ein Zeichen von Professionalität und Respekt?",
    options: ["A) Zu spät kommen", "B) Pünktlich sein", "C) Unpassende Kleidung", "D) Leise sprechen"],
  },
  {
    stem: "Warum sollte man dem Arbeitgeber Fragen stellen?",
    options: [
      "A) Um das Gespräch zu verlängern",
      "B) Um Unsicherheit zu zeigen",
      "C) Um Interesse zu zeigen",
      "D) Um die Kleidung zu bewerten",
    ],
  },
  {
    stem: "Welche Art von E-Mail wird nach dem Gespräch empfohlen?",
    options: ["A) Eine Dankes-E-Mail", "B) Eine Beschwerde-E-Mail", "C) Eine Frage-E-Mail", "D) Eine Kündigungs-E-Mail"],
  },
  {
    stem: "Was sollte man während des Gesprächs tun?",
    options: ["A) Unvorbereitet sein", "B) Klar und deutlich sprechen", "C) Nur zuhören", "D) Unpassende Fragen stellen"],
  },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const A2Day13VorstellungsgespraechWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 13 Workbook · Ein Vorstellungsgespräch</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Grammar, Teil 1–4, Ref or Submit below.
        </p>

        <div style={{ position: "sticky", top: 0, zIndex: 20, padding: 10, margin: "0 -4px", border: "1px solid #bfdbfe", borderRadius: 14, background: "rgba(255,255,255,0.98)", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)" }}>
          <WorkbookTabNav
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
            ariaLabel="A2 Day 13 workbook sections"
          />
        </div>
      </div>

      {activeTab === "grammar" && <div style={card}><A2B1GrammarNotesTab level="A2" day={13} /></div>}

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
            alt="Candidates in a professional job interview setting"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Prepare one clear 30–45 second introduction for the Amazon interview. The mind map contains the complete
            task: open each branch, practise the sentence, and connect the five parts into one answer.
          </p>
          <SpeakingMindMap config={getA2SpeakingMindMap(13)} />
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal job application letter"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Assignment: Schreiben</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Thema: Bewerbung um eine Stelle im CityMall Einkaufszentrum</strong>
          </p>
          <p style={{ margin: 0 }}>
            Sie möchten sich bei CityMall Einkaufszentrum um eine Stelle als Verkäufer/in oder Kundenservice-Mitarbeiter/in bewerben. Schreiben Sie einen formellen Brief.
          </p>
          <p style={{ margin: 0 }}>Punkte, die Sie beachten sollen:</p>
          <ol style={listSpacing}>
            <li>Warum schreiben Sie den Brief?</li>
            <li>Was sind Ihre Erfahrungen und Stärken?</li>
            <li>Was erwarten Sie?</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the <strong>Submit</strong> tab of this workbook.
          </p>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Open German reading workbook on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the Submit tab to send your answers.
          </p>

          <h3 style={sectionTitle}>Kinderbetreuung in Deutschland (A2-Niveau)</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland gibt es viele Möglichkeiten für kleine Kinder. Wenn Vater und Mutter arbeiten, können sie ihr Kind in eine Kinderkrippe bringen. Eine Kinderkrippe ist für Kinder bis 3 Jahre. Es gibt nur wenige Plätze. Man muss das Kind früh anmelden. Ab 3 Jahren können Kinder in den Kindergarten gehen. Dort können sie spielen, singen, malen und basteln. Im Sommer gehen viele Erzieherinnen mit den Kindern nach draußen. Viele Kindergärten helfen auch mit der Sprache. Die Kinder hören Geschichten und machen Sprachspiele. Ein Kindergarten ist eine gute Vorbereitung für die Schule. Aber es gibt nicht überall genug Plätze. Man muss das Kind rechtzeitig anmelden. Einige Kindergärten sind vormittags offen (z. B. 7–13 Uhr). Andere Kindergärten sind den ganzen Tag offen (z. B. 7–17 Uhr). Diese heißen Kitas. In einer Kita bekommt das Kind auch Mittagessen. Die Eltern müssen für den Kindergarten Geld bezahlen. Der Preis ist in jedem Bundesland anders. Wer wenig Geld hat, zahlt weniger. Wer mehr verdient, zahlt mehr. Private Kindergärten sind teurer als staatliche. In einigen privaten Kitas spricht man zwei Sprachen, zum Beispiel Deutsch und Spanisch. Vor der Schule machen viele Kinder einen Sprachtest. Wenn ein Kind noch nicht gut Deutsch spricht, bekommt es Hilfe beim Deutschlernen.
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
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones beside notes for listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Listen to the video, then submit your answers in the Submit tab.
          </p>
          <p style={{ margin: 0 }}>
            Hören video:{" "}
            <a href="https://youtu.be/kr9Rj2j-ghw" target="_blank" rel="noreferrer">
              Open Teil 4 Hören video on YouTube
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/kr9Rj2j-ghw?rel=0"
            title="A2 Day 13 Vorstellungsgespräch Teil 4 Hören video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day13Vorstellungsgespraech", level: "A2", day: 13, workbookId: "A2Day13Vorstellungsgespraech" }}
          workbookId="A2Day13Vorstellungsgespraech"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit only your final answers here. Include Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören in one submission.
          </p>
          <AssignmentSubmissionPage />
        </div>
      )}
    </div>
  );
};

export default A2Day13VorstellungsgespraechWorkbookPage;
