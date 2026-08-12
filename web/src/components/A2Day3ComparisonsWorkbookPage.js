import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(3)} />
  <WorkbookTaskCard eyebrow="Now speak · Jetzt sprechen" title="Vergleiche zwei Dinge oder Personen" practiceOnly>
    <p style={paragraph}>Choose two clear things first. Then make one connected comparison instead of separate example sentences.</p>
    <ol style={list}>
      <li>Name the two things or people.</li>
      <li>Say one similarity with <strong>genauso ... wie</strong>.</li>
      <li>Say at least two differences with comparative + <strong>als</strong>.</li>
      <li>Finish with your opinion and a reason.</li>
    </ol>
    <p style={paragraph}><strong>Thinking route:</strong> Auswahl → Gemeinsamkeit → Unterschiede → Preis/Qualität → Meinung + weil.</p>
  </WorkbookTaskCard>
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Brief an Felix: Meine Mutter und mein Vater">
  <p style={paragraph}><strong>Aufgabe:</strong> Schreibe Felix einen kurzen Brief. Beschreibe und vergleiche deine Mutter und deinen Vater.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Stelle deine Mutter und deinen Vater kurz vor.</li>
    <li>Vergleiche ihr Aussehen mit <strong>als</strong> oder <strong>genauso ... wie</strong>.</li>
    <li>Vergleiche ihren Charakter.</li>
    <li>Sage, was du an beiden besonders magst.</li>
    <li>Frage Felix am Ende nach seinen Eltern.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Lieber Felix, → Vorstellung → Vergleiche → Meinung → Frage → Viele Grüße.</p>
</WorkbookTaskCard>;

const readingText = `Anna ist 25 Jahre alt und wohnt in Berlin. Sie hat lange blonde Haare und arbeitet als Krankenschwester. In ihrer Freizeit liest sie gern und geht spazieren. Max ist 27 Jahre alt, trägt eine Brille und arbeitet als Mathematiklehrer. Er spielt gern Fußball und kocht. Anna ist jünger als Max. Max ist sportlicher als Anna, aber Anna liest häufiger als Max. Beide sind freundlich und hilfsbereit.`;

const readingQuestions = [
  { stem:"Wer ist älter?", options:["a) Anna","b) Max","c) Beide sind gleich alt"] },
  { stem:"Wer spielt gern Fußball?", options:["a) Anna","b) Max","c) Beide"] },
  { stem:"Welcher Vergleich stimmt?", options:["a) Anna ist älter als Max.","b) Max ist älter als Anna.","c) Max ist genauso alt wie Anna."] },
  { stem:"Was haben beide gemeinsam?", options:["a) Beide sind freundlich.","b) Beide sind Lehrer.","c) Beide tragen eine Brille."] }
];

const listeningQuestions = [
  { stem:"Wie alt ist Julia?", options:["a) 24 Jahre","b) 26 Jahre","c) 28 Jahre","d) 30 Jahre"] },
  { stem:"Was macht Julia beruflich?", options:["a) Köchin","b) Lehrerin","c) Architektin","d) Musikerin"] },
  { stem:"Wo lebt Tobias?", options:["a) München","b) Frankfurt","c) Hamburg","d) Berlin"] },
  { stem:"Was möchte Tobias in Zukunft machen?", options:["a) Ein Restaurant eröffnen","b) Musiker werden","c) Eine Weltreise machen","d) Lehrer werden"] },
  { stem:"Was machen Julia und Tobias oft am Wochenende?", options:["a) Gitarre spielen","b) Gemeinsam kochen","c) In die Berge reisen","d) Ins Kino gehen"] }
];

export default function A2Day3ComparisonsWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={3}
    title="Dinge und Personen vergleichen"
    chapter="1.3"
    workbookId="A2Day3DingeUndPersonenVergleichen"
    topicPrompt="Vergleiche zwei Personen, Dinge oder Orte."
    sprechenContent={speakingContent}
    schreibenContent={writingContent}
    schreibenPlaceholder={"Lieber Felix,\n\nmeine Mutter ist ... und mein Vater ist ...\n\nMeine Mutter ist ... als mein Vater. Mein Vater ist genauso ... wie ...\n\nIch mag ... besonders, weil ...\n\nWie sind deine Eltern?\n\nViele Grüße\n[Dein Name]"}
    lesenText={readingText}
    lesenQuestions={readingQuestions}
    hoerenTask="Sieh dir das eingebettete Video an und beantworte danach die fünf Hörverstehen-Fragen."
    hoerenAudioUrl="https://youtu.be/Ml50uHYxBx8"
    hoerenQuestions={listeningQuestions}
  />;
}
