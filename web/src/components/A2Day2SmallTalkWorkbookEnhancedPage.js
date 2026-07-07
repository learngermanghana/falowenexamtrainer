import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day2SmallTalkWorkbookEnhancedPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={1}
      title="Small Talk"
      chapter="1.1"
      workbookId="A2Day1SmallTalk"
      topicPrompt="Führe ein kurzes Small-Talk-Gespräch mit Begrüßung, Frage und Antwort."
      schreibenTask="Schreiben Sie einen kurzen Dialog oder eine kurze Nachricht mit Begrüßung, Frage nach dem Befinden, einer Antwort und einem höflichen Abschluss."
      lesenText="Anna trifft Ben im Deutschkurs. Sie sagt: Guten Morgen, Ben. Wie geht es dir? Ben antwortet: Mir geht es gut, danke. Und dir? Anna sagt: Auch gut. Heute lernen wir Small Talk."
      lesenQuestions={[
        { stem: "Wo trifft Anna Ben?", options: ["a) Im Deutschkurs", "b) Im Krankenhaus", "c) Am Flughafen", "d) In der Küche"] },
        { stem: "Was fragt Anna?", options: ["a) Wie geht es dir?", "b) Was kostet das?", "c) Wo ist der Zug?", "d) Hast du Möbel?"] },
        { stem: "Wie antwortet Ben?", options: ["a) Mir geht es gut", "b) Ich bin im Urlaub", "c) Ich kaufe Brot", "d) Ich habe Fieber"] },
      ]}
      hoerenTask="Höre ein kurzes Small-Talk-Gespräch. Achte auf Begrüßung, Befinden, Rückfrage und Abschluss."
      hoerenQuestions={[
        { stem: "Welche Begrüßung hörst du?", options: ["a) Guten Morgen", "b) Gute Nacht allein", "c) Tschüss zuerst", "d) Rechnung bitte"] },
        { stem: "Was ist das Thema?", options: ["a) Small Talk", "b) Wohnungssuche", "c) Urlaub", "d) Rezept"] },
        { stem: "Was macht man im Small Talk?", options: ["a) Kurz und höflich sprechen", "b) Nur schreiben", "c) Nie antworten", "d) Nur lesen"] },
      ]}
    />
  );
}
