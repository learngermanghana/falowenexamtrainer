import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Formelle Schreibaufgabe" title="Eine Wohnung suchen">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter:
    </p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einer verfügbaren Wohnung.</li>
      <li>Geben Sie an, welche Kriterien für Sie wichtig sind (z. B. Größe, Lage, Preis).</li>
      <li>Fragen Sie nach den Mietbedingungen und der Möglichkeit, die Wohnung zu besichtigen.</li>
    </ol>
  </WorkbookTaskCard>
);


export default function A2Day7WohnungSuchenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={7}
      title="Eine Wohnung suchen"
      chapter="3.7"
      workbookId="A2Day7WohnungSuchen"
      topicPrompt="Beschreibe, welche Wohnung du suchst und warum sie zu dir passt."
      showSpeakingTaskCard={false}
      schreibenTask="Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter."
      schreibenContent={schreibenContent}
      hoerenTask="Sieh dir das eingebettete Video zur Wohnungsbeschreibung an. Achte auf Stockwerk, Größe, Zimmer, Ausstattung und Nebenkosten. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/hM1iPUq1Spg"
      hoerenQuestions={[
        {
          stem: "In welchem Stockwerk befindet sich die Wohnung?",
          options: [
            "a) Im ersten Stock",
            "b) Im zweiten Stock",
            "c) Im dritten Stock",
          ],
        },
        {
          stem: "Wie groß ist die Wohnung?",
          options: [
            "a) 70 Quadratmeter",
            "b) 75 Quadratmeter",
            "c) 80 Quadratmeter",
          ],
        },
        {
          stem: "Wie viele Zimmer hat die Wohnung?",
          options: [
            "a) Zwei",
            "b) Drei",
            "c) Vier",
          ],
        },
        {
          stem: "Was gehört zur Wohnung?",
          options: [
            "a) Ein Balkon",
            "b) Ein Garten",
            "c) Eine Garage",
          ],
        },
        {
          stem: "Wie hoch sind die Nebenkosten?",
          options: [
            "a) 100 Euro",
            "b) 150 Euro",
            "c) 200 Euro",
          ],
        },
      ]}
    />
  );
}
