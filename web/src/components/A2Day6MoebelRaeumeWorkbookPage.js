import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <WorkbookTaskCard eyebrow="Group practice" title="Teil 1 · Sprechen" practiceOnly>
    <p style={paragraph}>
      Open each mind-map branch, practise the sentence, and connect the parts into one clear room description.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(6)} />
</>;

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="E-Mail an eine Freundin / einen Freund: Mein Zimmer">
    <p style={paragraph}>
      <strong>Aufgabe:</strong> Sie sind vor Kurzem umgezogen und möchten einer Freundin oder einem Freund von Ihrem neuen Zimmer erzählen.
      Schreiben Sie eine E-Mail.
    </p>
    <p style={paragraph}>Schreiben Sie etwas zu allen drei Punkten:</p>
    <ul style={list}>
      <li><strong>Warum schreiben Sie?</strong></li>
      <li><strong>Beschreiben Sie Ihr Zimmer und die wichtigsten Möbel.</strong></li>
      <li><strong>Was gefällt Ihnen an Ihrem Zimmer besonders und warum?</strong></li>
    </ul>
    <p style={paragraph}>
      Vergessen Sie nicht die Anrede und den Gruß am Schluss. Schreiben Sie einen zusammenhängenden Text.
    </p>
  </WorkbookTaskCard>
);


export default function A2Day6MoebelRaeumeWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={6}
      title="Möbel und Räume kennenlernen"
      chapter="3.6"
      workbookId="A2Day6MoebelRaeume"
      topicPrompt="Beschreibe deine Wohnung, die Zimmer und wichtige Möbel."
      sprechenContent={speakingContent}
      schreibenTask="Sie sind vor Kurzem umgezogen. Schreiben Sie einer Freundin oder einem Freund eine E-Mail über Ihr neues Zimmer und bearbeiten Sie alle drei Punkte."
      schreibenContent={schreibenContent}
      schreibenPlaceholder={"Hallo ... ,\n\nich schreibe dir, weil ...\n\nMein neues Zimmer ...\n\nBesonders gefällt mir ..., weil ...\n\nViele Grüße\n[Dein Name]"}
    />
  );
}
