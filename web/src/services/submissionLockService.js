import { collection, getDocs, query, where } from "../firebase";

export const findOwnedSubmissionLock = async ({ db, studentId, lockId }) => {
  // Rules can authorize this ownership-filtered query even when the student's
  // first submission has no lock. A direct get of a missing lock is denied.
  const snapshot = await getDocs(query(
    collection(db, "submissionLocks"),
    where("studentId", "==", studentId),
  ));
  return snapshot.docs.find((entry) => entry.id === lockId) || null;
};
