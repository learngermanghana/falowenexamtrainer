/**
 * Build an answer-safe, reviewed ChatGPT export from the actual German Exams Room.
 *
 * This is intentionally NOT an alternative question bank. All data comes from
 * the learner-visible Falowen mock catalogue, Sprechen dictionary, Schreiben
 * workspace and the two specifically reviewed A1 reading/listening mock sets.
 * Never copy answer keys, solutions, rubrics, audio keys, image paths, or teacher notes.
 */
import fs from "node:fs";
import { expandedMockContent } from "./chatgptExpandedMockContent.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MOCK_EXAM_CATALOG } from "../web/src/data/mockExamCatalog.js";
import { speakingQuestionDictionary } from "../web/src/data/speakingDictionary.js";
import { EXAM_WRITING_MODULES } from "../web/src/data/examWritingWorkspace.js";
import { A1_MOCK_2_READING, A1_MOCK_2_LISTENING } from "../web/src/data/a1FinalMock2Data.js";
import { A1_MOCK_3_READING, A1_MOCK_3_LISTENING } from "../web/src/data/a1FinalMock3Data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "functions/data/chatgptExamContent.generated.json");
const text = (value, max = 1200) => typeof value === "string" ? value.trim().slice(0, max) : "";
const strings = (values, max = 20, length = 650) =>
  (Array.isArray(values) ? values : []).slice(0, max).map(v => text(v, length)).filter(Boolean);
const origin = "https://www.falowen.app";
const link = route => typeof route === "string" && route.startsWith("/") && !route.startsWith("//")
  ? origin + route : origin + "/exams/mocks";

const safeOption = option => ({
  id: text(option?.id, 20),
  ...(typeof option?.label === "string" ? { label: text(option.label, 180) } : {}),
  ...(typeof option?.title === "string" ? { title: text(option.title, 200) } : {}),
  ...(Array.isArray(option?.lines) ? { lines: strings(option.lines, 12) } : {}),
}).valueOf();

const safeQuestion = question => ({
  number: Number(question?.number),
  statement: text(question?.statement || question?.question, 650),
  ...(question?.text ? { text: Number(question.text) } : {}),
  ...(question?.location ? { location: text(question.location, 200) } : {}),
  ...(Array.isArray(question?.options) ? { options: question.options.slice(0, 5).map(safeOption) } : {}),
  ...(question?.notice ? { notice: {
    heading: text(question.notice.heading, 260),
    lines: strings(question.notice.lines, 12),
  } } : {}),
});

const safePaper = paper => ({
  id: paper?.id,
  ...(paper?.to ? { to: text(paper.to, 80) } : {}),
  ...(paper?.from ? { from: text(paper.from, 80) } : {}),
  ...(paper?.subject ? { subject: text(paper.subject, 180) } : {}),
  ...(paper?.title ? { title: text(paper.title, 180) } : {}),
  lines: strings(paper?.lines, 20),
});

const readingPart = part => ({
  ...(part?.texts ? { texts: part.texts.slice(0, 8).map(safePaper) } : {}),
  ...(part?.sources ? { sources: part.sources.slice(0, 8).map(safePaper) } : {}),
  questions: (part?.questions || []).slice(0, 35).map(safeQuestion),
});

const listeningPart = part => ({
  title: text(part?.title, 80),
  instruction: text(part?.instruction, 450),
  responseInstruction: text(part?.responseInstruction, 450),
  // Do not emit audioObjectKey or a private signed audio link.
  listenInExamRoom: true,
  questions: (part?.questions || []).slice(0, 35).map(safeQuestion),
});

const mocks = Object.values(MOCK_EXAM_CATALOG)
  .filter(item => item?.showInMockLibrary !== false && item?.status === "ready" &&
    ["A1", "A2", "B1", "B2", "C1", "C2"].includes(item.level))
  .map(item => ({
    id: text(item.id, 90),
    mockId: text(item.questionSetId || item.id, 90),
    level: item.level,
    title: text(item.shortTitle || item.title, 180),
    status: "ready",
    mode: text(item.mode, 32),
    sections: strings(item.sections, 6, 40),
    examRoomUrl: link(item.route),
  }));

const speaking = speakingQuestionDictionary
  .filter(item => ["A1","A2","B1","B2","C1","C2"].includes(item?.level))
  .map(item => ({
    id: text(item.id, 130), level: item.level,
    teilId: text(item.teilId, 40), teilLabel: text(item.teilLabel, 80),
    topicPrompt: text(item.topicPrompt, 500), keywordSubtopic: text(item.keywordSubtopic, 260),
    text: text(item.text, 750), hint: text(item.hint, 450),
  }));

const writing = Object.fromEntries(Object.entries(EXAM_WRITING_MODULES).map(([level, module]) => [
  level,
  (module.parts || []).map(part => ({
    id: text(part.id, 40),
    label: text(part.label, 100),
    format: text(part.format, 40),
    targetWords: typeof part.targetWords === "number" ? part.targetWords : text(part.targetWords, 80),
    description: text(part.description, 380),
    tasks: (part.tasks || []).map(task => ({
      id: text(task.id, 130), title: text(task.title, 220),
      situation: text(task.situation, 2400),
      points: strings(task.points, 12, 500),
      category: text(task.category, 120),
      register: text(task.register, 40),
      // The browser's formFields contain grading answers, export only visible labels.
      ...(Array.isArray(task.formFields) ? { formFields: task.formFields.map(field => ({
        key: text(field.key, 60), label: text(field.label, 180),
        ...(field.number ? { number: Number(field.number) } : {}),
        ...(typeof field.fixed === "string" ? { fixed: text(field.fixed, 180) } : {}),
      })) } : {}),
      ...(Array.isArray(task.transformations) ? { transformations: task.transformations.map(row => ({
        source: text(row.source, 420), cue: text(row.cue, 120),
        hint: text(row.hint, 240),
      })) } : {}),
    })),
  })),
]));

const reading = {
  "a1-mock-02": Object.fromEntries(["teil1","teil2","teil3"].map(k => [k, readingPart(A1_MOCK_2_READING[k])])),
  "a1-mock-03": Object.fromEntries(["teil1","teil2","teil3"].map(k => [k, readingPart(A1_MOCK_3_READING[k])])),
};
const listening = {
  "a1-mock-02": Object.fromEntries(["teil1","teil2","teil3"].map(k => [k, listeningPart(A1_MOCK_2_LISTENING[k])])),
  "a1-mock-03": Object.fromEntries(["teil1","teil2","teil3"].map(k => [k, listeningPart(A1_MOCK_3_LISTENING[k])])),
};
const expanded=expandedMockContent();
const publishedIds=new Set(mocks.map(m=>m.mockId));
const onlyPublished=sets=>Object.fromEntries(Object.entries(sets).filter(([id,parts])=>publishedIds.has(id)&&Object.keys(parts).length));
const payload = { version: 2, mocks, speaking, writing,
  reading: {...reading,...onlyPublished(expanded.reading)},
  listening: {...listening,...onlyPublished(expanded.listening)},
  mockWriting:onlyPublished(expanded.mockWriting),mockSpeaking:onlyPublished(expanded.mockSpeaking),
  // Preview papers remain Campus links only, not published exports.
  campusMocks:Object.values(MOCK_EXAM_CATALOG).filter(m=>m.showInMockLibrary!==false &&
    ["A1","A2","B1"].includes(m.level) && ["ready","preview"].includes(m.status))
    .map(m=>({id:m.id,mockId:m.questionSetId||m.id,level:m.level,title:m.shortTitle||m.title,status:m.status,
      mode:m.mode,sections:strings(m.sections,6,40),examRoomUrl:link(m.route)})),
};
const outputText = JSON.stringify(payload, null, 2) + "\n";
// Guard against publishing common grading or private-media field names.
const parsed = JSON.parse(outputText);
const keys = new Set();
const walk = value => {
  if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === "object") Object.entries(value).forEach(([key,val]) => {
    keys.add(key); walk(val);
  });
};
walk(parsed);
const forbidden = ["answer", "answers", "answerKey", "readingAnswerKey", "listeningAnswerKey",
  "correct", "correctOption", "explanation", "rubric", "modelAnswer",
  "audioObjectKey", "transcript", "audioUrl", "signedUrl", "secret"];
for (const field of forbidden) if (keys.has(field)) {
  throw new Error("Sensitive exam field in ChatGPT export: " + field);
}
fs.writeFileSync(output, outputText);
console.log("Generated answer-safe ChatGPT Exams Room content:", {
  mocks: mocks.length, speaking: speaking.length,
  writingTasks: Object.values(writing).flatMap(parts => parts.flatMap(p=>p.tasks)).length,
  readingMocks: Object.keys(reading).length, listeningMocks: Object.keys(listening).length,
});
