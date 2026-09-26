import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";




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
      showWorkbookGuidance={false}
    />
  );
}
