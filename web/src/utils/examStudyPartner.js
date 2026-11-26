// Only fixed practice metadata and a derived skill/Teil are used. No scores, IDs, answers,
// exam passages, current task text, tokens, or account information are sent.
export const EXAM_STUDY_SKILLS = Object.freeze([
  { key: "overview", label: "All four skills", instruction: "Help me plan balanced exam preparation across Lesen, Hören, Schreiben and Sprechen." },
  { key: "lesen", label: "Reading · Lesen", instruction: "Create a fresh level-appropriate reading passage and comprehension questions. Teach scanning, finding evidence and identifying paraphrases." },
  { key: "horen", label: "Listening · Hören", instruction: "Practise listening with a new short script or spoken exercise if voice is available. Do not reveal the transcript before I attempt the questions. If audio is unavailable, explain the limitation and offer alternative practice." },
  { key: "writing", label: "Writing · Schreiben", instruction: "Create a fresh level-appropriate writing prompt. Teach structure, register and task coverage, then correct my own attempt." },
  { key: "speaking", label: "Speaking · Sprechen", instruction: "Use a fresh level-appropriate speaking task, role-play and ask follow-up questions. Practise turn-taking, fluency and appropriate register." },
]);
export const EXAM_STUDY_MODES = Object.freeze([
  { key: "practice", label: "Practise with new questions", instruction: "Start an interactive practice session with one new question at a time." },
  { key: "strategy", label: "Explain exam strategies", instruction: "Explain useful preparation strategies and demonstrate them with new examples." },
  { key: "review", label: "Review my weak areas", instruction: "Ask which skill or type of mistake I struggle with, then give targeted revision. Do not assume you know my scores." },
]);
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const canShowExamStudyPartner = ({ level, section, sampleId = "", restricted = false, trial = false, isSwahili = false, allowed = true } = {}) =>
  Boolean(allowed && !restricted && !trial && !isSwahili && !sampleId && LEVELS.includes(level) && EXAM_STUDY_SKILLS.some(skill => skill.key === section));
export function buildExamStudyPrompt({ level, section, mode = "practice" } = {}) {
  if (!canShowExamStudyPartner({ level, section })) return "";
  const skill = EXAM_STUDY_SKILLS.find(item => item.key === section);
  const option = EXAM_STUDY_MODES.find(item => item.key === mode) || EXAM_STUDY_MODES[0];
  return [
    "Be my German " + level + " examination preparation study partner at Falowen (Learn Language Education Academy).",
    "Selected exam skill: " + skill.label + ". This is independent preparation, not an active assessment.",
    "If my Falowen Learning Companion is connected, use learner-facing practice resources appropriate to this level and skill, only if available. Otherwise say so and create original practice.",
    skill.instruction,
    option.instruction,
    "Match the CEFR level " + level + ". Ask one question at a time, wait for my attempt, then explain mistakes and give actionable feedback. Use German appropriate to my level and brief English explanations if needed.",
    "Do not solve current Falowen exam questions, disclose answer keys, reproduce protected assessment tasks, start or submit an exam, or save official marks. Use new examples instead."
  ].join("\n\n");
}

const SKILL_MAP = Object.freeze({ lesen: "lesen", hoeren: "horen", schreiben: "writing", sprechen: "speaking" });
export function safeExamPart(value) {
  const match = String(value ?? "").trim().match(/^(?:teil\s*[- ]?\s*)?([1-5])$/i);
  return match ? "Teil " + match[1] : "";
}
export function getExamRevisionFocus(coach) {
  const result = coach?.latestBySection?.[coach?.focus?.key];
  const section = SKILL_MAP[coach?.focus?.key];
  if (!section || !result || !Number.isFinite(result.percent) || result.percent >= 80) return null;
  return { section, part: safeExamPart(coach.focus.weakPart) };
}
export function weakestScoredExamPart(parts = []) {
  const valid = parts.filter(p => safeExamPart(p?.label) && Number.isFinite(p.score) && Number.isFinite(p.total) && p.total > 0 && p.score >= 0 && p.score < p.total);
  return safeExamPart([...valid].sort((a,b) => a.score/a.total - b.score/b.total)[0]?.label);
}
export function buildExamRevisionPrompt({ level, section, part, completed = false } = {}) {
  if (!completed || section === "overview" || !canShowExamStudyPartner({level, section})) return "";
  const focus = safeExamPart(part);
  return [
    buildExamStudyPrompt({level, section, mode: "review"}),
    "I have already completed a Falowen practice assessment and want to review my mistakes.",
    focus ? "Prioritise " + focus + " using original exercises at this level. Do not assume a specific task format unless verified." : "Help identify my mistake types through a short discussion.",
    "No scores, answers or exam questions were transferred. Ask me to describe the mistake or feedback in my own words; do not ask for protected exam material. Explain the underlying rule or strategy, give a fresh example, then ask me to try another question. Do not claim to know why I got a particular question wrong without evidence."
  ].join("\n\n");
}
