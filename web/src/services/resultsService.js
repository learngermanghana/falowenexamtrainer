import { collection, db, doc, getDoc, getDocs, query, where } from "../firebase";

const normalizeString = (value) => value?.toString().trim();
const normalizeStudentCode = (value) => normalizeString(value)?.toLowerCase();
const normalizeEmail = (value) => normalizeString(value)?.toLowerCase();

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
    const levelOptions = Array.from(
      new Set(
        [level, level?.toUpperCase(), level?.toLowerCase()]
          .map(normalizeString)
          .filter(Boolean)
      )
    );

    constraints.push(
      levelOptions.length > 1
        ? where("level", "in", levelOptions)
        : where("level", "==", levelOptions[0])
    );
  }
  if (studentCode) {
    const normalizedCodes = Array.from(
      new Set(
        [studentCode, studentCode?.toLowerCase(), studentCode?.toUpperCase()]
          .map(normalizeString)
          .filter(Boolean)
      )
    );

    constraints.push(
      normalizedCodes.length > 1
        ? where("studentcode", "in", normalizedCodes)
        : where("studentcode", "==", normalizedCodes[0])
    );
  }
  const snapshot = await getDocs(constraints.length ? query(scoresRef, ...constraints) : scoresRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const loadStudentProfile = async ({ studentCode, email } = {}) => {
  const normalizedCode = normalizeStudentCode(studentCode);
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedCode && !normalizedEmail) return null;

  if (normalizedCode) {
    const directRef = doc(db, "students", normalizedCode);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return { id: directSnap.id, ...directSnap.data() };
    }

    const studentsRef = collection(db, "students");
    const byCodeSnap = await getDocs(query(studentsRef, where("studentCode", "==", normalizedCode)));
    if (!byCodeSnap.empty) {
      const first = byCodeSnap.docs[0];
      return { id: first.id, ...first.data() };
    }

    const byLegacyCodeSnap = await getDocs(query(studentsRef, where("studentcode", "==", normalizedCode)));
    if (!byLegacyCodeSnap.empty) {
      const first = byLegacyCodeSnap.docs[0];
      return { id: first.id, ...first.data() };
    }
  }

  if (normalizedEmail) {
    const studentsRef = collection(db, "students");
    const byEmailSnap = await getDocs(query(studentsRef, where("email", "==", normalizedEmail)));
    if (!byEmailSnap.empty) {
      const first = byEmailSnap.docs[0];
      return { id: first.id, ...first.data() };
    }
  }

  return null;
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
      const normalizedCode = normalizeStudentCode(
        row.studentcode || row.studentCode
      ) || "";
      const normalizedAssignment = normalizeString(row.assignment) || "Assignment";
      const key = `${normalizedCode}::${normalizedAssignment}`;
      attemptsTracker[key] = (attemptsTracker[key] || 0) + 1;
      const attemptNumber = attemptsTracker[key];
      return {
        assignment: normalizedAssignment,
        studentCode: normalizeString(row.studentcode || row.studentCode) || "",
        studentName: normalizeString(row.name) || "",
        level: (row.level || "").toUpperCase(),
        date: normalizeString(row.date || row.created_at) || "",
        score: toNumber(row.score, null),
        comments: normalizeString(row.comments) || "",
        link: normalizeString(row.link) || "",
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

    const code = normalizeStudentCode(row.studentCode);
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

export const fetchResults = async ({ level, studentCode, email } = {}) => {
  const [scores, student] = await Promise.all([
    loadScores({ level, studentCode }),
    loadStudentProfile({ studentCode, email }),
  ]);
  const results = buildResults(scores);
  const summary = summarizeResults(results);
  return {
    results,
    summary,
    student,
    fetchedAt: new Date().toISOString(),
  };
};
