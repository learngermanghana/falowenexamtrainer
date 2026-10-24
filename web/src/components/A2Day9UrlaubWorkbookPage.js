import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Formelle Schreibaufgabe" title="E-Mail an ein Hotel">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel:
    </p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einem freien Zimmer.</li>
      <li>
        Geben Sie an, was für Sie wichtig ist (z. B. Datum, Anzahl der Personen, Art des Zimmers).
      </li>
      <li>
        Fragen Sie nach den Preisen und den zusätzlichen Leistungen (z. B. Frühstück, Internetzugang).
      </li>
    </ol>
  </WorkbookTaskCard>
);


export default function A2Day9UrlaubWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={9}
      title="Urlaub"
      chapter="4.9"
      workbookId="A2Day9Urlaub"
      topicPrompt="Sprich über deinen letzten Urlaub oder deinen Traumurlaub."
      showSpeakingTaskCard={false}
      schreibenTask="Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel."
      schreibenContent={schreibenContent}
    />
  );
}
