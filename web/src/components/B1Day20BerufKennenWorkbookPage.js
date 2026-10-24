import React, { useState } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import B1ProtectedAudioPlayer from "./B1ProtectedAudioPlayer";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";
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
  gap: 7,
  lineHeight: 1.7,
};

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const professionGroups = [
  {
    title: "1️⃣ Beliebte Berufe (Popular Professions)",
    items: [
      "Arzt/Ärztin (Doctor)",
      "Ingenieur/in (Engineer)",
      "Lehrer/in (Teacher)",
      "Kaufmann/Kauffrau (Businessperson)",
      "Handwerker/in (Craftsperson)",
      "Künstler/in (Artist)",
      "IT-Spezialist/in (IT Specialist)",
    ],
  },
  {
    title: "2️⃣ Ausbildung & Studium (Education & Studies)",
    items: [
      "Schule und Abschluss – Welche Schulbildung braucht man?",
      "Universität/Fachhochschule – Muss man studieren?",
      "Berufsausbildung – Gibt es eine Ausbildung oder Lehre?",
      "Praktische Erfahrung – Muss man ein Praktikum machen?",
    ],
  },
  {
    title: "3️⃣ Wichtige Qualifikationen (Important Qualifications)",
    items: [
      "Soft Skills – Teamarbeit, Kommunikation und Kreativität",
      "Hard Skills – technische Kenntnisse, Sprachkenntnisse und IT-Kenntnisse",
      "Zertifikate und Diplome – Welche Nachweise braucht man?",
    ],
  },
  {
    title: "5️⃣ Herausforderungen und Chancen (Challenges & Opportunities)",
    items: [
      "Lange Ausbildungszeiten – Manche Berufe erfordern viele Jahre Studium.",
      "Kosten für Studium oder Ausbildung – Gibt es finanzielle Unterstützung?",
      "Arbeitsmarkt – Gibt es viele offene Stellen in diesem Bereich?",
      "Aufstiegsmöglichkeiten – Kann man in diesem Beruf Karriere machen?",
    ],
  },
];

const readingQuestions = [
  { stem: "Warum ist der Beruf des Reiseleiters für viele attraktiv?", options: ["A) Weil man von Anfang an sehr viel Geld verdient.", "B) Weil man Reisen und Beruf miteinander verbinden kann.", "C) Weil die Ausbildung sehr kurz und einfach ist."] },
  { stem: "Wie ist die Ausbildung zum Reiseleiter in Deutschland geregelt?", options: ["A) Es gibt eine dreijährige staatliche Berufsausbildung.", "B) Man muss zwingend ein Studium der Geografie vorweisen.", "C) Es gibt keine staatlich vorgeschriebene, feste Ausbildung."] },
  { stem: "Welche Qualifikation wird von vielen Reiseveranstaltern geschätzt?", options: ["A) Ein Führerschein für Busse und Lkws.", "B) Ein Studium oder eine Ausbildung im Bereich Tourismus, Sprachen oder Kultur.", "C) Langjährige Erfahrung als Hotelmanager."] },
  { stem: "Welche Sprachkenntnisse werden im Text als besonders wichtig genannt?", options: ["A) Ausschließlich Deutschkenntnisse auf Muttersprachenniveau.", "B) Fließendes Englisch und nach Möglichkeit die Sprache des Reiselandes.", "C) Mindestens vier verschiedene Fremdsprachen perfekt."] },
  { stem: "Welche Eigenschaft muss ein Reiseleiter bei Problemen zeigen?", options: ["A) Er muss ruhige und schnelle Entscheidungen treffen können.", "B) Er muss das Geld für die Reise sofort zurückzahlen.", "C) Er muss die Gruppe bitten, das Problem selbst zu lösen."] },
  { stem: "Was lernen Teilnehmer in den Vorbereitungskursen der Agenturen?", options: ["A) Wie man Reisebusse repariert und pflegt.", "B) Themen wie Rhetorik, Erste Hilfe und Reiserecht.", "C) Wie man ein eigenes Reiseunternehmen gründet."] },
  { stem: "Wie starten Anfänger meistens in den Beruf?", options: ["A) Sie leiten sofort große Gruppen auf Fernreisen.", "B) Sie arbeiten zuerst als Lehrer an einer Sprachschule.", "C) Sie sammeln Erfahrung auf kürzeren Fahrten."] },
];

const listeningQuestions = [
  { stem: "Welchen Schulabschluss braucht man mindestens?", options: ["A) Hauptschulabschluss", "B) Mittleren Abschluss", "C) Abitur"] },
  { stem: "Wie lange dauert die Ausbildung meistens?", options: ["A) Ein bis zwei Jahre", "B) Drei bis vier Jahre", "C) Sechs Jahre"] },
  { stem: "Richtig oder falsch: In allen Bundesländern bekommt man Geld in der Ausbildung.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Was macht man im Beruf?", options: ["A) Man bastelt und singt mit den Kindern", "B) Man arbeitet nur im Büro", "C) Man repariert Spielzeug"] },
  { stem: "Welche Eigenschaft ist laut Ben wichtig?", options: ["A) Schnell laufen", "B) Geduld", "C) Gut kochen"] },
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
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const B1Day20PreservedSections = ({ activeTab, prepared, setPreparedFor }) => {
  const reading = getB1ReadingTask(20);
  const writing = getB1WritingTask(20);
  const mark = setPreparedFor;
  return (
    <>
{activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Beruf kennen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?"
            practiceOnly
            submissionNote="Prepare a clear 90–120 second answer for class. Teil 1 is group practice and is not submitted."
          >
            <p style={{ margin: 0 }}>
              Wähle einen Beruf, erkläre den Ausbildungsweg, nenne wichtige Qualifikationen und beschreibe persönliche Erfahrungen sowie die Situation in deinem Heimatland.
            </p>
          </WorkbookTaskCard>

          <div style={questionCardStyle}>
            <strong>📝 Zentrales Thema: Wie wird man ...?</strong>
            <span>(How to Become ...?)</span>
            <p style={{ margin: 0 }}>
              In this chapter, we will engage in group discussions about the topics below. After the discussion, use the main question and speaking structure to prepare your answer.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {professionGroups.map((group) => (
              <article key={group.title} style={questionCardStyle}>
                <strong>{group.title}</strong>
                <ul style={listSpacing}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>

          <div style={questionCardStyle}>
            <strong>4️⃣ Karriereweg (Career Path)</strong>
            <p style={{ margin: 0 }}>
              Schulabschluss → Ausbildung/Studium → Berufseinstieg → Weiterbildung → Karriereaufstieg
            </p>
          </div>

          <div style={{ ...questionCardStyle, background: "#eff6ff", borderColor: "#bfdbfe" }}>
            <strong>Beispiel: Wie wird man Arzt oder Ärztin?</strong>
            <ol style={listSpacing}>
              <li>Abitur machen</li>
              <li>Medizinstudium absolvieren</li>
              <li>Staatsexamen bestehen</li>
              <li>Facharztausbildung machen</li>
              <li>Berufserfahrung sammeln</li>
            </ol>
          </div>

          <div style={questionCardStyle}>
            <strong>6️⃣ Fragen zum Nachdenken (Discussion Questions)</strong>
            <ul style={listSpacing}>
              <li>Welcher Beruf interessiert dich und warum?</li>
              <li>Welche Ausbildung oder Qualifikationen brauchst du für deinen Traumberuf?</li>
              <li>Was ist wichtiger: Erfahrung oder Ausbildung?</li>
              <li>Glaubst du, dass lebenslanges Lernen wichtig ist?</li>
            </ul>
          </div>

          <div style={{ ...questionCardStyle, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <strong>Hauptfrage</strong>
            <p style={{ margin: 0 }}>
              Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?
            </p>
          </div>

          <h3 style={sectionTitle}>Nutze diese Struktur</h3>
          <ol style={listSpacing}>
            <li><strong>Begrüßung und Vorstellung des Themas</strong></li>
            <li><strong>Inhalt und Struktur</strong> – Beruf, Ausbildung, Qualifikationen und Karriereweg erklären</li>
            <li><strong>Persönliche Erfahrung</strong> – eigenes Beispiel oder eigene Ziele nennen</li>
            <li><strong>Situation in deinem Heimatland</strong> – Ausbildung und Arbeitsmarkt vergleichen</li>
          </ol>

          <div style={questionCardStyle}>
            <strong>Useful phrases</strong>
            <ul style={listSpacing}>
              <li>Heute spreche ich darüber, wie man … wird.</li>
              <li>Für diesen Beruf braucht man …</li>
              <li>Zuerst muss man …, danach kann man …</li>
              <li>Wichtige Qualifikationen sind …</li>
              <li>Persönlich habe ich die Erfahrung gemacht, dass …</li>
              <li>In meinem Heimatland ist der Ausbildungsweg ähnlich/anders, weil …</li>
            </ul>
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
            title={writing.title}
            submissionNote={writing.submissionNote}
          >
            <p style={{ margin: 0 }}>{writing.instructions}</p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing about education and qualifications"
            loading="lazy"
            style={tabImageStyle}
          />

          <div style={questionCardStyle}>
            <strong>Beitrag von Felix</strong>
            <p style={{ margin: 0 }}>
              Eine gute Ausbildung hilft, einen guten Job zu finden. Mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Beantworten Sie diese Inhaltspunkte</strong>
            <ul style={listSpacing}>
              <li>Stimmen Sie Felix zu oder nicht?</li>
              <li>Warum sind Ausbildung und Qualifikationen wichtig oder nicht wichtig?</li>
              <li>Was ist wichtiger: Ausbildung oder praktische Erfahrung?</li>
              <li>Nennen Sie ein Beispiel aus Ihrem Leben oder Heimatland.</li>
              <li>Formulieren Sie einen klaren Schluss.</li>
            </ul>
          </div>

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
            title={reading.title}
            submissionNote={reading.submissionNote}
          >
            <p style={{ margin: 0 }}>{reading.instructions}</p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Reading a blog entry for B1 comprehension"
            loading="lazy"
            style={tabImageStyle}
          />

          <article style={questionCardStyle}>
            <h3 style={{ margin: 0 }}>Berufsbild · Wie wird man eigentlich Reiseleiter/in?</h3>
            <p style={{ margin: 0, color: "#475569" }}>Magazin „Beruf & Zukunft“</p>
            <p>Viele Menschen träumen davon, ihr Hobby zum Beruf zu machen und fremde Länder zu bereisen. Der Beruf des Reiseleiters klingt für viele nach Urlaub, doch der Arbeitsalltag ist anspruchsvoll und erfordert hohe Flexibilität. Aber wie wird man überhaupt Reiseleiter oder Reiseleiterin?</p>
            <p>In Deutschland gibt es keine klassische, staatlich geregelte Berufsausbildung für Reiseleiter. Das bedeutet, dass der Zugang zu diesem Beruf nicht gesetzlich geschützt ist und man keine mehrjährige Lehre absolvieren muss. Viele Reiseveranstalter suchen Bewerber mit einer Ausbildung im Tourismusbereich oder einem abgeschlossenen Studium, beispielsweise in Geschichte, Geografie, Kulturwissenschaften oder Sprachen.</p>
            <p>Wichtiger als ein bestimmter Studienabschluss sind jedoch praktische Fähigkeiten. Gute Sprachkenntnisse – vor allem fließendes Englisch und idealerweise die Landessprache des Zielgebiets – sind eine grundlegende Voraussetzung. Zudem muss ein Reiseleiter organisatorisches Talent besitzen, stressresistent sein und gut mit Menschen umgehen können. Wenn vor Ort Probleme auftreten, etwa wenn ein Bus Verspätung hat oder ein Hotelzimmer nicht bereitsteht, muss der Reiseleiter schnell und ruhig eine Lösung finden.</p>
            <p style={{ margin: 0 }}>Wer als Reiseleiter arbeiten möchte, nimmt häufig an speziellen Schulungen und Vorbereitungskursen von Reiseagenturen teil. Diese Kompaktkurse dauern meist einige Wochen und vermitteln Kenntnisse in Rhetorik, Erste Hilfe, Gruppenführung und Reiserecht. Anschließend beginnt man oft als Nachwuchskraft auf kürzeren Fahrten, bevor man eigenverantwortlich große Reisegruppen im Ausland betreut.</p>
          </article>

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={readingQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

{activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Hören · Ausbildung und Beruf"
            submissionNote="Submit only the five answer letters, for example: 1B, 2B, 3B."
          >
            <p style={{ margin: 0 }}>
              Hören Sie aufmerksam zu und wählen Sie bei jeder Frage die richtige Lösung.
            </p>
          </WorkbookTaskCard>

          <B1ProtectedAudioPlayer
            day={20}
            audioKey="b1/day-20/day-20.mp3"
            title="B1 Day 20 · Hören"
          />

          <QuestionList questions={listeningQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}
    </>
  );
};

const config = {
  day: 20,
  chapter: "6.20",
  assignmentKey: "B1-6.20",
  workbookId: "B1Day20BerufKennen",
  title: "Wie wird man …?",
  subtitle: "Select Grammar, Teil 1–4, Ref or Submit. Teil 3 Lesen and Teil 4 Hören are graded assignments.",
  submitListening: true,
  listening: { submitRequired: true, audioKey: "b1/day-20/day-20.mp3" },
};

export default function B1Day20BerufKennenWorkbookPage() {
  return <B1StandardWorkbookPage config={config} renderSections={B1Day20PreservedSections} />;
}
