import React, { useState } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const contentCard = {
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

const ideaGroups = [
  { title: "1. Kommunikation", items: ["Offen reden können", "Zuhören", "Probleme gemeinsam lösen", "Regelmäßiger Austausch"] },
  { title: "2. Vertrauen und Ehrlichkeit", items: ["Treue", "Keine Geheimnisse", "Ehrliche Meinungen teilen", "Verlässlichkeit"] },
  { title: "3. Gemeinsame Interessen", items: ["Hobbys teilen", "Gemeinsame Unternehmungen", "Gemeinsamer Humor", "Musik, Filme oder Sport"] },
  { title: "4. Respekt und Unterstützung", items: ["Den anderen akzeptieren", "Unterstützung im Alltag", "Verständnis zeigen", "Keine Kontrolle oder Eifersucht"] },
  { title: "5. Zukunftspläne", items: ["Zusammenleben", "Familie planen", "Gemeinsame Ziele", "Vertrauen in die gemeinsame Zukunft"] },
];

const profileQuestions = [
  "Wie heißen Sie? Geben Sie einen fiktiven Namen für Ihr Profil an.",
  "Wie alt sind Sie? Wählen Sie ein Alter für Ihr Profil.",
  "Wo wohnen Sie? Nennen Sie eine Stadt oder Region.",
  "Welche Hobbys und Interessen haben Sie? Nennen Sie mindestens drei.",
  "Was suchen Sie in einer Beziehung?",
  "Welche Eigenschaften schätzen Sie an einem Partner? Nennen Sie mindestens drei.",
  "Was möchten Sie über sich selbst mitteilen? Schreiben Sie einen kurzen Absatz.",
  "Gibt es etwas, das Ihr idealer Partner unbedingt haben sollte?",
  "Wie würden Sie Ihre Persönlichkeit in drei Worten beschreiben?",
  "Was sind Ihre Lieblingsaktivitäten am Wochenende? Nennen Sie mindestens zwei.",
  "Wie wichtig ist Ihnen die Kommunikation in einer Beziehung? Warum?",
  "Haben Sie Haustiere? Möchten Sie, dass Ihr Partner auch Haustiere hat?",
  "Welche Musik hören Sie gerne?",
  "Wie stehen Sie zu Reisen? Welche Orte möchten Sie besuchen?",
  "Was sind Ihre Lebensziele oder Träume für die Zukunft?",
];

const relationshipQuestions = [
  { stem: "Was steht für die meisten Menschen in einer Beziehung an erster Stelle?", options: ["A) Ein hohes Einkommen des Partners", "B) Vertrauen und Ehrlichkeit", "C) Dieselben Hobbys zu haben"] },
  { stem: "Warum ist ständige Eifersucht laut Text schädlich?", options: ["A) Weil man dadurch weniger Freizeit hat.", "B) Weil sie das Vertrauen und die Basis der Beziehung zerstört.", "C) Weil man dadurch keine gemeinsamen Freunde findet."] },
  { stem: "Wie sollten Paare laut Artikel mit Problemen umgehen?", options: ["A) Sie sollten Konflikte verschweigen und abwarten.", "B) Sie sollten Probleme direkt und offen ansprechen.", "C) Sie sollten sofort den Partner wechseln."] },
  { stem: "Was bedeutet Unterstützung in einer Partnerschaft?", options: ["A) Dass man dem Partner alle Entscheidungen abnimmt.", "B) Dass man den Partner bei seinen Zielen ermutigt und in schweren Zeiten beisteht.", "C) Dass man nur noch dieselbe Arbeit ausübt."] },
  { stem: "Warum ist Freiraum in einer Beziehung wichtig?", options: ["A) Damit jeder eigene Hobbys und persönliche Kontakte pflegen kann.", "B) Weil man sonst keine gemeinsame Wohnung mieten kann.", "C) Damit man den Partner nicht mehr wiedersehen muss."] },
  { stem: "Was kann passieren, wenn ein Paar ausschließlich alles zusammen macht?", options: ["A) Die Beziehung wird automatisch perfekt.", "B) Es kann auf Dauer zu Spannungen führen.", "C) Man spart sehr viel Geld."] },
  { stem: "Was hält eine Beziehung laut dem letzten Abschnitt lebendig?", options: ["A) Ein gewisses Maß an Eigenständigkeit neben gemeinsamen Interessen.", "B) Täglich stundenlange Diskussionen über die Zukunft.", "C) Das Aufgeben aller persönlichen Freundschaften."] },
];

const bewerbungQuestions = [
  { stem: "Wo findet man Stellenanzeigen nicht?", options: ["A) auf Webseiten", "B) in Zeitungen", "C) im Internet", "D) im Supermarkt"] },
  { stem: "Was steht zu Beginn einer Bewerbung?", options: ["A) Schule, Ausbildung, Kurse", "B) Name, Alter, Wohnort", "C) Berufserfahrung", "D) Interessen"] },
  { stem: "Was gehört noch zu einer Bewerbung?", options: ["A) Kopie des Reisepasses", "B) Brief der Eltern", "C) Absage der letzten Bewerbung", "D) Zeugnisse und Anschreiben"] },
  { stem: "Was passiert bei einem Bewerbungsgespräch?", options: ["A) Man lernt den Arbeitgeber kennen.", "B) Man muss eine Zeit lang zur Probe arbeiten.", "C) Man lernt die Kollegen kennen.", "D) Man bekommt Hilfe bei der Arbeitssuche."] },
  { stem: "Was passiert, wenn man eine Absage bekommt?", options: ["A) Man muss eine Stellenanzeige schreiben.", "B) Man muss eine neue Ausbildung machen.", "C) Man kann sich bei der nächsten offenen Stelle bewerben.", "D) Man bekommt ein Zeugnis."] },
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
      <div key={question.stem} style={contentCard}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const B1Day22PreservedSections = ({ activeTab, prepared, setPreparedFor }) => {
  const reading = getB1ReadingTask(22);
  const writing = getB1WritingTask(22);
  const mark = setPreparedFor;
  return (
    <>
{activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Was ist dir in einer Beziehung besonders wichtig und warum?"
            practiceOnly
            submissionNote="Prepare a 90–120 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Sprich über Kommunikation, Vertrauen, gemeinsame Interessen, Respekt, Unterstützung und Zukunftspläne. Begründe deine Prioritäten mit Beispielen.
            </p>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>Zentrales Thema: Beziehung und Werte</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {ideaGroups.map((group) => (
              <div key={group.title} style={contentCard}>
                <strong>{group.title}</strong>
                <ul style={listSpacing}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 style={sectionTitle}>Sprechthemen zur Partnersuche und Beziehung</h3>
          <p style={{ margin: 0 }}>Create a fictional profile and answer all questions for pair or group practice.</p>
          <ol style={listSpacing}>{profileQuestions.map((question) => <li key={question}>{question}</li>)}</ol>

          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li>Das Thema Beziehung und Werte kurz vorstellen.</li>
            <li>Zwei oder drei besonders wichtige Werte nennen.</li>
            <li>Erklären, warum diese Werte wichtig sind.</li>
            <li>Ein Beispiel aus dem Alltag oder aus einer Beobachtung geben.</li>
            <li>Die eigene Meinung zusammenfassen.</li>
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
            title={writing.title}
            submissionNote={writing.submissionNote}
          >
            <p style={{ margin: 0 }}>{writing.instructions}</p>
          </WorkbookTaskCard>

          <div style={contentCard}>
            <strong>Meinung von Maria</strong>
            <p style={{ margin: 0 }}>
              Ich finde, dass die Partnersuche heutzutage durch das Internet viel einfacher geworden ist. Man hat die Möglichkeit, viele verschiedene Menschen kennenzulernen und schnell herauszufinden, ob man gemeinsame Interessen hat. Allerdings denke ich, dass es auch schwierig sein kann, weil viele Leute sich online anders präsentieren, als sie wirklich sind. Manchmal vermisse ich die Zeiten, als man sich noch persönlich kennenlernen musste, um eine Beziehung aufzubauen.
            </p>
          </div>

          <div style={contentCard}>
            <strong>Writing points</strong>
            <ul style={listSpacing}>
              <li>Sagen Sie, ob Sie Maria zustimmen.</li>
              <li>Nennen Sie Vorteile der Partnersuche im Internet.</li>
              <li>Nennen Sie mögliche Risiken oder Nachteile.</li>
              <li>Vergleichen Sie Online-Kontakt und persönliches Kennenlernen.</li>
              <li>Geben Sie ein Beispiel und formulieren Sie einen Schluss.</li>
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

          <article style={contentCard}>
            <h3 style={{ margin: 0 }}>Magazin „Partnerschaft & Leben“ – Was macht eine gute Beziehung aus?</h3>
            <p>Für eine funktionierende und glückliche Beziehung gibt es kein allgemeingültiges Rezept. Jede Partnerschaft ist unterschiedlich, doch in Umfragen nennen viele Menschen ähnliche Werte, wenn sie gefragt werden, was ihnen bei einem Partner oder einer Partnerin besonders wichtig ist.</p>
            <p>An erster Stelle steht für die meisten Befragten das Vertrauen. Ohne Vertrauen und Ehrlichkeit kann eine Beziehung auf Dauer nicht bestehen. Wer ständig eifersüchtig ist oder den Partner kontrollieren möchte, zerstört die Basis des Zusammenlebens. Dazu gehört auch eine offene Kommunikation: Probleme und Missverständnisse sollten direkt angesprochen werden, anstatt Konflikte zu verschweigen.</p>
            <p>Ein weiterer zentraler Punkt ist gegenseitiger Respekt und Unterstützung. In einer Partnerschaft ist es wichtig, die Meinung des anderen zu schätzen und sich gegenseitig bei beruflichen oder persönlichen Zielen zu ermutigen. Auch in schwierigen Lebensphasen sollte man füreinander da sein.</p>
            <p style={{ margin: 0 }}>Gleichzeitig betonen Experten, wie wichtig Freiraum und Unabhängigkeit sind. Auch in einer festen Beziehung sollte jeder Partner eigene Hobbys pflegen, Freundschaften außerhalb der Partnerschaft erhalten und Zeit für sich selbst haben. Wenn man alles nur noch gemeinsam unternimmt, kann das auf Dauer zu Spannungen führen. Gemeinsame Interessen und Humor verbinden zwar, aber ein gewisses Maß an Eigenständigkeit hält die Beziehung lebendig.</p>
          </article>

          <QuestionList questions={relationshipQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

{activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text Bewerbung und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1D, 2B, 3D …"
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for every question.</p>
          </WorkbookTaskCard>

          <article style={contentCard}>
            <h3 style={{ margin: 0 }}>Bewerbung</h3>
            <p style={{ margin: 0 }}>Der erste Schritt bei der Jobsuche ist, eine passende Stellenanzeige zu finden. Sehr viele offene Stellen kann man im Internet finden. Es gibt viele Webseiten, die diese Stellen sammeln. Dort kann man sich meistens direkt bewerben. Viele dieser Seiten sind auch für bestimmte Gruppen, zum Beispiel Studierende, Journalisten oder Handwerker. Stellenanzeigen findet man aber auch in Zeitungen.</p>
            <p style={{ margin: 0 }}>Bei der Bewerbung gibt es einiges zu beachten. Zu Beginn stehen die wichtigsten Daten: Name, Alter, Wohnort, Nationalität und oft auch ein Bewerbungsfoto. Darunter schreibt man die Ausbildung. Sehr wichtig sind auch Berufserfahrung, Interessen und besondere Fähigkeiten wie Sprachen, Kurse oder Computerkenntnisse. Zu einer Bewerbung gehören neben dem Lebenslauf auch ein Anschreiben und Zeugnisse.</p>
            <p style={{ margin: 0 }}>Wer Glück hat, bekommt eine Einladung zu einem Vorstellungsgespräch. Dort lernt man den Arbeitgeber kennen, erfährt mehr über die Arbeit und kann sich selbst präsentieren. Wer eine Absage bekommt, versucht es mit der nächsten offenen Stelle.</p>
          </article>

          <QuestionList questions={bewerbungQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}
    </>
  );
};

const config = {
  day: 22,
  chapter: "7.22",
  assignmentKey: "B1-7.22",
  workbookId: "B1Day22BeziehungWichtig",
  title: "Was ist dir in einer Beziehung wichtig?",
  subtitle: "Select Grammar, Teil 1–4, Ref or Submit. The existing Day 22 assignments are preserved inside the shared B1 workbook shell.",
  submitListening: true,
  listening: { submitRequired: true },
};

export default function B1Day22BeziehungWichtigWorkbookPage() {
  return <B1StandardWorkbookPage config={config} renderSections={B1Day22PreservedSections} />;
}
