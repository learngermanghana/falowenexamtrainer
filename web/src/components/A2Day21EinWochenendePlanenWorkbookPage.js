import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";



const schreibenContent = (
  <div style={{ display: "grid", gap: 10 }}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an einen Freund oder eine Freundin, in dem Sie ihn oder sie zu
      einem gemeinsamen Wochenende einladen.
    </p>
    <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
      <li>
        Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind (z. B.
        was Sie vorhaben und worauf Sie sich freuen).
      </li>
      <li>
        Laden Sie die Person ein, mit Ihnen zu kommen, und nennen Sie wichtige Details (Datum,
        Ort, Treffpunkt, Dauer).
      </li>
      <li>
        Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann (Kleidung,
        Essen, Ausrüstung, Aktivitäten).
      </li>
    </ol>
  </div>
);

export default function A2Day21EinWochenendePlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={21}
      title="Ein Wochenende planen"
      chapter="8.21"
      workbookId="A2Day21EinWochenendePlanen"
      topicPrompt="Plane ein Wochenende. Sage, was du am Samstag und Sonntag machen möchtest, mit wem du unterwegs bist und was du bei gutem oder schlechtem Wetter machst."
      schreibenTask="Einladung zu einem gemeinsamen Wochenende"
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...,\n\nich möchte dich zu einem gemeinsamen Wochenende einladen ..."
      hoerenTask="Dies ist eine separate Goethe-Hören-Übung für Teil 4. Hören Sie den Test aufmerksam und kontrollieren Sie Ihre Antworten anschließend mit der Lösung im Video. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht Teil 4."
      hoerenAudioUrl="https://youtu.be/Qg0tQFveI0M"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
