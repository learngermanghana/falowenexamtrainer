import { collection, db, getDoc, getDocs, doc, query, where } from "../firebase";
import { courseSchedulesByName } from "../data/courseSchedules";

const parseAssignmentNumber = (assignment = "") => {
  const match = assignment.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
};

const toDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const unique = (arr) => Array.from(new Set(arr));

const loadScores = async ({ studentCode } = {}) => {
  const scoresRef = collection(db, "scores");
  const constraints = [];
  if (studentCode) {
    constraints.push(where("studentcode", "==", studentCode));
  }
  const snapshot = await getDocs(constraints.length ? query(scoresRef, ...constraints) : scoresRef);
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
};

const loadStudent = async (studentCode) => {
  if (!studentCode) return null;
  const ref = doc(db, "students", studentCode);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: ref.id, ...snap.data() } : null;
};

const computeLeaderboard = (scores = []) => {
  const perLevel = {};

  scores.forEach((row) => {
    const level = (row.level || "").toUpperCase();
    if (!level) return;
    if (!perLevel[level]) perLevel[level] = {};

    const studentCode = (row.studentcode || row.studentCode || "").toLowerCase();
    if (!studentCode) return;

    const studentEntry = perLevel[level][studentCode] || {
      studentcode: studentCode,
      name: row.name || "Unbekannt",
      bestScores: {},
    };

    const assignment = row.assignment || "";
    const currentBest = studentEntry.bestScores[assignment] || 0;
    const score = Number(row.score) || 0;
    if (score > currentBest) {
      studentEntry.bestScores[assignment] = score;
    }

    perLevel[level][studentCode] = studentEntry;
  });

  const leaderboard = {};

  Object.entries(perLevel).forEach(([level, students]) => {
    const rows = Object.values(students)
      .map((entry) => {
        const assignments = Object.keys(entry.bestScores);
        const completions = assignments.length;
        const totalScore = assignments.reduce(
          (sum, assignment) => sum + (entry.bestScores[assignment] || 0),
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
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    leaderboard[level] = rows;
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
  const classSchedule = student?.className
    ? courseSchedulesByName[student.className]
    : null;

  const bestPerAssignment = {};
  const attemptsByAssignment = {};
  const submissionDates = [];

  scores.forEach((row) => {
    const assignment = row.assignment || "";
    const score = Number(row.score) || 0;
    const date = row.date || row.created_at;
    const asDate = toDate(date);
    if (asDate) submissionDates.push(asDate);

    bestPerAssignment[assignment] = Math.max(bestPerAssignment[assignment] || 0, score);
    attemptsByAssignment[assignment] = (attemptsByAssignment[assignment] || 0) + 1;
  });

  const failedAssignments = Object.entries(bestPerAssignment)
    .filter(([, score]) => score < 60)
    .map(([assignment]) => assignment);

  const completedNumbers = Object.keys(bestPerAssignment)
    .map(parseAssignmentNumber)
    .filter((value) => typeof value === "number");

  const completedAssignments = Object.entries(bestPerAssignment).map(([assignment, score]) => ({
    assignment,
    bestScore: score,
    number: parseAssignmentNumber(assignment),
    attempts: attemptsByAssignment[assignment] || 0,
  }));

  let missedAssignments = [];
  if (classSchedule) {
    const plannedNumbers = classSchedule.days
      .flatMap((day) => day.sessions || [])
      .map((session) => parseAssignmentNumber(session.chapter))
      .filter((value) => typeof value === "number");
    const latestCompleted = completedNumbers.length ? Math.max(...completedNumbers) : null;
    if (latestCompleted !== null) {
      missedAssignments = plannedNumbers
        .filter((number) => number <= latestCompleted && !completedNumbers.includes(number))
        .sort((a, b) => a - b)
        .map((num) => num.toString());
    }
  }

  const today = new Date();
  const weekday = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - (weekday - 1));

  const weeklyAttempts = scores.filter((row) => {
    const date = toDate(row.date || row.created_at);
    return date && date >= monday;
  });
  const weeklyAssignments = unique(weeklyAttempts.map((row) => row.assignment || "")).filter(Boolean);
  const weeklyRetryCount = weeklyAttempts.reduce((count, row) => {
    const assignment = row.assignment || "";
    const attempts = weeklyAttempts.filter((r) => (r.assignment || "") === assignment).length;
    return count + (attempts > 1 ? 1 : 0);
  }, 0);

  const latest = scores
    .slice()
    .sort((a, b) => (toDate(b.date || b.created_at) || 0) - (toDate(a.date || a.created_at) || 0))[0];

  return {
    studentCode,
    level: (student?.level || "").toUpperCase(),
    failedAssignments,
    missedAssignments,
    streakDays: computeStreak(submissionDates),
    weekAssignments: weeklyAssignments.length,
    weekAttempts: weeklyAttempts.length,
    retriesThisWeek: weeklyRetryCount,
    lastAssignment: latest?.assignment || null,
    completedAssignments,
  };
};

export const fetchAssignmentSummary = async ({ studentCode } = {}) => {
  const [scores, student] = await Promise.all([
    loadScores({}),
    loadStudent(studentCode),
  ]);

  const leaderboard = computeLeaderboard(scores);
  const studentScores = scores.filter(
    (row) => (row.studentcode || row.studentCode || "").toLowerCase() === (studentCode || "").toLowerCase()
  );
  const studentStats = studentCode ? computeStudentStats(studentScores, student) : null;

  return {
    leaderboard,
    student: studentStats,
  };
};
