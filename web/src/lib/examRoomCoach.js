export const EXAM_SKILLS = Object.freeze([
  { key: "lesen", title: "Lesen", description: "Reading", path: "/exams/lesen" },
  { key: "hoeren", title: "Hören", description: "Listening", path: "/exams/horen" },
  { key: "schreiben", title: "Schreiben", description: "Writing", path: "/exams/writing" },
  { key: "sprechen", title: "Sprechen", description: "Speaking", path: "/exams/speaking" },
]);

const finite = (value) => {
  if (value === null || value === undefined || typeof value === "boolean" || (typeof value === "string" && !value.trim())) return null;
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

// Other skills may report different part sizes. Never infer denominators from
// raw part points or compare unscored parts. Lesen retains its known legacy formats.
export const normalizeSkillPartScores = (row = {}) => {
  const section = normalizedSection(row);
  const parts = section === "lesen" ? normalizeReadingPartScores(row) : row.sectionScores;
  const entries = Array.isArray(parts) ? parts : Object.entries(parts || {}).map(([key, value]) =>
    value && typeof value === "object" ? { ...value, key } : null);
  return entries.filter(part => part && typeof part === "object").map(part => ({
    label: String(part.label || readingPartLabel(part.key) || "").trim(),
    score: finite(part.score),
    total: finite(part.total ?? part.maxScore),
  })).filter(part => part.label && part.score !== null && part.total > 0 && part.score >= 0 && part.score <= part.total);
};

const weakestPartFor = attempt => {
  const parts = Array.isArray(attempt?.sectionScores) ? attempt.sectionScores : [];
  return [...parts].sort((a,b) => a.score/a.total - b.score/b.total)[0]?.label || "";
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
    if (!skill || part.assessed === false || part.verified === false || ["unassessed", "not_assessed", "pending", "unanswered", "incomplete"].includes(String(part.status || "").toLowerCase()) || score === null || max === null || max <= 0 || score < 0 || score > max) return null;
    return {
      id: `${attempt.id}:${key}`,
      section: key,
      level: attempt.level,
      percent: Math.round(Math.max(0, Math.min(100, (score / max) * 100))),
      route: skill.path,
      completedAt: attempt.completedAt,
      title: `${attempt.title} · ${skill.title}`,
      sectionScores: normalizeSkillPartScores({ section: key, level: attempt.level, sectionScores: part.partScores || part.sectionScores || [] }),
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
    if (row.assessed === false || ["draft", "in_progress", "incomplete", "unassessed", "not_assessed", "pending"].includes(String(row.status || "").toLowerCase())) return;
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
      sectionScores: section === "mixed" ? row?.sectionScores || null : normalizeSkillPartScores(row),
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

  // Derive trends from verified, scored history already loaded for this level.
  // Full mocks contribute their per-section results once, not as four extra attempts.
  const historyBySection = Object.fromEntries(EXAM_SKILLS.map((skill) => [skill.key, []]));
  attempts.forEach((attempt) => {
    const entries = attempt.section === "mixed" ? mockSectionPercents(attempt) : [attempt];
    entries.forEach((entry) => {
      if (historyBySection[entry.section]) historyBySection[entry.section].push(entry.percent);
    });
  });
  const skillTrends = Object.fromEntries(EXAM_SKILLS.map((skill) => {
    const scores = historyBySection[skill.key]; // newest first
    const latestScore = scores[0] ?? null;
    const previousScore = scores[1] ?? null;
    return [skill.key, {
      count: scores.length,
      latest: latestScore,
      previous: previousScore,
      change: previousScore === null ? null : latestScore - previousScore,
      average: scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null,
    }];
  }));

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

  const weakPart = shouldRevise ? weakestPartFor(focusResult) : "";
  const overallPercent = coveredSkills === EXAM_SKILLS.length
    ? Math.round(scored.reduce((sum, entry) => sum + entry.percent, 0) / EXAM_SKILLS.length) : null;
  const mockHistory = attempts.filter(attempt => attempt.section === "mixed" && attempt.resultType === "final_mock");
  const practiceHistory = attempts.filter(attempt => !mockHistory.includes(attempt));

  return {
    attempts,
    latest,
    latestBySection,
    skillTrends,
    overallPercent,
    mockHistory,
    practiceHistory,
    missingSkills: EXAM_SKILLS.filter(skill => !latestBySection[skill.key]),
    weakParts: Object.fromEntries(EXAM_SKILLS.map(skill => [skill.key, weakestPartFor(latestBySection[skill.key])])),
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

// Access comes from the existing route guard, not the calculated score.
export function examNextActivity(coach, trialExam) {
  if (trialExam) {
    if (!trialExam.locked && trialExam.id && trialExam.route) return {
      title: "Your included trial practice", reason: "Start or resume the practice included with your trial. Other skills remain locked.", route: trialExam.route,
    };
    return { title: "Explore available exams", reason: "Browse the catalogue. New assessed practice requires active access.", route: "/exams/mocks" };
  }
  return { ...coach.focus, route: coach.focus.path };
}
