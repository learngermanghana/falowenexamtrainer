import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenQuestions = [
  {
    stem: "Was ist besonders beliebt im Fitnessstudio \"Fit & Fun\"?",
    options: ["A) Yoga und Zumba", "B) Fußball und Handball", "C) Schwimmkurse", "D) Klettertraining"],
  },
  {
    stem: "Welche Mannschaftssportarten bietet der Sportverein \"Grün-Weiß\" an?",
    options: ["A) Yoga und Pilates", "B) Fußball, Handball und Volleyball", "C) Klettern und Schwimmen", "D) Tennis und Joggen"],
  },
  {
    stem: "Was ist das Highlight des jährlichen Stadtlaufs?",
    options: ["A) Die Zuschauerzahl", "B) Die Teilnahmegebühren", "C) Die Spenden an lokale Wohltätigkeitsorganisationen", "D) Die Strecke am Fluss"],
  },
  {
    stem: "Wo befindet sich die Schwimmhalle?",
    options: ["A) Im Stadtzentrum", "B) Im Stadtpark", "C) Im Seniorenclub", "D) Im Rathaus"],
  },
  {
    stem: "Was bietet der Seniorenclub \"Aktiv im Alter\" an?",
    options: ["A) Schwimmkurse", "B) Fitnessprogramme", "C) Kletterkurse", "D) Tanzshows"],
  },
];

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

const lesenText = `Sportangebote in unserer Stadt

In unserer Stadt gibt es ein breites Angebot an Sportmöglichkeiten für Jung und Alt. Besonders beliebt sind die Kurse im Fitnessstudio "Fit & Fun", wo man alles von Yoga bis Zumba ausprobieren kann. Für diejenigen, die lieber draußen aktiv sind, bietet der Sportverein "Grün-Weiß" Mannschaftssportarten wie Fußball, Handball und Volleyball an. Auch der jährliche Stadtlauf ist sehr beliebt und unterstützt lokale Wohltätigkeitsorganisationen. Die Schwimmhalle befindet sich im Stadtzentrum und der Seniorenclub "Aktiv im Alter" bietet Fitnessprogramme an.`;

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
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie den Beitrag über Sportangebote in der Stadt. Achten Sie auf Kurse, Orte und Zielgruppen."
      hoerenAudioUrl="https://youtu.be/p_OE59m0J-Y"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
