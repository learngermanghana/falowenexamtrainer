import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";



export default function A2Day25TagesablaufWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={25}
      title="Tagesablauf"
      chapter="9.25"
      workbookId="A2Day25Tagesablauf"
      topicPrompt="Beschreibe deinen Tagesablauf vom Aufstehen bis zum Schlafengehen. Nenne Uhrzeiten, Arbeit oder Schule, Essen, Freizeit und Abendroutine."
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihren Tagesablauf. Beschreiben Sie Ihren Morgen, Ihren Arbeits- oder Schultag und Ihren Abend. Fragen Sie anschließend nach dem Tagesablauf der anderen Person."
      schreibenPlaceholder="Liebe/r ...,\n\nmein Tag beginnt normalerweise um ..."
      showHoeren={false}
      showWorkbookGuidance={false}
    />
  );
}
