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



const hoerenQuestions = [
  { stem: "Wohin möchte Thomas fahren?", options: ["A) Zum Strand", "B) In die Berge", "C) In die Stadt", "D) Zum Flughafen"] },
  { stem: "Welches Auto wählt Thomas?", options: ["A) Ein kleines Auto", "B) Ein mittelgroßes Auto", "C) Ein großes Auto", "D) Ein Elektroauto"] },
  { stem: "Wie viel kostet das Auto pro Tag?", options: ["A) 40 Euro", "B) 50 Euro", "C) 60 Euro", "D) 70 Euro"] },
  { stem: "Welche Dokumente zeigt Thomas?", options: ["A) Führerschein und Personalausweis", "B) Führerschein und Reisepass", "C) Führerschein und Kreditkarte", "D) Reisepass und Mietvertrag"] },
  { stem: "Was überprüft Thomas vor der Fahrt?", options: ["A) Den Benzinstand", "B) Das Auto auf mögliche Schäden", "C) Das Navigationssystem", "D) Die Klimaanlage"] },
];

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
      hoerenTask="Höre das Gespräch bei der Autovermietung und beantworte die Fragen. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/cpiYNbbIvr4"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
