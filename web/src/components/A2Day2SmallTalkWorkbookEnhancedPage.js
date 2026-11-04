import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <WorkbookTaskCard eyebrow="Präsentationsübung" title="Teil 1 · Sprechen" practiceOnly>
    <p style={paragraph}>
      Stelle dich kurz vor: Name und Herkunft, Familie und Wohnort, Sprachen und Beruf, Freizeit. Verbinde die vier Punkte zu einer kurzen Präsentation über dich.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={getA2SpeakingMindMap(1)} />
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Brief an Felix: Arbeit und Familie">
  <p style={paragraph}><strong>Aufgabe:</strong> Schreibe Felix einen kurzen Brief über deine Arbeit und deine Familie.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Schreibe, warum du Felix schreibst.</li>
    <li>Erzähle etwas über deine Arbeit oder dein Studium.</li>
    <li>Erzähle etwas Neues über deine Familie.</li>
    <li>Verwende mindestens einen Grund mit <strong>weil</strong> oder <strong>denn</strong>.</li>
    <li>Frage Felix am Ende, wie es ihm geht und was bei ihm neu ist.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Lieber Felix, → Grund → Arbeit/Studium → Familie → Frage → Viele Grüße.</p>
</WorkbookTaskCard>;




export default function A2Day1SmallTalkWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={1}
    title="Small Talk"
    chapter="1.1"
    workbookId="A2Day1SmallTalk"
    topicPrompt="Small Talk"
    sprechenContent={speakingContent}
    schreibenContent={writingContent}
    schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich hoffe, es geht dir gut.\n\nIch schreibe dir, weil ...\n\nIch arbeite / studiere ...\nMeine Familie ...\n\nWie geht es dir? Was ist bei dir neu?\n\nViele Grüße\n[Dein Name]"}
  />;
}
