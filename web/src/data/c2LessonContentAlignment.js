import { getC2ExamStandard } from "./c2ExamStandardContent";
import { getC2TopicKnowledge, getC2TopicCollocations, getC2TopicChecks } from "./c2TopicKnowledge";

const DAYS = Array.from({ length: 28 }, (_, index) => index + 1);

const buildCurrentC2Mastery = (day) => {
  const dayNumber = Number(day);
  const standard = getC2ExamStandard(dayNumber);
  const knowledge = getC2TopicKnowledge(dayNumber);
  if (!standard || !knowledge) return null;

  const checks = getC2TopicChecks(dayNumber);
  const grammarExamples = Array.isArray(standard.grammar) ? standard.grammar.slice(1) : [];
  const primaryCheck = checks[0] || {};
  const reformulations = Array.isArray(standard.reformulations) ? standard.reformulations : [];
  const modelAnswer = [
    grammarExamples[0],
    knowledge.coll?.[0]?.[1],
    standard.perspectives?.[0],
  ].filter(Boolean).join(" ");

  return {
    day: dayNumber,
    chapter: knowledge.chapter,
    title: standard.title,
    topic: standard.topic,
    grammarFocus: standard.grammarFocus,
    objectives: [
      `das Thema „${standard.title}“ inhaltlich erklären`,
      "zentrale Akteure, Interessen und Zielkonflikte benennen",
      `${standard.grammarFocus} funktional und präzise einsetzen`,
      "themenspezifischen Wortschatz und natürliche Kollokationen verwenden",
    ],
    vocabulary: knowledge.vocab,
    collocationTopic: standard.title,
    collocations: getC2TopicCollocations(dayNumber),
    contrast: grammarExamples,
    nuance: {
      q: primaryCheck.question || knowledge.core,
      o: primaryCheck.options || [knowledge.core],
      a: Number.isInteger(primaryCheck.answerIndex) ? primaryCheck.answerIndex : 0,
      e: primaryCheck.explanation || "",
    },
    reformulation: reformulations.length
      ? [reformulations[0]?.source, reformulations[0]?.model]
      : [grammarExamples[0] || standard.topic, grammarExamples[1] || standard.perspectives?.[0]],
    production: standard.writeType === "opinion"
      ? `Nimm differenziert Stellung zu „${standard.title}“ und beziehe die drei Perspektiven ein.`
      : `Bereite die Umformungsaufgabe zu „${standard.title}“ vor, ohne die Prüfungsantworten vorwegzunehmen.`,
    challenge: `Erkläre zuerst die Kernfrage „${knowledge.core}“. Nenne mindestens einen Zielkonflikt und entwickle anschließend eine C2-Position mit ${standard.grammarFocus}.`,
    topicKnowledge: knowledge,
    perspectives: standard.perspectives,
    writeType: standard.writeType,
    grammarNotes: {
      title: standard.grammarFocus,
      usage: standard.grammar?.[0] || `Use ${standard.grammarFocus} only when it makes the intended meaning more precise.`,
      wordOrder: "Build the meaning first, then control verb position, case, reference and information hierarchy. Complexity is useful only when the relationship remains immediately clear.",
      examples: grammarExamples,
      commonMistakes: [
        `Do not use ${standard.grammarFocus} merely to sound advanced; the structure must match the intended logical function.`,
      ],
    },
    grammarChecks: [
      ...checks,
      ...(grammarExamples.length >= 2 ? [{
        question: `Welche Formulierung zeigt ${standard.grammarFocus} am kontrolliertesten?`,
        options: grammarExamples,
        answerIndex: grammarExamples.length - 1,
        explanation: "Choose the version because it expresses the intended relation, evidence level or register precisely—not simply because it is longer.",
      }] : []),
    ],
    writingExercise: {
      prompt: standard.writeType === "opinion"
        ? `Verfassen Sie eine differenzierte Stellungnahme zu „${standard.title}“.`
        : `Bearbeiten Sie die Umformungsaufgabe zu „${standard.title}“.`,
      planningPrompt: knowledge.core,
      modelAnswer,
    },
  };
};

const C2_CANONICAL_MASTERY = Object.freeze(
  Object.fromEntries(DAYS.map((day) => [day, Object.freeze(buildCurrentC2Mastery(day))])),
);

// Kept as a compatibility export. All current-course collocations now come
// directly from c2TopicKnowledge rather than a second legacy supplement table.
const C2_COLLOCATION_SUPPLEMENTS = Object.freeze(
  Object.fromEntries(DAYS.map((day) => [day, []])),
);

const getCanonicalC2Mastery = (day) => C2_CANONICAL_MASTERY[Number(day)] || null;
const getCurrentCourseMasteryOverride = (day) => getCanonicalC2Mastery(day);

const enhanceC2Mastery = (day, source = null) => {
  const mastery = getCanonicalC2Mastery(day);
  if (!mastery) return source || null;
  return { ...source, ...mastery };
};

const C2_LESSON_CONTENT_ALIGNMENT = C2_CANONICAL_MASTERY;
const getC2LessonContentAlignment = (day) => C2_LESSON_CONTENT_ALIGNMENT[Number(day)] || null;

const alignC2CurriculumEntry = (entry = {}) => {
  const level = String(entry.level || "").trim().toUpperCase();
  if (level !== "C2") return entry;
  const mastery = getC2LessonContentAlignment(entry.day ?? entry.assignmentDay);
  if (!mastery) return entry;

  return {
    ...entry,
    chapter: mastery.chapter,
    title: mastery.title,
    topic: mastery.title,
    lessonTitle: mastery.title,
    assignmentTitle: mastery.title,
    lessonTopic: mastery.topic,
    grammar_topic: mastery.grammarFocus,
    grammarFocus: mastery.grammarFocus,
    c2Mastery: mastery,
    collocations: mastery.collocations,
    grammarNotes: mastery.grammarNotes,
    grammarChecks: mastery.grammarChecks,
    writingExercise: mastery.writingExercise,
  };
};

const alignC2CurriculumEntries = (entries = []) => entries.map((entry) => alignC2CurriculumEntry(entry));

const alignC2SelfLearningLesson = (lesson = {}) => {
  if (String(lesson.level || "").toUpperCase() !== "C2") return lesson;
  const mastery = getC2LessonContentAlignment(lesson.day);
  if (!mastery) return lesson;
  return { ...lesson, ...mastery, c2Mastery: mastery };
};

export {
  C2_CANONICAL_MASTERY,
  C2_COLLOCATION_SUPPLEMENTS,
  C2_LESSON_CONTENT_ALIGNMENT,
  getCanonicalC2Mastery,
  getCurrentCourseMasteryOverride,
  getC2LessonContentAlignment,
  enhanceC2Mastery,
  alignC2CurriculumEntry,
  alignC2CurriculumEntries,
  alignC2SelfLearningLesson,
};
