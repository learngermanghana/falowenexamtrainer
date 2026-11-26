// Only public lesson metadata is sent to ChatGPT; never pass student records,
 // draft answers, grades, tokens, or the current URL/query string.
export const A1_STUDY_MODES = Object.freeze([
  { key: "explain", label: "Explain this lesson", instruction: "Explain the topic with short A1 examples and check my understanding." },
  { key: "grammar", label: "Practise grammar", instruction: "Teach the grammar for this lesson, then give me new short exercises." },
  { key: "speaking", label: "Practise speaking", instruction: "Role-play a realistic A1 conversation on this topic, one question at a time." },
  { key: "writing", label: "Practise writing", instruction: "Give me a new short A1 writing task on this topic and correct my own attempt." },
  { key: "quiz", label: "Test my understanding", instruction: "Quiz me with new questions on this topic, one at a time." },
]);

const clean = value => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 200);

export function isStudyPartnerLesson(lesson = {}, level = "A1") {
  return Boolean(["A1", "A2", "B1", "B2", "C1"].includes(level) && (!["B2","C1"].includes(level) || Number(lesson.day) <= 28) && clean(lesson.title) && Number.isInteger(Number(lesson.day)) && Number(lesson.day) > 0
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
    "Be my German " + level + " study partner at Falowen (Learn Language Education Academy).",
    "Current lesson: Day " + Number(lesson.day) + ", Kapitel " + clean(lesson.chapter) + " — " + clean(lesson.title) + "." + assignment,
    source,
    clean(section) ? "Current workbook section: " + clean(section) + "." : "",
    "If my Falowen Learning Companion is connected, retrieve this exact lesson by level, day and chapter" + (assignment ? " and assignment reference" : "") + ". Use learner-facing material only. If it is unavailable, tell me and use the topic above, without pretending you have read the lesson.",
    ["B2","C1"].includes(level) && clean(lesson.grammarFocus) ? "Grammar focus: " + clean(lesson.grammarFocus) + "." : "",
    level === "B2" && clean(lesson.skillFocus) ? "Today's exam skill: " + clean(lesson.skillFocus) + "." : "",
    level === "C1" && clean(lesson.guidingQuestion) ? "Guiding question: " + clean(lesson.guidingQuestion) + "." : "",
    option.instruction.replace(/\bA1\b/g, level),
    level === "B2" ? "Use B2-level vocabulary, collocations and complex but natural sentences. Train the current skill with fresh Goethe-style tasks: reading paraphrases and evidence, listening for detail using audio only when available, structured presentations and discussions, or forum posts and formal messages. Do not claim a text-only exercise is listening practice." : "",
    level === "C1" ? "Use natural advanced German, precise vocabulary, nuanced argumentation, counterarguments, cohesive structure and register. Encourage independent reformulation." : "",
    level === "B1" ? "Encourage connected sentences, reasons, examples and appropriate register. For speaking, practise expressing opinions, planning together and responding to follow-up questions; for writing, practise coherent organisation and connectors." : "",
    "Use German appropriate for " + level + ", with short English explanations when helpful. Ask one question at a time, wait for my reply, correct my mistakes and explain why.",
    "Use fresh practice examples and hints. Do not provide official assignment answers, answer keys, complete my submission, save official marks, or start an exam. Ask for my own attempt first.",
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
export const VOICE_TEACHER_LEVELS = Object.freeze(["A1","A2","B1","B2","C1"]);
const voicePedagogy = {
  A1: "Use slow simple German and short English explanations. Teach core words, one grammar rule and short complete sentences; demonstrate an everyday role-play.",
  A2: "Use clear everyday German, short explanations and useful phrases. Practise describing experiences, making arrangements and linking simple sentences with reasons.",
  B1: "Use connected German, everyday and abstract topics, explanations, reasons, examples, opinions and planning together. Help the learner repair misunderstandings.",
  B2: "Use natural German, precise collocations, the actual daily grammar and skill focus, structured argumentation, pros and cons, and fresh exam-style discussion tasks. Use actual audio only if available.",
  C1: "Teach primarily in German at a natural but adjustable pace. Use the actual lesson Leitfrage and grammar, advanced collocations, academic or formal register, nuanced positions, counterarguments, examples and reformulation. Distinguish style improvements from actual errors."
};
export function buildVoiceTeacherPrompt(lesson, mode = "voice-teacher", level = "A1") {
  if (!VOICE_TEACHER_LEVELS.includes(level) || !isStudyPartnerLesson(lesson, level) || !A1_VOICE_MODES.some(item => item.key === mode)) return "";
  const source = buildStudyPrompt(lesson, mode === "voice-speaking" ? "speaking" : "explain", "", level);
  return [
    source,
    "I want to learn aloud in ChatGPT Live Voice, using the Falowen Learning Companion. This is a lesson or independent practice, never an assessment or submission.",
    "First check my authorised revision levels, then retrieve the original German " + level + " lesson for Day " + Number(lesson.day) + " from Falowen Learning Companion using its revision lesson tool with program german, level " + level + " and section overview. Verify that the returned day and topic match. Retrieve vocabulary, grammar and speaking only as needed, once per section during this session; reuse already retrieved content. Respect access restrictions. If content is unavailable, say so; ask whether I want to continue with original topic-based practice instead. Never invent a Falowen source.",
    voicePedagogy[level],
    mode === "voice-teacher"
      ? "Guide a flexible approximately 20-minute lesson: greet me and check readiness; introduce the lesson aim; teach a few core words from the actual lesson; explain a grammar rule with level-appropriate German examples; ask me to make my own sentences; use a short role-play or discussion; recap my mistakes and finish with two comprehension checks. Adapt the pace and shorten or extend if I ask."
      : "Act as a patient speaking partner. Introduce a few useful words from the lesson, demonstrate a short " + level + " exchange, then role-play or discuss using fresh prompts. Encourage level-appropriate answers and practise again after feedback.",
    "Speak clearly and naturally at a pace appropriate to my level. Ask one question at a time and wait for my spoken answer; do not answer for me. Give me time to think. Correct one or two important errors at a time, say the corrected German phrase, and let me repeat it. If you cannot hear clearly, ask me to repeat rather than guess. Do not claim to have verified pronunciation or scored official work.",
    "Do not read the entire lesson aloud as a lecture. Teach interactively. Never fetch protected exam material, reveal official assignment solutions, mark or submit my work, or write to Falowen. No private student records are needed. If this chat is currently in text, ask me to activate Live Voice before starting the spoken lesson."
  ].join("\n\n");
}
export const buildA1VoiceTeacherPrompt = (lesson, mode = "voice-teacher", level = "A1") => level === "A1" ? buildVoiceTeacherPrompt(lesson, mode, level) : "";
