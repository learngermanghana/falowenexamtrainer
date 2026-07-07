import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day8RezepteUndEssenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={8}
      title="Rezepte und Essen"
      chapter="3.8"
      workbookId="A2Day8RezepteUndEssen"
      topicPrompt="Erkläre ein einfaches Rezept und sprich über Essen und Zutaten."
      schreibenTask="Schreiben Sie ein einfaches Rezept. Nennen Sie die Zutaten, erklären Sie die Schritte mit Imperativformen und geben Sie einen Tipp zum Servieren."
      lesenText="Für einen einfachen Salat braucht man Tomaten, Gurken, Zwiebeln, Salz, Öl und Zitronensaft. Zuerst wäscht man das Gemüse. Dann schneidet man alles klein und mischt es in einer Schüssel."
      lesenQuestions={[
        { stem: "Welche Zutaten braucht man?", options: ["a) Tomaten und Gurken", "b) Nur Reis", "c) Nur Schokolade", "d) Keine Zutaten"] },
        { stem: "Was macht man zuerst?", options: ["a) Das Gemüse waschen", "b) Schlafen", "c) Das Essen verkaufen", "d) Einen Flug buchen"] },
        { stem: "Wo mischt man den Salat?", options: ["a) In einer Schüssel", "b) Im Auto", "c) Im Bad", "d) Auf dem Bett"] },
      ]}
      hoerenTask="Höre ein Rezept. Achte auf Zutaten, Reihenfolge und Imperativformen wie waschen, schneiden, mischen und servieren."
      hoerenQuestions={[
        { stem: "Worum geht es im Hörtext?", options: ["a) Ein Rezept", "b) Eine Wohnung", "c) Eine Apotheke", "d) Ein Urlaub"] },
        { stem: "Welche Handlung passt zu einem Rezept?", options: ["a) Schneiden und mischen", "b) Ein Ticket kaufen", "c) Einen Arzt rufen", "d) Möbel bestellen"] },
        { stem: "Was soll man am Ende machen?", options: ["a) Servieren", "b) Wegwerfen", "c) Kündigen", "d) Schweigen"] },
      ]}
    />
  );
}
