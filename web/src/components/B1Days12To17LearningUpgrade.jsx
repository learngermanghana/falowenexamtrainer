import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const LESSONS = {
  12: {
    thinkTitle: "Tell the story in a timeline before choosing grammar",
    thinkQuestion: "What happened first, what happened next, and what problem changed the story?",
    thinkSteps: [
      "Choose one completed adventure and put the events in order.",
      "Use Perfekt for the main actions and Präteritum for background with war/hatte.",
      "Use als for one past moment, nachdem/bevor/während for sequence, and weil/obwohl for reasons or contrasts.",
      "Finish with one feeling or lesson from the experience.",
    ],
    thinkExample: "Idea: arrived → rain → continued → Als wir ankamen, war es sonnig. Später hat es geregnet. Obwohl der Weg schwierig war, sind wir weitergegangen.",
    title: "Natur-Abenteuer klar erzählen",
    rule: "Erzähle die Haupthandlungen meist im Perfekt. Mit als, nachdem, bevor und während ordnest du Ereignisse; im Nebensatz steht das konjugierte Verb am Ende.",
    examples: ["Als wir ankamen, war das Wetter schön.", "Nachdem wir das Zelt aufgebaut hatten, haben wir gegessen.", "Obwohl es geregnet hat, sind wir weitergewandert."],
    questions: [
      { stem: "Was passt für ein einmaliges Ereignis in der Vergangenheit? ___ ich ankam, war es schon dunkel.", options: ["Als", "Wenn", "Denn"], answer: 0, explanation: "als benutzt man typischerweise für ein einmaliges Ereignis in der Vergangenheit." },
      { stem: "Welcher Satz ist richtig?", options: ["Nachdem wir gegessen hatten, sind wir weitergegangen.", "Nachdem wir hatten gegessen, sind wir weitergegangen.", "Nachdem hatten wir gegessen, sind wir weitergegangen."], answer: 0, explanation: "Im nachdem-Satz steht das konjugierte Verb am Ende." },
      { stem: "Was passt? ___ es kalt war, sind wir weitergewandert.", options: ["Obwohl", "Deshalb", "Denn"], answer: 0, explanation: "obwohl drückt einen Gegensatz aus und leitet einen Nebensatz ein." },
    ],
    outputPrompt: "Erzähle ein Erlebnis in 5–6 Sätzen mit mindestens zwei Zeitkonnektoren.",
    starters: ["Als ich ...", "Nachdem wir ...", "Obwohl ...", "Am Ende ..."],
  },
  13: {
    thinkTitle: "Separate facts from opinion before writing a film review",
    thinkQuestion: "What is the film about, what was produced, and what exactly is your judgement?",
    thinkSteps: [
      "Give one neutral fact about the story or setting.",
      "Use Passiv for production facts such as wurde gedreht or wurde veröffentlicht.",
      "Choose one precise evaluation: spannend, überzeugend, langweilig, tiefgründig.",
      "Justify your judgement with weil/dass/obwohl and finish with a recommendation.",
    ],
    thinkExample: "Idea: film set in Berlin → strong actors → recommendation → Der Film spielt in Berlin. Er wurde 2024 veröffentlicht. Ich finde, dass die Schauspieler überzeugend sind, deshalb würde ich ihn empfehlen.",
    title: "Filmkritik: beschreiben, bewerten, empfehlen",
    rule: "Für Produktionsangaben nutzt du oft werden + Partizip II. Deine Meinung begründest du mit weil, dass oder obwohl; im Nebensatz steht das Verb am Ende.",
    examples: ["Der Film wurde in Berlin gedreht.", "Ich finde, dass die Handlung spannend ist.", "Obwohl der Film lang ist, würde ich ihn empfehlen."],
    questions: [
      { stem: "Welcher Passivsatz ist richtig?", options: ["Der Film wurde 2020 veröffentlicht.", "Der Film hat 2020 veröffentlicht.", "Der Film wurde 2020 veröffentlichen."], answer: 0, explanation: "Präteritum-Passiv: wurde + Partizip II." },
      { stem: "Was passt? Ich finde, ___ die Musik sehr gut ist.", options: ["dass", "denn", "trotzdem"], answer: 0, explanation: "dass leitet die genauere Aussage nach Ich finde ein." },
      { stem: "Was passt als höfliche Empfehlung?", options: ["Ich würde den Film empfehlen.", "Ich werde den Film empfohlen.", "Ich würde den Film empfehle."], answer: 0, explanation: "würde + Infinitiv ist eine passende Konjunktiv-II-Struktur." },
    ],
    outputPrompt: "Gib eine Mini-Filmkritik mit Handlung, Bewertung, Begründung und Empfehlung.",
    starters: ["Der Film handelt von ...", "Ich finde, dass ...", "Obwohl ...", "Ich würde ... empfehlen."],
  },
  14: {
    thinkTitle: "Compare two learning methods point by point",
    thinkQuestion: "Which exact feature are you comparing: flexibility, contact, cost, time or effectiveness?",
    thinkSteps: [
      "Choose one comparison point instead of speaking generally.",
      "Use während/hingegen/im Gegensatz zu for contrast.",
      "Add a balanced pair such as einerseits ... andererseits or zwar ... aber.",
      "End with your own preference and a reason.",
    ],
    thinkExample: "Idea: online = flexible, classroom = direct contact → Während digitales Lernen flexibler ist, bietet Präsenzunterricht mehr direkten Kontakt.",
    title: "Lernmethoden vergleichen und abwägen",
    rule: "Während leitet einen Nebensatz ein; hingegen/dagegen stehen im Hauptsatz. Zweiteilige Konnektoren helfen dir, Vor- und Nachteile ausgewogen zu formulieren.",
    examples: ["Während Online-Lernen flexibel ist, bietet Präsenzunterricht direkten Kontakt.", "Einerseits spart man Zeit, andererseits fehlen persönliche Gespräche.", "Ich denke, dass eine Kombination sinnvoll ist."],
    questions: [
      { stem: "Was passt? ___ Online-Lernen flexibel ist, bietet Präsenzunterricht mehr direkten Kontakt.", options: ["Während", "Deshalb", "Denn"], answer: 0, explanation: "während vergleicht oder kontrastiert zwei Situationen; das Verb steht im Nebensatz am Ende." },
      { stem: "Welche Struktur ist korrekt?", options: ["Einerseits ist es flexibel, andererseits gibt es Ablenkungen.", "Einerseits es ist flexibel, andererseits gibt es Ablenkungen.", "Einerseits ist flexibel es, andererseits gibt es Ablenkungen."], answer: 0, explanation: "Beide Teile bleiben grammatisch normale Hauptsätze." },
      { stem: "Was folgt nach im Gegensatz zu?", options: ["Dativ", "Akkusativ", "Genitiv"], answer: 0, explanation: "im Gegensatz zu wird mit Dativ verwendet." },
    ],
    outputPrompt: "Vergleiche digitales und traditionelles Lernen in 5 Sätzen und gib deine Präferenz an.",
    starters: ["Während ...", "Einerseits ... andererseits ...", "Im Gegensatz zu ...", "Ich bevorzuge ..., weil ..."],
  },
  15: {
    thinkTitle: "Decide whether the action or the person is important",
    thinkQuestion: "Do you need to say who does it, or only what happens in the process?",
    thinkSteps: [
      "If the person is unimportant, put the process in the centre with Passiv.",
      "For present passive use werden + Partizip II.",
      "With a modal verb, use Modalverb + Partizip II + werden at the end.",
      "Name the actor with von + Dativ only when it adds useful information.",
    ],
    thinkExample: "Idea: company stores data → process important → Persönliche Daten werden gespeichert. Sensitive Daten müssen geschützt werden.",
    title: "Passiv für digitale Prozesse und Regeln",
    rule: "Präsens-Passiv: werden + Partizip II. Modalpassiv: Modalverb + Partizip II + werden. Die Handlung steht im Mittelpunkt.",
    examples: ["Die E-Mail wird verschickt.", "Persönliche Daten werden gespeichert.", "Sichere Passwörter müssen verwendet werden."],
    questions: [
      { stem: "Welcher Satz steht im Passiv?", options: ["Die Daten werden gespeichert.", "Die Firma speichert die Daten.", "Die Daten speichern die Firma."], answer: 0, explanation: "werden + Partizip II bildet hier das Passiv." },
      { stem: "Was passt? Private Daten ___ nicht weitergegeben werden.", options: ["dürfen", "werden", "sind"], answer: 0, explanation: "Im Modalpassiv steht das Modalverb konjugiert und Partizip II + werden am Ende." },
      { stem: "Wie nennt man die handelnde Person im Passiv?", options: ["mit von + Dativ", "mit für + Akkusativ", "mit ohne + Akkusativ"], answer: 0, explanation: "Der Handelnde kann mit von + Dativ ergänzt werden." },
    ],
    outputPrompt: "Beschreibe vier Homeoffice-Regeln oder digitale Prozesse im Passiv.",
    starters: ["Die Daten werden ...", "Videokonferenzen werden ...", "Passwörter müssen ... werden.", "Mitarbeiter können ... werden."],
  },
  16: {
    thinkTitle: "Move from problem to cause to solution",
    thinkQuestion: "What is the stress problem, why does it happen, and what concrete action could help?",
    thinkSteps: [
      "Name one symptom or problem clearly.",
      "Explain the cause with weil/dass/wenn.",
      "Give advice with sollte/kann or Es ist wichtig, ... zu ...",
      "Add the purpose with damit or um ... zu.",
    ],
    thinkExample: "Idea: nervous before exams → poor preparation → plan earlier → Ich bin nervös, weil ich zu spät lerne. Ich sollte früher anfangen, um ruhiger zu sein.",
    title: "Prüfungsangst erklären und konkrete Tipps geben",
    rule: "weil/dass/wenn schicken das konjugierte Verb ans Satzende. Für Ratschläge sind sollte/kann nützlich; Ziele formulierst du mit um ... zu oder damit.",
    examples: ["Ich bin nervös, weil ich Angst vor schlechten Noten habe.", "Man sollte frühzeitig lernen.", "Ich mache Pausen, um konzentriert zu bleiben."],
    questions: [
      { stem: "Welcher Satz ist richtig?", options: ["Ich bin nervös, weil ich morgen eine Prüfung habe.", "Ich bin nervös, weil ich habe morgen eine Prüfung.", "Ich bin nervös, weil habe ich morgen eine Prüfung."], answer: 0, explanation: "Nach weil steht das konjugierte Verb am Ende." },
      { stem: "Was passt als Ratschlag? Man ___ genug schlafen.", options: ["sollte", "wurde", "hätte gewesen"], answer: 0, explanation: "sollte ist eine typische Form für einen höflichen Ratschlag." },
      { stem: "Was passt bei gleichem Subjekt? Ich mache Pausen, ___ mich besser zu konzentrieren.", options: ["um", "damit", "obwohl"], answer: 0, explanation: "um ... zu ist passend, wenn das Subjekt in beiden Teilen gleich ist." },
    ],
    outputPrompt: "Nenne ein Stressproblem, eine Ursache und drei konkrete Tipps.",
    starters: ["Viele Lernende sind nervös, weil ...", "Man sollte ...", "Es ist wichtig, ... zu ...", "Ich ... , um ... zu ..."],
  },
  17: {
    thinkTitle: "Choose the learning problem before choosing the method",
    thinkQuestion: "What do you want to improve: memory, concentration, motivation, speaking or time management?",
    thinkSteps: [
      "Name one concrete learning goal or problem.",
      "Choose a method that directly solves that problem.",
      "Explain why it works with weil or dass.",
      "Explain the condition with wenn and the purpose with damit or um ... zu.",
    ],
    thinkExample: "Idea: remember vocabulary → repeat regularly → Ich lerne Wörter besser, wenn ich sie regelmäßig wiederhole. Ich mache kurze Übungen, um sie langfristig zu behalten.",
    title: "Effektive Lernmethoden erklären",
    rule: "Mit wenn beschreibst du Bedingungen, mit weil/dass Gründe und Aussagen. Für Ziele nutzt du um ... zu bei gleichem Subjekt oder damit bei verschiedenen Subjekten.",
    examples: ["Ich lerne am besten, wenn ich mir Notizen mache.", "Ich finde, dass regelmäßige Wiederholung wichtig ist.", "Ich mache Pausen, um konzentriert zu bleiben."],
    questions: [
      { stem: "Was passt? Ich lerne besser, ___ ich mein Handy ausschalte.", options: ["wenn", "denn", "trotzdem"], answer: 0, explanation: "wenn beschreibt hier die Bedingung, unter der das Lernen besser funktioniert." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich finde, dass Pausen wichtig sind.", "Ich finde, dass sind Pausen wichtig.", "Ich finde, Pausen dass wichtig sind."], answer: 0, explanation: "Im dass-Satz steht das konjugierte Verb am Ende." },
      { stem: "Was passt bei gleichem Subjekt? Ich wiederhole den Stoff, ___ ihn besser zu behalten.", options: ["um", "damit", "obwohl"], answer: 0, explanation: "um ... zu drückt ein Ziel mit demselben Subjekt aus." },
    ],
    outputPrompt: "Erkläre deine beste Lernmethode mit Problem, Methode, Grund und Ziel.",
    starters: ["Ich lerne am besten, wenn ...", "Ich finde, dass ...", "Diese Methode hilft mir, weil ...", "Ich ... , um ... zu ..."],
  },
};

const ThinkingFirstCard = ({ lesson }) => (
  <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 14, background: "#f8fbff", display: "grid", gap: 10 }}>
    <strong style={{ color: "#1d4ed8" }}>Think first · Erst verstehen, dann anwenden</strong>
    <h3 style={{ margin: 0 }}>{lesson.thinkTitle}</h3>
    <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Ask yourself:</strong> {lesson.thinkQuestion}</p>
    <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>{lesson.thinkSteps.map((step) => <li key={step}>{step}</li>)}</ol>
    <div style={{ padding: 12, borderRadius: 10, background: "#fff", border: "1px solid #dbeafe", lineHeight: 1.7 }}>
      <strong>Idea → decision → German sentence</strong><br />{lesson.thinkExample}
    </div>
  </div>
);

export default function B1Days12To17LearningUpgrade({ day }) {
  const lesson = LESSONS[Number(day)];
  if (!lesson) return null;
  return (
    <section data-b1-days12-17-learning-upgrade={`day-${day}`} style={{ display: "grid", gap: 12 }}>
      <div style={{ color: "#1e3a8a", fontWeight: 800 }}>B1 Day {day} · Schnell verstehen, dann anwenden</div>
      <ThinkingFirstCard lesson={lesson} />
      <A2MiniLearningBlock {...lesson} />
    </section>
  );
}
