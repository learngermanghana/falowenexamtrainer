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
    stem: "Was ist besonders beliebt im Fitnessstudio \"Fit & Fun\"?",
    options: ["A) Yoga und Zumba", "B) Fußball und Handball", "C) Schwimmkurse", "D) Klettertraining"],
  },
  {
    stem: "Welche Mannschaftssportarten bietet der Sportverein \"Grün-Weiß\" an?",
    options: ["A) Yoga und Pilates", "B) Fußball, Handball und Volleyball", "C) Klettern und Schwimmen", "D) Tennis und Joggen"],
  },
  {
    stem: "Was ist das Highlight des jährlichen Stadtlaufs?",
    options: ["A) Die Zuschauerzahl", "B) Die Teilnahmegebühren", "C) Die Spenden an lokale Wohltätigkeitsorganisationen", "D) Die Strecke am Fluss"],
  },
  {
    stem: "Wo befindet sich die Schwimmhalle?",
    options: ["A) Im Stadtzentrum", "B) Im Stadtpark", "C) Im Seniorenclub", "D) Im Rathaus"],
  },
  {
    stem: "Was bietet der Seniorenclub \"Aktiv im Alter\" an?",
    options: ["A) Schwimmkurse", "B) Fitnessprogramme", "C) Kletterkurse", "D) Tanzshows"],
  },
  {
    stem: "Was plant die Stadtverwaltung in den nächsten Monaten?",
    options: ["A) Die Eröffnung eines neuen Fitnessstudios", "B) Die Eröffnung eines neuen Kletterparks", "C) Die Eröffnung einer neuen Schwimmhalle", "D) Die Eröffnung eines Stadions"],
  },
  {
    stem: "Welche Rolle spielt Sport in der Stadt?",
    options: ["A) Eine unwichtige Rolle", "B) Eine wichtige Rolle zur Förderung der Lebensqualität", "C) Eine Rolle nur für junge Menschen", "D) Eine Rolle nur für Profisportler"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was ist besonders beliebt im neuen Fitnessstudio \"Vital Plus\"?",
    options: ["A) Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Kletterkurse"],
  },
  {
    stem: "Was bietet der Stadtpark im Sommer an?",
    options: ["A) Kostenlose Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Fußballturniere"],
  },
  {
    stem: "Was bietet das Schwimmbad \"Aqua Fun\" an?",
    options: ["A) Wassergymnastik und Aqua-Zumba", "B) Kletterkurse", "C) Fußballkurse", "D) Boxtraining"],
  },
  {
    stem: "Für wen ist der neue Kletterpark geeignet?",
    options: ["A) Nur für Anfänger", "B) Nur für Fortgeschrittene", "C) Für Anfänger und Fortgeschrittene", "D) Nur für Kinder"],
  },
  {
    stem: "Was bietet der Sportverein \"Fitness für alle\" an?",
    options: ["A) Yoga-Kurse", "B) Volleyball und Basketball", "C) Schwimmkurse", "D) Tennis und Golf"],
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

const A2Day15MeinLieblingssportWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 15 Workbook · Mein Lieblingssport</h1>
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
            ariaLabel="A2 Day 15 workbook sections"
          />
        </div>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80"
            alt="People playing basketball during sports practice"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(15)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we discuss sport, training, health benefits and favourite activities.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema: „Mein Lieblingssport“</h3>
          <ol style={listSpacing}>
            <li><strong>Sportart:</strong> Fußball, Basketball, Schwimmen, Tennis, Laufen, Radfahren.</li>
            <li><strong>Training:</strong> Wie oft trainierst du? Trainierst du allein oder mit Freunden?</li>
            <li><strong>Gesundheit:</strong> Warum ist der Sport gut für deine Fitness?</li>
            <li><strong>Meinung:</strong> Warum magst du diesen Sport?</li>
          </ol>

          <div style={questionCardStyle}>
            <strong>Frage zur Diskussion</strong>
            <p style={{ margin: 0, lineHeight: 1.6 }}>Was ist Ihr Lieblingssport und warum?</p>
            <p style={{ margin: 0 }}><strong>Vier Schlüsselwörter:</strong> Fußball · Fitness · gesund · Freunde</p>
          </div>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über …“</li>
                <li>„Mein Thema ist …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter</strong>
              <ul style={listSpacing}>
                <li><strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong></li>
              </ul>
            </div>
          </div>

          <SpeakingPracticeTimerCard />
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email assignment in a notebook"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabenstellung:</strong> Sie sind jetzt in Deutschland und möchten sich für einen Sportkurs anmelden. Schreiben Sie eine E-Mail an einen Sportverein oder ein Fitnessstudio.
          </p>
          <p style={{ margin: 0 }}>Ihre E-Mail soll folgende Punkte enthalten:</p>
          <ol style={listSpacing}>
            <li>Fragen, ob es noch freie Plätze im Sportkurs gibt.</li>
            <li>Ihre bisherigen Erfahrungen oder Ihre Motivation beschreiben.</li>
            <li>Nach Trainingszeiten und Kosten fragen.</li>
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading text and questions for German class practice"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the article and review the multiple-choice questions. <strong>Do not answer directly on this page.</strong> Submit answers through the Submit tab.
          </p>

          <h3 style={sectionTitle}>Sportangebote in unserer Stadt</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In unserer Stadt gibt es ein breites Angebot an Sportmöglichkeiten für Jung und Alt. Besonders beliebt sind die Kurse im Fitnessstudio "Fit & Fun", wo man alles von Yoga bis Zumba ausprobieren kann. Für diejenigen, die lieber draußen aktiv sind, bietet der Sportverein "Grün-Weiß" Mannschaftssportarten wie Fußball, Handball und Volleyball an. Auch der jährliche Stadtlauf ist sehr beliebt und unterstützt lokale Wohltätigkeitsorganisationen. Die Schwimmhalle befindet sich im Stadtzentrum und der Seniorenclub "Aktiv im Alter" bietet Fitnessprogramme an.
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
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice with headphones"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>
            Watch and listen to the Hören video, then submit your final answer letters through the Submit tab if required by your tutor.
          </p>
          <iframe
            src="https://www.youtube.com/embed/p_OE59m0J-Y?rel=0"
            title="A2 Day 15 Mein Lieblingssport Teil 4 Hören video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={videoPreviewStyle}
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
          lesson={{ title: "A2Day15MeinLieblingssport", level: "A2", day: 15, workbookId: "A2Day15MeinLieblingssport" }}
          workbookId="A2Day15MeinLieblingssport"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit your required answers for A2 Day 15 here. Include your writing text and your reading/listening answer letters if required by your tutor.
          </p>
          <WorkbookSubmissionReminder />
          <div className="a2-day15-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day15-submission-page > div > section:first-child { display: none !important; }
            .a2-day15-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 15,
                assignmentKey: "A2-5.15",
                canonicalAssignmentKey: "A2-5.15",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default A2Day15MeinLieblingssportWorkbookPage;
