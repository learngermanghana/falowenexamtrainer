import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2Days26To28LearningUpgrade from "./A2Days26To28LearningUpgrade";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <A2Days26To28LearningUpgrade day={28} />
  <SpeakingMindMap config={getA2SpeakingMindMap(28)} />
  <WorkbookTaskCard eyebrow="A2 Abschluss · Zukunft" title="Was planst du für deine Zukunft und warum?" practiceOnly>
    <p style={paragraph}>Verbinde mehrere Zukunftspläne zu einer klaren Mini-Präsentation.</p>
    <ol style={list}>
      <li><strong>Start:</strong> Nenne dein wichtigstes Ziel.</li>
      <li><strong>Beruf/Bildung:</strong> Erkläre, was du lernen, studieren oder beruflich machen möchtest.</li>
      <li><strong>Persönlich:</strong> Sprich über Familie, Reisen, Gesundheit oder Wohnen.</li>
      <li><strong>Grund:</strong> Nutze <strong>weil</strong>, <strong>deshalb</strong> oder <strong>damit</strong>.</li>
      <li><strong>Zeit:</strong> Nutze Formulierungen wie „nächstes Jahr“, „in fünf Jahren“ oder „später“.</li>
      <li><strong>Schluss:</strong> Fasse deine wichtigsten Ziele zusammen.</li>
    </ol>
    <p style={paragraph}><strong>Beispiel:</strong> Nächstes Jahr möchte ich mein Deutsch auf B1-Niveau verbessern, weil ich sicherer sprechen will. Danach möchte ich eine Weiterbildung machen. In fünf Jahren möchte ich mehr Berufserfahrung haben und vielleicht im Ausland arbeiten.</p>
  </WorkbookTaskCard>
</>;



const hoerenQuestions = [
  {
    stem: "Worum geht es im Beitrag?",
    options: ["A) Um Zukunftspläne und Ziele", "B) Nur um Essen", "C) Um eine Reklamation", "D) Nur um das Wetter"],
  },
  {
    stem: "Welche Formulierung kann man für Zukunftspläne benutzen?",
    options: ["A) Ich möchte ...", "B) Gestern habe ich ...", "C) Bitte öffnen Sie ...", "D) Es tut mir leid ..."],
  },
  {
    stem: "Was solltest du beim Sprechen über die Zukunft erklären?",
    options: ["A) Deine Ziele und Gründe", "B) Nur deinen Namen", "C) Nur das Datum", "D) Keine persönlichen Pläne"],
  },
];

export default function A2Day28UeberDieZukunftSprechenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={28}
      title="Über die Zukunft sprechen"
      chapter="10.28"
      workbookId="A2Day28UeberDieZukunftSprechen"
      topicPrompt="Was planst du für deine Zukunft und warum?"
      sprechenContent={speakingContent}
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihre Zukunftspläne. Beschreiben Sie Ihre beruflichen oder schulischen Ziele, nennen Sie mindestens einen persönlichen Wunsch und fragen Sie nach den Zukunftsplänen der anderen Person."
      schreibenPlaceholder="Liebe/r ...,\n\nich möchte dir von meinen Zukunftsplänen erzählen. Zuerst ..."
      hoerenTask="Hören Sie den Beitrag zu Zukunftsplänen. Achten Sie auf Ziele, Zeitangaben und Gründe und beantworten Sie anschließend die Fragen."
      hoerenAudioUrl="https://youtu.be/Teuu287XY_M?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
