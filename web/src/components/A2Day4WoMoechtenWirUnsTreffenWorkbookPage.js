import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day4WoMoechtenWirUnsTreffenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={4}
      title="Wo möchten wir uns treffen?"
      chapter="2.4"
      workbookId="A2Day4WoMoechtenWirUnsTreffen"
      topicPrompt="Wo und wie verbringst du am liebsten Zeit mit deinen Freunden?"
      schreibenTask="Schreiben Sie einen Brief an Herrn Felix Asadu. Laden Sie ihn zu einem gemeinsamen Wochenende ein, fragen Sie nach Zeit und Treffpunkt und fragen Sie, ob er etwas mitbringen möchte."
      lesenText="Für das Wochenende und die Ferien mache ich gern Pläne. Ich treffe Freunde im Park, im Café oder zu Hause. Wir sprechen über den Treffpunkt, die Zeit, das Wetter und die Aktivitäten."
      lesenQuestions={[
        { stem: "Wo kann man Freunde treffen?", options: ["a) Im Park", "b) Nur im Krankenhaus", "c) Nur im Büro", "d) Nie draußen"] },
        { stem: "Was soll man vor dem Treffen klären?", options: ["a) Zeit und Ort", "b) Nur die Farbe", "c) Nur den Preis", "d) Gar nichts"] },
        { stem: "Warum ist ein Treffpunkt wichtig?", options: ["a) Alle wissen, wohin sie gehen", "b) Man bleibt allein", "c) Man lernt nicht", "d) Es ist verboten"] },
      ]}
      hoerenTask="Höre das Gespräch über ein Treffen mit Freunden. Notiere Ort, Zeit, Aktivität und was die Personen mitbringen."
      hoerenQuestions={[
        { stem: "Wann treffen sich die Personen?", options: ["a) Am Samstag", "b) Am Montag", "c) Um Mitternacht", "d) Nie"] },
        { stem: "Was planen sie?", options: ["a) Einen Ausflug", "b) Eine Prüfung", "c) Einen Arzttermin", "d) Einen Umzug"] },
        { stem: "Was bringt eine Person mit?", options: ["a) Snacks und Getränke", "b) Einen Schrank", "c) Medikamente", "d) Einen Vertrag"] },
      ]}
    />
  );
}
