import { db, doc, getDoc } from "../firebase";
import { fetchResults } from "./resultsService";
import {
  buildAssignmentCatalogForLevel,
  resolveAssignmentCanonicalKey,
  resolveAssignmentMatchKey,
} from "../utils/assignmentIdentity";

const PASS_MARK = 60;

const toDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const unique = (arr) => Array.from(new Set(arr));

const normalizeStudentCode = (value) => String(value || "").trim().toLowerCase();

const loadStudent = async (studentCode) => {
  if (!studentCode) return null;

  const ref = doc(db, "students", studentCode);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: ref.id, ...snap.data() } : null;
};

const normalizeResultRow = (row = {}) => ({
  ...row,
  studentCode: row.studentCode || row.studentcode || "",
  assignment: row.assignment || "",
  level: String(row.level || "").toUpperCase(),
  score: Number(row.score) || 0,
  date: row.date || row.created_at || "",
});

const computeLeaderboard = (scores = []) => {
  const perLevel = {};

  scores.forEach((row) => {
    const level = (row.level || "").toUpperCase();
    if (!level) return;

    if (!perLevel[level]) perLevel[level] = {};

    const studentCode = normalizeStudentCode(row.studentCode || row.studentcode);
    if (!studentCode) return;

    const canonicalAssignmentKey = resolveAssignmentCanonicalKey({
      level,
      assignmentId:
        row.assignmentKey ||
        row.canonicalAssignmentKey ||
        row.assignmentId ||
        row.assignment_id,
      assignmentTitle: row.assignment || "",
    });

    const studentEntry = perLevel[level][studentCode] || {
      studentcode: studentCode,
      name: row.name || "Unbekannt",
      bestScores: {},
    };

    const score = Number(row.score) || 0;
    const bucketKey = canonicalAssignmentKey || row.assignment || "UNKNOWN";
    const currentBest = studentEntry.bestScores[bucketKey] || 0;

    if (score > currentBest) {
      studentEntry.bestScores[bucketKey] = score;
    }

    perLevel[level][studentCode] = studentEntry;
  });

  const leaderboard = {};

  Object.entries(perLevel).forEach(([level, students]) => {
    leaderboard[level] = Object.values(students)
      .map((entry) => {
        const passedAssignments = Object.entries(entry.bestScores).filter(
          ([, score]) => Number(score) >= PASS_MARK
        );

        const completions = passedAssignments.length;
        const totalScore = passedAssignments.reduce(
          (sum, [, score]) => sum + (Number(score) || 0),
          0
        );

        return {
          ...entry,
          completions,
          totalScore,
        };
      })
      .filter((entry) => entry.completions >= 3)
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.completions !== a.completions) return b.completions - a.completions;
        return (a.name || "").localeCompare(b.name || "");
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  });

  return leaderboard;
};

const computeStreak = (dates = []) => {
  if (!dates.length) return 0;

  const sorted = unique(dates)
    .map(toDate)
    .filter(Boolean)
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let cursor = today;

  for (const date of sorted) {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    if (day.getTime() === cursor.getTime()) {
      streak += 1;
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() - 1);
    } else if (day.getTime() === cursor.getTime() - 24 * 60 * 60 * 1000) {
      streak += 1;
      cursor = new Date(day);
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const computeStudentStats = (scores = [], student) => {
  const studentCode = student?.id || "";
  const level = String(student?.level || "").toUpperCase();
  const catalog = buildAssignmentCatalogForLevel(level);

  const bestPerCanonicalAssignment = {};
  const attemptsByCanonicalAssignment = {};
  const bestPerMatchKey = {};
  const submissionDates = [];

  scores.forEach((row) => {
    const score = Number(row.score) || 0;
    const date = row.date || row.created_at;
    const asDate = toDate(date);
    if (asDate) submissionDates.push(asDate);

    const canonicalAssignmentKey = resolveAssignmentCanonicalKey({
      level: row.level || level,
      assignmentId:
        row.assignmentKey ||
        row.canonicalAssignmentKey ||
        row.assignmentId ||
        row.assignment_id,
      assignmentTitle: row.assignment || "",
    });

    const matchKey = resolveAssignmentMatchKey({
      level: row.level || level,
      assignmentId:
        row.assignmentKey ||
        row.canonicalAssignmentKey ||
        row.assignmentId ||
        row.assignment_id,
      assignmentTitle: row.assignment || "",
    });

    const canonicalBucket = canonicalAssignmentKey || row.assignment || "UNKNOWN";

    bestPerCanonicalAssignment[canonicalBucket] = Math.max(
      bestPerCanonicalAssignment[canonicalBucket] || 0,
      score
    );

    attemptsByCanonicalAssignment[canonicalBucket] =
      (attemptsByCanonicalAssignment[canonicalBucket] || 0) + 1;

    if (matchKey) {
      bestPerMatchKey[matchKey] = Math.max(bestPerMatchKey[matchKey] || 0, score);
    }
  });

  const completedMatchKeys = new Set(
    Object.entries(bestPerMatchKey)
      .filter(([, score]) => Number(score) >= PASS_MARK)
      .map(([key]) => key)
  );

  const failedMatchKeys = new Set(
    Object.entries(bestPerMatchKey)
      .filter(([, score]) => Number(score) < PASS_MARK)
      .map(([key]) => key)
  );

  const failedAssignments = Object.entries(bestPerCanonicalAssignment)
    .filter(([, score]) => score < PASS_MARK)
    .map(([assignmentKey]) => assignmentKey);

  const completedAssignments = Object.entries(bestPerCanonicalAssignment)
    .filter(([, score]) => score >= PASS_MARK)
    .map(([assignmentKey, score]) => {
      const catalogEntry = catalog.find(
        (entry) =>
          entry.canonicalAssignmentId === assignmentKey ||
          entry.assignmentKey === assignmentKey
      );

      return {
        assignment: catalogEntry?.label || assignmentKey,
        assignmentKey,
        bestScore: score,
        label: catalogEntry?.label || assignmentKey,
        day: catalogEntry?.day ?? null,
        attempts: attemptsByCanonicalAssignment[assignmentKey] || 0,
      };
    })
    .sort((a, b) => {
      const dayA = Number.isFinite(a.day) ? a.day : Number.MAX_SAFE_INTEGER;
      const dayB = Number.isFinite(b.day) ? b.day : Number.MAX_SAFE_INTEGER;
      return dayA - dayB;
    });

  const dayStatusMap = catalog.reduce((acc, entry) => {
    if (!Number.isFinite(entry.day)) return acc;

    const day = entry.day;
    const current = acc.get(day) || {
      isCompleted: true,
      hasFailed: false,
    };

    const isPassed = completedMatchKeys.has(entry.matchKey);
    const isFailed = failedMatchKeys.has(entry.matchKey);

    current.isCompleted = current.isCompleted && isPassed;
    current.hasFailed = current.hasFailed || isFailed;
    acc.set(day, current);

    return acc;
  }, new Map());

  const sortedDayNumbers = Array.from(dayStatusMap.keys()).sort((a, b) => a - b);
  let lastFullyCompletedDay = 0;

  for (const dayNumber of sortedDayNumbers) {
    const dayStatus = dayStatusMap.get(dayNumber);
    if (!dayStatus?.isCompleted || dayStatus?.hasFailed) break;
    lastFullyCompletedDay = dayNumber;
  }

  const missedAssignments = catalog
    .filter((entry) => {
      const dayStatus = dayStatusMap.get(entry.day);
      return (
        Number.isFinite(entry.day) &&
        entry.day <= lastFullyCompletedDay &&
        !dayStatus?.isCompleted &&
        !dayStatus?.hasFailed
      );
    })
    .map((entry) => ({
      day: entry.day,
      label: entry.label,
      assignmentId: entry.assignmentId,
      assignmentKey: entry.canonicalAssignmentId,
      matchKey: entry.matchKey,
    }));

  const recommendationBlocked = catalog.some((entry) => failedMatchKeys.has(entry.matchKey));

  const nextRecommendedAssignment = recommendationBlocked
    ? null
    : catalog.find((entry) => !completedMatchKeys.has(entry.matchKey)) || null;

  const today = new Date();
  const weekday = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - (weekday - 1));

  const weeklyAttempts = scores.filter((row) => {
    const date = toDate(row.date || row.created_at);
    return date && date >= monday;
  });

  const weeklyCanonicalAssignments = unique(
    weeklyAttempts
      .map(
        (row) =>
          resolveAssignmentCanonicalKey({
            level: row.level || level,
            assignmentId:
              row.assignmentKey ||
              row.canonicalAssignmentKey ||
              row.assignmentId ||
              row.assignment_id,
            assignmentTitle: row.assignment || "",
          }) || row.assignment || ""
      )
      .filter(Boolean)
  );

  const retryBuckets = weeklyAttempts.reduce((acc, row) => {
    const key =
      resolveAssignmentCanonicalKey({
        level: row.level || level,
        assignmentId:
          row.assignmentKey ||
          row.canonicalAssignmentKey ||
          row.assignmentId ||
          row.assignment_id,
        assignmentTitle: row.assignment || "",
      }) ||
      row.assignment ||
      "UNKNOWN";

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const retriesThisWeek = Object.values(retryBuckets).filter((count) => count > 1).length;

  const latest = scores
    .slice()
    .sort(
      (a, b) =>
        (toDate(b.date || b.created_at)?.getTime() || 0) -
        (toDate(a.date || a.created_at)?.getTime() || 0)
    )[0];

  return {
    studentCode,
    level,
    failedAssignments,
    missedAssignments,
    nextRecommendedAssignment,
    recommendationBlocked,
    streakDays: computeStreak(submissionDates),
    weekAssignments: weeklyCanonicalAssignments.length,
    weekAttempts: weeklyAttempts.length,
    retriesThisWeek,
    lastAssignment: latest?.assignment || null,
    completedAssignments,
  };
};

export const fetchAssignmentSummary = async ({ studentCode, resultsRows } = {}) => {
  const [student, fetchedResults] = await Promise.all([
    loadStudent(studentCode),
    resultsRows
      ? Promise.resolve({
          results: resultsRows.map(normalizeResultRow),
        })
      : fetchResults({ studentCode }),
  ]);

  const allRows = (fetchedResults?.results || []).map(normalizeResultRow);

  const leaderboard = computeLeaderboard(allRows);

  const studentRows = allRows.filter(
    (row) => normalizeStudentCode(row.studentCode) === normalizeStudentCode(studentCode)
  );

  const studentStats = studentCode ? computeStudentStats(studentRows, student) : null;

  return {
    leaderboard,
    student: studentStats,
  };
};
