"use strict";

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

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

const parseAssignmentNumber = (assignment = "") => {
  const text = String(assignment || "");

  const dayMatch = text.match(/\bday\s*(\d+(?:\.\d+)?)\b/i);
  if (dayMatch?.[1]) return Number(dayMatch[1]);

  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
};

const uniqSorted = (numbers = []) => {
  const clean = numbers.filter((n) => Number.isFinite(n));
  return Array.from(new Set(clean)).sort((a, b) => a - b);
};

const inferStep = (numbers = []) => {
  const sorted = uniqSorted(numbers);
  if (sorted.length < 2) {
    const hasDecimal = sorted.some((n) => Math.abs(n - Math.round(n)) > 1e-6);
    return hasDecimal ? 0.5 : 1;
  }

  let minDiff = Infinity;
  for (let i = 1; i < sorted.length; i += 1) {
    const diff = sorted[i] - sorted[i - 1];
    if (diff > 1e-6 && diff < minDiff) minDiff = diff;
  }

  if (!Number.isFinite(minDiff) || minDiff <= 1e-6) return 1;
  if (minDiff <= 0.1 + 1e-6) return 0.1;
  if (minDiff <= 0.25 + 1e-6) return 0.25;
  if (minDiff <= 0.5 + 1e-6) return 0.5;
  return 1;
};

const findMissingNumbers = (numbers = []) => {
  const sorted = uniqSorted(numbers);
  if (!sorted.length) return [];

  const step = inferStep(sorted);
  const start = sorted[0] > step ? step : sorted[0];
  const end = sorted[sorted.length - 1];

  const missing = [];
  const round = (v) => Number(v.toFixed(2));

  for (let current = start; current < end - 1e-6; current = round(current + step)) {
    const exists = sorted.some((x) => Math.abs(x - current) < 1e-6);
    if (!exists) missing.push(current);
  }
  return missing;
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
        const num = parseAssignmentNumber(assignment);
        const scoreRaw = get(r, idx.score);
        const scoreNum = Number(scoreRaw);
        const dateRaw = get(r, idx.date);
        const dateMs = parseDateMs(dateRaw);

        return {
          assignment: assignment || "",
          number: Number.isFinite(num) ? num : null,
          score: Number.isFinite(scoreNum) ? scoreNum : null,
          dateRaw,
          dateMs,
          level: get(r, idx.level) || "",
          comments: get(r, idx.comments) || "",
          link: get(r, idx.link) || "",
        };
      });

    if (!mine.length) {
      return res.json({
        student: {
          completedAssignments: [],
          missedAssignments: [],
          failedAssignments: [],
          lastAssignment: "",
          weekAssignments: 0,
          weekAttempts: 0,
          streakDays: 0,
          retriesThisWeek: 0,
        },
      });
    }

    const bestByKey = new Map();
    mine.forEach((row) => {
      const key = row.number !== null ? `N:${row.number}` : `A:${row.assignment}`;
      const prev = bestByKey.get(key);

      const prevScore = prev?.score ?? -Infinity;
      const currScore = row.score ?? -Infinity;

      const shouldReplace =
        currScore > prevScore ||
        (currScore === prevScore && (row.dateMs || 0) > (prev?.dateMs || 0));

      if (!prev || shouldReplace) bestByKey.set(key, row);
    });

    const bestList = Array.from(bestByKey.values());

    const completedAssignments = bestList
      .map((r) => ({
        number: r.number,
        label: r.assignment || (r.number !== null ? `Assignment ${r.number}` : "Assignment"),
        score: r.score,
        date: r.dateRaw,
        level: r.level,
        comments: r.comments,
        link: r.link,
      }))
      .sort((a, b) => (Number(b.number ?? -1) - Number(a.number ?? -1)));

    const completedNumbers = bestList
      .map((r) => r.number)
      .filter((n) => Number.isFinite(n));

    const missingNumbers = findMissingNumbers(completedNumbers);
    const missedAssignments = missingNumbers.map((n) => ({ number: n, label: `Assignment ${n}` }));

    const failedAssignments = bestList
      .filter((r) => Number.isFinite(r.score) && Number(r.score) < 60)
      .map((r) => ({
        number: r.number,
        label: r.assignment || (r.number !== null ? `Assignment ${r.number}` : "Assignment"),
        score: r.score,
      }))
      .sort((a, b) => (Number(a.number ?? 99999) - Number(b.number ?? 99999)));

    const lastAttempt = mine.reduce((acc, cur) => ((cur.dateMs || 0) > (acc?.dateMs || 0) ? cur : acc), null);
    const lastAssignment = lastAttempt?.assignment || "";

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const weekRows = mine.filter((r) => r.dateMs && now - r.dateMs <= sevenDaysMs);
    const weekAttempts = weekRows.length;

    const weekAssignments = new Set(
      weekRows
        .map((r) => (r.number !== null ? `N:${r.number}` : `A:${r.assignment}`))
        .filter(Boolean)
    ).size;

    const retriesThisWeek = Math.max(0, weekAttempts - weekAssignments);

    const streakDays = buildStreakDays(mine.map((r) => r.dateMs));

    return res.json({
      student: {
        completedAssignments,
        missedAssignments,
        failedAssignments,
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
