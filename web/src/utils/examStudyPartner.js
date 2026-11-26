import { FALOWEN_CONNECTION_REQUIRED } from "./falowenStudyConnection";
// Only fixed practice metadata and a derived skill/Teil are used. No scores, IDs, answers,
// exam passages, current task text, tokens, or account information are sent.
export const EXAM_STUDY_SKILLS = Object.freeze([
  { key: "overview", label: "All four skills", instruction: "Help me plan balanced exam preparation across Lesen, Hören, Schreiben and Sprechen." },
  { key: "lesen", label: "Reading · Lesen", instruction: "Use an authorized Falowen reading passage and its learner-visible comprehension questions. Teach scanning, finding evidence and identifying paraphrases." },
  { key: "horen", label: "Listening · Hören", instruction: "Use authorized Falowen listening practice and its original audio or direct me to its protected listening page. Do not reveal the transcript before I attempt the questions. If audio is unavailable, explain the limitation and direct me to the Falowen listening page." },
  { key: "writing", label: "Writing · Schreiben", instruction: "Use an authorized Falowen writing prompt. Teach structure, register and task coverage, then correct my own attempt." },
  { key: "speaking", label: "Speaking · Sprechen", instruction: "Use an authorized Falowen speaking task, role-play and ask follow-up questions. Practise turn-taking, fluency and appropriate register." },
]);
export const EXAM_STUDY_MODES = Object.freeze([
  { key: "practice", label: "Practise with new questions", instruction: "After retrieval, start an interactive practice session with one source-grounded question at a time." },
  { key: "strategy", label: "Explain exam strategies", instruction: "Explain useful preparation strategies and demonstrate them with examples based on retrieved material." },
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
    FALOWEN_CONNECTION_REQUIRED,
    "Be my German " + level + " examination preparation study partner at Falowen (Learn Language Education Academy).",
    "Selected exam skill: " + skill.label + ". This is independent preparation, not an active assessment.",
    "Use Falowen Learning Companion to retrieve authorized learner-facing practice for the selected level and skill. For speaking and writing, use the exam dictionary. For reading and listening, list published mocks first and retrieve supported practice; if only a protected Falowen page link is available, direct me there. For all four skills, verify available practice resources before planning. Verify the level and skill returned; if unavailable, stop and explain in English.",
    skill.instruction,
    option.instruction,
    "Match the CEFR level " + level + ". Ask one question at a time, wait for my attempt, then explain mistakes and give actionable feedback. Use German appropriate to my level and clear English explanations and feedback.",
    "Do not solve current Falowen exam questions, disclose answer keys, reproduce protected assessment tasks, start or submit an exam, or save official marks. Use only source-grounded teaching examples instead."
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
    focus ? "Prioritise " + focus + " using retrieved learner-facing exercises at this level. Do not assume a specific task format unless verified." : "Help identify my mistake types through a short discussion.",
    "No scores, answers or exam questions were transferred. Ask me to describe the mistake or feedback in my own words; do not ask for protected exam material. Explain the underlying rule or strategy, give a clearly labeled source-grounded example, then ask me to try another authorized question. Do not claim to know why I got a particular question wrong without evidence."
  ].join("\n\n");
}
