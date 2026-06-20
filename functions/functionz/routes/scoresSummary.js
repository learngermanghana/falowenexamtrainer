"use strict";

const admin = require("firebase-admin");

const { normalizeLevel } = require("../../data/curriculumManifest");
const { getAssignmentSummary, normalizePracticeKey } = require("./scoresSummaryCoursePlan");

// If you're on Node 18+ in Firebase Functions, global fetch exists.
// If not, uncomment the next line and install node-fetch@2.
// const fetch = require("node-fetch");

const PASS_MARK = 60;
const ENABLE_LEGACY_PROGRESSION_PLAN_FALLBACK = false;

// Migration guard: keep the legacy plan only for emergency rollback.
// Safe to delete once all deployed environments load curriculumManifest successfully.
const LEGACY_LEVEL_PROGRESSION_PLAN = {};

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

  const normalizedLevel = normalizeLevel(level || "");
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

/* ------------------------ Streak + auth helpers ------------------------ */

const buildStreakDays = (attemptDatesMs = []) => {
  const daySet = new Set(
    attemptDatesMs
      .filter((ms) => ms > 0)
      .map((lesson) => ({
        label: lesson.label,
        identifiers: lesson.identifiers,
        dayNumber: lesson.dayNumber,
        displayDay: lesson.displayDay,
        displayChapter: lesson.displayChapter,
        title: lesson.title,
        goal: lesson.goal,
        assignmentId: lesson.assignmentId,
        selfStudy: lesson.selfStudy,
        submissionRequired: lesson.submissionRequired,
        practiceKeys: lesson.practiceKeys,
      }));

    const jumpedAssignments = missedAssignments;

    const identifierToLesson = new Map();
    lessonStatusByDay.forEach((lesson) => {
      (lesson.identifiers || []).forEach((identifier) => {
        if (!identifierToLesson.has(identifier)) {
          identifierToLesson.set(identifier, lesson);
        }
      });
    });

    const failedAssignments = Array.from(failed)
      .map((identifier) => {
        const lesson = identifierToLesson.get(identifier);
        const fallbackLabel = labelByIdentifier.get(identifier) || `Assignment ${getIdentifierLabel(identifier)}`;
        const resolvedLabel = ensureTitleHasIdentifier(fallbackLabel, [identifier]);
        return {
          label: resolvedLabel,
          identifiers: [identifier],
          dayNumber: lesson?.dayNumber || null,
          goal: lesson?.goal || "",
        };
      })
      .sort((a, b) => {
        const dayDiff = Number(a.dayNumber || 0) - Number(b.dayNumber || 0);
        if (dayDiff !== 0) return dayDiff;
        return String(a.identifiers?.[0] || "").localeCompare(String(b.identifiers?.[0] || ""));
      });

    const recommendationBlocked = failedAssignments.length > 0;

    let nextRecommendation = null;
    if (!recommendationBlocked) {
      const firstIncomplete = lessonStatusByDay.find((l) => !l.isCompleted);
      if (firstIncomplete) {
        nextRecommendation = {
          label: firstIncomplete.label,
          identifiers: firstIncomplete.identifiers,
          dayNumber: firstIncomplete.dayNumber,
          displayDay: firstIncomplete.displayDay,
          displayChapter: firstIncomplete.displayChapter,
          title: firstIncomplete.title,
          goal: firstIncomplete.goal,
          assignmentId: firstIncomplete.assignmentId,
          selfStudy: firstIncomplete.selfStudy,
          submissionRequired: firstIncomplete.submissionRequired,
          practiceKeys: firstIncomplete.practiceKeys,
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
        totalCourseItems,
        submittedCount,
        completedCount: completedAssignments.length,
        completedPracticeCount: lessonStatus.filter((lesson) => lesson.selfStudy && lesson.isCompleted).length,
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
        qualificationMinimum,
      },
    });
  } catch (err) {
    console.error("scores/summary error", err);
    return res.status(500).json({ error: err?.message || "Failed to load score summary" });
  }
};

module.exports = { scoresSummaryHandler, loadCompletedPracticeKeys };
