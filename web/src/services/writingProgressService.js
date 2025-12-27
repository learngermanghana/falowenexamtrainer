import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

const COLLECTION_NAME = "writingProgress";

const normalizeOwnerKey = (value = "") => value.trim().toLowerCase();

const buildDocId = ({ userId, studentCode, mode } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  return `${owner}__${mode || "course"}`;
};

export const loadWritingProgress = async ({ userId, studentCode, mode } = {}) => {
  if ((!userId && !studentCode) || !isFirebaseConfigured || !db) return null;

  const docId = buildDocId({ userId, studentCode, mode });
  if (!docId) return null;
  const docRef = doc(db, COLLECTION_NAME, docId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const saveWritingProgress = async ({ userId, studentCode, mode, data } = {}) => {
  if ((!userId && !studentCode) || !isFirebaseConfigured || !db) return false;

  const docId = buildDocId({ userId, studentCode, mode });
  if (!docId) return false;
  const docRef = doc(db, COLLECTION_NAME, docId);
  await setDoc(
    docRef,
    {
      ...data,
      userId,
      studentCode: studentCode || null,
      mode: mode || "course",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return true;
};
