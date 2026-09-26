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
    <SpeakingMindMap config={getA2SpeakingMindMap(11)} />
  </>
);

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Formelle E-Mail: Auto mieten">
    <p style={{ margin: 0 }}>Sie sind in Deutschland und möchten ein Auto mieten. Schreiben Sie an eine Autovermietung.</p>
    <ul style={listStyle}>
      <li>Fragen Sie, ob für das Wochenende noch Autos verfügbar sind.</li>
      <li>Fragen Sie, welche Dokumente benötigt werden.</li>
      <li>Fragen Sie nach dem Preis und ob eine Versicherung enthalten ist.</li>
    </ul>
  </WorkbookTaskCard>
);




export default function A2Day11UnterwegsVerkehrsmittelWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={11}
      title="Unterwegs: Verkehrsmittel vergleichen"
      chapter="4.11"
      workbookId="A2Day11UnterwegsVerkehrsmittel"
      topicPrompt="Vergleiche verschiedene Verkehrsmittel."
      sprechenContent={sprechenContent}
      schreibenTask="Schreiben Sie eine formelle E-Mail an eine Autovermietung."
      schreibenContent={schreibenContent}
      schreibenPlaceholder={"Sehr geehrte Damen und Herren,\n\nich möchte für das Wochenende ..."}
      showWorkbookGuidance={false}
    />
  );
}
