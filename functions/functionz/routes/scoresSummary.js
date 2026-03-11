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

const identifierOrdinal = (identifier = "") => {
  const plain = String(identifier || "")
    .trim()
    .toUpperCase()
    .replace(/^(A1|A2|B1|B2|C1|C2)-/, "");

  const match = plain.match(/^(\d+)(?:\.(\d+))?$/);
  if (!match) return null;

  const major = Number(match[1]);
  const minor = Number(match[2] || 0);
  if (!Number.isFinite(major) || !Number.isFinite(minor)) return null;
  return major * 1000 + minor;
};

const lessonOrdinal = (lesson = {}) => {
  const values = (lesson.identifiers || [])
    .map((identifier) => identifierOrdinal(identifier))
    .filter((value) => Number.isFinite(value));
  if (!values.length) return null;
  return Math.min(...values);
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
  const fromPrefixed = String(value || "")
    .match(/\b(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?\b/gi)
    ?.map((item) => String(item).toUpperCase()) || [];
  const fromNumeric = extractIdentifiers(value)
    .map((item) => toCanonicalIdentifier(level, item))
    .filter(Boolean);

  return Array.from(new Set([...fromPrefixed, ...fromNumeric]));
};

const hasSpecificIdentifierHint = (value = "") => {
  const text = String(value || "");
  if (/\bchapter\b/i.test(text)) return true;
  if (/\b(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?\b/i.test(text)) return true;
  return /\d+\.\d+/.test(text);
};

// Prefer identifiers that exist in the planned schedule; prefer the LAST planned match in the string.
const pickIdentifierFromText = (assignmentText, plannedSet) => {
  const levelMatch = Array.from(plannedSet)[0]?.split("-")?.[0] || "";
  const found = extractCanonicalIdentifiers(assignmentText, levelMatch);
  if (!found.length) return null;

  // last-to-first so we favor the later number in titles like "12 Hour Clock 7"
  for (let i = found.length - 1; i >= 0; i -= 1) {
    if (plannedSet.has(found[i])) return found[i];
  }
  // fallback: first number
  return found[0];
};

/* ------------------------ Schedule scanning (web schedule) ------------------------ */

const isRealAssignment = (obj) => obj && obj.assignment === true;

const scheduleTopicIsIgnored = (topic = "") =>
  String(topic || "").toLowerCase().includes("goethe");

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

    // top-level chapter (only if it's marked assignment:true)
    if (lesson.assignment === true && (lesson.assignmentId || lesson.chapter)) {
      identifiers.push(
        ...extractCanonicalIdentifiers(lesson.assignmentId || lesson.chapter, level)
      );
    }

    // nested lesen_hören
    if (Array.isArray(lesson.lesen_hören)) {
      for (const block of lesson.lesen_hören) {
        if (isRealAssignment(block) && block.chapter) {
          identifiers.push(...extractCanonicalIdentifiers(block.assignmentId || block.chapter, level));
        }
      }
    } else if (isRealAssignment(lesson.lesen_hören)) {
      // sometimes lesen_hören is an object
      const ch = lesson.lesen_hören.assignmentId || lesson.lesen_hören.chapter || lesson.assignmentId || lesson.chapter;
      if (ch) identifiers.push(...extractCanonicalIdentifiers(ch, level));
    }

    // nested schreiben_sprechen
    if (Array.isArray(lesson.schreiben_sprechen)) {
      for (const block of lesson.schreiben_sprechen) {
        if (isRealAssignment(block) && block.chapter) {
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

    const clean = Array.from(new Set(identifiers)).filter(Boolean);

    // Skip practice-only lessons (no real assignment identifiers)
    if (!clean.length) continue;

    const displayTitle = String(lesson.assignmentTitle || lesson.title || topic || "").trim();
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
    const decoded = await requireAuth(req);

    const studentCode = String(req.query.studentCode || "").trim();
    const normalizedStudentCode = normalizeStudentCode(studentCode);
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const db = admin.firestore();
    const studentSnap = await db.collection("students").doc(studentCode).get();
    if (!studentSnap.exists) return res.status(404).json({ error: "Student not found" });

    const student = studentSnap.data() || {};
    if (student.uid && student.uid !== decoded.uid) {
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
      const fromAssignment = pickIdentifierFromText(assignmentText, plannedSet);

      if (explicitId && plannedSet.has(String(explicitId).toUpperCase())) {
        return String(explicitId).toUpperCase();
      }

      if (fromAssignment && hasSpecificIdentifierHint(assignmentText)) {
        return fromAssignment;
      }

      const fromExplicit = pickIdentifierFromText(explicitId, plannedSet);
      if (fromExplicit) return fromExplicit;
      return fromAssignment;
    };

    const leaderboardEntries = new Map();
    rows.slice(1).forEach((row) => {
      const rowStudentCode = get(row, idx.studentCode);
      if (!rowStudentCode) return;
      const rowLevel = normalizeLevelKey(get(row, idx.level) || "");
      if (rowLevel && rowLevel !== level) return;

      const assignment = get(row, idx.assignment);
      const identifier = resolveIdentifier(row);
      if (!identifier) return;

      const scoreNum = Number(get(row, idx.score));
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

    // Pull attempts for this student + (optional) level match
    const mine = rows
      .slice(1)
      .filter((r) => normalizeStudentCode(get(r, idx.studentCode)) === normalizedStudentCode)
      .map((r) => {
        const assignment = get(r, idx.assignment);
        const scoreNum = Number(get(r, idx.score));
        const dateRaw = get(r, idx.date);
        const dateMs = parseDateMs(dateRaw);
        const rowLevel = get(r, idx.level) || "";

        const identifier = resolveIdentifier(r);

        return {
          assignment: assignment || "",
          identifier, // string
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
        // If row has no level, accept it
        if (!rowLevel) return true;
        return rowLevel === level;
      });

    // If no attempts, return empty stats
    if (!mine.length) {
      return res.json({
        student: {
          completedAssignments: [],
          missedAssignments: [],
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
      });
    }

    // Best attempt per identifier
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

    // Evaluate schedule lessons
    const lessonStatus = plannedLessons.map((l) => {
      const isCompleted = l.identifiers.every((id) => passed.has(id));
      const hasFailed = l.identifiers.some((id) => failed.has(id));
      return { ...l, isCompleted, hasFailed, logicalOrder: lessonOrdinal(l) };
    });

    // Determine progress by logical identifier order first (0.1, 1.1, 1.2...),
    // with schedule order as fallback when identifiers are missing.
    const latestCompletedLogicalOrder = lessonStatus.reduce((max, lesson) => {
      if (!lesson.isCompleted || !Number.isFinite(lesson.logicalOrder)) return max;
      return Math.max(max, lesson.logicalOrder);
    }, -1);
    const latestCompletedScheduleOrder = lessonStatus.reduce((max, lesson) => {
      if (!lesson.isCompleted) return max;
      return Math.max(max, lesson.order);
    }, -1);

    // Missed: lesson appears before our furthest completed lesson,
    // is still incomplete, and is not currently failed.
    const missedAssignments = lessonStatus
      .filter((l) => {
        if (l.isCompleted || l.hasFailed) return false;
        if (Number.isFinite(latestCompletedLogicalOrder) && Number.isFinite(l.logicalOrder)) {
          return l.logicalOrder < latestCompletedLogicalOrder;
        }
        return l.order < latestCompletedScheduleOrder;
      })
      .map((l) => ({
        label: l.label,
        identifiers: l.identifiers,
        dayNumber: l.dayNumber,
        goal: l.goal,
      }));

    // Failed lessons
    const failedAssignments = lessonStatus
      .filter((l) => l.hasFailed)
      .map((l) => ({
        label: l.label,
        identifiers: l.identifiers,
        dayNumber: l.dayNumber,
        goal: l.goal,
      }));

    const recommendationBlocked = failedAssignments.length > 0;

    // Next: first incomplete lesson in schedule order (blocked if failures exist)
    let nextRecommendation = null;
    if (!recommendationBlocked) {
      const firstIncomplete = lessonStatus.find((l) => !l.isCompleted);
      if (firstIncomplete) {
        nextRecommendation = {
          label: firstIncomplete.label,
          identifiers: firstIncomplete.identifiers,
          dayNumber: firstIncomplete.dayNumber,
          goal: firstIncomplete.goal,
        };
      }
    }

    // Completed list for UI (by identifier)
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

    // Weekly stats + streak
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
