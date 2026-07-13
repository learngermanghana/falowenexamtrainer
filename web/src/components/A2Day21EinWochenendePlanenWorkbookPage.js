import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day21EinWochenendePlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={21}
      title="Ein Wochenende planen"
      chapter="8.21"
      workbookId="A2Day21EinWochenendePlanen"
      topicPrompt="Was möchten Sie am Wochenende machen? Planen Sie Aktivitäten, Zeit, Ort und Kosten."
      schreibenTask="Schreiben Sie eine kurze Nachricht an einen Freund oder eine Freundin. Schlagen Sie einen Plan für das Wochenende vor, nennen Sie Zeit und Ort und fragen Sie, ob die Person mitkommen möchte."
      lesenText="Mira möchte am Wochenende etwas mit ihren Freunden machen. Am Samstag wollen sie zuerst frühstücken, dann ins Museum gehen und am Abend einen Film sehen. Wenn das Wetter gut ist, machen sie am Sonntag einen Spaziergang im Park."
      lesenQuestions={[
        { stem: "Was möchte Mira am Wochenende machen?", options: ["A) Freunde treffen", "B) Eine Wohnung mieten", "C) Medikamente kaufen", "D) Nur arbeiten"] },
        { stem: "Was machen sie am Samstag?", options: ["A) Frühstücken, Museum, Film", "B) Nur schlafen", "C) Einen Arzttermin", "D) Eine Reklamation"] },
        { stem: "Was machen sie bei gutem Wetter am Sonntag?", options: ["A) Einen Spaziergang im Park", "B) Einen Brief an den Vermieter", "C) Online einkaufen", "D) Eine Prüfung schreiben"] },
      ]}
      hoerenTask="Höre ein Gespräch über Wochenendpläne. Achte auf Vorschläge, Uhrzeiten, Treffpunkt, Wetter und Zustimmung oder Ablehnung."
      hoerenQuestions={[
        { stem: "Worum geht es im Hörtext?", options: ["A) Wochenendplanung", "B) Wohnungssuche", "C) Reklamation", "D) Apotheke"] },
        { stem: "Welche Frage passt zum Planen?", options: ["A) Wann treffen wir uns?", "B) Was kostet die Miete?", "C) Haben Sie Kopfschmerzen?", "D) Ist das Produkt kaputt?"] },
        { stem: "Was kann man bei schlechtem Wetter machen?", options: ["A) Einen Film sehen", "B) Im Regen schlafen", "C) Keine Freunde treffen", "D) Alles absagen ohne Erklärung"] },
      ]}
    />
  );
}
