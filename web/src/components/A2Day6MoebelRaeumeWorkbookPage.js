import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day6MoebelRaeumeWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={6}
      title="Möbel und Räume kennenlernen"
      chapter="3.6"
      workbookId="A2Day6MoebelRaeume"
      topicPrompt="Beschreibe deine Wohnung, die Zimmer und wichtige Möbel."
      schreibenTask="Schreiben Sie eine kurze Wohnungsbeschreibung. Beschreiben Sie mindestens zwei Zimmer, nennen Sie Möbel und sagen Sie, wo die Möbel stehen."
      lesenText="Meine Wohnung ist klein, aber gemütlich. Im Wohnzimmer steht ein Sofa neben dem Fenster. In der Küche gibt es einen Tisch und vier Stühle. Das Schlafzimmer ist ruhig."
      lesenQuestions={[
        { stem: "Wie ist die Wohnung?", options: ["a) Klein, aber gemütlich", "b) Sehr laut", "c) Ohne Zimmer", "d) Im Garten"] },
        { stem: "Wo steht das Sofa?", options: ["a) Neben dem Fenster", "b) Auf dem Dach", "c) Im Bad", "d) Unter dem Auto"] },
        { stem: "Was gibt es in der Küche?", options: ["a) Einen Tisch und vier Stühle", "b) Ein Bett", "c) Eine Dusche", "d) Einen Fernseher"] },
      ]}
      hoerenTask="Höre die Wohnungsbeschreibung. Notiere die Zimmer, Möbel und Positionsangaben wie in, auf, neben, unter oder zwischen."
      hoerenQuestions={[
        { stem: "Welches Zimmer wird beschrieben?", options: ["a) Wohnzimmer", "b) Bahnhof", "c) Apotheke", "d) Schule"] },
        { stem: "Welche Möbel werden genannt?", options: ["a) Sofa und Tisch", "b) Medikamente", "c) Tickets", "d) Bücher allein"] },
        { stem: "Welche Positionsangabe passt?", options: ["a) neben dem Fenster", "b) gestern", "c) teuer", "d) nie"] },
      ]}
    />
  );
}
