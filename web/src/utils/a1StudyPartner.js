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
  return Boolean(["A1", "A2", "B1", "B2"].includes(level) && (level !== "B2" || Number(lesson.day) <= 28) && clean(lesson.title) && Number.isInteger(Number(lesson.day)) && Number(lesson.day) > 0
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
    level === "B2" && clean(lesson.grammarFocus) ? "Grammar focus: " + clean(lesson.grammarFocus) + "." : "",
    level === "B2" && clean(lesson.skillFocus) ? "Today's exam skill: " + clean(lesson.skillFocus) + "." : "",
    option.instruction.replace(/\bA1\b/g, level),
    level === "B2" ? "Use B2-level vocabulary, collocations and complex but natural sentences. Train the current skill with fresh Goethe-style tasks: reading paraphrases and evidence, listening for detail using audio only when available, structured presentations and discussions, or forum posts and formal messages. Do not claim a text-only exercise is listening practice." : "",
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
export function buildA1VoiceTeacherPrompt(lesson, mode = "voice-teacher", level = "A1") {
  if (level !== "A1" || !isA1StudyPartnerLesson(lesson) || !A1_VOICE_MODES.some(item => item.key === mode)) return "";
  const source = buildA1StudyPrompt(lesson, mode === "voice-speaking" ? "speaking" : "explain", "");
  return [
    source,
    "I want to learn aloud in ChatGPT Live Voice, using the Falowen Learning Companion. This is a lesson or independent practice, never an assessment or submission.",
    "First check my authorised revision levels, then retrieve the original German A1 lesson for Day " + Number(lesson.day) + " from Falowen Learning Companion using its revision lesson tool with program german, level A1 and section overview. Verify that the returned day and topic match. Retrieve vocabulary, grammar and speaking only as needed, once per section during this session; reuse already retrieved content. Respect access restrictions. If content is unavailable, say so; ask whether I want to continue with original topic-based practice instead. Never invent a Falowen source.",
    mode === "voice-teacher"
      ? "Guide a flexible approximately 20-minute lesson: greet me and check readiness; introduce the lesson aim; teach a few core words from the actual lesson; explain one grammar rule in simple English with short German examples; ask me to make my own sentences; use a short role-play; recap my mistakes and finish with two comprehension checks. Adapt the pace and shorten or extend if I ask."
      : "Act as a patient speaking partner. Introduce a few useful words from the lesson, demonstrate a short A1 exchange, then role-play using fresh prompts. Encourage me to answer in complete short sentences and practise again after feedback.",
    "Speak slowly and naturally in short turns. Ask one question at a time and wait for my spoken answer; do not answer for me. Give me time to think. Correct one or two important errors at a time, say the corrected German phrase, and let me repeat it. If you cannot hear clearly, ask me to repeat rather than guess. Do not claim to have verified pronunciation or scored official work.",
    "Do not read the entire lesson aloud as a lecture. Teach interactively. Never fetch protected exam material, reveal official assignment solutions, mark or submit my work, or write to Falowen. No private student records are needed. If this chat is currently in text, ask me to activate Live Voice before starting the spoken lesson."
  ].join("\n\n");
}
