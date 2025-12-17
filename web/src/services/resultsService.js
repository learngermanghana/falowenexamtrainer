import { collection, db, getDocs, query, where } from "../firebase";

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const loadScores = async ({ level, studentCode } = {}) => {
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

export const fetchResults = async ({ level, studentCode } = {}) => {
  const scores = await loadScores({ level, studentCode });
  const results = buildResults(scores);
  const summary = summarizeResults(results);
  return {
    results,
    summary,
    fetchedAt: new Date().toISOString(),
  };
};
