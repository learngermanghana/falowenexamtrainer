import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Formelle Schreibaufgabe" title="E-Mail an ein Hotel">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel:
    </p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einem freien Zimmer.</li>
      <li>
        Geben Sie an, was für Sie wichtig ist (z. B. Datum, Anzahl der Personen, Art des Zimmers).
      </li>
      <li>
        Fragen Sie nach den Preisen und den zusätzlichen Leistungen (z. B. Frühstück, Internetzugang).
      </li>
    </ol>
  </WorkbookTaskCard>
);


export default function A2Day9UrlaubWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={9}
      title="Urlaub"
      chapter="4.9"
      workbookId="A2Day9Urlaub"
      topicPrompt="Sprich über deinen letzten Urlaub oder deinen Traumurlaub."
      showSpeakingTaskCard={false}
      schreibenTask="Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel."
      schreibenContent={schreibenContent}
      hoerenTask="Sieh dir das eingebettete Video über Annas letzten Sommerurlaub an. Achte auf das Reiseziel, die Dauer, besondere Orte, Aktivitäten und Annas Wunsch. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/Q6PjXP6Ccik"
      hoerenQuestions={[
        {
          stem: "Wohin ist Anna im letzten Sommerurlaub gereist?",
          options: [
            "a) Italien",
            "b) Griechenland",
            "c) Spanien",
          ],
        },
        {
          stem: "Wie lange blieb Anna auf Kreta?",
          options: [
            "a) Eine Woche",
            "b) Zwei Wochen",
            "c) Drei Tage",
          ],
        },
        {
          stem: "Was hat Anna besonders gut gefallen?",
          options: [
            "a) Die Altstadt von Chania",
            "b) Der Strand von Elafonissi",
            "c) Die Berge",
          ],
        },
        {
          stem: "Was haben Anna und ihre Freunde am letzten Tag gemacht?",
          options: [
            "a) Eine Wanderung",
            "b) Eine Bootstour",
            "c) Einen Museumsbesuch",
          ],
        },
        {
          stem: "Was hofft Anna bald wieder zu tun?",
          options: [
            "a) Nach Kreta zu reisen",
            "b) Nach Italien zu reisen",
            "c) Nach Spanien zu reisen",
          ],
        },
      ]}
    />
  );
}
