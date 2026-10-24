"use strict";

// The graded B1 Day 23 speaking assessment has a 20-minute clock per Teil.
// Expiry must be enforced by the server, not merely hidden in the student UI.
const B1_COURSE_SPEAKING_MS = 20 * 60 * 1000;
const B1_COURSE_ASSIGNMENT = "B1-7.23";

const firestoreTimeMs = value => {
  if (!value) return NaN;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") {
    return value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6);
  }
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") return Date.parse(value);
  return NaN;
};

const sessionDeadline = session => {
  const expiry = Date.parse(session?.expiresAt || "");
  if (session?.examTask?.courseAssignmentKey !== B1_COURSE_ASSIGNMENT) return expiry;
  // Bound existing sessions as well. An older saved session may have been
  // issued a much longer expiry, which made the learner see 60+ minutes.
  const began = firestoreTimeMs(session.windowStartedAt || session.startedAt);
  return Number.isFinite(began) && Number.isFinite(expiry)
    ? Math.min(expiry, began + B1_COURSE_SPEAKING_MS)
    : expiry;
};

const visibleExpiry = session => {
  const deadline = sessionDeadline(session);
  return Number.isFinite(deadline) ? new Date(deadline).toISOString() : session?.expiresAt;
};

module.exports = { B1_COURSE_SPEAKING_MS, B1_COURSE_ASSIGNMENT, firestoreTimeMs, sessionDeadline, visibleExpiry };
