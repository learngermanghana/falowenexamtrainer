import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const restaurantReadingText = `Im Restaurant

Kellner: Guten Abend, haben Sie reserviert?
Gast: Ja, einen Tisch für zwei auf den Namen Müller.
Kellner: Bitte folgen Sie mir, ich bringe Sie zu Ihrem Tisch.
Gast: Vielen Dank.
Kellner: Darf ich Ihnen schon Getränke bringen?
Gast: Die Speisekarte bitte zuerst.
Kellner: Sehr gern.
Gast: Wir bestellen eine Flasche Weißwein und einen Liter Wasser bitte.
Kellner: Zum Essen haben Sie schon gewählt?
Gast: Ja, wir bekommen als Vorspeise zwei Mal die Suppe. Ist das Gemüsesuppe?
Kellner: Ja, Gemüsesuppe mit Karotten.
Gast: Sehr gut. Und anschließend als Hauptspeise nehmen wir ein Mal die Nudeln, ein Mal eine Pizza und einen Salat.
Kellner: Sehr gern. Möchten Sie Kartoffelsalat oder grünen Salat?
Gast: Gern grünen Salat.
Kellner: Ist alles in Ordnung?
Gast: Die Suppe ist köstlich, aber leider kalt.
Kellner: Entschuldigen Sie vielmals, ich bringe Ihnen sofort eine neue.
Gast: Ja bitte.

Kellner: Sind Sie zufrieden? Wie sind die Nudeln? Schmeckt die Pizza?
Gast: Ja, wunderbar. Allerdings haben Sie den grünen Salat vergessen.
Kellner: Das tut mir furchtbar leid. Kommt sofort.
Gast: Wir hätten gern Nachtisch. Bringen Sie uns nochmals die Speisekarte bitte?
Kellner: Sehr gern, als Entschuldigung für die kalte Suppe und den vergessenen Salat laden wir Sie dazu gern ein.
Gast: Ja, wunderbar. Wir hätten gern ein Tiramisu und einen Schokoladenkuchen.
Kellner: Sehr gern.
Gast: Wir möchten gern bezahlen.
Kellner: Gern, bar oder mit Karte?
Gast: Bar. Und bitte eine Rechnung.
Kellner: Selbstverständlich. Kommt sofort.`;

export default function A2Day5FreizeitWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={5}
      title="Was machst du in deiner Freizeit?"
      chapter="2.5"
      workbookId="A2Day5Freizeit"
      topicPrompt="Welche Freizeitaktivitäten machst du gern und warum?"
      schreibenTask="Schreiben Sie eine kurze E-Mail über Ihre Freizeit. Nennen Sie zwei Aktivitäten, sagen Sie, wann Sie sie machen, und erklären Sie, warum Sie sie mögen."
      lesenText={restaurantReadingText}
      lesenQuestions={[
        {
          stem: "Welche Speisen bestellen die Gäste?",
          options: [
            "a) Gemüseauflauf mit Salat",
            "b) Rindfleisch mit Leberknödeln",
            "c) Nudeln, Pizza und Salat",
            "d) Schnitzel mit Salat und Kotelett mit Gemüse",
          ],
        },
        {
          stem: "Was hat der Kellner vergessen?",
          options: [
            "a) Den Weißwein",
            "b) Den Nachtisch",
            "c) Den grünen Salat",
            "d) Die Speisekarte",
          ],
        },
        {
          stem: "Welche Nachspeisen bestellen die Gäste?",
          options: [
            "a) Schokoladencreme und Tiramisu",
            "b) Schokoladeneis und Kuchen",
            "c) Schokoladenkuchen und Tiramisu",
            "d) Eis und Schokoladenkuchen",
          ],
        },
        {
          stem: "Was ist nicht in Ordnung bei den Speisen?",
          options: [
            "a) Der bestellte Salat ist der falsche.",
            "b) Die Suppe ist kalt.",
            "c) Das Kotelett ist zäh.",
            "d) Das Schnitzel ist kalt.",
          ],
        },
        {
          stem: "Wie bezahlt der Gast?",
          options: [
            "a) Mit einem Scheck.",
            "b) Gegen Rechnung.",
            "c) In bar.",
            "d) Mit Kreditkarte.",
          ],
        },
      ]}
      hoerenTask="Sieh dir das eingebettete Video über Anna und ihre Freizeit an. Wähle danach die richtige Antwort und submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/V8gcgVcUGQM"
      hoerenQuestions={[
        {
          stem: "Was macht Anna abends gerne, wenn sie zu Hause ist?",
          options: [
            "a) Sie trinkt Tee und liest ein Buch.",
            "b) Sie schaut Fernsehen.",
            "c) Sie telefoniert mit ihren Freunden.",
          ],
        },
        {
          stem: "Welches Brettspiel spielt Anna oft mit ihrer Familie?",
          options: [
            "a) Schach",
            "b) Mensch ärgere dich nicht",
            "c) Uno",
          ],
        },
        {
          stem: "Was macht Anna jeden Morgen, um fit zu bleiben?",
          options: [
            "a) Sie geht joggen.",
            "b) Sie macht Yoga.",
            "c) Sie geht schwimmen.",
          ],
        },
        {
          stem: "Wo hat Anna am letzten Wochenende Zeit mit ihren Freunden verbracht?",
          options: [
            "a) Am Strand",
            "b) In den Bergen",
            "c) Im Park",
          ],
        },
        {
          stem: "Welche Musik hört Anna, wenn sie sich konzentrieren möchte?",
          options: [
            "a) Popmusik",
            "b) Klassische Musik",
            "c) Jazzmusik",
          ],
        },
      ]}
    />
  );
}
