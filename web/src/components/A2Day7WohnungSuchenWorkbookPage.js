import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day7WohnungSuchenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={7}
      title="Eine Wohnung suchen"
      chapter="3.7"
      workbookId="A2Day7WohnungSuchen"
      topicPrompt="Beschreibe, welche Wohnung du suchst und warum sie zu dir passt."
      schreibenTask="Schreiben Sie eine kurze Nachricht an einen Vermieter. Sagen Sie, welche Wohnung Sie suchen, stellen Sie zwei Fragen zur Wohnung und bitten Sie um einen Besichtigungstermin."
      lesenText="Lena sucht eine neue Wohnung. Sie möchte eine helle Zwei-Zimmer-Wohnung in der Nähe von ihrer Arbeit. Die Warmmiete darf nicht zu hoch sein. Wichtig sind ihr ein Balkon, eine gute Busverbindung und ruhige Nachbarn."
      lesenQuestions={[
        { stem: "Was sucht Lena?", options: ["A) Eine Zwei-Zimmer-Wohnung", "B) Ein Hotel", "C) Ein Büro", "D) Ein Auto"] },
        { stem: "Was ist Lena wichtig?", options: ["A) Balkon und gute Busverbindung", "B) Nur ein Garten", "C) Ein Flughafen", "D) Ein lauter Ort"] },
        { stem: "Was darf nicht zu hoch sein?", options: ["A) Die Warmmiete", "B) Die Telefonnummer", "C) Der Balkon", "D) Die Tür"] },
      ]}
      hoerenTask="Höre ein Gespräch über eine Wohnungssuche. Achte auf Zimmerzahl, Miete, Lage, Besichtigungstermin und Fragen zur Wohnung."
      hoerenQuestions={[
        { stem: "Worum geht es im Gespräch?", options: ["A) Eine Wohnung suchen", "B) Einen Urlaub buchen", "C) Ein Rezept kochen", "D) Einen Arzttermin machen"] },
        { stem: "Welche Frage passt zur Wohnungssuche?", options: ["A) Wie hoch ist die Miete?", "B) Was kostet der Kuchen?", "C) Wann fährt der Zug?", "D) Welche Tabletten brauche ich?"] },
        { stem: "Was kann man mit dem Vermieter vereinbaren?", options: ["A) Einen Besichtigungstermin", "B) Eine Prüfung", "C) Eine Reise", "D) Einen Sportkurs"] },
      ]}
    />
  );
}
