import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2Days26To28LearningUpgrade from "./A2Days26To28LearningUpgrade";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <A2Days26To28LearningUpgrade day={26} />
  <SpeakingMindMap config={getA2SpeakingMindMap(26)} />
  <WorkbookTaskCard eyebrow="Now speak · Jetzt sprechen" title="Wie fühlst du dich in verschiedenen Situationen?" practiceOnly>
    <p style={paragraph}>Beschreibe mindestens drei Situationen und verbinde Gefühl, Grund und Reaktion.</p>
    <ol style={list}>
      <li><strong>Situation:</strong> vor einer Prüfung, bei einer guten Nachricht, nach einem Streit oder an einem besonderen Tag.</li>
      <li><strong>Gefühl:</strong> nervös, erleichtert, stolz, enttäuscht, glücklich, traurig oder wütend.</li>
      <li><strong>Grund:</strong> Nutze <strong>weil</strong> oder <strong>dass</strong>.</li>
      <li><strong>Reaktion:</strong> Erkläre, was du dann machst.</li>
      <li><strong>Schluss:</strong> Sage, was dir hilft, mit starken Gefühlen umzugehen.</li>
    </ol>
    <p style={paragraph}><strong>Beispiel:</strong> Vor einer Prüfung bin ich oft nervös, weil ich alles richtig machen möchte. Dann atme ich tief ein und wiederhole meine Notizen. Nach der Prüfung bin ich meistens erleichtert.</p>
  </WorkbookTaskCard>
</>;

const lesenText = `Schwangerschaft, Elternzeit und Kinderbetreuung

Das Leben mit Kindern beginnt schon in der Schwangerschaft. Wenn Sie Fragen zum Thema Schwangerschaft haben, können Sie zu einer Schwangerschaftsberatung gehen. In der Schwangerschaft sollten Sie regelmäßig zu einem Frauenarzt gehen. Er beantwortet Ihre Fragen und kontrolliert die Gesundheit von Ihrem Kind. Ähnliche Aufgaben hat auch eine Hebamme. Sie berät und hilft Ihnen während der Schwangerschaft und auch nach der Geburt von Ihrem Kind. Die Hebamme ist auch bei der Geburt dabei.

Wenn Sie eine feste Arbeitsstelle haben, können Sie schon vor der Geburt in Mutterschutz gehen. Der Mutterschutz dauert insgesamt mindestens 14 Wochen. Nach dem Mutterschutz können Sie Elternzeit nehmen. In den ersten 12 Monaten der Elternzeit bekommt man Elterngeld. Wenn Ihr Partner auch Elternzeit nimmt, sind es 14 Monate.

Ihr Kind muss regelmäßig zum Kinderarzt. Dort gibt es Vorsorgeuntersuchungen und Impfungen. Kinder unter drei Jahren können in eine Kinderkrippe gehen oder bei einer Tagesmutter oder einem Tagesvater bleiben. Kinder ab drei Jahren können in den Kindergarten oder in eine Kindertagesstätte gehen. In den Schulferien haben die Städte spezielle Freizeitangebote für Kinder, die nicht viel kosten.`;

const lesenQuestions = [
  { stem: "Was macht ein Frauenarzt während der Schwangerschaft?", options: ["A) Er hilft bei der Geburt.", "B) Er beantwortet Fragen und kontrolliert die Gesundheit des Kindes.", "C) Er sorgt für die Kinderbetreuung.", "D) Er hilft beim Babysitting."] },
  { stem: "Wie lange dauert der Mutterschutz in Deutschland mindestens?", options: ["A) 6 Wochen", "B) 12 Wochen", "C) 14 Wochen", "D) 18 Wochen"] },
  { stem: "Wie lange kann man Elterngeld bekommen?", options: ["A) 6 Monate", "B) 12 Monate", "C) 14 Monate", "D) 3 Jahre"] },
  { stem: "Was ist eine Voraussetzung für den Erhalt von Elterngeld?", options: ["A) Man muss einen festen Arbeitsvertrag haben.", "B) Man muss eine Ausbildung abgeschlossen haben.", "C) Man muss einen Führerschein haben.", "D) Man muss viel Geld verdienen."] },
  { stem: "Was müssen Kinder regelmäßig beim Kinderarzt machen?", options: ["A) Impfungen und Vorsorgeuntersuchungen", "B) Nur Impfungen", "C) Nur Vorsorgeuntersuchungen", "D) Nur eine Untersuchung bei Krankheit"] },
  { stem: "Ab welchem Alter können Kinder in den Kindergarten gehen?", options: ["A) Ab 1 Jahr", "B) Ab 2 Jahren", "C) Ab 3 Jahren", "D) Ab 5 Jahren"] },
  { stem: "Was können Kinder in den Schulferien machen?", options: ["A) Nur zu Hause bleiben", "B) An speziellen Freizeitangeboten in der Stadt teilnehmen", "C) Nur ins Kino gehen", "D) Nur Sport treiben"] },
];

export default function A2Day26GefuehleInVerschiedenenSituationenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={26}
      title="Gefühle in verschiedenen Situationen beschreiben"
      chapter="10.26"
      workbookId="A2Day26GefuehleInVerschiedenenSituationen"
      topicPrompt="Wie fühlst du dich in verschiedenen Situationen und warum?"
      sprechenContent={speakingContent}
      schreibenTask="Ihr Nachbar hat Ihnen geholfen, als Sie krank waren. Schreiben Sie eine kurze Dankesnachricht. Bedanken Sie sich, erklären Sie, wie Sie sich durch die Hilfe gefühlt haben, und bieten Sie an, sich zu revanchieren."
      schreibenPlaceholder="Liebe/r ...,\n\nvielen Dank für deine Hilfe. Ich war sehr ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Teil 4 ist nur zusätzliche Hörpraxis. Für A2-10.26 gibt es keine Teil-4-Abgabe."
      hoerenAudioUrl="https://youtu.be/9OVfA1B-nuU"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
