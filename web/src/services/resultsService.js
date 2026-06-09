import { collection, db, doc, getDoc, getDocs, query, where } from "../firebase";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";

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

const normalizeLevels = (level) => {
  if (!level) return [];
  const rawLevels = Array.isArray(level) ? level : [level];
  return rawLevels
    .flatMap((entry) =>
      String(entry || "")
        .split(/[,\s/|]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .map((entry) => entry.toUpperCase());
};

const buildScoreQueryConstraints = ({ level, studentCode, studentCodeField = "studentcode" } = {}) => {
  const constraints = [];
  const normalizedLevels = normalizeLevels(level);
  if (normalizedLevels.length && !normalizedLevels.includes("ALL")) {
    const levelOptions = Array.from(
      new Set(
        normalizedLevels.flatMap((entry) => [
          entry,
          entry.toLowerCase(),
          entry.toUpperCase(),
        ])
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
        ? where(studentCodeField, "in", normalizedCodes)
        : where(studentCodeField, "==", normalizedCodes[0])
    );
  }

  return constraints;
};

const loadScores = async ({ level, studentCode } = {}) => {
  const scoresRef = collection(db, "scores");

  if (!studentCode) {
    const constraints = buildScoreQueryConstraints({ level });
    const snapshot = await getDocs(constraints.length ? query(scoresRef, ...constraints) : scoresRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  const [legacySnapshot, currentSnapshot] = await Promise.all([
    getDocs(query(scoresRef, ...buildScoreQueryConstraints({ level, studentCode, studentCodeField: "studentcode" }))),
    getDocs(query(scoresRef, ...buildScoreQueryConstraints({ level, studentCode, studentCodeField: "studentCode" }))),
  ]);

  const uniqueRows = new Map();
  [legacySnapshot, currentSnapshot].forEach((snapshot) => {
    snapshot.docs.forEach((docEntry) => {
      uniqueRows.set(docEntry.id, { id: docEntry.id, ...docEntry.data() });
    });
  });

  return Array.from(uniqueRows.values());
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
      const canonicalAssignmentKey = resolveAssignmentCanonicalKey({
        level: row.level,
        assignmentId: row.assignmentKey || row.canonicalAssignmentKey || row.assignmentId || row.assignment_id,
        assignmentTitle: normalizedAssignment,
      });

      const key = `${normalizedCode}::${canonicalAssignmentKey || normalizedAssignment}`;
      attemptsTracker[key] = (attemptsTracker[key] || 0) + 1;
      const attemptNumber = attemptsTracker[key];
      return {
        assignment: normalizedAssignment,
        assignmentKey: canonicalAssignmentKey || normalizeString(row.assignmentKey || row.canonicalAssignmentKey) || "",
        assignment_id: normalizeString(row.assignment_id || row.assignmentId || row.assignmentKey || canonicalAssignmentKey) || "",
        assignmentId: normalizeString(row.assignmentId || row.assignment_id || row.assignmentKey || canonicalAssignmentKey) || "",
        studentCode: normalizeString(row.studentcode || row.studentCode) || "",
        studentcode: normalizeString(row.studentcode || row.studentCode) || "",
        studentName: normalizeString(row.name || row.studentName) || "",
        name: normalizeString(row.name || row.studentName) || "",
        level: (row.level || "").toUpperCase(),
        date: normalizeString(row.date || row.created_at || row.createdAt) || "",
        score: toNumber(row.score ?? row.finalScore, null),
        finalScore: toNumber(row.finalScore ?? row.score, null),
        comments: normalizeString(row.comments || row.feedback || row.aiFeedback) || "",
        feedback: normalizeString(row.feedback || row.aiFeedback || row.comments) || "",
        link: normalizeString(row.link) || "",
        attempt: attemptNumber,
        isRetake: attemptNumber > 1,
        objectiveScore: row.objectiveScore ?? null,
        objectiveCorrect: row.objectiveCorrect ?? null,
        objectiveTotal: row.objectiveTotal ?? null,
        objectiveDetails: row.objectiveDetails ?? null,
        wrongAnswers: row.wrongAnswers ?? [],
        writingScore: row.writingScore ?? null,
        writingScorePercent: row.writingScorePercent ?? null,
        maxWritingScore: row.maxWritingScore ?? null,
        corrections: row.corrections ?? [],
        scoreBreakdown: row.scoreBreakdown ?? [],
        improvementSummary: normalizeString(row.improvementSummary || row.resubmissionSummary) || "",
        markingReason: normalizeString(row.markingReason || row.rawAiReason || row.aiReason) || "",
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
