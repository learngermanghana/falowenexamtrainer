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
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(5)} />
</>;

const schreibenContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="E-Mail an Alex: Freizeit planen">
  <p style={paragraph}><strong>Aufgabe:</strong> Du möchtest mit deinem Freund Alex am Wochenende etwas unternehmen. Schreibe Alex eine kurze E-Mail.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Sage, dass du am Wochenende Zeit hast.</li>
    <li>Schreibe, dass du etwas zusammen machen möchtest.</li>
    <li>Frage, ob Alex am Wochenende frei ist.</li>
    <li>Frage, welche Aktivität er vorschlägt.</li>
    <li>Schlage selbst eine mögliche Aktivität vor.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Hallo/Lieber Alex, → Zeit → gemeinsamer Plan → Frage → eigener Vorschlag → Viele Grüße.</p>
</WorkbookTaskCard>;




export default function A2Day5FreizeitWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={5}
    title="Was machst du in deiner Freizeit?"
    chapter="2.5"
    workbookId="A2Day5Freizeit"
    topicPrompt="Welche Freizeitaktivitäten machst du gern und warum?"
    sprechenContent={speakingContent}
    schreibenTask="Du möchtest mit deinem Freund Alex am Wochenende etwas unternehmen. Schreibe Alex eine kurze E-Mail."
    schreibenContent={schreibenContent}
    schreibenPlaceholder={"Lieber Alex,\n\nich habe am Wochenende Zeit und möchte gern ...\n\nHast du am ... Zeit? Was möchtest du machen? Wir könnten ...\n\nViele Grüße\n[Dein Name]"}
  />;
}
