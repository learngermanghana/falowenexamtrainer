import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Formelle Schreibaufgabe" title="Eine Wohnung suchen">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter:
    </p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einer verfügbaren Wohnung.</li>
      <li>Geben Sie an, welche Kriterien für Sie wichtig sind (z. B. Größe, Lage, Preis).</li>
      <li>Fragen Sie nach den Mietbedingungen und der Möglichkeit, die Wohnung zu besichtigen.</li>
    </ol>
  </WorkbookTaskCard>
);

const apartmentSearchReadingText = `Wohnungssuche

Sie suchen eine Wohnung? In vielen Zeitungen sind Wohnungsanzeigen, meistens am Freitag oder Samstag. Wohnungsanzeigen findet man auch auf den Internetseiten der Zeitung. Es gibt auch eigene Immobilienseiten im Internet. Auch das Wohnungsamt Ihrer Stadt oder Gemeinde hilft oft bei der Suche. In manchen Regionen findet man leicht eine Wohnung. In anderen Regionen ist es sehr schwer, eine Wohnung zu bekommen. Dann kann ein Immobilienmakler bei der Suche helfen: Wenn er eine Wohnung für Sie findet, müssen Sie ihn bezahlen. Normalerweise bekommt ein Makler die Summe von 2 - 3 Monatsmieten als Provision.

Miete und Kaution

In den Anzeigen steht meist, wie viel Miete Sie für die Wohnung bezahlen müssen. Das ist aber oft nur die Kaltmiete. Sie müssen dazu noch die Nebenkosten zahlen. Sie zahlen zum Beispiel für das Wasser, die Reinigung der Treppe und den Müll. Heizung und Strom können auch ein Teil von den Nebenkosten sein, aber das ist unterschiedlich. Fragen Sie den Vermieter, was zu den Nebenkosten gehört und was Sie noch extra bezahlen müssen.

Die Kaltmiete und die Nebenkosten zusammen heißen Warmmiete. Die komplette Warmmiete überweisen Sie jeden Monat an Ihren Vermieter.
Normalerweise sind Wohnungen nicht möbliert. Nur in der Küche gibt es oft einen Herd. Sachen, die vom Vormieter sind und in der Wohnung bleiben, zum Beispiel ein Kühlschrank, müssen Sie ihm zahlen. Das nennt man Ablöse.

Oft wollen die Vermieter von ihren Mietern eine Kaution. Sie darf maximal 3 Kaltmieten betragen. Beim Auszug bekommt der Mieter die Kaution zurück. Wenn man sehen will, ob die Miete für eine Wohnung zu hoch ist, kann man in den Mietspiegel schauen. Dort findet man die durchschnittlichen Mietpreise für jede Stadt. Geben Sie im Internet „Mietspiegel“ und den Namen Ihrer Stadt ein.

Am Anfang des Jahres weiß man noch nicht, wie viel Wasser, Strom oder Gas man brauchen wird. Deshalb zahlt man jeden Monat einen Vorschuss. Am Ende des Jahres bekommt man dann Geld zurück oder man muss noch etwas mehr bezahlen.

Mietvertrag

Alle Informationen zu Miete und Kaution stehen im Mietvertrag. Dort steht auch, ob Sie die Wohnung beim Auszug renovieren müssen. Außerdem gibt es hier Informationen zu Ihrer Kündigungsfrist. Oft müssen Sie ein Übergabeprotokoll unterschreiben, wenn Sie in eine Wohnung einziehen. Im Übergabeprotokoll steht zum Beispiel, ob etwas in der Wohnung kaputt ist. Dann wissen Sie und der Vermieter sicher, dass Sie das nicht kaputt gemacht haben. Lesen Sie vor dem Unterschreiben den Mietvertrag und das Übergabeprotokoll genau.

Hausordnung

Sie möchten keine Konflikte mit ihren Nachbarn? Beachten Sie einige Regeln: Normalerweise ist von 22–7 Uhr Ruhezeit sowie von 13–15 Uhr Mittagsruhe. Sie dürfen dann also nicht sehr laut sein. An Sonntagen und Feiertagen ist den ganzen Tag Ruhezeit.

Es gibt in Deutschland unterschiedliche Mülltonnen für Papier und Pappe, für Obst- und Gemüsereste und für anderen Müll. Glas, Dosen oder elektrische Geräte muss man zu speziellen Sammelstellen oder Containern bringen. Alle anderen Regeln finden Sie in Ihrer Hausordnung. Zum Beispiel: Dürfen Sie einen Hund oder eine Katze in der Wohnung haben? Oder: Müssen Sie den Flur oder den Gehweg vor dem Haus reinigen?`;

export default function A2Day7WohnungSuchenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={7}
      title="Eine Wohnung suchen"
      chapter="3.7"
      workbookId="A2Day7WohnungSuchen"
      topicPrompt="Beschreibe, welche Wohnung du suchst und warum sie zu dir passt."
      schreibenTask="Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter."
      schreibenContent={schreibenContent}
      lesenText={apartmentSearchReadingText}
      lesenQuestions={[
        {
          stem: "Wo findet man Wohnungsanzeigen?",
          options: [
            "a) Nur in Supermärkten",
            "b) In Zeitungen und im Internet",
            "c) Nur beim Arbeitsamt",
            "d) Nur in Broschüren",
          ],
        },
        {
          stem: "Was ist ein Immobilienmakler?",
          options: [
            "a) Eine Person, die Möbel verkauft",
            "b) Eine Person, die Stromanbieter vergleicht",
            "c) Eine Person, die bei der Wohnungssuche hilft",
            "d) Ein Handwerker für Wohnungen",
          ],
        },
        {
          stem: "Was gehört zur Warmmiete?",
          options: [
            "a) Nur die Kaltmiete",
            "b) Nur die Stromkosten",
            "c) Kaltmiete und Nebenkosten",
            "d) Nur das Internet",
          ],
        },
        {
          stem: "Was ist eine Kaution?",
          options: [
            "a) Eine monatliche Rechnung",
            "b) Ein Betrag, den man beim Auszug zurückbekommt",
            "c) Eine Versicherung",
            "d) Ein Möbelstück vom Vormieter",
          ],
        },
        {
          stem: "Was ist ein Übergabeprotokoll?",
          options: [
            "a) Ein Vertrag für den Stromanbieter",
            "b) Eine Liste von Nachbarn",
            "c) Ein Formular, das Schäden in der Wohnung zeigt",
            "d) Eine Quittung für die Kaution",
          ],
        },
        {
          stem: "Wann ist in Deutschland Ruhezeit?",
          options: [
            "a) Nur zwischen 8–10 Uhr",
            "b) Von 12 bis 14 Uhr",
            "c) Von 22–7 Uhr und 13–15 Uhr",
            "d) Es gibt keine Ruhezeit",
          ],
        },
        {
          stem: "Was macht man mit Glas und Dosen?",
          options: [
            "a) In die schwarze Mülltonne werfen",
            "b) Im Garten vergraben",
            "c) Zum Wertstoffcontainer bringen",
            "d) Im Hausflur lagern",
          ],
        },
      ]}
      hoerenTask="Sieh dir das eingebettete Video zur Wohnungsbeschreibung an. Achte auf Stockwerk, Größe, Zimmer, Ausstattung und Nebenkosten. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/hM1iPUq1Spg"
      hoerenQuestions={[
        {
          stem: "In welchem Stockwerk befindet sich die Wohnung?",
          options: [
            "a) Im ersten Stock",
            "b) Im zweiten Stock",
            "c) Im dritten Stock",
          ],
        },
        {
          stem: "Wie groß ist die Wohnung?",
          options: [
            "a) 70 Quadratmeter",
            "b) 75 Quadratmeter",
            "c) 80 Quadratmeter",
          ],
        },
        {
          stem: "Wie viele Zimmer hat die Wohnung?",
          options: [
            "a) Zwei",
            "b) Drei",
            "c) Vier",
          ],
        },
        {
          stem: "Was gehört zur Wohnung?",
          options: [
            "a) Ein Balkon",
            "b) Ein Garten",
            "c) Eine Garage",
          ],
        },
        {
          stem: "Wie hoch sind die Nebenkosten?",
          options: [
            "a) 100 Euro",
            "b) 150 Euro",
            "c) 200 Euro",
          ],
        },
      ]}
    />
  );
}
