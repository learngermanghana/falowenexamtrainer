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
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(3)} />
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

const readingText = `Anna ist 25 Jahre alt und wohnt in Berlin, einer lebendigen Großstadt in Deutschland. Sie hat lange, blonde Haare, blaue Augen und ein strahlendes Lächeln. Anna arbeitet als Krankenschwester in einem Krankenhaus, wo sie sich um ihre Patienten kümmert. Sie liebt ihren Beruf, weil sie gerne anderen Menschen hilft. Ihre Kollegen schätzen sie sehr, weil sie immer freundlich und hilfsbereit ist.

In ihrer Freizeit liest Anna gerne Romane, vor allem Liebesgeschichten, und geht oft im Park spazieren. Außerdem trifft sie sich regelmäßig mit ihrer besten Freundin Lisa, um Kaffee zu trinken oder ins Kino zu gehen. Anna mag auch Tiere und hat einen kleinen Hund namens Bruno, den sie oft mit in den Park nimmt.

Max ist Annas Freund. Er ist 27 Jahre alt und wohnt auch in Berlin. Er hat kurze, braune Haare, grüne Augen und trägt eine Brille. Max ist Lehrer für Mathematik an einer Schule und unterrichtet dort Schüler zwischen 12 und 16 Jahren. Seine Schüler mögen ihn, weil er geduldig ist und schwierige Themen gut erklären kann.

In seiner Freizeit spielt Max gerne Fußball mit seinen Freunden im Park. Er liebt es auch, neue Rezepte auszuprobieren und gemeinsam mit Anna oder Freunden zu kochen. Max ist ein humorvoller und kreativer Mensch, der immer neue Ideen hat, wie man den Alltag spannender gestalten kann. Am Wochenende unternehmen Anna und Max oft etwas zusammen, zum Beispiel Ausflüge in die Natur oder Museumsbesuche in der Stadt.`;

const readingQuestions = [
  {
    stem: "Wie alt ist Anna?",
    options: ["a) 20 Jahre", "b) 25 Jahre", "c) 30 Jahre", "d) 27 Jahre"],
  },
  {
    stem: "Was macht Anna in ihrer Freizeit?",
    options: [
      "a) Fußball spielen und kochen",
      "b) Bücher lesen und spazieren gehen",
      "c) Tanzen und malen",
      "d) Reisen und Musik hören",
    ],
  },
  {
    stem: "Wo arbeitet Anna?",
    options: ["a) In einer Schule", "b) In einer Tierklinik", "c) In einem Krankenhaus", "d) In einem Café"],
  },
  {
    stem: "Welches Tier hat Anna?",
    options: ["a) Eine Katze", "b) Einen Vogel", "c) Einen Hund", "d) Kein Tier"],
  },
  {
    stem: "Was unterrichtet Max?",
    options: ["a) Deutsch", "b) Mathematik", "c) Geschichte", "d) Englisch"],
  },
  {
    stem: "Was macht Max oft mit seinen Freunden?",
    options: ["a) Fußball spielen", "b) Spazieren gehen", "c) Kino besuchen", "d) Tanzen"],
  },
  {
    stem: "Was unternehmen Anna und Max am Wochenende?",
    options: [
      "a) Sie gehen ins Fitnessstudio",
      "b) Sie machen Ausflüge oder gehen ins Museum",
      "c) Sie bleiben zu Hause",
      "d) Sie besuchen Freunde in Hamburg",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Wie alt ist Julia?",
    options: ["a) 24 Jahre", "b) 26 Jahre", "c) 28 Jahre", "d) 30 Jahre"],
  },
  {
    stem: "Was macht Julia beruflich?",
    options: ["a) Köchin", "b) Lehrerin", "c) Architektin", "d) Musikerin"],
  },
  {
    stem: "Wo lebt Tobias?",
    options: ["a) In München", "b) In Frankfurt", "c) In Hamburg", "d) In Berlin"],
  },
  {
    stem: "Was möchte Tobias in Zukunft machen?",
    options: [
      "a) Ein eigenes Restaurant eröffnen",
      "b) Musiker werden",
      "c) Eine Weltreise machen",
      "d) Lehrer werden",
    ],
  },
  {
    stem: "Was machen Julia und Tobias oft am Wochenende?",
    options: [
      "a) Sie spielen Gitarre.",
      "b) Sie kochen gemeinsam mit Sophie.",
      "c) Sie reisen in die Berge.",
      "d) Sie gehen ins Kino.",
    ],
  },
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
    hoerenAudioUrl="https://youtu.be/z0hve7zCDEo"
    hoerenQuestions={listeningQuestions}
  />;
}
