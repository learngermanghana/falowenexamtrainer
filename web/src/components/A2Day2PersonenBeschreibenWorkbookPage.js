import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
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

const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
    stem: "Wie lange arbeitet der Erzähler schon im Büro?",
    options: ["A) Zwei Jahre", "B) Ein Jahr", "C) Drei Monate", "D) Fünf Jahre"],
  },
  {
    stem: "Was ist besonders an Herrn Müllers Arbeitsweise?",
    options: [
      "A) Er kommt immer unpünktlich ins Büro",
      "B) Er ist immer gut gelaunt und organisiert",
      "C) Er ist sehr unorganisiert und chaotisch",
      "D) Er ist nie freundlich zu den Mitarbeitern",
    ],
  },
  {
    stem: "Was trägt Herr Müller normalerweise?",
    options: ["A) Einen Anzug und eine Krawatte", "B) Einen Pullover und Jeans", "C) Einen Anzug und eine Brille", "D) Eine Uniform"],
  },
  {
    stem: "Was macht Herr Müller, wenn die Mitarbeiter Fragen haben?",
    options: [
      "A) Er ignoriert sie",
      "B) Er geht geduldig auf ihre Anliegen ein",
      "C) Er wird ärgerlich",
      "D) Er sagt, dass sie selbst nach Lösungen suchen sollen",
    ],
  },
  {
    stem: "Warum ist es motivierend, mit Herrn Müller zu arbeiten?",
    options: [
      "A) Weil er selten lobt",
      "B) Weil er seine Mitarbeiter regelmäßig lobt",
      "C) Weil er nie mit den Mitarbeitern spricht",
      "D) Weil er die Arbeit nicht ernst nimmt",
    ],
  },
  {
    stem: "Wann kann Herr Müller streng sein?",
    options: [
      "A) Wenn eine Aufgabe nicht rechtzeitig erledigt wird",
      "B) Wenn er sich langweilt",
      "C) Wenn die Mitarbeiter zu viel reden",
      "D) Wenn jemand zu früh nach Hause geht",
    ],
  },
  {
    stem: "Was schätzt der Erzähler an Herrn Müller besonders?",
    options: [
      "A) Dass er immer mit den Mitarbeitern streitet",
      "B) Dass er fair ist und die Leistungen der Mitarbeiter wertschätzt",
      "C) Dass er nie Zeit für die Mitarbeiter hat",
      "D) Dass er seine Aufgaben an andere weitergibt",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum lernt der Sprecher Deutsch?",
    options: [
      "A) Weil er nach Frankreich ziehen möchte.",
      "B) Weil er in Deutschland arbeiten möchte.",
      "C) Weil er eine deutsche Freundin hat.",
      "D) Weil er Deutsch liebt.",
    ],
  },
  {
    stem: "Welche Methoden benutzt der Sprecher zum Lernen?",
    options: [
      "A) Nur Bücher lesen.",
      "B) Nur Filme schauen.",
      "C) Sprachkurse, Online-Apps und das Üben mit Freunden.",
      "D) Nur Musik hören.",
    ],
  },
  {
    stem: "Wie oft übt der Sprecher Deutsch?",
    options: ["A) Jeden Tag eine Stunde.", "B) Einmal pro Woche.", "C) Einmal im Monat.", "D) Nie."],
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

const A2Day2PersonenBeschreibenWorkbookPage = () => {
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
        <span style={{ ...styles.badge, width: "fit-content" }}>A2 · Day 2 · Kapitel 1.2</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 2 Workbook · Personen beschreiben</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1, Teil 2, Teil 3, Teil 4, Ref or Submit below. The standard workbook buttons stay visible at the top.
        </p>

        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel="A2 Day 2 workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="A2" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="Group conversation practice in class"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Kannst du eine Person beschreiben? Wie sieht sie aus und was für ein Mensch ist sie?"
            practiceOnly
            submissionNote="Teil 1 is for group practice only and has no assignment submission."
          >
            <p style={{ margin: 0 }}>
              Prepare a short description of a person. Mention appearance, character, clothing, age, origin, hobbies and your relationship to the person.
            </p>
          </WorkbookTaskCard>

          <SpeakingMindMap config={getA2SpeakingMindMap(2)} />

          <h3 style={sectionTitle}>Äste und Unterpunkte</h3>
          <ol style={listSpacing}>
            <li><strong>Äußeres Erscheinungsbild:</strong> groß, klein, Haarfarbe, Augenfarbe, Brille, Bart.</li>
            <li><strong>Kleidung:</strong> T-Shirt, Jeans, Pullover, Anzug, Kleid, Farben.</li>
            <li><strong>Charakter:</strong> freundlich, lustig, kreativ, offen, pünktlich, hilfsbereit.</li>
            <li><strong>Alter und Herkunft:</strong> Er/Sie ist 20 Jahre alt. Er/Sie kommt aus Ghana.</li>
            <li><strong>Hobbys und Interessen:</strong> Fußball, Musik, Lesen, Reisen, Tanzen.</li>
            <li><strong>Beziehungen:</strong> Freund/Freundin, Kollege/Kollegin, Bruder/Schwester, Chef/Chefin.</li>
          </ol>

          <h3 style={sectionTitle}>Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use this simple structure: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>Heute beschreibe ich eine Person aus meinem Alltag.</li>
                <li>Ich möchte über eine Person sprechen, die ich sehr gut kenne.</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter</strong>
              <ul style={listSpacing}>
                <li>und, oder, auch</li>
                <li>weil, deshalb, außerdem, zum Beispiel</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>Ich finde, dass sie sehr freundlich ist.</li>
                <li>Für mich ist diese Person wichtig, weil sie immer zuhört.</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>Zusammenfassend kann ich sagen, dass sie eine tolle Person ist.</li>
                <li>Danke fürs Zuhören.</li>
              </ul>
            </div>
          </div>

          <SpeakingPracticeTimerCard />
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a letter in a notebook"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreibe einen Brief an Felix und erzähle ihm von deinem Chef oder deiner Chefin."
            submissionNote="Submit your final writing through the Submit tab."
          >
            <p style={{ margin: 0 }}>Use these three content points:</p>
            <ol style={listSpacing}>
              <li>Warum schreibst du?</li>
              <li>Beschreibe deinen Chef / deine Chefin: Aussehen, Persönlichkeit und Verhalten.</li>
              <li>Was gefällt dir an ihm/ihr, und was könnte besser sein?</li>
            </ol>
          </WorkbookTaskCard>

          <div style={questionCardStyle}>
            <strong>Beispielanfang</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Lieber Felix, wie geht es dir? Ich schreibe dir, weil ich dir von meinem Chef erzählen möchte. Er ist ...
            </p>
          </div>

          <CourseInlinePracticePanel
            type="writing"
            writingContext={{
              level: "A2",
              courseLevel: "A2",
              day: 2,
              lessonId: "A2-day-2",
              workbookId: "A2Day2PersonenBeschreiben",
              writingTaskId: "A2-day-2-teil-2-writing",
              taskTitle: "Personen beschreiben",
            }}
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
            alt="Reading comprehension workbook on desk"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Read the text and answer the questions."
            submissionNote="Submit your reading answer letters through the Submit tab."
          >
            <p style={{ margin: 0 }}>Do not answer directly on this page. Prepare your final answer list first.</p>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>Text</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ich arbeite seit einem Jahr in einem kleinen Büro in der Stadtmitte. Mein Chef, Herr Müller, ist etwa 45 Jahre alt. Er ist ein sehr organisierter und motivierter Mensch. Jeden Morgen kommt er pünktlich ins Büro und begrüßt alle freundlich. Herr Müller trägt meistens einen Anzug und eine Brille. Er hat kurze, braune Haare und ist immer gut gelaunt. Er ist sehr freundlich, aber auch sehr anspruchsvoll, wenn es um die Arbeit geht. Besonders gut finde ich, dass er immer Zeit für uns hat, wenn wir Fragen oder Probleme haben. Er geht geduldig auf unsere Anliegen ein und erklärt alles sehr klar. Trotzdem kann er streng sein, wenn eine Aufgabe nicht rechtzeitig erledigt wird. Ich arbeite gerne mit Herrn Müller zusammen, weil er fair ist und die Leistungen seiner Mitarbeiter wertschätzt.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          <QuestionList questions={lesenQuestions} />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones prepared for listening comprehension"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Listen to the audio/video and answer the questions."
            submissionNote="Submit your listening answer letters or checked result through the Submit tab."
          >
            <p style={{ margin: 0 }}>Use the Falowen audio/video resource for this lesson and prepare your final answer list.</p>
          </WorkbookTaskCard>

          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1SIFA08DquWp-dU86pi7pHC6eElF_39I9/view?usp=sharing"
            linkLabel="Open Teil 4 audio"
          />

          <h3 style={sectionTitle}>Hörverstehen Fragen</h3>
          <QuestionList questions={hoerenQuestions} />

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/Tor-mPRS3j4" target="_blank" rel="noreferrer">
              Deutsch lernen (A2) | Nicos Weg | Folge 10: Personen beschreiben
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/Tor-mPRS3j4"
            title="Deutsch lernen (A2) | Nicos Weg | Folge 10: Personen beschreiben"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day2PersonenBeschreiben", level: "A2", day: 2, workbookId: "A2Day2PersonenBeschreiben" }}
          workbookId="A2Day2PersonenBeschreiben"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit Workbook · A2 Day 2 · Kapitel 1.2</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2, Teil 3 and Teil 4."
            submissionNote="Teil 1 is group practice only."
          >
            <ul style={listSpacing}>
              <li><strong>Teil 2 · Schreiben:</strong> paste your final letter.</li>
              <li><strong>Teil 3 · Lesen:</strong> paste your reading answer letters.</li>
              <li><strong>Teil 4 · Hören:</strong> paste your listening answer letters or checked result.</li>
            </ul>
          </WorkbookTaskCard>
          <WorkbookSubmissionReminder />
          <div className="a2-day2-personen-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day2-personen-submission-page > div > section:first-child { display: none !important; }
            .a2-day2-personen-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 2,
                assignmentKey: "A2-1.2",
                canonicalAssignmentKey: "A2-1.2",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default A2Day2PersonenBeschreibenWorkbookPage;
