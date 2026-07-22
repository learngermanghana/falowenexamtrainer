import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Schreibaufgabe" title="E-Mail an ein Restaurant">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Situation: Sie möchten einen Tisch in einem Restaurant reservieren.
    </p>
    <p style={{ margin: 0, lineHeight: 1.7 }}>Schreiben Sie eine E-Mail an das Restaurant:</p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einem freien Tisch.</li>
      <li>Geben Sie an, was für Sie wichtig ist (z. B. Datum, Uhrzeit, Anzahl der Personen).</li>
      <li>Fragen Sie nach dem Menü und den Preisen.</li>
    </ol>
  </WorkbookTaskCard>
);

const germanKitchenReadingText = `Die Vielfalt der Deutschen Küche

Die deutsche Küche ist vielfältig und regional unterschiedlich. In Norddeutschland sind Fischgerichte sehr beliebt, während im Süden Deutschlands eher deftige Speisen wie Schweinshaxe und Knödel auf den Tisch kommen. Ein typisches deutsches Frühstück besteht aus Brot, Brötchen, Aufschnitt, Käse und Marmelade. Zum Mittagessen gibt es oft eine warme Mahlzeit, und am Abend wird häufig kalt gegessen – Brotzeit nennt man das.

Zu den bekanntesten deutschen Gerichten zählen Sauerkraut, Bratwurst und Spätzle. Auch regionale Spezialitäten wie der Schwarzwälder Schinken oder der Bayerische Leberkäse sind sehr beliebt. In den letzten Jahren hat die internationale Küche auch in Deutschland an Bedeutung gewonnen, und man findet Restaurants aus aller Welt.

Ein weiterer wichtiger Bestandteil der deutschen Esskultur sind die vielen Feste und Märkte, bei denen Essen und Trinken eine zentrale Rolle spielen. Das Oktoberfest in München ist weltweit bekannt und zieht jedes Jahr Millionen von Besuchern an. Auch Weihnachtsmärkte mit ihren zahlreichen kulinarischen Angeboten sind sehr beliebt.`;

export default function A2Day8RezepteUndEssenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={8}
      title="Rezepte und Essen"
      chapter="3.8"
      workbookId="A2Day8RezepteUndEssen"
      topicPrompt="Erkläre ein einfaches Rezept und sprich über Essen und Zutaten."
      schreibenTask="Sie möchten einen Tisch in einem Restaurant reservieren. Schreiben Sie eine E-Mail an das Restaurant."
      schreibenContent={schreibenContent}
      lesenText={germanKitchenReadingText}
      lesenQuestions={[
        {
          stem: "Was ist ein typisches deutsches Frühstück?",
          options: [
            "a) Eier und Speck",
            "b) Brot, Brötchen, Aufschnitt, Käse und Marmelade",
            "c) Müsli und Joghurt",
          ],
        },
        {
          stem: "Was versteht man unter \"Brotzeit\"?",
          options: [
            "a) Ein warmes Mittagessen",
            "b) Ein kaltes Abendessen",
            "c) Ein Snack zwischendurch",
          ],
        },
        {
          stem: "Welche Gerichte sind typisch für Norddeutschland?",
          options: [
            "a) Fischgerichte",
            "b) Schweinshaxe und Knödel",
            "c) Spätzle",
          ],
        },
        {
          stem: "Welches Fest ist weltweit bekannt und zieht jedes Jahr Millionen von Besuchern an?",
          options: [
            "a) Weihnachtsmarkt",
            "b) Oktoberfest",
            "c) Karneval",
          ],
        },
        {
          stem: "Welche internationalen Einflüsse findet man in der deutschen Küche?",
          options: [
            "a) Nur traditionelle deutsche Gerichte",
            "b) Gerichte aus aller Welt",
            "c) Nur europäische Gerichte",
          ],
        },
        {
          stem: "Was sind zwei bekannte deutsche Gerichte?",
          options: [
            "a) Pizza und Pasta",
            "b) Sushi und Ramen",
            "c) Sauerkraut und Bratwurst",
          ],
        },
        {
          stem: "Welche Rolle spielen Feste und Märkte in der deutschen Esskultur?",
          options: [
            "a) Eine zentrale Rolle",
            "b) Keine Rolle",
            "c) Eine kleine Rolle",
          ],
        },
      ]}
      hoerenTask="Sieh dir das eingebettete Video zum Thema Rezepte und Essen an. Achte auf den Tag, die Zutaten, den Ort und das Gericht. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/mYh4DRaaWSY"
      hoerenQuestions={[
        {
          stem: "Wann gehen die Personen einkaufen oder kochen zusammen?",
          options: [
            "a) Montag",
            "b) Samstag",
            "c) Mittwoch",
          ],
        },
        {
          stem: "Was kaufen sie?",
          options: [
            "a) Fleisch und Fisch",
            "b) Obst und Gemüse",
            "c) Brot und Käse",
          ],
        },
        {
          stem: "Welche Zutat wird im Hörtext genannt?",
          options: [
            "a) Reis",
            "b) Mozzarella",
            "c) Kartoffeln",
          ],
        },
        {
          stem: "Was machen sie danach?",
          options: [
            "a) Sie gehen ins Kino",
            "b) Sie gehen in ein Café",
            "c) Sie gehen in die Schule",
          ],
        },
        {
          stem: "Welches Gericht wird genannt?",
          options: [
            "a) Gemüselasagne",
            "b) Bratwurst mit Sauerkraut",
            "c) Fischsuppe",
          ],
        },
      ]}
    />
  );
}
