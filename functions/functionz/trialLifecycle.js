"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_ACCESS_DAYS = 7;
const TRIAL_RETENTION_DAYS = 30;
const TRIAL_ENROLLMENT_TYPE = "trial";
const TRIAL_ACTIVE_STATUS = "trial_active";
const TRIAL_EXPIRED_STATUS = "trial_expired";

const normalizedValue = (value) =>
  String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "object" && typeof value.toDate === "function") {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const addDays = (date, days) => new Date(date.getTime() + Number(days || 0) * DAY_MS);

const paidAmount = (student = {}) => {
  const value = student.paid ?? student.initialPaymentAmount ?? student.amountPaid ?? 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const isPaidStudent = (student = {}) => {
  const enrollmentType = normalizedValue(student.enrollmentType ?? student.EnrollmentType);
  const paymentStatus = normalizedValue(student.paymentStatus);
  return (
    (enrollmentType && enrollmentType !== TRIAL_ENROLLMENT_TYPE) ||
    ["paid", "partial"].includes(paymentStatus) ||
    paidAmount(student) > 0
  );
};

const isTrialStudent = (student = {}) => {
  if (!student || isPaidStudent(student)) return false;

  const enrollmentType = normalizedValue(student.enrollmentType ?? student.EnrollmentType);
  const status = normalizedValue(student.status);
  if (enrollmentType === TRIAL_ENROLLMENT_TYPE) return true;
  if (enrollmentType) return false;
  if ([TRIAL_ACTIVE_STATUS, TRIAL_EXPIRED_STATUS].includes(status)) return true;
  if (parseDate(student.trialStartedAt) || parseDate(student.trialEndsAt)) return true;

  // Backward compatibility for unpaid seven-day records created before the
  // explicit trial fields were introduced.
  const start = parseDate(student.contractStart || student.joined_at || student.enrollDate);
  const end = parseDate(student.contractEnd);
  if (!start || !end) return false;
  const durationDays = (end.getTime() - start.getTime()) / DAY_MS;
  return durationDays >= 0 && durationDays <= TRIAL_ACCESS_DAYS + 1;
};

const getTrialLifecycle = (student = {}, nowValue = new Date()) => {
  const now = parseDate(nowValue) || new Date();
  const isTrial = isTrialStudent(student);
  const trialStart = isTrial
    ? parseDate(student.trialStartedAt || student.contractStart || student.joined_at || student.enrollDate)
    : null;
  const trialEnd = isTrial
    ? parseDate(student.trialEndsAt || student.contractEnd) ||
      (trialStart ? addDays(trialStart, TRIAL_ACCESS_DAYS) : null)
    : null;
  const dataDeleteAt = isTrial && trialEnd
    ? parseDate(student.dataDeleteAt || student.DataDeleteAt) ||
      addDays(trialEnd, TRIAL_RETENTION_DAYS)
    : null;

  const isActive = Boolean(trialEnd && now.getTime() < trialEnd.getTime());
  const isExpired = Boolean(trialEnd && now.getTime() >= trialEnd.getTime());
  const isRetained = Boolean(
    isExpired && dataDeleteAt && now.getTime() < dataDeleteAt.getTime()
  );
  const shouldPurge = Boolean(
    isExpired && dataDeleteAt && now.getTime() >= dataDeleteAt.getTime()
  );

  return {
    isTrial,
    trialStart,
    trialEnd,
    dataDeleteAt,
    isActive,
    isExpired,
    isRetained,
    shouldPurge,
  };
};

module.exports = {
  DAY_MS,
  TRIAL_ACCESS_DAYS,
  TRIAL_RETENTION_DAYS,
  TRIAL_ENROLLMENT_TYPE,
  TRIAL_ACTIVE_STATUS,
  TRIAL_EXPIRED_STATUS,
  addDays,
  getTrialLifecycle,
  isPaidStudent,
  isTrialStudent,
  normalizedValue,
  parseDate,
};
