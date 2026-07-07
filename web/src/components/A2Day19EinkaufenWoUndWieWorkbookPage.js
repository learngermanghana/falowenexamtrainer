import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day19EinkaufenWoUndWieWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={19}
      title="Einkaufen? Wo und wie?"
      chapter="7.19"
      workbookId="A2Day19EinkaufenWoUndWie"
      topicPrompt="Wo kaufst du lieber ein: online, im Supermarkt oder auf dem Markt? Warum?"
      schreibenTask="Schreiben Sie eine kurze Meinung zum Thema Einkaufen. Vergleichen Sie zwei Einkaufsmöglichkeiten, nennen Sie Vorteile und Nachteile und erklären Sie, was Sie persönlich bevorzugen."
      lesenText="Viele Menschen kaufen heute online ein, weil es schnell und bequem ist. Andere gehen lieber in den Supermarkt oder auf den Markt, weil sie Produkte direkt sehen und vergleichen können. Beim Einkaufen sind Preis, Qualität, Zeit und Nachhaltigkeit wichtig."
      lesenQuestions={[
        { stem: "Warum kaufen viele Menschen online ein?", options: ["A) Es ist schnell und bequem", "B) Es ist immer verboten", "C) Man sieht die Produkte direkt", "D) Man bezahlt nie"] },
        { stem: "Warum gehen andere lieber in den Supermarkt oder auf den Markt?", options: ["A) Sie können Produkte direkt sehen", "B) Sie wollen nichts kaufen", "C) Sie haben kein Geld", "D) Sie müssen schlafen"] },
        { stem: "Was ist beim Einkaufen wichtig?", options: ["A) Preis und Qualität", "B) Nur die Farbe", "C) Nur das Wetter", "D) Nur die Uhrzeit"] },
      ]}
      hoerenTask="Höre einen Dialog über Einkaufen. Achte auf Einkaufsort, Preise, Qualität, Zahlungsart und die persönliche Meinung."
      hoerenQuestions={[
        { stem: "Worum geht es im Hörtext?", options: ["A) Einkaufen", "B) Wohnungssuche", "C) Arzttermin", "D) Urlaub"] },
        { stem: "Welche Zahlungsart passt zum Einkaufen?", options: ["A) Mit Karte bezahlen", "B) Einen Termin machen", "C) Ein Rezept schreiben", "D) Einen Zug nehmen"] },
        { stem: "Welche Frage passt zum Thema?", options: ["A) Wo kaufst du lieber ein?", "B) Wie hoch ist die Miete?", "C) Wann gehst du zum Arzt?", "D) Wo ist der Bahnhof?"] },
      ]}
    />
  );
}
