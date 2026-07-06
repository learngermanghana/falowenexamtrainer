import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const DAY14_WORKBOOK_TABS = STANDARD_WORKBOOK_TABS.filter((tab) => tab.key !== "hoeren");

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

const NoTeilFourNotice = () => (
  <div style={{ ...card, border: "2px solid #facc15", background: "#fffbeb" }}>
    <h2 style={sectionTitle}>No Teil 4 for this workbook</h2>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      This A2 Day 14 / 5.14 workbook has no Teil 4 Hören assignment. Please skip Teil 4 and submit only the required Teil 2 Schreiben and Teil 3 Lesen work.
    </p>
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
          Select Teil 1–3, Ref or Submit below. This 5.14 workbook has no Teil 4 Hören assignment.
        </p>

        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={DAY14_WORKBOOK_TABS}
          ariaLabel="A2 Day 14 workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="A2" />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
            alt="Professionals discussing career plans in an office meeting"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Was ist dein Beruf, wie bist du zu diesem Job gekommen und was möchtest du in Zukunft machen?"
            practiceOnly
            submissionNote="Teil 1 is group practice only and has no assignment submission."
          >
            <p style={{ margin: 0 }}>
              Prepare a short answer about your job, your path into the job and your future career plans.
            </p>
          </WorkbookTaskCard>

          <SpeakingMindMap config={getA2SpeakingMindMap(14)} />

          <h3 style={sectionTitle}>A2-Mindmap: „Mein Beruf und meine Zukunft“</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Was ist dein Beruf?</strong>
              <ul style={listSpacing}>
                <li>Beruf: „Ich bin ...“</li>
                <li>Arbeitsplatz: „Ich arbeite in ...“</li>
                <li>Tätigkeiten: „Ich mache ...“</li>
              </ul>
            </li>
            <li>
              <strong>Wie bist du zu diesem Job gekommen?</strong>
              <ul style={listSpacing}>
                <li>Ausbildung oder Studium: „Ich habe eine Ausbildung/ein Studium als ... gemacht.“</li>
                <li>Bewerbung: „Ich habe mich bei ... beworben.“</li>
                <li>Erfahrung: „Ich habe ein Praktikum bei ... gemacht.“</li>
              </ul>
            </li>
            <li>
              <strong>Was möchtest du in Zukunft machen?</strong>
              <ul style={listSpacing}>
                <li>Karrierepläne: „Ich möchte ... werden.“</li>
                <li>Weiterbildung: „Ich möchte eine Weiterbildung machen.“</li>
                <li>Ziele: „In 5 Jahren möchte ich ...“</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
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
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Writing a formal career-related letter"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreiben Sie einen formellen Brief an Ihren Kollegen."
            submissionNote="Submit your final writing through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Ihr Kollege hat Ihnen ein berufliches Seminar vorgeschlagen, das Ihre Karriere fördern könnte.
            </p>
            <ol style={listSpacing}>
              <li>Bedanken Sie sich für den Vorschlag.</li>
              <li>Zeigen Sie, dass Sie interessiert sind.</li>
              <li>Fragen Sie nach weiteren Details: Inhalt, Termine und Kosten.</li>
            </ol>
          </WorkbookTaskCard>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80"
            alt="Employee reading workplace guidelines and notes"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text und beantworten Sie die Fragen."
            submissionNote="Submit your reading answer letters through the Submit tab."
          >
            <p style={{ margin: 0 }}>Do not answer directly on this page.</p>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>Lesetext: Arbeiten in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In den ersten Tagen am neuen Arbeitsplatz lernen Sie Ihre Kolleginnen und Kollegen sowie die Arbeitsabläufe kennen. Beim Vorgesetzten sagt man fast immer „Sie“. In Deutschland gibt es außerdem Arbeitnehmerschutz, zum Beispiel Arbeitskleidung, Pausen und feste Arbeitszeiten. In größeren Unternehmen gibt es oft einen Betriebsrat. Die normale Wochenarbeitszeit liegt meist zwischen 38 und 40 Stunden. Jeder Arbeitnehmer hat Urlaubstage. Bei Krankheit muss man den Arbeitgeber sofort informieren und zum Arzt gehen. Für Fort- und Weiterbildung bieten Volkshochschulen viele Kurse an.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          <QuestionList questions={lesenQuestions} />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && <NoTeilFourNotice />}

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
