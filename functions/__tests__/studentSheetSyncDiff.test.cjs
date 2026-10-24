"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { shouldSyncStudentSheet } = require("../studentSheetSyncDiff");

test("ignores presence, notifications and learning-only updates", () => {
  const before = { email: "a@example.com", className: "A1", paid: 100, messagingTokens: ["old"] };
  const after = { ...before, lastActiveAt: "now", messagingTokens: ["new"], streak: 4 };
  assert.equal(shouldSyncStudentSheet(before, after), false);
});

test("syncs payments, contract state, and student identity changes", () => {
  const base = { email: "a@example.com", className: "A1", paid: 100, contractEnd: "2026-11-01" };
  for (const patch of [{ paid: 200 }, { contractEnd: "2027-11-01" }, { className: "B1" }, { email: "b@example.com" }, { paymentStatus: "paid" }]) {
    assert.equal(shouldSyncStudentSheet(base, { ...base, ...patch }), true);
  }
});

test("handles Firestore timestamp value comparisons and missing snapshots", () => {
  const ts = millis => ({ seconds: Math.floor(millis / 1000), nanoseconds: (millis % 1000) * 1e6 });
  assert.equal(shouldSyncStudentSheet({ contractEnd: ts(1000) }, { contractEnd: ts(1000), lastActiveAt: Date.now() }), false);
  assert.equal(shouldSyncStudentSheet({ contractEnd: ts(1000) }, { contractEnd: ts(2000) }), true);
  assert.equal(shouldSyncStudentSheet(null, { email: "a@example.com" }), true);
});
