import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin:0, lineHeight:1.7 };
const list = { margin:0, paddingLeft:22, lineHeight:1.75 };

const speakingContent = <>
  <A2MiniLearningBlock
    title="Eine Person mit ganzen Sätzen beschreiben"
    rule="Benutze sein für Eigenschaften, haben für Körpermerkmale und tragen für Kleidung oder Accessoires. Baue deine Beschreibung Schritt für Schritt auf: Aussehen → Kleidung → Charakter."
    examples={[
      "Er ist mittelgroß und sportlich.",
      "Er hat kurze schwarze Haare und braune Augen.",
      "Er trägt eine Brille und oft ein blaues Hemd.",
      "Er ist freundlich, ruhig und hilfsbereit."
    ]}
    questions={[
      { stem:"Was passt? Er ___ kurze schwarze Haare.", options:["ist","hat","trägt"], answer:1, explanation:"Haare sind ein Körpermerkmal: Er hat ..." },
      { stem:"Was passt? Sie ___ sehr freundlich und geduldig.", options:["ist","hat","trägt"], answer:0, explanation:"Eigenschaften stehen mit sein." },
      { stem:"Was passt? Er ___ eine Brille.", options:["ist","hat","trägt"], answer:2, explanation:"Bei Kleidung und Accessoires ist trägt besonders natürlich." },
      { stem:"Welche Reihenfolge ist für eine kurze Beschreibung klar?", options:["Charakter → Name → zufällige Wörter","Aussehen → Kleidung → Charakter","Nur Adjektive nennen"], answer:1, explanation:"Eine feste Reihenfolge hilft dir, flüssiger zu sprechen." }
    ]}
    outputPrompt="Beschreibe eine Person in 4–6 ganzen Sätzen."
    starters={["Die Person ist ...", "Sie/Er hat ...", "Sie/Er trägt ...", "Vom Charakter her ist sie/er ..."]}
  />

  <WorkbookTaskCard eyebrow="Teil 1 · Sprechen" title="Jetzt beschreibst du selbst" practiceOnly>
    <p style={paragraph}>Wähle eine Person aus deiner Familie, Arbeit oder deinem Freundeskreis. Sprich zuerst über das Aussehen und danach über den Charakter.</p>
    <ul style={list}>
      <li>Aussehen: groß, klein, mittelgroß, Haare, Augen</li>
      <li>Kleidung/Merkmale: Brille, Bart, Kleid, Hemd</li>
      <li>Charakter: freundlich, lustig, ruhig, hilfsbereit, geduldig</li>
    </ul>
  </WorkbookTaskCard>
</>;

const writingContent = <WorkbookTaskCard eyebrow="Schreibaufgabe" title="Schreibe einen Brief an Felix">
  <p style={paragraph}>Erzähle Felix von deinem Chef oder deiner Chefin.</p>
  <ol style={list}>
    <li>Warum schreibst du?</li>
    <li>Beschreibe Aussehen, Persönlichkeit und Verhalten.</li>
    <li>Was gefällt dir, und was könnte besser sein?</li>
  </ol>
</WorkbookTaskCard>;

const readingText = `Ich arbeite seit einem Jahr in einem kleinen Büro in der Stadtmitte. Mein Chef, Herr Müller, ist etwa 45 Jahre alt. Er ist ein sehr organisierter und motivierter Mensch. Jeden Morgen kommt er pünktlich ins Büro und begrüßt alle freundlich. Herr Müller trägt meistens einen Anzug und eine Brille. Er hat kurze, braune Haare und ist immer gut gelaunt. Er ist sehr freundlich, aber auch sehr anspruchsvoll, wenn es um die Arbeit geht.

Besonders gut finde ich, dass er immer Zeit für uns hat, wenn wir Fragen oder Probleme haben. Er geht geduldig auf unsere Anliegen ein und erklärt alles sehr klar. Er möchte, dass wir uns ständig verbessern, aber er ist dabei nie unhöflich oder zu streng. Er lobt uns oft, wenn wir gute Arbeit leisten, was sehr motivierend ist.

Ab und zu kann Herr Müller aber auch streng sein, besonders wenn eine Aufgabe nicht rechtzeitig erledigt wird. Er erwartet von uns, dass wir unsere Aufgaben genau erledigen. Trotzdem habe ich viel Respekt vor ihm, weil er fair ist und die Leistungen seiner Mitarbeiter wertschätzt.`;

const readingQuestions = [
  { stem:"Wie lange arbeitet der Erzähler schon im Büro?", options:["A. Zwei Jahre","B. Ein Jahr","C. Drei Monate","D. Fünf Jahre"] },
  { stem:"Was trägt Herr Müller normalerweise?", options:["A. Einen Anzug und eine Krawatte","B. Einen Pullover und Jeans","C. Einen Anzug und eine Brille","D. Eine Uniform"] },
  { stem:"Was macht Herr Müller, wenn Mitarbeiter Fragen haben?", options:["A. Er ignoriert sie","B. Er hilft geduldig","C. Er wird ärgerlich","D. Er geht nach Hause"] },
  { stem:"Warum respektiert der Erzähler Herrn Müller?", options:["A. Weil er fair ist","B. Weil er nie spricht","C. Weil er unpünktlich ist","D. Weil er keine Ziele hat"] }
];

const listeningQuestions = [
  { stem:"Warum lernt der Sprecher Deutsch?", options:["A. Weil er nach Frankreich ziehen möchte.","B. Weil er in Deutschland arbeiten möchte.","C. Weil er eine deutsche Freundin hat.","D. Weil er Deutsch liebt."] },
  { stem:"Welche Methoden benutzt der Sprecher?", options:["A. Nur Bücher","B. Nur Filme","C. Sprachkurse, Apps und Freunde","D. Nur Musik"] },
  { stem:"Wie oft übt der Sprecher Deutsch?", options:["A. Jeden Tag eine Stunde.","B. Einmal pro Woche.","C. Einmal im Monat.","D. Nie."] }
];

export default function A2Day2PersonenBeschreibenWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={2}
    title="Personen beschreiben"
    chapter="1.2"
    workbookId="A2Day2PersonenBeschreiben"
    topicPrompt="Personen beschreiben"
    sprechenContent={speakingContent}
    schreibenContent={writingContent}
    schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich schreibe dir, weil ...\n\nMein Chef / Meine Chefin ist ... Er/Sie hat ..."}
    lesenText={readingText}
    lesenQuestions={readingQuestions}
    hoerenTask="Sieh dir das eingebettete Video an und beantworte danach die drei Hörverstehen-Fragen."
    hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"
    hoerenQuestions={listeningQuestions}
  />;
}
