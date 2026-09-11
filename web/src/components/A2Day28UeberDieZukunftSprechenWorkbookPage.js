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

const lesenText = `Meine Pläne für die nächsten Jahre

David hat seinen A2-Deutschkurs fast beendet und denkt über seine Zukunft nach. Zuerst möchte er die B1-Prüfung bestehen. Deshalb plant er, jeden Tag Deutsch zu lesen und zweimal pro Woche mit Freunden zu sprechen.

Beruflich interessiert David sich für IT. Im nächsten Jahr möchte er eine Weiterbildung beginnen, damit er bessere Chancen auf dem Arbeitsmarkt hat. Wenn er genug Berufserfahrung gesammelt hat, kann er sich vorstellen, in einem internationalen Unternehmen zu arbeiten.

Auch privat hat David Pläne. Er möchte Geld sparen und in zwei Jahren eine größere Wohnung suchen. Außerdem möchte er mehr reisen und neue Länder kennenlernen. Gesundheit ist ihm ebenfalls wichtig: Er will regelmäßig Sport machen und weniger Stress haben.

David weiß, dass nicht jeder Plan genau so funktionieren wird. Trotzdem findet er es hilfreich, klare Ziele zu haben und Schritt für Schritt daran zu arbeiten.`;

const lesenQuestions = [
  {
    stem: "Was möchte David zuerst erreichen?",
    options: ["A) Die B1-Prüfung bestehen", "B) Sofort ein Haus kaufen", "C) Deutsch nicht mehr lernen", "D) Eine lange Reise machen"],
  },
  {
    stem: "Wie möchte David sein Deutsch verbessern?",
    options: ["A) Täglich lesen und regelmäßig mit Freunden sprechen", "B) Nur Filme sehen", "C) Nur einmal im Monat lernen", "D) Keine Gespräche führen"],
  },
  {
    stem: "Warum möchte David eine IT-Weiterbildung beginnen?",
    options: ["A) Damit er bessere Chancen auf dem Arbeitsmarkt hat.", "B) Weil er nicht arbeiten möchte.", "C) Damit er weniger Deutsch lernt.", "D) Weil er sofort umziehen muss."],
  },
  {
    stem: "Was plant David privat?",
    options: ["A) Geld sparen, später umziehen und reisen", "B) Seine Wohnung sofort verkaufen", "C) Nie mehr reisen", "D) Nur arbeiten"],
  },
  {
    stem: "Wie denkt David über Zukunftspläne?",
    options: ["A) Klare Ziele helfen, auch wenn nicht alles genau so funktioniert.", "B) Pläne sind immer nutzlos.", "C) Jeder Plan muss perfekt funktionieren.", "D) Man soll keine Ziele haben."],
  },
];

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
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie den Beitrag zu Zukunftsplänen. Achten Sie auf Ziele, Zeitangaben und Gründe und beantworten Sie anschließend die Fragen."
      hoerenAudioUrl="https://youtu.be/Teuu287XY_M?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
