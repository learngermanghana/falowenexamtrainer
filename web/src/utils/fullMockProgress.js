export const FULL_MOCK_SKILLS = Object.freeze([
  { key: "lesen", label: "Lesen" },
  { key: "hoeren", label: "Hören" },
  { key: "schreiben", label: "Schreiben" },
  { key: "sprechen", label: "Sprechen" },
]);

export const getFullMockSkillForStage = (stage) => {
  if (FULL_MOCK_SKILLS.some((skill) => skill.key === stage)) return stage;
  if (/^hoeren-teil[1-4]$/.test(String(stage || ""))) return "hoeren";
  if (/^teil[1-4]$/.test(String(stage || ""))) return "lesen";
  return "";
};

export const getFullMockProgress = ({ stage = "intro", completedSkills = [], complete = false } = {}) => {
  const finished = new Set(completedSkills);
  const current = getFullMockSkillForStage(stage);
  const count = FULL_MOCK_SKILLS.filter((step) => finished.has(step.key)).length;
  return {
    count,
    current,
    total: FULL_MOCK_SKILLS.length,
    complete: Boolean(complete) && count === FULL_MOCK_SKILLS.length,
  };
};

export const getFullMockPracticeRoutes = (level) => {
  const normalized = String(level || "").trim().toLowerCase();
  const nativeReading = ["a1", "a2", "b1", "c1"].includes(normalized);
  const nativeListening = ["a1", "a2", "b1", "c1"].includes(normalized);
  return {
    lesen: nativeReading ? `/exams/lesen/${normalized}/sample-1` : "/exams/lesen",
    hoeren: nativeListening ? `/exams/horen/${normalized}/sample-1` : "/exams/horen",
    schreiben: "/exams/writing",
    sprechen: "/exams/speaking",
  };
};

export const getFullMockWeakestSkills = (sectionScores = {}) =>
  FULL_MOCK_SKILLS.filter(({ key }) => Object.prototype.hasOwnProperty.call(sectionScores, key) &&
      Number.isFinite(Number(sectionScores[key])))
    .map((step) => ({ ...step, score: Number(sectionScores[step.key]) }))
    .sort((a, b) => a.score - b.score);
