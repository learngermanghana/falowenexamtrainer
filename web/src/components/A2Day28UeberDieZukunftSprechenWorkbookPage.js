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

const lesenText = `Pass und Visum, Einwohnermeldeamt und Aufenthaltstitel

Für die Einreise nach Deutschland brauchen Sie einen gültigen Reisepass oder ein anderes Dokument, das Ihre Identität bestätigt. Bürger, die nicht aus der EU kommen, brauchen zusätzlich ein Visum. Das Visum bekommen Sie bei der Deutschen Botschaft oder beim Konsulat in Ihrem Land.

Nach der Ankunft müssen Sie sich beim Einwohnermeldeamt anmelden und danach zur Ausländerbehörde gehen. Dort bekommen Sie einen Aufenthaltstitel. Wenn Ihre Deutschkenntnisse noch nicht ausreichen, können oder müssen Sie einen Integrationskurs machen. Ein Integrationskurs vermittelt Deutsch und Wissen über das Leben in Deutschland.

Für die Arbeitssuche hilft die Arbeitsagentur. Dokumente aus dem Heimatland müssen oft übersetzt und anerkannt werden. Wichtig sind auch Kranken-, Renten- und Pflegeversicherung.`;

const lesenQuestions = [
  { stem: "Was braucht man zur Einreise nach Deutschland?", options: ["A) Einen Mietvertrag", "B) Einen deutschen Führerschein", "C) Einen gültigen Reisepass", "D) Ein Bankkonto"] },
  { stem: "Wo bekommt man ein Visum für Deutschland?", options: ["A) Beim Einwohnermeldeamt", "B) Bei der Deutschen Botschaft im Heimatland", "C) Beim Jugendamt", "D) Bei der Arbeitsagentur"] },
  { stem: "Was bekommt man bei der Ausländerbehörde?", options: ["A) Ein Bankkonto", "B) Einen Führerschein", "C) Einen Aufenthaltstitel", "D) Einen Arbeitsvertrag"] },
  { stem: "Was ist ein Integrationskurs?", options: ["A) Ein Kurs zum Autofahren", "B) Ein Kurs für Deutsch und Leben in Deutschland", "C) Ein Kurs über Finanzen", "D) Ein Sportkurs"] },
  { stem: "Was macht man mit Dokumenten aus dem Heimatland, wenn man arbeiten möchte?", options: ["A) Man wirft sie weg", "B) Man muss sie verstecken", "C) Man muss sie übersetzen und anerkennen lassen", "D) Man schickt sie an das Jugendamt"] },
  { stem: "Wer hilft bei der Arbeitssuche?", options: ["A) Das Kino", "B) Das Rathaus", "C) Die Arbeitsagentur", "D) Die Polizei"] },
  { stem: "Welche Versicherungen sind besonders wichtig?", options: ["A) Auto- und Handyversicherung", "B) Reise- und Hausratversicherung", "C) Kranken-, Renten- und Pflegeversicherung", "D) Lebensversicherung und Haftpflichtversicherung"] },
];

const hoerenQuestions = [];

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
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Teil 4 ist zusätzliche Hörpraxis. Für A2-10.28 gibt es keine Teil-4-Abgabe."
      hoerenAudioUrl="https://youtu.be/Teuu287XY_M?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
