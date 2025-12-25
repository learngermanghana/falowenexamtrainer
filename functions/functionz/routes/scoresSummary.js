"use strict";

const admin = require("firebase-admin");
const { courseSchedulesByName } = require("../../data/courseSchedulesByName");

if (!admin.apps.length) {
  admin.initializeApp();
}

const PASS_MARK = 60;

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

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentCell += "\"";
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

// ---- Identifier parsing (STRING-based, preserves 4.10 etc) ----
const extractNumsWithPos = (text = "") => {
  const s = String(text || "");
  const regex = /(\d+(?:\.\d+)?)/g;
  const out = [];
  let m;
  while ((m = regex.exec(s)) !== null) {
    out.push({ raw: m[1], index: m.index });
  }
  return out;
};

const normalizeIdentifier = (raw = "") => {
  const s = String(raw || "").trim();
  if (!s) return null;
  if (!/^\d+(\.\d+)?$/.test(s)) return null;

  const [majorRaw, minorRaw] = s.split(".");
  // Remove leading zeros in major part only
  const major = String(Number(majorRaw));
  if (minorRaw === undefined) return major;
  // Keep minor as-is (preserves 10 in 4.10)
  return `${major}.${minorRaw}`;
};

const pickIdentifierFromText = (assignmentText, plannedSet) => {
  const matches = extractNumsWithPos(assignmentText)
    .map((m) => ({
      ...m,
      id: normalizeIdentifier(m.raw),
    }))
    .filter((m) => m.id);

  if (!matches.length) return null;

  // Prefer an identifier that exists in the schedule (plannedSet),
  // and prefer the one closest to the end of the string.
  const plannedMatches = matches.filter((m) => plannedSet.has(m.id));
  if (plannedMatches.length) {
    plannedMatches.sort((a, b) => b.index - a.index);
    return plannedMatches[0].id;
  }

  // Fallback: first number found
  return matches[0].id;
};

const parseDateMs = (value) => {
  if (!value) return 0;
  const ms = Date.parse(String(value));
  return Number.isFinite(ms) ? ms : 0;
};

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

// ---- Schedule scanning ----
const buildPlannedLessons = (student) => {
  const className =
    student?.className || student?.classname || student?.class || "";

  const schedule = className ? courseSchedulesByName[className] : null;
  if (!schedule?.days?.length) {
    return { lessons: [], plannedSet: new Set(), course: "", className: className || "" };
  }

  const lessons = [];
  for (const day of schedule.days) {
    const sessions = Array.isArray(day.sessions) ? day.sessions : [];
    for (const session of sessions) {
      const refText = session.chapter || session.title || "";
      const ids = extractNumsWithPos(refText)
        .map((m) => normalizeIdentifier(m.raw))
        .filter(Boolean);

      // skip things like "Exam tips"
      if (!ids.length) continue;

      const label = session.title
        ? `Day ${day.dayNumber}: ${session.title}`
        : `Day ${day.dayNumber}: Chapter ${session.chapter} – ${session.type || "Session"}${
            session.note ? ` (${session.note})` : ""
          }`;

      lessons.push({
        dayNumber: Number(day.dayNumber) || 0,
        date: day.date || "",
        label,
        identifiers: ids,
      });
    }
  }

  const plannedSet = new Set(lessons.flatMap((l) => l.identifiers));
  return { lessons, plannedSet, course: schedule.course || "", className: schedule.className || className };
};

const requireAuth = async (req) => {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) throw new Error("Missing Authorization Bearer token.");
  const decoded = await admin.auth().verifyIdToken(match[1]);
  return decoded;
};

const scoresSummaryHandler = async (req, res) => {
  try {
    const decoded = await requireAuth(req);

    const studentCode = String(req.query.studentCode || "").trim();
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const db = admin.firestore();
    const studentSnap = await db.collection("students").doc(studentCode).get();
    if (!studentSnap.exists) return res.status(404).json({ error: "Student not found" });

    const student = studentSnap.data() || {};
    if (student.uid && student.uid !== decoded.uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { lessons, plannedSet, course: scheduleCourse } = buildPlannedLessons(student);

    const expectedLevel = String(
      scheduleCourse || student.level || student.course || ""
    ).trim().toUpperCase();

    const CSV_URL =
      process.env.SCORES_SHEET_PUBLISHED_CSV_URL ||
      "PASTE_YOUR_PUBLISHED_CSV_URL_HERE";

    if (!CSV_URL || CSV_URL.includes("PASTE_YOUR")) {
      return res.status(500).json({ error: "SCORES_SHEET_PUBLISHED_CSV_URL is missing" });
    }

    const csvRes = await fetch(CSV_URL);
    if (!csvRes.ok) return res.status(502).json({ error: `CSV fetch failed (${csvRes.status})` });

    const csvText = await csvRes.text();
    const rows = parseCsv(csvText);
    if (!rows.length) return res.json({ student: null });

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
      assignment: findIndexByHeader(header, ["assignment", "task", "topic", "day", "title"]),
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

    const mine = rows
      .slice(1)
      .filter((r) => get(r, idx.studentCode) === studentCode)
      .map((r) => {
        const assignment = get(r, idx.assignment);
        const scoreRaw = get(r, idx.score);
        const scoreNum = Number(scoreRaw);
        const dateRaw = get(r, idx.date);
        const dateMs = parseDateMs(dateRaw);
        const rowLevel = get(r, idx.level) || "";

        const identifier = pickIdentifierFromText(assignment, plannedSet);

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
        if (!expectedLevel) return true;
        const lv = String(row.level || "").trim().toUpperCase();
        return !lv || lv === expectedLevel;
      });

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
        },
      });
    }

    // Best attempt per identifier (highest score, tie -> latest)
    const bestById = new Map();
    for (const row of mine) {
      if (!row.identifier) continue;
      if (!Number.isFinite(row.score)) continue;

      const prev = bestById.get(row.identifier);
      const prevScore = prev?.score ?? -Infinity;
      const currScore = row.score ?? -Infinity;

      const shouldReplace =
        currScore > prevScore ||
        (currScore === prevScore && (row.dateMs || 0) > (prev?.dateMs || 0));

      if (!prev || shouldReplace) bestById.set(row.identifier, row);
    }

    const passSet = new Set();
    const failedIdSet = new Set();

    for (const [id, best] of bestById.entries()) {
      if (!plannedSet.size || plannedSet.has(id)) {
        if ((best.score ?? -Infinity) >= PASS_MARK) passSet.add(id);
        else failedIdSet.add(id);
      }
    }

    // Lesson status against schedule
    const lessonStatus = lessons.map((l) => {
      const isCompleted = l.identifiers.every((id) => passSet.has(id));
      const hasFailed = l.identifiers.some((id) => failedIdSet.has(id));
      return { ...l, isCompleted, hasFailed };
    });

    const failedLessons = lessonStatus
      .filter((l) => l.hasFailed)
      .map((l) => ({
        label: l.label,
        identifiers: l.identifiers,
      }));

    // Highest day fully done
    const byDay = new Map();
    for (const l of lessonStatus) {
      if (!byDay.has(l.dayNumber)) byDay.set(l.dayNumber, []);
      byDay.get(l.dayNumber).push(l);
    }

    let maxDayFullyDone = 0;
    for (const [dayNum, dayLessons] of byDay.entries()) {
      if (dayLessons.every((x) => x.isCompleted)) {
        if (dayNum > maxDayFullyDone) maxDayFullyDone = dayNum;
      }
    }

    const missedLessons = lessonStatus
      .filter((l) => l.dayNumber <= maxDayFullyDone && !l.isCompleted && !l.hasFailed)
      .map((l) => ({
        label: l.label,
        identifiers: l.identifiers,
      }));

    const recommendationBlocked = failedLessons.length > 0;

    let nextRecommendation = null;
    if (!recommendationBlocked) {
      const firstIncomplete = lessonStatus.find((l) => !l.isCompleted);
      if (firstIncomplete) {
        nextRecommendation = {
          label: firstIncomplete.label,
          identifiers: firstIncomplete.identifiers,
          dayNumber: firstIncomplete.dayNumber,
          date: firstIncomplete.date,
        };
      }
    }

    // Completed assignments = passed identifiers (best attempt)
    const completedAssignments = Array.from(passSet)
      .map((id) => {
        const best = bestById.get(id);
        return {
          identifier: id,
          label: best?.assignment || `Assignment ${id}`,
          score: best?.score ?? null,
          date: best?.dateRaw || "",
          level: best?.level || "",
          comments: best?.comments || "",
          link: best?.link || "",
        };
      });

    // Weekly stats and streak are still based on ALL attempts
    const lastAttempt = mine.reduce(
      (acc, cur) => ((cur.dateMs || 0) > (acc?.dateMs || 0) ? cur : acc),
      null
    );
    const lastAssignment = lastAttempt?.assignment || "";

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const weekRows = mine.filter((r) => r.dateMs && now - r.dateMs <= sevenDaysMs);
    const weekAttempts = weekRows.length;

    const weekAssignments = new Set(
      weekRows
        .map((r) => r.identifier || r.assignment)
        .filter(Boolean)
    ).size;

    const retriesThisWeek = Math.max(0, weekAttempts - weekAssignments);
    const streakDays = buildStreakDays(mine.map((r) => r.dateMs));

    return res.json({
      student: {
        completedAssignments,
        missedAssignments: missedLessons,
        failedAssignments: failedLessons,
        failedIdentifiers: Array.from(failedIdSet),
        nextRecommendation,
        recommendationBlocked,
        lastAssignment,
        weekAssignments,
        weekAttempts,
        streakDays,
        retriesThisWeek,
      },
    });
  } catch (err) {
    console.error("scores/summary error", err);
    return res.status(500).json({ error: err?.message || "Failed to load score summary" });
  }
};

module.exports = { scoresSummaryHandler };
