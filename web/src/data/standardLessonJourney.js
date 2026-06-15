import b2Day1QuestionWritingBuilder from "./writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
import c1Day2QuestionWritingBuilder from "./writingQuestionBuilders/c1Day2KulturUndIdentitaet";
import c1Day1QuestionWritingBuilder from "./writingQuestionBuilders/c1Day1ZieleUndLernweg";
import c1Day3QuestionWritingBuilder from "./writingQuestionBuilders/c1Day3MedienUndInformationskompetenz";

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const toArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
const firstString = (...values) => values.find((value) => typeof value === "string" && value.trim())?.trim() || "";

const LEVEL_TARGETS = {
  B1: { targetWords: 160, minimums: [20, 25, 25, 30, 30, 30] },
  B2: { targetWords: 200, minimums: [25, 35, 35, 35, 35, 35] },
  C1: { targetWords: 230, minimums: [35, 45, 45, 45, 45] },
};

const HERO_IMAGES = {
  B1: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
  B2: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  C1: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
};

const SPECIAL_WRITING_CONFIGS = {
  "B2-1": b2Day1QuestionWritingBuilder,
  "C1-1": c1Day1QuestionWritingBuilder,
  "C1-2": c1Day2QuestionWritingBuilder,
  "C1-3": c1Day3QuestionWritingBuilder,
};

const defaultStarters = [
  "In der heutigen Zeit ist dieses Thema wichtig, weil ...",
  "Ein wichtiger Grund dafür ist, dass ...",
  "Ein konkretes Beispiel dafür ist ...",
  "Eine andere Möglichkeit wäre, ...",
  "Zusammenfassend lässt sich sagen, dass ...",
];

const defaultSections = [
  "Einleitung und Relevanz",
  "Wichtige Aspekte",
  "Konkretes Beispiel",
  "Andere Perspektive oder Problem",
  "Lösung und Schlussposition",
];

export const getStandardWritingConfig = (lesson = {}) => {
  const level = normalizeLevel(lesson.level);
  const day = Number(lesson.day || 0);
  const special = SPECIAL_WRITING_CONFIGS[`${level}-${day}`];
  if (special) return special;

  const title = lesson.title || lesson.topic || `Tag ${day}`;
  const target = LEVEL_TARGETS[level] || LEVEL_TARGETS.B1;
  const isC1 = level === "C1";
  const isB1 = level === "B1";

  const questions = [
    {
      question: `Warum ist das Thema „${title}“ wichtig oder aktuell?`,
      help: isB1
        ? "Führe kurz in das Thema ein und nenne die wichtigste Situation."
        : "Führe verständlich in das Thema ein und zeige seine Bedeutung.",
    },
    {
      question: `Welche Gründe, Ursachen oder wichtigen Aspekte gehören zu „${title}“?`,
      help: isC1
        ? "Erkläre mindestens zwei Aspekte differenziert und verbinde sie logisch."
        : "Nenne mindestens zwei Gründe oder wichtige Punkte.",
    },
    {
      question: `Welches konkrete Beispiel erklärt das Thema „${title}“ besonders gut?`,
      help: "Nutze eine Situation aus Alltag, Arbeit, Schule, Familie oder Gesellschaft.",
    },
    {
      question: isC1
        ? `Welcher Einwand oder welche alternative Perspektive muss bei „${title}“ berücksichtigt werden?`
        : `Welche andere Möglichkeit, Lösung oder Gegenposition gibt es bei „${title}“?`,
      help: "Zeige, dass du das Thema nicht nur aus einer Perspektive betrachtest.",
    },
    {
      question: `Welche ausgewogene Lösung oder Schlussposition vertrittst du beim Thema „${title}“?`,
      help: isC1
        ? "Verbinde eine tragfähige Lösung mit einem differenzierten abschließenden Urteil."
        : "Nenne eine sinnvolle Lösung und fasse deine Position klar zusammen.",
    },
  ];

  return {
    level,
    day,
    title,
    taskType: lesson.writingTaskType || `${level} guided writing`,
    targetWords: target.targetWords,
    questions: questions.map((item, index) => ({
      id: ["introduction", "reasons", "example", "alternative", "conclusion"][index],
      section: defaultSections[index],
      question: item.question,
      help: item.help,
      starter: defaultStarters[index],
      minimumWords: target.minimums[index],
    })),
    checklist: [
      "Die Einleitung stellt das Thema klar vor.",
      "Ich habe Gründe oder wichtige Aspekte erklärt.",
      "Ich habe ein konkretes Beispiel verwendet.",
      "Ich habe eine Alternative, Lösung oder Gegenposition genannt.",
      "Meine Lösung oder Schlussposition ist nachvollziehbar.",
      `Wortschatz, Satzverbindungen und Grammatik passen zum Niveau ${level}.`,
    ],
  };
};

const parsePlanItem = (item = "", index = 0) => {
  const [rawTitle, ...rest] = String(item).split(":");
  const title = rest.length ? rawTitle.trim() : `Punkt ${index + 1}`;
  const prompt = rest.length ? rest.join(":").trim() : String(item).trim();
  return { title, prompt };
};

export const getStandardBrainMap = (lesson = {}) => {
  const plan = toArray(lesson.speakingBuilder?.plan).filter(Boolean);
  const starters = toArray(lesson.speakingBuilder?.starters).filter(Boolean);

  if (plan.length) {
    return plan.slice(0, 5).map((item, index) => ({
      ...parsePlanItem(item, index),
      starter: starters[index] || defaultStarters[Math.min(index, defaultStarters.length - 1)],
    }));
  }

  const title = lesson.title || lesson.topic || "das Thema";
  return [
    { title: "Thema", prompt: `Was bedeutet „${title}“?`, starter: `Beim Thema „${title}“ geht es um ...` },
    { title: "Eigene Erfahrung", prompt: "Welche persönliche Erfahrung passt dazu?", starter: "In meinem Alltag habe ich erlebt, dass ..." },
    { title: "Gründe", prompt: "Welche zwei Gründe sind wichtig?", starter: "Ein wichtiger Grund ist ..., außerdem ..." },
    { title: "Gegensatz", prompt: "Welche andere Perspektive gibt es?", starter: "Einerseits ..., andererseits ..." },
    { title: "Fazit", prompt: "Was ist deine abschließende Meinung?", starter: "Zusammenfassend denke ich, dass ..." },
  ];
};

const fallbackGrammarLesson = (level, title, focus, goal, instruction) => ({
  title: focus || `${level}-Sprache zum Thema „${title}“`,
  explanation: [
    goal || `In dieser Lektion lernst du, über „${title}“ klar und zusammenhängend zu sprechen und zu schreiben.`,
    instruction || "Verbinde Aussagen mit passenden Konnektoren und ergänze konkrete Beispiele.",
  ],
  rules: level === "B1"
    ? [
        "Formuliere vollständige Hauptsätze und achte auf die Verbposition.",
        "Begründe Aussagen mit weil, denn oder deshalb.",
        "Nutze zuerst, dann, danach und zum Schluss für eine klare Reihenfolge.",
        "Ergänze zu allgemeinen Aussagen ein konkretes Beispiel.",
      ]
    : [
        "Formuliere eine klare Position und begründe sie.",
        "Nutze Nebensätze mit weil, obwohl, während oder damit; das Verb steht am Ende.",
        "Verbinde Folgen mit deshalb, daher oder trotzdem; das Verb steht auf Position zwei.",
        "Zeige mindestens eine alternative Perspektive oder einen Gegensatz.",
        "Ergänze konkrete Beispiele und thematischen Wortschatz.",
      ],
  examples: [
    `Meiner Meinung nach ist „${title}“ wichtig, weil ...`,
    `Ein konkretes Beispiel dafür ist ...`,
    "Einerseits ..., andererseits ...",
    "Zusammenfassend lässt sich sagen, dass ...",
  ],
  miniExercise: `Schreibe vier zusammenhängende Sätze zum Thema „${title}“. Nutze eine Meinung, einen Grund, ein Beispiel und einen Schlusssatz.`,
});

export const buildStandardLessonFromCanonical = (canonicalLesson = {}) => {
  const raw = canonicalLesson.raw || {};
  const level = normalizeLevel(canonicalLesson.level || raw.level || "B1");
  const day = Number(canonicalLesson.day || raw.day || raw.assignmentDay || 0);
  const nested = [...toArray(raw.schreiben_sprechen), ...toArray(raw.lesen_hören)].filter(Boolean);
  const primary = nested[0] || raw;
  const title = canonicalLesson.topic || raw.topic || raw.title || `${level} Tag ${day}`;
  const chapter = canonicalLesson.chapter || raw.chapter || primary.chapter || null;
  const grammarFocus = firstString(raw.grammar_topic, primary.grammar_topic, title);
  const videoResource = canonicalLesson.resources?.aiVideo || canonicalLesson.resources?.teacherVideo || null;

  return {
    level,
    day,
    chapter,
    title,
    topic: raw.goal || raw.instruction || `Über das Thema „${title}“ sprechen und schreiben`,
    heroImage: HERO_IMAGES[level] || HERO_IMAGES.B1,
    videoResource,
    grammarFocus,
    objectives: [
      `Ich kann wichtige Aussagen zum Thema „${title}“ verstehen.`,
      `Ich kann über „${title}“ zusammenhängend sprechen.`,
      `Ich kann einen strukturierten Text auf Niveau ${level} schreiben.`,
    ],
    explanation: [raw.goal, raw.instruction].filter(Boolean),
    grammarLesson: fallbackGrammarLesson(level, title, grammarFocus, raw.goal, raw.instruction),
    speakingTaskType: `${level} guided speaking`,
    speakingTopic: `Sprich über „${title}“. Nenne deine Meinung, Gründe und ein Beispiel.`,
    speakingBuilder: {
      plan: [
        `Einleitung: Stelle das Thema „${title}“ kurz vor.`,
        "Eigene Erfahrung: Beschreibe eine passende Situation.",
        "Gründe: Erkläre zwei wichtige Punkte.",
        "Andere Perspektive: Zeige einen Gegensatz oder eine Alternative.",
        "Schluss: Fasse deine Meinung zusammen.",
      ],
      starters: defaultStarters.slice(0, 5),
    },
    writingTaskType: `${level} guided writing`,
    writingTopic: `Schreibe einen zusammenhängenden Text zum Thema „${title}“. Beantworte die Leitfragen und kombiniere deine Antworten.`,
    writingBuilder: {},
    resources: canonicalLesson.resources || {},
  };
};

export const getStandardLessonStorageKey = (lesson = {}, suffix = "progress") => {
  const level = normalizeLevel(lesson.level || "B1").toLowerCase();
  const day = Number(lesson.day || 0);
  return `falowen:${level}:day${day}:standard-journey:${suffix}`;
};

export const getStandardWritingCloudField = (lesson = {}) => {
  const level = normalizeLevel(lesson.level || "B1");
  const day = Number(lesson.day || 0);
  return `standard${level}Day${day}GuidedWriting`;
};
