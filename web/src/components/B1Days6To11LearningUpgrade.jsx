import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const THINK_FIRST_BY_DAY = {
  6: {
    title: "Compare first, then justify your choice",
    question: "Which place do you prefer, and what is your strongest reason?",
    steps: [
      "Choose one side first: Stadt or Land.",
      "Compare one clear point with Komparativ + als or so ... wie.",
      "Add a reason with weil/da/denn or a contrast with obwohl/während.",
      "Finish with your own preference or a concrete example.",
    ],
    example: "Idea: Land = quieter + reason → Auf dem Land ist es ruhiger als in der Stadt, weil es weniger Verkehr gibt.",
  },
  7: {
    title: "Find the relationship before choosing the Genitiv form",
    question: "Are you expressing a reason, a contrast or possession?",
    steps: [
      "Identify the function: reason with wegen, contrast with trotz, possession with Genitiv.",
      "Find the noun and its article.",
      "Use the Genitiv form after wegen/trotz in formal B1 German.",
      "Then build the complete sentence around the noun phrase.",
    ],
    example: "Idea: unhealthy food causes problems → Wegen des ungesunden Essens fühlen sich manche Menschen müde.",
  },
  8: {
    title: "Decide the strength of your advice before choosing the modal verb",
    question: "Is this a recommendation, obligation, possibility, permission or personal wish?",
    steps: [
      "Recommendation → sollte; obligation → muss; possibility → kann; permission → darf; wish → möchte.",
      "Conjugate the modal verb for the subject.",
      "Keep the second verb as an infinitive at the end.",
      "Add a reason or example so the health advice sounds complete.",
    ],
    example: "Idea: recommendation + exercise → Man sollte sich regelmäßig bewegen, weil Bewegung gesund ist.",
  },
  9: {
    title: "Choose the relationship: goal, method or contrast",
    question: "Are you explaining why, how, an alternative or an unexpected contrast?",
    steps: [
      "Goal with same subject → um ... zu; different subject → damit.",
      "Method → indem.",
      "Alternative/missing action → statt ... zu / ohne ... zu.",
      "Unexpected contrast → obwohl or trotzdem.",
    ],
    example: "Idea: reduce stress by planning breaks → Man reduziert Stress, indem man regelmäßige Pausen einplant.",
  },
  10: {
    title: "Choose what you are comparing before choosing the form",
    question: "Are two things different, equal, the highest degree, or changing together?",
    steps: [
      "Difference → Komparativ + als.",
      "Equality → so ... wie.",
      "Highest degree → am ...-sten / der, die, das ...-ste.",
      "Two linked changes → je ... desto/umso.",
    ],
    example: "Idea: less screen time = better sleep → Je weniger Zeit ich am Handy verbringe, desto besser schlafe ich.",
  },
  11: {
    title: "Picture the two-way action first",
    question: "What are the people doing to or with each other?",
    steps: [
      "Identify the reciprocal action: help, talk, learn, rely, compete.",
      "Choose einander or the matching preposition + einander form.",
      "Keep the normal verb structure around the reciprocal expression.",
      "Add a team example so the meaning is clear.",
    ],
    example: "Idea: team members learn from each other → Gute Teammitglieder lernen voneinander und helfen einander.",
  },
};

const LEARNING_BY_DAY = {
  6: {
    title: "Stadt und Land vergleichen und begründen",
    rule: "Vergleiche Unterschiede mit Komparativ + als und Gleichheit mit so ... wie. Gründe kannst du mit weil, da oder denn nennen; Gegensätze mit obwohl oder während.",
    examples: [
      "Auf dem Land ist es ruhiger als in der Stadt.",
      "Die Stadt ist nicht so ruhig wie das Land.",
      "Ich wohne gern in der Stadt, weil ich dort bessere Verkehrsmittel habe.",
    ],
    questions: [
      { stem: "Was passt? Auf dem Land ist es oft ___ als in der Stadt.", options: ["ruhiger", "ruhig", "am ruhigsten"], answer: 0, explanation: "Für einen direkten Unterschied benutzt du den Komparativ." },
      { stem: "Welcher Satz begründet korrekt?", options: ["Ich mag die Stadt, weil es viele Angebote gibt.", "Ich mag die Stadt, weil gibt es viele Angebote.", "Ich mag die Stadt, denn es viele Angebote gibt."], answer: 0, explanation: "Im weil-Satz steht das konjugierte Verb am Ende." },
      { stem: "Was drückt einen Gegensatz aus?", options: ["obwohl", "weil", "deshalb"], answer: 0, explanation: "obwohl leitet einen konzessiven Gegensatz ein." },
    ],
    outputPrompt: "Vergleiche Stadt und Land in 4–5 Sätzen und begründe deine eigene Präferenz.",
    starters: ["In der Stadt ist ... als ...", "Auf dem Land ist ...", "Ich bevorzuge ..., weil ...", "Obwohl ..., ..."],
  },
  7: {
    title: "Genitiv mit wegen und trotz",
    rule: "Nach wegen und trotz steht in formeller Standardsprache häufig der Genitiv. Maskulin/Neutrum: des + -(e)s; Feminin/Plural: der.",
    examples: [
      "Wegen des hohen Zuckergehalts esse ich weniger Fast Food.",
      "Trotz der kurzen Zeit koche ich selbst.",
      "Die Qualität des Essens ist wichtig.",
    ],
    questions: [
      { stem: "Was passt? Wegen ___ hohen Preises kaufe ich das Produkt nicht.", options: ["des", "dem", "den"], answer: 0, explanation: "Preis ist maskulin; im Genitiv steht des Preises." },
      { stem: "Was passt? Trotz ___ langen Wartezeit blieb sie ruhig.", options: ["der", "die", "den"], answer: 0, explanation: "Wartezeit ist feminin; Genitiv: der langen Wartezeit." },
      { stem: "Welcher Genitiv ist korrekt?", options: ["die Qualität des Essens", "die Qualität dem Essen", "die Qualität den Essens"], answer: 0, explanation: "Neutrum im Genitiv: des Essens." },
    ],
    outputPrompt: "Formuliere je zwei Sätze mit wegen und trotz zum Thema Ernährung.",
    starters: ["Wegen des/der ...", "Trotz des/der ...", "Die Qualität des/der ..."],
  },
  8: {
    title: "Modalverben für Gesundheit und Empfehlungen",
    rule: "Das Modalverb steht im Hauptsatz auf Position 2; der zweite Verbteil bleibt im Infinitiv am Ende. sollte = Empfehlung, muss = Pflicht, kann = Möglichkeit, darf = Erlaubnis, möchte = Wunsch.",
    examples: [
      "Man sollte genug schlafen.",
      "Ich muss heute früher ins Bett gehen.",
      "Du kannst mit kleinen Veränderungen anfangen.",
    ],
    questions: [
      { stem: "Welches Modalverb passt für eine Empfehlung? Du ___ mehr Wasser trinken.", options: ["solltest", "musst", "darfst"], answer: 0, explanation: "solltest drückt eine Empfehlung aus." },
      { stem: "Welcher Satz ist richtig?", options: ["Ich muss mehr schlafen.", "Ich muss schlafe mehr.", "Ich mehr schlafen muss."], answer: 0, explanation: "Modalverb auf Position 2, Infinitiv am Ende." },
      { stem: "Welches Verb drückt Möglichkeit aus?", options: ["kann", "muss", "sollte"], answer: 0, explanation: "können beschreibt eine Möglichkeit oder Fähigkeit." },
    ],
    outputPrompt: "Gib fünf Gesundheitstipps und benutze mindestens drei verschiedene Modalverben.",
    starters: ["Man sollte ...", "Du kannst ...", "Man muss ...", "Ich möchte ..."],
  },
  9: {
    title: "Ziele, Methoden und Gegensätze ausdrücken",
    rule: "um ... zu = Ziel bei gleichem Subjekt; damit = Ziel bei unterschiedlichem Subjekt; indem = Methode; obwohl/trotzdem = Gegensatz.",
    examples: [
      "Ich mache Pausen, um konzentriert zu bleiben.",
      "Der Arbeitgeber bietet Gleitzeit an, damit Eltern flexibler arbeiten können.",
      "Man reduziert Stress, indem man klare Grenzen setzt.",
    ],
    questions: [
      { stem: "Was passt? Ich gehe spazieren, ___ mich zu entspannen.", options: ["um", "damit", "indem"], answer: 0, explanation: "Gleiches Subjekt und Ziel: um ... zu." },
      { stem: "Was passt bei zwei verschiedenen Subjekten? Die Firma bietet Homeoffice an, ___ die Beschäftigten flexibler arbeiten können.", options: ["damit", "um", "ohne"], answer: 0, explanation: "Bei unterschiedlichen Subjekten benutzt du damit." },
      { stem: "Was beschreibt eine Methode?", options: ["indem", "obwohl", "statt"], answer: 0, explanation: "indem beantwortet die Frage: Wie?" },
    ],
    outputPrompt: "Erkläre in 4–5 Sätzen, wie man eine bessere Work-Life-Balance erreichen kann.",
    starters: ["Ich ..., um ... zu ...", "Arbeitgeber sollten ..., damit ...", "Man kann Stress reduzieren, indem ...", "Obwohl ..., ..."],
  },
  10: {
    title: "Vergleiche und je ... desto",
    rule: "Komparativ + als zeigt Unterschiede; so ... wie zeigt Gleichheit; Superlativ zeigt die höchste Stufe; je ... desto verbindet zwei parallele Veränderungen.",
    examples: [
      "Ein Spaziergang ist entspannender als ständiges Scrollen.",
      "Lesen ist für mich genauso erholsam wie Musik hören.",
      "Je weniger ich online bin, desto ruhiger fühle ich mich.",
    ],
    questions: [
      { stem: "Was passt? Sport ist oft gesünder ___ langes Sitzen.", options: ["als", "wie", "desto"], answer: 0, explanation: "Nach dem Komparativ steht als." },
      { stem: "Was drückt Gleichheit aus?", options: ["so ... wie", "je ... desto", "mehr ... als"], answer: 0, explanation: "so ... wie vergleicht zwei gleich starke Eigenschaften." },
      { stem: "Welcher Satz ist korrekt?", options: ["Je weniger ich scrolle, desto besser schlafe ich.", "Je weniger ich scrolle, als besser schlafe ich.", "Desto weniger ich scrolle, je besser schlafe ich."], answer: 0, explanation: "Die feste Struktur lautet je ..., desto/umso ..." },
    ],
    outputPrompt: "Vergleiche digitale und analoge Freizeitaktivitäten und bilde mindestens einen je-desto-Satz.",
    starters: ["... ist ... als ...", "... ist so ... wie ...", "Am ...sten ist ...", "Je ..., desto ..."],
  },
  11: {
    title: "Gegenseitige Handlungen mit einander",
    rule: "einander bedeutet 'each other'. Mit Präpositionen entstehen Formen wie miteinander, voneinander, füreinander, aufeinander und gegeneinander.",
    examples: [
      "Die Teammitglieder helfen einander.",
      "Wir arbeiten gut miteinander.",
      "In einem guten Team lernt man voneinander.",
    ],
    questions: [
      { stem: "Was passt? Gute Kollegen arbeiten gut ___.", options: ["miteinander", "voneinander", "gegeneinander"], answer: 0, explanation: "miteinander = together/with each other." },
      { stem: "Was passt? Im Team lernen wir viel ___.", options: ["voneinander", "aufeinander", "füreinander"], answer: 0, explanation: "von jemandem lernen → voneinander lernen." },
      { stem: "Welcher Satz ist korrekt?", options: ["Die Spieler helfen einander.", "Die Spieler helfen miteinander sich.", "Die Spieler einander helfen sich."], answer: 0, explanation: "einander steht als reziprokes Objekt beim Verb helfen." },
    ],
    outputPrompt: "Beschreibe ein gutes Team in 4–5 Sätzen und benutze mindestens drei reziproke Ausdrücke.",
    starters: ["Wir helfen einander ...", "Wir arbeiten miteinander ...", "Wir lernen voneinander ...", "Wir verlassen uns aufeinander ..."],
  },
};

const ThinkingFirstCard = ({ day }) => {
  const guide = THINK_FIRST_BY_DAY[Number(day)];
  if (!guide) return null;
  return (
    <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 14, background: "#f8fbff", display: "grid", gap: 10 }}>
      <strong style={{ color: "#1d4ed8" }}>Think first · Erst verstehen, dann anwenden</strong>
      <h3 style={{ margin: 0 }}>{guide.title}</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Ask yourself:</strong> {guide.question}</p>
      <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>
        {guide.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <div style={{ padding: 12, borderRadius: 10, background: "#fff", border: "1px solid #dbeafe", lineHeight: 1.7 }}>
        <strong>Idea → decision → German sentence</strong><br />{guide.example}
      </div>
    </div>
  );
};

export default function B1Days6To11LearningUpgrade({ day }) {
  const lesson = LEARNING_BY_DAY[Number(day)];
  if (!lesson) return null;
  return (
    <section data-b1-days6-11-learning-upgrade={`day-${day}`} style={{ display: "grid", gap: 12 }}>
      <div style={{ color: "#1e3a8a", fontWeight: 800 }}>B1 Day {day} · Schnell lernen, dann anwenden</div>
      <ThinkingFirstCard day={day} />
      <A2MiniLearningBlock {...lesson} />
    </section>
  );
}
