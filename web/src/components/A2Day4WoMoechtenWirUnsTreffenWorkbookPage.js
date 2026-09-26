import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <WorkbookTaskCard eyebrow="Group practice" title="Teil 1 · Sprechen" practiceOnly>
    <p style={paragraph}>
      Open each mind-map branch, practise the sentence, and connect the parts into one clear answer.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(4)} />
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Formeller Brief: Einladung zu einem gemeinsamen Wochenende">
  <p style={paragraph}><strong>Aufgabe:</strong> Schreiben Sie Herrn Felix Asadu einen kurzen Brief und laden Sie ihn zu einem gemeinsamen Wochenende ein.</p>
  <p style={paragraph}>Bearbeiten Sie diese Punkte:</p>
  <ul style={list}>
    <li>Erklären Sie, warum Sie ihn einladen.</li>
    <li>Schlagen Sie eine Aktivität oder Veranstaltung vor.</li>
    <li>Fragen Sie, wann er Zeit hat und wo Sie sich treffen können.</li>
    <li>Fragen Sie, ob er etwas für das Essen oder die Aktivität mitbringen kann.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Sehr geehrter Herr Asadu, → Grund → Vorschlag → Zeit/Ort → Bitte → Mit freundlichen Grüßen.</p>
</WorkbookTaskCard>;



const listeningQuestions = [
  { stem: "Wann treffen sich Anna, Ben und Claudia am Samstag?", options: ["a) Um 9 Uhr", "b) Um 10 Uhr", "c) Um 11 Uhr"] },
  { stem: "Was bringt Claudia zum Ausflug mit?", options: ["a) Ein Zelt", "b) Einen Rucksack mit Snacks und Getränken", "c) Einen Reiseführer"] },
  { stem: "Was möchten Ben und Anna im Wald machen?", options: ["a) Einen Film schauen", "b) Ein Picknick machen", "c) Eine Wanderung machen"] },
  { stem: "Was planen sie am Samstagabend?", options: ["a) Ein Konzert zu besuchen", "b) Ein Picknick im Park", "c) In einem Restaurant essen und einen Film schauen"] },
  { stem: "Was wollen sie am Sonntag im Park machen?", options: ["a) Spielen und spazieren gehen", "b) Fußball spielen", "c) Fotos machen"] },
];

export default function A2Day4WoMoechtenWirUnsTreffenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={4}
      title="Wo möchten wir uns treffen?"
      chapter="2.4"
      workbookId="A2Day4WoMoechtenWirUnsTreffen"
      topicPrompt="Wo möchtest du dich mit deinen Freunden treffen? Wie kommst du dorthin?"
      sprechenContent={speakingContent}
      schreibenContent={writingContent}
      schreibenPlaceholder={"Sehr geehrter Herr Asadu,\n\nich schreibe Ihnen, weil ...\n\nWir könnten am ... zusammen ...\nHaben Sie um ... Zeit? Wir könnten uns ... treffen.\n\nKönnten Sie bitte ... mitbringen?\n\nIch freue mich auf Ihre Antwort.\n\nMit freundlichen Grüßen\n[Ihr Name]"}
      hoerenTask="Hören: Ein Wochenende mit Freunden planen. Sieh dir das eingebettete Video an und beantworte danach die fünf Fragen."
      hoerenAudioUrl="https://youtu.be/tHAo8hxjKmw"
      hoerenQuestions={listeningQuestions}
    />
  );
}
