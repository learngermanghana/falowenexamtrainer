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
  <WorkbookTaskCard eyebrow="Informelle Briefaufgabe" title="Mit einem Freund oder einer Freundin eine Stadt entdecken">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie eine E-Mail an einen Freund oder eine Freundin. Sie möchten gemeinsam eine Stadt oder ein neues Viertel entdecken.
    </p>
    <ol style={listStyle}>
      <li>Sagen Sie, welchen Ort Sie gemeinsam entdecken möchten und warum.</li>
      <li>Schlagen Sie zwei Aktivitäten oder Orte vor, zum Beispiel einen Markt, einen Park, ein Café oder eine Sehenswürdigkeit.</li>
      <li>Nennen Sie einen konkreten Tag und Treffpunkt und fragen Sie, was die Person lieber machen möchte.</li>
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
      title="Eine Stadt entdecken und etwas erleben"
      chapter="4.10"
      workbookId="A2Day10TourismusTraditionelleFeste"
      topicPrompt="Sprich über eine Stadt oder einen neuen Ort, den du gern entdecken möchtest."
      sprechenContent={sprechenContent}
      schreibenTask="Schreiben Sie eine E-Mail und planen Sie mit einem Freund oder einer Freundin einen Entdeckungstag in der Stadt."
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...\n\nich möchte mit dir ... entdecken. Wir könnten zuerst ... und danach ..."
      showWorkbookGuidance={false}
    />
  );
}
