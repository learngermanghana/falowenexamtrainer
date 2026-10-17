"use strict";

// Preserve existing schedule field formats while avoiding a full collection scan
// every five minutes. Single-field range indexes are provided by Firestore.
const START_FIELDS = Object.freeze([
  "startAt", "startsAt", "startDateTime", "scheduledAt",
  "dateTime", "sessionStart", "start"
]);
const DATE_FIELDS = Object.freeze(["date", "sessionDate", "day"]);
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const TWENTY_FIVE_HOURS_MS = 25 * 60 * 60 * 1000;

function queryPlans(nowMs, Timestamp) {
  const lowerMs = nowMs - THREE_HOURS_MS;
  const upperMs = nowMs + TWENTY_FIVE_HOURS_MS;
  const ranges = [
    [Timestamp.fromMillis(lowerMs), Timestamp.fromMillis(upperMs)],
    [new Date(lowerMs).toISOString(), new Date(upperMs).toISOString()],
    [lowerMs, upperMs],
    [Math.floor(lowerMs / 1000), Math.ceil(upperMs / 1000)]
  ];
  const plans = START_FIELDS.flatMap(field =>
    ranges.map(([lower, upper]) => ({ field, lower, upper }))
  );
  const fromDate = new Date(lowerMs).toISOString().slice(0, 10);
  const toDate = new Date(upperMs).toISOString().slice(0, 10);
  DATE_FIELDS.forEach(field => plans.push({ field, lower: fromDate, upper: toDate }));
  return plans;
}

async function loadCandidateClassSessions({ collection, Timestamp, nowMs = Date.now() }) {
  const plans = queryPlans(nowMs, Timestamp);
  const sessions = new Map();

  // Limit concurrent queries; a single slow query must not create a large
  // burst of outgoing requests or memory pressure on a warm instance.
  for (let offset = 0; offset < plans.length; offset += 6) {
    const group = plans.slice(offset, offset + 6);
    const results = await Promise.all(group.map(({ field, lower, upper }) =>
      collection.where(field, ">=", lower).where(field, "<=", upper).get()
    ));
    for (const snapshot of results) {
      for (const docSnap of snapshot.docs || []) {
        sessions.set(docSnap.id, docSnap);
      }
    }
  }
  return [...sessions.values()];
}

module.exports = { loadCandidateClassSessions, queryPlans };
