import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };





const schreibenContent = (
  <WorkbookTaskCard eyebrow="Schreibaufgabe" title="Scenario 2: Resolving Account Issues">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an Ihre Bank in Ghana.
    </p>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt. Schreiben Sie einen Brief an Ihre Bank in Ghana, in dem Sie:
    </p>
    <ol style={writingListStyle}>
      <li>fragen, ob Ihre Karte entsperrt werden kann.</li>
      <li>fragen, welche Dokumente oder Informationen dafür benötigt werden.</li>
      <li>fragen, wie lange der Vorgang dauern wird.</li>
    </ol>
  </WorkbookTaskCard>
);

export default function A2Day18DieBankAnrufenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={18}
      title="Die Bank anrufen"
      chapter="7.18"
      workbookId="A2Day18DieBankAnrufen"
      topicPrompt="Sie rufen bei einer Bank an. Warum rufen Sie an? Welche Informationen brauchen Sie? Welche höflichen Fragen stellen Sie?"
      showSpeakingTaskCard={false}
      schreibenTask="Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt. Schreiben Sie einen Brief an Ihre Bank in Ghana."
      schreibenContent={schreibenContent}
      showWorkbookGuidance={false}
    />
  );
}
