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
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(2)} />
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Brief an Felix: Mein Chef / Meine Chefin">
  <p style={paragraph}><strong>Aufgabe:</strong> Schreibe Felix einen kurzen Brief über deinen Chef oder deine Chefin.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Schreibe, warum du Felix schreibst.</li>
    <li>Beschreibe das Aussehen deines Chefs / deiner Chefin.</li>
    <li>Beschreibe Persönlichkeit und Verhalten bei der Arbeit.</li>
    <li>Sage, was dir gefällt oder was besser sein könnte.</li>
    <li>Frage Felix am Ende nach seinem Chef / seiner Chefin.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Lieber Felix, → Grund → Beschreibung → Meinung → Frage → Viele Grüße.</p>
</WorkbookTaskCard>;

const readingText = `Ich arbeite seit einem Jahr in einem kleinen Büro in der Stadtmitte. Mein Chef, Herr Müller, ist etwa 45 Jahre alt. Er ist ein sehr organisierter und motivierter Mensch. Jeden Morgen kommt er pünktlich ins Büro und begrüßt alle freundlich. Herr Müller trägt meistens einen Anzug und eine Brille. Er hat kurze, braune Haare und ist immer gut gelaunt. Er ist sehr freundlich, aber auch sehr anspruchsvoll, wenn es um die Arbeit geht.

Besonders gut finde ich, dass er immer Zeit für uns hat, wenn wir Fragen oder Probleme haben. Er geht geduldig auf unsere Anliegen ein und erklärt alles sehr klar. Er möchte, dass wir uns ständig verbessern, aber er ist dabei nie unhöflich oder zu streng. Er lobt uns oft, wenn wir gute Arbeit leisten, was sehr motivierend ist.

Ab und zu kann Herr Müller aber auch streng sein, besonders wenn eine Aufgabe nicht rechtzeitig erledigt wird. Er erwartet von uns, dass wir unsere Aufgaben genau erledigen, und ist sehr darauf bedacht, dass wir unsere Ziele erreichen. Trotzdem habe ich viel Respekt vor ihm, weil er fair ist und die Leistungen seiner Mitarbeiter wertschätzt.

Ich arbeite gerne mit Herrn Müller zusammen, weil er immer respektvoll mit uns umgeht und viel Wert auf Zusammenarbeit legt. Außerdem sorgt er dafür, dass wir in einem angenehmen Arbeitsumfeld arbeiten, was für mich sehr wichtig ist.`;

const readingQuestions = [
  {
    stem: "Wie lange arbeitet der Erzähler schon im Büro?",
    options: ["A. Zwei Jahre", "B. Ein Jahr", "C. Drei Monate", "D. Fünf Jahre"],
  },
  {
    stem: "Was ist besonders an Herrn Müllers Arbeitsweise?",
    options: [
      "A. Er kommt immer unpünktlich ins Büro",
      "B. Er ist immer gut gelaunt und organisiert",
      "C. Er ist sehr unorganisiert und chaotisch",
      "D. Er ist nie freundlich zu den Mitarbeitern",
    ],
  },
  {
    stem: "Was trägt Herr Müller normalerweise?",
    options: [
      "A. Einen Anzug und eine Krawatte",
      "B. Einen Pullover und Jeans",
      "C. Einen Anzug und eine Brille",
      "D. Eine Uniform",
    ],
  },
  {
    stem: "Was macht Herr Müller, wenn die Mitarbeiter Fragen haben?",
    options: [
      "A. Er ignoriert sie",
      "B. Er geht geduldig auf ihre Anliegen ein",
      "C. Er wird ärgerlich",
      "D. Er sagt, dass sie selbst nach Lösungen suchen sollen",
    ],
  },
  {
    stem: "Warum ist es motivierend, mit Herrn Müller zu arbeiten?",
    options: [
      "A. Weil er selten lobt",
      "B. Weil er seine Mitarbeiter regelmäßig lobt",
      "C. Weil er nie mit den Mitarbeitern spricht",
      "D. Weil er die Arbeit nicht ernst nimmt",
    ],
  },
  {
    stem: "Wann kann Herr Müller streng sein?",
    options: [
      "A. Wenn eine Aufgabe nicht rechtzeitig erledigt wird",
      "B. Wenn er sich langweilt",
      "C. Wenn die Mitarbeiter zu viel reden",
      "D. Wenn jemand zu früh nach Hause geht",
    ],
  },
  {
    stem: "Was schätzt der Erzähler an Herrn Müller besonders?",
    options: [
      "A. Dass er immer mit den Mitarbeitern streitet",
      "B. Dass er fair ist und die Leistungen seiner Mitarbeiter wertschätzt",
      "C. Dass er nie Zeit für die Mitarbeiter hat",
      "D. Dass er seine Aufgaben an andere weitergibt",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Warum lernt der Sprecher Deutsch?",
    options: [
      "A. Weil er nach Frankreich ziehen möchte.",
      "B. Weil er in Deutschland arbeiten möchte.",
      "C. Weil er eine deutsche Freundin hat.",
      "D. Weil er Deutsch liebt.",
    ],
  },
  {
    stem: "Welche Methoden benutzt der Sprecher zum Lernen?",
    options: [
      "A. Nur Bücher lesen.",
      "B. Nur Filme schauen.",
      "C. Sprachkurse, Online-Apps und das Üben mit Freunden.",
      "D. Nur Musik hören.",
    ],
  },
  {
    stem: "Wie oft übt der Sprecher Deutsch?",
    options: ["A. Jeden Tag eine Stunde.", "B. Einmal pro Woche.", "C. Einmal im Monat.", "D. Nie."],
  },
  {
    stem: "Mit wem übt der Sprecher zusätzlich Deutsch?",
    options: ["A. Mit seinen Kollegen.", "B. Mit Freunden.", "C. Nur mit seinem Lehrer.", "D. Mit niemandem."],
  },
  {
    stem: "Wie lange übt der Sprecher jeden Tag Deutsch?",
    options: ["A. Eine Stunde.", "B. Zehn Minuten.", "C. Drei Stunden.", "D. Nur am Wochenende."],
  },
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
    schreibenPlaceholder={"Lieber Felix,\n\nich schreibe dir, weil ...\n\nMein Chef / Meine Chefin ist ... Er/Sie hat ... Er/Sie ist ...\n\nIch finde ...\n\nWie ist dein Chef / deine Chefin?\n\nViele Grüße\n[Dein Name]"}
    lesenText={readingText}
    lesenQuestions={readingQuestions}
    hoerenTask="Sieh dir das eingebettete Video an und beantworte danach die fünf Hörverstehen-Fragen."
    hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"
    hoerenQuestions={listeningQuestions}
  />;
}
