export const branchTypesByLevel = {
  A2: ["topic", "detail", "example", "opinion", "closing"],
  B1: ["opinion", "reason", "example", "advantage", "disadvantage", "conclusion"],
  B2: ["position", "argument", "evidence", "example", "consequence", "counterargument", "response"],
  C1: ["thesis", "context", "evidence", "evaluation", "objection", "qualification", "conclusion"],
};

const allowedLevels = new Set(Object.keys(branchTypesByLevel));

export const validateSpeakingMindMapConfig = (config, options = {}) => {
  const { requiredLevel, requiredDay, requiredLessonId } = options;
  if (!config || typeof config !== "object") return false;
  if (!allowedLevels.has(config.level)) return false;
  if (requiredLevel && config.level !== requiredLevel) return false;
  if (requiredDay && Number(config.day) !== Number(requiredDay)) return false;
  if (requiredLessonId && config.lessonId !== requiredLessonId) return false;
  if (!config.day || !config.lessonId || !config.title || !config.centralQuestion) return false;
  if (!Array.isArray(config.branches) || config.branches.length < 4) return false;
  const ids = new Set();
  const branchTypes = branchTypesByLevel[config.level];
  for (const branch of config.branches) {
    if (!branch?.id || ids.has(branch.id)) return false;
    ids.add(branch.id);
    if (branch.type && !branchTypes.includes(branch.type)) return false;
    if (!branch.label || !Array.isArray(branch.keywords) || !branch.keywords.length) return false;
    if (branch.keywords.some((keyword) => !String(keyword || "").trim())) return false;
    if (!branch.guidingQuestion || !branch.sentenceStarter || !branch.modelSentence) return false;
  }
  if (!Array.isArray(config.speakingRoute) || config.speakingRoute.length !== config.branches.length) return false;
  if (!config.speakingRoute.every((id) => ids.has(id))) return false;
  if (new Set(config.speakingRoute).size !== config.speakingRoute.length) return false;
  if (typeof config.targetDurationSeconds !== "number" || config.targetDurationSeconds < 30 || config.targetDurationSeconds > 180) return false;
  return true;
};
