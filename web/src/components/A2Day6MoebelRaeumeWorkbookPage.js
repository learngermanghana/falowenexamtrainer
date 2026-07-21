import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const newInTownReadingText = `Neu in der Stadt

Ich bin vor einem Monat in diese Stadt gezogen, um zu studieren.
Ich wohne zusammen mit drei anderen Mädchen in einer Wohngemeinschaft. Unsere Wohnung ist nicht weit von der Universität entfernt, ich muss nur drei Stationen mit der U-Bahn fahren.
Wenn das Wetter schön ist, gehe ich manchmal zu Fuß. Die Professoren an der Universität sind sehr nett, manche sind aber auch streng. Die Vorlesungen, die schon früh beginnen, mag ich nicht so gerne. Ich schlafe lieber lange.
Mittags esse ich mit meinen Freundinnen in der Mensa. Das Essen ist nicht sehr gut, aber es kostet nicht viel.
In meiner Freizeit lese ich gerne, in meinem Zimmer stehen viele Bücher. Manchmal gehe ich in den Zoo und beobachte die Tiere. Früher hatte ich zwei Katzen, aber in der WG sind keine Haustiere erlaubt.
Wenn ich das Studium abgeschlossen habe, möchte ich als Tierärztin im Zoo arbeiten.`;

export default function A2Day6MoebelRaeumeWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={6}
      title="Möbel und Räume kennenlernen"
      chapter="3.6"
      workbookId="A2Day6MoebelRaeume"
      topicPrompt="Beschreibe deine Wohnung, die Zimmer und wichtige Möbel."
      schreibenTask="Schreiben Sie eine kurze Wohnungsbeschreibung. Beschreiben Sie mindestens zwei Zimmer, nennen Sie Möbel und sagen Sie, wo die Möbel stehen."
      lesenText={newInTownReadingText}
      lesenQuestions={[
        {
          stem: "Warum bin ich in die Stadt gezogen?",
          options: [
            "a) Weil ich in einer Wohngemeinschaft wohne",
            "b) Weil ich studiere",
            "c) Weil ich gerne lese",
            "d) Weil ich manchmal in den Zoo gehe",
          ],
        },
        {
          stem: "Wann gehe ich zu Fuß zur Universität?",
          options: [
            "a) Wenn ich Hunger habe",
            "b) Wenn es nicht regnet, stürmt oder schneit",
            "c) Wenn die Vorlesungen früh beginnen",
            "d) Wenn die Professoren streng sind",
          ],
        },
        {
          stem: "Wie ist das Essen in der Mensa?",
          options: [
            "a) Es ist gesund",
            "b) Es ist sehr gut",
            "c) Es ist vegetarisch",
            "d) Es ist billig",
          ],
        },
        {
          stem: "Was ist in der WG verboten?",
          options: [
            "a) Schuhe",
            "b) Fahrräder",
            "c) Bücher",
            "d) Haustiere",
          ],
        },
        {
          stem: "Wo möchte ich später arbeiten?",
          options: [
            "a) In der U-Bahn",
            "b) An der Universität",
            "c) Im Zoo",
            "d) In der Mensa",
          ],
        },
      ]}
      hoerenTask="Sieh dir das eingebettete Video über die Wohnungsanzeigen an. Vergleiche die 2-Zimmer-Wohnung und die 3-Zimmer-Wohnung und submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/WuA8Xabn-Uw"
      hoerenQuestions={[
        {
          stem: "Welche Wohnung ist 70 Quadratmeter groß?",
          options: [
            "a) Die 2-Zimmer-Wohnung",
            "b) Die 3-Zimmer-Wohnung",
          ],
        },
        {
          stem: "Welche Wohnung hat einen Balkon?",
          options: [
            "a) Die 2-Zimmer-Wohnung",
            "b) Die 3-Zimmer-Wohnung",
          ],
        },
        {
          stem: "Wie hoch sind die Nebenkosten für die 3-Zimmer-Wohnung?",
          options: [
            "a) 150 Euro pro Monat",
            "b) 200 Euro pro Monat",
          ],
        },
        {
          stem: "Welche Wohnung erlaubt Haustiere?",
          options: [
            "a) Die 2-Zimmer-Wohnung",
            "b) Die 3-Zimmer-Wohnung",
          ],
        },
        {
          stem: "Welche Wohnung ist ab dem 1. August verfügbar?",
          options: [
            "a) Die 2-Zimmer-Wohnung",
            "b) Die 3-Zimmer-Wohnung",
          ],
        },
      ]}
    />
  );
}
