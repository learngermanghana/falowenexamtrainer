/**
 * Firebase Functions API (v2)
 * Endpoints:
 *  GET  /health
 *  GET  /api/scores?studentcode=...&limit=50
 *  GET  /api/metrics?studentcode=...&level=A1&className=A1%20Bonn%20Klasse
 *  GET  /api/leaderboard?level=A1
 */

const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// OPTIONAL: if you want missed assignments, copy your schedules to functions/data (see section 3)
// let courseSchedulesByName = null;
// try {
//   courseSchedulesByName = require("./data/courseSchedulesByName").courseSchedulesByName;
// } catch (e) {
//   courseSchedulesByName = null;
// }

setGlobalOptions({ maxInstances: 10 });

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const PASS_MARK = 60;
const WEEKLY_GOAL = 3;

/** Helpers */
function safeStr(v) {
  return v === undefined || v === null ? "" : String(v).trim();
}

function safeNum(v) {
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

function parseAssignmentId(assignmentText) {
  // "A1 Assignment 0.2" -> "0.2"
  // "B1 2.4 Wohnung suchen" -> "2.4"
  // "A1 Assignment 9_10" -> "9_10"
  const t = safeStr(assignmentText);
  const m = t.match(/(\d+(?:\.\d+)?(?:_\d+(?:\.\d+)?)*)/);
  return m ? m[1] : "";
}

function toYmd(value) {
  // Accepts "2025-12-16" or ISO, returns "YYYY-MM-DD" when possible
  const s = safeStr(value);
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  // convert to YYYY-MM-DD in UTC (good enough since your sheet already uses YYYY-MM-DD)
  return d.toISOString().slice(0, 10);
}

function ymdToInt(ymd) {
  // "2025-12-16" => 20251216
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return 0;
  return Number(ymd.replaceAll("-", ""));
}

function getMondayYmd(ymd) {
  // given YYYY-MM-DD, return Monday of that week (YYYY-MM-DD), using UTC math
  const d = new Date(ymd + "T00:00:00Z");
  if (isNaN(d.getTime())) return "";
  const day = d.getUTCDay(); // 0=Sun ... 1=Mon
  const diffToMon = (day === 0 ? -6 : 1 - day);
  d.setUTCDate(d.getUTCDate() + diffToMon);
  return d.toISOString().slice(0, 10);
}

function groupBestByAssignment(attempts) {
  // attempts: [{assignmentId, score, ...}]
  const best = new Map();
  for (const a of attempts) {
    const id = a.assignmentId || parseAssignmentId(a.assignment || a.assignmentText || "");
    if (!id) continue;
    const s = typeof a.score === "number" ? a.score : safeNum(a.score);
    if (s === null) continue;

    const prev = best.get(id);
    if (!prev || s > prev.score) best.set(id, { ...a, assignmentId: id, score: s });
  }
  return [...best.values()];
}

function leaderboardFromAttempts(bestAttemptsForLevel) {
  // Input: best attempts across all students for a level (already best per assignment OR raw but we will best-per-student-per-assignment)
  // Normalize: best per studentCode + assignmentId
  const perStudent = new Map(); // studentCode -> Map(assignmentId -> bestScore)
  const studentNames = new Map();

  for (const a of bestAttemptsForLevel) {
    const studentCode = safeStr(a.studentCode);
    if (!studentCode) continue;
    const assignmentId = safeStr(a.assignmentId) || parseAssignmentId(a.assignmentText || a.assignment || "");
    if (!assignmentId) continue;

    const score = typeof a.score === "number" ? a.score : safeNum(a.score);
    if (score === null) continue;

    studentNames.set(studentCode, safeStr(a.name) || safeStr(a.studentName) || "");

    if (!perStudent.has(studentCode)) perStudent.set(studentCode, new Map());
    const m = perStudent.get(studentCode);

    const prev = m.get(assignmentId);
    if (prev === undefined || score > prev) m.set(assignmentId, score);
  }

  // Build rows, filter min 3 assignments
  const rows = [];
  for (const [studentCode, m] of perStudent.entries()) {
    const completions = m.size;
    if (completions < 3) continue;
    let total = 0;
    for (const v of m.values()) total += v;
    rows.push({
      studentCode,
      name: studentNames.get(studentCode) || "",
      totalScore: total,
      completions,
    });
  }

  // Sort: total desc, then completions desc
  rows.sort((a, b) => (b.totalScore - a.totalScore) || (b.completions - a.completions));
  rows.forEach((r, idx) => (r.rank = idx + 1));
  return rows;
}

/** Endpoints */

app.get("/health", async (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/scores", async (req, res) => {
  try {
    const studentCode = safeStr(req.query.studentcode);
    const limit = Math.min(Number(req.query.limit || 50), 200);

    if (!studentCode) return res.status(400).json({ error: "Missing studentcode" });

    // Your scores docs created from sheet sync use fields:
    // studentCode, name, assignmentText, assignmentId, score, comments, date, dateIso, level, link
    const snap = await db
      .collection("scores")
      .where("studentCode", "==", studentCode)
      .orderBy("dateIso", "desc")
      .limit(limit)
      .get();

    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ studentCode, count: items.length, items });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const level = safeStr(req.query.level);
    if (!level) return res.status(400).json({ error: "Missing level" });

    // Pull a chunk for this level (adjust if needed)
    const snap = await db
      .collection("scores")
      .where("level", "==", level)
      .orderBy("dateIso", "desc")
      .limit(5000)
      .get();

    const attempts = snap.docs.map((d) => d.data());

    // Leaderboard uses best attempt per assignment per student
    const rows = leaderboardFromAttempts(attempts);

    res.json({
      level,
      minAssignmentsToRank: 3,
      count: rows.length,
      rows: rows.slice(0, 50), // top 50
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/api/metrics", async (req, res) => {
  try {
    const studentCode = safeStr(req.query.studentcode);
    const level = safeStr(req.query.level);
    const className = safeStr(req.query.className);

    if (!studentCode) return res.status(400).json({ error: "Missing studentcode" });
    if (!level) return res.status(400).json({ error: "Missing level" });

    // 1) Fetch student's attempts for this level
    const snap = await db
      .collection("scores")
      .where("studentCode", "==", studentCode)
      .where("level", "==", level)
      .orderBy("dateIso", "desc")
      .limit(2000)
      .get();

    const attempts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // 2) Failed assignments = best score per identifier < PASS_MARK
    const best = groupBestByAssignment(attempts);
    const failed = best
      .filter((a) => typeof a.score === "number" && a.score < PASS_MARK)
      .sort((a, b) => (a.score - b.score));

    // 3) Streak + weekly goal
    // Use distinct submission days (YYYY-MM-DD)
    const days = new Set();
    for (const a of attempts) {
      const ymd = toYmd(a.date) || toYmd(a.dateIso);
      if (ymd) days.add(ymd);
    }
    const dayList = [...days].sort((a, b) => ymdToInt(b) - ymdToInt(a)); // desc
    let streak = 0;
    if (dayList.length) {
      // Count consecutive days backwards from most recent day
      let cur = dayList[0];
      streak = 1;
      for (let i = 1; i < dayList.length; i++) {
        const prev = dayList[i];
        // check if prev is exactly 1 day before cur
        const curDate = new Date(cur + "T00:00:00Z");
        curDate.setUTCDate(curDate.getUTCDate() - 1);
        const expected = curDate.toISOString().slice(0, 10);
        if (prev === expected) {
          streak++;
          cur = prev;
        } else {
          break;
        }
      }
    }

    const todayYmd = new Date().toISOString().slice(0, 10);
    const monday = getMondayYmd(todayYmd);
    const weeklyCount = dayList.filter((d) => ymdToInt(d) >= ymdToInt(monday)).length;
    const remainingToGoal = Math.max(0, WEEKLY_GOAL - weeklyCount);

    // 4) Leaderboard rank (same level) for this student
    const levelSnap = await db
      .collection("scores")
      .where("level", "==", level)
      .orderBy("dateIso", "desc")
      .limit(5000)
      .get();

    const levelAttempts = levelSnap.docs.map((d) => d.data());
    const board = leaderboardFromAttempts(levelAttempts);
    const me = board.find((r) => r.studentCode === studentCode) || null;

    // 5) Missed assignments (OPTIONAL): only works if you copy schedules to functions/data
    let missed = [];
    let missedEnabled = false;

    // if (courseSchedulesByName && className && courseSchedulesByName[className]) {
    //   missedEnabled = true;
    //   const schedule = courseSchedulesByName[className];
    //   const scheduled = [];
    //   for (const day of schedule.days || []) {
    //     const ymd = safeStr(day.date);
    //     for (const s of day.sessions || []) {
    //       const chapter = safeStr(s.chapter) || parseAssignmentId(s.title || "");
    //       const id = parseAssignmentId(chapter) || safeStr(chapter);
    //       if (!id || !ymd) continue;
    //       scheduled.push({ date: ymd, assignmentId: id, raw: s });
    //     }
    //   }
    //   scheduled.sort((a, b) => ymdToInt(a.date) - ymdToInt(b.date));
    //
    //   const completedIds = new Set(best.map((b) => b.assignmentId).filter(Boolean));
    //
    //   // Find latest completed scheduled day
    //   let latestCompletedDay = "";
    //   for (const item of scheduled) {
    //     if (completedIds.has(item.assignmentId)) latestCompletedDay = item.date;
    //   }
    //
    //   // Missed = scheduled on/before latestCompletedDay but not completed
    //   missed = scheduled
    //     .filter((x) => latestCompletedDay && ymdToInt(x.date) <= ymdToInt(latestCompletedDay))
    //     .filter((x) => !completedIds.has(x.assignmentId));
    // }

    res.json({
      studentCode,
      level,
      passMark: PASS_MARK,
      weeklyGoal: WEEKLY_GOAL,

      attemptsCount: attempts.length,

      failedAssignments: {
        count: failed.length,
        first: failed[0]
          ? {
              assignmentId: failed[0].assignmentId,
              assignmentText: failed[0].assignmentText || failed[0].assignment || "",
              bestScore: failed[0].score,
              comments: failed[0].comments || "",
              date: failed[0].date || "",
              link: failed[0].link || "",
            }
          : null,
      },

      streak: {
        days: streak,
        mostRecentSubmissionDay: dayList[0] || null,
      },

      weekly: {
        monday,
        submissionsThisWeek: weeklyCount,
        remainingToGoal,
      },

      leaderboard: {
        appears: !!me,
        rank: me ? me.rank : null,
        totalScore: me ? me.totalScore : null,
        completions: me ? me.completions : null,
        rankedStudents: board.length,
      },

      missedAssignments: {
        enabled: missedEnabled,
        count: missed.length,
        preview: missed.slice(0, 5),
      },
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message || String(e) });
  }
});

// Export one HTTPS function that hosts the Express app
exports.api = onRequest(app);
