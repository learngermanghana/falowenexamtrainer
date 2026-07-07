import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day5FreizeitWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={5}
      title="Was machst du in deiner Freizeit?"
      chapter="2.5"
      workbookId="A2Day5Freizeit"
      topicPrompt="Welche Freizeitaktivitäten machst du gern und warum?"
      schreibenTask="Schreiben Sie eine kurze E-Mail über Ihre Freizeit. Nennen Sie zwei Aktivitäten, sagen Sie, wann Sie sie machen, und erklären Sie, warum Sie sie mögen."
      lesenText="In meiner Freizeit treffe ich Freunde, höre Musik und sehe manchmal Filme. Am Wochenende gehe ich gern spazieren oder spiele Fußball. Freizeit ist wichtig, weil man sich erholt."
      lesenQuestions={[
        { stem: "Was macht die Person in der Freizeit?", options: ["a) Freunde treffen", "b) Nur arbeiten", "c) Nie schlafen", "d) Immer lernen"] },
        { stem: "Wann hat die Person Zeit?", options: ["a) Am Wochenende", "b) Nie", "c) Nur nachts", "d) Nur montags"] },
        { stem: "Warum ist Freizeit wichtig?", options: ["a) Man erholt sich", "b) Man verliert alles", "c) Man wird krank", "d) Man darf nicht sprechen"] },
      ]}
      hoerenTask="Höre den Dialog über Freizeitaktivitäten. Notiere, was die Personen gern machen, wann sie Zeit haben und was sie zusammen planen."
      hoerenQuestions={[
        { stem: "Welche Aktivität wird genannt?", options: ["a) Musik hören", "b) Einen Vertrag unterschreiben", "c) Medizin kaufen", "d) Möbel tragen"] },
        { stem: "Was planen die Personen?", options: ["a) Eine Freizeitaktivität", "b) Eine Prüfung", "c) Eine Rechnung", "d) Einen Arztbesuch"] },
        { stem: "Wie reagieren die Personen?", options: ["a) Sie freuen sich", "b) Sie sind böse", "c) Sie schlafen", "d) Sie reisen sofort"] },
      ]}
    />
  );
}
