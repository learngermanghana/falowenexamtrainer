export const EXAM_SKILLS = Object.freeze([
  { key: "lesen", title: "Lesen", description: "Reading", path: "/exams/lesen" },
  { key: "hoeren", title: "Hören", description: "Listening", path: "/exams/horen" },
  { key: "schreiben", title: "Schreiben", description: "Writing", path: "/exams/writing" },
  { key: "sprechen", title: "Sprechen", description: "Speaking", path: "/exams/speaking" },
]);

const finite = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};
const scorePercent = (attempt) => {
  const explicit = finite(attempt?.percent);
  const score = finite(attempt?.score);
  const total = finite(attempt?.total);
  const value = explicit !== null ? explicit : score !== null && total > 0 ? (score / total) * 100 : null;
  return value === null ? null : Math.max(0, Math.min(100, Math.round(value)));
};
const normalizedSection = (row) =>
  String(row?.section || row?.examSection || row?.type || "").toLowerCase()
    .replace("hören", "hoeren");
const asMillis = (value) => {
  if (value?.toDate) return value.toDate().getTime();
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
};
const readingPartLabel = (key) => {
  const match = String(key || "").toLowerCase().match(/^teil[ -]?([1-4])$/);
  return match ? `Teil ${match[1]}` : "";
};

// Local Lesen history provides denominators. Backend copies store only points
// per Teil; A1 and A2 practice sets use 5 questions in each Teil.
export const normalizeReadingPartScores = (row = {}) => {
  const parts = row.sectionScores;
  if (Array.isArray(parts)) {
    return parts.map((part) => ({
      label: String(part.label || readingPartLabel(part.key) || ""),
      score: finite(part.score),
      total: finite(part.total ?? part.maxScore),
    })).filter((part) => part.label && part.score !== null && part.total > 0);
  }
  if (!parts || typeof parts !== "object") return [];
  const entries = Object.entries(parts);
  const level = String(row.level || "").toUpperCase();
  const expected = level === "A1" ? 3 : level === "A2" ? 4 : 0;
  const total = finite(row.total);
  const knownEvenSize = expected > 0 && total === expected * 5 &&
    entries.length === expected &&
    entries.every(([key]) => Boolean(readingPartLabel(key)));
  return entries.map(([key, value]) => ({
    label: readingPartLabel(key),
    score: finite(typeof value === "object" && value !== null ? value.score : value),
    total: finite(typeof value === "object" && value !== null
      ? value.total ?? value.maxScore : knownEvenSize ? 5 : null),
  })).filter((part) => part.label && part.score !== null && part.total > 0);
};

const mockSectionPercents = (attempt) => {
  if (attempt.section !== "mixed" || attempt.resultType !== "final_mock") return [];
  const breakdown = Array.isArray(attempt.scoreBreakdown) && attempt.scoreBreakdown.length
    ? attempt.scoreBreakdown
    : Object.entries(attempt.sectionScores || {}).map(([key, score]) => ({
      key, score, maxScore: 25,
    }));
  return breakdown.map((part) => {
    const key = String(part.key || "").toLowerCase();
    const skill = EXAM_SKILLS.find((entry) => entry.key === key);
    const score = finite(part.score);
    const max = finite(part.maxScore);
    if (!skill || score === null || max === null || max <= 0) return null;
    return {
      id: `${attempt.id}:${key}`,
      section: key,
      level: attempt.level,
      percent: Math.round(Math.max(0, Math.min(100, (score / max) * 100))),
      route: skill.path,
      completedAt: attempt.completedAt,
      title: `${attempt.title} · ${skill.title}`,
      sectionScores: null,
    };
  }).filter(Boolean);
};

export const buildExamRoomCoach = ({
  level,
  cloudResults = [],
  localReading = [],
} = {}) => {
  const selectedLevel = String(level || "A1").toUpperCase();
  const attempts = [];
  const seen = new Set();
  const localById = new Map(localReading.filter((item) =>
    String(item.level || "").toUpperCase() === selectedLevel && item.id,
  ).map((item) => [String(item.id), item]));

  const cloudWithDetails = cloudResults.map((row) => {
    const section = normalizedSection(row);
    const local = section === "lesen"
      ? localById.get(String(row.attemptId || row.examRoomAttemptId || ""))
      : null;
    return local && Array.isArray(local.sectionScores) && local.sectionScores.length
      ? { ...row, sectionScores: local.sectionScores }
      : row;
  });

  [...cloudWithDetails, ...localReading.map((item) => ({
    ...item,
    section: "lesen",
    attemptId: item.id,
    completedAt: item.completedAt,
    route: "/exams/lesen",
  }))].forEach((row) => {
    if (String(row?.level || "").toUpperCase() !== selectedLevel) return;
    const section = normalizedSection(row);
    if (section !== "mixed" && !EXAM_SKILLS.some((skill) => skill.key === section)) return;
    const percent = scorePercent(row);
    if (percent === null) return;
    const uniqueKey = String(row?.attemptId || row?.examRoomAttemptId || row?.id || "");
    const dedupKey = `${section}:${uniqueKey}`;
    if (uniqueKey && seen.has(dedupKey)) return;
    if (uniqueKey) seen.add(dedupKey);

    const skill = EXAM_SKILLS.find((entry) => entry.key === section);
    attempts.push({
      id: uniqueKey,
      section,
      level: selectedLevel,
      percent,
      title: String(row?.title || row?.setId || (section === "mixed" ? "Full mock" : section)),
      route: typeof row?.route === "string" &&
        (row.route.startsWith("/exams/") || row.route.startsWith("/campus/course/"))
        ? row.route : skill?.path || "/exams/mocks",
      completedAt: row?.completedAt || row?.date || "",
      sectionScores: section === "lesen" ? normalizeReadingPartScores(row) : row?.sectionScores || null,
      scoreBreakdown: row?.scoreBreakdown || null,
      resultType: row?.resultType || "practice",
    });
  });
  attempts.sort((left, right) => asMillis(right.completedAt) - asMillis(left.completedAt));

  const latestBySection = {};
  attempts.forEach((attempt) => {
    const candidates = attempt.section === "mixed"
      ? mockSectionPercents(attempt) : [attempt];
    candidates.forEach((candidate) => {
      if (!latestBySection[candidate.section]) latestBySection[candidate.section] = candidate;
    });
  });

  const coveredSkills = EXAM_SKILLS.filter((skill) => latestBySection[skill.key]).length;
  const latest = attempts[0] || null;
  const scored = EXAM_SKILLS.map((skill) => latestBySection[skill.key]).filter(Boolean);
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
  if (shouldRevise && focus.key === "lesen" && Array.isArray(focusResult?.sectionScores)) {
    const ranked = [...focusResult.sectionScores]
      .filter((part) => finite(part.total) > 0 && finite(part.score) !== null)
      .sort((a, b) => Number(a.score) / Number(a.total) - Number(b.score) / Number(b.total));
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
