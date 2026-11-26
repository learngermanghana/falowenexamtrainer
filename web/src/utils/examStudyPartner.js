// Only fixed, public practice metadata is used. No scores, IDs, answers,
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
