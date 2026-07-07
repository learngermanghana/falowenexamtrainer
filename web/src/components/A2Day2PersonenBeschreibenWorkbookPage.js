import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day2PersonenBeschreibenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={2}
      title="Personen beschreiben"
      chapter="1.2"
      workbookId="A2Day2PersonenBeschreiben"
      topicPrompt="Beschreibe eine Person: Aussehen, Charakter, Kleidung und Beziehung."
      schreibenTask="Schreiben Sie eine kurze Beschreibung einer Person. Nennen Sie Name, Alter, Aussehen, Charakter und warum Sie diese Person mögen oder gut kennen."
      lesenText="Meine Freundin Sara ist 24 Jahre alt. Sie ist groß und hat schwarze Haare. Sie ist freundlich, hilfsbereit und sehr ruhig. In ihrer Freizeit liest sie gern und trifft Freunde."
      lesenQuestions={[
        { stem: "Wie alt ist Sara?", options: ["a) 24 Jahre", "b) 12 Jahre", "c) 40 Jahre", "d) 60 Jahre"] },
        { stem: "Wie ist Sara?", options: ["a) Freundlich und hilfsbereit", "b) Unfreundlich", "c) Sehr laut", "d) Krank"] },
        { stem: "Was macht Sara gern?", options: ["a) Lesen und Freunde treffen", "b) Medikamente kaufen", "c) Möbel tragen", "d) Immer schlafen"] },
      ]}
      hoerenTask="Höre eine Personenbeschreibung. Notiere Aussehen, Charakter, Kleidung und Beziehung zur Person."
      hoerenQuestions={[
        { stem: "Was wird beschrieben?", options: ["a) Eine Person", "b) Ein Rezept", "c) Eine Reise", "d) Ein Zimmer"] },
        { stem: "Welche Information gehört zu Aussehen?", options: ["a) Haare und Größe", "b) Preis", "c) Uhrzeit", "d) Ticketnummer"] },
        { stem: "Welche Information gehört zu Charakter?", options: ["a) Freundlich", "b) Blau", "c) Neben dem Fenster", "d) Gestern"] },
      ]}
    />
  );
}
