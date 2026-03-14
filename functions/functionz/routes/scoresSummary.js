"use strict";

const admin = require("firebase-admin");

// If you're on Node 18+ in Firebase Functions, global fetch exists.
// If not, uncomment the next line and install node-fetch@2.
// const fetch = require("node-fetch");

const PASS_MARK = 60;

// IMPORTANT:
// Create: functions/data/courseSchedule.js
// and export `courseSchedules` from web/src/data/courseSchedule.js (copy-paste the object).
const { courseSchedules } = require("../../data/courseSchedule");

if (!admin.apps.length) {
  admin.initializeApp();
}

/* ----------------------------- CSV parsing ----------------------------- */

const normalizeHeaderKey = (header = "") =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[()]/g, "");

const parseCsv = (text) => {
  const rows = [];
  let currentCell = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows
    .map((row) => row.map((cell) => String(cell || "").trim()))
    .filter((row) => row.some((cell) => cell.length > 0));
};

const findIndexByHeader = (headers, candidates) => {
  const normalizedHeaders = headers.map(normalizeHeaderKey);
  const normalizedCandidates = candidates.map(normalizeHeaderKey);
  return normalizedHeaders.findIndex((h) => normalizedCandidates.includes(h));
};

const parseDateMs = (value) => {
  if (!value) return 0;
  const ms = Date.parse(String(value));
  return Number.isFinite(ms) ? ms : 0;
};

const parseScoreValue = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const asNumber = Number(raw);
  if (Number.isFinite(asNumber)) return asNumber;

  const normalized = raw.replace(/,/g, ".").replace(/\s+/g, "");

  const percentMatch = normalized.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (percentMatch) {
    const percent = Number(percentMatch[1]);
    return Number.isFinite(percent) ? percent : null;
  }

  const fractionMatch = normalized.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    const score = Number(fractionMatch[1]);
    const total = Number(fractionMatch[2]);
    if (Number.isFinite(score) && Number.isFinite(total) && total > 0) {
      return (score / total) * 100;
    }
  }

  return null;
};

const anonymizeDisplayName = (name, studentCode) => {
  const trimmedName = String(name || "").trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/);
    if (parts.length === 1) return parts[0];
    const first = parts[0];
    const last = parts[parts.length - 1];
    const lastInitial = last ? `${last[0].toUpperCase()}.` : "";
    return `${first} ${lastInitial}`.trim();
  }

  const code = String(studentCode || "").trim();
  if (code) {
    return `Student ${code.slice(-4)}`;
  }

  return "Student";
};

const normalizeStudentCode = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase();



const getIdentifierLabel = (identifier = "") =>
  String(identifier || "")
    .trim()
    .toUpperCase()
    .replace(/^(A1|A2|B1|B2|C1|C2)-/, "");

const ensureTitleHasIdentifier = (title = "", identifiers = []) => {
  const cleanTitle = String(title || "").trim();
  const firstIdentifier = getIdentifierLabel(identifiers[0] || "");
  if (!firstIdentifier) return cleanTitle;

  const hasIdentifierInTitle = /\d+(?:\.\d+)?/.test(cleanTitle);
  if (hasIdentifierInTitle) return cleanTitle;
  if (!cleanTitle) return firstIdentifier;
  return `${firstIdentifier} ${cleanTitle}`;
};

/* ------------------------ Identifier parsing (strings) ------------------------ */

// Extract numbers like 0.2, 1.1, 4.10 from a string.
// Also handles combined strings like "0.2_1.1" -> ["0.2","1.1"].
const _extractAllNums = (value = "") => {
  const text = String(value || "");
  const matches = text.match(/\d+(?:\.\d+)?/g) || [];
  return matches;
};

// Normalize major part only, preserve minor digits exactly (so 4.10 stays "4.10").
const normalizeIdentifier = (raw = "") => {
  const s = String(raw || "").trim();
  if (!s) return null;
  if (!/^\d+(?:\.\d+)?$/.test(s)) return null;

  const parts = s.split(".");
  const major = String(Number(parts[0]));
  if (parts.length === 1) return major;

  const minor = parts[1]; // keep as typed
  return `${major}.${minor}`;
};

const toCanonicalIdentifier = (level, raw = "") => {
  const token = String(raw || "").trim().toUpperCase();
  if (!token) return null;
  if (/^(A1|A2|B1|B2|C1|C2)-/.test(token)) return token;

  const normalized = normalizeIdentifier(token);
  if (!normalized) return null;

  const normalizedLevel = normalizeLevelKey(level || "");
  if (!normalizedLevel) return normalized;
  return `${normalizedLevel}-${normalized}`;
};

const extractIdentifiers = (value = "") => {
  const nums = _extractAllNums(value);
  const ids = nums.map(normalizeIdentifier).filter(Boolean);
  return Array.from(new Set(ids));
};

const extractCanonicalIdentifiers = (value = "", level = "") => {
  const text = String(value || "");
  const fromLevelWithSeparator = Array.from(
    text.matchAll(/\b(A1|A2|B1|B2|C1|C2)[\s-]+(\d+(?:\.\d+)?)\b/gi)
  ).map(([, lvl, num]) => `${String(lvl || "").toUpperCase()}-${normalizeIdentifier(num)}`);

  const fromPrefixed = String(value || "")
    .match(/\b(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?\b/gi)
    ?.map((item) => String(item).toUpperCase()) || [];
  const cleanedForNumericScan = text.replace(/\b(A1|A2|B1|B2|C1|C2)[\s-]+\d+(?:\.\d+)?\b/gi, " ");
  const fromNumeric = extractIdentifiers(cleanedForNumericScan)
    .map((item) => toCanonicalIdentifier(level, item))
    .filter(Boolean);

  return Array.from(new Set([...fromLevelWithSeparator, ...fromPrefixed, ...fromNumeric]));
};


// Prefer identifiers that exist in the planned schedule; prefer the LAST planned match in the string.
const pickIdentifierFromText = (assignmentText, plannedSet, { onlyCurriculumLike = false } = {}) => {
  const levelMatch = Array.from(plannedSet)[0]?.split("-")?.[0] || "";
  const found = extractCanonicalIdentifiers(assignmentText, levelMatch);
  if (!found.length) return null;

  const candidates = onlyCurriculumLike
    ? found.filter((item) => /-\d+\.\d+$/.test(item))
    : found;
  if (!candidates.length) return null;

  // last-to-first so we favor the later number in titles like "12 Hour Clock 7"
  for (let i = candidates.length - 1; i >= 0; i -= 1) {
    if (plannedSet.has(candidates[i])) return candidates[i];
  }
  // fallback: first number
  return candidates[0];
};

const extractChapterIdentifierFromTitle = (title = "", plannedSet = new Set()) => {
  const text = String(title || "");
  const match = text.match(/chapter\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (!match?.[1]) return null;
  return pickIdentifierFromText(match[1], plannedSet) || null;
};

const chooseBestIdentifier = ({ assignmentText = "", explicitId = "", plannedSet = new Set() }) => {
  const fromChapterHint = extractChapterIdentifierFromTitle(assignmentText, plannedSet);
  if (fromChapterHint) return fromChapterHint;

  const fromCurriculumLikeTitle = pickIdentifierFromText(assignmentText, plannedSet, {
    onlyCurriculumLike: true,
  });
  if (fromCurriculumLikeTitle) return fromCurriculumLikeTitle;

  const fromExplicit = pickIdentifierFromText(explicitId, plannedSet);
  if (fromExplicit) return fromExplicit;

  return pickIdentifierFromText(assignmentText, plannedSet);
};

const mapToPlannedIdentifier = (identifier = "", plannedSet = new Set()) => {
  const candidate = String(identifier || "").trim().toUpperCase();
  if (!candidate) return null;
  if (plannedSet.has(candidate)) return candidate;

  const [level = "", chapter = ""] = candidate.split("-");
  const chapterMatch = chapter.match(/^(\d+)(?:\.(\d+))?$/);
  if (!chapterMatch) return null;

  const majorOnly = `${level}-${chapterMatch[1]}`;
  if (plannedSet.has(majorOnly)) return majorOnly;

  return null;
};

/* ------------------------ Schedule scanning (web schedule) ------------------------ */

const isRealAssignment = (obj) => obj && obj.assignment === true;

const scheduleTopicIsIgnored = (topic = "") =>
  String(topic || "").toLowerCase().includes("goethe");

const isA1PracticalWritingLesson = (level = "", lesson = {}) => {
  if (String(level || "").toUpperCase() !== "A1") return false;
  const text = `${lesson?.topic || ""} ${lesson?.title || ""} ${lesson?.goal || ""}`.toLowerCase();
  return text.includes("schreiben") || text.includes("sprechen");
};


const isMajorOnlyIdentifierToken = (value = "") => /^\d+$/.test(String(value || "").trim());

const lessonHasDecimalIdentifier = (lesson = {}) => {
  const source = `${lesson?.assignmentId || ""} ${lesson?.chapter || ""}`;
  return /\d+\.\d+/.test(source);
};

const shouldSkipNestedMajorOnlyAssignmentId = ({ level = "", lesson = {}, rawValue = "", cameFromAssignmentId = false }) => {
  if (!cameFromAssignmentId) return false;
  if (String(level || "").toUpperCase() !== "A1") return false;
  if (!isMajorOnlyIdentifierToken(rawValue)) return false;
  return lessonHasDecimalIdentifier(lesson);
};

// Build a linear list of lessons in schedule order with the identifiers that must be passed.
const getAssignmentSummary = (level = "A1") => {
  const schedule = courseSchedules?.[String(level || "A1").toUpperCase()] || [];
  const lessons = [];

  for (const lesson of schedule) {
    const dayNumber = Number(lesson.day || lesson.dayNumber || 0);
    const topic = String(lesson.topic || "");
    const goal = String(lesson.goal || "");

    if (!dayNumber || scheduleTopicIsIgnored(topic)) continue;

    const identifiers = [];
    let hasGeneralOrReadingAssignmentSignal = false;

    // top-level chapter (only if it's marked assignment:true)
    if (
      lesson.assignment === true &&
      (lesson.assignmentId || lesson.chapter) &&
      !isA1PracticalWritingLesson(level, lesson)
    ) {
      hasGeneralOrReadingAssignmentSignal = true;
      identifiers.push(
        ...extractCanonicalIdentifiers(lesson.assignmentId || lesson.chapter, level)
      );
    }

    // nested lesen_hören
    if (Array.isArray(lesson.lesen_hören)) {
      for (const block of lesson.lesen_hören) {
        if (isRealAssignment(block) && (block.assignmentId || block.chapter)) {
          hasGeneralOrReadingAssignmentSignal = true;
          const blockRaw = block.chapter || block.assignmentId;
          const blockFromAssignmentId = Boolean(!block.chapter && block.assignmentId);
          if (
            shouldSkipNestedMajorOnlyAssignmentId({
              level,
              lesson,
              rawValue: blockRaw,
              cameFromAssignmentId: blockFromAssignmentId,
            })
          ) {
            continue;
          }
          identifiers.push(...extractCanonicalIdentifiers(blockRaw, level));
        }
      }
    } else if (isRealAssignment(lesson.lesen_hören)) {
      // sometimes lesen_hören is an object
      const lesenRaw = lesson.lesen_hören.chapter || lesson.lesen_hören.assignmentId || lesson.assignmentId || lesson.chapter;
      const lesenFromAssignmentId = Boolean(!lesson.lesen_hören.chapter && lesson.lesen_hören.assignmentId);
      if (
        lesenRaw &&
        !shouldSkipNestedMajorOnlyAssignmentId({
          level,
          lesson,
          rawValue: lesenRaw,
          cameFromAssignmentId: lesenFromAssignmentId,
        })
      ) {
        hasGeneralOrReadingAssignmentSignal = true;
        identifiers.push(...extractCanonicalIdentifiers(lesenRaw, level));
      }
    }

    // nested schreiben_sprechen (A1 speaking/writing blocks are practical-only)
    if (String(level || "").toUpperCase() !== "A1") {
      if (Array.isArray(lesson.schreiben_sprechen)) {
        for (const block of lesson.schreiben_sprechen) {
          if (isRealAssignment(block) && (block.assignmentId || block.chapter)) {
            identifiers.push(...extractCanonicalIdentifiers(block.assignmentId || block.chapter, level));
          }
        }
      } else if (isRealAssignment(lesson.schreiben_sprechen)) {
        const ch =
          lesson.schreiben_sprechen.assignmentId ||
          lesson.schreiben_sprechen.chapter ||
          lesson.assignmentId ||
          lesson.chapter;
        if (ch) identifiers.push(...extractCanonicalIdentifiers(ch, level));
      }
    }

    const clean = Array.from(new Set(identifiers)).filter(Boolean);

    // Skip practice-only lessons (no real assignment identifiers)
    if (!clean.length) continue;

    // Ignore writing/speaking-only lessons from next/missed progression logic.
    if (!hasGeneralOrReadingAssignmentSignal) continue;

    const displayTitle = ensureTitleHasIdentifier(
      String(lesson.assignmentTitle || lesson.title || topic || "").trim(),
      clean
    );
    const label = `Day ${dayNumber}: ${displayTitle || `Assignment ${clean.join(", ")}`}`.trim();

    lessons.push({
      order: lessons.length,
      dayNumber,
      label,
      goal,
      identifiers: clean, // array of string identifiers
    });
  }

  const plannedSet = new Set(lessons.flatMap((l) => l.identifiers));
  return { lessons, plannedSet };
};

/* ------------------------ Streak + auth helpers ------------------------ */

const buildStreakDays = (attemptDatesMs = []) => {
  const daySet = new Set(
    attemptDatesMs
      .filter((ms) => ms > 0)
      .map((ms) => new Date(ms).toISOString().slice(0, 10))
  );

  if (!daySet.size) return 0;

  const today = new Date();
  let streak = 0;

  for (;;) {
    const dayKey = today.toISOString().slice(0, 10);
    if (!daySet.has(dayKey)) break;
    streak += 1;
    today.setDate(today.getDate() - 1);
  }

  return streak;
};

const requireAuth = async (req) => {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) throw new Error("Missing Authorization Bearer token.");
  const decoded = await admin.auth().verifyIdToken(match[1]);
  return decoded;
};

const normalizeLevelKey = (value = "") => {
  const text = String(value || "").toUpperCase();
  const match = text.match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return (match ? match[1] : text).trim();
};

/* ----------------------------- Main handler ----------------------------- */

const scoresSummaryHandler = async (req, res) => {
  try {
    const includeDebug = String(req.query.debug || "").trim() === "1";

    let decoded = null;
    if (!includeDebug) {
      decoded = await requireAuth(req);
    }

    const studentCode = String(req.query.studentCode || "").trim();
    const normalizedStudentCode = normalizeStudentCode(studentCode);
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const db = admin.firestore();
    const studentSnap = await db.collection("students").doc(studentCode).get();
    if (!studentSnap.exists) return res.status(404).json({ error: "Student not found" });

    const student = studentSnap.data() || {};
    if (!includeDebug && student.uid && student.uid !== decoded.uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const level = normalizeLevelKey(student.level || student.course || "A1") || "A1";

    // Build schedule targets
    const { lessons: plannedLessons, plannedSet } = getAssignmentSummary(level);
    const totalAssignments = plannedSet.size;
    const labelByIdentifier = new Map();
    plannedLessons.forEach((lesson) => {
      lesson.identifiers.forEach((identifier) => {
        if (!labelByIdentifier.has(identifier)) {
          labelByIdentifier.set(identifier, lesson.label);
        }
      });
    });

    const CSV_URL =
      process.env.SCORES_SHEET_PUBLISHED_CSV_URL ||
      process.env.RESULTS_SHEET_PUBLISHED_CSV_URL ||
      "PASTE_YOUR_PUBLISHED_CSV_URL_HERE";

    if (!CSV_URL || CSV_URL.includes("PASTE_YOUR")) {
      return res.status(503).json({
        error: "Score sheet URL is not configured",
        missingEnv: "SCORES_SHEET_PUBLISHED_CSV_URL or RESULTS_SHEET_PUBLISHED_CSV_URL",
      });
    }

    const csvRes = await fetch(CSV_URL);
    if (!csvRes.ok) return res.status(502).json({ error: `CSV fetch failed (${csvRes.status})` });

    const csvText = await csvRes.text();
    const rows = parseCsv(csvText);
    if (!rows.length) {
      return res.json({ student: null });
    }

    const header = rows[0];
    const idx = {
      studentCode: findIndexByHeader(header, [
        "studentno",
        "student.no",
        "student no",
        "studentcode",
        "student code",
        "code",
      ]),
      name: findIndexByHeader(header, ["name", "studentname", "student name"]),
      assignment: findIndexByHeader(header, ["assignment", "task", "topic", "day", "title"]),
      assignmentId: findIndexByHeader(header, ["assignment_id", "assignmentid", "assgnment_id", "assgnmentid"]),
      score: findIndexByHeader(header, ["score", "mark", "marks", "result"]),
      date: findIndexByHeader(header, ["date", "timestamp", "createdat", "created_at", "time"]),
      comments: findIndexByHeader(header, ["comments", "feedback", "comment"]),
      level: findIndexByHeader(header, ["level", "cefr", "lvl"]),
      link: findIndexByHeader(header, ["link", "url"]),
    };

    if (idx.studentCode === -1) {
      return res.status(500).json({ error: "Score sheet missing Student No / StudentCode column." });
    }

    const get = (row, i) => (i >= 0 && i < row.length ? String(row[i] || "").trim() : "");
    const resolveIdentifier = (row) => {
      const explicitId = get(row, idx.assignmentId);
      const assignmentText = get(row, idx.assignment);

      if (explicitId) {
        const matchedExplicitId = mapToPlannedIdentifier(explicitId, plannedSet);
        if (matchedExplicitId) return matchedExplicitId;
      }

      const bestIdentifier = chooseBestIdentifier({ assignmentText, explicitId, plannedSet });
      return mapToPlannedIdentifier(bestIdentifier, plannedSet) || bestIdentifier;
    };

    const leaderboardEntries = new Map();
    rows.slice(1).forEach((row) => {
      const rowStudentCode = get(row, idx.studentCode);
      if (!rowStudentCode) return;
      const rowLevel = normalizeLevelKey(get(row, idx.level) || "");
      if (rowLevel && rowLevel !== level) return;

      const identifier = resolveIdentifier(row);
      if (!identifier) return;

      const scoreNum = parseScoreValue(get(row, idx.score));
      if (!Number.isFinite(scoreNum)) return;

      const key = normalizeStudentCode(rowStudentCode);
      const current = leaderboardEntries.get(key) || {
        studentCode: rowStudentCode,
        name: get(row, idx.name) || "",
        bestScores: new Map(),
      };

      if (!current.name && get(row, idx.name)) current.name = get(row, idx.name);

      const previousScore = current.bestScores.get(identifier);
      if (!Number.isFinite(previousScore) || scoreNum > previousScore) {
        current.bestScores.set(identifier, scoreNum);
      }

      leaderboardEntries.set(key, current);
    });

    const leaderboard = Array.from(leaderboardEntries.values())
      .map((entry) => {
        const scores = Array.from(entry.bestScores.values());
        const passedScores = scores.filter((value) => value >= PASS_MARK);
        const failedScores = scores.filter((value) => value < PASS_MARK);
        const completedCount = passedScores.length;
        const totalScore = passedScores.reduce((sum, value) => sum + value, 0);
        return {
          studentCode: entry.studentCode,
          name: anonymizeDisplayName(entry.name, entry.studentCode),
          completedCount,
          failedCount: failedScores.length,
          totalScore,
          expectedPoints: totalAssignments * 100,
        };
      })
      .filter((entry) => entry.completedCount >= 3)
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.completedCount !== a.completedCount) return b.completedCount - a.completedCount;
        return String(a.name || "").localeCompare(String(b.name || ""));
      })
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    const mine = rows
      .slice(1)
      .filter((r) => normalizeStudentCode(get(r, idx.studentCode)) === normalizedStudentCode)
      .map((r) => {
        const assignment = get(r, idx.assignment);
        const scoreNum = parseScoreValue(get(r, idx.score));
        const dateRaw = get(r, idx.date);
        const dateMs = parseDateMs(dateRaw);
        const rowLevel = get(r, idx.level) || "";
        const identifier = resolveIdentifier(r);

        return {
          assignment: assignment || "",
          identifier,
          score: Number.isFinite(scoreNum) ? scoreNum : null,
          dateRaw,
          dateMs,
          level: rowLevel,
          comments: get(r, idx.comments) || "",
          link: get(r, idx.link) || "",
        };
      })
      .filter((row) => {
        const rowLevel = normalizeLevelKey(row.level || "");
        if (!rowLevel) return true;
        return rowLevel === level;
      });

    const debugRowsForStudent = includeDebug
      ? rows
          .slice(1)
          .filter((r) => normalizeStudentCode(get(r, idx.studentCode)) === normalizedStudentCode)
          .map((r) => {
            const assignment = get(r, idx.assignment);
            const explicitId = get(r, idx.assignmentId);
            const resolvedIdentifier = resolveIdentifier(r);
            const rawLevel = get(r, idx.level) || "";
            const normalizedRowLevel = normalizeLevelKey(rawLevel);
            const levelMatches = !normalizedRowLevel || normalizedRowLevel === level;

            return {
              assignment,
              explicitId,
              resolvedIdentifier,
              score: parseScoreValue(get(r, idx.score)),
              date: get(r, idx.date),
              rawLevel,
              normalizedRowLevel,
              levelMatches,
            };
          })
      : [];

    if (!mine.length) {
      return res.json({
        student: {
          completedAssignments: [],
          missedAssignments: [],
          jumpedAssignments: [],
          failedAssignments: [],
          failedIdentifiers: [],
          nextRecommendation: null,
          recommendationBlocked: false,
          lastAssignment: "",
          weekAssignments: 0,
          weekAttempts: 0,
          streakDays: 0,
          retriesThisWeek: 0,
          totalAssignments,
        },
        ...(includeDebug
          ? {
              debug: {
                includeDebug,
                csvUrlConfigured: Boolean(CSV_URL),
                level,
                studentCode,
                plannedIdentifiers: Array.from(plannedSet),
                matchedRowsBeforeLevelFilter: debugRowsForStudent.length,
                matchedRowsAfterLevelFilter: 0,
                rowsForStudent: debugRowsForStudent,
              },
            }
          : {}),
      });
    }

    const bestById = new Map();
    for (const row of mine) {
      if (!row.identifier) continue;
      if (!plannedSet.has(row.identifier)) continue;
      if (!Number.isFinite(row.score)) continue;

      const prev = bestById.get(row.identifier);
      const prevScore = prev?.score ?? -Infinity;
      const currScore = row.score ?? -Infinity;

      const shouldReplace =
        currScore > prevScore ||
        (currScore === prevScore && (row.dateMs || 0) > (prev?.dateMs || 0));

      if (!prev || shouldReplace) bestById.set(row.identifier, row);
    }

    const passed = new Set();
    const failed = new Set();

    for (const [id, best] of bestById.entries()) {
      if ((best.score ?? -Infinity) >= PASS_MARK) passed.add(id);
      else failed.add(id);
    }

    const lessonStatus = plannedLessons.map((l) => {
      const isCompleted = l.identifiers.every((id) => passed.has(id));
      const hasFailed = l.identifiers.some((id) => failed.has(id));
      return { ...l, isCompleted, hasFailed };
    });

    const lessonStatusByDay = [...lessonStatus].sort((a, b) => {
      const dayDiff = Number(a.dayNumber || 0) - Number(b.dayNumber || 0);
      if (dayDiff !== 0) return dayDiff;
      return Number(a.order || 0) - Number(b.order || 0);
    });

    const furthestCompletedLessonIndex = lessonStatusByDay.reduce((maxIndex, lesson, index) => {
      if (!lesson.isCompleted || lesson.hasFailed) return maxIndex;
      return Math.max(maxIndex, index);
    }, -1);

    const missedAssignments = lessonStatusByDay
      .filter((l, index) => {
        if (l.isCompleted || l.hasFailed) return false;
        return index < furthestCompletedLessonIndex;
      })
      .map((l) => ({
        label: l.label,
        identifiers: l.identifiers,
        dayNumber: l.dayNumber,
        goal: l.goal,
      }));

    const jumpedAssignments = missedAssignments;

    const failedAssignments = lessonStatusByDay
      .filter((l) => l.hasFailed)
      .map((l) => ({
        label: l.label,
        identifiers: l.identifiers,
        dayNumber: l.dayNumber,
        goal: l.goal,
      }));

    const recommendationBlocked = failedAssignments.length > 0;

    let nextRecommendation = null;
    if (!recommendationBlocked) {
      const firstIncomplete = lessonStatusByDay.find((l) => !l.isCompleted);
      if (firstIncomplete) {
        nextRecommendation = {
          label: firstIncomplete.label,
          identifiers: firstIncomplete.identifiers,
          dayNumber: firstIncomplete.dayNumber,
          goal: firstIncomplete.goal,
        };
      }
    }

    const completedAssignments = Array.from(passed).map((id) => {
      const best = bestById.get(id);
      return {
        identifier: id,
        label: labelByIdentifier.get(id) || best?.assignment || `Assignment ${id}`,
        score: best?.score ?? null,
        date: best?.dateRaw || "",
        level: best?.level || "",
        comments: best?.comments || "",
        link: best?.link || "",
      };
    });

    const pointsEarned = Array.from(passed).reduce((sum, id) => {
      const best = bestById.get(id);
      return sum + (best?.score ?? 0);
    }, 0);

    const lastAttempt = mine.reduce(
      (acc, cur) => ((cur.dateMs || 0) > (acc?.dateMs || 0) ? cur : acc),
      null
    );
    const lastAssignment = lastAttempt?.assignment || "";

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const weekRows = mine.filter((r) => r.dateMs && now - r.dateMs <= sevenDaysMs);

    const weekAttempts = weekRows.length;
    const weekAssignments = new Set(weekRows.map((r) => r.identifier || r.assignment).filter(Boolean)).size;
    const retriesThisWeek = Math.max(0, weekAttempts - weekAssignments);

    const streakDays = buildStreakDays(mine.map((r) => r.dateMs));

    return res.json({
      generatedAt: new Date().toISOString(),
      student: {
        completedAssignments,
        missedAssignments,
        jumpedAssignments,
        failedAssignments,
        failedIdentifiers: Array.from(failed),
        nextRecommendation,
        recommendationBlocked,
        lastAssignment,
        weekAssignments,
        weekAttempts,
        streakDays,
        retriesThisWeek,
        totalAssignments,
        completedCount: completedAssignments.length,
        pointsEarned,
        expectedPoints: totalAssignments * 100,
      },
      ...(includeDebug
        ? {
            debug: {
              includeDebug,
              csvUrlConfigured: Boolean(CSV_URL),
              level,
              studentCode,
              plannedIdentifiers: Array.from(plannedSet),
              matchedRowsBeforeLevelFilter: debugRowsForStudent.length,
              matchedRowsAfterLevelFilter: mine.length,
              rowsForStudent: debugRowsForStudent,
            },
          }
        : {}),
      leaderboard: {
        level,
        rows: leaderboard,
        qualificationMinimum: 3,
      },
    });
  } catch (err) {
    console.error("scores/summary error", err);
    return res.status(500).json({ error: err?.message || "Failed to load score summary" });
  }
};

module.exports = { scoresSummaryHandler };
