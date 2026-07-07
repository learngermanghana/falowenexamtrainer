import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day20TypischeReklamationssituationenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={20}
      title="Typische Reklamationssituationen üben"
      chapter="7.20"
      workbookId="A2Day20TypischeReklamationssituationen"
      topicPrompt="Haben Sie schon einmal etwas reklamiert? Was war das Problem und was haben Sie gesagt?"
      schreibenTask="Schreiben Sie eine kurze Reklamation. Nennen Sie das Produkt oder die Dienstleistung, erklären Sie das Problem, bitten Sie höflich um eine Lösung und nennen Sie Ihre Kontaktdaten."
      lesenText="Herr Becker hat online einen Kopfhörer gekauft. Nach zwei Tagen funktioniert der Kopfhörer nicht mehr. Er schreibt dem Kundenservice eine Reklamation. Er beschreibt das Problem, nennt die Bestellnummer und bittet um Ersatz oder Rückerstattung."
      lesenQuestions={[
        { stem: "Was hat Herr Becker gekauft?", options: ["A) Einen Kopfhörer", "B) Eine Wohnung", "C) Eine Fahrkarte", "D) Ein Medikament"] },
        { stem: "Was ist das Problem?", options: ["A) Der Kopfhörer funktioniert nicht", "B) Die Wohnung ist zu klein", "C) Der Zug kommt zu früh", "D) Der Arzt ist krank"] },
        { stem: "Was bittet Herr Becker um?", options: ["A) Ersatz oder Rückerstattung", "B) Einen Urlaub", "C) Einen Sportkurs", "D) Einen Termin beim Zahnarzt"] },
      ]}
      hoerenTask="Höre ein Gespräch über eine Reklamation. Achte auf Produkt, Problem, höfliche Bitte, Lösung und Kontaktdaten."
      hoerenQuestions={[
        { stem: "Worum geht es im Hörtext?", options: ["A) Eine Reklamation", "B) Ein Rezept", "C) Eine Wohnungssuche", "D) Eine Reiseplanung"] },
        { stem: "Welche Bitte passt zu einer Reklamation?", options: ["A) Können Sie mir bitte helfen?", "B) Wo ist der Bahnhof?", "C) Was kostet die Miete?", "D) Wann beginnt der Kurs?"] },
        { stem: "Welche Lösung kann man verlangen?", options: ["A) Rückerstattung", "B) Wetterbericht", "C) Fahrplan", "D) Hausaufgaben"] },
      ]}
    />
  );
}
