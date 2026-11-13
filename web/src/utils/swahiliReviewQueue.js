// Firestore user-owned lesson documents may contain learner-controlled fields.
// The canonical path determines ownership; never derive review recipient IDs
// from a submitted studentId, userId or display name.
export function canonicalSwahiliSubmission(entry, day = 1) {
  if (![1, 6].includes(day)) return null;
  const path = String(entry?.ref?.path || "");
  const parts = path.split("/");
  if (parts.length !== 4 || parts[0] !== "users" || !parts[1] || parts[2] !== "swahiliLessons" || parts[3] !== `day-${day}`) return null;
  const ownerId = parts[1];
  const data = entry.data() || {};
  if (data.studentId && data.studentId !== ownerId) return null;
  if (data.userId && data.userId !== ownerId) return null;
  if (data.program !== "swahili" || data.lessonId !== `swahili-day-${day}` || data.status !== "submitted") return null;
  return { ...data, studentId: ownerId, userId: ownerId, path };
}
