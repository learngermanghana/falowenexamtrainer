import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const bankChoices = [
  "A) Deutsche Bank",
  "B) Sparkasse",
  "C) Commerzbank",
  "D) Volksbank",
  "E) Postbank",
  "F) ING-DiBa",
];

const bankAdvertText = [
  "A · Deutsche Bank — Konto eröffnen, Beratung, Online-Banking · Mo–Fr 9:00–17:00, Sa 10:00–14:00 · mehrere Standorte in der Stadt",
  "B · Sparkasse — Konto eröffnen, Kreditkarten, Beratung für neue Kunden · Mo–Fr 8:00–18:00, Sa 9:00–13:00 · zentral gelegen",
  "C · Commerzbank — Konto eröffnen, Kreditkarten, Versicherungen · Mo–Fr 9:00–16:00 · wenige Standorte",
  "D · Volksbank — Konto eröffnen, Beratung, Online-Banking, Kreditkarten · Mo–Fr 9:00–18:00, Sa geschlossen · Filialen in den Vororten",
  "E · Postbank — Konto eröffnen, Kreditkarten, Sparen · Mo–Fr 8:00–16:00, Sa 10:00–12:00 · Filialen in der Innenstadt",
  "F · ING-DiBa — Online-Konto eröffnen, Kreditkarten, telefonische Beratung · 24/7 Online-Service · keine persönlichen Filialen",
  "",
  "Antwortregel: Verwenden Sie für jede Frage den festen Bankcode A–F aus der Anzeige. Die Buchstaben ändern sich nicht von Frage zu Frage.",
].join("\n");

const lesenQuestions = [
  { stem: "Welche Bank hat die längsten Öffnungszeiten?", options: bankChoices },
  { stem: "Welche Bank bietet keine persönlichen Filialen an?", options: bankChoices },
  { stem: "Welche Bank ist zentral gelegen und bietet Beratung für neue Kunden?", options: bankChoices },
  { stem: "Welche Bank hat Filialen in den Vororten?", options: bankChoices },
  { stem: "Welche Bank hat die kürzesten Öffnungszeiten?", options: bankChoices },
];

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
      lesenText={bankAdvertText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie das Gespräch über einen Anruf bei der Bank. Achten Sie auf Dokumente, Termin, Dauer des Gesprächs, Kontomodelle und Online-Formulare."
      hoerenAudioUrl="https://youtu.be/cHKVQOLWv7c"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
