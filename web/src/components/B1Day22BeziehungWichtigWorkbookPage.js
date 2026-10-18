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
          <h2 style={sectionTitle}>Teil 3 · Lesen 1 (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Beziehungen im Wandel: Online-Dating" submissionNote="Antworten unter Teil 3 abgeben: 1B, 2B, 3C.">
            <p style={{ margin: 0 }}>Empfohlene Arbeitszeit: 15 Minuten. Lesen Sie den Text und die Aufgaben 1–3. Welche Lösung (a, b oder c) ist jeweils richtig?</p>
          </WorkbookTaskCard>
          <article style={contentCard}>
            <h3 style={{ margin: 0 }}>Beziehungen im Wandel: Online-Dating</h3>
            <p style={{ margin: 0 }}>Immer mehr Menschen in Deutschland lernen ihren Partner im Internet kennen. Während früher Kontaktanzeigen in Zeitungen populär waren, nutzen heute besonders junge Erwachsene Dating-Apps auf dem Smartphone.</p>
            <p style={{ margin: 0 }}>Eine aktuelle Umfrage zeigt, dass sich fast ein Drittel aller Paare zwischen 20 und 35 Jahren online kennengelernt hat. Viele schüchterne Personen finden es einfacher, zuerst Nachrichten zu schreiben, bevor sie sich persönlich treffen. Auf diese Weise lässt sich schnell herausfinden, ob man gemeinsame Hobbys und Interessen teilt.</p>
            <p style={{ margin: 0 }}>Allerdings gibt es auch Kritik am Online-Dating. Psychologen warnen davor, dass die riesige Auswahl an Profilen dazu führen kann, dass Menschen sich schneller wieder trennen oder niemanden mehr richtig schätzen lernen. Zudem vergleichen viele Nutzer die realen Personen mit perfekten Online-Fotos und sind nach dem ersten Treffen enttäuscht. Trotzdem glauben Experten, dass digitale Plattformen auch in Zukunft die beliebteste Methode bleiben werden, um eine Beziehung einzugehen.</p>
          </article>
          <QuestionList questions={[{"stem":"Wie lernen sich viele junge Erwachsene heute kennen?","options":["a) Sie suchen meistens über klassische Anzeigen in Zeitungen.","b) Sie nutzen dafür häufig Apps auf dem Smartphone.","c) Sie treffen sich hauptsächlich auf Partys im echten Leben."]},{"stem":"Warum ist Online-Dating für schüchterne Menschen hilfreich?","options":["a) Sie müssen vor dem ersten Treffen keine Nachrichten schreiben.","b) Sie können schnell feststellen, ob sie dieselben Interessen haben.","c) Sie müssen sich nie persönlich im echten Leben treffen."]},{"stem":"Welches Problem sehen Psychologen beim Online-Dating?","options":["a) Die Auswahl an möglichen Partnern ist viel zu klein.","b) Erste persönliche Treffen verlaufen immer enttäuschend.","c) Das große Angebot kann dazu führen, dass Beziehungen schneller beendet werden."]}]} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Lesen 2 (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Zukunft der Partnerschaft: Fernbeziehung und getrenntes Wohnen" submissionNote="Geben Sie für alle sieben Aussagen jeweils A, B, C oder 0 im Teil-4-Feld ab.">
            <p style={{ margin: 0 }}>Empfohlene Bearbeitungszeit: 15 Minuten. Lesen Sie drei Expertenbeiträge (Person A, B und C). Ordnen Sie die sieben Aussagen den Personen zu. Zwei Aussagen passen zu keiner Person: Markieren Sie dann 0.</p>
            <p style={{ margin: 0 }}>Strategie: Lesen Sie zunächst die Aussagen 1–7 und markieren Sie Schlüsselbegriffe. Suchen Sie anschließend nach Synonymen und Paraphrasen in den Texten.</p>
          </WorkbookTaskCard>
          <article style={contentCard}>
            <h3 style={{ margin: 0 }}>Zukunft der Partnerschaft: Fernbeziehung und getrenntes Wohnen</h3>
            <strong>Person A: Prof. Dr. Julian Hofmann (Beziehungssoziologe)</strong>
            <p style={{ margin: 0 }}>Die Dynamik moderner Arbeitsmärkte zwingt immer mehr Paare zur beruflichen Flexibilität, woraus häufig geografische Distanzen resultieren. Digitale Medien ermöglichen zwar eine kontinuierliche Alltagskommunikation über Hunderte von Kilometern hinweg, sie ersetzen jedoch keinesfalls die verbindliche physische Präsenz. Eine Fernbeziehung kann auf Dauer nur dann bestehen, wenn beide Partner eine klare gemeinsame Perspektive für das Zusammenleben entwickeln. Fehlt dieser konkrete Zukunftshorizont, führt die zeitweise Trennung meist zu einer schleichenden Entfremdung, da reine Wortkommunikation das gemeinsame Erleben nicht dauerhaft kompensieren kann.</p>
          </article>
          <article style={contentCard}>
            <strong>Person B: Dr. Claudia Seidel (Paartherapeutin)</strong>
            <p style={{ margin: 0 }}>Die Distanz in einer Fernbeziehung birgt eine unterschätzte psychologische Gefahr: Partner neigen dazu, einander aus der Ferne zu idealisieren. Bei den seltenen Treffen am Wochenende steigt dadurch der Druck, unvergessliche Momente zu schaffen, was bei kleinsten Alltagsstörungen schnell in Enttäuschung umschlägt. Ein unterschätzter Pluspunkt liegt hingegen im Freiraum für die persönliche Entfaltung: Beide Partner behalten ihr eigenes soziales Umfeld und entgehen der Gefahr, in der Partnerschaft ihre eigene Identität aufzugeben. Dennoch erfordert dieses Modell ein außergewöhnlich hohes Maß an gegenseitigem Vertrauen.</p>
          </article>
          <article style={contentCard}>
            <strong>Person C: Markus Lindner (Autor und Journalist)</strong>
            <p style={{ margin: 0 }}>Das traditionelle Ideal der gemeinsamen Wohnung als einzig gültigem Beziehungsmodell ist längst überholt. Immer mehr Paare entscheiden sich bewusst für das Modell „Living Apart Together“ – also feste Partnerschaft in getrennten Wohnungen. Diese Lebensform bewahrt die Faszination und Leidenschaft der ersten Beziehungsphase, da der schleichende Beziehungsverschleiß durch alltägliche Routineaufgaben gar nicht erst entsteht. Man begegnet sich stets als Gast und schätzt die gemeinsam verbrachte Zeit viel bewusster. Für die individuelle Selbstbestimmung ist diese Wohnform ein echter Gewinn.</p>
          </article>
          <div style={contentCard}>
            <h3 style={{ margin: 0 }}>Aussagen (1–7)</h3>
            <p style={{ margin: 0 }}>Welche Person äußert das? Wählen Sie A, B, C oder 0 (passt zu keiner Person).</p>
            <ol style={listSpacing}>
              <li>Die Überhöhung des Partners aus der Distanz kann bei realen Begegnungen zu Konflikten und Enttäuschungen führen.</li>
              <li>Der Staat sollte Paaren in Fernbeziehungen deutliche steuerliche Vergünstigungen für Fahrtkosten gewähren.</li>
              <li>Ohne eine verbindliche Absicht zum späteren Zusammenziehen hat eine Distanzbeziehung langfristig kaum Bestand.</li>
              <li>Das Wohnen in getrennten Wohnungen schützt die Beziehung vor den negativen Folgen des Alltagstrotts.</li>
              <li>Der Hauptgrund für das Entstehen von Fernbeziehungen liegt in den Anforderungen des modernen Berufslebens.</li>
              <li>Fernbeziehungen bieten den Vorteil, dass Paare ihre finanzielle Unabhängigkeit vollständig bewahren.</li>
              <li>Das Leben auf Distanz ermöglicht es den Partnern, ihre individuelle Identität und Unabhängigkeit zu erhalten.</li>
            </ol>
          </div>
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
  subtitle: "Select Grammar, Teil 1–4, Ref or Submit. Teil 3: Online-Dating. Teil 4: Expertenbeiträge über Fernbeziehungen und getrenntes Wohnen.",
  submitListening: true,
  listening: { submitRequired: true },
};

export default function B1Day22BeziehungWichtigWorkbookPage() {
  return <B1StandardWorkbookPage config={config} renderSections={B1Day22PreservedSections} />;
}
