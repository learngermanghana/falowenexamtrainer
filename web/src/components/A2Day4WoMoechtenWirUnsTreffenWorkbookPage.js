import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(4)} />
  <WorkbookTaskCard eyebrow="Now speak · Jetzt sprechen" title="Plane ein Treffen von Anfang bis Ende" practiceOnly>
    <p style={paragraph}>Create one realistic plan. Do not only name a place; connect the activity, place, time, transport and confirmation.</p>
    <ol style={list}>
      <li>Suggest an activity.</li>
      <li>Choose a clear meeting place.</li>
      <li>Say the day and time.</li>
      <li>Explain how you will get there.</li>
      <li>Confirm the plan or give one alternative.</li>
    </ol>
    <p style={paragraph}><strong>Thinking route:</strong> Was? → Wo? → Wann? → Wie komme ich hin? → Bestätigung / Alternative.</p>
  </WorkbookTaskCard>
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

const readingText = `Pläne für die Freizeit

Für das Wochenende und die Ferien mache ich gern Pläne. An den freien Samstagen und Sonntagen werde ich lange schlafen. Dann klingelt der Wecker nicht. Aber ich werde für die Wochenenden nicht zu viel planen, weil ich gern faul bin und nichts tue. Aber ich werde vielleicht zum Sport gehen. Manchmal habe ich am Wochenende ein Turnier. Diesen Sonntag zum Beispiel werde ich mit meinem Team in eine andere Stadt fahren. Wir werden dort ein Match gegen einen anderen Hockeyverein spielen. Das wird bestimmt ein Spaß.

Wenn das Wetter schön ist, werde ich anschließend mit meinen Freunden schwimmen gehen. In der Nähe gibt es einen See, der wird schon warm genug sein.

Wenn ich länger frei habe, mache ich gerne größere Pläne. In den Sommerferien werde ich sehr oft mit meinen Freunden unterwegs sein. Wir werden zum See fahren. Dort werden wir im Zelt übernachten und beim Lagerfeuer sitzen. Eine oder zwei Wochen möchte ich gerne reisen. Ein Freund wird mich auf der Reise begleiten, wir werden mit dem Zug losfahren. Wir planen eine Route durch das ganze Land, von West bis Ost und von Süd bis Nord. Mit Rucksäcken und Wanderschuhen werden wir auch in die Berge fahren. Am liebsten würde ich dort in einer Hütte übernachten. Wir werden sehen, ob wir das auch schaffen werden. Ein Abenteuer wird es aber ganz bestimmt.`;

const readingQuestions = [
  { stem: "Was macht der Erzähler am liebsten am Wochenende?", options: ["a) In die Berge fahren", "b) Faul sein", "c) Viel essen", "d) Lernen"] },
  { stem: "Welchen Sport macht er manchmal am Wochenende?", options: ["a) Tennis spielen", "b) Laufen", "c) Wandern", "d) Hockey spielen"] },
  { stem: "Was macht er gern mit Freunden am Wochenende?", options: ["a) Schwimmen gehen", "b) Faul sein", "c) Shoppen", "d) Wandern"] },
  { stem: "Was plant der Erzähler mit den Freunden im Sommer?", options: ["a) Eine Radtour", "b) In einen Vergnügungspark fahren", "c) Schach spielen", "d) Zum See fahren und dort im Zelt übernachten"] },
  { stem: "Welche größeren Pläne hat er in den Sommerferien?", options: ["a) Einen Urlaub am Meer", "b) Eine Route mit dem Zug durch das ganze Land", "c) Eine Reise in die nächste Stadt", "d) Campen mit dem Zelt in den Bergen"] },
];

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
      lesenText={readingText}
      lesenQuestions={readingQuestions}
      hoerenTask="Hören: Ein Wochenende mit Freunden planen. Sieh dir das eingebettete Video an und beantworte danach die fünf Fragen."
      hoerenAudioUrl="https://youtu.be/tHAo8hxjKmw"
      hoerenQuestions={listeningQuestions}
    />
  );
}
