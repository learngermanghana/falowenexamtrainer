import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const hoerenQuestions = [
  {
    stem: "Warum ging Anna in die Apotheke?",
    options: ["A) Um Medikamente gegen Husten zu kaufen", "B) Wegen Kopfschmerzen", "C) Um eine Creme zu kaufen", "D) Um Proben zu holen"],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Kopfschmerzen?",
    options: ["A) Aspirin", "B) Paracetamol", "C) Ibuprofen", "D) Nasenspray"],
  },
  {
    stem: "Welches Problem hatte Anna noch?",
    options: ["A) Halsschmerzen", "B) Trockene Haut", "C) Schnupfen", "D) Fieber"],
  },
  {
    stem: "Wie reagierte Anna auf die Empfehlungen der Apothekerin?",
    options: ["A) Sie war skeptisch", "B) Sie war erleichtert", "C) Sie war verwirrt", "D) Sie war unzufrieden"],
  },
  {
    stem: "Was bekam Anna zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Proben von Produkten", "C) Eine Broschüre", "D) Ein neues Medikament"],
  },
];

const A2Day17InDieApothekeGehenWorkbookPage = () => (
  <A2StandardTabbedWorkbookPage
    day={17}
    chapter="6.17"
    title="In die Apotheke gehen"
    workbookId="A2Day17InDieApothekeGehen"
    topicPrompt="In die Apotheke gehen"
    mindMapOnlySpeaking
    hoerenTask="Höre das Gespräch in der Apotheke. Trage danach deine endgültigen Antwortbuchstaben im Submit-Bereich ein."
    hoerenAudioUrl="https://youtu.be/jgl__L4L9kE"
    hoerenQuestions={hoerenQuestions}
  />
);

export default A2Day17InDieApothekeGehenWorkbookPage;
