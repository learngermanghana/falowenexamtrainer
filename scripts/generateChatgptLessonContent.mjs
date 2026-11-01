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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "functions/data/chatgptLessonContent.generated.json");
const text = (value, length = 1500) => String(value || "").trim().slice(0, length);
const strings = (items, maximum = 20, length = 1500) =>
  (Array.isArray(items) ? items : []).slice(0, maximum).map((v) => text(v, length)).filter(Boolean);

// Explicit allowlists prevent answer keys and unpublished fields being added by future source changes.
const publicQuestions = (items) => (Array.isArray(items) ? items : []).slice(0, 12).map((item) => ({
  question: text(item?.question, 450),
  options: strings(item?.options, 6, 450),
})).filter((item) => item.question);

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
  provenance: "Learner-facing Falowen B2 Course Book data from web/src/data",
  levels: { B2 },
};
const serialized = JSON.stringify(artifact, null, 2) + "\n";
if (serialized.includes('"answerIndex"') || serialized.includes('"sampleAnswer"') ||
    serialized.includes('"starterTemplate"') || serialized.includes('"transcript"')) {
  throw new Error("Private answer field leaked into student lesson export");
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, serialized, "utf8");
process.stdout.write("Generated 28 B2 ChatGPT student lessons (" + Buffer.byteLength(serialized) + " bytes)\n");
