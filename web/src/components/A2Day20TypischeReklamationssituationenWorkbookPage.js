import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

const lesenText = `Reklamation im Elektrogeschäft

Laura hat vor einer Woche einen Wasserkocher gekauft. Schon nach zwei Tagen funktionierte das Gerät nicht mehr. Sie ging deshalb mit dem Wasserkocher und dem Kassenbon zurück ins Geschäft. Dort erklärte sie ruhig das Problem. Der Mitarbeiter entschuldigte sich und prüfte das Gerät. Er bot Laura entweder einen Umtausch oder eine Rückerstattung an. Laura entschied sich für einen neuen Wasserkocher. Vor dem Verlassen des Geschäfts testete der Mitarbeiter das neue Gerät noch einmal. Laura war mit der schnellen Lösung zufrieden.`;

const lesenQuestions = [
  {
    stem: "Warum ging Laura zurück ins Geschäft?",
    options: ["A) Der Wasserkocher war zu teuer.", "B) Der Wasserkocher funktionierte nicht mehr.", "C) Sie wollte ein anderes Geschäft besuchen.", "D) Sie hatte den Kassenbon verloren."],
  },
  {
    stem: "Was brachte Laura als Kaufnachweis mit?",
    options: ["A) Den Kassenbon", "B) Eine Kundenkarte", "C) Eine E-Mail", "D) Einen Garantiekatalog"],
  },
  {
    stem: "Wie erklärte Laura das Problem?",
    options: ["A) Ruhig", "B) Gar nicht", "C) Nur schriftlich", "D) Sehr unhöflich"],
  },
  {
    stem: "Welche Lösungen bot der Mitarbeiter an?",
    options: ["A) Nur eine Reparatur", "B) Umtausch oder Rückerstattung", "C) Einen Rabatt für später", "D) Keine Lösung"],
  },
  {
    stem: "Warum war Laura am Ende zufrieden?",
    options: ["A) Die Lösung war schnell.", "B) Sie bekam zwei Geräte.", "C) Sie musste nichts erklären.", "D) Das Geschäft schloss früher."],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum bringt Laura den Wasserkocher zurück?",
    options: ["A) Er ist zu teuer", "B) Er funktioniert nicht", "C) Er ist zu groß", "D) Er gefällt ihr nicht"],
  },
  {
    stem: "Was bringt Laura als Kaufnachweis mit?",
    options: ["A) Eine Rechnung vom Arzt", "B) Eine Kundenkarte", "C) Den Kassenbon", "D) Einen Brief"],
  },
  {
    stem: "Was bietet der Verkäufer Laura an?",
    options: ["A) Einen Rabatt", "B) Eine Reparatur in einem Jahr", "C) Einen Umtausch oder eine Rückerstattung", "D) Einen Gutschein für Essen"],
  },
  {
    stem: "Welches Problem gibt es mit der Jacke?",
    options: ["A) Sie hat die falsche Farbe", "B) Sie ist beschädigt", "C) Sie hat die falsche Größe", "D) Sie kommt zu spät"],
  },
  {
    stem: "Was bittet Laura den Kundenservice zu schicken?",
    options: ["A) Einen Retourenschein", "B) Eine neue Rechnung", "C) Einen Katalog", "D) Einen Rabattcode"],
  },
];

export default function A2Day20TypischeReklamationssituationenWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="A2" day={20}>
      <A2StandardTabbedWorkbookPage
        day={20}
        title="Typische Reklamationssituationen üben"
        chapter="7.20"
        workbookId="A2Day20TypischeReklamationssituationen"
        topicPrompt="Du möchtest ein defektes oder falsches Produkt reklamieren. Erkläre das Problem höflich und sage, welche Lösung du möchtest."
        schreibenTask="Sie haben ein Produkt gekauft, aber es ist defekt oder nicht wie bestellt. Schreiben Sie eine formelle Reklamation. Erklären Sie, was Sie gekauft haben, beschreiben Sie das Problem und bitten Sie höflich um Umtausch, Reparatur oder Rückerstattung."
        schreibenPlaceholder="Sehr geehrte Damen und Herren,\n\nich wende mich an Sie, weil ..."
        lesenText={lesenText}
        lesenQuestions={lesenQuestions}
        hoerenTask="Hören Sie die Reklamationsdialoge. Achten Sie auf das Problem, den Kaufnachweis und die angebotene Lösung."
        hoerenAudioUrl="https://youtu.be/pH1X3E7vOao"
        hoerenQuestions={hoerenQuestions}
        showWorkbookGuidance={false}
      />
    </RadioFirstWorkbookGate>
  );
}
