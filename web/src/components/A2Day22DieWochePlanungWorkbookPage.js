import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";



export default function A2Day22DieWochePlanungWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={22}
      title="Die Woche planen"
      chapter="8.22"
      workbookId="A2Day22DieWochePlanung"
      topicPrompt="Beschreibe deine Woche von Montag bis Sonntag. Nenne Arbeit oder Schule, Termine, Freizeit und Erledigungen und erkläre, wie du deine Zeit organisierst."
      mindMapOnlySpeaking
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihre kommende Woche. Nennen Sie mindestens drei Termine oder Aktivitäten, erklären Sie, wann Sie Zeit haben, und schlagen Sie ein Treffen vor."
      schreibenPlaceholder="Liebe/r ...,\n\nmeine nächste Woche ist ziemlich voll. Am Montag ..."
      showWorkbookGuidance={false}
    />
  );
}
