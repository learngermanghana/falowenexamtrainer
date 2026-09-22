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

const lesenText = `Gefühle im Alltag

Am Montag hatte Leila eine wichtige Deutschprüfung. Vor der Prüfung war sie sehr nervös, weil sie Angst vor schwierigen Aufgaben hatte. Ihre Freundin erinnerte sie daran, ruhig zu atmen und zuerst die einfachen Fragen zu beantworten. Nach der Prüfung fühlte Leila sich erleichtert.

Am Mittwoch bekam sie die Nachricht, dass sie die Prüfung bestanden hatte. Sie war überrascht und sehr stolz auf sich. Am Abend rief sie ihre Familie an, weil sie die gute Nachricht teilen wollte.

Am Freitag hatte Leila einen kleinen Streit mit einer Kollegin. Zuerst war sie wütend und enttäuscht. Später sprachen beide ruhig miteinander und erklärten, was passiert war. Danach fühlte Leila sich wieder besser. Sie merkte, dass offene Gespräche ihr helfen, schwierige Gefühle zu verstehen.`;

const lesenQuestions = [
  {
    stem: "Warum war Leila vor der Prüfung nervös?",
    options: ["A) Sie hatte Angst vor schwierigen Aufgaben.", "B) Sie hatte die Prüfung schon bestanden.", "C) Sie wollte nicht lernen.", "D) Sie war im Urlaub."],
  },
  {
    stem: "Was empfahl ihre Freundin?",
    options: ["A) Ruhig atmen und zuerst einfache Fragen beantworten", "B) Die Prüfung verlassen", "C) Nicht antworten", "D) Sofort die Familie anrufen"],
  },
  {
    stem: "Wie fühlte Leila sich nach der Prüfung?",
    options: ["A) Erleichtert", "B) Einsam", "C) Wütend", "D) Gelangweilt"],
  },
  {
    stem: "Wie reagierte Leila auf die Nachricht, dass sie bestanden hatte?",
    options: ["A) Sie war überrascht und stolz.", "B) Sie war traurig.", "C) Sie war enttäuscht.", "D) Sie war gleichgültig."],
  },
  {
    stem: "Was half Leila nach dem Streit?",
    options: ["A) Ein ruhiges Gespräch", "B) Mehr Streit", "C) Die Arbeit verlassen", "D) Niemandem zuhören"],
  },
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
      hoerenTask="Hören Sie Falowen Radio noch einmal und achten Sie darauf, welche Gefühle genannt werden, wodurch sie entstehen und wie die Personen reagieren."
      hoerenAudioUrl="https://youtu.be/9OVfA1B-nuU"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
