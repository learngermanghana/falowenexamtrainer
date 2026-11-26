import { FALOWEN_CONNECTION_REQUIRED } from "./falowenStudyConnection";
// Only public lesson metadata is sent to ChatGPT; never pass student records,
 // draft answers, grades, tokens, or the current URL/query string.
export const A1_STUDY_MODES = Object.freeze([
  { key: "explain", label: "Explain this lesson", instruction: "Explain the topic with short A1 examples and check my understanding." },
  { key: "grammar", label: "Practise grammar", instruction: "Teach the retrieved grammar for this lesson, then give me short source-grounded exercises." },
  { key: "speaking", label: "Practise speaking", instruction: "Role-play a realistic A1 conversation on this topic, one question at a time." },
  { key: "writing", label: "Practise writing", instruction: "Use a learner-facing A1 writing task from the retrieved lesson or a clearly labeled example based on it and correct my own attempt." },
  { key: "quiz", label: "Test my understanding", instruction: "Quiz me from the retrieved lesson, one question at a time." },
]);

export const FLEXIBLE_COURSE_TUTORING = "The selected study mode and workbook tab are the STARTING POINT only, not a restriction. Stay in this conversation and keep the last verified programme, level, day and chapter as context. When I ask in German or English to switch to Sprechen, Schreiben, Lesen, Hören, grammar, vocabulary, Teil 1, another chapter or another day, pause and retrieve the exact requested original material with the authorised lesson tool. Keep unchanged lesson details unless I change them. For numbered Teil requests, check the actual workbook section mapping or ask one brief question if ambiguous. For A2 Day 9, Teil 1 is Sprechen and Teil 2 is Schreiben. Do not assume this numbering across other lessons or exams. For a different chapter or day, verify the new returned level, day and chapter before teaching. Check authorised revision levels before changing levels. If the server returns developerTesting.enabled, use the explicitly selected German test level from developerTesting.levels; this is read-only preview, never an enrollment change. If a section is unavailable or denied, explain in English and offer another authorised section without substituting or inventing the requested material. If Live Voice cannot retrieve it, switch to text in this same conversation, fetch the source and resume Voice. No need to reopen Falowen or start a new chat just to switch sections. Reuse previously verified material for the same section where appropriate, but never assume access to new content. Ask one original question at a time.";
const clean = value => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 200);

export function isStudyPartnerLesson(lesson = {}, level = "A1") {
  return Boolean(["A1", "A2", "B1", "B2", "C1", "C2"].includes(level) && (!["B2","C1","C2"].includes(level) || Number(lesson.day) <= 28) && clean(lesson.title) && Number.isInteger(Number(lesson.day)) && Number(lesson.day) > 0
    && clean(lesson.chapter) && !/final mock|speaking mock|abschlussprüfung/i.test(lesson.title)
    && !/final-mock-exam/i.test(lesson.destination || lesson.workbookRoute || ""));
}

export function buildStudyPrompt(lesson, mode = "explain", section = "", level = "A1") {
  if (!isStudyPartnerLesson(lesson, level)) return "";
  const option = A1_STUDY_MODES.find(item => item.key === mode) || A1_STUDY_MODES[0];
  const assignment = lesson.kind === "assignment" && new RegExp("^" + level + "-[0-9._]+$").test(lesson.assignmentKey || "")
    ? " Official assignment reference: " + lesson.assignmentKey + "." : "";
  const source = lesson.kind === "assignment"
    ? "I am reviewing my teacher-led lesson and preparing for a tutor-marked assignment."
    : "I am studying this self-learning material independently.";
  return [
    FALOWEN_CONNECTION_REQUIRED,
    "Be my German " + level + " study partner at Falowen (Learn Language Education Academy).",
    "Current lesson: Day " + Number(lesson.day) + ", Kapitel " + clean(lesson.chapter) + " — " + clean(lesson.title) + "." + assignment,
    source,
    clean(section) ? "Current workbook section: " + clean(section) + "." : "",
    "Retrieve this exact lesson by level, day and chapter" + (assignment ? " and assignment reference" : "") + " using the authorized revision lesson tool. Verify the result before teaching. Use learner-facing material only. If it is unavailable, stop and explain how I can access it in Falowen.",
    ["B2","C1","C2"].includes(level) && clean(lesson.grammarFocus) ? "Grammar focus: " + clean(lesson.grammarFocus) + "." : "",
    ["B2","C2"].includes(level) && clean(lesson.skillFocus) ? "Today's exam skill: " + clean(lesson.skillFocus) + "." : "",
    level === "C1" && clean(lesson.guidingQuestion) ? "Guiding question: " + clean(lesson.guidingQuestion) + "." : "",
    option.instruction.replace(/\bA1\b/g, level),
    FLEXIBLE_COURSE_TUTORING,
    level === "B2" ? "Use B2-level vocabulary, collocations and complex but natural sentences. Train the current skill with authorized Falowen tasks or clearly labeled teaching examples based on them: reading paraphrases and evidence, listening for detail using audio only when available, structured presentations and discussions, or forum posts and formal messages. Do not claim a text-only exercise is listening practice." : "",
    level === "C1" ? "Use natural advanced German for practice, precise vocabulary, nuanced argumentation, counterarguments, cohesive structure and register. Encourage independent reformulation." : "",
    level === "C2" ? "Use precise, idiomatic German, nuanced interpretation, reformulation, coherent arguments and appropriate register. Respect the actual daily skill rotation." : "",
    level === "B1" ? "Encourage connected sentences, reasons, examples and appropriate register. For speaking, practise expressing opinions, planning together and responding to follow-up questions; for writing, practise coherent organisation and connectors." : "",
    "Use German appropriate for " + level + " in practice, with clear English explanations. Ask one question at a time, wait for my reply, correct my mistakes and explain why.",
    "Use source-grounded practice examples and hints. Do not provide official assignment answers, answer keys, complete my submission, save official marks, or start an exam. Ask for my own attempt first.",
  ].filter(Boolean).join("\n\n");
}

// Preserve the original A1 public API for existing callers and tests.
export const isA1StudyPartnerLesson = (lesson) => isStudyPartnerLesson(lesson, "A1");
export const buildA1StudyPrompt = (lesson, mode, section) => buildStudyPrompt(lesson, mode, section, "A1");

export function buildA1ChatGPTUrl(prompt) {
  return prompt ? "https://chatgpt.com/?q=" + encodeURIComponent(prompt) : "https://chatgpt.com/";
}

export const A1_VOICE_MODES = Object.freeze([
  { key: "voice-teacher", label: "Learn with ChatGPT Live Voice · guided lesson" },
  { key: "voice-speaking", label: "ChatGPT Live Voice · speaking partner" },
]);
export const VOICE_TEACHER_LEVELS = Object.freeze(["A1","A2","B1","B2","C1","C2"]);
const voicePedagogy = {
  A1: "Use slow simple German and short English explanations. Teach core words, one grammar rule and short complete sentences; demonstrate an everyday role-play.",
  A2: "Use clear everyday German, short explanations and useful phrases. Practise describing experiences, making arrangements and linking simple sentences with reasons.",
  B1: "Use connected German, everyday and abstract topics, explanations, reasons, examples, opinions and planning together. Help the learner repair misunderstandings.",
  B2: "Use natural German, precise collocations, the actual daily grammar and skill focus, structured argumentation, pros and cons, and fresh exam-style discussion tasks. Use actual audio only if available.",
  C1: "Use advanced German for spoken practice at a natural but adjustable pace, with English explanations. Use the actual lesson guiding question and grammar, advanced collocations, academic or formal register, nuanced positions, counterarguments, examples and reformulation. Distinguish style improvements from actual errors.",
  C2: "Use idiomatic advanced German, nuanced interpretation, stylistic precision, reformulation and sustained argumentation. Teach the original course skill rather than inventing an examination."
};
export function buildVoiceTeacherPrompt(lesson, mode = "voice-teacher", level = "A1", section = "") {
  if (!VOICE_TEACHER_LEVELS.includes(level) || !isStudyPartnerLesson(lesson, level) || !A1_VOICE_MODES.some(item => item.key === mode)) return "";
  const source = buildStudyPrompt(lesson, mode === "voice-speaking" ? "speaking" : "explain", section, level);
  return [
    source,
    "I want to learn aloud in ChatGPT Live Voice, using the Falowen Learning Companion. This is a lesson or independent practice, never an assessment or submission.",
    "First check my authorised revision levels, then retrieve the original German " + level + " lesson for Day " + Number(lesson.day) + " from Falowen Learning Companion using its revision lesson tool with program german, level " + level + " and section overview. Verify that the returned day and topic match. Retrieve the selected starting section, or speaking first if speaking-partner mode was chosen. Retrieve vocabulary, grammar, speaking, writing, reading, listening or review whenever requested during the conversation; reuse previously verified material for the same section when appropriate. If I request a different day or chapter, retrieve and verify that lesson before continuing. Respect access restrictions. If content is unavailable, stop and explain the next access or connection step in English. Never invent a Falowen source.",
    voicePedagogy[level],
    mode === "voice-teacher"
      ? "Guide a flexible approximately 20-minute lesson: greet me and check readiness; introduce the lesson aim; teach a few core words from the actual lesson; explain a grammar rule with level-appropriate German examples; ask me to make my own sentences; use a short role-play or discussion; recap my mistakes and finish with two comprehension checks. Adapt the pace and shorten or extend if I ask."
      : "Act as a patient speaking partner. Introduce a few useful words from the lesson, demonstrate a short " + level + " exchange, then role-play or discuss using source-grounded prompts. Encourage level-appropriate answers and practise again after feedback.",
    "Speak clearly and naturally at a pace appropriate to my level. Ask one question at a time and wait for my spoken answer; do not answer for me. Give me time to think. Correct one or two important errors at a time, say the corrected German phrase, and let me repeat it. If you cannot hear clearly, ask me to repeat rather than guess. Do not claim to have verified pronunciation or scored official work.",
    "Do not read the entire lesson aloud as a lecture. Teach interactively. Never fetch protected exam material, reveal official assignment solutions, mark or submit my work, or write to Falowen. No private student records are needed. If this chat is currently in text, ask me to activate Live Voice before starting the spoken lesson."
  ].join("\n\n");
}
export const buildA1VoiceTeacherPrompt = (lesson, mode = "voice-teacher", level = "A1") => level === "A1" ? buildVoiceTeacherPrompt(lesson, mode, level) : "";
