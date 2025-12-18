import { collection, db, getDocs, query, where } from "../firebase";
import { courseSchedules } from "../data/courseSchedule";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const scoresApiBase =
  process.env.REACT_APP_SCORES_API_URL ||
  backendUrl ||
  "https://falowenexamtrainer.vercel.app";

const LEVEL_ASSIGNMENT_TARGET_OVERRIDES = {
  A1: 19,
};

const normalizeCode = (value) => (value || "").toString().trim().toLowerCase();
const normalizeLevel = (value) => (value || "").toString().trim().toUpperCase();

const average = (values = []) => {
  const numeric = values.map(Number).filter((value) => Number.isFinite(value));
  if (!numeric.length) return null;
  const sum = numeric.reduce((total, value) => total + value, 0);
  return Number((sum / numeric.length).toFixed(2));
};

const toIdentifier = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toString() : null;
};

const parseIdentifiers = (text, fallback) => {
  const matches = (text || "").match(/\d+(?:\.\d+)?/g);
  if (matches?.length) return matches.map(toIdentifier).filter(Boolean);
  const fallbackId = toIdentifier(fallback);
  return fallbackId ? [fallbackId] : [];
};

const collectAssignmentsFromSchedule = (level) => {
  const schedule = courseSchedules?.[level] || [];
  const assignments = new Map();

  const addAssignment = ({ identifier, day, label }) => {
    if (!identifier || assignments.has(identifier)) return;
    assignments.set(identifier, {
      identifier,
      day: typeof day === "number" ? day : null,
      label: label || `Kapitel ${identifier}`,
    });
  };

  const inspectLesson = (lesson, parentDay, parentLabel) => {
    if (!lesson) return;
    if (Array.isArray(lesson)) {
      lesson.forEach((entry) => inspectLesson(entry, parentDay, parentLabel));
      return;
    }
    if (!lesson.assignment) return;

    const identifiers = parseIdentifiers(lesson.chapter || lesson.topic, parentDay);
    identifiers.forEach((identifier) =>
      addAssignment({
        identifier,
        day: parentDay,
        label: lesson.chapter || lesson.topic || parentLabel,
      })
    );
  };

  schedule.forEach((entry) => {
    const isGoetheTopic = /goethe/i.test(entry.topic || "");
    if (isGoetheTopic) return;

    if (entry.assignment) {
      const identifiers = parseIdentifiers(entry.chapter || entry.day, entry.day);
      identifiers.forEach((identifier) =>
        addAssignment({
          identifier,
          day: entry.day,
          label: entry.chapter || entry.topic,
        })
      );
    }

    inspectLesson(entry.lesen_hören, entry.day, entry.chapter || entry.topic);
    inspectLesson(entry.schreiben_sprechen, entry.day, entry.chapter || entry.topic);
  });

  return Array.from(assignments.values()).sort((a, b) => {
    if (a.day !== null && b.day !== null && a.day !== b.day) return a.day - b.day;
    const aNum = Number(a.identifier);
    const bNum = Number(b.identifier);
    return aNum - bNum;
  });
};

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const fetchSheetScores = async ({ level, studentCode } = {}) => {
  if (!studentCode) return [];

  const params = new URLSearchParams();
  params.set("studentCode", studentCode);
  if (level && level !== "all") params.set("level", level.toUpperCase());

  const response = await fetch(`${scoresApiBase}/api/scores?${params.toString()}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load scores from sheet.");
  }

  const data = await response.json();
  return Array.isArray(data?.rows) ? data.rows : [];
};

const loadFirestoreScores = async ({ level, studentCode } = {}) => {
  const scoresRef = collection(db, "scores");
  const constraints = [];
  if (level && level !== "all") {
    constraints.push(where("level", "==", level.toUpperCase()));
  }
  if (studentCode) {
    constraints.push(where("studentcode", "==", studentCode));
  }
  const snapshot = await getDocs(constraints.length ? query(scoresRef, ...constraints) : scoresRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const loadScores = async ({ level, studentCode } = {}) => {
  if (!studentCode) return [];

  try {
    const sheetScores = await fetchSheetScores({ level, studentCode });
    return sheetScores;
  } catch (error) {
    console.error("Failed to fetch sheet scores", error);
    if (!db) throw error;
  }

  return loadFirestoreScores({ level, studentCode });
};

const buildResults = (scores = []) => {
  const attemptsTracker = {};

  const rows = scores
    .slice()
    .sort((a, b) => {
      const aDate = toDate(a.date || a.created_at) || 0;
      const bDate = toDate(b.date || b.created_at) || 0;
      return aDate - bDate;
    })
    .map((row) => {
      const key = `${row.studentcode || row.studentCode}::${row.assignment}`;
      attemptsTracker[key] = (attemptsTracker[key] || 0) + 1;
      const attemptNumber = attemptsTracker[key];
      return {
        assignment: row.assignment || "Assignment",
        studentCode: row.studentcode || row.studentCode || "",
        email: row.email || row.studentEmail || "",
        studentName: row.name || "",
        level: (row.level || "").toUpperCase(),
        date: row.date || row.created_at || "",
        score: toNumber(row.score, null),
        comments: row.comments || "",
        link: row.link || "",
        attempt: attemptNumber,
        isRetake: attemptNumber > 1,
      };
    })
    .sort((a, b) => {
      const aDate = toDate(a.date) || 0;
      const bDate = toDate(b.date) || 0;
      return bDate - aDate;
    });

  return rows;
};

const filterResultsForStudent = (rows = [], { studentCode, level } = {}) => {
  const targetCode = normalizeCode(studentCode);
  const targetLevel = normalizeLevel(level);
  const restrictLevel = targetLevel && targetLevel !== "ALL" ? targetLevel : null;

  return rows.filter((row) => {
    const rowCode = normalizeCode(row.studentCode);
    if (targetCode && rowCode !== targetCode) return false;

    const rowLevel = normalizeLevel(row.level);
    if (restrictLevel && rowLevel !== restrictLevel) return false;

    return true;
  });
};

const summarizeResults = (rows = []) => {
  const perLevel = {};
  const students = {};
  const allStudents = new Set();
  let retakes = 0;

  rows.forEach((row) => {
    const level = row.level || "Unknown";
    perLevel[level] = (perLevel[level] || 0) + 1;

    const code = (row.studentCode || "").toLowerCase();
    if (code) {
      if (!students[level]) students[level] = new Set();
      students[level].add(code);
      allStudents.add(code);
    }

    if (row.isRetake) retakes += 1;
  });

  const studentsPerLevel = Object.fromEntries(
    Object.entries(students).map(([level, codes]) => [level, codes.size])
  );

  return {
    total: rows.length,
    perLevel,
    studentsPerLevel,
    uniqueStudents: allStudents.size,
    retakes,
  };
};

const buildStudentMetrics = ({ level, studentCode, results }) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedCode = normalizeCode(studentCode);

  const assignments = normalizedLevel ? collectAssignmentsFromSchedule(normalizedLevel) : [];
  const assignmentIndex = Object.fromEntries(
    assignments.map((entry) => [entry.identifier, entry])
  );

  const relevantRows = results.filter((row) => {
    const matchesLevel = normalizedLevel
      ? (row.level || "").toUpperCase() === normalizedLevel
      : true;
    const matchesCode = normalizedCode
      ? (row.studentCode || "").toLowerCase() === normalizedCode
      : true;
    return matchesLevel && matchesCode;
  });

  const bestPerIdentifier = {};

  relevantRows.forEach((row) => {
    const identifiers = parseIdentifiers(row.assignment, row.assignment);
    identifiers.forEach((identifier) => {
      const score = Number(row.score);
      if (!Number.isFinite(score)) return;
      const currentBest = bestPerIdentifier[identifier];
      if (currentBest === undefined || score > currentBest) {
        bestPerIdentifier[identifier] = score;
      }
    });
  });

  const bestScores = Object.values(bestPerIdentifier).filter((value) =>
    Number.isFinite(value)
  );
  const completedIdentifiers = Object.entries(bestPerIdentifier)
    .filter(([, score]) => Number.isFinite(score) && score >= 60)
    .map(([identifier]) => identifier);
  const failedIdentifiers = Object.entries(bestPerIdentifier)
    .filter(([, score]) => Number.isFinite(score) && score < 60)
    .map(([identifier]) => identifier);

  const highestCompletedDay = completedIdentifiers.reduce((max, identifier) => {
    const assignment = assignmentIndex[identifier];
    if (!assignment || assignment.day === null || assignment.day === undefined)
      return max;
    if (max === null) return assignment.day;
    return Math.max(max, assignment.day);
  }, null);

  const missed = assignments.filter((assignment) => {
    if (highestCompletedDay === null) return false;
    if (assignment.day === null) return false;
    const isCompleted = completedIdentifiers.includes(assignment.identifier);
    const isFailed = failedIdentifiers.includes(assignment.identifier);
    return assignment.day <= highestCompletedDay && !isCompleted && !isFailed;
  });

  const isBlockedForRework = failedIdentifiers.length > 0;
  let next = null;

  if (!isBlockedForRework) {
    next = assignments.find((assignment) => {
      const isCompleted = completedIdentifiers.includes(assignment.identifier);
      const isFailed = failedIdentifiers.includes(assignment.identifier);
      if (isCompleted || isFailed) return false;
      if (highestCompletedDay === null || assignment.day === null)
        return true;
      return assignment.day > highestCompletedDay;
    });
  }

  const targetOverride = LEVEL_ASSIGNMENT_TARGET_OVERRIDES[normalizedLevel];
  const targetTotal = targetOverride ?? assignments.length;
  const completedCount = completedIdentifiers.length;

  return {
    level: normalizedLevel,
    studentCode: normalizedCode,
    assignments,
    scheduleCount: assignments.length,
    targetTotal,
    targetOverride,
    completedCount,
    remaining: Math.max(targetTotal - completedCount, 0),
    averageScore: average(Object.values(bestPerIdentifier)),
    bestScore: bestScores.length ? Math.max(...bestScores) : null,
    missed,
    failed: failedIdentifiers.map((identifier) =>
      assignmentIndex[identifier] || {
        identifier,
        label: `Kapitel ${identifier}`,
        day: null,
      }
    ),
    next: next || null,
    isBlockedForRework,
  };
};

export const fetchResults = async ({ level, studentCode } = {}) => {
  const scores = await loadScores({ level, studentCode });
  const results = filterResultsForStudent(buildResults(scores), { level, studentCode });
  const summary = summarizeResults(results);
  const metrics = buildStudentMetrics({ level, studentCode, results });
  const assignments = collectAssignmentsFromSchedule(normalizeLevel(level));

  return {
    results,
    summary,
    metrics,
    assignments,
    fetchedAt: new Date().toISOString(),
  };
};
