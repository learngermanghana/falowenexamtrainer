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
  return Boolean(["A1", "A2"].includes(level) && clean(lesson.title) && Number.isInteger(Number(lesson.day)) && Number(lesson.day) > 0
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
    option.instruction.replace(/\bA1\b/g, level),
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
