"use strict";

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
    throw new Error(result?.error || "Student sheet did not confirm an append or update.");
  }
  return result;
}

module.exports = { deliverCurrentStudentToSheet };
