"use strict";

// This file consumes an explicitly allowlisted, build-generated export of
// learner-visible German Exams Room questions. Never read raw answer-key sources
// in a student-facing MCP tool.
let CONTENT = null;
try {
  CONTENT = require("../data/chatgptExamContent.generated.json");
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
}
const SITE = "https://www.falowen.app";
const text = value => typeof value === "string" ? value.trim() : "";
const clamp = (value, fallback = 5) => Number.isInteger(value) ? Math.max(1, Math.min(10, value)) : fallback;
const normalizePart = value => {
  const raw = text(value).toLowerCase().replace(/[\s_-]/g, "");
  return /^(?:teil|t|part)?[1-5]$/.test(raw) ? "teil" + raw.slice(-1) : "";
};
function listMyExamMocks(level) {
  const mocks = (CONTENT?.mocks || []).filter(mock => mock.level === level).map(mock => {
    const supported = [];
    if (["a1-mock-02", "a1-mock-03", "a2-mock-02"].includes(mock.mockId) || CONTENT?.mockWriting?.[mock.mockId]) supported.push("writing");
    if (["a1-mock-02", "a1-mock-03", "a2-mock-02"].includes(mock.mockId) || CONTENT?.mockSpeaking?.[mock.mockId]) supported.push("speaking");
    if (CONTENT?.reading?.[mock.mockId]) supported.push("reading");
    if (CONTENT?.listening?.[mock.mockId]) supported.push("listening");
    return { ...mock, practiceUrl:mock.examRoomUrl+"?mode=practice", chatGPTPracticeSkills: supported, source: "Falowen Exams Room published catalogue" };
  });
  return {
    available: mocks.length > 0, level, mocks,
    officialExamSubmissionInChatGPT: false,
    clarification: "The catalogue lists published German Exams Room mocks. A listed mock without exported ChatGPT questions links to Campus; do not invent prompts or imply it can be completed in ChatGPT. Writing and speaking dictionary drills are separate practice, and private Hören audio must be played in the signed-in Exams Room.",
  };
}
function getMyExamDictionary(level, category, args = {}) {
  if (!CONTENT || !["speaking", "writing"].includes(category)) return {
    available: false, message: "This dictionary is not available in the approved German Exams Room export.",
  };
  const query = text(args.query).toLocaleLowerCase("de").slice(0, 100);
  const taskId = text(args.taskId).slice(0, 130);
  const part = normalizePart(args.part);
  const limit = clamp(args.limit);
  if (args.part && !part) return { available: false, message: "Invalid exam part." };
  const all = category === "speaking" ? CONTENT.speaking.filter(x => x.level === level) :
    (CONTENT.writing?.[level] || []).flatMap(section => section.tasks.map(item => ({
      ...item, level, teilId: section.id, teilLabel: section.label,
      format: section.format, targetWords: section.targetWords,
    })));
  // The exact task ID is the stable source-owned selector. Search is bounded.
  const filtered = all.filter(item => (!part || normalizePart(item.teilId) === part) &&
    (!taskId || item.id === taskId) &&
    (!query || [item.id, item.title, item.situation, item.topicPrompt,
      item.keywordSubtopic, item.text].some(value => text(value).toLocaleLowerCase("de").includes(query))));
  return {
    available: filtered.length > 0, level, category, totalMatches: filtered.length,
    items: filtered.slice(0, taskId ? 1 : limit),
    practiceOnly: true, officialResult: false,
    clarification: filtered.length ? "These are the original learner-visible Falowen Exams Room dictionary prompts. Ask one at a time, wait for the student, then provide conversational feedback. Do not assign an official score or submit an exam."
      : "No matching learner-facing dictionary task exists for this course or filter.",
  };
}
function getMyMockObjectivePractice(level, mockId, skill, part, questionNumber) {
  if (!["reading", "listening"].includes(skill)) return null;
  const selected = CONTENT?.[skill]?.[mockId];
  const mock = (CONTENT?.mocks || []).find(x => x.mockId === mockId && x.level === level);
  if (!selected || !mock) return {
    available: false, message: "This published mock has not yet received a reviewed, answer-safe " +
      (skill === "reading" ? "Lesen" : "Hören") + " export for ChatGPT. Open the Exams Room instead.",
  };
  const chosenPart = normalizePart(part || "teil1");
  if (!chosenPart || !selected[chosenPart]) return { available: false, message: "The requested mock exam part is not exported." };
  const section = selected[chosenPart];
  const question = Number.isInteger(questionNumber)
    ? section.questions.find(q => q.number === questionNumber)
    : section.questions[0];
  if (!question) return { available: false, message: "No such question number in the selected exam part." };
  const result = {
    available: true, level, mockId, skill, part: chosenPart,
    question, questionNumbers: section.questions.map(q => q.number),
    practiceOnly: true, officialResult: false, examRoomUrl: mock.examRoomUrl+"?mode=practice",
    source: "Falowen Exams Room learner-visible approved mock",
  };
  if (skill === "reading") {
    const relevantText = section.texts
      ? section.texts.filter(p => p.id === question.text)
      : undefined;
    result.passage = question.contextLines?.length ? question.contextLines : section.contextLines?.length ? section.contextLines : relevantText?.length ? relevantText : undefined;
    result.instruction = section.instruction;
    result.sources = section.sources || undefined;
    // For tasks with contextual choices (e.g. Mock 3), the question itself
    // contains its answer-safe options; never include hidden solutions.
    result.choices = question.options?.length ? question.options : chosenPart === "teil2" ? [
      { id: "a", label: "Text A" }, { id: "b", label: "Text B" },
    ] : [{ id: "richtig", label: "Richtig" }, { id: "falsch", label: "Falsch" }];
    result.instructions = "Present the relevant source text and this question. Ask for the learner's answer before giving reasoning-based feedback. Do not claim to know an official hidden answer key.";
  } else {
    if (question.options?.length) result.choices = question.options;
    result.instruction = section.instruction;
    result.responseInstruction = section.responseInstruction;
    result.audioLinkPolicy = "Open the authenticated examRoomUrl and play the corresponding Hören part there. ChatGPT does not receive the private R2 recording, a transcript, or a direct audio URL.";
    result.instructions = "Have the learner listen to Falowen's official recording in Exams Room, then answer this original question. Do not infer what the recording says if it has not been supplied or played.";
  }
  return result;
}
function campusMockLinks(level) {
  return (CONTENT?.campusMocks || CONTENT?.mocks || []).filter(m=>m.level===level)
    .map(m=>({...m,practiceUrl:m.examRoomUrl+"?mode=practice"}));
}
function getExpandedMockTask(level,mockId,skill,part) {
  const mock=(CONTENT?.mocks||[]).find(m=>m.level===level&&m.mockId===mockId);
  const set=skill==="writing"?CONTENT?.mockWriting?.[mockId]:skill==="speaking"?CONTENT?.mockSpeaking?.[mockId]:null;
  if(!mock||!set)return null;
  const key=normalizePart(part||"teil1");
  if(!set[key])return {available:false,message:"This part is not exported. Use Campus Practice Mode.",examRoomUrl:mock.examRoomUrl+"?mode=practice"};
  return {available:true,level,mockId,skill,part:key,task:set[key],practiceOnly:true,officialResult:false,
    examRoomUrl:mock.examRoomUrl+"?mode=practice",
    instructions:"Use the original prompt for repeatable self-practice. Ask the learner for their own response and give conversational feedback, not an official score."};
}
module.exports = { listMyExamMocks, getMyExamDictionary, getMyMockObjectivePractice, normalizePart, campusMockLinks, getExpandedMockTask };
