import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Schreibaufgabe" title="E-Mail an ein Restaurant">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Situation: Sie möchten einen Tisch in einem Restaurant reservieren.
    </p>
    <p style={{ margin: 0, lineHeight: 1.7 }}>Schreiben Sie eine E-Mail an das Restaurant:</p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einem freien Tisch.</li>
      <li>Geben Sie an, was für Sie wichtig ist (z. B. Datum, Uhrzeit, Anzahl der Personen).</li>
      <li>Fragen Sie nach dem Menü und den Preisen.</li>
    </ol>
  </WorkbookTaskCard>
);


export default function A2Day8RezepteUndEssenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={8}
      title="Rezepte und Essen"
      chapter="3.8"
      workbookId="A2Day8RezepteUndEssen"
      topicPrompt="Erkläre ein einfaches Rezept und sprich über Essen und Zutaten."
      showSpeakingTaskCard={false}
      schreibenTask="Sie möchten einen Tisch in einem Restaurant reservieren. Schreiben Sie eine E-Mail an das Restaurant."
      schreibenContent={schreibenContent}
      hoerenTask="Sieh dir das eingebettete Video zum Thema Rezepte und Essen an. Achte auf den Tag, die Zutaten, den Ort und das Gericht. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/mYh4DRaaWSY"
      hoerenQuestions={[
        {
          stem: "Wann gehen die Personen einkaufen oder kochen zusammen?",
          options: [
            "a) Montag",
            "b) Samstag",
            "c) Mittwoch",
          ],
        },
        {
          stem: "Was kaufen sie?",
          options: [
            "a) Fleisch und Fisch",
            "b) Obst und Gemüse",
            "c) Brot und Käse",
          ],
        },
        {
          stem: "Welche Zutat wird im Hörtext genannt?",
          options: [
            "a) Reis",
            "b) Mozzarella",
            "c) Kartoffeln",
          ],
        },
        {
          stem: "Was machen sie danach?",
          options: [
            "a) Sie gehen ins Kino",
            "b) Sie gehen in ein Café",
            "c) Sie gehen in die Schule",
          ],
        },
        {
          stem: "Welches Gericht wird genannt?",
          options: [
            "a) Gemüselasagne",
            "b) Bratwurst mit Sauerkraut",
            "c) Fischsuppe",
          ],
        },
      ]}
    />
  );
}
