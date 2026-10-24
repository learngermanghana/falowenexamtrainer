"use strict";

function permanentSheetFailure(result = {}) {
  const message = String(result.error || "");
  const status = Number(result.errorStatus || 0);
  const reason = String(result.errorReason || "");
  // Google can return 403 for rate limiting as well as denied access.
  if (/rateLimit|quota|backendError/i.test(reason + " " + message)) return false;
  return [400, 401, 403, 404].includes(status)
    || /Missing STUDENTS_SHEET_ID|Missing GOOGLE_SERVICE_ACCOUNT_JSON|missing a StudentCode column header|Sheet tab .* not found|invalid_grant|invalid_client|invalid credentials|permission denied|caller does not have permission/i.test(message);
}

// Always read the current document: retries of older events must not revert a
// later Admin edit or recreate a permanently deleted student's sheet row.
async function deliverCurrentStudentToSheet({ snapshot, appendStudent, studentCode }) {
  const current = await snapshot.ref.get();
  if (!current.exists) return { skipped: true, reason: "student_deleted" };
  const student = current.data() || {};
  const status = String(student.status || "").trim().toLowerCase();
  if (["deleted", "purged"].includes(status)) {
    return { skipped: true, reason: "student_deleted" };
  }
  const result = await appendStudent({
    ...student,
    studentCode: String(student.studentCode || studentCode || current.id || "").trim(),
  });
  // The legacy safe appender returns errors rather than rejecting. A Firestore
  // trigger must reject so Firebase retries the delivery instead of losing it.
  if (!result || result.error || !["appended", "updated"].includes(result.action)) {
    if (result && permanentSheetFailure(result)) {
      console.error("student_sheet_sync_configuration_failure", {
        studentCode: String(student.studentCode || studentCode || current.id || ""),
        status: result.errorStatus || "configuration",
      });
      return { failed: true, retryable: false, reason: "permanent_sheet_failure" };
    }
    throw new Error(result?.error || "Student sheet did not confirm an append or update.");
  }
  return result;
}

module.exports = { deliverCurrentStudentToSheet, permanentSheetFailure };
