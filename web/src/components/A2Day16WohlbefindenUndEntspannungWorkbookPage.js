import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day16WohlbefindenUndEntspannungWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={16}
      title="Wohlbefinden und Entspannung"
      chapter="6.16"
      workbookId="A2Day16WohlbefindenUndEntspannung"
      topicPrompt="Was machen Sie für Ihr Wohlbefinden, Ihre Entspannung und Ihre Gesundheit?"
      schreibenTask="Schreiben Sie eine E-Mail an einen Arzt. Fragen Sie nach einem Termin, fragen Sie nach den Kosten oder der Versicherung und fragen Sie nach möglichen Untersuchungen oder Behandlungen."
      lesenText="Viele Menschen möchten gesünder leben. Sie essen mehr Obst und Gemüse, trinken Wasser und bewegen sich jeden Tag. Manche besuchen einen Yoga-Kurs, gehen spazieren oder machen eine digitale Pause, damit sie sich entspannen können."
      lesenQuestions={[
        { stem: "Was hilft beim gesunden Leben?", options: ["A) Obst und Gemüse", "B) Nur Fast Food", "C) Kein Wasser", "D) Keine Bewegung"] },
        { stem: "Was kann man zur Entspannung machen?", options: ["A) Yoga machen", "B) Nur arbeiten", "C) Nie schlafen", "D) Stress suchen"] },
        { stem: "Warum machen manche Menschen eine digitale Pause?", options: ["A) Um sich zu entspannen", "B) Um mehr Stress zu haben", "C) Um krank zu werden", "D) Um nichts zu lernen"] },
      ]}
      hoerenTask="Höre den Text über Wohlbefinden und Entspannung. Achte auf Ernährung, Bewegung, Schlaf, Arztbesuch und Freizeit."
      hoerenQuestions={[
        { stem: "Was wird für gesunde Ernährung empfohlen?", options: ["A) Mehr Obst und Gemüse", "B) Mehr Fast Food", "C) Keine Veränderung", "D) Nur Fleisch"] },
        { stem: "Wie lange sollte man sich täglich bewegen?", options: ["A) 30 Minuten", "B) 2 Minuten", "C) Gar nicht", "D) Den ganzen Tag schlafen"] },
        { stem: "Warum sind Arztbesuche wichtig?", options: ["A) Krankheiten früh erkennen", "B) Sport vermeiden", "C) Nur Rezepte sammeln", "D) Mehr Fernsehen"] },
      ]}
    />
  );
}
