"use strict";

// Keep this list aligned with the fields written by functionz/studentsSheet.js.
// Changes to unrelated profile, learning, presence or push-token fields should
// never force a full Google Sheets upsert.
const SHEET_INPUT_FIELDS = Object.freeze([
  "studentCode", "studentcode", "uid", "email", "name", "phone",
  "location", "level", "className", "status", "enrollDate", "joined_at",
  "initialPaymentAmount", "paidAmount", "paid", "balanceDue", "balance",
  "tuitionFee", "paymentStatus", "contractStart", "contractEnd",
  "trialStartedAt", "trialEndsAt", "trialPurgeAt", "trialUsedAt",
  "trialConvertedAt", "learningMode", "address", "contractMergeMode",
  "upgradeCarryoverUntil", "upgradeFromLevel", "upgradeToLevel",
  "upgradeQueuedAt", "emergencyContactPhone", "dailyLimit", "usesToday",
  "lastDate", "reminderSent", "enrollmentSent", "lastPaidRecorded",
  "balanceGraceNoticeSent", "paymentReminderLastSent",
  "paymentReminderCount"
]);

function comparable(value) {
  if (value == null) return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value === "object" && typeof value.seconds === "number") {
    return value.seconds * 1000 + Math.floor(Number(value.nanoseconds || 0) / 1e6);
  }
  if (Array.isArray(value)) return value.map(comparable);
  if (typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, comparable(value[key])]));
  }
  return value;
}

function shouldSyncStudentSheet(before, after) {
  if (!before || !after) return true;
  return SHEET_INPUT_FIELDS.some(field =>
    JSON.stringify(comparable(before[field])) !== JSON.stringify(comparable(after[field]))
  );
}

module.exports = { SHEET_INPUT_FIELDS, shouldSyncStudentSheet };
