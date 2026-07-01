import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
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

const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
          <span key={`${question.stem}-${option}`}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const A2Day2SmallTalkWorkbookContent = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((previous) => ({ ...previous, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <span style={{ ...styles.badge, width: "fit-content" }}>A2 · Day 1 · Kapitel 1.1</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 Workbook · Small Talk</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. Each part begins with a highlighted task showing exactly what you must answer.
        </p>
        <img
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80"
          alt="Students practising friendly small talk together"
          loading="lazy"
          style={imageStyle}
        />

        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel="A2 Day 1 Small Talk workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="A2" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Führe ein kurzes Small-Talk-Gespräch."
            practiceOnly
            submissionNote="Prepare this before class. Teil 1 is group practice and is not submitted."
          >
            <p style={{ margin: 0 }}>
              Begrüße deinen Partner, stelle mindestens <strong>drei persönliche Fragen</strong>, reagiere auf die Antworten und stelle mindestens <strong>eine Rückfrage</strong>.
            </p>
            <p style={{ margin: 0 }}>
              Sprich über Arbeit oder Studium, Familie oder Sprachen, Hobbys und das Wetter. Ziel: ungefähr <strong>30–45 Sekunden</strong>.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
            alt="Friends having a relaxed small-talk conversation"
            loading="lazy"
            style={imageStyle}
          />

          <h3 style={sectionTitle}>Useful questions and phrases</h3>
          <div style={phraseGridStyle}>
            <div style={questionCardStyle}>
              <strong>Begrüßung</strong>
              <span>Hallo, wie geht es dir?</span>
              <span>Schön, dich kennenzulernen.</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Arbeit und Studium</strong>
              <span>Was machst du beruflich?</span>
              <span>Wo arbeitest oder studierst du?</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Familie und Sprachen</strong>
              <span>Hast du Geschwister?</span>
              <span>Welche Sprachen sprichst du?</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Hobbys und Wetter</strong>
              <span>Was machst du gern in deiner Freizeit?</span>
              <span>Wie findest du das Wetter heute?</span>
            </div>
          </div>

          <h3 style={sectionTitle}>Suggested speaking structure</h3>
          <ol style={listSpacing}>
            <li><strong>Einleitung:</strong> „Heute spreche ich kurz über mich.“</li>
            <li><strong>Informationen:</strong> Familie, Sprachen, Beruf oder Studium und Hobbys.</li>
            <li><strong>Verbindungen:</strong> und, aber, weil, deshalb, zuerst, dann.</li>
            <li><strong>Rückfrage:</strong> „Und wie ist es bei dir?“</li>
            <li><strong>Schluss:</strong> „Danke fürs Zuhören.“</li>
          </ol>

          <SpeakingPracticeTimerCard storageKey="a2-day2-small-talk-speaking" />

          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Hallo, ich heiße Maria und komme aus Ghana. Ich spreche Englisch und ein bisschen Deutsch. Zurzeit arbeite ich in einem Büro, aber später möchte ich studieren. In meiner Freizeit höre ich gern Musik und treffe Freunde, weil das entspannend ist. Und wie ist es bei dir?“
            </p>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreibe einen Brief an deinen Freund Felix."
            submissionNote="Submit your finished letter through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Erzähle Felix etwas über deine Arbeit und deine Familie.
            </p>
            <ol style={listSpacing}>
              <li>Erkläre kurz, warum du schreibst.</li>
              <li>Erzähle etwas über deine Arbeit und deine Familie.</li>
              <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
            </ol>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing a friendly German letter"
            loading="lazy"
            style={imageStyle}
          />
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lies den Text und beantworte alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1C, 2B, 3A ..."
          >
            <p style={{ margin: 0 }}>
              Read the complete text first. Then choose one answer, A–D, for each question.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
            alt="Open book for German reading practice"
            loading="lazy"
            style={imageStyle}
          />
          <h3 style={sectionTitle}>Mein Gespräch mit Lisa</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Gestern habe ich Lisa im Café getroffen. Sie arbeitet in einer Schule und unterrichtet Kinder. Wir haben über unsere Arbeit gesprochen. Lisa sagt, dass sie ihren Beruf liebt, weil sie gerne mit Kindern arbeitet. Ich habe ihr erzählt, dass ich in einem Büro arbeite. Dann haben wir über Sport gesprochen. Lisa spielt gern Tennis, aber ich mag Fußball mehr. Wir haben auch über das Wetter geredet. Es war gestern sonnig und warm, und Lisa liebt den Sommer. Ich habe ihr erzählt, dass ich lieber den Herbst mag, weil die Bäume so schön bunt sind. Zum Schluss haben wir über Reisen gesprochen. Lisa war schon in Italien und Spanien. Sie möchte nächstes Jahr nach Frankreich reisen.
          </p>
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Höre den Text zweimal und beantworte alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2A, 3C ..."
          >
            <p style={{ margin: 0 }}>
              Read the questions first. Listen for plans, the film, sport, weather and the next meeting.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for German listening practice"
            loading="lazy"
            style={imageStyle}
          />
          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
            linkLabel="Open Teil 4 audio"
          />
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{
            title: "A2Day2SmallTalk",
            level: "A2",
            day: 1,
            workbookId: "A2Day2SmallTalk",
          }}
          workbookId="A2Day2SmallTalk"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={{ margin: 0 }}>Submit Workbook</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2, Teil 3 and Teil 4."
            submissionNote="Do not submit Teil 1."
          >
            <p style={{ margin: 0 }}>
              Paste your final writing, reading answer letters and listening answer letters into the assignment form below.
            </p>
          </WorkbookTaskCard>
          <div className="a2-day1-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day1-submission-page > div > section:first-child { display: none !important; }
            .a2-day1-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 1,
                assignmentKey: "A2-1.1",
                canonicalAssignmentKey: "A2-1.1",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

const A2Day2SmallTalkWorkbookEnhancedPage = () => (
  <RadioFirstWorkbookGate level="A2" day={1}>
    <A2Day2SmallTalkWorkbookContent />
  </RadioFirstWorkbookGate>
);

export default A2Day2SmallTalkWorkbookEnhancedPage;
