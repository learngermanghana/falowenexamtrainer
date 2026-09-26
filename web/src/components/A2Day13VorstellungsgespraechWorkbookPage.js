import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const hoerenQuestions = [
  {
    stem: "Warum ist es wichtig, sich über das Unternehmen zu informieren?",
    options: ["A) Um Produkte zu kaufen", "B) Um Interesse zu zeigen", "C) Um Fragen zu vermeiden", "D) Um Kleidung auszuwählen"],
  },
  {
    stem: "Was ist ein Zeichen von Professionalität und Respekt?",
    options: ["A) Zu spät kommen", "B) Pünktlich sein", "C) Unpassende Kleidung", "D) Leise sprechen"],
  },
  {
    stem: "Warum sollte man dem Arbeitgeber Fragen stellen?",
    options: ["A) Um das Gespräch zu verlängern", "B) Um Unsicherheit zu zeigen", "C) Um Interesse zu zeigen", "D) Um die Kleidung zu bewerten"],
  },
  {
    stem: "Welche Art von E-Mail wird nach dem Gespräch empfohlen?",
    options: ["A) Eine Dankes-E-Mail", "B) Eine Beschwerde-E-Mail", "C) Eine Frage-E-Mail", "D) Eine Kündigungs-E-Mail"],
  },
  {
    stem: "Was sollte man während des Gesprächs tun?",
    options: ["A) Unvorbereitet sein", "B) Klar und deutlich sprechen", "C) Nur zuhören", "D) Unpassende Fragen stellen"],
  },
];

const A2Day13VorstellungsgespraechWorkbookPage = () => (
  <A2StandardTabbedWorkbookPage
    day={13}
    chapter="5.13"
    title="Ein Vorstellungsgespräch"
    workbookId="A2Day13Vorstellungsgespraech"
    topicPrompt="Ein Vorstellungsgespräch"
    mindMapOnlySpeaking
    hoerenTask="Höre die Tipps zum Vorstellungsgespräch. Trage danach deine endgültigen Antwortbuchstaben im Submit-Bereich ein."
    hoerenAudioUrl="https://youtu.be/kr9Rj2j-ghw"
    hoerenQuestions={hoerenQuestions}
  />
);

export default A2Day13VorstellungsgespraechWorkbookPage;
