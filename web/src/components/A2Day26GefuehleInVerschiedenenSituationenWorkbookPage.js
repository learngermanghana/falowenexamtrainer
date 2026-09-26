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
      hoerenTask="Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe."
      hoerenAudioUrl="https://youtu.be/JEJZypJfrD8?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5"
      hoerenQuestions={[]}
      hoerenSelfCheck
      showWorkbookGuidance={false}
    />
  );
}
