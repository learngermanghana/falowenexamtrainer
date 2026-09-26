import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";




export default function A2Day24EinenUrlaubPlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={24}
      title="Einen Urlaub planen"
      chapter="9.24"
      workbookId="A2Day24EinenUrlaubPlanen"
      topicPrompt="Plane einen Urlaub. Nenne Reiseziel, Zeitraum, Budget, Transport, Unterkunft, Aktivitäten und wichtige Vorbereitungen."
      schreibenTask="Sie möchten zusammen mit Sandra einen Urlaub planen. Schreiben Sie ihr eine E-Mail. Laden Sie sie zur gemeinsamen Planung ein, schlagen Sie einen Termin und Treffpunkt vor und fragen Sie nach ihrer Meinung zu Reiseziel, Transport oder Unterkunft."
      schreibenPlaceholder="Liebe Sandra,\n\nich möchte gern unseren Urlaub planen. Hast du ..."
      showWorkbookGuidance={false}
    />
  );
}
