import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

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
      schreibenTask="Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt. Schreiben Sie einen Brief an Ihre Bank in Ghana."
      schreibenContent={schreibenContent}
      lesenText="Sie vergleichen verschiedene Banken. Die Deutsche Bank bietet Kontoeröffnung, Beratung und Online-Banking an und ist Montag bis Freitag von 9 bis 17 Uhr geöffnet. Die Sparkasse ist zentral gelegen, berät neue Kunden und öffnet Montag bis Freitag von 8 bis 18 Uhr. Die Volksbank hat Filialen in den Vororten. Die ING-DiBa bietet Online-Kontoeröffnung und telefonische Beratung, aber keine persönlichen Filialen."
      lesenQuestions={[
        { stem: "Welche Bank hat die längsten Öffnungszeiten?", options: ["A) Deutsche Bank", "B) Sparkasse", "C) Volksbank", "D) ING-DiBa"] },
        { stem: "Welche Bank bietet keine persönlichen Filialen an?", options: ["A) Postbank", "B) ING-DiBa", "C) Commerzbank", "D) Sparkasse"] },
        { stem: "Welche Bank ist zentral gelegen und bietet Beratung für neue Kunden?", options: ["A) Sparkasse", "B) Deutsche Bank", "C) Volksbank", "D) Postbank"] },
        { stem: "Welche Bank hat Filialen in den Vororten?", options: ["A) Commerzbank", "B) Deutsche Bank", "C) Volksbank", "D) Sparkasse"] },
        { stem: "Welche Bank hat die kürzesten Öffnungszeiten?", options: ["A) Commerzbank", "B) Postbank", "C) Deutsche Bank", "D) Sparkasse"] },
      ]}
      hoerenTask="Hören Sie das Gespräch über einen Anruf bei der Bank. Achten Sie auf Dokumente, Termin, Dauer des Gesprächs, Kontomodelle und Online-Formulare."
      hoerenAudioUrl="https://youtu.be/cHKVQOLWv7c"
      hoerenQuestions={[
        { stem: "Welche Dokumente benötigen Sie, um ein Konto zu eröffnen?", options: ["A) Nur einen Reisepass", "B) Reisepass, Meldebescheinigung, Einkommensnachweis", "C) Nur einen Einkommensnachweis", "D) Keine Dokumente"] },
        { stem: "Wie lange dauert das Beratungsgespräch?", options: ["A) 30 Minuten", "B) Eine Stunde", "C) Zwei Stunden", "D) 15 Minuten"] },
        { stem: "Wie viele Kontomodelle bietet die Bank an?", options: ["A) Zwei", "B) Drei", "C) Vier", "D) Fünf"] },
        { stem: "Welches Konto ist kostenlos?", options: ["A) Basiskonto", "B) Konto mit zusätzlichen Dienstleistungen", "C) Premium-Konto", "D) Geschäftskonto"] },
        { stem: "Was können Sie tun, um Zeit zu sparen?", options: ["A) Die Formulare in der Bankfiliale ausfüllen", "B) Die Formulare vor dem Termin online ausfüllen", "C) Einen Termin absagen"] },
      ]}
    />
  );
}
