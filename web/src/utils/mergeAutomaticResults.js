export const isAuthoritativeScore = row => row?.scoreOverrideAuthoritative === true
  || row?.manualScoreOverride === true || row?.manuallyEdited === true || row?.reviewedByTutor === true;

export function resultTimestamp(value) {
  if (value == null || value === "") return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6);
  if (typeof value?._seconds === "number") return value._seconds * 1000 + Math.floor((value._nanoseconds || 0) / 1e6);
  const parsed = value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
const assignmentKey = row => String(row.assignmentKey || row.canonicalAssignmentKey || row.assignment_id || row.assignmentId || row.assignment || "").trim().toUpperCase();
const rowDate = row => Math.max(...[row.updatedAt, row.manuallyEditedAt, row.date, row.createdAt].map(resultTimestamp).filter(value => value !== null), 0);
const attempt = row => row.attempt ?? row.attemptNumber ?? row.attempt_number ?? null;

function sameAttempt(left, right) {
  if (assignmentKey(left) !== assignmentKey(right)) return false;
  if (left.submissionPath && right.submissionPath) return left.submissionPath === right.submissionPath;
  if (left.submissionId && right.submissionId) return left.submissionId === right.submissionId;
  if (attempt(left) != null && attempt(right) != null) return String(attempt(left)) === String(attempt(right));
  // Older Sheet projections have no submission ID: an exact date + score identifies
  // the same published attempt without collapsing other attempts of this assignment.
  const leftDate = resultTimestamp(left.date) ?? resultTimestamp(left.createdAt);
  const rightDate = resultTimestamp(right.date) ?? resultTimestamp(right.createdAt);
  return leftDate !== null && leftDate === rightDate && (Number(left.score) === Number(right.score) || isAuthoritativeScore(left) || isAuthoritativeScore(right));
}

export function mergeAutomaticResults(history = [], automatic = []) {
  const rows = [...history];
  for (const saved of automatic) {
    const index = rows.findIndex(row => sameAttempt(row, saved));
    if (index < 0) rows.push(saved);
    else {
      const current = rows[index];
      const corrected = isAuthoritativeScore(saved);
      const currentCorrected = isAuthoritativeScore(current);
      if ((corrected && !currentCorrected) || (corrected === currentCorrected && rowDate(saved) >= rowDate(current))) {
        rows[index] = { ...current, ...saved };
      }
    }
  }
  return rows;
}
