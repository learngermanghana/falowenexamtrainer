import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day9UrlaubWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={9}
      title="Urlaub"
      chapter="4.9"
      workbookId="A2Day9Urlaub"
      topicPrompt="Sprich über deinen letzten Urlaub oder deinen Traumurlaub."
      schreibenTask="Schreiben Sie eine kurze E-Mail über einen Urlaub. Nennen Sie das Reiseziel, die Unterkunft, Aktivitäten und ein Problem oder eine schöne Erfahrung."
      lesenText="Letzten Sommer war ich mit meiner Familie am Meer. Wir haben in einem kleinen Hotel gewohnt. Jeden Morgen sind wir schwimmen gegangen. Am Abend haben wir im Restaurant gegessen und Fotos gemacht."
      lesenQuestions={[
        { stem: "Wohin ist die Person gereist?", options: ["a) Ans Meer", "b) In die Apotheke", "c) In die Schule", "d) In die Küche"] },
        { stem: "Wo hat die Familie gewohnt?", options: ["a) In einem kleinen Hotel", "b) Im Zug", "c) Auf der Straße", "d) Im Büro"] },
        { stem: "Was haben sie am Morgen gemacht?", options: ["a) Sie sind schwimmen gegangen", "b) Sie haben gearbeitet", "c) Sie haben Möbel gekauft", "d) Sie haben gelernt"] },
      ]}
      hoerenTask="Höre den Urlaubstext. Notiere Reiseziel, Verkehrsmittel, Unterkunft, Aktivitäten und wichtige Erfahrungen."
      hoerenQuestions={[
        { stem: "Welches Thema hat der Hörtext?", options: ["a) Urlaub", "b) Möbel", "c) Medikamente", "d) Grammatik allein"] },
        { stem: "Welche Aktivität passt zum Urlaub?", options: ["a) Schwimmen gehen", "b) Einen Schrank bauen", "c) Eine Tablette kaufen", "d) Einen Vertrag schreiben"] },
        { stem: "Was kann man über eine Reise erzählen?", options: ["a) Ziel, Unterkunft und Aktivitäten", "b) Nur den Namen", "c) Nur die Uhrzeit", "d) Nichts"] },
      ]}
    />
  );
}
