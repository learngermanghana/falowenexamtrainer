import React from "react";
import WritingPage from "./WritingPage";

const inferLevel = (lesson = {}) => String(lesson?.level || lesson?.courseLevel || "").trim().toUpperCase();
const inferDay = (lesson = {}) => lesson?.day || lesson?.lessonDay || null;
const inferWorkbookId = (lesson = {}) => lesson?.workbookId || lesson?.id || [lesson?.level, lesson?.day].filter(Boolean).join("-day-") || "current-workbook";
const inferLessonId = (lesson = {}) => lesson?.lessonId || lesson?.id || [lesson?.level, lesson?.day].filter(Boolean).join("-day-") || inferWorkbookId(lesson);

const B1_REFERENCE_ANSWERS = Object.freeze({
  1: Object.freeze({
    writingTitle: "Teil 2 · Beispieltext",
    writingSample: `Liebe Forum-Mitglieder,

meiner Meinung nach sind persönliche Kontakte im Traumberuf sehr wichtig. Einerseits bietet Homeoffice mehr Flexibilität, und man spart Zeit. Andererseits fehlt oft der direkte Austausch mit Kollegen. Ich möchte später als Softwareentwickler arbeiten. Einige Aufgaben könnte ich zu Hause erledigen, aber regelmäßige Treffen im Büro wären mir wichtig, weil gute Ideen oft im Team entstehen. Zusammenfassend finde ich eine Mischung aus Homeoffice und persönlicher Zusammenarbeit am besten.

Mit freundlichen Grüßen
Ama`,
    readingAnswers: "1. A · 2. B · 3. A · 4. B · 5. B · 6. B · 7. B",
    listeningAnswers: "1. A · 2. A · 3. A · 4. A · 5. A",
  }),
  2: Object.freeze({
    writingTitle: "Teil 2 · Beispiel-E-Mail",
    writingSample: `Liebe Akosua,

ich möchte dir von meiner Freundin Abena erzählen. Wir haben uns vor fünf Jahren in einem Deutschkurs kennengelernt. Unsere Freundschaft ist besonders, weil wir ehrlich miteinander sprechen und uns in schwierigen Zeiten unterstützen. Außerdem hören wir beide gern Musik und reisen manchmal zusammen. Hast du am Samstag Zeit? Wir könnten uns um 16 Uhr in einem Café treffen, damit du Abena kennenlernen kannst. Schreib mir bitte bald.

Liebe Grüße
Ama`,
    readingAnswers: "1. B · 2. B · 3. A · 4. A · 5. B · 6. B · 7. B",
    listeningAnswers: "1. A · 2. A · 3. A · 4. B · 5. B",
  }),
  3: Object.freeze({
    writingTitle: "Teil 2 · Beispiel-E-Mail",
    writingSample: `Sehr geehrte Frau Wolmer,

leider kann ich am Freitag nicht an der Präsentation über Erfolgsgeschichten teilnehmen, weil ich einen wichtigen Arzttermin habe. Bitte entschuldigen Sie mein Fehlen. Ich kann meine Präsentation gern nächste Woche nachholen.

Mit freundlichen Grüßen
Kwame Mensah`,
    readingAnswers: "1. A · 2. B · 3. C · 4. B · 5. B · 6. B · 7. B",
    listeningAnswers: "1. B · 2. B · 3. C · 4. C · 5. A",
  }),
  4: Object.freeze({
    writingTitle: "Teil 2 · Beispieltext",
    writingSample: `Meiner Meinung nach sind sowohl Online-Portale als auch persönliche Kontakte bei der Wohnungssuche hilfreich. Online findet man schnell viele Angebote und kann Preise vergleichen. Allerdings gibt es dort oft sehr viele Bewerber. Persönliche Kontakte sind manchmal erfolgreicher, weil Freunde oder Kollegen früh von einer freien Wohnung erfahren. Als meine Schwester eine Wohnung suchte, informierte sie ein Arbeitskollege über einen Vermieter. Deshalb bekam sie schnell einen Termin. Zusammenfassend würde ich beide Methoden nutzen, aber persönlichen Empfehlungen mehr vertrauen.`,
    readingAnswers: "1. B · 2. A · 3. B · 4. B · 5. A",
    listeningAnswers: "1. B · 2. B · 3. C · 4. B · 5. B",
  }),
  5: Object.freeze({
    writingTitle: "Teil 2 · Beispiel-E-Mail",
    writingSample: `Betreff: Besichtigungstermin für die Wohnung in Accra

Sehr geehrter Herr Mensah,

ich interessiere mich sehr für Ihre Wohnung in Accra und würde sie gern besichtigen. Könnten Sie mir bitte mitteilen, wann ein Termin möglich wäre? Für mich wäre Samstag um 14 Uhr besonders passend. Alternativ könnte ich auch am Montagabend kommen. Bitte bestätigen Sie mir den Termin per E-Mail. Sie erreichen mich außerdem telefonisch unter 024 000 0000.

Mit freundlichen Grüßen
Ama Boateng`,
    readingAnswers: "1. B · 2. B · 3. B · 4. B · 5. A · 6. B · 7. C",
    listeningAnswers: "1. C · 2. B · 3. B · 4. C · 5. B",
  }),
  6: Object.freeze({
    writingTitle: "Teil 2 · Beispieltext",
    writingSample: `Meiner Meinung nach ist das Leben am Stadtrand am besten. Einerseits erreicht man die Innenstadt schnell und hat dort viele Arbeits- und Freizeitmöglichkeiten. Andererseits ist es am Stadtrand ruhiger und die Wohnungen sind oft größer. Auf dem Land ist die Natur näher, aber ohne Auto kann der Alltag schwierig sein. In einer Großstadt würde ich wegen des Lärms und der hohen Mieten nicht gern wohnen. Deshalb ist der Stadtrand für mich ein guter Kompromiss.`,
    readingAnswers: "1. B · 2. C · 3. B · 4. B · 5. B · 6. B · 7. C",
    listeningAnswers: "1. B · 2. B · 3. C · 4. C · 5. B",
  }),
});

const referenceSectionStyle = {
  display: "grid",
  gap: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  background: "#fff",
  padding: 16,
};

const answerCardStyle = {
  display: "grid",
  gap: 8,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  padding: 14,
};

const B1WorkbookReferenceAnswers = ({ day }) => {
  const reference = B1_REFERENCE_ANSWERS[Number(day)];
  if (!reference) return null;

  return (
    <section data-workbook-reference-answers style={referenceSectionStyle}>
      <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Reference answers</h2>

      <div
        style={{
          border: "1px solid #fde68a",
          borderRadius: 12,
          background: "#fffbeb",
          color: "#92400e",
          padding: 13,
          lineHeight: 1.65,
        }}
      >
        <strong>Nutze die Referenz erst, nachdem du die Aufgaben selbst bearbeitet hast.</strong>
        <div style={{ marginTop: 6 }}>
          Diese Seite enthält nur die Musterlösung und Lösungsschlüssel für dieses Workbook. Sie zeigt keine gespeicherten Briefe aus „Mark My Letter“.
        </div>
      </div>

      <div style={answerCardStyle}>
        <strong>{reference.writingTitle}</strong>
        <p style={{ margin: 0, lineHeight: 1.75, whiteSpace: "pre-line" }}>{reference.writingSample}</p>
      </div>

      <div style={answerCardStyle}>
        <strong>Teil 3 · Lesen</strong>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{reference.readingAnswers}</p>
      </div>

      <div style={answerCardStyle}>
        <strong>Teil 4 · Hören</strong>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{reference.listeningAnswers}</p>
      </div>
    </section>
  );
};

export default function WorkbookReferenceAnswers({ level, lesson = {}, task, workbookId }) {
  const resolvedLevel = String(level || inferLevel(lesson)).trim().toUpperCase();
  const resolvedDay = Number(inferDay(lesson) || 0);

  if (resolvedLevel === "B1" && B1_REFERENCE_ANSWERS[resolvedDay]) {
    return <B1WorkbookReferenceAnswers day={resolvedDay} />;
  }

  const resolvedWorkbookId = workbookId || inferWorkbookId(lesson);
  const taskTitle = task?.title || lesson?.writingTask?.title || lesson?.writingTopic || lesson?.topic || lesson?.title || "Writing task";
  const writingPage = WritingPage({
    mode: "course",
    initialTab: "references",
    enabledTabs: ["references"],
    hideTabList: true,
    writingContext: {
      courseLevel: resolvedLevel,
      level: resolvedLevel,
      day: inferDay(lesson),
      lessonId: inferLessonId(lesson),
      workbookId: resolvedWorkbookId,
      writingTaskId: task?.id || lesson?.writingTask?.id || `${resolvedWorkbookId}-writing`,
      taskTitle,
    },
  });
  const referenceChildren = React.Children.toArray(writingPage.props.children).slice(1);

  return (
    <section data-workbook-reference-library>
      {referenceChildren}
    </section>
  );
}
