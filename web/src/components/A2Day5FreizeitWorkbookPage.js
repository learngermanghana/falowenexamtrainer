import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const list = { margin:0, paddingLeft:22, lineHeight:1.75 };

const speakingContent = <A2MiniLearningBlock
  title="Über Freizeit in ganzen Sätzen sprechen"
  rule="Sag zuerst, was du machst, dann wann oder mit wem, und gib am Ende einen einfachen Grund mit weil."
  examples={[
    "In meiner Freizeit spiele ich Fußball.",
    "Am Wochenende treffe ich mich mit Freunden.",
    "Ich interessiere mich für Musik.",
    "Ich gehe gern spazieren, weil ich mich dabei entspannen kann."
  ]}
  questions={[
    { stem:"Welcher Satz ist richtig?", options:["In meiner Freizeit ich spiele Fußball.","In meiner Freizeit spiele ich Fußball."], answer:1, explanation:"Wenn ein Zeitteil zuerst steht, kommt das Verb direkt danach." },
    { stem:"Was passt? Ich interessiere mich ___ Musik.", options:["an","für","mit"], answer:1, explanation:"Die feste Verbindung lautet: sich für etwas interessieren." },
    { stem:"Was passt? Am Wochenende ___ ich mich mit Freunden.", options:["treffe","treffen","trifft"], answer:0, explanation:"Mit ich heißt das Verb: ich treffe mich." },
    { stem:"Welcher Satz gibt einen Grund richtig an?", options:["Ich gehe spazieren, weil ich möchte entspannen.","Ich gehe spazieren, weil ich mich entspannen möchte."], answer:1, explanation:"Bei weil steht das konjugierte Verb am Ende." }
  ]}
  outputPrompt="Sprich 4–6 Sätze über deine Freizeit. Sage was du machst, wann, mit wem und warum."
  starters={["In meiner Freizeit ...", "Am Wochenende ...", "Ich mache das mit ...", "Ich mag das, weil ..."]}
/>;

const schreibenContent = <WorkbookTaskCard eyebrow="Schreibaufgabe" title="E-Mail an Alex">
  <p style={{ margin:0, lineHeight:1.7 }}>Sie möchten mit Ihrem Freund Alex in Ihrer Freizeit etwas unternehmen. Schreiben Sie Alex eine E-Mail:</p>
  <ol style={list}>
    <li>Sagen Sie, dass Sie Zeit haben und etwas zusammen machen möchten.</li>
    <li>Fragen Sie, ob er am Wochenende frei ist.</li>
    <li>Fragen Sie, ob er einen Vorschlag für eine Aktivität hat.</li>
  </ol>
</WorkbookTaskCard>;

const restaurantReadingText = `Im Restaurant\n\nKellner: Guten Abend, haben Sie reserviert?\nGast: Ja, einen Tisch für zwei auf den Namen Müller.\nKellner: Darf ich Ihnen schon Getränke bringen?\nGast: Die Speisekarte bitte zuerst.\nGast: Wir bestellen eine Flasche Weißwein und Wasser. Als Vorspeise nehmen wir zweimal die Suppe. Als Hauptspeise nehmen wir Nudeln, eine Pizza und einen grünen Salat.\nKellner: Ist alles in Ordnung?\nGast: Die Suppe ist köstlich, aber leider kalt.\nKellner: Entschuldigen Sie, ich bringe sofort eine neue.\nGast: Außerdem haben Sie den grünen Salat vergessen.\nKellner: Das tut mir leid. Als Entschuldigung laden wir Sie zum Nachtisch ein.\nGast: Dann nehmen wir ein Tiramisu und einen Schokoladenkuchen.\nGast: Wir möchten gern bezahlen.\nKellner: Bar oder mit Karte?\nGast: Bar, bitte.`;

const lesenQuestions = [
  { stem:"Welche Hauptspeisen bestellen die Gäste?", options:["a) Nudeln, Pizza und Salat","b) Schnitzel und Reis","c) Nur Suppe","d) Fisch und Kartoffeln"] },
  { stem:"Was hat der Kellner vergessen?", options:["a) Wasser","b) Den grünen Salat","c) Die Pizza","d) Die Rechnung"] },
  { stem:"Was ist mit der Suppe nicht in Ordnung?", options:["a) Sie ist kalt.","b) Sie ist zu teuer.","c) Sie ist zu salzig.","d) Sie fehlt."] },
  { stem:"Welche Nachspeisen bestellen die Gäste?", options:["a) Eis und Kuchen","b) Tiramisu und Schokoladenkuchen","c) Obst","d) Keine"] },
  { stem:"Wie bezahlt der Gast?", options:["a) Mit Karte","b) Bar","c) Per Überweisung","d) Mit Scheck"] }
];

const hoerenQuestions = [
  { stem:"Was macht Anna abends gerne?", options:["a) Tee trinken und lesen","b) Fernsehen","c) Telefonieren"] },
  { stem:"Welches Brettspiel spielt Anna oft?", options:["a) Schach","b) Mensch ärgere dich nicht","c) Uno"] },
  { stem:"Was macht Anna jeden Morgen?", options:["a) Joggen","b) Yoga","c) Schwimmen"] },
  { stem:"Wo war Anna letztes Wochenende mit Freunden?", options:["a) Am Strand","b) In den Bergen","c) Im Park"] },
  { stem:"Welche Musik hört Anna zum Konzentrieren?", options:["a) Pop","b) Klassische Musik","c) Jazz"] }
];

export default function A2Day5FreizeitWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={5}
    title="Was machst du in deiner Freizeit?"
    chapter="2.5"
    workbookId="A2Day5Freizeit"
    topicPrompt="Welche Freizeitaktivitäten machst du gern und warum?"
    sprechenContent={speakingContent}
    schreibenTask="Sie möchten mit Ihrem Freund Alex in Ihrer Freizeit etwas unternehmen. Schreiben Sie Alex eine E-Mail."
    schreibenContent={schreibenContent}
    lesenText={restaurantReadingText}
    lesenQuestions={lesenQuestions}
    hoerenTask="Sieh dir das eingebettete Video über Anna und ihre Freizeit an und beantworte danach die Fragen."
    hoerenAudioUrl="https://youtu.be/V8gcgVcUGQM"
    hoerenQuestions={hoerenQuestions}
  />;
}
