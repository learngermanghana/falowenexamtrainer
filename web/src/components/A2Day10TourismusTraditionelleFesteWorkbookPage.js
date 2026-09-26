import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const sprechenContent = (
  <>
    <WorkbookTaskCard eyebrow="Group practice" title="Teil 1 · Sprechen" practiceOnly>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Open each mind-map branch, practise the sentence, and connect the parts into one clear answer.
      </p>
    </WorkbookTaskCard>
    <SpeakingMindMap config={getA2SpeakingMindMap(10)} />
  </>
);

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Informelle Briefaufgabe" title="Einen Freund oder eine Freundin zu einem Fest einladen">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an einen Freund oder eine Freundin und laden Sie die Person zu einem Fest ein.
    </p>
    <ol style={listStyle}>
      <li>Erzählen Sie von dem Fest und warum es besonders ist.</li>
      <li>Laden Sie die Person ein und nennen Sie Datum und Ort.</li>
      <li>Erklären Sie, was die Person mitbringen sollte oder was sie dort erwarten kann.</li>
    </ol>
    <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 700 }}>
      Schreiben Sie ungefähr 60–80 Wörter und kopieren Sie Ihre fertige Antwort anschließend in den Submit-Tab.
    </p>
  </WorkbookTaskCard>
);




export default function A2Day10TourismusTraditionelleFesteWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={10}
      title="Tourismus und traditionelle Feste"
      chapter="4.10"
      workbookId="A2Day10TourismusTraditionelleFeste"
      topicPrompt="Sprich über Tourismus oder ein traditionelles Fest."
      sprechenContent={sprechenContent}
      schreibenTask="Schreiben Sie einen Brief und laden Sie einen Freund oder eine Freundin zu einem Fest ein."
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...\n\nich möchte dich zu ... einladen. Das Fest findet ... statt."
      showWorkbookGuidance={false}
    />
  );
}
