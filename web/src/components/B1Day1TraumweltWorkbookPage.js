import React, { useState } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import B1WritingWorkspace from "./B1WritingWorkspace";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
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
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const mobileTextStyle = {
  margin: 0,
  lineHeight: 1.75,
  fontSize: "clamp(.94rem, 3.7vw, 1rem)",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const writingTabsWrapStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
  padding: 6,
  border: "1px solid #dbeafe",
  borderRadius: 14,
  background: "#eff6ff",
};

const writingSubTabButtonStyle = (active) => ({
  border: active ? "1px solid #1d4ed8" : "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "12px 10px",
  minHeight: 44,
  background: active ? "#1d4ed8" : "#fff",
  color: active ? "#fff" : "#1e293b",
  fontWeight: 800,
  fontSize: "clamp(.92rem, 3.8vw, 1rem)",
  cursor: "pointer",
});

const writingPanelStyle = {
  ...questionCardStyle,
  border: "1px solid #bfdbfe",
  background: "#f8fbff",
  gap: 12,
};

const templateTextStyle = {
  ...mobileTextStyle,
  whiteSpace: "pre-line",
};

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const audioPreviewStyle = {
  width: "100%",
  minHeight: 220,
  border: 0,
  borderRadius: 10,
};

const brainMapBranches = [
  {
    title: "Traumberuf (Dream Job)",
    items: ["Arzt", "Lehrer", "Unternehmer", "Schauspieler", "IT-Spezialist", "selbstständig arbeiten", "im Ausland arbeiten"],
  },
  {
    title: "Traumreise (Dream Trip)",
    items: ["Japan", "Australien", "Kanada", "Brasilien", "Abenteuerreise", "Luxusurlaub", "Weltreise", "Natur entdecken", "Kultur erleben", "Backpacking"],
  },
  {
    title: "Traumhaus (Dream House)",
    items: ["am Meer", "in den Bergen", "moderne Villa", "kleines gemütliches Haus", "Garten und Pool", "nachhaltiges Haus"],
  },
  {
    title: "Zukunftsträume (Future Dreams)",
    items: ["Familie gründen", "Karriere machen", "viel Geld verdienen", "in einem anderen Land leben", "ein eigenes Unternehmen gründen", "gesund bleiben"],
  },
  {
    title: "Traumhobbys und Freizeit (Dream Hobbies and Leisure Activities)",
    items: ["Extremsport", "Musikinstrumente lernen", "ein Buch schreiben", "reisen", "kochen lernen", "Kunst und Malerei"],
  },
];

const lesenQuestions = [
  {
    stem: "Was glaubten die Menschen in der Antike über Träume?",
    options: ["a) Dass sie von Göttern gesendet wurden", "b) Dass sie bedeutungslos sind", "c) Dass sie zufällige Gedankenspiele sind", "d) Dass sie immer Albträume sind"],
  },
  {
    stem: "Wer ist der Begründer der psychoanalytischen Traumdeutung?",
    options: ["a) Carl Gustav Jung", "b) Sigmund Freud", "c) Albert Einstein", "d) Charles Darwin"],
  },
  {
    stem: "Was könnte laut Freud ein Traum von fallenden Zähnen bedeuten?",
    options: ["a) Angst vor dem Älterwerden", "b) Freude am Leben", "c) Wunsch nach Reisen", "d) Hunger"],
  },
  {
    stem: "Was versteht man unter dem kollektiven Unbewussten nach Jung?",
    options: ["a) Persönliche Erinnerungen", "b) Gemeinsames psychologisches Erbe der Menschheit", "c) Wissenschaftliche Theorien", "d) Zufällige Gedanken"],
  },
  {
    stem: "Wie sehen viele moderne Wissenschaftler Träume?",
    options: ["a) Als Botschaften aus einer anderen Welt", "b) Als Gedächtnisverarbeitung", "c) Als Vorhersagen der Zukunft", "d) Als bedeutungslose Bilder"],
  },
  {
    stem: "Was könnte ein Traum laut Jung enthalten?",
    options: ["a) Persönliche Erinnerungen", "b) Universelle Symbole wie der Held oder die Mutter", "c) Wissenschaftliche Theorien", "d) Zufällige Gedanken"],
  },
  {
    stem: "Was bleibt trotz aller wissenschaftlichen Fortschritte über Träume?",
    options: ["a) Ein völlig verstandenes Gebiet", "b) Ein geheimnisvolles und faszinierendes Gebiet", "c) Ein bedeutungsloses Phänomen", "d) Eine exakt erklärte Tatsache"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was hat Friedrich August Kekulé in einem Traum erkannt?",
    options: ["a) Die Struktur des Benzolmoleküls", "b) Die Lösung für ein mathematisches Problem", "c) Eine neue Art von Medikament", "d) Die Idee für einen Roman"],
  },
  {
    stem: "Was soll Mary Shelley in einem Traum gehabt haben?",
    options: ["a) Die Idee für \"Frankenstein\"", "b) Die Lösung für ein chemisches Problem", "c) Eine neue Erfindung", "d) Die Idee für ein Gemälde"],
  },
  {
    stem: "Was können Albträume verursachen?",
    options: ["a) Angst und Unwohlsein", "b) Freude und Motivation", "c) Kreative Ideen", "d) Neue Erfindungen"],
  },
  {
    stem: "Was ist luzides Träumen?",
    options: ["a) Wenn man im Traum bewusst ist, dass man träumt", "b) Wenn man nie träumt", "c) Wenn man in Träumen nur Schwarz-Weiß sieht", "d) Wenn man sich an keinen Traum erinnern kann"],
  },
  {
    stem: "In welcher Schlafphase sind die Träume am intensivsten?",
    options: ["a) In der REM-Phase", "b) In der Tiefschlafphase", "c) In der Leichtschlafphase", "d) In der Einschlafphase"],
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

const B1Day1PreservedSections = ({ activeTab, prepared, setPreparedFor }) => {
  const mark = setPreparedFor;
  return (
    <>
{activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Was ist dein Traumberuf und warum?"
            practiceOnly
            submissionNote="Prepare a 60–90 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Nenne deinen Traumberuf, erkläre mindestens <strong>zwei Gründe</strong>, beschreibe wichtige Fähigkeiten und sage, wie du dieses Ziel erreichen möchtest.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
            alt="Students discussing dream jobs and future plans"
            loading="lazy"
            style={tabImageStyle}
          />

          <h3 style={sectionTitle}>Brain Map: Traumwelt</h3>
          <p style={{ margin: 0, color: "#475569" }}>
            Use this supporting material to collect ideas before answering the Question of the Day.
          </p>
          <ol style={listSpacing}>
            <li><strong>Central Topic:</strong> Write <strong>„Traumwelt“</strong> in the center of your brain map.</li>
            <li><strong>Main Branches:</strong> Create five main branches from the central topic.</li>
            <li><strong>Sub-Branches:</strong> Expand each branch with examples and ideas.</li>
          </ol>

          <h3 style={sectionTitle}>Example Brain Map</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {brainMapBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>
                  {branch.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li><strong>Begrüßung:</strong> „Hallo, ich heiße ...“ / „Guten Tag!“</li>
            <li><strong>Thema vorstellen:</strong> „Heute spreche ich über meinen Traumberuf.“</li>
            <li><strong>Dein Traumberuf:</strong> „Mein Traumberuf ist ...“ / „Ich möchte ... werden.“</li>
            <li><strong>Begründung:</strong> „Ich finde diesen Beruf interessant, weil ...“</li>
            <li><strong>Plan:</strong> „Um dieses Ziel zu erreichen, möchte ich ...“</li>
            <li><strong>Abschluss:</strong> „Danke fürs Zuhören!“</li>
          </ol>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

{activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Ist persönlicher Kontakt im Traumberuf wichtiger als flexible Arbeit im Homeoffice?"
            submissionNote="Write approximately 80 words and submit the finished text through the Submit tab."
          >
            <ol style={listSpacing}>
              <li>Sagen Sie, ob persönlicher Kontakt im Traumberuf für Sie wichtig ist.</li>
              <li>Nennen Sie einen Vorteil oder Nachteil von Homeoffice.</li>
              <li>Begründen Sie Ihre Meinung.</li>
            </ol>
          </WorkbookTaskCard>

          <B1WritingWorkspace
            writingContext={{
              level: "B1",
              courseLevel: "B1",
              day: 1,
              lessonId: "B1-day-1",
              workbookId: "B1-day-1",
              writingTaskId: "B1-day-1-teil-2-writing",
              taskTitle: "Ist persönlicher Kontakt im Traumberuf wichtiger als flexible Arbeit im Homeoffice?",
              taskPoints: [
                "Sagen Sie, ob persönlicher Kontakt im Traumberuf für Sie wichtig ist.",
                "Nennen Sie einen Vorteil oder Nachteil von Homeoffice.",
                "Begründen Sie Ihre Meinung.",
              ],
              draftPlaceholder: "Liebe Forum-Mitglieder,\n\nich bin der Meinung, dass ...",
            }}
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text und beantworten Sie alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3C ..."
          >
            <p style={{ margin: 0 }}>
              Read the complete text first. Then choose one answer, A–D, for every question.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80"
            alt="Night sky and book for a reading exercise about dreams"
            loading="lazy"
            style={tabImageStyle}
          />

          <h3 style={sectionTitle}>Traumdeutung und ihre Bedeutung</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Träume faszinieren die Menschheit seit Jahrtausenden. In vielen Kulturen werden Träume als Botschaften aus einer anderen Welt betrachtet. In der Antike glaubte man, dass Träume von den Göttern gesendet wurden und wichtige Hinweise auf das Schicksal geben konnten. Auch heute noch versuchen viele Menschen, die Bedeutung ihrer Träume zu entschlüsseln.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Es gibt verschiedene Ansätze zur Traumdeutung. Der bekannteste ist wahrscheinlich die psychoanalytische Traumdeutung nach Sigmund Freud. Freud glaubte, dass Träume eine Art Ventil für unterdrückte Wünsche und Ängste sind. Seiner Meinung nach sind viele Traumbilder symbolisch und müssen interpretiert werden, um ihre wahre Bedeutung zu verstehen. Zum Beispiel könnte ein Traum von fallenden Zähnen auf Angst vor dem Älterwerden oder Machtverlust hinweisen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein weiterer Ansatz ist die analytische Traumdeutung nach Carl Gustav Jung. Jung sah Träume als Ausdruck des kollektiven Unbewussten, einer Art gemeinsamen psychologischen Erbes der Menschheit. Für ihn waren Träume voller Archetypen, universeller Symbole wie der Held oder die Mutter, die tief in der menschlichen Psyche verwurzelt sind. Jung glaubte, dass Träume uns helfen können, unser wahres Selbst zu erkennen und persönliche Probleme zu lösen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In der modernen Traumforschung gibt es auch wissenschaftliche Erklärungen für Träume. Viele Wissenschaftler sehen Träume als eine Art Gedächtnisverarbeitung. Während wir schlafen, sortiert unser Gehirn die Erlebnisse des Tages, speichert wichtige Informationen und verwirft Unnötiges. Träume könnten also eine Nebenwirkung dieses Prozesses sein.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Unabhängig davon, welchem Ansatz man folgt, bleibt die Frage, ob Träume wirklich eine tiefere Bedeutung haben. Manche Menschen sind fest davon überzeugt, dass ihre Träume ihnen wichtige Hinweise auf ihr Leben geben. Andere sehen Träume eher als zufällige Gedankenspiele ohne besonderen Sinn. Trotz aller wissenschaftlichen Fortschritte bleibt die Welt der Träume ein geheimnisvolles und faszinierendes Gebiet. Vielleicht werden wir eines Tages genau verstehen, warum wir träumen und was unsere Träume bedeuten. Bis dahin können wir uns weiterhin von unseren Träumen inspirieren lassen und versuchen, ihre Rätsel zu lösen.
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
            title="Hören Sie den Beitrag zweimal und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3C ..."
          >
            <p style={{ margin: 0 }}>
              Read the questions first. Listen for discoveries, famous people, nightmares, lucid dreams and sleep phases.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones and laptop for listening comprehension"
            loading="lazy"
            style={tabImageStyle}
          />
          <p style={{ margin: 0 }}>
            Hören video – {" "}
            <a href="https://youtu.be/dZDgNxPWox8" target="_blank" rel="noreferrer">
              Open Hören video on YouTube
            </a>
          </p>

          <iframe
            title="Traumwelt listening exercise"
            src="https://www.youtube.com/embed/dZDgNxPWox8?rel=0"
            allow="autoplay"
            style={audioPreviewStyle}
          />

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}
    </>
  );
};

const config = {
  day: 1,
  chapter: "1.1",
  assignmentKey: "B1-1.1",
  workbookId: "B1Day1Traumwelt",
  title: "Traumwelt",
  subtitle: "Select Grammar, Teil 1–4, Ref or Submit. The existing Day 1 assignments are preserved inside the shared B1 workbook shell.",
  submitListening: true,
  listening: { submitRequired: true },
};

export default function B1Day1TraumweltWorkbookPage() {
  return <B1StandardWorkbookPage config={config} renderSections={B1Day1PreservedSections} />;
}
