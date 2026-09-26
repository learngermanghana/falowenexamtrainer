import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";




export default function A2Day20TypischeReklamationssituationenWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="A2" day={20}>
      <A2StandardTabbedWorkbookPage
        day={20}
        title="Typische Reklamationssituationen üben"
        chapter="7.20"
        workbookId="A2Day20TypischeReklamationssituationen"
        topicPrompt="Du möchtest ein defektes oder falsches Produkt reklamieren. Erkläre das Problem höflich und sage, welche Lösung du möchtest."
        schreibenTask="Sie haben ein Produkt gekauft, aber es ist defekt oder nicht wie bestellt. Schreiben Sie eine formelle Reklamation. Erklären Sie, was Sie gekauft haben, beschreiben Sie das Problem und bitten Sie höflich um Umtausch, Reparatur oder Rückerstattung."
        schreibenPlaceholder="Sehr geehrte Damen und Herren,\n\nich wende mich an Sie, weil ..."
        showWorkbookGuidance={false}
      />
    </RadioFirstWorkbookGate>
  );
}
