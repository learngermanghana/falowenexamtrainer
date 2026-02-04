import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

const COLLECTION_NAME = "selfLearningProgress";

const normalizeOwnerKey = (value = "") => value.trim().toLowerCase();

const buildDocId = ({ userId, studentCode, level } = {}) => {
  const owner = normalizeOwnerKey(studentCode) || normalizeOwnerKey(userId);
  if (!owner) return "";
  const normalizedLevel = String(level || "").trim().toLowerCase();
  return `${owner}__${normalizedLevel || "unknown"}__selflearning`;
};

export const loadSelfLearningProgress = async ({ userId, studentCode, level } = {}) => {
  if ((!userId && !studentCode) || !isFirebaseConfigured || !db) return null;

  const docId = buildDocId({ userId, studentCode, level });
  if (!docId) return null;
  const docRef = doc(db, COLLECTION_NAME, docId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const saveSelfLearningProgress = async ({ userId, studentCode, level, data } = {}) => {
  if ((!userId && !studentCode) || !isFirebaseConfigured || !db) return false;

  const docId = buildDocId({ userId, studentCode, level });
  if (!docId) return false;
  const docRef = doc(db, COLLECTION_NAME, docId);
  await setDoc(
    docRef,
    {
      ...data,
      userId,
      studentCode: studentCode || null,
      level: level || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return true;
};
