// Public A1–B1 placement test (30 questions, 10 per level).
// This is a diagnostic screening, not a Goethe-Institut exam or a CEFR certificate.
export const PLACEMENT_DURATION_MS = 20 * 60 * 1000;
export const PLACEMENT_STORAGE_KEY = "falowen.publicPlacement.v4.30q";

const byLevel = [
  {
    id: "a1", level: "A1", title: "Teil 1 · Niveau A1",
    description: "Basic grammar, questions and everyday German.",
    items: [
      ["Verbkonjugation im Präsens", "Hallo, ich ___ Thomas und wohne in Berlin.", ["heiße", "heißt", "heißen", "geheißen"], 0],
      ["Artikel im Akkusativ", "Ich kaufe ___ Tisch (m.) für mein Wohnzimmer.", ["der", "den", "dem", "das"], 1],
      ["Präpositionen & Herkunft", "Woher kommen Sie? – Ich komme ___ der Schweiz.", ["in", "aus", "nach", "von"], 1],
      ["Wortstellung im Hauptsatz", "Welcher Satz ist grammatisch korrekt?", ["Heute ich lerne Deutsch.", "Ich lerne heute Deutsch.", "Deutsch heute lerne ich.", "Lerne heute ich Deutsch."], 1],
      ["Modalverben im Präsens", "Entschuldigung, ___ Sie mir bitte helfen?", ["muss", "können", "kannst", "könnt"], 1],
      ["Fragewörter & Zahlen", "„___ kosten die Tomaten?“ – „Zwei Euro das Kilo.“", ["Wann", "Wie viel", "Wo", "Wer"], 1],
      ["Personalpronomen (Akkusativ)", "Kennst du Maria? – Ja, ich kenne ___ gut.", ["ihr", "sie", "er", "ihnen"], 1],
      ["Negation (nicht vs. kein)", "Ich trinke ___ Kaffee, lieber Tee.", ["nicht", "keinen", "keine", "nichts"], 1],
      ["Possessivartikel", "Das ist mein Bruder und das ist ___ Frau.", ["seine", "ihre", "mein", "deinem"], 0],
      ["Ja/Nein-Fragen (Inversion)", "___ du morgen Zeit für einen Kaffee?", ["Hast", "Haben", "Hat", "Habt"], 0],
    ],
  },
  {
    id: "a2", level: "A2", title: "Teil 2 · Niveau A2",
    description: "Past tense, cases, subordinate clauses and comparisons.",
    items: [
      ["Perfekt mit haben / sein", "Gestern ___ wir mit dem Zug nach Hamburg ___.", ["haben ... gefahren", "sind ... gefahren", "waren ... gefahren", "werden ... fahren"], 1],
      ["Dativ-N-Deklination", "Ich danke ___ (m.) herzlich für die große Hilfe.", ["dem Kollege", "dem Kollegen", "den Kollegen", "der Kollege"], 1],
      ["Wechselpräpositionen (Wohin? vs. Wo?)", "Er stellt das Buch auf ___ Tisch (m.), aber jetzt liegt es auf ___ Tisch.", ["den ... dem", "dem ... den", "der ... dem", "den ... den"], 0],
      ["Nebensätze mit weil", "Wir bleiben zu Hause, weil es heute stark ___.", ["regnet", "regnen", "geregnet", "ist regnen"], 0],
      ["Reflexive Verben", "Er zieht ___ schnell an und verlässt das Haus.", ["dir", "mich", "sich", "ihn"], 2],
      ["Komparativ & Superlativ", "Ein Auto ist schneller ___ ein Fahrrad, aber das Flugzeug ist am ___.", ["wie ... schnellsten", "als ... schnellsten", "als ... schneller", "wie ... schneller"], 1],
      ["Präteritum der Modalverben", "Als Kind ___ ich sehr gut Klavier spielen.", ["konnte", "kann", "gekonnt", "könnte"], 0],
      ["Dativ-Präpositionen", "Nach ___ Essen (n.) gehen wir im Park spazieren.", ["der", "den", "dem", "das"], 2],
      ["Konditionalsätze mit wenn", "Wenn ich Urlaub ___, fliege ich sofort ans Meer.", ["habe", "hatte", "hätte", "haben"], 0],
      ["Dass-Sätze", "Ich hoffe, dass du die Deutschprüfung ohne Probleme ___.", ["bestehst", "bestanden", "bestehen", "bestehst du"], 0],
    ],
  },
  {
    id: "b1", level: "B1", title: "Teil 3 · Niveau B1",
    description: "Passive voice, hypothetical conditions and complex sentence structures.",
    items: [
      ["Vorgangspassiv im Präsens", "Das alte Rathaus ___ zurzeit von Bauarbeitern ___.", ["wird ... renoviert", "hat ... renoviert", "ist ... renovieren", "wurde ... renovieren"], 0],
      ["Konjunktiv II (irreale Bedingungen)", "Wenn ich mehr Geld ___, ___ ich eine größere Wohnung kaufen.", ["habe ... werde", "hätte ... würde", "hatte ... würde", "hätte ... werde"], 1],
      ["Konzessivsätze mit obwohl", "Sie geht im Park spazieren, obwohl das Wetter sehr schlecht ___.", ["ist", "sind", "sein", "gewesen"], 0],
      ["Relativsätze (Dativ)", "Das ist der Arzt, ___ ich vollkommen vertraue.", ["den", "dem", "der", "dessen"], 1],
      ["Genitiv-Präpositionen", "___ des starken Regens wurde das Fußballspiel nicht abgesagt.", ["Trotz", "Ohne", "Durch", "Für"], 0],
      ["Infinitivkonstruktionen mit um ... zu", "Er spart viel Geld mit dem Ziel, nächstes Jahr nach Japan zu reisen. Ergänzen Sie die Zweckangabe: Er spart viel Geld, ___ nächstes Jahr eine Reise nach Japan ___ machen.", ["für ... zu", "um ... zu", "anstatt ... zu", "ohne ... zu"], 1],
      ["Adjektivdeklination", "Ich habe den neu___ Film gestern im Kino gesehen.", ["-en", "-e", "-er", "-es"], 0],
      ["Finalsätze mit damit", "Der Lehrer erklärt die Grammatik langsam, damit alle Schüler sie ___.", ["verstehen", "zu verstehen", "verstanden", "verstand"], 0],
      ["Infinitiv mit ohne ... zu", "Welche Ergänzung bedeutet „without greeting me“? Er ging an mir vorbei, ___ mich ___ grüßen.", ["um ... zu", "ohne ... zu", "anstatt ... zu", "nicht ... zu"], 1],
      ["Relativsätze mit Präposition", "Das ist die Stadt, in ___ ich geboren wurde.", ["die", "der", "dem", "welchen"], 1],
    ],
  },
];

export const placementTest = {
  title: "Free German Placement Test (A1–B1)",
  subtitle: "Answer 30 short German questions in 20 minutes to see your suggested starting level. No account required.",
  sections: byLevel.map(({ items, ...section }) => ({
    ...section,
    questions: items.map(([topic, text, options, answerIndex], index) => ({
      id: section.id + "-" + (index + 1),
      topic, text, options,
      correct: options[answerIndex],
      answerIndex,
    })),
  })),
};

export const placementQuestions = placementTest.sections.flatMap((section) =>
  section.questions.map((question, index) => ({
    ...question, number: (["A1", "A2", "B1"].indexOf(section.level) * 10) + index + 1,
    level: section.level,
  }))
);

export const buildLevelStats = (sections, answers = {}) =>
  sections.reduce((acc, section) => {
    const correct = section.questions.filter((question) => answers[question.id] === question.correct).length;
    const answered = section.questions.filter((question) => Object.prototype.hasOwnProperty.call(answers, question.id)).length;
    return { ...acc, [section.level]: { correct, answered, total: section.questions.length, ratio: correct / section.questions.length } };
  }, {});

export const getPlacementLevel = (stats) => {
  if ((stats.A1?.correct || 0) < 7 || (stats.A2?.correct || 0) < 7) return "A1";
  return (stats.B1?.correct || 0) >= 7 ? "B1" : "A2";
};

export const getRemainingMs = (startedAt, now = Date.now()) =>
  startedAt ? Math.max(0, PLACEMENT_DURATION_MS - Math.max(0, now - startedAt)) : PLACEMENT_DURATION_MS;

export const formatRemaining = (milliseconds) => {
  const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
};
