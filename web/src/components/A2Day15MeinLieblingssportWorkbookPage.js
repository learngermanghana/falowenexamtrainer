import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";


const hoerenQuestions = [
  {
    stem: "Was ist besonders beliebt im neuen Fitnessstudio \"Vital Plus\"?",
    options: ["A) Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Kletterkurse"],
  },
  {
    stem: "Was bietet der Stadtpark im Sommer an?",
    options: ["A) Kostenlose Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Fußballturniere"],
  },
  {
    stem: "Was bietet das Schwimmbad \"Aqua Fun\" an?",
    options: ["A) Wassergymnastik und Aqua-Zumba", "B) Kletterkurse", "C) Fußballkurse", "D) Boxtraining"],
  },
  {
    stem: "Für wen ist der neue Kletterpark geeignet?",
    options: ["A) Nur für Anfänger", "B) Nur für Fortgeschrittene", "C) Für Anfänger und Fortgeschrittene", "D) Nur für Kinder"],
  },
  {
    stem: "Was bietet der Sportverein \"Fitness für alle\" an?",
    options: ["A) Yoga-Kurse", "B) Volleyball und Basketball", "C) Schwimmkurse", "D) Tennis und Golf"],
  },
];


export default function A2Day15MeinLieblingssportWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={15}
      title="Mein Lieblingssport"
      chapter="6.15"
      workbookId="A2Day15MeinLieblingssport"
      topicPrompt="Was ist Ihr Lieblingssport? Seit wann machen Sie diesen Sport, wie oft trainieren Sie und warum gefällt er Ihnen?"
      schreibenTask="Sie sind jetzt in Deutschland und möchten sich für einen Sportkurs anmelden. Schreiben Sie eine E-Mail an einen Sportverein oder ein Fitnessstudio. Fragen Sie, ob es freie Plätze gibt, beschreiben Sie Ihre Erfahrung oder Motivation und fragen Sie nach Trainingszeiten und Kosten."
      schreibenPlaceholder="Sehr geehrte Damen und Herren,\n\nich interessiere mich für Ihren Sportkurs, weil ..."
      hoerenTask="Hören Sie den Beitrag über Sportangebote in der Stadt. Achten Sie auf Kurse, Orte und Zielgruppen."
      hoerenAudioUrl="https://youtu.be/p_OE59m0J-Y"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
