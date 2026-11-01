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
import { B1_WRITING_TASKS } from "../web/src/data/b1WritingTasks.js";
import { getCurriculumEntriesForLevel } from "../functions/data/curriculumManifest.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "functions/data/chatgptLessonContent.generated.json");
const text = (value, length = 1500) => String(value || "").trim().slice(0, length);
const strings = (items, maximum = 20, length = 1500) =>
  (Array.isArray(items) ? items : []).slice(0, maximum).map((v) => text(v, length)).filter(Boolean);

// Explicit allowlists prevent answer keys and unpublished fields being added by future source changes.
const publicQuestions = (items) => (Array.isArray(items) ? items : []).slice(0, 12).map((item) => ({
  question: text(item?.question || item?.stem, 450),
  options: strings(item?.options, 6, 450),
})).filter((item) => item.question);


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
const b1Entries = getCurriculumEntriesForLevel("B1");
for (let day = 1; day <= 28; day += 1) {
  const lesson = b1Entries.find((x) => Number(x.day ?? x.assignmentDay) === day);
  if (!lesson) throw new Error("Missing canonical B1 lesson day " + day);
  const task = B1_READING_TASKS[day] || null;
  const workbookReading = task?.text;
  const reading = day === 1
    ? extractB1Day1Reading(firstB1Workbook)
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
  B1[String(day)] = {
    level: "B1", day,
    chapter: text(lesson.chapter || lesson.displayChapter, 20),
    title: text(lesson.title || "B1 Day " + day, 230),
    topic: text(lesson.title, 230),
    goal: text(lesson.goal, 650),
    grammarFocus: text(lesson.grammar_topic || lesson.grammarFocus, 260),
    skillFocus: "lesen_hoeren",
    campusTabs: ["Grammar", "Sprechen", "Schreiben", "Lesen", "Hören", "Submit"],
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

const artifact = {
  schemaVersion: 1,
  provenance: "Learner-facing Falowen Course Book content compiled from canonical workbook and lesson sources",
  levels: { B1, B2 },
};
const serialized = JSON.stringify(artifact, null, 2) + "\n";
if (serialized.includes('"answerIndex"') || serialized.includes('"sampleAnswer"') ||
    serialized.includes('"starterTemplate"') || serialized.includes('"transcript"')) {
  throw new Error("Private answer field leaked into student lesson export");
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, serialized, "utf8");
process.stdout.write("Generated 28 B1 + 28 B2 ChatGPT student lesson records (" + Buffer.byteLength(serialized) + " bytes)\n");
