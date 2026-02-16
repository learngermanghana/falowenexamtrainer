import { db, isFirebaseConfigured } from "../firebase";
import { fetchResults } from "./resultsService";
import { fetchAttendanceRecords } from "./attendanceService";
import { loadWritingProgress } from "./writingProgressService";

const WORD_TARGET_RANGES = {
  A1: { min: 30, max: 50 },
  A2: { min: 50, max: 80 },
  B1: { min: 80, max: 120 },
  B2: { min: 120, max: 180 },
  C1: { min: 180, max: 220 },
};
const PASS_MARK = 60;

const ISSUE_PATTERNS = [
  { label: "verb placement", regex: /\bverb (placement|position|order)\b/i },
  { label: "word order", regex: /\bword order\b|\bsentence order\b/i },
  { label: "cases (Akk/Dat)", regex: /\b(case|cases|akkusativ|dativ|genitiv|accusative|dative)\b/i },
  { label: "articles", regex: /\barticles?\b|\bder\/die\/das\b/i },
  { label: "adjective endings", regex: /\badjective endings?\b|\badjektiv\b/i },
  { label: "prepositions", regex: /\bprepositions?\b|\bpräposition\b/i },
  { label: "tense consistency", regex: /\btense\b|\bperfect\b|\bpräteritum\b|\bpast\b/i },
  { label: "capitalization", regex: /\bcapitalization\b|\buppercase\b|\bgroß|klein\b/i },
  { label: "punctuation", regex: /\bpunctuation\b|\bcomma\b|\bkomma\b/i },
];

const LEVEL_REGEX = /\b(A1|A2|B1|B2|C1)\b/i;
const LEVEL_TOPIC_REGEX = /\b(A1|A2|B1|B2|C1)\b\s+([a-zäöüß][^.,;]+)/i;

const countWords = (value = "") => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

const extractIssues = (text = "") => {
  const normalized = String(text || "").trim();
  if (!normalized) return [];
  const levelMatch = normalized.match(LEVEL_REGEX);
  const level = levelMatch ? levelMatch[1].toUpperCase() : "";
  const matches = ISSUE_PATTERNS.filter((pattern) => pattern.regex.test(normalized)).map((pattern) => ({
    label: pattern.label,
    level,
  }));
  const levelTopicMatch = normalized.match(LEVEL_TOPIC_REGEX);
  if (levelTopicMatch) {
    matches.push({
      label: levelTopicMatch[2].trim(),
      level: levelTopicMatch[1].toUpperCase(),
    });
  }
  const deduped = new Map();
  matches.forEach((match) => {
    const key = `${match.level}:${match.label}`.toLowerCase();
    if (!deduped.has(key)) deduped.set(key, match);
  });
  return Array.from(deduped.values());
};

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getPrimaryText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "object") {
    return value.label || value.name || value.title || "";
  }
  return String(value);
};

const getDateMs = (value) => {
  if (!value) return 0;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const buildAssignmentSnapshots = (scores = []) => {
  const snapshots = new Map();

  scores.forEach((entry, index) => {
    const assignment = String(entry?.assignment || "").trim();
    const score = Number(entry?.score);
    if (!assignment || !Number.isFinite(score)) return;

    const key = assignment.toLowerCase();
    const entryDateMs = getDateMs(entry?.date || entry?.created_at || entry?.createdAt);
    const snapshot = snapshots.get(key) || {
      assignment,
      bestScore: -Infinity,
      latestScore: null,
      latestDateMs: -1,
      latestIndex: -1,
    };

    if (score > snapshot.bestScore) {
      snapshot.bestScore = score;
    }

    const isNewer =
      entryDateMs > snapshot.latestDateMs ||
      (entryDateMs === snapshot.latestDateMs && index > snapshot.latestIndex);
    if (isNewer) {
      snapshot.latestScore = score;
      snapshot.latestDateMs = entryDateMs;
      snapshot.latestIndex = index;
    }

    snapshots.set(key, snapshot);
  });

  return Array.from(snapshots.values()).map((snapshot) => ({
    assignment: snapshot.assignment,
    bestScore: Number.isFinite(snapshot.bestScore) ? snapshot.bestScore : null,
    latestScore: snapshot.latestScore,
  }));
};

export const fetchPersonalizedPlan = async ({
  studentCode,
  email,
  className,
  level,
  userId,
} = {}) => {
  if (!studentCode && !email) {
    return {
      recommendations: [],
      highlights: [],
      feedback: "",
      student: null,
      attendanceSummary: null,
    };
  }

  if (!isFirebaseConfigured || !db) {
    return {
      recommendations: [],
      highlights: [],
      feedback: "",
      student: null,
      attendanceSummary: null,
    };
  }

  const [results, attendance, writingProgress] = await Promise.all([
    fetchResults({ studentCode, email, level }),
    fetchAttendanceRecords({ className, studentCode, level }),
    loadWritingProgress({ userId, studentCode, mode: "course" }),
  ]);

  const scores = results?.results || [];
  const student = results?.student || null;
  const attendanceRecords = attendance?.records || [];

  const issueCounts = new Map();
  const registerIssue = (issue) => {
    if (!issue?.label) return;
    const key = `${issue.level}:${issue.label}`.toLowerCase();
    issueCounts.set(key, {
      label: issue.label,
      level: issue.level,
      count: (issueCounts.get(key)?.count || 0) + 1,
    });
  };

  scores.forEach((entry) => {
    extractIssues(entry.comments).forEach(registerIssue);
    extractIssues(entry.focus || entry.topic).forEach(registerIssue);
  });

  if (writingProgress?.markFeedback) {
    extractIssues(writingProgress.markFeedback).forEach(registerIssue);
  }

  const topIssue = Array.from(issueCounts.values()).sort((a, b) => b.count - a.count)[0] || null;

  const assignmentSnapshots = buildAssignmentSnapshots(scores);
  const lowScoreAssignments = assignmentSnapshots
    .filter((entry) => Number.isFinite(entry.bestScore) && entry.bestScore < PASS_MARK)
    .sort((a, b) => a.bestScore - b.bestScore);
  const lowestScore = lowScoreAssignments[0] || null;

  const latestScore = scores[0] || null;
  const latestAssignment = latestScore?.assignment ? String(latestScore.assignment) : "";

  const presentCount = attendanceRecords.filter((record) => record.present).length;
  const totalSessions = attendanceRecords.length;
  const attendanceRate = totalSessions ? presentCount / totalSessions : null;

  const writingText = writingProgress?.typedAnswer || writingProgress?.practiceDraft || "";
  const wordCount = countWords(writingText);
  const levelKey = String(level || student?.level || "").trim().toUpperCase();
  const wordTarget = WORD_TARGET_RANGES[levelKey];

  const recommendations = [];

  if (topIssue) {
    recommendations.push({
      title: `Target ${topIssue.level ? `${topIssue.level} ` : ""}${topIssue.label}`.trim(),
      detail: "Based on your recent feedback patterns.",
      source: "scores",
    });
  }

  if (lowestScore?.assignment) {
    recommendations.push({
      title: `Redo ${lowestScore.assignment}`,
      detail: `Best score so far: ${lowestScore.bestScore ?? "–"}/100`,
      source: "scores",
    });
  }

  if (wordTarget && wordCount > 0 && wordCount < wordTarget.min) {
    recommendations.push({
      title: `Finish a ${levelKey || "your level"} writing draft`,
      detail: `Aim for ${wordTarget.min}-${wordTarget.max} words (currently ${wordCount}).`,
      source: "writingProgress",
    });
  }

  if (attendanceRate !== null && attendanceRate < 0.7) {
    recommendations.push({
      title: "Attend the next live class",
      detail: `You've attended ${presentCount}/${totalSessions} sessions recently.`,
      source: "attendance",
    });
  }

  if (recommendations.length < 3 && latestAssignment) {
    recommendations.push({
      title: `Review feedback from ${latestAssignment}`,
      detail: "Turn the last correction notes into a focused drill.",
      source: "scores",
    });
  }

  const feedback = topIssue
    ? `You keep missing ${topIssue.level ? `${topIssue.level} ` : ""}${topIssue.label} → next practice focuses there.`
    : lowestScore?.assignment
      ? `You have not passed ${lowestScore.assignment} yet. Focus your next practice there.`
      : "Keep building consistency — the next step is to follow your latest feedback notes.";

  const highlights = [];
  if (student) {
    const studentGoal =
      getPrimaryText(student.goal) ||
      getPrimaryText(student.target) ||
      getPrimaryText(student.focusArea) ||
      getPrimaryText(student.targetExam);
    if (studentGoal) {
      highlights.push({ label: "Goal", value: studentGoal });
    }

    const examDate =
      student.examDate || student.targetExamDate || student.exam || student.examDateTime;
    const parsedExam = toDate(examDate);
    if (parsedExam) {
      highlights.push({ label: "Exam date", value: parsedExam.toLocaleDateString() });
    }
  }

  if (totalSessions) {
    highlights.push({ label: "Attendance", value: `${presentCount}/${totalSessions} sessions` });
  }

  if (wordCount) {
    highlights.push({ label: "Writing draft", value: `${wordCount} words` });
  }

  return {
    recommendations: recommendations.slice(0, 3),
    highlights,
    feedback,
    student,
    attendanceSummary: totalSessions ? { presentCount, totalSessions } : null,
  };
};
