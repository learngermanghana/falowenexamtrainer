import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Eine volle Woche

Nina arbeitet von Montag bis Freitag in einem Büro. Am Montag beginnt sie um 8 Uhr und hat nach der Arbeit einen Deutschkurs. Dienstagabend geht sie ins Fitnessstudio. Am Mittwoch arbeitet sie im Homeoffice, deshalb kann sie in der Mittagspause einen Arzttermin wahrnehmen. Donnerstag trifft sie nach der Arbeit eine Freundin im Café. Am Freitag macht Nina keine Termine am Abend, weil sie sich ausruhen möchte.

Am Samstag erledigt sie ihren Einkauf und putzt die Wohnung. Wenn sie danach noch Zeit hat, besucht sie ihre Schwester. Für Sonntag plant sie nur zwei Dinge: am Vormittag lernen und am Nachmittag spazieren gehen. Nina trägt alle Termine in ihren Kalender ein, damit sie nichts vergisst.`;

const lesenQuestions = [
  {
    stem: "Was macht Nina am Montag nach der Arbeit?",
    options: ["A) Sie besucht einen Deutschkurs.", "B) Sie geht zum Arzt.", "C) Sie trifft ihre Schwester.", "D) Sie arbeitet im Homeoffice."],
  },
  {
    stem: "Warum kann Nina am Mittwoch einen Arzttermin in der Mittagspause haben?",
    options: ["A) Sie hat Urlaub.", "B) Sie arbeitet im Homeoffice.", "C) Das Büro ist geschlossen.", "D) Sie beginnt erst am Abend."],
  },
  {
    stem: "Wann trifft Nina eine Freundin?",
    options: ["A) Dienstag", "B) Mittwoch", "C) Donnerstag", "D) Sonntag"],
  },
  {
    stem: "Was macht Nina am Samstag?",
    options: ["A) Einkauf und Wohnung putzen", "B) Deutschkurs und Fitnessstudio", "C) Arzttermin und Café", "D) Nur lernen"],
  },
  {
    stem: "Warum trägt Nina ihre Termine in den Kalender ein?",
    options: ["A) Damit sie nichts vergisst.", "B) Weil sie keinen Computer hat.", "C) Damit sie später arbeitet.", "D) Weil sie keine Freizeit möchte."],
  },
];

export default function A2Day22DieWochePlanungWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={22}
      title="Die Woche planen"
      chapter="8.22"
      workbookId="A2Day22DieWochePlanung"
      topicPrompt="Beschreibe deine Woche von Montag bis Sonntag. Nenne Arbeit oder Schule, Termine, Freizeit und Erledigungen und erkläre, wie du deine Zeit organisierst."
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihre kommende Woche. Nennen Sie mindestens drei Termine oder Aktivitäten, erklären Sie, wann Sie Zeit haben, und schlagen Sie ein Treffen vor."
      schreibenPlaceholder="Liebe/r ...,\n\nmeine nächste Woche ist ziemlich voll. Am Montag ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie Falowen Radio noch einmal und achten Sie auf Wochentage, Uhrzeiten, Termine und Freizeitaktivitäten."
      hoerenAudioUrl="https://youtu.be/KR2oT-mujmI"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
