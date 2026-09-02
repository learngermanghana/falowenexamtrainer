import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const writingListStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Formelle Schreibaufgabe" title="E-Mail an ein Hotel">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel:
    </p>
    <ol style={writingListStyle}>
      <li>Fragen Sie nach einem freien Zimmer.</li>
      <li>
        Geben Sie an, was für Sie wichtig ist (z. B. Datum, Anzahl der Personen, Art des Zimmers).
      </li>
      <li>
        Fragen Sie nach den Preisen und den zusätzlichen Leistungen (z. B. Frühstück, Internetzugang).
      </li>
    </ol>
  </WorkbookTaskCard>
);

const cultureFreeTimeReadingText = `Kultur und Freizeit in Deutschland

Kultur

Sie mögen Kultur? In den meisten Städten gibt es Museen, Kinos, Theater und Konzertveranstaltungen. Immer mehr Kinos zeigen internationale Filme in der Originalversion (OV). In den Bibliotheken oder Stadtbüchereien können Sie kostenlos oder für wenig Geld Bücher lesen, Musik hören und Filme sehen. Sie können die Bücher, Filme und CDs auch ausleihen: Sie nehmen sie mit nach Hause und bringen sie später wieder zurück.

Volkshochschulen, Vereine und Clubs

An vielen Orten gibt es Volkshochschulen. Dort finden Sie vor allem Kurse für Erwachsene, zum Beispiel Tanzkurse oder Sprachkurse. Sie machen gern Sport? Auch dazu gibt es Kurse an den Volkshochschulen. Aber Sie können auch in ein Schwimmbad oder in einen Sportverein gehen.

Eine andere Möglichkeit sind Vereine und Clubs. In einem Verein sind Menschen mit den gleichen Interessen und Zielen zusammen. Es gibt zum Beispiel Musikvereine, Sportvereine, Kochclubs oder Computerclubs. Es gibt Vereine für Erwachsene und für Jugendliche.
Für Eltern und Kinder gibt es oft kostenlose Angebote. Für kleine Kinder finden Sie zum Beispiel an manchen Orten Spielgruppen.

Parks und Natur

Sie sind gerne draußen? In jeder Stadt gibt es Parks. Für Kinder gibt es viele Spielplätze. Der Besuch ist meistens kostenlos. In botanischen Gärten können Sie besondere Pflanzen sehen. Tiere aus aller Welt kann man im Zoo besuchen. Botanische Gärten und Zoos kosten normalerweise etwas. Außerdem gibt es in vielen Regionen Seen, Wälder oder Berge, vielleicht wohnen Sie sogar in der Nähe vom Meer.

Im eigenen Zuhause

Zu Hause sehen die meisten Leute gern fern oder hören Radio. Jeder Haushalt in Deutschland muss sein Radio und seinen Fernseher anmelden und dafür eine monatliche Gebühr bezahlen. Im Moment sind das 17,98 Euro im Monat. Wenn man sehr wenig Geld hat, muss man nichts zahlen.

Vielleicht gibt es in Ihrem Haus einen Hof oder einen Balkon. Dort darf man nicht immer alles machen. Zum Beispiel darf man nicht in allen Häusern auf dem Balkon grillen. In der Hausordnung finden Sie alle Informationen dazu.
Informationen über die Freizeitmöglichkeiten finden Sie auch auf der Internetseite Ihrer Stadt/ Ihres Wohnorts.`;

export default function A2Day9UrlaubWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={9}
      title="Urlaub"
      chapter="4.9"
      workbookId="A2Day9Urlaub"
      topicPrompt="Sprich über deinen letzten Urlaub oder deinen Traumurlaub."
      showSpeakingTaskCard={false}
      schreibenTask="Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel."
      schreibenContent={schreibenContent}
      lesenText={cultureFreeTimeReadingText}
      lesenQuestions={[
        {
          stem: "Was kann man in Bibliotheken machen?",
          options: [
            "a) Nur Bücher kaufen",
            "b) Musik hören, Bücher lesen, Filme sehen oder ausleihen",
            "c) Nur CDs anhören",
            "d) Nur Filme anschauen",
          ],
        },
        {
          stem: "Wo kann man Sprach- oder Tanzkurse machen?",
          options: [
            "a) Im Supermarkt",
            "b) In der Stadtverwaltung",
            "c) An der Volkshochschule",
            "d) Im Museum",
          ],
        },
        {
          stem: "Was machen Menschen in Vereinen?",
          options: [
            "a) Sie wohnen zusammen.",
            "b) Sie arbeiten dort.",
            "c) Sie treffen sich, weil sie gemeinsame Interessen haben.",
            "d) Sie lernen Deutsch.",
          ],
        },
        {
          stem: "Wo kann man besondere Pflanzen sehen?",
          options: [
            "a) Im Kino",
            "b) Im Zoo",
            "c) Im botanischen Garten",
            "d) Im Supermarkt",
          ],
        },
        {
          stem: "Was ist normalerweise kostenlos?",
          options: [
            "a) Der Eintritt in Zoos",
            "b) Der Besuch von Parks und Spielplätzen",
            "c) Der Fernseher zu Hause",
            "d) Die Internetverbindung",
          ],
        },
        {
          stem: "Wie viel kostet die monatliche Gebühr für Fernsehen und Radio?",
          options: [
            "a) 7,98 Euro",
            "b) 10,50 Euro",
            "c) 17,98 Euro",
            "d) Es ist immer kostenlos",
          ],
        },
        {
          stem: "Wo findet man Informationen zum Grillen auf dem Balkon?",
          options: [
            "a) In der Schule",
            "b) In der Zeitung",
            "c) In der Hausordnung",
            "d) Im Fernseher",
          ],
        },
      ]}
      hoerenTask="Sieh dir das eingebettete Video über Annas letzten Sommerurlaub an. Achte auf das Reiseziel, die Dauer, besondere Orte, Aktivitäten und Annas Wunsch. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/Q6PjXP6Ccik"
      hoerenQuestions={[
        {
          stem: "Wohin ist Anna im letzten Sommerurlaub gereist?",
          options: [
            "a) Italien",
            "b) Griechenland",
            "c) Spanien",
          ],
        },
        {
          stem: "Wie lange blieb Anna auf Kreta?",
          options: [
            "a) Eine Woche",
            "b) Zwei Wochen",
            "c) Drei Tage",
          ],
        },
        {
          stem: "Was hat Anna besonders gut gefallen?",
          options: [
            "a) Die Altstadt von Chania",
            "b) Der Strand von Elafonissi",
            "c) Die Berge",
          ],
        },
        {
          stem: "Was haben Anna und ihre Freunde am letzten Tag gemacht?",
          options: [
            "a) Eine Wanderung",
            "b) Eine Bootstour",
            "c) Einen Museumsbesuch",
          ],
        },
        {
          stem: "Was hofft Anna bald wieder zu tun?",
          options: [
            "a) Nach Kreta zu reisen",
            "b) Nach Italien zu reisen",
            "c) Nach Spanien zu reisen",
          ],
        },
      ]}
    />
  );
}
