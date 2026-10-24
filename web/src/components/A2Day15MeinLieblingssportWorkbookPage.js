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
      schreibenTask="Ihr Freund Jan hat Sie gefragt, welchen Sport Sie gerne machen. Schreiben Sie eine kurze informelle E-Mail an Jan. Nennen Sie Ihren Lieblingssport und sagen Sie, wie oft Sie ihn machen. Erklären Sie, warum Ihnen dieser Sport gefällt. Laden Sie Jan ein, nächsten Samstag zusammen Sport zu machen."
      schreibenPlaceholder="Hallo Jan,\n\nmein Lieblingssport ist ... Ich ... , weil ... Hast du nächsten Samstag Zeit?\n\nLiebe Grüße"
      showWorkbookGuidance={false}
    />
  );
}
