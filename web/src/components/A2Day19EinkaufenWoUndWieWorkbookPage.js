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



const hoerenQuestions = [
  { stem: "Was bietet Online-Shopping den Verbrauchern?", options: ["A) Hohe Preise", "B) Bequeme Möglichkeit, Produkte nach Hause zu bestellen", "C) Weniger Auswahl"] },
  { stem: "Was ist ein Nachteil des Online-Shoppings?", options: ["A) Geringe Anzahl von Rücksendungen", "B) Hohe Anzahl von Rücksendungen und Umweltbelastung", "C) Niedrige Preise"] },
  { stem: "Worauf müssen Verbraucher beim Online-Kauf achten?", options: ["A) Auf vertrauenswürdige Websites und Schutz persönlicher Daten", "B) Auf hohe Preise", "C) Auf schnelle Lieferung"] },
  { stem: "Wo sollten die Produkte, die online gekauft werden, herkommen?", options: ["A) Aus nachhaltigen Quellen und fairen Bedingungen", "B) Aus dem Ausland", "C) Aus teuren Geschäften"] },
  { stem: "Wie hat das Internet den Konsum verändert?", options: ["A) Es hat den Konsum eingeschränkt", "B) Es hat den Konsum revolutioniert und neue Möglichkeiten geschaffen", "C) Es hat keine großen Veränderungen gebracht"] },
];

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
      hoerenTask="Hören Sie den Text ‚Online Shopping und Konsumverhalten‘ und wählen Sie jeweils die richtige Antwort."
      hoerenAudioUrl="https://drive.google.com/file/d/1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB/view?usp=sharing"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
