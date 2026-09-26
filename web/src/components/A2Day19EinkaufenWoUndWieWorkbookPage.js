import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const sectionStyle = { display: "grid", gap: 12 };

const schreibenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Writing Task: Einladung zum Einkaufen</strong></p>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie möchten einen Freund oder eine Freundin zum Einkaufen einladen, weil Sie gemeinsam Möbel für Ihre neue Wohnung auswählen möchten. Schreiben Sie eine E-Mail an Ihren Freund oder Ihre Freundin.
    </p>
    <ol style={listStyle}>
      <li>Laden Sie ihn oder sie zum Einkaufen ein und erklären Sie den Grund.</li>
      <li>Schlagen Sie vor, wann und wo Sie sich treffen können.</li>
      <li>Bitten Sie um seine oder ihre Meinung zu Ihrer Idee.</li>
    </ol>
  </div>
);




export default function A2Day19EinkaufenWoUndWieWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={19}
      title="Einkaufen? Wo und wie?"
      chapter="7.19"
      workbookId="A2Day19EinkaufenWoUndWie"
      topicPrompt="Wo kaufst du gern ein? Sprich über Geschäft oder Online-Shop, Produkte, Preis, Qualität und deine Meinung."
      schreibenTask="Einladung zum Einkaufen"
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...,\n\nich möchte dich zum Einkaufen einladen, weil ..."
      showWorkbookGuidance={false}
    />
  );
}
