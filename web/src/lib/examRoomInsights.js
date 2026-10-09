import { EXAM_SKILLS, normalizeReadingPartScores } from "./examRoomCoach";

const SKILL_GUIDANCE = {
  lesen: [
    "Read the question first, then underline the sentence that proves your answer.",
    "Check each answer against the text. Distractors often repeat words but change the meaning.",
  ],
  hoeren: [
    "Listen once for the situation, then for names, numbers, times and corrections.",
    "Practise short audio clips and check why the other options are wrong.",
  ],
  schreiben: [
    "Check that every requested point is covered before polishing grammar.",
    "Revise greeting, register, verb position and a clear closing sentence.",
  ],
  sprechen: [
    "Answer aloud in full sentences and respond to the examiner or partner.",
    "Record a short answer, then review your transcript and task-specific feedback after marking.",
  ],
};

const asNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const partName = (key) => {
  const skill = EXAM_SKILLS.find((entry) => entry.key === String(key || "").toLowerCase());
  return skill?.title || "";
};

export const getAttemptBreakdown = (attempt = {}) => {
  if (attempt.section === "mixed" && attempt.resultType === "final_mock") {
    const raw = Array.isArray(attempt.scoreBreakdown) && attempt.scoreBreakdown.length
      ? attempt.scoreBreakdown
      : Object.entries(attempt.sectionScores || {}).map(([key, score]) => ({
        key, score, maxScore: 25,
      }));
    return raw.map((part) => {
      const label = partName(part.key);
      const score = asNumber(part.score);
      const total = asNumber(part.maxScore ?? part.total);
      if (!label || score === null || total === null || total <= 0 || score < 0 || score > total) return null;
      return { label, score, total, percent: Math.round((score / total) * 100) };
    }).filter(Boolean);
  }

  if (attempt.section === "lesen") {
    return normalizeReadingPartScores(attempt).map((part) => {
      if (part.score < 0 || part.score > part.total) return null;
      return { ...part, percent: Math.round((part.score / part.total) * 100) };
    }).filter(Boolean);
  }
  return [];
};

const coachTip = (key, index = 0) =>
  (SKILL_GUIDANCE[key] || SKILL_GUIDANCE.lesen)[index % 2];

export const buildExamRoomInsights = (coach = {}, level = "A1") => {
  const attempts = Array.isArray(coach.attempts) ? coach.attempts : [];
  // Only published, server-scored full mocks can contribute to the mock trend.
  const verifiedMocks = attempts.filter((attempt) =>
    attempt.section === "mixed" && attempt.resultType === "final_mock" &&
    Number.isFinite(attempt.percent) && Boolean(attempt.completedAt));
  const trend = verifiedMocks.slice(0, 5).reverse().map((attempt, index) => ({
    id: attempt.id || String(index),
    label: `Mock ${index + 1}`,
    percent: attempt.percent,
    completedAt: attempt.completedAt,
  }));
  const latestMock = verifiedMocks[0] || null;
  const latestParts = latestMock ? getAttemptBreakdown(latestMock) : [];
  const weakestMockPart = [...latestParts].sort((a, b) => a.percent - b.percent)[0] || null;
  const hasFourParts = latestParts.length === 4;
  const evidenceLabel = !latestMock ? "Not assessed" :
    !hasFourParts ? "Partial evidence" :
      verifiedMocks.length < 2 ? "One complete mock" : "Multiple scored mocks";
  const evidenceText = !latestMock
    ? "Complete a server-scored full mock to begin tracking exam performance. Practice coverage alone is not readiness."
    : !hasFourParts
      ? "This result does not include all four verified skill scores. It cannot support a full exam-readiness judgment."
      : verifiedMocks.length < 2
        ? "One complete mock is a starting point. Complete another to see whether your performance is consistent."
        : "Compare your scored mock trend and section scores. This is study evidence, not a Goethe pass prediction.";

  const focus = coach.focus || EXAM_SKILLS[0];
  const primary = EXAM_SKILLS.find((skill) => skill.key === focus.key) || EXAM_SKILLS[0];
  const otherSkills = EXAM_SKILLS.filter((skill) => skill.key !== primary.key);
  const order = [primary, otherSkills[0], otherSkills[1], primary, otherSkills[2], primary];
  const weeklyPlan = order.map((skill, index) => {
    const score = coach.latestBySection?.[skill.key]?.percent;
    const detail = index === 0 && focus.weakPart
      ? `Start with ${focus.weakPart}. ${coachTip(skill.key, index)}`
      : coachTip(skill.key, index);
    return {
      day: index + 1,
      title: skill.title,
      route: skill.path,
      detail,
      status: Number.isFinite(score) ? `Latest recorded: ${score}%` : "No recorded skill score yet",
    };
  });
  weeklyPlan.push({
    day: 7,
    title: "Review and recheck",
    route: latestMock ? "/exams/mocks" : primary.path,
    detail: latestMock
      ? "Review your weakest section and take a new full mock only when ready. Compare the verified results."
      : "Repeat your weakest practice and compare it with your earlier score. A full mock is the next milestone.",
    status: "Track your progress; scores are not guarantees",
  });

  return {
    level: String(level || "A1").toUpperCase(),
    evidenceLabel,
    evidenceText,
    trend,
    latestParts,
    weakestMockPart,
    weeklyPlan,
    skillScores: EXAM_SKILLS.map((skill) => ({
      ...skill,
      percent: coach.latestBySection?.[skill.key]?.percent ?? null,
    })),
  };
};
