import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Verkehrsmittel

In München treffen sich drei Studenten. Matthias erzählt von seinem Urlaub in Norddeutschland und der Insel seiner Eltern. Bernd berichtet über Reisen nach Barcelona und Paris mit Tram, Taxi und U-Bahn. Thomas aus Österreich erzählt von Motorradtouren in den Bergen und viel Verkehr auf den Autobahnen.`;

const lesenQuestions = [
  {
    stem: "Wohin fuhr Matthias?",
    options: ["A) In die Südsee", "B) Ans Mittelmeer", "C) An die Nordsee", "D) An die Ostsee"],
  },
  {
    stem: "Wo leben die Eltern von Matthias?",
    options: ["A) In einer Großstadt", "B) Auf einer Insel", "C) Im Hotel", "D) In den Bergen"],
  },
  {
    stem: "Aus welchem Land stammt der Student Bernd?",
    options: ["A) Aus der Schweiz", "B) Aus Deutschland", "C) Aus Frankreich", "D) Aus Österreich"],
  },
  {
    stem: "Mit welchem Fahrzeug besichtigte Bernd die Stadt Paris?",
    options: ["A) Mit der U-Bahn", "B) Mit dem Auto", "C) Mit dem Fahrrad", "D) Mit dem Bus"],
  },
  {
    stem: "Was mag der Österreicher Thomas?",
    options: ["A) Den Wind und das Meer", "B) Überfüllte Autobahnen", "C) Große Städte", "D) Die Berge und die Natur"],
  },
];

export default function A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage() {
  return (
    <div data-a2-day23-native-guidance="true">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <p style={{ margin: "0 0 8px", color: "#475569", fontSize: 14 }}>
          Teil 4 · Hören is self-check practice; do not send Hören through Submit.
        </p>
      </div>
      <A2StandardTabbedWorkbookPage
        ariaLabel="A2 Day 23 workbook sections"
        day={23}
        title="Wie kommst du zur Schule / zur Arbeit?"
        chapter="9.23"
        workbookId="A2Day23WieKommstDuZurSchuleOderZurArbeit"
        topicPrompt="Beschreibe deinen Weg zur Schule oder zur Arbeit. Sage, welche Verkehrsmittel du benutzt, wie lange der Weg dauert und warum du diese Möglichkeit wählst."
        schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihren Weg zur Schule oder zur Arbeit. Beschreiben Sie Ihre Verkehrsmittel, die Dauer des Weges und einen Vor- oder Nachteil. Fragen Sie auch, wie die andere Person zur Schule oder zur Arbeit kommt."
        schreibenPlaceholder="Liebe/r ...,\n\nich möchte dir von meinem Arbeitsweg erzählen. Normalerweise ..."
        lesenText={lesenText}
        lesenQuestions={lesenQuestions}
        hoerenTask="Öffnen Sie die separate Goethe-Hören-Übung für Teil 4. Falowen Radio gehört zur Vorbereitung vor dem Workbook und ist nicht die Teil-4-Aufgabe."
        hoerenAudioUrl="https://youtu.be/6DA1dYfqEZo?list=PLg78ckjpHfZzy9rvr_CmY73BLJiPTiaXL"
        hoerenQuestions={[]}
        showWorkbookGuidance={false}
      />
    </div>
  );
}
