import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Annas Tagesablauf

Anna ist 16 Jahre alt und Schülerin. Morgens steht sie kurz vor sieben Uhr auf. Zuerst geht sie ins Bad, wäscht ihr Gesicht, duscht und putzt ihre Zähne. Danach zieht sie sich an. Ihre Kleidung legt sie schon am Abend vorher bereit, damit sie morgens Zeit spart.

Anna lässt das Frühstück nie aus. Meistens isst sie Müsli oder Toast mit Marmelade und trinkt Tee. Bevor sie zur Schule geht, macht sie noch schnell ihr Bett. Dann läuft sie zur Bushaltestelle und fährt mit dem Schulbus.

Nach der Schule isst Anna zu Mittag. Am Nachmittag macht sie ihre Hausaufgaben. Danach trifft sie manchmal Freunde oder macht Sport. Am Abend isst die Familie gemeinsam. Später schaut Anna kurz fern, bereitet ihre Sachen für den nächsten Tag vor und geht gegen 22 Uhr ins Bett.`;

const lesenQuestions = [
  {
    stem: "Wann steht Anna auf?",
    options: ["A) Kurz vor sieben Uhr", "B) Um neun Uhr", "C) Nach der Schule", "D) Um Mitternacht"],
  },
  {
    stem: "Warum legt Anna ihre Kleidung am Abend vorher bereit?",
    options: ["A) Damit sie morgens Zeit spart.", "B) Weil sie keine Schule hat.", "C) Damit sie später frühstückt.", "D) Weil sie Sport macht."],
  },
  {
    stem: "Was isst Anna meistens zum Frühstück?",
    options: ["A) Müsli oder Toast mit Marmelade", "B) Nur Suppe", "C) Reis und Fleisch", "D) Nichts"],
  },
  {
    stem: "Was macht Anna am Nachmittag zuerst?",
    options: ["A) Sie macht Hausaufgaben.", "B) Sie geht schlafen.", "C) Sie fährt zur Schule.", "D) Sie frühstückt."],
  },
  {
    stem: "Was macht Anna vor dem Schlafengehen?",
    options: ["A) Sie bereitet ihre Sachen für den nächsten Tag vor.", "B) Sie fährt zur Arbeit.", "C) Sie geht einkaufen.", "D) Sie nimmt den Schulbus."],
  },
];

export default function A2Day25TagesablaufWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={25}
      title="Tagesablauf"
      chapter="9.25"
      workbookId="A2Day25Tagesablauf"
      topicPrompt="Beschreibe deinen Tagesablauf vom Aufstehen bis zum Schlafengehen. Nenne Uhrzeiten, Arbeit oder Schule, Essen, Freizeit und Abendroutine."
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihren Tagesablauf. Beschreiben Sie Ihren Morgen, Ihren Arbeits- oder Schultag und Ihren Abend. Fragen Sie anschließend nach dem Tagesablauf der anderen Person."
      schreibenPlaceholder="Liebe/r ...,\n\nmein Tag beginnt normalerweise um ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie Falowen Radio noch einmal und achten Sie auf Reihenfolge, Uhrzeiten und typische Aktivitäten im Tagesablauf. Notieren Sie drei wichtige Details und vergleichen Sie sie mit Ihrem eigenen Alltag."
      hoerenAudioUrl="https://youtu.be/m7nP2qE9gNg"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
