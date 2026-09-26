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
      Open each mind-map branch, practise the sentence, and connect the parts into one clear answer.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(2)} />
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Brief an Felix: Mein Chef / Meine Chefin">
  <p style={paragraph}><strong>Aufgabe:</strong> Schreibe Felix einen kurzen Brief über deinen Chef oder deine Chefin.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Schreibe, warum du Felix schreibst.</li>
    <li>Beschreibe das Aussehen deines Chefs / deiner Chefin.</li>
    <li>Beschreibe Persönlichkeit und Verhalten bei der Arbeit.</li>
    <li>Sage, was dir gefällt oder was besser sein könnte.</li>
    <li>Frage Felix am Ende nach seinem Chef / seiner Chefin.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Lieber Felix, → Grund → Beschreibung → Meinung → Frage → Viele Grüße.</p>
</WorkbookTaskCard>;




export default function A2Day2PersonenBeschreibenWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={2}
    title="Personen beschreiben"
    chapter="1.2"
    workbookId="A2Day2PersonenBeschreiben"
    topicPrompt="Personen beschreiben"
    sprechenContent={speakingContent}
    schreibenContent={writingContent}
    schreibenPlaceholder={"Lieber Felix,\n\nich schreibe dir, weil ...\n\nMein Chef / Meine Chefin ist ... Er/Sie hat ... Er/Sie ist ...\n\nIch finde ...\n\nWie ist dein Chef / deine Chefin?\n\nViele Grüße\n[Dein Name]"}
  />;
}
