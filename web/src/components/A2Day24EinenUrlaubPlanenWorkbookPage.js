import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Urlaub in Salzburg

Sandra und Miriam möchten im August vier Tage nach Salzburg reisen. Sie haben ein Budget von ungefähr 700 Euro pro Person. Weil die Zugverbindung gut ist, möchten sie nicht mit dem Auto fahren. Ihr Hotel liegt in der Nähe des Hauptbahnhofs und das Frühstück ist im Preis enthalten.

Für den ersten Tag planen sie einen Spaziergang durch die Altstadt. Am zweiten Tag möchten sie die Festung Hohensalzburg besuchen. Wenn das Wetter am dritten Tag gut ist, machen sie einen Ausflug an einen See. Bei Regen wollen sie stattdessen ein Museum besuchen. Vor der Reise prüfen beide ihre Ausweise, Tickets und die Wettervorhersage. Miriam nimmt außerdem eine kleine Reiseapotheke mit.`;

const lesenQuestions = [
  {
    stem: "Wie lange möchten Sandra und Miriam in Salzburg bleiben?",
    options: ["A) Zwei Tage", "B) Vier Tage", "C) Eine Woche", "D) Zwei Wochen"],
  },
  {
    stem: "Wie möchten sie nach Salzburg reisen?",
    options: ["A) Mit dem Zug", "B) Mit dem Auto", "C) Mit dem Flugzeug", "D) Mit dem Schiff"],
  },
  {
    stem: "Was ist im Hotelpreis enthalten?",
    options: ["A) Abendessen", "B) Frühstück", "C) Museumstickets", "D) Zugtickets"],
  },
  {
    stem: "Was planen sie bei Regen am dritten Tag?",
    options: ["A) Einen Ausflug an den See", "B) Einen Museumsbesuch", "C) Eine Rückreise", "D) Eine Fahrradtour"],
  },
  {
    stem: "Was prüfen sie vor der Reise?",
    options: ["A) Nur das Hotel", "B) Ausweise, Tickets und Wettervorhersage", "C) Nur die Restaurants", "D) Ihre Arbeitszeiten"],
  },
];

export default function A2Day24EinenUrlaubPlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={24}
      title="Einen Urlaub planen"
      chapter="9.24"
      workbookId="A2Day24EinenUrlaubPlanen"
      topicPrompt="Plane einen Urlaub. Nenne Reiseziel, Zeitraum, Budget, Transport, Unterkunft, Aktivitäten und wichtige Vorbereitungen."
      schreibenTask="Sie möchten zusammen mit Sandra einen Urlaub planen. Schreiben Sie ihr eine E-Mail. Laden Sie sie zur gemeinsamen Planung ein, schlagen Sie einen Termin und Treffpunkt vor und fragen Sie nach ihrer Meinung zu Reiseziel, Transport oder Unterkunft."
      schreibenPlaceholder="Liebe Sandra,\n\nich möchte gern unseren Urlaub planen. Hast du ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie das Urlaubsplanungs-Video und achten Sie auf Reiseziel, Transport, Unterkunft, Budget und Aktivitäten."
      hoerenAudioUrl="https://youtu.be/iPScKV6JWaA"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
