"use strict";

/**
 * Extract assignment identifiers from stored fields.
 * - Prefer `assignmentId` (recommended going forward).
 * - Otherwise parse from strings like:
 *   "A1 Assignment 4" -> "4"
 *   "B1 2.4 Wohnung suchen" -> "2.4"
 *   "Lesen & Hören 0.2 and 1.1" -> ["0.2","1.1"]
 */
function extractAssignmentIds(row) {
  const raw =
    row.assignmentId ||
    row.assignment_id ||
    row.chapter ||
    row.assignment ||
    row.topic ||
    "";

  if (Array.isArray(raw)) {
    return raw.flatMap((x) => extractAssignmentIds({ assignmentId: String(x) }));
  }

  const s = String(raw).trim();
  if (!s) return [];

  // If already stored as "0.2_1.1"
  if (s.includes("_")) {
    return s
      .split("_")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  // Try: "A1 Assignment 4"
  const m1 = s.match(/Assignment\s+([0-9]+(?:\.[0-9]+)*)/i);
  if (m1?.[1]) return [m1[1]];

  // Try: "B1 2.4 Wohnung suchen" (pick first number-like token)
  const m2 = s.match(/([0-9]+(?:\.[0-9]+)*)/);
  if (m2?.[1]) return [m2[1]];

  return [];
}

function toDateKey(value) {
  // expects "YYYY-MM-DD" (what you already store)
  // fallback: try Date parsing
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = value ? new Date(value) : null;
  if (!d || isNaN(d.getTime())) return null;
  // YYYY-MM-DD in UTC (Accra is UTC anyway)
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function mondayOfWeekUtc(dateKey) {
  // dateKey: YYYY-MM-DD
  const [y, m, d] = dateKey.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  // JS: Sunday=0, Monday=1...
  const day = dt.getUTCDay();
  const diffToMonday = (day + 6) % 7; // Monday => 0, Sunday => 6
  dt.setUTCDate(dt.getUTCDate() - diffToMonday);

  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysUtc(dateKey, days) {
  const [y, m, d] = dateKey.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Best attempt per (assignmentId).
 * Returns:
 * - best: Map assignmentId -> { bestScore, bestAttempt, attemptsCount }
 * - completedIds: array of assignmentIds
 */
function bestByAssignment(attempts) {
  const best = new Map();

  for (const a of attempts) {
    const ids = extractAssignmentIds(a);
    const score = typeof a.score === "number" ? a.score : Number(a.score ?? 0);

    for (const id of ids) {
      const prev = best.get(id);
      if (!prev) {
        best.set(id, { assignmentId: id, bestScore: score, bestAttempt: a, attemptsCount: 1 });
      } else {
        prev.attemptsCount += 1;
        if (score > prev.bestScore) {
          prev.bestScore = score;
          prev.bestAttempt = a;
        }
      }
    }
  }

  return { best, completedIds: [...best.keys()] };
}

function computeStreakAndWeekly(attempts, weeklyGoal = 3) {
  const daySet = new Set();
  for (const a of attempts) {
    const dayKey = toDateKey(a.date || a.createdAt || a.created_at);
    if (dayKey) daySet.add(dayKey);
  }

  const days = [...daySet].sort().reverse(); // newest first
  if (!days.length) {
    return { streak: 0, weeklyCount: 0, weeklyRemaining: weeklyGoal, weekStart: null };
  }

  // streak: consecutive days ending at latest day
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const expected = addDaysUtc(days[i - 1], -1);
    if (days[i] === expected) streak += 1;
    else break;
  }

  const latest = days[0];
  const weekStart = mondayOfWeekUtc(latest);
  const weeklyCount = days.filter((d) => d >= weekStart).length;
  const weeklyRemaining = Math.max(0, weeklyGoal - weeklyCount);

  return { streak, weeklyCount, weeklyRemaining, weekStart };
}

/**
 * Optional: compute missed/jumped IF you provide scheduleOrder (ordered assignmentIds).
 * Missed = any assignmentId that appears before or at latestCompletedIndex but is not completed.
 */
function computeMissed(completedIds, scheduleOrder) {
  if (!Array.isArray(scheduleOrder) || scheduleOrder.length === 0) {
    return { missed: [], latestCompletedIndex: -1, latestCompletedId: null };
  }

  const completedSet = new Set(completedIds);

  // latest completed index in schedule order
  let latestIdx = -1;
  let latestId = null;
  for (let i = 0; i < scheduleOrder.length; i++) {
    const id = scheduleOrder[i];
    if (completedSet.has(id)) {
      latestIdx = i;
      latestId = id;
    }
  }

  if (latestIdx < 0) return { missed: [], latestCompletedIndex: -1, latestCompletedId: null };

  const missed = [];
  for (let i = 0; i <= latestIdx; i++) {
    const id = scheduleOrder[i];
    if (!completedSet.has(id)) missed.push(id);
  }

  return { missed, latestCompletedIndex: latestIdx, latestCompletedId: latestId };
}

function computeStudentMetrics({ attempts, passMark = 60, scheduleOrder = null }) {
  const { best, completedIds } = bestByAssignment(attempts);

  const failed = [];
  let totalScore = 0;

  for (const [id, row] of best.entries()) {
    totalScore += row.bestScore;
    if (row.bestScore < passMark) failed.push({ assignmentId: id, bestScore: row.bestScore });
  }

  const streakInfo = computeStreakAndWeekly(attempts, 3);
  const missedInfo = computeMissed(completedIds, scheduleOrder);

  return {
    passMark,
    attemptsCount: attempts.length,
    completedCount: completedIds.length,
    totalScore,
    completedIds,
    failed,
    streak: streakInfo.streak,
    weeklyGoal: 3,
    weeklyCount: streakInfo.weeklyCount,
    weeklyRemaining: streakInfo.weeklyRemaining,
    weekStart: streakInfo.weekStart,
    missed: missedInfo.missed,
    latestCompletedId: missedInfo.latestCompletedId,
  };
}

module.exports = {
  extractAssignmentIds,
  bestByAssignment,
  computeStudentMetrics,
};
