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

export function isA1StudyPartnerLesson(lesson = {}) {
  return Boolean(clean(lesson.title) && Number.isInteger(Number(lesson.day)) && Number(lesson.day) > 0
    && clean(lesson.chapter) && !/final mock|abschlussprüfung/i.test(lesson.title)
    && !/final-mock-exam/i.test(lesson.destination || lesson.workbookRoute || ""));
}

export function buildA1StudyPrompt(lesson, mode = "explain", section = "") {
  if (!isA1StudyPartnerLesson(lesson)) return "";
  const option = A1_STUDY_MODES.find(item => item.key === mode) || A1_STUDY_MODES[0];
  const assignment = lesson.kind === "assignment" && /^A1-[0-9._]+$/.test(lesson.assignmentKey || "")
    ? " Official assignment reference: " + lesson.assignmentKey + "." : "";
  const source = lesson.kind === "assignment"
    ? "I am reviewing my teacher-led lesson and preparing for a tutor-marked assignment."
    : "I am studying this self-learning material independently.";
  return [
    "Be my German A1 study partner at Falowen (Learn Language Education Academy).",
    "Current lesson: Day " + Number(lesson.day) + ", Kapitel " + clean(lesson.chapter) + " — " + clean(lesson.title) + "." + assignment,
    source,
    clean(section) ? "Current workbook section: " + clean(section) + "." : "",
    "If my Falowen Learning Companion is connected, retrieve this exact lesson by level, day and chapter" + (assignment ? " and assignment reference" : "") + ". Use learner-facing material only. If it is unavailable, tell me and use the topic above, without pretending you have read the lesson.",
    option.instruction,
    "Use simple German appropriate for A1, with short English explanations when helpful. Ask one question at a time, wait for my reply, correct my mistakes and explain why.",
    "Use fresh practice examples and hints. Do not provide official assignment answers, answer keys, complete my submission, save official marks, or start an exam. Ask for my own attempt first.",
  ].filter(Boolean).join("\n\n");
}

export function buildA1ChatGPTUrl(prompt) {
  return prompt ? "https://chatgpt.com/?q=" + encodeURIComponent(prompt) : "https://chatgpt.com/";
}
