import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";



const hoerenQuestions = [
  {
    stem: "Warum bringt Laura den Wasserkocher zurück?",
    options: ["A) Er ist zu teuer", "B) Er funktioniert nicht", "C) Er ist zu groß", "D) Er gefällt ihr nicht"],
  },
  {
    stem: "Was bringt Laura als Kaufnachweis mit?",
    options: ["A) Eine Rechnung vom Arzt", "B) Eine Kundenkarte", "C) Den Kassenbon", "D) Einen Brief"],
  },
  {
    stem: "Was bietet der Verkäufer Laura an?",
    options: ["A) Einen Rabatt", "B) Eine Reparatur in einem Jahr", "C) Einen Umtausch oder eine Rückerstattung", "D) Einen Gutschein für Essen"],
  },
  {
    stem: "Welches Problem gibt es mit der Jacke?",
    options: ["A) Sie hat die falsche Farbe", "B) Sie ist beschädigt", "C) Sie hat die falsche Größe", "D) Sie kommt zu spät"],
  },
  {
    stem: "Was bittet Laura den Kundenservice zu schicken?",
    options: ["A) Einen Retourenschein", "B) Eine neue Rechnung", "C) Einen Katalog", "D) Einen Rabattcode"],
  },
];

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
        hoerenTask="Hören Sie die Reklamationsdialoge. Achten Sie auf das Problem, den Kaufnachweis und die angebotene Lösung."
        hoerenAudioUrl="https://youtu.be/pH1X3E7vOao"
        hoerenQuestions={hoerenQuestions}
        showWorkbookGuidance={false}
      />
    </RadioFirstWorkbookGate>
  );
}
