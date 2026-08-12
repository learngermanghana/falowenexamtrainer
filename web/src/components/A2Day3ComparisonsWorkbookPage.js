import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const speakingContent = <A2MiniLearningBlock
  title="Komparativ: zwei Dinge klar vergleichen"
  rule="Bei einem Unterschied benutzt du Komparativ + als. Bei Gleichheit benutzt du so/genauso + Adjektiv + wie."
  examples={[
    "groß → größer: Anna ist größer als Maria.",
    "schnell → schneller: Der Zug ist schneller als der Bus.",
    "gut → besser: Dieses Buch ist besser als das andere.",
    "gleich: Mein Bruder ist genauso groß wie ich."
  ]}
  questions={[
    { stem:"Anna ist größer ___ Maria.", options:["als","wie"], answer:0, explanation:"Bei einem Unterschied benutzt du als." },
    { stem:"Mein Handy ist genauso neu ___ dein Handy.", options:["als","wie"], answer:1, explanation:"Bei Gleichheit benutzt du wie." },
    { stem:"Was ist der Komparativ von gut?", options:["guter","besser","am gut"], answer:1, explanation:"gut ist unregelmäßig: gut → besser." },
    { stem:"Welcher Satz ist richtig?", options:["Ein Fahrrad ist umweltfreundlicher als ein Auto.","Ein Fahrrad ist umweltfreundlicher wie ein Auto."], answer:0, explanation:"Unterschied = Komparativ + als." }
  ]}
  outputPrompt="Vergleiche zwei Personen, Orte oder Dinge in 4 Sätzen. Benutze mindestens zweimal als und einmal wie."
  starters={["... ist größer als ...", "... ist schneller als ...", "... ist genauso ... wie ...", "Ich finde ... besser als ..."]}
/>;

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
    schreibenTask={`Schreibe einen Brief an deinen Freund Felix. Beschreibe und vergleiche deine Mutter und deinen Vater.\n\n1. Stelle beide kurz vor.\n2. Vergleiche Aussehen und Charakter mit als und wie.\n3. Sage, was du an beiden besonders magst, und frage Felix nach seinen Eltern.`}
    schreibenPlaceholder={"Lieber Felix,\n\nmeine Mutter ist ... Mein Vater ist ...\n\nMeine Mutter ist ... als mein Vater. Mein Vater ist genauso ... wie ...\n\nViele Grüße\n[Dein Name]"}
    lesenText={readingText}
    lesenQuestions={readingQuestions}
    hoerenTask="Sieh dir das eingebettete Video an und beantworte danach die fünf Hörverstehen-Fragen."
    hoerenAudioUrl="https://youtu.be/Ml50uHYxBx8"
    hoerenQuestions={listeningQuestions}
  />;
}
