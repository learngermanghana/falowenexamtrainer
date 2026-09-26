import React, { useState } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 13,
  background: "#fff",
  display: "grid",
  gap: 7,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 13, padding: 13, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const speakingSupport = [
  {
    title: "Vor dem Termin",
    items: ["Anzeige genau lesen", "Adresse prüfen", "Fragen vorbereiten", "Unterlagen mitnehmen", "pünktlich sein"],
  },
  {
    title: "Fragen zur Wohnung",
    items: ["Wie hoch ist die Warmmiete?", "Wie hoch ist die Kaution?", "Ist die Wohnung möbliert?", "Sind Haustiere erlaubt?", "Wann ist die Wohnung frei?"],
  },
  {
    title: "Wohnung kontrollieren",
    items: ["Zustand der Räume", "Fenster und Licht", "Küche und Bad", "Lärm", "Mängel", "Verkehrsanbindung"],
  },
  {
    title: "Höfliche Formulierungen",
    items: ["Könnten Sie mir bitte sagen, ob ...?", "Ich würde gern wissen, wann ...", "Wäre Samstag um 14 Uhr möglich?", "Dürfte ich fragen, wie hoch ...?"],
  },
];

const readingQuestions = [
  { stem: "1. Wann fand der Besichtigungstermin statt?", options: ["a) Am Freitag um 14:00 Uhr", "b) Am Samstag um 14:00 Uhr", "c) Am Sonntag um 15:00 Uhr", "d) Am Samstag um 16:00 Uhr"] },
  { stem: "2. Wie wurde die Wohnung beschrieben?", options: ["a) Klein und dunkel", "b) Hell und geräumig", "c) Alt und renovierungsbedürftig", "d) Eng und dunkel"] },
  { stem: "3. Was gefiel Anna besonders an der Wohnung?", options: ["a) Die Lage", "b) Die Badewanne", "c) Der Boden", "d) Die Fenster"] },
  { stem: "4. Wie hoch war die verlangte Kaution?", options: ["a) Eine Monatsmiete", "b) Zwei Monatsmieten", "c) Drei Monatsmieten", "d) Vier Monatsmieten"] },
  { stem: "5. Wann wäre die Wohnung verfügbar?", options: ["a) Ab dem ersten des nächsten Monats", "b) Sofort", "c) In zwei Monaten", "d) Ab dem nächsten Jahr"] },
  { stem: "6. Welche Vertragsdauer wurde besprochen?", options: ["a) Sechs Monate", "b) Ein Jahr", "c) Zwei Jahre", "d) Drei Jahre"] },
  { stem: "7. Wie reagierte Anna am nächsten Tag?", options: ["a) Sie entschied sich, die Wohnung nicht zu nehmen.", "b) Sie wollte mehr Zeit zum Überlegen.", "c) Sie entschied sich, die Wohnung zu mieten.", "d) Sie konnte den Vermieter nicht erreichen."] },
];

const listeningQuestions = [
  { stem: "1. Wann beginnen die Besichtigungstermine oft?", options: ["a) Am frühen Morgen", "b) Am späten Abend", "c) Am Nachmittag", "d) Mittags"] },
  { stem: "2. Was ist ein Vorteil von Gruppenbesichtigungen?", options: ["a) Man kann die Wohnung in Ruhe besichtigen.", "b) Der Vermieter spart Zeit.", "c) Man hat weniger Konkurrenz.", "d) Man sieht weniger von der Wohnung."] },
  { stem: "3. Worauf achten viele Interessenten während der Besichtigung?", options: ["a) Nur auf die Inneneinrichtung", "b) Auf das Umfeld und die Nachbarschaft", "c) Nur auf den Preis", "d) Auf die Farbe der Wände"] },
  { stem: "4. Warum sollten Interessenten schnell entscheiden, ob sie die Wohnung nehmen wollen?", options: ["a) Weil die Besichtigung anstrengend ist.", "b) Weil sie sonst die nächste Besichtigung verpassen.", "c) Weil die Wohnung schnell vergeben sein könnte.", "d) Weil der Vermieter keine Zeit hat."] },
  { stem: "5. Welche Unterlagen sollten Interessenten zur Besichtigung mitbringen?", options: ["a) Mietvertrag", "b) Gehaltsnachweise und Mieterselbstauskunft", "c) Ausweis und Passfoto", "d) Möbelkatalog"] },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionCard}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const B1Day5PreservedSections = ({ activeTab, prepared, setPreparedFor }) => {
  const writing = getB1WritingTask(5);
  const mark = setPreparedFor;
  return (
    <>
      {activeTab === "sprechen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Fragen würden Sie bei einer Wohnungsbesichtigung stellen?"
            practiceOnly
            submissionNote="Prepare a 1–2 minute role-play for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Spielen Sie ein Gespräch zwischen Interessent und Vermieter. Vereinbaren Sie höflich einen Termin und stellen Sie mindestens <strong>vier Fragen</strong> zu Miete, Kaution, Ausstattung, Haustieren oder Verfügbarkeit.
            </p>
          </WorkbookTaskCard>

          <p style={{ margin: 0, color: "#475569" }}>The cards below help you prepare the role-play. They are not separate assignments.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {speakingSupport.map((branch) => (
              <article key={branch.title} style={{ ...questionCard, background: "#f8fafc" }}>
                <strong>{branch.title}</strong>
                <ul style={listStyle}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>

          <div style={{ ...questionCard, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <strong>Suggested role-play structure</strong>
            <ol style={listStyle}>
              <li>Begrüßung und Interesse an der Wohnung</li>
              <li>Höfliche Frage nach einem Termin</li>
              <li>Vier Fragen zur Wohnung</li>
              <li>Bitte um Bestätigung</li>
              <li>Höflicher Abschluss</li>
            </ol>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      ) : null}

      {activeTab === "schreiben" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title={writing.title}
            submissionNote={writing.submissionNote}
          >
            <ol style={listStyle}>
              <li>Erklären Sie, dass Sie sich für die Wohnung interessieren.</li>
              <li>Fragen Sie nach einem möglichen Besichtigungstermin oder schlagen Sie selbst einen Termin vor.</li>
              <li>Bitten Sie um eine Bestätigung und erklären Sie, wie der Vermieter Sie erreichen kann.</li>
            </ol>
          </WorkbookTaskCard>

          <div style={{ ...questionCard, background: "#f8fafc" }}>
            <strong>Empfohlene E-Mail-Struktur</strong>
            <ol style={listStyle}>
              <li>Betreff</li>
              <li>Höfliche Anrede</li>
              <li>Interesse an der Wohnung</li>
              <li>Terminanfrage oder Terminvorschlag</li>
              <li>Bitte um Bestätigung und Kontaktdaten</li>
              <li>Höflicher Schluss</li>
            </ol>
          </div>

          <NoteBox tone="green">
            Verwenden Sie mindestens zwei höfliche Strukturen, zum Beispiel: „Könnten Sie mir einen Termin anbieten?“ und „Wäre Samstag um 14 Uhr möglich?“
          </NoteBox>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      ) : null}

      {activeTab === "lesen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text und beantworten Sie alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2A, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for every question.</p>
          </WorkbookTaskCard>

          <h3 style={{ margin: 0 }}>Eine Wohnungsbesichtigung in der Innenstadt</h3>
          <p style={{ margin: 0, lineHeight: 1.75 }}>Anna hatte schon lange nach einer passenden Wohnung in der Innenstadt gesucht. Als sie endlich eine Anzeige für eine vielversprechende Wohnung fand, zögerte sie nicht und rief sofort den Vermieter an. Der Vermieter vereinbarte mit Anna einen Termin für den kommenden Samstag um 14:00 Uhr.</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>Die Wohnung befand sich in einem alten, aber gut erhaltenen Gebäude im Herzen der Stadt. In der Nähe gab es viele Geschäfte, Restaurants und öffentliche Verkehrsmittel. Die Wohnung war hell und geräumig. Die großen Fenster ließen viel Licht herein, und die hohen Decken gaben dem Raum ein luftiges Gefühl.</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>Die Küche war modern und gut ausgestattet. Das Badezimmer hatte eine große Badewanne, was Anna besonders gefiel. Es gab auch einen kleinen Balkon mit einem schönen Blick auf die Stadt.</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>Die Miete war fair, und der Vermieter verlangte eine Kaution in Höhe von zwei Monatsmieten. Die Wohnung war ab dem ersten des nächsten Monats verfügbar. Die Mietvertragsdauer betrug mindestens ein Jahr.</p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>Am nächsten Tag rief Anna den Vermieter an und sagte ihm, dass sie die Wohnung nehmen würde. Sie vereinbarten einen weiteren Termin, um den Mietvertrag zu unterschreiben und die Kaution zu übergeben.</p>

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={readingQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      ) : null}

      {activeTab === "hoeren" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Sehen und hören Sie das Video zweimal. Beantworten Sie danach alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1C, 2B, 3A ..."
          >
            <p style={{ margin: 0 }}>Read the questions first. Listen for time, group viewings, neighbourhood, quick decisions and required documents.</p>
          </WorkbookTaskCard>

          <iframe
            src="https://www.youtube-nocookie.com/embed/x7tUQjxt5uI?rel=0&playsinline=1"
            title="B1 Day 5 Besichtigungstermin Hören"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }}
          />

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={listeningQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      ) : null}
    </>
  );
};

const config = {
  day: 5,
  chapter: "2.5",
  assignmentKey: "B1-2.5",
  workbookId: "B1Day5Besichtigungstermin",
  title: "Der Besichtigungstermin",
  subtitle: "Select Grammar, Teil 1–4, Ref or Submit. The existing Day 5 assignments are preserved inside the shared B1 workbook shell.",
  submitListening: true,
  listening: { submitRequired: true },
};

export default function B1Day5BesichtigungsterminWorkbookPage() {
  return <B1StandardWorkbookPage config={config} renderSections={B1Day5PreservedSections} />;
}
