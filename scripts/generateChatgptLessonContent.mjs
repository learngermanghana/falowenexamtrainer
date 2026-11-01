/**
 * Build a small, server-readable copy of the existing student-facing B2 Course Book.
 *
 * Source of truth remains web/src/data; don't add a parallel teaching curriculum.
 * No grading answer indexes, model answers, hidden teacher notes, audio transcripts,
 * student records or API keys are exported.
 *
 * This runs during Vercel's existing prebuild, and explicitly in the companion CI.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { B2_LESSON_CONTENT_ALIGNMENT } from "../web/src/data/b2LessonContentAlignment.js";
import { B2_GRAMMAR_EXPLANATIONS } from "../web/src/data/b2GrammarExplanations.js";
import { B2_TOPIC_COLLOCATIONS } from "../web/src/data/b2TopicCollocations.js";
import { B2_READING_PRACTICE } from "../web/src/data/b2ReadingPractice.js";
import { B2_LISTENING_PRACTICE } from "../web/src/data/b2ListeningPractice.js";
import { B2_WRITING_TASKS } from "../web/src/data/b2WritingTasks.js";
import { B2_REVIEW_KEY_POINTS } from "../web/src/data/b2ReviewKeyPoints.js";
import { getB2SkillFocus, getB2DayTabs } from "../web/src/data/b2SkillCycle.js";
import { B1_READING_TASKS } from "../web/src/data/b1ReadingTasks.js";
import { A1_ASSIGNMENT_REGISTRY } from "../web/src/data/a1AssignmentRegistry.js";
import { A1_GRAMMAR_ROUTE_ENTRIES } from "../web/src/data/a1GrammarRoutes.js";
import { A2_GRAMMAR_ROUTE_ENTRIES } from "../web/src/data/a2GrammarRoutes.js";
import { A2_READING_TASKS } from "../web/src/data/a2ReadingTasks.js";
import { A2_LISTENING_TASKS, A2_LISTENING_MODES } from "../web/src/data/a2ListeningTasks.js";
import { A2_REQUIRED_WRITING_DAYS } from "../web/src/data/a2WritingSchedule.js";
import { B1_WRITING_TASKS } from "../web/src/data/b1WritingTasks.js";
import curriculumManifest from "../functions/data/curriculumManifest.js";
import { extractGrammarTeaching, grammarComponentPaths } from "./extractFalowenGrammar.mjs";
import { loadWorkbookSource, extractLiteralQuestions, extractLiteralParagraphs, extractA1Day3Reading } from "./extractFalowenWorkbook.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "functions/data/chatgptLessonContent.generated.json");
const grammarSources = grammarComponentPaths(root);
const text = (value, length = 1500) => String(value || "").trim().slice(0, length);
const strings = (items, maximum = 20, length = 1500) =>
  (Array.isArray(items) ? items : []).slice(0, maximum).map((v) => text(v, length)).filter(Boolean);

// Explicit allowlists prevent answer keys and unpublished fields being added by future source changes.
const publicQuestions = (items) => (Array.isArray(items) ? items : []).slice(0, 12).map((item) => ({
  question: text(item?.question || item?.stem, 450),
  options: strings(item?.options, 6, 450),
})).filter((item) => item.question);



// A1 is a chapter-based course; one day may contain multiple assignments.
// Export each actual workbook chapter and its exact section labels. Never
// reassign a chapter to another day or invent a textbook exercise.
const A1 = {};
const a1Entries = curriculumManifest.getCurriculumEntriesForLevel("A1");
for (const day of [...new Set(a1Entries.map((entry) =>
  Number(entry.day ?? entry.assignmentDay ?? entry.displayDay)).filter((n) =>
    Number.isInteger(n) && n >= 1 && n <= 50))].sort((a, b) => a - b)) {
  const source = a1Entries.filter((entry) =>
    Number(entry.day ?? entry.assignmentDay ?? entry.displayDay) === day);
  const primary = source.find((entry) => entry.submissionRequired) || source[0];
  const assignments = Object.values(A1_ASSIGNMENT_REGISTRY).filter((entry) => Number(entry.day) === day);
  const grammarRoutes = A1_GRAMMAR_ROUTE_ENTRIES.filter((entry) => Number(entry.day) === day);
  A1[String(day)] = {
    level: "A1", day,
    chapter: text(primary?.chapter || assignments[0]?.chapter, 20),
    title: text(primary?.title || primary?.topic || assignments[0]?.title, 230),
    topic: text(primary?.topic || primary?.title || assignments[0]?.title, 250),
    goal: text(primary?.goal || assignments[0]?.title, 650),
    grammarFocus: text(primary?.grammar_topic || primary?.grammarFocus, 320),
    skillFocus: "guided",
    campusTabs: ["Overview", "Workbook", "Music (optional)", "Submit (tutor-marked work)"],
    // This is a table of contents, not a promise the full JSX text is available.
    workbook: {
      chapters: assignments.map((entry) => ({
        chapter: text(entry.chapter, 25),
        title: text(entry.title, 240),
        assignmentId: text(entry.assignmentKey, 40),
        route: text(entry.workbookRoute, 400),
        sections: entry.sections.map((section) => text(section.label, 130)),
        tutorSubmissionRequired: true,
      })),
      source: "Falowen A1 canonical tutor-marked workbook registry",
    },
    grammar: {
      focus: text(primary?.grammar_topic || primary?.grammarFocus, 320),
      noteLinks: grammarRoutes.map((entry) => ({
        chapter: text(entry.chapter, 25), url: text(entry.route, 400),
      })),
      fullExplanationIncluded: false,
    },
  };
}

// The original A1 Day 1 workbook has literal text and questions. Extract only
// its learner-visible data, not its React UI, marking keys or state.
function extractA1Day1(source) {
  const reading = source.match(/<strong>Text:<\/strong>\s*([^<]+)<\/p>/);
  const translation = source.match(/<strong>Translation:<\/strong>\s*([^<]+)<\/p>/);
  const literal = source.match(/const questions = (\[[\s\S]*?\n\]);/);
  if (!reading || !literal) throw new Error("A1 Day 1 source reading has changed; review the exporter");
  const raw = literal[1].replace(/(\bstem|\btranslation|\boptions)\s*:/g, '"$1":')
    .replace(/,\s*([}\]])/g, "$1");
  const questions = JSON.parse(raw);
  if (questions.length !== 10 || !reading[1].startsWith("Guten Morgen! Wie geht es dir?")) {
    throw new Error("A1 Day 1 source content drifted; review the exporter");
  }
  return {
    title: "Teil 1 · Reading Text",
    paragraphs: [text(reading[1], 1900)],
    translation: text(translation?.[1], 1900),
    questions: questions.map((question) => ({
      question: text(question.stem, 350),
      translation: text(question.translation, 350),
      options: strings(question.options, 5, 250),
    })),
  };
}
const a1Day1Workbook = fs.readFileSync(
  path.join(root, "web/src/components/A1Day1GreetingsWorkbookPage.js"), "utf8"
);
if (!A1["1"]) throw new Error("Canonical A1 Day 1 lesson missing");
A1["1"].reading = extractA1Day1(a1Day1Workbook);
// Source-literal exercises from the original tutor workbooks, without answers.
if (!A1["2"] || !A1["3"]) throw new Error("A1 canonical Day 2/3 missing");
const a1Day2 = loadWorkbookSource(path.join(root, "web/src/components/A1Day2Kapitel11WorkbookPage.js"));
A1["2"].listening = {
  title: "Kapitel 1.1 · Teil 1 Hören", chapter: "1.1",
  task: "Watch and listen to the original video on introducing yourself and a friend.",
  audioAvailableInCampus: true, mediaUrl: "https://youtu.be/nih5h7B48NY",
  questions: extractLiteralQuestions(a1Day2, "questions", 4),
};
A1["2"].writing = {
  chapter: "1.1", prompt: "Write a short text introducing yourself.",
  instructions: [
    "Include your name, where you come from, where you live, a greeting and a farewell.",
    "Submit your final writing and listening answers through the A1-1.1 Campus workbook.",
  ],
};
const a1Day3 = loadWorkbookSource(path.join(root, "web/src/components/A1Day3PronounsIntroducingYourselfWorkbookPage.js"));
A1["3"].reading = extractA1Day3Reading(a1Day3);
A1["3"].listening = {
  title: "Kapitel 1.2 · Teil 3 Hören", chapter: "1.2",
  audioAvailableInCampus: true, mediaUrl: "https://youtu.be/3p-Vl1HsOok",
  questions: extractLiteralQuestions(a1Day3, "multipleChoiceQuestions", 5),
};
A1["3"].writing = {
  chapter: "1.2", prompt: "Introduce yourself in a short paragraph.",
  instructions: [
    "Include your name, where you come from, where you live and a greeting.",
    "Submit your original work through the Falowen Campus workbook A1-1.2.",
  ],
};

const A2 = {};
const a2Entries = curriculumManifest.getCurriculumEntriesForLevel("A2");
for (let day = 1; day <= 28; day += 1) {
  const entries = a2Entries.filter((entry) =>
    Number(entry.day ?? entry.assignmentDay ?? entry.displayDay) === day);
  const lesson = entries.find((entry) => entry.submissionRequired) || entries[0];
  if (!lesson) throw new Error("A2 canonical lesson missing for day " + day);
  const reading = A2_READING_TASKS[day];
  if (!reading?.text || !Array.isArray(reading.questions) || !reading.questions.length) {
    throw new Error("A2 reading passage missing for day " + day);
  }
  const listening = A2_LISTENING_TASKS[day];
  const grammarLink = A2_GRAMMAR_ROUTE_ENTRIES.find((entry) => Number(entry.day) === day);
  const writingRequired = A2_REQUIRED_WRITING_DAYS.includes(day);
  const originalGrammar = extractGrammarTeaching(grammarSources.A2[day]);
  A2[String(day)] = {
    level: "A2", day, chapter: text(lesson.chapter || reading.chapter, 25),
    title: text(lesson.title || lesson.topic, 240),
    topic: text(lesson.topic || lesson.title, 240),
    goal: text(lesson.goal, 750),
    grammarFocus: text(lesson.grammar_topic || lesson.grammarFocus, 320),
    skillFocus: "lesen_hoeren",
    campusTabs: ["Grammar", "Sprechen", ...(writingRequired ? ["Schreiben"] : []),
      "Lesen", ...(listening && listening.mode !== A2_LISTENING_MODES.NONE ? ["Hören"] : []), "Submit"],
    instruction: text(lesson.instruction, 800),
    reading: {
      title: text(reading.title, 240), format: text(reading.format, 130),
      strategy: text(reading.strategy, 600), text: text(reading.text, 5500),
      questions: publicQuestions(reading.questions),
    },
    grammar: {
      focus: text(lesson.grammar_topic || lesson.grammarFocus, 320),
      notesUrl: text(grammarLink?.route || lesson.grammarPage, 450),
      ...originalGrammar,
    },
    ...(listening && listening.mode !== A2_LISTENING_MODES.NONE ? { listening: {
      task: text(listening.task, 950), mode: text(listening.mode, 50),
      audioAvailableInCampus: Boolean(listening.audioUrl || listening.audioKey),
      mediaUrl: /^https:\/\/(youtu\.be|(?:www\.)?youtube\.com)\//i.test(text(listening.audioUrl))
        ? text(listening.audioUrl, 500) : null,
      questions: publicQuestions(listening.questions),
    } } : {}),
    ...(writingRequired ? { writing: {
      requiredInCampus: true,
      instructions: [text(lesson.instruction, 800)].filter(Boolean),
      clarification: "This is a Course Book submission requirement. The full writing prompt may be in the Campus workbook; no missing prompt is invented.",
    } } : {}),
  };
}

// B1 Day 1's preserved reading is authored directly in the React workbook.
// Extract its *literal* paragraph and question text at build time. Fail closed
// on markup changes rather than silently sending model-generated exercises.
const firstB1Workbook = fs.readFileSync(
  path.join(root, "web/src/components/B1Day1TraumweltWorkbookPage.js"), "utf8"
);
function extractB1Day1Reading(source) {
  const section = source.match(
    /<h3 style=\{sectionTitle\}>(Traumdeutung und ihre Bedeutung)<\/h3>([\s\S]*?)<h3 style=\{sectionTitle\}>Questions<\/h3>/
  );
  if (!section) throw new Error("B1 Day 1 original Lesen section not found; review workbook markup");
  const paragraphs = [...section[2].matchAll(/<p style=\{\{ margin: 0, lineHeight: 1\.7 \}\}>\s*([^<]+?)\s*<\/p>/g)]
    .map((x) => text(x[1], 2400));
  const literal = source.match(/const lesenQuestions = (\[[\s\S]*?\n\]);/);
  if (!literal) throw new Error("B1 Day 1 source reading questions not found");
  // Only literal arrays containing stem and options are permitted.
  const json = literal[1].replace(/(\bstem|\boptions)\s*:/g, '"$1":')
    .replace(/,\s*([}\]])/g, "$1");
  const questions = JSON.parse(json);
  if (paragraphs.length !== 5 || questions.length !== 7 ||
      !paragraphs[0].startsWith("Träume faszinieren die Menschheit") ||
      questions[0].stem !== "Was glaubten die Menschen in der Antike über Träume?") {
    throw new Error("B1 Day 1 Lesen content drifted; review extraction before publishing");
  }
  return { title: section[1], paragraphs, questions: publicQuestions(questions) };
}

const B1 = {};
const b1Entries = curriculumManifest.getCurriculumEntriesForLevel("B1");
const b1Day2 = loadWorkbookSource(path.join(root, "web/src/components/B1Day2FreundeFuersLebenWorkbookPage.js"));
const b1Day2Reading = {
  title: "Essay: Was bedeutet es, ein wahrer Freund zu sein?",
  paragraphs: extractLiteralParagraphs(b1Day2,
    "Freundschaft ist eine der wichtigsten Beziehungen", 7),
  questions: extractLiteralQuestions(b1Day2, "lesenQuestions", 7),
};
for (let day = 1; day <= 28; day += 1) {
  const lesson = b1Entries.find((x) => Number(x.day ?? x.assignmentDay) === day);
  if (!lesson) throw new Error("Missing canonical B1 lesson day " + day);
  const task = B1_READING_TASKS[day] || null;
  const workbookReading = task?.text;
  const reading = day === 1
    ? extractB1Day1Reading(firstB1Workbook)
    : day === 2 ? b1Day2Reading
    : workbookReading && Array.isArray(workbookReading.paragraphs) &&
      Array.isArray(workbookReading.questions) && workbookReading.paragraphs.length &&
      workbookReading.questions.length
      ? {
        title: text(workbookReading.title, 250),
        paragraphs: strings(workbookReading.paragraphs, 12, 2400),
        questions: publicQuestions(workbookReading.questions),
      }
      : null;
  const writing = B1_WRITING_TASKS[day] || null;
  const originalGrammar = extractGrammarTeaching(grammarSources.B1[day]);
  B1[String(day)] = {
    level: "B1", day,
    chapter: text(lesson.chapter || lesson.displayChapter, 20),
    title: text(lesson.title || "B1 Day " + day, 230),
    topic: text(lesson.title, 230),
    goal: text(lesson.goal, 650),
    grammarFocus: text(lesson.grammar_topic || lesson.grammarFocus, 260),
    skillFocus: "lesen_hoeren",
    campusTabs: ["Grammar", "Sprechen", "Schreiben", "Lesen", "Hören", "Submit"],
    grammar: {
      focus: text(lesson.grammar_topic || lesson.grammarFocus, 320),
      ...originalGrammar,
    },
    ...(reading ? { reading: {
      ...reading,
      instructions: text(task?.instructions, 700),
      submissionNote: text(task?.submissionNote, 500),
    }} : {}),
    ...(writing ? { writing: {
      type: "B1 Schreiben",
      prompt: text(writing.title, 700),
      instructions: [text(writing.instructions, 1600), text(writing.submissionNote, 700)].filter(Boolean),
    } } : {}),
  };
}

const B2 = {};
for (let day = 1; day <= 28; day += 1) {
  const plan = B2_LESSON_CONTENT_ALIGNMENT[day];
  if (!plan || Number(plan.day) !== day) throw new Error("Missing B2 source alignment for day " + day);
  const grammar = B2_GRAMMAR_EXPLANATIONS[day] || null;
  const collocations = B2_TOPIC_COLLOCATIONS[day] || [];
  const reading = B2_READING_PRACTICE[day] || null;
  const listening = B2_LISTENING_PRACTICE[day] || null;
  const writing = B2_WRITING_TASKS[day] || null;
  const review = B2_REVIEW_KEY_POINTS[day] || [];
  const skill = getB2SkillFocus(day);
  const tabs = getB2DayTabs(day);

  if (!grammar?.sections?.length || !collocations.length || !review.length) {
    throw new Error("Incomplete B2 student lesson material for day " + day);
  }
  const item = {
    level: "B2",
    day,
    chapter: text(plan.chapter, 20),
    title: text(plan.title, 240),
    topic: text(plan.lessonTopic, 350),
    goal: text(plan.goal, 700),
    grammarFocus: text(plan.grammar_topic, 260),
    skillFocus: skill,
    campusTabs: tabs.map((tab) => text(tab.label, 70)),
    vocabulary: collocations.slice(0, 16).map(([expression, meaning, example, preposition, caseName]) => ({
      expression: text(expression, 180),
      meaning: text(meaning, 240),
      example: text(example, 350),
      ...(preposition ? { preposition: text(preposition, 40) } : {}),
      ...(caseName ? { grammaticalCase: text(caseName, 60) } : {}),
    })),
    grammar: {
      introduction: text(grammar.introduction, 2000),
      sections: grammar.sections.slice(0, 8).map((section) => ({
        title: text(section.title, 240),
        explanation: text(section.explanation, 1500),
        formation: text(section.formation, 1000),
        commonMistake: text(section.mistake, 1000),
        example: text(section.sentence, 700),
        analysis: text(section.analysis, 1100),
      })),
      task: text(grammar.task, 1100),
      checks: publicQuestions(grammar.checks),
    },
    ...(reading ? { reading: {
      title: text(reading.title, 250),
      paragraphs: strings(reading.paragraphs, 8, 1800),
      questions: publicQuestions(reading.questions),
    } } : {}),
    ...(listening ? { listening: {
      title: text(listening.title, 250),
      audioAvailableInCampus: Boolean(listening.audioKey),
      vocabulary: (Array.isArray(listening.vocabulary) ? listening.vocabulary : []).slice(0, 14)
        .map((v) => ({ german: text(v.de, 130), english: text(v.en, 250) })),
      questions: publicQuestions(listening.questions),
      // Do NOT copy the transcript; learners should attempt Hören from audio.
    } } : {}),
    ...(writing ? { writing: {
      type: text(writing.taskType, 120),
      prompt: text(writing.lead, 1100),
      instructions: strings(writing.bullets, 8, 450),
      minimumWords: Number(writing.minimumWords) || null,
      note: text(writing.note, 1000),
    } } : {}),
    review: strings(review, 8, 900),
  };
  B2[String(day)] = item;
}

const grammarCoverage = Object.fromEntries(["A2", "B1"].map((level) => [level,
  Object.values(level === "A2" ? A2 : B1).filter((entry) => entry.grammar?.fullExplanationIncluded).length]));
if (grammarCoverage.A2 < 20 || grammarCoverage.B1 < 20) {
  throw new Error("Insufficient actual grammar pages exported: " + JSON.stringify(grammarCoverage));
}
const artifact = {
  schemaVersion: 1,
  provenance: "Learner-facing Falowen Course Book content compiled from canonical workbook and lesson sources",
  levels: { A1, A2, B1, B2 },
};
const serialized = JSON.stringify(artifact, null, 2) + "\n";
if (serialized.includes('"answerIndex"') || serialized.includes('"sampleAnswer"') ||
    serialized.includes('"starterTemplate"') || serialized.includes('"transcript"')) {
  throw new Error("Private answer field leaked into student lesson export");
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, serialized, "utf8");
process.stdout.write("Generated A1–B2 student lessons and original grammar teaching " + JSON.stringify(grammarCoverage) + " (" + Buffer.byteLength(serialized) + " bytes)\n");
