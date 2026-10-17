export function resultTimestamp(value) {
  if (value == null || value === "") return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6);
  const parsed = value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
const assignmentKey = row => String(row.assignment_id || row.assignmentId || row.assignment || "").trim().toUpperCase();
const rowDate = row => resultTimestamp(row.updatedAt) ?? resultTimestamp(row.date) ?? resultTimestamp(row.createdAt);
const attempt = row => row.attempt ?? row.attemptNumber ?? row.attempt_number ?? null;

function sameAttempt(left, right) {
  if (assignmentKey(left) !== assignmentKey(right)) return false;
  if (left.submissionId && right.submissionId) return left.submissionId === right.submissionId;
  if (attempt(left) != null && attempt(right) != null) return String(attempt(left)) === String(attempt(right));
  // Older Sheet projections have no submission ID: an exact date + score identifies
  // the same published attempt without collapsing other attempts of this assignment.
  const leftDate = resultTimestamp(left.date) ?? resultTimestamp(left.createdAt);
  const rightDate = resultTimestamp(right.date) ?? resultTimestamp(right.createdAt);
  return leftDate !== null && leftDate === rightDate && Number(left.score) === Number(right.score);
}

export function mergeAutomaticResults(history = [], automatic = []) {
  const rows = [...history];
  for (const saved of automatic) {
    const index = rows.findIndex(row => sameAttempt(row, saved));
    if (index < 0) rows.push(saved);
    else if ((rowDate(saved) ?? 0) >= (rowDate(rows[index]) ?? 0)) rows[index] = { ...rows[index], ...saved };
  }
  return rows;
}
