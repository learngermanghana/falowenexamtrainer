"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCandidateClassSessions, queryPlans } = require("../classSessionReminderQueries");

const nowMs = Date.parse("2026-10-17T10:00:00.000Z");
const Timestamp = { fromMillis: ms => ({ kind: "timestamp", ms }) };

function compare(left, right) {
  if (left && right && left.kind === "timestamp" && right.kind === "timestamp") {
    return left.ms - right.ms;
  }
  if (typeof left === "string" && typeof right === "string") return left.localeCompare(right);
  if (typeof left === "number" && typeof right === "number") return left - right;
  return NaN;
}

function mockCollection(docs) {
  const query = filters => ({
    where(field, op, bound) {
      return query([...filters, { field, op, bound }]);
    },
    async get() {
      return {
        docs: docs.filter(doc => filters.every(({ field, op, bound }) => {
          const cmp = compare(doc.data[field], bound);
          return Number.isFinite(cmp) && (op === ">=" ? cmp >= 0 : cmp <= 0);
        })).map(doc => ({ id: doc.id, data: () => doc.data }))
      };
    }
  });
  return { where: (field, op, bound) => query([{ field, op, bound }]) };
}

test("creates inclusive bounded plans for legacy timestamp, ISO and date fields", () => {
  const plans = queryPlans(nowMs, Timestamp);
  assert.ok(plans.some(plan => plan.field === "startsAt" && typeof plan.lower === "string"));
  assert.ok(plans.some(plan => plan.field === "startAt" && plan.lower.kind === "timestamp"));
  assert.ok(plans.some(plan => plan.field === "date" && plan.lower === "2026-10-17"));
  assert.ok(plans.every(plan => plan.field && plan.lower != null && plan.upper != null));
});

test("only loads imminent sessions, supports mixed formats and de-duplicates results", async () => {
  const docs = [
    { id: "iso", data: { startsAt: "2026-10-17T11:00:00.000Z", date: "2026-10-17" } },
    { id: "stamp", data: { startAt: Timestamp.fromMillis(nowMs + 60 * 60000) } },
    { id: "legacy", data: { date: "2026-10-18", time: "08:00" } },
    { id: "future", data: { startsAt: "2026-11-01T11:00:00.000Z" } },
    { id: "old", data: { startsAt: "2026-08-01T11:00:00.000Z" } },
  ];
  const results = await loadCandidateClassSessions({ collection: mockCollection(docs), Timestamp, nowMs });
  assert.deepEqual(results.map(doc => doc.id).sort(), ["iso", "legacy", "stamp"]);
});
