import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <WorkbookTaskCard eyebrow="Group practice" title="Teil 1 · Sprechen" practiceOnly>
    <p style={paragraph}>
      Open each mind-map branch, practise the sentence, and connect the parts into one clear answer.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(5)} />
</>;

const schreibenContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="E-Mail an Alex: Freizeit planen">
  <p style={paragraph}><strong>Aufgabe:</strong> Du möchtest mit deinem Freund Alex am Wochenende etwas unternehmen. Schreibe Alex eine kurze E-Mail.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Sage, dass du am Wochenende Zeit hast.</li>
    <li>Schreibe, dass du etwas zusammen machen möchtest.</li>
    <li>Frage, ob Alex am Wochenende frei ist.</li>
    <li>Frage, welche Aktivität er vorschlägt.</li>
    <li>Schlage selbst eine mögliche Aktivität vor.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Hallo/Lieber Alex, → Zeit → gemeinsamer Plan → Frage → eigener Vorschlag → Viele Grüße.</p>
</WorkbookTaskCard>;

const restaurantReadingText = `Im Restaurant\n\nKellner: Guten Abend, haben Sie reserviert?\nGast: Ja, einen Tisch für zwei auf den Namen Müller.\nKellner: Darf ich Ihnen schon Getränke bringen?\nGast: Die Speisekarte bitte zuerst.\nGast: Wir bestellen eine Flasche Weißwein und Wasser. Als Vorspeise nehmen wir zweimal die Suppe. Als Hauptspeise nehmen wir Nudeln, eine Pizza und einen grünen Salat.\nKellner: Ist alles in Ordnung?\nGast: Die Suppe ist köstlich, aber leider kalt.\nKellner: Entschuldigen Sie, ich bringe sofort eine neue.\nGast: Außerdem haben Sie den grünen Salat vergessen.\nKellner: Das tut mir leid. Als Entschuldigung laden wir Sie zum Nachtisch ein.\nGast: Dann nehmen wir ein Tiramisu und einen Schokoladenkuchen.\nGast: Wir möchten gern bezahlen.\nKellner: Bar oder mit Karte?\nGast: Bar, bitte.`;

const lesenQuestions = [
  { stem:"Welche Hauptspeisen bestellen die Gäste?", options:["a) Schnitzel und Reis","b) Nur Suppe","c) Nudeln, Pizza und Salat","d) Fisch und Kartoffeln"] },
  { stem:"Was hat der Kellner vergessen?", options:["a) Wasser","b) Die Pizza","c) Den grünen Salat","d) Die Rechnung"] },
  { stem:"Welche Nachspeisen bestellen die Gäste?", options:["a) Eis und Kuchen","b) Obst","c) Schokoladenkuchen und Tiramisu","d) Keine"] },
  { stem:"Was ist mit der Suppe nicht in Ordnung?", options:["a) Sie ist zu teuer.","b) Die Suppe ist kalt.","c) Sie ist zu salzig.","d) Sie fehlt."] },
  { stem:"Wie bezahlt der Gast?", options:["a) Mit Karte","b) Per Überweisung","c) In bar","d) Mit Scheck"] },
  { stem:"Was macht Anna abends gerne?", options:["a) Sie trinkt Tee und liest.","b) Sie sieht fern.","c) Sie telefoniert."] },
  { stem:"Welches Brettspiel spielt Anna oft?", options:["a) Schach","b) Mensch ärgere dich nicht","c) Uno"] },
];

const hoerenQuestions = [
  { stem:"Was macht Anna jeden Morgen?", options:["a) Sie geht joggen.","b) Sie macht Yoga.","c) Sie schwimmt."] },
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
    schreibenTask="Du möchtest mit deinem Freund Alex am Wochenende etwas unternehmen. Schreibe Alex eine kurze E-Mail."
    schreibenContent={schreibenContent}
    schreibenPlaceholder={"Lieber Alex,\n\nich habe am Wochenende Zeit und möchte gern ...\n\nHast du am ... Zeit? Was möchtest du machen? Wir könnten ...\n\nViele Grüße\n[Dein Name]"}
    lesenText={restaurantReadingText}
    lesenQuestions={lesenQuestions}
    hoerenTask="Sieh dir das eingebettete Video über Anna und ihre Freizeit an und beantworte danach die Fragen."
    hoerenAudioUrl="https://youtu.be/V8gcgVcUGQM"
    hoerenQuestions={hoerenQuestions}
  />;
}
