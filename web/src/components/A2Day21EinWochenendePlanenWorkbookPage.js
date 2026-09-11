import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Unser Wochenende in Köln

Mara und Daniel planen ein gemeinsames Wochenende in Köln. Am Samstagmorgen möchten sie mit dem Zug ankommen und zuerst im Hotel einchecken. Danach wollen sie den Kölner Dom besichtigen. Wenn das Wetter gut ist, machen sie am Nachmittag einen Spaziergang am Rhein. Am Abend möchten sie in einem kleinen Restaurant essen und später ein Konzert besuchen.

Für Sonntag haben sie zwei Möglichkeiten: Falls es regnet, gehen sie in ein Museum. Wenn die Sonne scheint, leihen sie Fahrräder aus und fahren durch den Rheinpark. Um 17 Uhr fährt ihr Zug zurück. Deshalb möchten sie spätestens um 16 Uhr am Bahnhof sein.`;

const lesenQuestions = [
  {
    stem: "Wie reisen Mara und Daniel nach Köln?",
    options: ["A) Mit dem Zug", "B) Mit dem Auto", "C) Mit dem Flugzeug", "D) Mit dem Fahrrad"],
  },
  {
    stem: "Was möchten sie am Samstagnachmittag machen, wenn das Wetter gut ist?",
    options: ["A) Im Hotel bleiben", "B) Am Rhein spazieren", "C) Ein Museum besuchen", "D) Nach Hause fahren"],
  },
  {
    stem: "Was planen sie für Samstagabend?",
    options: ["A) Einkaufen und schwimmen", "B) Restaurant und Konzert", "C) Museum und Bahnhof", "D) Fahrradtour und Picknick"],
  },
  {
    stem: "Was machen sie am Sonntag, falls es regnet?",
    options: ["A) Sie gehen in ein Museum.", "B) Sie fahren Fahrrad.", "C) Sie besuchen den Dom noch einmal.", "D) Sie fahren früher nach Hause."],
  },
  {
    stem: "Warum möchten sie spätestens um 16 Uhr am Bahnhof sein?",
    options: ["A) Ihr Zug fährt um 17 Uhr.", "B) Das Hotel schließt.", "C) Das Konzert beginnt.", "D) Sie treffen Freunde."],
  },
];

const schreibenContent = (
  <div style={{ display: "grid", gap: 10 }}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an einen Freund oder eine Freundin, in dem Sie ihn oder sie zu
      einem gemeinsamen Wochenende einladen.
    </p>
    <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
      <li>
        Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind (z. B.
        was Sie vorhaben und worauf Sie sich freuen).
      </li>
      <li>
        Laden Sie die Person ein, mit Ihnen zu kommen, und nennen Sie wichtige Details (Datum,
        Ort, Treffpunkt, Dauer).
      </li>
      <li>
        Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann (Kleidung,
        Essen, Ausrüstung, Aktivitäten).
      </li>
    </ol>
  </div>
);

export default function A2Day21EinWochenendePlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={21}
      title="Ein Wochenende planen"
      chapter="8.21"
      workbookId="A2Day21EinWochenendePlanen"
      topicPrompt="Plane ein Wochenende. Sage, was du am Samstag und Sonntag machen möchtest, mit wem du unterwegs bist und was du bei gutem oder schlechtem Wetter machst."
      schreibenTask="Einladung zu einem gemeinsamen Wochenende"
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...,\n\nich möchte dich zu einem gemeinsamen Wochenende einladen ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie Falowen Radio noch einmal und achten Sie auf Aktivitäten, Zeiten, Treffpunkte und mögliche Änderungen bei schlechtem Wetter."
      hoerenAudioUrl="https://youtu.be/LlXsNA1a8lc"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
