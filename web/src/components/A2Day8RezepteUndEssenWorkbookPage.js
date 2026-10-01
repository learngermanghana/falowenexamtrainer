import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const sprechenContent = (
  <>
    <WorkbookTaskCard eyebrow="Teil 1 · Sprechen" title="Restaurant-Rollenspiel" practiceOnly>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Situation: Du bist mit einer Freundin oder einem Freund in einem Restaurant. Eine Person ist Gast, die andere Person ist Kellnerin oder Kellner.
      </p>
      <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.75 }}>
        <li>Begrüße und bitte um die Speisekarte.</li>
        <li>Frage nach einem Gericht oder nach einer Empfehlung.</li>
        <li>Bestelle ein Essen und ein Getränk.</li>
        <li>Reagiere auf ein kleines Problem, z. B. falsches Getränk oder fehlende Beilage.</li>
        <li>Bitte am Ende um die Rechnung.</li>
      </ol>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Nutze mindestens drei Redemittel: <strong>Ich hätte gern ...</strong>, <strong>Könnte ich bitte ...?</strong>, <strong>Was empfehlen Sie?</strong>, <strong>Entschuldigung, ich habe ... bestellt.</strong>, <strong>Wir möchten bitte zahlen.</strong>
      </p>
    </WorkbookTaskCard>
  </>
);

export default function A2Day8RezepteUndEssenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={8}
      title="Im Restaurant · bestellen und reagieren"
      chapter="3.8"
      workbookId="A2Day8RezepteUndEssen"
      topicPrompt="Im Restaurant bestellen, nachfragen, auf ein Problem reagieren und bezahlen."
      sprechenContent={sprechenContent}
      showSpeakingTaskCard={false}
    />
  );
}
