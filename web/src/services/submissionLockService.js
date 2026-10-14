import { collection, getDocs, query, where } from "../firebase";

// Firestore rules intentionally deny reading a missing student document by ID:
// it has no owner fields until creation. An owner-filtered collection query
// works for first submissions without weakening those security rules.
export const findOwnedSubmissionDocument = async ({ db, studentId, collectionName, documentId }) => {
  if (!db || !studentId || !documentId ||
      !["submissionLocks", "submissionDrafts"].includes(collectionName)) {
    throw new Error("Invalid student submission document lookup.");
  }
  const snapshot = await getDocs(query(
    collection(db, collectionName),
    where("studentId", "==", studentId),
  ));
  return snapshot.docs.find(entry => entry.id === documentId) || null;
};

export const findOwnedSubmissionLock = ({ db, studentId, lockId }) =>
  findOwnedSubmissionDocument({ db, studentId, collectionName: "submissionLocks", documentId: lockId });

export const findOwnedSubmissionDraft = ({ db, studentId, draftId }) =>
  findOwnedSubmissionDocument({ db, studentId, collectionName: "submissionDrafts", documentId: draftId });
