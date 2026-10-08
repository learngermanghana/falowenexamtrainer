export const EXAM_SKILLS = Object.freeze([
  { key: "lesen", title: "Lesen", description: "Reading", path: "/exams/lesen" },
  { key: "hoeren", title: "Hören", description: "Listening", path: "/exams/horen" },
  { key: "schreiben", title: "Schreiben", description: "Writing", path: "/exams/writing" },
  { key: "sprechen", title: "Sprechen", description: "Speaking", path: "/exams/speaking" },
]);

const scorePercent = (attempt) => {
  const explicit = attempt?.percent;
  const score = Number(attempt?.score);
  const total = Number(attempt?.total);
  const value = explicit !== "" && explicit !== null && explicit !== undefined
    ? Number(explicit)
    : Number.isFinite(score) && Number.isFinite(total) && total > 0
      ? (score / total) * 100
      : NaN;
  return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : null;
};

const normalizedSection = (row) =>
  String(row?.section || row?.examSection || row?.type || "").toLowerCase()
    .replace("hören", "hoeren");

const asMillis = (value) => {
  if (value?.toDate) return value.toDate().getTime();
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
};

export const buildExamRoomCoach = ({
  level,
  cloudResults = [],
  localReading = [],
} = {}) => {
  const selectedLevel = String(level || "A1").toUpperCase();
  const attempts = [];
  const seen = new Set();

  // Cloud data comes first, so an attempt synced to the backend is not counted
  // again from the student's original local Lesen history.
  [...cloudResults, ...localReading.map((item) => ({
    ...item,
    section: "lesen",
    attemptId: item.id,
    completedAt: item.completedAt,
    route: "/exams/lesen",
  }))].forEach((row) => {
    if (String(row?.level || "").toUpperCase() !== selectedLevel) return;
    const section = normalizedSection(row);
    if (!EXAM_SKILLS.some((skill) => skill.key === section)) return;
    const percent = scorePercent(row);
    if (percent === null) return;
    const uniqueKey = String(row?.attemptId || row?.examRoomAttemptId || row?.id || "");
    if (uniqueKey && seen.has(uniqueKey)) return;
    if (uniqueKey) seen.add(uniqueKey);
    attempts.push({
      id: uniqueKey,
      section,
      level: selectedLevel,
      percent,
      title: String(row?.title || row?.setId || section),
      route: typeof row?.route === "string" && row.route.startsWith("/exams/")
        ? row.route : EXAM_SKILLS.find((skill) => skill.key === section).path,
      completedAt: row?.completedAt || row?.date || "",
      sectionScores: row?.sectionScores || null,
    });
  });
  attempts.sort((left, right) => asMillis(right.completedAt) - asMillis(left.completedAt));

  const latestBySection = {};
  attempts.forEach((attempt) => {
    if (!latestBySection[attempt.section]) latestBySection[attempt.section] = attempt;
  });

  const coveredSkills = EXAM_SKILLS.filter((skill) => latestBySection[skill.key]).length;
  const latest = attempts[0] || null;
  const scored = EXAM_SKILLS
    .map((skill) => latestBySection[skill.key])
    .filter(Boolean);
  const weakest = [...scored].sort((a, b) => a.percent - b.percent)[0] || null;
  const missing = EXAM_SKILLS.find((skill) => !latestBySection[skill.key]);
  const focus = weakest && weakest.percent < 80
    ? EXAM_SKILLS.find((skill) => skill.key === weakest.section)
    : missing || EXAM_SKILLS.find((skill) => skill.key === (weakest?.section || "lesen"));
  const focusResult = latestBySection[focus.key];
  const shouldRevise = Boolean(weakest && weakest.percent < 80);
  const reason = shouldRevise
    ? `Your latest ${focus.title} practice was ${focusResult.percent}%. Repeat this section and review your mistakes.`
    : missing
      ? `You haven't recorded a ${focus.title} result yet. Try your first practice.`
      : "All four skills have been practised. Keep improving with another attempt.";

  let weakPart = "";
  if (shouldRevise && focus.key === "lesen" &&
      Array.isArray(focusResult?.sectionScores)) {
    const ranked = focusResult.sectionScores
      .filter((part) => Number(part.total) > 0)
      .sort((a, b) => Number(a.score || 0) / Number(a.total) -
        Number(b.score || 0) / Number(b.total));
    weakPart = String(ranked[0]?.label || "");
  }

  return {
    attempts,
    latest,
    latestBySection,
    coveredSkills,
    coveragePercent: Math.round((coveredSkills / EXAM_SKILLS.length) * 100),
    focus: {
      ...focus,
      route: shouldRevise && focusResult?.route ? focusResult.route : focus.path,
      reason,
      weakPart,
    },
  };
};
