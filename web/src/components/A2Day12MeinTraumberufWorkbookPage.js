import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const hoerenQuestions = [
  {
    stem: "Wann beginnt Dr. Müllers Arbeitstag?",
    options: ["A) Um 5:00 Uhr", "B) Um 6:00 Uhr", "C) Um 7:00 Uhr", "D) Um 8:00 Uhr"],
  },
  {
    stem: "Was macht Dr. Müller um 7:00 Uhr?",
    options: [
      "A) Liest die Patientenakten",
      "B) Bereitet sich auf die Visite vor",
      "C) Beginnt die Visite auf der Station",
      "D) Hat eine Besprechung mit Kollegen",
    ],
  },
  {
    stem: "Wann beginnt die Sprechstunde?",
    options: ["A) Um 8:00 Uhr", "B) Um 9:00 Uhr", "C) Um 10:00 Uhr", "D) Um 11:00 Uhr"],
  },
  {
    stem: "Was macht Dr. Müller oft während seiner Mittagspause?",
    options: ["A) Isst in Ruhe", "B) Führt wichtige Telefonate", "C) Geht spazieren", "D) Liest ein Buch"],
  },
  {
    stem: "Wann endet Dr. Müllers Arbeitstag selten?",
    options: ["A) Vor 16:00 Uhr", "B) Vor 17:00 Uhr", "C) Vor 18:00 Uhr", "D) Vor 19:00 Uhr"],
  },
];

const A2Day12MeinTraumberufWorkbookPage = () => (
  <A2StandardTabbedWorkbookPage
    day={12}
    chapter="5.12"
    title="Mein Traumberuf"
    workbookId="A2Day12MeinTraumberuf"
    topicPrompt="Mein Traumberuf"
    mindMapOnlySpeaking
    hoerenTask="Höre den Beitrag über Dr. Müllers Arbeitstag. Trage danach deine endgültigen Antwortbuchstaben im Submit-Bereich ein."
    hoerenAudioUrl="https://youtu.be/VGzHSjn3O-A"
    hoerenQuestions={hoerenQuestions}
  />
);

export default A2Day12MeinTraumberufWorkbookPage;
