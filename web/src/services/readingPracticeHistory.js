export const READING_PRACTICE_HISTORY_KEY = "falowen:reading-practice-history:v1";

const safeRead = () => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(READING_PRACTICE_HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const safeWrite = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READING_PRACTICE_HISTORY_KEY, JSON.stringify(items));
  } catch (_error) {
    // Reading practice history should never block the practice flow.
  }
};

export const loadReadingPracticeHistory = () =>
  safeRead()
    .filter((item) => item && item.level && item.setId)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());

export const getReadingPracticeStudentKey = ({ studentProfile = null, user = null } = {}) =>
  String(
    studentProfile?.id ||
      studentProfile?.studentCode ||
      studentProfile?.studentcode ||
      user?.uid ||
      user?.email ||
      "local-student",
  )
    .trim()
    .toLowerCase();

export const getReadingPracticeHistory = (level = "", studentKey = "") => {
  const normalized = String(level || "").toUpperCase();
  const normalizedStudentKey = String(studentKey || "").trim().toLowerCase();
  return loadReadingPracticeHistory().filter(
    (item) =>
      (!normalized || String(item.level || "").toUpperCase() === normalized) &&
      (!normalizedStudentKey || String(item.studentKey || "").toLowerCase() === normalizedStudentKey),
  );
};

export const getLatestReadingPracticeResult = (level = "", studentKey = "") =>
  getReadingPracticeHistory(level, studentKey)[0] || null;

export const saveReadingPracticeAttempt = ({
  level,
  setId,
  score,
  total,
  elapsedSeconds = null,
  sectionScores = [],
  studentKey = "local-student",
} = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedSetId = String(setId || "").trim();
  const normalizedStudentKey = String(studentKey || "local-student").trim().toLowerCase();
  const numericScore = Number(score);
  const numericTotal = Number(total);

  if (!normalizedLevel || !normalizedSetId || !Number.isFinite(numericScore) || !Number.isFinite(numericTotal) || numericTotal <= 0) {
    return null;
  }

  const history = loadReadingPracticeHistory();
  const previousAttempts = history.filter(
    (item) =>
      String(item.level || "").toUpperCase() === normalizedLevel &&
      String(item.setId || "") === normalizedSetId &&
      String(item.studentKey || "").toLowerCase() === normalizedStudentKey,
  ).length;

  const attempt = {
    id: `${normalizedLevel.toLowerCase()}-${normalizedSetId}-${Date.now()}`,
    type: "lesen",
    studentKey: normalizedStudentKey,
    level: normalizedLevel,
    setId: normalizedSetId,
    attemptNumber: previousAttempts + 1,
    score: numericScore,
    total: numericTotal,
    percent: Math.round((numericScore / numericTotal) * 100),
    elapsedSeconds: Number.isFinite(Number(elapsedSeconds)) ? Math.max(0, Number(elapsedSeconds)) : null,
    sectionScores: Array.isArray(sectionScores) ? sectionScores : [],
    completedAt: new Date().toISOString(),
  };

  safeWrite([attempt, ...history].slice(0, 100));
  return attempt;
};

export const getReadingReadinessLabel = (percent) => {
  const score = Number(percent) || 0;
  if (score >= 80) return "Strong";
  if (score >= 60) return "Developing";
  return "Practise again";
};

export const getWeakestReadingSection = (sectionScores = []) =>
  [...(Array.isArray(sectionScores) ? sectionScores : [])]
    .filter((section) => Number(section.total) > 0)
    .sort((a, b) => {
      const aPercent = Number(a.score || 0) / Math.max(1, Number(a.total || 0));
      const bPercent = Number(b.score || 0) / Math.max(1, Number(b.total || 0));
      return aPercent - bPercent;
    })[0] || null;
