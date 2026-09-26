import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };




const hoerenQuestions = [
  {
    stem: "Welche Dokumente benötigen Sie, um ein Konto zu eröffnen?",
    options: [
      "A) Nur einen Reisepass",
      "B) Reisepass, Meldebescheinigung, Einkommensnachweis",
      "C) Nur einen Einkommensnachweis",
      "D) Keine Dokumente",
    ],
  },
  {
    stem: "Wie lange dauert das Beratungsgespräch?",
    options: ["A) 30 Minuten", "B) Eine Stunde", "C) Zwei Stunden", "D) 15 Minuten"],
  },
  {
    stem: "Wie viele Kontomodelle bietet die Bank an?",
    options: ["A) Zwei", "B) Drei", "C) Vier", "D) Fünf"],
  },
  {
    stem: "Welches Konto ist kostenlos?",
    options: [
      "A) Basiskonto",
      "B) Konto mit zusätzlichen Dienstleistungen",
      "C) Premium-Konto",
      "D) Geschäftskonto",
    ],
  },
  {
    stem: "Was können Sie tun, um Zeit zu sparen?",
    options: [
      "A) Die Formulare in der Bankfiliale ausfüllen",
      "B) Ohne Unterlagen kommen",
      "C) Einen Termin absagen",
      "D) Die Formulare vor dem Termin online ausfüllen",
    ],
  },
];

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Schreibaufgabe" title="Scenario 2: Resolving Account Issues">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an Ihre Bank in Ghana.
    </p>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt. Schreiben Sie einen Brief an Ihre Bank in Ghana, in dem Sie:
    </p>
    <ol style={writingListStyle}>
      <li>fragen, ob Ihre Karte entsperrt werden kann.</li>
      <li>fragen, welche Dokumente oder Informationen dafür benötigt werden.</li>
      <li>fragen, wie lange der Vorgang dauern wird.</li>
    </ol>
  </WorkbookTaskCard>
);

export default function A2Day18DieBankAnrufenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={18}
      title="Die Bank anrufen"
      chapter="7.18"
      workbookId="A2Day18DieBankAnrufen"
      topicPrompt="Sie rufen bei einer Bank an. Warum rufen Sie an? Welche Informationen brauchen Sie? Welche höflichen Fragen stellen Sie?"
      showSpeakingTaskCard={false}
      schreibenTask="Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt. Schreiben Sie einen Brief an Ihre Bank in Ghana."
      schreibenContent={schreibenContent}
      hoerenTask="Hören Sie das Gespräch über einen Anruf bei der Bank. Achten Sie auf Dokumente, Termin, Dauer des Gesprächs, Kontomodelle und Online-Formulare."
      hoerenAudioUrl="https://youtu.be/cHKVQOLWv7c"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
